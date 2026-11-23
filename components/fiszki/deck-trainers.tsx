"use client";

// ============================================================================
// components/fiszki/deck-trainers.tsx
// Cienkie opakowania starszych trenerów (karty, quiz znaczeń) dla talii
// leksykonu. Strona serwerowa nie może przekazać komponentowi klienckiemu funkcji,
// a tryby swobodne nie zapisują postępu (nie ruszają harmonogramu powtórek) —
// stąd pusty `onAnswer` po stronie klienta.
// ============================================================================
import { FlashcardTrainer } from "@/components/vocabulary/flashcard-trainer";
import { MeaningTrainer } from "@/components/vocabulary/meaning-trainer";
import type { VocabularyWord } from "@/lib/types/database";

const noProgress = () => {};

export function DeckFlashcards({ words, backHref }: { words: VocabularyWord[]; backHref: string }) {
  return <FlashcardTrainer words={words} backHref={backHref} onAnswer={noProgress} />;
}

export function DeckMeaning({
  batch,
  pool,
  backHref,
}: {
  batch: VocabularyWord[];
  pool: VocabularyWord[];
  backHref: string;
}) {
  return <MeaningTrainer batch={batch} pool={pool} backHref={backHref} language="en" onAnswer={noProgress} />;
}
