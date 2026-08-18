"use client";

// ============================================================================
// components/geografia/map/point-picker-inner.tsx
// The actual Leaflet map for a "point" map exercise (e.g. "zaznacz na mapie
// deltę Nilu"). Only ever mounted client-side via point-picker.tsx's
// next/dynamic(..., { ssr: false }) — Leaflet touches `window` at import
// time, so it can never run during server rendering. A custom colored
// divIcon avoids the classic Leaflet-in-webpack "marker icon 404" issue
// (its default PNG icon paths don't resolve through Next's bundler) rather
// than working around it with an extra asset-copy step.
// ============================================================================
import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import type { GeoMapPointInput } from "@/lib/types/database";

function pinIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<svg width="28" height="38" viewBox="0 0 28 38" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.3 0 0 6.3 0 14c0 10.5 14 24 14 24s14-13.5 14-24C28 6.3 21.7 0 14 0z" fill="${color}"/>
      <circle cx="14" cy="14" r="6" fill="white"/>
    </svg>`,
    iconSize: [28, 38],
    iconAnchor: [14, 38],
  });
}

const PICKED_ICON = pinIcon("#dc2626");

function ClickHandler({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function PointPickerInner({
  input,
  value,
  onChange,
  disabled,
}: {
  input: GeoMapPointInput;
  value: { lat: number; lng: number } | null;
  onChange: (lat: number, lng: number) => void;
  disabled?: boolean;
}) {
  const icon = useMemo(() => PICKED_ICON, []);

  return (
    <MapContainer
      center={input.center}
      zoom={input.zoom}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {!disabled && <ClickHandler onPick={onChange} />}
      {value && <Marker position={[value.lat, value.lng]} icon={icon} />}
    </MapContainer>
  );
}
