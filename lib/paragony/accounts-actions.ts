"use server";
// ============================================================================
// lib/paragony/accounts-actions.ts
// Accounts ("Gotówka", "Konto ROR", "Karta kredytowa", ...) — every
// transaction belongs to exactly one.
// ============================================================================
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import type { Account, AccountKind } from "@/lib/types/database";

interface AccountInput {
  name: string;
  kind: AccountKind;
  startingBalance: number;
}

export async function createAccount(input: AccountInput): Promise<ActionResult<Account>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  if (!input.name.trim()) return actionFailure("Podaj nazwę konta.");

  const { data, error } = await supabase
    .from("accounts")
    .insert({
      user_id: profile.id,
      name: input.name.trim(),
      kind: input.kind,
      starting_balance: input.startingBalance || 0,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("[paragony] account create failed:", error);
    return actionFailure("Nie udało się utworzyć konta.");
  }

  revalidatePath("/paragony");
  revalidatePath("/paragony/konta");
  return { ok: true, data: data as Account };
}

export async function updateAccount(id: string, input: AccountInput): Promise<ActionResult<Account>> {
  await requireProfile();
  const supabase = await createClient();

  if (!input.name.trim()) return actionFailure("Podaj nazwę konta.");

  const { data, error } = await supabase
    .from("accounts")
    .update({ name: input.name.trim(), kind: input.kind, starting_balance: input.startingBalance || 0 })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error || !data) {
    console.error("[paragony] account update failed:", error);
    return actionFailure("Nie udało się zaktualizować konta.");
  }

  revalidatePath("/paragony");
  revalidatePath("/paragony/konta");
  return { ok: true, data: data as Account };
}

/** Fails (Polish error, not a 500) if any transaction/recurring bill still
 * references this account — see the migration's comment on why there's no
 * ON DELETE CASCADE from transactions/recurring_transactions to accounts. */
export async function deleteAccount(id: string): Promise<ActionResult<null>> {
  await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase.from("accounts").delete().eq("id", id);
  if (error) {
    if (error.code === "23503") {
      return actionFailure(
        "Nie można usunąć konta, które ma powiązane transakcje lub rachunki cykliczne. Najpierw je usuń lub przenieś na inne konto."
      );
    }
    console.error("[paragony] account delete failed:", error);
    return actionFailure("Nie udało się usunąć konta.");
  }

  revalidatePath("/paragony");
  revalidatePath("/paragony/konta");
  return { ok: true, data: null };
}
