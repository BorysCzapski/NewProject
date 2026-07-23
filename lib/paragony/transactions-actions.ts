"use server";
// ============================================================================
// lib/paragony/transactions-actions.ts
// Manual ledger entries: uznanie (income), obciazenie (expense), transfer
// (moves money between two of the user's own accounts, deliberately
// category-less and excluded from budget totals — see the migration comment
// on transactions.category_id / transfer_to_account_id).
// ============================================================================
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { accountExists, categoryExists, goalExists } from "@/lib/paragony/validation";
import type { Transaction, TransactionType } from "@/lib/types/database";

export interface TransactionInput {
  type: TransactionType;
  amount: number;
  occurredAt: string;
  description: string;
  categoryId: string | null;
  accountId: string;
  transferToAccountId: string | null;
  savingsGoalId: string | null;
}

async function validateTransactionInput(
  supabase: SupabaseClient,
  input: TransactionInput
): Promise<string | null> {
  if (!(input.amount > 0)) return "Kwota musi być większa od zera.";
  if (!input.occurredAt) return "Podaj datę.";
  if (!(await accountExists(supabase, input.accountId))) return "Wybierz prawidłowe konto.";

  if (input.type === "transfer") {
    if (!input.transferToAccountId) return "Wybierz konto docelowe przelewu.";
    if (input.transferToAccountId === input.accountId) {
      return "Konto docelowe musi być inne niż konto źródłowe.";
    }
    if (!(await accountExists(supabase, input.transferToAccountId))) {
      return "Wybierz prawidłowe konto docelowe.";
    }
  } else if (input.transferToAccountId) {
    return "Konto docelowe dotyczy tylko przelewów.";
  }

  if (input.categoryId) {
    if (input.type === "transfer") return "Przelewy między kontami nie mają kategorii.";
    if (!(await categoryExists(supabase, input.categoryId))) return "Wybrano nieprawidłową kategorię.";
  }

  if (input.savingsGoalId && !(await goalExists(supabase, input.savingsGoalId))) {
    return "Wybrano nieprawidłowy cel oszczędnościowy.";
  }

  return null;
}

function toRow(userId: string, input: TransactionInput) {
  return {
    user_id: userId,
    type: input.type,
    amount: input.amount,
    occurred_at: input.occurredAt,
    description: input.description.trim(),
    category_id: input.type === "transfer" ? null : input.categoryId,
    account_id: input.accountId,
    transfer_to_account_id: input.type === "transfer" ? input.transferToAccountId : null,
    savings_goal_id: input.savingsGoalId,
  };
}

function revalidateAll() {
  revalidatePath("/paragony");
  revalidatePath("/paragony/budzet");
  revalidatePath("/paragony/transakcje");
}

export async function addTransaction(input: TransactionInput): Promise<ActionResult<Transaction>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const validationError = await validateTransactionInput(supabase, input);
  if (validationError) return actionFailure(validationError);

  const { data, error } = await supabase
    .from("transactions")
    .insert(toRow(profile.id, input))
    .select()
    .single();

  if (error || !data) {
    console.error("[paragony] transaction create failed:", error);
    return actionFailure("Nie udało się zapisać transakcji.");
  }

  revalidateAll();
  return { ok: true, data: data as Transaction };
}

export async function updateTransaction(
  id: string,
  input: TransactionInput
): Promise<ActionResult<Transaction>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const validationError = await validateTransactionInput(supabase, input);
  if (validationError) return actionFailure(validationError);

  const { data, error } = await supabase
    .from("transactions")
    .update({ ...toRow(profile.id, input), updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error || !data) {
    console.error("[paragony] transaction update failed:", error);
    return actionFailure("Nie udało się zaktualizować transakcji.");
  }

  revalidateAll();
  return { ok: true, data: data as Transaction };
}

export async function deleteTransaction(id: string): Promise<ActionResult<null>> {
  await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) {
    console.error("[paragony] transaction delete failed:", error);
    return actionFailure("Nie udało się usunąć transakcji.");
  }

  revalidateAll();
  return { ok: true, data: null };
}
