// ============================================================================
// components/matma/dashboard/spaced-review-card.tsx
// "Szybka kontrola": one quick check-in problem on an already-mastered topic
// so it doesn't quietly rot before the exam (see lib/matma/spaced-review.ts).
// The page only renders this component when a candidate is present, and
// resolves topicSlug itself (the candidate only carries topicId).
// ============================================================================
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import type { SpacedReviewCandidate } from "@/lib/matma/spaced-review";

export function SpacedReviewCard({
  candidate,
  topicSlug,
}: {
  candidate: SpacedReviewCandidate;
  topicSlug: string;
}) {
  return (
    <Card className="flex items-start gap-3 bg-accent-soft">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
        <Sparkles className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <CardDescription className="text-accent">Szybka kontrola: {candidate.topicTitle}</CardDescription>
        <CardTitle>Sprawdź, czy ten opanowany dział jest wciąż pewny</CardTitle>
        <Link
          href={`/matma/nauka/${topicSlug}/cwiczenia?review=1`}
          className="mt-3 inline-flex h-9 items-center rounded-(--radius-control) bg-accent px-3.5 text-sm font-medium text-accent-foreground hover:opacity-90 active:opacity-80"
        >
          Zrób szybkie sprawdzenie
        </Link>
      </div>
    </Card>
  );
}
