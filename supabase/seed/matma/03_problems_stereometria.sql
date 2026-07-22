-- ============================================================================
-- supabase/seed/matma/03_problems_stereometria.sql
-- Problem bank (math_problems, source = 'topic') for the "stereometria"
-- department: graniastosłupy, ostrosłupy, walec, stożek, kula, przekroje,
-- kąty między prostymi/płaszczyznami, pola powierzchni i objętości. 18
-- problems, difficulty distributed gently (8 x difficulty=1, 6 x
-- difficulty=2, 4 x difficulty=3, including 2 proof problems among the
-- difficulty=3 set).
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
where topic_id = (select id from math_topics where slug = 'stereometria')
  and source = 'topic';

-- Problem 1 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'stereometria'),
  $c1${
  "statement": "Prostopadłościan ma krawędzie $a=6$, $b=4$, $c=3$ (wszystkie długości w centymetrach). Oblicz objętość tego prostopadłościanu.",
  "acceptedAnswers": [
    "72",
    "V=72"
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
    "description": "Poprawne obliczenie: $V=a\\cdot b\\cdot c=6\\cdot4\\cdot3=72\\ \\text{cm}^3$."
  }
]$g1$::jsonb
);

-- Problem 2 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'stereometria'),
  $c2${
  "statement": "Sześcian ma krawędź $a=4$ cm. Oblicz pole powierzchni całkowitej tego sześcianu.",
  "acceptedAnswers": [
    "96",
    "Pc=96"
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
    "description": "Poprawne obliczenie: $P_c=6a^2=6\\cdot16=96\\ \\text{cm}^2$."
  }
]$g2$::jsonb
);

-- Problem 3 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'stereometria'),
  $c3${
  "statement": "Sześcian ma krawędź $a=5$ cm. Oblicz objętość tego sześcianu.",
  "acceptedAnswers": [
    "125",
    "V=125"
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
    "description": "Poprawne obliczenie: $V=a^3=5^3=125\\ \\text{cm}^3$."
  }
]$g3$::jsonb
);

-- Problem 4 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'stereometria'),
  $c4${
  "statement": "Podstawą graniastosłupa prawidłowego trójkątnego jest trójkąt równoboczny o krawędzi $a=6$. Oblicz pole podstawy tego graniastosłupa.",
  "acceptedAnswers": [
    "9\\sqrt3",
    "9sqrt3",
    "9√3"
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
    "description": "Poprawne zastosowanie wzoru na pole trójkąta równobocznego: $P_p=\\frac{a^2\\sqrt3}{4}=\\frac{36\\sqrt3}{4}=9\\sqrt3$."
  }
]$g4$::jsonb
);

-- Problem 5 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'stereometria'),
  $c5${
  "statement": "Walec ma promień podstawy $r=2$ i wysokość $h=9$. Oblicz objętość tego walca.",
  "acceptedAnswers": [
    "36\\pi",
    "36pi",
    "V=36\\pi"
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
    "description": "Poprawne obliczenie: $V=\\pi r^2h=\\pi\\cdot4\\cdot9=36\\pi$."
  }
]$g5$::jsonb
);

-- Problem 6 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'stereometria'),
  $c6${
  "statement": "Kula ma promień $r=5$. Oblicz pole jej powierzchni.",
  "acceptedAnswers": [
    "100\\pi",
    "100pi",
    "P=100\\pi"
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
    "description": "Poprawne obliczenie: $P=4\\pi r^2=4\\pi\\cdot25=100\\pi$."
  }
]$g6$::jsonb
);

-- Problem 7 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'stereometria'),
  $c7${
  "statement": "Stożek ma promień podstawy $r=3$ i wysokość $h=8$. Oblicz objętość tego stożka.",
  "acceptedAnswers": [
    "24\\pi",
    "24pi",
    "V=24\\pi"
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
    "description": "Poprawne obliczenie: $V=\\frac13\\pi r^2h=\\frac13\\pi\\cdot9\\cdot8=24\\pi$."
  }
]$g7$::jsonb
);

-- Problem 8 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'stereometria'),
  $c8${
  "statement": "Prostopadłościan ma krawędzie $a=2$, $b=3$, $c=6$. Oblicz długość przekątnej tego prostopadłościanu.",
  "acceptedAnswers": [
    "7",
    "d=7"
  ]
}$c8$::jsonb,
  1,
  false,
  2,
  'topic',
  $g8$[
  {
    "step": "Obliczenie sumy kwadratów krawędzi",
    "points": 1,
    "description": "Obliczenie $a^2+b^2+c^2=4+9+36=49$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne obliczenie: $d=\\sqrt{49}=7$."
  }
]$g8$::jsonb
);

-- Problem 9 (difficulty=2, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'stereometria'),
  $c9${
  "statement": "Prostopadłościan ma krawędzie $a=5$, $b=4$, $c=3$. Oblicz pole powierzchni całkowitej tego prostopadłościanu.",
  "acceptedAnswers": [
    "94",
    "Pc=94"
  ]
}$c9$::jsonb,
  2,
  false,
  2,
  'topic',
  $g9$[
  {
    "step": "Obliczenie pól trzech par ścian",
    "points": 1,
    "description": "Obliczenie $ab=20$, $bc=12$, $ca=15$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne obliczenie: $P_c=2(20+12+15)=2\\cdot47=94$."
  }
]$g9$::jsonb
);

-- Problem 10 (difficulty=2, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'stereometria'),
  $c10${
  "statement": "Ostrosłup ma pole podstawy $P_p=20$ i wysokość $H=6$. Oblicz objętość tego ostrosłupa.",
  "acceptedAnswers": [
    "40",
    "V=40"
  ]
}$c10$::jsonb,
  2,
  false,
  2,
  'topic',
  $g10$[
  {
    "step": "Zapisanie wzoru na objętość ostrosłupa",
    "points": 1,
    "description": "Zapisanie wzoru $V=\\frac13P_p\\cdot H$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne obliczenie: $V=\\frac13\\cdot20\\cdot6=40$."
  }
]$g10$::jsonb
);

-- Problem 11 (difficulty=2, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'stereometria'),
  $c11${
  "statement": "Walec ma promień podstawy $r=4$ i wysokość $h=6$. Oblicz pole powierzchni całkowitej tego walca.",
  "acceptedAnswers": [
    "80\\pi",
    "80pi",
    "Pc=80\\pi"
  ]
}$c11$::jsonb,
  2,
  false,
  2,
  'topic',
  $g11$[
  {
    "step": "Zastosowanie wzoru",
    "points": 1,
    "description": "Zapisanie wzoru $P_c=2\\pi r(r+h)$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne obliczenie: $P_c=2\\pi\\cdot4\\cdot(4+6)=2\\pi\\cdot4\\cdot10=80\\pi$."
  }
]$g11$::jsonb
);

-- Problem 12 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'stereometria'),
  $c12${
  "statement": "Stożek ma promień podstawy $r=5$ i wysokość $h=12$. Oblicz pole powierzchni całkowitej tego stożka.",
  "acceptedAnswers": [
    "90\\pi",
    "90pi",
    "Pc=90\\pi"
  ]
}$c12$::jsonb,
  2,
  false,
  3,
  'topic',
  $g12$[
  {
    "step": "Obliczenie tworzącej",
    "points": 1,
    "description": "Zastosowanie twierdzenia Pitagorasa: $l=\\sqrt{r^2+h^2}=\\sqrt{25+144}=\\sqrt{169}=13$."
  },
  {
    "step": "Zastosowanie wzoru na pole powierzchni",
    "points": 1,
    "description": "Zapisanie wzoru $P_c=\\pi r(r+l)$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne obliczenie: $P_c=\\pi\\cdot5\\cdot(5+13)=\\pi\\cdot5\\cdot18=90\\pi$."
  }
]$g12$::jsonb
);

-- Problem 13 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'stereometria'),
  $c13${
  "statement": "Podstawą graniastosłupa prawidłowego jest sześciokąt foremny o krawędzi $a=3$. Wysokość graniastosłupa wynosi $H=4$. Oblicz objętość tego graniastosłupa.",
  "acceptedAnswers": [
    "54\\sqrt3",
    "54sqrt3",
    "54√3"
  ]
}$c13$::jsonb,
  2,
  false,
  3,
  'topic',
  $g13$[
  {
    "step": "Obliczenie pola podstawy",
    "points": 1,
    "description": "Zastosowanie wzoru na pole sześciokąta foremnego: $P_p=\\frac{3a^2\\sqrt3}{2}=\\frac{3\\cdot9\\cdot\\sqrt3}{2}=\\frac{27\\sqrt3}{2}$."
  },
  {
    "step": "Zastosowanie wzoru na objętość",
    "points": 1,
    "description": "Zapisanie wzoru $V=P_p\\cdot H$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne obliczenie: $V=\\frac{27\\sqrt3}{2}\\cdot4=54\\sqrt3$."
  }
]$g13$::jsonb
);

-- Problem 14 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'stereometria'),
  $c14${
  "statement": "Objętość pewnej kuli wynosi $V=36\\pi$. Oblicz promień tej kuli.",
  "acceptedAnswers": [
    "3",
    "r=3"
  ]
}$c14$::jsonb,
  2,
  false,
  3,
  'topic',
  $g14$[
  {
    "step": "Zapisanie równania",
    "points": 1,
    "description": "Zapisanie równania $\\frac43\\pi r^3=36\\pi$."
  },
  {
    "step": "Wyznaczenie $r^3$",
    "points": 1,
    "description": "Podzielenie obu stron przez $\\pi$ i pomnożenie przez $\\frac34$: $r^3=36\\cdot\\frac34=27$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne obliczenie: $r=\\sqrt[3]{27}=3$."
  }
]$g14$::jsonb
);

-- Problem 15 (difficulty=3, points_max=5, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'stereometria'),
  $c15${
  "statement": "Prostopadłościan ma krawędzie $a=3$ i $b=4$ oraz przekątną $d=13$. Oblicz trzecią krawędź $c$, objętość oraz pole powierzchni całkowitej tego prostopadłościanu.",
  "acceptedAnswers": [
    "c=12, V=144, Pc=192",
    "c=12 V=144 Pc=192"
  ]
}$c15$::jsonb,
  3,
  false,
  5,
  'topic',
  $g15$[
  {
    "step": "Zapisanie wzoru na przekątną",
    "points": 1,
    "description": "Zapisanie wzoru $d^2=a^2+b^2+c^2$."
  },
  {
    "step": "Wyznaczenie krawędzi $c$",
    "points": 1,
    "description": "Poprawne obliczenie: $c^2=169-9-16=144$, więc $c=12$."
  },
  {
    "step": "Obliczenie objętości",
    "points": 1,
    "description": "Poprawne obliczenie: $V=a\\cdot b\\cdot c=3\\cdot4\\cdot12=144$."
  },
  {
    "step": "Obliczenie pola powierzchni",
    "points": 2,
    "description": "Poprawne obliczenie: $P_c=2(ab+bc+ca)=2(12+48+36)=2\\cdot96=192$."
  }
]$g15$::jsonb
);

-- Problem 16 (difficulty=3, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'stereometria'),
  $c16${
  "statement": "Ostrosłup prawidłowy czworokątny ma krawędź podstawy $a=8$ i wysokość $H=3$. Oblicz pole powierzchni całkowitej tego ostrosłupa.",
  "acceptedAnswers": [
    "144",
    "Pc=144"
  ]
}$c16$::jsonb,
  3,
  false,
  4,
  'topic',
  $g16$[
  {
    "step": "Obliczenie pola podstawy",
    "points": 1,
    "description": "Obliczenie $P_p=a^2=64$."
  },
  {
    "step": "Obliczenie apotemy ściany bocznej",
    "points": 1,
    "description": "Apotema podstawy wynosi $\\frac a2=4$, a z twierdzenia Pitagorasa apotema ściany bocznej $l=\\sqrt{H^2+4^2}=\\sqrt{9+16}=\\sqrt{25}=5$."
  },
  {
    "step": "Obliczenie pola powierzchni bocznej",
    "points": 1,
    "description": "Poprawne obliczenie: $P_b=4\\cdot\\frac12\\cdot8\\cdot5=80$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Poprawne obliczenie: $P_c=P_p+P_b=64+80=144$."
  }
]$g16$::jsonb
);

-- Problem 17 (difficulty=3, points_max=4, is_proof=true)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'stereometria'),
  $c17${
  "statement": "Prostopadłościan ma krawędzie $a$, $b$, $c$ wychodzące z jednego wierzchołka. Wykaż, że długość przekątnej tego prostopadłościanu wyraża się wzorem $d=\\sqrt{a^2+b^2+c^2}$."
}$c17$::jsonb,
  3,
  true,
  4,
  'topic',
  $g17$[
  {
    "step": "Przekątna podstawy",
    "points": 1,
    "description": "Zauważenie, że przekątna $e$ podstawy prostopadłościanu (prostokąta o bokach $a$, $b$) spełnia, na mocy twierdzenia Pitagorasa, równość $e^2=a^2+b^2$."
  },
  {
    "step": "Trójkąt prostokątny z przekątną bryły",
    "points": 1,
    "description": "Zauważenie, że przekątna $d$ prostopadłościanu, krawędź $c$ (prostopadła do podstawy) oraz przekątna podstawy $e$ tworzą trójkąt prostokątny, w którym $d$ jest przeciwprostokątną."
  },
  {
    "step": "Zastosowanie twierdzenia Pitagorasa do tego trójkąta",
    "points": 1,
    "description": "Zapisanie $d^2=e^2+c^2$."
  },
  {
    "step": "Wniosek końcowy",
    "points": 1,
    "description": "Podstawienie $e^2=a^2+b^2$ do powyższej równości: $d^2=a^2+b^2+c^2$, skąd $d=\\sqrt{a^2+b^2+c^2}$ — co należało wykazać."
  }
]$g17$::jsonb
);

-- Problem 18 (difficulty=3, points_max=4, is_proof=true)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'stereometria'),
  $c18${
  "statement": "Kula o promieniu $r$ jest wpisana w walec (promień podstawy walca jest równy $r$, a wysokość walca jest równa średnicy kuli, czyli $2r$) — mówimy wtedy, że walec jest opisany na kuli. Wykaż, że objętość kuli stanowi dokładnie $\\frac23$ objętości tego walca."
}$c18$::jsonb,
  3,
  true,
  4,
  'topic',
  $g18$[
  {
    "step": "Wymiary walca opisanego",
    "points": 1,
    "description": "Zapisanie, że promień podstawy walca wynosi $r$, a jego wysokość $h=2r$."
  },
  {
    "step": "Objętość walca",
    "points": 1,
    "description": "Poprawne obliczenie: $V_w=\\pi r^2\\cdot h=\\pi r^2\\cdot2r=2\\pi r^3$."
  },
  {
    "step": "Objętość kuli",
    "points": 1,
    "description": "Zapisanie wzoru na objętość kuli: $V_k=\\frac43\\pi r^3$."
  },
  {
    "step": "Obliczenie stosunku i wniosek",
    "points": 1,
    "description": "Poprawne obliczenie: $\\dfrac{V_k}{V_w}=\\dfrac{\\frac43\\pi r^3}{2\\pi r^3}=\\dfrac{4}{6}=\\dfrac23$, co należało wykazać."
  }
]$g18$::jsonb
);
