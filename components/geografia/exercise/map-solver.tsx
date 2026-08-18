"use client";

// ============================================================================
// components/geografia/exercise/map-solver.tsx
// Map-based exercise: place a marker ('point') or click a region ('region'),
// submit, get programmatic partial-credit feedback (lib/geografia/map-
// grading.ts) — never AI-graded. `mapTask` passed in from the server never
// includes correct_answer (see app/(main)/geografia/cwiczenie/[id]/page.tsx).
// ============================================================================
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PointPicker } from "@/components/geografia/map/point-picker";
import { RegionPicker } from "@/components/geografia/map/region-picker";
import { submitExerciseAttempt, type ExerciseAttemptReview } from "@/lib/geografia/actions";
import type { GeoExerciseAttempt, GeoMapInteraction, GeoMapPointInput, GeoMapRegionInput } from "@/lib/types/database";

export function MapSolver({
  exerciseId,
  interactionType,
  inputData,
  pointsMax,
  isSpacedReview,
}: {
  exerciseId: string;
  interactionType: GeoMapInteraction;
  inputData: GeoMapPointInput | GeoMapRegionInput;
  pointsMax: number;
  isSpacedReview: boolean;
}) {
  const [startedAt] = useState(() => Date.now());
  const [point, setPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [regionId, setRegionId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ attempt: GeoExerciseAttempt; review: ExerciseAttemptReview } | null>(null);

  const hasAnswer = interactionType === "point" ? !!point : !!regionId;

  async function submit() {
    if (!hasAnswer) return;
    setIsPending(true);
    setError(null);
    const durationSeconds = Math.round((Date.now() - startedAt) / 1000);
    const answer = interactionType === "point" ? point! : { regionId: regionId! };
    const response = await submitExerciseAttempt(exerciseId, answer, durationSeconds, isSpacedReview);
    setIsPending(false);
    if (!response.ok) {
      setError(response.error);
      return;
    }
    setResult(response.data);
  }

  const answered = !!result;

  return (
    <div className="flex flex-col gap-3">
      {interactionType === "point" ? (
        <PointPicker input={inputData as GeoMapPointInput} value={point} onChange={(lat, lng) => setPoint({ lat, lng })} disabled={answered} />
      ) : (
        <RegionPicker input={inputData as GeoMapRegionInput} value={regionId} onChange={setRegionId} disabled={answered} />
      )}

      {!answered && (
        <Button disabled={!hasAnswer} isLoading={isPending} onClick={submit}>
          Sprawdź odpowiedź
        </Button>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      {answered && (
        <div className="flex flex-col gap-1">
          <p className={`text-sm font-medium ${result.attempt.points_awarded > 0 ? "text-accent" : "text-danger"}`}>
            Zdobyto {result.attempt.points_awarded} / {pointsMax} pkt.
          </p>
          {result.review.distanceKm !== undefined && (
            <p className="text-xs text-foreground-muted">
              Odległość od poprawnej lokalizacji: {Math.round(result.review.distanceKm)} km (tolerancja{" "}
              {result.review.toleranceKm} km).
            </p>
          )}
        </div>
      )}
    </div>
  );
}
