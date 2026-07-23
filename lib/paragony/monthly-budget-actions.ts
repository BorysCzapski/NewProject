"use server";
// ============================================================================
// lib/paragony/monthly-budget-actions.ts
// Per-category planned spend for a calendar month. One row per
// (user, category, year, month) — see the migration's unique constraint.
// ============================================================================
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { categoryExists } from "@/lib/paragony/validation";
import type { MonthlyBudget } from "@/lib/types/database";

interface MonthlyBudgetInput {
  categoryId: string;
  year: number;
  month: number;
  plannedAmount: number;
}

export async function setMonthlyBudget(input: MonthlyBudgetInput): Promise<ActionResult<MonthlyBudget>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  if (!(await categoryExists(supabase, input.categoryId))) {
    return actionFailure("Wybrano nieprawidłową kategorię.");
  }
  if (input.plannedAmount < 0) return actionFailure("Kwota planu nie może być ujemna.");
  if (input.month < 1 || input.month > 12) return actionFailure("Nieprawidłowy miesiąc.");

  const { data, error } = await supabase
    .from("monthly_budgets")
    .upsert(
      {
        user_id: profile.id,
        category_id: input.categoryId,
        year: input.year,
        month: input.month,
        planned_amount: input.plannedAmount,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,category_id,year,month" }
    )
    .select()
    .single();

  if (error || !data) {
    console.error("[paragony] monthly budget upsert failed:", error);
    return actionFailure("Nie udało się zapisać budżetu.");
  }

  revalidatePath("/paragony/budzet");
  return { ok: true, data: data as MonthlyBudget };
}
