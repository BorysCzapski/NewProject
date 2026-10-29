// ============================================================================
// lib/biznes/quiz.ts
// Pure quiz helpers shared by Trening, Test and the AI tasks: seeded-free
// shuffling that keeps the correct-answer mapping, and answer checking.
// ============================================================================
import type { Question } from "./types";

export function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Returns a copy of the question with options reordered (correct indexes remapped). */
export function shuffleOptions(q: Question): Question {
  if (!q.options || !q.correct) return q;
  const order = shuffle(q.options.map((_, i) => i));
  return {
    ...q,
    options: order.map((i) => q.options![i]),
    correct: order.flatMap((oldIndex, newIndex) => (q.correct!.includes(oldIndex) ? [newIndex] : [])),
  };
}

/** Answer = sorted selected indexes. Open tasks are self-assessed, never auto-graded here. */
export function isCorrect(q: Question, selected: number[]): boolean {
  if (!q.correct) return false;
  const a = [...selected].sort((x, y) => x - y);
  const b = [...q.correct].sort((x, y) => x - y);
  return a.length === b.length && a.every((v, i) => v === b[i]);
}

export const TYPE_LABELS: Record<Question["type"], string> = {
  single: "Jednokrotny wybór",
  multi: "Wielokrotny wybór",
  tf: "Prawda / fałsz",
  open: "Zadanie otwarte",
};
