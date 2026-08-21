"use client";

// ============================================================================
// components/grammar/lesson/flashcards-block.tsx
// A short in-lesson deck: front, tap to flip, next. Deliberately much smaller
// than components/vocabulary/flashcard-trainer.tsx — that one runs a scored
// session against vocabulary_progress, this one is a few cards embedded in a
// lesson so a chunk of vocabulary can be met where it is explained, without
// sending the student off to another screen.
// ============================================================================
import { useState } from "react";
import { ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { FlashcardItem } from "@/lib/grammar/lesson-blocks";

export function FlashcardsBlock({ title, cards }: { title?: string; cards: FlashcardItem[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[index];
  if (!card) return null;

  function go(delta: number) {
    setFlipped(false);
    setIndex((prev) => (prev + delta + cards.length) % cards.length);
  }

  return (
    <Card className="border-primary/30">
      <div className="flex items-baseline justify-between gap-2">
        <CardTitle>{title ?? "Fiszki"}</CardTitle>
        <span className="shrink-0 text-xs tabular-nums text-foreground-muted">
          {index + 1}/{cards.length}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((value) => !value)}
        className={cn(
          "mt-3 flex min-h-28 w-full flex-col items-center justify-center gap-1.5 rounded-(--radius-control) px-4 py-5 text-center transition-colors",
          flipped ? "bg-primary-soft" : "bg-surface-muted active:bg-border/50"
        )}
      >
        {!flipped ? (
          <>
            <span className="text-lg font-semibold text-foreground">{card.front}</span>
            <span className="flex items-center gap-1 text-xs text-foreground-muted">
              <RotateCcw className="h-3 w-3" />
              dotknij, by odwrócić
            </span>
          </>
        ) : (
          <>
            <span className="text-lg font-semibold text-primary">{card.back}</span>
            {card.example && (
              <span className="text-sm italic leading-relaxed text-foreground-muted">{card.example}</span>
            )}
          </>
        )}
      </button>

      <div className="mt-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Poprzednia fiszka"
          className="flex min-h-11 items-center gap-1 rounded-(--radius-control) px-3 text-sm font-medium text-foreground-muted active:bg-surface-muted"
        >
          <ChevronLeft className="h-4 w-4" />
          Wstecz
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Następna fiszka"
          className="flex min-h-11 items-center gap-1 rounded-(--radius-control) px-3 text-sm font-medium text-primary active:bg-primary-soft"
        >
          Dalej
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </Card>
  );
}
