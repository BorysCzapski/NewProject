// ============================================================================
// lib/algorytmy/task-types.ts
// Exercise TYPES for Algorytmy — the axis the student practises along, exactly
// as in lib/matura/task-types.ts. A dział lists these with a counter of how
// many the student has done, and each attempt serves a different exercise.
// The app never shows "zadanie 1..N".
//
// Every type is single-choice. That is a deliberate limit, not an oversight:
// a single-choice answer is graded programmatically and correctly, whereas a
// free-text answer about an algorithm would need an AI grader whose verdict
// nobody can check. The teaching that genuinely needs to be open-ended lives
// in the lessons' interactive blocks (lib/algorytmy/lesson-blocks.ts), where
// the student steps through the real algorithm rather than describing it.
// ============================================================================

export interface AlgoTaskTypeDef {
  slug: AlgoTaskTypeSlug;
  label: string;
  description: string;
  /** Distractor count is fixed at 4 options total across every type, so the
   * generated bank stays visually consistent with the seeded one. */
  aiBrief: string;
}

export type AlgoTaskTypeSlug =
  | "zlozonosc"
  | "wynik-kodu"
  | "krok-algorytmu"
  | "wybor-struktury"
  | "pojecia"
  | "analiza-bledu";

export const ALGO_TASK_TYPES: AlgoTaskTypeDef[] = [
  {
    slug: "zlozonosc",
    label: "Złożoność",
    description: "Oceń koszt czasowy albo pamięciowy podanego fragmentu.",
    aiBrief:
      "Pytanie podaje krótki fragment kodu albo opis algorytmu i pyta o złożoność czasową lub pamięciową. " +
      "Opcje to wyrażenia w notacji O — na przykład O(1), O(log n), O(n), O(n log n), O(n²) — i muszą być " +
      "wzajemnie różne. Nie pytaj o dokładną liczbę operacji, tylko o rząd wielkości. W wyjaśnieniu wskaż, " +
      "która pętla albo które wywołanie rekurencyjne decyduje o wyniku.",
  },
  {
    slug: "wynik-kodu",
    label: "Wynik kodu",
    description: "Przewidź, co wypisze albo zwróci podany fragment.",
    aiBrief:
      "Pytanie zawiera fragment kodu w polu code (5–15 linii, Python albo JavaScript — zaznacz który) i pyta " +
      "o wypisany wynik lub zwróconą wartość. Kod musi być deterministyczny: bez losowości, bez czasu, bez " +
      "wejścia od użytkownika, bez zależności od kolejności iteracji po zbiorze. Dystraktory mają być wynikami " +
      "typowych pomyłek — błąd o jeden, zła kolejność, pomylona kopia z referencją.",
  },
  {
    slug: "krok-algorytmu",
    label: "Krok algorytmu",
    description: "Wskaż stan struktury po kolejnym kroku przebiegu.",
    aiBrief:
      "Pytanie podaje stan początkowy (tablica, stos, kolejka, kopiec albo graf) i nazwę algorytmu, po czym " +
      "pyta, jak wygląda struktura po konkretnej liczbie kroków albo przebiegów. Podaj jednoznacznie, co liczy " +
      "się za jeden krok. Opcje to konkretne stany zapisane tak samo sformatowane, żeby różniły się wyłącznie " +
      "zawartością.",
  },
  {
    slug: "wybor-struktury",
    label: "Dobór struktury",
    description: "Wybierz strukturę danych pasującą do opisanego zastosowania.",
    aiBrief:
      "Pytanie opisuje konkretne zastosowanie i wymagania (jakie operacje wykonywane najczęściej, jaki koszt " +
      "jest dopuszczalny), a opcje to struktury danych. Dokładnie jedna ma spełniać wszystkie wymagania — " +
      "pozostałe niech przechodzą część z nich, żeby wybór wymagał porównania kosztów, a nie zgadywania.",
  },
  {
    slug: "pojecia",
    label: "Pojęcia",
    description: "Sprawdź definicje i własności: stabilność, in-place, niezmienniki.",
    aiBrief:
      "Pytanie o definicję albo własność: stabilność sortowania, sortowanie w miejscu, niezmiennik pętli, " +
      "warunek bazowy rekurencji, własność kopca, własność BST, amortyzowany koszt. Sprawdzaj zrozumienie " +
      "pojęcia, nie zapamiętaną formułkę — pytaj o konsekwencję własności, a nie o jej brzmienie.",
  },
  {
    slug: "analiza-bledu",
    label: "Analiza błędu",
    description: "Znajdź usterkę w implementacji albo w rozumowaniu.",
    aiBrief:
      "Pytanie zawiera w polu code implementację z DOKŁADNIE jedną usterką (błąd o jeden, brak warunku " +
      "bazowego, zła aktualizacja wskaźnika, złe porównanie) i pyta, na czym polega błąd albo dla jakiego " +
      "wejścia się ujawni. Kod poza tą jedną usterką musi być poprawny — inaczej pytanie nie ma jednej " +
      "poprawnej odpowiedzi.",
  },
];

export function getAlgoTaskType(slug: string): AlgoTaskTypeDef | undefined {
  return ALGO_TASK_TYPES.find((t) => t.slug === slug);
}
