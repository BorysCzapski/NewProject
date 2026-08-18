"use client";

// ============================================================================
// components/geografia/map/point-picker.tsx
// Client-only wrapper around point-picker-inner.tsx (ssr:false — Leaflet
// needs `window`, see that file's header comment). Renders a skeleton while
// the map bundle loads, and a plain error state if OpenStreetMap tiles can't
// be reached at all (offline) — the product spec calls for graceful
// degradation rather than a broken blank map when the map API is unreachable.
// ============================================================================
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import type { GeoMapPointInput } from "@/lib/types/database";

const PointPickerInner = dynamic(() => import("@/components/geografia/map/point-picker-inner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full animate-pulse items-center justify-center bg-surface-muted text-foreground-muted">
      <MapPin className="h-6 w-6" />
    </div>
  ),
});

export function PointPicker(props: {
  input: GeoMapPointInput;
  value: { lat: number; lng: number } | null;
  onChange: (lat: number, lng: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="h-72 w-full overflow-hidden rounded-(--radius-card) border border-border">
      <PointPickerInner {...props} />
    </div>
  );
}
