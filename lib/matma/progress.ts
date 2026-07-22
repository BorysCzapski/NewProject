// ============================================================================
// lib/matma/progress.ts
// The adaptive engine behind "ścieżka nauki": per-topic mastery scoring,
// difficulty-tier gating (1 -> 2 -> 3, each gated at MIN_MASTERY_THRESHOLD
// so a weak topic can't be dragged along by a strong one) and the
// recommended-topic-order roadmap. Computed on demand from
// math_problem_attempts + math_problems, same on-the-fly pattern as
// lib/learning-path/progress.ts and lib/vocabulary/progress.ts — no
// per-lesson progress table needed.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { MIN_MASTERY_THRESHOLD } from "@/lib/constants";
import type { MasteryStatus, MathProblem, MathTopic, MathTopicProgress } from "@/lib/types/database";

const DIFFICULTY_WEIGHT: Record<1 | 2 | 3, number> = { 1: 1, 2: 1.5, 3: 2 };
/** Minimum distinct problems attempted at a tier before it can gate the next one open. */
const MIN_SAMPLE_FOR_GATE = 3;

interface LatestAttemptInfo {
  ratio: number; // points_awarded / points_max, clamped 0-1
  difficulty: 1 | 2 | 3;
  attemptedAt: string;
}

/** Fetches, per problem, the STUDENT'S MOST RECENT attempt (not best-ever) —
 * deliberately, so a topic that slips after a while (spaced-review failure)
 * shows up as regressed instead of permanently "mastered" from one good day. */
async function getLatestAttemptsByProblem(
  supabase: SupabaseClient,
  userId: string,
  topicId: string
): Promise<Map<string, LatestAttemptInfo>> {
  const { data } = await supabase
    .from("math_problem_attempts")
    .select("problem_id, points_awarded, attempted_at, math_problems!inner(topic_id, points_max, difficulty)")
    .eq("user_id", userId)
    .eq("math_problems.topic_id", topicId)
    .order("attempted_at", { ascending: false });

  const rows = (data ?? []) as unknown as Array<{
    problem_id: string;
    points_awarded: number | null;
    attempted_at: string;
    math_problems: { topic_id: string; points_max: number; difficulty: 1 | 2 | 3 };
  }>;

  const latest = new Map<string, LatestAttemptInfo>();
  for (const row of rows) {
    if (latest.has(row.problem_id)) continue; // already-newer row seen (desc order)
    const max = row.math_problems.points_max;
    const ratio = max > 0 ? Math.max(0, Math.min(1, (row.points_awarded ?? 0) / max)) : 0;
    latest.set(row.problem_id, { ratio, difficulty: row.math_problems.difficulty, attemptedAt: row.attempted_at });
  }
  return latest;
}

export function computeTopicMasteryScore(
  problems: Pick<MathProblem, "id" | "difficulty">[],
  latestByProblem: Map<string, LatestAttemptInfo>
): number {
  if (problems.length === 0) return 0;
  let earned = 0;
  let possible = 0;
  for (const p of problems) {
    const w = DIFFICULTY_WEIGHT[p.difficulty];
    possible += w;
    const attempt = latestByProblem.get(p.id);
    if (attempt) earned += w * attempt.ratio;
  }
  return possible > 0 ? Math.round((earned / possible) * 100) : 0;
}

function deriveStatus(masteryScore: number, hasAnyAttempt: boolean): MasteryStatus {
  if (masteryScore >= MIN_MASTERY_THRESHOLD * 100) return "mastered";
  return hasAnyAttempt ? "learning" : "new";
}

/** Recomputes and upserts math_topic_progress for one user+topic from their
 * attempt history. Call after grading any attempt in that topic. */
export async function recomputeTopicProgress(
  supabase: SupabaseClient,
  userId: string,
  topicId: string,
  opts?: { diagnosed?: boolean }
): Promise<MathTopicProgress> {
  const [{ data: problems }, latestByProblem] = await Promise.all([
    supabase.from("math_problems").select("id, difficulty").eq("topic_id", topicId),
    getLatestAttemptsByProblem(supabase, userId, topicId),
  ]);

  const problemRows = (problems ?? []) as Pick<MathProblem, "id" | "difficulty">[];
  const masteryScore = computeTopicMasteryScore(problemRows, latestByProblem);
  const status = deriveStatus(masteryScore, latestByProblem.size > 0);

  const { data: existing } = await supabase
    .from("math_topic_progress")
    .select("diagnosed_at")
    .eq("user_id", userId)
    .eq("topic_id", topicId)
    .maybeSingle();

  const { data: upserted } = await supabase
    .from("math_topic_progress")
    .upsert(
      {
        user_id: userId,
        topic_id: topicId,
        status,
        mastery_score: masteryScore,
        diagnosed_at: opts?.diagnosed ? new Date().toISOString() : (existing?.diagnosed_at ?? null),
      },
      { onConflict: "user_id,topic_id" }
    )
    .select("*")
    .single();

  return upserted as MathTopicProgress;
}

/** Marks a topic as reviewed just now (spaced-repetition check-in), without
 * recomputing mastery (the caller should recompute right after grading the
 * review attempt — this just stamps last_reviewed_at). */
export async function markTopicReviewed(supabase: SupabaseClient, userId: string, topicId: string): Promise<void> {
  await supabase
    .from("math_topic_progress")
    .upsert(
      { user_id: userId, topic_id: topicId, last_reviewed_at: new Date().toISOString() },
      { onConflict: "user_id,topic_id" }
    );
}

export async function getAllTopicProgress(
  supabase: SupabaseClient,
  userId: string
): Promise<MathTopicProgress[]> {
  const { data } = await supabase.from("math_topic_progress").select("*").eq("user_id", userId);
  return (data ?? []) as MathTopicProgress[];
}

/**
 * The difficulty-tier gate within one topic: level 1 is always open; level 2
 * opens once the student has a passing (>=MIN_MASTERY_THRESHOLD) recent-
 * correctness ratio across at least MIN_SAMPLE_FOR_GATE distinct level-1
 * problems; level 3 opens the same way from level 2. This is what keeps the
 * curve "1 -> 2 -> 3 małymi krokami" and stops a strong topic from rushing
 * a student who hasn't actually earned the next tier.
 */
export async function getUnlockedDifficulty(
  supabase: SupabaseClient,
  userId: string,
  topicId: string
): Promise<1 | 2 | 3> {
  const latestByProblem = await getLatestAttemptsByProblem(supabase, userId, topicId);
  const byTier: Record<1 | 2 | 3, LatestAttemptInfo[]> = { 1: [], 2: [], 3: [] };
  for (const attempt of latestByProblem.values()) byTier[attempt.difficulty].push(attempt);

  const passes = (tier: LatestAttemptInfo[]) => {
    if (tier.length < MIN_SAMPLE_FOR_GATE) return false;
    const avg = tier.reduce((sum, a) => sum + a.ratio, 0) / tier.length;
    return avg >= MIN_MASTERY_THRESHOLD;
  };

  if (!passes(byTier[1])) return 1;
  if (!passes(byTier[2])) return 2;
  return 3;
}

export interface TopicWithProgress extends MathTopic {
  status: MasteryStatus;
  masteryScore: number;
  unlockedDifficulty: 1 | 2 | 3;
}

/** All topics annotated with this student's progress — the data source for
 * both the dashboard department bars and the "current stage" roadmap. */
export async function getTopicsWithProgress(
  supabase: SupabaseClient,
  userId: string
): Promise<TopicWithProgress[]> {
  const [topicsRes, progressRows] = await Promise.all([
    supabase.from("math_topics").select("*").order("order_index"),
    getAllTopicProgress(supabase, userId),
  ]);
  const topics = (topicsRes.data ?? []) as MathTopic[];
  const progressByTopic = new Map(progressRows.map((p) => [p.topic_id, p]));

  return Promise.all(
    topics.map(async (topic) => {
      const progress = progressByTopic.get(topic.id);
      const unlockedDifficulty = await getUnlockedDifficulty(supabase, userId, topic.id);
      return {
        ...topic,
        status: progress?.status ?? "new",
        masteryScore: progress?.mastery_score ?? 0,
        unlockedDifficulty,
      };
    })
  );
}

/** Recommended next topic to focus on: the first (by order_index) topic that
 * isn't yet mastered — purely a dashboard/study-plan suggestion, never a
 * hard lock (unlike Linguo's single vocabulary path, math departments don't
 * force strict prerequisites on each other). */
export function getRecommendedTopic(topics: TopicWithProgress[]): TopicWithProgress | null {
  return topics.find((t) => t.status !== "mastered") ?? topics[0] ?? null;
}

export function getWeakestTopics(topics: TopicWithProgress[], count = 3): TopicWithProgress[] {
  return [...topics].sort((a, b) => a.masteryScore - b.masteryScore).slice(0, count);
}
