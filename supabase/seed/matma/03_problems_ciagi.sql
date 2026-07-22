-- ============================================================================
-- supabase/seed/matma/03_problems_ciagi.sql
-- Problem bank (math_problems, source = 'topic') for the "ciagi" department:
-- Ciągi liczbowe. 20 problems, difficulty distributed gently
-- (9 x difficulty=1, 7 x difficulty=2, 4 x difficulty=3, including 2
-- induction proofs among the difficulty=3 problems).
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
where topic_id = (select id from math_topics where slug = 'ciagi')
  and source = 'topic';

-- Problem 1 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'ciagi'),
  $c1${
  "statement": "Oblicz $a_5$ ciągu danego wzorem $a_n=3n-2$.",
  "acceptedAnswers": [
    "13",
    "a_5=13"
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
    "description": "Podanie poprawnej wartości: $a_5=3\\cdot5-2=13$."
  }
]$g1$::jsonb
);

-- Problem 2 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'ciagi'),
  $c2${
  "statement": "Ciąg arytmetyczny ma $a_1=4$ oraz $r=5$. Oblicz $a_6$.",
  "acceptedAnswers": [
    "29",
    "a_6=29"
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
    "description": "Podanie poprawnej wartości: $a_6=4+5\\cdot5=29$."
  }
]$g2$::jsonb
);

-- Problem 3 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'ciagi'),
  $c3${
  "statement": "Wyznacz różnicę ciągu arytmetycznego $10, 7, 4, 1, \\ldots$",
  "acceptedAnswers": [
    "r=-3",
    "-3"
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
    "description": "Poprawne obliczenie różnicy: $r=7-10=-3$."
  }
]$g3$::jsonb
);

-- Problem 4 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'ciagi'),
  $c4${
  "statement": "Ciąg geometryczny ma $a_1=5$ oraz $q=2$. Oblicz $a_4$.",
  "acceptedAnswers": [
    "40",
    "a_4=40"
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
    "description": "Podanie poprawnej wartości: $a_4=5\\cdot2^3=40$."
  }
]$g4$::jsonb
);

-- Problem 5 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'ciagi'),
  $c5${
  "statement": "Wyznacz iloraz ciągu geometrycznego $2, 6, 18, 54, \\ldots$",
  "acceptedAnswers": [
    "q=3",
    "3"
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
    "description": "Poprawne obliczenie ilorazu: $q=6:2=3$."
  }
]$g5$::jsonb
);

-- Problem 6 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'ciagi'),
  $c6${
  "statement": "Oblicz $a_3$ ciągu danego wzorem $a_n=2^n-1$.",
  "acceptedAnswers": [
    "7",
    "a_3=7"
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
    "description": "Podanie poprawnej wartości: $a_3=2^3-1=7$."
  }
]$g6$::jsonb
);

-- Problem 7 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'ciagi'),
  $c7${
  "statement": "Ciąg arytmetyczny ma $a_1=-3$ oraz $r=2$. Oblicz sumę pierwszych pięciu wyrazów $S_5$.",
  "acceptedAnswers": [
    "5",
    "S_5=5"
  ]
}$c7$::jsonb,
  1,
  false,
  2,
  'topic',
  $g7$[
  {
    "step": "Obliczenie $a_5$",
    "points": 1,
    "description": "Poprawne obliczenie piątego wyrazu: $a_5=-3+4\\cdot2=5$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne obliczenie sumy: $S_5=\\dfrac{-3+5}{2}\\cdot5=5$."
  }
]$g7$::jsonb
);

-- Problem 8 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'ciagi'),
  $c8${
  "statement": "Oblicz $\\lim_{n\\to\\infty}\\dfrac{1}{n^2}$.",
  "acceptedAnswers": [
    "0"
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
    "description": "Podanie poprawnej granicy: $\\lim_{n\\to\\infty}\\frac1{n^2}=0$."
  }
]$g8$::jsonb
);

-- Problem 9 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'ciagi'),
  $c9${
  "statement": "Ciąg arytmetyczny ma $a_1=6$ oraz $r=-1$. Oblicz $a_7$.",
  "acceptedAnswers": [
    "0",
    "a_7=0"
  ]
}$c9$::jsonb,
  1,
  false,
  1,
  'topic',
  $g9$[
  {
    "step": "Wynik",
    "points": 1,
    "description": "Podanie poprawnej wartości: $a_7=6+6\\cdot(-1)=0$."
  }
]$g9$::jsonb
);

-- Problem 10 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'ciagi'),
  $c10${
  "statement": "W ciągu arytmetycznym $a_3=11$ oraz $a_5=19$. Wyznacz różnicę $r$, pierwszy wyraz $a_1$ oraz wzór ogólny ciągu.",
  "acceptedAnswers": [
    "r=4, a_1=3, a_n=4n-1",
    "a_n=4n-1"
  ]
}$c10$::jsonb,
  2,
  false,
  3,
  'topic',
  $g10$[
  {
    "step": "Różnica ciągu",
    "points": 1,
    "description": "Poprawne obliczenie różnicy: $a_5-a_3=2r=8$, skąd $r=4$."
  },
  {
    "step": "Pierwszy wyraz",
    "points": 1,
    "description": "Poprawne obliczenie pierwszego wyrazu: $a_3=a_1+2r$, czyli $11=a_1+8$, skąd $a_1=3$."
  },
  {
    "step": "Wzór ogólny",
    "points": 1,
    "description": "Poprawne podanie wzoru ogólnego: $a_n=3+(n-1)\\cdot4=4n-1$."
  }
]$g10$::jsonb
);

-- Problem 11 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'ciagi'),
  $c11${
  "statement": "Ciąg geometryczny o dodatnich wyrazach spełnia $a_2=6$ oraz $a_4=54$. Wyznacz iloraz $q$ oraz pierwszy wyraz $a_1$.",
  "acceptedAnswers": [
    "q=3, a_1=2"
  ]
}$c11$::jsonb,
  2,
  false,
  3,
  'topic',
  $g11$[
  {
    "step": "Obliczenie $q^2$",
    "points": 1,
    "description": "Poprawne zapisanie i obliczenie: $a_4=a_2\\cdot q^2$, czyli $q^2=54:6=9$."
  },
  {
    "step": "Iloraz",
    "points": 1,
    "description": "Poprawne wyznaczenie ilorazu (dodatniego): $q=3$."
  },
  {
    "step": "Pierwszy wyraz",
    "points": 1,
    "description": "Poprawne obliczenie pierwszego wyrazu: $a_1=a_2:q=6:3=2$."
  }
]$g11$::jsonb
);

-- Problem 12 (difficulty=2, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'ciagi'),
  $c12${
  "statement": "Oblicz sumę $S_8$ pierwszych ośmiu wyrazów ciągu arytmetycznego, w którym $a_1=1$ oraz $r=3$.",
  "acceptedAnswers": [
    "92",
    "S_8=92"
  ]
}$c12$::jsonb,
  2,
  false,
  2,
  'topic',
  $g12$[
  {
    "step": "Obliczenie $a_8$",
    "points": 1,
    "description": "Poprawne obliczenie ósmego wyrazu: $a_8=1+7\\cdot3=22$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne obliczenie sumy: $S_8=\\dfrac{1+22}{2}\\cdot8=92$."
  }
]$g12$::jsonb
);

-- Problem 13 (difficulty=2, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'ciagi'),
  $c13${
  "statement": "Oblicz $\\lim_{n\\to\\infty}\\dfrac{4n-1}{2n+3}$.",
  "acceptedAnswers": [
    "2"
  ]
}$c13$::jsonb,
  2,
  false,
  2,
  'topic',
  $g13$[
  {
    "step": "Podzielenie przez $n$",
    "points": 1,
    "description": "Podzielenie licznika i mianownika przez $n$: $\\dfrac{4-\\frac1n}{2+\\frac3n}$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne obliczenie granicy: $\\dfrac{4-0}{2+0}=2$."
  }
]$g13$::jsonb
);

-- Problem 14 (difficulty=2, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'ciagi'),
  $c14${
  "statement": "Liczby $5, x, 20$ tworzą (w tej kolejności) ciąg geometryczny o dodatnich wyrazach. Oblicz $x$.",
  "acceptedAnswers": [
    "10",
    "x=10"
  ]
}$c14$::jsonb,
  2,
  false,
  2,
  'topic',
  $g14$[
  {
    "step": "Zapisanie równania",
    "points": 1,
    "description": "Wykorzystanie własności trzech kolejnych wyrazów ciągu geometrycznego: $x^2=5\\cdot20=100$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne wyznaczenie dodatniego rozwiązania: $x=10$."
  }
]$g14$::jsonb
);

-- Problem 15 (difficulty=2, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'ciagi'),
  $c15${
  "statement": "Kapitał $4000$ zł ulokowano na $2$ lata na lokacie z oprocentowaniem składanym $5\\%$ rocznie (kapitalizacja roczna). Oblicz wysokość kapitału po $2$ latach.",
  "acceptedAnswers": [
    "4410 zł",
    "4410",
    "4410,00 zł"
  ]
}$c15$::jsonb,
  2,
  false,
  4,
  'topic',
  $g15$[
  {
    "step": "Wybór wzoru",
    "points": 1,
    "description": "Zastosowanie wzoru na procent składany: $K_2=K_0(1+r)^2$."
  },
  {
    "step": "Podstawienie danych",
    "points": 1,
    "description": "Poprawne podstawienie: $K_2=4000\\cdot(1{,}05)^2$."
  },
  {
    "step": "Obliczenie potęgi",
    "points": 1,
    "description": "Poprawne obliczenie $(1{,}05)^2=1{,}1025$."
  },
  {
    "step": "Wynik końcowy",
    "points": 1,
    "description": "Podanie poprawnego wyniku: $K_2=4000\\cdot1{,}1025=4410$ zł."
  }
]$g15$::jsonb
);

-- Problem 16 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'ciagi'),
  $c16${
  "statement": "Populacja bakterii podwaja się co godzinę. Na początku obserwacji było $500$ bakterii. Ile bakterii będzie po $5$ godzinach?",
  "acceptedAnswers": [
    "16000",
    "16 000"
  ]
}$c16$::jsonb,
  2,
  false,
  3,
  'topic',
  $g16$[
  {
    "step": "Rozpoznanie modelu",
    "points": 1,
    "description": "Rozpoznanie, że liczba bakterii tworzy ciąg geometryczny o ilorazie $q=2$."
  },
  {
    "step": "Zastosowanie wzoru",
    "points": 1,
    "description": "Poprawne podstawienie do wzoru: $a_5=500\\cdot2^5$ (gdzie stan początkowy to $500$, a wykładnik to liczba godzin)."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne obliczenie: $500\\cdot32=16000$."
  }
]$g16$::jsonb
);

-- Problem 17 (difficulty=3, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'ciagi'),
  $c17${
  "statement": "Ciąg arytmetyczny ma $a_1=2$ oraz sumę pierwszych dziesięciu wyrazów $S_{10}=155$. Wyznacz różnicę $r$ tego ciągu.",
  "acceptedAnswers": [
    "r=3",
    "3"
  ]
}$c17$::jsonb,
  3,
  false,
  4,
  'topic',
  $g17$[
  {
    "step": "Zapisanie wzoru na sumę",
    "points": 1,
    "description": "Zapisanie wzoru $S_{10}=\\dfrac{2a_1+9r}{2}\\cdot10$ z podstawionym $a_1=2$."
  },
  {
    "step": "Uproszczenie do równania liniowego",
    "points": 1,
    "description": "Poprawne uproszczenie równania do postaci $20+45r=155$."
  },
  {
    "step": "Rozwiązanie równania",
    "points": 1,
    "description": "Poprawne rozwiązanie równania: $45r=135$."
  },
  {
    "step": "Wynik końcowy",
    "points": 1,
    "description": "Podanie poprawnej wartości: $r=3$."
  }
]$g17$::jsonb
);

-- Problem 18 (difficulty=3, points_max=5, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'ciagi'),
  $c18${
  "statement": "Suma trzech kolejnych wyrazów ciągu geometrycznego wynosi $26$, a ich iloczyn wynosi $216$. Wyznacz te trzy liczby.",
  "acceptedAnswers": [
    "2, 6, 18",
    "18, 6, 2",
    "2,6,18"
  ]
}$c18$::jsonb,
  3,
  false,
  5,
  'topic',
  $g18$[
  {
    "step": "Środkowy wyraz z iloczynu",
    "points": 1,
    "description": "Zauważenie, że dla trzech kolejnych wyrazów ciągu geometrycznego $\\frac{b}{q},b,bq$ iloczyn wynosi $b^3$, i wyznaczenie $b=\\sqrt[3]{216}=6$."
  },
  {
    "step": "Równanie na sumę",
    "points": 1,
    "description": "Zapisanie równania sumy z wykorzystaniem $b=6$: $\\dfrac{6}{q}+6+6q=26$."
  },
  {
    "step": "Sprowadzenie do równania kwadratowego",
    "points": 1,
    "description": "Poprawne przekształcenie równania do postaci $3q^2-10q+3=0$."
  },
  {
    "step": "Rozwiązanie równania kwadratowego",
    "points": 1,
    "description": "Poprawne obliczenie $\\Delta=64$ i pierwiastków: $q=3$ lub $q=\\dfrac13$."
  },
  {
    "step": "Podanie szukanych liczb",
    "points": 1,
    "description": "Podanie trzech szukanych liczb: $2, 6, 18$ (lub w kolejności odwrotnej)."
  }
]$g18$::jsonb
);

-- Problem 19 (difficulty=3, points_max=4, is_proof=true)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'ciagi'),
  $c19${
  "statement": "Wykaż przez indukcję matematyczną, że dla każdej liczby naturalnej $n\\ge1$ zachodzi równość $1+3+5+\\cdots+(2n-1)=n^2$."
}$c19$::jsonb,
  3,
  true,
  4,
  'topic',
  $g19$[
  {
    "step": "Krok bazowy",
    "points": 1,
    "description": "Sprawdzenie prawdziwości wzoru dla $n=1$: $1=1^2$."
  },
  {
    "step": "Założenie indukcyjne",
    "points": 1,
    "description": "Poprawne sformułowanie założenia indukcyjnego: zakładamy, że $1+3+\\cdots+(2k-1)=k^2$ dla pewnego $k\\ge1$."
  },
  {
    "step": "Krok indukcyjny",
    "points": 1,
    "description": "Poprawne wykazanie, że przy powyższym założeniu $1+3+\\cdots+(2k-1)+(2k+1)=k^2+2k+1=(k+1)^2$."
  },
  {
    "step": "Wniosek końcowy",
    "points": 1,
    "description": "Sformułowanie wniosku, że na mocy zasady indukcji matematycznej wzór jest prawdziwy dla każdej liczby naturalnej $n\\ge1$."
  }
]$g19$::jsonb
);

-- Problem 20 (difficulty=3, points_max=4, is_proof=true)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'ciagi'),
  $c20${
  "statement": "Ciąg $(a_n)$ jest określony wzorami $a_1=2$ oraz $a_{n+1}=2a_n$ dla $n\\ge1$. Wykaż przez indukcję matematyczną, że $a_n=2^n$ dla każdej liczby naturalnej $n\\ge1$."
}$c20$::jsonb,
  3,
  true,
  4,
  'topic',
  $g20$[
  {
    "step": "Krok bazowy",
    "points": 1,
    "description": "Sprawdzenie prawdziwości wzoru dla $n=1$: $a_1=2=2^1$."
  },
  {
    "step": "Założenie indukcyjne",
    "points": 1,
    "description": "Poprawne sformułowanie założenia indukcyjnego: zakładamy, że $a_k=2^k$ dla pewnego $k\\ge1$."
  },
  {
    "step": "Krok indukcyjny",
    "points": 1,
    "description": "Poprawne wykazanie, że przy powyższym założeniu $a_{k+1}=2a_k=2\\cdot2^k=2^{k+1}$."
  },
  {
    "step": "Wniosek końcowy",
    "points": 1,
    "description": "Sformułowanie wniosku, że na mocy zasady indukcji matematycznej wzór $a_n=2^n$ jest prawdziwy dla każdej liczby naturalnej $n\\ge1$."
  }
]$g20$::jsonb
);
