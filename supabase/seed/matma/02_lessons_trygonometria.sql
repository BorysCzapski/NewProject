-- ============================================================================
-- supabase/seed/matma/02_lessons_trygonometria.sql
-- Interactive lesson content (math_lessons) for the "trygonometria" department:
-- Tozsamosci, rownania i nierownosci trygonometryczne, funkcje
-- trygonometryczne kata w trojkacie prostokatnym i dowolnym.
-- content is a jsonb array of MathBlock (see lib/matma/lesson-blocks.ts).
--
-- Idempotent: deletes existing lessons for this topic first. Run
-- 01_topics.sql BEFORE this file — it looks up topic_id by slug.
-- ============================================================================

delete from math_lessons
where topic_id = (select id from math_topics where slug = 'trygonometria');

-- ----------------------------------------------------------------------------
-- Lesson 1: Funkcje trygonometryczne kąta ostrego w trójkącie prostokątnym
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'trygonometria'),
  $title1$Funkcje trygonometryczne kąta ostrego w trójkącie prostokątnym$title1$,
  $content1$[
  {
    "type": "basics-recap",
    "title": "Trójkąt prostokątny i twierdzenie Pitagorasa — przypomnienie",
    "text": "Trójkąt prostokątny to trójkąt, w którym jeden z kątów ma miarę $90^\\circ$. Bok leżący naprzeciw kąta prostego nazywamy przeciwprostokątną — jest to zawsze najdłuższy bok trójkąta. Pozostałe dwa boki, które tworzą kąt prosty, nazywamy przyprostokątnymi. Twierdzenie Pitagorasa mówi, że suma kwadratów długości przyprostokątnych jest równa kwadratowi długości przeciwprostokątnej. Warto też pamiętać, że suma miar kątów w każdym trójkącie wynosi $180^\\circ$, więc w trójkącie prostokątnym oba kąty ostre sumują się do $90^\\circ$.",
    "formula": "a^2+b^2=c^2",
    "controlQuiz": [
      {
        "question": "W trójkącie prostokątnym bok leżący naprzeciw kąta prostego nazywamy:",
        "options": [
          "Przeciwprostokątną",
          "Przyprostokątną",
          "Wysokością",
          "Symetralną"
        ],
        "correctIndex": 0,
        "explanation": "Przeciwprostokątna leży naprzeciw kąta prostego i jest zawsze najdłuższym bokiem trójkąta prostokątnego."
      },
      {
        "question": "Przyprostokątne trójkąta prostokątnego mają długości $3$ i $4$. Ile wynosi długość przeciwprostokątnej?",
        "options": [
          "$5$",
          "$6$",
          "$7$",
          "$12$"
        ],
        "correctIndex": 0,
        "explanation": "Z twierdzenia Pitagorasa: $c=\\sqrt{3^2+4^2}=\\sqrt{9+16}=\\sqrt{25}=5$."
      },
      {
        "question": "Ile wynosi suma miar dwóch kątów ostrych w trójkącie prostokątnym?",
        "options": [
          "$90^\\circ$",
          "$180^\\circ$",
          "$45^\\circ$",
          "$60^\\circ$"
        ],
        "correctIndex": 0,
        "explanation": "Suma wszystkich kątów w trójkącie to $180^\\circ$. Skoro jeden z nich ma $90^\\circ$, pozostałe dwa sumują się do $180^\\circ-90^\\circ=90^\\circ$."
      }
    ]
  },
  {
    "type": "definition",
    "term": "Sinus i kosinus kąta ostrego",
    "text": "Dla kąta ostrego $\\alpha$ w trójkącie prostokątnym definiujemy: sinus kąta $\\alpha$ to stosunek długości przyprostokątnej leżącej naprzeciw tego kąta do długości przeciwprostokątnej, a kosinus kąta $\\alpha$ to stosunek długości przyprostokątnej leżącej przy tym kącie do długości przeciwprostokątnej. Wartości te nie zależą od wielkości trójkąta — tylko od miary kąta $\\alpha$, bo wszystkie trójkąty prostokątne o tym samym kącie ostrym są podobne.",
    "formula": "\\sin\\alpha=\\dfrac{a}{c},\\qquad \\cos\\alpha=\\dfrac{b}{c}"
  },
  {
    "type": "geometry",
    "title": "Zbadaj trójkąt prostokątny",
    "caption": "Punkt A to wierzchołek kąta prostego. Przeciągaj C tylko w pionie, a B tylko w poziomie — wtedy kąt przy wierzchołku A pozostaje prosty. Sprawdź, że stosunek boku AC do BC to $\\sin B$, a AB do BC to $\\cos B$ — niezależnie od tego, jak zmienisz kąt.",
    "shape": {
      "points": [
        {
          "id": "A",
          "x": 20,
          "y": 80,
          "label": "A",
          "draggable": false
        },
        {
          "id": "B",
          "x": 80,
          "y": 80,
          "label": "B",
          "draggable": true
        },
        {
          "id": "C",
          "x": 20,
          "y": 20,
          "label": "C",
          "draggable": true
        }
      ],
      "edges": [
        [
          "A",
          "B"
        ],
        [
          "B",
          "C"
        ],
        [
          "C",
          "A"
        ]
      ],
      "measures": [
        {
          "kind": "angle",
          "at": "B",
          "from": "A",
          "to": "C",
          "label": "Kąt przy wierzchołku B"
        },
        {
          "kind": "distance",
          "from": "A",
          "to": "C",
          "label": "Bok AC (naprzeciw kąta B)"
        },
        {
          "kind": "distance",
          "from": "A",
          "to": "B",
          "label": "Bok AB (przy kącie B)"
        },
        {
          "kind": "distance",
          "from": "B",
          "to": "C",
          "label": "Bok BC (przeciwprostokątna)"
        }
      ]
    }
  },
  {
    "type": "quiz",
    "question": "W trójkącie prostokątnym przyprostokątne mają długości $3$ i $4$, a przeciwprostokątna $5$. Kąt $\\alpha$ leży naprzeciw boku o długości $3$. Ile wynosi $\\sin\\alpha$?",
    "options": [
      "$\\dfrac{3}{5}$",
      "$\\dfrac{4}{5}$",
      "$\\dfrac{5}{3}$",
      "$\\dfrac{3}{4}$"
    ],
    "correctIndex": 0,
    "explanation": "$\\sin\\alpha$ to stosunek przyprostokątnej naprzeciw kąta ($3$) do przeciwprostokątnej ($5$), czyli $\\dfrac{3}{5}$."
  },
  {
    "type": "definition",
    "term": "Tangens i kotangens kąta ostrego",
    "text": "Tangens kąta ostrego $\\alpha$ to stosunek przyprostokątnej leżącej naprzeciw kąta do przyprostokątnej leżącej przy kącie — równoważnie, stosunek sinusa do kosinusa tego kąta. Kotangens to odwrotność tangensa.",
    "formula": "\\tan\\alpha=\\dfrac{a}{b}=\\dfrac{\\sin\\alpha}{\\cos\\alpha},\\qquad \\cot\\alpha=\\dfrac{b}{a}=\\dfrac{1}{\\tan\\alpha}"
  },
  {
    "type": "formula",
    "title": "Jedynka trygonometryczna",
    "caption": "Wzór wynika wprost z twierdzenia Pitagorasa: dzieląc obie strony równości $a^2+b^2=c^2$ przez $c^2$, otrzymujemy $\\left(\\frac{a}{c}\\right)^2+\\left(\\frac{b}{c}\\right)^2=1$, czyli dokładnie $\\sin^2\\alpha+\\cos^2\\alpha=1$.",
    "expression": "\\sin^2\\alpha+\\cos^2\\alpha=1"
  },
  {
    "type": "quiz",
    "question": "Kąt ostry $\\alpha$ spełnia $\\sin\\alpha=\\dfrac{3}{5}$ oraz $\\cos\\alpha=\\dfrac{4}{5}$. Ile wynosi $\\tan\\alpha$?",
    "options": [
      "$\\dfrac{3}{4}$",
      "$\\dfrac{4}{3}$",
      "$\\dfrac{3}{5}$",
      "$\\dfrac{4}{5}$"
    ],
    "correctIndex": 0,
    "explanation": "$\\tan\\alpha=\\dfrac{\\sin\\alpha}{\\cos\\alpha}=\\dfrac{3/5}{4/5}=\\dfrac{3}{4}$."
  },
  {
    "type": "table",
    "title": "Wartości funkcji trygonometrycznych kątów szczególnych",
    "headers": [
      "Kąt $\\alpha$",
      "$\\sin\\alpha$",
      "$\\cos\\alpha$",
      "$\\tan\\alpha$"
    ],
    "rows": [
      [
        "$0^\\circ$",
        "$0$",
        "$1$",
        "$0$"
      ],
      [
        "$30^\\circ$",
        "$\\dfrac{1}{2}$",
        "$\\dfrac{\\sqrt3}{2}$",
        "$\\dfrac{\\sqrt3}{3}$"
      ],
      [
        "$45^\\circ$",
        "$\\dfrac{\\sqrt2}{2}$",
        "$\\dfrac{\\sqrt2}{2}$",
        "$1$"
      ],
      [
        "$60^\\circ$",
        "$\\dfrac{\\sqrt3}{2}$",
        "$\\dfrac{1}{2}$",
        "$\\sqrt3$"
      ],
      [
        "$90^\\circ$",
        "$1$",
        "$0$",
        "nie istnieje"
      ]
    ]
  },
  {
    "type": "examples",
    "title": "Wyznaczanie boku trójkąta za pomocą sinusa",
    "items": [
      {
        "problem": "\\text{Przyprostokątna naprzeciw kąta } 30^\\circ \\text{ ma długość } 5. \\text{ Oblicz przeciwprostokątną } c.",
        "steps": [
          {
            "text": "Zapisujemy definicję sinusa dla kąta $30^\\circ$ w tym trójkącie.",
            "formula": "\\sin30^\\circ=\\dfrac{5}{c}"
          },
          {
            "text": "Podstawiamy wartość $\\sin30^\\circ=\\dfrac12$ odczytaną z tabeli kątów szczególnych.",
            "formula": "\\dfrac12=\\dfrac{5}{c}"
          },
          {
            "text": "Rozwiązujemy równanie względem $c$.",
            "formula": "c=10"
          }
        ],
        "answer": "c=10"
      }
    ]
  },
  {
    "type": "reveal-steps",
    "title": "Rozwiąż samodzielnie: brakująca przyprostokątna",
    "problem": "W trójkącie prostokątnym przeciwprostokątna ma długość $8$, a jeden z kątów ostrych ma miarę $60^\\circ$. Oblicz długość przyprostokątnej leżącej naprzeciw tego kąta.",
    "steps": [
      {
        "prompt": "Która funkcja trygonometryczna wiąże przyprostokątną naprzeciw kąta z przeciwprostokątną?",
        "kind": "choice",
        "options": [
          "Sinus",
          "Kosinus",
          "Tangens"
        ],
        "correctIndex": 0,
        "reveal": "Sinus kąta to stosunek przyprostokątnej naprzeciw kąta do przeciwprostokątnej.",
        "formula": "\\sin60^\\circ=\\dfrac{a}{8}"
      },
      {
        "prompt": "Jaka jest wartość $\\sin60^\\circ$ (skorzystaj z tabeli wartości szczególnych)?",
        "kind": "choice",
        "options": [
          "$\\dfrac{1}{2}$",
          "$\\dfrac{\\sqrt2}{2}$",
          "$\\dfrac{\\sqrt3}{2}$"
        ],
        "correctIndex": 2,
        "reveal": "Z tabeli kątów szczególnych: $\\sin60^\\circ=\\dfrac{\\sqrt3}{2}$.",
        "formula": "\\sin60^\\circ=\\dfrac{\\sqrt3}{2}"
      },
      {
        "prompt": "Rozwiąż równanie $\\dfrac{\\sqrt3}{2}=\\dfrac{a}{8}$ i wskaż dokładną wartość $a$.",
        "kind": "choice",
        "options": [
          "$4\\sqrt3$",
          "$4/\\sqrt3$",
          "$8\\sqrt3$"
        ],
        "correctIndex": 0,
        "reveal": "Mnożymy obie strony przez $8$: $a=8\\cdot\\dfrac{\\sqrt3}{2}=4\\sqrt3$.",
        "formula": "a=8\\cdot\\dfrac{\\sqrt3}{2}=4\\sqrt3"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Kąt ostry trójkąta prostokątnego ma miarę $45^\\circ$. Jaki jest stosunek długości obu przyprostokątnych?",
    "options": [
      "$1:1$ (są równe)",
      "$1:2$",
      "$\\sqrt2:1$",
      "$2:1$"
    ],
    "correctIndex": 0,
    "explanation": "Dla $45^\\circ$ zachodzi $\\sin45^\\circ=\\cos45^\\circ$, więc obie przyprostokątne mają jednakową długość."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję masz opanowaną, jeśli bez wahania wskazujesz przeciwprostokątną i przyprostokątne w trójkącie prostokątnym, zapisujesz definicje $\\sin$, $\\cos$, $\\tan$ i $\\cot$ kąta ostrego jako stosunki boków, znasz na pamięć wartości funkcji trygonometrycznych dla kątów $30^\\circ$, $45^\\circ$, $60^\\circ$ oraz potrafisz wykorzystać te wartości do obliczenia brakującego boku w trójkącie prostokątnym."
  }
]$content1$::jsonb,
  0
);

-- ----------------------------------------------------------------------------
-- Lesson 2: Funkcje trygonometryczne kąta dowolnego — okrąg jednostkowy i radiany
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'trygonometria'),
  $title2$Funkcje trygonometryczne kąta dowolnego — okrąg jednostkowy i radiany$title2$,
  $content2$[
  {
    "type": "intro",
    "text": "Definicje z poprzedniej lekcji działają tylko dla kątów ostrych (od $0^\\circ$ do $90^\\circ$) — a przecież w zadaniach maturalnych spotkasz też kąty rozwarte, kąt $180^\\circ$, a nawet kąty ujemne czy większe od $360^\\circ$. W tej lekcji rozszerzymy definicje sinusa i kosinusa na dowolny kąt za pomocą okręgu jednostkowego oraz poznamy alternatywną, „naukową” miarę kąta — radian."
  },
  {
    "type": "definition",
    "term": "Okrąg jednostkowy",
    "text": "Okrąg jednostkowy to okrąg o środku w początku układu współrzędnych i promieniu $1$. Dla dowolnego kąta $\\alpha$ (mierzonego od dodatniej półosi $Ox$, przeciwnie do ruchu wskazówek zegara) punktowi $P(\\alpha)$ leżącemu na tym okręgu odpowiadają współrzędne $(\\cos\\alpha,\\sin\\alpha)$. Ta definicja pokrywa się z definicją z trójkąta prostokątnego dla kątów ostrych, ale działa też dla kątów rozwartych, ujemnych i większych od $360^\\circ$.",
    "formula": "P(\\alpha)=(\\cos\\alpha,\\sin\\alpha)"
  },
  {
    "type": "quiz",
    "question": "Na okręgu jednostkowym punktowi odpowiadającemu kątowi $180^\\circ$ odpowiadają współrzędne:",
    "options": [
      "$(-1,0)$",
      "$(0,-1)$",
      "$(1,0)$",
      "$(0,1)$"
    ],
    "correctIndex": 0,
    "explanation": "Kąt $180^\\circ$ wskazuje punkt leżący na ujemnej półosi $Ox$, czyli $(-1,0)$. Stąd $\\cos180^\\circ=-1$ oraz $\\sin180^\\circ=0$."
  },
  {
    "type": "table",
    "title": "Znaki funkcji trygonometrycznych w poszczególnych ćwiartkach",
    "headers": [
      "Ćwiartka",
      "Zakres kąta",
      "$\\sin\\alpha$",
      "$\\cos\\alpha$",
      "$\\tan\\alpha$"
    ],
    "rows": [
      [
        "I",
        "$0^\\circ$–$90^\\circ$",
        "$+$",
        "$+$",
        "$+$"
      ],
      [
        "II",
        "$90^\\circ$–$180^\\circ$",
        "$+$",
        "$-$",
        "$-$"
      ],
      [
        "III",
        "$180^\\circ$–$270^\\circ$",
        "$-$",
        "$-$",
        "$+$"
      ],
      [
        "IV",
        "$270^\\circ$–$360^\\circ$",
        "$-$",
        "$+$",
        "$-$"
      ]
    ]
  },
  {
    "type": "quiz",
    "question": "Kąt $\\alpha$ należy do II ćwiartki ($90^\\circ<\\alpha<180^\\circ$). Jaki znak ma $\\cos\\alpha$?",
    "options": [
      "Dodatni",
      "Ujemny",
      "Zero",
      "Zależy od dokładnej wartości kąta"
    ],
    "correctIndex": 1,
    "explanation": "W II ćwiartce współrzędna $x$ punktu na okręgu jednostkowym jest ujemna, a $\\cos\\alpha$ to właśnie ta współrzędna — więc $\\cos\\alpha<0$."
  },
  {
    "type": "definition",
    "term": "Miara łukowa kąta (radian)",
    "text": "Radian to miara kąta środkowego, który opiera się na łuku o długości równej promieniowi okręgu. Pełny kąt ($360^\\circ$) odpowiada $2\\pi$ radianom. Aby zamienić stopnie na radiany, mnożymy przez $\\dfrac{\\pi}{180^\\circ}$; aby zamienić radiany na stopnie, mnożymy przez $\\dfrac{180^\\circ}{\\pi}$.",
    "formula": "\\alpha_{rad}=\\alpha_{deg}\\cdot\\dfrac{\\pi}{180^\\circ}"
  },
  {
    "type": "table",
    "title": "Kąty szczególne w stopniach i radianach",
    "headers": [
      "Stopnie",
      "Radiany"
    ],
    "rows": [
      [
        "$0^\\circ$",
        "$0$"
      ],
      [
        "$30^\\circ$",
        "$\\dfrac{\\pi}{6}$"
      ],
      [
        "$45^\\circ$",
        "$\\dfrac{\\pi}{4}$"
      ],
      [
        "$60^\\circ$",
        "$\\dfrac{\\pi}{3}$"
      ],
      [
        "$90^\\circ$",
        "$\\dfrac{\\pi}{2}$"
      ],
      [
        "$180^\\circ$",
        "$\\pi$"
      ],
      [
        "$270^\\circ$",
        "$\\dfrac{3\\pi}{2}$"
      ],
      [
        "$360^\\circ$",
        "$2\\pi$"
      ]
    ]
  },
  {
    "type": "examples",
    "title": "Zamiana miary kąta: stopnie i radiany",
    "items": [
      {
        "problem": "\\text{Zamień } 150^\\circ \\text{ na radiany.}",
        "steps": [
          {
            "text": "Mnożymy $150^\\circ$ przez $\\dfrac{\\pi}{180^\\circ}$.",
            "formula": "150\\cdot\\dfrac{\\pi}{180}"
          },
          {
            "text": "Skracamy ułamek $\\dfrac{150}{180}$ przez $30$.",
            "formula": "\\dfrac{150}{180}=\\dfrac{5}{6}"
          }
        ],
        "answer": "\\dfrac{5\\pi}{6}"
      },
      {
        "problem": "\\text{Zamień } \\dfrac{5\\pi}{3} \\text{ na stopnie.}",
        "steps": [
          {
            "text": "Mnożymy $\\dfrac{5\\pi}{3}$ przez $\\dfrac{180^\\circ}{\\pi}$ — czynniki $\\pi$ się skracają.",
            "formula": "\\dfrac{5}{3}\\cdot180^\\circ"
          },
          {
            "text": "Obliczamy wynik: $\\dfrac{1}{3}\\cdot180^\\circ=60^\\circ$, więc $5\\cdot60^\\circ=300^\\circ$.",
            "formula": "300^\\circ"
          }
        ],
        "answer": "300^\\circ"
      }
    ]
  },
  {
    "type": "reveal-steps",
    "title": "Rozwiąż samodzielnie: zamiana na radiany",
    "problem": "Zamień kąt $210^\\circ$ na radiany.",
    "steps": [
      {
        "prompt": "Jakim wzorem przeliczysz miarę kąta ze stopni na radiany?",
        "kind": "choice",
        "options": [
          "$\\alpha_{rad}=\\alpha_{deg}\\cdot\\dfrac{\\pi}{180^\\circ}$",
          "$\\alpha_{rad}=\\alpha_{deg}\\cdot\\dfrac{180^\\circ}{\\pi}$",
          "$\\alpha_{rad}=\\alpha_{deg}+\\pi$"
        ],
        "correctIndex": 0,
        "reveal": "Ze stopni na radiany przechodzimy, mnożąc przez $\\dfrac{\\pi}{180^\\circ}$.",
        "formula": "\\alpha_{rad}=\\alpha_{deg}\\cdot\\dfrac{\\pi}{180^\\circ}"
      },
      {
        "prompt": "Podstaw $210^\\circ$ do wzoru i uprość ułamek $\\dfrac{210}{180}$.",
        "kind": "choice",
        "options": [
          "$\\dfrac{7\\pi}{6}$",
          "$\\dfrac{6\\pi}{7}$",
          "$210\\pi$"
        ],
        "correctIndex": 0,
        "reveal": "Ułamek $\\dfrac{210}{180}$ skracamy przez $30$, otrzymując $\\dfrac{7}{6}$.",
        "formula": "210\\cdot\\dfrac{\\pi}{180}=\\dfrac{7\\pi}{6}"
      },
      {
        "prompt": "Wartość $\\dfrac{7\\pi}{6}$ radiana jest większa czy mniejsza od $\\pi$ (czyli od $180^\\circ$)? Sprawdź, porównując liczniki ułamków $\\dfrac{7}{6}$ i $1=\\dfrac{6}{6}$.",
        "kind": "choice",
        "options": [
          "Większa od $\\pi$ (bo $210^\\circ>180^\\circ$)",
          "Mniejsza od $\\pi$",
          "Równa $\\pi$"
        ],
        "correctIndex": 0,
        "reveal": "Skoro $\\dfrac{7}{6}>1$, to $\\dfrac{7\\pi}{6}>\\pi$ — zgadza się to z tym, że $210^\\circ>180^\\circ$."
      }
    ]
  },
  {
    "type": "function-plot",
    "title": "Wykres funkcji $f(x)=a\\cos(bx+c)$",
    "caption": "Suwak $a$ zmienia amplitudę, $b$ zmienia częstość (im większe $b$, tym krótszy okres $T=\\dfrac{2\\pi}{|b|}$), a $c$ przesuwa wykres w poziomie (przesunięcie fazowe). Oś $x$ jest tu wyrażona w radianach.",
    "expression": "a * Math.cos(b * x + c)",
    "params": [
      {
        "symbol": "a",
        "label": "Amplituda",
        "min": 0.5,
        "max": 3,
        "step": 0.5,
        "default": 1
      },
      {
        "symbol": "b",
        "label": "Częstość",
        "min": 0.5,
        "max": 3,
        "step": 0.5,
        "default": 1
      },
      {
        "symbol": "c",
        "label": "Przesunięcie fazowe",
        "min": -3.14,
        "max": 3.14,
        "step": 0.1,
        "default": 0
      }
    ],
    "domain": [
      -6.28,
      6.28
    ]
  },
  {
    "type": "quiz",
    "question": "Ile radianów ma kąt pełny ($360^\\circ$)?",
    "options": [
      "$\\pi$",
      "$2\\pi$",
      "$4\\pi$",
      "$\\dfrac{\\pi}{2}$"
    ],
    "correctIndex": 1,
    "explanation": "Pełny obrót to $360^\\circ$, co odpowiada $2\\pi$ radianom."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję masz opanowaną, jeśli potrafisz odczytać znak sinusa, kosinusa i tangensa w każdej z czterech ćwiartek, swobodnie zamieniasz miarę kąta ze stopni na radiany i odwrotnie oraz znasz wartości kątów szczególnych wyrażone w radianach (np. że $90^\\circ=\\dfrac{\\pi}{2}$, a $180^\\circ=\\pi$). To fundament, na którym oprzemy tożsamości i równania trygonometryczne."
  }
]$content2$::jsonb,
  1
);

-- ----------------------------------------------------------------------------
-- Lesson 3: Tożsamości trygonometryczne i wzory redukcyjne
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'trygonometria'),
  $title3$Tożsamości trygonometryczne i wzory redukcyjne$title3$,
  $content3$[
  {
    "type": "intro",
    "text": "W tej lekcji nauczysz się wykorzystywać jedynkę trygonometryczną do wyznaczania wartości jednej funkcji trygonometrycznej na podstawie drugiej oraz poznasz wzory redukcyjne — narzędzie, które pozwala sprowadzić dowolny kąt do kąta ostrego z pierwszej ćwiartki."
  },
  {
    "type": "definition",
    "term": "Jedynka trygonometryczna — zastosowanie",
    "text": "Wzór $\\sin^2\\alpha+\\cos^2\\alpha=1$ (poznany w pierwszej lekcji) pozwala wyznaczyć $\\cos\\alpha$, gdy znamy $\\sin\\alpha$, i odwrotnie. Po wyznaczeniu kwadratu szukanej funkcji trzeba jeszcze ustalić właściwy znak pierwiastka — a to zależy od tego, w której ćwiartce leży kąt $\\alpha$ (patrz tabela znaków z poprzedniej lekcji).",
    "formula": "\\sin^2\\alpha+\\cos^2\\alpha=1"
  },
  {
    "type": "quiz",
    "question": "Kąt ostry $\\alpha$ spełnia $\\sin\\alpha=\\dfrac{3}{5}$. Korzystając z jedynki trygonometrycznej, oblicz $\\cos\\alpha$.",
    "options": [
      "$\\dfrac{4}{5}$",
      "$\\dfrac{3}{5}$",
      "$\\dfrac{5}{4}$",
      "$\\dfrac{1}{5}$"
    ],
    "correctIndex": 0,
    "explanation": "$\\cos^2\\alpha=1-\\sin^2\\alpha=1-\\dfrac{9}{25}=\\dfrac{16}{25}$, więc $\\cos\\alpha=\\dfrac{4}{5}$ (dodatni, bo $\\alpha$ jest kątem ostrym)."
  },
  {
    "type": "examples",
    "title": "Znak wyznaczonej funkcji zależy od ćwiartki",
    "items": [
      {
        "problem": "\\sin\\alpha=\\dfrac{4}{5},\\quad \\alpha\\in(90^\\circ,180^\\circ). \\text{ Oblicz } \\cos\\alpha.",
        "steps": [
          {
            "text": "Z jedynki trygonometrycznej wyznaczamy $\\cos^2\\alpha$.",
            "formula": "\\cos^2\\alpha=1-\\dfrac{16}{25}=\\dfrac{9}{25}"
          },
          {
            "text": "Pierwiastkujemy — na razie z dokładnością do znaku.",
            "formula": "\\cos\\alpha=\\pm\\dfrac{3}{5}"
          },
          {
            "text": "Kąt $\\alpha$ należy do II ćwiartki, w której kosinus jest ujemny, więc odrzucamy rozwiązanie dodatnie.",
            "formula": "\\cos\\alpha=-\\dfrac{3}{5}"
          }
        ],
        "answer": "\\cos\\alpha=-\\dfrac{3}{5}"
      }
    ]
  },
  {
    "type": "reveal-steps",
    "title": "Rozwiąż samodzielnie: sinus i tangens z kosinusa",
    "problem": "Kąt $\\alpha$ należy do III ćwiartki i $\\cos\\alpha=-\\dfrac{12}{13}$. Oblicz $\\sin\\alpha$ oraz $\\tan\\alpha$.",
    "steps": [
      {
        "prompt": "Jaki znak ma $\\sin\\alpha$ w III ćwiartce?",
        "kind": "choice",
        "options": [
          "Dodatni",
          "Ujemny",
          "Zero"
        ],
        "correctIndex": 1,
        "reveal": "W III ćwiartce zarówno sinus, jak i kosinus są ujemne.",
        "formula": "\\sin\\alpha<0"
      },
      {
        "prompt": "Oblicz $\\sin^2\\alpha=1-\\cos^2\\alpha$ dla $\\cos\\alpha=-\\dfrac{12}{13}$.",
        "kind": "choice",
        "options": [
          "$\\dfrac{25}{169}$",
          "$\\dfrac{144}{169}$",
          "$\\dfrac{1}{13}$"
        ],
        "correctIndex": 0,
        "reveal": "$\\cos^2\\alpha=\\dfrac{144}{169}$, więc $\\sin^2\\alpha=1-\\dfrac{144}{169}=\\dfrac{25}{169}$.",
        "formula": "\\sin^2\\alpha=\\dfrac{25}{169}"
      },
      {
        "prompt": "Podaj $\\sin\\alpha$ (z właściwym znakiem) oraz $\\tan\\alpha=\\dfrac{\\sin\\alpha}{\\cos\\alpha}$.",
        "kind": "choice",
        "options": [
          "$\\sin\\alpha=-\\dfrac{5}{13},\\ \\tan\\alpha=\\dfrac{5}{12}$",
          "$\\sin\\alpha=\\dfrac{5}{13},\\ \\tan\\alpha=-\\dfrac{5}{12}$",
          "$\\sin\\alpha=-\\dfrac{5}{13},\\ \\tan\\alpha=-\\dfrac{5}{12}$"
        ],
        "correctIndex": 0,
        "reveal": "$\\sin\\alpha=-\\dfrac{5}{13}$ (ujemny w III ćwiartce), a $\\tan\\alpha=\\dfrac{-5/13}{-12/13}=\\dfrac{5}{12}$ — dodatni, co zgadza się z tabelą znaków dla III ćwiartki.",
        "formula": "\\sin\\alpha=-\\dfrac{5}{13},\\quad \\tan\\alpha=\\dfrac{5}{12}"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "W której ćwiartce tangens kąta jest dodatni, mimo że sinus i kosinus są ujemne?",
    "options": [
      "I",
      "II",
      "III",
      "IV"
    ],
    "correctIndex": 2,
    "explanation": "W III ćwiartce sinus i kosinus są oba ujemne, więc ich iloraz (tangens) jest dodatni."
  },
  {
    "type": "definition",
    "term": "Wzory redukcyjne",
    "text": "Wzory redukcyjne pozwalają zapisać wartość funkcji trygonometrycznej dowolnego kąta za pomocą funkcji kąta ostrego $\\alpha$ z pierwszej ćwiartki. Dzięki nim nie trzeba znać wartości sinusa czy kosinusa dla każdego możliwego kąta — wystarczy sprowadzić go do postaci $90^\\circ\\pm\\alpha$, $180^\\circ\\pm\\alpha$ lub $360^\\circ-\\alpha$ i skorzystać z gotowego wzoru."
  },
  {
    "type": "table",
    "title": "Wybrane wzory redukcyjne",
    "headers": [
      "Kąt",
      "$\\sin$",
      "$\\cos$"
    ],
    "rows": [
      [
        "$90^\\circ-\\alpha$",
        "$\\cos\\alpha$",
        "$\\sin\\alpha$"
      ],
      [
        "$180^\\circ-\\alpha$",
        "$\\sin\\alpha$",
        "$-\\cos\\alpha$"
      ],
      [
        "$180^\\circ+\\alpha$",
        "$-\\sin\\alpha$",
        "$-\\cos\\alpha$"
      ],
      [
        "$360^\\circ-\\alpha$",
        "$-\\sin\\alpha$",
        "$\\cos\\alpha$"
      ]
    ]
  },
  {
    "type": "examples",
    "title": "Zastosowanie wzoru redukcyjnego",
    "items": [
      {
        "problem": "\\text{Oblicz } \\sin150^\\circ \\text{ korzystając ze wzoru redukcyjnego.}",
        "steps": [
          {
            "text": "Zapisujemy $150^\\circ$ w postaci $180^\\circ-\\alpha$.",
            "formula": "150^\\circ=180^\\circ-30^\\circ"
          },
          {
            "text": "Stosujemy wzór redukcyjny $\\sin(180^\\circ-\\alpha)=\\sin\\alpha$ dla $\\alpha=30^\\circ$.",
            "formula": "\\sin150^\\circ=\\sin(180^\\circ-30^\\circ)=\\sin30^\\circ"
          },
          {
            "text": "Odczytujemy wartość z tabeli kątów szczególnych.",
            "formula": "\\sin30^\\circ=\\dfrac12"
          }
        ],
        "answer": "\\sin150^\\circ=\\dfrac12"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Korzystając ze wzoru redukcyjnego $\\cos(180^\\circ-\\alpha)=-\\cos\\alpha$, oblicz $\\cos120^\\circ$.",
    "options": [
      "$\\dfrac{1}{2}$",
      "$-\\dfrac{1}{2}$",
      "$\\dfrac{\\sqrt3}{2}$",
      "$-\\dfrac{\\sqrt3}{2}$"
    ],
    "correctIndex": 1,
    "explanation": "$120^\\circ=180^\\circ-60^\\circ$, więc $\\cos120^\\circ=-\\cos60^\\circ=-\\dfrac12$."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Ten dział masz opanowany, jeśli sprawnie korzystasz z jedynki trygonometrycznej do wyznaczania jednej funkcji na podstawie drugiej (pamiętając o właściwym znaku wynikającym z ćwiartki) oraz znasz podstawowe wzory redukcyjne i potrafisz nimi sprowadzić dowolny kąt do kąta ostrego z pierwszej ćwiartki."
  }
]$content3$::jsonb,
  2
);

-- ----------------------------------------------------------------------------
-- Lesson 4: Równania i nierówności trygonometryczne oraz trygonometria trójkąta dowolnego
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'trygonometria'),
  $title4$Równania i nierówności trygonometryczne oraz trygonometria trójkąta dowolnego$title4$,
  $content4$[
  {
    "type": "intro",
    "text": "Równanie trygonometryczne to równanie, w którym niewiadoma występuje pod funkcją trygonometryczną, np. $\\sin x=\\dfrac12$. Ponieważ funkcje trygonometryczne są okresowe, takie równanie ma zwykle nieskończenie wiele rozwiązań — dlatego na maturze najczęściej prosi się o podanie rozwiązań należących do konkretnego przedziału, np. $x\\in[0^\\circ,360^\\circ)$. W drugiej części tej lekcji zajmiemy się też funkcjami trygonometrycznymi kąta w dowolnym trójkącie (nie tylko prostokątnym) — twierdzeniem sinusów i twierdzeniem cosinusów."
  },
  {
    "type": "definition",
    "term": "Rozwiązywanie równania $\\sin x=a$ w przedziale $[0^\\circ,360^\\circ)$",
    "text": "Jeśli $-1\\le a\\le1$, znajdujemy najpierw kąt odniesienia $\\alpha\\in[0^\\circ,90^\\circ]$, dla którego $\\sin\\alpha=|a|$ (najczęściej z tabeli kątów szczególnych). Ponieważ sinus jest dodatni w I i II ćwiartce, a ujemny w III i IV, wykorzystujemy tę informację (oraz ewentualnie wzory redukcyjne), aby wskazać wszystkie kąty z przedziału $[0^\\circ,360^\\circ)$, dla których sinus przyjmuje wartość $a$."
  },
  {
    "type": "examples",
    "title": "Rozwiązywanie równania trygonometrycznego",
    "items": [
      {
        "problem": "\\sin x=\\dfrac12,\\quad x\\in[0^\\circ,360^\\circ)",
        "steps": [
          {
            "text": "Kąt odniesienia to $30^\\circ$, bo $\\sin30^\\circ=\\dfrac12$.",
            "formula": "\\alpha=30^\\circ"
          },
          {
            "text": "Sinus jest dodatni w I i II ćwiartce, więc mamy dwa rozwiązania: samo $30^\\circ$ oraz $180^\\circ-30^\\circ$.",
            "formula": "x_1=30^\\circ,\\quad x_2=180^\\circ-30^\\circ=150^\\circ"
          }
        ],
        "answer": "x=30^\\circ \\lor x=150^\\circ"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Ile rozwiązań ma równanie $\\sin x=\\dfrac12$ w przedziale $[0^\\circ,360^\\circ)$?",
    "options": [
      "Jedno",
      "Dwa",
      "Trzy",
      "Zero"
    ],
    "correctIndex": 1,
    "explanation": "W jednym pełnym obrocie sinus przyjmuje daną wartość dodatnią (mniejszą od $1$) dokładnie dwa razy — raz w I, raz w II ćwiartce."
  },
  {
    "type": "reveal-steps",
    "title": "Rozwiąż samodzielnie: równanie z kosinusem",
    "problem": "Rozwiąż równanie $\\cos x=-\\dfrac12$ w przedziale $[0^\\circ,360^\\circ)$.",
    "steps": [
      {
        "prompt": "Kosinus jest ujemny. W których dwóch ćwiartkach $\\cos x<0$?",
        "kind": "choice",
        "options": [
          "I i II",
          "II i III",
          "III i IV",
          "I i IV"
        ],
        "correctIndex": 1,
        "reveal": "Kosinus jest ujemny w II i III ćwiartce (patrz tabela znaków z poprzedniej lekcji)."
      },
      {
        "prompt": "Kąt odniesienia to $60^\\circ$ (bo $\\cos60^\\circ=\\dfrac12$). Wyznacz rozwiązanie w II ćwiartce za pomocą wzoru $\\cos(180^\\circ-\\alpha)=-\\cos\\alpha$.",
        "kind": "choice",
        "options": [
          "$x=180^\\circ-60^\\circ=120^\\circ$",
          "$x=180^\\circ+60^\\circ=240^\\circ$",
          "$x=90^\\circ-60^\\circ=30^\\circ$"
        ],
        "correctIndex": 0,
        "reveal": "$\\cos(180^\\circ-60^\\circ)=-\\cos60^\\circ=-\\dfrac12$, więc $x=120^\\circ$ jest rozwiązaniem.",
        "formula": "x_1=180^\\circ-60^\\circ=120^\\circ"
      },
      {
        "prompt": "Analogicznie wyznacz rozwiązanie w III ćwiartce, korzystając ze wzoru $\\cos(180^\\circ+\\alpha)=-\\cos\\alpha$.",
        "kind": "choice",
        "options": [
          "$x=180^\\circ+60^\\circ=240^\\circ$",
          "$x=360^\\circ-60^\\circ=300^\\circ$",
          "$x=180^\\circ-60^\\circ=120^\\circ$"
        ],
        "correctIndex": 0,
        "reveal": "$\\cos(180^\\circ+60^\\circ)=-\\cos60^\\circ=-\\dfrac12$, więc drugie rozwiązanie to $x=240^\\circ$.",
        "formula": "x_2=180^\\circ+60^\\circ=240^\\circ"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Zbiór rozwiązań równania $\\cos x=-\\dfrac12$ w przedziale $[0^\\circ,360^\\circ)$ to:",
    "options": [
      "$\\{120^\\circ,240^\\circ\\}$",
      "$\\{60^\\circ,300^\\circ\\}$",
      "$\\{150^\\circ,210^\\circ\\}$",
      "$\\{120^\\circ,300^\\circ\\}$"
    ],
    "correctIndex": 0,
    "explanation": "Kąt odniesienia to $60^\\circ$, a kosinus jest ujemny w II i III ćwiartce, co daje $x=120^\\circ$ oraz $x=240^\\circ$."
  },
  {
    "type": "definition",
    "term": "Nierówności trygonometryczne",
    "text": "Nierówność trygonometryczną, np. $\\sin x>\\dfrac12$, rozwiązujemy najczęściej graficznie: znajdujemy najpierw miejsca, w których zachodzi równość (jak w równaniu), a następnie — analizując przebieg funkcji między tymi punktami — ustalamy, na jakich przedziałach nierówność jest spełniona."
  },
  {
    "type": "examples",
    "title": "Rozwiązywanie nierówności trygonometrycznej",
    "items": [
      {
        "problem": "\\sin x>\\dfrac12,\\quad x\\in[0^\\circ,360^\\circ)",
        "steps": [
          {
            "text": "Najpierw znajdujemy miejsca równości: $\\sin x=\\dfrac12$ dla $x=30^\\circ$ i $x=150^\\circ$ (policzone w poprzednim przykładzie).",
            "formula": "x=30^\\circ,\\ x=150^\\circ"
          },
          {
            "text": "Funkcja $\\sin x$ przyjmuje wartości większe od $\\dfrac12$ dokładnie pomiędzy tymi dwoma kątami (np. dla $x=90^\\circ$ mamy $\\sin90^\\circ=1>\\dfrac12$)."
          },
          {
            "text": "Zapisujemy przedział rozwiązań (bez końców, bo nierówność jest ostra).",
            "formula": "x\\in(30^\\circ,150^\\circ)"
          }
        ],
        "answer": "x\\in(30^\\circ,150^\\circ)"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Rozwiązaniem nierówności $\\cos x<-\\dfrac12$ w przedziale $[0^\\circ,360^\\circ)$ jest przedział:",
    "options": [
      "$(120^\\circ,240^\\circ)$",
      "$(0^\\circ,120^\\circ)\\cup(240^\\circ,360^\\circ)$",
      "$[120^\\circ,240^\\circ]$",
      "$(60^\\circ,300^\\circ)$"
    ],
    "correctIndex": 0,
    "explanation": "Z poprzedniego zadania wiemy, że $\\cos x=-\\dfrac12$ dla $x=120^\\circ$ i $x=240^\\circ$. Kosinus jest mniejszy od $-\\dfrac12$ pomiędzy tymi kątami (najmniejszą wartość, $-1$, przyjmuje dla $x=180^\\circ$)."
  },
  {
    "type": "definition",
    "term": "Twierdzenie sinusów",
    "text": "W dowolnym trójkącie o bokach $a$, $b$, $c$ leżących odpowiednio naprzeciw kątów $A$, $B$, $C$ zachodzi twierdzenie sinusów: stosunek długości boku do sinusa kąta leżącego naprzeciw niego jest taki sam dla wszystkich trzech boków (i równy średnicy okręgu opisanego na trójkącie). To narzędzie działa dla KAŻDEGO trójkąta, nie tylko prostokątnego.",
    "formula": "\\dfrac{a}{\\sin A}=\\dfrac{b}{\\sin B}=\\dfrac{c}{\\sin C}=2R"
  },
  {
    "type": "examples",
    "title": "Zastosowanie twierdzenia sinusów",
    "items": [
      {
        "problem": "\\text{W trójkącie } a=10,\\ A=30^\\circ,\\ B=45^\\circ. \\text{ Oblicz długość boku } b.",
        "steps": [
          {
            "text": "Zapisujemy odpowiedni fragment twierdzenia sinusów.",
            "formula": "\\dfrac{a}{\\sin A}=\\dfrac{b}{\\sin B}"
          },
          {
            "text": "Wyznaczamy $b$ i podstawiamy dane.",
            "formula": "b=\\dfrac{a\\sin B}{\\sin A}=\\dfrac{10\\sin45^\\circ}{\\sin30^\\circ}"
          },
          {
            "text": "Podstawiamy wartości z tabeli: $\\sin45^\\circ=\\dfrac{\\sqrt2}{2}$, $\\sin30^\\circ=\\dfrac12$, i upraszczamy.",
            "formula": "b=\\dfrac{10\\cdot\\frac{\\sqrt2}{2}}{\\frac12}=10\\sqrt2"
          }
        ],
        "answer": "b=10\\sqrt2"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "W trójkącie $a=6$, $\\sin A=\\dfrac12$, $\\sin B=\\dfrac{\\sqrt3}{2}$. Ile wynosi bok $b$ z twierdzenia sinusów?",
    "options": [
      "$6\\sqrt3$",
      "$3\\sqrt3$",
      "$6$",
      "$12$"
    ],
    "correctIndex": 0,
    "explanation": "$b=\\dfrac{a\\sin B}{\\sin A}=\\dfrac{6\\cdot\\frac{\\sqrt3}{2}}{\\frac12}=6\\sqrt3$."
  },
  {
    "type": "definition",
    "term": "Twierdzenie cosinusów",
    "text": "Twierdzenie cosinusów uogólnia twierdzenie Pitagorasa na dowolny trójkąt: kwadrat długości boku jest równy sumie kwadratów pozostałych dwóch boków, pomniejszonej o podwojony iloczyn tych boków i kosinusa kąta między nimi zawartego.",
    "formula": "c^2=a^2+b^2-2ab\\cos C"
  },
  {
    "type": "examples",
    "title": "Zastosowanie twierdzenia cosinusów",
    "items": [
      {
        "problem": "\\text{W trójkącie } a=5,\\ b=7,\\ C=60^\\circ. \\text{ Oblicz długość boku } c.",
        "steps": [
          {
            "text": "Podstawiamy dane do wzoru z twierdzenia cosinusów.",
            "formula": "c^2=5^2+7^2-2\\cdot5\\cdot7\\cdot\\cos60^\\circ"
          },
          {
            "text": "Obliczamy: $\\cos60^\\circ=\\dfrac12$, więc $c^2=25+49-70\\cdot\\dfrac12$.",
            "formula": "c^2=74-35=39"
          },
          {
            "text": "Pierwiastkujemy, aby otrzymać długość boku.",
            "formula": "c=\\sqrt{39}"
          }
        ],
        "answer": "c=\\sqrt{39}"
      }
    ]
  },
  {
    "type": "reveal-steps",
    "title": "Rozwiąż samodzielnie: kąt z twierdzenia cosinusów",
    "problem": "W trójkącie boki mają długości $a=2$, $b=3$, $c=\\sqrt7$. Oblicz miarę kąta $C$ leżącego naprzeciw boku $c$.",
    "steps": [
      {
        "prompt": "Który wzór pozwala obliczyć kąt, gdy znamy wszystkie trzy boki trójkąta?",
        "kind": "choice",
        "options": [
          "Twierdzenie sinusów",
          "Przekształcone twierdzenie cosinusów",
          "Twierdzenie Pitagorasa"
        ],
        "correctIndex": 1,
        "reveal": "Znając trzy boki, kąt wyznaczamy z przekształconego twierdzenia cosinusów.",
        "formula": "\\cos C=\\dfrac{a^2+b^2-c^2}{2ab}"
      },
      {
        "prompt": "Podstaw $a=2$, $b=3$, $c=\\sqrt7$ do wzoru i oblicz $\\cos C$.",
        "kind": "choice",
        "options": [
          "$0{,}5$",
          "$0{,}2$",
          "$-0{,}5$"
        ],
        "correctIndex": 0,
        "reveal": "$\\cos C=\\dfrac{4+9-7}{2\\cdot2\\cdot3}=\\dfrac{6}{12}=0{,}5$.",
        "formula": "\\cos C=\\dfrac{4+9-7}{12}=0{,}5"
      },
      {
        "prompt": "Jakiej mierze kąta odpowiada $\\cos C=0{,}5$ (skorzystaj z tabeli kątów szczególnych)?",
        "kind": "choice",
        "options": [
          "$30^\\circ$",
          "$45^\\circ$",
          "$60^\\circ$",
          "$90^\\circ$"
        ],
        "correctIndex": 2,
        "reveal": "$\\cos60^\\circ=0{,}5$, więc $C=60^\\circ$.",
        "formula": "C=60^\\circ"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Twierdzenie cosinusów jest uogólnieniem którego twierdzenia znanego z trójkątów prostokątnych?",
    "options": [
      "Twierdzenia Pitagorasa",
      "Twierdzenia Talesa",
      "Twierdzenia sinusów",
      "Twierdzenia o kącie wpisanym"
    ],
    "correctIndex": 0,
    "explanation": "Dla $C=90^\\circ$ mamy $\\cos C=0$, więc wzór $c^2=a^2+b^2-2ab\\cos C$ redukuje się do $c^2=a^2+b^2$, czyli twierdzenia Pitagorasa."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Ten dział masz opanowany, jeśli potrafisz rozwiązać podstawowe równanie trygonometryczne (np. $\\sin x=a$ lub $\\cos x=a$) w zadanym przedziale, sprawnie odczytujesz rozwiązania nierówności trygonometrycznych z przebiegu funkcji oraz stosujesz twierdzenie sinusów i twierdzenie cosinusów do obliczania boków i kątów w dowolnym trójkącie — nie tylko prostokątnym. Gratulacje — to komplet umiejętności trygonometrycznych wymaganych na maturze rozszerzonej!"
  }
]$content4$::jsonb,
  3
);

