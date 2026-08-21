// ============================================================================
// lib/godziny/format.ts
// Czas, daty i polska odmiana dla mini-aplikacji "Godziny". Świadomie bez
// importów z next/react i bez "server-only" — te same funkcje liczą etykiety
// na serwerze (strony, podsumowania) i na kliencie (formularz, filtry), więc
// muszą działać po obu stronach.
//
// Klucz daty ("YYYY-MM-DD") traktujemy jak zwykłą datę kalendarzową i liczymy
// na nim w UTC. To NIE jest niedopatrzenie strefy czasowej: kolumna
// study_sessions.study_date jest typu `date`, więc nie ma godziny ani strefy.
// Strefa wchodzi w grę tylko w jednym miejscu — przy ustalaniu, który dzień
// jest „dzisiaj" (todayKey), i tam pytamy wprost o Europe/Warsaw.
// ============================================================================

const WARSAW_TZ = "Europe/Warsaw";

/** Dzisiejsza data w Polsce jako "YYYY-MM-DD" ("sv-SE" daje wprost format ISO). */
export function todayKey(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: WARSAW_TZ }).format(new Date());
}

export function isValidDateKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  // Odsiewa daty składniowo poprawne, ale nieistniejące (np. 2026-02-31,
  // które Date.UTC po cichu przesunęłoby na 3 marca).
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

function parseKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function toKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function addDays(dateKey: string, days: number): string {
  const date = parseKey(dateKey);
  date.setUTCDate(date.getUTCDate() + days);
  return toKey(date);
}

/** Liczba dni od `from` do `to` (ujemna, gdy `to` jest wcześniej). */
export function daysBetween(from: string, to: string): number {
  return Math.round((parseKey(to).getTime() - parseKey(from).getTime()) / 86_400_000);
}

// ---------------------------------------------------------------------------
// Kubełki: dzień / tydzień / miesiąc (spec: „historia wg dni, tygodni lub
// miesięcy"). Każdy kubełek reprezentujemy kluczem jego PIERWSZEGO dnia, więc
// sortowanie kubełków to zwykłe sortowanie stringów.
// ---------------------------------------------------------------------------

export type Grouping = "day" | "week" | "month";

export const GROUPING_LABELS: Record<Grouping, string> = {
  day: "Dni",
  week: "Tygodnie",
  month: "Miesiące",
};

export function isGrouping(value: string | undefined): value is Grouping {
  return value === "day" || value === "week" || value === "month";
}

/** Poniedziałek tygodnia, w którym leży `dateKey` (w Polsce tydzień zaczyna się w pn.). */
export function weekStart(dateKey: string): string {
  const date = parseKey(dateKey);
  // getUTCDay(): 0 = niedziela. Przesuwamy o (dzień + 6) % 7, żeby niedziela
  // trafiła do tygodnia, który się właśnie kończy, a nie do następnego.
  const shift = (date.getUTCDay() + 6) % 7;
  return addDays(dateKey, -shift);
}

export function monthStart(dateKey: string): string {
  return `${dateKey.slice(0, 7)}-01`;
}

export function bucketStart(dateKey: string, grouping: Grouping): string {
  if (grouping === "week") return weekStart(dateKey);
  if (grouping === "month") return monthStart(dateKey);
  return dateKey;
}

// ---------------------------------------------------------------------------
// Etykiety
// ---------------------------------------------------------------------------

const dayMonthFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});
const weekdayFormatter = new Intl.DateTimeFormat("pl-PL", {
  weekday: "short",
  timeZone: "UTC",
});
const monthYearFormatter = new Intl.DateTimeFormat("pl-PL", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const dayMonthShortFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const monthShortFormatter = new Intl.DateTimeFormat("pl-PL", {
  month: "short",
  year: "2-digit",
  timeZone: "UTC",
});

/** "Dziś" / "Wczoraj" / "pon., 12 sierpnia" — do nagłówków dnia w streamie. */
export function formatDayLabel(dateKey: string, today = todayKey()): string {
  const diff = daysBetween(dateKey, today);
  if (diff === 0) return "Dziś";
  if (diff === 1) return "Wczoraj";
  const date = parseKey(dateKey);
  return `${weekdayFormatter.format(date)}, ${dayMonthFormatter.format(date)}`;
}

/** "12–18 sierpnia" (albo "29 lipca – 4 sierpnia", gdy tydzień przechodzi przez miesiąc). */
export function formatWeekLabel(startKey: string): string {
  const endKey = addDays(startKey, 6);
  const start = parseKey(startKey);
  const end = parseKey(endKey);
  if (startKey.slice(0, 7) === endKey.slice(0, 7)) {
    return `${start.getUTCDate()}–${dayMonthFormatter.format(end)}`;
  }
  return `${dayMonthFormatter.format(start)} – ${dayMonthFormatter.format(end)}`;
}

export function formatMonthLabel(startKey: string): string {
  return monthYearFormatter.format(parseKey(startKey));
}

export function formatBucketLabel(startKey: string, grouping: Grouping, today = todayKey()): string {
  if (grouping === "week") return formatWeekLabel(startKey);
  if (grouping === "month") return formatMonthLabel(startKey);
  return formatDayLabel(startKey, today);
}

/**
 * Krótka etykieta pod oś wykresu — "12 sie", "sie 26". Osobna od
 * formatBucketLabel, bo na osi mieści się ułamek tego, co w nagłówku listy.
 */
export function formatBucketTick(startKey: string, grouping: Grouping): string {
  if (grouping === "month") return monthShortFormatter.format(parseKey(startKey));
  return dayMonthShortFormatter.format(parseKey(startKey));
}

// ---------------------------------------------------------------------------
// Czas nauki
// ---------------------------------------------------------------------------

/**
 * "2 godz. 30 min" / "45 min" / "3 godz.". Skróty, a nie pełne słowa, są tu
 * celowe — "godz." i "min" nie odmieniają się przez liczbę, więc nie trzeba
 * wybierać między "2 godziny" a "5 godzin" przy każdej sumie.
 */
export function formatMinutes(totalMinutes: number): string {
  const minutes = Math.max(0, Math.round(totalMinutes));
  if (minutes === 0) return "0 min";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} godz.`;
  return `${hours} godz. ${rest} min`;
}

/** Godziny z jednym miejscem po przecinku — do osi wykresu, gdzie "2 godz. 30 min" się nie mieści. */
export function formatHours(totalMinutes: number): string {
  const hours = totalMinutes / 60;
  const decimals = Number.isInteger(hours) || hours >= 10 ? 0 : 1;
  return `${hours.toFixed(decimals).replace(".", ",")} h`;
}

/**
 * Polska odmiana przez liczbę: plural(1, "wpis", "wpisy", "wpisów").
 * Reguła: 1 → forma pojedyncza; końcówki 2-4 (poza 12-14) → forma "few";
 * reszta → dopełniacz mnogi.
 */
export function plural(count: number, one: string, few: string, many: string): string {
  const n = Math.abs(count);
  if (n === 1) return one;
  const lastTwo = n % 100;
  const last = n % 10;
  if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return few;
  return many;
}

export function formatEntryCount(count: number): string {
  return `${count} ${plural(count, "wpis", "wpisy", "wpisów")}`;
}
