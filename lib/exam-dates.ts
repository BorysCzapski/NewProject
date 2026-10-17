// ============================================================================
// lib/exam-dates.ts
// Calendar-day math (shared by Maturalnik and Informatyka) for the exam-countdown heatmap, done on "YYYY-MM-DD"
// strings in a fixed app time zone instead of on local Date objects: the
// server (UTC on Vercel) and the student's browser disagree about what
// "today" is for a couple of hours every night, and a problem marked done at
// 23:30 Warsaw time is already "tomorrow" in UTC. Using one zone for both
// bucketing activity and laying out the grid keeps them aligned.
// ============================================================================

export const APP_TIME_ZONE = "Europe/Warsaw";

const dayFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: APP_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** "YYYY-MM-DD" of the given instant, as seen in APP_TIME_ZONE. */
export function dayKey(date: Date | string): string {
  return dayFormatter.format(typeof date === "string" ? new Date(date) : date);
}

export function todayKey(): string {
  return dayKey(new Date());
}

function parseKey(key: string): Date {
  return new Date(`${key}T00:00:00Z`);
}

export function addDays(key: string, days: number): string {
  const d = parseKey(key);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** 0 = Monday … 6 = Sunday. */
export function weekdayMonday0(key: string): number {
  return (parseKey(key).getUTCDay() + 6) % 7;
}

export function diffDays(fromKey: string, toKey: string): number {
  return Math.round((parseKey(toKey).getTime() - parseKey(fromKey).getTime()) / 86_400_000);
}

export function formatKeyPl(key: string): string {
  return parseKey(key).toLocaleDateString("pl-PL", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** One problem done on a given day, linking back to it. */
export interface DailyActivityItem {
  label: string;
  href: string;
}

/** What the heatmap shows for a clicked day. */
export interface DailyActivity {
  count: number;
  items: DailyActivityItem[];
}
