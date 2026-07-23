"use server";
// ============================================================================
// lib/paragony/recurring-actions.ts
// Recurring bills (rent, subscriptions, insurance): a template with an
// explicit next_due_date the user sets once. No RRULE engine — three fixed
// frequencies, and markRecurringPaid both creates the real transaction for
// the current period AND rolls next_due_date forward by one period.
// ============================================================================
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { accountExists, categoryExists } from "@/lib/paragony/validation";
import type { RecurringFrequency, RecurringTransaction, Transaction } from "@/lib/types/database";

export interface RecurringInput {
  type: "uznanie" | "obciazenie";
  amount: number;
  description: string;
  categoryId: string | null;
  accountId: string;
  frequency: RecurringFrequency;
  /** The next (or, at creation, first) payment date, YYYY-MM-DD. */
  nextDueDate: string;
}

async function validateRecurringInput(
  supabase: SupabaseClient,
  input: RecurringInput
): Promise<string | null> {
  if (!(input.amount > 0)) return "Kwota musi być większa od zera.";
  if (!input.nextDueDate) return "Podaj datę najbliższej płatności.";
  if (!(await accountExists(supabase, input.accountId))) return "Wybierz prawidłowe konto.";
  if (input.categoryId && !(await categoryExists(supabase, input.categoryId))) {
    return "Wybrano nieprawidłową kategorię.";
  }
  return null;
}

function revalidateAll() {
  revalidatePath("/paragony");
  revalidatePath("/paragony/budzet");
  revalidatePath("/paragony/cykliczne");
}

export async function createRecurringTransaction(
  input: RecurringInput
): Promise<ActionResult<RecurringTransaction>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const validationError = await validateRecurringInput(supabase, input);
  if (validationError) return actionFailure(validationError);

  const dayOfPeriod = new Date(`${input.nextDueDate}T00:00:00Z`).getUTCDate();

  const { data, error } = await supabase
    .from("recurring_transactions")
    .insert({
      user_id: profile.id,
      type: input.type,
      amount: input.amount,
      description: input.description.trim(),
      category_id: input.categoryId,
      account_id: input.accountId,
      frequency: input.frequency,
      day_of_period: dayOfPeriod,
      next_due_date: input.nextDueDate,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("[paragony] recurring create failed:", error);
    return actionFailure("Nie udało się utworzyć rachunku cyklicznego.");
  }

  revalidateAll();
  return { ok: true, data: data as RecurringTransaction };
}

export async function updateRecurringTransaction(
  id: string,
  input: RecurringInput
): Promise<ActionResult<RecurringTransaction>> {
  await requireProfile();
  const supabase = await createClient();

  const validationError = await validateRecurringInput(supabase, input);
  if (validationError) return actionFailure(validationError);

  const dayOfPeriod = new Date(`${input.nextDueDate}T00:00:00Z`).getUTCDate();

  const { data, error } = await supabase
    .from("recurring_transactions")
    .update({
      type: input.type,
      amount: input.amount,
      description: input.description.trim(),
      category_id: input.categoryId,
      account_id: input.accountId,
      frequency: input.frequency,
      day_of_period: dayOfPeriod,
      next_due_date: input.nextDueDate,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error || !data) {
    console.error("[paragony] recurring update failed:", error);
    return actionFailure("Nie udało się zaktualizować rachunku cyklicznego.");
  }

  revalidateAll();
  return { ok: true, data: data as RecurringTransaction };
}

export async function setRecurringActive(id: string, isActive: boolean): Promise<ActionResult<null>> {
  await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .from("recurring_transactions")
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("[paragony] recurring toggle failed:", error);
    return actionFailure("Nie udało się zaktualizować rachunku cyklicznego.");
  }

  revalidateAll();
  return { ok: true, data: null };
}

export async function deleteRecurringTransaction(id: string): Promise<ActionResult<null>> {
  await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase.from("recurring_transactions").delete().eq("id", id);
  if (error) {
    console.error("[paragony] recurring delete failed:", error);
    return actionFailure("Nie udało się usunąć rachunku cyklicznego.");
  }

  revalidateAll();
  return { ok: true, data: null };
}

function advanceDueDate(current: string, frequency: RecurringFrequency): string {
  const d = new Date(`${current}T00:00:00Z`);
  if (frequency === "monthly") d.setUTCMonth(d.getUTCMonth() + 1);
  else if (frequency === "quarterly") d.setUTCMonth(d.getUTCMonth() + 3);
  else d.setUTCFullYear(d.getUTCFullYear() + 1);
  return d.toISOString().slice(0, 10);
}

/** Marks the current period as paid: creates the real transaction it
 * represents, dated at the (pre-advance) next_due_date, then rolls
 * next_due_date forward by one period. */
export async function markRecurringPaid(
  id: string
): Promise<ActionResult<{ transaction: Transaction; recurring: RecurringTransaction }>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: recurring, error: fetchError } = await supabase
    .from("recurring_transactions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (fetchError || !recurring) return actionFailure("Nie znaleziono rachunku cyklicznego.");

  const { data: transaction, error: txError } = await supabase
    .from("transactions")
    .insert({
      user_id: profile.id,
      type: recurring.type,
      amount: recurring.amount,
      occurred_at: recurring.next_due_date,
      description: recurring.description,
      category_id: recurring.category_id,
      account_id: recurring.account_id,
      recurring_transaction_id: recurring.id,
    })
    .select()
    .single();
  if (txError || !transaction) {
    console.error("[paragony] recurring transaction create failed:", txError);
    return actionFailure("Nie udało się zapisać płatności.");
  }

  const nextDueDate = advanceDueDate(recurring.next_due_date as string, recurring.frequency as RecurringFrequency);
  const { data: updatedRecurring, error: updateError } = await supabase
    .from("recurring_transactions")
    .update({ next_due_date: nextDueDate, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (updateError || !updatedRecurring) {
    console.error("[paragony] recurring advance failed:", updateError);
    return actionFailure("Płatność zapisana, ale nie udało się przesunąć terminu kolejnej płatności.");
  }

  revalidateAll();
  return {
    ok: true,
    data: { transaction: transaction as Transaction, recurring: updatedRecurring as RecurringTransaction },
  };
}
