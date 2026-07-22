-- ============================================================================
-- supabase/seed/matma/03_problems_rachunek-rozniczkowy.sql
-- Problem bank (math_problems, source = 'topic') for the
-- "rachunek-rozniczkowy" department: pochodna funkcji, interpretacja
-- geometryczna (styczna), monotoniczność i ekstrema z pochodnej, zadania
-- optymalizacyjne z kontekstem praktycznym. 18 problems, difficulty
-- distributed gently (8 x difficulty=1, 6 x difficulty=2, 4 x difficulty=3,
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
where topic_id = (select id from math_topics where slug = 'rachunek-rozniczkowy')
  and source = 'topic';

-- Problem 1 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rachunek-rozniczkowy'),
  $c1${
  "statement": "Oblicz pochodną funkcji $f(x)=x^6$.",
  "acceptedAnswers": [
    "6x^5",
    "f'(x)=6x^5"
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
    "description": "Poprawne zastosowanie wzoru $(x^n)'=nx^{n-1}$: $f'(x)=6x^5$."
  }
]$g1$::jsonb
);

-- Problem 2 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rachunek-rozniczkowy'),
  $c2${
  "statement": "Oblicz pochodną funkcji $f(x)=5x^3-2x+1$.",
  "acceptedAnswers": [
    "15x^2-2",
    "f'(x)=15x^2-2"
  ]
}$c2$::jsonb,
  1,
  false,
  2,
  'topic',
  $g2$[
  {
    "step": "Różniczkowanie każdego składnika",
    "points": 1,
    "description": "Poprawne obliczenie pochodnych poszczególnych składników: $(5x^3)'=15x^2$, $(-2x)'=-2$, $(1)'=0$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne podanie sumy: $f'(x)=15x^2-2$."
  }
]$g2$::jsonb
);

-- Problem 3 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rachunek-rozniczkowy'),
  $c3${
  "statement": "Dla funkcji $f(x)=x^4$ oblicz wartość pochodnej $f'(2)$.",
  "acceptedAnswers": [
    "32"
  ]
}$c3$::jsonb,
  1,
  false,
  2,
  'topic',
  $g3$[
  {
    "step": "Wzór pochodnej",
    "points": 1,
    "description": "Poprawne obliczenie wzoru pochodnej: $f'(x)=4x^3$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne obliczenie wartości: $f'(2)=4\\cdot2^3=32$."
  }
]$g3$::jsonb
);

-- Problem 4 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rachunek-rozniczkowy'),
  $c4${
  "statement": "Oblicz pochodną funkcji $f(x)=\\sin x + \\cos x$.",
  "acceptedAnswers": [
    "\\cos x-\\sin x",
    "cos(x)-sin(x)"
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
    "description": "Poprawne zastosowanie wzorów $(\\sin x)'=\\cos x$ i $(\\cos x)'=-\\sin x$: $f'(x)=\\cos x-\\sin x$."
  }
]$g4$::jsonb
);

-- Problem 5 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rachunek-rozniczkowy'),
  $c5${
  "statement": "Oblicz wartość pochodnej funkcji $f(x)=e^x$ w punkcie $x=0$.",
  "acceptedAnswers": [
    "1"
  ]
}$c5$::jsonb,
  1,
  false,
  1,
  'topic',
  $g5$[
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne wykorzystanie $(e^x)'=e^x$ i obliczenie $f'(0)=e^0=1$."
  }
]$g5$::jsonb
);

-- Problem 6 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rachunek-rozniczkowy'),
  $c6${
  "statement": "Napisz równanie stycznej do wykresu funkcji $f(x)=x^2$ w punkcie $x_0=0$.",
  "acceptedAnswers": [
    "y=0"
  ]
}$c6$::jsonb,
  1,
  false,
  2,
  'topic',
  $g6$[
  {
    "step": "Obliczenie $f(0)$ i $f'(0)$",
    "points": 1,
    "description": "Poprawne obliczenie $f(0)=0$ oraz $f'(x)=2x \\Rightarrow f'(0)=0$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne podstawienie do wzoru $y=f(x_0)+f'(x_0)(x-x_0)$ i podanie równania $y=0$."
  }
]$g6$::jsonb
);

-- Problem 7 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rachunek-rozniczkowy'),
  $c7${
  "statement": "Podaj pochodną funkcji stałej $f(x)=7$.",
  "acceptedAnswers": [
    "0",
    "f'(x)=0"
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
    "description": "Poprawne podanie: pochodna funkcji stałej wynosi $0$."
  }
]$g7$::jsonb
);

-- Problem 8 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rachunek-rozniczkowy'),
  $c8${
  "statement": "Zbadaj (na podstawie znaku pochodnej), czy funkcja liniowa $f(x)=-4x+9$ jest rosnąca, czy malejąca w całej swojej dziedzinie.",
  "acceptedAnswers": [
    "malejąca"
  ]
}$c8$::jsonb,
  1,
  false,
  2,
  'topic',
  $g8$[
  {
    "step": "Obliczenie pochodnej",
    "points": 1,
    "description": "Poprawne obliczenie $f'(x)=-4$."
  },
  {
    "step": "Wniosek",
    "points": 1,
    "description": "Stwierdzenie, że skoro $f'(x)=-4<0$ dla każdego $x$, funkcja jest malejąca w całym zbiorze $\\mathbb{R}$."
  }
]$g8$::jsonb
);

-- Problem 9 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rachunek-rozniczkowy'),
  $c9${
  "statement": "Korzystając z reguły pochodnej iloczynu, oblicz pochodną funkcji $f(x)=(2x+1)(x-3)$.",
  "acceptedAnswers": [
    "4x-5",
    "f'(x)=4x-5"
  ]
}$c9$::jsonb,
  2,
  false,
  3,
  'topic',
  $g9$[
  {
    "step": "Wyznaczenie $u'$, $v'$",
    "points": 1,
    "description": "Poprawne oznaczenie $u(x)=2x+1$, $v(x)=x-3$ i obliczenie $u'(x)=2$, $v'(x)=1$."
  },
  {
    "step": "Zastosowanie wzoru",
    "points": 1,
    "description": "Poprawne podstawienie do wzoru $f'(x)=u'v+uv'=2(x-3)+(2x+1)\\cdot1$."
  },
  {
    "step": "Uproszczenie wyniku",
    "points": 1,
    "description": "Poprawne uproszczenie do postaci $f'(x)=4x-5$."
  }
]$g9$::jsonb
);

-- Problem 10 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rachunek-rozniczkowy'),
  $c10${
  "statement": "Korzystając z reguły pochodnej ilorazu, oblicz pochodną funkcji $f(x)=\\dfrac{x}{x+2}$.",
  "acceptedAnswers": [
    "2/(x+2)^2",
    "\\dfrac{2}{(x+2)^2}"
  ]
}$c10$::jsonb,
  2,
  false,
  3,
  'topic',
  $g10$[
  {
    "step": "Wyznaczenie $u'$, $v'$",
    "points": 1,
    "description": "Poprawne oznaczenie $u(x)=x$, $v(x)=x+2$ i obliczenie $u'(x)=1$, $v'(x)=1$."
  },
  {
    "step": "Zastosowanie wzoru",
    "points": 1,
    "description": "Poprawne podstawienie do wzoru $f'(x)=\\dfrac{u'v-uv'}{v^2}=\\dfrac{(x+2)-x}{(x+2)^2}$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne uproszczenie licznika i podanie wyniku: $f'(x)=\\dfrac{2}{(x+2)^2}$."
  }
]$g10$::jsonb
);

-- Problem 11 (difficulty=2, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rachunek-rozniczkowy'),
  $c11${
  "statement": "Korzystając z reguły łańcuchowej, oblicz pochodną funkcji $h(x)=(2x-5)^4$.",
  "acceptedAnswers": [
    "8(2x-5)^3",
    "h'(x)=8(2x-5)^3"
  ]
}$c11$::jsonb,
  2,
  false,
  2,
  'topic',
  $g11$[
  {
    "step": "Zastosowanie reguły łańcuchowej",
    "points": 1,
    "description": "Poprawne rozpoznanie funkcji zewnętrznej $t^4$ i wewnętrznej $2x-5$ oraz zapis $h'(x)=4(2x-5)^3\\cdot(2x-5)'$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne uproszczenie: $h'(x)=4(2x-5)^3\\cdot2=8(2x-5)^3$."
  }
]$g11$::jsonb
);

-- Problem 12 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rachunek-rozniczkowy'),
  $c12${
  "statement": "Wyznacz równanie stycznej do wykresu funkcji $f(x)=x^3$ w punkcie $x_0=2$.",
  "acceptedAnswers": [
    "y=12x-16"
  ]
}$c12$::jsonb,
  2,
  false,
  3,
  'topic',
  $g12$[
  {
    "step": "Obliczenie $f(2)$",
    "points": 1,
    "description": "Poprawne obliczenie $f(2)=2^3=8$."
  },
  {
    "step": "Obliczenie $f'(2)$",
    "points": 1,
    "description": "Poprawne obliczenie pochodnej $f'(x)=3x^2$ i jej wartości $f'(2)=12$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne podstawienie do wzoru $y=f(x_0)+f'(x_0)(x-x_0)$ i podanie równania $y=12x-16$."
  }
]$g12$::jsonb
);

-- Problem 13 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rachunek-rozniczkowy'),
  $c13${
  "statement": "Wyznacz przedziały monotoniczności funkcji $f(x)=x^2-6x+5$, korzystając ze znaku pochodnej.",
  "acceptedAnswers": [
    "malejąca w (-\\infty,3], rosnąca w [3,\\infty)",
    "x<3 malejąca, x>3 rosnąca"
  ]
}$c13$::jsonb,
  2,
  false,
  3,
  'topic',
  $g13$[
  {
    "step": "Obliczenie pochodnej",
    "points": 1,
    "description": "Poprawne obliczenie $f'(x)=2x-6$."
  },
  {
    "step": "Wyznaczenie punktu krytycznego i znaku pochodnej",
    "points": 1,
    "description": "Poprawne rozwiązanie $f'(x)=0 \\iff x=3$ oraz zbadanie znaku: $f'(x)<0$ dla $x<3$, $f'(x)>0$ dla $x>3$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne podanie przedziałów: funkcja malejąca w $(-\\infty,3]$, rosnąca w $[3,\\infty)$."
  }
]$g13$::jsonb
);

-- Problem 14 (difficulty=2, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rachunek-rozniczkowy'),
  $c14${
  "statement": "Funkcja dana jest wzorem $f(x)=-x^2+4x+1$. Wyznacz współrzędne jej ekstremum lokalnego i określ jego rodzaj (maksimum czy minimum), korzystając z pochodnej.",
  "acceptedAnswers": [
    "maksimum w (2,5)",
    "(2,5), maksimum"
  ]
}$c14$::jsonb,
  2,
  false,
  4,
  'topic',
  $g14$[
  {
    "step": "Obliczenie pochodnej",
    "points": 1,
    "description": "Poprawne obliczenie $f'(x)=-2x+4$."
  },
  {
    "step": "Punkt krytyczny",
    "points": 1,
    "description": "Poprawne rozwiązanie $f'(x)=0 \\iff x=2$."
  },
  {
    "step": "Wartość funkcji w punkcie krytycznym",
    "points": 1,
    "description": "Poprawne obliczenie $f(2)=-4+8+1=5$."
  },
  {
    "step": "Klasyfikacja ekstremum z uzasadnieniem",
    "points": 1,
    "description": "Stwierdzenie, że pochodna zmienia znak z dodatniego (dla $x<2$) na ujemny (dla $x>2$), więc w punkcie $(2,5)$ funkcja ma maksimum lokalne."
  }
]$g14$::jsonb
);

-- Problem 15 (difficulty=3, points_max=5, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rachunek-rozniczkowy'),
  $c15${
  "statement": "Wśród prostokątów o polu równym $36\\text{ cm}^2$ znajdź ten, który ma najmniejszy obwód. Podaj długości boków.",
  "acceptedAnswers": [
    "x=6, y=6",
    "kwadrat 6x6, obwód=24"
  ]
}$c15$::jsonb,
  3,
  false,
  5,
  'topic',
  $g15$[
  {
    "step": "Wprowadzenie zmiennej i zależności z treści",
    "points": 1,
    "description": "Oznaczenie boków $x$, $y$ i zapisanie warunku $xy=36$, skąd $y=\\dfrac{36}{x}$."
  },
  {
    "step": "Funkcja jednej zmiennej",
    "points": 1,
    "description": "Poprawne zapisanie obwodu jako funkcji $x$: $L(x)=2x+\\dfrac{72}{x}$, dla $x>0$."
  },
  {
    "step": "Pochodna i punkt krytyczny",
    "points": 1,
    "description": "Poprawne obliczenie $L'(x)=2-\\dfrac{72}{x^2}$ i rozwiązanie $L'(x)=0 \\iff x^2=36 \\iff x=6$ (dla $x>0$)."
  },
  {
    "step": "Weryfikacja minimum",
    "points": 1,
    "description": "Sprawdzenie zmiany znaku pochodnej ($L'(x)<0$ dla $x<6$, $L'(x)>0$ dla $x>6$), potwierdzającej minimum."
  },
  {
    "step": "Odpowiedź w kontekście zadania",
    "points": 1,
    "description": "Poprawne podanie wymiarów $x=6$ cm, $y=\\dfrac{36}{6}=6$ cm (kwadrat), obwód minimalny $L(6)=24$ cm."
  }
]$g15$::jsonb
);

-- Problem 16 (difficulty=3, points_max=5, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rachunek-rozniczkowy'),
  $c16${
  "statement": "Zamknięta puszka w kształcie walca ma mieć objętość $250\\pi\\text{ cm}^3$. Dla jakiego promienia podstawy $r$ pole powierzchni całkowitej puszki będzie najmniejsze? Podaj też odpowiadającą wysokość $h$.",
  "acceptedAnswers": [
    "r=5, h=10",
    "promień 5 cm, wysokość 10 cm"
  ]
}$c16$::jsonb,
  3,
  false,
  5,
  'topic',
  $g16$[
  {
    "step": "Wyrażenie wysokości przez promień",
    "points": 1,
    "description": "Z warunku na objętość $V=\\pi r^2h=250\\pi$ poprawne wyznaczenie $h=\\dfrac{250}{r^2}$."
  },
  {
    "step": "Funkcja pola powierzchni jednej zmiennej",
    "points": 1,
    "description": "Poprawne zapisanie $S(r)=2\\pi r^2+2\\pi rh$ i podstawienie $h$: $S(r)=2\\pi r^2+\\dfrac{500\\pi}{r}$, dla $r>0$."
  },
  {
    "step": "Pochodna i punkt krytyczny",
    "points": 1,
    "description": "Poprawne obliczenie $S'(r)=4\\pi r-\\dfrac{500\\pi}{r^2}$ i rozwiązanie $S'(r)=0 \\iff r^3=125 \\iff r=5$."
  },
  {
    "step": "Weryfikacja minimum",
    "points": 1,
    "description": "Sprawdzenie zmiany znaku pochodnej ($S'(r)<0$ dla $r<5$, $S'(r)>0$ dla $r>5$), potwierdzającej minimum."
  },
  {
    "step": "Odpowiedź w kontekście zadania",
    "points": 1,
    "description": "Poprawne podanie promienia $r=5$ cm oraz wysokości $h=\\dfrac{250}{25}=10$ cm."
  }
]$g16$::jsonb
);

-- Problem 17 (difficulty=3, points_max=3, is_proof=true)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rachunek-rozniczkowy'),
  $c17${
  "statement": "Wykaż, że jeśli funkcja różniczkowalna $f$ jest parzysta (tzn. $f(-x)=f(x)$ dla każdego $x$ z jej dziedziny), to jej pochodna $f'$ jest funkcją nieparzystą."
}$c17$::jsonb,
  3,
  true,
  3,
  'topic',
  $g17$[
  {
    "step": "Założenie i przygotowanie do różniczkowania",
    "points": 1,
    "description": "Przyjęcie tożsamości $f(-x)=f(x)$ dla każdego $x$ z dziedziny i zapowiedź zróżniczkowania obu jej stron względem $x$."
  },
  {
    "step": "Zastosowanie reguły łańcuchowej do lewej strony",
    "points": 1,
    "description": "Poprawne obliczenie $\\dfrac{d}{dx}f(-x)=f'(-x)\\cdot(-1)=-f'(-x)$ oraz $\\dfrac{d}{dx}f(x)=f'(x)$, skąd $-f'(-x)=f'(x)$."
  },
  {
    "step": "Wniosek końcowy",
    "points": 1,
    "description": "Przekształcenie do postaci $f'(-x)=-f'(x)$ dla każdego $x$ z dziedziny, co jest definicją funkcji nieparzystej — co kończy dowód."
  }
]$g17$::jsonb
);

-- Problem 18 (difficulty=3, points_max=3, is_proof=true)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'rachunek-rozniczkowy'),
  $c18${
  "statement": "Wykaż, że funkcja $f(x)=x^3+x$ jest rosnąca w całym zbiorze liczb rzeczywistych."
}$c18$::jsonb,
  3,
  true,
  3,
  'topic',
  $g18$[
  {
    "step": "Obliczenie pochodnej",
    "points": 1,
    "description": "Poprawne obliczenie $f'(x)=3x^2+1$."
  },
  {
    "step": "Uzasadnienie, że pochodna jest zawsze dodatnia",
    "points": 1,
    "description": "Zauważenie, że $x^2\\ge0$ dla każdego $x\\in\\mathbb{R}$, więc $3x^2\\ge0$, a stąd $f'(x)=3x^2+1\\ge1>0$ dla każdego $x\\in\\mathbb{R}$."
  },
  {
    "step": "Wniosek końcowy",
    "points": 1,
    "description": "Stwierdzenie, że skoro $f'(x)>0$ dla każdego $x\\in\\mathbb{R}$, funkcja $f$ jest rosnąca w całym zbiorze liczb rzeczywistych — co kończy dowód."
  }
]$g18$::jsonb
);
