// ============================================================================
// lib/lexicon/recall.ts
// Sprawdzanie odpowiedzi w "Treningu fiszek": widzisz polskie słowo, wpisujesz
// angielskie. Czysta logika bez I/O.
//
// Zasady, i dlaczego:
//  * Przyjmujemy hasło główne ORAZ każdy wariant ("staircase" i "stairwell"),
//    a także wszystkie naraz przez ukośnik ("staircase/stairwell") — uczeń, który
//    zna dwa warianty, nie powinien być karany za wpisanie obu.
//  * Wielkość liter, krańcowe spacje, podwójne spacje, kropka na końcu i
//    typograficzny apostrof nie liczą się jako błąd — to nie jest pisownia.
//  * Rodzajnik na początku ("the garden", "a lawn") oraz "to" przy czasownikach
//    są dozwolone: ćwiczymy słowo, nie to, czy ktoś dopisał rodzajnik.
//  * Literówka NIE przechodzi — pisownia jest częścią znajomości słowa — ale
//    odpowiedź o jedną literę od poprawnej jest oznaczona jako "prawie", żeby
//    uczeń widział, że chodzi o literówkę, a nie o nieznajomość słowa.
// ============================================================================

export interface RecallVerdict {
  correct: boolean;
  /** Błąd o jedną literę od poprawnej odpowiedzi (nie liczy się jako dobra). */
  nearMiss: boolean;
}

export function normalizeAnswer(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’‘`´]/g, "'")
    .replace(/\s+/g, " ")
    .replace(/\s*\/\s*/g, "/")
    .replace(/[.!?,;:]+$/, "")
    .trim();
}

/** Odpowiedzi do porównania: hasło główne i warianty, znormalizowane, bez pustych. */
export function acceptedAnswers(term: string, alternatives: readonly string[] = []): string[] {
  const accepted = [term, ...alternatives]
    .map(normalizeAnswer)
    .filter((answer) => answer.length > 0);
  return [...new Set(accepted)];
}

function stripLeadingFunctionWord(answer: string): string {
  return answer.replace(/^(?:the|a|an|to)\s+/, "");
}

/**
 * Czy `a` różni się od `b` o jedną edycję: literę za dużo, za mało, inną albo
 * zamianę dwóch sąsiednich ("cieling" zamiast "ceiling" — jeden z
 * najczęstszych błędów w pisowni, więc liczy się jako jedna pomyłka, nie dwie).
 * Dalej niż jedna edycja nas nie interesuje, więc nie liczymy pełnej odległości.
 */
function withinOneEdit(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  if (a.length === b.length) {
    if (a.slice(i + 1) === b.slice(i + 1)) return true;
    return a[i] === b[i + 1] && a[i + 1] === b[i] && a.slice(i + 2) === b.slice(i + 2);
  }
  const [shorter, longer] = a.length < b.length ? [a, b] : [b, a];
  return shorter.slice(i) === longer.slice(i + 1);
}

export function checkRecall(
  typed: string,
  term: string,
  alternatives: readonly string[] = []
): RecallVerdict {
  const accepted = acceptedAnswers(term, alternatives);
  const answer = normalizeAnswer(typed);
  if (!answer) return { correct: false, nearMiss: false };

  const matches = (candidate: string) =>
    accepted.includes(candidate) || accepted.includes(stripLeadingFunctionWord(candidate));

  if (matches(answer)) return { correct: true, nearMiss: false };

  // Wszystkie warianty naraz ("staircase/stairwell"): każdy człon musi być poprawny.
  if (answer.includes("/")) {
    const parts = answer.split("/");
    if (parts.every((part) => part.length > 0 && matches(part))) return { correct: true, nearMiss: false };
  }

  // Krótkie słowa ("tap", "rug") dzieli jedna litera od zupełnie innych słów,
  // więc "prawie" ma sens dopiero od czterech liter.
  const stripped = stripLeadingFunctionWord(answer);
  const near = accepted.some((candidate) => candidate.length >= 4 && withinOneEdit(stripped, candidate));
  return { correct: false, nearMiss: near };
}
