"use client";

// ============================================================================
// components/maturalnik/problem-checkbox.tsx
// "Zrobione" toggle for one problem row — optimistic update, same
// useTransition pattern as components/textbook/delete-textbook-button.tsx.
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleProblemDone } from "@/lib/maturalnik/actions";

export function ProblemCheckbox({ problemId, initialDone }: { problemId: string; initialDone: boolean }) {
  const router = useRouter();
  const [done, setDone] = useState(initialDone);
  const [pending, startTransition] = useTransition();

  function handleToggle() {
    const next = !done;
    setDone(next); // optimistic
    startTransition(async () => {
      const result = await toggleProblemDone(problemId, next);
      if (!result.ok) {
        setDone(!next); // revert on failure
        return;
      }
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={pending}
      aria-label={done ? "Oznacz jako niezrobione" : "Oznacz jako zrobione"}
      aria-pressed={done}
      className={cn(
        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-colors disabled:opacity-60",
        done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-surface text-transparent"
      )}
    >
      <Check className="h-4 w-4" strokeWidth={3} />
    </button>
  );
}
