"use client";

// ============================================================================
// components/matma/plan/recompute-button.tsx
// Manually triggers the adaptive study-plan recompute (lib/matma/actions.ts
// recomputeStudyPlan): closes out past weeks based on actual mastery and
// regenerates every future week from the student's current pace.
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { recomputeStudyPlan } from "@/lib/matma/actions";

export function RecomputeButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function recompute() {
    if (pending) return;
    setError(null);
    startTransition(async () => {
      const result = await recomputeStudyPlan();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div>
      <Button variant="outline" size="sm" isLoading={pending} onClick={recompute}>
        <TrendingUp className="h-4 w-4" />
        Przelicz plan
      </Button>
      <p className="mt-1.5 text-xs text-foreground-muted">
        Plan jest adaptacyjny — dostosuje się, jeśli jesteś do przodu lub do tyłu względem zakładanego tempa.
      </p>
      {error && <p className="mt-1.5 text-xs text-danger">{error}</p>}
    </div>
  );
}
