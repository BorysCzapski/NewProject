"use client";

// ============================================================================
// components/grammar/lesson/key-phrases-block.tsx
// A grouped bank of ready-made phrases (openers, connectors, closings) for the
// writing part of the exam. Two modes on one toggle: translations visible,
// which is how you use a phrase bank while drafting, and translations hidden,
// which turns the same list into a self-test before the exam.
//
// Groups collapse so a long bank stays scannable on a phone; the first group
// starts open so the block never reads as empty.
// ============================================================================
import { useState } from "react";
import { ChevronDown, Eye, EyeOff } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PhraseGroup } from "@/lib/grammar/lesson-blocks";

export function KeyPhrasesBlock({
  title,
  caption,
  groups,
}: {
  title?: string;
  caption?: string;
  groups: PhraseGroup[];
}) {
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  const [hideTranslations, setHideTranslations] = useState(false);

  function toggle(index: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <Card>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <CardTitle>{title ?? "Zwroty do wykorzystania"}</CardTitle>
          {caption && <p className="mt-0.5 text-sm text-foreground-muted">{caption}</p>}
        </div>
        <button
          type="button"
          onClick={() => setHideTranslations((value) => !value)}
          className="flex shrink-0 items-center gap-1 rounded-(--radius-control) px-2 py-1.5 text-xs font-medium text-foreground-muted active:bg-surface-muted"
        >
          {hideTranslations ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
          {hideTranslations ? "Pokaż PL" : "Ukryj PL"}
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-1.5">
        {groups.map((group, i) => {
          const isOpen = open.has(i);
          return (
            <div key={i} className="rounded-(--radius-control) bg-surface-muted">
              <button
                type="button"
                onClick={() => toggle(i)}
                className="flex min-h-11 w-full items-center justify-between gap-2 px-3 py-2 text-left"
              >
                <span className="text-sm font-semibold text-foreground">{group.label}</span>
                <span className="flex shrink-0 items-center gap-1.5">
                  <span className="text-xs tabular-nums text-foreground-muted">{group.phrases.length}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-foreground-muted transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </span>
              </button>
              {isOpen && (
                <ul className="flex flex-col gap-1.5 px-3 pb-3">
                  {group.phrases.map((phrase, j) => (
                    <li key={j} className="rounded-(--radius-control) bg-surface px-3 py-2">
                      <p className="text-sm font-medium leading-relaxed text-foreground">{phrase.text}</p>
                      {!hideTranslations && (
                        <p className="mt-0.5 text-xs leading-relaxed text-foreground-muted">{phrase.pl}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
