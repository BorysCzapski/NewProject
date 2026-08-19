// ============================================================================
// lib/modlitwa/streak.ts
// Czysta logika streaka modlitewnego — bez I/O, żeby dała się przetestować i
// żeby ta sama reguła obowiązywała przy zapisie (akcja) i przy odczycie (UI).
//
// Reguła: streak liczy KOLEJNE dni kalendarzowe z wpisem w prayer_log.
//   - modlitwa dziś, gdy ostatnia była wczoraj  -> streak + 1
//   - modlitwa dziś, gdy ostatnia była dziś     -> bez zmian (dzień już policzony)
//   - modlitwa dziś po dłuższej przerwie        -> streak = 1 (łańcuch zerwany)
// Dzień „nieodhaczony” nie kasuje danych — dopiero odczyt pokazuje 0, bo
// łańcuch przerwany to fakt, a nie zdarzenie do zapisania (spec: „streak
// zostaje przerwany, a aplikacja informuje o tym”).
// ============================================================================
import { addDays, daysBetween, fromDateKey, toDateKey } from "@/lib/modlitwa/liturgical-calendar";

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  lastPrayerDate: string | null;
}

export const EMPTY_STREAK: StreakState = {
  currentStreak: 0,
  longestStreak: 0,
  totalDays: 0,
  lastPrayerDate: null,
};

/** Nowy stan streaka po odhaczeniu modlitwy w dniu `dateKey`. */
export function streakAfterPrayer(state: StreakState, dateKey: string): StreakState {
  if (state.lastPrayerDate === dateKey) return state;

  const gap =
    state.lastPrayerDate === null
      ? Number.POSITIVE_INFINITY
      : daysBetween(fromDateKey(state.lastPrayerDate), fromDateKey(dateKey));

  // gap < 0 = wpis wstecz (użytkownik uzupełnia wcześniejszy dzień): liczba
  // dni ogółem rośnie, ale bieżący łańcuch liczony od ostatniego dnia nie.
  if (gap < 0) {
    return { ...state, totalDays: state.totalDays + 1 };
  }

  const currentStreak = gap === 1 ? state.currentStreak + 1 : 1;

  return {
    currentStreak,
    longestStreak: Math.max(state.longestStreak, currentStreak),
    totalDays: state.totalDays + 1,
    lastPrayerDate: dateKey,
  };
}

/**
 * Streak widziany „dziś”. Zapisany licznik może być nieaktualny (nikt nie
 * przelicza go w nocy), więc łańcuch starszy niż wczoraj pokazujemy jako 0.
 */
export function effectiveStreak(state: StreakState, todayKey: string): number {
  if (!state.lastPrayerDate) return 0;
  const gap = daysBetween(fromDateKey(state.lastPrayerDate), fromDateKey(todayKey));
  if (gap <= 0) return state.currentStreak;
  if (gap === 1) return state.currentStreak;
  return 0;
}

/** Czy łańcuch został przerwany (do komunikatu „streak przerwany”). */
export function isStreakBroken(state: StreakState, todayKey: string): boolean {
  if (!state.lastPrayerDate || state.currentStreak === 0) return false;
  return daysBetween(fromDateKey(state.lastPrayerDate), fromDateKey(todayKey)) > 1;
}

/** Czy modlitwa na dziś jest już odhaczona. */
export function hasPrayedToday(state: StreakState, todayKey: string): boolean {
  return state.lastPrayerDate === todayKey;
}

/** Ostatnie `days` dni (od najstarszego) z informacją, czy był wpis. */
export function buildStreakStrip(
  loggedDates: string[],
  todayKey: string,
  days = 7
): Array<{ date: string; prayed: boolean }> {
  const logged = new Set(loggedDates);
  const today = fromDateKey(todayKey);
  const strip: Array<{ date: string; prayed: boolean }> = [];
  for (let offset = days - 1; offset >= 0; offset--) {
    const key = toDateKey(addDays(today, -offset));
    strip.push({ date: key, prayed: logged.has(key) });
  }
  return strip;
}
