"use server";
// ============================================================================
// lib/modlitwa/settings-actions.ts
// Ustawienia: przypomnienia, duża czcionka, synchronizacja kalendarza
// (feed ICS) oraz odświeżenie cache'u kalendarza liturgicznego.
//
// Rotacja tokenu kalendarza to jedyna operacja „niszcząca” w tym module —
// unieważnia wszystkie subskrypcje, więc UI musi o tym uprzedzić.
// ============================================================================
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { ensurePrayerSettings } from "@/lib/modlitwa/settings";
import { observancesBetween, toDateKey } from "@/lib/modlitwa/liturgical-calendar";
import type { PrayerSettings } from "@/lib/types/database";

export interface SettingsInput {
  notificationsEnabled?: boolean;
  reminderTime?: string;
  calendarSyncEnabled?: boolean;
  includeIntentionsInCalendar?: boolean;
  largeText?: boolean;
}

export async function updatePrayerSettings(
  input: SettingsInput
): Promise<ActionResult<PrayerSettings>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const current = await ensurePrayerSettings(supabase, profile.id);
  if (!current) return actionFailure("Nie udało się wczytać ustawień.");

  if (input.reminderTime !== undefined && !/^\d{2}:\d{2}(:\d{2})?$/.test(input.reminderTime)) {
    return actionFailure("Nieprawidłowa godzina przypomnienia.");
  }

  const { data, error } = await supabase
    .from("prayer_settings")
    .update({
      notifications_enabled: input.notificationsEnabled ?? current.notifications_enabled,
      reminder_time: input.reminderTime ?? current.reminder_time,
      calendar_sync_enabled: input.calendarSyncEnabled ?? current.calendar_sync_enabled,
      include_intentions_in_calendar:
        input.includeIntentionsInCalendar ?? current.include_intentions_in_calendar,
      large_text: input.largeText ?? current.large_text,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", profile.id)
    .select()
    .single();

  if (error || !data) {
    console.error("[modlitwa] settings update failed:", error);
    return actionFailure("Nie udało się zapisać ustawień.");
  }

  revalidatePath("/modlitwa/ustawienia");
  revalidatePath("/modlitwa");
  return { ok: true, data: data as PrayerSettings };
}

/** Nowy token = stare subskrypcje kalendarza przestają działać. */
export async function rotateCalendarToken(): Promise<ActionResult<PrayerSettings>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  await ensurePrayerSettings(supabase, profile.id);

  const { data, error } = await supabase
    .from("prayer_settings")
    .update({ calendar_token: crypto.randomUUID(), updated_at: new Date().toISOString() })
    .eq("user_id", profile.id)
    .select()
    .single();

  if (error || !data) {
    console.error("[modlitwa] token rotation failed:", error);
    return actionFailure("Nie udało się wygenerować nowego adresu kalendarza.");
  }

  revalidatePath("/modlitwa/ustawienia");
  return { ok: true, data: data as PrayerSettings };
}

/**
 * Przelicza kalendarz liturgiczny na podany rok i zapisuje go w
 * special_liturgical_dates. Tabela jest globalna i bez polityki zapisu dla
 * „authenticated”, więc idzie to przez klienta service-role — dane są w 100%
 * wyliczone lokalnie, więc nie ma tu żadnego wejścia od użytkownika poza rokiem.
 */
export async function syncLiturgicalCalendar(year: number): Promise<ActionResult<{ count: number }>> {
  await requireProfile();

  const currentYear = new Date().getFullYear();
  if (!Number.isInteger(year) || year < currentYear - 5 || year > currentYear + 5) {
    return actionFailure("Kalendarz można zsynchronizować dla lat w zakresie ±5 od bieżącego.");
  }

  const rows = observancesBetween(`${year}-01-01`, `${year}-12-31`)
    .filter(({ observance }) => observance.rank !== "niedziela")
    .map(({ date, observance, season }) => ({
      observance_date: date,
      name: observance.name,
      rank: observance.rank,
      color: observance.color,
      season,
      is_holy_day_of_obligation: observance.holyDayOfObligation ?? false,
    }));

  const admin = createAdminClient();
  const { error } = await admin
    .from("special_liturgical_dates")
    .upsert(rows, { onConflict: "observance_date,name" });

  if (error) {
    console.error("[modlitwa] liturgical calendar sync failed:", error);
    return actionFailure("Nie udało się zapisać kalendarza liturgicznego.");
  }

  revalidatePath("/modlitwa/kalendarz");
  return { ok: true, data: { count: rows.length } };
}

/** Rok bieżący i następny — wołane z ekranu ustawień jednym kliknięciem. */
export async function syncCurrentAndNextYear(): Promise<ActionResult<{ count: number }>> {
  const year = Number(toDateKey(new Date()).slice(0, 4));
  const first = await syncLiturgicalCalendar(year);
  if (!first.ok) return first;
  const second = await syncLiturgicalCalendar(year + 1);
  if (!second.ok) return second;
  return { ok: true, data: { count: first.data.count + second.data.count } };
}
