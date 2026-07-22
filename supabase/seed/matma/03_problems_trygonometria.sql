-- ============================================================================
-- supabase/seed/matma/03_problems_trygonometria.sql
-- Problem bank (math_problems, source = 'topic') for the "trygonometria" department:
-- Trygonometria. 20 problems, difficulty distributed gently
-- (9 x difficulty=1, 7 x difficulty=2, 4 x difficulty=3,
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
where topic_id = (select id from math_topics where slug = 'trygonometria')
  and source = 'topic';

-- Problem 1 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'trygonometria'),
  $c1${
  "statement": "W trójkącie prostokątnym przyprostokątne mają długości $6$ i $8$. Oblicz długość przeciwprostokątnej.",
  "acceptedAnswers": [
    "c=10",
    "10"
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
    "description": "Poprawne zastosowanie twierdzenia Pitagorasa i wynik: $c=10$."
  }
]$g1$::jsonb
);

-- Problem 2 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'trygonometria'),
  $c2${
  "statement": "W trójkącie prostokątnym kąt $\\alpha$ leży naprzeciw przyprostokątnej o długości $5$, a przeciwprostokątna ma długość $13$. Oblicz $\\sin\\alpha$.",
  "acceptedAnswers": [
    "sinα=5/13",
    "5/13"
  ]
}$c2$::jsonb,
  1,
  false,
  2,
  'topic',
  $g2$[
  {
    "step": "Zastosowanie definicji sinusa",
    "points": 1,
    "description": "Zapisanie sinusa jako stosunku przyprostokątnej naprzeciw kąta do przeciwprostokątnej."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawny wynik: $\\sin\\alpha=\\dfrac{5}{13}$."
  }
]$g2$::jsonb
);

-- Problem 3 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'trygonometria'),
  $c3${
  "statement": "Podaj wartość $\\cos60^\\circ$ (bez użycia kalkulatora).",
  "acceptedAnswers": [
    "cos60°=1/2",
    "1/2",
    "0.5"
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
    "description": "Poprawna wartość: $\\cos60^\\circ=\\dfrac12$."
  }
]$g3$::jsonb
);

-- Problem 4 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'trygonometria'),
  $c4${
  "statement": "Oblicz $\\tan45^\\circ$ oraz $\\cot45^\\circ$.",
  "acceptedAnswers": [
    "tg45°=1 i ctg45°=1",
    "1 i 1",
    "tan45=1, cot45=1"
  ]
}$c4$::jsonb,
  1,
  false,
  2,
  'topic',
  $g4$[
  {
    "step": "Wartość tg45°",
    "points": 1,
    "description": "Poprawna wartość: $\\tan45^\\circ=1$."
  },
  {
    "step": "Wartość ctg45°",
    "points": 1,
    "description": "Poprawna wartość: $\\cot45^\\circ=1$."
  }
]$g4$::jsonb
);

-- Problem 5 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'trygonometria'),
  $c5${
  "statement": "Kąt $\\alpha$ jest ostry i $\\sin\\alpha=0{,}6$. Korzystając z jedynki trygonometrycznej, oblicz $\\cos\\alpha$.",
  "acceptedAnswers": [
    "cosα=0.8",
    "0.8",
    "4/5"
  ]
}$c5$::jsonb,
  1,
  false,
  2,
  'topic',
  $g5$[
  {
    "step": "Zastosowanie jedynki trygonometrycznej",
    "points": 1,
    "description": "Poprawne wyznaczenie $\\cos^2\\alpha=1-0{,}36=0{,}64$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawny wynik z uwzględnieniem znaku (kąt ostry, więc $\\cos\\alpha>0$): $\\cos\\alpha=0{,}8$."
  }
]$g5$::jsonb
);

-- Problem 6 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'trygonometria'),
  $c6${
  "statement": "Zamień kąt $60^\\circ$ na radiany.",
  "acceptedAnswers": [
    "π/3",
    "pi/3"
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
    "description": "Poprawna zamiana: $60^\\circ=\\dfrac{\\pi}{3}$."
  }
]$g6$::jsonb
);

-- Problem 7 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'trygonometria'),
  $c7${
  "statement": "Zamień kąt $\\dfrac{3\\pi}{2}$ na stopnie.",
  "acceptedAnswers": [
    "270°",
    "270"
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
    "description": "Poprawna zamiana: $\\dfrac{3\\pi}{2}=270^\\circ$."
  }
]$g7$::jsonb
);

-- Problem 8 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'trygonometria'),
  $c8${
  "statement": "Kąt $\\alpha$ ma miarę $200^\\circ$, co odpowiada III ćwiartce układu współrzędnych. Jaki znak ma wtedy $\\cos\\alpha$ — dodatni czy ujemny?",
  "acceptedAnswers": [
    "ujemny"
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
    "description": "Poprawne wskazanie znaku: $\\cos\\alpha$ jest ujemny w III ćwiartce."
  }
]$g8$::jsonb
);

-- Problem 9 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'trygonometria'),
  $c9${
  "statement": "Wiedząc, że $\\sin\\alpha=\\dfrac{4}{5}$ oraz $\\cos\\alpha=\\dfrac{3}{5}$, oblicz $\\tan\\alpha$.",
  "acceptedAnswers": [
    "4/3",
    "tgα=4/3"
  ]
}$c9$::jsonb,
  1,
  false,
  2,
  'topic',
  $g9$[
  {
    "step": "Zastosowanie wzoru",
    "points": 1,
    "description": "Zastosowanie wzoru $\\tan\\alpha=\\dfrac{\\sin\\alpha}{\\cos\\alpha}$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawny wynik: $\\tan\\alpha=\\dfrac{4}{3}$."
  }
]$g9$::jsonb
);

-- Problem 10 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'trygonometria'),
  $c10${
  "statement": "W trójkącie prostokątnym przeciwprostokątna ma długość $20$, a jeden z kątów ostrych ma miarę $30^\\circ$. Oblicz długość przyprostokątnej leżącej naprzeciw tego kąta.",
  "acceptedAnswers": [
    "a=10",
    "10"
  ]
}$c10$::jsonb,
  2,
  false,
  3,
  'topic',
  $g10$[
  {
    "step": "Zastosowanie definicji sinusa",
    "points": 1,
    "description": "Zapisanie równania $\\sin30^\\circ=\\dfrac{a}{20}$."
  },
  {
    "step": "Podstawienie wartości",
    "points": 1,
    "description": "Podstawienie $\\sin30^\\circ=\\dfrac12$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawny wynik: $a=10$."
  }
]$g10$::jsonb
);

-- Problem 11 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'trygonometria'),
  $c11${
  "statement": "Rozwiąż równanie $\\sin x=\\dfrac12$ dla $x\\in[0^\\circ,360^\\circ)$.",
  "acceptedAnswers": [
    "x=30° lub x=150°",
    "x=150° lub x=30°"
  ]
}$c11$::jsonb,
  2,
  false,
  3,
  'topic',
  $g11$[
  {
    "step": "Kąt odniesienia",
    "points": 1,
    "description": "Wyznaczenie kąta odniesienia $30^\\circ$."
  },
  {
    "step": "Uwzględnienie obu ćwiartek",
    "points": 1,
    "description": "Rozpoznanie, że sinus jest dodatni w I i II ćwiartce."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Pełny zbiór rozwiązań: $x=30^\\circ$ lub $x=150^\\circ$."
  }
]$g11$::jsonb
);

-- Problem 12 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'trygonometria'),
  $c12${
  "statement": "Rozwiąż równanie $\\cos x=-\\dfrac{\\sqrt2}{2}$ dla $x\\in[0^\\circ,360^\\circ)$.",
  "acceptedAnswers": [
    "x=135° lub x=225°",
    "x=225° lub x=135°"
  ]
}$c12$::jsonb,
  2,
  false,
  3,
  'topic',
  $g12$[
  {
    "step": "Kąt odniesienia",
    "points": 1,
    "description": "Wyznaczenie kąta odniesienia $45^\\circ$."
  },
  {
    "step": "Ustalenie ćwiartek",
    "points": 1,
    "description": "Rozpoznanie, że kosinus jest ujemny w II i III ćwiartce."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Pełny wynik: $x=135^\\circ$ lub $x=225^\\circ$."
  }
]$g12$::jsonb
);

-- Problem 13 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'trygonometria'),
  $c13${
  "statement": "Kąt $\\alpha$ należy do III ćwiartki i $\\cos\\alpha=-\\dfrac{12}{13}$. Oblicz $\\sin\\alpha$.",
  "acceptedAnswers": [
    "sinα=-5/13",
    "-5/13"
  ]
}$c13$::jsonb,
  2,
  false,
  3,
  'topic',
  $g13$[
  {
    "step": "Jedynka trygonometryczna",
    "points": 1,
    "description": "Obliczenie $\\sin^2\\alpha=1-\\dfrac{144}{169}=\\dfrac{25}{169}$."
  },
  {
    "step": "Uwzględnienie znaku",
    "points": 1,
    "description": "Rozpoznanie, że sinus jest ujemny w III ćwiartce."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawny wynik: $\\sin\\alpha=-\\dfrac{5}{13}$."
  }
]$g13$::jsonb
);

-- Problem 14 (difficulty=2, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'trygonometria'),
  $c14${
  "statement": "Oblicz $\\sin150^\\circ$, korzystając ze wzoru redukcyjnego.",
  "acceptedAnswers": [
    "1/2",
    "sin150°=1/2"
  ]
}$c14$::jsonb,
  2,
  false,
  4,
  'topic',
  $g14$[
  {
    "step": "Zapisanie kąta",
    "points": 1,
    "description": "Zapisanie $150^\\circ$ jako $180^\\circ-30^\\circ$."
  },
  {
    "step": "Wzór redukcyjny",
    "points": 1,
    "description": "Zastosowanie wzoru $\\sin(180^\\circ-\\alpha)=\\sin\\alpha$."
  },
  {
    "step": "Wartość szczególna",
    "points": 1,
    "description": "Odczytanie wartości $\\sin30^\\circ=\\dfrac12$ z tabeli."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawny wynik: $\\sin150^\\circ=\\dfrac12$."
  }
]$g14$::jsonb
);

-- Problem 15 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'trygonometria'),
  $c15${
  "statement": "Rozwiąż nierówność $\\sin x>\\dfrac12$ w przedziale $[0^\\circ,360^\\circ)$.",
  "acceptedAnswers": [
    "x∈(30°,150°)",
    "30°<x<150°"
  ]
}$c15$::jsonb,
  2,
  false,
  3,
  'topic',
  $g15$[
  {
    "step": "Miejsca równości",
    "points": 1,
    "description": "Wyznaczenie miejsc równości: $x=30^\\circ$ i $x=150^\\circ$."
  },
  {
    "step": "Analiza przebiegu funkcji",
    "points": 1,
    "description": "Rozpoznanie, że sinus przekracza $\\dfrac12$ między tymi kątami."
  },
  {
    "step": "Zapis przedziału",
    "points": 1,
    "description": "Poprawny zapis zbioru rozwiązań: $x\\in(30^\\circ,150^\\circ)$."
  }
]$g15$::jsonb
);

-- Problem 16 (difficulty=2, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'trygonometria'),
  $c16${
  "statement": "W trójkącie $a=10$, kąt $A=30^\\circ$, kąt $B=45^\\circ$. Oblicz długość boku $b$, korzystając z twierdzenia sinusów.",
  "acceptedAnswers": [
    "b=10√2",
    "10√2",
    "10*√2"
  ]
}$c16$::jsonb,
  2,
  false,
  4,
  'topic',
  $g16$[
  {
    "step": "Zapisanie proporcji",
    "points": 1,
    "description": "Zapisanie proporcji $\\dfrac{a}{\\sin A}=\\dfrac{b}{\\sin B}$."
  },
  {
    "step": "Podstawienie danych",
    "points": 1,
    "description": "Podstawienie $a=10$, $\\sin A=\\sin30^\\circ$, $\\sin B=\\sin45^\\circ$."
  },
  {
    "step": "Wartości szczególne",
    "points": 1,
    "description": "Podstawienie wartości $\\sin30^\\circ=\\dfrac12$, $\\sin45^\\circ=\\dfrac{\\sqrt2}{2}$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawny wynik: $b=10\\sqrt2$."
  }
]$g16$::jsonb
);

-- Problem 17 (difficulty=3, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'trygonometria'),
  $c17${
  "statement": "W trójkącie boki mają długości $a=2$, $b=3$, $c=\\sqrt7$. Oblicz miarę kąta $C$ leżącego naprzeciw boku $c$, korzystając z twierdzenia cosinusów.",
  "acceptedAnswers": [
    "C=60°",
    "60°",
    "60"
  ]
}$c17$::jsonb,
  3,
  false,
  4,
  'topic',
  $g17$[
  {
    "step": "Wzór",
    "points": 1,
    "description": "Zapisanie przekształconego wzoru $\\cos C=\\dfrac{a^2+b^2-c^2}{2ab}$."
  },
  {
    "step": "Podstawienie",
    "points": 1,
    "description": "Podstawienie danych i obliczenie $\\cos C=\\dfrac{4+9-7}{12}$."
  },
  {
    "step": "Wartość",
    "points": 1,
    "description": "Poprawne obliczenie $\\cos C=0{,}5$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Odczytanie kąta: $C=60^\\circ$."
  }
]$g17$::jsonb
);

-- Problem 18 (difficulty=3, points_max=5, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'trygonometria'),
  $c18${
  "statement": "Rozwiąż równanie trygonometryczne $2\\sin^2x-\\sin x-1=0$ w przedziale $[0^\\circ,360^\\circ)$.",
  "acceptedAnswers": [
    "x=90° lub x=210° lub x=330°",
    "x=90°,210°,330°"
  ]
}$c18$::jsonb,
  3,
  false,
  5,
  'topic',
  $g18$[
  {
    "step": "Podstawienie pomocnicze",
    "points": 1,
    "description": "Podstawienie $t=\\sin x$ i sprowadzenie do równania kwadratowego $2t^2-t-1=0$."
  },
  {
    "step": "Rozwiązanie względem t",
    "points": 1,
    "description": "Poprawne rozwiązanie: $t=1$ lub $t=-\\dfrac12$."
  },
  {
    "step": "Rozwiązanie sin x=1",
    "points": 1,
    "description": "Wyznaczenie $x=90^\\circ$."
  },
  {
    "step": "Rozwiązanie sin x=-1/2",
    "points": 1,
    "description": "Wyznaczenie obu rozwiązań w III i IV ćwiartce: $x=210^\\circ$ i $x=330^\\circ$."
  },
  {
    "step": "Pełny zbiór rozwiązań",
    "points": 1,
    "description": "Podanie kompletnego zbioru rozwiązań: $x=90^\\circ$, $x=210^\\circ$, $x=330^\\circ$."
  }
]$g18$::jsonb
);

-- Problem 19 (difficulty=3, points_max=3, is_proof=true)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'trygonometria'),
  $c19${
  "statement": "Wykaż tożsamość trygonometryczną $\\dfrac{1}{\\sin^2\\alpha}-1=\\cot^2\\alpha$ dla $\\alpha\\neq k\\cdot180^\\circ$, $k\\in\\mathbb{Z}$."
}$c19$::jsonb,
  3,
  true,
  3,
  'topic',
  $g19$[
  {
    "step": "Wspólny mianownik",
    "points": 1,
    "description": "Sprowadzenie lewej strony do wspólnego mianownika: $\\dfrac{1-\\sin^2\\alpha}{\\sin^2\\alpha}$."
  },
  {
    "step": "Jedynka trygonometryczna",
    "points": 1,
    "description": "Zastosowanie jedynki trygonometrycznej: $1-\\sin^2\\alpha=\\cos^2\\alpha$."
  },
  {
    "step": "Wniosek",
    "points": 1,
    "description": "Rozpoznanie ilorazu $\\dfrac{\\cos^2\\alpha}{\\sin^2\\alpha}$ jako $\\cot^2\\alpha$, co kończy dowód."
  }
]$g19$::jsonb
);

-- Problem 20 (difficulty=3, points_max=3, is_proof=true)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'trygonometria'),
  $c20${
  "statement": "Wykaż, że w trójkącie o bokach $a,b,c$ i kącie $C=90^\\circ$ twierdzenie cosinusów $c^2=a^2+b^2-2ab\\cos C$ redukuje się do twierdzenia Pitagorasa."
}$c20$::jsonb,
  3,
  true,
  3,
  'topic',
  $g20$[
  {
    "step": "Podstawienie C=90°",
    "points": 1,
    "description": "Podstawienie $C=90^\\circ$ do wzoru z twierdzenia cosinusów."
  },
  {
    "step": "Wartość cos90°",
    "points": 1,
    "description": "Wykorzystanie faktu, że $\\cos90^\\circ=0$."
  },
  {
    "step": "Wniosek",
    "points": 1,
    "description": "Wyprowadzenie wzoru $c^2=a^2+b^2$, czyli twierdzenia Pitagorasa, co kończy dowód."
  }
]$g20$::jsonb
);

