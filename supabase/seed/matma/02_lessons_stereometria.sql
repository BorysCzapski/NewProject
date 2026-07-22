-- ============================================================================
-- supabase/seed/matma/02_lessons_stereometria.sql
-- Interactive lesson content (math_lessons) for the "stereometria" department:
-- graniastosłupy, ostrosłupy, walec, stożek, kula, przekroje, kąty między
-- prostymi/płaszczyznami, pola powierzchni i objętości.
-- content is a jsonb array of MathBlock (see lib/matma/lesson-blocks.ts).
--
-- Idempotent: deletes existing lessons for this topic first. Run
-- 01_topics.sql BEFORE this file — it looks up topic_id by slug.
-- ============================================================================

delete from math_lessons
where topic_id = (select id from math_topics where slug = 'stereometria');

-- ----------------------------------------------------------------------------
-- Lesson 1: Bryły, prostopadłościan i sześcian
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'stereometria'),
  $title1$Bryły, prostopadłościan i sześcian$title1$,
  $content1$[
  {
    "type": "basics-recap",
    "title": "Zanim zaczniesz: bryły, ich pola powierzchni i objętości",
    "text": "Stereometria to dział geometrii zajmujący się bryłami przestrzennymi (trójwymiarowymi) — w odróżnieniu od planimetrii, która zajmuje się płaskimi figurami. Każda bryła ma ściany (płaskie fragmenty jej powierzchni), krawędzie (odcinki, na których stykają się sąsiednie ściany) oraz wierzchołki (punkty, w których spotykają się krawędzie). Pole powierzchni bryły to suma pól wszystkich jej ścian — możesz to sobie wyobrazić jako „rozcięcie” bryły i rozłożenie jej na płaską siatkę, a potem zsumowanie pól wszystkich kawałków tej siatki. Objętość bryły mówi natomiast, ile miejsca ta bryła zajmuje w przestrzeni — wyobraź sobie, że wypełniasz ją małymi sześcianami jednostkowymi (np. o krawędzi 1 cm) i liczysz, ile takich sześcianów się zmieści. Jeśli wymiary bryły podane są w centymetrach, pole powierzchni wyrażamy w $\\text{cm}^2$, a objętość w $\\text{cm}^3$.",
    "formula": "1\\,\\text{cm}^3=1\\,\\text{cm}\\times1\\,\\text{cm}\\times1\\,\\text{cm}",
    "controlQuiz": [
      {
        "question": "Czym różni się pole powierzchni bryły od jej objętości?",
        "options": [
          "Pole powierzchni to suma pól wszystkich ścian bryły, a objętość to ilość przestrzeni, którą bryła zajmuje",
          "To dokładnie to samo pojęcie, tylko inaczej nazwane",
          "Pole powierzchni liczymy w $\\text{cm}^3$, a objętość w $\\text{cm}^2$",
          "Objętość mają tylko bryły obrotowe, a pole powierzchni wszystkie bryły"
        ],
        "correctIndex": 0,
        "explanation": "Pole powierzchni to wielkość dwuwymiarowa (jednostka np. $\\text{cm}^2$) opisująca, ile „materiału” potrzeba na pokrycie wszystkich ścian bryły, a objętość to wielkość trójwymiarowa (jednostka np. $\\text{cm}^3$) opisująca, ile miejsca bryła zajmuje w przestrzeni."
      },
      {
        "question": "Ile ścian, krawędzi i wierzchołków ma sześcian?",
        "options": [
          "6 ścian, 12 krawędzi, 8 wierzchołków",
          "6 ścian, 8 krawędzi, 12 wierzchołków",
          "4 ściany, 6 krawędzi, 4 wierzchołki",
          "8 ścian, 12 krawędzi, 6 wierzchołków"
        ],
        "correctIndex": 0,
        "explanation": "Sześcian ma 6 ścian (kwadratów), 12 krawędzi i 8 wierzchołków — możesz to policzyć, patrząc na dowolną kostkę do gry."
      },
      {
        "question": "W jakich jednostkach wyrazisz objętość bryły, jeśli wszystkie jej wymiary podano w metrach?",
        "options": ["w $\\text{m}^3$", "w $\\text{m}^2$", "w $\\text{m}$", "objętość nie ma jednostki"],
        "correctIndex": 0,
        "explanation": "Objętość jest wielkością trójwymiarową — mnożymy trzy długości (np. $m\\cdot m\\cdot m$), więc jej jednostką jest metr sześcienny, $\\text{m}^3$."
      }
    ]
  },
  {
    "type": "definition",
    "term": "Prostopadłościan",
    "text": "Prostopadłościan to bryła ograniczona sześcioma prostokątami (ścianami), w której każde dwie sąsiednie ściany są do siebie prostopadłe. Ma trzy wymiary, zwane krawędziami: długość $a$, szerokość $b$ i wysokość $c$ — z każdego wierzchołka wychodzą trzy krawędzie o tych długościach, wzajemnie prostopadłe. Prostopadłościan ma 6 ścian (parami przystających, równoległych prostokątów), 12 krawędzi i 8 wierzchołków."
  },
  {
    "type": "solid3d",
    "title": "Prostopadłościan o krawędziach a=5, b=4, c=3",
    "caption": "Obracaj bryłę suwakami, aby zobaczyć wszystkie jej ściany. Każda para przeciwległych ścian to przystające prostokąty.",
    "solid": {
      "shape": "cuboid",
      "dimensions": {"a": 5, "b": 4, "c": 3},
      "labels": {"a": "krawędź a", "b": "krawędź b", "c": "krawędź c"}
    }
  },
  {
    "type": "formula",
    "title": "Objętość prostopadłościanu",
    "expression": "V=a\\cdot b\\cdot c",
    "variables": [
      {"symbol": "a,b,c", "meaning": "długości trzech krawędzi wychodzących z jednego wierzchołka"}
    ]
  },
  {
    "type": "quiz",
    "question": "Prostopadłościan ma krawędzie $a=5$, $b=4$, $c=3$. Ile wynosi jego objętość?",
    "options": ["$60$", "$47$", "$12$", "$120$"],
    "correctIndex": 0,
    "explanation": "$V=a\\cdot b\\cdot c=5\\cdot4\\cdot3=60$."
  },
  {
    "type": "formula",
    "title": "Pole powierzchni całkowitej prostopadłościanu",
    "expression": "P_c=2(ab+bc+ca)",
    "variables": [
      {"symbol": "a,b,c", "meaning": "długości krawędzi prostopadłościanu"}
    ]
  },
  {
    "type": "examples",
    "title": "Obliczanie pola powierzchni prostopadłościanu",
    "items": [
      {
        "problem": "a=5,\\ b=4,\\ c=3. \\ \\text{Oblicz pole powierzchni całkowitej}",
        "steps": [
          {"text": "Obliczamy pola trzech różnych par ścian.", "formula": "ab=20,\\ bc=12,\\ ca=15"},
          {"text": "Sumujemy je i mnożymy przez 2 (każda para ścian występuje dwukrotnie).", "formula": "P_c=2(20+12+15)=2\\cdot47"}
        ],
        "answer": "P_c=94"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Pole powierzchni całkowitej prostopadłościanu o krawędziach $2$, $3$, $4$ wynosi:",
    "options": ["$52$", "$24$", "$26$", "$104$"],
    "correctIndex": 0,
    "explanation": "$P_c=2(2\\cdot3+3\\cdot4+4\\cdot2)=2(6+12+8)=2\\cdot26=52$."
  },
  {
    "type": "definition",
    "term": "Przekątna prostopadłościanu",
    "text": "Przekątna prostopadłościanu to odcinek łączący dwa wierzchołki, które nie leżą na tej samej ścianie (czyli biegnący „na wylot” przez wnętrze bryły). Jej długość obliczamy, dwukrotnie stosując twierdzenie Pitagorasa: najpierw do przekątnej podstawy (o bokach $a$ i $b$), a potem do trójkąta utworzonego przez tę przekątną podstawy i wysokość $c$.",
    "formula": "d=\\sqrt{a^2+b^2+c^2}"
  },
  {
    "type": "reveal-steps",
    "title": "Obliczanie przekątnej prostopadłościanu",
    "problem": "a=3,\\ b=4,\\ c=12. \\ \\text{Oblicz długość przekątnej prostopadłościanu}",
    "steps": [
      {
        "prompt": "Oblicz najpierw długość przekątnej podstawy $e$ o bokach $a=3$ i $b=4$ (twierdzenie Pitagorasa).",
        "kind": "input",
        "acceptedAnswers": ["5"],
        "reveal": "$e=\\sqrt{3^2+4^2}=\\sqrt{25}=5$.",
        "formula": "e=\\sqrt{9+16}=5"
      },
      {
        "prompt": "Teraz zastosuj twierdzenie Pitagorasa do trójkąta o przyprostokątnych $e=5$ i $c=12$, aby obliczyć przekątną $d$ prostopadłościanu.",
        "kind": "input",
        "acceptedAnswers": ["13"],
        "reveal": "$d=\\sqrt{e^2+c^2}=\\sqrt{5^2+12^2}=\\sqrt{169}=13$.",
        "formula": "d=\\sqrt{25+144}=13"
      },
      {
        "prompt": "Sprawdź: ten sam wynik otrzymasz od razu ze wzoru $d=\\sqrt{a^2+b^2+c^2}$. Oblicz $a^2+b^2+c^2$ dla $a=3,b=4,c=12$.",
        "kind": "input",
        "acceptedAnswers": ["169"],
        "reveal": "$3^2+4^2+12^2=9+16+144=169$, więc $d=\\sqrt{169}=13$ — dokładnie ten sam wynik.",
        "formula": "3^2+4^2+12^2=169"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Przekątna prostopadłościanu o krawędziach $a=1$, $b=2$, $c=2$ wynosi:",
    "options": ["$3$", "$5$", "$\\sqrt5$", "$9$"],
    "correctIndex": 0,
    "explanation": "$d=\\sqrt{1^2+2^2+2^2}=\\sqrt9=3$."
  },
  {
    "type": "definition",
    "term": "Sześcian",
    "text": "Sześcian to szczególny przypadek prostopadłościanu, w którym wszystkie trzy krawędzie mają tę samą długość: $a=b=c$. Wszystkie jego ściany są więc przystającymi kwadratami. Wzory na objętość, pole powierzchni i przekątną prostopadłościanu upraszczają się wtedy do wzorów zależnych tylko od jednej zmiennej $a$."
  },
  {
    "type": "table",
    "title": "Wzory dla sześcianu o krawędzi a",
    "headers": ["Wielkość", "Wzór"],
    "rows": [
      ["Objętość", "$V=a^3$"],
      ["Pole powierzchni całkowitej", "$P_c=6a^2$"],
      ["Przekątna ściany (kwadratu)", "$d_{\\text{ściany}}=a\\sqrt2$"],
      ["Przekątna sześcianu", "$d=a\\sqrt3$"]
    ]
  },
  {
    "type": "examples",
    "title": "Sześcian o krawędzi a=5",
    "items": [
      {
        "problem": "a=5. \\ \\text{Oblicz objętość, pole powierzchni i przekątną sześcianu}",
        "steps": [
          {"text": "Obliczamy objętość.", "formula": "V=a^3=5^3=125"},
          {"text": "Obliczamy pole powierzchni całkowitej.", "formula": "P_c=6a^2=6\\cdot25=150"},
          {"text": "Obliczamy przekątną sześcianu.", "formula": "d=a\\sqrt3=5\\sqrt3"}
        ],
        "answer": "V=125,\\ P_c=150,\\ d=5\\sqrt3"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Sześcian ma krawędź $a=2$. Ile wynosi jego przekątna?",
    "options": ["$2\\sqrt3$", "$2\\sqrt2$", "$8$", "$24$"],
    "correctIndex": 0,
    "explanation": "$d=a\\sqrt3=2\\sqrt3$ — to przekątna przechodząca przez wnętrze sześcianu (nie mylić z przekątną ściany, która wynosi $a\\sqrt2$)."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli rozumiesz różnicę między polem powierzchni a objętością bryły, swobodnie obliczasz objętość i pole powierzchni całkowitej prostopadłościanu oraz sześcianu z podanych krawędzi, a także potrafisz wyznaczyć długość przekątnej obu tych brył (dwukrotnie stosując twierdzenie Pitagorasa albo od razu wzorem $d=\\sqrt{a^2+b^2+c^2}$)."
  }
]$content1$::jsonb,
  0
);

-- ----------------------------------------------------------------------------
-- Lesson 2: Graniastosłupy proste i prawidłowe
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'stereometria'),
  $title2$Graniastosłupy proste i prawidłowe$title2$,
  $content2$[
  {
    "type": "intro",
    "text": "W tej lekcji poznasz graniastosłupy — bryły, których podstawami są dwa przystające i równoległe wielokąty, a ściany boczne łączą odpowiadające sobie boki tych podstaw. Szczególnie ważne są graniastosłupy proste (ściany boczne prostopadłe do podstaw) oraz graniastosłupy prawidłowe (proste, których podstawą jest wielokąt foremny) — to właśnie one najczęściej pojawiają się na maturze."
  },
  {
    "type": "definition",
    "term": "Graniastosłup",
    "text": "Graniastosłup to bryła, której dwie ściany (podstawy) są przystającymi i równoległymi wielokątami, a pozostałe ściany (ściany boczne) są równoległobokami łączącymi odpowiadające sobie boki obu podstaw. Liczba ścian bocznych jest równa liczbie boków podstawy. Graniastosłup nazywamy prostym, jeśli krawędzie boczne są prostopadłe do podstaw — wtedy wszystkie ściany boczne są prostokątami. Jeśli dodatkowo podstawą jest wielokąt foremny (o równych bokach i równych kątach), graniastosłup nazywamy prawidłowym."
  },
  {
    "type": "formula",
    "title": "Objętość graniastosłupa",
    "expression": "V=P_p\\cdot H",
    "variables": [
      {"symbol": "P_p", "meaning": "pole podstawy graniastosłupa"},
      {"symbol": "H", "meaning": "wysokość graniastosłupa (odległość między płaszczyznami podstaw)"}
    ]
  },
  {
    "type": "formula",
    "title": "Pole powierzchni graniastosłupa prostego",
    "expression": "P_c=2P_p+P_b, \\quad P_b=\\text{Obw}_p\\cdot H",
    "variables": [
      {"symbol": "P_b", "meaning": "pole powierzchni bocznej (suma pól wszystkich ścian bocznych)"},
      {"symbol": "\\text{Obw}_p", "meaning": "obwód podstawy"},
      {"symbol": "H", "meaning": "wysokość graniastosłupa"}
    ]
  },
  {
    "type": "quiz",
    "question": "Graniastosłup prosty ma podstawę o obwodzie $20$ cm i wysokość $H=7$ cm. Ile wynosi pole powierzchni bocznej?",
    "options": ["$140\\ \\text{cm}^2$", "$27\\ \\text{cm}^2$", "$70\\ \\text{cm}^2$", "$14\\ \\text{cm}^2$"],
    "correctIndex": 0,
    "explanation": "$P_b=\\text{Obw}_p\\cdot H=20\\cdot7=140\\ \\text{cm}^2$."
  },
  {
    "type": "definition",
    "term": "Graniastosłup prawidłowy trójkątny",
    "text": "Graniastosłup prawidłowy trójkątny ma za podstawę trójkąt równoboczny o boku $a$, a jego ściany boczne — prostopadłe do podstaw — są przystającymi prostokątami o wymiarach $a\\times H$. Pole podstawy takiego graniastosłupa to znany wzór na pole trójkąta równobocznego.",
    "formula": "P_p=\\frac{a^2\\sqrt3}{4}"
  },
  {
    "type": "solid3d",
    "title": "Graniastosłup prawidłowy trójkątny",
    "caption": "Podstawą tej bryły jest trójkąt równoboczny. Obracaj bryłę, aby zobaczyć obie podstawy i trzy prostokątne ściany boczne.",
    "solid": {
      "shape": "prism3",
      "dimensions": {"a": 4, "h": 6},
      "labels": {"a": "krawędź podstawy a", "h": "wysokość graniastosłupa H"}
    }
  },
  {
    "type": "examples",
    "title": "Objętość i pole powierzchni graniastosłupa prawidłowego trójkątnego",
    "items": [
      {
        "problem": "a=4,\\ H=6. \\ \\text{Oblicz objętość graniastosłupa}",
        "steps": [
          {"text": "Obliczamy pole podstawy (trójkąt równoboczny o boku $a=4$).", "formula": "P_p=\\frac{4^2\\sqrt3}{4}=4\\sqrt3"},
          {"text": "Mnożymy pole podstawy przez wysokość graniastosłupa.", "formula": "V=P_p\\cdot H=4\\sqrt3\\cdot6"}
        ],
        "answer": "V=24\\sqrt3"
      },
      {
        "problem": "a=4,\\ H=6. \\ \\text{Oblicz pole powierzchni całkowitej graniastosłupa}",
        "steps": [
          {"text": "Pole powierzchni bocznej to obwód podstawy razy wysokość.", "formula": "P_b=3a\\cdot H=3\\cdot4\\cdot6=72"},
          {"text": "Dodajemy dwa pola podstawy (górną i dolną).", "formula": "P_c=2P_p+P_b=2\\cdot4\\sqrt3+72"}
        ],
        "answer": "P_c=72+8\\sqrt3"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Graniastosłup prawidłowy trójkątny ma krawędź podstawy $a=6$ i wysokość $H=10$. Ile wynosi pole powierzchni bocznej?",
    "options": ["$180$", "$60$", "$36\\sqrt3$", "$18$"],
    "correctIndex": 0,
    "explanation": "$P_b=3a\\cdot H=3\\cdot6\\cdot10=180$ (trzy prostokątne ściany boczne o wymiarach $6\\times10$)."
  },
  {
    "type": "reveal-steps",
    "title": "Graniastosłup prawidłowy sześciokątny — objętość",
    "problem": "a=2,\\ H=5. \\ \\text{Oblicz objętość graniastosłupa prawidłowego sześciokątnego}",
    "steps": [
      {
        "prompt": "Pole sześciokąta foremnego o boku $a$ wyraża się wzorem $P_p=\\dfrac{3\\sqrt3}{2}a^2$. Oblicz pole podstawy dla $a=2$.",
        "kind": "input",
        "acceptedAnswers": ["6\\sqrt3", "6sqrt3", "6√3"],
        "reveal": "$P_p=\\frac{3\\sqrt3}{2}\\cdot2^2=\\frac{3\\sqrt3}{2}\\cdot4=6\\sqrt3$.",
        "formula": "P_p=6\\sqrt3"
      },
      {
        "prompt": "Oblicz objętość graniastosłupa, mnożąc pole podstawy przez wysokość $H=5$.",
        "kind": "input",
        "acceptedAnswers": ["30\\sqrt3", "30sqrt3", "30√3"],
        "reveal": "$V=P_p\\cdot H=6\\sqrt3\\cdot5=30\\sqrt3$.",
        "formula": "V=30\\sqrt3"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Ile ścian bocznych ma graniastosłup prawidłowy sześciokątny?",
    "options": ["$6$", "$8$", "$12$", "$4$"],
    "correctIndex": 0,
    "explanation": "Liczba ścian bocznych graniastosłupa jest równa liczbie boków podstawy — sześciokąt ma 6 boków, więc graniastosłup sześciokątny ma 6 ścian bocznych (prostokątów)."
  },
  {
    "type": "table",
    "title": "Podsumowanie: pola podstaw wielokątów foremnych",
    "headers": ["Podstawa", "Wzór na pole"],
    "rows": [
      ["Trójkąt równoboczny (bok $a$)", "$P_p=\\dfrac{a^2\\sqrt3}{4}$"],
      ["Kwadrat (bok $a$)", "$P_p=a^2$"],
      ["Sześciokąt foremny (bok $a$)", "$P_p=\\dfrac{3a^2\\sqrt3}{2}$"]
    ]
  },
  {
    "type": "quiz",
    "question": "Graniastosłup prawidłowy czworokątny (podstawa — kwadrat) ma krawędź podstawy $a=5$ i wysokość $H=9$. Ile wynosi jego objętość?",
    "options": ["$225$", "$45$", "$70$", "$125$"],
    "correctIndex": 0,
    "explanation": "$P_p=a^2=25$, więc $V=P_p\\cdot H=25\\cdot9=225$."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli rozumiesz różnicę między graniastosłupem prostym a prawidłowym, potrafisz obliczyć pole dowolnego wielokąta foremnego stanowiącego podstawę (trójkąt równoboczny, kwadrat, sześciokąt foremny), a ze znanego pola podstawy i wysokości sprawnie liczysz objętość ($V=P_p\\cdot H$) oraz pole powierzchni całkowitej ($P_c=2P_p+P_b$, gdzie $P_b=\\text{Obw}_p\\cdot H$)."
  }
]$content2$::jsonb,
  1
);

-- ----------------------------------------------------------------------------
-- Lesson 3: Ostrosłupy i kąty w bryłach
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'stereometria'),
  $title3$Ostrosłupy i kąty w bryłach$title3$,
  $content3$[
  {
    "type": "intro",
    "text": "Ostrosłup to bryła z jedną podstawą (dowolnym wielokątem) i wierzchołkiem leżącym poza płaszczyzną podstawy, połączonym z każdym wierzchołkiem podstawy krawędzią boczną. W tej lekcji poznasz wzory na objętość i pole powierzchni ostrosłupów, szczególny przypadek ostrosłupa prawidłowego oraz nauczysz się liczyć kąty, jakie ściany i krawędzie ostrosłupa tworzą z płaszczyzną podstawy."
  },
  {
    "type": "definition",
    "term": "Ostrosłup",
    "text": "Ostrosłup to bryła, której jedna ściana (podstawa) jest dowolnym wielokątem, a pozostałe ściany (ściany boczne) są trójkątami o wspólnym wierzchołku, zwanym wierzchołkiem ostrosłupa. Wysokość ostrosłupa $H$ to odległość wierzchołka od płaszczyzny podstawy (odcinek prostopadły do tej płaszczyzny)."
  },
  {
    "type": "formula",
    "title": "Objętość ostrosłupa",
    "expression": "V=\\frac13P_p\\cdot H",
    "variables": [
      {"symbol": "P_p", "meaning": "pole podstawy"},
      {"symbol": "H", "meaning": "wysokość ostrosłupa"}
    ]
  },
  {
    "type": "quiz",
    "question": "Ostrosłup ma pole podstawy $P_p=18$ i wysokość $H=5$. Ile wynosi jego objętość?",
    "options": ["$30$", "$90$", "$15$", "$6$"],
    "correctIndex": 0,
    "explanation": "$V=\\frac13\\cdot18\\cdot5=\\frac{90}{3}=30$."
  },
  {
    "type": "definition",
    "term": "Ostrosłup prawidłowy",
    "text": "Ostrosłup prawidłowy to ostrosłup, którego podstawą jest wielokąt foremny, a spodek wysokości (rzut wierzchołka na płaszczyznę podstawy) pokrywa się ze środkiem tego wielokąta. Wszystkie krawędzie boczne takiego ostrosłupa są równe, a wszystkie ściany boczne są przystającymi trójkątami równoramiennymi. Wysokość takiej ściany bocznej (odcinek opuszczony z wierzchołka ostrosłupa na krawędź podstawy) nazywamy apotemą ściany bocznej i oznaczamy $l$."
  },
  {
    "type": "solid3d",
    "title": "Ostrosłup prawidłowy czworokątny",
    "caption": "Podstawą tej bryły jest kwadrat. Obracaj bryłę, by zobaczyć cztery przystające ściany boczne.",
    "solid": {
      "shape": "pyramid4",
      "dimensions": {"a": 6, "h": 3},
      "labels": {"a": "krawędź podstawy a", "h": "wysokość H"}
    }
  },
  {
    "type": "formula",
    "title": "Apotema ściany bocznej ostrosłupa prawidłowego czworokątnego",
    "expression": "l=\\sqrt{H^2+\\left(\\frac a2\\right)^2}",
    "variables": [
      {"symbol": "a", "meaning": "krawędź podstawy (kwadratu)"},
      {"symbol": "H", "meaning": "wysokość ostrosłupa"},
      {"symbol": "l", "meaning": "apotema ściany bocznej — wysokość trójkąta bocznego"}
    ]
  },
  {
    "type": "examples",
    "title": "Ostrosłup prawidłowy czworokątny — objętość i pole powierzchni",
    "items": [
      {
        "problem": "a=6,\\ H=3. \\ \\text{Oblicz objętość ostrosłupa}",
        "steps": [
          {"text": "Pole podstawy to pole kwadratu o boku $a$.", "formula": "P_p=a^2=36"},
          {"text": "Stosujemy wzór na objętość ostrosłupa.", "formula": "V=\\frac13\\cdot36\\cdot3"}
        ],
        "answer": "V=36"
      },
      {
        "problem": "a=6,\\ H=3. \\ \\text{Oblicz pole powierzchni całkowitej ostrosłupa}",
        "steps": [
          {"text": "Obliczamy apotemę ściany bocznej.", "formula": "l=\\sqrt{3^2+3^2}=\\sqrt{18}=3\\sqrt2"},
          {"text": "Pole jednej ściany bocznej (trójkąta) to połowa iloczynu podstawy $a$ i apotemy $l$; ścian bocznych jest cztery.", "formula": "P_b=4\\cdot\\frac12\\cdot6\\cdot3\\sqrt2=36\\sqrt2"},
          {"text": "Dodajemy pole podstawy.", "formula": "P_c=P_p+P_b=36+36\\sqrt2"}
        ],
        "answer": "P_c=36(1+\\sqrt2)"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Ostrosłup prawidłowy czworokątny ma krawędź podstawy $a=4$ i wysokość $H=6$. Ile wynosi jego objętość?",
    "options": ["$32$", "$96$", "$16$", "$8$"],
    "correctIndex": 0,
    "explanation": "$P_p=a^2=16$, więc $V=\\frac13\\cdot16\\cdot6=32$."
  },
  {
    "type": "definition",
    "term": "Kąt między ścianą boczną a podstawą (kąt dwuścienny)",
    "text": "Aby zmierzyć kąt między ścianą boczną ostrosłupa prawidłowego a płaszczyzną podstawy, wyznacz dwa odcinki prostopadłe do wspólnej krawędzi (boku podstawy) — jeden leżący w ścianie bocznej (apotema ściany $l$), a drugi leżący w podstawie (apotema podstawy, czyli odległość środka podstawy od środka boku). Kąt między tymi dwoma odcinkami to szukany kąt dwuścienny $\\beta$, a jego tangens liczymy w trójkącie prostokątnym utworzonym przez wysokość ostrosłupa $H$ i apotemę podstawy.",
    "formula": "\\tan\\beta=\\frac{H}{\\text{apotema podstawy}}"
  },
  {
    "type": "reveal-steps",
    "title": "Kąt nachylenia ściany bocznej do podstawy",
    "problem": "a=6,\\ H=3. \\ \\text{Oblicz kąt nachylenia ściany bocznej do płaszczyzny podstawy}",
    "steps": [
      {
        "prompt": "Podstawą jest kwadrat o boku $a=6$. Ile wynosi apotema podstawy, czyli odległość środka kwadratu od środka jego boku (połowa boku)?",
        "kind": "input",
        "acceptedAnswers": ["3"],
        "reveal": "Apotema podstawy kwadratu o boku $a=6$ to $\\frac a2=3$.",
        "formula": "\\frac a2=3"
      },
      {
        "prompt": "Oblicz tangens szukanego kąta $\\beta$, dzieląc wysokość ostrosłupa $H=3$ przez apotemę podstawy.",
        "kind": "input",
        "acceptedAnswers": ["1"],
        "reveal": "$\\tan\\beta=\\frac{H}{a/2}=\\frac33=1$.",
        "formula": "\\tan\\beta=1"
      },
      {
        "prompt": "Dla jakiego kąta z przedziału $0^\\circ$–$90^\\circ$ tangens wynosi $1$?",
        "kind": "choice",
        "options": ["$45^\\circ$", "$30^\\circ$", "$60^\\circ$", "$90^\\circ$"],
        "correctIndex": 0,
        "reveal": "$\\tan45^\\circ=1$, więc kąt nachylenia ściany bocznej do podstawy wynosi $\\beta=45^\\circ$."
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Kąt między ścianą boczną ostrosłupa prawidłowego a podstawą liczymy jako kąt między:",
    "options": [
      "apotemą ściany bocznej a apotemą podstawy (oba odcinki prostopadłe do tej samej krawędzi podstawy)",
      "krawędzią boczną a krawędzią podstawy",
      "dwiema sąsiednimi ścianami bocznymi",
      "przekątną podstawy a wysokością ostrosłupa"
    ],
    "correctIndex": 0,
    "explanation": "Kąt dwuścienny między ścianą boczną a podstawą mierzymy między dwoma odcinkami prostopadłymi do tej samej wspólnej krawędzi: apotemą ściany bocznej (leżącą w ścianie bocznej) i apotemą podstawy (leżącą w podstawie)."
  },
  {
    "type": "definition",
    "term": "Czworościan foremny",
    "text": "Czworościan foremny to ostrosłup, którego wszystkie cztery ściany są przystającymi trójkątami równobocznymi o boku $a$ — jest to jednocześnie ostrosłup prawidłowy trójkątny, w którym krawędź boczna jest równa krawędzi podstawy. To najprostsza możliwa bryła wielościenna (ma tylko 4 ściany, 6 krawędzi i 4 wierzchołki)."
  },
  {
    "type": "table",
    "title": "Wzory dla czworościanu foremnego o krawędzi a",
    "headers": ["Wielkość", "Wzór"],
    "rows": [
      ["Pole powierzchni całkowitej", "$P_c=a^2\\sqrt3$"],
      ["Wysokość bryły", "$H=\\dfrac{a\\sqrt6}{3}$"],
      ["Objętość", "$V=\\dfrac{a^3\\sqrt2}{12}$"]
    ]
  },
  {
    "type": "examples",
    "title": "Czworościan foremny o krawędzi a=6",
    "items": [
      {
        "problem": "a=6. \\ \\text{Oblicz pole powierzchni i objętość czworościanu foremnego}",
        "steps": [
          {"text": "Obliczamy pole powierzchni całkowitej (cztery przystające trójkąty równoboczne).", "formula": "P_c=a^2\\sqrt3=36\\sqrt3"},
          {"text": "Obliczamy wysokość bryły.", "formula": "H=\\frac{a\\sqrt6}{3}=\\frac{6\\sqrt6}{3}=2\\sqrt6"},
          {"text": "Obliczamy objętość.", "formula": "V=\\frac{a^3\\sqrt2}{12}=\\frac{216\\sqrt2}{12}=18\\sqrt2"}
        ],
        "answer": "P_c=36\\sqrt3,\\ V=18\\sqrt2"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Ile ścian, krawędzi i wierzchołków ma czworościan foremny?",
    "options": [
      "4 ściany, 6 krawędzi, 4 wierzchołki",
      "4 ściany, 4 krawędzie, 6 wierzchołków",
      "6 ścian, 12 krawędzi, 8 wierzchołków",
      "3 ściany, 6 krawędzi, 4 wierzchołki"
    ],
    "correctIndex": 0,
    "explanation": "Czworościan foremny (jak każdy czworościan) ma 4 ściany, 6 krawędzi i 4 wierzchołki — to najprostszy wielościan wypukły."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli sprawnie liczysz objętość ($V=\\frac13P_p H$) i pole powierzchni ostrosłupa (w tym ostrosłupa prawidłowego, korzystając z apotemy ściany bocznej), rozumiesz, jak wyznaczyć kąt nachylenia ściany bocznej do podstawy (przez apotemę ściany i apotemę podstawy), oraz znasz wzory dla czworościanu foremnego."
  }
]$content3$::jsonb,
  2
);

-- ----------------------------------------------------------------------------
-- Lesson 4: Walec, stożek, kula i przekroje osiowe
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'stereometria'),
  $title4$Walec, stożek, kula i przekroje osiowe$title4$,
  $content4$[
  {
    "type": "intro",
    "text": "Walec, stożek i kula to bryły obrotowe — powstają przez obrót figury płaskiej (prostokąta, trójkąta prostokątnego, koła) wokół osi. W tej lekcji poznasz ich wzory na objętość i pole powierzchni, a także nauczysz się rysować i liczyć przekroje osiowe tych brył."
  },
  {
    "type": "definition",
    "term": "Walec",
    "text": "Walec powstaje przez obrót prostokąta wokół jednego z jego boków. Ma dwie przystające, równoległe podstawy w kształcie koła o promieniu $r$ oraz powierzchnię boczną, która po rozwinięciu na płaszczyznę jest prostokątem o wymiarach $2\\pi r\\times h$ (gdzie $h$ to wysokość walca — odległość między podstawami)."
  },
  {
    "type": "formula",
    "title": "Objętość i pole powierzchni walca",
    "expression": "V=\\pi r^2h, \\quad P_c=2\\pi r^2+2\\pi rh=2\\pi r(r+h)",
    "variables": [
      {"symbol": "r", "meaning": "promień podstawy walca"},
      {"symbol": "h", "meaning": "wysokość walca"}
    ]
  },
  {
    "type": "solid3d",
    "title": "Walec o promieniu r=3, wysokości h=5",
    "caption": "Obracaj bryłę suwakami. Powierzchnia boczna walca po rozwinięciu jest prostokątem.",
    "solid": {
      "shape": "cylinder",
      "dimensions": {"r": 3, "h": 5},
      "labels": {"r": "promień r", "h": "wysokość h"}
    }
  },
  {
    "type": "examples",
    "title": "Objętość i pole powierzchni walca",
    "items": [
      {
        "problem": "r=3,\\ h=5. \\ \\text{Oblicz objętość walca}",
        "steps": [
          {"text": "Stosujemy wzór na objętość walca.", "formula": "V=\\pi r^2h=\\pi\\cdot3^2\\cdot5"}
        ],
        "answer": "V=45\\pi"
      },
      {
        "problem": "r=3,\\ h=5. \\ \\text{Oblicz pole powierzchni całkowitej walca}",
        "steps": [
          {"text": "Stosujemy wzór na pole powierzchni całkowitej.", "formula": "P_c=2\\pi r(r+h)=2\\pi\\cdot3\\cdot(3+5)=2\\pi\\cdot3\\cdot8"}
        ],
        "answer": "P_c=48\\pi"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Walec ma promień podstawy $r=2$ i wysokość $h=7$. Ile wynosi jego objętość?",
    "options": ["$28\\pi$", "$14\\pi$", "$56\\pi$", "$4\\pi$"],
    "correctIndex": 0,
    "explanation": "$V=\\pi r^2h=\\pi\\cdot2^2\\cdot7=28\\pi$."
  },
  {
    "type": "definition",
    "term": "Przekrój osiowy walca",
    "text": "Przekrój osiowy to przekrój bryły obrotowej płaszczyzną zawierającą jej oś obrotu. Przekrój osiowy walca to zawsze prostokąt o bokach $2r$ (średnica podstawy) i $h$ (wysokość walca).",
    "formula": "P_{\\text{przekroju}}=2r\\cdot h"
  },
  {
    "type": "reveal-steps",
    "title": "Pole przekroju osiowego walca",
    "problem": "r=4,\\ h=10. \\ \\text{Oblicz pole przekroju osiowego walca}",
    "steps": [
      {
        "prompt": "Jaki kształt ma przekrój osiowy walca?",
        "kind": "choice",
        "options": ["prostokąt", "koło", "trójkąt równoramienny"],
        "correctIndex": 0,
        "reveal": "Przekrój osiowy walca to zawsze prostokąt o bokach równych średnicy podstawy ($2r$) i wysokości walca ($h$)."
      },
      {
        "prompt": "Ile wynosi dłuższy bok tego prostokąta — czyli średnica podstawy walca — dla $r=4$?",
        "kind": "input",
        "acceptedAnswers": ["8"],
        "reveal": "Średnica to $2r=2\\cdot4=8$.",
        "formula": "2r=8"
      },
      {
        "prompt": "Oblicz pole prostokąta o bokach $8$ i $10$ (drugi bok to wysokość walca $h=10$).",
        "kind": "input",
        "acceptedAnswers": ["80"],
        "reveal": "$P=8\\cdot10=80$.",
        "formula": "P=8\\cdot10=80"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Przekrój osiowy walca o promieniu $r=5$ i wysokości $h=6$ ma pole równe:",
    "options": ["$60$", "$30$", "$150$", "$11$"],
    "correctIndex": 0,
    "explanation": "$P=2r\\cdot h=2\\cdot5\\cdot6=60$."
  },
  {
    "type": "definition",
    "term": "Stożek",
    "text": "Stożek powstaje przez obrót trójkąta prostokątnego wokół jednej z jego przyprostokątnych. Ma jedną podstawę w kształcie koła o promieniu $r$, wierzchołek oraz powierzchnię boczną. Odcinek łączący wierzchołek stożka z dowolnym punktem okręgu podstawy nazywamy tworzącą $l$ — jest ona przeciwprostokątną w trójkącie prostokątnym o przyprostokątnych $r$ (promień) i $h$ (wysokość stożka).",
    "formula": "l=\\sqrt{r^2+h^2}"
  },
  {
    "type": "solid3d",
    "title": "Stożek o promieniu r=3, wysokości h=4",
    "caption": "Trójka $r=3$, $h=4$ daje tworzącą $l=5$ (trójkąt egipski 3-4-5).",
    "solid": {
      "shape": "cone",
      "dimensions": {"r": 3, "h": 4},
      "labels": {"r": "promień r", "h": "wysokość h"}
    }
  },
  {
    "type": "examples",
    "title": "Objętość i pole powierzchni stożka",
    "items": [
      {
        "problem": "r=3,\\ h=4. \\ \\text{Oblicz tworzącą, objętość i pole powierzchni stożka}",
        "steps": [
          {"text": "Obliczamy tworzącą z twierdzenia Pitagorasa.", "formula": "l=\\sqrt{r^2+h^2}=\\sqrt{3^2+4^2}=\\sqrt{25}=5"},
          {"text": "Obliczamy objętość stożka.", "formula": "V=\\frac13\\pi r^2h=\\frac13\\pi\\cdot9\\cdot4=12\\pi"},
          {"text": "Obliczamy pole powierzchni całkowitej.", "formula": "P_c=\\pi r(r+l)=\\pi\\cdot3\\cdot(3+5)=24\\pi"}
        ],
        "answer": "l=5,\\ V=12\\pi,\\ P_c=24\\pi"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Stożek ma promień podstawy $r=6$ i wysokość $h=8$. Ile wynosi długość tworzącej $l$?",
    "options": ["$10$", "$14$", "$48$", "$100$"],
    "correctIndex": 0,
    "explanation": "$l=\\sqrt{r^2+h^2}=\\sqrt{6^2+8^2}=\\sqrt{100}=10$."
  },
  {
    "type": "definition",
    "term": "Przekrój osiowy stożka",
    "text": "Przekrój osiowy stożka to trójkąt równoramienny, którego podstawa ma długość $2r$ (średnica podstawy stożka), wysokość jest równa wysokości stożka $h$, a ramiona mają długość równą tworzącej $l$.",
    "formula": "P_{\\text{przekroju}}=\\frac12\\cdot2r\\cdot h=r\\cdot h"
  },
  {
    "type": "reveal-steps",
    "title": "Pole przekroju osiowego stożka",
    "problem": "r=3,\\ h=4. \\ \\text{Oblicz pole przekroju osiowego stożka}",
    "steps": [
      {
        "prompt": "Jaki kształt ma przekrój osiowy stożka?",
        "kind": "choice",
        "options": ["trójkąt równoramienny", "prostokąt", "koło"],
        "correctIndex": 0,
        "reveal": "Przekrój osiowy stożka to trójkąt równoramienny o podstawie $2r$, wysokości $h$ i ramionach równych tworzącej $l$."
      },
      {
        "prompt": "Oblicz pole tego trójkąta dla $r=3$, $h=4$ (podstawa $2r$, wysokość $h$).",
        "kind": "input",
        "acceptedAnswers": ["12"],
        "reveal": "$P=\\frac12\\cdot2r\\cdot h=r\\cdot h=3\\cdot4=12$.",
        "formula": "P=3\\cdot4=12"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Pole przekroju osiowego stożka o promieniu $r=5$ i wysokości $h=6$ wynosi:",
    "options": ["$30$", "$60$", "$15$", "$11$"],
    "correctIndex": 0,
    "explanation": "$P=r\\cdot h=5\\cdot6=30$."
  },
  {
    "type": "definition",
    "term": "Kula",
    "text": "Kula to bryła złożona ze wszystkich punktów przestrzeni odległych od jej środka o co najwyżej promień $r$ (powstaje przez obrót koła wokół dowolnej średnicy). Jej powierzchnię nazywamy sferą.",
    "formula": "V=\\frac43\\pi r^3, \\quad P=4\\pi r^2"
  },
  {
    "type": "solid3d",
    "title": "Kula o promieniu r=3",
    "caption": "Obracaj bryłę, aby zobaczyć ozdobny równik — sama kula jest bryłą obrotowo symetryczną względem dowolnej osi przechodzącej przez jej środek.",
    "solid": {
      "shape": "sphere",
      "dimensions": {"r": 3},
      "labels": {"r": "promień r"}
    }
  },
  {
    "type": "examples",
    "title": "Objętość i pole powierzchni kuli",
    "items": [
      {
        "problem": "r=3. \\ \\text{Oblicz objętość i pole powierzchni kuli}",
        "steps": [
          {"text": "Obliczamy objętość kuli.", "formula": "V=\\frac43\\pi r^3=\\frac43\\pi\\cdot27"},
          {"text": "Obliczamy pole powierzchni kuli.", "formula": "P=4\\pi r^2=4\\pi\\cdot9"}
        ],
        "answer": "V=36\\pi,\\ P=36\\pi"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Kula ma promień $r=6$. Ile wynosi jej objętość?",
    "options": ["$288\\pi$", "$144\\pi$", "$864\\pi$", "$36\\pi$"],
    "correctIndex": 0,
    "explanation": "$V=\\frac43\\pi r^3=\\frac43\\pi\\cdot216=288\\pi$."
  },
  {
    "type": "table",
    "title": "Podsumowanie wzorów: walec, stożek, kula",
    "headers": ["Bryła", "Objętość", "Pole powierzchni całkowitej"],
    "rows": [
      ["Walec", "$V=\\pi r^2h$", "$P_c=2\\pi r(r+h)$"],
      ["Stożek", "$V=\\dfrac13\\pi r^2h$", "$P_c=\\pi r(r+l),\\ l=\\sqrt{r^2+h^2}$"],
      ["Kula", "$V=\\dfrac43\\pi r^3$", "$P=4\\pi r^2$"]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli sprawnie liczysz objętość i pole powierzchni walca, stożka (pamiętając o obliczeniu tworzącej $l$ z twierdzenia Pitagorasa) oraz kuli, a także rozpoznajesz i potrafisz obliczyć pole przekroju osiowego każdej z tych brył (prostokąt dla walca, trójkąt równoramienny dla stożka)."
  }
]$content4$::jsonb,
  3
);
