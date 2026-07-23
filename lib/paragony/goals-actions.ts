"use server";
// ============================================================================
// lib/paragony/goals-actions.ts
// Savings goals: current_amount is a plain stored counter the user moves
// with explicit contribute/withdraw actions — deliberately NOT auto-derived
// from the transaction ledger (a goal is "money set aside", not a rollup of
// income minus expenses, which would double-count regular spending).
// ============================================================================
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import type { SavingsGoal } from "@/lib/types/database";

interface GoalInput {
  title: string;
  targetAmount: number;
  targetDate: string | null;
}

function revalidateAll() {
  revalidatePath("/paragony");
  revalidatePath("/paragony/cele");
}

export async function createGoal(input: GoalInput): Promise<ActionResult<SavingsGoal>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  if (!input.title.trim()) return actionFailure("Podaj nazwę celu.");
  if (!(input.targetAmount > 0)) return actionFailure("Kwota docelowa musi być większa od zera.");

  const { data, error } = await supabase
    .from("savings_goals")
    .insert({
      user_id: profile.id,
      title: input.title.trim(),
      target_amount: input.targetAmount,
      target_date: input.targetDate,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("[paragony] goal create failed:", error);
    return actionFailure("Nie udało się utworzyć celu oszczędnościowego.");
  }

  revalidateAll();
  return { ok: true, data: data as SavingsGoal };
}

export async function updateGoal(id: string, input: GoalInput): Promise<ActionResult<SavingsGoal>> {
  await requireProfile();
  const supabase = await createClient();

  if (!input.title.trim()) return actionFailure("Podaj nazwę celu.");
  if (!(input.targetAmount > 0)) return actionFailure("Kwota docelowa musi być większa od zera.");

  const { data, error } = await supabase
    .from("savings_goals")
    .update({
      title: input.title.trim(),
      target_amount: input.targetAmount,
      target_date: input.targetDate,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error || !data) {
    console.error("[paragony] goal update failed:", error);
    return actionFailure("Nie udało się zaktualizować celu.");
  }

  revalidateAll();
  return { ok: true, data: data as SavingsGoal };
}

export async function deleteGoal(id: string): Promise<ActionResult<null>> {
  await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase.from("savings_goals").delete().eq("id", id);
  if (error) {
    console.error("[paragony] goal delete failed:", error);
    return actionFailure("Nie udało się usunąć celu.");
  }

  revalidateAll();
  return { ok: true, data: null };
}

/** delta > 0 = wpłata, delta < 0 = wypłata z odłożonych środków. */
export async function contributeToGoal(id: string, delta: number): Promise<ActionResult<SavingsGoal>> {
  await requireProfile();
  const supabase = await createClient();

  if (delta === 0) return actionFailure("Podaj niezerową kwotę.");

  const { data: goal, error: fetchError } = await supabase
    .from("savings_goals")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (fetchError || !goal) return actionFailure("Nie znaleziono celu.");

  const nextAmount = (goal.current_amount as number) + delta;
  if (nextAmount < 0) return actionFailure("Nie możesz wypłacić więcej niż odłożono.");

  const { data, error } = await supabase
    .from("savings_goals")
    .update({ current_amount: nextAmount, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    console.error("[paragony] goal contribute failed:", error);
    return actionFailure("Nie udało się zaktualizować postępu celu.");
  }

  revalidateAll();
  return { ok: true, data: data as SavingsGoal };
}
