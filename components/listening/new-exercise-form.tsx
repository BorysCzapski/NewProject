"use client";

// ============================================================================
// components/listening/new-exercise-form.tsx
// Form on the listening hub: paste a YouTube link, submit to create a new
// gap-fill exercise via the startListeningExercise Server Action, which
// redirects to the new exercise's detail page on success.
// ============================================================================
import { useState, useTransition } from "react";
import { unstable_rethrow } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { startListeningExercise } from "@/lib/listening/actions";

export function NewExerciseForm() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!youtubeUrl.trim() || pending) return;
    setError(null);
    startTransition(async () => {
      try {
        await startListeningExercise(youtubeUrl);
      } catch (err) {
        // A successful call redirects, which throws a special Next.js
        // navigation error that must propagate, not be swallowed here.
        unstable_rethrow(err);
        setError(err instanceof Error ? err.message : "Nie udało się utworzyć ćwiczenia.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <Input
        value={youtubeUrl}
        onChange={(e) => setYoutubeUrl(e.target.value)}
        placeholder="Wklej link do filmiku YouTube"
        disabled={pending}
        inputMode="url"
      />
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={!youtubeUrl.trim()} isLoading={pending}>
        {pending ? "Przygotowuję ćwiczenie…" : "Utwórz ćwiczenie"}
      </Button>
    </form>
  );
}
