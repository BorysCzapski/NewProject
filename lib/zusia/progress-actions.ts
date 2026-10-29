"use server";

// ============================================================================
// lib/zusia/progress-actions.ts
// Load/save the signed-in user's ZUSia progress (table zusia_progress, one
// jsonb row per user, RLS-protected). Failures are RETURNED, not thrown -
// Next.js redacts thrown Server Action messages in production.
// ============================================================================
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { createClient } from "@/lib/supabase/server";
import { progressSchema, EMPTY_PROGRESS, type ZusiaProgress } from "./progress";

export async function loadZusiaProgress(): Promise<ActionResult<ZusiaProgress>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return actionFailure("Zaloguj się, aby zapisywać postępy na koncie.");

  const { data, error } = await supabase.from("zusia_progress").select("data").eq("user_id", user.id).maybeSingle();
  if (error) {
    console.error("[zusia] load progress failed:", error);
    return actionFailure("Nie udało się wczytać postępów z konta.");
  }
  if (!data) return { ok: true, data: EMPTY_PROGRESS };

  const parsed = progressSchema.safeParse(data.data);
  return { ok: true, data: parsed.success ? parsed.data : EMPTY_PROGRESS };
}

export async function saveZusiaProgress(input: unknown): Promise<ActionResult<null>> {
  const parsed = progressSchema.safeParse(input);
  if (!parsed.success) return actionFailure("Nieprawidłowe dane postępów.");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return actionFailure("Zaloguj się, aby zapisywać postępy na koncie.");

  const { error } = await supabase.from("zusia_progress").upsert({ user_id: user.id, data: parsed.data }, { onConflict: "user_id" });
  if (error) {
    console.error("[zusia] save progress failed:", error);
    return actionFailure("Nie udało się zapisać postępów na koncie.");
  }
  return { ok: true, data: null };
}
