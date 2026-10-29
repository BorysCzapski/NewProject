// ============================================================================
// lib/biznes/flashcards.ts
// Term -> definition flashcards: every entry of the maturabiz.pl glossary.
// ============================================================================
import { GLOSSARY } from "./glossary";
import type { Flashcard, LessonId } from "./types";

export const FLASHCARDS: Flashcard[] = GLOSSARY.map((g) => ({
  id: g.id.replace(/-(\d+)$/, "-f$1"),
  lesson: g.lesson,
  term: g.term,
  definition: g.definition,
}));

export function getFlashcardsForLessons(lessons: LessonId[]): Flashcard[] {
  const set = new Set(lessons);
  return FLASHCARDS.filter((c) => set.has(c.lesson));
}
