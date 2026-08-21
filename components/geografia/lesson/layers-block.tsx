"use client";

// ============================================================================
// components/geografia/lesson/layers-block.tsx
// Interactive stack of labeled bands — tap one to read it. Deliberately
// generic: this single primitive renders warstwy atmosfery, poziomy glebowe,
// strefy głębokościowe oceanu, piętra roślinne w górach and geological
// columns, because all of them are "an ordered stack read from one end,
// each band with a range and a description".
//
// `orientation: "bottom-up"` reverses the visual order so the FIRST authored
// item sits at the bottom — correct for atmosphere (troposfera at ground
// level) and vegetation belts (regiel dolny at the foot of the mountain),
// while soil horizons and ocean zones read naturally top-down.
// ============================================================================
import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { RichText } from "@/components/geografia/lesson/rich-text";
import { toneClass, type GeoTone } from "@/lib/geografia/lesson-blocks";
import { cn } from "@/lib/utils";

export function LayersBlock({
  title,
  caption,
  orientation = "top-down",
  layers,
}: {
  title: string;
  caption?: string;
  orientation?: "top-down" | "bottom-up";
  layers: { name: string; range?: string; text: string; tone?: GeoTone }[];
}) {
  const [selected, setSelected] = useState(0);
  // Visual order only — `selected` always indexes the authored array.
  const order = orientation === "bottom-up" ? [...layers.keys()].reverse() : [...layers.keys()];

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <CardTitle>{title}</CardTitle>
        {caption && <RichText text={caption} className="mt-0.5 text-sm text-foreground-muted" />}
        <p className="mt-1 text-xs text-foreground-muted">Dotknij warstwy, aby poznać szczegóły.</p>
      </div>

      <div className="flex flex-col gap-1">
        {order.map((index) => {
          const layer = layers[index];
          const isSelected = index === selected;
          return (
            <button
              key={index}
              type="button"
              onClick={() => setSelected(index)}
              className={cn(
                "flex min-h-12 items-center justify-between gap-2 rounded-(--radius-control) px-3 py-2 text-left transition-all",
                toneClass(layer.tone),
                isSelected ? "ring-2 ring-primary" : "opacity-80 hover:opacity-100"
              )}
            >
              <span className="text-sm font-semibold">{layer.name}</span>
              {layer.range && <span className="shrink-0 text-xs font-medium tabular-nums">{layer.range}</span>}
            </button>
          );
        })}
      </div>

      <div className="rounded-(--radius-control) bg-surface-muted px-3 py-2.5">
        <p className="text-sm font-semibold text-foreground">{layers[selected].name}</p>
        <RichText text={layers[selected].text} className="mt-0.5 text-sm text-foreground-muted" />
      </div>
    </Card>
  );
}
