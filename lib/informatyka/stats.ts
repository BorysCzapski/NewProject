// ============================================================================
// lib/informatyka/stats.ts
// Numbers for the statistics page: points over time, per-topic coverage and
// accuracy, activity streak.
// ============================================================================
import "server-only";
import type { InformatykaProgress } from "@/lib/types/database";
import { addDays, dayKey, todayKey } from "@/lib/exam-dates";
import type { ProblemSummary } from "@/lib/informatyka/content";
import { KINDS, TOPICS } from "@/lib/informatyka/taxonomy";

export interface GroupStat {
  id: string;
  label: string;
  total: number;
  done: number;
  earned: number;
  possible: number;
  /** earned / possible over the problems already done (null until something is done). */
  accuracy: number | null;
  /** done / total. */
  coverage: number;
}

function groupStat(id: string, label: string, problems: ProblemSummary[], progress: Map<string, InformatykaProgress>): GroupStat {
  let done = 0;
  let earned = 0;
  let doneMax = 0;
  for (const p of problems) {
    const row = progress.get(p.id);
    if (row?.status === "done") {
      done += 1;
      earned += Number(row.score ?? 0);
      doneMax += p.points_max;
    }
  }
  return {
    id,
    label,
    total: problems.length,
    done,
    earned,
    possible: problems.reduce((s, p) => s + p.points_max, 0),
    accuracy: doneMax > 0 ? earned / doneMax : null,
    coverage: problems.length > 0 ? done / problems.length : 0,
  };
}

export function computeStats(problems: ProblemSummary[], progress: Map<string, InformatykaProgress>) {
  const byId = new Map(problems.map((p) => [p.id, p]));

  // points per day, then cumulative with gaps filled up to today
  const perDay = new Map<string, number>();
  for (const row of progress.values()) {
    if (row.status !== "done" || !row.done_at || !byId.has(row.problem_id)) continue;
    const key = dayKey(row.done_at);
    perDay.set(key, (perDay.get(key) ?? 0) + Number(row.score ?? 0));
  }
  const days = [...perDay.keys()].sort();
  const timeline: { day: string; points: number; cumulative: number }[] = [];
  if (days.length > 0) {
    const today = todayKey();
    let cumulative = 0;
    for (let day = days[0]; day <= today; day = addDays(day, 1)) {
      const points = perDay.get(day) ?? 0;
      cumulative += points;
      timeline.push({ day, points, cumulative });
    }
  }

  // streak: consecutive days with activity, ending today (or yesterday — today may still come)
  let streak = 0;
  const today = todayKey();
  let cursor = perDay.has(today) ? today : addDays(today, -1);
  while (perDay.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  const kinds = KINDS.map((k) => groupStat(k.id, k.label, problems.filter((p) => p.kind === k.id), progress));
  const topics = Object.entries(TOPICS)
    .map(([id, label]) => groupStat(id, label, problems.filter((p) => p.topic === id), progress))
    .filter((t) => t.total > 0);

  const overall = groupStat("all", "Razem", problems, progress);
  return { timeline, streak, kinds, topics, overall, activeDays: perDay.size };
}
