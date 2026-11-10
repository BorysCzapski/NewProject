// ============================================================================
// lib/reading/words.ts
// Czysta logika "dotknij słowa, zobacz tłumaczenie": dzielenie tekstu na słowa i
// wycinanie zdania wokół słowa jako kontekstu dla tłumaczenia. Bez I/O i bez
// importów z Reacta, więc działa na serwerze i w przeglądarce, i da się ją
// sprawdzić bez uruchamiania aplikacji.
// ============================================================================

export interface Token {
  text: string;
  isWord: boolean;
  /** Pozycja w oryginalnym tekście (indeks UTF-16). */
  start: number;
  end: number;
}

/**
 * Słowo = ciąg liter (także polskich i cyrylicy) z ewentualnymi apostrofami i
 * łącznikami WEWNĄTRZ ("don't", "mother-in-law"). Liczby i interpunkcja nie są
 * słowami — nie ma czego tłumaczyć.
 */
const WORD = /[\p{L}\p{M}]+(?:['’‑-][\p{L}\p{M}]+)*/gu;

/** Rozbija tekst na kolejne fragmenty: słowa i wszystko pomiędzy nimi. */
export function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  let cursor = 0;
  for (const match of text.matchAll(WORD)) {
    const start = match.index ?? 0;
    if (start > cursor) tokens.push({ text: text.slice(cursor, start), isWord: false, start: cursor, end: start });
    tokens.push({ text: match[0], isWord: true, start, end: start + match[0].length });
    cursor = start + match[0].length;
  }
  if (cursor < text.length) tokens.push({ text: text.slice(cursor), isWord: false, start: cursor, end: text.length });
  return tokens;
}

const TERMINATORS = new Set([".", "!", "?", "…", "\n"]);

/**
 * Zdanie zawierające słowo [start, end) — kontekst, dzięki któremu tłumaczenie
 * wybiera właściwe znaczenie ("light" w "light bulb" i w "light bag" to dwa
 * różne słowa po polsku). Długie zdania są obcinane wokół słowa do `max` znaków.
 */
export function sentenceAround(text: string, start: number, end: number, max = 300): string {
  let from = start;
  while (from > 0 && !TERMINATORS.has(text[from - 1])) from--;
  let to = end;
  while (to < text.length && !TERMINATORS.has(text[to])) to++;
  // Znak kończący zdanie ("." "?") należy do tego zdania.
  if (to < text.length && text[to] !== "\n") to++;

  let sentence = text.slice(from, to).trim();
  if (sentence.length > max) {
    const wordMid = Math.round((start + end) / 2) - from;
    const half = Math.floor(max / 2);
    const cutFrom = Math.max(0, wordMid - half);
    sentence = (cutFrom > 0 ? "…" : "") + text.slice(from + cutFrom, from + cutFrom + max).trim() + "…";
  }
  return sentence;
}

/** Klucz pamięci podręcznej: to samo słowo w tym samym zdaniu tłumaczymy raz. */
export function translationCacheKey(language: string, word: string, sentence: string): string {
  return `${language}|${word.toLowerCase().replace(/[’‑]/g, "'")}|${sentence}`;
}
