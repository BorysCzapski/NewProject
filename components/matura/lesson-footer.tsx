"use client";

// ============================================================================
// components/matura/lesson-footer.tsx
// End-of-lesson controls: mark the lesson as worked through, then move on to
// the next one in the section.
//
// The completion mark is optimistic — it flips locally and fires the action
// without awaiting a refresh. Nothing downstream depends on it being exact
// (it drives a checkmark and a counter, not scoring), and making the student
// watch a spinner to tick a box would be worse than the rare lost tick.
// ============================================================================
import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { markLessonComplete } from "@/lib/matura/vocab-actions";

export function LessonFooter({
  lessonId,
  initialCompleted,
  nextHref,
  nextTitle,
}: {
  lessonId: string;
  initialCompleted: boolean;
  nextHref?: string;
  nextTitle?: string;
}) {
  const [completed, setCompleted] = useState(initialCompleted);

  return (
    <div className="mt-2 flex flex-col gap-2">
      {completed ? (
        <p className="flex items-center justify-center gap-1.5 rounded-(--radius-control) bg-accent-soft px-3 py-3 text-sm font-medium text-accent">
          <Check className="h-4 w-4 shrink-0" />
          Lekcja przerobiona
        </p>
      ) : (
        <Button
          size="lg"
          variant="outline"
          onClick={() => {
            setCompleted(true);
            void markLessonComplete(lessonId);
          }}
        >
          <Check className="h-4 w-4" />
          Oznacz jako przerobione
        </Button>
      )}

      {nextHref && (
        <Link href={nextHref}>
          <Button size="lg" className="w-full">
            <span className="truncate">{nextTitle ? `Dalej: ${nextTitle}` : "Następna lekcja"}</span>
            <ArrowRight className="h-4 w-4 shrink-0" />
          </Button>
        </Link>
      )}
    </div>
  );
}
