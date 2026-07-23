// ============================================================================
// lib/paragony/validation.ts
// Ownership checks for foreign keys accepted as raw input from the client
// (account_id, category_id, ...). RLS already scopes what a SELECT can see,
// so "does this row exist" from the caller's own Supabase client doubles as
// "does the caller own it" — without this, a crafted account_id belonging to
// another user could be attached to one's own transaction row (the insert
// itself would still pass RLS, since that only checks transactions.user_id).
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function accountExists(supabase: SupabaseClient, accountId: string): Promise<boolean> {
  const { data } = await supabase.from("accounts").select("id").eq("id", accountId).maybeSingle();
  return !!data;
}

export async function categoryExists(supabase: SupabaseClient, categoryId: string): Promise<boolean> {
  const { data } = await supabase.from("budget_categories").select("id").eq("id", categoryId).maybeSingle();
  return !!data;
}

export async function goalExists(supabase: SupabaseClient, goalId: string): Promise<boolean> {
  const { data } = await supabase.from("savings_goals").select("id").eq("id", goalId).maybeSingle();
  return !!data;
}

export async function holdingExists(supabase: SupabaseClient, holdingId: string): Promise<boolean> {
  const { data } = await supabase.from("etf_holdings").select("id").eq("id", holdingId).maybeSingle();
  return !!data;
}
