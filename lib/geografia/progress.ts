import "server-only";

// ============================================================================
// lib/geografia/progress.ts
// Per-topic mastery scoring, computed on demand from geo_exercise_attempts +
// geo_exercises — same "latest attempt, not best attempt" design as
// lib/matma/progress.ts, so a topic that goes stale after a while (a failed
// spaced-review check-in) shows up as regressed rather than permanently
// "mastered" from one good day. No difficulty-tier gating here (unlike
// Matma) — the product spec doesn't call for locking difficulty tiers, so
// every exercise in an unlocked topic is available from the start.
// ============================================================================
import type { SupabaseClient } from "@supabase/supabase-js";
import { MIN_MASTERY_THRESHOLD } from "@/lib/constants";
import type { GeoExercise, GeoTopic, GeoTopicProgress, MasteryStatus } from "@/lib/types/database";

const DIFFICULTY_WEIGHT: Record<1 | 2 | 3, number> = { 1: 1, 2: 1.5, 3: 2 };

interface LatestAttemptInfo {
  ratio: number; // points_awarded / points_max, clamped 0-1
  difficulty: 1 | 2 | 3;
}

async function getLatestAttemptsByExercise(
  supabase: SupabaseClient,
  userId: string,
  topicId: string
): Promise<Map<string, LatestAttemptInfo>> {
  const { data } = await supabase
    .from("geo_exercise_attempts")
    .select("exercise_id, points_awarded, points_max, attempted_at, geo_exercises!inner(topic_id, difficulty)")
    .eq("user_id", userId)
    .eq("geo_exercises.topic_id", topicId)
    .order("attempted_at", { ascending: false });

  const rows = (data ?? []) as unknown as Array<{
    exercise_id: string;
    points_awarded: number;
    points_max: number;
    geo_exercises: { topic_id: string; difficulty: 1 | 2 | 3 };
  }>;

  const latest = new Map<string, LatestAttemptInfo>();
  for (const row of rows) {
    if (latest.has(row.exercise_id)) continue; // already-newer row seen (desc order)
    const ratio = row.points_max > 0 ? Math.max(0, Math.min(1, row.points_awarded / row.points_max)) : 0;
    latest.set(row.exercise_id, { ratio, difficulty: row.geo_exercises.difficulty });
  }
  return latest;
}

export function computeTopicMasteryScore(
  exercises: Pick<GeoExercise, "id" | "difficulty">[],
  latestByExercise: Map<string, LatestAttemptInfo>
): number {
  if (exercises.length === 0) return 0;
  let earned = 0;
  let possible = 0;
  for (const e of exercises) {
    const w = DIFFICULTY_WEIGHT[e.difficulty];
    possible += w;
    const attempt = latestByExercise.get(e.id);
    if (attempt) earned += w * attempt.ratio;
  }
  return possible > 0 ? Math.round((earned / possible) * 100) : 0;
}

function deriveStatus(masteryScore: number, hasAnyAttempt: boolean): MasteryStatus {
  if (masteryScore >= MIN_MASTERY_THRESHOLD * 100) return "mastered";
  return hasAnyAttempt ? "learning" : "new";
}

/** Recomputes and upserts geo_topic_progress for one user+topic from their
 * attempt history. Call after grading/self-assessing any attempt in that topic. */
export async function recomputeTopicProgress(
  supabase: SupabaseClient,
  userId: string,
  topicId: string
): Promise<GeoTopicProgress> {
  const [{ data: exercises }, latestByExercise] = await Promise.all([
    supabase.from("geo_exercises").select("id, difficulty").eq("topic_id", topicId),
    getLatestAttemptsByExercise(supabase, userId, topicId),
  ]);

  const exerciseRows = (exercises ?? []) as Pick<GeoExercise, "id" | "difficulty">[];
  const masteryScore = computeTopicMasteryScore(exerciseRows, latestByExercise);
  const status = deriveStatus(masteryScore, latestByExercise.size > 0);

  const { data: upserted } = await supabase
    .from("geo_topic_progress")
    .upsert(
      {
        user_id: userId,
        topic_id: topicId,
        status,
        mastery_score: masteryScore,
        solved_count: latestByExercise.size,
      },
      { onConflict: "user_id,topic_id" }
    )
    .select("*")
    .single();

  return upserted as GeoTopicProgress;
}

/** Marks a topic as reviewed just now (spaced-repetition check-in) without
 * recomputing mastery — the caller recomputes right after grading the
 * review attempt, same split as lib/matma/progress.ts markTopicReviewed. */
export async function markTopicReviewed(supabase: SupabaseClient, userId: string, topicId: string): Promise<void> {
  await supabase
    .from("geo_topic_progress")
    .upsert(
      { user_id: userId, topic_id: topicId, last_reviewed_at: new Date().toISOString() },
      { onConflict: "user_id,topic_id" }
    );
}

export async function getAllTopicProgress(supabase: SupabaseClient, userId: string): Promise<GeoTopicProgress[]> {
  const { data } = await supabase.from("geo_topic_progress").select("*").eq("user_id", userId);
  return (data ?? []) as GeoTopicProgress[];
}

export interface TopicWithProgress extends GeoTopic {
  status: MasteryStatus;
  masteryScore: number;
  solvedCount: number;
  exerciseCount: number;
}

/** All topics annotated with this student's progress AND how many exercises
 * exist — the dashboard/topic-list data source, and what drives the "gdy
 * liczba ćwiczeń < 25" edge-case banner (see components/geografia/topic-list-item.tsx). */
export async function getTopicsWithProgress(supabase: SupabaseClient, userId: string): Promise<TopicWithProgress[]> {
  const [topicsRes, progressRows, countsRes] = await Promise.all([
    supabase.from("geo_topics").select("*").order("order_index"),
    getAllTopicProgress(supabase, userId),
    supabase.from("geo_exercises").select("topic_id"),
  ]);
  const topics = (topicsRes.data ?? []) as GeoTopic[];
  const progressByTopic = new Map(progressRows.map((p) => [p.topic_id, p]));

  const countByTopic = new Map<string, number>();
  for (const row of (countsRes.data ?? []) as Array<{ topic_id: string }>) {
    countByTopic.set(row.topic_id, (countByTopic.get(row.topic_id) ?? 0) + 1);
  }

  return topics.map((topic) => {
    const progress = progressByTopic.get(topic.id);
    return {
      ...topic,
      status: progress?.status ?? "new",
      masteryScore: progress?.mastery_score ?? 0,
      solvedCount: progress?.solved_count ?? 0,
      exerciseCount: countByTopic.get(topic.id) ?? 0,
    };
  });
}

export function getWeakestTopics(topics: TopicWithProgress[], count = 3): TopicWithProgress[] {
  return [...topics].filter((t) => t.exerciseCount > 0).sort((a, b) => a.masteryScore - b.masteryScore).slice(0, count);
}
