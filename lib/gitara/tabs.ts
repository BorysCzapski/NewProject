// ============================================================================
// lib/gitara/tabs.ts
// Read-side queries for tab songs (gtr_tabs). The list query leaves out the
// bulky `bars` column.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { GtrTab } from "@/lib/types/database";

export type GtrTabSummary = Omit<GtrTab, "bars">;

export async function getTabs(supabase: SupabaseClient): Promise<GtrTabSummary[]> {
  const { data } = await supabase
    .from("gtr_tabs")
    .select("id, slug, title, artist, arranger, capo, tempo, tuning, note, source_file, bar_count, created_by, created_at")
    .order("title");
  return (data ?? []) as GtrTabSummary[];
}

export async function getTabBySlug(supabase: SupabaseClient, slug: string): Promise<GtrTab | null> {
  const { data } = await supabase.from("gtr_tabs").select("*").eq("slug", slug).maybeSingle();
  return (data as GtrTab | null) ?? null;
}
