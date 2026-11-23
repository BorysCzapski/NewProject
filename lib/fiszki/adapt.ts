// ============================================================================
// lib/fiszki/adapt.ts
// Przejściówka: hasło leksykonu -> VocabularyWord. Trzy starsze trenery (karty,
// quiz znaczeń, łączenie) pracują na słowach w kształcie VocabularyWord; dzięki
// przejściówce działają też na taliach leksykonu bez przepisywania ich UI.
// Czysta logika, bez I/O.
// ============================================================================
import type { LexiconEntry, UserLevel, VocabularyWord } from "@/lib/types/database";

type EntryLike = Pick<LexiconEntry, "id" | "term" | "translation_pl" | "example">;

/** Hasło ma gotowe tłumaczenie — tylko takie da się ćwiczyć bez AI. */
export function isPracticeReady(entry: Pick<LexiconEntry, "translation_pl">): boolean {
  return entry.translation_pl.trim().length > 0;
}

export function entryToWord(entry: EntryLike, deckTitle: string, level: UserLevel): VocabularyWord {
  return {
    id: entry.id,
    language: "en",
    level,
    // Kategoria służy quizowi do dobierania podobnych rozpraszaczy: w obrębie
    // talii to wystarczy, a łączenie zapisuje ją jako nazwę rundy.
    category: deckTitle,
    word_en: entry.term,
    translation_pl: entry.translation_pl.trim(),
    example_sentence: entry.example.trim() || null,
    // Hasło leksykonu nie niesie daty, a trenery jej nie czytają.
    created_at: "",
  };
}
