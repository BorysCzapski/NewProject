// ============================================================================
// lib/tracker/stats.ts
// Czysta logika Trackera: wartości metryk i porównanie jednego dnia z resztą.
// Bez I/O, żeby dało się ją przeczytać i sprawdzić bez bazy.
//
// Porównania liczymy ZAWSZE na całej historii, nie na widocznym zakresie
// wykresu — "ten dzień na tle moich dni" nie może się zmieniać od tego, czy
// akurat patrzysz na 7 czy 90 dni.
// ============================================================================
import { addDays, daysBetween } from "@/lib/tracker/format";

export interface DayPoint {
  day: string;
  hours: number;
  tasks: number;
  note: string | null;
}

export type MetricKey = "hours" | "tasks" | "pace";

export const METRICS: Record<MetricKey, { label: string; unit: string }> = {
  hours: { label: "Godziny", unit: "h" },
  tasks: { label: "Zadania", unit: "" },
  pace: { label: "Tempo", unit: "zad./h" },
};

/** Wartość metryki dla dnia. Tempo to zadania na godzinę, 0 gdy nie było pracy. */
export function metricValue(point: DayPoint, key: MetricKey): number {
  if (key === "hours") return point.hours;
  if (key === "tasks") return point.tasks;
  return point.hours > 0 ? Math.round((point.tasks / point.hours) * 100) / 100 : 0;
}

export interface DayComparison {
  value: number;
  /** Poprzedni ZAPISANY dzień (niekoniecznie wczoraj). */
  prevValue: number | null;
  deltaPrev: number | null;
  /** Zmiana względem poprzedniego dnia w %, null gdy poprzednia wartość to 0. */
  pctPrev: number | null;
  /** Średnia z pozostałych dni. */
  avgOthers: number | null;
  pctVsAvg: number | null;
  /** Odsetek pozostałych dni, które były słabsze (0-100); null przy jednym dniu. */
  betterThanPct: number | null;
  /** 1 = najlepszy dzień w historii. */
  rank: number;
  total: number;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

export function compareDay(points: DayPoint[], index: number, key: MetricKey): DayComparison {
  const value = metricValue(points[index], key);
  const values = points.map((p) => metricValue(p, key));
  const others = values.filter((_, i) => i !== index);

  const prevValue = index > 0 ? values[index - 1] : null;
  const deltaPrev = prevValue === null ? null : round1(value - prevValue);
  const pctPrev = prevValue === null || prevValue === 0 ? null : round1(((value - prevValue) / prevValue) * 100);

  const avgOthers = others.length ? others.reduce((a, b) => a + b, 0) / others.length : null;
  const pctVsAvg =
    avgOthers === null || avgOthers === 0 ? null : round1(((value - avgOthers) / avgOthers) * 100);

  const lower = others.filter((v) => v < value).length;
  const betterThanPct = others.length ? Math.round((lower / others.length) * 100) : null;
  const rank = 1 + others.filter((v) => v > value).length;

  return {
    value,
    prevValue,
    deltaPrev,
    pctPrev,
    avgOthers: avgOthers === null ? null : round1(avgOthers),
    pctVsAvg,
    betterThanPct,
    rank,
    total: points.length,
  };
}

/** Kierunek zmiany do kolorowania punktu jak na giełdzie. */
export function direction(delta: number | null): "up" | "down" | "flat" {
  if (delta === null || delta === 0) return "flat";
  return delta > 0 ? "up" : "down";
}

export type RangeKey = "7" | "30" | "90" | "all";

export const RANGES: Array<{ key: RangeKey; label: string }> = [
  { key: "7", label: "7 dni" },
  { key: "30", label: "30 dni" },
  { key: "90", label: "90 dni" },
  { key: "all", label: "Wszystko" },
];

/** Indeksy punktów mieszczących się w zakresie liczonym wstecz od `today`. */
export function visibleIndexes(points: DayPoint[], range: RangeKey, today: string): number[] {
  if (range === "all") return points.map((_, i) => i);
  const from = addDays(today, -(Number(range) - 1));
  return points.map((p, i) => (p.day >= from ? i : -1)).filter((i) => i >= 0);
}

/**
 * Seria dni pracy z rzędu, kończąca się dzisiaj albo wczoraj (dzisiejszy dzień
 * jeszcze się nie skończył, więc brak wpisu NIE zeruje serii). Dzień liczy się,
 * gdy są w nim godziny albo zadania.
 */
export function currentStreak(points: DayPoint[], today: string): number {
  const active = new Set(points.filter((p) => p.hours > 0 || p.tasks > 0).map((p) => p.day));
  let cursor = active.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (active.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

/** Średnia metryki z ostatnich `days` dni kalendarzowych (dni bez wpisu = 0). */
export function averageLastDays(points: DayPoint[], key: MetricKey, days: number, today: string): number {
  const from = addDays(today, -(days - 1));
  const inWindow = points.filter((p) => p.day >= from && p.day <= today);
  if (key === "pace") {
    const hours = inWindow.reduce((sum, p) => sum + p.hours, 0);
    const tasks = inWindow.reduce((sum, p) => sum + p.tasks, 0);
    return hours > 0 ? round1(tasks / hours) : 0;
  }
  const total = inWindow.reduce((sum, p) => sum + metricValue(p, key), 0);
  const span = Math.min(days, Math.max(1, daysBetween(points[0]?.day ?? today, today) + 1));
  return round1(total / span);
}
