// ============================================================================
// lib/projekty/constants.ts
// Statusy projektów i czysta logika postępu (bez I/O).
// ============================================================================
import type { ProjectItem, ProjectStatus } from "@/lib/types/database";

export const STATUSES: ProjectStatus[] = ["pomysl", "w_trakcie", "wstrzymany", "ukonczony"];

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  pomysl: "Pomysł",
  w_trakcie: "W trakcie",
  wstrzymany: "Wstrzymany",
  ukonczony: "Ukończony",
};

/** Postęp = odhaczone kroki / wszystkie kroki (0–100); null, gdy nie ma kroków. */
export function stepProgress(items: Pick<ProjectItem, "kind" | "done">[]): {
  done: number;
  total: number;
  pct: number | null;
} {
  const steps = items.filter((i) => i.kind === "step");
  const done = steps.filter((i) => i.done).length;
  return { done, total: steps.length, pct: steps.length ? Math.round((done / steps.length) * 100) : null };
}
