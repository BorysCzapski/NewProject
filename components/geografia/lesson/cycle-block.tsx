"use client";

// ============================================================================
// components/geografia/lesson/cycle-block.tsx
// A closed loop of stages arranged around a circle with arrows — obieg wody
// w przyrodzie, cykl skalny, obieg węgla/azotu. The circular layout (rather
// than a numbered list) is the point: it shows there is no "first" stage,
// which is exactly the misconception a linear list creates.
// Stage positions are computed from the stage count, so any 3-8 stage cycle
// lays out correctly without authored coordinates.
// ============================================================================
import { useState } from "react";
import { RotateCw } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { RichText } from "@/components/geografia/lesson/rich-text";
import { cn } from "@/lib/utils";

const SIZE = 240;
const CENTER = SIZE / 2;
const RADIUS = 88;

export function CycleBlock({
  title,
  caption,
  stages,
}: {
  title: string;
  caption?: string;
  stages: { name: string; text: string }[];
}) {
  const [selected, setSelected] = useState(0);

  // Start at 12 o'clock and go clockwise.
  const positions = stages.map((_, i) => {
    const angle = (i / stages.length) * 2 * Math.PI - Math.PI / 2;
    return { x: CENTER + RADIUS * Math.cos(angle), y: CENTER + RADIUS * Math.sin(angle) };
  });

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <CardTitle className="flex items-center gap-2">
          <RotateCw className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
        {caption && <RichText text={caption} className="mt-0.5 text-sm text-foreground-muted" />}
        <p className="mt-1 text-xs text-foreground-muted">Dotknij etapu, aby poznać szczegóły.</p>
      </div>

      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto w-full max-w-[280px]" role="img" aria-label={title}>
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          className="text-border"
        />
        {positions.map((pos, i) => {
          const isSelected = i === selected;
          return (
            <g key={i} onClick={() => setSelected(i)} className="cursor-pointer">
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isSelected ? 24 : 20}
                className={cn(isSelected ? "fill-primary" : "fill-surface-muted stroke-border")}
                strokeWidth={1}
              />
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                className={cn("text-[13px] font-bold", isSelected ? "fill-primary-foreground" : "fill-foreground")}
              >
                {i + 1}
              </text>
            </g>
          );
        })}
        <text x={CENTER} y={CENTER + 4} textAnchor="middle" className="fill-foreground-muted text-[11px] font-medium">
          {stages.length} etapów
        </text>
      </svg>

      <div className="flex flex-wrap gap-1.5">
        {stages.map((stage, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelected(i)}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
              i === selected ? "bg-primary text-primary-foreground" : "bg-surface-muted text-foreground-muted"
            )}
          >
            {i + 1}. {stage.name}
          </button>
        ))}
      </div>

      <div className="rounded-(--radius-control) bg-surface-muted px-3 py-2.5">
        <p className="text-sm font-semibold text-foreground">
          {selected + 1}. {stages[selected].name}
        </p>
        <RichText text={stages[selected].text} className="mt-0.5 text-sm text-foreground-muted" />
      </div>
    </Card>
  );
}
