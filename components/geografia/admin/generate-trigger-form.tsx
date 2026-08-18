"use client";

// ============================================================================
// components/geografia/admin/generate-trigger-form.tsx
// Admin control to grow one topic's exercise library via AI generation (see
// lib/geografia/generate.ts) — how the library reaches the product spec's
// 25-per-topic target beyond the small hand-checked seed set.
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateExercisesAction } from "@/lib/geografia/admin-actions";

export function GenerateTriggerForm({ topicId }: { topicId: string }) {
  const router = useRouter();
  const [count, setCount] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function submit() {
    setError(null);
    setSummary(null);
    startTransition(async () => {
      const result = await generateExercisesAction(topicId, count);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSummary(`Dodano ${result.data.inserted}, pominięto ${result.data.skipped} (duplikaty/błędy).`);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="number"
        min={1}
        max={15}
        value={count}
        onChange={(e) => setCount(Math.max(1, Math.min(15, Number(e.target.value) || 1)))}
        className="w-16 rounded-(--radius-control) border border-border bg-surface px-2 py-1.5 text-sm text-foreground"
      />
      <Button size="sm" variant="outline" isLoading={isPending} onClick={submit}>
        <Sparkles className="h-4 w-4" />
        Wygeneruj AI
      </Button>
      {error && <p className="text-xs text-danger">{error}</p>}
      {summary && <p className="text-xs text-accent">{summary}</p>}
    </div>
  );
}
