// ============================================================================
// lib/grammar/content/index.ts
// Registry of authored interactive grammar lessons, keyed by level + topic
// slug (slugs could repeat across levels). Topics without an entry fall
// back to the plain-text explanation from grammar_topics.explanation.
// ============================================================================
import type { GrammarLesson } from "@/lib/grammar/lesson-blocks";
import type { UserLevel } from "@/lib/types/database";
import { A1_LESSONS } from "@/lib/grammar/content/a1";
import { A2_LESSONS } from "@/lib/grammar/content/a2";
import { B1_LESSONS } from "@/lib/grammar/content/b1";
import { B2_LESSONS } from "@/lib/grammar/content/b2";

const LESSONS_BY_LEVEL: Record<UserLevel, Record<string, GrammarLesson>> = {
  A1: A1_LESSONS,
  A2: A2_LESSONS,
  B1: B1_LESSONS,
  B2: B2_LESSONS,
};

export function getGrammarLesson(level: UserLevel, slug: string): GrammarLesson | null {
  return LESSONS_BY_LEVEL[level]?.[slug] ?? null;
}
