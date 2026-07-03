"use client";

// ============================================================================
// app/error.tsx
// Global error boundary (Next.js file convention — must be a Client
// Component). Catches render/data errors anywhere in the app that a more
// specific error.tsx doesn't already handle.
// ============================================================================
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-soft text-danger">
        <AlertTriangle className="h-8 w-8" />
      </span>
      <h1 className="text-2xl font-bold text-foreground">Coś poszło nie tak</h1>
      <p className="max-w-xs text-foreground-muted">
        Wystąpił nieoczekiwany błąd. Spróbuj ponownie — jeśli problem się powtarza, wróć na
        stronę główną.
      </p>
      <Button size="lg" onClick={reset}>
        Spróbuj ponownie
      </Button>
    </div>
  );
}
