// ============================================================================
// lib/matma/topics.ts
// Canonical list of the 11 CKE-rozszerzona departments seeded into
// math_topics (supabase/seed/matma/01_topics.sql) plus their exam_weight
// defaults. "Dowodzenie matematyczne" is intentionally NOT its own topic —
// per the product spec it's a cross-cutting skill flagged on individual
// problems via math_problems.is_proof, scattered across the topics below
// (induction proofs under ciagi, algebraic proofs under liczby-rzeczywiste
// and rownania-nierownosci, geometric proofs under planimetria, etc).
//
// exam_weight values are an editable ADMIN APPROXIMATION (see math_topics
// comment in 0007_matma.sql) based on the spread of topics across recent
// CKE arkusze — not an official CKE-published distribution, which does not
// exist. They sum to 1 but are re-tunable at any time from the admin panel.
// ============================================================================

export interface MathTopicSeed {
  slug: string;
  title: string;
  description: string;
  orderIndex: number;
  examWeight: number;
}

export const MATH_TOPICS: MathTopicSeed[] = [
  {
    slug: "liczby-rzeczywiste",
    title: "Liczby rzeczywiste i wyrażenia algebraiczne",
    description:
      "Potęgi, pierwiastki, logarytmy, wartość bezwzględna, wielomiany (dzielenie, tw. Bézouta, wzory Viète'a), wyrażenia wymierne.",
    orderIndex: 1,
    examWeight: 0.1,
  },
  {
    slug: "rownania-nierownosci",
    title: "Równania i nierówności",
    description:
      "Liniowe, kwadratowe, wielomianowe, wymierne, z wartością bezwzględną, z parametrem, układy równań.",
    orderIndex: 2,
    examWeight: 0.12,
  },
  {
    slug: "funkcje",
    title: "Funkcje",
    description:
      "Własności ogólne (dziedzina, monotoniczność, parzystość, złożenie, funkcja odwrotna) oraz funkcja liniowa, kwadratowa, wielomianowa, wymierna, wykładnicza, logarytmiczna, trygonometryczne.",
    orderIndex: 3,
    examWeight: 0.12,
  },
  {
    slug: "ciagi",
    title: "Ciągi liczbowe",
    description:
      "Ciąg arytmetyczny, geometryczny, rekurencyjny, granice ciągów, zastosowania finansowe (procent składany, kredyty, lokaty).",
    orderIndex: 4,
    examWeight: 0.08,
  },
  {
    slug: "trygonometria",
    title: "Trygonometria",
    description:
      "Tożsamości, równania i nierówności trygonometryczne, funkcje trygonometryczne kąta w trójkącie prostokątnym i dowolnym.",
    orderIndex: 5,
    examWeight: 0.08,
  },
  {
    slug: "planimetria",
    title: "Planimetria",
    description:
      "Twierdzenia o trójkątach, czworokątach, okręgach, podobieństwo figur, trygonometria w geometrii płaskiej.",
    orderIndex: 6,
    examWeight: 0.08,
  },
  {
    slug: "geometria-analityczna",
    title: "Geometria analityczna na płaszczyźnie",
    description:
      "Równanie prostej, okręgu, wzajemne położenie prostych/okręgów, symetrie, odległość punktu od prostej, pola figur w układzie współrzędnych.",
    orderIndex: 7,
    examWeight: 0.1,
  },
  {
    slug: "stereometria",
    title: "Stereometria",
    description:
      "Graniastosłupy, ostrosłupy, walec, stożek, kula, przekroje, kąty między prostymi/płaszczyznami, pola powierzchni i objętości.",
    orderIndex: 8,
    examWeight: 0.08,
  },
  {
    slug: "rachunek-rozniczkowy",
    title: "Rachunek różniczkowy",
    description:
      "Pochodna funkcji, interpretacja geometryczna (styczna), monotoniczność i ekstrema z pochodnej, zadania optymalizacyjne z kontekstem praktycznym.",
    orderIndex: 9,
    examWeight: 0.12,
  },
  {
    slug: "kombinatoryka-prawdopodobienstwo",
    title: "Kombinatoryka i rachunek prawdopodobieństwa",
    description:
      "Permutacje, kombinacje, wariacje (z powtórzeniami i bez), prawdopodobieństwo klasyczne i warunkowe, schemat Bernoulliego, prawdopodobieństwo całkowite, wartość oczekiwana.",
    orderIndex: 10,
    examWeight: 0.08,
  },
  {
    slug: "statystyka",
    title: "Elementy statystyki opisowej",
    description: "Średnia, mediana, odchylenie standardowe, wariancja.",
    orderIndex: 11,
    examWeight: 0.04,
  },
];

export const MATH_TOPIC_SLUGS = MATH_TOPICS.map((t) => t.slug);
