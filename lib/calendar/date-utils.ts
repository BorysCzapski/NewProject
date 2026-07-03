// ============================================================================
// lib/calendar/date-utils.ts
// Pure date helpers for the month calendar grid. Deliberately avoids
// Date#toISOString() (which converts to UTC and can shift the calendar day
// depending on the browser's timezone) — dates are built directly from
// year/month/day integers so the grid always matches the user's local view.
// ============================================================================

/** Monday-first weekday headers, matching the grid's week layout. */
export const WEEKDAY_LABELS = ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Nd"];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Formats a local year/month(0-indexed)/day as a Postgres-style "YYYY-MM-DD" key. */
export function formatDateKey(year: number, monthIndex: number, day: number): string {
  return `${year}-${pad(monthIndex + 1)}-${pad(day)}`;
}

/** First and last day (inclusive) of the given month, as "YYYY-MM-DD" strings. */
export function getMonthBounds(year: number, monthIndex: number): { start: string; end: string } {
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  return {
    start: formatDateKey(year, monthIndex, 1),
    end: formatDateKey(year, monthIndex, lastDay),
  };
}

export interface CalendarCell {
  day: number | null;
  dateKey: string | null;
}

/**
 * Builds a Monday-first calendar grid for the given month as an array of
 * weeks (each an array of 7 cells). Leading/trailing cells outside the month
 * are `{ day: null, dateKey: null }`.
 */
export function buildCalendarGrid(year: number, monthIndex: number): CalendarCell[][] {
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstWeekday = new Date(year, monthIndex, 1).getDay(); // 0 = Sunday
  const leadingBlanks = (firstWeekday + 6) % 7; // convert to Monday-first offset

  const cells: CalendarCell[] = [];
  for (let i = 0; i < leadingBlanks; i++) cells.push({ day: null, dateKey: null });
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push({ day, dateKey: formatDateKey(year, monthIndex, day) });
  }
  while (cells.length % 7 !== 0) cells.push({ day: null, dateKey: null });

  const weeks: CalendarCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}
