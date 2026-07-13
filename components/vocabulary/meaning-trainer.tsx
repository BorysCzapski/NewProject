"use client";

// ============================================================================
// components/vocabulary/meaning-trainer.tsx
// Client-driven meaning-trainer session: pick direction (EN<->PL) and mode
// (4-choice quiz or typed translation), then answer 10 questions in a row.
// ============================================================================
import { useMemo, useState } from "react";
import Link from "next/link";
import { RotateCcw, ArrowRight, ArrowLeft, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CyrillicKeyboard } from "@/components/ui/cyrillic-keyboard";
import { cn, isCloseMatch } from "@/lib/utils";
import type { TargetLanguage, VocabularyWord } from "@/lib/types/database";
import { pickDistractors, shuffle } from "@/lib/vocabulary/word-utils";
import { recordVocabularyAnswer, finishMeaningSession } from "@/lib/vocabulary/actions";

type Direction = "en-pl" | "pl-en";
type Mode = "quiz" | "typing";
type Phase = "setup" | "playing" | "summary";

function promptFor(word: VocabularyWord, direction: Direction): string {
  return direction === "en-pl" ? word.word_en : word.translation_pl;
}

function answerFor(word: VocabularyWord, direction: Direction): string {
  return direction === "en-pl" ? word.translation_pl : word.word_en;
}

const TYPING_PLACEHOLDER: Record<TargetLanguage, string> = {
  en: "Wpisz tłumaczenie po angielsku",
  es: "Wpisz tłumaczenie po hiszpańsku",
  ru: "Wpisz tłumaczenie po rosyjsku",
};

export function MeaningTrainer({
  batch,
  pool,
  backHref,
  language = "en",
}: {
  batch: VocabularyWord[];
  pool: VocabularyWord[];
  /** When the session was started from a learning-path stage, links back to it. */
  backHref?: string;
  /** Language the words belong to — drives placeholders and the Cyrillic keyboard. */
  language?: TargetLanguage;
}) {
  const [phase, setPhase] = useState<Phase>("setup");
  const [direction, setDirection] = useState<Direction>("en-pl");
  const [mode, setMode] = useState<Mode>("quiz");
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [typedValue, setTypedValue] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  const word = batch[index];

  const options = useMemo(() => {
    if (!word || mode !== "quiz") return [];
    const distractors = pickDistractors(word, pool, 3).map((w) => answerFor(w, direction));
    return shuffle([answerFor(word, direction), ...distractors]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word?.id, mode, direction]);

  async function submitAnswer(userAnswer: string) {
    if (!word || feedback) return;
    const correctAnswer = answerFor(word, direction);
    const wasCorrect = isCloseMatch(userAnswer, correctAnswer);

    setSelected(userAnswer);
    setFeedback(wasCorrect ? "correct" : "incorrect");
    if (wasCorrect) setScore((s) => s + 1);

    void recordVocabularyAnswer(word.id, wasCorrect);
  }

  async function nextQuestion() {
    const isLast = index + 1 >= batch.length;
    setSelected(null);
    setFeedback(null);
    setTypedValue("");

    if (isLast) {
      setPhase("summary");
      await finishMeaningSession();
    } else {
      setIndex((i) => i + 1);
    }
  }

  function restart() {
    window.location.reload();
  }

  if (phase === "setup") {
    return (
      <Card className="flex flex-col gap-6">
        <div>
          <CardTitle>Kierunek tłumaczenia</CardTitle>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Button
              variant={direction === "en-pl" ? "primary" : "outline"}
              onClick={() => setDirection("en-pl")}
            >
              EN → PL
            </Button>
            <Button
              variant={direction === "pl-en" ? "primary" : "outline"}
              onClick={() => setDirection("pl-en")}
            >
              PL → EN
            </Button>
          </div>
        </div>
        <div>
          <CardTitle>Tryb ćwiczenia</CardTitle>
          <div className="mt-2 grid grid-cols-1 gap-2">
            <Button variant={mode === "quiz" ? "primary" : "outline"} onClick={() => setMode("quiz")}>
              Quiz z 4 odpowiedziami
            </Button>
            <Button
              variant={mode === "typing" ? "primary" : "outline"}
              onClick={() => setMode("typing")}
            >
              Wpisywanie tłumaczenia
            </Button>
          </div>
        </div>
        <Button size="lg" onClick={() => setPhase("playing")}>
          Rozpocznij
        </Button>
      </Card>
    );
  }

  if (phase === "summary") {
    return (
      <Card className="flex flex-col items-center gap-4 py-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Check className="h-8 w-8" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-foreground">Sesja ukończona!</h2>
          <p className="mt-1 text-sm text-foreground-muted">
            Wynik: {score}/{batch.length} poprawnych odpowiedzi
          </p>
        </div>
        <Button size="lg" onClick={restart} className="w-full">
          <RotateCcw className="h-5 w-5" />
          Zagraj ponownie
        </Button>
        {backHref && (
          <Link href={backHref} className="w-full">
            <Button size="lg" variant="outline" className="w-full">
              <ArrowLeft className="h-5 w-5" />
              Wróć do ścieżki nauki
            </Button>
          </Link>
        )}
      </Card>
    );
  }

  if (!word) return null;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between text-sm font-medium text-foreground-muted">
        <span>Pytanie</span>
        <span>
          {index + 1}/{batch.length}
        </span>
      </div>

      <Card className="flex flex-col items-center gap-2 py-8 text-center">
        <CardDescription>{direction === "en-pl" ? "Jak to jest po polsku?" : "Jak to jest po angielsku?"}</CardDescription>
        <p className="text-3xl font-bold text-foreground">{promptFor(word, direction)}</p>
      </Card>

      {mode === "quiz" ? (
        <div className="grid grid-cols-1 gap-3">
          {options.map((option) => {
            const isSelected = selected === option;
            const isCorrectOption = feedback && option === answerFor(word, direction);
            return (
              <Button
                key={option}
                size="lg"
                variant="outline"
                disabled={!!feedback}
                onClick={() => submitAnswer(option)}
                className={cn(
                  "justify-start",
                  isCorrectOption && "border-accent bg-accent-soft text-accent",
                  isSelected && feedback === "incorrect" && "border-danger bg-danger-soft text-danger"
                )}
              >
                {option}
              </Button>
            );
          })}
        </div>
      ) : (
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!feedback) submitAnswer(typedValue);
          }}
        >
          <Input
            value={typedValue}
            onChange={(e) => setTypedValue(e.target.value)}
            placeholder={direction === "en-pl" ? "Wpisz tłumaczenie po polsku" : TYPING_PLACEHOLDER[language]}
            disabled={!!feedback}
            autoFocus
          />
          {/* Typing INTO Russian without a Cyrillic layout — on-screen keys. */}
          {language === "ru" && direction === "pl-en" && !feedback && <CyrillicKeyboard />}
          {!feedback && (
            <Button size="lg" type="submit">
              Sprawdź
            </Button>
          )}
          {feedback && (
            <p
              className={cn(
                "text-sm font-medium",
                feedback === "correct" ? "text-accent" : "text-danger"
              )}
            >
              {feedback === "correct"
                ? "Dobrze!"
                : `Poprawna odpowiedź: ${answerFor(word, direction)}`}
            </p>
          )}
        </form>
      )}

      {feedback && (
        <Button size="lg" onClick={nextQuestion}>
          {feedback === "correct" ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
          Dalej
          <ArrowRight className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
