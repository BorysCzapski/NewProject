// ============================================================================
// lib/geografia/map-grading.ts
// Programmatic (never AI) scoring for map-based exercises — the product spec
// explicitly wants proportional partial credit for map tasks, no negative
// points, no arbitrary AI judgment call on "how close is close enough".
// Framework-free: safe to import from both server actions and client
// components (used for live "how am I doing" preview before submit).
// ============================================================================
import type { GeoMapPointAnswer, GeoMapRegionAnswer } from "@/lib/types/database";

const EARTH_RADIUS_KM = 6371;

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Full points within `toleranceKm`, zero beyond 3x tolerance, linear partial
 * credit in between. E.g. tolerance 50km: full to 50km, 0 pts from 150km on,
 * ~50% credit around 100km.
 */
export function gradeMapPointAttempt(
  correct: GeoMapPointAnswer,
  given: { lat: number; lng: number },
  pointsMax: number
): { pointsAwarded: number; distanceKm: number } {
  const distanceKm = haversineKm(correct, given);
  const zeroAt = correct.toleranceKm * 3;

  let ratio: number;
  if (distanceKm <= correct.toleranceKm) {
    ratio = 1;
  } else if (distanceKm >= zeroAt) {
    ratio = 0;
  } else {
    ratio = 1 - (distanceKm - correct.toleranceKm) / (zeroAt - correct.toleranceKm);
  }

  const pointsAwarded = Math.round(ratio * pointsMax * 100) / 100;
  return { pointsAwarded: Math.max(0, Math.min(pointsMax, pointsAwarded)), distanceKm };
}

/** Full points for the correct region, half credit for an adjacent
 * "partial" region (if the exercise author listed one), zero otherwise. */
export function gradeMapRegionAttempt(
  correct: GeoMapRegionAnswer,
  given: { regionId: string },
  pointsMax: number
): { pointsAwarded: number } {
  if (correct.correctRegionIds.includes(given.regionId)) {
    return { pointsAwarded: pointsMax };
  }
  if (correct.partialRegionIds?.includes(given.regionId)) {
    return { pointsAwarded: Math.round((pointsMax / 2) * 100) / 100 };
  }
  return { pointsAwarded: 0 };
}
