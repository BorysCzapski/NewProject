// ============================================================================
// lib/habits/stats.ts
// Czysta logika (bez I/O): procent ukończenia na dzień i wynik regularności.
// Dni z przyszłości nie liczą się do niczego — nie da się ich odhaczyć.
// ============================================================================
export interface DayStat {
  day: string;
  done: number;
  total: number;
  /** 0–100, albo null dla dni z przyszłości lub gdy nie ma nawyków. */
  pct: number | null;
  isFuture: boolean;
}

/** `checks`: klucze "habitId|day". */
export function dayStats(
  days: string[],
  habitIds: string[],
  checks: Set<string>,
  today: string
): DayStat[] {
  return days.map((day) => {
    const isFuture = day > today;
    const done = isFuture ? 0 : habitIds.filter((id) => checks.has(`${id}|${day}`)).length;
    const total = habitIds.length;
    const pct = isFuture || total === 0 ? null : Math.round((done / total) * 100);
    return { day, done, total, pct, isFuture };
  });
}

/** Odsetek odhaczonych pól wśród dni do dziś włącznie (0–100) albo null. */
export function consistencyScore(stats: DayStat[]): number | null {
  let done = 0;
  let total = 0;
  for (const s of stats) {
    if (s.isFuture) continue;
    done += s.done;
    total += s.total;
  }
  return total === 0 ? null : Math.round((done / total) * 100);
}
