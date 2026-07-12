"use client";

import { useState, useTransition } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { assignCatchUpHomework } from "@/lib/learning-path/actions";

export function AssignCatchupButton({ studentId, category }: { studentId: string; category: string }) {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (done) {
    return (
      <Button variant="outline" size="sm" disabled className="w-full">
        Praca domowa zadana ✓
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        isLoading={isPending}
        onClick={() =>
          startTransition(async () => {
            try {
              await assignCatchUpHomework(studentId, category);
              setDone(true);
            } catch {
              setError("Nie udało się zadać pracy domowej.");
            }
          })
        }
      >
        <Sparkles className="h-4 w-4" /> Zadaj temu uczniowi zadanie z tej kategorii
      </Button>
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </>
  );
}
