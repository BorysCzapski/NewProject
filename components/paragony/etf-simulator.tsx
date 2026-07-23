"use client";

// ============================================================================
// components/paragony/etf-simulator.tsx
// Client-only "what if" recompute: picks an already-held ETF, simulates a
// hypothetical buy/sell at its current cached price, and shows the impact on
// average cost, position value, and portfolio allocation — all derived with
// lib/paragony/etf-metrics.ts's applyHypotheticalTrade, no network round trip.
// Nothing is written to the database until the user presses "Zastosuj", which
// creates one real etf_transactions row via addEtfTransaction.
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { addEtfTransaction } from "@/lib/paragony/etf-actions";
import { applyHypotheticalTrade } from "@/lib/paragony/etf-metrics";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { HoldingSummary } from "@/lib/paragony/etf-queries";

const selectClass =
  "h-12 w-full rounded-(--radius-control) border border-border bg-surface px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary";

function formatMoney(value: number, currency = "PLN"): string {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency }).format(value);
}

function computeSimulation(selected: HoldingSummary | null, type: "buy" | "sell", units: number, totalValue: number) {
  if (!selected || !selected.currentPrice || units <= 0) return null;
  const currentPosition = { units: selected.units, averageCost: selected.averageCost, totalCost: selected.totalCost };
  const nextPosition = applyHypotheticalTrade(currentPosition, type, units, selected.currentPrice);
  const currentPositionValue = selected.units * selected.currentPrice;
  const nextPositionValue = nextPosition.units * selected.currentPrice;
  const nextTotalValue = totalValue - currentPositionValue + nextPositionValue;
  return {
    currentPosition,
    nextPosition,
    currentPositionValue,
    nextPositionValue,
    currentAllocationPercent: totalValue > 0 ? (currentPositionValue / totalValue) * 100 : 0,
    nextAllocationPercent: nextTotalValue > 0 ? (nextPositionValue / nextTotalValue) * 100 : 0,
    overshootsSell: type === "sell" && units > selected.units,
  };
}

export function EtfSimulator({ holdings, totalValue }: { holdings: HoldingSummary[]; totalValue: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const eligible = holdings.filter((h) => h.currentPrice !== null);
  const [holdingId, setHoldingId] = useState(eligible[0]?.holding.id ?? "");
  const [type, setType] = useState<"buy" | "sell">("buy");
  const [units, setUnits] = useState(1);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applied, setApplied] = useState(false);

  const selected = eligible.find((h) => h.holding.id === holdingId) ?? null;
  const simulation = computeSimulation(selected, type, units, totalValue);

  function handleApply() {
    if (!selected || !selected.currentPrice) return;
    setApplyError(null);
    startTransition(async () => {
      const result = await addEtfTransaction({
        holdingId: selected.holding.id,
        type,
        units,
        pricePerUnit: selected.currentPrice as number,
        transactionDate: new Date().toISOString().slice(0, 10),
      });
      if (!result.ok) {
        setApplyError(result.error);
        return;
      }
      setApplied(true);
      router.refresh();
    });
  }

  if (eligible.length === 0) {
    return (
      <Card className="flex flex-col items-center gap-2 py-10 text-center">
        <CardTitle>Brak ETF-ów z wyceną do symulacji</CardTitle>
        <CardDescription>
          Dodaj przynajmniej jeden ETF do portfela (i poczekaj na pobranie ceny), żeby użyć symulatora.
        </CardDescription>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sim-holding">ETF</Label>
          <select
            id="sim-holding"
            className={selectClass}
            value={holdingId}
            onChange={(e) => {
              setHoldingId(e.target.value);
              setApplied(false);
            }}
          >
            {eligible.map((h) => (
              <option key={h.holding.id} value={h.holding.id}>
                {h.holding.ticker.toUpperCase()} {h.holding.name ? `— ${h.holding.name}` : ""}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant={type === "buy" ? "primary" : "outline"}
            className="flex-1"
            onClick={() => {
              setType("buy");
              setApplied(false);
            }}
          >
            Dokup
          </Button>
          <Button
            type="button"
            variant={type === "sell" ? "primary" : "outline"}
            className="flex-1"
            onClick={() => {
              setType("sell");
              setApplied(false);
            }}
          >
            Sprzedaj
          </Button>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sim-units">Liczba jednostek</Label>
          <Input
            id="sim-units"
            type="number"
            step="0.0001"
            min="0"
            value={units}
            onChange={(e) => {
              setUnits(Number(e.target.value));
              setApplied(false);
            }}
          />
        </div>

        {selected?.currentPrice && (
          <p className="text-sm text-foreground-muted">
            Po bieżącej cenie: {formatMoney(selected.currentPrice, selected.holding.currency)} / jednostkę
            {selected.priceStale && " (cena może być nieaktualna)"}
          </p>
        )}
      </Card>

      {simulation && selected && (
        <Card className="flex flex-col gap-3">
          <CardTitle>Wpływ na portfel</CardTitle>

          {simulation.overshootsSell && (
            <p className="text-sm text-warning">
              Wpisana liczba jednostek przekracza obecny stan posiadania — symulacja ograniczy sprzedaż do
              posiadanych jednostek.
            </p>
          )}

          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-foreground-muted">Jednostki</span>
            <span className="flex items-center gap-2 font-medium text-foreground">
              {simulation.currentPosition.units} <ArrowRight className="h-3.5 w-3.5" /> {simulation.nextPosition.units}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-foreground-muted">Średnia cena zakupu</span>
            <span className="flex items-center gap-2 font-medium text-foreground">
              {formatMoney(simulation.currentPosition.averageCost, selected.holding.currency)}{" "}
              <ArrowRight className="h-3.5 w-3.5" />{" "}
              {formatMoney(simulation.nextPosition.averageCost, selected.holding.currency)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-foreground-muted">Wartość pozycji</span>
            <span className="flex items-center gap-2 font-medium text-foreground">
              {formatMoney(simulation.currentPositionValue, selected.holding.currency)}{" "}
              <ArrowRight className="h-3.5 w-3.5" />{" "}
              {formatMoney(simulation.nextPositionValue, selected.holding.currency)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-foreground-muted">Udział w portfelu</span>
            <span className="flex items-center gap-2 font-medium text-foreground">
              {simulation.currentAllocationPercent.toFixed(1)}% <ArrowRight className="h-3.5 w-3.5" />{" "}
              {simulation.nextAllocationPercent.toFixed(1)}%
            </span>
          </div>

          {applyError && <p className="text-sm text-danger">{applyError}</p>}
          {applied && <p className="text-sm text-accent">Zastosowano — dodano prawdziwą transakcję do portfela.</p>}

          <Button type="button" variant="primary" isLoading={isPending} onClick={handleApply}>
            Zastosuj (utwórz prawdziwą transakcję)
          </Button>
          <p className="text-center text-xs text-foreground-muted">
            Do tego momentu nic nie zostało zapisane w bazie — to tylko podgląd.
          </p>
        </Card>
      )}
    </div>
  );
}
