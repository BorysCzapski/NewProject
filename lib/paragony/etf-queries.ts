// ============================================================================
// lib/paragony/etf-queries.ts
// Orchestrates the ETF portfolio view-model: refreshes each held ticker's
// price cache (see lib/paragony/etf-prices.ts — capped at once/day/ticker),
// then feeds real transaction/dividend/price rows into the pure math in
// lib/paragony/etf-metrics.ts. Nothing here is simulated — every number
// traces back to a stored transaction, dividend, or cached market price.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { EtfDividend, EtfHolding, EtfTransaction } from "@/lib/types/database";
import { refreshEtfPriceCache, getCachedPrices, getLatestCachedPrice, type PriceCacheEntry } from "@/lib/paragony/etf-prices";
import {
  computeHoldingPosition,
  computePortfolioValueSeries,
  computeTotalReturn,
  computeCAGR,
  computeVolatility,
  computeMaxDrawdown,
  computeAllocation,
  type PortfolioValuePoint,
  type AllocationSlice,
} from "@/lib/paragony/etf-metrics";

export interface HoldingSummary {
  holding: EtfHolding;
  units: number;
  averageCost: number;
  totalCost: number;
  currentPrice: number | null;
  currentPriceDate: string | null;
  /** True when the shown price isn't from today — a refresh failed or
   * hasn't happened yet; the UI should annotate "dane z dnia X". */
  priceStale: boolean;
  currentValue: number;
  unrealizedGain: number;
  unrealizedGainPercent: number;
  dividendsReceived: number;
}

export interface PortfolioOverview {
  holdings: HoldingSummary[];
  totalValue: number;
  totalCostBasis: number;
  totalDividends: number;
  totalReturn: number;
  cagr: number;
  volatility: number;
  maxDrawdown: number;
  valueSeries: PortfolioValuePoint[];
  allocationByTicker: AllocationSlice[];
  allocationByAssetClass: AllocationSlice[];
  allocationByRegion: AllocationSlice[];
  largestPositionPercent: number;
}

function emptyOverview(): PortfolioOverview {
  return {
    holdings: [],
    totalValue: 0,
    totalCostBasis: 0,
    totalDividends: 0,
    totalReturn: 0,
    cagr: 0,
    volatility: 0,
    maxDrawdown: 0,
    valueSeries: [],
    allocationByTicker: [],
    allocationByAssetClass: [],
    allocationByRegion: [],
    largestPositionPercent: 0,
  };
}

export async function getPortfolioOverview(supabase: SupabaseClient, userId: string): Promise<PortfolioOverview> {
  const { data: holdingRows, error: holdingsError } = await supabase
    .from("etf_holdings")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (holdingsError) console.error("[paragony] etf_holdings query failed:", holdingsError);

  const holdings = (holdingRows ?? []) as EtfHolding[];
  if (holdings.length === 0) return emptyOverview();

  const holdingIds = holdings.map((h) => h.id);
  const [{ data: txRows }, { data: divRows }] = await Promise.all([
    supabase.from("etf_transactions").select("*").in("holding_id", holdingIds),
    supabase.from("etf_dividends").select("*").in("holding_id", holdingIds),
  ]);
  const allTransactions = (txRows ?? []) as EtfTransaction[];
  const allDividends = (divRows ?? []) as EtfDividend[];

  // Refresh each ticker's cache at most once (unique(user_id, ticker) means
  // one row per ticker anyway, but dedupe defensively).
  const byTicker = new Map(holdings.map((h) => [h.ticker, h]));
  await Promise.all(
    Array.from(byTicker.values()).map((h) => refreshEtfPriceCache(h.ticker, h.provider, h.currency))
  );

  const today = new Date().toISOString().slice(0, 10);
  let earliestTransactionDate: string | null = null;
  const holdingSeries: Array<{ ticker: string; transactions: EtfTransaction[]; prices: PriceCacheEntry[] }> = [];
  const summaries: HoldingSummary[] = [];

  for (const holding of holdings) {
    const transactions = allTransactions.filter((t) => t.holding_id === holding.id);
    const dividends = allDividends.filter((d) => d.holding_id === holding.id);
    const position = computeHoldingPosition(transactions);

    const prices = await getCachedPrices(supabase, holding.ticker);
    holdingSeries.push({ ticker: holding.ticker, transactions, prices });

    const latestPrice =
      prices.length > 0 ? prices[prices.length - 1] : await getLatestCachedPrice(supabase, holding.ticker);
    const currentPrice = latestPrice?.close_price ?? null;
    const priceStale = !!latestPrice && latestPrice.price_date !== today;

    const currentValue = currentPrice !== null ? position.units * currentPrice : 0;
    const dividendsReceived = dividends.reduce((sum, d) => sum + d.amount, 0);
    const unrealizedGain = currentValue - position.totalCost + dividendsReceived;
    const unrealizedGainPercent = position.totalCost > 0 ? (unrealizedGain / position.totalCost) * 100 : 0;

    for (const tx of transactions) {
      if (!earliestTransactionDate || tx.transaction_date < earliestTransactionDate) {
        earliestTransactionDate = tx.transaction_date;
      }
    }

    summaries.push({
      holding,
      units: position.units,
      averageCost: position.averageCost,
      totalCost: position.totalCost,
      currentPrice,
      currentPriceDate: latestPrice?.price_date ?? null,
      priceStale,
      currentValue,
      unrealizedGain,
      unrealizedGainPercent,
      dividendsReceived,
    });
  }

  const totalValue = summaries.reduce((sum, s) => sum + s.currentValue, 0);
  const totalCostBasis = summaries.reduce((sum, s) => sum + s.totalCost, 0);
  const totalDividends = summaries.reduce((sum, s) => sum + s.dividendsReceived, 0);

  const valueSeries = computePortfolioValueSeries(holdingSeries);
  const holdingYears = earliestTransactionDate
    ? Math.max((Date.now() - new Date(earliestTransactionDate).getTime()) / (365.25 * 86_400_000), 1 / 365)
    : 0;

  const allocationByTicker = computeAllocation(
    summaries.map((s) => ({ label: s.holding.ticker.toUpperCase(), value: s.currentValue }))
  );

  const assetClassMap = new Map<string, number>();
  const regionMap = new Map<string, number>();
  for (const s of summaries) {
    const assetClass = s.holding.asset_class || "Nieokreślona";
    const region = s.holding.region || "Nieokreślony";
    assetClassMap.set(assetClass, (assetClassMap.get(assetClass) ?? 0) + s.currentValue);
    regionMap.set(region, (regionMap.get(region) ?? 0) + s.currentValue);
  }

  return {
    holdings: summaries,
    totalValue,
    totalCostBasis,
    totalDividends,
    totalReturn: computeTotalReturn(totalValue, totalCostBasis, totalDividends),
    cagr: computeCAGR(totalValue, totalCostBasis, totalDividends, holdingYears),
    volatility: computeVolatility(valueSeries),
    maxDrawdown: computeMaxDrawdown(valueSeries),
    valueSeries,
    allocationByTicker,
    allocationByAssetClass: computeAllocation(
      Array.from(assetClassMap.entries()).map(([label, value]) => ({ label, value }))
    ),
    allocationByRegion: computeAllocation(
      Array.from(regionMap.entries()).map(([label, value]) => ({ label, value }))
    ),
    largestPositionPercent: allocationByTicker[0]?.percent ?? 0,
  };
}

export interface HoldingDetail {
  holding: EtfHolding;
  transactions: EtfTransaction[];
  dividends: EtfDividend[];
  position: ReturnType<typeof computeHoldingPosition>;
}

export async function getHoldingDetail(supabase: SupabaseClient, holdingId: string): Promise<HoldingDetail | null> {
  const [{ data: holding }, { data: transactions }, { data: dividends }] = await Promise.all([
    supabase.from("etf_holdings").select("*").eq("id", holdingId).maybeSingle(),
    supabase
      .from("etf_transactions")
      .select("*")
      .eq("holding_id", holdingId)
      .order("transaction_date", { ascending: false }),
    supabase
      .from("etf_dividends")
      .select("*")
      .eq("holding_id", holdingId)
      .order("payment_date", { ascending: false }),
  ]);

  if (!holding) return null;

  const txList = (transactions ?? []) as EtfTransaction[];
  return {
    holding: holding as EtfHolding,
    transactions: txList,
    dividends: (dividends ?? []) as EtfDividend[],
    position: computeHoldingPosition(txList),
  };
}
