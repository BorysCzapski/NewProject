// ============================================================================
// lib/paragony/etf-metrics.ts
// Pure, framework/DB-free portfolio math — every value here is computed
// from real transaction/dividend/price rows the caller passes in, never
// simulated or hardcoded. Kept dependency-free and unit-testable in
// isolation from lib/paragony/etf-queries.ts, which does the Supabase reads
// and feeds this module.
// ============================================================================
import type { EtfTransaction } from "@/lib/types/database";
import type { PriceCacheEntry } from "@/lib/paragony/etf-prices";

export interface HoldingPosition {
  units: number;
  averageCost: number;
  totalCost: number;
}

/** Average-cost-basis method: a sell reduces cost basis proportionally to
 * the average cost per unit at the time of the sale (not FIFO/LIFO lot
 * tracking) — the standard simplified approach for a personal portfolio
 * tracker, matches what most brokers show as "average purchase price". */
export function computeHoldingPosition(transactions: EtfTransaction[]): HoldingPosition {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime()
  );

  let units = 0;
  let totalCost = 0;
  for (const tx of sorted) {
    if (tx.type === "buy") {
      totalCost += tx.units * tx.price_per_unit;
      units += tx.units;
    } else {
      const avgCost = units > 0 ? totalCost / units : 0;
      units = Math.max(0, units - tx.units);
      totalCost = Math.max(0, totalCost - avgCost * tx.units);
    }
  }

  return { units, averageCost: units > 0 ? totalCost / units : 0, totalCost };
}

/** Applies one hypothetical buy/sell to an already-computed position, using
 * the same average-cost-basis method as computeHoldingPosition — lets the
 * "what if" simulator (components/paragony/etf-simulator.tsx) recompute
 * instantly from the current aggregate position instead of re-deriving from
 * full transaction history (the two are mathematically equivalent under the
 * average-cost method, since applying a trade is associative). */
export function applyHypotheticalTrade(
  position: HoldingPosition,
  type: "buy" | "sell",
  units: number,
  pricePerUnit: number
): HoldingPosition {
  if (type === "buy") {
    const totalCost = position.totalCost + units * pricePerUnit;
    const totalUnits = position.units + units;
    return { units: totalUnits, totalCost, averageCost: totalUnits > 0 ? totalCost / totalUnits : 0 };
  }
  const soldUnits = Math.min(units, position.units);
  const totalCost = Math.max(0, position.totalCost - position.averageCost * soldUnits);
  const totalUnits = Math.max(0, position.units - soldUnits);
  return { units: totalUnits, totalCost, averageCost: totalUnits > 0 ? totalCost / totalUnits : 0 };
}

/** Units held as of a given date (inclusive) — the building block for the
 * portfolio value-over-time series, since holdings change as buys/sells
 * happen on different dates. */
export function unitsHeldAsOf(transactions: EtfTransaction[], asOfDate: string): number {
  let units = 0;
  for (const tx of transactions) {
    if (tx.transaction_date > asOfDate) continue;
    units += tx.type === "buy" ? tx.units : -tx.units;
  }
  return Math.max(0, units);
}

export interface PortfolioValuePoint {
  date: string;
  value: number;
}

interface HoldingSeriesInput {
  ticker: string;
  transactions: EtfTransaction[];
  prices: PriceCacheEntry[];
}

/** Day-by-day portfolio value across ALL holdings, over the union of every
 * holding's cached price dates. For a date where a given ticker has no
 * quote yet (weekend/holiday not in the cache), carries forward the most
 * recent known close instead of dropping the day. */
export function computePortfolioValueSeries(holdings: HoldingSeriesInput[]): PortfolioValuePoint[] {
  const allDates = new Set<string>();
  for (const h of holdings) for (const p of h.prices) allDates.add(p.price_date);
  const sortedDates = Array.from(allDates).sort();

  return sortedDates.map((date) => {
    let value = 0;
    for (const h of holdings) {
      const units = unitsHeldAsOf(h.transactions, date);
      if (units <= 0) continue;
      let lastKnown: PriceCacheEntry | undefined;
      for (const p of h.prices) {
        if (p.price_date > date) break;
        lastKnown = p;
      }
      if (lastKnown) value += units * lastKnown.close_price;
    }
    return { date, value };
  });
}

/** (end value - cost basis + dividends) / cost basis. */
export function computeTotalReturn(currentValue: number, costBasis: number, dividendsReceived: number): number {
  if (costBasis <= 0) return 0;
  return (currentValue - costBasis + dividendsReceived) / costBasis;
}

/** Compound annual growth rate, normalized to actual holding period. */
export function computeCAGR(
  currentValue: number,
  costBasis: number,
  dividendsReceived: number,
  holdingYears: number
): number {
  if (costBasis <= 0 || holdingYears <= 0) return 0;
  const totalReturnMultiple = (currentValue + dividendsReceived) / costBasis;
  if (totalReturnMultiple <= 0) return -1;
  return Math.pow(totalReturnMultiple, 1 / holdingYears) - 1;
}

/** Annualized standard deviation of period-over-period returns of the value
 * series (assumes ~daily EOD points; 252 = average trading days/year). */
export function computeVolatility(series: PortfolioValuePoint[]): number {
  if (series.length < 3) return 0;

  const returns: number[] = [];
  for (let i = 1; i < series.length; i++) {
    const prev = series[i - 1].value;
    if (prev <= 0) continue;
    returns.push((series[i].value - prev) / prev);
  }
  if (returns.length < 2) return 0;

  const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const variance = returns.reduce((sum, r) => sum + (r - mean) ** 2, 0) / (returns.length - 1);
  return Math.sqrt(variance) * Math.sqrt(252);
}

/** Largest peak-to-trough decline in the series, as a negative fraction
 * (e.g. -0.23 = a 23% drawdown at its worst point). */
export function computeMaxDrawdown(series: PortfolioValuePoint[]): number {
  let peak = -Infinity;
  let maxDrawdown = 0;
  for (const point of series) {
    if (point.value > peak) peak = point.value;
    if (peak > 0) {
      const drawdown = (point.value - peak) / peak;
      if (drawdown < maxDrawdown) maxDrawdown = drawdown;
    }
  }
  return maxDrawdown;
}

export interface AllocationSlice {
  label: string;
  value: number;
  percent: number;
}

export function computeAllocation(items: Array<{ label: string; value: number }>): AllocationSlice[] {
  const total = items.reduce((sum, i) => sum + i.value, 0);
  return items
    .filter((i) => i.value > 0)
    .map((i) => ({ label: i.label, value: i.value, percent: total > 0 ? (i.value / total) * 100 : 0 }))
    .sort((a, b) => b.value - a.value);
}
