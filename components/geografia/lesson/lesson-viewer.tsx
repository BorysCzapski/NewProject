"use client";

// ============================================================================
// components/geografia/lesson/lesson-viewer.tsx
// Renders a whole lesson: every GeoBlock through GeoBlockRenderer in order,
// threading `recapText` (the nearest preceding intro/definition text) into
// quiz blocks so a wrong answer can recap the relevant material inline —
// same approach as components/matma/lesson/lesson-viewer.tsx.
//
// Tracks in-lesson quiz results purely client-side to colour the footer
// ("2/3 poprawnych"); those answers are NOT graded server-side and never
// touch mastery — they're formative checks inside theory, distinct from the
// scored exercises in the exercise bank.
// ============================================================================
import { useState, type ReactNode } from "react";
import { BookOpenCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { GeoBlockRenderer } from "@/components/geografia/lesson/block-renderer";
import { markLessonComplete } from "@/lib/geografia/actions";
import type { GeoBlock } from "@/lib/geografia/lesson-blocks";

export function LessonViewer({
  blocks,
  lessonId,
  alreadyCompleted,
}: {
  blocks: GeoBlock[];
  lessonId: string;
  alreadyCompleted: boolean;
}) {
  const [completed, setCompleted] = useState(alreadyCompleted);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizResults, setQuizResults] = useState<boolean[]>([]);

  const rendered: ReactNode[] = [];
  let recapText: string | undefined;

  blocks.forEach((block, i) => {
    // Capture recap as it stood BEFORE this block, so a quiz never recaps itself.
    rendered.push(
      <GeoBlockRenderer
        key={i}
        block={block}
        recapText={recapText}
        onQuizResult={(correct) => setQuizResults((prev) => [...prev, correct])}
      />
    );
    if (block.type === "intro" || block.type === "definition") recapText = block.text;
  });

  const quizCount = blocks.filter((b) => b.type === "quiz").length;
  const correctCount = quizResults.filter(Boolean).length;

  async function complete() {
    setIsPending(true);
    setError(null);
    const result = await markLessonComplete(lessonId);
    setIsPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setCompleted(true);
  }

  return (
    <div className="flex flex-col gap-4">
      {rendered}

      <Card className="flex flex-col gap-2">
        {quizCount > 0 && quizResults.length > 0 && (
          <p className="text-sm text-foreground-muted">
            Pytania w lekcji: {correctCount} / {quizResults.length} poprawnych
          </p>
        )}

        {completed ? (
          <div className="flex items-center gap-2 text-accent">
            <Check className="h-5 w-5" />
            <CardTitle className="text-accent">Lekcja przerobiona</CardTitle>
          </div>
        ) : (
          <>
            <CardTitle>Masz to opanowane?</CardTitle>
            <p className="text-sm text-foreground-muted">
              Oznacz lekcję jako przerobioną, a potem sprawdź się na ćwiczeniach z tego działu — to one liczą się
              do Twojego poziomu opanowania materiału.
            </p>
            <Button className="self-start" isLoading={isPending} onClick={complete}>
              <BookOpenCheck className="h-4 w-4" />
              Oznacz jako przerobioną
            </Button>
          </>
        )}
        {error && <p className="text-sm text-danger">{error}</p>}
      </Card>
    </div>
  );
}
