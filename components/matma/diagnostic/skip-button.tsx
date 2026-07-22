"use client";

// ============================================================================
// components/matma/diagnostic/skip-button.tsx
// Prominent "skip the whole diagnostic" escape hatch on the diagnoza hub —
// stamps every topic as status "new" (skipDiagnostic()'s safe default) and
// sends the student straight into the dashboard.
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { skipDiagnostic } from "@/lib/matma/actions";

export function SkipDiagnosticButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSkip() {
    setError(null);
    startTransition(async () => {
      const result = await skipDiagnostic();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/matma");
    });
  }

  return (
    <div>
      <Button variant="outline" size="lg" className="w-full" isLoading={isPending} onClick={handleSkip}>
        Pomiń, zacznę od podstaw
      </Button>
      {error && <p className="mt-1.5 text-sm text-danger">{error}</p>}
    </div>
  );
}
