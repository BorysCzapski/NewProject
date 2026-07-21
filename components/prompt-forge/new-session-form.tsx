"use client";

// ============================================================================
// components/prompt-forge/new-session-form.tsx
// Starts a new Kuźnia session: one short goal, then createPromptSession
// redirects into the workspace where the actual builder chat happens.
// ============================================================================
import { useState, useTransition } from "react";
import { unstable_rethrow } from "next/navigation";
import { Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createPromptSession } from "@/lib/prompt-forge/actions";

export function NewSessionForm() {
  const [goal, setGoal] = useState("");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit() {
    if (!goal.trim() || pending) return;
    setError(null);
    startTransition(async () => {
      try {
        // On success the action redirects; on failure it RETURNS the error
        // (thrown Server Action errors are redacted in production).
        const result = await createPromptSession(goal);
        if (!result.ok) setError(result.error);
      } catch (err) {
        unstable_rethrow(err);
        setError("Nie udało się utworzyć sesji. Spróbuj ponownie.");
      }
    });
  }

  return (
    <Card>
      <CardTitle>Nowy prompt</CardTitle>
      <CardDescription className="mt-1">
        Opisz jednym zdaniem, jaką aplikację chcesz zbudować — resztę dopracujecie razem w czacie.
      </CardDescription>
      <textarea
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        disabled={pending}
        rows={3}
        placeholder="Np. aplikacja do śledzenia wspólnych wydatków ze współlokatorami…"
        className={cn(
          "mt-3 w-full rounded-(--radius-control) border border-border bg-surface px-4 py-3 text-base text-foreground",
          "placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary",
          "disabled:opacity-70"
        )}
      />
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      <Button
        size="lg"
        className="mt-4 w-full"
        onClick={handleSubmit}
        disabled={!goal.trim()}
        isLoading={pending}
      >
        <Wand2 className="h-5 w-5" />
        {pending ? "Tworzę sesję…" : "Rozpocznij"}
      </Button>
    </Card>
  );
}
