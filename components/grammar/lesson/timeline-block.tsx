"use client";

// ============================================================================
// components/grammar/lesson/timeline-block.tsx
// Interactive tense timeline: a horizontal time axis with a fixed "TERAZ"
// line at the midpoint, plus tappable markers — dots for single events,
// bars for durations/states. Tapping a marker shows its example sentence.
// ============================================================================
import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { TimelineMarker } from "@/lib/grammar/lesson-blocks";

export function TimelineBlock({
  title,
  caption,
  markers,
}: {
  title?: string;
  caption?: string;
  markers: TimelineMarker[];
}) {
  const [selected, setSelected] = useState<number | null>(markers.length > 0 ? 0 : null);
  const selectedMarker = selected !== null ? markers[selected] : null;

  return (
    <Card>
      {title && <CardTitle>{title}</CardTitle>}

      <div className="relative mt-6 h-20 select-none">
        {/* Axis */}
        <div className="absolute left-0 right-0 top-1/2 h-0.5 -translate-y-1/2 rounded bg-border" />
        {/* Arrowhead (future direction) */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-foreground-muted">▸</div>

        {/* "TERAZ" line at the midpoint */}
        <div className="absolute left-1/2 top-1 bottom-1 w-px -translate-x-1/2 border-l-2 border-dashed border-danger/60" />
        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full pb-1 text-[10px] font-bold uppercase tracking-wide text-danger">
          teraz
        </span>

        {/* Edge labels */}
        <span className="absolute bottom-0 left-0 text-[10px] uppercase tracking-wide text-foreground-muted">
          przeszłość
        </span>
        <span className="absolute bottom-0 right-0 text-[10px] uppercase tracking-wide text-foreground-muted">
          przyszłość
        </span>

        {markers.map((marker, i) =>
          marker.to !== undefined ? (
            // Span marker (duration / state)
            <button
              key={i}
              type="button"
              onClick={() => setSelected(selected === i ? null : i)}
              style={{ left: `${marker.at}%`, width: `${marker.to - marker.at}%` }}
              className={cn(
                "absolute top-1/2 h-4 -translate-y-1/2 rounded-full border-2 transition-colors",
                selected === i
                  ? "border-accent bg-accent/70"
                  : "border-accent bg-accent-soft active:bg-accent/40"
              )}
              aria-label={marker.label}
            />
          ) : (
            // Point marker (single event)
            <button
              key={i}
              type="button"
              onClick={() => setSelected(selected === i ? null : i)}
              style={{ left: `${marker.at}%` }}
              className={cn(
                "absolute top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-transform",
                selected === i
                  ? "scale-110 border-primary bg-primary"
                  : "border-primary bg-primary-soft active:scale-95"
              )}
              aria-label={marker.label}
            />
          )
        )}
      </div>

      {/* Marker chips (readable labels — the axis itself stays uncluttered) */}
      <div className="mt-2 flex flex-wrap gap-1.5">
        {markers.map((marker, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelected(selected === i ? null : i)}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
              selected === i
                ? marker.to !== undefined
                  ? "bg-accent text-accent-foreground"
                  : "bg-primary text-primary-foreground"
                : "bg-surface-muted text-foreground-muted"
            )}
          >
            {marker.label}
          </button>
        ))}
      </div>

      {selectedMarker?.example && (
        <div className="mt-3 rounded-(--radius-control) bg-surface-muted px-3 py-2.5">
          <p className="text-sm font-medium text-foreground">{selectedMarker.example.en}</p>
          <p className="mt-0.5 text-sm text-foreground-muted">{selectedMarker.example.pl}</p>
        </div>
      )}

      {caption && <p className="mt-3 text-sm text-foreground-muted">{caption}</p>}
    </Card>
  );
}
