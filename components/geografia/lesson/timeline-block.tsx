"use client";

// ============================================================================
// components/geografia/lesson/timeline-block.tsx
// Chronological phases with a period label — fazy przejścia demograficznego,
// orogenezy, etapy rozwoju miast, historia zlodowaceń. Everything is visible
// at once (unlike ProcessBlock's progressive reveal) because with a timeline
// the comparison BETWEEN periods is the lesson; tapping expands one entry.
// ============================================================================
import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { RichText } from "@/components/geografia/lesson/rich-text";
import { cn } from "@/lib/utils";

export function TimelineBlock({
  title,
  caption,
  events,
}: {
  title: string;
  caption?: string;
  events: { period: string; label: string; text: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <CardTitle>{title}</CardTitle>
        {caption && <RichText text={caption} className="mt-0.5 text-sm text-foreground-muted" />}
      </div>

      <ol className="flex flex-col">
        {events.map((event, i) => {
          const isOpen = open === i;
          const isLast = i === events.length - 1;
          return (
            <li key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    "mt-1 h-3 w-3 shrink-0 rounded-full border-2",
                    isOpen ? "border-primary bg-primary" : "border-border bg-surface"
                  )}
                />
                {!isLast && <span className="w-px flex-1 bg-border" />}
              </div>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                className="min-w-0 flex-1 pb-3 text-left"
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">{event.period}</p>
                <p className="text-sm font-semibold text-foreground">{event.label}</p>
                {isOpen && <RichText text={event.text} className="mt-1 text-sm text-foreground-muted" />}
              </button>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
