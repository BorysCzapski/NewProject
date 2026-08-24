"use client";

// ============================================================================
// components/gitara/lesson/caged-block.tsx
// Steps through the 5 CAGED shapes (lib/gitara/theory.ts, root C — see that
// file for why C is the fixed example) one at a time, the same "walk one
// frame at a time" idea as Algorytmy's Stepper, kept as a standalone
// prev/next here since there are always exactly 5 fixed frames rather than a
// computed trace.
// ============================================================================
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { ChordDiagram } from "@/components/gitara/chord-diagram";
import { RichText } from "@/components/gitara/lesson/rich-text";
import { CAGED_SHAPES_ROOT_C } from "@/lib/gitara/theory";
import { cn } from "@/lib/utils";

export function CagedBlock({ title, caption }: { title: string; caption?: string }) {
  const [index, setIndex] = useState(0);
  const shape = CAGED_SHAPES_ROOT_C[index];
  const last = CAGED_SHAPES_ROOT_C.length - 1;

  return (
    <Card className="flex flex-col gap-3">
      <CardTitle>{title}</CardTitle>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Poprzedni kształt"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-foreground disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <ChordDiagram chord={shape.chord} label={`Kształt ${shape.label} — C-dur`} size="md" />

        <button
          type="button"
          aria-label="Następny kształt"
          onClick={() => setIndex((i) => Math.min(last, i + 1))}
          disabled={index === last}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-muted text-foreground disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="flex justify-center gap-1.5">
        {CAGED_SHAPES_ROOT_C.map((s, i) => (
          <button
            key={s.label}
            type="button"
            aria-label={`Kształt ${s.label}`}
            onClick={() => setIndex(i)}
            className={cn("h-2 w-2 rounded-full transition-colors", i === index ? "bg-primary" : "bg-border")}
          />
        ))}
      </div>

      <p className="text-center text-xs text-foreground-muted">
        Pozycja {index + 1} / {CAGED_SHAPES_ROOT_C.length}: kształt {shape.label}
      </p>

      {caption && <RichText text={caption} className="text-xs text-foreground-muted" />}
    </Card>
  );
}
