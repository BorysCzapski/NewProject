-- ============================================================================
-- supabase/seed/matma/03_problems_geometria-analityczna.sql
-- Problem bank (math_problems, source = 'topic') for the
-- "geometria-analityczna" department: równanie prostej, okręgu, wzajemne
-- położenie prostych/okręgów, symetrie, odległość punktu od prostej, pola
-- figur w układzie współrzędnych. 18 problems, difficulty distributed gently
-- (8 x difficulty=1, 6 x difficulty=2, 4 x difficulty=3, including 2 proof
-- problems).
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
where topic_id = (select id from math_topics where slug = 'geometria-analityczna')
  and source = 'topic';

-- Problem 1 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'geometria-analityczna'),
  $c1${
  "statement": "Oblicz odległość punktów $A=(0,0)$ i $B=(3,4)$.",
  "acceptedAnswers": [
    "5",
    "|AB|=5",
    "d(A,B)=5"
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
    "description": "Poprawne obliczenie odległości: $d(A,B)=\\sqrt{3^2+4^2}=\\sqrt{25}=5$."
  }
]$g1$::jsonb
);

-- Problem 2 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'geometria-analityczna'),
  $c2${
  "statement": "Wyznacz współrzędne środka odcinka $AB$, gdzie $A=(2,6)$ i $B=(8,-2)$.",
  "acceptedAnswers": [
    "(5,2)",
    "S=(5,2)"
  ]
}$c2$::jsonb,
  1,
  false,
  2,
  'topic',
  $g2$[
  {
    "step": "Obliczenie odciętej środka",
    "points": 1,
    "description": "Poprawne obliczenie $x_S=\\dfrac{2+8}{2}=5$."
  },
  {
    "step": "Obliczenie rzędnej środka i zapis wyniku",
    "points": 1,
    "description": "Poprawne obliczenie $y_S=\\dfrac{6+(-2)}{2}=2$ i podanie pełnego wyniku $S=(5,2)$."
  }
]$g2$::jsonb
);

-- Problem 3 (difficulty=1, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'geometria-analityczna'),
  $c3${
  "statement": "Wyznacz równanie prostej przechodzącej przez punkty $A=(0,1)$ i $B=(2,5)$ w postaci kierunkowej $y=ax+b$.",
  "acceptedAnswers": [
    "y=2x+1"
  ]
}$c3$::jsonb,
  1,
  false,
  3,
  'topic',
  $g3$[
  {
    "step": "Obliczenie współczynnika kierunkowego",
    "points": 1,
    "description": "Poprawne obliczenie $a=\\dfrac{5-1}{2-0}=2$."
  },
  {
    "step": "Wyznaczenie wyrazu wolnego",
    "points": 1,
    "description": "Poprawne podstawienie punktu $A$ i wyznaczenie $b=1$."
  },
  {
    "step": "Weryfikacja i zapis równania",
    "points": 1,
    "description": "Sprawdzenie równania na punkcie $B$ i poprawny zapis: $y=2x+1$."
  }
]$g3$::jsonb
);

-- Problem 4 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'geometria-analityczna'),
  $c4${
  "statement": "Zapisz równanie okręgu o środku $S=(3,-2)$ i promieniu $r=4$.",
  "acceptedAnswers": [
    "(x-3)^2+(y+2)^2=16"
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
    "description": "Poprawne równanie okręgu: $(x-3)^2+(y+2)^2=16$."
  }
]$g4$::jsonb
);

-- Problem 5 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'geometria-analityczna'),
  $c5${
  "statement": "Wyznacz środek i promień okręgu o równaniu $(x+1)^2+(y-5)^2=49$.",
  "acceptedAnswers": [
    "S=(-1,5), r=7",
    "(-1,5) i r=7"
  ]
}$c5$::jsonb,
  1,
  false,
  2,
  'topic',
  $g5$[
  {
    "step": "Odczytanie środka",
    "points": 1,
    "description": "Poprawne odczytanie środka okręgu: $S=(-1,5)$."
  },
  {
    "step": "Odczytanie promienia",
    "points": 1,
    "description": "Poprawne odczytanie promienia: $r=\\sqrt{49}=7$."
  }
]$g5$::jsonb
);

-- Problem 6 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'geometria-analityczna'),
  $c6${
  "statement": "Podaj współrzędne obrazu punktu $A=(4,-7)$ w symetrii względem osi OX.",
  "acceptedAnswers": [
    "(4,7)"
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
    "description": "Poprawny obraz punktu: $(4,7)$ (odcięta bez zmian, rzędna zmienia znak)."
  }
]$g6$::jsonb
);

-- Problem 7 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'geometria-analityczna'),
  $c7${
  "statement": "Podaj współrzędne obrazu punktu $B=(-5,3)$ w symetrii względem osi OY.",
  "acceptedAnswers": [
    "(5,3)"
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
    "description": "Poprawny obraz punktu: $(5,3)$ (rzędna bez zmian, odcięta zmienia znak)."
  }
]$g7$::jsonb
);

-- Problem 8 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'geometria-analityczna'),
  $c8${
  "statement": "Sprawdź, czy proste $k:\\ y=3x-2$ i $l:\\ y=3x+7$ są równoległe, prostopadłe, czy żadne z tych, i krótko uzasadnij.",
  "acceptedAnswers": [
    "równoległe",
    "proste równoległe",
    "są równoległe"
  ]
}$c8$::jsonb,
  1,
  false,
  2,
  'topic',
  $g8$[
  {
    "step": "Porównanie współczynników kierunkowych",
    "points": 1,
    "description": "Zauważenie, że obie proste mają ten sam współczynnik kierunkowy $a=3$."
  },
  {
    "step": "Wniosek",
    "points": 1,
    "description": "Poprawny wniosek: proste są równoległe i rozłączne, bo mają różne wyrazy wolne ($-2\\neq7$)."
  }
]$g8$::jsonb
);

-- Problem 9 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'geometria-analityczna'),
  $c9${
  "statement": "Wyznacz równanie prostej prostopadłej do prostej $k:\\ y=2x-5$ i przechodzącej przez punkt $A=(4,1)$.",
  "acceptedAnswers": [
    "y=-1/2x+3",
    "y=-0.5x+3"
  ]
}$c9$::jsonb,
  2,
  false,
  3,
  'topic',
  $g9$[
  {
    "step": "Wyznaczenie współczynnika kierunkowego",
    "points": 1,
    "description": "Poprawne wyznaczenie współczynnika kierunkowego szukanej prostej: $a=-\\dfrac12$ (z warunku prostopadłości $a\\cdot2=-1$)."
  },
  {
    "step": "Podstawienie punktu A",
    "points": 1,
    "description": "Poprawne podstawienie współrzędnych punktu $A$ do równania $y=-\\tfrac12x+b$ i wyznaczenie $b=3$."
  },
  {
    "step": "Zapis równania",
    "points": 1,
    "description": "Poprawny pełny zapis równania: $y=-\\dfrac12x+3$."
  }
]$g9$::jsonb
);

-- Problem 10 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'geometria-analityczna'),
  $c10${
  "statement": "Oblicz odległość punktu $P=(3,4)$ od prostej $l:\\ 4x-3y+1=0$.",
  "acceptedAnswers": [
    "1/5",
    "0.2"
  ]
}$c10$::jsonb,
  2,
  false,
  3,
  'topic',
  $g10$[
  {
    "step": "Podstawienie do wzoru",
    "points": 1,
    "description": "Poprawne podstawienie współrzędnych punktu $P$ do wzoru $d=\\dfrac{|Ax_0+By_0+C|}{\\sqrt{A^2+B^2}}$."
  },
  {
    "step": "Obliczenie licznika i mianownika",
    "points": 1,
    "description": "Poprawne obliczenie: licznik $|4\\cdot3-3\\cdot4+1|=1$, mianownik $\\sqrt{16+9}=5$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawny wynik: $d=\\dfrac15=0{,}2$."
  }
]$g10$::jsonb
);

-- Problem 11 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'geometria-analityczna'),
  $c11${
  "statement": "Zbadaj wzajemne położenie prostej $l:\\ y=x+3$ oraz okręgu o równaniu $x^2+y^2=8$ (odpowiedz: styczne, sieczne czy rozłączne).",
  "acceptedAnswers": [
    "sieczna",
    "proste sieczne",
    "sieczne, 2 punkty wspólne"
  ]
}$c11$::jsonb,
  2,
  false,
  3,
  'topic',
  $g11$[
  {
    "step": "Odległość środka od prostej",
    "points": 1,
    "description": "Poprawne obliczenie odległości środka okręgu $(0,0)$ od prostej $x-y+3=0$: $d=\\dfrac{3}{\\sqrt2}$."
  },
  {
    "step": "Porównanie z promieniem",
    "points": 1,
    "description": "Poprawne porównanie: $r=\\sqrt8=2\\sqrt2$ oraz $d=\\dfrac{3}{\\sqrt2}<2\\sqrt2=r$."
  },
  {
    "step": "Wniosek",
    "points": 1,
    "description": "Poprawny wniosek: prosta jest sieczna do okręgu (ma z nim dwa punkty wspólne)."
  }
]$g11$::jsonb
);

-- Problem 12 (difficulty=2, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'geometria-analityczna'),
  $c12${
  "statement": "Wyznacz obraz $A'$ punktu $A=(2,-3)$ w symetrii względem punktu $S=(1,4)$.",
  "acceptedAnswers": [
    "(0,11)",
    "A'=(0,11)"
  ]
}$c12$::jsonb,
  2,
  false,
  4,
  'topic',
  $g12$[
  {
    "step": "Zastosowanie wzoru symetrii",
    "points": 1,
    "description": "Poprawne zastosowanie wzoru $A'=(2p-x_A,\\ 2q-y_A)$."
  },
  {
    "step": "Obliczenie odciętej obrazu",
    "points": 1,
    "description": "Poprawne obliczenie $x_{A'}=2\\cdot1-2=0$."
  },
  {
    "step": "Obliczenie rzędnej obrazu",
    "points": 1,
    "description": "Poprawne obliczenie $y_{A'}=2\\cdot4-(-3)=11$."
  },
  {
    "step": "Zapis wyniku",
    "points": 1,
    "description": "Poprawny pełny zapis: $A'=(0,11)$."
  }
]$g12$::jsonb
);

-- Problem 13 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'geometria-analityczna'),
  $c13${
  "statement": "Oblicz pole trójkąta o wierzchołkach $A=(1,1)$, $B=(7,1)$, $C=(4,5)$.",
  "acceptedAnswers": [
    "12",
    "P=12"
  ]
}$c13$::jsonb,
  2,
  false,
  3,
  'topic',
  $g13$[
  {
    "step": "Wybór metody",
    "points": 1,
    "description": "Poprawne zastosowanie wzoru wyznacznikowego (lub metody podstawa-wysokość, skoro $AB$ jest poziomy)."
  },
  {
    "step": "Obliczenia",
    "points": 1,
    "description": "Poprawne obliczenia pośrednie, np. $P=\\dfrac12|1\\cdot(1-5)+7\\cdot(5-1)+4\\cdot(1-1)|=\\dfrac12\\cdot24$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawny wynik: $P=12$."
  }
]$g13$::jsonb
);

-- Problem 14 (difficulty=2, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'geometria-analityczna'),
  $c14${
  "statement": "Dla jakiej wartości parametru $m$ proste $k:\\ y=mx+2$ i $l:\\ y=3x-5$ są równoległe, a dla jakiej wartości $m$ są prostopadłe? Podaj obie wartości."
}$c14$::jsonb,
  2,
  false,
  4,
  'topic',
  $g14$[
  {
    "step": "Warunek równoległości",
    "points": 2,
    "description": "Zapisanie warunku $m=3$ (równe współczynniki kierunkowe) i poprawne wyznaczenie tej wartości."
  },
  {
    "step": "Warunek prostopadłości",
    "points": 2,
    "description": "Zapisanie warunku $m\\cdot3=-1$ i poprawne wyznaczenie $m=-\\dfrac13$."
  }
]$g14$::jsonb
);

-- Problem 15 (difficulty=3, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'geometria-analityczna'),
  $c15${
  "statement": "Wyznacz równanie okręgu opisanego na trójkącie prostokątnym o wierzchołkach $A=(0,0)$, $B=(6,0)$, $C=(0,8)$ (kąt prosty jest przy wierzchołku $A$).",
  "acceptedAnswers": [
    "(x-3)^2+(y-4)^2=25"
  ]
}$c15$::jsonb,
  3,
  false,
  4,
  'topic',
  $g15$[
  {
    "step": "Rozpoznanie przeciwprostokątnej jako średnicy",
    "points": 1,
    "description": "Zauważenie, że skoro kąt przy $A$ jest prosty, to bok $BC$ (przeciwprostokątna) jest średnicą okręgu opisanego na trójkącie."
  },
  {
    "step": "Wyznaczenie środka",
    "points": 1,
    "description": "Poprawne obliczenie środka jako środka odcinka $BC$: $S=(3,4)$."
  },
  {
    "step": "Wyznaczenie promienia",
    "points": 1,
    "description": "Poprawne obliczenie promienia jako połowy długości $BC$: $r=\\dfrac{\\sqrt{6^2+8^2}}{2}=5$."
  },
  {
    "step": "Zapis równania",
    "points": 1,
    "description": "Poprawny zapis równania okręgu: $(x-3)^2+(y-4)^2=25$."
  }
]$g15$::jsonb
);

-- Problem 16 (difficulty=3, points_max=5, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'geometria-analityczna'),
  $c16${
  "statement": "Proste $k:\\ (m-1)x+2y-3=0$ oraz $l:\\ 3x+my+1=0$ są równoległe. Wyznacz wszystkie wartości parametru $m$.",
  "acceptedAnswers": [
    "m=3 lub m=-2",
    "m=-2 lub m=3"
  ]
}$c16$::jsonb,
  3,
  false,
  5,
  'topic',
  $g16$[
  {
    "step": "Warunek równoległości",
    "points": 1,
    "description": "Poprawne zapisanie warunku równoległości dla postaci ogólnej: $A_1B_2-A_2B_1=0$."
  },
  {
    "step": "Ułożenie równania",
    "points": 2,
    "description": "Poprawne podstawienie współczynników i rozwiązanie równania kwadratowego $m^2-m-6=0$."
  },
  {
    "step": "Podanie obu wartości",
    "points": 1,
    "description": "Poprawne wyznaczenie obu pierwiastków: $m=3$ lub $m=-2$."
  },
  {
    "step": "Weryfikacja",
    "points": 1,
    "description": "Sprawdzenie, że dla obu wartości $m$ proste są równoległe i rozłączne (nie pokrywają się)."
  }
]$g16$::jsonb
);

-- Problem 17 (difficulty=3, points_max=4, is_proof=true)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'geometria-analityczna'),
  $c17${
  "statement": "Wykaż, że punkty $A=(1,2)$, $B=(4,6)$ i $C=(7,10)$ są współliniowe."
}$c17$::jsonb,
  3,
  true,
  4,
  'topic',
  $g17$[
  {
    "step": "Obliczenie współczynnika kierunkowego AB",
    "points": 1,
    "description": "Poprawne obliczenie współczynnika kierunkowego prostej $AB$: $a_{AB}=\\dfrac{6-2}{4-1}=\\dfrac43$."
  },
  {
    "step": "Obliczenie współczynnika kierunkowego BC",
    "points": 1,
    "description": "Poprawne obliczenie współczynnika kierunkowego prostej $BC$: $a_{BC}=\\dfrac{10-6}{7-4}=\\dfrac43$."
  },
  {
    "step": "Porównanie wyników",
    "points": 1,
    "description": "Zauważenie, że $a_{AB}=a_{BC}$ i obie proste przechodzą przez wspólny punkt $B$, więc jest to jedna i ta sama prosta."
  },
  {
    "step": "Wniosek kończący dowód",
    "points": 1,
    "description": "Poprawny wniosek: skoro $A$, $B$, $C$ leżą na jednej prostej, punkty te są współliniowe, co kończy dowód."
  }
]$g17$::jsonb
);

-- Problem 18 (difficulty=3, points_max=5, is_proof=true)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'geometria-analityczna'),
  $c18${
  "statement": "Wykaż, że czworokąt o wierzchołkach $A=(0,0)$, $B=(4,1)$, $C=(6,5)$, $D=(2,4)$ jest równoległobokiem."
}$c18$::jsonb,
  3,
  true,
  5,
  'topic',
  $g18$[
  {
    "step": "Obliczenie wektora AB",
    "points": 1,
    "description": "Poprawne obliczenie wektora $\\overrightarrow{AB}=(4-0,\\ 1-0)=(4,1)$."
  },
  {
    "step": "Obliczenie wektora DC",
    "points": 1,
    "description": "Poprawne obliczenie wektora $\\overrightarrow{DC}=(6-2,\\ 5-4)=(4,1)$."
  },
  {
    "step": "Porównanie wektorów",
    "points": 1,
    "description": "Zauważenie, że $\\overrightarrow{AB}=\\overrightarrow{DC}$, więc odcinki $AB$ i $DC$ są równoległe i równej długości."
  },
  {
    "step": "Wniosek kończący dowód",
    "points": 2,
    "description": "Poprawny wniosek: skoro jedna para przeciwległych boków czworokąta $ABCD$ jest równoległa i ma równą długość, czworokąt ten jest równoległobokiem, co kończy dowód."
  }
]$g18$::jsonb
);
