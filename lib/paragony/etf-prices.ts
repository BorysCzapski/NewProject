// ============================================================================
// lib/paragony/etf-prices.ts
// EOD price cache for ETF holdings.
//
// Stooq (GPW tickers, e.g. betaetfwig20tr / betaetfsp500) has NO published
// API or SLA — it's a bare CSV file served publicly, so treat it as a
// fragile external resource: cache aggressively, never call it more than
// once per ticker per day.
//
// FMP (foreign tickers) has a real documented free tier, but it's capped at
// 250 requests/day and 500 MB/30 days for the WHOLE app (not per user), so
// refreshing more than once/day/ticker would burn through it fast once more
// than a handful of users hold the same ticker.
//
// Writes go through the service-role admin client (lib/supabase/admin.ts):
// etf_price_history is a cache SHARED by every user (market prices are
// public), not scoped by user_id, so the normal per-user RLS client has no
// INSERT policy on it at all (see the migration's RLS section) — only this
// server-side refresh path can write to it.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";
import type { EtfProvider } from "@/lib/types/database";

// ~2 years of history: enough to compute a meaningful CAGR/volatility/max
// drawdown the first time a ticker is added, without an unbounded backfill.
const INITIAL_HISTORY_LOOKBACK_DAYS = 730;

function formatYYYYMMDD(date: Date): string {
  return date.toISOString().slice(0, 10).replace(/-/g, "");
}
function formatISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

interface PricePoint {
  date: string; // YYYY-MM-DD
  close: number;
}

/** Stooq's plain CSV: "Data,Otwarcie,Najwyzszy,Najnizszy,Zamkniecie,Wolumen".
 * Returns [] (a soft failure, not a thrown error) for "Brak danych" / an
 * unknown ticker / a rate-limited or empty response. */
function parseStooqCsv(csv: string): PricePoint[] {
  const lines = csv.trim().split("\n").filter(Boolean);
  if (lines.length < 2) return [];

  const points: PricePoint[] = [];
  for (const line of lines.slice(1)) {
    const cols = line.split(",");
    if (cols.length < 5) continue;
    const [date, , , , close] = cols;
    const closeNum = Number(close);
    if (!date || Number.isNaN(closeNum)) continue;
    points.push({ date, close: closeNum });
  }
  return points;
}

async function fetchStooqHistory(ticker: string, from: Date, to: Date): Promise<PricePoint[]> {
  const url =
    `https://stooq.pl/q/d/l/?s=${encodeURIComponent(ticker)}` +
    `&d1=${formatYYYYMMDD(from)}&d2=${formatYYYYMMDD(to)}&i=d`;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      console.error(`[paragony] Stooq fetch failed for ${ticker}: HTTP ${response.status}`);
      return [];
    }
    const csv = await response.text();
    if (/brak danych|exceeded the daily hits limit/i.test(csv)) {
      console.error(`[paragony] Stooq returned no data for ${ticker}`);
      return [];
    }
    return parseStooqCsv(csv);
  } catch (err) {
    console.error(`[paragony] Stooq fetch threw for ${ticker}:`, err);
    return [];
  }
}

interface FmpHistoricalResponse {
  historical?: Array<{ date: string; close: number }>;
}

async function fetchFmpHistory(ticker: string, from: Date, to: Date): Promise<PricePoint[]> {
  const apiKey = process.env.FMP_API_KEY;
  if (!apiKey) {
    console.error(`[paragony] FMP_API_KEY not set — skipping price refresh for ${ticker}`);
    return [];
  }
  // FMP's stable historical-EOD endpoint as of the July 2026 integration —
  // re-verify against financialmodelingprep.com/developer/docs if this ever
  // starts returning errors, FMP does occasionally reshape endpoints.
  const url =
    `https://financialmodelingprep.com/api/v3/historical-price-full/${encodeURIComponent(ticker)}` +
    `?from=${formatISODate(from)}&to=${formatISODate(to)}&apikey=${apiKey}`;
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      console.error(`[paragony] FMP fetch failed for ${ticker}: HTTP ${response.status}`);
      return [];
    }
    const body = (await response.json()) as FmpHistoricalResponse;
    return (body.historical ?? []).map((row) => ({ date: row.date, close: row.close }));
  } catch (err) {
    console.error(`[paragony] FMP fetch threw for ${ticker}:`, err);
    return [];
  }
}

/** Refreshes the price cache for one ticker, at most once per calendar day
 * (checked via the most recently cached row's fetched_at) — call once per
 * distinct ticker held across the portfolio being viewed, not once per
 * holding row. Never throws: a failed refresh just leaves the existing
 * cache in place, which is exactly the "show the last known price with an
 * annotation" behavior the dashboard wants (see lib/paragony/etf-queries.ts). */
export async function refreshEtfPriceCache(
  ticker: string,
  provider: EtfProvider,
  currency: string
): Promise<void> {
  const admin = createAdminClient();

  const { data: latest } = await admin
    .from("etf_price_history")
    .select("price_date, fetched_at")
    .eq("ticker", ticker)
    .order("price_date", { ascending: false })
    .limit(1)
    .maybeSingle();

  const today = formatISODate(new Date());
  if (latest && (latest.fetched_at as string).slice(0, 10) === today) {
    return; // already refreshed today — don't burn Stooq/FMP quota again
  }

  const to = new Date();
  const from = latest
    ? new Date(new Date(latest.price_date as string).getTime() + 86_400_000)
    : new Date(Date.now() - INITIAL_HISTORY_LOOKBACK_DAYS * 86_400_000);
  if (from > to) return;

  const points =
    provider === "stooq" ? await fetchStooqHistory(ticker, from, to) : await fetchFmpHistory(ticker, from, to);
  if (points.length === 0) return;

  const rows = points.map((p) => ({
    ticker,
    price_date: p.date,
    close_price: p.close,
    currency,
    fetched_at: new Date().toISOString(),
  }));

  const { error } = await admin.from("etf_price_history").upsert(rows, { onConflict: "ticker,price_date" });
  if (error) console.error(`[paragony] etf_price_history upsert failed for ${ticker}:`, error);
}

export interface PriceCacheEntry {
  price_date: string;
  close_price: number;
}

/** Read-only, so the normal per-user client is fine (etf_price_history's
 * RLS grants SELECT to every authenticated user — see the migration). */
export async function getCachedPrices(
  supabase: SupabaseClient,
  ticker: string,
  fromDate?: string
): Promise<PriceCacheEntry[]> {
  let query = supabase
    .from("etf_price_history")
    .select("price_date, close_price")
    .eq("ticker", ticker)
    .order("price_date", { ascending: true });
  if (fromDate) query = query.gte("price_date", fromDate);

  const { data, error } = await query;
  if (error) {
    console.error(`[paragony] getCachedPrices failed for ${ticker}:`, error);
    return [];
  }
  return (data ?? []) as PriceCacheEntry[];
}

export async function getLatestCachedPrice(
  supabase: SupabaseClient,
  ticker: string
): Promise<PriceCacheEntry | null> {
  const { data, error } = await supabase
    .from("etf_price_history")
    .select("price_date, close_price")
    .eq("ticker", ticker)
    .order("price_date", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error(`[paragony] getLatestCachedPrice failed for ${ticker}:`, error);
    return null;
  }
  return data as PriceCacheEntry | null;
}
