// ============================================================================
// lib/mindmath/techniques.ts
// Treść "Technik": klasyczne sposoby szybkiego liczenia w głowie (matematyka
// wedyjska z Indii, metody z Chin i Japonii, ogólne sztuczki). Każda technika
// ma przykład rozpisany krok po kroku i tryb treningu z lib/mindmath/problems.ts.
// Wyniki przykładów sprawdzone — zob. komentarze "=".
// ============================================================================
export interface Technique {
  slug: string;
  title: string;
  /** Skąd pochodzi / z jakiej tradycji. */
  origin: string;
  /** Tryb treningu z problems.ts (null = brak dedykowanego generatora). */
  mode: string | null;
  summary: string;
  steps: string[];
  example: { problem: string; walkthrough: string[] };
  tip?: string;
}

export const TECHNIQUES: Technique[] = [
  {
    slug: "razy-11",
    title: "Mnożenie przez 11",
    origin: "Sztuczka znana m.in. z matematyki wedyjskiej",
    mode: "times11",
    summary: "Rozsuń cyfry liczby i wpisz między nie ich sumę.",
    steps: [
      "Zapisz pierwszą i ostatnią cyfrę liczby — to skrajne cyfry wyniku.",
      "Środkowa cyfra to suma sąsiednich cyfr.",
      "Jeśli suma ma dwie cyfry, przenieś dziesiątkę w lewo (dodaj ją do poprzedniej cyfry).",
    ],
    example: {
      problem: "78 × 11",
      walkthrough: ["Skrajne cyfry: 7 i 8.", "Środek: 7 + 8 = 15 → piszemy 5, przenosimy 1.", "7 + 1 = 8, potem 5, potem 8 → 858."],
    },
    tip: "Dla liczb trzycyfrowych robisz to samo parami: abc × 11 = a, a+b, b+c, c (z przeniesieniami).",
  },
  {
    slug: "kwadraty-na-5",
    title: "Kwadraty liczb kończących się na 5",
    origin: "Ekadhikena Purvena — sutra wedyjska („o jeden więcej niż poprzednia”)",
    mode: "square5",
    summary: "Pomnóż liczbę dziesiątek przez następną liczbę i dopisz 25.",
    steps: [
      "Odetnij końcowe 5; zostaje liczba n (dziesiątki).",
      "Policz n × (n + 1).",
      "Dopisz na końcu 25.",
    ],
    example: {
      problem: "85²",
      walkthrough: ["n = 8, więc 8 × 9 = 72.", "Dopisujemy 25 → 7225."],
    },
    tip: "Działa też dla większych: 145² → 14 × 15 = 210 → 21025.",
  },
  {
    slug: "blisko-100",
    title: "Mnożenie liczb bliskich 100",
    origin: "Nikhilam Navatashcaramam Dashatah — sutra wedyjska („wszystkie od 9, ostatnia od 10”)",
    mode: "near100",
    summary: "Licz braki do 100, a nie same liczby: wynik składa się z dwóch prostych części.",
    steps: [
      "Dla każdej liczby policz brak do 100 (np. 97 → 3).",
      "Lewa część wyniku: jedna liczba minus brak drugiej (97 − 6).",
      "Prawa część: iloczyn braków, zapisany na dwóch cyfrach (3 × 6 = 18).",
      "Połącz obie części.",
    ],
    example: {
      problem: "97 × 94",
      walkthrough: ["Braki: 3 i 6.", "Lewa część: 97 − 6 = 91.", "Prawa część: 3 × 6 = 18.", "Wynik: 9118."],
    },
    tip: "Dla liczb powyżej 100 działa tak samo, tylko z nadwyżkami: 104 × 107 → 111 | 28 → 11128.",
  },
  {
    slug: "od-9-i-od-10",
    title: "Odejmowanie od 100, 1000…",
    origin: "Nikhilam — sutra wedyjska („wszystkie od 9, ostatnia od 10”)",
    mode: "from9",
    summary: "Odejmując od potęgi dziesięciu, uzupełniaj każdą cyfrę do 9, a ostatnią do 10.",
    steps: [
      "Każdą cyfrę odejmowanej liczby uzupełnij do 9.",
      "Ostatnią cyfrę uzupełnij do 10.",
      "Zapisz wyniki obok siebie — to różnica.",
    ],
    example: {
      problem: "1000 − 357",
      walkthrough: ["9 − 3 = 6, 9 − 5 = 4.", "Ostatnia: 10 − 7 = 3.", "Wynik: 643."],
    },
    tip: "Jeśli liczba kończy się zerami, zera zostają, a „od 10” stosujesz do ostatniej cyfry różnej od zera.",
  },
  {
    slug: "pionowo-i-na-krzyz",
    title: "Pionowo i na krzyż",
    origin: "Urdhva-Tiryagbhyam — sutra wedyjska („pionowo i na krzyż”)",
    mode: "vertcross",
    summary: "Dwucyfrowe × dwucyfrowe w trzech prostych krokach, od lewej do prawej, bez zapisywania.",
    steps: [
      "Pomnóż cyfry dziesiątek (to setki wyniku).",
      "Pomnóż na krzyż i dodaj: dziesiątki pierwszej × jedności drugiej + jedności pierwszej × dziesiątki drugiej.",
      "Pomnóż cyfry jedności.",
      "Złóż: pierwsza część × 100 + druga × 10 + trzecia.",
    ],
    example: {
      problem: "23 × 14",
      walkthrough: ["2 × 1 = 2.", "Na krzyż: 2 × 4 + 3 × 1 = 11.", "3 × 4 = 12.", "200 + 110 + 12 = 322."],
    },
    tip: "Ćwicz najpierw na liczbach do 30, potem poszerzaj zakres.",
  },
  {
    slug: "roznica-kwadratow",
    title: "Różnica kwadratów",
    origin: "Wzór algebraiczny (a − b)(a + b) = a² − b², popularny w rachunku w głowie",
    mode: "diffsq",
    summary: "Gdy dwie liczby leżą symetrycznie wokół „okrągłej”, pomnóż ją przez siebie i odejmij kwadrat odległości.",
    steps: [
      "Znajdź liczbę środkową (np. 50 dla 47 i 53).",
      "Policz jej kwadrat.",
      "Odejmij kwadrat odległości od środka.",
    ],
    example: {
      problem: "47 × 53",
      walkthrough: ["Środek: 50, odległość: 3.", "50² = 2500.", "2500 − 3² = 2491."],
    },
    tip: "Rozpoznawanie par symetrycznych to połowa sukcesu: 38 × 42, 66 × 74, 96 × 104…",
  },
  {
    slug: "razy-5-25-125",
    title: "Mnożenie przez 5, 25 i 125",
    origin: "Ogólna sztuczka: mnożenie przez 10, 100, 1000 i dzielenie",
    mode: "times5",
    summary: "5 = 10 ÷ 2, 25 = 100 ÷ 4, 125 = 1000 ÷ 8 — dziel, a potem dopisz zera.",
    steps: [
      "× 5: podziel liczbę przez 2 i pomnóż przez 10.",
      "× 25: podziel przez 4 i pomnóż przez 100.",
      "× 125: podziel przez 8 i pomnóż przez 1000.",
    ],
    example: {
      problem: "48 × 25",
      walkthrough: ["48 ÷ 4 = 12.", "12 × 100 = 1200."],
    },
    tip: "Gdy dzielenie nie wychodzi równo, zostaw ułamek: 7 × 5 = 35, bo 7 ÷ 2 = 3,5 → 35.",
  },
  {
    slug: "razy-9-i-99",
    title: "Mnożenie przez 9 i 99",
    origin: "Ogólna sztuczka „razy 10 minus liczba”",
    mode: "times9",
    summary: "× 9 to × 10 − liczba, a × 99 to × 100 − liczba.",
    steps: [
      "× 9: dopisz zero i odejmij liczbę.",
      "× 99: dopisz dwa zera i odejmij liczbę.",
    ],
    example: {
      problem: "47 × 99",
      walkthrough: ["4700 − 47.", "4700 − 47 = 4653."],
    },
    tip: "Do odejmowania użyj techniki „od 9 i od 10”.",
  },
  {
    slug: "palce-6-9",
    title: "Tabliczka mnożenia 6–9 na palcach",
    origin: "Metoda ludowa znana w wielu krajach",
    mode: "fingers",
    summary: "Każda ręka pokazuje, o ile liczba przekracza 5: wyprostowane palce to dziesiątki, zgięte to jedności.",
    steps: [
      "Dla każdej liczby wyprostuj tyle palców, o ile przekracza 5 (7 → 2 palce).",
      "Wyprostowane palce obu rąk dodaj i pomnóż przez 10.",
      "Zgięte palce każdej ręki pomnóż przez siebie.",
      "Dodaj oba wyniki.",
    ],
    example: {
      problem: "7 × 8",
      walkthrough: ["7 → 2 wyprostowane (3 zgięte), 8 → 3 wyprostowane (2 zgięte).", "(2 + 3) × 10 = 50.", "3 × 2 = 6.", "50 + 6 = 56."],
    },
  },
  {
    slug: "dopelnianie-do-10",
    title: "Dopełnianie do 10 (styl abakusa)",
    origin: "Chiński liczydłowy suanpan i japoński soroban; mentalny wariant to anzan",
    mode: "chain",
    summary: "Grupuj liczby tak, by tworzyły dziesiątki — tak jak ruchy koralików na liczydle.",
    steps: [
      "Szukaj par dających 10 (7 + 3, 6 + 4, 8 + 2).",
      "Liczby ułóż w pamięci jak koraliki: dziesiątki zapamiętuj osobno od jedności.",
      "Dodawaj od lewej do prawej, trzymając w głowie tylko bieżącą sumę.",
    ],
    example: {
      problem: "7 + 6 + 3 + 4 + 8",
      walkthrough: ["7 + 3 = 10, 6 + 4 = 10.", "10 + 10 + 8 = 28."],
    },
    tip: "Trening anzan polega na wyobrażaniu sobie liczydła i „przesuwaniu” koralików palcami w powietrzu.",
  },
  {
    slug: "pierwiastek-cyfrowy",
    title: "Suma cyfr i sprawdzanie przez 9",
    origin: "Indyjska metoda sprawdzania wyników („beejank”), znana też jako odrzucanie dziewiątek",
    mode: "digitsum",
    summary: "Liczba daje tę samą resztę z dzielenia przez 9 co suma jej cyfr — to szybka kontrola wyniku.",
    steps: [
      "Dodawaj cyfry liczby, aż zostanie jedna cyfra (wynik 9 oznacza resztę 0 z dzielenia przez 9).",
      "Zrób to samo dla składników działania.",
      "Wykonaj działanie na tych małych liczbach i porównaj z sumą cyfr wyniku.",
    ],
    example: {
      problem: "23 × 14 = 322",
      walkthrough: ["23 → 2 + 3 = 5, 14 → 1 + 4 = 5.", "5 × 5 = 25 → 2 + 5 = 7.", "322 → 3 + 2 + 2 = 7. Zgadza się."],
    },
    tip: "Zgodność nie gwarantuje, że wynik jest dobry, ale niezgodność zawsze oznacza błąd.",
  },
];

export function getTechnique(slug: string): Technique | undefined {
  return TECHNIQUES.find((t) => t.slug === slug);
}
