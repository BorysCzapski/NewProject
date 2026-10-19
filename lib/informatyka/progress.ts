// ============================================================================
// lib/informatyka/progress.ts
// Per-user progress reads over informatyka_progress. Writes live in
// lib/informatyka/actions.ts.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { InformatykaProgress } from "@/lib/types/database";
import { addDays, dayKey, type DailyActivity } from "@/lib/exam-dates";
import { examShortLabel } from "@/lib/informatyka/taxonomy";
import type { ProblemSummary } from "@/lib/informatyka/content";

/** All of the user's progress rows keyed by problem id (one cheap query). */
export async function getProgressMap(
  supabase: SupabaseClient,
  userId: string
): Promise<Map<string, InformatykaProgress>> {
  const { data } = await supabase.from("informatyka_progress").select("*").eq("user_id", userId);
  return new Map(((data ?? []) as InformatykaProgress[]).map((p) => [p.problem_id, p]));
}

export async function getProblemProgress(
  supabase: SupabaseClient,
  userId: string,
  problemId: string
): Promise<InformatykaProgress | null> {
  const { data } = await supabase
    .from("informatyka_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("problem_id", problemId)
    .maybeSingle();
  return (data as InformatykaProgress | null) ?? null;
}

export interface Tally {
  earned: number;
  possible: number;
  done: number;
  total: number;
}

export function emptyTally(): Tally {
  return { earned: 0, possible: 0, done: 0, total: 0 };
}

/** Folds problems into a tally: possible = Σ points_max, earned = Σ self-scores of done ones. */
export function tally(problems: ProblemSummary[], progress: Map<string, InformatykaProgress>): Tally {
  const t = emptyTally();
  for (const p of problems) {
    t.total += 1;
    t.possible += p.points_max;
    const row = progress.get(p.id);
    if (row?.status === "done") {
      t.done += 1;
      t.earned += Number(row.score ?? 0);
    }
  }
  return t;
}

export function percent(t: Tally): number {
  return t.possible > 0 ? Math.round((t.earned / t.possible) * 100) : 0;
}

const HEATMAP_LOOKBACK_WEEKS = 52;

interface DoneRow {
  done_at: string;
  problem_id: string;
}

/** Problems finished per Warsaw calendar day, ~20 weeks back through `examDate`,
 * each linking to the problem. Plain object: it goes on to a Client Component. */
export async function getDailyActivity(
  supabase: SupabaseClient,
  userId: string,
  examDate: string,
  problems: ProblemSummary[]
): Promise<Record<string, DailyActivity>> {
  const fromDate = new Date(Date.now() - HEATMAP_LOOKBACK_WEEKS * 7 * 86_400_000).toISOString().slice(0, 10);
  const { data } = await supabase
    .from("informatyka_progress")
    .select("done_at, problem_id")
    .eq("user_id", userId)
    .eq("status", "done")
    .not("done_at", "is", null)
    .gte("done_at", `${addDays(fromDate, -1)}T00:00:00Z`)
    .lte("done_at", `${addDays(examDate, 1)}T23:59:59Z`)
    .order("done_at");

  const byId = new Map(problems.map((p) => [p.id, p]));
  const activity: Record<string, DailyActivity> = {};
  for (const row of (data ?? []) as DoneRow[]) {
    const day = dayKey(row.done_at);
    const bucket = (activity[day] ??= { count: 0, items: [] });
    bucket.count += 1;
    const problem = byId.get(row.problem_id);
    if (problem) {
      bucket.items.push({
        label: `${examShortLabel(problem.exam)} · zad. ${problem.label}`,
        href: `/informatyka/zadanie/${problem.id}`,
      });
    }
  }
  return activity;
}
