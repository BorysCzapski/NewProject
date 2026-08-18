"use client";

// ============================================================================
// components/geografia/admin/review-queue-item.tsx
// One AI-generated or uploaded exercise pending admin review (needs_review).
// "Sprawdzone" clears the flag; "Usuń" removes a bad/wrong exercise outright.
// ============================================================================
import { useState, useTransition } from "react";
import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { deleteExercise, markExerciseReviewed } from "@/lib/geografia/admin-actions";
import type { GeoExercise } from "@/lib/types/database";

const TYPE_LABELS = { mc: "Zamknięte", open: "Otwarte", map: "Mapa" };
const SOURCE_LABELS = { built_in: "wbudowane", ai_generated: "AI", uploaded: "wgrane" };

export function ReviewQueueItem({ exercise, topicTitle }: { exercise: GeoExercise; topicTitle: string }) {
  const [hidden, setHidden] = useState(false);
  const [isPending, startTransition] = useTransition();
  if (hidden) return null;

  return (
    <Card className="flex flex-col gap-2">
      <p className="text-xs text-foreground-muted">{topicTitle}</p>
      <p className="text-sm text-foreground">{exercise.prompt.statement}</p>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge>{TYPE_LABELS[exercise.type]}</Badge>
        <Badge>{SOURCE_LABELS[exercise.source]}</Badge>
        <Badge>{exercise.points_max} pkt</Badge>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          isLoading={isPending}
          onClick={() => startTransition(async () => { const r = await markExerciseReviewed(exercise.id); if (r.ok) setHidden(true); })}
        >
          <Check className="h-4 w-4" />
          Sprawdzone
        </Button>
        <Button
          size="sm"
          variant="danger"
          isLoading={isPending}
          onClick={() => startTransition(async () => { const r = await deleteExercise(exercise.id); if (r.ok) setHidden(true); })}
        >
          <Trash2 className="h-4 w-4" />
          Usuń
        </Button>
      </div>
    </Card>
  );
}
