// ============================================================================
// lib/algorytmy/exercise-stock.ts
// The practice queue for Algorytmy: how many exercises of each type the
// student has done, which one to hand out next, and keeping enough unseen ones
// in the bank that "next" is never a repeat.
//
// Structurally identical to lib/matura/task-stock.ts — deliberately, since
// both implement the same idea and a reader who has seen one should recognise
// the other. Everything here is simpler because every exercise is a single
// question with a single correct option, so there is no per-item bookkeeping.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { generateExercises } from "@/lib/algorytmy/generate";
import { ALGO_TASK_TYPES, type AlgoTaskTypeDef } from "@/lib/algorytmy/task-types";
import type { AlgoTopic } from "@/lib/types/database";

const STOCK_TARGET = 4;
const TOP_UP_BATCH = 3;

export interface AlgoTypeStats {
  typeDef: AlgoTaskTypeDef;
  completedCount: number;
  correctCount: number;
  /** Rounded share of correct answers, null before the first attempt. */
  accuracyPercent: number | null;
  freshAvailable: number;
}

interface AttemptRow {
  exercise_id: string;
  is_correct: boolean;
  attempted_at: string;
  algo_exercises: { task_type: string } | null;
}

export async function getTypeStats(
  supabase: SupabaseClient,
  userId: string,
  topicId: string
): Promise<AlgoTypeStats[]> {
  const [{ data: attemptRows }, { data: exerciseRows }] = await Promise.all([
    supabase
      .from("algo_exercise_attempts")
      .select("exercise_id, is_correct, attempted_at, algo_exercises!inner(task_type, topic_id)")
      .eq("user_id", userId)
      .eq("algo_exercises.topic_id", topicId)
      .order("attempted_at", { ascending: false }),
    supabase.from("algo_exercises").select("id, task_type").eq("topic_id", topicId),
  ]);

  const attempts = (attemptRows ?? []) as unknown as AttemptRow[];
  const exercises = (exerciseRows ?? []) as Array<{ id: string; task_type: string }>;
  const attemptedIds = new Set(attempts.map((a) => a.exercise_id));

  return ALGO_TASK_TYPES.map((typeDef) => {
    const own = attempts.filter((a) => a.algo_exercises?.task_type === typeDef.slug);
    const correct = own.filter((a) => a.is_correct).length;
    return {
      typeDef,
      completedCount: own.length,
      correctCount: correct,
      accuracyPercent: own.length > 0 ? Math.round((correct / own.length) * 100) : null,
      freshAvailable: exercises.filter(
        (e) => e.task_type === typeDef.slug && !attemptedIds.has(e.id)
      ).length,
    };
  });
}

async function splitByFreshness(
  supabase: SupabaseClient,
  userId: string,
  topicId: string,
  taskType: string
): Promise<{ fresh: string[]; seen: Array<{ id: string; attemptedAt: string }> }> {
  const { data: exerciseRows } = await supabase
    .from("algo_exercises")
    .select("id")
    .eq("topic_id", topicId)
    .eq("task_type", taskType);

  const ids = (exerciseRows ?? []).map((e) => (e as { id: string }).id);
  if (ids.length === 0) return { fresh: [], seen: [] };

  const { data: attemptRows } = await supabase
    .from("algo_exercise_attempts")
    .select("exercise_id, attempted_at")
    .eq("user_id", userId)
    .in("exercise_id", ids)
    .order("attempted_at", { ascending: false });

  const latest = new Map<string, string>();
  for (const row of (attemptRows ?? []) as Array<{ exercise_id: string; attempted_at: string }>) {
    if (!latest.has(row.exercise_id)) latest.set(row.exercise_id, row.attempted_at);
  }

  return {
    fresh: ids.filter((id) => !latest.has(id)),
    seen: ids
      .filter((id) => latest.has(id))
      .map((id) => ({ id, attemptedAt: latest.get(id)! }))
      .sort((a, b) => a.attemptedAt.localeCompare(b.attemptedAt)),
  };
}

function pickRandom<T>(values: T[]): T {
  return values[Math.floor(Math.random() * values.length)];
}

/** Background refill — safe to call on every hand-out; returns immediately
 * when the queue is already deep enough. */
export async function topUpStock(params: {
  supabase: SupabaseClient;
  userId: string;
  topic: AlgoTopic;
  typeDef: AlgoTaskTypeDef;
}): Promise<void> {
  const { supabase, userId, topic, typeDef } = params;
  const { fresh } = await splitByFreshness(supabase, userId, topic.id, typeDef.slug);
  const missing = Math.min(TOP_UP_BATCH, STOCK_TARGET - fresh.length);
  if (missing <= 0) return;
  await generateExercises({ supabase, topic, typeDef, userId, count: missing });
}

/**
 * Hands out the next exercise of a type: an unseen one at random, else one
 * generated now, else the one answered longest ago. Returns null only when
 * generation failed AND the bank is empty — the caller shows that as "wróć tu
 * za chwilę" rather than an error, because a failed model call is temporary.
 */
export async function pickExerciseForType(params: {
  supabase: SupabaseClient;
  userId: string;
  topic: AlgoTopic;
  typeDef: AlgoTaskTypeDef;
}): Promise<{ exerciseId: string; isRepeat: boolean } | null> {
  const { supabase, userId, topic, typeDef } = params;

  const { fresh, seen } = await splitByFreshness(supabase, userId, topic.id, typeDef.slug);
  if (fresh.length > 0) return { exerciseId: pickRandom(fresh), isRepeat: false };

  // Nothing unseen: generate now. This is the only place the student waits on
  // the model, and only because there is genuinely nothing else to show.
  const inserted = await generateExercises({ supabase, topic, typeDef, userId, count: TOP_UP_BATCH });
  if (inserted > 0) {
    const { fresh: refreshed } = await splitByFreshness(supabase, userId, topic.id, typeDef.slug);
    if (refreshed.length > 0) return { exerciseId: pickRandom(refreshed), isRepeat: false };
  }

  if (seen.length > 0) return { exerciseId: seen[0].id, isRepeat: true };
  return null;
}
