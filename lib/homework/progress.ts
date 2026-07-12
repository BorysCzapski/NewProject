// ============================================================================
// lib/homework/progress.ts
// Computes homework progress on demand from each module's own tables
// (activity_log, vocabulary_progress, reading_attempts, ...) instead of
// duplicating counters in application code. Called whenever the homework
// list is rendered (user view) or the admin "who completed what" view is
// opened; results are upserted into homework_progress so admins can query
// completion status directly too.
//
// A student sees homework that is EITHER assigned to their whole level in
// their language (target_user_id null) OR assigned to them personally
// (target_user_id = their id). Admins receive no homework at all.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Homework,
  HomeworkStatus,
  TargetLanguage,
  UserLevel,
  UserRole,
} from "@/lib/types/database";

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
interface WritingTaskConfig {
  task_id?: string; // if set, only a submission for this specific task counts
}
interface SongTranslationConfig {
  song_id: string;
}
interface ListeningTaskConfig {
  exercise_id: string;
}
interface MatchingGameConfig {
  count: number;
  category?: string;
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
      // Scope by the homework's language, otherwise a category name shared
      // across languages (e.g. "jedzenie") would double-count.
      let wordsQuery = supabase
        .from("vocabulary_words")
        .select("id", { count: "exact", head: true })
        .eq("language", hw.language);
      if (cfg.category) wordsQuery = wordsQuery.eq("category", cfg.category);
      const { count: totalWords } = await wordsQuery;

      let masteredQuery = supabase
        .from("vocabulary_progress")
        .select("id, vocabulary_words!inner(category, language)", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "mastered")
        .eq("vocabulary_words.language", hw.language);
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
      const cfg = hw.config as unknown as WritingTaskConfig;
      let query = supabase
        .from("writing_submissions")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", since);
      if (cfg.task_id) query = query.eq("task_id", cfg.task_id);
      const { count } = await query;
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

    case "matching_game": {
      const cfg = hw.config as unknown as MatchingGameConfig;
      const target = cfg.count && cfg.count > 0 ? cfg.count : 1;
      let query = supabase
        .from("matching_attempts")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("language", hw.language)
        .gte("completed_at", since);
      if (cfg.category) query = query.eq("category", cfg.category);
      const { count } = await query;
      return { current: Math.min(count ?? 0, target), target };
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

export interface HomeworkAudience {
  userId: string;
  level: UserLevel;
  language: TargetLanguage;
  role: UserRole;
}

/**
 * Loads the homework visible to this student — level-wide items in their
 * language plus items assigned to them personally — computes each item's live
 * progress, and upserts the result into homework_progress. Admins get an empty
 * list (they assign homework, they don't receive it).
 */
export async function getHomeworkWithProgress(
  supabase: SupabaseClient,
  audience: HomeworkAudience
): Promise<HomeworkWithProgress[]> {
  if (audience.role === "admin") return [];

  const { userId, level, language } = audience;

  // Two sources: level-wide (in this language, no personal target) + personal.
  const [{ data: levelWide }, { data: personal }] = await Promise.all([
    supabase
      .from("homework")
      .select("*")
      .eq("language", language)
      .is("target_user_id", null)
      .contains("levels", [level]),
    supabase.from("homework").select("*").eq("target_user_id", userId).eq("language", language),
  ]);

  const byId = new Map<string, Homework>();
  for (const hw of [...(levelWide ?? []), ...(personal ?? [])] as Homework[]) byId.set(hw.id, hw);
  const homeworkList = [...byId.values()].sort((a, b) => {
    // deadline ascending, nulls last, then newest first
    if (a.deadline && b.deadline) return a.deadline.localeCompare(b.deadline);
    if (a.deadline) return -1;
    if (b.deadline) return 1;
    return b.created_at.localeCompare(a.created_at);
  });

  if (homeworkList.length === 0) return [];

  // Needed so a re-render doesn't push completed_at forward to "now" every
  // time — only the actual transition into "completed" should stamp it.
  const { data: existingProgress } = await supabase
    .from("homework_progress")
    .select("homework_id, completed_at")
    .eq("user_id", userId)
    .in(
      "homework_id",
      homeworkList.map((hw) => hw.id)
    );
  const existingCompletedAt = new Map(
    (existingProgress ?? []).map((row) => [row.homework_id, row.completed_at as string | null])
  );

  const computed = await Promise.all(
    homeworkList.map(async (hw) => {
      const { current, target } = await computeProgress(supabase, userId, hw);
      const status = statusFor(current, target, hw.deadline);
      return { hw, status, current, target };
    })
  );

  const results: HomeworkWithProgress[] = computed.map(({ hw, status, current, target }) => ({
    ...hw,
    status,
    progress_current: current,
    progress_target: target,
  }));

  const upserts = computed.map(({ hw, status, current, target }) => ({
    homework_id: hw.id,
    user_id: userId,
    status,
    progress_current: current,
    progress_target: target,
    completed_at:
      status === "completed" ? existingCompletedAt.get(hw.id) ?? new Date().toISOString() : null,
  }));

  await supabase.from("homework_progress").upsert(upserts, { onConflict: "homework_id,user_id" });

  return results;
}
