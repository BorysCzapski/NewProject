// ============================================================================
// lib/habits/dates.ts
// Daty "YYYY-MM-DD" w strefie Europe/Warsaw i okno 7 dni dla Habit Tracking.
// Bez importów z next/react — działa na serwerze i w kliencie.
// ============================================================================
const TZ = "Europe/Warsaw";
export const WINDOW_DAYS = 7;

export function todayKey(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: TZ }).format(new Date());
}

export function isValidDateKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = value.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
}

export function addDays(dateKey: string, days: number): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

/** 7 kolejnych dni od `start` (włącznie). */
export function windowDays(start: string): string[] {
  return Array.from({ length: WINDOW_DAYS }, (_, i) => addDays(start, i));
}

const weekday = new Intl.DateTimeFormat("pl-PL", { weekday: "short", timeZone: "UTC" });
const dayMonth = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "short", timeZone: "UTC" });

function utc(dateKey: string): Date {
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function weekdayLabel(dateKey: string): string {
  return weekday.format(utc(dateKey)).replace(".", "");
}

export function dayMonthLabel(dateKey: string): string {
  return dayMonth.format(utc(dateKey));
}

export function rangeLabel(start: string): string {
  return `${dayMonthLabel(start)} – ${dayMonthLabel(addDays(start, WINDOW_DAYS - 1))}`;
}
