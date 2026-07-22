"use client";

// ============================================================================
// components/matma/dashboard/dismiss-practice-button.tsx
// Small "Odłóż" control for one math_assigned_practice row — calls
// dismissAssignedPractice then refreshes the dashboard so the item drops out
// of the (already dismissed_at-is-null-filtered) list rendered by the page.
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { dismissAssignedPractice } from "@/lib/matma/actions";

export function DismissPracticeButton({ id }: { id: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDismiss() {
    setError(null);
    startTransition(async () => {
      const result = await dismissAssignedPractice(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end">
      <Button variant="ghost" size="sm" isLoading={isPending} onClick={handleDismiss}>
        Odłóż
      </Button>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
