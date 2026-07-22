// ============================================================================
// lib/matma/matemaks-seeds.ts
// Plain data, no "server-only"/"use server" marker on purpose: this needs
// to be importable both from lib/matma/import-curated-matemaks.ts
// (server-only crawler) and components/matma/admin/matemaks-trigger-form
// .tsx ("use client" — lets the admin see/edit the seed list before
// running). See import-curated-matemaks.ts's header comment for why only
// the first entry is a confirmed real starting URL.
// ============================================================================

export interface MatemaksDzialSeed {
  dzialSlug: string;
  startSlug: string;
}

export const MATEMAKS_DZIAL_SEEDS: MatemaksDzialSeed[] = [
  { dzialSlug: "elementy-analizy-matematycznej", startSlug: "zadania-optymalizacyjne" },
  { dzialSlug: "ciagi-liczbowe", startSlug: "ciagi-liczbowe" },
  { dzialSlug: "trygonometria", startSlug: "trygonometria" },
  { dzialSlug: "planimetria", startSlug: "planimetria" },
  { dzialSlug: "geometria-analityczna", startSlug: "geometria-analityczna" },
  { dzialSlug: "stereometria", startSlug: "stereometria" },
  { dzialSlug: "kombinatoryka-i-rachunek-prawdopodobienstwa", startSlug: "kombinatoryka-i-rachunek-prawdopodobienstwa" },
  { dzialSlug: "statystyka", startSlug: "statystyka" },
  { dzialSlug: "funkcje", startSlug: "funkcje" },
  { dzialSlug: "liczby-rzeczywiste", startSlug: "liczby-rzeczywiste" },
  { dzialSlug: "rownania-i-nierownosci", startSlug: "rownania-i-nierownosci" },
];
