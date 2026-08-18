// ============================================================================
// components/geografia/dashboard/spaced-review-card.tsx
// "Szybka kontrola": one quick check-in exercise on an already-mastered
// topic (see lib/geografia/spaced-review.ts). Mirrors components/matma/
// dashboard/spaced-review-card.tsx.
// ============================================================================
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import type { SpacedReviewCandidate } from "@/lib/geografia/spaced-review";

export function SpacedReviewCard({ candidate }: { candidate: SpacedReviewCandidate }) {
  return (
    <Card className="flex items-start gap-3 bg-accent-soft">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Sparkles className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <CardDescription className="text-accent">Szybka kontrola: {candidate.topicTitle}</CardDescription>
        <CardTitle>Sprawdź, czy ten opanowany dział jest wciąż pewny</CardTitle>
        <Link
          href={`/geografia/cwiczenie/${candidate.exercise.id}?review=1`}
          className="mt-3 inline-flex h-9 items-center rounded-(--radius-control) bg-accent px-3.5 text-sm font-medium text-accent-foreground hover:opacity-90 active:opacity-80"
        >
          Zrób szybkie sprawdzenie
        </Link>
      </div>
    </Card>
  );
}
