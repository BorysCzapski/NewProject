// ============================================================================
// lib/matma/mock-exam.ts
// Pure helpers for the full-exam simulator: picking a CKE-shaped problem set
// (10-14 problems, weighted by math_topics.exam_weight, targeting ~50 pts)
// and aggregating a graded set into a per-topic breakdown. Orchestration
// (grading each answer, writing rows) lives in lib/matma/actions.ts, which
// is the part that actually touches the database.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { MathMockExamBreakdownEntry, MathProblem } from "@/lib/types/database";

export const EXAM_MAX_POINTS = 50;
export const EXAM_MIN_PROBLEMS = 10;
export const EXAM_MAX_PROBLEMS = 14;
export const EXAM_TIME_LIMIT_SECONDS = 10800; // 180 min — CKE poziom rozszerzony

type ExamProblemRow = Pick<MathProblem, "id" | "topic_id" | "points_max" | "difficulty">;

/** Efraimidis-Spirakis weighted-random-sample-without-replacement ordering:
 * higher weight => more likely to sort near the front, but never guaranteed. */
function weightedShuffle<T>(items: Array<{ item: T; weight: number }>): T[] {
  return items
    .map(({ item, weight }) => ({ item, key: Math.pow(Math.random(), 1 / Math.max(weight, 1e-6)) }))
    .sort((a, b) => b.key - a.key)
    .map((x) => x.item);
}

/**
 * Picks a problem set shaped like a real arkusz: 10-14 problems, total
 * points close to 50, topics sampled proportionally to exam_weight (never a
 * hard per-topic quota — real arkusze don't cover every topic every year
 * either, some show up in a wiązka, some skip a session entirely).
 */
export async function generateMockExamProblemSet(
  supabase: SupabaseClient
): Promise<{ problemIds: string[]; totalPoints: number }> {
  const [{ data: topicRows }, { data: problemRows }] = await Promise.all([
    supabase.from("math_topics").select("id, exam_weight"),
    supabase.from("math_problems").select("id, topic_id, points_max, difficulty"),
  ]);
  const topics = (topicRows ?? []) as { id: string; exam_weight: number }[];
  const problems = (problemRows ?? []) as ExamProblemRow[];
  if (problems.length === 0) return { problemIds: [], totalPoints: 0 };

  const weightByTopic = new Map(topics.map((t) => [t.id, t.exam_weight || 0.05]));
  const countByTopic = new Map<string, number>();
  for (const p of problems) countByTopic.set(p.topic_id, (countByTopic.get(p.topic_id) ?? 0) + 1);

  const weighted = problems.map((p) => ({
    item: p,
    weight: (weightByTopic.get(p.topic_id) ?? 0.05) / Math.max(1, countByTopic.get(p.topic_id) ?? 1),
  }));
  const ordered = weightedShuffle(weighted);

  const TARGET_MIN = 46;
  const HARD_MAX = 54;
  const selected: ExamProblemRow[] = [];
  const selectedIds = new Set<string>();
  let total = 0;

  for (const p of ordered) {
    if (selected.length >= EXAM_MAX_PROBLEMS) break;
    if (total >= TARGET_MIN && selected.length >= EXAM_MIN_PROBLEMS) break;
    if (total + p.points_max > HARD_MAX) continue;
    selected.push(p);
    selectedIds.add(p.id);
    total += p.points_max;
  }

  // Second pass: still short on count or points (small seed bank) — relax
  // the HARD_MAX guard and top up regardless of overshoot.
  if (selected.length < EXAM_MIN_PROBLEMS || total < TARGET_MIN) {
    for (const p of ordered) {
      if (selectedIds.has(p.id)) continue;
      if (selected.length >= EXAM_MAX_PROBLEMS) break;
      selected.push(p);
      selectedIds.add(p.id);
      total += p.points_max;
      if (selected.length >= EXAM_MIN_PROBLEMS && total >= TARGET_MIN) break;
    }
  }

  return { problemIds: selected.map((p) => p.id), totalPoints: total };
}

export interface GradedExamProblem {
  topicId: string;
  topicTitle: string;
  pointsAwarded: number;
  pointsMax: number;
}

export function aggregateExamBreakdown(graded: GradedExamProblem[]): MathMockExamBreakdownEntry[] {
  const byTopic = new Map<string, MathMockExamBreakdownEntry>();
  for (const g of graded) {
    const existing = byTopic.get(g.topicId);
    if (existing) {
      existing.points_awarded += g.pointsAwarded;
      existing.points_max += g.pointsMax;
    } else {
      byTopic.set(g.topicId, {
        topic_id: g.topicId,
        topic_title: g.topicTitle,
        points_awarded: g.pointsAwarded,
        points_max: g.pointsMax,
      });
    }
  }
  return [...byTopic.values()];
}
