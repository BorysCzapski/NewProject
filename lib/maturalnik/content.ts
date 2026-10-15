// ============================================================================
// lib/maturalnik/content.ts
// Server-only read helpers over the shared content tables (maturalnik_
// chapters, maturalnik_problems). No auth checks here — RLS already makes
// these tables select-true for any authenticated user; auth happens once, in
// the page via requireProfile(), same pattern as lib/matma/content.ts.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { MaturalnikChapter, MaturalnikProblem } from "@/lib/types/database";

export async function getChapters(supabase: SupabaseClient): Promise<MaturalnikChapter[]> {
  const { data } = await supabase.from("maturalnik_chapters").select("*").order("order_index");
  return (data ?? []) as MaturalnikChapter[];
}

export async function getChapterBySlug(supabase: SupabaseClient, slug: string): Promise<MaturalnikChapter | null> {
  const { data } = await supabase.from("maturalnik_chapters").select("*").eq("slug", slug).maybeSingle();
  return (data as MaturalnikChapter) ?? null;
}

export async function getProblemsByChapter(supabase: SupabaseClient, chapterId: string): Promise<MaturalnikProblem[]> {
  const { data } = await supabase
    .from("maturalnik_problems")
    .select("*")
    .eq("chapter_id", chapterId)
    .order("number");
  return (data ?? []) as MaturalnikProblem[];
}

export async function getProblemByChapterAndNumber(
  supabase: SupabaseClient,
  chapterId: string,
  number: number
): Promise<MaturalnikProblem | null> {
  const { data } = await supabase
    .from("maturalnik_problems")
    .select("*")
    .eq("chapter_id", chapterId)
    .eq("number", number)
    .maybeSingle();
  return (data as MaturalnikProblem) ?? null;
}

export async function getProblemById(supabase: SupabaseClient, id: string): Promise<MaturalnikProblem | null> {
  const { data } = await supabase.from("maturalnik_problems").select("*").eq("id", id).maybeSingle();
  return (data as MaturalnikProblem) ?? null;
}

/** Total problem count across every chapter — used for the overall progress bar. */
export async function countAllProblems(supabase: SupabaseClient): Promise<number> {
  const { count } = await supabase.from("maturalnik_problems").select("id", { count: "exact", head: true });
  return count ?? 0;
}
