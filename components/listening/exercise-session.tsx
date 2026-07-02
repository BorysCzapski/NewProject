"use client";

// ============================================================================
// components/listening/exercise-session.tsx
// Composes the YouTube player and the gap-fill transcript for one listening
// exercise, handles answer state, submits the attempt, and shows a graded
// result (green/red inputs + overall score) with a retry option.
// ============================================================================
import { useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { YoutubePlayer, type YoutubePlayerHandle } from "@/components/listening/youtube-player";
import { GapTranscript, gapId } from "@/components/listening/gap-transcript";
import { isCloseMatch } from "@/lib/utils";
import { submitListeningAttempt } from "@/lib/listening/actions";
import type { ListeningExercise } from "@/lib/types/database";

export function ExerciseSession({
  exercise,
  previousBestScore,
}: {
  exercise: ListeningExercise;
  previousBestScore: number | null;
}) {
  const playerRef = useRef<YoutubePlayerHandle>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Record<string, boolean> | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { gaps } = exercise;

  function handleAnswerChange(id: string, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  async function handleSubmit() {
    if (pending) return;
    setPending(true);
    setError(null);
    try {
      const attempt = await submitListeningAttempt(exercise.id, answers);
      const graded: Record<string, boolean> = {};
      for (const gap of gaps) {
        const id = gapId(gap);
        graded[id] = isCloseMatch(answers[id] ?? "", gap.answer);
      }
      setResults(graded);
      setScore(attempt.score);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się wysłać odpowiedzi. Spróbuj ponownie.");
    } finally {
      setPending(false);
    }
  }

  function handleRetry() {
    setAnswers({});
    setResults(null);
    setScore(null);
    setError(null);
  }

  if (gaps.length === 0) {
    return (
      <Card>
        <CardDescription>To ćwiczenie nie ma żadnych luk do uzupełnienia.</CardDescription>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <YoutubePlayer ref={playerRef} videoId={exercise.video_id} />

      {previousBestScore !== null && results === null && (
        <p className="text-sm text-foreground-muted">
          Twój najlepszy dotychczasowy wynik: <span className="font-semibold text-foreground">{Math.round(previousBestScore)}/100</span>
        </p>
      )}

      <Card>
        <CardTitle className="mb-3">Uzupełnij luki</CardTitle>
        <GapTranscript
          transcript={exercise.transcript}
          gaps={gaps}
          playerRef={playerRef}
          answers={answers}
          onAnswerChange={handleAnswerChange}
          results={results}
          disabled={results !== null}
        />
      </Card>

      {error && <p className="text-sm text-danger">{error}</p>}

      {results === null ? (
        <Button size="lg" className="w-full" onClick={handleSubmit} isLoading={pending}>
          {pending ? "Sprawdzam…" : "Sprawdź odpowiedzi"}
        </Button>
      ) : (
        <Card className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>Wynik: {Math.round(score ?? 0)}/100</CardTitle>
            <CardDescription className="mt-0.5">
              {Object.values(results).filter(Boolean).length} z {gaps.length} poprawnie
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRetry}>
            <RotateCcw className="h-4 w-4" />
            Spróbuj ponownie
          </Button>
        </Card>
      )}
    </div>
  );
}
