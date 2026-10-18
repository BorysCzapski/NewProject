// ============================================================================
// lib/informatyka/review.ts
// Spaced repetition over solved problems. How soon a problem comes back depends
// on how well it went: <50% of the points → 2 days, partial → 5 days, full → 21.
// ============================================================================
import "server-only";
import type { InformatykaProgress } from "@/lib/types/database";
import { dayKey } from "@/lib/exam-dates";
import type { ProblemSummary } from "@/lib/informatyka/content";

export interface ReviewItem {
  problem: ProblemSummary;
  score: number;
  doneAt: string;
  /** Whole days until it is due; <= 0 means due now. */
  inDays: number;
}

const DAY_MS = 86_400_000;

function intervalDays(score: number, max: number): number {
  const ratio = max > 0 ? score / max : 1;
  if (ratio >= 1) return 21;
  if (ratio >= 0.5) return 5;
  return 2;
}

export function computeReview(problems: ProblemSummary[], progress: Map<string, InformatykaProgress>) {
  const now = Date.now();
  const items: ReviewItem[] = [];
  for (const problem of problems) {
    const row = progress.get(problem.id);
    if (row?.status !== "done" || !row.done_at) continue;
    const score = Number(row.score ?? 0);
    const dueAt = new Date(row.done_at).getTime() + intervalDays(score, problem.points_max) * DAY_MS;
    items.push({ problem, score, doneAt: row.done_at, inDays: Math.ceil((dueAt - now) / DAY_MS) });
  }
  const due = items.filter((i) => i.inDays <= 0).sort((a, b) => a.inDays - b.inDays || a.score / a.problem.points_max - b.score / b.problem.points_max);
  const upcoming = items.filter((i) => i.inDays > 0).sort((a, b) => a.inDays - b.inDays);
  return { due, upcoming, today: dayKey(new Date()) };
}
