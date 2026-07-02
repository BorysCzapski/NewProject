// ============================================================================
// lib/homework/progress.ts
// Computes homework progress on demand from each module's own tables
// (activity_log, vocabulary_progress, reading_attempts, ...) instead of
// duplicating counters in application code. Called whenever the homework
// list is rendered (user view) or the admin "who completed what" view is
// opened; results are upserted into homework_progress so admins can query
// completion status directly too.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Homework, HomeworkStatus } from "@/lib/types/database";

export interface HomeworkWithProgress extends Homework {
  status: HomeworkStatus;
  progress_current: number;
  progress_target: number;
}

interface VocabularyMasteryConfig {
  category?: string;
  threshold?: number; // 0-1, defaults to MIN_MASTERY_THRESHOLD from lib/constants
}
interface TrainingCountConfig {
  module: "vocabulary" | "grammar" | "writing";
  count: number;
}
interface SimpleCountConfig {
  count: number;
}
interface GrammarTopicConfig {
  topic_id: string;
}
interface SongTranslationConfig {
  song_id: string;
}
interface ListeningTaskConfig {
  exercise_id: string;
}

async function computeProgress(
  supabase: SupabaseClient,
  userId: string,
  hw: Homework
): Promise<{ current: number; target: number }> {
  const since = hw.created_at;

  switch (hw.type) {
    case "vocabulary_mastery": {
      const cfg = hw.config as unknown as VocabularyMasteryConfig;
      let wordsQuery = supabase.from("vocabulary_words").select("id", { count: "exact", head: true });
      if (cfg.category) wordsQuery = wordsQuery.eq("category", cfg.category);
      const { count: totalWords } = await wordsQuery;

      let masteredQuery = supabase
        .from("vocabulary_progress")
        .select("id, vocabulary_words!inner(category)", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "mastered");
      if (cfg.category) masteredQuery = masteredQuery.eq("vocabulary_words.category", cfg.category);
      const { count: mastered } = await masteredQuery;

      const threshold = cfg.threshold ?? 0.8;
      const target = Math.max(1, Math.ceil((totalWords ?? 0) * threshold));
      return { current: Math.min(mastered ?? 0, target), target };
    }

    case "training_count": {
      const cfg = hw.config as unknown as TrainingCountConfig;
      const { count } = await supabase
        .from("activity_log")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("activity_type", cfg.module)
        .gte("created_at", since);
      return { current: Math.min(count ?? 0, cfg.count), target: cfg.count };
    }

    case "reading_count": {
      const cfg = hw.config as unknown as SimpleCountConfig;
      const { count } = await supabase
        .from("reading_attempts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("completed_at", since);
      return { current: Math.min(count ?? 0, cfg.count), target: cfg.count };
    }

    case "flashcards_count": {
      const cfg = hw.config as unknown as SimpleCountConfig;
      const { count } = await supabase
        .from("activity_log")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("activity_type", "flashcards")
        .gte("created_at", since);
      return { current: Math.min(count ?? 0, cfg.count), target: cfg.count };
    }

    case "grammar_topic": {
      const cfg = hw.config as unknown as GrammarTopicConfig;
      const { count: totalExercises } = await supabase
        .from("grammar_exercises")
        .select("id", { count: "exact", head: true })
        .eq("topic_id", cfg.topic_id);

      const { data: attempts } = await supabase
        .from("grammar_progress")
        .select("exercise_id")
        .eq("user_id", userId)
        .eq("topic_id", cfg.topic_id)
        .eq("is_correct", true);

      const solved = new Set((attempts ?? []).map((a) => a.exercise_id)).size;
      const target = totalExercises ?? 1;
      return { current: Math.min(solved, target), target };
    }

    case "writing_task": {
      const { count } = await supabase
        .from("writing_submissions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", since);
      return { current: Math.min(count ?? 0, 1), target: 1 };
    }

    case "song_translation": {
      const cfg = hw.config as unknown as SongTranslationConfig;
      const { data: song } = await supabase
        .from("songs")
        .select("lyrics")
        .eq("id", cfg.song_id)
        .single();
      const totalLines = song?.lyrics
        ? song.lyrics.split("\n").filter((l: string) => l.trim().length > 0).length
        : 1;

      const { data: attempts } = await supabase
        .from("song_translation_attempts")
        .select("line_index")
        .eq("user_id", userId)
        .eq("song_id", cfg.song_id)
        .eq("is_correct", true);
      const solvedLines = new Set((attempts ?? []).map((a) => a.line_index)).size;
      return { current: Math.min(solvedLines, totalLines), target: totalLines };
    }

    case "listening_task": {
      const cfg = hw.config as unknown as ListeningTaskConfig;
      const { count } = await supabase
        .from("listening_attempts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("exercise_id", cfg.exercise_id);
      return { current: Math.min(count ?? 0, 1), target: 1 };
    }

    default:
      return { current: 0, target: 1 };
  }
}

function statusFor(current: number, target: number, deadline: string | null): HomeworkStatus {
  if (current >= target) return "completed";
  if (deadline && new Date(deadline) < new Date()) return "overdue";
  if (current > 0) return "in_progress";
  return "todo";
}

/**
 * Loads all homework visible to `level`, computes each item's live progress
 * for `userId`, and upserts the result into homework_progress so admins can
 * read completion status without recomputing it themselves.
 */
export async function getHomeworkWithProgress(
  supabase: SupabaseClient,
  userId: string,
  level: string
): Promise<HomeworkWithProgress[]> {
  const { data: homeworkList } = await supabase
    .from("homework")
    .select("*")
    .contains("levels", [level])
    .order("deadline", { ascending: true, nullsFirst: false });

  if (!homeworkList || homeworkList.length === 0) return [];

  const results: HomeworkWithProgress[] = [];
  const upserts: Array<{
    homework_id: string;
    user_id: string;
    status: HomeworkStatus;
    progress_current: number;
    progress_target: number;
    completed_at: string | null;
  }> = [];

  for (const hw of homeworkList as Homework[]) {
    const { current, target } = await computeProgress(supabase, userId, hw);
    const status = statusFor(current, target, hw.deadline);
    results.push({ ...hw, status, progress_current: current, progress_target: target });
    upserts.push({
      homework_id: hw.id,
      user_id: userId,
      status,
      progress_current: current,
      progress_target: target,
      completed_at: status === "completed" ? new Date().toISOString() : null,
    });
  }

  await supabase.from("homework_progress").upsert(upserts, { onConflict: "homework_id,user_id" });

  return results;
}
