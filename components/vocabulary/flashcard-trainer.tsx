"use client";

// ============================================================================
// components/vocabulary/flashcard-trainer.tsx
// Client-driven flashcard session: one 3D-flip card at a time, a local
// requeue for missed words ("Nie umiem" resurfaces the word ~3 cards later),
// and a summary screen once 10 cards have been processed.
// ============================================================================
import { useRef, useState } from "react";
import { RotateCcw, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { VocabularyWord } from "@/lib/types/database";
import { recordVocabularyAnswer, finishFlashcardSession } from "@/lib/vocabulary/actions";

interface QueueItem {
  uid: string;
  word: VocabularyWord;
}

const SESSION_TARGET = 10;

export function FlashcardTrainer({ words }: { words: VocabularyWord[] }) {
  const [queue, setQueue] = useState<QueueItem[]>(() =>
    words.map((word, i) => ({ uid: `${word.id}-${i}`, word }))
  );
  const [flipped, setFlipped] = useState(false);
  const [processed, setProcessed] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const finishedRef = useRef(false);
  const uidCounter = useRef(words.length);

  const target = Math.min(SESSION_TARGET, words.length);
  const current = queue[0];

  async function handleAnswer(wasCorrect: boolean) {
    if (!current) return;
    setFlipped(false);

    void recordVocabularyAnswer(current.word.id, wasCorrect);

    const newProcessed = processed + 1;
    let newQueue = queue.slice(1);
    if (!wasCorrect) {
      const insertAt = Math.min(3, newQueue.length);
      const uid = `${current.word.id}-${uidCounter.current++}`;
      newQueue = [
        ...newQueue.slice(0, insertAt),
        { uid, word: current.word },
        ...newQueue.slice(insertAt),
      ];
    } else {
      setCorrect((c) => c + 1);
    }

    setQueue(newQueue);
    setProcessed(newProcessed);

    if (newProcessed >= SESSION_TARGET || newQueue.length === 0) {
      setDone(true);
      if (!finishedRef.current) {
        finishedRef.current = true;
        await finishFlashcardSession();
      }
    }
  }

  if (done || !current) {
    return (
      <Card className="flex flex-col items-center gap-4 py-10 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent">
          <Check className="h-8 w-8" />
        </span>
        <div>
          <h2 className="text-lg font-bold text-foreground">Sesja ukończona!</h2>
          <p className="mt-1 text-sm text-foreground-muted">
            Powtórzono {processed} {processed === 1 ? "słówko" : "słówek"}, w tym {correct} poprawnie
            za pierwszym razem.
          </p>
        </div>
        <Button size="lg" onClick={() => window.location.reload()} className="w-full">
          <RotateCcw className="h-5 w-5" />
          Nowa sesja
        </Button>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between text-sm font-medium text-foreground-muted">
        <span>Postęp</span>
        <span>
          {Math.min(processed, target)}/{target}
        </span>
      </div>

      <div className="flip-card-scene h-72 w-full" onClick={() => setFlipped((f) => !f)}>
        <div className={cn("flip-card relative h-full w-full cursor-pointer", flipped && "is-flipped")}>
          <Card className="flip-card-face absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
            <Badge>{current.word.category}</Badge>
            <p className="text-3xl font-bold text-foreground">{current.word.word_en}</p>
            <p className="text-xs text-foreground-muted">Dotknij, żeby zobaczyć tłumaczenie</p>
          </Card>
          <Card className="flip-card-face flip-card-face-back absolute inset-0 flex flex-col items-center justify-center gap-3 bg-primary-soft p-6 text-center">
            <p className="text-2xl font-bold text-foreground">{current.word.translation_pl}</p>
            {current.word.example_sentence && (
              <p className="text-sm italic text-foreground-muted">{current.word.example_sentence}</p>
            )}
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button
          size="lg"
          variant="danger"
          onClick={() => handleAnswer(false)}
        >
          <X className="h-5 w-5" />
          Nie umiem
        </Button>
        <Button
          size="lg"
          variant="primary"
          onClick={() => handleAnswer(true)}
        >
          <Check className="h-5 w-5" />
          Umiem
        </Button>
      </div>
    </div>
  );
}
