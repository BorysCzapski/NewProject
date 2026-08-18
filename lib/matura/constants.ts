// ============================================================================
// lib/matura/constants.ts
// Structural facts about the CKE English exam format (max points per level)
// plus display labels. Total points ARE fixed by CKE's exam format, unlike
// per-section exam_weight (an editable admin approximation, see
// 0013_matura.sql matura_sections comment).
// ============================================================================
import type { MaturaLevel } from "@/lib/types/database";

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
