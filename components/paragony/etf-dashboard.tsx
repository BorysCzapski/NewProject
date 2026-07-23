"use client";

// ============================================================================
// components/paragony/etf-dashboard.tsx
// ETF portfolio dashboard: value-over-time line chart, allocation donut with
// a ticker/asset-class/region switcher, headline performance metrics, and a
// holdings table. All figures come straight from PortfolioOverview — nothing
// here is simulated.
// ============================================================================
import { useState } from "react";
import Link from "next/link";
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Plus, Sparkles, Wallet } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { chartColor, foldToOther } from "@/lib/paragony/chart-colors";
import type { PortfolioOverview, HoldingSummary } from "@/lib/paragony/etf-queries";

const currencyFormatter = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" });
const signedCurrencyFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  signDisplay: "exceptZero",
});
const compactCurrencyFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  notation: "compact",
  maximumFractionDigits: 1,
});
const percentFormatter = new Intl.NumberFormat("pl-PL", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const signedPercentFormatter = new Intl.NumberFormat("pl-PL", {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
  signDisplay: "exceptZero",
});
const unitsFormatter = new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 4 });
const axisDateFormatter = new Intl.DateTimeFormat("pl-PL", { day: "2-digit", month: "2-digit" });
const fullDateFormatter = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" });

function formatAxisDate(value: string): string {
  return axisDateFormatter.format(new Date(value));
}

type AllocationView = "ticker" | "assetClass" | "region";

const ALLOCATION_TABS: Array<{ key: AllocationView; label: string }> = [
  { key: "ticker", label: "Wg tickera" },
  { key: "assetClass", label: "Wg klasy aktywów" },
  { key: "region", label: "Wg regionu" },
];

const TOOLTIP_CONTENT_STYLE = {
  backgroundColor: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-control)",
  fontSize: 12,
};

export function EtfDashboard({ overview }: { overview: PortfolioOverview }) {
  const [allocationView, setAllocationView] = useState<AllocationView>("ticker");

  if (overview.holdings.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-3 py-10 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Wallet className="h-7 w-7" />
        </span>
        <CardTitle>Twój portfel ETF jest jeszcze pusty</CardTitle>
        <CardDescription>
          Dodaj pierwszą pozycję, żeby zacząć śledzić wartość, alokację i wyniki portfela.
        </CardDescription>
        <Link href="/paragony/etf/nowy" className="mt-2 w-full">
          <Button size="lg" className="w-full">
            <Plus className="h-5 w-5" />
            Dodaj pierwszy ETF
          </Button>
        </Link>
      </Card>
    );
  }

  const sortedHoldings = [...overview.holdings].sort((a, b) => b.currentValue - a.currentValue);

  const allocationSource =
    allocationView === "ticker"
      ? overview.allocationByTicker
      : allocationView === "assetClass"
        ? overview.allocationByAssetClass
        : overview.allocationByRegion;
  const allocationTotal = allocationSource.reduce((sum, item) => sum + item.value, 0);
  const foldedAllocation = foldToOther(
    allocationSource.map((item) => ({ label: item.label, value: item.value })),
    4
  ).map((item) => ({
    ...item,
    percent: allocationTotal > 0 ? (item.value / allocationTotal) * 100 : 0,
  }));

  const returnColor = overview.totalReturn >= 0 ? "text-accent" : "text-danger";
  const cagrColor = overview.cagr >= 0 ? "text-accent" : "text-danger";
  const largestTicker = overview.allocationByTicker[0]?.label ?? null;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Link href="/paragony/etf/nowy">
          <Button className="w-full">
            <Plus className="h-5 w-5" />
            Dodaj ETF
          </Button>
        </Link>
        <Link href="/paragony/etf/symulator">
          <Button variant="secondary" className="w-full">
            <Sparkles className="h-5 w-5" />
            Symulator co jeśli
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardDescription>Wartość portfela</CardDescription>
          <p className="mt-1 text-xl font-bold text-foreground">{currencyFormatter.format(overview.totalValue)}</p>
        </Card>
        <Card>
          <CardDescription>Zainwestowany kapitał</CardDescription>
          <p className="mt-1 text-xl font-bold text-foreground">
            {currencyFormatter.format(overview.totalCostBasis)}
          </p>
        </Card>
        <Card>
          <CardDescription>Otrzymane dywidendy</CardDescription>
          <p className="mt-1 text-xl font-bold text-foreground">
            {currencyFormatter.format(overview.totalDividends)}
          </p>
        </Card>
        <Card>
          <CardDescription>Stopa zwrotu całkowita</CardDescription>
          <p className={cn("mt-1 text-xl font-bold", returnColor)}>
            {signedPercentFormatter.format(overview.totalReturn)}
          </p>
        </Card>
        <Card>
          <CardDescription>CAGR</CardDescription>
          <p className={cn("mt-1 text-xl font-bold", cagrColor)}>{signedPercentFormatter.format(overview.cagr)}</p>
        </Card>
        <Card>
          <CardDescription>Zmienność</CardDescription>
          <p className="mt-1 text-xl font-bold text-foreground">{percentFormatter.format(overview.volatility)}</p>
        </Card>
        <Card>
          <CardDescription>Maksymalne obsunięcie</CardDescription>
          <p className="mt-1 text-xl font-bold text-danger">{percentFormatter.format(overview.maxDrawdown)}</p>
        </Card>
        <Card>
          <CardDescription>Koncentracja</CardDescription>
          <p className="mt-1 text-xl font-bold text-foreground">
            {percentFormatter.format(overview.largestPositionPercent / 100)}
          </p>
          {largestTicker && <p className="text-xs text-foreground-muted">Udział pozycji {largestTicker}</p>}
        </Card>
      </div>

      <Card className="flex flex-col gap-3">
        <CardTitle>Wartość portfela w czasie</CardTitle>
        {overview.valueSeries.length < 2 ? (
          <p className="py-8 text-center text-sm text-foreground-muted">
            Wykres pojawi się, gdy zbierze się więcej danych cenowych (co najmniej dwa dni wyceny).
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={overview.valueSeries}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={formatAxisDate}
                tick={{ fontSize: 11, fill: "var(--color-foreground-muted)" }}
                stroke="var(--color-border)"
              />
              <YAxis
                tickFormatter={(value: number) => compactCurrencyFormatter.format(value)}
                tick={{ fontSize: 11, fill: "var(--color-foreground-muted)" }}
                stroke="var(--color-border)"
                width={60}
              />
              <Tooltip
                formatter={(value: number) => [currencyFormatter.format(value), "Wartość portfela"]}
                labelFormatter={(label: string) => formatAxisDate(label)}
                contentStyle={TOOLTIP_CONTENT_STYLE}
                labelStyle={{ color: "var(--color-foreground-muted)" }}
                itemStyle={{ color: "var(--color-foreground)" }}
              />
              <Line type="monotone" dataKey="value" stroke="var(--color-chart-1)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </Card>

      <Card className="flex flex-col gap-3">
        <CardTitle>Alokacja</CardTitle>
        <div className="flex flex-wrap gap-2">
          {ALLOCATION_TABS.map((tab) => (
            <Button
              key={tab.key}
              type="button"
              size="sm"
              variant={allocationView === tab.key ? "primary" : "outline"}
              onClick={() => setAllocationView(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </div>
        {foldedAllocation.length === 0 ? (
          <p className="py-6 text-center text-sm text-foreground-muted">Brak danych do pokazania alokacji.</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={foldedAllocation} dataKey="value" nameKey="label" innerRadius={50} outerRadius={80}>
                  {foldedAllocation.map((entry, index) => (
                    <Cell key={entry.label} fill={chartColor(index)} />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ fontSize: 12, color: "var(--color-foreground-muted)" }} />
                <Tooltip
                  formatter={(value: number, name: string) => [currencyFormatter.format(value), name]}
                  contentStyle={TOOLTIP_CONTENT_STYLE}
                  itemStyle={{ color: "var(--color-foreground)" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-1.5">
              {foldedAllocation.map((entry, index) => (
                <div key={entry.label} className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: chartColor(index) }} />
                    <span className="truncate text-foreground">{entry.label}</span>
                  </span>
                  <span className="shrink-0 text-foreground-muted">
                    {percentFormatter.format(entry.percent / 100)}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </Card>

      <Card className="flex flex-col gap-3">
        <CardTitle>Pozycje</CardTitle>
        <div className="flex flex-col gap-2">
          {sortedHoldings.map((summary) => (
            <HoldingRow key={summary.holding.id} summary={summary} />
          ))}
        </div>
      </Card>
    </div>
  );
}

function HoldingRow({ summary }: { summary: HoldingSummary }) {
  const gainColor = summary.unrealizedGain >= 0 ? "text-accent" : "text-danger";

  return (
    <Link
      href={`/paragony/etf/${summary.holding.id}`}
      className="flex flex-col gap-1 rounded-(--radius-control) border border-border bg-surface-muted px-3.5 py-3 active:opacity-80"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{summary.holding.ticker.toUpperCase()}</p>
          {summary.holding.name && <p className="truncate text-xs text-foreground-muted">{summary.holding.name}</p>}
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold text-foreground">{currencyFormatter.format(summary.currentValue)}</p>
          <p className={cn("text-xs font-medium", gainColor)}>
            {signedCurrencyFormatter.format(summary.unrealizedGain)} (
            {signedPercentFormatter.format(summary.unrealizedGainPercent / 100)})
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 text-xs text-foreground-muted">
        <span>
          {unitsFormatter.format(summary.units)} j. · śr. {currencyFormatter.format(summary.averageCost)}
        </span>
        <span>
          {summary.currentPrice !== null ? currencyFormatter.format(summary.currentPrice) : "brak wyceny"}
          {summary.priceStale && summary.currentPriceDate && (
            <span className="text-warning"> · dane z {fullDateFormatter.format(new Date(summary.currentPriceDate))}</span>
          )}
        </span>
      </div>
    </Link>
  );
}
