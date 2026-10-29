// ============================================================================
// lib/biznes/crosswords.ts
// Crosswords built from short glossary terms (spaces dropped): the clue is the first
// sentence of the definition with the term masked. Words are grouped per dział
// and run through the deterministic layout; words that do not cross the grid
// roll over to the next crossword of that dział.
// ============================================================================
import { glossaryFor, maskTerm, shorten } from "./glossary";
import { layoutCrossword } from "./crossword-layout";
import { LESSONS } from "./lessons";
import type { Crossword, CrosswordEntry } from "./types";

/** Letters only once spaces/hyphens are dropped; at most two words, so answers stay guessable. */
const WORD = /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż]{5,14}$/;
const squash = (term: string) => term.replace(/[\s-]+/g, "");
const wordCount = (term: string) => term.trim().split(/[\s-]+/).length;
const PER_GRID = 10;
const MAX_GRIDS = 3;

function build(): Crossword[] {
  const out: Crossword[] = [];
  for (const lesson of LESSONS) {
    let pool: CrosswordEntry[] = glossaryFor(lesson.id)
      .filter((g) => wordCount(g.term) <= 2 && WORD.test(squash(g.term)))
      .map((g) => ({ answer: squash(g.term).toUpperCase(), clue: maskTerm(shorten(g.definition, 120), g.term) }));

    for (let n = 1; n <= MAX_GRIDS && pool.length >= 5; n++) {
      const batch = pool.slice(0, PER_GRID);
      const layout = layoutCrossword(batch);
      const dropped = new Set(layout.dropped.map((d) => d.answer));
      const placed = batch.filter((e) => !dropped.has(e.answer));
      pool = [...pool.slice(PER_GRID), ...layout.dropped];
      if (placed.length < 5) continue;
      out.push({ id: `cw-${lesson.id}-${n}`, lesson: lesson.id, title: `${lesson.short}: krzyżówka ${n}`, entries: placed });
    }
  }
  return out;
}

export const CROSSWORDS: Crossword[] = build();

export function getCrossword(id: string): Crossword | undefined {
  return CROSSWORDS.find((c) => c.id === id);
}
