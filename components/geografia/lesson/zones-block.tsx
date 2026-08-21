"use client";

// ============================================================================
// components/geografia/lesson/zones-block.tsx
// Latitudinal bands on a schematic hemisphere-to-hemisphere strip — strefy
// klimatyczne, pasy ciśnienia, strefy wiatrowe, strefy roślinne. Distinct
// from LayersBlock (a vertical stack read from one end) because zones are
// SYMMETRIC about the equator, and showing that symmetry is the whole
// didactic point: a student who sees that the pattern mirrors north/south
// stops memorising twice as many facts as they need to.
// ============================================================================
import { useState } from "react";
import { Card, CardTitle } from "@/components/ui/card";
import { RichText } from "@/components/geografia/lesson/rich-text";
import { toneClass, type GeoTone } from "@/lib/geografia/lesson-blocks";
import { cn } from "@/lib/utils";

export function ZonesBlock({
  title,
  caption,
  zones,
}: {
  title: string;
  caption?: string;
  zones: { name: string; latitude: string; text: string; tone?: GeoTone }[];
}) {
  const [selected, setSelected] = useState(0);

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <CardTitle>{title}</CardTitle>
        {caption && <RichText text={caption} className="mt-0.5 text-sm text-foreground-muted" />}
        <p className="mt-1 text-xs text-foreground-muted">
          Strefy podano od bieguna do równika — układ powtarza się symetrycznie na obu półkulach.
        </p>
      </div>

      <div className="flex flex-col gap-1">
        {zones.map((zone, i) => {
          const isSelected = i === selected;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={cn(
                "flex min-h-11 items-center justify-between gap-2 rounded-(--radius-control) px-3 py-2 text-left transition-all",
                toneClass(zone.tone),
                isSelected ? "ring-2 ring-primary" : "opacity-80 hover:opacity-100"
              )}
            >
              <span className="text-sm font-semibold">{zone.name}</span>
              <span className="shrink-0 rounded-full bg-black/10 px-2 py-0.5 text-xs font-medium tabular-nums dark:bg-white/15">
                {zone.latitude}
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-(--radius-control) bg-surface-muted px-3 py-2.5">
        <p className="text-sm font-semibold text-foreground">
          {zones[selected].name}{" "}
          <span className="font-normal text-foreground-muted">· {zones[selected].latitude}</span>
        </p>
        <RichText text={zones[selected].text} className="mt-0.5 text-sm text-foreground-muted" />
      </div>
    </Card>
  );
}
