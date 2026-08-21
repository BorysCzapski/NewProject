"use client";

// ============================================================================
// components/geografia/lesson/map-explore-block.tsx
// "Zobacz to na mapie" — theory anchored to real locations (wielkie systemy
// rzeczne, strefy subdukcji, okręgi przemysłowe, kraje z danego regionu).
// Wraps the Leaflet inner map with ssr:false (see map-explore-inner.tsx) and
// pairs it with a tappable list, so the block still works as a labelled list
// of places if tiles fail to load offline — the product spec's "fallback gdy
// brak połączenia z API map" applied to theory rather than exercises.
// ============================================================================
import { useState } from "react";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { RichText } from "@/components/geografia/lesson/rich-text";
import { cn } from "@/lib/utils";

const MapExploreInner = dynamic(() => import("@/components/geografia/lesson/map-explore-inner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full animate-pulse items-center justify-center bg-surface-muted text-foreground-muted">
      <MapPin className="h-6 w-6" />
    </div>
  ),
});

export function MapExploreBlock({
  title,
  caption,
  center,
  zoom,
  markers,
}: {
  title: string;
  caption?: string;
  center: [number, number];
  zoom: number;
  markers: { lat: number; lng: number; label: string; text: string }[];
}) {
  const [selected, setSelected] = useState(0);

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <CardTitle>{title}</CardTitle>
        {caption && <RichText text={caption} className="mt-0.5 text-sm text-foreground-muted" />}
      </div>

      <div className="h-64 w-full overflow-hidden rounded-(--radius-control) border border-border">
        <MapExploreInner center={center} zoom={zoom} markers={markers} selected={selected} onSelect={setSelected} />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {markers.map((marker, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelected(i)}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
              i === selected ? "bg-primary text-primary-foreground" : "bg-surface-muted text-foreground-muted"
            )}
          >
            {i + 1}. {marker.label}
          </button>
        ))}
      </div>

      {markers[selected] && (
        <div className="rounded-(--radius-control) bg-surface-muted px-3 py-2.5">
          <p className="text-sm font-semibold text-foreground">{markers[selected].label}</p>
          <RichText text={markers[selected].text} className="mt-0.5 text-sm text-foreground-muted" />
        </div>
      )}
    </Card>
  );
}
