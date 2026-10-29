// ============================================================================
// lib/zusia/progress.ts
// Shape of the ZUSia progress blob stored on the account, plus the pure merge
// used when a device first loads the saved copy: counters take the larger
// value, flashcard levels the higher one, crosswords are OR-ed and test
// results are united by timestamp - so nothing done on either side is lost.
// ============================================================================
import { z } from "zod";

export const progressSchema = z.object({
  questionStats: z.record(z.string().max(40), z.object({ ok: z.number().int().min(0), wrong: z.number().int().min(0) })),
  cardLevels: z.record(z.string().max(40), z.number().int().min(0).max(3)),
  crosswords: z.record(z.string().max(60), z.boolean()),
  tests: z
    .array(z.object({ at: z.number(), total: z.number().int().min(0), correct: z.number().int().min(0), label: z.string().max(100) }))
    .max(30),
});

export type ZusiaProgress = z.infer<typeof progressSchema>;

export const EMPTY_PROGRESS: ZusiaProgress = { questionStats: {}, cardLevels: {}, crosswords: {}, tests: [] };

export function mergeProgress(a: ZusiaProgress, b: ZusiaProgress): ZusiaProgress {
  const questionStats: ZusiaProgress["questionStats"] = { ...a.questionStats };
  for (const [id, s] of Object.entries(b.questionStats)) {
    const cur = questionStats[id];
    questionStats[id] = cur ? { ok: Math.max(cur.ok, s.ok), wrong: Math.max(cur.wrong, s.wrong) } : s;
  }
  const cardLevels: ZusiaProgress["cardLevels"] = { ...a.cardLevels };
  for (const [id, level] of Object.entries(b.cardLevels)) cardLevels[id] = Math.max(cardLevels[id] ?? 0, level);
  const crosswords = { ...a.crosswords };
  for (const [id, solved] of Object.entries(b.crosswords)) crosswords[id] = crosswords[id] || solved;
  const byTime = new Map([...a.tests, ...b.tests].map((t) => [t.at, t]));
  const tests = [...byTime.values()].sort((x, y) => y.at - x.at).slice(0, 30);
  return { questionStats, cardLevels, crosswords, tests };
}
