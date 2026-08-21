"use client";

// ============================================================================
// components/godziny/seed-topics-button.tsx
// „Użyj gotowej listy" — jednorazowe wstrzyknięcie zestawu startowego tematów.
//
// Lista domyślna powstaje na KLIKNIĘCIE, a nie sama przy pierwszym wejściu na
// ekran. Dwa powody: renderowanie strony nie powinno po cichu zapisywać do
// bazy, a użytkownik, który chce mieć trzy własne tematy zamiast trzynastu
// gotowych, nie musi najpierw sprzątać po aplikacji.
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { seedDefaultTopics } from "@/lib/godziny/topic-actions";
import { Button } from "@/components/ui/button";

export function SeedTopicsButton({ className }: { className?: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await seedDefaultTopics();
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setError(null);
      router.refresh();
    });
  }

  return (
    <div className={className}>
      <Button onClick={handleClick} isLoading={isPending} className="w-full">
        <Sparkles className="h-5 w-5" />
        Użyj gotowej listy tematów
      </Button>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </div>
  );
}
