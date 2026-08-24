"use client";

// ============================================================================
// components/silownia/hydration-widget.tsx
// Nawodnienie dziś: pasek postępu do rekomendacji + szybkie przyciski dodania
// (250/500/750 ml). Zapis debounce'owany jak components/butelki/bottle-counter.tsx
// — kliknięcia aktualizują stan od razu, zapis leci ~600ms po ostatnim tapnięciu
// jako wartość BEZWZGLĘDNA (nie atomowy increment), więc szybka seria kliknięć
// wysyła jedno zapytanie zamiast wielu.
// ============================================================================
import { useEffect, useRef, useState, useTransition } from "react";
import { Droplet, Minus, RotateCcw } from "lucide-react";
import { setHydration } from "@/lib/silownia/actions";
import { HYDRATION_DISCLAIMER } from "@/lib/silownia/hydration";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const QUICK_ADD_ML = [250, 500, 750];
const SAVE_DEBOUNCE_MS = 600;

export function HydrationWidget({
  initialConsumedMl,
  recommendedMl,
  isFallback,
  wasClamped,
}: {
  initialConsumedMl: number;
  recommendedMl: number;
  isFallback: boolean;
  wasClamped: boolean;
}) {
  const [consumedMl, setConsumedMl] = useState(initialConsumedMl);
  const [isPending, startTransition] = useTransition();
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, []);

  function scheduleSave(next: number) {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      startTransition(async () => {
        await setHydration(next);
      });
    }, SAVE_DEBOUNCE_MS);
  }

  function addMl(amount: number) {
    setConsumedMl((prev) => {
      const next = Math.max(0, prev + amount);
      scheduleSave(next);
      return next;
    });
  }

  function reset() {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    setConsumedMl(0);
    startTransition(async () => {
      await setHydration(0);
    });
  }

  const progress = Math.min(1, consumedMl / recommendedMl);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Droplet className="h-5 w-5 text-primary" /> Nawodnienie
        </h2>
        {isPending && <span className="text-xs text-foreground-muted">Zapisywanie…</span>}
      </div>

      <div>
        <p className="text-3xl font-bold tabular-nums text-foreground">
          {consumedMl} <span className="text-lg font-normal text-foreground-muted">/ {recommendedMl} ml</span>
        </p>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-surface-muted">
          <div
            className={cn("h-full rounded-full transition-all", progress >= 1 ? "bg-accent" : "bg-primary")}
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {QUICK_ADD_ML.map((amount) => (
          <Button key={amount} type="button" variant="outline" size="sm" onClick={() => addMl(amount)}>
            + {amount} ml
          </Button>
        ))}
        <Button type="button" variant="ghost" size="sm" onClick={() => addMl(-250)} disabled={consumedMl === 0}>
          <Minus className="h-4 w-4" /> 250 ml
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={reset} disabled={consumedMl === 0}>
          <RotateCcw className="h-4 w-4" /> Reset
        </Button>
      </div>

      <p className="text-xs text-foreground-muted">
        {isFallback
          ? "Rekomendacja orientacyjna — uzupełnij wagę w ustawieniach dla dokładniejszego wyliczenia."
          : wasClamped
            ? "Wyliczona wartość wykraczała poza rozsądny zakres, więc pokazujemy przyciętą rekomendację."
            : HYDRATION_DISCLAIMER}
      </p>
    </Card>
  );
}
