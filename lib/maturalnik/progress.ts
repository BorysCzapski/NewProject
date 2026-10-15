// ============================================================================
// lib/maturalnik/progress.ts
// Per-user progress reads over maturalnik_progress. Writes live in
// lib/maturalnik/actions.ts (Server Actions), same split as
// lib/matma/{content,progress}.ts.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { MaturalnikProgress } from "@/lib/types/database";

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

const HEATMAP_LOOKBACK_WEEKS = 20;

/** Problems-done-per-day from ~20 weeks before today through `examDate`
 * (inclusive, "YYYY-MM-DD"), for the exam-countdown heatmap. Keyed by date
 * string. The lookback window is computed here (not by the caller) so a
 * Server Component rendering the heatmap never calls Date.now() itself —
 * React's purity lint flags impure calls directly in component bodies. */
export async function getDailyActivityCounts(
  supabase: SupabaseClient,
  userId: string,
  examDate: string
): Promise<Map<string, number>> {
  const fromDate = new Date(Date.now() - HEATMAP_LOOKBACK_WEEKS * 7 * 86_400_000).toISOString().slice(0, 10);
  const { data } = await supabase
    .from("maturalnik_progress")
    .select("done_at")
    .eq("user_id", userId)
    .not("done_at", "is", null)
    .gte("done_at", `${fromDate}T00:00:00`)
    .lte("done_at", `${examDate}T23:59:59`);

  const counts = new Map<string, number>();
  for (const row of (data ?? []) as { done_at: string }[]) {
    const day = row.done_at.slice(0, 10);
    counts.set(day, (counts.get(day) ?? 0) + 1);
  }
  return counts;
}
