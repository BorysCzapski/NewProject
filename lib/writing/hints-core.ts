// ============================================================================
// lib/writing/hints-core.ts
// Czysta logika dwóch dodatków do pisania w Linguo: "Przydatne słówka" (podpowiedzi
// przed napisaniem odpowiedzi) i "propozycje ulepszeń" (opcjonalne alternatywy w
// ocenie). Bez I/O i bez importów z serwera — używana przez serwer, komponenty i testy.
// ============================================================================

export interface WritingHint {
  /** Słowo lub zwrot w języku zadania. */
  term: string;
  /** Polskie znaczenie, krótko. */
  translation: string;
}

export interface WritingHints {
  words: WritingHint[];
  phrases: WritingHint[];
}

export interface WritingSuggestion {
  /** Fragment tekstu ucznia (poprawny, ale da się lepiej). */
  original: string;
  /** Propozycja bardziej naturalnego / bogatszego sformułowania. */
  better: string;
  /** Jedno krótkie zdanie po polsku: dlaczego to brzmi lepiej. */
  why: string;
}

const MAX_TERM = 60;
const MAX_TRANSLATION = 80;

function clean(value: unknown): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeList(raw: unknown, max: number): WritingHint[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: WritingHint[] = [];
  for (const item of raw) {
    const term = clean((item as { term?: unknown } | null)?.term);
    const translation = clean((item as { translation?: unknown } | null)?.translation);
    if (!term || !translation || term.length > MAX_TERM || translation.length > MAX_TRANSLATION) continue;
    const key = term.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ term, translation });
    if (out.length >= max) break;
  }
  return out;
}

/** Model bywa niedbały: zostawiamy kompletne pary, bez powtórzeń, w rozsądnej liczbie. */
export function normalizeHints(raw: unknown): WritingHints {
  const source = (raw ?? {}) as { words?: unknown; phrases?: unknown };
  return { words: normalizeList(source.words, 8), phrases: normalizeList(source.phrases, 4) };
}

export function hasHints(hints: WritingHints): boolean {
  return hints.words.length + hints.phrases.length > 0;
}

/**
 * Propozycje ulepszeń: tylko pełne trójki, w których "better" naprawdę różni się od
 * "original" (model lubi "poprawiać" na to samo), bez powtórzeń i najwyżej `max`.
 * Pusta lista to normalny, dobry wynik — nie wymuszamy propozycji.
 */
export function normalizeSuggestions(raw: unknown, max = 3): WritingSuggestion[] {
  if (!Array.isArray(raw)) return [];
  const seen = new Set<string>();
  const out: WritingSuggestion[] = [];
  for (const item of raw) {
    const original = clean((item as { original?: unknown } | null)?.original);
    const better = clean((item as { better?: unknown } | null)?.better);
    const why = clean((item as { why?: unknown } | null)?.why);
    if (!original || !better || !why) continue;
    if (original.length > 200 || better.length > 200 || why.length > 220) continue;
    if (original.toLowerCase() === better.toLowerCase()) continue;
    const key = original.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ original, better, why });
    if (out.length >= max) break;
  }
  return out;
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Czy uczeń już użył słowa lub zwrotu. Granice słów są "unicode'owe" (działa dla
 * polskich/hiszpańskich/rosyjskich liter). Dla pojedynczego słowa dopuszczamy
 * końcówkę (np. "book" ~ "booked"), ale nie wyraz, który tylko zawiera to słowo w
 * środku. Nie jest to analiza morfologiczna — to tylko miła odhaczana wskazówka.
 */
export function isUsedInText(text: string, term: string): boolean {
  const t = clean(term);
  if (!t || !text.trim()) return false;
  const single = !/\s/.test(t);
  const body = escapeRegExp(t).replace(/\s+/g, "\\s+");
  const tail = single && t.length >= 3 ? "[\\p{L}]{0,3}" : "";
  return new RegExp(`(?<![\\p{L}\\p{N}])${body}${tail}(?![\\p{L}\\p{N}])`, "iu").test(text);
}
