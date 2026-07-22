-- ============================================================================
-- supabase/seed/matma/03_problems_liczby-rzeczywiste.sql
-- Problem bank (math_problems, source = 'topic') for the "liczby-rzeczywiste" department:
-- Liczby rzeczywiste i wyrażenia algebraiczne. 18 problems,
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
where topic_id = (select id from math_topics where slug = 'liczby-rzeczywiste')
  and source = 'topic';

-- Problem 1 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'liczby-rzeczywiste'),
  $c1${
  "statement": "Oblicz $3^4$.",
  "acceptedAnswers": [
    "81",
    "3^4=81"
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
    "description": "Podanie poprawnej wartości potęgi: $3^4=81$."
  }
]$g1$::jsonb
);

-- Problem 2 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'liczby-rzeczywiste'),
  $c2${
  "statement": "Oblicz $\\sqrt{49}$.",
  "acceptedAnswers": [
    "7"
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
    "description": "Podanie poprawnej wartości pierwiastka: $\\sqrt{49}=7$."
  }
]$g2$::jsonb
);

-- Problem 3 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'liczby-rzeczywiste'),
  $c3${
  "statement": "Zapisz liczbę $\\dfrac{1}{5^3}$ w postaci potęgi o wykładniku ujemnym.",
  "acceptedAnswers": [
    "5^{-3}",
    "5^-3"
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
    "description": "Poprawny zapis w postaci $5^{-3}$."
  }
]$g3$::jsonb
);

-- Problem 4 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'liczby-rzeczywiste'),
  $c4${
  "statement": "Oblicz $\\log_2 16$.",
  "acceptedAnswers": [
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
    "description": "Podanie poprawnej wartości logarytmu: $\\log_2 16 = 4$, ponieważ $2^4=16$."
  }
]$g4$::jsonb
);

-- Problem 5 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'liczby-rzeczywiste'),
  $c5${
  "statement": "Oblicz $|-8| + |3|$.",
  "acceptedAnswers": [
    "11"
  ]
}$c5$::jsonb,
  1,
  false,
  2,
  'topic',
  $g5$[
  {
    "step": "Obliczenie $|-8|$",
    "points": 1,
    "description": "Poprawne obliczenie $|-8|=8$."
  },
  {
    "step": "Obliczenie $|3|$ i sumy",
    "points": 1,
    "description": "Poprawne obliczenie $|3|=3$ oraz podanie sumy $8+3=11$."
  }
]$g5$::jsonb
);

-- Problem 6 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'liczby-rzeczywiste'),
  $c6${
  "statement": "Wyznacz dziedzinę wyrażenia $\\dfrac{2}{x+5}$.",
  "acceptedAnswers": [
    "x\\neq-5",
    "x != -5"
  ]
}$c6$::jsonb,
  1,
  false,
  2,
  'topic',
  $g6$[
  {
    "step": "Warunek na mianownik",
    "points": 1,
    "description": "Zapisanie warunku $x+5\\neq0$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne wyznaczenie dziedziny: $x\\neq-5$."
  }
]$g6$::jsonb
);

-- Problem 7 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'liczby-rzeczywiste'),
  $c7${
  "statement": "Oblicz $4^{\\frac{1}{2}}$.",
  "acceptedAnswers": [
    "2"
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
    "description": "Podanie poprawnej wartości: $4^{\\frac{1}{2}}=\\sqrt4=2$."
  }
]$g7$::jsonb
);

-- Problem 8 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'liczby-rzeczywiste'),
  $c8${
  "statement": "Podaj stopień wielomianu $W(x)=5x^3-2x+7$.",
  "acceptedAnswers": [
    "3",
    "n=3"
  ]
}$c8$::jsonb,
  1,
  false,
  1,
  'topic',
  $g8$[
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne wskazanie stopnia: $n=3$."
  }
]$g8$::jsonb
);

-- Problem 9 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'liczby-rzeczywiste'),
  $c9${
  "statement": "Oblicz wartość wyrażenia $8^{\\frac{2}{3}} \\cdot 2^{-1}$.",
  "acceptedAnswers": [
    "2"
  ]
}$c9$::jsonb,
  2,
  false,
  3,
  'topic',
  $g9$[
  {
    "step": "Obliczenie $8^{2/3}$",
    "points": 1,
    "description": "Poprawne obliczenie $8^{\\frac{2}{3}}=4$."
  },
  {
    "step": "Obliczenie $2^{-1}$",
    "points": 1,
    "description": "Poprawne obliczenie $2^{-1}=\\frac{1}{2}$."
  },
  {
    "step": "Wynik końcowy",
    "points": 1,
    "description": "Poprawne obliczenie iloczynu: $4\\cdot\\frac{1}{2}=2$."
  }
]$g9$::jsonb
);

-- Problem 10 (difficulty=2, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'liczby-rzeczywiste'),
  $c10${
  "statement": "Zracjonalizuj (usuń niewymierność z) mianownik ułamka $\\dfrac{6}{\\sqrt{3}}$.",
  "acceptedAnswers": [
    "2\\sqrt{3}",
    "2sqrt(3)",
    "2√3",
    "2\\sqrt3"
  ]
}$c10$::jsonb,
  2,
  false,
  2,
  'topic',
  $g10$[
  {
    "step": "Mnożenie przez $\\sqrt3$",
    "points": 1,
    "description": "Pomnożenie licznika i mianownika przez $\\sqrt3$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne uproszczenie do postaci $2\\sqrt3$."
  }
]$g10$::jsonb
);

-- Problem 11 (difficulty=2, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'liczby-rzeczywiste'),
  $c11${
  "statement": "Korzystając z własności logarytmów, oblicz $\\log_5 100 - \\log_5 4$.",
  "acceptedAnswers": [
    "2"
  ]
}$c11$::jsonb,
  2,
  false,
  2,
  'topic',
  $g11$[
  {
    "step": "Zamiana na jeden logarytm",
    "points": 1,
    "description": "Zapisanie różnicy jako logarytmu ilorazu: $\\log_5\\frac{100}{4}$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne obliczenie: $\\log_5 25 = 2$."
  }
]$g11$::jsonb
);

-- Problem 12 (difficulty=2, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'liczby-rzeczywiste'),
  $c12${
  "statement": "Uprość wyrażenie wymierne $\\dfrac{x^2-9}{x^2-3x}$ i podaj założenia.",
  "acceptedAnswers": [
    "\\dfrac{x+3}{x}, x\\neq0, x\\neq3",
    "(x+3)/x dla x!=0 i x!=3"
  ]
}$c12$::jsonb,
  2,
  false,
  4,
  'topic',
  $g12$[
  {
    "step": "Rozkład licznika",
    "points": 1,
    "description": "Rozłożenie licznika na czynniki: $x^2-9=(x-3)(x+3)$."
  },
  {
    "step": "Rozkład mianownika",
    "points": 1,
    "description": "Rozłożenie mianownika na czynniki: $x^2-3x=x(x-3)$."
  },
  {
    "step": "Założenia",
    "points": 1,
    "description": "Poprawne podanie założeń: $x\\neq0$ i $x\\neq3$."
  },
  {
    "step": "Uproszczenie",
    "points": 1,
    "description": "Poprawne uproszczenie do postaci $\\dfrac{x+3}{x}$."
  }
]$g12$::jsonb
);

-- Problem 13 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'liczby-rzeczywiste'),
  $c13${
  "statement": "Wyznacz iloraz i resztę z dzielenia wielomianu $W(x)=x^3+2x^2-x-2$ przez $P(x)=x+2$.",
  "acceptedAnswers": [
    "Q(x)=x^2-1, R(x)=0"
  ]
}$c13$::jsonb,
  2,
  false,
  3,
  'topic',
  $g13$[
  {
    "step": "Wykonanie dzielenia",
    "points": 1,
    "description": "Poprawne wykonanie dzielenia wielomianów (np. schematem Hornera)."
  },
  {
    "step": "Iloraz",
    "points": 1,
    "description": "Poprawne podanie ilorazu: $Q(x)=x^2-1$."
  },
  {
    "step": "Reszta",
    "points": 1,
    "description": "Poprawne podanie reszty: $R(x)=0$."
  }
]$g13$::jsonb
);

-- Problem 14 (difficulty=2, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'liczby-rzeczywiste'),
  $c14${
  "statement": "Korzystając ze wzorów Viète'a, dla równania $x^2-7x+12=0$ podaj sumę i iloczyn pierwiastków (bez rozwiązywania równania).",
  "acceptedAnswers": [
    "x1+x2=7, x1*x2=12",
    "suma=7, iloczyn=12"
  ]
}$c14$::jsonb,
  2,
  false,
  2,
  'topic',
  $g14$[
  {
    "step": "Suma pierwiastków",
    "points": 1,
    "description": "Poprawne podanie sumy: $x_1+x_2=7$."
  },
  {
    "step": "Iloczyn pierwiastków",
    "points": 1,
    "description": "Poprawne podanie iloczynu: $x_1x_2=12$."
  }
]$g14$::jsonb
);

-- Problem 15 (difficulty=3, points_max=5, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'liczby-rzeczywiste'),
  $c15${
  "statement": "Wyznacz wszystkie pierwiastki wielomianu $W(x) = x^3 - 4x^2 + x + 6$.",
  "acceptedAnswers": [
    "x=-1 lub x=2 lub x=3",
    "x=-1, x=2, x=3",
    "-1,2,3"
  ]
}$c15$::jsonb,
  3,
  false,
  5,
  'topic',
  $g15$[
  {
    "step": "Znalezienie pierwszego pierwiastka",
    "points": 1,
    "description": "Znalezienie metodą prób (np. z twierdzenia Bézouta) pierwiastka całkowitego $x=-1$."
  },
  {
    "step": "Podzielenie wielomianu",
    "points": 2,
    "description": "Poprawne podzielenie $W(x)$ przez $(x+1)$, otrzymanie $W(x)=(x+1)(x^2-5x+6)$."
  },
  {
    "step": "Rozwiązanie trójmianu",
    "points": 1,
    "description": "Poprawne rozłożenie/rozwiązanie trójmianu $x^2-5x+6=(x-2)(x-3)$."
  },
  {
    "step": "Komplet pierwiastków",
    "points": 1,
    "description": "Podanie pełnego zbioru pierwiastków: $x=-1$, $x=2$, $x=3$."
  }
]$g15$::jsonb
);

-- Problem 16 (difficulty=3, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'liczby-rzeczywiste'),
  $c16${
  "statement": "Uprość i oblicz wartość liczbową wyrażenia $\\dfrac{1}{\\sqrt5-2} - \\dfrac{1}{\\sqrt5+2}$.",
  "acceptedAnswers": [
    "4"
  ]
}$c16$::jsonb,
  3,
  false,
  4,
  'topic',
  $g16$[
  {
    "step": "Wspólny mianownik",
    "points": 1,
    "description": "Sprowadzenie do wspólnego mianownika $(\\sqrt5-2)(\\sqrt5+2)$."
  },
  {
    "step": "Obliczenie mianownika",
    "points": 1,
    "description": "Poprawne obliczenie mianownika: $(\\sqrt5-2)(\\sqrt5+2)=5-4=1$."
  },
  {
    "step": "Obliczenie licznika",
    "points": 1,
    "description": "Poprawne obliczenie licznika: $(\\sqrt5+2)-(\\sqrt5-2)=4$."
  },
  {
    "step": "Wynik końcowy",
    "points": 1,
    "description": "Podanie poprawnego wyniku: $4$."
  }
]$g16$::jsonb
);

-- Problem 17 (difficulty=3, points_max=3, is_proof=true)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'liczby-rzeczywiste'),
  $c17${
  "statement": "Wykaż, że dla dowolnej liczby rzeczywistej $x$ prawdziwa jest nierówność $x^2-6x+10>0$."
}$c17$::jsonb,
  3,
  true,
  3,
  'topic',
  $g17$[
  {
    "step": "Zapisanie postaci kanonicznej",
    "points": 1,
    "description": "Przekształcenie wyrażenia do postaci $x^2-6x+10=(x-3)^2+1$ (uzupełnienie do pełnego kwadratu)."
  },
  {
    "step": "Uzasadnienie nieujemności kwadratu",
    "points": 1,
    "description": "Stwierdzenie, że $(x-3)^2\\ge0$ dla każdej liczby rzeczywistej $x$."
  },
  {
    "step": "Wniosek końcowy",
    "points": 1,
    "description": "Wyciągnięcie wniosku, że $(x-3)^2+1\\ge1>0$, a więc nierówność jest prawdziwa dla każdego $x\\in\\mathbb{R}$, co kończy dowód."
  }
]$g17$::jsonb
);

-- Problem 18 (difficulty=3, points_max=4, is_proof=true)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'liczby-rzeczywiste'),
  $c18${
  "statement": "Wykaż, że jeśli $x_1, x_2$ są pierwiastkami równania $x^2+px+q=0$ (gdzie $\\Delta\\ge0$), to $x_1^2+x_2^2 = p^2-2q$."
}$c18$::jsonb,
  3,
  true,
  4,
  'topic',
  $g18$[
  {
    "step": "Wzory Viète'a",
    "points": 1,
    "description": "Zapisanie wzorów Viète'a dla danego równania: $x_1+x_2=-p$ oraz $x_1x_2=q$."
  },
  {
    "step": "Tożsamość algebraiczna",
    "points": 1,
    "description": "Zapisanie przekształcenia $x_1^2+x_2^2=(x_1+x_2)^2-2x_1x_2$."
  },
  {
    "step": "Podstawienie",
    "points": 1,
    "description": "Podstawienie wzorów Viète'a do powyższej tożsamości: $(-p)^2-2q$."
  },
  {
    "step": "Wniosek końcowy",
    "points": 1,
    "description": "Uzasadnienie, że $(-p)^2-2q=p^2-2q$, co kończy dowód."
  }
]$g18$::jsonb
);

