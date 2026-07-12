// ============================================================================
// lib/grammar/content/index.ts
// Registry of authored interactive grammar lessons, keyed by level + topic
// slug (slugs could repeat across levels). Topics without an entry fall
// back to the plain-text explanation from grammar_topics.explanation.
// Multi-language: ES/RU lessons live in es-*.ts / ru-*.ts and are merged in
// here — their slugs carry an "es-"/"ru-" prefix (matching grammar_topics
// seeds), so they can never collide with the English slugs at the same level.
// ============================================================================
import type { GrammarLesson } from "@/lib/grammar/lesson-blocks";
import type { UserLevel } from "@/lib/types/database";
import { A1_LESSONS } from "@/lib/grammar/content/a1";
import { A2_LESSONS } from "@/lib/grammar/content/a2";
import { B1_LESSONS } from "@/lib/grammar/content/b1";
import { B2_LESSONS } from "@/lib/grammar/content/b2";
import { ES_A1_LESSONS } from "@/lib/grammar/content/es-a1";
import { ES_A2_LESSONS } from "@/lib/grammar/content/es-a2";
import { ES_B1_LESSONS } from "@/lib/grammar/content/es-b1";
import { ES_B2_LESSONS } from "@/lib/grammar/content/es-b2";
import { RU_A1_LESSONS } from "@/lib/grammar/content/ru-a1";
import { RU_A2_LESSONS } from "@/lib/grammar/content/ru-a2";
import { RU_B1_LESSONS } from "@/lib/grammar/content/ru-b1";
import { RU_B2_LESSONS } from "@/lib/grammar/content/ru-b2";

const LESSONS_BY_LEVEL: Record<UserLevel, Record<string, GrammarLesson>> = {
  A1: { ...A1_LESSONS, ...ES_A1_LESSONS, ...RU_A1_LESSONS },
  A2: { ...A2_LESSONS, ...ES_A2_LESSONS, ...RU_A2_LESSONS },
  B1: { ...B1_LESSONS, ...ES_B1_LESSONS, ...RU_B1_LESSONS },
  B2: { ...B2_LESSONS, ...ES_B2_LESSONS, ...RU_B2_LESSONS },
};

export function getGrammarLesson(level: UserLevel, slug: string): GrammarLesson | null {
  return LESSONS_BY_LEVEL[level]?.[slug] ?? null;
}
