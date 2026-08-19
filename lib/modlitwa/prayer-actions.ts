"use server";
// ============================================================================
// lib/modlitwa/prayer-actions.ts
// Odhaczanie modlitwy: wpis w prayer_log (źródło prawdy) + przeliczenie
// denormalizowanego licznika w prayer_streaks według reguł z
// lib/modlitwa/streak.ts.
//
// Kolejność zapisów jest istotna: najpierw log (bez niego kalendarz kłamie),
// potem streak. Gdy zapis streaka padnie, dzień i tak jest odnotowany, a
// licznik da się odtworzyć z logu.
// ============================================================================
import { revalidatePath } from "next/cache";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { getPrayerStreak, getTodayLogEntry } from "@/lib/modlitwa/queries";
import { streakAfterPrayer, type StreakState } from "@/lib/modlitwa/streak";
import { HOUR_LABELS, type HourId } from "@/lib/modlitwa/hours";

const HOUR_IDS = Object.keys(HOUR_LABELS) as HourId[];

/** "YYYY-MM-DD" albo błąd — data przychodzi z klienta, więc jej nie ufamy. */
function normalizeDateKey(value: string | undefined): string | null {
  if (!value) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

async function persistStreak(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  next: StreakState
): Promise<boolean> {
  const { error } = await supabase.from("prayer_streaks").upsert({
    user_id: userId,
    current_streak: next.currentStreak,
    longest_streak: next.longestStreak,
    total_days: next.totalDays,
    last_prayer_date: next.lastPrayerDate,
    updated_at: new Date().toISOString(),
  });
  if (error) console.error("[modlitwa] streak upsert failed:", error);
  return !error;
}

export interface MarkPrayedResult {
  streak: StreakState;
  hours: string[];
}

/**
 * Odhacza modlitwę na dany dzień. `hour` (opcjonalnie) dopisuje konkretną
 * godzinę liturgiczną do dnia — samo „Pomodliłem się” zapisuje dzień bez
 * godzin i też podbija streak.
 */
export async function markPrayed(
  dateKey: string,
  hour?: HourId
): Promise<ActionResult<MarkPrayedResult>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const date = normalizeDateKey(dateKey);
  if (!date) return actionFailure("Nieprawidłowa data.");
  if (hour && !HOUR_IDS.includes(hour)) return actionFailure("Nieznana godzina liturgiczna.");

  const existing = await getTodayLogEntry(supabase, profile.id, date);
  const hours = new Set(existing?.hours ?? []);
  if (hour) hours.add(hour);

  const { error: logError } = await supabase.from("prayer_log").upsert(
    {
      user_id: profile.id,
      prayer_date: date,
      hours: [...hours],
      note: existing?.note ?? null,
    },
    { onConflict: "user_id,prayer_date" }
  );

  if (logError) {
    console.error("[modlitwa] prayer log upsert failed:", logError);
    return actionFailure("Nie udało się zapisać modlitwy. Spróbuj ponownie.");
  }

  const current = await getPrayerStreak(supabase, profile.id);
  // Dzień był już odnotowany -> licznik zostaje, dopisaliśmy tylko godzinę.
  const next = existing ? current : streakAfterPrayer(current, date);
  if (!existing) await persistStreak(supabase, profile.id, next);

  revalidatePath("/modlitwa");
  revalidatePath("/modlitwa/kalendarz");
  revalidatePath("/modlitwa/liturgia");

  return { ok: true, data: { streak: next, hours: [...hours] } };
}

/** Cofa odhaczenie dnia (pomyłka). Streak przelicza się z logu od nowa. */
export async function unmarkPrayed(dateKey: string): Promise<ActionResult<StreakState>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const date = normalizeDateKey(dateKey);
  if (!date) return actionFailure("Nieprawidłowa data.");

  const { error } = await supabase
    .from("prayer_log")
    .delete()
    .eq("user_id", profile.id)
    .eq("prayer_date", date);

  if (error) {
    console.error("[modlitwa] prayer log delete failed:", error);
    return actionFailure("Nie udało się cofnąć wpisu.");
  }

  const recomputed = await recomputeStreakFromLog(supabase, profile.id);
  await persistStreak(supabase, profile.id, recomputed);

  revalidatePath("/modlitwa");
  revalidatePath("/modlitwa/kalendarz");
  return { ok: true, data: recomputed };
}

/** Notatka do dnia („za co się dziś modliłem”). */
export async function savePrayerNote(dateKey: string, note: string): Promise<ActionResult<null>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const date = normalizeDateKey(dateKey);
  if (!date) return actionFailure("Nieprawidłowa data.");

  const trimmed = note.trim().slice(0, 2000);
  const existing = await getTodayLogEntry(supabase, profile.id, date);

  const { error } = await supabase.from("prayer_log").upsert(
    {
      user_id: profile.id,
      prayer_date: date,
      hours: existing?.hours ?? [],
      note: trimmed || null,
    },
    { onConflict: "user_id,prayer_date" }
  );

  if (error) {
    console.error("[modlitwa] prayer note upsert failed:", error);
    return actionFailure("Nie udało się zapisać notatki.");
  }

  revalidatePath("/modlitwa");
  return { ok: true, data: null };
}

/**
 * Odtwarza streak z prayer_log — używane po usunięciu wpisu, żeby licznik nie
 * został „w przyszłości”. Czyta ostatnie 400 dni: dłuższy nieprzerwany łańcuch
 * i tak nie zmieściłby się w rekordzie, a zapytanie zostaje ograniczone.
 */
async function recomputeStreakFromLog(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string
): Promise<StreakState> {
  const { data, error } = await supabase
    .from("prayer_log")
    .select("prayer_date")
    .eq("user_id", userId)
    .order("prayer_date", { ascending: true })
    .limit(400);

  if (error || !data) {
    if (error) console.error("[modlitwa] streak recompute failed:", error);
    return { currentStreak: 0, longestStreak: 0, totalDays: 0, lastPrayerDate: null };
  }

  let state: StreakState = { currentStreak: 0, longestStreak: 0, totalDays: 0, lastPrayerDate: null };
  for (const row of data as Array<{ prayer_date: string }>) {
    state = streakAfterPrayer(state, row.prayer_date);
  }
  return state;
}
