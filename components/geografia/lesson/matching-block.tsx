"use client";

// ============================================================================
// components/geografia/lesson/matching-block.tsx
// "Połącz w pary" — climate zone <-> vegetation formation, process <-> its
// landform, country <-> its characteristic. Tap a left item, then its match
// on the right. Geography is full of two-column associations and recognising
// them is a distinct skill from recalling a definition.
//
// The right column is shuffled with a CONTENT-SEEDED permutation, not
// Math.random: this is a Client Component that also renders during SSR, so a
// random order would differ between server and client and trip a hydration
// mismatch. Seeding from the pair text keeps the order stable across renders
// while still not matching the authored order.
// ============================================================================
import { useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/geografia/lesson/rich-text";
import { cn } from "@/lib/utils";

/** Deterministic 32-bit string hash — seeds the shuffle below. */
function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Fisher-Yates driven by a seeded LCG, so the order is stable per content. */
function seededOrder(count: number, seed: number): number[] {
  const indices = [...Array(count).keys()];
  let state = seed || 1;
  for (let i = count - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
}

export function MatchingBlock({
  title,
  instruction,
  pairs,
}: {
  title: string;
  instruction?: string;
  pairs: { left: string; right: string }[];
}) {
  const rightOrder = seededOrder(pairs.length, hash(pairs.map((p) => p.left).join("|")));
  const [activeLeft, setActiveLeft] = useState<number | null>(null);
  /** left index -> right index (both into the authored `pairs` array). */
  const [links, setLinks] = useState<Record<number, number>>({});

  const allMatched = Object.keys(links).length === pairs.length;
  const correctCount = Object.entries(links).filter(([l, r]) => Number(l) === r).length;

  function chooseRight(rightIndex: number) {
    if (activeLeft === null) return;
    setLinks((prev) => {
      const next = { ...prev };
      // A right item can only be used once — drop any earlier link to it.
      for (const [l, r] of Object.entries(next)) if (r === rightIndex) delete next[Number(l)];
      next[activeLeft] = rightIndex;
      return next;
    });
    setActiveLeft(null);
  }

  return (
    <Card className="flex flex-col gap-3 border-primary/30">
      <div>
        <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-primary">
          Połącz w pary
        </span>
        <CardTitle className="mt-1.5">{title}</CardTitle>
        <RichText
          text={instruction ?? "Dotknij pojęcia po lewej, a potem pasującego opisu po prawej."}
          className="mt-0.5 text-sm text-foreground-muted"
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1.5">
          {pairs.map((pair, i) => {
            const linked = links[i] !== undefined;
            const isCorrect = links[i] === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveLeft(i)}
                className={cn(
                  "min-h-11 rounded-(--radius-control) border px-2.5 py-2 text-left text-sm font-medium transition-colors",
                  activeLeft === i && "border-primary bg-primary-soft text-primary",
                  activeLeft !== i && !linked && "border-border bg-surface text-foreground",
                  linked && !allMatched && "border-primary/40 bg-surface text-foreground",
                  allMatched && isCorrect && "border-transparent bg-accent-soft text-accent",
                  allMatched && !isCorrect && "border-transparent bg-danger-soft text-danger"
                )}
              >
                {pair.left}
                {linked && (
                  <span className="mt-0.5 block text-xs font-normal opacity-70">
                    → {pairs[links[i]].right}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-1.5">
          {rightOrder.map((rightIndex) => {
            const used = Object.values(links).includes(rightIndex);
            return (
              <button
                key={rightIndex}
                type="button"
                disabled={activeLeft === null}
                onClick={() => chooseRight(rightIndex)}
                className={cn(
                  "min-h-11 rounded-(--radius-control) border px-2.5 py-2 text-left text-sm transition-colors",
                  used ? "border-border/50 bg-surface-muted text-foreground-muted" : "border-border bg-surface text-foreground",
                  activeLeft === null && "opacity-60"
                )}
              >
                {pairs[rightIndex].right}
              </button>
            );
          })}
        </div>
      </div>

      {allMatched && (
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium",
              correctCount === pairs.length ? "text-accent" : "text-warning"
            )}
          >
            {correctCount === pairs.length ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
            Poprawnie {correctCount} z {pairs.length}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLinks({});
              setActiveLeft(null);
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Spróbuj ponownie
          </Button>
        </div>
      )}
    </Card>
  );
}
