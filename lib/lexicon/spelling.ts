// ============================================================================
// lib/lexicon/spelling.ts
// Ćwiczenie z pisowni: z hasła zasłaniamy jedną lub dwie litery, a uczeń je
// uzupełnia. Czysta logika bez I/O i bez Math.random — maska zależy wyłącznie
// od hasła i "ziarna", więc serwer i przeglądarka budują TĘ SAMĄ zagadkę
// (inaczej hydratacja Reacta by się rozjechała), a po błędzie kolejne
// podejście do tego samego słowa dostaje inne ziarno, czyli inne litery.
//
// Które litery zasłaniać: nie pierwsze litery wyrazów (zostają jako kotwica),
// nie krótkie słowa funkcyjne ("the", "on", "to"), nie nic w nawiasach i nie
// "sth"/"sb". Chętniej litery, na których Polacy faktycznie się mylą: podwójne
// spółgłoski (mattress) i skupiska samogłosek (ceiling, neighbour).
// ============================================================================

export interface PuzzleCell {
  char: string;
  /** Indeks w `answers`, gdy ta komórka jest luką; null dla zwykłego znaku. */
  blank: number | null;
}

export interface SpellingPuzzle {
  cells: PuzzleCell[];
  /** Brakujące litery, małymi literami, w kolejności występowania. */
  answers: string[];
}

const SKIP_WORDS = new Set([
  "a", "an", "the", "of", "on", "in", "at", "to", "for", "up", "out", "off",
  "it", "is", "and", "or", "by", "with", "sth", "sb",
]);

const VOWELS = new Set(["a", "e", "i", "o", "u", "y"]);

/** Ile liter zasłonić na danym etapie nauki: najpierw jedna, potem dwie. */
export function blanksForBox(box: number): 1 | 2 {
  return box >= 2 ? 2 : 1;
}

// xfnv1a + mulberry32: mały, deterministyczny generator zależny od tekstu.
function hashSeed(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Candidate {
  index: number;
  weight: number;
}

/** Pozycje liter, które wolno zasłonić, z wagą "jak ciekawa pisownia". */
function findCandidates(term: string): { interior: Candidate[]; edge: Candidate[] } {
  const interior: Candidate[] = [];
  const edge: Candidate[] = [];

  // Co jest w nawiasach — nie ruszamy ("hang (up) the washing").
  const inParens: boolean[] = [];
  let depth = 0;
  for (const ch of term) {
    if (ch === "(") depth++;
    inParens.push(depth > 0 || ch === ")");
    if (ch === ")" && depth > 0) depth--;
  }

  for (const match of term.matchAll(/[A-Za-z]+/g)) {
    const start = match.index ?? 0;
    const word = match[0];
    const lower = word.toLowerCase();
    if (word.length < 3 || SKIP_WORDS.has(lower) || inParens[start]) continue;

    for (let offset = 1; offset < word.length; offset++) {
      const ch = lower[offset];
      const prev = lower[offset - 1];
      const next = lower[offset + 1];
      const isDouble = ch === prev || ch === next;
      const isVowelCluster =
        VOWELS.has(ch) && (VOWELS.has(prev) || (next !== undefined && VOWELS.has(next)));
      const candidate = { index: start + offset, weight: isDouble || isVowelCluster ? 3 : 1 };
      (offset === word.length - 1 ? edge : interior).push(candidate);
    }
  }
  return { interior, edge };
}

function pickWeighted(pool: Candidate[], random: () => number): Candidate {
  const total = pool.reduce((sum, c) => sum + c.weight, 0);
  let roll = random() * total;
  for (const candidate of pool) {
    roll -= candidate.weight;
    if (roll < 0) return candidate;
  }
  return pool[pool.length - 1];
}

/**
 * Zagadka dla hasła z `blanks` lukami (1 lub 2). Gdy hasło ma za mało liter do
 * zasłonięcia dwóch, zasłania jedną; gdy nie ma żadnej (np. samo "a"), zwraca
 * null i wołający pomija takie hasło.
 */
export function buildPuzzle(term: string, blanks: 1 | 2, seed: string): SpellingPuzzle | null {
  const { interior, edge } = findCandidates(term);
  // Litery końcowe wyrazów dokładamy dopiero, gdy środek nie wystarcza —
  // brak litery na końcu ("kettl_") rzadko uczy czegoś o pisowni.
  const pool = interior.length >= blanks ? interior : [...interior, ...edge];
  if (pool.length === 0) return null;

  const wanted = blanks === 2 && pool.length >= 4 ? 2 : 1;
  const random = mulberry32(hashSeed(`${term}|${seed}`));

  const chosen: Candidate[] = [];
  let remaining = [...pool];
  while (chosen.length < wanted && remaining.length > 0) {
    const pick = pickWeighted(remaining, random);
    chosen.push(pick);
    // Dwie luki obok siebie robią z ćwiczenia zgadywanie — odsuwamy sąsiadów,
    // o ile coś zostanie.
    const apart = remaining.filter((c) => Math.abs(c.index - pick.index) > 1);
    remaining = apart.length > 0 ? apart : remaining.filter((c) => c.index !== pick.index);
  }

  const blankAt = new Map<number, number>();
  [...chosen]
    .sort((a, b) => a.index - b.index)
    .forEach((c, order) => blankAt.set(c.index, order));

  const cells: PuzzleCell[] = [...term].map((char, index) => ({
    char,
    blank: blankAt.get(index) ?? null,
  }));
  const answers = [...blankAt.keys()].sort((a, b) => a - b).map((index) => term[index].toLowerCase());

  return { cells, answers };
}

/** Czy wpisane litery (po jednej na lukę) zgadzają się z brakującymi. */
export function checkAnswers(puzzle: SpellingPuzzle, typed: string[]): boolean[] {
  return puzzle.answers.map((answer, i) => (typed[i] ?? "").trim().toLowerCase() === answer);
}
