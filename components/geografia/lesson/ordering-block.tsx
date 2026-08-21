"use client";

// ============================================================================
// components/geografia/lesson/ordering-block.tsx
// "Ustaw w kolejności" — etapy procesu, fazy przejścia demograficznego,
// następstwo pięter roślinnych, kolejność warstw. Tap-to-move (↑/↓) rather
// than HTML5 drag-and-drop, which is unusable on touch without a dedicated
// library; this app is mobile-first (see the 390px-oriented layouts
// throughout), so arrows are the accessible, dependency-free choice.
//
// Start order is a content-seeded permutation (never the correct one) for
// the same SSR-hydration reason documented in matching-block.tsx.
// ============================================================================
import { useState } from "react";
import { ArrowDown, ArrowUp, Check, RotateCcw, X } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/geografia/lesson/rich-text";
import { cn } from "@/lib/utils";

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Seeded shuffle, re-rolled until it differs from the identity order. */
function scrambledOrder(count: number, seed: number): number[] {
  const indices = [...Array(count).keys()];
  let state = seed || 1;
  for (let i = count - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  if (count > 1 && indices.every((v, i) => v === i)) {
    [indices[0], indices[1]] = [indices[1], indices[0]];
  }
  return indices;
}

export function OrderingBlock({
  title,
  instruction,
  items,
  explanation,
}: {
  title: string;
  instruction?: string;
  items: string[];
  explanation?: string;
}) {
  const [order, setOrder] = useState(() => scrambledOrder(items.length, hash(items.join("|"))));
  const [checked, setChecked] = useState(false);

  const isCorrect = order.every((v, i) => v === i);

  function move(position: number, delta: number) {
    const target = position + delta;
    if (target < 0 || target >= order.length) return;
    setOrder((prev) => {
      const next = [...prev];
      [next[position], next[target]] = [next[target], next[position]];
      return next;
    });
    setChecked(false);
  }

  return (
    <Card className="flex flex-col gap-3 border-primary/30">
      <div>
        <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-primary">
          Ustaw w kolejności
        </span>
        <CardTitle className="mt-1.5">{title}</CardTitle>
        <RichText
          text={instruction ?? "Przesuń elementy strzałkami, aż ustawisz je we właściwej kolejności."}
          className="mt-0.5 text-sm text-foreground-muted"
        />
      </div>

      <ol className="flex flex-col gap-1.5">
        {order.map((itemIndex, position) => {
          const inRightPlace = itemIndex === position;
          return (
            <li
              key={itemIndex}
              className={cn(
                "flex items-center gap-2 rounded-(--radius-control) border px-2.5 py-2",
                !checked && "border-border bg-surface",
                checked && inRightPlace && "border-transparent bg-accent-soft",
                checked && !inRightPlace && "border-transparent bg-danger-soft"
              )}
            >
              <span className="w-5 shrink-0 text-center text-xs font-bold text-foreground-muted">{position + 1}</span>
              <span className="min-w-0 flex-1 text-sm text-foreground">{items[itemIndex]}</span>
              {checked &&
                (inRightPlace ? (
                  <Check className="h-4 w-4 shrink-0 text-accent" />
                ) : (
                  <X className="h-4 w-4 shrink-0 text-danger" />
                ))}
              <div className="flex shrink-0 flex-col">
                <button
                  type="button"
                  aria-label="Przesuń w górę"
                  disabled={position === 0}
                  onClick={() => move(position, -1)}
                  className="text-foreground-muted disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Przesuń w dół"
                  disabled={position === order.length - 1}
                  onClick={() => move(position, 1)}
                  className="text-foreground-muted disabled:opacity-30"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="flex flex-wrap items-center gap-2">
        {!checked ? (
          <Button size="sm" variant="outline" onClick={() => setChecked(true)}>
            Sprawdź kolejność
          </Button>
        ) : (
          <>
            <p
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium",
                isCorrect ? "text-accent" : "text-warning"
              )}
            >
              {isCorrect ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
              {isCorrect ? "Kolejność poprawna!" : "Jeszcze nie — popraw zaznaczone pozycje."}
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setOrder(scrambledOrder(items.length, hash(items.join("|")) + 7));
                setChecked(false);
              }}
            >
              <RotateCcw className="h-4 w-4" />
              Od nowa
            </Button>
          </>
        )}
      </div>

      {checked && isCorrect && explanation && (
        <RichText text={explanation} className="rounded-(--radius-control) bg-accent-soft px-3 py-2 text-sm text-accent" />
      )}
    </Card>
  );
}
