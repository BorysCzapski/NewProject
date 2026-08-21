"use client";

// ============================================================================
// components/modlitwa/breviary-fallback-notice.tsx
// Komunikat pokazywany, gdy nie mamy pełnych tekstów z ILG (dzień poza
// udostępnianym okresem albo błąd sieci) — wraz z przyciskiem ponowienia.
//
// Uczciwość wobec użytkownika jest tu ważniejsza niż estetyka: pod spodem i
// tak wyświetlamy przewodnik po strukturze godziny, ale musi być jasne, że to
// NIE są pełne teksty brewiarza na dziś.
// ============================================================================
import { useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { refreshBreviaryAction } from "@/lib/modlitwa/breviary-actions";
import { Button } from "@/components/ui/button";

export function BreviaryFallbackNotice({
  message,
  dateKey,
  hourId,
  variant,
}: {
  message: string;
  dateKey: string;
  hourId: string;
  variant?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleRetry() {
    setError(null);
    startTransition(async () => {
      const result = await refreshBreviaryAction(dateKey, hourId, variant);
      if (!result.ok) setError(result.error);
    });
  }

  return (
    <div className="flex flex-col gap-2 rounded-(--radius-card) border border-warning/40 bg-warning-soft p-4">
      <p className="text-sm text-foreground">{message}</p>
      <Button variant="outline" size="sm" onClick={handleRetry} isLoading={isPending} className="self-start">
        <RefreshCw className="h-4 w-4" />
        Pobierz ponownie
      </Button>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
