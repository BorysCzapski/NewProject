"use client";

// ============================================================================
// components/grammar/lesson/match-pairs-block.tsx
// Tap-to-match drill: pick a term on the left, then its partner on the right.
// Correct pairs lock and grey out; a wrong pick flashes and clears, so the
// board never ends up in a state the student has to undo.
//
// The right column is shuffled deterministically (lib/grammar/shuffle.ts) —
// a hydration-safe order that also keeps the board stable across reloads.
// ============================================================================
import { useMemo, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { seededShuffle } from "@/lib/grammar/shuffle";
import type { MatchPair } from "@/lib/grammar/lesson-blocks";

export function MatchPairsBlock({
  title,
  instruction,
  pairs,
}: {
  title?: string;
  instruction?: string;
  pairs: MatchPair[];
}) {
  // Index into `pairs`, carried alongside the text so a match is an index
  // comparison rather than a string comparison — two pairs may legitimately
  // share a right-hand side (two synonyms, one Polish gloss).
  const rightOrder = useMemo(
    () =>
      seededShuffle(
        pairs.map((pair, i) => ({ index: i, text: pair.right })),
        pairs.map((pair) => pair.left).join("|")
      ),
    [pairs]
  );

  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [wrongRight, setWrongRight] = useState<number | null>(null);

  const done = matched.size === pairs.length;

  function pickRight(pairIndex: number) {
    if (selectedLeft === null || matched.has(pairIndex)) return;
    // A shared right-hand side counts for whichever left is selected.
    if (pairs[pairIndex].right === pairs[selectedLeft].right) {
      setMatched((prev) => new Set(prev).add(selectedLeft));
      setSelectedLeft(null);
      setWrongRight(null);
      return;
    }
    setWrongRight(pairIndex);
    setTimeout(() => setWrongRight(null), 550);
  }

  function reset() {
    setMatched(new Set());
    setSelectedLeft(null);
    setWrongRight(null);
  }

  return (
    <Card className="border-primary/30">
      <div className="flex items-baseline justify-between gap-2">
        <CardTitle>{title ?? "Połącz w pary"}</CardTitle>
        <span className="shrink-0 text-xs tabular-nums text-foreground-muted">
          {matched.size}/{pairs.length}
        </span>
      </div>
      <p className="mt-1 text-sm text-foreground-muted">
        {instruction ?? "Dotknij hasła po lewej, potem jego odpowiednika po prawej."}
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-2">
          {pairs.map((pair, i) => {
            const isMatched = matched.has(i);
            return (
              <button
                key={i}
                type="button"
                disabled={isMatched}
                onClick={() => setSelectedLeft(i)}
                className={cn(
                  "min-h-11 rounded-(--radius-control) border px-3 py-2 text-left text-sm font-medium transition-colors",
                  isMatched && "border-transparent bg-accent-soft text-accent opacity-70",
                  !isMatched && selectedLeft === i && "border-primary bg-primary-soft text-primary",
                  !isMatched && selectedLeft !== i && "border-border bg-surface text-foreground active:bg-surface-muted"
                )}
              >
                {pair.left}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          {rightOrder.map((right) => {
            const isMatched = matched.has(right.index);
            return (
              <button
                key={right.index}
                type="button"
                disabled={isMatched || selectedLeft === null}
                onClick={() => pickRight(right.index)}
                className={cn(
                  "min-h-11 rounded-(--radius-control) border px-3 py-2 text-left text-sm transition-colors",
                  isMatched && "border-transparent bg-accent-soft font-medium text-accent opacity-70",
                  !isMatched && wrongRight === right.index && "border-danger bg-danger-soft text-danger",
                  !isMatched &&
                    wrongRight !== right.index &&
                    "border-border bg-surface text-foreground active:bg-surface-muted",
                  selectedLeft === null && !isMatched && "opacity-60"
                )}
              >
                {right.text}
              </button>
            );
          })}
        </div>
      </div>

      {done && (
        <div className="mt-3 flex items-center justify-between gap-2 rounded-(--radius-control) bg-accent-soft px-3 py-2">
          <p className="flex items-center gap-1.5 text-sm font-medium text-accent">
            <Check className="h-4 w-4 shrink-0" />
            Wszystkie pary połączone.
          </p>
          <Button variant="ghost" size="sm" onClick={reset}>
            <RotateCcw className="h-3.5 w-3.5" />
            Jeszcze raz
          </Button>
        </div>
      )}
    </Card>
  );
}
