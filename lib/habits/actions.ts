"use server";
// ============================================================================
// lib/habits/actions.ts
// Server Actions Habit Tracking. Żadna nie przyjmuje user_id z zewnątrz;
// RLS ("*_own") jest drugą warstwą. Dnia z przyszłości nie da się odhaczyć.
// ============================================================================
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { isValidDateKey, todayKey } from "@/lib/habits/dates";

const MAX_HABITS = 30;

export async function addHabit(name: string): Promise<ActionResult<{ id: string }>> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const trimmed = name?.trim() ?? "";
  if (!trimmed) return actionFailure("Wpisz nazwę nawyku.");
  if (trimmed.length > 60) return actionFailure("Nazwa może mieć maksymalnie 60 znaków.");

  const { count } = await supabase
    .from("habits")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id);
  if ((count ?? 0) >= MAX_HABITS) return actionFailure(`Maksymalnie ${MAX_HABITS} nawyków.`);

  const { data, error } = await supabase
    .from("habits")
    .insert({ user_id: profile.id, name: trimmed, position: count ?? 0 })
    .select("id")
    .single();
  if (error || !data) return actionFailure("Nie udało się dodać nawyku. Spróbuj ponownie.");
  revalidatePath("/habits");
  return { ok: true, data: { id: data.id } };
}

export async function deleteHabit(habitId: string): Promise<ActionResult<null>> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase.from("habits").delete().eq("id", habitId).eq("user_id", profile.id);
  if (error) return actionFailure("Nie udało się usunąć nawyku.");
  revalidatePath("/habits");
  return { ok: true, data: null };
}

export async function setHabitCheck(
  habitId: string,
  day: string,
  checked: boolean
): Promise<ActionResult<null>> {
  const profile = await requireProfile();
  const supabase = await createClient();
  if (!isValidDateKey(day)) return actionFailure("Niepoprawna data.");
  if (day > todayKey()) return actionFailure("Nie można odhaczyć dnia z przyszłości.");

  if (checked) {
    const { error } = await supabase
      .from("habit_checks")
      .upsert({ habit_id: habitId, user_id: profile.id, day });
    if (error) return actionFailure("Nie udało się zapisać.");
  } else {
    const { error } = await supabase
      .from("habit_checks")
      .delete()
      .eq("habit_id", habitId)
      .eq("user_id", profile.id)
      .eq("day", day);
    if (error) return actionFailure("Nie udało się zapisać.");
  }
  revalidatePath("/habits");
  return { ok: true, data: null };
}
