// ============================================================================
// lib/informatyka/answer-check.ts
// Lenient automatic check of a short answer against what the CKE key expects.
// The answer is compared as a SET of normalised tokens (case, Polish letters,
// decimal comma and number formatting don't matter; order doesn't matter), and
// counts as matching when it contains every required token of at least one
// accepted variant. Pure functions — used by the app AND by the script that
// derives the required tokens from verified reference solutions.
// ============================================================================

export interface AnswerCheck {
  /** Accepted variants; each is the list of tokens an answer must contain. */
  any: string[][];
}

const FOLD: Record<string, string> = { ł: "l", Ł: "l" };

function fold(text: string): string {
  return text
    .replace(/[łŁ]/g, (c) => FOLD[c])
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/** All tokens of a text, normalised (numbers canonical, decimal comma → dot). */
export function tokenize(text: string): string[] {
  const prepared = fold(text)
    .replace(/[−–—]/g, "-")
    .replace(/(\d),(\d)/g, "$1.$2"); // 19443,29 → 19443.29
  return prepared
    .split(/[\s,;:()[\]{}"'|=→]+/)
    .map((t) => t.replace(/^\.+|\.+$/g, "").replace(/-+$/, "").replace(/^-(?!\d)/, ""))
    .filter(Boolean)
    .map((t) => (/^-?\d{1,15}(\.\d+)?$/.test(t) ? String(Number(t)) : t));
}

/** Required tokens for a reference answer: numbers always, words only when 2+ letters. */
export function requiredTokens(text: string): string[] {
  const set = new Set<string>();
  for (const t of tokenize(text)) {
    if (/^-?\d+(\.\d+)?$/.test(t) || t.length >= 2) set.add(t);
  }
  return [...set];
}

export function matches(answer: string, check: AnswerCheck): boolean {
  const have = new Set(tokenize(answer));
  return check.any.some((variant) => variant.length > 0 && variant.every((t) => have.has(t)));
}
