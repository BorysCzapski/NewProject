"use client";

// ============================================================================
// components/textbook/delete-textbook-button.tsx
// Two-step delete (no native confirm() dialog anywhere else in this app) —
// tap once to reveal an inline "are you sure" row, tap again to actually
// delete. RLS + the cascade FKs on 0010_textbooks.sql do the rest.
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteTextbook } from "@/lib/textbook/actions";

export function DeleteTextbookButton({ textbookId }: { textbookId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteTextbook(textbookId);
      if (result?.ok === false) {
        setError(result.error);
        return;
      }
      router.push("/jezyki/nauka/podrecznik");
      router.refresh();
    });
  }

  if (!confirming) {
    return (
      <Button variant="ghost" size="sm" className="text-foreground-muted" onClick={() => setConfirming(true)}>
        <Trash2 className="h-3.5 w-3.5" />
        Usuń podręcznik
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-foreground-muted">
        Na pewno usunąć ten podręcznik? Tej operacji nie można cofnąć.
      </p>
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="flex gap-2">
        <Button variant="danger" size="sm" onClick={handleDelete} isLoading={pending}>
          Usuń
        </Button>
        <Button variant="outline" size="sm" onClick={() => setConfirming(false)} disabled={pending}>
          Anuluj
        </Button>
      </div>
    </div>
  );
}
