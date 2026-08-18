// ============================================================================
// lib/matura/dashboard.ts
// "Szacowany wynik na maturze": a weighted average of per-section mastery
// (weights = matura_sections.exam_weight, an editable ADMIN APPROXIMATION —
// see 0013_matura.sql), converted to a points estimate out of
// MATURA_MAX_POINTS[level]. Same shape as lib/matma/dashboard.ts.
// ============================================================================
import "server-only";
import { MATURA_MAX_POINTS } from "@/lib/matura/constants";
import type { SectionWithProgress } from "@/lib/matura/progress";
import type { MaturaLevel } from "@/lib/types/database";

export interface EstimatedScore {
  points: number;
  percent: number;
}

export function computeEstimatedScore(sections: SectionWithProgress[], level: MaturaLevel): EstimatedScore {
  const totalWeight = sections.reduce((sum, s) => sum + s.exam_weight, 0) || 1;
  const weightedMastery =
    sections.reduce((sum, s) => sum + s.exam_weight * (s.masteryScore / 100), 0) / totalWeight;
  const percent = Math.round(weightedMastery * 100);
  const points = Math.round((percent / 100) * MATURA_MAX_POINTS[level]);
  return { points, percent };
}
