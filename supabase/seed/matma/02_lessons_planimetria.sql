-- ============================================================================
-- supabase/seed/matma/02_lessons_planimetria.sql
-- Interactive lesson content (math_lessons) for the "planimetria" department:
-- Twierdzenia o trójkątach, czworokątach, okręgach, podobieństwo figur,
-- trygonometria w geometrii płaskiej.
-- content is a jsonb array of MathBlock (see lib/matma/lesson-blocks.ts).
--
-- Idempotent: deletes existing lessons for this topic first. Run
-- 01_topics.sql BEFORE this file — it looks up topic_id by slug.
-- ============================================================================

delete from math_lessons
where topic_id = (select id from math_topics where slug = 'planimetria');

-- ----------------------------------------------------------------------------
-- Lesson 1: Trójkąty — klasyfikacja, twierdzenie Pitagorasa i pole trójkąta
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'planimetria'),
  $title1$Trójkąty: klasyfikacja, twierdzenie Pitagorasa i pole trójkąta$title1$,
  $content1$[
  {
    "type": "basics-recap",
    "title": "Zanim zaczniesz: kąty i podstawowe pojęcia o trójkątach",
    "text": "Kąt to figura powstała z dwóch półprostych o wspólnym początku (wierzchołku kąta); jego miarę wyrażamy najczęściej w stopniach, przy czym pełny kąt (cały obrót) ma $360^\\circ$. Trójkąt to wielokąt o trzech wierzchołkach, trzech bokach i trzech kątach wewnętrznych — a suma miar tych kątów w KAŻDYM trójkącie wynosi $180^\\circ$. Wierzchołki oznaczamy zwykle dużymi literami (np. $A$, $B$, $C$), a boki — małymi literami odpowiadającymi wierzchołkowi leżącemu naprzeciwko: bok $a$ leży naprzeciw wierzchołka $A$, bok $b$ naprzeciw wierzchołka $B$, a bok $c$ naprzeciw wierzchołka $C$. Wysokość trójkąta to odcinek prostopadły poprowadzony z wierzchołka do prostej zawierającej przeciwległy bok (ewentualnie do przedłużenia tego boku).",
    "formula": "\\alpha+\\beta+\\gamma=180^\\circ",
    "controlQuiz": [
      {
        "question": "Ile wynosi suma miar kątów wewnętrznych dowolnego trójkąta?",
        "options": ["$180^\\circ$", "$360^\\circ$", "$90^\\circ$", "zależy od trójkąta"],
        "correctIndex": 0,
        "explanation": "Suma miar kątów wewnętrznych w każdym trójkącie — niezależnie od jego kształtu — zawsze wynosi $180^\\circ$."
      },
      {
        "question": "W trójkącie $ABC$ który bok leży naprzeciw wierzchołka $C$?",
        "options": ["bok $c$", "bok $a$", "bok $b$", "żaden z boków"],
        "correctIndex": 0,
        "explanation": "Zgodnie z przyjętą konwencją bok oznaczony małą literą leży naprzeciw wierzchołka oznaczonego odpowiadającą mu wielką literą — bok $c$ leży naprzeciw wierzchołka $C$."
      },
      {
        "question": "Czym jest wysokość trójkąta poprowadzona z wierzchołka $A$?",
        "options": [
          "odcinkiem prostopadłym z $A$ do prostej zawierającej przeciwległy bok",
          "odcinkiem łączącym $A$ ze środkiem przeciwległego boku",
          "odcinkiem dzielącym kąt przy $A$ na połowy",
          "najdłuższym bokiem trójkąta"
        ],
        "correctIndex": 0,
        "explanation": "Wysokość to zawsze odcinek prostopadły poprowadzony z wierzchołka do prostej zawierającej przeciwległy bok (ewentualnie do jej przedłużenia)."
      }
    ]
  },
  {
    "type": "table",
    "title": "Rodzaje trójkątów",
    "caption": "Każdy trójkąt można sklasyfikować jednocześnie ze względu na boki i ze względu na kąty.",
    "headers": ["Kryterium", "Rodzaje"],
    "rows": [
      ["Ze względu na boki", "różnoboczny (wszystkie boki różnej długości), równoramienny (dwa boki równej długości), równoboczny (wszystkie trzy boki równej długości)"],
      ["Ze względu na kąty", "ostrokątny (wszystkie kąty ostre, mniejsze od $90^\\circ$), prostokątny (jeden kąt prosty, $90^\\circ$), rozwartokątny (jeden kąt rozwarty, większy od $90^\\circ$)"]
    ]
  },
  {
    "type": "quiz",
    "question": "Trójkąt, w którym jeden z kątów ma miarę $124^\\circ$, nazywamy:",
    "options": ["rozwartokątnym", "ostrokątnym", "prostokątnym", "równobocznym"],
    "correctIndex": 0,
    "explanation": "Kąt $124^\\circ$ jest większy od $90^\\circ$, czyli jest kątem rozwartym — taki trójkąt nazywamy rozwartokątnym."
  },
  {
    "type": "definition",
    "term": "Twierdzenie Pitagorasa",
    "text": "W dowolnym trójkącie prostokątnym suma kwadratów długości przyprostokątnych (boków tworzących kąt prosty) jest równa kwadratowi długości przeciwprostokątnej (boku leżącego naprzeciw kąta prostego — zawsze najdłuższego boku trójkąta prostokątnego). Twierdzenie to działa WYŁĄCZNIE dla trójkątów prostokątnych.",
    "formula": "a^2+b^2=c^2"
  },
  {
    "type": "geometry",
    "title": "Sprawdź twierdzenie Pitagorasa na żywo",
    "caption": "Przeciągnij wierzchołki trójkąta i obserwuj miary. Dopóki kąt przy wierzchołku $B$ pozostaje prosty, kwadrat długości boku $CA$ zawsze jest sumą kwadratów długości boków $AB$ i $BC$ — to właśnie twierdzenie Pitagorasa. Jeśli przesuniesz wierzchołek tak, że kąt przy $B$ przestanie być prosty, ta zależność się zepsuje.",
    "shape": {
      "points": [
        {"id": "A", "x": 10, "y": 85, "label": "A", "draggable": true},
        {"id": "B", "x": 75, "y": 85, "label": "B", "draggable": true},
        {"id": "C", "x": 75, "y": 20, "label": "C", "draggable": true}
      ],
      "edges": [["A", "B"], ["B", "C"], ["C", "A"]],
      "measures": [
        {"kind": "distance", "from": "A", "to": "B", "label": "Bok AB (przyprostokątna)"},
        {"kind": "distance", "from": "B", "to": "C", "label": "Bok BC (przyprostokątna)"},
        {"kind": "distance", "from": "C", "to": "A", "label": "Bok CA (przeciwprostokątna)"},
        {"kind": "angle", "at": "B", "from": "A", "to": "C", "label": "Kąt przy wierzchołku B"},
        {"kind": "area", "label": "Pole trójkąta ABC"}
      ]
    }
  },
  {
    "type": "examples",
    "title": "Zastosowanie twierdzenia Pitagorasa",
    "items": [
      {
        "problem": "a=3,\\ b=4. \\ \\text{Oblicz długość przeciwprostokątnej } c",
        "steps": [
          {"text": "Stosujemy twierdzenie Pitagorasa.", "formula": "c^2=a^2+b^2"},
          {"text": "Podstawiamy dane.", "formula": "c^2=3^2+4^2=9+16=25"},
          {"text": "Pierwiastkujemy obie strony (długość jest dodatnia).", "formula": "c=\\sqrt{25}=5"}
        ],
        "answer": "c=5"
      },
      {
        "problem": "c=13,\\ b=5. \\ \\text{Oblicz drugą przyprostokątną } a",
        "steps": [
          {"text": "Przekształcamy twierdzenie Pitagorasa.", "formula": "a^2=c^2-b^2"},
          {"text": "Podstawiamy dane.", "formula": "a^2=13^2-5^2=169-25=144"},
          {"text": "Pierwiastkujemy.", "formula": "a=\\sqrt{144}=12"}
        ],
        "answer": "a=12"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Przyprostokątne trójkąta prostokątnego mają długości $6$ i $8$. Ile wynosi przeciwprostokątna?",
    "options": ["$10$", "$12$", "$14$", "$100$"],
    "correctIndex": 0,
    "explanation": "$c=\\sqrt{6^2+8^2}=\\sqrt{36+64}=\\sqrt{100}=10$."
  },
  {
    "type": "reveal-steps",
    "title": "Sprawdzanie, czy trójkąt jest prostokątny",
    "problem": "\\text{Czy trójkąt o bokach } 5,\\ 12,\\ 13 \\text{ jest prostokątny?}",
    "steps": [
      {
        "prompt": "Który bok jest najdłuższy i — jeśli trójkąt jest prostokątny — powinien pełnić rolę przeciwprostokątnej?",
        "kind": "choice",
        "options": ["$13$", "$12$", "$5$"],
        "correctIndex": 0,
        "reveal": "Najdłuższy bok to $13$ — jeśli trójkąt jest prostokątny, to właśnie on jest przeciwprostokątną."
      },
      {
        "prompt": "Oblicz sumę kwadratów dwóch krótszych boków, $5$ i $12$.",
        "kind": "input",
        "acceptedAnswers": ["169"],
        "reveal": "$5^2+12^2=25+144=169$.",
        "formula": "5^2+12^2=169"
      },
      {
        "prompt": "Porównaj wynik z kwadratem najdłuższego boku, $13^2$. Czy trójkąt jest prostokątny?",
        "kind": "choice",
        "options": ["Tak, bo $13^2=169=5^2+12^2$", "Nie, bo liczby się nie zgadzają"],
        "correctIndex": 0,
        "reveal": "Ponieważ $13^2=169$ i jest to równe sumie kwadratów pozostałych boków, trójkąt o bokach $5,12,13$ jest prostokątny (odwrotność twierdzenia Pitagorasa)."
      }
    ]
  },
  {
    "type": "definition",
    "term": "Pole trójkąta",
    "text": "Najprostszy wzór na pole trójkąta wykorzystuje długość dowolnego boku (podstawy) oraz długość wysokości opuszczonej na ten bok: pole to połowa iloczynu podstawy i wysokości. Gdy nie znamy wysokości, ale znamy dwa boki i kąt między nimi albo wszystkie trzy boki, stosujemy inne, równoważne wzory.",
    "formula": "P=\\frac{1}{2}a\\cdot h_a"
  },
  {
    "type": "table",
    "title": "Wzory na pole trójkąta",
    "headers": ["Wzór", "Kiedy stosować"],
    "rows": [
      ["$P=\\dfrac{1}{2}a\\cdot h_a$", "gdy znamy podstawę $a$ i wysokość $h_a$ opuszczoną na tę podstawę"],
      ["$P=\\dfrac{1}{2}ab\\sin\\gamma$", "gdy znamy dwa boki $a,b$ i kąt $\\gamma$ między nimi"],
      ["$P=\\sqrt{p(p-a)(p-b)(p-c)}$, gdzie $p=\\dfrac{a+b+c}{2}$", "gdy znamy wszystkie trzy boki (wzór Herona)"]
    ]
  },
  {
    "type": "quiz",
    "question": "Pole trójkąta o podstawie $10$ i wysokości $6$ opuszczonej na tę podstawę wynosi:",
    "options": ["$30$", "$60$", "$16$", "$20$"],
    "correctIndex": 0,
    "explanation": "$P=\\frac12\\cdot10\\cdot6=30$."
  },
  {
    "type": "examples",
    "title": "Obliczanie pola trójkąta",
    "items": [
      {
        "problem": "a=6,\\ b=8,\\ \\gamma=90^\\circ. \\ \\text{Oblicz pole trójkąta}",
        "steps": [
          {"text": "Stosujemy wzór na pole z sinusem kąta zawartego między bokami.", "formula": "P=\\frac12ab\\sin\\gamma"},
          {"text": "Podstawiamy dane, pamiętając że $\\sin90^\\circ=1$.", "formula": "P=\\frac12\\cdot6\\cdot8\\cdot\\sin90^\\circ=\\frac12\\cdot48\\cdot1"}
        ],
        "answer": "P=24"
      },
      {
        "problem": "a=3,\\ b=4,\\ c=5. \\ \\text{Oblicz pole ze wzoru Herona}",
        "steps": [
          {"text": "Obliczamy połowę obwodu.", "formula": "p=\\frac{3+4+5}{2}=6"},
          {"text": "Stosujemy wzór Herona.", "formula": "P=\\sqrt{p(p-a)(p-b)(p-c)}=\\sqrt{6\\cdot3\\cdot2\\cdot1}"},
          {"text": "Obliczamy wynik.", "formula": "P=\\sqrt{36}=6"}
        ],
        "answer": "P=6"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Pole trójkąta o bokach $a=5$, $b=6$ i kącie między nimi $\\gamma=30^\\circ$ wynosi:",
    "options": ["$7.5$", "$15$", "$30$", "$3.75$"],
    "correctIndex": 0,
    "explanation": "$P=\\frac12\\cdot5\\cdot6\\cdot\\sin30^\\circ=15\\cdot\\frac12=7.5$."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli bezbłędnie klasyfikujesz trójkąty ze względu na boki i kąty, sprawnie stosujesz twierdzenie Pitagorasa (w obie strony — także do sprawdzania, czy trójkąt jest prostokątny) oraz potrafisz wybrać i zastosować właściwy wzór na pole trójkąta w zależności od tego, jakie dane masz podane: podstawę i wysokość, dwa boki i kąt między nimi, albo wszystkie trzy boki."
  }
]$content1$::jsonb,
  0
);

-- ----------------------------------------------------------------------------
-- Lesson 2: Twierdzenie sinusów, twierdzenie cosinusów i linie szczególne
-- trójkąta
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'planimetria'),
  $title2$Twierdzenie sinusów, twierdzenie cosinusów i linie szczególne trójkąta$title2$,
  $content2$[
  {
    "type": "intro",
    "text": "Twierdzenie Pitagorasa działa tylko w trójkątach prostokątnych. W tej lekcji poznasz dwa dużo potężniejsze narzędzia, które działają w KAŻDYM trójkącie — twierdzenie sinusów i twierdzenie cosinusów — a także poznasz cztery szczególne linie trójkąta (środkowe, wysokości, dwusieczne, symetralne) oraz związane z nimi okręgi: wpisany i opisany."
  },
  {
    "type": "definition",
    "term": "Twierdzenie sinusów",
    "text": "W dowolnym trójkącie stosunek długości boku do sinusa kąta leżącego naprzeciw tego boku jest taki sam dla wszystkich trzech boków i jest równy średnicy okręgu opisanego na tym trójkącie ($2R$).",
    "formula": "\\frac{a}{\\sin\\alpha}=\\frac{b}{\\sin\\beta}=\\frac{c}{\\sin\\gamma}=2R"
  },
  {
    "type": "examples",
    "title": "Zastosowanie twierdzenia sinusów",
    "items": [
      {
        "problem": "a=10,\\ \\alpha=30^\\circ,\\ \\beta=45^\\circ. \\ \\text{Oblicz długość boku } b",
        "steps": [
          {"text": "Zapisujemy odpowiednią proporcję z twierdzenia sinusów.", "formula": "\\frac{a}{\\sin\\alpha}=\\frac{b}{\\sin\\beta}"},
          {"text": "Wyznaczamy $b$.", "formula": "b=\\frac{a\\sin\\beta}{\\sin\\alpha}"},
          {"text": "Podstawiamy wartości funkcji trygonometrycznych ($\\sin30^\\circ=\\frac12$, $\\sin45^\\circ=\\frac{\\sqrt2}{2}$) i obliczamy.", "formula": "b=\\frac{10\\cdot\\frac{\\sqrt2}{2}}{\\frac12}=10\\sqrt2"}
        ],
        "answer": "b=10\\sqrt{2}"
      },
      {
        "problem": "a=6,\\ \\alpha=30^\\circ. \\ \\text{Oblicz promień okręgu opisanego } R",
        "steps": [
          {"text": "Stosujemy twierdzenie sinusów w wersji z promieniem okręgu opisanego.", "formula": "\\frac{a}{\\sin\\alpha}=2R"},
          {"text": "Podstawiamy dane.", "formula": "2R=\\frac{6}{\\sin30^\\circ}=\\frac{6}{\\frac12}=12"},
          {"text": "Wyznaczamy $R$.", "formula": "R=6"}
        ],
        "answer": "R=6"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "W trójkącie $a=8$, $\\alpha=30^\\circ$, $\\beta=90^\\circ$. Ile wynosi bok $b$ (z twierdzenia sinusów)?",
    "options": ["$16$", "$8$", "$4$", "$12$"],
    "correctIndex": 0,
    "explanation": "$b=\\dfrac{a\\sin\\beta}{\\sin\\alpha}=\\dfrac{8\\cdot\\sin90^\\circ}{\\sin30^\\circ}=\\dfrac{8\\cdot1}{\\frac12}=16$."
  },
  {
    "type": "definition",
    "term": "Twierdzenie cosinusów",
    "text": "Twierdzenie cosinusów jest uogólnieniem twierdzenia Pitagorasa na dowolny trójkąt: kwadrat długości boku jest równy sumie kwadratów długości dwóch pozostałych boków, pomniejszonej o podwojony iloczyn tych boków i cosinusa kąta między nimi. Stosujemy je, gdy znamy dwa boki i kąt między nimi (i szukamy trzeciego boku) albo gdy znamy wszystkie trzy boki (i szukamy miary kąta).",
    "formula": "c^2=a^2+b^2-2ab\\cos\\gamma"
  },
  {
    "type": "reveal-steps",
    "title": "Obliczanie boku trójkąta z twierdzenia cosinusów",
    "problem": "a=7,\\ b=8,\\ \\gamma=60^\\circ. \\ \\text{Oblicz długość boku } c",
    "steps": [
      {
        "prompt": "Który wzór zastosujemy, znając dwa boki trójkąta i kąt między nimi?",
        "kind": "choice",
        "options": ["twierdzenie cosinusów", "twierdzenie sinusów", "wzór Herona"],
        "correctIndex": 0,
        "reveal": "Znając dwa boki i kąt między nimi (a nie kąt naprzeciw znanego boku), stosujemy wprost twierdzenie cosinusów: $c^2=a^2+b^2-2ab\\cos\\gamma$."
      },
      {
        "prompt": "Ile wynosi $\\cos60^\\circ$?",
        "kind": "input",
        "acceptedAnswers": ["1/2", "0.5"],
        "reveal": "$\\cos60^\\circ=\\frac12$.",
        "formula": "\\cos60^\\circ=\\frac12"
      },
      {
        "prompt": "Podstaw dane do wzoru i oblicz $c^2$.",
        "kind": "input",
        "acceptedAnswers": ["57"],
        "reveal": "$c^2=7^2+8^2-2\\cdot7\\cdot8\\cdot\\frac12=49+64-56=57$.",
        "formula": "c^2=49+64-56=57"
      },
      {
        "prompt": "Oblicz $c$ (podaj wynik dokładny lub przybliżenie z dokładnością do dwóch miejsc po przecinku).",
        "kind": "input",
        "acceptedAnswers": ["\\sqrt{57}", "sqrt(57)", "7.55"],
        "reveal": "$c=\\sqrt{57}\\approx7.55$.",
        "formula": "c=\\sqrt{57}\\approx7.55"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Twierdzenie cosinusów dla kąta $\\gamma=90^\\circ$ redukuje się do:",
    "options": ["twierdzenia Pitagorasa", "twierdzenia sinusów", "wzoru Herona", "niczego szczególnego"],
    "correctIndex": 0,
    "explanation": "Ponieważ $\\cos90^\\circ=0$, wzór $c^2=a^2+b^2-2ab\\cos\\gamma$ upraszcza się do $c^2=a^2+b^2$, czyli twierdzenia Pitagorasa."
  },
  {
    "type": "table",
    "title": "Linie szczególne trójkąta i punkty ich przecięcia",
    "caption": "W każdym trójkącie wszystkie trzy odcinki danego rodzaju przecinają się dokładnie w jednym punkcie.",
    "headers": ["Linia", "Definicja", "Punkt przecięcia"],
    "rows": [
      ["Środkowa", "łączy wierzchołek ze środkiem przeciwległego boku", "środek ciężkości — dzieli każdą środkową w stosunku $2:1$, licząc od wierzchołka"],
      ["Wysokość", "prosta poprowadzona z wierzchołka prostopadle do przeciwległego boku (lub jego przedłużenia)", "ortocentrum"],
      ["Dwusieczna kąta", "dzieli kąt wewnętrzny trójkąta na dwie równe części", "środek okręgu wpisanego w trójkąt"],
      ["Symetralna boku", "prosta prostopadła do boku, przechodząca przez jego środek", "środek okręgu opisanego na trójkącie"]
    ]
  },
  {
    "type": "geometry",
    "title": "Środkowe trójkąta i środek ciężkości",
    "caption": "Trzy środkowe trójkąta $ABC$ przecinają się w jednym punkcie — środku ciężkości $G$. Porównaj długości odcinków $AG$ i $GM(BC)$: odcinek $AG$ jest zawsze dwa razy dłuższy niż $GM(BC)$ — środek ciężkości dzieli każdą środkową w stosunku $2:1$, licząc od wierzchołka.",
    "shape": {
      "points": [
        {"id": "A", "x": 20, "y": 88, "label": "A", "draggable": true},
        {"id": "B", "x": 85, "y": 88, "label": "B", "draggable": true},
        {"id": "C", "x": 50, "y": 15, "label": "C", "draggable": true},
        {"id": "M_AB", "x": 52.5, "y": 88, "label": "M(AB)", "draggable": false},
        {"id": "M_BC", "x": 67.5, "y": 51.5, "label": "M(BC)", "draggable": false},
        {"id": "M_CA", "x": 35, "y": 51.5, "label": "M(CA)", "draggable": false},
        {"id": "G", "x": 51.67, "y": 63.67, "label": "G", "draggable": false}
      ],
      "edges": [["A", "B"], ["B", "C"], ["C", "A"], ["A", "M_BC"], ["B", "M_CA"], ["C", "M_AB"]],
      "measures": [
        {"kind": "distance", "from": "A", "to": "G", "label": "Odcinek AG"},
        {"kind": "distance", "from": "G", "to": "M_BC", "label": "Odcinek GM(BC)"}
      ]
    }
  },
  {
    "type": "quiz",
    "question": "Punkt przecięcia symetralnych boków trójkąta jest środkiem:",
    "options": ["okręgu opisanego na trójkącie", "okręgu wpisanego w trójkąt", "odcinka łączącego wierzchołki", "żadnego z powyższych"],
    "correctIndex": 0,
    "explanation": "Symetralne boków są jednakowo oddalone od obu końców boku, więc ich punkt przecięcia jest jednakowo oddalony od wszystkich trzech wierzchołków — to środek okręgu opisanego na trójkącie."
  },
  {
    "type": "formula",
    "title": "Promień okręgu wpisanego w trójkąt",
    "expression": "r=\\frac{P}{p}",
    "variables": [
      {"symbol": "r", "meaning": "promień okręgu wpisanego w trójkąt"},
      {"symbol": "P", "meaning": "pole trójkąta"},
      {"symbol": "p", "meaning": "połowa obwodu trójkąta, $p=\\frac{a+b+c}{2}$"}
    ]
  },
  {
    "type": "formula",
    "title": "Promień okręgu opisanego na trójkącie",
    "expression": "R=\\frac{abc}{4P}",
    "variables": [
      {"symbol": "R", "meaning": "promień okręgu opisanego na trójkącie"},
      {"symbol": "a,b,c", "meaning": "długości boków trójkąta"},
      {"symbol": "P", "meaning": "pole trójkąta"}
    ]
  },
  {
    "type": "examples",
    "title": "Promień okręgu wpisanego i opisanego",
    "items": [
      {
        "problem": "a=3,\\ b=4,\\ c=5,\\ P=6. \\ \\text{Oblicz promień okręgu wpisanego } r",
        "steps": [
          {"text": "Obliczamy połowę obwodu.", "formula": "p=\\frac{3+4+5}{2}=6"},
          {"text": "Stosujemy wzór $r=\\frac{P}{p}$.", "formula": "r=\\frac{6}{6}=1"}
        ],
        "answer": "r=1"
      },
      {
        "problem": "a=3,\\ b=4,\\ c=5,\\ P=6. \\ \\text{Oblicz promień okręgu opisanego } R",
        "steps": [
          {"text": "Stosujemy wzór $R=\\frac{abc}{4P}$.", "formula": "R=\\frac{3\\cdot4\\cdot5}{4\\cdot6}=\\frac{60}{24}"},
          {"text": "Upraszczamy ułamek.", "formula": "R=2.5"}
        ],
        "answer": "R=2.5"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "W trójkącie prostokątnym promień okręgu opisanego na nim jest równy:",
    "options": ["połowie długości przeciwprostokątnej", "połowie sumy długości przyprostokątnych", "polu trójkąta", "promieniowi okręgu wpisanego"],
    "correctIndex": 0,
    "explanation": "Przeciwprostokątna trójkąta prostokątnego jest średnicą okręgu opisanego na nim (z twierdzenia sinusów: $2R=\\frac{c}{\\sin90^\\circ}=c$), więc $R=\\frac{c}{2}$."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli wiesz, kiedy zastosować twierdzenie sinusów, a kiedy twierdzenie cosinusów (sinusów — gdy znasz bok i kąt naprzeciw niego oraz szukasz innego boku lub kąta; cosinusów — gdy znasz dwa boki i kąt między nimi, lub wszystkie trzy boki), rozpoznajesz cztery linie szczególne trójkąta i wiesz, jaki punkt wyznacza każda z nich, oraz potrafisz obliczyć promień okręgu wpisanego i opisanego na trójkącie."
  }
]$content2$::jsonb,
  1
);

-- ----------------------------------------------------------------------------
-- Lesson 3: Czworokąty — własności i pola
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'planimetria'),
  $title3$Czworokąty: własności i pola$title3$,
  $content3$[
  {
    "type": "intro",
    "text": "W tej lekcji poznasz najważniejsze czworokąty pojawiające się na maturze — równoległobok, prostokąt, romb, kwadrat, trapez i deltoid — ich charakterystyczne własności oraz wzory na pole każdego z nich."
  },
  {
    "type": "table",
    "title": "Rodzaje czworokątów i ich kluczowe własności",
    "headers": ["Czworokąt", "Kluczowe własności"],
    "rows": [
      ["Równoległobok", "przeciwległe boki są równoległe i równej długości; przekątne przecinają się i dzielą na połowy; przeciwległe kąty są równe"],
      ["Prostokąt", "równoległobok, w którym wszystkie kąty są proste; przekątne mają równą długość i dzielą się na połowy"],
      ["Romb", "równoległobok, w którym wszystkie boki są równej długości; przekątne są prostopadłe i dzielą kąty wewnętrzne na połowy"],
      ["Kwadrat", "jednocześnie prostokąt i romb — wszystkie boki równe, wszystkie kąty proste, przekątne równe i prostopadłe"],
      ["Trapez", "ma co najmniej jedną parę boków równoległych (podstawy); w trapezie równoramiennym ramiona mają równą długość, a kąty przy każdej podstawie są równe"],
      ["Deltoid", "dwie pary sąsiednich boków równej długości; przekątne są prostopadłe, a jedna z nich jest osią symetrii figury"]
    ]
  },
  {
    "type": "quiz",
    "question": "Który czworokąt ma zawsze przekątne równej długości, ale niekoniecznie prostopadłe?",
    "options": ["prostokąt", "romb", "deltoid", "dowolny trapez"],
    "correctIndex": 0,
    "explanation": "W prostokącie przekątne zawsze mają równą długość, ale są prostopadłe tylko w szczególnym przypadku, gdy prostokąt jest kwadratem."
  },
  {
    "type": "definition",
    "term": "Pole trapezu",
    "text": "Pole trapezu obliczamy jako połowę sumy długości podstaw (boków równoległych) pomnożoną przez wysokość, czyli odległość między podstawami.",
    "formula": "P=\\frac{a+b}{2}\\cdot h"
  },
  {
    "type": "geometry",
    "title": "Trapez — poznaj jego pole",
    "caption": "Przeciągaj wierzchołki trapezu $ABCD$ (boki $AB$ i $DC$ to podstawy) i obserwuj, jak zmienia się jego pole oraz obwód.",
    "shape": {
      "points": [
        {"id": "A", "x": 10, "y": 85, "label": "A", "draggable": true},
        {"id": "B", "x": 90, "y": 85, "label": "B", "draggable": true},
        {"id": "C", "x": 70, "y": 20, "label": "C", "draggable": true},
        {"id": "D", "x": 30, "y": 20, "label": "D", "draggable": true}
      ],
      "edges": [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"]],
      "measures": [
        {"kind": "distance", "from": "A", "to": "B", "label": "Podstawa AB"},
        {"kind": "distance", "from": "D", "to": "C", "label": "Podstawa DC"},
        {"kind": "area", "label": "Pole trapezu ABCD"},
        {"kind": "perimeter", "label": "Obwód trapezu ABCD"}
      ]
    }
  },
  {
    "type": "examples",
    "title": "Obliczanie pola trapezu",
    "items": [
      {
        "problem": "a=10,\\ b=6,\\ h=4. \\ \\text{Oblicz pole trapezu}",
        "steps": [
          {"text": "Stosujemy wzór na pole trapezu.", "formula": "P=\\frac{a+b}{2}\\cdot h"},
          {"text": "Podstawiamy dane.", "formula": "P=\\frac{10+6}{2}\\cdot4=8\\cdot4"}
        ],
        "answer": "P=32"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Pole trapezu o podstawach $5$ i $9$ oraz wysokości $4$ wynosi:",
    "options": ["$28$", "$36$", "$14$", "$45$"],
    "correctIndex": 0,
    "explanation": "$P=\\frac{5+9}{2}\\cdot4=7\\cdot4=28$."
  },
  {
    "type": "definition",
    "term": "Pole rombu",
    "text": "Pole rombu najwygodniej obliczyć, znając długości obu przekątnych — jest ono równe połowie ich iloczynu. Równie dobrze można skorzystać z ogólnego wzoru dla równoległoboku: iloczyn boku i wysokości opuszczonej na ten bok.",
    "formula": "P=\\frac{d_1\\cdot d_2}{2}"
  },
  {
    "type": "reveal-steps",
    "title": "Pole rombu z długości przekątnych",
    "problem": "d_1=6,\\ d_2=8. \\ \\text{Oblicz pole rombu}",
    "steps": [
      {
        "prompt": "Jaki wzór zastosujemy, znając obie przekątne rombu?",
        "kind": "choice",
        "options": ["$P=\\dfrac{d_1d_2}{2}$", "$P=a\\cdot h$", "$P=\\dfrac12ab\\sin\\gamma$"],
        "correctIndex": 0,
        "reveal": "Znając obie przekątne rombu, najwygodniej zastosować wzór $P=\\dfrac{d_1d_2}{2}$."
      },
      {
        "prompt": "Podstaw dane do wzoru i oblicz pole.",
        "kind": "input",
        "acceptedAnswers": ["24"],
        "reveal": "$P=\\frac{6\\cdot8}{2}=\\frac{48}{2}=24$.",
        "formula": "P=\\frac{6\\cdot8}{2}=24"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Pole rombu o przekątnych $10$ i $12$ wynosi:",
    "options": ["$60$", "$120$", "$22$", "$110$"],
    "correctIndex": 0,
    "explanation": "$P=\\frac{10\\cdot12}{2}=\\frac{120}{2}=60$."
  },
  {
    "type": "definition",
    "term": "Pole równoległoboku",
    "text": "Pole równoległoboku obliczamy jako iloczyn długości boku i wysokości opuszczonej na ten bok. Gdy znamy dwa sąsiednie boki i kąt między nimi, możemy też skorzystać ze wzoru z sinusem — takiego samego jak dla trójkąta, ale bez dzielenia przez $2$ (bo równoległobok składa się z dwóch przystających trójkątów).",
    "formula": "P=a\\cdot h_a=ab\\sin\\gamma"
  },
  {
    "type": "quiz",
    "question": "Pole równoległoboku o boku $a=8$ i wysokości $h_a=5$ opuszczonej na ten bok wynosi:",
    "options": ["$40$", "$20$", "$13$", "$4.5$"],
    "correctIndex": 0,
    "explanation": "$P=a\\cdot h_a=8\\cdot5=40$."
  },
  {
    "type": "table",
    "title": "Podsumowanie: wzory na pola czworokątów",
    "headers": ["Czworokąt", "Wzór na pole"],
    "rows": [
      ["Prostokąt", "$P=a\\cdot b$"],
      ["Kwadrat", "$P=a^2$"],
      ["Równoległobok", "$P=a\\cdot h_a=ab\\sin\\gamma$"],
      ["Romb", "$P=\\dfrac{d_1d_2}{2}=a\\cdot h_a$"],
      ["Trapez", "$P=\\dfrac{a+b}{2}\\cdot h$"],
      ["Deltoid", "$P=\\dfrac{d_1d_2}{2}$"]
    ]
  },
  {
    "type": "examples",
    "title": "Pole prostokąta z przekątnej",
    "items": [
      {
        "problem": "a=7,\\ d=25. \\ \\text{Oblicz pole prostokąta}",
        "steps": [
          {"text": "Z twierdzenia Pitagorasa wyznaczamy drugi bok — przekątna jest przeciwprostokątną trójkąta prostokątnego utworzonego przez dwa boki prostokąta.", "formula": "b=\\sqrt{d^2-a^2}=\\sqrt{25^2-7^2}=\\sqrt{625-49}=\\sqrt{576}"},
          {"text": "Obliczamy $b$.", "formula": "b=24"},
          {"text": "Obliczamy pole jako iloczyn boków.", "formula": "P=a\\cdot b=7\\cdot24"}
        ],
        "answer": "P=168"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Kwadrat o boku $6$ ma pole równe:",
    "options": ["$36$", "$24$", "$12$", "$6$"],
    "correctIndex": 0,
    "explanation": "$P=a^2=6^2=36$."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli rozpoznajesz kluczowe własności równoległoboku, prostokąta, rombu, kwadratu, trapezu i deltoidu (boki, kąty, przekątne) oraz sprawnie dobierasz i stosujesz właściwy wzór na pole każdego z nich w zależności od podanych danych."
  }
]$content3$::jsonb,
  2
);

-- ----------------------------------------------------------------------------
-- Lesson 4: Okręgi, styczne i podobieństwo figur
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'planimetria'),
  $title4$Okręgi, styczne i podobieństwo figur$title4$,
  $content4$[
  {
    "type": "intro",
    "text": "W tej lekcji poznasz związki między kątami w okręgu (kąt środkowy i kąt wpisany), własności stycznej do okręgu oraz podobieństwo figur — czyli sytuację, gdy dwie figury mają identyczny kształt, ale różny rozmiar."
  },
  {
    "type": "definition",
    "term": "Kąt środkowy i kąt wpisany",
    "text": "Kąt środkowy ma wierzchołek w środku okręgu, a jego ramiona przechodzą przez dwa punkty okręgu. Kąt wpisany ma wierzchołek na okręgu, a jego ramiona są cięciwami przechodzącymi przez te same dwa punkty. Jeśli kąt środkowy i kąt wpisany są oparte na tym samym łuku, to kąt wpisany ma miarę równą połowie miary kąta środkowego.",
    "formula": "\\alpha_{\\text{wpisany}}=\\frac{1}{2}\\alpha_{\\text{środkowy}}"
  },
  {
    "type": "quiz",
    "question": "Kąt środkowy oparty na danym łuku ma miarę $80^\\circ$. Jaką miarę ma kąt wpisany oparty na tym samym łuku?",
    "options": ["$40^\\circ$", "$80^\\circ$", "$160^\\circ$", "$20^\\circ$"],
    "correctIndex": 0,
    "explanation": "Kąt wpisany jest zawsze równy połowie kąta środkowego opartego na tym samym łuku: $\\frac{80^\\circ}{2}=40^\\circ$."
  },
  {
    "type": "definition",
    "term": "Kąt wpisany oparty na średnicy",
    "text": "Gdy cięciwa, na której oparty jest kąt wpisany, jest średnicą okręgu, odpowiadający jej kąt środkowy jest kątem półpełnym, czyli ma miarę $180^\\circ$. Kąt wpisany oparty na średnicy ma więc zawsze miarę równą połowie tej wartości — jest kątem prostym. To bardzo użyteczna własność: jeśli trójkąt jest wpisany w okrąg, a jeden z jego boków jest średnicą, to trójkąt ten jest prostokątny.",
    "formula": "\\alpha_{\\text{wpisany}}=90^\\circ \\quad \\text{gdy oparty na średnicy}"
  },
  {
    "type": "examples",
    "title": "Kąt wpisany oparty na średnicy",
    "items": [
      {
        "problem": "AB \\text{ — średnica okręgu}, \\ \\angle BAC=35^\\circ. \\ \\text{Oblicz } \\angle ABC",
        "steps": [
          {"text": "Skoro $AB$ jest średnicą, kąt wpisany $\\angle ACB$ oparty na tej średnicy jest kątem prostym.", "formula": "\\angle ACB=90^\\circ"},
          {"text": "Korzystamy z sumy kątów w trójkącie $ABC$.", "formula": "\\angle BAC+\\angle ABC+\\angle ACB=180^\\circ"},
          {"text": "Podstawiamy dane i wyznaczamy szukany kąt.", "formula": "35^\\circ+\\angle ABC+90^\\circ=180^\\circ"}
        ],
        "answer": "\\angle ABC=55^\\circ"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Trójkąt jest wpisany w okrąg, a jeden z jego boków jest średnicą tego okręgu. Jaki to musi być trójkąt?",
    "options": ["prostokątny", "równoboczny", "rozwartokątny", "nie da się tego stwierdzić"],
    "correctIndex": 0,
    "explanation": "Kąt wpisany oparty na średnicy ma zawsze miarę $90^\\circ$, więc taki trójkąt jest zawsze prostokątny (kąt prosty leży naprzeciw średnicy)."
  },
  {
    "type": "definition",
    "term": "Styczna do okręgu",
    "text": "Styczna do okręgu to prosta, która ma z okręgiem dokładnie jeden punkt wspólny (punkt styczności). Kluczowa własność: promień poprowadzony do punktu styczności jest zawsze prostopadły do stycznej w tym punkcie. Ta własność pozwala budować trójkąty prostokątne przy zadaniach ze stycznymi.",
    "formula": "r \\perp \\text{styczna w punkcie styczności}"
  },
  {
    "type": "quiz",
    "question": "Odcinek łączący środek okręgu z punktem styczności stycznej jest względem tej stycznej:",
    "options": ["prostopadły", "równoległy", "styczny", "nie ma żadnego stałego związku"],
    "correctIndex": 0,
    "explanation": "Promień poprowadzony do punktu styczności jest zawsze prostopadły do stycznej — to podstawowa własność stycznej do okręgu."
  },
  {
    "type": "reveal-steps",
    "title": "Długość odcinka stycznej",
    "problem": "O \\text{ — środek okręgu o promieniu } r=7,\\ |OP|=25. \\ \\text{Oblicz długość odcinka stycznej } PT",
    "steps": [
      {
        "prompt": "Promień $OT$ poprowadzony do punktu styczności $T$ jest prostopadły do stycznej $PT$. Jaki trójkąt tworzą punkty $O$, $P$, $T$?",
        "kind": "choice",
        "options": ["prostokątny, z kątem prostym przy $T$", "równoboczny", "rozwartokątny, z kątem rozwartym przy $T$"],
        "correctIndex": 0,
        "reveal": "Ponieważ $OT\\perp PT$, kąt przy wierzchołku $T$ jest prosty — trójkąt $OPT$ jest prostokątny."
      },
      {
        "prompt": "Który odcinek jest przeciwprostokątną tego trójkąta?",
        "kind": "choice",
        "options": ["$OP$", "$OT$", "$PT$"],
        "correctIndex": 0,
        "reveal": "Przeciwprostokątna leży naprzeciw kąta prostego (czyli naprzeciw $T$), więc jest nią odcinek $OP$ — łączący środek okręgu z punktem $P$."
      },
      {
        "prompt": "Zastosuj twierdzenie Pitagorasa i oblicz długość odcinka stycznej $PT$.",
        "kind": "input",
        "acceptedAnswers": ["24"],
        "reveal": "$PT=\\sqrt{OP^2-OT^2}=\\sqrt{25^2-7^2}=\\sqrt{625-49}=\\sqrt{576}=24$.",
        "formula": "PT=\\sqrt{25^2-7^2}=24"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Punkt $P$ leży w odległości $41$ od środka okręgu o promieniu $9$. Ile wynosi długość odcinka stycznej poprowadzonej z $P$ do tego okręgu?",
    "options": ["$40$", "$32$", "$50$", "$1600$"],
    "correctIndex": 0,
    "explanation": "$PT=\\sqrt{41^2-9^2}=\\sqrt{1681-81}=\\sqrt{1600}=40$."
  },
  {
    "type": "definition",
    "term": "Podobieństwo trójkątów",
    "text": "Dwa trójkąty są podobne, jeśli mają taki sam kształt (te same kąty), ale mogą różnić się rozmiarem — jeden jest powiększoną lub pomniejszoną kopią drugiego w pewnej skali $k$, zwanej skalą podobieństwa. Wtedy odpowiednie boki obu trójkątów są proporcjonalne w stosunku $k$, a odpowiednie kąty są równe.",
    "formula": "\\frac{a'}{a}=\\frac{b'}{b}=\\frac{c'}{c}=k"
  },
  {
    "type": "table",
    "title": "Cechy podobieństwa trójkątów",
    "headers": ["Cecha", "Warunek"],
    "rows": [
      ["kkk (kąt-kąt-kąt)", "dwa kąty jednego trójkąta są równe odpowiednim dwóm kątom drugiego (wówczas trzecie kąty też są równe)"],
      ["bbb (bok-bok-bok)", "boki jednego trójkąta są proporcjonalne do odpowiednich boków drugiego, w tej samej kolejności"],
      ["bkb (bok-kąt-bok)", "dwa boki jednego trójkąta są proporcjonalne do dwóch boków drugiego, a kąty zawarte między tymi bokami są równe"]
    ]
  },
  {
    "type": "geometry",
    "title": "Trójkąty podobne — porównaj boki i kąty",
    "caption": "Oba trójkąty mają ten sam kąt prosty przy $B$ i $B'$, więc są podobne — różnią się tylko rozmiarem. Bok $A'B'$ jest $1.5$ raza dłuższy niż bok $AB$ — to jest właśnie skala podobieństwa $k=1.5$.",
    "shape": {
      "points": [
        {"id": "A1", "x": 10, "y": 90, "label": "A", "draggable": true},
        {"id": "B1", "x": 40, "y": 90, "label": "B", "draggable": true},
        {"id": "C1", "x": 40, "y": 50, "label": "C", "draggable": true},
        {"id": "A2", "x": 50, "y": 95, "label": "A'", "draggable": true},
        {"id": "B2", "x": 95, "y": 95, "label": "B'", "draggable": true},
        {"id": "C2", "x": 95, "y": 35, "label": "C'", "draggable": true}
      ],
      "edges": [["A1", "B1"], ["B1", "C1"], ["C1", "A1"], ["A2", "B2"], ["B2", "C2"], ["C2", "A2"]],
      "measures": [
        {"kind": "distance", "from": "A1", "to": "B1", "label": "Bok AB (mały trójkąt)"},
        {"kind": "distance", "from": "A2", "to": "B2", "label": "Bok A'B' (duży trójkąt)"},
        {"kind": "angle", "at": "B1", "from": "A1", "to": "C1", "label": "Kąt przy B (mały trójkąt)"},
        {"kind": "angle", "at": "B2", "from": "A2", "to": "C2", "label": "Kąt przy B' (duży trójkąt)"}
      ]
    }
  },
  {
    "type": "formula",
    "title": "Stosunek pól figur podobnych",
    "expression": "\\frac{P_2}{P_1}=k^2",
    "variables": [
      {"symbol": "k", "meaning": "skala podobieństwa (stosunek odpowiednich boków)"},
      {"symbol": "P_1", "meaning": "pole mniejszej figury"},
      {"symbol": "P_2", "meaning": "pole większej figury, podobnej w skali $k$"}
    ]
  },
  {
    "type": "examples",
    "title": "Stosunek pól figur podobnych",
    "items": [
      {
        "problem": "P_1=600,\\ k=1.5. \\ \\text{Oblicz pole } P_2 \\text{ figury podobnej}",
        "steps": [
          {"text": "Stosunek pól figur podobnych jest równy kwadratowi skali podobieństwa.", "formula": "\\frac{P_2}{P_1}=k^2"},
          {"text": "Podstawiamy dane.", "formula": "P_2=600\\cdot1.5^2=600\\cdot2.25"}
        ],
        "answer": "P_2=1350"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Skala podobieństwa dwóch trójkątów wynosi $k=3$. Ile razy większe jest pole większego trójkąta od pola mniejszego?",
    "options": ["$9$ razy", "$3$ razy", "$6$ razy", "$27$ razy"],
    "correctIndex": 0,
    "explanation": "Stosunek pól figur podobnych jest równy kwadratowi skali podobieństwa: $k^2=3^2=9$."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli rozumiesz związek między kątem środkowym a kątem wpisanym (w tym szczególny przypadek kąta wpisanego opartego na średnicy), sprawnie wykorzystujesz prostopadłość promienia do stycznej w zadaniach z twierdzeniem Pitagorasa, znasz trzy cechy podobieństwa trójkątów oraz pamiętasz, że stosunek pól figur podobnych jest równy kwadratowi skali podobieństwa."
  }
]$content4$::jsonb,
  3
);
