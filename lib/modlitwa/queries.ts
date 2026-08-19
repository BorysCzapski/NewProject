// ============================================================================
// lib/modlitwa/queries.ts
// Strona odczytu aplikacji „Modlitwa”: streak, dziennik modlitwy, intencje,
// ustawienia i cache kalendarza liturgicznego.
//
// Wszystkie funkcje przyjmują gotowego klienta Supabase (RLS pilnuje, że
// widać tylko własne wiersze) i nigdy nie rzucają — brak danych to pusty
// wynik plus log, żeby jedna nieudana kwerenda nie wywaliła całej strony.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { EMPTY_STREAK, type StreakState } from "@/lib/modlitwa/streak";
import type { PrayerLogEntry, PrayerRequest, PrayerSettings, SpecialLiturgicalDate } from "@/lib/types/database";

export async function getPrayerStreak(supabase: SupabaseClient, userId: string): Promise<StreakState> {
  const { data, error } = await supabase
    .from("prayer_streaks")
    .select("current_streak, longest_streak, total_days, last_prayer_date")
    .eq("user_id", userId)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[modlitwa] streak fetch failed:", error);
    return EMPTY_STREAK;
  }

  return {
    currentStreak: data.current_streak as number,
    longestStreak: data.longest_streak as number,
    totalDays: data.total_days as number,
    lastPrayerDate: (data.last_prayer_date as string | null) ?? null,
  };
}

/** Dni z wpisem w dzienniku w podanym zakresie (do paska i do kalendarza). */
export async function getPrayerLog(
  supabase: SupabaseClient,
  userId: string,
  startDate: string,
  endDate: string
): Promise<PrayerLogEntry[]> {
  const { data, error } = await supabase
    .from("prayer_log")
    .select("*")
    .eq("user_id", userId)
    .gte("prayer_date", startDate)
    .lte("prayer_date", endDate)
    .order("prayer_date", { ascending: false });

  if (error || !data) {
    if (error) console.error("[modlitwa] prayer log fetch failed:", error);
    return [];
  }
  return data as PrayerLogEntry[];
}

export async function getTodayLogEntry(
  supabase: SupabaseClient,
  userId: string,
  dateKey: string
): Promise<PrayerLogEntry | null> {
  const { data } = await supabase
    .from("prayer_log")
    .select("*")
    .eq("user_id", userId)
    .eq("prayer_date", dateKey)
    .maybeSingle();
  return (data as PrayerLogEntry | null) ?? null;
}

export interface PrayerRequestGroups {
  active: PrayerRequest[];
  fulfilled: PrayerRequest[];
}

export async function getPrayerRequests(
  supabase: SupabaseClient,
  userId: string
): Promise<PrayerRequestGroups> {
  const { data, error } = await supabase
    .from("prayer_requests")
    .select("*")
    .eq("user_id", userId)
    .order("fulfilled", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) {
    if (error) console.error("[modlitwa] prayer requests fetch failed:", error);
    return { active: [], fulfilled: [] };
  }

  const requests = data as PrayerRequest[];
  return {
    active: requests.filter((r) => !r.fulfilled),
    fulfilled: requests.filter((r) => r.fulfilled),
  };
}

/** Ustawienia użytkownika; brak wiersza = wartości domyślne (bez zapisu). */
export async function getPrayerSettings(
  supabase: SupabaseClient,
  userId: string
): Promise<PrayerSettings | null> {
  const { data, error } = await supabase
    .from("prayer_settings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("[modlitwa] settings fetch failed:", error);
    return null;
  }
  return (data as PrayerSettings | null) ?? null;
}

/** Zapisane w cache uroczystości/święta dla zakresu dat (widok kalendarza). */
export async function getSpecialDates(
  supabase: SupabaseClient,
  startDate: string,
  endDate: string
): Promise<SpecialLiturgicalDate[]> {
  const { data, error } = await supabase
    .from("special_liturgical_dates")
    .select("*")
    .gte("observance_date", startDate)
    .lte("observance_date", endDate)
    .order("observance_date", { ascending: true });

  if (error || !data) {
    if (error) console.error("[modlitwa] special dates fetch failed:", error);
    return [];
  }
  return data as SpecialLiturgicalDate[];
}
