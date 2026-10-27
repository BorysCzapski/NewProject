"use server";
// ============================================================================
// lib/tracker/actions.ts
// Zapis i skasowanie dnia. Walidacja jest dublowana świadomie: formularz
// blokuje bzdury od razu, ale Server Action to publiczny endpoint POST —
// sprawdza więc wszystko jeszcze raz. user_id nigdy nie przychodzi z klienta;
// właścicielem wiersza jest zalogowany profil, a RLS ("tracker_days_own")
// dokłada drugą warstwę.
// ============================================================================
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { isValidDateKey, todayKey } from "@/lib/tracker/format";

const MAX_NOTE = 1000;
/** Chroni przed literówką w roku ("0202-08-12"). */
const MIN_DATE = "2000-01-01";

export interface DayInput {
  day: string;
  hours: number;
  tasks: number;
  note?: string;
}

export async function saveDay(input: DayInput): Promise<ActionResult<null>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const day = input.day?.trim() ?? "";
  if (!isValidDateKey(day)) return actionFailure("Podaj poprawną datę.");
  if (day > todayKey()) return actionFailure("Nie można zapisać dnia z przyszłości.");
  if (day < MIN_DATE) return actionFailure("Ta data jest zbyt odległa — sprawdź rok.");

  const hours = Number(input.hours);
  if (!Number.isFinite(hours) || hours < 0) return actionFailure("Podaj liczbę godzin (0 lub więcej).");
  if (hours > 24) return actionFailure("W dobie jest tylko 24 godziny.");
  // Do setnych, bo kolumna to numeric(4,2).
  const hoursRounded = Math.round(hours * 100) / 100;

  const tasks = Number(input.tasks);
  if (!Number.isFinite(tasks) || tasks < 0) return actionFailure("Podaj liczbę zadań (0 lub więcej).");
  if (tasks > 999) return actionFailure("Za dużo zadań jak na jeden dzień — sprawdź liczbę.");
  const tasksRounded = Math.round(tasks);

  const note = (input.note ?? "").trim().slice(0, MAX_NOTE);

  const { error } = await supabase.from("tracker_days").upsert(
    {
      user_id: profile.id,
      day,
      hours: hoursRounded,
      tasks: tasksRounded,
      note: note || null,
    },
    { onConflict: "user_id,day" }
  );
  if (error) {
    console.error("[tracker] saveDay failed:", error);
    return actionFailure("Nie udało się zapisać dnia. Spróbuj ponownie.");
  }

  revalidatePath("/tracker");
  return { ok: true, data: null };
}

export async function deleteDay(day: string): Promise<ActionResult<null>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  if (!isValidDateKey(day)) return actionFailure("Podaj poprawną datę.");

  const { error } = await supabase
    .from("tracker_days")
    .delete()
    .eq("user_id", profile.id)
    .eq("day", day);
  if (error) {
    console.error("[tracker] deleteDay failed:", error);
    return actionFailure("Nie udało się skasować dnia. Spróbuj ponownie.");
  }

  revalidatePath("/tracker");
  return { ok: true, data: null };
}
