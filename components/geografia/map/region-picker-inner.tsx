"use client";

// ============================================================================
// components/geografia/map/region-picker-inner.tsx
// The actual Leaflet map for a "region" map exercise: click one of several
// predefined GeoJSON polygons (e.g. "wskaż strefę klimatów zwrotnikowych").
// Only ever mounted client-side via region-picker.tsx. See point-picker-
// inner.tsx's header comment for why this file can't run during SSR.
// ============================================================================
import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import type { Layer, PathOptions } from "leaflet";
import type { Feature } from "geojson";
import type { GeoMapRegionInput } from "@/lib/types/database";

export default function RegionPickerInner({
  input,
  value,
  onChange,
  disabled,
}: {
  input: GeoMapRegionInput;
  value: string | null;
  onChange: (regionId: string) => void;
  disabled?: boolean;
}) {
  // react-leaflet only reads style/eventHandlers once per GeoJSON data
  // identity, so `value` must be captured via a key remount instead of
  // relying on live re-styling — simplest correct option for a handful of
  // polygons per exercise.
  const key = value ?? "none";

  const style = useMemo(
    () =>
      (feature?: Feature): PathOptions => {
        const regionId = feature?.properties?.regionId as string | undefined;
        const selected = regionId === value;
        return {
          color: selected ? "#dc2626" : "#2563eb",
          weight: selected ? 3 : 1.5,
          fillColor: selected ? "#dc2626" : "#2563eb",
          fillOpacity: selected ? 0.35 : 0.12,
        };
      },
    [value]
  );

  const onEachFeature = useMemo(
    () => (feature: Feature, layer: Layer) => {
      const regionId = feature.properties?.regionId as string | undefined;
      const label = feature.properties?.label as string | undefined;
      if (label) layer.bindTooltip(label, { sticky: true });
      if (!disabled && regionId) {
        layer.on("click", () => onChange(regionId));
      }
    },
    [disabled, onChange]
  );

  return (
    <MapContainer center={input.center} zoom={input.zoom} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <GeoJSON key={key} data={input.geojson as never} style={style} onEachFeature={onEachFeature} />
    </MapContainer>
  );
}
