-- ============================================================================
-- supabase/seed/matma/03_problems_funkcje.sql
-- Problem bank (math_problems, source = 'topic') for the "funkcje" department:
-- Funkcje — własności ogólne oraz funkcja liniowa, kwadratowa, wielomianowa,
-- wymierna, wykładnicza, logarytmiczna, trygonometryczne. 18 problems,
-- difficulty distributed gently (8 x difficulty=1, 6 x difficulty=2,
-- 4 x difficulty=3, including 2 proof problems).
--
-- content: { statement, acceptedAnswers? } (see MathProblemContent).
-- grading_criteria: [{ step, points, description }], points sum to
-- points_max exactly for every problem (verified at authoring time).
--
-- Idempotent: deletes existing source='topic' rows for this topic first
-- (past_exam/curated/ai_generated rows belong to a different pipeline and
-- are intentionally left untouched). Run 01_topics.sql BEFORE this file.
-- ============================================================================

delete from math_problems
where topic_id = (select id from math_topics where slug = 'funkcje')
  and source = 'topic';

-- Problem 1 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'funkcje'),
  $c1${
  "statement": "Podaj dziedzinę funkcji $f(x)=\\dfrac{3}{x-7}$.",
  "acceptedAnswers": [
    "x\\neq7",
    "x != 7"
  ]
}$c1$::jsonb,
  1,
  false,
  1,
  'topic',
  $g1$[
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne podanie dziedziny: $x\\neq7$."
  }
]$g1$::jsonb
);

-- Problem 2 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'funkcje'),
  $c2${
  "statement": "Podaj dziedzinę funkcji $f(x)=\\sqrt{x-5}$.",
  "acceptedAnswers": [
    "x\\ge5",
    "x >= 5",
    "D_f=[5,\\infty)"
  ]
}$c2$::jsonb,
  1,
  false,
  1,
  'topic',
  $g2$[
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne podanie dziedziny: $x\\ge5$, czyli $D_f=[5,\\infty)$."
  }
]$g2$::jsonb
);

-- Problem 3 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'funkcje'),
  $c3${
  "statement": "Dla funkcji $f(x)=3x-2$ oblicz $f(4)$.",
  "acceptedAnswers": [
    "10"
  ]
}$c3$::jsonb,
  1,
  false,
  1,
  'topic',
  $g3$[
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne obliczenie: $f(4)=3\\cdot4-2=10$."
  }
]$g3$::jsonb
);

-- Problem 4 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'funkcje'),
  $c4${
  "statement": "Wyznacz miejsce zerowe funkcji liniowej $f(x)=2x-8$.",
  "acceptedAnswers": [
    "x=4",
    "4"
  ]
}$c4$::jsonb,
  1,
  false,
  1,
  'topic',
  $g4$[
  {
    "step": "Wynik",
    "points": 1,
    "description": "Rozwiązanie równania $2x-8=0$ i podanie wyniku: $x=4$."
  }
]$g4$::jsonb
);

-- Problem 5 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'funkcje'),
  $c5${
  "statement": "Czy funkcja $f(x)=x^2$ (dla $x\\in\\mathbb{R}$) jest parzysta, nieparzysta, czy żadna z nich?",
  "acceptedAnswers": [
    "parzysta"
  ]
}$c5$::jsonb,
  1,
  false,
  2,
  'topic',
  $g5$[
  {
    "step": "Obliczenie $f(-x)$",
    "points": 1,
    "description": "Poprawne obliczenie $f(-x)=(-x)^2=x^2$."
  },
  {
    "step": "Wniosek",
    "points": 1,
    "description": "Stwierdzenie, że $f(-x)=f(x)$, więc funkcja jest parzysta."
  }
]$g5$::jsonb
);

-- Problem 6 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'funkcje'),
  $c6${
  "statement": "Podaj okres podstawowy funkcji $f(x)=\\sin x$.",
  "acceptedAnswers": [
    "2\\pi",
    "2pi",
    "T=2\\pi"
  ]
}$c6$::jsonb,
  1,
  false,
  1,
  'topic',
  $g6$[
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne podanie okresu podstawowego: $T=2\\pi$."
  }
]$g6$::jsonb
);

-- Problem 7 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'funkcje'),
  $c7${
  "statement": "Oblicz wartość funkcji $f(x)=2^x$ dla $x=3$.",
  "acceptedAnswers": [
    "8"
  ]
}$c7$::jsonb,
  1,
  false,
  1,
  'topic',
  $g7$[
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne obliczenie: $f(3)=2^3=8$."
  }
]$g7$::jsonb
);

-- Problem 8 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'funkcje'),
  $c8${
  "statement": "Podaj zbiór wartości funkcji $f(x)=x^2+1$ (dla $x\\in\\mathbb{R}$).",
  "acceptedAnswers": [
    "[1,\\infty)",
    "y>=1"
  ]
}$c8$::jsonb,
  1,
  false,
  2,
  'topic',
  $g8$[
  {
    "step": "Uzasadnienie minimum",
    "points": 1,
    "description": "Zauważenie, że najmniejsza wartość $x^2$ to $0$ (dla $x=0$), więc minimum funkcji wynosi $1$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne podanie zbioru wartości: $[1,\\infty)$."
  }
]$g8$::jsonb
);

-- Problem 9 (difficulty=2, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'funkcje'),
  $c9${
  "statement": "Wyznacz dziedzinę funkcji $f(x)=\\dfrac{1}{x^2-25}$.",
  "acceptedAnswers": [
    "x\\neq-5 \\land x\\neq5",
    "x != -5 i x != 5",
    "x\\neq\\pm5"
  ]
}$c9$::jsonb,
  2,
  false,
  2,
  'topic',
  $g9$[
  {
    "step": "Rozkład mianownika",
    "points": 1,
    "description": "Rozłożenie mianownika na czynniki: $x^2-25=(x-5)(x+5)$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne podanie dziedziny: $x\\neq-5$ i $x\\neq5$."
  }
]$g9$::jsonb
);

-- Problem 10 (difficulty=2, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'funkcje'),
  $c10${
  "statement": "Dla $f(x)=2x+1$ i $g(x)=x-3$, oblicz wzór $(f\\circ g)(x)$.",
  "acceptedAnswers": [
    "2x-5",
    "f(g(x))=2x-5"
  ]
}$c10$::jsonb,
  2,
  false,
  2,
  'topic',
  $g10$[
  {
    "step": "Podstawienie",
    "points": 1,
    "description": "Zapisanie $(f\\circ g)(x)=f(x-3)$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne uproszczenie: $f(x-3)=2(x-3)+1=2x-5$."
  }
]$g10$::jsonb
);

-- Problem 11 (difficulty=2, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'funkcje'),
  $c11${
  "statement": "Wyznacz wzór funkcji odwrotnej do funkcji $f(x)=\\dfrac{x-4}{3}$.",
  "acceptedAnswers": [
    "f^{-1}(x)=3x+4",
    "y=3x+4"
  ]
}$c11$::jsonb,
  2,
  false,
  2,
  'topic',
  $g11$[
  {
    "step": "Zamiana zmiennych",
    "points": 1,
    "description": "Zapisanie $x=\\dfrac{y-4}{3}$ po zamianie miejscami $x$ i $y$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne wyznaczenie: $f^{-1}(x)=3x+4$."
  }
]$g11$::jsonb
);

-- Problem 12 (difficulty=2, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'funkcje'),
  $c12${
  "statement": "Zbadaj monotoniczność funkcji liniowej $f(x)=-\\dfrac{1}{2}x+6$ — podaj, czy jest rosnąca, malejąca, czy stała.",
  "acceptedAnswers": [
    "malejąca"
  ]
}$c12$::jsonb,
  2,
  false,
  2,
  'topic',
  $g12$[
  {
    "step": "Wskazanie współczynnika",
    "points": 1,
    "description": "Wskazanie współczynnika kierunkowego $a=-\\frac12$."
  },
  {
    "step": "Wniosek",
    "points": 1,
    "description": "Stwierdzenie, że skoro $a<0$, funkcja jest malejąca w całej dziedzinie."
  }
]$g12$::jsonb
);

-- Problem 13 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'funkcje'),
  $c13${
  "statement": "Sprawdź, czy funkcja $f(x)=x^3-x$ jest parzysta, nieparzysta, czy żadna z nich.",
  "acceptedAnswers": [
    "nieparzysta"
  ]
}$c13$::jsonb,
  2,
  false,
  3,
  'topic',
  $g13$[
  {
    "step": "Obliczenie $f(-x)$",
    "points": 1,
    "description": "Obliczenie $f(-x)=(-x)^3-(-x)=-x^3+x$."
  },
  {
    "step": "Porównanie",
    "points": 1,
    "description": "Zauważenie, że $f(-x)=-(x^3-x)=-f(x)$."
  },
  {
    "step": "Wniosek",
    "points": 1,
    "description": "Stwierdzenie, że funkcja jest nieparzysta."
  }
]$g13$::jsonb
);

-- Problem 14 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'funkcje'),
  $c14${
  "statement": "Funkcja kwadratowa dana jest wzorem $f(x)=x^2-6x+8$. Wyznacz współrzędne jej wierzchołka.",
  "acceptedAnswers": [
    "(3,-1)",
    "p=3, q=-1"
  ]
}$c14$::jsonb,
  2,
  false,
  3,
  'topic',
  $g14$[
  {
    "step": "Odcięta wierzchołka",
    "points": 1,
    "description": "Poprawne obliczenie $p=-\\dfrac{b}{2a}=3$."
  },
  {
    "step": "Rzędna wierzchołka",
    "points": 1,
    "description": "Poprawne obliczenie $q=f(3)=9-18+8=-1$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Podanie współrzędnych wierzchołka: $(3,-1)$."
  }
]$g14$::jsonb
);

-- Problem 15 (difficulty=3, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'funkcje'),
  $c15${
  "statement": "Dla funkcji $f(x)=\\sqrt{2x+6}$ wyznacz dziedzinę oraz zbiór wartości.",
  "acceptedAnswers": [
    "D_f=[-3,\\infty), ZW_f=[0,\\infty)",
    "x>=-3, y>=0"
  ]
}$c15$::jsonb,
  3,
  false,
  4,
  'topic',
  $g15$[
  {
    "step": "Warunek na wyrażenie pod pierwiastkiem",
    "points": 1,
    "description": "Zapisanie warunku $2x+6\\ge0$."
  },
  {
    "step": "Dziedzina",
    "points": 1,
    "description": "Poprawne rozwiązanie warunku: $x\\ge-3$, czyli $D_f=[-3,\\infty)$."
  },
  {
    "step": "Analiza zbioru wartości",
    "points": 1,
    "description": "Zauważenie, że pierwiastek arytmetyczny przyjmuje wszystkie wartości nieujemne, gdy wyrażenie pod nim przebiega cały przedział $[0,\\infty)$."
  },
  {
    "step": "Zbiór wartości",
    "points": 1,
    "description": "Poprawne podanie zbioru wartości: $ZW_f=[0,\\infty)$."
  }
]$g15$::jsonb
);

-- Problem 16 (difficulty=3, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'funkcje'),
  $c16${
  "statement": "Dla funkcji $f(x)=x^2-4$ oraz $g(x)=x+1$ wyznacz wzór funkcji $(g\\circ f)(x)$ oraz oblicz $(g\\circ f)(3)$.",
  "acceptedAnswers": [
    "(g\\circ f)(x)=x^2-3, (g\\circ f)(3)=6",
    "x^2-3 i 6"
  ]
}$c16$::jsonb,
  3,
  false,
  4,
  'topic',
  $g16$[
  {
    "step": "Wzór złożenia",
    "points": 2,
    "description": "Poprawne wyznaczenie wzoru: $(g\\circ f)(x)=g(x^2-4)=(x^2-4)+1=x^2-3$."
  },
  {
    "step": "Obliczenie wartości",
    "points": 2,
    "description": "Poprawne obliczenie $(g\\circ f)(3)=3^2-3=6$."
  }
]$g16$::jsonb
);

-- Problem 17 (difficulty=3, points_max=3, is_proof=true)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'funkcje'),
  $c17${
  "statement": "Wykaż, że suma dwóch funkcji nieparzystych określonych na tym samym zbiorze symetrycznym względem zera jest funkcją nieparzystą."
}$c17$::jsonb,
  3,
  true,
  3,
  'topic',
  $g17$[
  {
    "step": "Założenie",
    "points": 1,
    "description": "Przyjęcie, że $f$ i $g$ są nieparzyste (czyli $f(-x)=-f(x)$ oraz $g(-x)=-g(x)$ dla każdego $x$ z dziedziny) i zdefiniowanie funkcji $h(x)=f(x)+g(x)$."
  },
  {
    "step": "Obliczenie $h(-x)$",
    "points": 1,
    "description": "Obliczenie $h(-x)=f(-x)+g(-x)=-f(x)-g(x)$."
  },
  {
    "step": "Wniosek końcowy",
    "points": 1,
    "description": "Zauważenie, że $-f(x)-g(x)=-(f(x)+g(x))=-h(x)$, a więc $h(-x)=-h(x)$, co dowodzi, że $h$ jest funkcją nieparzystą."
  }
]$g17$::jsonb
);

-- Problem 18 (difficulty=3, points_max=4, is_proof=true)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'funkcje'),
  $c18${
  "statement": "Funkcja $f$ określona na zbiorze $\\mathbb{R}$ jest rosnąca i funkcja $g$ określona na zbiorze $\\mathbb{R}$ jest również rosnąca. Wykaż, że złożenie $f\\circ g$ jest funkcją rosnącą."
}$c18$::jsonb,
  3,
  true,
  4,
  'topic',
  $g18$[
  {
    "step": "Założenie",
    "points": 1,
    "description": "Przyjęcie dowolnych $x_1<x_2$ z dziedziny złożenia $f\\circ g$."
  },
  {
    "step": "Zastosowanie monotoniczności $g$",
    "points": 1,
    "description": "Wykorzystanie, że $g$ jest rosnąca: skoro $x_1<x_2$, to $g(x_1)<g(x_2)$."
  },
  {
    "step": "Zastosowanie monotoniczności $f$",
    "points": 1,
    "description": "Wykorzystanie, że $f$ jest rosnąca: skoro $g(x_1)<g(x_2)$, to $f(g(x_1))<f(g(x_2))$."
  },
  {
    "step": "Wniosek końcowy",
    "points": 1,
    "description": "Stwierdzenie, że $(f\\circ g)(x_1)<(f\\circ g)(x_2)$ dla dowolnych $x_1<x_2$, co oznacza, że $f\\circ g$ jest rosnąca — co kończy dowód."
  }
]$g18$::jsonb
);
