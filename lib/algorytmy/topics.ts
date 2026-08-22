// ============================================================================
// lib/algorytmy/topics.ts
// The Algorytmy curriculum: 12 działy, ordered so that nothing depends on
// something later. This file is the reference supabase/seed/algorytmy/
// 01_topics.sql was authored from — same relationship as lib/matma/topics.ts
// to its seed, and the same rule: slugs here and in the seed must match, or
// the lesson build script (scripts/algorytmy-build-lessons.mjs) refuses to
// emit SQL.
//
// The order is a real prerequisite chain, not a taxonomy. Złożoność comes
// first because every later dział is judged by it; rekurencja before drzewa
// because a tree traversal IS a recursion; sortowanie before kopce because a
// heap is motivated by "sorting gave us O(n log n), can we get the minimum
// cheaper than that?".
// ============================================================================

export type AlgoCategory = "podstawy" | "struktury" | "algorytmy";

export interface AlgoTopicSeed {
  slug: string;
  title: string;
  description: string;
  category: AlgoCategory;
  orderIndex: number;
}

export const ALGO_CATEGORY_LABELS: Record<AlgoCategory, string> = {
  podstawy: "Podstawy",
  struktury: "Struktury danych",
  algorytmy: "Algorytmy",
};

export const ALGO_TOPICS: AlgoTopicSeed[] = [
  {
    slug: "zlozonosc-obliczeniowa",
    title: "Złożoność obliczeniowa",
    description:
      "Notacja O, koszt czasowy i pamięciowy, przypadek pesymistyczny i średni. Język, w którym mówi się o każdym kolejnym dziale.",
    category: "podstawy",
    orderIndex: 1,
  },
  {
    slug: "rekurencja",
    title: "Rekurencja",
    description:
      "Warunek bazowy, wywołanie rekurencyjne, stos wywołań i koszt pamięciowy. Dlaczego naiwne Fibonacciego jest wykładnicze.",
    category: "podstawy",
    orderIndex: 2,
  },
  {
    slug: "tablice-i-listy",
    title: "Tablice i listy",
    description:
      "Tablica o stałym dostępie kontra lista wiązana o tanim wstawianiu. Co naprawdę kosztuje indeksowanie, a co przepinanie wskaźników.",
    category: "struktury",
    orderIndex: 3,
  },
  {
    slug: "stos-i-kolejka",
    title: "Stos i kolejka",
    description:
      "LIFO i FIFO: dwie struktury, które nie dają dostępu swobodnego i właśnie dzięki temu są szybkie. Stos wywołań, cofanie, bufory.",
    category: "struktury",
    orderIndex: 4,
  },
  {
    slug: "wyszukiwanie",
    title: "Wyszukiwanie",
    description:
      "Przeszukiwanie liniowe i binarne. Skąd bierze się logarytm i dlaczego wyszukiwanie binarne wymaga posortowanych danych.",
    category: "algorytmy",
    orderIndex: 5,
  },
  {
    slug: "sortowanie-proste",
    title: "Sortowanie proste",
    description:
      "Bąbelkowe, przez wstawianie i przez wybór — trzy algorytmy O(n²), które różnią się tym, kiedy są dobrym wyborem.",
    category: "algorytmy",
    orderIndex: 6,
  },
  {
    slug: "sortowanie-szybkie",
    title: "Sortowanie w czasie n log n",
    description:
      "Sortowanie przez scalanie i szybkie. Dziel i zwyciężaj, wybór pivota, przypadek pesymistyczny quicksorta i granica O(n log n).",
    category: "algorytmy",
    orderIndex: 7,
  },
  {
    slug: "tablice-haszujace",
    title: "Tablice haszujące",
    description:
      "Funkcja haszująca, kolizje, adresowanie łańcuchowe i otwarte. Dlaczego słownik jest O(1) średnio, ale O(n) pesymistycznie.",
    category: "struktury",
    orderIndex: 8,
  },
  {
    slug: "drzewa-bst",
    title: "Drzewa i BST",
    description:
      "Drzewo binarne, przechodzenie pre/in/post-order, drzewo poszukiwań binarnych i to, co się psuje, gdy BST się zdegeneruje.",
    category: "struktury",
    orderIndex: 9,
  },
  {
    slug: "kopce",
    title: "Kopce i kolejki priorytetowe",
    description:
      "Kopiec binarny w tablicy, przesiewanie w górę i w dół, budowa kopca i sortowanie przez kopcowanie.",
    category: "struktury",
    orderIndex: 10,
  },
  {
    slug: "grafy",
    title: "Grafy",
    description:
      "Reprezentacje grafu, przeszukiwanie wszerz i w głąb, najkrótsza ścieżka w grafie nieważonym i algorytm Dijkstry.",
    category: "struktury",
    orderIndex: 11,
  },
  {
    slug: "programowanie-dynamiczne",
    title: "Programowanie dynamiczne i zachłanność",
    description:
      "Nakładające się podproblemy, spamiętywanie, budowa od dołu — i kiedy prostsze podejście zachłanne wystarcza, a kiedy zawodzi.",
    category: "algorytmy",
    orderIndex: 12,
  },
];

export function getTopicSeed(slug: string): AlgoTopicSeed | undefined {
  return ALGO_TOPICS.find((t) => t.slug === slug);
}
