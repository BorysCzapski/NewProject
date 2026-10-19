// ============================================================================
// lib/silownia/format.ts
// Data i drobne formatery dla "Siłowni". Bez importów z next/react i bez
// "server-only" — te same funkcje liczą etykiety na serwerze (strony) i na
// kliencie (formularze), więc muszą działać po obu stronach. Ten sam wzorzec
// co lib/tracker/format.ts.
// ============================================================================

const WARSAW_TZ = "Europe/Warsaw";

/** Dzisiejsza data w Polsce jako "YYYY-MM-DD" ("sv-SE" daje wprost format ISO). */
export function todayKey(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: WARSAW_TZ }).format(new Date());
}

export function isValidDateKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
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

export function addDays(dateKey: string, days: number): string {
  const date = parseKey(dateKey);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** Poniedziałek tygodnia, w którym leży `dateKey` (w Polsce tydzień zaczyna się w pn.). */
export function weekStart(dateKey: string): string {
  const date = parseKey(dateKey);
  const shift = (date.getUTCDay() + 6) % 7;
  return addDays(dateKey, -shift);
}

export function monthStart(dateKey: string): string {
  return `${dateKey.slice(0, 7)}-01`;
}

const dayMonthFormatter = new Intl.DateTimeFormat("pl-PL", {
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});
const weekdayFormatter = new Intl.DateTimeFormat("pl-PL", { weekday: "short", timeZone: "UTC" });

/** "Dziś" / "Wczoraj" / "pon., 12 sierpnia" — do nagłówków wpisów. */
export function formatDayLabel(dateKey: string, today = todayKey()): string {
  if (dateKey === today) return "Dziś";
  if (dateKey === addDays(today, -1)) return "Wczoraj";
  const date = parseKey(dateKey);
  return `${weekdayFormatter.format(date)}, ${dayMonthFormatter.format(date)}`;
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
