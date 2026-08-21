"use client";

// ============================================================================
// components/geografia/lesson/process-block.tsx
// A multi-step process revealed one step at a time (frontogeneza, subdukcja,
// meandrowanie rzeki, przejście demograficzne). Progressive reveal rather
// than a static numbered list, because the didactic point of a process is
// the ORDER — a student who can see step 5 while reading step 2 never has
// to predict what comes next, which is exactly the thinking being trained.
// ============================================================================
import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/geografia/lesson/rich-text";
import { cn } from "@/lib/utils";

export function ProcessBlock({
  title,
  caption,
  steps,
}: {
  title: string;
  caption?: string;
  steps: { title: string; text: string }[];
}) {
  const [revealed, setRevealed] = useState(1);
  const allRevealed = revealed >= steps.length;

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <CardTitle>{title}</CardTitle>
        {caption && <RichText text={caption} className="mt-0.5 text-sm text-foreground-muted" />}
      </div>

      <ol className="flex flex-col gap-2">
        {steps.slice(0, revealed).map((step, i) => (
          <li key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  i === revealed - 1 && !allRevealed
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary-soft text-primary"
                )}
              >
                {i + 1}
              </span>
              {i < revealed - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
            </div>
            <div className="min-w-0 flex-1 pb-2">
              <p className="text-sm font-semibold text-foreground">{step.title}</p>
              <RichText text={step.text} className="mt-0.5 text-sm text-foreground-muted" />
            </div>
          </li>
        ))}
      </ol>

      {!allRevealed ? (
        <Button variant="outline" size="sm" className="self-start" onClick={() => setRevealed((n) => n + 1)}>
          <ChevronDown className="h-4 w-4" />
          Następny etap ({revealed}/{steps.length})
        </Button>
      ) : (
        <p className="flex items-center gap-1.5 text-xs font-medium text-accent">
          <Check className="h-3.5 w-3.5" />
          Cały proces ({steps.length} {steps.length === 1 ? "etap" : "etapów"})
        </p>
      )}
    </Card>
  );
}
