"use client";

// ============================================================================
// components/algorytmy/lesson-done-button.tsx
// Marks a lesson as przerobiona. Optimistic: the label flips immediately and
// stays flipped, because markLessonDone is an idempotent upsert
// (lib/algorytmy/actions.ts) — the only way it fails is a dead connection, and
// then the error line says so.
// ============================================================================
import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { markLessonDone } from "@/lib/algorytmy/actions";
import { Button } from "@/components/ui/button";

export function LessonDoneButton({
  lessonId,
  topicSlug,
  lessonSlug,
  initiallyDone,
}: {
  lessonId: string;
  topicSlug: string;
  lessonSlug: string;
  initiallyDone: boolean;
}) {
  const [done, setDone] = useState(initiallyDone);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (done) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-(--radius-control) bg-accent-soft px-4 py-3 text-sm font-medium text-accent">
        <Check className="h-4 w-4" />
        Lekcja przerobiona
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Button
        className="w-full"
        isLoading={pending}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const result = await markLessonDone({ lessonId, topicSlug, lessonSlug });
            if (result.ok) setDone(true);
            else setError(result.error);
          })
        }
      >
        <Check className="h-4 w-4" />
        Oznacz jako przerobioną
      </Button>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
