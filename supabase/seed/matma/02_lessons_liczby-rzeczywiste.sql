-- ============================================================================
-- supabase/seed/matma/02_lessons_liczby-rzeczywiste.sql
-- Interactive lesson content (math_lessons) for the "liczby-rzeczywiste" department:
-- Liczby rzeczywiste i wyrażenia algebraiczne (potęgi, pierwiastki,
-- logarytmy, wartość bezwzględna, wielomiany, wyrażenia wymierne).
-- content is a jsonb array of MathBlock (see lib/matma/lesson-blocks.ts).
--
-- Idempotent: deletes existing lessons for this topic first. Run
-- 01_topics.sql BEFORE this file — it looks up topic_id by slug.
-- ============================================================================

delete from math_lessons
where topic_id = (select id from math_topics where slug = 'liczby-rzeczywiste');

-- ----------------------------------------------------------------------------
-- Lesson 1: Potęgi, pierwiastki i wartość bezwzględna
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'liczby-rzeczywiste'),
  $title1$Potęgi, pierwiastki i wartość bezwzględna$title1$,
  $content1$[
  {
    "type": "basics-recap",
    "title": "Zanim zaczniesz: podstawy, które musisz znać",
    "text": "Zbiór liczb rzeczywistych $\\mathbb{R}$ obejmuje wszystkie liczby wymierne (np. $2$, $-3$, $\\frac{1}{2}$, $0{,}75$) oraz niewymierne (np. $\\sqrt{2}$, $\\pi$), czyli takie, których nie da się zapisać w postaci ułamka zwykłego o całkowitym liczniku i mianowniku. Potęga o wykładniku naturalnym $n$ oznacza $n$-krotne pomnożenie liczby przez siebie: $a^n = \\underbrace{a\\cdot a\\cdots a}_{n\\ \\text{razy}}$. Pamiętaj też o kolejności wykonywania działań: najpierw nawiasy, potem potęgi i pierwiastki, następnie mnożenie i dzielenie, a na końcu dodawanie i odejmowanie.",
    "formula": "a^n = \\underbrace{a\\cdot a\\cdots a}_{n\\ \\text{razy}}",
    "controlQuiz": [
      {
        "question": "Ile wynosi $2^3$?",
        "options": [
          "$6$",
          "$8$",
          "$9$",
          "$5$"
        ],
        "correctIndex": 1,
        "explanation": "$2^3 = 2\\cdot 2\\cdot 2 = 8$."
      },
      {
        "question": "Do jakiego zbioru liczb należy $\\sqrt{2}$?",
        "options": [
          "Liczb wymiernych",
          "Liczb niewymiernych",
          "Liczb całkowitych",
          "Liczb naturalnych"
        ],
        "correctIndex": 1,
        "explanation": "$\\sqrt{2}$ nie da się zapisać w postaci ułamka dwóch liczb całkowitych — to liczba niewymierna (choć oczywiście rzeczywista)."
      },
      {
        "question": "Zgodnie z kolejnością działań, co obliczamy najpierw w wyrażeniu $3 + 2\\cdot 4^2$?",
        "options": [
          "$3+2$ (dodawanie)",
          "$4^2$ (potęgowanie)",
          "$2\\cdot 4$ (mnożenie)"
        ],
        "correctIndex": 1,
        "explanation": "Potęgowanie ma wyższy priorytet niż mnożenie i dodawanie: najpierw $4^2=16$, potem $2\\cdot16=32$, na końcu $3+32=35$."
      }
    ]
  },
  {
    "type": "definition",
    "term": "Potęga o wykładniku całkowitym (zerowym i ujemnym)",
    "text": "Dla $a\\neq0$ przyjmujemy $a^0=1$. Potęgę o wykładniku ujemnym definiujemy jako odwrotność odpowiedniej potęgi dodatniej: im mniejszy (bardziej ujemny) wykładnik, tym mniejsza wartość takiej potęgi dla $a>1$.",
    "formula": "a^{-n} = \\dfrac{1}{a^n}, \\qquad a\\neq0,\\ n\\in\\mathbb{N}_+"
  },
  {
    "type": "table",
    "title": "Własności działań na potęgach",
    "caption": "Zakładamy, że podstawy są różne od zera tam, gdzie to konieczne (np. przy dzieleniu).",
    "headers": [
      "Wzór",
      "Opis"
    ],
    "rows": [
      [
        "$a^m\\cdot a^n = a^{m+n}$",
        "Mnożenie potęg o tej samej podstawie — dodajemy wykładniki."
      ],
      [
        "$a^m : a^n = a^{m-n}$",
        "Dzielenie potęg o tej samej podstawie — odejmujemy wykładniki ($a\\neq0$)."
      ],
      [
        "$(a^m)^n = a^{m\\cdot n}$",
        "Potęgowanie potęgi — mnożymy wykładniki."
      ],
      [
        "$(a\\cdot b)^n = a^n\\cdot b^n$",
        "Potęga iloczynu — potęgujemy każdy czynnik."
      ],
      [
        "$\\left(\\dfrac{a}{b}\\right)^n = \\dfrac{a^n}{b^n}$",
        "Potęga ilorazu ($b\\neq0$)."
      ]
    ]
  },
  {
    "type": "quiz",
    "question": "Oblicz $2^3\\cdot 2^4$, korzystając z własności potęg.",
    "options": [
      "$2^7$",
      "$2^{12}$",
      "$4^7$",
      "$2^1$"
    ],
    "correctIndex": 0,
    "explanation": "Przy mnożeniu potęg o tej samej podstawie dodajemy wykładniki: $3+4=7$, więc wynikiem jest $2^7$."
  },
  {
    "type": "definition",
    "term": "Potęga o wykładniku wymiernym",
    "text": "Dla $a>0$ oraz liczby wymiernej $\\frac{m}{n}$ (gdzie $n$ jest liczbą naturalną, $n\\ge2$) definiujemy potęgę o wykładniku wymiernym jako pierwiastek: $a$ podnosimy do potęgi $m$, a następnie wyciągamy pierwiastek stopnia $n$.",
    "formula": "a^{\\frac{m}{n}} = \\sqrt[n]{a^m}, \\qquad a>0"
  },
  {
    "type": "examples",
    "title": "Obliczanie potęg o wykładniku wymiernym",
    "items": [
      {
        "problem": "8^{\\frac{2}{3}}",
        "steps": [
          {
            "text": "Zamieniamy potęgę o wykładniku wymiernym na pierwiastek.",
            "formula": "8^{\\frac{2}{3}} = \\sqrt[3]{8^2}"
          },
          {
            "text": "Obliczamy $8^2$.",
            "formula": "\\sqrt[3]{64}"
          },
          {
            "text": "Obliczamy pierwiastek sześcienny z $64$.",
            "formula": "\\sqrt[3]{64}=4"
          }
        ],
        "answer": "4"
      },
      {
        "problem": "27^{-\\frac{1}{3}}",
        "steps": [
          {
            "text": "Wykładnik ujemny oznacza odwrotność potęgi o wykładniku dodatnim.",
            "formula": "27^{-\\frac{1}{3}} = \\dfrac{1}{27^{\\frac{1}{3}}}"
          },
          {
            "text": "Obliczamy pierwiastek sześcienny z $27$.",
            "formula": "\\sqrt[3]{27}=3"
          },
          {
            "text": "Zapisujemy wynik końcowy.",
            "formula": "\\dfrac{1}{3}"
          }
        ],
        "answer": "\\dfrac{1}{3}"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Ile wynosi $4^{\\frac{3}{2}}$?",
    "options": [
      "$8$",
      "$6$",
      "$64$",
      "$2$"
    ],
    "correctIndex": 0,
    "explanation": "$4^{\\frac{3}{2}} = \\left(\\sqrt{4}\\right)^3 = 2^3 = 8$."
  },
  {
    "type": "definition",
    "term": "Pierwiastek arytmetyczny stopnia n",
    "text": "Dla $a\\ge0$ i liczby naturalnej $n\\ge2$, pierwiastkiem arytmetycznym stopnia $n$ z liczby $a$ nazywamy jedyną nieujemną liczbę $b$, dla której $b^n=a$. Zachodzą przy tym własności: $\\sqrt[n]{a\\cdot b} = \\sqrt[n]{a}\\cdot\\sqrt[n]{b}$ oraz $\\sqrt[n]{\\frac{a}{b}} = \\frac{\\sqrt[n]{a}}{\\sqrt[n]{b}}$ (dla $a,b\\ge0$, $b\\neq0$).",
    "formula": "\\sqrt[n]{a} = b \\iff b^n=a\\ \\ (a\\ge0,\\ b\\ge0)"
  },
  {
    "type": "reveal-steps",
    "title": "Usuwanie niewymierności z mianownika",
    "problem": "Zapisz w postaci bez niewymierności w mianowniku: $\\dfrac{1}{\\sqrt{3}}$",
    "steps": [
      {
        "prompt": "Przez co należy pomnożyć licznik i mianownik, aby usunąć pierwiastek z mianownika?",
        "kind": "choice",
        "options": [
          "Przez $\\sqrt{3}$",
          "Przez $3$",
          "Przez $\\sqrt{2}$"
        ],
        "correctIndex": 0,
        "reveal": "Mnożymy licznik i mianownik przez $\\sqrt{3}$, ponieważ $\\sqrt{3}\\cdot\\sqrt{3}=3$ jest już liczbą wymierną.",
        "formula": "\\dfrac{1}{\\sqrt3}\\cdot\\dfrac{\\sqrt3}{\\sqrt3}"
      },
      {
        "prompt": "Oblicz nowy mianownik: $\\sqrt3\\cdot\\sqrt3=?$",
        "kind": "input",
        "acceptedAnswers": [
          "3"
        ],
        "reveal": "$\\sqrt3\\cdot\\sqrt3 = 3$ — mianownik przestał zawierać pierwiastek."
      },
      {
        "prompt": "Jaki jest wynik końcowy?",
        "kind": "choice",
        "options": [
          "$\\dfrac{\\sqrt3}{3}$",
          "$\\dfrac{3}{\\sqrt3}$",
          "$\\sqrt3$",
          "$\\dfrac{1}{3}$"
        ],
        "correctIndex": 0,
        "reveal": "Ostatecznie $\\dfrac{1}{\\sqrt3} = \\dfrac{\\sqrt3}{3}$.",
        "formula": "\\dfrac{1}{\\sqrt3}=\\dfrac{\\sqrt3}{3}"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Jak zracjonalizować mianownik ułamka $\\dfrac{5}{\\sqrt{2}}$?",
    "options": [
      "Pomnożyć licznik i mianownik przez $\\sqrt2$",
      "Pomnożyć tylko mianownik przez $2$",
      "Podnieść całość do kwadratu",
      "Pomnożyć przez $\\sqrt5$"
    ],
    "correctIndex": 0,
    "explanation": "Mnożymy licznik i mianownik przez $\\sqrt2$, otrzymując $\\dfrac{5\\sqrt2}{2}$."
  },
  {
    "type": "definition",
    "term": "Wartość bezwzględna (moduł) liczby rzeczywistej",
    "text": "Wartość bezwzględna liczby $a$ to jej odległość od zera na osi liczbowej — zawsze liczba nieujemna. Dla liczb nieujemnych moduł nie zmienia wartości, a dla ujemnych zmienia ich znak.",
    "formula": "|a| = \\begin{cases} a & \\text{gdy } a \\ge 0 \\\\ -a & \\text{gdy } a < 0 \\end{cases}"
  },
  {
    "type": "table",
    "title": "Podstawowe własności wartości bezwzględnej",
    "headers": [
      "Własność",
      "Przykład"
    ],
    "rows": [
      [
        "$|a|\\ge0$",
        "$|-7|=7$"
      ],
      [
        "$|a\\cdot b| = |a|\\cdot|b|$",
        "$|-2\\cdot3| = |-2|\\cdot|3| = 6$"
      ],
      [
        "$|a-b|$ to odległość między $a$ i $b$ na osi liczbowej",
        "$|5-2|=3$"
      ]
    ]
  },
  {
    "type": "examples",
    "title": "Obliczanie wyrażeń z wartością bezwzględną",
    "items": [
      {
        "problem": "|-5| + |3-7|",
        "steps": [
          {
            "text": "Obliczamy pierwszą wartość bezwzględną.",
            "formula": "|-5| = 5"
          },
          {
            "text": "Obliczamy wyrażenie w drugiej wartości bezwzględnej.",
            "formula": "3-7=-4"
          },
          {
            "text": "Obliczamy wartość bezwzględną wyniku.",
            "formula": "|-4|=4"
          },
          {
            "text": "Dodajemy obie wartości.",
            "formula": "5+4=9"
          }
        ],
        "answer": "9"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Ile wynosi $|4-9|$?",
    "options": [
      "$5$",
      "$-5$",
      "$13$",
      "$0$"
    ],
    "correctIndex": 0,
    "explanation": "$4-9=-5$, a $|-5|=5$."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli sprawnie przekształcasz potęgi o wykładnikach całkowitych i wymiernych, swobodnie zamieniasz pierwiastki na potęgi i odwrotnie, bez wahania usuwasz niewymierność z mianownika oraz poprawnie obliczasz wartość bezwzględną liczby i prostych wyrażeń. To fundament, na którym zbudujesz logarytmy, wielomiany i wyrażenia wymierne w kolejnych lekcjach."
  }
]$content1$::jsonb,
  0
);

-- ----------------------------------------------------------------------------
-- Lesson 2: Logarytmy
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'liczby-rzeczywiste'),
  $title2$Logarytmy$title2$,
  $content2$[
  {
    "type": "intro",
    "text": "Logarytm to inny sposób zapisania pytania: „do jakiej potęgi trzeba podnieść daną liczbę, aby otrzymać inną liczbę?”. W tej lekcji poznasz definicję logarytmu, jego własności oraz nauczysz się przekształcać wyrażenia logarytmiczne — przydadzą się one później przy funkcji logarytmicznej i równaniach logarytmicznych."
  },
  {
    "type": "definition",
    "term": "Logarytm",
    "text": "Logarytmem liczby dodatniej $a$ przy podstawie $b$ (gdzie $b>0$ i $b\\neq1$) nazywamy wykładnik potęgi, do której trzeba podnieść $b$, aby otrzymać $a$.",
    "formula": "\\log_b a = c \\iff b^c = a, \\qquad a>0,\\ b>0,\\ b\\neq1"
  },
  {
    "type": "examples",
    "title": "Obliczanie logarytmów z definicji",
    "items": [
      {
        "problem": "\\log_2 8",
        "steps": [
          {
            "text": "Szukamy wykładnika, do którego trzeba podnieść $2$, aby otrzymać $8$.",
            "formula": "2^{?}=8"
          },
          {
            "text": "Ponieważ $2^3=8$, mamy odpowiedź.",
            "formula": "2^3=8"
          }
        ],
        "answer": "3"
      },
      {
        "problem": "\\log_5 1",
        "steps": [
          {
            "text": "Każda liczba dodatnia różna od $1$ podniesiona do potęgi $0$ daje $1$.",
            "formula": "5^0=1"
          }
        ],
        "answer": "0"
      },
      {
        "problem": "\\log_7 7",
        "steps": [
          {
            "text": "Każda liczba dodatnia różna od $1$ podniesiona do potęgi $1$ daje samą siebie.",
            "formula": "7^1=7"
          }
        ],
        "answer": "1"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Ile wynosi $\\log_3 81$?",
    "options": [
      "$3$",
      "$4$",
      "$27$",
      "$9$"
    ],
    "correctIndex": 1,
    "explanation": "$3^4=81$, więc $\\log_3 81 = 4$."
  },
  {
    "type": "table",
    "title": "Własności logarytmów",
    "headers": [
      "Wzór",
      "Warunki"
    ],
    "rows": [
      [
        "$\\log_b(x\\cdot y) = \\log_b x + \\log_b y$",
        "$x,y>0$"
      ],
      [
        "$\\log_b\\left(\\dfrac{x}{y}\\right) = \\log_b x - \\log_b y$",
        "$x,y>0$"
      ],
      [
        "$\\log_b x^n = n\\log_b x$",
        "$x>0,\\ n\\in\\mathbb{R}$"
      ],
      [
        "$\\log_b b = 1,\\quad \\log_b 1 = 0$",
        "$b>0,\\ b\\neq1$"
      ],
      [
        "$\\log_b a = \\dfrac{\\log_c a}{\\log_c b}$ (wzór na zamianę podstawy)",
        "$a,b,c>0,\\ b\\neq1,\\ c\\neq1$"
      ]
    ]
  },
  {
    "type": "quiz",
    "question": "Korzystając z własności logarytmów, zapisz $\\log_2 12 - \\log_2 3$ jako jeden logarytm i oblicz jego wartość.",
    "options": [
      "$\\log_2 4 = 2$",
      "$\\log_2 9 = 3{,}17...$",
      "$\\log_2 36$",
      "$\\log_2 15$"
    ],
    "correctIndex": 0,
    "explanation": "$\\log_2 12 - \\log_2 3 = \\log_2\\frac{12}{3} = \\log_2 4 = 2$."
  },
  {
    "type": "reveal-steps",
    "title": "Łączenie logarytmów w jeden wyraz",
    "problem": "Oblicz wartość wyrażenia $\\log_2 5 + \\log_2 8 - \\log_2 10$",
    "steps": [
      {
        "prompt": "Jak połączyć te trzy logarytmy w jeden, korzystając z ich własności?",
        "kind": "choice",
        "options": [
          "$\\log_2\\dfrac{5\\cdot 8}{10}$",
          "$\\log_2(5+8-10)$",
          "$\\log_2(5\\cdot8\\cdot10)$"
        ],
        "correctIndex": 0,
        "reveal": "Dodawanie logarytmów to logarytm iloczynu, a odejmowanie — logarytm ilorazu, więc $\\log_2 5+\\log_2 8-\\log_2 10=\\log_2\\frac{5\\cdot8}{10}$.",
        "formula": "\\log_2\\dfrac{5\\cdot8}{10}"
      },
      {
        "prompt": "Oblicz wartość ułamka pod logarytmem: $\\dfrac{5\\cdot8}{10}=?$",
        "kind": "input",
        "acceptedAnswers": [
          "4"
        ],
        "reveal": "$\\dfrac{5\\cdot8}{10}=\\dfrac{40}{10}=4$."
      },
      {
        "prompt": "Ile wynosi $\\log_2 4$?",
        "kind": "input",
        "acceptedAnswers": [
          "2"
        ],
        "reveal": "$\\log_2 4 = 2$, ponieważ $2^2=4$."
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Dla jakich $x$ istnieje $\\log_3(x-1)$?",
    "options": [
      "$x>1$",
      "$x\\ge1$",
      "$x>0$",
      "$x<1$"
    ],
    "correctIndex": 0,
    "explanation": "Argument logarytmu musi być dodatni: $x-1>0$, czyli $x>1$."
  },
  {
    "type": "definition",
    "term": "Logarytm dziesiętny i naturalny",
    "text": "Logarytm o podstawie $10$ nazywamy logarytmem dziesiętnym i zapisujemy $\\log a$ (bez podawania podstawy). Logarytm o podstawie $e\\approx2{,}71828\\ldots$ nazywamy logarytmem naturalnym i zapisujemy $\\ln a$.",
    "formula": "\\log a = \\log_{10} a, \\qquad \\ln a = \\log_e a"
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli potrafisz z definicji obliczyć prosty logarytm, sprawnie łączysz sumy i różnice logarytmów w jeden logarytm (i odwrotnie), znasz wzór na zamianę podstawy oraz umiesz wyznaczyć, dla jakich argumentów logarytm w ogóle istnieje."
  }
]$content2$::jsonb,
  1
);

-- ----------------------------------------------------------------------------
-- Lesson 3: Wielomiany: dzielenie, twierdzenie Bézouta i wzory Viète'a
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'liczby-rzeczywiste'),
  $title3$Wielomiany: dzielenie, twierdzenie Bézouta i wzory Viète'a$title3$,
  $content3$[
  {
    "type": "intro",
    "text": "Wielomiany to wyrażenia zbudowane z potęg jednej zmiennej pomnożonych przez współczynniki i zsumowanych. W tej lekcji nauczysz się dzielić wielomiany, korzystać z twierdzenia Bézouta do znajdowania pierwiastków oraz stosować wzory Viète'a, które łączą pierwiastki równania kwadratowego z jego współczynnikami."
  },
  {
    "type": "definition",
    "term": "Wielomian i jego stopień",
    "text": "Wielomianem zmiennej $x$ nazywamy wyrażenie postaci $W(x) = a_nx^n + a_{n-1}x^{n-1} + \\cdots + a_1x + a_0$, gdzie $a_n\\neq0$. Liczbę $n$ nazywamy stopniem wielomianu — to najwyższy wykładnik przy zmiennej $x$, którego współczynnik jest różny od zera.",
    "formula": "W(x) = a_nx^n + a_{n-1}x^{n-1} + \\cdots + a_1x + a_0, \\qquad a_n\\neq0"
  },
  {
    "type": "examples",
    "title": "Wyznaczanie stopnia wielomianu",
    "items": [
      {
        "problem": "W(x) = 3x^4 - 2x^2 + x - 7",
        "steps": [
          {
            "text": "Odczytujemy wszystkie wykładniki przy zmiennej $x$ z niezerowymi współczynnikami: $4, 2, 1, 0$."
          },
          {
            "text": "Stopień wielomianu to największy z tych wykładników.",
            "formula": "n=4"
          }
        ],
        "answer": "n=4"
      },
      {
        "problem": "W(x) = x^7 - 5x^3 - x + 2",
        "steps": [
          {
            "text": "Najwyższa potęga to $x^7$, a jej współczynnik ($1$) jest niezerowy.",
            "formula": "n=7"
          }
        ],
        "answer": "n=7"
      },
      {
        "problem": "W(x) = 8",
        "steps": [
          {
            "text": "Niezerowy wielomian stały traktujemy jako $8x^0$ — jego stopień wynosi $0$.",
            "formula": "n=0"
          }
        ],
        "answer": "n=0"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Jaki jest stopień wielomianu $W(x) = 2x^5 - x^5 + 3x^2$?",
    "options": [
      "$5$",
      "$2$",
      "$3$",
      "$10$"
    ],
    "correctIndex": 0,
    "explanation": "Najpierw upraszczamy: $2x^5-x^5=x^5$, więc $W(x)=x^5+3x^2$ — stopień wynosi $5$, mimo że na pierwszy rzut oka wyraz $x^5$ „znikał”."
  },
  {
    "type": "definition",
    "term": "Dzielenie wielomianów z resztą",
    "text": "Dla wielomianów $W(x)$ i $P(x)\\neq0$ istnieją jednoznacznie wyznaczone wielomiany: iloraz $Q(x)$ i reszta $R(x)$, przy czym stopień reszty jest mniejszy od stopnia dzielnika.",
    "formula": "W(x) = P(x)\\cdot Q(x) + R(x), \\qquad \\deg R < \\deg P"
  },
  {
    "type": "reveal-steps",
    "title": "Dzielenie wielomianu przez dwumian",
    "problem": "Podziel wielomian $W(x)=x^3-2x^2-5x+6$ przez $P(x)=x-1$",
    "steps": [
      {
        "prompt": "Jaką metodą najwygodniej podzielić wielomian przez dwumian $x-1$?",
        "kind": "choice",
        "options": [
          "Schemat Hornera (dzielenie syntetyczne)",
          "Wzory skróconego mnożenia",
          "Wzory Viète'a"
        ],
        "correctIndex": 0,
        "reveal": "Przy dzieleniu przez dwumian postaci $x-a$ najwygodniej jest użyć schematu Hornera."
      },
      {
        "prompt": "Ile wynosi reszta z dzielenia? (podpowiedź: sprawdź $W(1)$)",
        "kind": "input",
        "acceptedAnswers": [
          "0"
        ],
        "reveal": "$W(1) = 1-2-5+6=0$, więc reszta wynosi $0$ — oznacza to, że $x=1$ jest pierwiastkiem wielomianu $W(x)$.",
        "formula": "W(1) = 1-2-5+6=0"
      },
      {
        "prompt": "Jaki jest iloraz $Q(x)$?",
        "kind": "choice",
        "options": [
          "$x^2-x-6$",
          "$x^2+x-6$",
          "$x^2-3x+6$",
          "$x^2-x+6$"
        ],
        "correctIndex": 0,
        "reveal": "Wykonując dzielenie (np. schematem Hornera) otrzymujemy $Q(x)=x^2-x-6$, więc $W(x)=(x-1)(x^2-x-6)$.",
        "formula": "W(x) = (x-1)(x^2-x-6)"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Twierdzenie Bézouta mówi, że reszta z dzielenia wielomianu $W(x)$ przez dwumian $x-a$ jest równa:",
    "options": [
      "$W(a)$",
      "$W(0)$",
      "$W'(a)$",
      "$a$"
    ],
    "correctIndex": 0,
    "explanation": "Z twierdzenia Bézouta reszta z dzielenia $W(x)$ przez $(x-a)$ wynosi dokładnie $W(a)$."
  },
  {
    "type": "definition",
    "term": "Twierdzenie Bézouta i pierwiastki wielomianu",
    "text": "Liczba $a$ jest pierwiastkiem wielomianu $W(x)$ wtedy i tylko wtedy, gdy $W(x)$ dzieli się bez reszty przez dwumian $(x-a)$, czyli gdy $W(a)=0$.",
    "formula": "a\\ \\text{jest pierwiastkiem}\\ W(x) \\iff W(x) = (x-a)\\cdot Q(x)"
  },
  {
    "type": "definition",
    "term": "Wymierne pierwiastki wielomianu o współczynnikach całkowitych",
    "text": "Jeśli wielomian $W(x)=a_nx^n+\\cdots+a_0$ ma współczynniki całkowite, to każdy jego pierwiastek wymierny $\\frac{p}{q}$ (w postaci nieskracalnej) spełnia warunek: $p$ jest dzielnikiem wyrazu wolnego $a_0$, a $q$ jest dzielnikiem współczynnika przy najwyższej potędze $a_n$. To znacznie zawęża liczbę kandydatów, których trzeba sprawdzić metodą prób.",
    "formula": "p \\mid a_0, \\qquad q \\mid a_n"
  },
  {
    "type": "examples",
    "title": "Znajdowanie pierwiastków wielomianu",
    "items": [
      {
        "problem": "W(x) = x^3 - 6x^2 + 11x - 6",
        "steps": [
          {
            "text": "Szukamy pierwiastków całkowitych wśród dzielników wyrazu wolnego $-6$: $\\pm1,\\pm2,\\pm3,\\pm6$."
          },
          {
            "text": "Sprawdzamy $x=1$: to pierwiastek.",
            "formula": "W(1)=1-6+11-6=0"
          },
          {
            "text": "Dzielimy $W(x)$ przez $(x-1)$.",
            "formula": "W(x)=(x-1)(x^2-5x+6)"
          },
          {
            "text": "Rozwiązujemy otrzymany trójmian kwadratowy.",
            "formula": "x^2-5x+6=(x-2)(x-3)"
          }
        ],
        "answer": "x=1 \\lor x=2 \\lor x=3"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Dla równania $x^2+bx+c=0$ o pierwiastkach $x_1,x_2$, wzory Viète'a mówią, że:",
    "options": [
      "$x_1+x_2=-b,\\ x_1x_2=c$",
      "$x_1+x_2=b,\\ x_1x_2=c$",
      "$x_1+x_2=-b,\\ x_1x_2=-c$",
      "$x_1+x_2=c,\\ x_1x_2=b$"
    ],
    "correctIndex": 0,
    "explanation": "Dla postaci $x^2+bx+c=0$ (współczynnik przy $x^2$ równy $1$): $x_1+x_2=-b$ oraz $x_1x_2=c$."
  },
  {
    "type": "formula",
    "title": "Wzory Viète'a dla równania kwadratowego",
    "caption": "Prawdziwe, gdy równanie ma pierwiastki rzeczywiste, czyli $\\Delta\\ge0$.",
    "expression": "x_1+x_2=-\\dfrac{b}{a}, \\qquad x_1\\cdot x_2=\\dfrac{c}{a}",
    "variables": [
      {
        "symbol": "a, b, c",
        "meaning": "współczynniki równania $ax^2+bx+c=0$, gdzie $a\\neq0$"
      },
      {
        "symbol": "x_1, x_2",
        "meaning": "pierwiastki (rozwiązania) tego równania"
      }
    ]
  },
  {
    "type": "examples",
    "title": "Zastosowanie wzorów Viète'a",
    "items": [
      {
        "problem": "x^2 - 5x + 6 = 0",
        "steps": [
          {
            "text": "Odczytujemy współczynniki: $a=1$, $b=-5$, $c=6$."
          },
          {
            "text": "Obliczamy sumę pierwiastków.",
            "formula": "x_1+x_2=-\\dfrac{b}{a}=5"
          },
          {
            "text": "Obliczamy iloczyn pierwiastków.",
            "formula": "x_1x_2=\\dfrac{c}{a}=6"
          }
        ],
        "answer": "x_1+x_2=5,\\ \\ x_1x_2=6"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Pierwiastki równania $x^2+7x+10=0$ spełniają (bez rozwiązywania równania):",
    "options": [
      "$x_1+x_2=-7,\\ x_1x_2=10$",
      "$x_1+x_2=7,\\ x_1x_2=10$",
      "$x_1+x_2=-7,\\ x_1x_2=-10$",
      "$x_1+x_2=-10,\\ x_1x_2=7$"
    ],
    "correctIndex": 0,
    "explanation": "$a=1$, $b=7$, $c=10$, więc $x_1+x_2=-\\frac{b}{a}=-7$ oraz $x_1x_2=\\frac{c}{a}=10$."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Wzorów Viète'a możesz używać tylko wtedy, gdy równanie kwadratowe ma rozwiązania rzeczywiste, czyli gdy wyróżnik $\\Delta\\ge0$. Zawsze warto to najpierw sprawdzić, zanim zaczniesz liczyć sumę i iloczyn pierwiastków."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli sprawnie dzielisz wielomiany przez dwumian (np. schematem Hornera), potrafisz z twierdzenia Bézouta wywnioskować, czy dana liczba jest pierwiastkiem, umiesz metodycznie szukać pierwiastków wymiernych wielomianu o współczynnikach całkowitych oraz swobodnie stosujesz wzory Viète'a do wyznaczania sumy i iloczynu pierwiastków równania kwadratowego."
  }
]$content3$::jsonb,
  2
);

-- ----------------------------------------------------------------------------
-- Lesson 4: Wyrażenia wymierne
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'liczby-rzeczywiste'),
  $title4$Wyrażenia wymierne$title4$,
  $content4$[
  {
    "type": "intro",
    "text": "Wyrażenia wymierne to ułamki, w których licznik i mianownik są wielomianami. W tej lekcji nauczysz się wyznaczać ich dziedzinę, upraszczać je oraz wykonywać na nich cztery podstawowe działania — podobnie jak na zwykłych ułamkach liczbowych, tylko że teraz liczniki i mianowniki zawierają zmienną $x$."
  },
  {
    "type": "definition",
    "term": "Wyrażenie wymierne i jego dziedzina",
    "text": "Wyrażeniem wymiernym nazywamy iloraz dwóch wielomianów $\\dfrac{W(x)}{P(x)}$, gdzie $P(x)$ nie jest wielomianem zerowym. Dziedziną takiego wyrażenia jest zbiór wszystkich argumentów $x$, dla których mianownik jest różny od zera.",
    "formula": "\\dfrac{W(x)}{P(x)}, \\qquad P(x)\\not\\equiv0"
  },
  {
    "type": "examples",
    "title": "Wyznaczanie dziedziny wyrażenia wymiernego",
    "items": [
      {
        "problem": "\\dfrac{x+2}{x-3}",
        "steps": [
          {
            "text": "Mianownik nie może być równy zeru.",
            "formula": "x-3\\neq0"
          },
          {
            "text": "Rozwiązujemy warunek.",
            "formula": "x\\neq3"
          }
        ],
        "answer": "x\\neq3"
      },
      {
        "problem": "\\dfrac{5}{x^2-4}",
        "steps": [
          {
            "text": "Mianownik nie może być równy zeru.",
            "formula": "x^2-4\\neq0"
          },
          {
            "text": "Rozkładamy na czynniki (różnica kwadratów).",
            "formula": "(x-2)(x+2)\\neq0"
          },
          {
            "text": "Wyznaczamy wartości zabronione.",
            "formula": "x\\neq2 \\land x\\neq-2"
          }
        ],
        "answer": "x\\neq-2 \\land x\\neq2"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Jaka jest dziedzina wyrażenia $\\dfrac{3x}{x^2-9}$?",
    "options": [
      "$x\\neq-3$ i $x\\neq3$",
      "$x\\neq0$",
      "$x\\neq9$",
      "$x\\in\\mathbb{R}$"
    ],
    "correctIndex": 0,
    "explanation": "$x^2-9=(x-3)(x+3)$, więc mianownik zeruje się dla $x=3$ i $x=-3$."
  },
  {
    "type": "definition",
    "term": "Upraszczanie wyrażeń wymiernych",
    "text": "Aby uprościć wyrażenie wymierne, rozkładamy licznik i mianownik na czynniki, a następnie skracamy czynniki wspólne. Założenia (dziedzinę) zapisujemy na podstawie mianownika sprzed skrócenia — informacja o zakazanej wartości nie może „zniknąć” razem ze skróconym czynnikiem.",
    "formula": "\\dfrac{x^2-1}{x-1} = \\dfrac{(x-1)(x+1)}{x-1} = x+1, \\qquad x\\neq1"
  },
  {
    "type": "reveal-steps",
    "title": "Upraszczanie wyrażenia wymiernego",
    "problem": "Uprość wyrażenie $\\dfrac{x^2-4}{x^2+4x+4}$ i podaj założenia.",
    "steps": [
      {
        "prompt": "Rozłóż licznik na czynniki: $x^2-4=?$",
        "kind": "input",
        "acceptedAnswers": [
          "(x-2)(x+2)",
          "(x+2)(x-2)"
        ],
        "reveal": "$x^2-4=(x-2)(x+2)$ — wzór skróconego mnożenia na różnicę kwadratów.",
        "formula": "x^2-4=(x-2)(x+2)"
      },
      {
        "prompt": "Rozłóż mianownik na czynniki: $x^2+4x+4=?$",
        "kind": "input",
        "acceptedAnswers": [
          "(x+2)^2",
          "(x+2)(x+2)"
        ],
        "reveal": "$x^2+4x+4=(x+2)^2$ — wzór skróconego mnożenia na kwadrat sumy.",
        "formula": "x^2+4x+4=(x+2)^2"
      },
      {
        "prompt": "Jakie jest założenie (dziedzina) wynikające z mianownika?",
        "kind": "choice",
        "options": [
          "$x\\neq-2$",
          "$x\\neq2$",
          "$x\\neq0$",
          "$x\\in\\mathbb{R}$"
        ],
        "correctIndex": 0,
        "reveal": "Mianownik $(x+2)^2$ zeruje się dla $x=-2$, więc zakładamy $x\\neq-2$."
      },
      {
        "prompt": "Po skróceniu wspólnego czynnika $(x+2)$ otrzymujemy:",
        "kind": "choice",
        "options": [
          "$\\dfrac{x-2}{x+2}$",
          "$\\dfrac{x+2}{x-2}$",
          "$x-2$",
          "$\\dfrac{1}{x+2}$"
        ],
        "correctIndex": 0,
        "reveal": "Skracamy jeden czynnik $(x+2)$ z licznika i mianownika: $\\dfrac{(x-2)(x+2)}{(x+2)^2}=\\dfrac{x-2}{x+2}$.",
        "formula": "\\dfrac{(x-2)(x+2)}{(x+2)^2}=\\dfrac{x-2}{x+2}"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Uprość $\\dfrac{2x^2-2}{x-1}$ dla $x\\neq1$.",
    "options": [
      "$2(x+1)$",
      "$2x+1$",
      "$x+1$",
      "$2x-1$"
    ],
    "correctIndex": 0,
    "explanation": "$2x^2-2=2(x-1)(x+1)$, po skróceniu czynnika $(x-1)$ zostaje $2(x+1)$."
  },
  {
    "type": "definition",
    "term": "Mnożenie i dzielenie wyrażeń wymiernych",
    "text": "Wyrażenia wymierne mnożymy i dzielimy tak samo jak zwykłe ułamki: mnożymy (lub dzielimy przez odwrotność) liczniki i mianowniki osobno, pamiętając o założeniu, że żaden mianownik (w tym mianownik dzielnika) nie może być równy zeru.",
    "formula": "\\dfrac{a}{b}\\cdot\\dfrac{c}{d}=\\dfrac{ac}{bd}, \\qquad \\dfrac{a}{b}:\\dfrac{c}{d}=\\dfrac{a}{b}\\cdot\\dfrac{d}{c}=\\dfrac{ad}{bc}"
  },
  {
    "type": "examples",
    "title": "Mnożenie i dzielenie wyrażeń wymiernych",
    "items": [
      {
        "problem": "\\dfrac{x}{x+1}\\cdot\\dfrac{x+1}{x^2}",
        "steps": [
          {
            "text": "Mnożymy liczniki i mianowniki.",
            "formula": "\\dfrac{x(x+1)}{(x+1)x^2}"
          },
          {
            "text": "Skracamy wspólny czynnik $(x+1)$.",
            "formula": "\\dfrac{x}{x^2}"
          },
          {
            "text": "Skracamy $x$.",
            "formula": "\\dfrac{1}{x}"
          }
        ],
        "answer": "\\dfrac{1}{x}, \\quad x\\neq0 \\land x\\neq-1"
      },
      {
        "problem": "\\dfrac{x^2-1}{x}:\\dfrac{x+1}{x^2}",
        "steps": [
          {
            "text": "Dzielenie zamieniamy na mnożenie przez odwrotność.",
            "formula": "\\dfrac{x^2-1}{x}\\cdot\\dfrac{x^2}{x+1}"
          },
          {
            "text": "Rozkładamy licznik $x^2-1$ na czynniki.",
            "formula": "\\dfrac{(x-1)(x+1)}{x}\\cdot\\dfrac{x^2}{x+1}"
          },
          {
            "text": "Skracamy $(x+1)$ oraz jeden czynnik $x$.",
            "formula": "(x-1)\\cdot x"
          },
          {
            "text": "Zapisujemy wynik.",
            "formula": "x^2-x"
          }
        ],
        "answer": "x^2-x, \\quad x\\neq0 \\land x\\neq-1"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Wynikiem dzielenia $\\dfrac{3}{x}:\\dfrac{6}{x^2}$ (dla $x\\neq0$) jest:",
    "options": [
      "$\\dfrac{x}{2}$",
      "$\\dfrac{2}{x}$",
      "$\\dfrac{x^2}{2}$",
      "$2x$"
    ],
    "correctIndex": 0,
    "explanation": "$\\dfrac{3}{x}:\\dfrac{6}{x^2}=\\dfrac{3}{x}\\cdot\\dfrac{x^2}{6}=\\dfrac{3x^2}{6x}=\\dfrac{x}{2}$."
  },
  {
    "type": "definition",
    "term": "Dodawanie i odejmowanie wyrażeń wymiernych",
    "text": "Aby dodać lub odjąć wyrażenia wymierne, sprowadzamy je do wspólnego mianownika (najlepiej najmniejszego wspólnego wielokrotnika mianowników), a następnie dodajemy lub odejmujemy same liczniki.",
    "formula": "\\dfrac{a}{b}+\\dfrac{c}{d} = \\dfrac{ad+bc}{bd}"
  },
  {
    "type": "examples",
    "title": "Dodawanie wyrażeń wymiernych",
    "items": [
      {
        "problem": "\\dfrac{1}{x}+\\dfrac{1}{x+1}",
        "steps": [
          {
            "text": "Wspólnym mianownikiem jest $x(x+1)$.",
            "formula": "\\dfrac{x+1}{x(x+1)}+\\dfrac{x}{x(x+1)}"
          },
          {
            "text": "Dodajemy liczniki.",
            "formula": "\\dfrac{(x+1)+x}{x(x+1)}"
          },
          {
            "text": "Upraszczamy licznik.",
            "formula": "\\dfrac{2x+1}{x(x+1)}"
          }
        ],
        "answer": "\\dfrac{2x+1}{x(x+1)}, \\quad x\\neq0 \\land x\\neq-1"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Jaki jest wspólny mianownik przy dodawaniu $\\dfrac{2}{x-1}+\\dfrac{3}{x+2}$?",
    "options": [
      "$(x-1)(x+2)$",
      "$x-1+x+2$",
      "$(x-1)+(x+2)$",
      "$x^2$"
    ],
    "correctIndex": 0,
    "explanation": "Wspólnym mianownikiem dwóch różnych dwumianów jest ich iloczyn: $(x-1)(x+2)$."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Pamiętaj: przy każdym przekształceniu wyrażenia wymiernego (np. skracaniu) zapisz założenia (dziedzinę) PRZED uproszczeniem. Po skróceniu czynnika informacja o zabronionej wartości może „zniknąć” ze wzoru, ale nadal obowiązuje!"
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli bezbłędnie wyznaczasz dziedzinę wyrażenia wymiernego, sprawnie rozkładasz licznik i mianownik na czynniki, żeby je uprościć, oraz potrafisz mnożyć, dzielić, dodawać i odejmować wyrażenia wymierne, zawsze pamiętając o zapisaniu założeń."
  }
]$content4$::jsonb,
  3
);

