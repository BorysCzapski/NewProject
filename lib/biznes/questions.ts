// ============================================================================
// lib/biznes/questions.ts
// Training / test bank built from the glossary: for every term one "which term
// matches this definition" and one "what does this term mean" single-choice
// task. Distractors come from the same dział and are picked deterministically
// (stable ids, same options on server and client). Exam-style open tasks live
// in the arkusze; fresh tasks come from the AI mode.
// ============================================================================
import { glossaryFor, shorten } from "./glossary";
import type { Question } from "./types";
import { LESSONS } from "./lessons";

function distractors<T>(pool: T[], self: number, seed: number, count: number): T[] {
  const picked: number[] = [];
  let step = 1;
  while (picked.length < count && step < pool.length * 3) {
    const idx = (seed * 7 + step * 13) % pool.length;
    if (idx !== self && !picked.includes(idx)) picked.push(idx);
    step++;
  }
  return picked.map((i) => pool[i]);
}

function place<T>(correct: T, others: T[], slot: number): { options: T[]; index: number } {
  const options = [...others];
  const index = slot % (options.length + 1);
  options.splice(index, 0, correct);
  return { options, index };
}

export const QUESTIONS: Question[] = LESSONS.flatMap((lesson) => {
  const group = glossaryFor(lesson.id);
  const out: Question[] = [];
  group.forEach((g, i) => {
    const wrong = distractors(group, i, i + 1, 3);
    if (wrong.length < 3) return;
    const explanation = `**${g.term}** – ${g.definition}`;

    const a = place(g.term, wrong.map((w) => w.term), i);
    out.push({
      id: `${g.id}-a`,
      lesson: lesson.id,
      type: "single",
      prompt: `Które pojęcie opisuje ta definicja? „${shorten(g.definition, 260)}”`,
      options: a.options,
      correct: [a.index],
      explanation,
      source: "słownik",
    });

    // Options are cut at the same limit, and distractors are drawn from entries that fit it whole,
    // so a trailing "…" never singles out the right answer.
    const lim = shorten(g.definition, 400).length > 150 ? 400 : 150;
    const fits = group.filter((w) => w !== g && shorten(w.definition, 400).length <= lim);
    const wrongB = fits.length >= 3 ? distractors(fits, -1, i + 1, 3) : wrong;
    const b = place(shorten(g.definition, lim), wrongB.map((w) => shorten(w.definition, lim)), i + 2);
    out.push({
      id: `${g.id}-b`,
      lesson: lesson.id,
      type: "single",
      prompt: `Co oznacza pojęcie „${g.term}”?`,
      options: b.options,
      correct: [b.index],
      explanation,
      source: "słownik",
    });
  });
  return out;
});

export function getQuestion(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}

export const QUESTION_COUNT = QUESTIONS.length;
