"use client";

// ============================================================================
// components/grammar/grammar-exercise-stepper.tsx
// Client-side stepper for a grammar topic's exercises: renders one exercise
// at a time (gap_fill / multiple_choice / transformation), grades it,
// persists a grammar_progress row via a Server Action, and once every
// exercise has been answered at least once in this sitting, records the
// "grammar" activity and shows a completion summary.
// ============================================================================
import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, isCloseMatch } from "@/lib/utils";
import { recordGrammarAttempt, gradeTransformation, completeGrammarTopic } from "@/lib/grammar/actions";
import type { GrammarExercise } from "@/lib/types/database";

interface ExerciseResult {
  isCorrect: boolean;
  feedback?: string;
}

export function GrammarExerciseStepper({
  topicId,
  exercises,
}: {
  topicId: string;
  exercises: GrammarExercise[];
}) {
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<Record<string, ExerciseResult>>({});
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completeError, setCompleteError] = useState<string | null>(null);

  if (exercises.length === 0) {
    return (
      <Card>
        <CardDescription>Ten temat nie ma jeszcze żadnych ćwiczeń.</CardDescription>
      </Card>
    );
  }

  const current = exercises[index];
  const currentResult = results[current.id];
  const correctCount = Object.values(results).filter((r) => r.isCorrect).length;

  async function handleAnswered(exerciseId: string, result: ExerciseResult) {
    setResults((prev) => ({ ...prev, [exerciseId]: result }));
    await recordGrammarAttempt({ topicId, exerciseId, isCorrect: result.isCorrect });

    const nextAnswered = new Set(answeredIds);
    nextAnswered.add(exerciseId);
    setAnsweredIds(nextAnswered);
  }

  // Completing the topic is an EXPLICIT button press after the last answer —
  // switching to the summary automatically would hide the last exercise's
  // feedback before the user had a chance to read it.
  async function finishTopic() {
    setCompleting(true);
    setCompleteError(null);
    try {
      await completeGrammarTopic();
      setCompleted(true);
    } catch {
      setCompleteError("Nie udało się zapisać ukończenia tematu. Twoje odpowiedzi zostały zapisane.");
    } finally {
      setCompleting(false);
    }
  }

  if (completed) {
    return (
      <Card className="text-center">
        <CheckCircle2 className="mx-auto h-10 w-10 text-primary" />
        <CardTitle className="mt-3">Temat ukończony!</CardTitle>
        <CardDescription className="mt-1">
          Poprawnych odpowiedzi: {correctCount}/{exercises.length}
        </CardDescription>
        <Link href="/nauka/gramatyka">
          <Button className="mt-4 w-full" size="lg">
            Wróć do listy tematów
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm font-medium text-foreground-muted">
        Ćwiczenie {index + 1} z {exercises.length}
      </p>
      <Card>
        <ExerciseBody
          key={current.id}
          exercise={current}
          result={currentResult}
          onAnswered={(result) => handleAnswered(current.id, result)}
        />
      </Card>

      {completeError && (
        <div className="mt-3">
          <p className="text-sm text-danger">{completeError}</p>
          <Link href="/nauka/gramatyka">
            <Button variant="outline" className="mt-3 w-full">
              Wróć do listy tematów
            </Button>
          </Link>
        </div>
      )}

      {currentResult && index < exercises.length - 1 && (
        <Button size="lg" className="mt-4 w-full" onClick={() => setIndex((i) => i + 1)}>
          Dalej
        </Button>
      )}

      {currentResult && index === exercises.length - 1 && !completeError && (
        <Button
          size="lg"
          className="mt-4 w-full"
          onClick={finishTopic}
          isLoading={completing}
          disabled={answeredIds.size < exercises.length}
        >
          {completing ? "Zapisywanie…" : "Zakończ temat"}
        </Button>
      )}
    </div>
  );
}

function ExerciseBody({
  exercise,
  result,
  onAnswered,
}: {
  exercise: GrammarExercise;
  result?: ExerciseResult;
  onAnswered: (result: ExerciseResult) => Promise<void>;
}) {
  if (exercise.type === "gap_fill") {
    return <GapFillExercise exercise={exercise} result={result} onAnswered={onAnswered} />;
  }
  if (exercise.type === "multiple_choice") {
    return <MultipleChoiceExercise exercise={exercise} result={result} onAnswered={onAnswered} />;
  }
  return <TransformationExercise exercise={exercise} result={result} onAnswered={onAnswered} />;
}

function FeedbackNote({ result, correctAnswer }: { result: ExerciseResult; correctAnswer: string }) {
  return (
    <div
      className={cn(
        "mt-3 flex items-start gap-2 rounded-(--radius-control) p-3 text-sm",
        result.isCorrect ? "bg-primary-soft text-primary" : "bg-danger-soft text-danger"
      )}
    >
      {result.isCorrect ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
      ) : (
        <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
      )}
      <span>
        {result.isCorrect ? "Poprawnie!" : `Niepoprawnie. Poprawna odpowiedź: "${correctAnswer}"`}
        {result.feedback && <span className="mt-1 block text-foreground-muted">{result.feedback}</span>}
      </span>
    </div>
  );
}

function GapFillExercise({
  exercise,
  result,
  onAnswered,
}: {
  exercise: GrammarExercise;
  result?: ExerciseResult;
  onAnswered: (result: ExerciseResult) => Promise<void>;
}) {
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);

  async function submit() {
    if (!value.trim() || pending) return;
    setPending(true);
    const isCorrect = isCloseMatch(value, exercise.correct_answer);
    await onAnswered({ isCorrect });
    setPending(false);
  }

  return (
    <div>
      <CardTitle>Uzupełnij lukę</CardTitle>
      <p className="mt-2 text-base text-foreground">{exercise.prompt}</p>
      <Label className="mt-4" htmlFor={`gap-${exercise.id}`}>
        Twoja odpowiedź
      </Label>
      <Input
        id={`gap-${exercise.id}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!!result}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="wpisz słowo…"
      />
      {!result && (
        <Button className="mt-3 w-full" onClick={submit} disabled={!value.trim()} isLoading={pending}>
          Sprawdź
        </Button>
      )}
      {result && <FeedbackNote result={result} correctAnswer={exercise.correct_answer} />}
    </div>
  );
}

function MultipleChoiceExercise({
  exercise,
  result,
  onAnswered,
}: {
  exercise: GrammarExercise;
  result?: ExerciseResult;
  onAnswered: (result: ExerciseResult) => Promise<void>;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const options = (exercise.options as string[] | null) ?? [];

  async function submit(option: string) {
    if (result || pending) return;
    setSelected(option);
    setPending(true);
    const isCorrect = option === exercise.correct_answer;
    await onAnswered({ isCorrect });
    setPending(false);
  }

  return (
    <div>
      <CardTitle>Wybierz odpowiedź</CardTitle>
      <p className="mt-2 text-base text-foreground">{exercise.prompt}</p>
      <div className="mt-4 flex flex-col gap-2">
        {options.map((option) => {
          const isSelected = selected === option;
          const isRightAnswer = option === exercise.correct_answer;
          return (
            <button
              key={option}
              type="button"
              onClick={() => submit(option)}
              disabled={!!result}
              className={cn(
                "rounded-(--radius-control) border px-4 py-3 text-left text-base transition-colors",
                !result && "border-border bg-surface active:bg-surface-muted",
                result && isRightAnswer && "border-primary bg-primary-soft text-primary",
                result && isSelected && !isRightAnswer && "border-danger bg-danger-soft text-danger",
                result && !isSelected && !isRightAnswer && "border-border bg-surface opacity-60"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
      {result && <FeedbackNote result={result} correctAnswer={exercise.correct_answer} />}
    </div>
  );
}

function TransformationExercise({
  exercise,
  result,
  onAnswered,
}: {
  exercise: GrammarExercise;
  result?: ExerciseResult;
  onAnswered: (result: ExerciseResult) => Promise<void>;
}) {
  const [value, setValue] = useState("");
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!value.trim() || grading) return;
    setGrading(true);
    setError(null);
    try {
      const result = await gradeTransformation({
        prompt: exercise.prompt,
        referenceAnswer: exercise.correct_answer,
        studentAnswer: value,
      });
      if (result.ok) {
        await onAnswered({ isCorrect: result.data.isCorrect, feedback: result.data.feedback });
      } else {
        setError(result.error);
      }
    } catch {
      setError("Nie udało się ocenić odpowiedzi przez AI. Spróbuj ponownie.");
    } finally {
      setGrading(false);
    }
  }

  return (
    <div>
      <CardTitle>Przekształć zdanie</CardTitle>
      <p className="mt-2 text-base text-foreground">{exercise.prompt}</p>
      <Label className="mt-4" htmlFor={`transform-${exercise.id}`}>
        Twoja odpowiedź
      </Label>
      <textarea
        id={`transform-${exercise.id}`}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!!result}
        rows={3}
        placeholder="wpisz przekształcone zdanie…"
        className={cn(
          "w-full rounded-(--radius-control) border border-border bg-surface px-4 py-3 text-base text-foreground",
          "placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary",
          "disabled:opacity-70"
        )}
      />
      {!result && (
        <Button className="mt-3 w-full" onClick={submit} disabled={!value.trim()} isLoading={grading}>
          {grading ? "Ocenianie…" : "Sprawdź"}
        </Button>
      )}
      {grading && !result && (
        <p className="mt-2 flex items-center gap-1.5 text-sm text-foreground-muted">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          AI ocenia Twoją odpowiedź…
        </p>
      )}
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      {result && <FeedbackNote result={result} correctAnswer={exercise.correct_answer} />}
    </div>
  );
}
