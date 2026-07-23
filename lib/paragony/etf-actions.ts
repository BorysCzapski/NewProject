"use server";
// ============================================================================
// lib/paragony/etf-actions.ts
// Holdings/transactions/dividends CRUD. A repeated buy of an already-held
// ticker reuses the existing etf_holdings row (unique(user_id, ticker)) and
// just adds another etf_transactions row — the average cost is always
// DERIVED (see lib/paragony/etf-metrics.ts computeHoldingPosition), never
// stored/overwritten.
// ============================================================================
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { holdingExists } from "@/lib/paragony/validation";
import type { EtfDividend, EtfHolding, EtfProvider, EtfTransaction } from "@/lib/types/database";

function revalidateEtf() {
  revalidatePath("/paragony/etf");
}

interface AddHoldingInput {
  ticker: string;
  provider: EtfProvider;
  name: string;
  currency: string;
  assetClass: string;
  region: string;
  ter: number | null;
  units: number;
  pricePerUnit: number;
  transactionDate: string;
}

export async function addEtfHolding(
  input: AddHoldingInput
): Promise<ActionResult<{ holding: EtfHolding; transaction: EtfTransaction }>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const ticker = input.ticker.trim().toLowerCase();
  if (!ticker) return actionFailure("Podaj ticker ETF-u.");
  if (!(input.units > 0)) return actionFailure("Liczba jednostek musi być większa od zera.");
  if (input.pricePerUnit < 0) return actionFailure("Cena musi być liczbą nieujemną.");
  if (!input.transactionDate) return actionFailure("Podaj datę transakcji.");

  const { data: existing } = await supabase.from("etf_holdings").select("*").eq("ticker", ticker).maybeSingle();

  let holding = existing as EtfHolding | null;
  if (!holding) {
    const { data: created, error: createError } = await supabase
      .from("etf_holdings")
      .insert({
        user_id: profile.id,
        ticker,
        provider: input.provider,
        name: input.name.trim() || null,
        currency: input.currency || "PLN",
        asset_class: input.assetClass.trim() || null,
        region: input.region.trim() || null,
        ter: input.ter,
      })
      .select()
      .single();
    if (createError || !created) {
      console.error("[paragony] etf holding create failed:", createError);
      return actionFailure("Nie udało się dodać ETF-u.");
    }
    holding = created as EtfHolding;
  }

  const { data: transaction, error: txError } = await supabase
    .from("etf_transactions")
    .insert({
      holding_id: holding.id,
      user_id: profile.id,
      type: "buy",
      units: input.units,
      price_per_unit: input.pricePerUnit,
      transaction_date: input.transactionDate,
    })
    .select()
    .single();
  if (txError || !transaction) {
    console.error("[paragony] etf transaction create failed:", txError);
    return actionFailure("ETF dodany, ale nie udało się zapisać transakcji zakupu.");
  }

  revalidateEtf();
  return { ok: true, data: { holding, transaction: transaction as EtfTransaction } };
}

interface EtfTransactionInput {
  holdingId: string;
  type: "buy" | "sell";
  units: number;
  pricePerUnit: number;
  transactionDate: string;
}

export async function addEtfTransaction(input: EtfTransactionInput): Promise<ActionResult<EtfTransaction>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  if (!(await holdingExists(supabase, input.holdingId))) return actionFailure("Nie znaleziono ETF-u.");
  if (!(input.units > 0)) return actionFailure("Liczba jednostek musi być większa od zera.");
  if (input.pricePerUnit < 0) return actionFailure("Cena musi być liczbą nieujemną.");
  if (!input.transactionDate) return actionFailure("Podaj datę transakcji.");

  const { data, error } = await supabase
    .from("etf_transactions")
    .insert({
      holding_id: input.holdingId,
      user_id: profile.id,
      type: input.type,
      units: input.units,
      price_per_unit: input.pricePerUnit,
      transaction_date: input.transactionDate,
    })
    .select()
    .single();
  if (error || !data) {
    console.error("[paragony] etf transaction create failed:", error);
    return actionFailure("Nie udało się zapisać transakcji.");
  }

  revalidateEtf();
  return { ok: true, data: data as EtfTransaction };
}

export async function deleteEtfTransaction(id: string): Promise<ActionResult<null>> {
  await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase.from("etf_transactions").delete().eq("id", id);
  if (error) {
    console.error("[paragony] etf transaction delete failed:", error);
    return actionFailure("Nie udało się usunąć transakcji.");
  }

  revalidateEtf();
  return { ok: true, data: null };
}

interface DividendInput {
  holdingId: string;
  amount: number;
  paymentDate: string;
  notes: string | null;
}

export async function addEtfDividend(input: DividendInput): Promise<ActionResult<EtfDividend>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  if (!(await holdingExists(supabase, input.holdingId))) return actionFailure("Nie znaleziono ETF-u.");
  if (!(input.amount > 0)) return actionFailure("Kwota dywidendy musi być większa od zera.");
  if (!input.paymentDate) return actionFailure("Podaj datę wypłaty.");

  const { data, error } = await supabase
    .from("etf_dividends")
    .insert({
      holding_id: input.holdingId,
      user_id: profile.id,
      amount: input.amount,
      payment_date: input.paymentDate,
      notes: input.notes,
    })
    .select()
    .single();
  if (error || !data) {
    console.error("[paragony] etf dividend create failed:", error);
    return actionFailure("Nie udało się zapisać dywidendy.");
  }

  revalidateEtf();
  return { ok: true, data: data as EtfDividend };
}

export async function deleteEtfDividend(id: string): Promise<ActionResult<null>> {
  await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase.from("etf_dividends").delete().eq("id", id);
  if (error) {
    console.error("[paragony] etf dividend delete failed:", error);
    return actionFailure("Nie udało się usunąć dywidendy.");
  }

  revalidateEtf();
  return { ok: true, data: null };
}

export async function updateHoldingMetadata(
  id: string,
  input: { name: string; assetClass: string; region: string; ter: number | null }
): Promise<ActionResult<EtfHolding>> {
  await requireProfile();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("etf_holdings")
    .update({
      name: input.name.trim() || null,
      asset_class: input.assetClass.trim() || null,
      region: input.region.trim() || null,
      ter: input.ter,
    })
    .eq("id", id)
    .select()
    .maybeSingle();
  if (error || !data) {
    console.error("[paragony] etf holding update failed:", error);
    return actionFailure("Nie udało się zaktualizować danych ETF-u.");
  }

  revalidateEtf();
  return { ok: true, data: data as EtfHolding };
}

/** Cascades etf_transactions + etf_dividends (ON DELETE CASCADE, see the
 * migration) — deleting a holding removes its whole buy/sell/dividend
 * history, unlike accounts (lib/paragony/accounts-actions.ts), since there's
 * no reason to keep orphaned ETF transactions once the position is gone. */
export async function deleteEtfHolding(id: string): Promise<ActionResult<null>> {
  await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase.from("etf_holdings").delete().eq("id", id);
  if (error) {
    console.error("[paragony] etf holding delete failed:", error);
    return actionFailure("Nie udało się usunąć ETF-u.");
  }

  revalidateEtf();
  return { ok: true, data: null };
}
