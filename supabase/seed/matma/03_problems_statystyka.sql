-- ============================================================================
-- supabase/seed/matma/03_problems_statystyka.sql
-- Problem bank (math_problems, source = 'topic') for the "statystyka" department:
-- Elementy statystyki opisowej. 18 problems, difficulty
-- distributed gently (8 x difficulty=1, 6 x difficulty=2,
-- 4 x difficulty=3, including 2 proof problems).
--
-- content: { statement, acceptedAnswers? } (see MathProblemContent).
-- grading_criteria: [{ step, points, description }], points sum to
-- points_max exactly for every problem (verified at authoring time, see
-- scratchpad math_check.py / validate.py used while drafting this file).
--
-- Idempotent: deletes existing source='topic' rows for this topic first
-- (past_exam/curated/ai_generated rows belong to a different pipeline and
-- are intentionally left untouched). Run 01_topics.sql BEFORE this file.
-- ============================================================================

delete from math_problems
where topic_id = (select id from math_topics where slug = 'statystyka')
  and source = 'topic';

-- Problem 1 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'statystyka'),
  $c1${
  "statement": "Oblicz średnią arytmetyczną liczb $3, 7, 5$.",
  "acceptedAnswers": [
    "5"
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
    "description": "Poprawne obliczenie średniej: $\\dfrac{3+7+5}{3}=\\dfrac{15}{3}=5$."
  }
]$g1$::jsonb
);

-- Problem 2 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'statystyka'),
  $c2${
  "statement": "Oblicz medianę zbioru danych $2, 9, 5, 1, 7$.",
  "acceptedAnswers": [
    "5"
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
    "description": "Po uporządkowaniu $1,2,5,7,9$ medianą jest środkowa wartość: $Me=5$."
  }
]$g2$::jsonb
);

-- Problem 3 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'statystyka'),
  $c3${
  "statement": "Oblicz rozstęp zbioru danych $4, 15, 9, 2, 11$.",
  "acceptedAnswers": [
    "13"
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
    "description": "$x_{max}=15$, $x_{min}=2$, więc $R=15-2=13$."
  }
]$g3$::jsonb
);

-- Problem 4 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'statystyka'),
  $c4${
  "statement": "Wyznacz dominantę zbioru danych $2, 5, 5, 5, 8, 9$.",
  "acceptedAnswers": [
    "5"
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
    "description": "Wartość $5$ występuje trzy razy — częściej niż pozostałe wartości."
  }
]$g4$::jsonb
);

-- Problem 5 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'statystyka'),
  $c5${
  "statement": "Oblicz medianę zbioru danych $4, 10, 6, 8$.",
  "acceptedAnswers": [
    "7"
  ]
}$c5$::jsonb,
  1,
  false,
  2,
  'topic',
  $g5$[
  {
    "step": "Uporządkowanie danych",
    "points": 1,
    "description": "Uporządkowanie danych rosnąco: $4, 6, 8, 10$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Liczba danych jest parzysta, więc $Me=\\dfrac{6+8}{2}=7$."
  }
]$g5$::jsonb
);

-- Problem 6 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'statystyka'),
  $c6${
  "statement": "Oblicz średnią arytmetyczną liczb $-3, 5, -1, 7, 2$.",
  "acceptedAnswers": [
    "2"
  ]
}$c6$::jsonb,
  1,
  false,
  2,
  'topic',
  $g6$[
  {
    "step": "Obliczenie sumy",
    "points": 1,
    "description": "Poprawne obliczenie sumy: $-3+5-1+7+2=10$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Podzielenie sumy przez $n=5$: $\\dfrac{10}{5}=2$."
  }
]$g6$::jsonb
);

-- Problem 7 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'statystyka'),
  $c7${
  "statement": "Wskaż dominantę zbioru danych $6, 6, 3, 6, 9, 3$.",
  "acceptedAnswers": [
    "6"
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
    "description": "Wartość $6$ występuje trzy razy, wartość $3$ dwa razy, wartość $9$ raz — dominantą jest $6$."
  }
]$g7$::jsonb
);

-- Problem 8 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'statystyka'),
  $c8${
  "statement": "Oblicz odchylenie standardowe zbioru danych $4, 4, 4, 4$.",
  "acceptedAnswers": [
    "0"
  ]
}$c8$::jsonb,
  1,
  false,
  2,
  'topic',
  $g8$[
  {
    "step": "Obliczenie średniej",
    "points": 1,
    "description": "Średnia wynosi $\\bar{x}=4$ (wszystkie wartości są równe)."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Każde odchylenie od średniej wynosi $0$, więc wariancja i odchylenie standardowe też wynoszą $0$."
  }
]$g8$::jsonb
);

-- Problem 9 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'statystyka'),
  $c9${
  "statement": "Oblicz średnią ważoną: wartość $4$ z wagą $3$ oraz wartość $7$ z wagą $2$.",
  "acceptedAnswers": [
    "5.2"
  ]
}$c9$::jsonb,
  2,
  false,
  3,
  'topic',
  $g9$[
  {
    "step": "Iloczyny wartości i wag",
    "points": 1,
    "description": "Obliczenie iloczynów: $4\\cdot3=12$ oraz $7\\cdot2=14$."
  },
  {
    "step": "Suma wag",
    "points": 1,
    "description": "Obliczenie sumy wag: $3+2=5$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Podzielenie sumy iloczynów przez sumę wag: $\\dfrac{12+14}{5}=\\dfrac{26}{5}=5{,}2$."
  }
]$g9$::jsonb
);

-- Problem 10 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'statystyka'),
  $c10${
  "statement": "Wyznacz wariancję zbioru danych $1, 3, 5, 7, 9$.",
  "acceptedAnswers": [
    "8"
  ]
}$c10$::jsonb,
  2,
  false,
  3,
  'topic',
  $g10$[
  {
    "step": "Obliczenie średniej",
    "points": 1,
    "description": "Średnia: $\\bar{x}=\\dfrac{1+3+5+7+9}{5}=5$."
  },
  {
    "step": "Suma kwadratów odchyleń",
    "points": 1,
    "description": "Odchylenia od średniej: $-4,-2,0,2,4$, ich kwadraty sumują się do $16+4+0+4+16=40$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Wariancja: $\\sigma^2=\\dfrac{40}{5}=8$."
  }
]$g10$::jsonb
);

-- Problem 11 (difficulty=2, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'statystyka'),
  $c11${
  "statement": "Oblicz odchylenie standardowe zbioru danych $3, 3, 7, 7$.",
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
    "step": "Obliczenie wariancji",
    "points": 1,
    "description": "Średnia $\\bar{x}=5$, odchylenia $-2,-2,2,2$, ich kwadraty sumują się do $16$, wariancja $\\sigma^2=\\dfrac{16}{4}=4$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Odchylenie standardowe: $\\sigma=\\sqrt4=2$."
  }
]$g11$::jsonb
);

-- Problem 12 (difficulty=2, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'statystyka'),
  $c12${
  "statement": "Dany jest szereg rozdzielczy: wartość $1$ z liczebnością $2$, wartość $3$ z liczebnością $5$, wartość $5$ z liczebnością $3$. Oblicz średnią tych danych.",
  "acceptedAnswers": [
    "3.2"
  ]
}$c12$::jsonb,
  2,
  false,
  4,
  'topic',
  $g12$[
  {
    "step": "Iloczyny wartości i liczebności",
    "points": 1,
    "description": "Obliczenie iloczynów: $1\\cdot2=2$, $3\\cdot5=15$, $5\\cdot3=15$."
  },
  {
    "step": "Suma iloczynów",
    "points": 1,
    "description": "Suma iloczynów: $2+15+15=32$."
  },
  {
    "step": "Suma liczebności",
    "points": 1,
    "description": "Łączna liczba danych: $N=2+5+3=10$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Średnia: $\\bar{x}=\\dfrac{32}{10}=3{,}2$."
  }
]$g12$::jsonb
);

-- Problem 13 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'statystyka'),
  $c13${
  "statement": "Oblicz medianę zbioru danych $12, 5, 8, 19, 8, 3, 15$.",
  "acceptedAnswers": [
    "8"
  ]
}$c13$::jsonb,
  2,
  false,
  3,
  'topic',
  $g13$[
  {
    "step": "Uporządkowanie danych",
    "points": 1,
    "description": "Dane uporządkowane rosnąco: $3, 5, 8, 8, 12, 15, 19$."
  },
  {
    "step": "Wskazanie pozycji środkowej",
    "points": 1,
    "description": "Liczba danych $n=7$ jest nieparzysta — medianą jest czwarta (środkowa) wartość."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "$Me=8$."
  }
]$g13$::jsonb
);

-- Problem 14 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'statystyka'),
  $c14${
  "statement": "W zbiorze danych $2, x, 8, 10$ średnia arytmetyczna wynosi $6$. Wyznacz $x$.",
  "acceptedAnswers": [
    "4",
    "x=4"
  ]
}$c14$::jsonb,
  2,
  false,
  3,
  'topic',
  $g14$[
  {
    "step": "Zapisanie równania na średnią",
    "points": 1,
    "description": "Zapisanie równania: $\\dfrac{2+x+8+10}{4}=6$, czyli $\\dfrac{20+x}{4}=6$."
  },
  {
    "step": "Rozwiązanie równania",
    "points": 1,
    "description": "Przekształcenie do postaci: $20+x=24$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "$x=4$."
  }
]$g14$::jsonb
);

-- Problem 15 (difficulty=3, points_max=5, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'statystyka'),
  $c15${
  "statement": "Średnia arytmetyczna pięciu liczb: $3, 7, x, 11, 9$ jest równa medianie zbioru danych $4, 6, 8, 10, 12$. Wyznacz $x$.",
  "acceptedAnswers": [
    "10",
    "x=10"
  ]
}$c15$::jsonb,
  3,
  false,
  5,
  'topic',
  $g15$[
  {
    "step": "Wyznaczenie mediany drugiego zbioru",
    "points": 1,
    "description": "Zbiór $4,6,8,10,12$ jest już uporządkowany, jego medianą jest środkowa wartość: $Me=8$."
  },
  {
    "step": "Zapisanie sumy pierwszego zbioru",
    "points": 1,
    "description": "Suma pierwszego zbioru: $3+7+x+11+9=30+x$."
  },
  {
    "step": "Zapisanie równania na średnią",
    "points": 1,
    "description": "Zrównanie średniej z medianą: $\\dfrac{30+x}{5}=8$."
  },
  {
    "step": "Rozwiązanie równania",
    "points": 1,
    "description": "Przekształcenie do postaci: $30+x=40$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "$x=10$."
  }
]$g15$::jsonb
);

-- Problem 16 (difficulty=3, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'statystyka'),
  $c16${
  "statement": "Dany jest szereg rozdzielczy: wartość $2$ z liczebnością $1$, wartość $4$ z liczebnością $3$, wartość $8$ z liczebnością $2$. Oblicz odchylenie standardowe tych danych.",
  "acceptedAnswers": [
    "\\sqrt5",
    "\\sqrt{5}",
    "sqrt(5)",
    "√5"
  ]
}$c16$::jsonb,
  3,
  false,
  4,
  'topic',
  $g16$[
  {
    "step": "Obliczenie średniej",
    "points": 1,
    "description": "Średnia: $\\bar{x}=\\dfrac{2\\cdot1+4\\cdot3+8\\cdot2}{1+3+2}=\\dfrac{2+12+16}{6}=\\dfrac{30}{6}=5$."
  },
  {
    "step": "Suma ważonych kwadratów odchyleń",
    "points": 1,
    "description": "Ważone kwadraty odchyleń: $1\\cdot(2-5)^2+3\\cdot(4-5)^2+2\\cdot(8-5)^2=9+3+18=30$."
  },
  {
    "step": "Wariancja",
    "points": 1,
    "description": "$\\sigma^2=\\dfrac{30}{6}=5$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Odchylenie standardowe: $\\sigma=\\sqrt5$."
  }
]$g16$::jsonb
);

-- Problem 17 (difficulty=3, points_max=3, is_proof=true)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'statystyka'),
  $c17${
  "statement": "Wykaż, że dla dowolnego zbioru danych $x_1, x_2, \\ldots, x_n$ o średniej arytmetycznej $\\bar{x}$ zachodzi równość $\\displaystyle\\sum_{i=1}^{n}(x_i-\\bar{x})=0$."
}$c17$::jsonb,
  3,
  true,
  3,
  'topic',
  $g17$[
  {
    "step": "Rozbicie sumy",
    "points": 1,
    "description": "Rozpisanie sumy jako różnicy dwóch sum: $\\sum_{i=1}^n(x_i-\\bar{x})=\\sum_{i=1}^n x_i - \\sum_{i=1}^n \\bar{x} = \\sum_{i=1}^n x_i - n\\bar{x}$ (bo $\\bar{x}$ jest stałą sumowaną $n$ razy)."
  },
  {
    "step": "Podstawienie definicji średniej",
    "points": 1,
    "description": "Wykorzystanie definicji średniej $\\bar{x}=\\dfrac{1}{n}\\sum_{i=1}^n x_i$, skąd $\\sum_{i=1}^n x_i = n\\bar{x}$."
  },
  {
    "step": "Wniosek końcowy",
    "points": 1,
    "description": "Podstawienie do wyrażenia z pierwszego kroku: $n\\bar{x}-n\\bar{x}=0$, co kończy dowód."
  }
]$g17$::jsonb
);

-- Problem 18 (difficulty=3, points_max=6, is_proof=true)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'statystyka'),
  $c18${
  "statement": "Wykaż, że wariancja zbioru danych $x_1, x_2, \\ldots, x_n$ o średniej arytmetycznej $\\bar{x}$ spełnia równość $\\sigma^2=\\dfrac{1}{n}\\displaystyle\\sum_{i=1}^{n}x_i^2-\\bar{x}^2$."
}$c18$::jsonb,
  3,
  true,
  6,
  'topic',
  $g18$[
  {
    "step": "Rozwinięcie kwadratu w definicji wariancji",
    "points": 1,
    "description": "Rozpisanie $(x_i-\\bar{x})^2=x_i^2-2x_i\\bar{x}+\\bar{x}^2$ w definicji $\\sigma^2=\\dfrac{1}{n}\\sum_{i=1}^n(x_i-\\bar{x})^2$."
  },
  {
    "step": "Rozbicie sumy na trzy składniki",
    "points": 1,
    "description": "Rozdzielenie sumy: $\\sum_{i=1}^n x_i^2 - 2\\bar{x}\\sum_{i=1}^n x_i + n\\bar{x}^2$ (stałe $2\\bar{x}$ oraz $\\bar{x}^2$ wyciągnięte przed znak sumy)."
  },
  {
    "step": "Podstawienie sumy danych",
    "points": 1,
    "description": "Wykorzystanie równości $\\sum_{i=1}^n x_i=n\\bar{x}$ (z definicji średniej), skąd $-2\\bar{x}\\sum_{i=1}^n x_i=-2n\\bar{x}^2$."
  },
  {
    "step": "Uproszczenie wyrażenia w liczniku",
    "points": 1,
    "description": "Redukcja: $\\sum_{i=1}^n x_i^2 - 2n\\bar{x}^2+n\\bar{x}^2=\\sum_{i=1}^n x_i^2-n\\bar{x}^2$."
  },
  {
    "step": "Podzielenie przez n",
    "points": 1,
    "description": "Podzielenie całości przez $n$: $\\sigma^2=\\dfrac{1}{n}\\left(\\sum_{i=1}^n x_i^2-n\\bar{x}^2\\right)=\\dfrac{1}{n}\\sum_{i=1}^n x_i^2-\\bar{x}^2$."
  },
  {
    "step": "Wniosek końcowy",
    "points": 1,
    "description": "Otrzymana równość $\\sigma^2=\\dfrac{1}{n}\\sum_{i=1}^n x_i^2-\\bar{x}^2$ kończy dowód."
  }
]$g18$::jsonb
);

