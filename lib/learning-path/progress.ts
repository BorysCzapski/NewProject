// ============================================================================
// lib/learning-path/progress.ts
// Computes the "ścieżka nauki" roadmap for a user+level entirely on demand
// from vocabulary_progress and grammar_progress — no new per-user progress
// table, same on-the-fly pattern as lib/homework/progress.ts. A stage
// unlocks once the PREVIOUS stage's vocabulary category reaches the mastery
// threshold; the paired grammar topic is shown alongside each stage but
// does not gate unlocking (only vocabulary mastery does).
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { MIN_MASTERY_THRESHOLD } from "@/lib/constants";
import type { LearningPathStage, UserLevel } from "@/lib/types/database";

export type StageStatus = "completed" | "current" | "locked";

export interface LearningPathStageWithProgress extends LearningPathStage {
  status: StageStatus;
  masteredWords: number;
  totalWords: number;
  grammarTopicTitle: string | null;
  grammarTopicSlug: string | null;
  grammarSolved: number;
  grammarTotal: number;
}

export interface LearningPathResult {
  stages: LearningPathStageWithProgress[];
  currentStageIndex: number; // index into `stages`, or stages.length if the whole path is done
}

export async function getLearningPath(
  supabase: SupabaseClient,
  userId: string,
  level: UserLevel
): Promise<LearningPathResult> {
  const { data: stageRows } = await supabase
    .from("learning_path_stages")
    .select("*, grammar_topics(title, slug)")
    .eq("level", level)
    .order("order_index");

  const stages = (stageRows ?? []) as Array<
    LearningPathStage & { grammar_topics: { title: string; slug: string } | null }
  >;
  if (stages.length === 0) return { stages: [], currentStageIndex: 0 };

  const categories = stages.map((s) => s.category);
  const grammarTopicIds = stages.map((s) => s.grammar_topic_id).filter((id): id is string => !!id);

  const [{ data: wordRows }, { data: progressRows }, { data: grammarExerciseRows }, { data: grammarProgressRows }] =
    await Promise.all([
      supabase.from("vocabulary_words").select("id, category").eq("level", level).in("category", categories),
      supabase
        .from("vocabulary_progress")
        .select("word_id, status, vocabulary_words!inner(category)")
        .eq("user_id", userId)
        .eq("status", "mastered")
        .eq("vocabulary_words.level", level)
        .in("vocabulary_words.category", categories),
      grammarTopicIds.length > 0
        ? supabase.from("grammar_exercises").select("id, topic_id").in("topic_id", grammarTopicIds)
        : Promise.resolve({ data: [] }),
      grammarTopicIds.length > 0
        ? supabase
            .from("grammar_progress")
            .select("exercise_id, topic_id")
            .eq("user_id", userId)
            .eq("is_correct", true)
            .in("topic_id", grammarTopicIds)
        : Promise.resolve({ data: [] }),
    ]);

  const totalWordsByCategory = new Map<string, number>();
  for (const w of wordRows ?? []) {
    totalWordsByCategory.set(w.category, (totalWordsByCategory.get(w.category) ?? 0) + 1);
  }

  const masteredByCategory = new Map<string, number>();
  for (const p of (progressRows ?? []) as unknown as Array<{ vocabulary_words: { category: string } }>) {
    const category = p.vocabulary_words.category;
    masteredByCategory.set(category, (masteredByCategory.get(category) ?? 0) + 1);
  }

  const grammarTotalByTopic = new Map<string, number>();
  for (const e of grammarExerciseRows ?? []) {
    grammarTotalByTopic.set(e.topic_id, (grammarTotalByTopic.get(e.topic_id) ?? 0) + 1);
  }
  const grammarSolvedByTopic = new Map<string, Set<string>>();
  for (const g of (grammarProgressRows ?? []) as Array<{ exercise_id: string; topic_id: string }>) {
    if (!grammarSolvedByTopic.has(g.topic_id)) grammarSolvedByTopic.set(g.topic_id, new Set());
    grammarSolvedByTopic.get(g.topic_id)!.add(g.exercise_id);
  }

  let previousCompleted = true; // stage 0 is always reachable
  let currentStageIndex = stages.length;
  const result: LearningPathStageWithProgress[] = stages.map((stage, index) => {
    const totalWords = totalWordsByCategory.get(stage.category) ?? 0;
    const masteredWords = Math.min(masteredByCategory.get(stage.category) ?? 0, totalWords);
    const isCompleted = totalWords > 0 && masteredWords / totalWords >= MIN_MASTERY_THRESHOLD;

    const status: StageStatus = !previousCompleted ? "locked" : isCompleted ? "completed" : "current";
    if (status === "current" && currentStageIndex === stages.length) currentStageIndex = index;
    previousCompleted = isCompleted;

    const grammarTotal = stage.grammar_topic_id ? grammarTotalByTopic.get(stage.grammar_topic_id) ?? 0 : 0;
    const grammarSolved = stage.grammar_topic_id
      ? grammarSolvedByTopic.get(stage.grammar_topic_id)?.size ?? 0
      : 0;

    return {
      ...stage,
      status,
      masteredWords,
      totalWords,
      grammarTopicTitle: stage.grammar_topics?.title ?? null,
      grammarTopicSlug: stage.grammar_topics?.slug ?? null,
      grammarSolved: Math.min(grammarSolved, grammarTotal),
      grammarTotal,
    };
  });

  return { stages: result, currentStageIndex };
}
