// ============================================================================
// lib/matura/constants.ts
// Structural facts about the CKE English exam format (max points per level)
// plus display labels. Total points ARE fixed by CKE's exam format, unlike
// per-section exam_weight (an editable admin approximation, see
// 0013_matura.sql matura_sections comment).
// ============================================================================
import type { MaturaLevel, MaturaWritingFormType } from "@/lib/types/database";

export const MATURA_LEVELS: MaturaLevel[] = ["podstawowa", "rozszerzona"];

export const MATURA_MAX_POINTS: Record<MaturaLevel, number> = {
  podstawowa: 60,
  rozszerzona: 50,
};

export const MATURA_LEVEL_LABELS: Record<MaturaLevel, string> = {
  podstawowa: "Poziom podstawowy",
  rozszerzona: "Poziom rozszerzony",
};

export const MATURA_LEVEL_DESCRIPTIONS: Record<MaturaLevel, string> = {
  podstawowa: "Egzamin obowiązkowy dla każdego maturzysty. Czas: 120 minut, 60 punktów.",
  rozszerzona:
    "Dla kierunków wymagających zaawansowanej znajomości języka. Czas: 150 minut, 50 punktów.",
};

/** Total points for "Wypowiedź pisemna" specifically — a structural fact of
 * the current CKE format (Informator o egzaminie maturalnym z języka
 * angielskiego, od 2024/2025), not an admin approximation like exam_weight.
 * Podstawowa: treść 5 + spójność/logika 2 + zakres 3 + poprawność 2 = 12.
 * Rozszerzona: zgodność z poleceniem 5 + spójność/logika 2 + zakres 3 +
 * poprawność 3 = 13. See lib/matura/writing-grading.ts for the full rubric. */
export const MATURA_WRITING_MAX_POINTS: Record<MaturaLevel, number> = {
  podstawowa: 12,
  rozszerzona: 13,
};

/** Required word-count range and the "guillotine" floor below which every
 * criterion except the first is forced to 0 (CKE rule, not a soft target). */
export const MATURA_WRITING_WORD_RANGE: Record<MaturaLevel, { min: number; max: number; floor: number }> = {
  podstawowa: { min: 100, max: 150, floor: 80 },
  rozszerzona: { min: 200, max: 250, floor: 160 },
};

export const MATURA_WRITING_FORM_LABELS: Record<MaturaWritingFormType, string> = {
  email: "E-mail",
  blog_post: "Wpis na blogu",
  forum_post: "Wpis na forum",
  rozprawka_za_i_przeciw: "Rozprawka za i przeciw",
};
