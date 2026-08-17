"use client";

// ============================================================================
// components/butelki/bottle-counter.tsx
// Big tap-to-add counter (1 butelka = 50 gr). Taps update local state
// instantly; persistence to bottle_counters is debounced (one save ~600ms
// after the last tap, sending the running total) so a rapid tapping burst
// doesn't fire a request per tap.
// ============================================================================
import { useEffect, useRef, useState, useTransition } from "react";
import { AlertTriangle, Minus, Plus, Trash2 } from "lucide-react";
import { resetBottleCount, setBottleCount } from "@/lib/butelki/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const BOTTLE_VALUE_PLN = 0.5;
const SAVE_DEBOUNCE_MS = 600;
const currencyFormatter = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" });

export function BottleCounter({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);
  const [confirmReset, setConfirmReset] = useState(false);
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
        await setBottleCount(next);
      });
    }, SAVE_DEBOUNCE_MS);
  }

  function increment() {
    setCount((prev) => {
      const next = prev + 1;
      scheduleSave(next);
      return next;
    });
  }

  function decrement() {
    setCount((prev) => {
      const next = Math.max(0, prev - 1);
      scheduleSave(next);
      return next;
    });
  }

  function handleReset() {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    setCount(0);
    setConfirmReset(false);
    startTransition(async () => {
      await resetBottleCount();
    });
  }

  const total = count * BOTTLE_VALUE_PLN;

  return (
    <Card className="flex flex-col items-center gap-5 py-8">
      <div className="text-center">
        <p className="text-6xl font-bold tabular-nums text-foreground">{count}</p>
        <p className="text-sm text-foreground-muted">butelek × 50 gr</p>
        <p className="mt-1 text-2xl font-semibold text-accent">{currencyFormatter.format(total)}</p>
      </div>

      <button
        type="button"
        onClick={increment}
        aria-label="Dodaj butelkę"
        className="flex h-36 w-36 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform active:scale-95"
      >
        <Plus className="h-14 w-14" />
      </button>

      <div className="flex h-5 w-full items-center justify-between">
        <Button type="button" variant="ghost" size="sm" onClick={decrement} disabled={count === 0}>
          <Minus className="h-4 w-4" /> Cofnij
        </Button>
        {isPending && <span className="text-xs text-foreground-muted">Zapisywanie…</span>}
      </div>

      {confirmReset ? (
        <div className="flex w-full flex-col gap-3 rounded-(--radius-control) bg-warning-soft p-3">
          <div className="flex gap-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <p className="text-sm text-foreground">Wyzerować licznik butelek?</p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => setConfirmReset(false)}>
              Wróć
            </Button>
            <Button type="button" variant="danger" className="flex-1" onClick={handleReset}>
              Opróżnij
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={count === 0}
          onClick={() => setConfirmReset(true)}
        >
          <Trash2 className="h-4 w-4" /> Opróżnij
        </Button>
      )}
    </Card>
  );
}
