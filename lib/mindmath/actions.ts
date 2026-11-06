"use server";
// ============================================================================
// lib/mindmath/actions.ts
// Zapis wyniku sesji treningu. Wartości liczbowe waliduje serwer (formularz
// klienta nie jest źródłem prawdy); user_id pochodzi z sesji, RLS to druga warstwa.
// ============================================================================
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { MODE_IDS } from "@/lib/mindmath/problems";

export async function saveMindMathSession(input: {
  mode: string;
  level: number;
  total: number;
  correct: number;
  seconds: number;
}): Promise<ActionResult<null>> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { mode, level, total, correct, seconds } = input;

  if (!MODE_IDS.includes(mode)) return actionFailure("Nieznany tryb.");
  if (![1, 2, 3].includes(level)) return actionFailure("Nieznany poziom.");
  if (!Number.isInteger(total) || total < 1 || total > 100) return actionFailure("Niepoprawna liczba zadań.");
  if (!Number.isInteger(correct) || correct < 0 || correct > total) return actionFailure("Niepoprawny wynik.");
  if (!Number.isFinite(seconds) || seconds <= 0 || seconds > 7200) return actionFailure("Niepoprawny czas.");

  const { error } = await supabase.from("mindmath_sessions").insert({
    user_id: profile.id,
    mode,
    level,
    total,
    correct,
    seconds: Math.round(seconds * 10) / 10,
  });
  if (error) return actionFailure("Nie udało się zapisać wyniku.");
  revalidatePath("/mindmath");
  return { ok: true, data: null };
}
