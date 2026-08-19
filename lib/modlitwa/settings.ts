// ============================================================================
// lib/modlitwa/settings.ts
// Ustawienia aplikacji „Modlitwa”. Wiersz w prayer_settings powstaje leniwie —
// dopiero gdy użytkownik wejdzie na ekran ustawień albo włączy synchronizację
// kalendarza. Dzięki temu samo zainstalowanie aplikacji nie generuje tokenu
// kalendarza (czyli sekretu) dla kogoś, kto z tej funkcji nie skorzysta.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PrayerSettings } from "@/lib/types/database";

export const DEFAULT_SETTINGS: Omit<PrayerSettings, "user_id" | "calendar_token" | "updated_at"> = {
  notifications_enabled: false,
  reminder_time: "21:00",
  calendar_sync_enabled: false,
  include_intentions_in_calendar: false,
  large_text: false,
};

/** Zwraca ustawienia użytkownika, tworząc wiersz przy pierwszym wejściu. */
export async function ensurePrayerSettings(
  supabase: SupabaseClient,
  userId: string
): Promise<PrayerSettings | null> {
  const { data: existing } = await supabase
    .from("prayer_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) return existing as PrayerSettings;

  const { data, error } = await supabase
    .from("prayer_settings")
    .insert({ user_id: userId })
    .select()
    .single();

  if (error || !data) {
    console.error("[modlitwa] settings create failed:", error);
    return null;
  }
  return data as PrayerSettings;
}

/** Adres feedu ICS do subskrypcji w Google/Apple Calendar. */
export function calendarFeedUrl(token: string, origin: string): string {
  return `${origin.replace(/\/$/, "")}/api/modlitwa/kalendarz.ics?token=${token}`;
}
