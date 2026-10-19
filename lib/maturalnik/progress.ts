// ============================================================================
// lib/maturalnik/progress.ts
// Per-user progress reads over maturalnik_progress. Writes live in
// lib/maturalnik/actions.ts (Server Actions).
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { MaturalnikProgress } from "@/lib/types/database";
import { addDays, dayKey, type DailyActivity } from "@/lib/exam-dates";

export interface ProgressSummary {
  doneCount: number;
  totalCount: number;
}

export async function getProgressSummary(supabase: SupabaseClient, userId: string): Promise<ProgressSummary> {
  const [{ count: totalCount }, { count: doneCount }] = await Promise.all([
    supabase.from("maturalnik_problems").select("id", { count: "exact", head: true }),
    supabase
      .from("maturalnik_progress")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("done", true),
  ]);
  return { doneCount: doneCount ?? 0, totalCount: totalCount ?? 0 };
}

/** done/total per chapter, keyed by chapter_id — two flat queries (~612 rows
 * total, cheap) reduced client-side, instead of a fragile embedded-filter
 * join or one round trip per chapter. */
export async function getProgressByChapter(
  supabase: SupabaseClient,
  userId: string
): Promise<Map<string, { done: number; total: number }>> {
  const [{ data: problems }, { data: doneRows }] = await Promise.all([
    supabase.from("maturalnik_problems").select("id, chapter_id"),
    supabase.from("maturalnik_progress").select("problem_id").eq("user_id", userId).eq("done", true),
  ]);

  const chapterByProblem = new Map(
    ((problems ?? []) as { id: string; chapter_id: string }[]).map((p) => [p.id, p.chapter_id])
  );
  const doneProblemIds = new Set(((doneRows ?? []) as { problem_id: string }[]).map((r) => r.problem_id));

  const result = new Map<string, { done: number; total: number }>();
  for (const [problemId, chapterId] of chapterByProblem) {
    const bucket = result.get(chapterId) ?? { done: 0, total: 0 };
    bucket.total += 1;
    if (doneProblemIds.has(problemId)) bucket.done += 1;
    result.set(chapterId, bucket);
  }
  return result;
}

/** Progress rows for every problem in one chapter, keyed by problem_id —
 * one query to drive a whole chapter's checkbox list. */
export async function getProgressForChapterProblems(
  supabase: SupabaseClient,
  userId: string,
  problemIds: string[]
): Promise<Map<string, MaturalnikProgress>> {
  if (problemIds.length === 0) return new Map();
  const { data } = await supabase
    .from("maturalnik_progress")
    .select("*")
    .eq("user_id", userId)
    .in("problem_id", problemIds);
  return new Map(((data ?? []) as MaturalnikProgress[]).map((p) => [p.problem_id, p]));
}

export async function getProblemProgress(
  supabase: SupabaseClient,
  userId: string,
  problemId: string
): Promise<MaturalnikProgress | null> {
  const { data } = await supabase
    .from("maturalnik_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("problem_id", problemId)
    .maybeSingle();
  return (data as MaturalnikProgress) ?? null;
}

const HEATMAP_LOOKBACK_WEEKS = 52;

interface DoneRow {
  done_at: string;
  maturalnik_problems: {
    number: number;
    maturalnik_chapters: { number: number; slug: string } | { number: number; slug: string }[] | null;
  } | null;
}

/** Problems done per calendar day (in APP_TIME_ZONE, see lib/maturalnik/
 * dates.ts) from ~20 weeks back through `examDate`, each with the list of
 * problems so the heatmap can show WHAT was done on a clicked day, not just
 * how many. The lookback window is computed here (not by the caller) so a
 * Server Component never calls Date.now() itself — React's purity lint
 * flags impure calls directly in component bodies. Plain object (not Map)
 * because it's passed on to a Client Component. */
export async function getDailyActivity(
  supabase: SupabaseClient,
  userId: string,
  examDate: string
): Promise<Record<string, DailyActivity>> {
  const fromDate = new Date(Date.now() - HEATMAP_LOOKBACK_WEEKS * 7 * 86_400_000).toISOString().slice(0, 10);
  // Pad a day on both sides: the stored timestamps are UTC, the buckets are
  // Warsaw days, so a boundary day's rows can sit just outside a UTC-exact range.
  const { data } = await supabase
    .from("maturalnik_progress")
    .select("done_at, maturalnik_problems(number, maturalnik_chapters(number, slug))")
    .eq("user_id", userId)
    .not("done_at", "is", null)
    .gte("done_at", `${addDays(fromDate, -1)}T00:00:00Z`)
    .lte("done_at", `${addDays(examDate, 1)}T23:59:59Z`)
    .order("done_at");

  const activity: Record<string, DailyActivity> = {};
  for (const row of (data ?? []) as unknown as DoneRow[]) {
    const day = dayKey(row.done_at);
    const bucket = (activity[day] ??= { count: 0, items: [] });
    bucket.count += 1;
    const problem = row.maturalnik_problems;
    const chapter = Array.isArray(problem?.maturalnik_chapters)
      ? problem?.maturalnik_chapters[0]
      : problem?.maturalnik_chapters;
    if (problem && chapter) {
      bucket.items.push({
        label: `Zadanie ${chapter.number}.${problem.number}`,
        href: `/maturalnik/${chapter.slug}/${problem.number}`,
      });
    }
  }
  return activity;
}
