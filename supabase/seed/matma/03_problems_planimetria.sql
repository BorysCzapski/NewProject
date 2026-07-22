-- ============================================================================
-- supabase/seed/matma/03_problems_planimetria.sql
-- Problem bank (math_problems, source = 'topic') for the "planimetria"
-- department: twierdzenia o trójkątach, czworokątach, okręgach, podobieństwo
-- figur, trygonometria w geometrii płaskiej. 18 problems, difficulty
-- distributed gently (8 x difficulty=1, 6 x difficulty=2, 4 x difficulty=3,
-- including 2 proof problems among the difficulty=3 set).
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
where topic_id = (select id from math_topics where slug = 'planimetria')
  and source = 'topic';

-- Problem 1 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'planimetria'),
  $c1${
  "statement": "W trójkącie prostokątnym przyprostokątne mają długości $6$ i $8$. Oblicz długość przeciwprostokątnej.",
  "acceptedAnswers": [
    "10",
    "c=10"
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
    "description": "Poprawne zastosowanie twierdzenia Pitagorasa i obliczenie: $c=\\sqrt{6^2+8^2}=\\sqrt{100}=10$."
  }
]$g1$::jsonb
);

-- Problem 2 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'planimetria'),
  $c2${
  "statement": "Ile wynosi suma miar kątów wewnętrznych dowolnego czworokąta wypukłego?",
  "acceptedAnswers": [
    "360°",
    "360"
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
    "description": "Poprawne podanie sumy kątów czworokąta: $360^\\circ$."
  }
]$g2$::jsonb
);

-- Problem 3 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'planimetria'),
  $c3${
  "statement": "Oblicz pole trójkąta o podstawie $12$ cm i wysokości $5$ cm opuszczonej na tę podstawę.",
  "acceptedAnswers": [
    "30",
    "P=30"
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
    "description": "Poprawne obliczenie: $P=\\frac12\\cdot12\\cdot5=30$."
  }
]$g3$::jsonb
);

-- Problem 4 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'planimetria'),
  $c4${
  "statement": "Kąt wpisany w okrąg jest oparty na tym samym łuku co kąt środkowy o mierze $100^\\circ$. Oblicz miarę kąta wpisanego.",
  "acceptedAnswers": [
    "50°",
    "50"
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
    "description": "Kąt wpisany jest połową kąta środkowego opartego na tym samym łuku: $100^\\circ:2=50^\\circ$."
  }
]$g4$::jsonb
);

-- Problem 5 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'planimetria'),
  $c5${
  "statement": "Przekątne rombu mają długości $8$ cm i $6$ cm. Oblicz pole rombu.",
  "acceptedAnswers": [
    "24",
    "P=24"
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
    "description": "Poprawne obliczenie: $P=\\frac{8\\cdot6}{2}=24$."
  }
]$g5$::jsonb
);

-- Problem 6 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'planimetria'),
  $c6${
  "statement": "Sprawdź, czy trójkąt o bokach $9$, $12$ i $15$ jest prostokątny. Odpowiedz „tak” lub „nie”.",
  "acceptedAnswers": [
    "tak"
  ]
}$c6$::jsonb,
  1,
  false,
  2,
  'topic',
  $g6$[
  {
    "step": "Obliczenie kwadratów",
    "points": 1,
    "description": "Obliczenie $9^2+12^2=81+144=225$ oraz $15^2=225$."
  },
  {
    "step": "Wniosek",
    "points": 1,
    "description": "Stwierdzenie, że $9^2+12^2=15^2$, więc na mocy odwrotności twierdzenia Pitagorasa trójkąt jest prostokątny (odpowiedź: tak)."
  }
]$g6$::jsonb
);

-- Problem 7 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'planimetria'),
  $c7${
  "statement": "Pole prostokąta wynosi $48\\ \\text{cm}^2$, a jeden z jego boków ma długość $6$ cm. Oblicz długość drugiego boku.",
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
    "description": "Poprawne obliczenie: $b=48:6=8$."
  }
]$g7$::jsonb
);

-- Problem 8 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'planimetria'),
  $c8${
  "statement": "W trapezie podstawy mają długości $10$ cm i $14$ cm, a wysokość trapezu wynosi $5$ cm. Oblicz pole trapezu.",
  "acceptedAnswers": [
    "60",
    "P=60"
  ]
}$c8$::jsonb,
  1,
  false,
  2,
  'topic',
  $g8$[
  {
    "step": "Obliczenie średniej podstaw",
    "points": 1,
    "description": "Obliczenie $\\frac{10+14}{2}=12$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne obliczenie: $P=12\\cdot5=60$."
  }
]$g8$::jsonb
);

-- Problem 9 (difficulty=2, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'planimetria'),
  $c9${
  "statement": "W trójkącie $ABC$ dane są: $a=10$, $\\alpha=30^\\circ$, $\\beta=60^\\circ$. Oblicz długość boku $b$, korzystając z twierdzenia sinusów.",
  "acceptedAnswers": [
    "10\\sqrt{3}",
    "10sqrt3",
    "b=10\\sqrt3"
  ]
}$c9$::jsonb,
  2,
  false,
  2,
  'topic',
  $g9$[
  {
    "step": "Zapisanie proporcji",
    "points": 1,
    "description": "Zapisanie $\\frac{a}{\\sin\\alpha}=\\frac{b}{\\sin\\beta}$ i wyznaczenie $b=\\frac{a\\sin\\beta}{\\sin\\alpha}$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne obliczenie: $b=\\frac{10\\cdot\\sin60^\\circ}{\\sin30^\\circ}=10\\sqrt3$."
  }
]$g9$::jsonb
);

-- Problem 10 (difficulty=2, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'planimetria'),
  $c10${
  "statement": "W trójkącie kąt między bokami $a=6$ i $b=9$ wynosi $\\gamma=30^\\circ$. Oblicz pole tego trójkąta.",
  "acceptedAnswers": [
    "13.5",
    "P=13.5"
  ]
}$c10$::jsonb,
  2,
  false,
  2,
  'topic',
  $g10$[
  {
    "step": "Zastosowanie wzoru",
    "points": 1,
    "description": "Zapisanie wzoru $P=\\frac12ab\\sin\\gamma$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne obliczenie: $P=\\frac12\\cdot6\\cdot9\\cdot\\sin30^\\circ=27\\cdot\\frac12=13.5$."
  }
]$g10$::jsonb
);

-- Problem 11 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'planimetria'),
  $c11${
  "statement": "Trójkąt równoboczny ma bok długości $6$. Oblicz promień okręgu opisanego na tym trójkącie.",
  "acceptedAnswers": [
    "2\\sqrt{3}",
    "R=2\\sqrt3"
  ]
}$c11$::jsonb,
  2,
  false,
  3,
  'topic',
  $g11$[
  {
    "step": "Zastosowanie twierdzenia sinusów",
    "points": 1,
    "description": "Zauważenie, że w trójkącie równobocznym każdy kąt ma miarę $60^\\circ$, i zapisanie $2R=\\frac{a}{\\sin60^\\circ}$."
  },
  {
    "step": "Obliczenie $2R$",
    "points": 1,
    "description": "Poprawne obliczenie: $2R=\\frac{6}{\\frac{\\sqrt3}{2}}=\\frac{12}{\\sqrt3}=4\\sqrt3$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne wyznaczenie: $R=2\\sqrt3$."
  }
]$g11$::jsonb
);

-- Problem 12 (difficulty=2, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'planimetria'),
  $c12${
  "statement": "Trójkąt jest wpisany w okrąg, a jeden z jego boków jest średnicą tego okręgu. Jeden z pozostałych kątów trójkąta ma miarę $40^\\circ$. Oblicz miarę trzeciego kąta.",
  "acceptedAnswers": [
    "50°",
    "50"
  ]
}$c12$::jsonb,
  2,
  false,
  2,
  'topic',
  $g12$[
  {
    "step": "Rozpoznanie kąta prostego",
    "points": 1,
    "description": "Rozpoznanie (twierdzenie o kącie wpisanym opartym na średnicy), że kąt naprzeciw średnicy ma miarę $90^\\circ$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne obliczenie trzeciego kąta: $180^\\circ-90^\\circ-40^\\circ=50^\\circ$."
  }
]$g12$::jsonb
);

-- Problem 13 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'planimetria'),
  $c13${
  "statement": "Oblicz pole trójkąta o bokach $7$, $8$ i $9$, korzystając ze wzoru Herona.",
  "acceptedAnswers": [
    "12\\sqrt{5}",
    "12\\sqrt5"
  ]
}$c13$::jsonb,
  2,
  false,
  3,
  'topic',
  $g13$[
  {
    "step": "Obliczenie połowy obwodu",
    "points": 1,
    "description": "Obliczenie $p=\\frac{7+8+9}{2}=12$."
  },
  {
    "step": "Obliczenie iloczynu pod pierwiastkiem",
    "points": 1,
    "description": "Obliczenie $p(p-a)(p-b)(p-c)=12\\cdot5\\cdot4\\cdot3=720$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Uproszczenie pierwiastka: $P=\\sqrt{720}=\\sqrt{144\\cdot5}=12\\sqrt5$."
  }
]$g13$::jsonb
);

-- Problem 14 (difficulty=2, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'planimetria'),
  $c14${
  "statement": "W trójkącie prostokątnym przyprostokątne mają długości $9$ i $12$. Oblicz promień okręgu wpisanego w ten trójkąt.",
  "acceptedAnswers": [
    "3",
    "r=3"
  ]
}$c14$::jsonb,
  2,
  false,
  4,
  'topic',
  $g14$[
  {
    "step": "Obliczenie przeciwprostokątnej",
    "points": 1,
    "description": "Z twierdzenia Pitagorasa: $c=\\sqrt{9^2+12^2}=\\sqrt{225}=15$."
  },
  {
    "step": "Obliczenie połowy obwodu",
    "points": 1,
    "description": "Obliczenie $p=\\frac{9+12+15}{2}=18$."
  },
  {
    "step": "Obliczenie pola",
    "points": 1,
    "description": "Obliczenie $P=\\frac12\\cdot9\\cdot12=54$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne obliczenie: $r=\\frac{P}{p}=\\frac{54}{18}=3$."
  }
]$g14$::jsonb
);

-- Problem 15 (difficulty=3, points_max=5, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'planimetria'),
  $c15${
  "statement": "W trójkącie $ABC$ dane są $a=8$, $b=5$ oraz kąt między nimi $\\gamma=60^\\circ$. Oblicz długość boku $c$ oraz pole trójkąta $ABC$.",
  "acceptedAnswers": [
    "c=7, P=10\\sqrt{3}",
    "c=7 i P=10sqrt3"
  ]
}$c15$::jsonb,
  3,
  false,
  5,
  'topic',
  $g15$[
  {
    "step": "Zastosowanie twierdzenia cosinusów",
    "points": 2,
    "description": "Zapisanie wzoru $c^2=a^2+b^2-2ab\\cos\\gamma$ i obliczenie $c^2=64+25-2\\cdot8\\cdot5\\cdot\\frac12=49$."
  },
  {
    "step": "Wyznaczenie boku $c$",
    "points": 1,
    "description": "Poprawne obliczenie: $c=\\sqrt{49}=7$."
  },
  {
    "step": "Zastosowanie wzoru na pole",
    "points": 1,
    "description": "Zapisanie wzoru $P=\\frac12ab\\sin\\gamma$."
  },
  {
    "step": "Obliczenie pola",
    "points": 1,
    "description": "Poprawne obliczenie: $P=\\frac12\\cdot8\\cdot5\\cdot\\sin60^\\circ=20\\cdot\\frac{\\sqrt3}{2}=10\\sqrt3$."
  }
]$g15$::jsonb
);

-- Problem 16 (difficulty=3, points_max=5, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'planimetria'),
  $c16${
  "statement": "Z punktu $P$ leżącego w odległości $25$ cm od środka $O$ okręgu o promieniu $r=7$ cm poprowadzono dwie styczne do okręgu, o punktach styczności $T_1$ i $T_2$. Oblicz długość odcinka stycznej $PT_1$ oraz pole czworokąta $OT_1PT_2$.",
  "acceptedAnswers": [
    "PT_1=24, P=168",
    "24 i 168"
  ]
}$c16$::jsonb,
  3,
  false,
  5,
  'topic',
  $g16$[
  {
    "step": "Rozpoznanie kąta prostego",
    "points": 1,
    "description": "Rozpoznanie, że promień $OT_1$ jest prostopadły do stycznej $PT_1$, więc trójkąt $OPT_1$ jest prostokątny, z przeciwprostokątną $OP$."
  },
  {
    "step": "Obliczenie długości stycznej",
    "points": 1,
    "description": "Zastosowanie twierdzenia Pitagorasa: $PT_1=\\sqrt{OP^2-OT_1^2}=\\sqrt{25^2-7^2}=\\sqrt{576}=24$."
  },
  {
    "step": "Rozłożenie czworokąta na trójkąty",
    "points": 1,
    "description": "Zauważenie, że czworokąt $OT_1PT_2$ składa się z dwóch przystających trójkątów prostokątnych $OT_1P$ i $OT_2P$."
  },
  {
    "step": "Obliczenie pola czworokąta",
    "points": 2,
    "description": "Obliczenie pola jednego trójkąta $\\frac12\\cdot7\\cdot24=84$ i podwojenie go: $P=2\\cdot84=168$."
  }
]$g16$::jsonb
);

-- Problem 17 (difficulty=3, points_max=4, is_proof=true)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'planimetria'),
  $c17${
  "statement": "Trójkąt $ABC$ ma kąt prosty przy wierzchołku $C$. Punkt $M$ jest środkiem przeciwprostokątnej $AB$. Wykaż, że długość środkowej $CM$ (poprowadzonej z wierzchołka $C$) jest równa połowie długości przeciwprostokątnej $AB$."
}$c17$::jsonb,
  3,
  true,
  4,
  'topic',
  $g17$[
  {
    "step": "Wprowadzenie układu współrzędnych",
    "points": 1,
    "description": "Umieszczenie wierzchołka $C$ w początku układu współrzędnych oraz wierzchołków $A=(a,0)$, $B=(0,b)$ na osiach (możliwe, bo kąt przy $C$ jest prosty)."
  },
  {
    "step": "Wyznaczenie współrzędnych punktu $M$",
    "points": 1,
    "description": "Obliczenie współrzędnych środka przeciwprostokątnej: $M=\\left(\\frac{a}{2},\\frac{b}{2}\\right)$."
  },
  {
    "step": "Obliczenie długości $CM$",
    "points": 1,
    "description": "Obliczenie $CM=\\sqrt{\\left(\\frac{a}{2}\\right)^2+\\left(\\frac{b}{2}\\right)^2}=\\frac12\\sqrt{a^2+b^2}$."
  },
  {
    "step": "Wniosek końcowy",
    "points": 1,
    "description": "Zauważenie, że $AB=\\sqrt{a^2+b^2}$ (twierdzenie Pitagorasa), a więc $CM=\\frac12AB$ — co należało wykazać."
  }
]$g17$::jsonb
);

-- Problem 18 (difficulty=3, points_max=4, is_proof=true)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'planimetria'),
  $c18${
  "statement": "Przekątne rombu $ABCD$ przecinają się w punkcie $O$. Wiedząc, że przekątne równoległoboku dzielą się na połowy, wykaż, że przekątne rombu są prostopadłe, tzn. $AC\\perp BD$."
}$c18$::jsonb,
  3,
  true,
  4,
  'topic',
  $g18$[
  {
    "step": "Wprowadzenie wektorów",
    "points": 1,
    "description": "Oznaczenie wektorów $\\vec{OA}=\\vec p$, $\\vec{OB}=\\vec q$ i wykorzystanie faktu, że przekątne równoległoboku dzielą się na połowy, skąd $\\vec{OC}=-\\vec p$, $\\vec{OD}=-\\vec q$."
  },
  {
    "step": "Zapisanie warunku równości boków",
    "points": 1,
    "description": "Zapisanie boków rombu jako wektorów $\\vec{AB}=\\vec q-\\vec p$, $\\vec{BC}=-\\vec p-\\vec q$ oraz warunku $|\\vec{AB}|=|\\vec{BC}|$, wynikającego z tego, że w rombie wszystkie boki mają równą długość."
  },
  {
    "step": "Przekształcenie równości długości",
    "points": 1,
    "description": "Podniesienie obu stron do kwadratu: $|\\vec q-\\vec p|^2=|\\vec p+\\vec q|^2$, czyli $|\\vec p|^2-2\\vec p\\cdot\\vec q+|\\vec q|^2=|\\vec p|^2+2\\vec p\\cdot\\vec q+|\\vec q|^2$, skąd $-2\\vec p\\cdot\\vec q=2\\vec p\\cdot\\vec q$."
  },
  {
    "step": "Wniosek końcowy",
    "points": 1,
    "description": "Otrzymanie $4\\vec p\\cdot\\vec q=0$, czyli $\\vec p\\cdot\\vec q=0$, co oznacza $\\vec{OA}\\perp\\vec{OB}$, a więc przekątne $AC$ i $BD$ rombu są prostopadłe — co należało wykazać."
  }
]$g18$::jsonb
);
