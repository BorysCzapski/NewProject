"use client";

// ============================================================================
// components/paragony/budget-chart.tsx
// Grouped bar chart of plan-vs-actual per expense category, with a click
// drill-down into that category's transactions (filtered locally out of the
// month's already-fetched transaction list, no extra network round trip) and
// an editable per-category plan list underneath.
// ============================================================================
import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { X } from "lucide-react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryIcon } from "@/components/paragony/category-icon";
import { chartColor } from "@/lib/paragony/chart-colors";
import { setMonthlyBudget } from "@/lib/paragony/monthly-budget-actions";
import { cn } from "@/lib/utils";
import type { CategoryBudgetLine, TransactionWithRelations } from "@/lib/paragony/queries";
import type { BudgetCategory } from "@/lib/types/database";

const currencyFormatter = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" });
const compactCurrencyFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  notation: "compact",
  maximumFractionDigits: 1,
});
const dateFormatter = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long" });

const TOOLTIP_CONTENT_STYLE = {
  backgroundColor: "var(--color-surface)",
  border: "1px solid var(--color-border)",
  borderRadius: "var(--radius-control)",
  fontSize: 12,
};

interface BudgetChartProps {
  lines: CategoryBudgetLine[];
  transactions: TransactionWithRelations[];
  categories: BudgetCategory[];
  year: number;
  month: number;
}

export function BudgetChart({ lines, transactions, categories, year, month }: BudgetChartProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  function handleBarClick(data: unknown) {
    const payload = (data as { payload?: CategoryBudgetLine } | undefined)?.payload;
    if (payload?.categoryId) setSelectedCategoryId(payload.categoryId);
  }

  const linesByCategory = new Map(lines.map((line) => [line.categoryId, line]));
  const selectedLine = selectedCategoryId ? linesByCategory.get(selectedCategoryId) ?? null : null;
  const drillDownTransactions = selectedCategoryId
    ? transactions.filter((t) => t.category_id === selectedCategoryId)
    : [];

  return (
    <div className="flex flex-col gap-4">
      <Card className="flex flex-col gap-3">
        <CardTitle>Plan vs wykonanie</CardTitle>
        {lines.length === 0 ? (
          <p className="py-8 text-center text-sm text-foreground-muted">
            Brak kategorii wydatkowych do pokazania.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={lines} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" />
              <XAxis
                dataKey="categoryName"
                tick={{ fontSize: 10, fill: "var(--color-foreground-muted)" }}
                stroke="var(--color-border)"
                interval={0}
                angle={-25}
                textAnchor="end"
                height={48}
              />
              <YAxis
                tickFormatter={(value: number) => compactCurrencyFormatter.format(value)}
                tick={{ fontSize: 11, fill: "var(--color-foreground-muted)" }}
                stroke="var(--color-border)"
                width={64}
              />
              <Tooltip
                formatter={(value: number, name: string) => [currencyFormatter.format(value), name]}
                contentStyle={TOOLTIP_CONTENT_STYLE}
                labelStyle={{ color: "var(--color-foreground)" }}
                itemStyle={{ color: "var(--color-foreground)" }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "var(--color-foreground-muted)" }} />
              <Bar
                dataKey="planned"
                name="Plan"
                fill="var(--color-primary-soft)"
                stroke="var(--color-primary)"
                strokeWidth={1}
                radius={[4, 4, 0, 0]}
                onClick={handleBarClick}
                style={{ cursor: "pointer" }}
              />
              <Bar
                dataKey="actual"
                name="Wykonanie"
                radius={[4, 4, 0, 0]}
                onClick={handleBarClick}
                style={{ cursor: "pointer" }}
              >
                {lines.map((line) => (
                  <Cell key={line.categoryId} fill={line.actual > line.planned ? chartColor(7) : chartColor(0)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Card>

      {selectedLine && (
        <Card className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                <CategoryIcon name={selectedLine.icon} className="h-4 w-4" />
              </span>
              <CardTitle className="truncate">{selectedLine.categoryName}</CardTitle>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="shrink-0"
              onClick={() => setSelectedCategoryId(null)}
            >
              <X className="h-4 w-4" />
              Zamknij
            </Button>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-foreground-muted">Plan: {currencyFormatter.format(selectedLine.planned)}</span>
            <span
              className={cn(
                "font-semibold",
                selectedLine.actual > selectedLine.planned ? "text-danger" : "text-foreground"
              )}
            >
              Wykonanie: {currencyFormatter.format(selectedLine.actual)}
            </span>
          </div>
          {drillDownTransactions.length === 0 ? (
            <p className="py-2 text-center text-sm text-foreground-muted">
              Brak transakcji w tej kategorii w tym miesiącu.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {drillDownTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between gap-3 rounded-(--radius-control) bg-surface-muted px-3.5 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{tx.description}</p>
                    <p className="text-xs text-foreground-muted">
                      {dateFormatter.format(new Date(tx.occurred_at))} · {tx.account_name}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-semibold text-danger">
                    {currencyFormatter.format(tx.amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      <Card className="flex flex-col gap-3">
        <CardTitle>Ustaw plan wydatków</CardTitle>
        {categories.length === 0 ? (
          <CardDescription>Brak kategorii wydatkowych.</CardDescription>
        ) : (
          <div className="flex flex-col gap-3">
            {categories.map((category) => {
              const line = linesByCategory.get(category.id);
              return (
                <CategoryBudgetRow
                  key={category.id}
                  category={category}
                  planned={line?.planned ?? 0}
                  actual={line?.actual ?? 0}
                  year={year}
                  month={month}
                />
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

function CategoryBudgetRow({
  category,
  planned,
  actual,
  year,
  month,
}: {
  category: BudgetCategory;
  planned: number;
  actual: number;
  year: number;
  month: number;
}) {
  const router = useRouter();
  const [value, setValue] = useState(String(planned));
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const overBudget = actual > planned;

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const plannedAmount = parseFloat(value);
    if (Number.isNaN(plannedAmount) || plannedAmount < 0) {
      setError("Podaj prawidłową kwotę.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await setMonthlyBudget({ categoryId: category.id, year, month, plannedAmount });
      if (result.ok) {
        router.refresh();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-2 border-b border-border pb-3 last:border-0 last:pb-0">
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
          <CategoryIcon name={category.icon} className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">{category.name}</span>
        <span className={cn("shrink-0 text-xs font-medium", overBudget ? "text-danger" : "text-foreground-muted")}>
          Wykonanie: {currencyFormatter.format(actual)}
        </span>
      </div>
      <form onSubmit={submit} className="flex items-center gap-2">
        <Input
          type="number"
          min={0}
          step="0.01"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-10"
          aria-label={`Plan dla kategorii ${category.name}`}
        />
        <Button type="submit" size="sm" isLoading={isPending}>
          Zapisz
        </Button>
      </form>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
