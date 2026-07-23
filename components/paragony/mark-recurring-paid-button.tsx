"use client";

// ============================================================================
// components/paragony/mark-recurring-paid-button.tsx
// Row-level action on the "Nadchodzące rachunki cykliczne" widget: records
// the current period's transaction and rolls next_due_date forward.
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { markRecurringPaid } from "@/lib/paragony/recurring-actions";

export function MarkRecurringPaidButton({ id }: { id: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await markRecurringPaid(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div>
      <Button variant="outline" size="sm" isLoading={isPending} onClick={handleClick}>
        Oznacz jako zapłacone
      </Button>
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  );
}
