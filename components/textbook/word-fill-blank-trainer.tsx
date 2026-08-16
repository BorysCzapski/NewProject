"use client";

// ============================================================================
// components/textbook/word-fill-blank-trainer.tsx
// Steps through a unit's words one at a time, blanking out the word inside
// its AI-generated example sentence and grading the typed answer with the
// same lenient isCloseMatch used by grammar's gap_fill exercises. Words
// without a usable example sentence (missing, or the AI's sentence didn't
// literally contain the word) are skipped rather than crashing.
// ============================================================================
import { useMemo, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, isCloseMatch } from "@/lib/utils";
import { recordTextbookWordAnswer, finishTextbookWordExerciseSession } from "@/lib/textbook/actions";
import type { VocabularyWord } from "@/lib/types/database";

function wordBoundaryRegex(word: string): RegExp {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i");
}

function containsWord(sentence: string, word: string): boolean {
  return wordBoundaryRegex(word).test(sentence);
}

function blankOutWord(sentence: string, word: string): string {
  return sentence.replace(wordBoundaryRegex(word), "____");
}

interface ExerciseResult {
  isCorrect: boolean;
}

export function WordFillBlankTrainer({ words, backHref }: { words: VocabularyWord[]; backHref?: string }) {
  const usable = useMemo(
    () => words.filter((word) => word.example_sentence && containsWord(word.example_sentence, word.word_en)),
    [words]
  );

  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [result, setResult] = useState<ExerciseResult | null>(null);
  const [correct, setCorrect] = useState(0);
  const [pending, setPending] = useState(false);
  const [finished, setFinished] = useState(false);

  if (usable.length === 0) {
    return (
      <Card>
        <CardDescription>
          To ćwiczenie wymaga słówek z przykładowym zdaniem — żadne słówko z tego działu go nie ma.
        </CardDescription>
      </Card>
    );
  }

  const current = usable[index];

  async function submit() {
    if (!value.trim() || pending || result) return;
    setPending(true);
    const isCorrect = isCloseMatch(value, current.word_en);
    setResult({ isCorrect });
    if (isCorrect) setCorrect((c) => c + 1);
    await recordTextbookWordAnswer(current.id, isCorrect);
    setPending(false);
  }

  async function next() {
    setValue("");
    setResult(null);
    if (index + 1 >= usable.length) {
      setFinished(true);
      await finishTextbookWordExerciseSession();
    } else {
      setIndex((i) => i + 1);
    }
  }

  if (finished) {
    return (
      <Card className="flex flex-col items-center gap-4 py-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-foreground">Ćwiczenie ukończone!</h2>
          <p className="mt-1 text-sm text-foreground-muted">
            Poprawnych odpowiedzi: {correct}/{usable.length}
          </p>
        </div>
        {backHref && (
          <Link href={backHref} className="w-full">
            <Button size="lg" variant="outline" className="w-full">
              <ArrowLeft className="h-5 w-5" />
              Wróć do działu
            </Button>
          </Link>
        )}
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm font-medium text-foreground-muted">
        Zdanie {index + 1} z {usable.length}
      </p>
      <Card>
        <CardTitle>Uzupełnij zdanie</CardTitle>
        <p className="mt-2 text-base leading-relaxed text-foreground">
          {blankOutWord(current.example_sentence!, current.word_en)}
        </p>
        <p className="mt-1 text-xs text-foreground-muted">{current.translation_pl}</p>
        <Label className="mt-4" htmlFor="fill-blank-input">
          Brakujące słowo
        </Label>
        <Input
          id="fill-blank-input"
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
        {result && (
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
              {result.isCorrect ? "Poprawnie!" : `Niepoprawnie. Poprawna odpowiedź: "${current.word_en}"`}
            </span>
          </div>
        )}
      </Card>
      {result && (
        <Button size="lg" onClick={next}>
          {index + 1 >= usable.length ? "Zakończ" : "Dalej"}
        </Button>
      )}
    </div>
  );
}
