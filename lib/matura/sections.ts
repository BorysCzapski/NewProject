// ============================================================================
// lib/matura/sections.ts
// Canonical list of the 4 CKE exam parts, once per (język, poziom) — see
// supabase/seed/matura/01_sections.sql (angielski) and
// supabase/seed/matura-es/01_sections.sql (hiszpański). This file is the
// reference those seeds were authored from, same relationship as
// lib/matma/topics.ts to 01_topics.sql.
//
// The four parts, their order and their weights are IDENTICAL across
// languages — CKE publishes one format for all języki obce nowożytne — so the
// per-language lists are generated from one shared shape rather than
// hand-copied. Only the seeded CONTENT (lessons/tasks) differs per language.
// ============================================================================
import type { MaturaLanguage, MaturaLevel, MaturaSectionSlug } from "@/lib/types/database";

export interface MaturaSectionSeed {
  language: MaturaLanguage;
  level: MaturaLevel;
  slug: MaturaSectionSlug;
  title: string;
  description: string;
  orderIndex: number;
  examWeight: number;
}

/** Sections that have real content today — everything else renders as "wkrótce". */
export const MATURA_BUILT_SECTION_SLUGS: MaturaSectionSlug[] = ["srodki-jezykowe", "pisanie", "czytanie", "sluchanie"];

/** Sections graded by exact-match items (matura_tasks/matura_task_attempts),
 * served by the generic app/(main)/matura/nauka/[sectionSlug]/ route —
 * "pisanie" is deliberately excluded, it has its own route + tables
 * (matura_writing_tasks/matura_writing_submissions, AI-graded holistically). */
export const MATURA_EXACT_MATCH_SECTION_SLUGS: MaturaSectionSlug[] = ["srodki-jezykowe", "czytanie", "sluchanie"];

const SHARED_DESCRIPTIONS: Record<MaturaSectionSlug, string> = {
  sluchanie: "Nagrania i zadania sprawdzające rozumienie ze słuchu.",
  czytanie: "Teksty i zadania sprawdzające rozumienie tekstów pisanych.",
  "srodki-jezykowe":
    "Słowotwórstwo, parafrazy zdań i uzupełnianie luk — sprawdza znajomość gramatyki i słownictwa w kontekście.",
  pisanie: "Wypowiedź pisemna oceniana pod kątem treści, spójności, zakresu i poprawności językowej.",
};

const SHARED_TITLES: Record<MaturaSectionSlug, string> = {
  sluchanie: "Rozumienie ze słuchu",
  czytanie: "Rozumienie tekstów pisanych",
  "srodki-jezykowe": "Znajomość środków językowych",
  pisanie: "Wypowiedź pisemna",
};

interface SectionShape {
  level: MaturaLevel;
  slug: MaturaSectionSlug;
  orderIndex: number;
  examWeight: number;
}

// Weights are an ADMIN APPROXIMATION, not an official CKE split — see the
// matura_sections comment in 0013_matura.sql.
const SECTION_SHAPES: SectionShape[] = [
  // Poziom podstawowy — ok. 60 pkt: I 15 / II 20 / III 15 / IV 10 (przybliżenie).
  { level: "podstawowa", slug: "sluchanie", orderIndex: 1, examWeight: 0.25 },
  { level: "podstawowa", slug: "czytanie", orderIndex: 2, examWeight: 0.33 },
  { level: "podstawowa", slug: "srodki-jezykowe", orderIndex: 3, examWeight: 0.25 },
  { level: "podstawowa", slug: "pisanie", orderIndex: 4, examWeight: 0.17 },

  // Poziom rozszerzony — ok. 50 pkt: I 11 / II 14 / III 9 / IV 16 (przybliżenie).
  { level: "rozszerzona", slug: "sluchanie", orderIndex: 1, examWeight: 0.22 },
  { level: "rozszerzona", slug: "czytanie", orderIndex: 2, examWeight: 0.28 },
  { level: "rozszerzona", slug: "srodki-jezykowe", orderIndex: 3, examWeight: 0.18 },
  { level: "rozszerzona", slug: "pisanie", orderIndex: 4, examWeight: 0.32 },
];

function sectionsFor(language: MaturaLanguage): MaturaSectionSeed[] {
  return SECTION_SHAPES.map((shape) => ({
    language,
    level: shape.level,
    slug: shape.slug,
    title: SHARED_TITLES[shape.slug],
    description: SHARED_DESCRIPTIONS[shape.slug],
    orderIndex: shape.orderIndex,
    examWeight: shape.examWeight,
  }));
}

export const MATURA_SECTIONS: MaturaSectionSeed[] = [...sectionsFor("en"), ...sectionsFor("es")];
