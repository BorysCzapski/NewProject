// ============================================================================
// lib/vocabulary/word-utils.ts
// Pure, environment-agnostic helpers for the vocabulary module. Split out of
// lib/vocabulary/words.ts (which is "server-only") because the meaning
// trainer Client Component needs pickDistractors()/shuffle() in the browser
// to re-shuffle/re-pick without a round-trip.
// ============================================================================
import type { VocabularyWord } from "@/lib/types/database";

/** Fisher-Yates shuffle, returns a new array (does not mutate the input). */
export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** Picks up to `count` distractor words for `word`, preferring the same category. */
export function pickDistractors(
  word: VocabularyWord,
  pool: VocabularyWord[],
  count = 3
): VocabularyWord[] {
  const others = pool.filter((w) => w.id !== word.id);
  const sameCategory = shuffle(others.filter((w) => w.category === word.category));
  const otherCategory = shuffle(others.filter((w) => w.category !== word.category));
  return [...sameCategory, ...otherCategory].slice(0, count);
}
