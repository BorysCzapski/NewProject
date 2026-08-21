// ============================================================================
// lib/matura/vocab-review.ts
// Leitner-box scheduling for the matura vocabulary bank. Pure functions, no
// I/O — the server action in lib/matura/vocab-actions.ts owns the writes.
//
// Why a real schedule here, when lib/matma/spaced-review.ts and
// lib/geografia/spaced-review.ts get away with a single fixed interval: those
// modules resurface a handful of mastered TOPICS, so "anything older than five
// days" is a fine rule. The vocabulary bank is thousands of individual entries
// and a maturzysta cannot grind it linearly — the drill has to be able to ask
// "what is due today", which needs a per-entry interval that grows as the word
// sticks.
// ============================================================================
import type { MasteryStatus, MaturaLevel } from "@/lib/types/database";

/** Days until the next review, indexed by box. Roughly doubling, ending just
 * past a month — long enough to be worth calling "known", short enough that
 * nothing goes unseen across a school year of revision. */
export const VOCAB_BOX_INTERVALS_DAYS = [1, 2, 4, 9, 20, 45] as const;

export const VOCAB_MAX_BOX = VOCAB_BOX_INTERVALS_DAYS.length - 1;

/** From this box up, an entry counts as mastered (≈ three weeks of retention). */
const MASTERED_FROM_BOX = 4;

export interface VocabReviewOutcome {
  box: number;
  status: MasteryStatus;
  nextReviewAt: string;
}

/**
 * The new schedule for an entry after one review.
 *
 * A miss demotes by TWO boxes rather than resetting to zero. Resetting is the
 * textbook Leitner rule, but it means one slip on a word held for a month
 * sends it back to daily drilling, which crowds out words the student actually
 * does not know. Demoting is strict enough to bring the word back within days
 * without wiping the history that earned its interval.
 */
export function nextVocabReview(
  currentBox: number,
  wasCorrect: boolean,
  now: Date = new Date()
): VocabReviewOutcome {
  const safeBox = Number.isFinite(currentBox) ? Math.min(Math.max(currentBox, 0), VOCAB_MAX_BOX) : 0;
  const box = wasCorrect ? Math.min(safeBox + 1, VOCAB_MAX_BOX) : Math.max(safeBox - 2, 0);

  const next = new Date(now);
  next.setDate(next.getDate() + VOCAB_BOX_INTERVALS_DAYS[box]);

  return {
    box,
    status: box >= MASTERED_FROM_BOX ? "mastered" : "learning",
    nextReviewAt: next.toISOString(),
  };
}

/**
 * Which entry levels a student at `level` is responsible for. A rozszerzona
 * maturzysta sits an exam that assumes everything from the podstawowa scope
 * plus more, so their bank is the union — not the rozszerzona slice alone.
 */
export function vocabLevelsFor(level: MaturaLevel): MaturaLevel[] {
  return level === "rozszerzona" ? ["podstawowa", "rozszerzona"] : ["podstawowa"];
}
