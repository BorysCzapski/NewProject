"use server";
// ============================================================================
// lib/schola/mass-plan-actions.ts
// Mass planning CRUD: a plan is an ordered list of songs for one Mass/date,
// each with an optional free-text note ("2x refren, 1x zwrotka"). Any
// Schola member can edit any plan — no per-row ownership (0009_schola.sql).
// ============================================================================
import { revalidatePath } from "next/cache";
import { requireScholaMember } from "@/lib/schola/get-member";
import { createClient } from "@/lib/supabase/server";
import { actionFailure, type ActionResult } from "@/lib/action-result";

export interface MassPlanInput {
  title: string;
  massDate: string;
  notes: string;
}

function revalidatePlans(planId?: string) {
  revalidatePath("/schola/msze");
  revalidatePath("/schola");
  if (planId) revalidatePath(`/schola/msze/${planId}`);
}

export async function createMassPlan(input: MassPlanInput): Promise<ActionResult<{ id: string }>> {
  const member = await requireScholaMember();

  if (!input.title.trim()) return actionFailure("Podaj nazwę planu.");
  if (!input.massDate) return actionFailure("Podaj datę Mszy.");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("schola_mass_plans")
    .insert({
      title: input.title.trim(),
      mass_date: input.massDate,
      notes: input.notes,
      created_by: member.id,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[schola] mass plan create failed:", error);
    return actionFailure("Nie udało się utworzyć planu.");
  }

  revalidatePlans();
  return { ok: true, data: { id: data.id as string } };
}

export async function updateMassPlan(id: string, input: MassPlanInput): Promise<ActionResult<null>> {
  await requireScholaMember();

  if (!input.title.trim()) return actionFailure("Podaj nazwę planu.");
  if (!input.massDate) return actionFailure("Podaj datę Mszy.");

  const supabase = await createClient();
  const { error } = await supabase
    .from("schola_mass_plans")
    .update({ title: input.title.trim(), mass_date: input.massDate, notes: input.notes })
    .eq("id", id);

  if (error) {
    console.error("[schola] mass plan update failed:", error);
    return actionFailure("Nie udało się zaktualizować planu.");
  }

  revalidatePlans(id);
  return { ok: true, data: null };
}

export async function deleteMassPlan(id: string): Promise<ActionResult<null>> {
  await requireScholaMember();
  const supabase = await createClient();

  const { error } = await supabase.from("schola_mass_plans").delete().eq("id", id);
  if (error) {
    console.error("[schola] mass plan delete failed:", error);
    return actionFailure("Nie udało się usunąć planu.");
  }

  revalidatePlans();
  return { ok: true, data: null };
}

export async function addSongToPlan(planId: string, songId: string): Promise<ActionResult<{ itemId: string }>> {
  await requireScholaMember();
  const supabase = await createClient();

  const { count } = await supabase
    .from("schola_mass_plan_items")
    .select("id", { count: "exact", head: true })
    .eq("plan_id", planId);

  const { data, error } = await supabase
    .from("schola_mass_plan_items")
    .insert({ plan_id: planId, song_id: songId, order_index: count ?? 0 })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[schola] add song to plan failed:", error);
    return actionFailure("Nie udało się dodać pieśni do planu.");
  }

  revalidatePlans(planId);
  return { ok: true, data: { itemId: data.id as string } };
}

export async function removeSongFromPlan(planId: string, itemId: string): Promise<ActionResult<null>> {
  await requireScholaMember();
  const supabase = await createClient();

  const { error } = await supabase.from("schola_mass_plan_items").delete().eq("id", itemId);
  if (error) {
    console.error("[schola] remove song from plan failed:", error);
    return actionFailure("Nie udało się usunąć pieśni z planu.");
  }

  revalidatePlans(planId);
  return { ok: true, data: null };
}

export async function updatePlanItemNote(planId: string, itemId: string, note: string): Promise<ActionResult<null>> {
  await requireScholaMember();
  const supabase = await createClient();

  const { error } = await supabase.from("schola_mass_plan_items").update({ note }).eq("id", itemId);
  if (error) {
    console.error("[schola] update plan item note failed:", error);
    return actionFailure("Nie udało się zapisać notatki.");
  }

  revalidatePlans(planId);
  return { ok: true, data: null };
}

/** Takes the full new order (not a delta) — lists are ~4-12 songs, so
 * writing order_index sequentially per item is simplest and unambiguous. */
export async function reorderPlanItems(planId: string, orderedItemIds: string[]): Promise<ActionResult<null>> {
  await requireScholaMember();
  const supabase = await createClient();

  for (let i = 0; i < orderedItemIds.length; i++) {
    const { error } = await supabase
      .from("schola_mass_plan_items")
      .update({ order_index: i })
      .eq("id", orderedItemIds[i]);
    if (error) {
      console.error("[schola] reorder plan items failed:", error);
      return actionFailure("Nie udało się zmienić kolejności.");
    }
  }

  revalidatePlans(planId);
  return { ok: true, data: null };
}
