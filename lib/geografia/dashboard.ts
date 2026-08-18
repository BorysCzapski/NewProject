import "server-only";

// ============================================================================
// lib/geografia/dashboard.ts
// "Szacowany poziom opanowania materiału": a plain (unweighted) average of
// mastery across topics that have at least one exercise — unlike Matma,
// there's no official or admin-tunable per-topic exam-weight distribution
// to lean on here (CKE doesn't publish one for geography either), so this
// intentionally stays a simple average rather than inventing weights. Plus
// the trend-snapshot read/write pair behind the dashboard's progress chart.
// ============================================================================
import type { SupabaseClient } from "@supabase/supabase-js";
import type { TopicWithProgress } from "@/lib/geografia/progress";
import type { GeoProgressSnapshot } from "@/lib/types/database";

export function computeEstimatedPercent(topics: TopicWithProgress[]): number {
  const withExercises = topics.filter((t) => t.exerciseCount > 0);
  if (withExercises.length === 0) return 0;
  const total = withExercises.reduce((sum, t) => sum + t.masteryScore, 0);
  return Math.round(total / withExercises.length);
}

export async function writeProgressSnapshot(
  supabase: SupabaseClient,
  userId: string,
  topics: TopicWithProgress[]
): Promise<void> {
  const percent = computeEstimatedPercent(topics);
  const topicBreakdown: Record<string, number> = {};
  for (const t of topics) topicBreakdown[t.id] = t.masteryScore;

  await supabase.from("geo_progress_snapshots").insert({
    user_id: userId,
    estimated_percent: percent,
    topic_breakdown: topicBreakdown,
  });
}

/** Writes at most one snapshot per calendar day (UTC) — called after every
 * graded attempt (lib/geografia/actions.ts) so the trend chart builds up
 * from ordinary practice, not just from a big exam event like Matma's
 * mock-exam-triggered snapshots. Cheap guard: one extra select before the
 * insert, worth it to avoid a snapshot row per single answered question. */
export async function maybeWriteDailySnapshot(
  supabase: SupabaseClient,
  userId: string,
  topics: TopicWithProgress[]
): Promise<void> {
  const todayKey = new Date().toISOString().slice(0, 10);
  const { data: latest } = await supabase
    .from("geo_progress_snapshots")
    .select("snapshot_at")
    .eq("user_id", userId)
    .order("snapshot_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latest && (latest.snapshot_at as string).slice(0, 10) === todayKey) return;
  await writeProgressSnapshot(supabase, userId, topics);
}

export async function getProgressTrend(
  supabase: SupabaseClient,
  userId: string,
  limit = 30
): Promise<GeoProgressSnapshot[]> {
  const { data } = await supabase
    .from("geo_progress_snapshots")
    .select("*")
    .eq("user_id", userId)
    .order("snapshot_at", { ascending: true })
    .limit(limit);
  return (data ?? []) as GeoProgressSnapshot[];
}
