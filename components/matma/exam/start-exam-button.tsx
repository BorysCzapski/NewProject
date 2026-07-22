"use client";

// ============================================================================
// components/matma/exam/start-exam-button.tsx
// Starts a brand-new mock exam. startMockExam() redirects on success (which
// throws internally) and only RETURNS on failure — same unstable_rethrow
// pattern as components/writing/new-task-form.tsx.
// ============================================================================
import { useState, useTransition } from "react";
import { unstable_rethrow } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { startMockExam } from "@/lib/matma/actions";

export function StartExamButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleStart() {
    setError(null);
    startTransition(async () => {
      try {
        // On success this redirects; on failure it RETURNS the error (thrown
        // Server Action errors are redacted in production).
        const result = await startMockExam();
        if (result && !result.ok) {
          setError(result.error);
        }
      } catch (err) {
        // On success the action redirects, which throws a special Next.js
        // navigation error that must propagate, not be swallowed here.
        unstable_rethrow(err);
        setError("Nie udało się przygotować egzaminu. Spróbuj ponownie.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Button size="lg" className="w-full" isLoading={isPending} onClick={handleStart}>
        <Sparkles className="h-4 w-4" /> Rozpocznij nowy egzamin
      </Button>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
