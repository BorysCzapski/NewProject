// ============================================================================
// lib/biznes/glossary.ts
// The maturabiz.pl "Słownik pojęć" (187 terms) typed and keyed by dział, plus
// small text helpers shared by the flashcard / question / crossword builders.
// ============================================================================
import slownik from "./content/slownik.json";
import { GLOSSARY_TO_LESSON } from "./lessons";
import type { LessonId } from "./types";

export interface GlossaryEntry {
  id: string;
  lesson: LessonId;
  term: string;
  definition: string;
}

const counters: Partial<Record<LessonId, number>> = {};

export const GLOSSARY: GlossaryEntry[] = (slownik as { category: string; term: string; definition: string }[]).map((e) => {
  const lesson = GLOSSARY_TO_LESSON[e.category];
  const n = (counters[lesson] = (counters[lesson] ?? 0) + 1);
  return { id: `${lesson}-${String(n).padStart(3, "0")}`, lesson, term: e.term.trim(), definition: e.definition.trim() };
});

export function glossaryFor(lesson: LessonId): GlossaryEntry[] {
  return GLOSSARY.filter((g) => g.lesson === lesson);
}

/** First sentence, cut at a word boundary when it is longer than `max`. */
export function shorten(text: string, max: number): string {
  const first = text.match(/^.+?[.!?](?=\s|$)/)?.[0] ?? text;
  const base = first.length <= max ? first : `${first.slice(0, max).replace(/\s+\S*$/, "")}…`;
  return base.trim();
}

/** Hides the term itself (and its common stem) inside a clue so it does not give the answer away. */
export function maskTerm(text: string, term: string): string {
  const stem = term.toLowerCase().slice(0, Math.max(4, term.length - 3));
  return text.replace(new RegExp(`\\b${stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\p{L}*`, "giu"), "…");
}
