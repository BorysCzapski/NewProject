"use client";

// ============================================================================
// components/geografia/lesson/map-explore-inner.tsx
// Leaflet map for the `map-explore` lesson block: numbered pins the student
// taps to read about a place. Client-only (mounted via map-explore-block
// .tsx's dynamic import) — Leaflet touches `window` at import time. Uses the
// same custom divIcon approach as the exercise-side pickers, avoiding
// Leaflet's default marker PNGs (whose paths don't resolve through the
// bundler).
// ============================================================================
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";

function numberedIcon(n: number, active: boolean) {
  const bg = active ? "#dc2626" : "#2563eb";
  return L.divIcon({
    className: "",
    html: `<div style="display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:9999px;background:${bg};color:#fff;font-weight:700;font-size:12px;border:2px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.4)">${n}</div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
}

export default function MapExploreInner({
  center,
  zoom,
  markers,
  selected,
  onSelect,
}: {
  center: [number, number];
  zoom: number;
  markers: { lat: number; lng: number; label: string; text: string }[];
  selected: number;
  onSelect: (index: number) => void;
}) {
  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((marker, i) => (
        <Marker
          key={i}
          position={[marker.lat, marker.lng]}
          icon={numberedIcon(i + 1, i === selected)}
          eventHandlers={{ click: () => onSelect(i) }}
        />
      ))}
    </MapContainer>
  );
}
