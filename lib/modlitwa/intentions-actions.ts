"use server";
// ============================================================================
// lib/modlitwa/intentions-actions.ts
// Lista intencji: osoby, za które użytkownik obiecał się modlić.
//
// Walidacja jest po obu stronach: klient blokuje puste imię od razu (spec),
// a te akcje i tak sprawdzają dane ponownie — Server Action jest publicznym
// endpointem, więc walidacja w formularzu nie jest zabezpieczeniem.
//
// Prywatność: żadna z tych funkcji nie przyjmuje user_id z zewnątrz —
// właścicielem wiersza jest zawsze zalogowany profil, a RLS („prayer_requests_own”)
// dokłada drugą warstwę.
// ============================================================================
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import type { PrayerRequest } from "@/lib/types/database";

const MAX_NAME = 120;
const MAX_TEXT = 2000;

export interface IntentionInput {
  personName: string;
  reason?: string;
  promiseDate?: string;
  notes?: string;
}

function validate(input: IntentionInput): { error: string } | { value: Required<IntentionInput> } {
  const personName = input.personName?.trim() ?? "";
  if (!personName) return { error: "Podaj imię osoby, za którą się modlisz." };
  if (personName.length > MAX_NAME) return { error: `Imię może mieć najwyżej ${MAX_NAME} znaków.` };

  const promiseDate = input.promiseDate?.trim() || new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(promiseDate)) return { error: "Nieprawidłowa data obietnicy." };

  return {
    value: {
      personName,
      reason: (input.reason ?? "").trim().slice(0, MAX_TEXT),
      promiseDate,
      notes: (input.notes ?? "").trim().slice(0, MAX_TEXT),
    },
  };
}

export async function addIntention(input: IntentionInput): Promise<ActionResult<PrayerRequest>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const validated = validate(input);
  if ("error" in validated) return actionFailure(validated.error);
  const { personName, reason, promiseDate, notes } = validated.value;

  const { data, error } = await supabase
    .from("prayer_requests")
    .insert({
      user_id: profile.id,
      person_name: personName,
      reason: reason || null,
      promise_date: promiseDate,
      notes: notes || null,
    })
    .select()
    .single();

  if (error || !data) {
    console.error("[modlitwa] intention insert failed:", error);
    return actionFailure("Nie udało się dodać intencji.");
  }

  revalidatePath("/modlitwa/intencje");
  revalidatePath("/modlitwa");
  return { ok: true, data: data as PrayerRequest };
}

export async function updateIntention(
  id: string,
  input: IntentionInput
): Promise<ActionResult<PrayerRequest>> {
  await requireProfile();
  const supabase = await createClient();

  const validated = validate(input);
  if ("error" in validated) return actionFailure(validated.error);
  const { personName, reason, promiseDate, notes } = validated.value;

  const { data, error } = await supabase
    .from("prayer_requests")
    .update({
      person_name: personName,
      reason: reason || null,
      promise_date: promiseDate,
      notes: notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    console.error("[modlitwa] intention update failed:", error);
    return actionFailure("Nie udało się zapisać zmian.");
  }

  revalidatePath("/modlitwa/intencje");
  return { ok: true, data: data as PrayerRequest };
}

/** Oznacza intencję jako spełnioną (lub cofa oznaczenie). */
export async function setIntentionFulfilled(
  id: string,
  fulfilled: boolean
): Promise<ActionResult<PrayerRequest>> {
  await requireProfile();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("prayer_requests")
    .update({
      fulfilled,
      fulfilled_at: fulfilled ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    console.error("[modlitwa] intention fulfil failed:", error);
    return actionFailure("Nie udało się zaktualizować intencji.");
  }

  revalidatePath("/modlitwa/intencje");
  revalidatePath("/modlitwa");
  return { ok: true, data: data as PrayerRequest };
}

/**
 * „Pomodliłem się za tę osobę” — podbija licznik i datę. Licznik jest
 * inkrementowany na podstawie odczytanej wartości, bo to akcja klikana raz na
 * jakiś czas przez jednego użytkownika; wyścig jest tu nierealny, a atomowy
 * increment wymagałby funkcji w bazie.
 */
export async function markIntentionPrayed(id: string): Promise<ActionResult<PrayerRequest>> {
  await requireProfile();
  const supabase = await createClient();

  const { data: current, error: fetchError } = await supabase
    .from("prayer_requests")
    .select("prayed_count")
    .eq("id", id)
    .maybeSingle();

  if (fetchError || !current) return actionFailure("Nie znaleziono intencji.");

  const { data, error } = await supabase
    .from("prayer_requests")
    .update({
      prayed_count: (current.prayed_count as number) + 1,
      last_prayed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error || !data) {
    console.error("[modlitwa] intention prayed failed:", error);
    return actionFailure("Nie udało się zapisać.");
  }

  revalidatePath("/modlitwa/intencje");
  return { ok: true, data: data as PrayerRequest };
}

export async function deleteIntention(id: string): Promise<ActionResult<null>> {
  await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase.from("prayer_requests").delete().eq("id", id);
  if (error) {
    console.error("[modlitwa] intention delete failed:", error);
    return actionFailure("Nie udało się usunąć intencji.");
  }

  revalidatePath("/modlitwa/intencje");
  revalidatePath("/modlitwa");
  return { ok: true, data: null };
}
