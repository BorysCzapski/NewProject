"use client";

// ============================================================================
// components/trading/checklist.tsx
// Lista kontrolna przed otwarciem pozycji. Stan nie jest zapisywany —
// odhaczasz ją od nowa przed każdą transakcją.
// ============================================================================
import { useState } from "react";
import { Check } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Checklist({ items }: { items: string[] }) {
  const [checked, setChecked] = useState<boolean[]>(() => items.map(() => false));
  const count = checked.filter(Boolean).length;
  const all = count === items.length;

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <CardTitle>Przed wejściem w pozycję</CardTitle>
        <span className="text-sm text-foreground-muted">
          {count}/{items.length}
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <li key={item}>
            <button
              type="button"
              role="checkbox"
              aria-checked={checked[i]}
              onClick={() => setChecked((c) => c.map((v, j) => (j === i ? !v : v)))}
              className="flex min-h-11 w-full items-start gap-3 rounded-(--radius-control) px-1 py-2 text-left"
            >
              <span
                className={cn(
                  "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                  checked[i] ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface"
                )}
              >
                {checked[i] && <Check className="h-3.5 w-3.5" />}
              </span>
              <span className={cn("text-sm", checked[i] ? "text-foreground-muted line-through" : "text-foreground")}>{item}</span>
            </button>
          </li>
        ))}
      </ul>
      <p className={cn("text-sm font-medium", all ? "text-primary" : "text-foreground-muted")}>
        {all ? "Wszystko się zgadza — możesz ustawić SL, TP i otworzyć pozycję." : "Brakuje punktów? Brak transakcji to też dobra decyzja."}
      </p>
      {count > 0 && (
        <Button variant="ghost" size="sm" onClick={() => setChecked(items.map(() => false))}>
          Wyczyść
        </Button>
      )}
    </Card>
  );
}
