// ============================================================================
// lib/matma/dashboard.ts
// "Szacowany wynik na maturze": a weighted average of per-topic mastery
// (weights = math_topics.exam_weight, an editable ADMIN APPROXIMATION, never
// a hardcoded CKE constant — see 0007_matma.sql), converted to a 0-50 point
// estimate, plus the trend-snapshot read/write pair behind the dashboard's
// progress-over-time chart.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { EXAM_MAX_POINTS } from "@/lib/matma/mock-exam";
import type { TopicWithProgress } from "@/lib/matma/progress";
import type { MathProgressSnapshot } from "@/lib/types/database";

export interface EstimatedScore {
  points: number; // 0-50
  percent: number; // 0-100
}

export function computeEstimatedScore(topics: TopicWithProgress[]): EstimatedScore {
  const totalWeight = topics.reduce((sum, t) => sum + t.exam_weight, 0) || 1;
  const weightedMastery =
    topics.reduce((sum, t) => sum + t.exam_weight * (t.masteryScore / 100), 0) / totalWeight;
  const percent = Math.round(weightedMastery * 100);
  const points = Math.round((percent / 100) * EXAM_MAX_POINTS);
  return { points, percent };
}

export async function writeProgressSnapshot(
  supabase: SupabaseClient,
  userId: string,
  topics: TopicWithProgress[]
): Promise<void> {
  const { points, percent } = computeEstimatedScore(topics);
  const topicBreakdown: Record<string, number> = {};
  for (const t of topics) topicBreakdown[t.id] = t.masteryScore;

  await supabase.from("math_progress_snapshots").insert({
    user_id: userId,
    estimated_score: points,
    estimated_percent: percent,
    topic_breakdown: topicBreakdown,
  });
}

export async function getProgressTrend(
  supabase: SupabaseClient,
  userId: string,
  limit = 30
): Promise<MathProgressSnapshot[]> {
  const { data } = await supabase
    .from("math_progress_snapshots")
    .select("*")
    .eq("user_id", userId)
    .order("snapshot_at", { ascending: true })
    .limit(limit);
  return (data ?? []) as MathProgressSnapshot[];
}
