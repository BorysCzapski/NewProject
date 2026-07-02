// ============================================================================
// lib/utils.ts
// Small framework-agnostic helpers shared across client and server code.
// ============================================================================
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names, resolving conflicting utility classes. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Levenshtein edit distance between two strings. */
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const prev = new Array(n + 1);
  const curr = new Array(n + 1);
  for (let j = 0; j <= n; j++) prev[j] = j;

  for (let i = 1; i <= m; i++) {
    curr[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= n; j++) prev[j] = curr[j];
  }
  return prev[n];
}

function normalize(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics for lenient matching
    .replace(/[^\p{L}\p{N}\s'-]/gu, "")
    .replace(/\s+/g, " ");
}

/**
 * Checks whether `input` matches `expected` well enough to count as correct,
 * tolerating small typos. The allowed edit distance scales with word length
 * so short words (e.g. "cat") still require an exact/near-exact match.
 */
export function isCloseMatch(input: string, expected: string): boolean {
  const a = normalize(input);
  const b = normalize(expected);
  if (!a) return false;
  if (a === b) return true;

  const maxLen = Math.max(a.length, b.length);
  const tolerance = maxLen <= 4 ? 0 : maxLen <= 7 ? 1 : maxLen <= 12 ? 2 : 3;
  return levenshtein(a, b) <= tolerance;
}

/** Formats a Date (or ISO string) as YYYY-MM-DD in UTC, matching Postgres `date`. */
export function toDateKey(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}

/** Extracts an 11-char YouTube video ID from common URL formats. */
export function extractYoutubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtu\.be\/)([\w-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}
