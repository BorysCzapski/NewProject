-- ============================================================================
-- supabase/seed/matma/03_problems_kombinatoryka-prawdopodobienstwo.sql
-- Problem bank (math_problems, source = 'topic') for the
-- "kombinatoryka-prawdopodobienstwo" department: Kombinatoryka i rachunek
-- prawdopodobieństwa. 19 problems, difficulty distributed gently
-- (8 x difficulty=1, 7 x difficulty=2, 4 x difficulty=3, including 2 short
-- algebraic proofs of symbol-Newtona identities among the harder problems).
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
where topic_id = (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo')
  and source = 'topic';

-- Problem 1 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo'),
  $c1${
  "statement": "Oblicz $5!$.",
  "acceptedAnswers": [
    "120",
    "5!=120"
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
    "description": "Podanie poprawnej wartości: $5!=5\\cdot4\\cdot3\\cdot2\\cdot1=120$."
  }
]$g1$::jsonb
);

-- Problem 2 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo'),
  $c2${
  "statement": "Na ile sposobów można ustawić w rzędzie 4 różne książki?",
  "acceptedAnswers": [
    "24",
    "P_4=24"
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
    "description": "Zastosowanie wzoru na permutacje: $P_4=4!=24$."
  }
]$g2$::jsonb
);

-- Problem 3 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo'),
  $c3${
  "statement": "Oblicz $\\dfrac{7!}{5!}$.",
  "acceptedAnswers": [
    "42"
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
    "description": "Poprawne uproszczenie i obliczenie: $\\frac{7!}{5!}=7\\cdot6=42$."
  }
]$g3$::jsonb
);

-- Problem 4 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo'),
  $c4${
  "statement": "W urnie jest 4 kule białe i 6 czarnych. Losujemy jedną kulę. Jakie jest prawdopodobieństwo wylosowania kuli białej?",
  "acceptedAnswers": [
    "2/5",
    "0,4",
    "4/10"
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
    "description": "Zastosowanie klasycznej definicji prawdopodobieństwa: $P=\\frac{4}{10}=\\frac25$."
  }
]$g4$::jsonb
);

-- Problem 5 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo'),
  $c5${
  "statement": "Rzucamy raz kostką sześcienną. Jakie jest prawdopodobieństwo wyrzucenia liczby podzielnej przez 3?",
  "acceptedAnswers": [
    "1/3",
    "2/6"
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
    "description": "Wskazanie zdarzeń sprzyjających $\\{3,6\\}$ i obliczenie: $P=\\frac{2}{6}=\\frac13$."
  }
]$g5$::jsonb
);

-- Problem 6 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo'),
  $c6${
  "statement": "Ile jest wszystkich trzycyfrowych kodów utworzonych z cyfr 0–9, jeśli cyfry mogą się powtarzać (np. 007, 583)?",
  "acceptedAnswers": [
    "1000",
    "10^3=1000"
  ]
}$c6$::jsonb,
  1,
  false,
  2,
  'topic',
  $g6$[
  {
    "step": "Metoda",
    "points": 1,
    "description": "Rozpoznanie wariacji z powtórzeniami: każdą z 3 pozycji można wypełnić na 10 sposobów."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Obliczenie: $10^3=1000$."
  }
]$g6$::jsonb
);

-- Problem 7 (difficulty=1, points_max=1, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo'),
  $c7${
  "statement": "Prawdopodobieństwo, że uczeń zda egzamin, wynosi $0{,}7$. Jakie jest prawdopodobieństwo, że uczeń NIE zda egzaminu?",
  "acceptedAnswers": [
    "0,3"
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
    "description": "Zastosowanie wzoru na zdarzenie przeciwne: $P(A')=1-0{,}7=0{,}3$."
  }
]$g7$::jsonb
);

-- Problem 8 (difficulty=1, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo'),
  $c8${
  "statement": "Oblicz liczbę kombinacji $\\binom{5}{2}$.",
  "acceptedAnswers": [
    "10"
  ]
}$c8$::jsonb,
  1,
  false,
  2,
  'topic',
  $g8$[
  {
    "step": "Metoda",
    "points": 1,
    "description": "Zapisanie wzoru na kombinację: $\\binom52=\\frac{5!}{2!\\cdot3!}$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Obliczenie wyniku: $\\binom52=10$."
  }
]$g8$::jsonb
);

-- Problem 9 (difficulty=2, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo'),
  $c9${
  "statement": "Ile różnych 4-osobowych delegacji można wybrać z grupy 9 osób?",
  "acceptedAnswers": [
    "126"
  ]
}$c9$::jsonb,
  2,
  false,
  2,
  'topic',
  $g9$[
  {
    "step": "Metoda",
    "points": 1,
    "description": "Rozpoznanie kombinacji (kolejność wyboru osób nie ma znaczenia): $\\binom94$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Obliczenie: $\\binom94=126$."
  }
]$g9$::jsonb
);

-- Problem 10 (difficulty=2, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo'),
  $c10${
  "statement": "Rzucamy dwiema kostkami do gry. Jakie jest prawdopodobieństwo, że suma wyrzuconych oczek jest równa 7?",
  "acceptedAnswers": [
    "1/6"
  ]
}$c10$::jsonb,
  2,
  false,
  2,
  'topic',
  $g10$[
  {
    "step": "Przestrzeń zdarzeń elementarnych",
    "points": 1,
    "description": "Wskazanie, że $|\\Omega|=36$ oraz wypisanie zdarzeń sprzyjających: $(1,6),(2,5),(3,4),(4,3),(5,2),(6,1)$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Obliczenie: $P=\\frac{6}{36}=\\frac16$."
  }
]$g10$::jsonb
);

-- Problem 11 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo'),
  $c11${
  "statement": "Hasło do sejfu składa się z 4 różnych cyfr wybranych spośród cyfr 0–9 (cyfry się nie powtarzają, a kolejność ma znaczenie). Ile jest możliwych haseł?",
  "acceptedAnswers": [
    "5040"
  ]
}$c11$::jsonb,
  2,
  false,
  3,
  'topic',
  $g11$[
  {
    "step": "Rozpoznanie modelu",
    "points": 1,
    "description": "Rozpoznanie wariacji bez powtórzeń: wybieramy i ustawiamy w kolejności 4 z 10 cyfr."
  },
  {
    "step": "Zapisanie wzoru",
    "points": 1,
    "description": "Zapisanie: $V_{10}^4=10\\cdot9\\cdot8\\cdot7$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Obliczenie: $V_{10}^4=5040$."
  }
]$g11$::jsonb
);

-- Problem 12 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo'),
  $c12${
  "statement": "Rzucamy 3 razy symetryczną monetą. Jakie jest prawdopodobieństwo wyrzucenia dokładnie 2 orłów?",
  "acceptedAnswers": [
    "3/8"
  ]
}$c12$::jsonb,
  2,
  false,
  3,
  'topic',
  $g12$[
  {
    "step": "Rozpoznanie schematu Bernoulliego",
    "points": 1,
    "description": "Wskazanie $n=3$, $p=\\frac12$, $k=2$."
  },
  {
    "step": "Podstawienie do wzoru",
    "points": 1,
    "description": "Zapisanie: $P(X=2)=\\binom32\\left(\\frac12\\right)^2\\left(\\frac12\\right)^1$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Obliczenie: $P(X=2)=3\\cdot\\frac14\\cdot\\frac12=\\frac38$."
  }
]$g12$::jsonb
);

-- Problem 13 (difficulty=2, points_max=3, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo'),
  $c13${
  "statement": "W klasie jest 15 uczniów, w tym 9 dziewczynek i 6 chłopców. Losujemy 3-osobową reprezentację klasy. Jakie jest prawdopodobieństwo, że w reprezentacji znajdą się same dziewczynki?",
  "acceptedAnswers": [
    "12/65",
    "84/455"
  ]
}$c13$::jsonb,
  2,
  false,
  3,
  'topic',
  $g13$[
  {
    "step": "Obliczenie liczby wszystkich wyborów",
    "points": 1,
    "description": "Obliczenie $|\\Omega|=\\binom{15}{3}=455$."
  },
  {
    "step": "Obliczenie liczby wyborów sprzyjających",
    "points": 1,
    "description": "Obliczenie liczby sposobów wyboru 3 dziewczynek spośród 9: $\\binom93=84$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Obliczenie prawdopodobieństwa i uproszczenie ułamka: $P=\\frac{84}{455}=\\frac{12}{65}$."
  }
]$g13$::jsonb
);

-- Problem 14 (difficulty=2, points_max=2, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo'),
  $c14${
  "statement": "Zmienna losowa $X$ przyjmuje wartości $1,2,3$ z prawdopodobieństwami odpowiednio $0{,}5$, $0{,}3$, $0{,}2$. Oblicz wartość oczekiwaną $E(X)$.",
  "acceptedAnswers": [
    "1,7"
  ]
}$c14$::jsonb,
  2,
  false,
  2,
  'topic',
  $g14$[
  {
    "step": "Zastosowanie wzoru",
    "points": 1,
    "description": "Zapisanie sumy: $E(X)=1\\cdot0{,}5+2\\cdot0{,}3+3\\cdot0{,}2$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Obliczenie: $E(X)=0{,}5+0{,}6+0{,}6=1{,}7$."
  }
]$g14$::jsonb
);

-- Problem 15 (difficulty=2, points_max=2, is_proof=true)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo'),
  $c15${
  "statement": "Wykaż, że dla dowolnych liczb całkowitych $n$, $k$ spełniających $0\\le k\\le n$ zachodzi równość $\\binom{n}{k}=\\binom{n}{n-k}$."
}$c15$::jsonb,
  2,
  true,
  2,
  'topic',
  $g15$[
  {
    "step": "Zapisanie definicji symbolu Newtona",
    "points": 1,
    "description": "Zapisanie $\\binom{n}{n-k}=\\dfrac{n!}{(n-k)!\\,\\big(n-(n-k)\\big)!}$ i uproszczenie wyrażenia $n-(n-k)$ do $k$."
  },
  {
    "step": "Wniosek końcowy",
    "points": 1,
    "description": "Otrzymanie $\\binom{n}{n-k}=\\dfrac{n!}{(n-k)!\\,k!}=\\binom{n}{k}$, co kończy dowód."
  }
]$g15$::jsonb
);

-- Problem 16 (difficulty=3, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo'),
  $c16${
  "statement": "Na ile sposobów można ustawić w rzędzie 6 osób, jeśli dwie konkretne osoby (Ala i Bartek) nie mogą stać obok siebie?",
  "acceptedAnswers": [
    "480"
  ]
}$c16$::jsonb,
  3,
  false,
  4,
  'topic',
  $g16$[
  {
    "step": "Obliczenie wszystkich ustawień",
    "points": 1,
    "description": "Obliczenie liczby wszystkich ustawień 6 osób: $6!=720$."
  },
  {
    "step": "Obliczenie ustawień, w których stoją razem",
    "points": 1,
    "description": "Potraktowanie Ali i Bartka jako jednego bloku (2 kolejności wewnątrz bloku) i obliczenie: $5!\\cdot2=240$."
  },
  {
    "step": "Zastosowanie zdarzenia przeciwnego",
    "points": 1,
    "description": "Wykorzystanie faktu, że szukana liczba to dopełnienie do wszystkich ustawień: $720-240$."
  },
  {
    "step": "Wynik",
    "points": 1,
    "description": "Podanie poprawnego wyniku: $480$."
  }
]$g16$::jsonb
);

-- Problem 17 (difficulty=3, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo'),
  $c17${
  "statement": "W urnie znajduje się 8 kul: 5 białych i 3 czarne. Losujemy bez zwracania 3 kule. Jakie jest prawdopodobieństwo, że wśród wylosowanych kul będą dokładnie 2 białe i 1 czarna?",
  "acceptedAnswers": [
    "15/28",
    "30/56"
  ]
}$c17$::jsonb,
  3,
  false,
  4,
  'topic',
  $g17$[
  {
    "step": "Obliczenie liczby wszystkich wyborów",
    "points": 1,
    "description": "Obliczenie $|\\Omega|=\\binom83=56$."
  },
  {
    "step": "Obliczenie liczby wyborów sprzyjających",
    "points": 1,
    "description": "Zastosowanie reguły mnożenia dla wyboru z dwóch grup: $\\binom52\\cdot\\binom31=10\\cdot3=30$."
  },
  {
    "step": "Obliczenie prawdopodobieństwa",
    "points": 1,
    "description": "Obliczenie $P=\\frac{30}{56}$."
  },
  {
    "step": "Uproszczenie wyniku",
    "points": 1,
    "description": "Skrócenie ułamka do postaci nieskracalnej: $P=\\frac{15}{28}$."
  }
]$g17$::jsonb
);

-- Problem 18 (difficulty=3, points_max=4, is_proof=true)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo'),
  $c18${
  "statement": "Wykaż, że dla dowolnej liczby naturalnej $n\\ge2$ oraz liczby całkowitej $k$ spełniającej $1\\le k\\le n-1$ zachodzi tożsamość Pascala: $\\binom{n}{k}=\\binom{n-1}{k-1}+\\binom{n-1}{k}$."
}$c18$::jsonb,
  3,
  true,
  4,
  'topic',
  $g18$[
  {
    "step": "Zapisanie definicji symboli Newtona",
    "points": 1,
    "description": "Zapisanie obu składników sumy w postaci silni: $\\binom{n-1}{k-1}=\\frac{(n-1)!}{(k-1)!\\,(n-k)!}$ oraz $\\binom{n-1}{k}=\\frac{(n-1)!}{k!\\,(n-k-1)!}$."
  },
  {
    "step": "Sprowadzenie do wspólnego mianownika",
    "points": 1,
    "description": "Sprowadzenie obu ułamków do wspólnego mianownika $k!\\,(n-k)!$, mnożąc pierwszy ułamek przez $\\frac{k}{k}$, a drugi przez $\\frac{n-k}{n-k}$."
  },
  {
    "step": "Zsumowanie liczników",
    "points": 1,
    "description": "Poprawne zsumowanie liczników i wyłączenie $(n-1)!$ przed nawias, co daje w liczniku $(n-1)!\\cdot\\big[k+(n-k)\\big]=(n-1)!\\cdot n$."
  },
  {
    "step": "Wniosek końcowy",
    "points": 1,
    "description": "Rozpoznanie, że otrzymane wyrażenie $\\frac{n!}{k!\\,(n-k)!}$ jest równe $\\binom{n}{k}$, co kończy dowód."
  }
]$g18$::jsonb
);

-- Problem 19 (difficulty=3, points_max=4, is_proof=false)
insert into math_problems (topic_id, content, difficulty, is_proof, points_max, source, grading_criteria) values (
  (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo'),
  $c19${
  "statement": "W pewnej firmie 55% pracowników to kobiety. Wśród kobiet 20% zajmuje stanowiska kierownicze, a wśród mężczyzn 35% zajmuje stanowiska kierownicze. Losowo wybrano jednego pracownika. Oblicz prawdopodobieństwo, że jest to osoba na stanowisku kierowniczym.",
  "acceptedAnswers": [
    "0,2675"
  ]
}$c19$::jsonb,
  3,
  false,
  4,
  'topic',
  $g19$[
  {
    "step": "Rozpoznanie zupełnego układu zdarzeń",
    "points": 1,
    "description": "Wskazanie, że zdarzenia „pracownik to kobieta” i „pracownik to mężczyzna” tworzą zupełny układ zdarzeń z prawdopodobieństwami $0{,}55$ i $0{,}45$."
  },
  {
    "step": "Obliczenie pierwszego składnika",
    "points": 1,
    "description": "Obliczenie $P(\\text{kierownicze}\\mid\\text{kobieta})\\cdot P(\\text{kobieta})=0{,}2\\cdot0{,}55=0{,}11$."
  },
  {
    "step": "Obliczenie drugiego składnika",
    "points": 1,
    "description": "Obliczenie $P(\\text{kierownicze}\\mid\\text{mężczyzna})\\cdot P(\\text{mężczyzna})=0{,}35\\cdot0{,}45=0{,}1575$."
  },
  {
    "step": "Wynik końcowy",
    "points": 1,
    "description": "Zsumowanie składników zgodnie ze wzorem na prawdopodobieństwo całkowite: $P=0{,}11+0{,}1575=0{,}2675$."
  }
]$g19$::jsonb
);
