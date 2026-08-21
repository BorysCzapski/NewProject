"use client";

// ============================================================================
// components/grammar/lesson/order-words-block.tsx
// Build-the-sentence drill: tap chunks to assemble a sentence, tap an
// assembled chunk to send it back. Word order is where Polish interference
// shows up hardest (Spanish clitic placement, adjective position, English
// adverb position), and it is the one thing a multiple-choice question cannot
// test.
//
// Authored content gives only the CORRECT order; the shuffle happens here, so
// a lesson can never disagree with itself about the answer.
// ============================================================================
import { useMemo, useState } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { seededShuffleDistinct } from "@/lib/grammar/shuffle";
import type { OrderWordsItem } from "@/lib/grammar/lesson-blocks";

interface Chunk {
  /** Position in the correct order — the identity of this chunk. */
  id: number;
  text: string;
}

function ItemDrill({ item, seed }: { item: OrderWordsItem; seed: string }) {
  const pool = useMemo<Chunk[]>(
    () =>
      seededShuffleDistinct(
        item.correct.map((text, id) => ({ id, text })),
        seed
      ),
    [item.correct, seed]
  );

  const [placed, setPlaced] = useState<Chunk[]>([]);
  const remaining = pool.filter((chunk) => !placed.some((p) => p.id === chunk.id));
  const complete = placed.length === item.correct.length;
  // Compare by text, not id: a sentence may legitimately repeat a chunk
  // ("por... por..."), and either copy in either slot is equally right.
  const correct = complete && placed.every((chunk, i) => chunk.text === item.correct[i]);

  return (
    <li className="flex flex-col gap-2 border-t border-border pt-3 first:border-t-0 first:pt-0">
      <div
        className={cn(
          "flex min-h-12 flex-wrap items-center gap-1.5 rounded-(--radius-control) border border-dashed px-2.5 py-2",
          !complete && "border-border bg-surface-muted/50",
          complete && correct && "border-accent bg-accent-soft",
          complete && !correct && "border-danger bg-danger-soft"
        )}
      >
        {placed.length === 0 && (
          <span className="text-sm text-foreground-muted">Ułóż zdanie, dotykając wyrazów niżej…</span>
        )}
        {placed.map((chunk, i) => (
          <button
            key={`${chunk.id}-${i}`}
            type="button"
            onClick={() => setPlaced((prev) => prev.filter((_, index) => index !== i))}
            className="rounded-(--radius-control) bg-surface px-2.5 py-1.5 text-sm font-medium text-foreground shadow-sm active:opacity-70"
          >
            {chunk.text}
          </button>
        ))}
      </div>

      {remaining.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {remaining.map((chunk) => (
            <button
              key={chunk.id}
              type="button"
              onClick={() => setPlaced((prev) => [...prev, chunk])}
              className="rounded-(--radius-control) border border-border bg-surface px-2.5 py-1.5 text-sm font-medium text-foreground active:bg-surface-muted"
            >
              {chunk.text}
            </button>
          ))}
        </div>
      )}

      {complete && correct && (
        <p className="flex items-start gap-1.5 text-xs leading-relaxed text-accent">
          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            Dobrze.{item.pl ? ` ${item.pl}` : ""}
            {item.note ? ` — ${item.note}` : ""}
          </span>
        </p>
      )}

      {complete && !correct && (
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-danger">
            <X className="h-3.5 w-3.5 shrink-0" />
            Nie ta kolejność
          </span>
          <button
            type="button"
            onClick={() => setPlaced([])}
            className="flex items-center gap-1 font-medium text-foreground-muted underline"
          >
            <RotateCcw className="h-3.5 w-3.5 shrink-0" />
            Zacznij od nowa
          </button>
        </div>
      )}
    </li>
  );
}

export function OrderWordsBlock({
  title,
  instruction,
  items,
}: {
  title?: string;
  instruction?: string;
  items: OrderWordsItem[];
}) {
  return (
    <Card className="border-primary/30">
      <CardTitle>{title ?? "Ułóż zdanie"}</CardTitle>
      <p className="mt-1 text-sm text-foreground-muted">
        {instruction ?? "Dotykaj wyrazów w odpowiedniej kolejności. Dotknij ułożonego wyrazu, by go cofnąć."}
      </p>
      <ul className="mt-3 flex flex-col gap-3">
        {items.map((item, i) => (
          <ItemDrill key={i} item={item} seed={item.correct.join("|")} />
        ))}
      </ul>
    </Card>
  );
}
