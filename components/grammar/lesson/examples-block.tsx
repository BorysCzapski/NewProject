"use client";

// ============================================================================
// components/grammar/lesson/examples-block.tsx
// Tap-to-reveal example sentences: the English sentence (with the grammar
// point highlighted) is always visible; tapping a row reveals the Polish
// translation. Encourages active recall instead of passive reading.
// ============================================================================
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ExampleItem } from "@/lib/grammar/lesson-blocks";

function HighlightedSentence({ item }: { item: ExampleItem }) {
  if (!item.highlight) return <>{item.en}</>;
  const index = item.en.toLowerCase().indexOf(item.highlight.toLowerCase());
  if (index === -1) return <>{item.en}</>;
  return (
    <>
      {item.en.slice(0, index)}
      <span className="rounded bg-primary-soft px-1 font-semibold text-primary">
        {item.en.slice(index, index + item.highlight.length)}
      </span>
      {item.en.slice(index + item.highlight.length)}
    </>
  );
}

export function ExamplesBlock({ title, items }: { title?: string; items: ExampleItem[] }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <Card>
      <div className="flex items-baseline justify-between gap-2">
        <CardTitle>{title ?? "Przykłady"}</CardTitle>
        <span className="text-xs text-foreground-muted">dotknij, by zobaczyć tłumaczenie</span>
      </div>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item, i) => {
          const isRevealed = revealed.has(i);
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                className="w-full rounded-(--radius-control) bg-surface-muted px-3 py-2.5 text-left transition-colors active:bg-border/50"
              >
                <span className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium leading-relaxed text-foreground">
                    <HighlightedSentence item={item} />
                  </span>
                  <ChevronDown
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0 text-foreground-muted transition-transform",
                      isRevealed && "rotate-180"
                    )}
                  />
                </span>
                {isRevealed && (
                  <span className="mt-1 block text-sm text-foreground-muted">{item.pl}</span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
