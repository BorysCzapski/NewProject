"use client";

// ============================================================================
// components/geografia/map/region-picker.tsx
// Client-only wrapper around region-picker-inner.tsx — see point-picker.tsx
// header comment for why ssr:false is required.
// ============================================================================
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import type { GeoMapRegionInput } from "@/lib/types/database";

const RegionPickerInner = dynamic(() => import("@/components/geografia/map/region-picker-inner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full animate-pulse items-center justify-center bg-surface-muted text-foreground-muted">
      <MapPin className="h-6 w-6" />
    </div>
  ),
});

export function RegionPicker(props: {
  input: GeoMapRegionInput;
  value: string | null;
  onChange: (regionId: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="h-72 w-full overflow-hidden rounded-(--radius-card) border border-border">
      <RegionPickerInner {...props} />
    </div>
  );
}
