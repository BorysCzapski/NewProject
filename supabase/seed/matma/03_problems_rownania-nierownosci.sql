-- ============================================================================
-- supabase/seed/matma/03_problems_rownania-nierownosci.sql
-- Problem bank (math_problems, source = 'topic') for the "rownania-nierownosci" department:
-- Rownania i nierownosci. 20 problems, difficulty distributed
-- gently (9 x difficulty=1, 7 x difficulty=2, 4 x difficulty=3,
-- including 2 proof problems).
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
where topic_id = (select id from math_topics where slug = 'rownania-nierownosci')
  and source = 'topic';

-- Problem 1 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $c1${
  "statement": "Rozwiąż równanie liniowe $3x+5=20$.",
  "acceptedAnswers": [
    "x=5"
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
    "description": "Poprawne rozwiązanie równania: $x=5$."
  }
]$g1$::jsonb
);

-- Problem 2 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $c2${
  "statement": "Rozwiąż nierówność $2x-4\\le 10$ i zapisz zbiór rozwiązań.",
  "acceptedAnswers": [
    "x<=7",
    "x <= 7"
  ]
}$c2$::jsonb,
  1,
  false,
  2,
  'topic',
  $g2$[
  {
    "step": "Przekształcenie nierówności",
    "points": 1,
    "description": "Poprawne przekształcenie do postaci $x\\le 7$."
  },
  {
    "step": "Zapis zbioru rozwiązań",
    "points": 1,
    "description": "Poprawny zapis zbioru rozwiązań: $x\\le 7$."
  }
]$g2$::jsonb
);

-- Problem 3 (difficulty=1, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $c3${
  "statement": "Rozwiąż równanie kwadratowe $x^2-5x+6=0$.",
  "acceptedAnswers": [
    "x=2 lub x=3",
    "x=3 lub x=2"
  ]
}$c3$::jsonb,
  1,
  false,
  3,
  'topic',
  $g3$[
  {
    "step": "Obliczenie wyróżnika",
    "points": 1,
    "description": "Poprawne obliczenie $\\Delta=1$."
  },
  {
    "step": "Wyznaczenie pierwiastków",
    "points": 1,
    "description": "Poprawne wyznaczenie $x_1=2$ i $x_2=3$."
  },
  {
    "step": "Zapis zbioru rozwiązań",
    "points": 1,
    "description": "Poprawny zapis zbioru rozwiązań $\\{2,3\\}$."
  }
]$g3$::jsonb
);

-- Problem 4 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $c4${
  "statement": "Rozwiąż równanie $\\dfrac{x}{3}+1=\\dfrac{x}{2}$.",
  "acceptedAnswers": [
    "x=6"
  ]
}$c4$::jsonb,
  1,
  false,
  2,
  'topic',
  $g4$[
  {
    "step": "Pozbycie się ułamków",
    "points": 1,
    "description": "Poprawne sprowadzenie do wspólnego mianownika i pozbycie się ułamków: $2x+6=3x$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawny wynik: $x=6$."
  }
]$g4$::jsonb
);

-- Problem 5 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $c5${
  "statement": "Rozwiąż nierówność $-3x+6>0$ (pamiętaj o zmianie znaku przy dzieleniu przez liczbę ujemną).",
  "acceptedAnswers": [
    "x<2"
  ]
}$c5$::jsonb,
  1,
  false,
  2,
  'topic',
  $g5$[
  {
    "step": "Przekształcenie ze zmianą znaku",
    "points": 1,
    "description": "Poprawne przekształcenie nierówności ze zmianą znaku przy dzieleniu przez liczbę ujemną."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawny wynik: $x<2$."
  }
]$g5$::jsonb
);

-- Problem 6 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $c6${
  "statement": "Rozwiąż równanie z wartością bezwzględną $|x-3|=5$.",
  "acceptedAnswers": [
    "x=-2 lub x=8",
    "x=8 lub x=-2"
  ]
}$c6$::jsonb,
  1,
  false,
  2,
  'topic',
  $g6$[
  {
    "step": "Rozpisanie na przypadki",
    "points": 1,
    "description": "Poprawne rozpisanie równania na dwa przypadki: $x-3=5$ lub $x-3=-5$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne wyznaczenie obu rozwiązań: $x=-2$ i $x=8$."
  }
]$g6$::jsonb
);

-- Problem 7 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $c7${
  "statement": "Rozwiąż układ równań $\\begin{cases}x+y=7\\\\x-y=1\\end{cases}$.",
  "acceptedAnswers": [
    "x=4 i y=3",
    "x=4, y=3"
  ]
}$c7$::jsonb,
  1,
  false,
  2,
  'topic',
  $g7$[
  {
    "step": "Dodanie równań",
    "points": 1,
    "description": "Poprawne dodanie równań stronami i wyznaczenie $x=4$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne wyznaczenie $y=3$ i podanie pełnego wyniku."
  }
]$g7$::jsonb
);

-- Problem 8 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $c8${
  "statement": "Rozwiąż równanie kwadratowe niezupełne $x^2-9=0$ metodą rozkładu na czynniki.",
  "acceptedAnswers": [
    "x=-3 lub x=3",
    "x=3 lub x=-3"
  ]
}$c8$::jsonb,
  1,
  false,
  2,
  'topic',
  $g8$[
  {
    "step": "Rozkład na czynniki",
    "points": 1,
    "description": "Poprawny rozkład: $(x-3)(x+3)=0$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne wyznaczenie obu pierwiastków: $x=-3$ i $x=3$."
  }
]$g8$::jsonb
);

-- Problem 9 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $c9${
  "statement": "Rozwiąż nierówność z wartością bezwzględną $|x|\\le 4$ i zapisz zbiór rozwiązań.",
  "acceptedAnswers": [
    "-4<=x<=4",
    "x>=-4 i x<=4"
  ]
}$c9$::jsonb,
  1,
  false,
  2,
  'topic',
  $g9$[
  {
    "step": "Rozpisanie warunku",
    "points": 1,
    "description": "Poprawne rozpisanie warunku $-4\\le x\\le 4$."
  },
  {
    "step": "Zapis zbioru rozwiązań",
    "points": 1,
    "description": "Poprawny zapis zbioru rozwiązań: $x\\in[-4,4]$."
  }
]$g9$::jsonb
);

-- Problem 10 (difficulty=2, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $c10${
  "statement": "Rozwiąż nierówność kwadratową $x^2-5x+6\\le 0$ i zapisz zbiór rozwiązań w postaci przedziału.",
  "acceptedAnswers": [
    "2<=x<=3"
  ]
}$c10$::jsonb,
  2,
  false,
  2,
  'topic',
  $g10$[
  {
    "step": "Wyznaczenie miejsc zerowych",
    "points": 1,
    "description": "Poprawne wyznaczenie miejsc zerowych: $x=2$ i $x=3$."
  },
  {
    "step": "Zapis zbioru rozwiązań",
    "points": 1,
    "description": "Poprawny zapis zbioru rozwiązań z uwzględnieniem znaku paraboli: $x\\in[2,3]$."
  }
]$g10$::jsonb
);

-- Problem 11 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $c11${
  "statement": "Rozwiąż równanie wymierne $\\dfrac{2}{x-1}=3$, pamiętając o wyznaczeniu dziedziny.",
  "acceptedAnswers": [
    "x=5/3"
  ]
}$c11$::jsonb,
  2,
  false,
  3,
  'topic',
  $g11$[
  {
    "step": "Dziedzina",
    "points": 1,
    "description": "Poprawne wyznaczenie dziedziny: $x\\neq 1$."
  },
  {
    "step": "Przekształcenie",
    "points": 1,
    "description": "Poprawne przekształcenie równania do postaci $2=3(x-1)$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawny wynik należący do dziedziny: $x=\\dfrac{5}{3}$."
  }
]$g11$::jsonb
);

-- Problem 12 (difficulty=2, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $c12${
  "statement": "Rozwiąż nierówność wymierną $\\dfrac{x-2}{x+1}\\ge 0$.",
  "acceptedAnswers": [
    "x<-1 lub x>=2"
  ]
}$c12$::jsonb,
  2,
  false,
  4,
  'topic',
  $g12$[
  {
    "step": "Dziedzina",
    "points": 1,
    "description": "Poprawne wyznaczenie dziedziny: $x\\neq -1$."
  },
  {
    "step": "Miejsca zerowe",
    "points": 1,
    "description": "Poprawne wyznaczenie miejsc zerowych licznika i mianownika: $x=2$, $x=-1$."
  },
  {
    "step": "Siatka znaków",
    "points": 1,
    "description": "Poprawna analiza znaku wyrażenia metodą siatki znaków na wszystkich przedziałach."
  },
  {
    "step": "Zapis zbioru rozwiązań",
    "points": 1,
    "description": "Poprawny zapis zbioru rozwiązań z uwzględnieniem dziedziny: $x\\in(-\\infty,-1)\\cup[2,\\infty)$."
  }
]$g12$::jsonb
);

-- Problem 13 (difficulty=2, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $c13${
  "statement": "Rozwiąż równanie z wartością bezwzględną $|2x-1|=x+4$.",
  "acceptedAnswers": [
    "x=-1 lub x=5",
    "x=5 lub x=-1"
  ]
}$c13$::jsonb,
  2,
  false,
  4,
  'topic',
  $g13$[
  {
    "step": "Warunek na prawą stronę",
    "points": 1,
    "description": "Zapisanie warunku $x+4\\ge 0$."
  },
  {
    "step": "Przypadki",
    "points": 1,
    "description": "Poprawne rozpisanie równania na dwa przypadki i rozwiązanie każdego z nich."
  },
  {
    "step": "Weryfikacja",
    "points": 1,
    "description": "Sprawdzenie obu otrzymanych rozwiązań w równaniu wyjściowym."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawny wynik: $x=-1$ oraz $x=5$."
  }
]$g13$::jsonb
);

-- Problem 14 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $c14${
  "statement": "Dla jakich wartości parametru $m$ równanie $x^2-4x+m=0$ ma dwa różne rozwiązania rzeczywiste?",
  "acceptedAnswers": [
    "m<4"
  ]
}$c14$::jsonb,
  2,
  false,
  3,
  'topic',
  $g14$[
  {
    "step": "Wyróżnik",
    "points": 1,
    "description": "Poprawne obliczenie wyróżnika: $\\Delta=16-4m$."
  },
  {
    "step": "Warunek",
    "points": 1,
    "description": "Zapisanie warunku $\\Delta>0$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne rozwiązanie nierówności: $m<4$."
  }
]$g14$::jsonb
);

-- Problem 15 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $c15${
  "statement": "Rozwiąż układ równań $\\begin{cases}2x+3y=12\\\\x-y=1\\end{cases}$.",
  "acceptedAnswers": [
    "x=3 i y=2",
    "x=3, y=2"
  ]
}$c15$::jsonb,
  2,
  false,
  3,
  'topic',
  $g15$[
  {
    "step": "Wyznaczenie jednej niewiadomej",
    "points": 1,
    "description": "Wyznaczenie z drugiego równania: $x=y+1$."
  },
  {
    "step": "Podstawienie",
    "points": 1,
    "description": "Podstawienie i rozwiązanie ze względu na $y$: $y=2$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawny pełny wynik: $x=3$, $y=2$."
  }
]$g15$::jsonb
);

-- Problem 16 (difficulty=2, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $c16${
  "statement": "Rozwiąż równanie dwukwadratowe $x^4-5x^2+4=0$.",
  "acceptedAnswers": [
    "x=-2 lub x=-1 lub x=1 lub x=2"
  ]
}$c16$::jsonb,
  2,
  false,
  4,
  'topic',
  $g16$[
  {
    "step": "Podstawienie",
    "points": 1,
    "description": "Podstawienie $t=x^2$ i sprowadzenie do równania kwadratowego względem $t$."
  },
  {
    "step": "Rozwiązanie względem t",
    "points": 1,
    "description": "Poprawne rozwiązanie: $t=1$ lub $t=4$."
  },
  {
    "step": "Powrót do x",
    "points": 1,
    "description": "Poprawny powrót do zmiennej $x$ dla obu wartości $t$."
  },
  {
    "step": "Komplet rozwiązań",
    "points": 1,
    "description": "Poprawny pełny zbiór rozwiązań: $x=-2$, $x=-1$, $x=1$, $x=2$."
  }
]$g16$::jsonb
);

-- Problem 17 (difficulty=3, points_max=5, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $c17${
  "statement": "Rozwiąż nierówność wymierną $\\dfrac{x^2-1}{x-3}<0$.",
  "acceptedAnswers": [
    "x<-1 lub 1<x<3"
  ]
}$c17$::jsonb,
  3,
  false,
  5,
  'topic',
  $g17$[
  {
    "step": "Dziedzina",
    "points": 1,
    "description": "Poprawne wyznaczenie dziedziny: $x\\neq 3$."
  },
  {
    "step": "Rozkład licznika",
    "points": 1,
    "description": "Poprawny rozkład licznika na czynniki: $(x-1)(x+1)$."
  },
  {
    "step": "Miejsca zerowe",
    "points": 1,
    "description": "Poprawne wyznaczenie miejsc zerowych licznika i mianownika: $-1$, $1$, $3$."
  },
  {
    "step": "Siatka znaków",
    "points": 1,
    "description": "Poprawna analiza znaku wyrażenia na wszystkich przedziałach wyznaczonych przez te punkty."
  },
  {
    "step": "Zapis zbioru rozwiązań",
    "points": 1,
    "description": "Poprawny zapis zbioru rozwiązań: $x\\in(-\\infty,-1)\\cup(1,3)$."
  }
]$g17$::jsonb
);

-- Problem 18 (difficulty=3, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $c18${
  "statement": "Rozwiąż równanie z parametrem $(m-2)x=3m-6$ w zależności od wartości parametru $m$. Rozważ wszystkie przypadki."
}$c18$::jsonb,
  3,
  false,
  4,
  'topic',
  $g18$[
  {
    "step": "Postać równania",
    "points": 1,
    "description": "Zapisanie równania w postaci $(m-2)x=3(m-2)$."
  },
  {
    "step": "Przypadek m≠2",
    "points": 1,
    "description": "Poprawna analiza przypadku $m\\neq 2$ i wyznaczenie $x=3$."
  },
  {
    "step": "Przypadek m=2",
    "points": 1,
    "description": "Poprawna analiza przypadku $m=2$ i stwierdzenie, że każda liczba rzeczywista jest rozwiązaniem."
  },
  {
    "step": "Podsumowanie",
    "points": 1,
    "description": "Poprawne i pełne podsumowanie obu przypadków."
  }
]$g18$::jsonb
);

-- Problem 19 (difficulty=3, points_max=3, is_proof=true)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $c19${
  "statement": "Wykaż, że równanie $x^2-2mx+m^2-1=0$ ma dwa różne rozwiązania rzeczywiste dla każdej wartości parametru $m$."
}$c19$::jsonb,
  3,
  true,
  3,
  'topic',
  $g19$[
  {
    "step": "Obliczenie wyróżnika",
    "points": 1,
    "description": "Poprawne obliczenie wyróżnika w zależności od $m$: $\\Delta=(-2m)^2-4(m^2-1)=4m^2-4m^2+4=4$."
  },
  {
    "step": "Zauważenie stałości Δ",
    "points": 1,
    "description": "Zauważenie, że $\\Delta=4$ nie zależy od wartości $m$."
  },
  {
    "step": "Wniosek",
    "points": 1,
    "description": "Wniosek, że $\\Delta=4>0$ dla każdego $m$, więc równanie zawsze ma dwa różne rozwiązania rzeczywiste, co kończy dowód."
  }
]$g19$::jsonb
);

-- Problem 20 (difficulty=3, points_max=4, is_proof=true)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $c20${
  "statement": "Wykaż, że dla każdej liczby rzeczywistej dodatniej $x$ zachodzi nierówność $x+\\dfrac{1}{x}\\ge 2$."
}$c20$::jsonb,
  3,
  true,
  4,
  'topic',
  $g20$[
  {
    "step": "Wspólny mianownik",
    "points": 1,
    "description": "Sprowadzenie wyrażenia $x+\\dfrac{1}{x}-2$ do wspólnego mianownika: $\\dfrac{x^2-2x+1}{x}$."
  },
  {
    "step": "Rozpoznanie kwadratu",
    "points": 1,
    "description": "Rozpoznanie licznika jako kwadratu: $x^2-2x+1=(x-1)^2$."
  },
  {
    "step": "Uzasadnienie nieujemności",
    "points": 1,
    "description": "Uzasadnienie, że $\\dfrac{(x-1)^2}{x}\\ge 0$ dla $x>0$, ponieważ licznik jest nieujemny, a mianownik dodatni."
  },
  {
    "step": "Wniosek",
    "points": 1,
    "description": "Wniosek końcowy: $x+\\dfrac{1}{x}\\ge 2$, z równością dla $x=1$, co kończy dowód."
  }
]$g20$::jsonb
);

