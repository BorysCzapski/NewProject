// ============================================================================
// lib/matura/sections.ts
// Canonical list of the 4 CKE exam parts, once per poziom (see
// supabase/seed/matura/01_sections.sql — this file is the reference the seed
// was authored from, same relationship as lib/matma/topics.ts to
// 01_topics.sql). Only "srodki-jezykowe" has an authored lesson + task bank
// today — the other 3 are seeded as rows (so the nav/dashboard has something
// real to point at) but show "wkrótce" in the UI (see
// app/(main)/matura/nauka/page.tsx).
// ============================================================================
import type { MaturaLevel, MaturaSectionSlug } from "@/lib/types/database";

export interface MaturaSectionSeed {
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

export const MATURA_SECTIONS: MaturaSectionSeed[] = [
  // Poziom podstawowy — ok. 60 pkt: I 15 / II 20 / III 15 / IV 10 (przybliżenie, patrz komentarz w 0013_matura.sql).
  { level: "podstawowa", slug: "sluchanie", title: SHARED_TITLES.sluchanie, description: SHARED_DESCRIPTIONS.sluchanie, orderIndex: 1, examWeight: 0.25 },
  { level: "podstawowa", slug: "czytanie", title: SHARED_TITLES.czytanie, description: SHARED_DESCRIPTIONS.czytanie, orderIndex: 2, examWeight: 0.33 },
  { level: "podstawowa", slug: "srodki-jezykowe", title: SHARED_TITLES["srodki-jezykowe"], description: SHARED_DESCRIPTIONS["srodki-jezykowe"], orderIndex: 3, examWeight: 0.25 },
  { level: "podstawowa", slug: "pisanie", title: SHARED_TITLES.pisanie, description: SHARED_DESCRIPTIONS.pisanie, orderIndex: 4, examWeight: 0.17 },

  // Poziom rozszerzony — ok. 50 pkt: I 11 / II 14 / III 9 / IV 16 (przybliżenie).
  { level: "rozszerzona", slug: "sluchanie", title: SHARED_TITLES.sluchanie, description: SHARED_DESCRIPTIONS.sluchanie, orderIndex: 1, examWeight: 0.22 },
  { level: "rozszerzona", slug: "czytanie", title: SHARED_TITLES.czytanie, description: SHARED_DESCRIPTIONS.czytanie, orderIndex: 2, examWeight: 0.28 },
  { level: "rozszerzona", slug: "srodki-jezykowe", title: SHARED_TITLES["srodki-jezykowe"], description: SHARED_DESCRIPTIONS["srodki-jezykowe"], orderIndex: 3, examWeight: 0.18 },
  { level: "rozszerzona", slug: "pisanie", title: SHARED_TITLES.pisanie, description: SHARED_DESCRIPTIONS.pisanie, orderIndex: 4, examWeight: 0.32 },
];
