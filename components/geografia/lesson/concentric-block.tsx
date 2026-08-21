"use client";

// ============================================================================
// components/geografia/lesson/concentric-block.tsx
// Nested shells drawn as a quarter-section cutaway — the standard way
// budowa wnętrza Ziemi is figured in every Polish textbook. Tap a shell to
// read it.
//
// Geometry is computed from the shell COUNT (equal-thickness rings), not
// from authored radii: real shell thicknesses span three orders of magnitude
// (skorupa ~35 km vs jądro ~3500 km) and drawing them to scale would make
// the crust an invisible hairline — exactly the shell students most need to
// click. The authored `range` text carries the true figures.
// ============================================================================
import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { RichText } from "@/components/geografia/lesson/rich-text";
import type { GeoTone } from "@/lib/geografia/lesson-blocks";
import { cn } from "@/lib/utils";

const SIZE = 200;

const TONE_FILL: Record<GeoTone, string> = {
  sky: "#7dd3fc",
  water: "#3b82f6",
  earth: "#b45309",
  rock: "#78716c",
  ice: "#a5f3fc",
  vegetation: "#16a34a",
  heat: "#f97316",
  neutral: "#94a3b8",
};

export function ConcentricBlock({
  title,
  caption,
  shells,
}: {
  title: string;
  caption?: string;
  shells: { name: string; range?: string; text: string; tone?: GeoTone }[];
}) {
  const [selected, setSelected] = useState(0);
  const step = SIZE / shells.length;

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <CardTitle>{title}</CardTitle>
        {caption && <RichText text={caption} className="mt-0.5 text-sm text-foreground-muted" />}
        <p className="mt-1 text-xs text-foreground-muted">Dotknij powłoki, aby poznać szczegóły.</p>
      </div>

      <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="h-44 w-44 shrink-0"
          role="img"
          aria-label={`Przekrój: ${title}`}
        >
          {/* Outermost first so inner shells paint on top. */}
          {shells.map((shell, i) => {
            const radius = SIZE - i * step;
            return (
              <circle
                key={i}
                cx={0}
                cy={SIZE}
                r={radius}
                fill={TONE_FILL[shell.tone ?? "neutral"]}
                stroke={i === selected ? "currentColor" : "rgba(0,0,0,0.25)"}
                strokeWidth={i === selected ? 3 : 1}
                className={cn("cursor-pointer text-primary", i !== selected && "opacity-85")}
                onClick={() => setSelected(i)}
              />
            );
          })}
        </svg>

        <div className="flex w-full flex-col gap-1">
          {shells.map((shell, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={cn(
                "flex items-center justify-between gap-2 rounded-(--radius-control) px-2.5 py-1.5 text-left text-sm transition-colors",
                i === selected ? "bg-primary-soft font-semibold text-primary" : "text-foreground active:bg-surface-muted"
              )}
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: TONE_FILL[shell.tone ?? "neutral"] }}
                />
                {shell.name}
              </span>
              {shell.range && <span className="shrink-0 text-xs tabular-nums text-foreground-muted">{shell.range}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-(--radius-control) bg-surface-muted px-3 py-2.5">
        <p className="text-sm font-semibold text-foreground">{shells[selected].name}</p>
        <RichText text={shells[selected].text} className="mt-0.5 text-sm text-foreground-muted" />
      </div>
    </Card>
  );
}
