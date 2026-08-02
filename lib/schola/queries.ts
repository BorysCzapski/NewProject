// ============================================================================
// lib/schola/queries.ts
// Read-only helpers for Schola pages (Server Components) — plain functions,
// not Server Actions, same shape as lib/matma/progress.ts / lib/paragony/
// queries.ts.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ScholaSong, ScholaMassPlan, ScholaMassPlanItem } from "@/lib/types/database";

export async function listScholaSongs(
  supabase: SupabaseClient,
  filters: { search?: string; tag?: string } = {}
): Promise<ScholaSong[]> {
  let query = supabase.from("schola_songs").select("*").order("title", { ascending: true });
  if (filters.search) query = query.ilike("title", `%${filters.search}%`);
  if (filters.tag) query = query.contains("tags", [filters.tag]);

  const { data, error } = await query;
  if (error) {
    console.error("[schola] listScholaSongs failed:", error);
    return [];
  }
  return (data ?? []) as ScholaSong[];
}

export async function getScholaSong(supabase: SupabaseClient, id: string): Promise<ScholaSong | null> {
  const { data, error } = await supabase.from("schola_songs").select("*").eq("id", id).maybeSingle();
  if (error) {
    console.error("[schola] getScholaSong failed:", error);
    return null;
  }
  return (data as ScholaSong) ?? null;
}

export async function listScholaMassPlans(supabase: SupabaseClient): Promise<ScholaMassPlan[]> {
  const { data, error } = await supabase
    .from("schola_mass_plans")
    .select("*")
    .order("mass_date", { ascending: false });
  if (error) {
    console.error("[schola] listScholaMassPlans failed:", error);
    return [];
  }
  return (data ?? []) as ScholaMassPlan[];
}

export interface MassPlanItemWithSong extends ScholaMassPlanItem {
  song: ScholaSong;
}

export interface MassPlanDetail {
  plan: ScholaMassPlan;
  items: MassPlanItemWithSong[];
}

export async function getScholaMassPlanDetail(
  supabase: SupabaseClient,
  planId: string
): Promise<MassPlanDetail | null> {
  const [{ data: plan }, { data: items }] = await Promise.all([
    supabase.from("schola_mass_plans").select("*").eq("id", planId).maybeSingle(),
    supabase
      .from("schola_mass_plan_items")
      .select("*, schola_songs(*)")
      .eq("plan_id", planId)
      .order("order_index", { ascending: true }),
  ]);

  if (!plan) return null;

  const mappedItems = ((items ?? []) as Array<ScholaMassPlanItem & { schola_songs: ScholaSong | null }>)
    .filter((item): item is ScholaMassPlanItem & { schola_songs: ScholaSong } => !!item.schola_songs)
    .map((item) => {
      const { schola_songs, ...rest } = item;
      return { ...rest, song: schola_songs };
    });

  return { plan: plan as ScholaMassPlan, items: mappedItems };
}
