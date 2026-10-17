// ============================================================================
// lib/informatyka/taxonomy.ts
// Labels for the two ways tasks are grouped besides the exam session: `kind`
// (how you work on it) and `topic` (what it is about). Plain data, safe to
// import from Client Components.
// ============================================================================
import type { InformatykaKind } from "@/lib/types/database";

export const KINDS: { id: InformatykaKind; label: string; hint: string }[] = [
  { id: "program", label: "Programowanie", hint: "Kod na plikach z danymi" },
  { id: "pisemne", label: "Algorytmy (pisemne)", hint: "Tabele, pseudokod, rysunki" },
  { id: "sql", label: "Bazy danych (SQL)", hint: "Zapytania do tabel" },
  { id: "arkusz", label: "Arkusz kalkulacyjny", hint: "Formuły, wykresy, tabele przestawne" },
  { id: "teoria", label: "Krótkie zadania", hint: "Systemy liczbowe, sieci, logika" },
];

export const TOPICS: Record<string, string> = {
  rekurencja: "Rekurencja",
  "algorytmy-tekstowe": "Algorytmy tekstowe",
  liczby: "Liczby i arytmetyka",
  "systemy-liczbowe": "Systemy liczbowe",
  "struktury-danych": "Drzewa, grafy, struktury",
  "algorytmy-ogolne": "Algorytmy ogólne",
  "analiza-danych": "Analiza danych",
  "sieci-i-bezpieczenstwo": "Sieci, szyfrowanie, bezpieczeństwo",
  logika: "Logika",
  symulacje: "Symulacje",
  "bazy-danych": "Bazy danych",
  "arkusz-kalkulacyjny": "Arkusz kalkulacyjny",
  "teoria-ogolna": "Teoria",
};

export const KIND_LABEL: Record<string, string> = Object.fromEntries(KINDS.map((k) => [k.id, k.label]));

export function topicLabel(topic: string): string {
  return TOPICS[topic] ?? topic;
}

/** "2026 maj" / "2026 czerwiec" (plus "(stara)" for the old-formula June 2026 paper). */
export function examShortLabel(exam: { year: number; session: string; slug: string }): string {
  return `${exam.year} ${exam.session}${exam.slug.endsWith("-stara") ? " (stara)" : ""}`;
}
