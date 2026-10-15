"use client";

// ============================================================================
// components/maturalnik/solution-panel.tsx
// "Pokaż rozwiązanie" — generates (once, server-cached) and displays the AI
// solution for a problem. The disclaimer is shown EVERY time the solution is
// visible, not just on first generation — see lib/maturalnik/solutions.ts for
// why: there is no official solution in the source material, this is always
// an AI guess.
// ============================================================================
import { useState, useTransition } from "react";
import { AlertTriangle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MathText } from "@/components/matma/math";
import { generateSolution } from "@/lib/maturalnik/actions";
import type { MaturalnikAiSolution } from "@/lib/types/database";

export function SolutionPanel({
  problemId,
  initialSolution,
}: {
  problemId: string;
  initialSolution: MaturalnikAiSolution | null;
}) {
  const [solution, setSolution] = useState(initialSolution);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleReveal() {
    setRevealed(true);
    if (solution) return;
    setError(null);
    startTransition(async () => {
      const result = await generateSolution(problemId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSolution(result.data);
    });
  }

  if (!revealed) {
    return (
      <Button variant="outline" className="w-full" onClick={handleReveal}>
        <Sparkles className="h-4 w-4" /> Pokaż rozwiązanie
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-3 rounded-(--radius-card) border border-border bg-surface p-4">
      <div className="flex items-start gap-2 rounded-(--radius-control) bg-warning-soft p-2.5 text-xs text-warning">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <p>Rozwiązanie wygenerowane przez AI — może zawierać błędy. To nie jest oficjalny materiał CKE.</p>
      </div>

      {pending && <p className="text-sm text-foreground-muted">Generuję rozwiązanie…</p>}
      {error && <p className="text-sm text-danger">{error}</p>}
      {solution && <MathText text={solution.solutionText} className="text-sm" />}
    </div>
  );
}
