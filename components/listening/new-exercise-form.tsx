"use client";

// ============================================================================
// components/listening/new-exercise-form.tsx
// Form on the listening hub: paste a YouTube link, submit to create a new
// gap-fill exercise via the startListeningExercise Server Action, which
// redirects to the new exercise's detail page on success. When automatic
// transcript fetching fails (YouTube blocks server IPs), the form reveals a
// paste-the-transcript-yourself fallback that always works.
// ============================================================================
import { useState, useTransition } from "react";
import { unstable_rethrow } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { startListeningExercise } from "@/lib/listening/actions";

export function NewExerciseForm() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [manualTranscript, setManualTranscript] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!youtubeUrl.trim() || pending) return;
    if (showManual && !manualTranscript.trim()) {
      setError("Wklej transkrypcję filmiku poniżej.");
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        // On success the action redirects; on failure it RETURNS the error
        // (thrown Server Action errors are redacted in production).
        const result = await startListeningExercise(
          youtubeUrl,
          showManual ? manualTranscript : undefined
        );
        if (result && !result.ok) {
          setError(result.error);
          if (result.transcriptUnavailable) setShowManual(true);
        }
      } catch (err) {
        // A successful call redirects, which throws a special Next.js
        // navigation error that must propagate, not be swallowed here.
        unstable_rethrow(err);
        setError("Nie udało się utworzyć ćwiczenia. Spróbuj ponownie.");
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

      {showManual && (
        <div>
          <p className="mb-1.5 text-sm leading-relaxed text-foreground-muted">
            Wklej transkrypcję ręcznie: otwórz filmik na YouTube → opis filmu →{" "}
            <span className="font-semibold text-foreground">Pokaż transkrypcję</span> → zaznacz
            i skopiuj całość (z czasami lub bez).
          </p>
          <textarea
            value={manualTranscript}
            onChange={(e) => setManualTranscript(e.target.value)}
            disabled={pending}
            rows={7}
            placeholder={"0:00\nHello and welcome to...\n0:04\nToday we are going to..."}
            className={cn(
              "w-full rounded-(--radius-control) border border-border bg-surface px-4 py-3 text-sm text-foreground",
              "placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary",
              "disabled:opacity-70"
            )}
          />
        </div>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={!youtubeUrl.trim()} isLoading={pending}>
        {pending ? "Przygotowuję ćwiczenie…" : "Utwórz ćwiczenie"}
      </Button>

      {!showManual && (
        <button
          type="button"
          onClick={() => setShowManual(true)}
          className="text-center text-xs font-medium text-foreground-muted underline underline-offset-2"
        >
          Automatyczne pobieranie nie działa? Wklej transkrypcję ręcznie
        </button>
      )}
    </form>
  );
}
