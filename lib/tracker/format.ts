// ============================================================================
// lib/tracker/format.ts
// Daty i etykiety Trackera. Bez importów z next/react i bez "server-only":
// te same funkcje działają na serwerze (strona, akcje) i w przeglądarce
// (formularz, wykres).
//
// Dzień to zwykły klucz kalendarzowy "YYYY-MM-DD" liczony w UTC — kolumna
// tracker_days.day jest typu `date`, bez godziny i strefy. Strefa wchodzi w
// grę tylko przy ustalaniu, który dzień jest "dzisiaj" (todayKey, Europe/Warsaw),
// żeby wpis zrobiony o 23:30 nie wyglądał na jutrzejszy.
// ============================================================================

const WARSAW_TZ = "Europe/Warsaw";

export function todayKey(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: WARSAW_TZ }).format(new Date());
}

export function isValidDateKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  // Odsiewa daty składniowo poprawne, ale nieistniejące (2026-02-31).
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

export function daysBetween(from: string, to: string): number {
  return Math.round((parseKey(to).getTime() - parseKey(from).getTime()) / 86_400_000);
}

const MONTHS_SHORT = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];
const WEEKDAYS = ["niedziela", "poniedziałek", "wtorek", "środa", "czwartek", "piątek", "sobota"];

/** "12 paź" — krótka etykieta osi. */
export function formatDayTick(dateKey: string): string {
  const date = parseKey(dateKey);
  return `${date.getUTCDate()} ${MONTHS_SHORT[date.getUTCMonth()]}`;
}

/** "poniedziałek, 12 paź 2026" — pełna etykieta w tooltipie i na liście. */
export function formatDayLong(dateKey: string): string {
  const date = parseKey(dateKey);
  return `${WEEKDAYS[date.getUTCDay()]}, ${date.getUTCDate()} ${MONTHS_SHORT[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function plural(count: number, one: string, few: string, many: string): string {
  const n = Math.abs(count);
  if (n === 1) return one;
  const lastTwo = n % 100;
  const last = n % 10;
  if (last >= 2 && last <= 4 && !(lastTwo >= 12 && lastTwo <= 14)) return few;
  return many;
}

/** 1.5 -> "1 h 30 min", 0.25 -> "15 min", 2 -> "2 h". */
export function formatHours(hours: number): string {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} h`;
  return `${h} h ${m} min`;
}
