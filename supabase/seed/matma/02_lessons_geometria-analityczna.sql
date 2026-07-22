-- ============================================================================
-- supabase/seed/matma/02_lessons_geometria-analityczna.sql
-- Interactive lesson content (math_lessons) for the "geometria-analityczna"
-- department: Rownanie prostej, okregu, wzajemne polozenie prostych/okregow,
-- symetrie, odleglosc punktu od prostej, pola figur w ukladzie wspolrzednych.
-- content is a jsonb array of MathBlock (see lib/matma/lesson-blocks.ts).
--
-- Field delimiter convention (verified against components/matma/*): fields
-- named `formula`/`expression` and MathExampleItem.problem/.answer are PURE
-- KaTeX (no $ delimiters). Fields rendered via <MathText> (text, statement,
-- question, options, explanation, prompt, reveal, RevealStepsBlock.problem,
-- table headers/cells) may embed $inline$ KaTeX. Fields rendered as plain
-- JSX (title, term, caption, GeometryPoint/GeometryMeasure.label, FormulaBlock
-- .variables[].meaning) get NO KaTeX at all -- plain Polish only.
--
-- Idempotent: deletes existing lessons for this topic first. Run
-- 01_topics.sql BEFORE this file -- it looks up topic_id by slug.
-- ============================================================================

delete from math_lessons
where topic_id = (select id from math_topics where slug = 'geometria-analityczna');

-- ----------------------------------------------------------------------------
-- Lesson 1: Punkty na płaszczyźnie: odległość, środek odcinka i równanie
-- prostej
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'geometria-analityczna'),
  $title1$Punkty na płaszczyźnie: odległość, środek odcinka i równanie prostej$title1$,
  $content1$[
  {
    "type": "basics-recap",
    "title": "Zanim zaczniesz: układ współrzędnych i punkty na płaszczyźnie",
    "text": "Prostokątny układ współrzędnych (kartezjański) tworzą dwie prostopadłe osie liczbowe: pozioma oś OX (oś odciętych) i pionowa oś OY (oś rzędnych), przecinające się w punkcie $O=(0,0)$, zwanym początkiem układu współrzędnych. Każdemu punktowi płaszczyzny przyporządkowujemy parę liczb $(x,y)$ — jego współrzędne: $x$ to odcięta (rzut punktu na oś OX), $y$ to rzędna (rzut punktu na oś OY). Zapis $A=(3,-2)$ oznacza, że punkt $A$ ma odciętą równą $3$ i rzędną równą $-2$. Obie osie dzielą płaszczyznę na cztery ćwiartki, numerowane przeciwnie do ruchu wskazówek zegara, zaczynając od prawej górnej: I ćwiartka ($x>0,\\ y>0$), II ćwiartka ($x<0,\\ y>0$), III ćwiartka ($x<0,\\ y<0$), IV ćwiartka ($x>0,\\ y<0$).",
    "formula": "A=(x_A,\\ y_A)",
    "controlQuiz": [
      {
        "question": "Punkt $A$ ma współrzędne $(4,-3)$. Ile wynosi jego odcięta?",
        "options": ["$4$", "$-3$", "$-4$", "$3$"],
        "correctIndex": 0,
        "explanation": "Odcięta to pierwsza współrzędna punktu (wartość $x$) — dla punktu $A=(4,-3)$ odcięta wynosi $4$."
      },
      {
        "question": "W której ćwiartce układu współrzędnych leży punkt $B=(-5,2)$?",
        "options": ["II ćwiartka", "I ćwiartka", "III ćwiartka", "IV ćwiartka"],
        "correctIndex": 0,
        "explanation": "Odcięta jest ujemna, a rzędna dodatnia ($x<0,\\ y>0$) — to warunek II ćwiartki."
      },
      {
        "question": "Jak nazywa się punkt $O=(0,0)$?",
        "options": ["początek układu współrzędnych", "środek odcinka", "punkt przecięcia dwóch dowolnych prostych", "żadna z powyższych odpowiedzi"],
        "correctIndex": 0,
        "explanation": "Punkt przecięcia osi OX i OY nazywamy początkiem układu współrzędnych i oznaczamy literą $O$."
      }
    ]
  },
  {
    "type": "definition",
    "term": "Odległość dwóch punktów",
    "text": "Rzuty punktów $A$ i $B$ na osie układu współrzędnych tworzą trójkąt prostokątny, którego przyprostokątne mają długości $|x_B-x_A|$ oraz $|y_B-y_A|$, a przeciwprostokątną jest właśnie odcinek $AB$. Z twierdzenia Pitagorasa wynika wzór na odległość dwóch punktów.",
    "formula": "d(A,B)=\\sqrt{(x_B-x_A)^2+(y_B-y_A)^2}"
  },
  {
    "type": "geometry",
    "title": "Odległość dwóch punktów na żywo",
    "caption": "Przeciągnij punkty A i B i obserwuj, jak zmienia się odległość między nimi (odcinek łączący je jest przeciwprostokątną trójkąta prostokątnego zbudowanego na różnicach współrzędnych).",
    "shape": {
      "points": [
        {"id": "A", "x": 20, "y": 75, "label": "A", "draggable": true},
        {"id": "B", "x": 78, "y": 25, "label": "B", "draggable": true}
      ],
      "edges": [["A", "B"]],
      "measures": [
        {"kind": "distance", "from": "A", "to": "B", "label": "Odległość AB"}
      ]
    }
  },
  {
    "type": "quiz",
    "question": "Oblicz odległość punktów $A=(1,2)$ i $B=(4,6)$.",
    "options": ["$5$", "$7$", "$25$", "$\\sqrt7$"],
    "correctIndex": 0,
    "explanation": "$d(A,B)=\\sqrt{(4-1)^2+(6-2)^2}=\\sqrt{9+16}=\\sqrt{25}=5$."
  },
  {
    "type": "examples",
    "title": "Obliczanie odległości punktów",
    "items": [
      {
        "problem": "A=(-2,1),\\ B=(3,13). \\ \\text{Oblicz odległość } |AB|",
        "steps": [
          {"text": "Stosujemy wzór na odległość dwóch punktów.", "formula": "d(A,B)=\\sqrt{(x_B-x_A)^2+(y_B-y_A)^2}"},
          {"text": "Podstawiamy współrzędne punktów.", "formula": "d(A,B)=\\sqrt{(3-(-2))^2+(13-1)^2}=\\sqrt{5^2+12^2}"},
          {"text": "Obliczamy.", "formula": "d(A,B)=\\sqrt{25+144}=\\sqrt{169}"}
        ],
        "answer": "d(A,B)=13"
      },
      {
        "problem": "A=(0,0),\\ B=(-3,-4). \\ \\text{Oblicz odległość } |AB|",
        "steps": [
          {"text": "Podstawiamy współrzędne do wzoru.", "formula": "d(A,B)=\\sqrt{(-3-0)^2+(-4-0)^2}"},
          {"text": "Obliczamy.", "formula": "d(A,B)=\\sqrt{9+16}=\\sqrt{25}"}
        ],
        "answer": "d(A,B)=5"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Odległość punktów $A=(2,-1)$ i $B=(2,5)$ wynosi:",
    "options": ["$6$", "$36$", "$4$", "$\\sqrt6$"],
    "correctIndex": 0,
    "explanation": "$d(A,B)=\\sqrt{(2-2)^2+(5-(-1))^2}=\\sqrt{0+36}=\\sqrt{36}=6$."
  },
  {
    "type": "definition",
    "term": "Środek odcinka",
    "text": "Środek odcinka $AB$ to punkt $S$, którego obie współrzędne są średnimi arytmetycznymi odpowiednich współrzędnych końców tego odcinka.",
    "formula": "S=\\left(\\frac{x_A+x_B}{2},\\ \\frac{y_A+y_B}{2}\\right)"
  },
  {
    "type": "reveal-steps",
    "title": "Wyznaczanie środka odcinka",
    "problem": "Punkty mają współrzędne $A=(-4,6)$ oraz $B=(10,-2)$. Wyznacz środek odcinka $AB$.",
    "steps": [
      {
        "prompt": "Jakiego wzoru użyjemy, aby wyznaczyć środek odcinka?",
        "kind": "choice",
        "options": ["$S=\\left(\\frac{x_A+x_B}2,\\frac{y_A+y_B}2\\right)$", "$S=(x_B-x_A,\\ y_B-y_A)$", "$S=\\sqrt{(x_B-x_A)^2+(y_B-y_A)^2}$"],
        "correctIndex": 0,
        "reveal": "Środek odcinka to punkt o współrzędnych będących średnimi arytmetycznymi współrzędnych jego końców."
      },
      {
        "prompt": "Oblicz odciętą środka odcinka, czyli współrzędną $x_S$.",
        "kind": "input",
        "acceptedAnswers": ["3"],
        "reveal": "$x_S=\\dfrac{-4+10}{2}=\\dfrac{6}{2}=3$.",
        "formula": "x_S=\\frac{-4+10}{2}=3"
      },
      {
        "prompt": "Oblicz rzędną środka odcinka, czyli współrzędną $y_S$.",
        "kind": "input",
        "acceptedAnswers": ["2"],
        "reveal": "$y_S=\\dfrac{6+(-2)}{2}=\\dfrac{4}{2}=2$.",
        "formula": "y_S=\\frac{6+(-2)}{2}=2"
      },
      {
        "prompt": "Zapisz pełne współrzędne środka odcinka $S$.",
        "kind": "input",
        "acceptedAnswers": ["(3,2)", "S=(3,2)"],
        "reveal": "Środek odcinka to $S=(3,2)$."
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Środek odcinka o końcach $A=(0,4)$ i $B=(6,0)$ to punkt:",
    "options": ["$(3,2)$", "$(6,4)$", "$(3,4)$", "$(0,0)$"],
    "correctIndex": 0,
    "explanation": "$S=\\left(\\dfrac{0+6}2,\\dfrac{4+0}2\\right)=(3,2)$."
  },
  {
    "type": "definition",
    "term": "Równanie prostej — postać kierunkowa",
    "text": "Każdą prostą, która nie jest pionowa, można zapisać w postaci kierunkowej $y=ax+b$. Współczynnik $a$ nazywamy współczynnikiem kierunkowym — decyduje on o nachyleniu i kierunku prostej (im większa wartość $|a|$, tym prosta jest bardziej stroma). Liczba $b$ to wyraz wolny — jest rzędną punktu, w którym prosta przecina oś OY. Znając współrzędne dwóch różnych punktów należących do prostej, współczynnik kierunkowy obliczamy jako iloraz różnicy rzędnych i różnicy odciętych tych punktów.",
    "formula": "y=ax+b"
  },
  {
    "type": "formula",
    "title": "Współczynnik kierunkowy prostej przechodzącej przez dwa punkty",
    "expression": "a=\\frac{y_B-y_A}{x_B-x_A}",
    "variables": [
      {"symbol": "a", "meaning": "współczynnik kierunkowy prostej"},
      {"symbol": "A,B", "meaning": "dwa różne punkty należące do prostej, o różnych odciętych"}
    ]
  },
  {
    "type": "examples",
    "title": "Wyznaczanie równania prostej przechodzącej przez dwa punkty",
    "items": [
      {
        "problem": "A=(1,2),\\ B=(3,8). \\ \\text{Wyznacz równanie prostej } AB \\text{ w postaci kierunkowej}",
        "steps": [
          {"text": "Obliczamy współczynnik kierunkowy.", "formula": "a=\\frac{8-2}{3-1}=\\frac{6}{2}=3"},
          {"text": "Podstawiamy współrzędne punktu A do równania y=ax+b, aby wyznaczyć b.", "formula": "2=3\\cdot1+b"},
          {"text": "Wyznaczamy b.", "formula": "b=2-3=-1"}
        ],
        "answer": "y=3x-1"
      },
      {
        "problem": "A=(-2,5),\\ B=(2,-3). \\ \\text{Wyznacz równanie prostej } AB",
        "steps": [
          {"text": "Obliczamy współczynnik kierunkowy.", "formula": "a=\\frac{-3-5}{2-(-2)}=\\frac{-8}{4}=-2"},
          {"text": "Podstawiamy punkt B do równania.", "formula": "-3=-2\\cdot2+b"},
          {"text": "Wyznaczamy b.", "formula": "b=-3+4=1"}
        ],
        "answer": "y=-2x+1"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Współczynnik kierunkowy prostej przechodzącej przez punkty $A=(0,0)$ i $B=(4,4)$ wynosi:",
    "options": ["$1$", "$4$", "$0$", "$-1$"],
    "correctIndex": 0,
    "explanation": "$a=\\dfrac{4-0}{4-0}=1$."
  },
  {
    "type": "definition",
    "term": "Równanie prostej — postać ogólna",
    "text": "Prostą można też zapisać w postaci ogólnej $Ax+By+C=0$, gdzie liczby $A$ i $B$ nie są jednocześnie równe zero. Ta postać opisuje KAŻDĄ prostą na płaszczyźnie, także prostą pionową (postaci $x=c$), której nie da się zapisać w postaci kierunkowej. Postać kierunkową łatwo zamienić na ogólną: z równania $y=ax+b$ otrzymujemy $ax-y+b=0$, czyli $A=a$, $B=-1$, $C=b$.",
    "formula": "Ax+By+C=0"
  },
  {
    "type": "table",
    "title": "Postacie równania prostej — podsumowanie",
    "headers": ["Postać", "Wzór", "Uwagi"],
    "rows": [
      ["Kierunkowa", "$y=ax+b$", "nie opisuje prostych pionowych"],
      ["Ogólna", "$Ax+By+C=0$", "opisuje każdą prostą na płaszczyźnie, w tym pionowe (gdy $B=0$, otrzymujemy $x=c$)"]
    ]
  },
  {
    "type": "quiz",
    "question": "Prosta o równaniu ogólnym $2x-y+3=0$, zapisana w postaci kierunkowej, to:",
    "options": ["$y=2x+3$", "$y=-2x+3$", "$y=2x-3$", "$y=\\frac12x+3$"],
    "correctIndex": 0,
    "explanation": "Z równania $2x-y+3=0$ wyznaczamy $y$: $y=2x+3$."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli sprawnie obliczasz odległość dwóch punktów i współrzędne środka odcinka, rozumiesz znaczenie współczynnika kierunkowego $a$ i wyrazu wolnego $b$ w postaci kierunkowej prostej $y=ax+b$, potrafisz wyznaczyć równanie prostej przechodzącej przez dwa dane punkty oraz swobodnie zamieniasz postać kierunkową na ogólną i odwrotnie."
  }
]$content1$::jsonb,
  0
);

-- ----------------------------------------------------------------------------
-- Lesson 2: Wzajemne położenie prostych i odległość punktu od prostej
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'geometria-analityczna'),
  $title2$Wzajemne położenie prostych i odległość punktu od prostej$title2$,
  $content2$[
  {
    "type": "intro",
    "text": "W tej lekcji zbadasz, jak rozpoznać wzajemne położenie dwóch prostych na płaszczyźnie (równoległe, prostopadłe, przecinające się w jednym punkcie albo pokrywające się) oraz nauczysz się obliczać odległość dowolnego punktu od danej prostej — to jedno z najczęściej wykorzystywanych narzędzi w zadaniach maturalnych z geometrii analitycznej."
  },
  {
    "type": "definition",
    "term": "Proste równoległe",
    "text": "Dwie proste są równoległe, jeśli nie mają żadnego punktu wspólnego, albo pokrywają się (są tą samą prostą). W postaci kierunkowej proste $y=a_1x+b_1$ oraz $y=a_2x+b_2$ są równoległe wtedy i tylko wtedy, gdy mają równe współczynniki kierunkowe. Jeśli dodatkowo $b_1=b_2$, to proste się pokrywają; jeśli $b_1\\neq b_2$, to proste są równoległe i rozłączne (bez punktów wspólnych).",
    "formula": "a_1=a_2"
  },
  {
    "type": "quiz",
    "question": "Proste $y=3x+2$ oraz $y=3x-5$ są względem siebie:",
    "options": ["równoległe i rozłączne", "prostopadłe", "pokrywające się", "przecinają się w jednym punkcie"],
    "correctIndex": 0,
    "explanation": "Obie proste mają ten sam współczynnik kierunkowy $a=3$, ale różne wyrazy wolne ($2\\neq-5$), więc są równoległe i rozłączne."
  },
  {
    "type": "definition",
    "term": "Proste prostopadłe",
    "text": "Dwie proste (żadna z nich pionowa) o współczynnikach kierunkowych $a_1$ i $a_2$ są prostopadłe wtedy i tylko wtedy, gdy iloczyn ich współczynników kierunkowych wynosi $-1$. Innymi słowy, współczynniki kierunkowe prostych prostopadłych są liczbami przeciwnymi i jednocześnie odwrotnymi — jeśli $a_1=2$, to $a_2=-\\frac12$.",
    "formula": "a_1\\cdot a_2=-1"
  },
  {
    "type": "examples",
    "title": "Sprawdzanie równoległości i prostopadłości prostych",
    "items": [
      {
        "problem": "k:\\ y=\\tfrac23x-1,\\quad l:\\ y=\\tfrac23x+4. \\ \\text{Zbadaj wzajemne położenie prostych } k \\text{ i } l",
        "steps": [
          {"text": "Porównujemy współczynniki kierunkowe obu prostych.", "formula": "a_k=\\tfrac23,\\quad a_l=\\tfrac23"},
          {"text": "Współczynniki kierunkowe są równe, a wyrazy wolne różne ($-1\\neq4$)."}
        ],
        "answer": "k\\parallel l \\ \\text{(proste równoległe, rozłączne)}"
      },
      {
        "problem": "k:\\ y=2x+1,\\quad l:\\ y=-\\tfrac12x+3. \\ \\text{Zbadaj wzajemne położenie prostych } k \\text{ i } l",
        "steps": [
          {"text": "Mnożymy współczynniki kierunkowe obu prostych.", "formula": "a_k\\cdot a_l=2\\cdot\\left(-\\tfrac12\\right)=-1"}
        ],
        "answer": "k\\perp l \\ \\text{(proste prostopadłe)}"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Prosta prostopadła do prostej $y=-4x+1$ ma współczynnik kierunkowy równy:",
    "options": ["$\\frac14$", "$-\\frac14$", "$4$", "$-4$"],
    "correctIndex": 0,
    "explanation": "Warunek prostopadłości to $a_1\\cdot a_2=-1$, więc $a_2=-\\dfrac{1}{a_1}=-\\dfrac{1}{-4}=\\dfrac14$."
  },
  {
    "type": "geometry",
    "title": "Kąt między dwiema prostymi",
    "caption": "Odcinki XA i XB pokazują kierunki dwóch prostych przecinających się w punkcie X. Obecnie proste są prostopadłe — kąt między nimi wynosi 90 stopni. Przeciągnij punkt A lub B i sprawdź, jak zmienia się kąt między prostymi, gdy przestają być prostopadłe.",
    "shape": {
      "points": [
        {"id": "X", "x": 50, "y": 50, "label": "X", "draggable": false},
        {"id": "A", "x": 77, "y": 59, "label": "A", "draggable": true},
        {"id": "B", "x": 41, "y": 77, "label": "B", "draggable": true}
      ],
      "edges": [["X", "A"], ["X", "B"]],
      "measures": [
        {"kind": "angle", "at": "X", "from": "A", "to": "B", "label": "Kąt między prostymi k i l"}
      ]
    }
  },
  {
    "type": "quiz",
    "question": "Jeśli kąt między dwiema prostymi wynosi $90^\\circ$, to te proste są:",
    "options": ["prostopadłe", "równoległe", "pokrywające się", "żadna z powyższych odpowiedzi"],
    "correctIndex": 0,
    "explanation": "Kąt prosty ($90^\\circ$) między prostymi to definicja prostopadłości."
  },
  {
    "type": "reveal-steps",
    "title": "Punkt przecięcia dwóch prostych",
    "problem": "Proste mają równania $k:\\ y=2x-1$ oraz $l:\\ y=-x+5$. Wyznacz punkt przecięcia prostych $k$ i $l$.",
    "steps": [
      {
        "prompt": "W punkcie przecięcia obie proste mają tę samą rzędną dla tego samego x. Przyrównaj prawe strony obu równań.",
        "kind": "input",
        "acceptedAnswers": ["2x-1=-x+5", "2x-1=5-x"],
        "reveal": "Przyrównujemy prawe strony: $2x-1=-x+5$.",
        "formula": "2x-1=-x+5"
      },
      {
        "prompt": "Rozwiąż otrzymane równanie i podaj wartość x.",
        "kind": "input",
        "acceptedAnswers": ["2"],
        "reveal": "$2x-1=-x+5 \\Rightarrow 3x=6 \\Rightarrow x=2$.",
        "formula": "3x=6 \\ \\Rightarrow\\ x=2"
      },
      {
        "prompt": "Podstaw $x=2$ do równania jednej z prostych (np. prostej k) i oblicz y.",
        "kind": "input",
        "acceptedAnswers": ["3"],
        "reveal": "$y=2\\cdot2-1=4-1=3$.",
        "formula": "y=2\\cdot2-1=3"
      },
      {
        "prompt": "Zapisz pełne współrzędne punktu przecięcia.",
        "kind": "input",
        "acceptedAnswers": ["(2,3)", "P=(2,3)"],
        "reveal": "Proste przecinają się w punkcie $P=(2,3)$. Sprawdzenie w równaniu l: $-2+5=3$ — zgadza się."
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Proste k oraz l dane są tym samym równaniem $y=x+1$. Są one względem siebie:",
    "options": ["pokrywające się (to ta sama prosta)", "równoległe i rozłączne", "prostopadłe", "przecinają się w jednym punkcie"],
    "correctIndex": 0,
    "explanation": "Skoro obie proste mają identyczne równanie, każdy punkt jednej z nich należy też do drugiej — proste się pokrywają."
  },
  {
    "type": "definition",
    "term": "Odległość punktu od prostej",
    "text": "Odległość punktu $P=(x_0,y_0)$ od prostej danej w postaci ogólnej $Ax+By+C=0$ obliczamy, podstawiając współrzędne punktu do lewej strony równania prostej i dzieląc wartość bezwzględną wyniku przez długość wektora normalnego prostej, czyli $\\sqrt{A^2+B^2}$.",
    "formula": "d(P,l)=\\frac{|Ax_0+By_0+C|}{\\sqrt{A^2+B^2}}"
  },
  {
    "type": "examples",
    "title": "Obliczanie odległości punktu od prostej",
    "items": [
      {
        "problem": "P=(1,2),\\quad l:\\ 3x+4y-6=0. \\ \\text{Oblicz odległość punktu } P \\text{ od prostej } l",
        "steps": [
          {"text": "Podstawiamy współrzędne punktu do wzoru.", "formula": "d=\\frac{|3\\cdot1+4\\cdot2-6|}{\\sqrt{3^2+4^2}}"},
          {"text": "Obliczamy licznik i mianownik.", "formula": "d=\\frac{|3+8-6|}{\\sqrt{9+16}}=\\frac{5}{\\sqrt{25}}"}
        ],
        "answer": "d=1"
      },
      {
        "problem": "P=(0,0),\\quad l:\\ x-y+4=0. \\ \\text{Oblicz odległość punktu } P \\text{ od prostej } l",
        "steps": [
          {"text": "Podstawiamy współrzędne punktu do wzoru.", "formula": "d=\\frac{|1\\cdot0-1\\cdot0+4|}{\\sqrt{1^2+(-1)^2}}"},
          {"text": "Obliczamy.", "formula": "d=\\frac{4}{\\sqrt2}=\\frac{4\\sqrt2}{2}"}
        ],
        "answer": "d=2\\sqrt2"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Odległość punktu $P=(2,-1)$ od prostej pionowej $x=5$ wynosi:",
    "options": ["$3$", "$5$", "$2$", "$7$"],
    "correctIndex": 0,
    "explanation": "Dla prostej pionowej $x=c$ odległość punktu $(x_0,y_0)$ wynosi $|x_0-c|=|2-5|=3$."
  },
  {
    "type": "reveal-steps",
    "title": "Odległość punktu od prostej — krok po kroku",
    "problem": "Dany jest punkt $P=(4,-2)$ oraz prosta $l:\\ 5x-12y+8=0$. Oblicz odległość punktu $P$ od prostej $l$.",
    "steps": [
      {
        "prompt": "Podstaw współrzędne punktu P do wyrażenia $Ax_0+By_0+C$ i oblicz jego wartość.",
        "kind": "input",
        "acceptedAnswers": ["52"],
        "reveal": "$5\\cdot4+(-12)\\cdot(-2)+8=20+24+8=52$.",
        "formula": "5\\cdot4-12\\cdot(-2)+8=52"
      },
      {
        "prompt": "Oblicz $\\sqrt{A^2+B^2}$ dla $A=5$, $B=-12$.",
        "kind": "input",
        "acceptedAnswers": ["13"],
        "reveal": "$\\sqrt{5^2+(-12)^2}=\\sqrt{25+144}=\\sqrt{169}=13$.",
        "formula": "\\sqrt{169}=13"
      },
      {
        "prompt": "Podziel wartość bezwzględną z pierwszego kroku przez wynik z drugiego kroku.",
        "kind": "input",
        "acceptedAnswers": ["4"],
        "reveal": "$d=\\dfrac{|52|}{13}=4$.",
        "formula": "d=\\frac{52}{13}=4"
      }
    ]
  },
  {
    "type": "table",
    "title": "Podsumowanie: wzajemne położenie prostych i odległość punktu od prostej",
    "headers": ["Sytuacja", "Warunek (postać kierunkowa)"],
    "rows": [
      ["Proste równoległe, rozłączne", "$a_1=a_2$ i $b_1\\neq b_2$"],
      ["Proste pokrywające się", "$a_1=a_2$ i $b_1=b_2$"],
      ["Proste prostopadłe", "$a_1\\cdot a_2=-1$"],
      ["Proste przecinające się w jednym punkcie", "$a_1\\neq a_2$"]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli bezbłędnie rozpoznajesz, kiedy dwie proste są równoległe, prostopadłe, pokrywające się albo przecinają się w jednym punkcie (i potrafisz ten punkt wyznaczyć), oraz sprawnie stosujesz wzór na odległość punktu od prostej danej w postaci ogólnej."
  }
]$content2$::jsonb,
  1
);

-- ----------------------------------------------------------------------------
-- Lesson 3: Symetrie punktów w układzie współrzędnych
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'geometria-analityczna'),
  $title3$Symetrie punktów w układzie współrzędnych$title3$,
  $content3$[
  {
    "type": "intro",
    "text": "W tej lekcji nauczysz się wyznaczać obraz punktu w symetrii (odbiciu) względem osi OX, osi OY, początku układu współrzędnych oraz dowolnego punktu — czyli przekształceń bardzo często pojawiających się w zadaniach maturalnych z geometrii analitycznej."
  },
  {
    "type": "definition",
    "term": "Symetria względem osi OX",
    "text": "Przy symetrii (odbiciu) względem osi OX punkt zachowuje swoją odciętą, a jego rzędna zmienia znak na przeciwny — oś OX pełni rolę zwierciadła.",
    "formula": "S_{OX}(x,y)=(x,-y)"
  },
  {
    "type": "geometry",
    "title": "Symetria punktu względem prostej",
    "caption": "Prosta pozioma przedstawia oś symetrii. Punkt A i jego odbicie A' leżą w takiej samej odległości od tej osi, po jej przeciwnych stronach. Przeciągnij punkt A i samodzielnie oblicz, jak zmieniłyby się współrzędne jego odbicia.",
    "shape": {
      "points": [
        {"id": "L", "x": 5, "y": 50, "label": "", "draggable": false},
        {"id": "R", "x": 95, "y": 50, "label": "", "draggable": false},
        {"id": "A", "x": 30, "y": 25, "label": "A", "draggable": true},
        {"id": "Ap", "x": 30, "y": 75, "label": "A'", "draggable": false}
      ],
      "edges": [["L", "R"], ["A", "Ap"]],
      "measures": [
        {"kind": "distance", "from": "A", "to": "Ap", "label": "Odległość AA' (dwa razy odległość od osi symetrii)"}
      ]
    }
  },
  {
    "type": "quiz",
    "question": "Punkt $A=(5,-8)$ w symetrii względem osi OX przechodzi na punkt:",
    "options": ["$(5,8)$", "$(-5,-8)$", "$(-5,8)$", "$(5,-8)$"],
    "correctIndex": 0,
    "explanation": "W symetrii względem osi OX odcięta pozostaje bez zmian, a rzędna zmienia znak: $(5,-8)\\to(5,8)$."
  },
  {
    "type": "definition",
    "term": "Symetria względem osi OY",
    "text": "Przy symetrii (odbiciu) względem osi OY punkt zachowuje swoją rzędną, a jego odcięta zmienia znak na przeciwny.",
    "formula": "S_{OY}(x,y)=(-x,y)"
  },
  {
    "type": "quiz",
    "question": "Punkt $B=(-3,7)$ w symetrii względem osi OY przechodzi na punkt:",
    "options": ["$(3,7)$", "$(-3,-7)$", "$(3,-7)$", "$(-3,7)$"],
    "correctIndex": 0,
    "explanation": "W symetrii względem osi OY rzędna pozostaje bez zmian, a odcięta zmienia znak: $(-3,7)\\to(3,7)$."
  },
  {
    "type": "definition",
    "term": "Symetria względem początku układu współrzędnych",
    "text": "Symetria środkowa względem punktu $O=(0,0)$ jest złożeniem obu powyższych symetrii osiowych — obie współrzędne punktu zmieniają znak na przeciwny.",
    "formula": "S_O(x,y)=(-x,-y)"
  },
  {
    "type": "examples",
    "title": "Wyznaczanie obrazów punktu w symetriach osiowych i środkowej",
    "items": [
      {
        "problem": "A=(4,-9). \\ \\text{Wyznacz obraz punktu } A \\text{ w symetrii względem osi OX, osi OY i początku układu}",
        "steps": [
          {"text": "W symetrii względem osi OX zmienia znak druga współrzędna.", "formula": "S_{OX}(A)=(4,9)"},
          {"text": "W symetrii względem osi OY zmienia znak pierwsza współrzędna.", "formula": "S_{OY}(A)=(-4,-9)"},
          {"text": "W symetrii względem początku układu zmieniają znak obie współrzędne.", "formula": "S_O(A)=(-4,9)"}
        ],
        "answer": "S_{OX}(A)=(4,9),\\ S_{OY}(A)=(-4,-9),\\ S_O(A)=(-4,9)"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Punkt $C=(-6,-2)$ w symetrii środkowej względem początku układu współrzędnych przechodzi na punkt:",
    "options": ["$(6,2)$", "$(-6,2)$", "$(6,-2)$", "$(-6,-2)$"],
    "correctIndex": 0,
    "explanation": "W symetrii środkowej względem $O$ obie współrzędne zmieniają znak: $(-6,-2)\\to(6,2)$."
  },
  {
    "type": "definition",
    "term": "Symetria względem dowolnego punktu",
    "text": "Uogólniając symetrię środkową względem początku układu, symetria względem dowolnego punktu $S=(p,q)$ przekształca punkt $A=(x,y)$ na taki punkt $A'$, że $S$ jest środkiem odcinka $AA'$. Wzór na współrzędne obrazu wyprowadzamy właśnie z warunku, że $S$ jest środkiem odcinka łączącego punkt z jego obrazem.",
    "formula": "S_{S}(x,y)=(2p-x,\\ 2q-y)"
  },
  {
    "type": "reveal-steps",
    "title": "Symetria względem dowolnego punktu",
    "problem": "Dany jest punkt $A=(1,5)$ oraz punkt $S=(3,2)$. Wyznacz obraz $A'$ punktu $A$ w symetrii względem punktu $S$.",
    "steps": [
      {
        "prompt": "Jakiego wzoru użyjemy, wiedząc że S jest środkiem odcinka AA'?",
        "kind": "choice",
        "options": ["$A'=(2p-x_A,\\ 2q-y_A)$", "$A'=(x_A-p,\\ y_A-q)$", "$A'=(p-x_A,\\ q-y_A)$"],
        "correctIndex": 0,
        "reveal": "Skoro $S=(p,q)$ jest środkiem odcinka $AA'$, to $A'=(2p-x_A,\\ 2q-y_A)$."
      },
      {
        "prompt": "Oblicz odciętą punktu A' (podstaw $p=3$, $x_A=1$ do $2p-x_A$).",
        "kind": "input",
        "acceptedAnswers": ["5"],
        "reveal": "$x_{A'}=2\\cdot3-1=6-1=5$.",
        "formula": "x_{A'}=2\\cdot3-1=5"
      },
      {
        "prompt": "Oblicz rzędną punktu A' (podstaw $q=2$, $y_A=5$ do $2q-y_A$).",
        "kind": "input",
        "acceptedAnswers": ["-1"],
        "reveal": "$y_{A'}=2\\cdot2-5=4-5=-1$.",
        "formula": "y_{A'}=2\\cdot2-5=-1"
      },
      {
        "prompt": "Zapisz pełne współrzędne punktu A'.",
        "kind": "input",
        "acceptedAnswers": ["(5,-1)", "A'=(5,-1)"],
        "reveal": "$A'=(5,-1)$. Sprawdzenie: środek odcinka AA' to $\\left(\\dfrac{1+5}2,\\dfrac{5+(-1)}2\\right)=(3,2)=S$ — zgadza się."
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Obrazem punktu $A=(0,0)$ w symetrii względem punktu $S=(4,-1)$ jest punkt:",
    "options": ["$(8,-2)$", "$(4,-1)$", "$(-8,2)$", "$(2,-1)$"],
    "correctIndex": 0,
    "explanation": "$A'=(2\\cdot4-0,\\ 2\\cdot(-1)-0)=(8,-2)$."
  },
  {
    "type": "table",
    "title": "Podsumowanie wzorów symetrii",
    "headers": ["Symetria względem", "Wzór przekształcenia"],
    "rows": [
      ["osi OX", "$(x,y)\\to(x,-y)$"],
      ["osi OY", "$(x,y)\\to(-x,y)$"],
      ["początku układu $O=(0,0)$", "$(x,y)\\to(-x,-y)$"],
      ["punktu $S=(p,q)$", "$(x,y)\\to(2p-x,\\ 2q-y)$"]
    ]
  },
  {
    "type": "quiz",
    "question": "Punkt $(2,-5)$ jest obrazem punktu $(2,5)$ w przekształceniu, w którym odcięta pozostaje bez zmian, a rzędna zmienia znak. To symetria względem:",
    "options": ["osi OX", "osi OY", "początku układu", "prostej $y=x$"],
    "correctIndex": 0,
    "explanation": "Zachowanie odciętej i zmiana znaku rzędnej to definicja symetrii względem osi OX."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli bezbłędnie wyznaczasz obraz punktu w symetrii względem osi OX, osi OY, początku układu współrzędnych oraz dowolnego punktu $S=(p,q)$, i pamiętasz, że we wszystkich tych przekształceniach punkt symetrii (albo prosta symetrii) jest środkiem odcinka łączącego punkt z jego obrazem."
  }
]$content3$::jsonb,
  2
);

-- ----------------------------------------------------------------------------
-- Lesson 4: Okrąg: równanie, wzajemne położenie oraz pola figur w układzie
-- współrzędnych
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'geometria-analityczna'),
  $title4$Okrąg: równanie, wzajemne położenie oraz pola figur w układzie współrzędnych$title4$,
  $content4$[
  {
    "type": "intro",
    "text": "W tej lekcji poznasz równanie okręgu w dwóch postaciach, nauczysz się badać wzajemne położenie prostej i okręgu oraz dwóch okręgów, a także obliczysz pole trójkąta na podstawie współrzędnych jego wierzchołków."
  },
  {
    "type": "definition",
    "term": "Równanie okręgu — postać kanoniczna",
    "text": "Okrąg o środku $S=(a,b)$ i promieniu $r>0$ to zbiór wszystkich punktów płaszczyzny odległych od środka $S$ dokładnie o $r$. Podstawiając ten warunek do wzoru na odległość dwóch punktów, otrzymujemy równanie okręgu w postaci kanonicznej (środkowo-promieniowej).",
    "formula": "(x-a)^2+(y-b)^2=r^2"
  },
  {
    "type": "geometry",
    "title": "Okrąg jako zbiór punktów jednakowo odległych od środka",
    "caption": "Szary dwunastokąt przybliża okrąg o środku O i promieniu 30. Przeciągnij punkt P: gdy odległość OP wynosi dokładnie 30, punkt P leży na tym okręgu — to jest właśnie definicja okręgu jako zbioru punktów jednakowo odległych od środka.",
    "shape": {
      "points": [
        {"id": "c0", "x": 80, "y": 50, "label": "", "draggable": false},
        {"id": "c1", "x": 75.98, "y": 65, "label": "", "draggable": false},
        {"id": "c2", "x": 65, "y": 75.98, "label": "", "draggable": false},
        {"id": "c3", "x": 50, "y": 80, "label": "", "draggable": false},
        {"id": "c4", "x": 35, "y": 75.98, "label": "", "draggable": false},
        {"id": "c5", "x": 24.02, "y": 65, "label": "", "draggable": false},
        {"id": "c6", "x": 20, "y": 50, "label": "", "draggable": false},
        {"id": "c7", "x": 24.02, "y": 35, "label": "", "draggable": false},
        {"id": "c8", "x": 35, "y": 24.02, "label": "", "draggable": false},
        {"id": "c9", "x": 50, "y": 20, "label": "", "draggable": false},
        {"id": "c10", "x": 65, "y": 24.02, "label": "", "draggable": false},
        {"id": "c11", "x": 75.98, "y": 35, "label": "", "draggable": false},
        {"id": "O", "x": 50, "y": 50, "label": "O", "draggable": false},
        {"id": "P", "x": 90, "y": 50, "label": "P", "draggable": true}
      ],
      "edges": [["c0","c1"],["c1","c2"],["c2","c3"],["c3","c4"],["c4","c5"],["c5","c6"],["c6","c7"],["c7","c8"],["c8","c9"],["c9","c10"],["c10","c11"],["c11","c0"],["O","P"]],
      "measures": [
        {"kind": "distance", "from": "O", "to": "P", "label": "Odległość OP od środka"}
      ]
    }
  },
  {
    "type": "quiz",
    "question": "Okrąg o równaniu $(x-2)^2+(y+5)^2=9$ ma środek i promień równe:",
    "options": ["$S=(2,-5),\\ r=3$", "$S=(-2,5),\\ r=3$", "$S=(2,-5),\\ r=9$", "$S=(2,5),\\ r=3$"],
    "correctIndex": 0,
    "explanation": "Porównując z postacią kanoniczną $(x-a)^2+(y-b)^2=r^2$: $a=2$, $b=-5$ (bo $y+5=y-(-5)$), $r^2=9$, więc $r=3$."
  },
  {
    "type": "examples",
    "title": "Zapisywanie równania okręgu",
    "items": [
      {
        "problem": "S=(1,-3),\\ r=5. \\ \\text{Zapisz równanie okręgu}",
        "steps": [
          {"text": "Podstawiamy współrzędne środka i promień do wzoru kanonicznego.", "formula": "(x-1)^2+(y-(-3))^2=5^2"}
        ],
        "answer": "(x-1)^2+(y+3)^2=25"
      },
      {
        "problem": "\\text{Okrąg ma środek } S=(0,0) \\text{ i przechodzi przez punkt } (5,0). \\ \\text{Zapisz jego równanie}",
        "steps": [
          {"text": "Promień to odległość środka od podanego punktu okręgu.", "formula": "r=\\sqrt{(5-0)^2+(0-0)^2}=\\sqrt{25}=5"},
          {"text": "Podstawiamy do wzoru kanonicznego.", "formula": "x^2+y^2=5^2"}
        ],
        "answer": "x^2+y^2=25"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Promień okręgu o równaniu $x^2+y^2=49$ wynosi:",
    "options": ["$7$", "$49$", "$14$", "$24.5$"],
    "correctIndex": 0,
    "explanation": "$r=\\sqrt{49}=7$."
  },
  {
    "type": "definition",
    "term": "Równanie okręgu — postać ogólna",
    "text": "Po podniesieniu wzoru kanonicznego do kwadratu i uporządkowaniu wyrażeń, równanie okręgu można zapisać w postaci ogólnej. Aby odczytać z niej środek i promień, sprowadzamy je z powrotem do postaci kanonicznej metodą uzupełniania do pełnego kwadratu.",
    "formula": "x^2+y^2+Dx+Ey+F=0"
  },
  {
    "type": "formula",
    "title": "Środek i promień okręgu z postaci ogólnej",
    "expression": "a=-\\frac{D}{2},\\quad b=-\\frac{E}{2},\\quad r=\\sqrt{a^2+b^2-F}",
    "variables": [
      {"symbol": "a,b", "meaning": "współrzędne środka okręgu"},
      {"symbol": "r", "meaning": "promień okręgu — wzór ma sens tylko, gdy wyrażenie pod pierwiastkiem jest dodatnie"},
      {"symbol": "D,E,F", "meaning": "współczynniki postaci ogólnej równania okręgu"}
    ]
  },
  {
    "type": "reveal-steps",
    "title": "Sprowadzanie równania okręgu do postaci kanonicznej",
    "problem": "Dany jest okrąg o równaniu $x^2+y^2-6x+4y-3=0$. Wyznacz jego środek i promień.",
    "steps": [
      {
        "prompt": "Porównaj dane równanie z postacią ogólną $x^2+y^2+Dx+Ey+F=0$ i wskaż poprawny zestaw współczynników.",
        "kind": "choice",
        "options": ["$D=-6,\\ E=4,\\ F=-3$", "$D=6,\\ E=-4,\\ F=-3$", "$D=-6,\\ E=4,\\ F=3$"],
        "correctIndex": 0,
        "reveal": "Porównując wyrazy równania: $D=-6$, $E=4$, $F=-3$."
      },
      {
        "prompt": "Oblicz odciętą środka $a=-\\dfrac{D}{2}$.",
        "kind": "input",
        "acceptedAnswers": ["3"],
        "reveal": "$a=-\\dfrac{-6}{2}=3$.",
        "formula": "a=3"
      },
      {
        "prompt": "Oblicz rzędną środka $b=-\\dfrac{E}{2}$.",
        "kind": "input",
        "acceptedAnswers": ["-2"],
        "reveal": "$b=-\\dfrac{4}{2}=-2$.",
        "formula": "b=-2"
      },
      {
        "prompt": "Oblicz promień $r=\\sqrt{a^2+b^2-F}$.",
        "kind": "input",
        "acceptedAnswers": ["4"],
        "reveal": "$r=\\sqrt{3^2+(-2)^2-(-3)}=\\sqrt{9+4+3}=\\sqrt{16}=4$.",
        "formula": "r=\\sqrt{16}=4"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Okrąg o równaniu $x^2+y^2+2x-8=0$ ma promień równy:",
    "options": ["$3$", "$9$", "$1$", "$8$"],
    "correctIndex": 0,
    "explanation": "$D=2,\\ E=0,\\ F=-8$, więc $a=-1$, $b=0$, $r=\\sqrt{1+0+8}=\\sqrt9=3$."
  },
  {
    "type": "definition",
    "term": "Wzajemne położenie prostej i okręgu",
    "text": "Aby zbadać, ile punktów wspólnych ma prosta z okręgiem, wystarczy porównać odległość środka okręgu od tej prostej z długością promienia — nie trzeba w tym celu rozwiązywać układu równań.",
    "formula": "d(S,l)<r:\\ \\text{sieczna}\\qquad d(S,l)=r:\\ \\text{styczna}\\qquad d(S,l)>r:\\ \\text{rozłączne}"
  },
  {
    "type": "table",
    "title": "Wzajemne położenie prostej i okręgu — podsumowanie",
    "headers": ["Warunek", "Liczba punktów wspólnych", "Nazwa"],
    "rows": [
      ["$d(S,l)<r$", "2", "prosta sieczna"],
      ["$d(S,l)=r$", "1", "prosta styczna"],
      ["$d(S,l)>r$", "0", "proste rozłączne"]
    ]
  },
  {
    "type": "examples",
    "title": "Badanie położenia prostej względem okręgu",
    "items": [
      {
        "problem": "\\text{Okrąg: } x^2+y^2=25 \\ (S=(0,0),\\ r=5), \\quad l:\\ 3x+4y-25=0. \\ \\text{Zbadaj wzajemne położenie}",
        "steps": [
          {"text": "Obliczamy odległość środka S od prostej l.", "formula": "d(S,l)=\\frac{|3\\cdot0+4\\cdot0-25|}{\\sqrt{3^2+4^2}}=\\frac{25}{5}"},
          {"text": "Porównujemy z promieniem.", "formula": "d(S,l)=5=r"}
        ],
        "answer": "\\text{Prosta } l \\text{ jest styczna do okręgu}"
      },
      {
        "problem": "\\text{Okrąg: } (x-1)^2+(y-2)^2=4 \\ (S=(1,2),\\ r=2), \\quad l:\\ y=5. \\ \\text{Zbadaj wzajemne położenie}",
        "steps": [
          {"text": "Zapisujemy prostą w postaci ogólnej.", "formula": "l:\\ y-5=0"},
          {"text": "Obliczamy odległość środka od prostej.", "formula": "d(S,l)=\\frac{|1\\cdot2-5|}{\\sqrt{0^2+1^2}}=\\frac{3}{1}=3"}
        ],
        "answer": "\\text{Prosta } l \\text{ i okrąg są rozłączne} \\ (3>2=r)"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Odległość środka okręgu od prostej wynosi $d=6$, a promień okręgu wynosi $r=6$. Prosta i okrąg są:",
    "options": ["styczne (1 punkt wspólny)", "sieczne (2 punkty wspólne)", "rozłączne (0 punktów wspólnych)", "nie da się tego stwierdzić"],
    "correctIndex": 0,
    "explanation": "Skoro $d=r$, prosta jest styczna do okręgu — mają dokładnie jeden punkt wspólny."
  },
  {
    "type": "definition",
    "term": "Wzajemne położenie dwóch okręgów",
    "text": "Wzajemne położenie dwóch okręgów o środkach $O_1,\\ O_2$ i promieniach $r_1,\\ r_2$ zależy wyłącznie od odległości między środkami $d=|O_1O_2|$ w porównaniu z sumą i różnicą promieni tych okręgów.",
    "formula": "d=|O_1O_2|"
  },
  {
    "type": "table",
    "title": "Wzajemne położenie dwóch okręgów — podsumowanie",
    "headers": ["Warunek", "Położenie okręgów", "Liczba punktów wspólnych"],
    "rows": [
      ["$d>r_1+r_2$", "rozłączne zewnętrznie", "0"],
      ["$d=r_1+r_2$", "styczne zewnętrznie", "1"],
      ["$|r_1-r_2|<d<r_1+r_2$", "przecinające się", "2"],
      ["$d=|r_1-r_2|$ (dla $r_1\\neq r_2$)", "styczne wewnętrznie", "1"],
      ["$d<|r_1-r_2|$", "jeden okrąg wewnątrz drugiego", "0"]
    ]
  },
  {
    "type": "reveal-steps",
    "title": "Badanie wzajemnego położenia dwóch okręgów",
    "problem": "Dane są okręgi o środkach $O_1=(0,0)$, $r_1=3$ oraz $O_2=(8,0)$, $r_2=2$. Zbadaj ich wzajemne położenie.",
    "steps": [
      {
        "prompt": "Oblicz odległość między środkami okręgów.",
        "kind": "input",
        "acceptedAnswers": ["8"],
        "reveal": "$d=|O_1O_2|=\\sqrt{(8-0)^2+(0-0)^2}=8$.",
        "formula": "d=8"
      },
      {
        "prompt": "Oblicz sumę promieni $r_1+r_2$.",
        "kind": "input",
        "acceptedAnswers": ["5"],
        "reveal": "$r_1+r_2=3+2=5$.",
        "formula": "r_1+r_2=5"
      },
      {
        "prompt": "Porównaj $d$ z $r_1+r_2$ i określ wzajemne położenie okręgów.",
        "kind": "choice",
        "options": ["rozłączne zewnętrznie, bo $d>r_1+r_2$", "styczne zewnętrznie, bo $d=r_1+r_2$", "przecinające się, bo $d<r_1+r_2$"],
        "correctIndex": 0,
        "reveal": "Ponieważ $d=8>5=r_1+r_2$, okręgi są rozłączne zewnętrznie — nie mają punktów wspólnych."
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Okręgi mają promienie $r_1=7$ i $r_2=3$, a odległość między ich środkami wynosi $d=4$. Te okręgi są:",
    "options": ["styczne wewnętrznie", "rozłączne zewnętrznie", "przecinające się w dwóch punktach", "styczne zewnętrznie"],
    "correctIndex": 0,
    "explanation": "$|r_1-r_2|=|7-3|=4=d$, a promienie są różne — to warunek styczności wewnętrznej."
  },
  {
    "type": "definition",
    "term": "Pole trójkąta z współrzędnych wierzchołków",
    "text": "Pole trójkąta o wierzchołkach danych współrzędnymi można obliczyć bezpośrednio ze wzoru wyznacznikowego, bez wyznaczania długości boków ani wysokości.",
    "formula": "P=\\frac12\\left|x_A(y_B-y_C)+x_B(y_C-y_A)+x_C(y_A-y_B)\\right|"
  },
  {
    "type": "geometry",
    "title": "Pole trójkąta z współrzędnych — sprawdź na żywo",
    "caption": "Przeciągaj wierzchołki trójkąta ABC i obserwuj, jak jego pole (obliczane właśnie ze wzoru wyznacznikowego z współrzędnych) zmienia się razem z obwodem.",
    "shape": {
      "points": [
        {"id": "A", "x": 15, "y": 80, "label": "A", "draggable": true},
        {"id": "B", "x": 80, "y": 80, "label": "B", "draggable": true},
        {"id": "C", "x": 45, "y": 20, "label": "C", "draggable": true}
      ],
      "edges": [["A", "B"], ["B", "C"], ["C", "A"]],
      "measures": [
        {"kind": "area", "label": "Pole trójkąta ABC"},
        {"kind": "perimeter", "label": "Obwód trójkąta ABC"}
      ]
    }
  },
  {
    "type": "examples",
    "title": "Obliczanie pola trójkąta z współrzędnych",
    "items": [
      {
        "problem": "A=(0,0),\\ B=(6,0),\\ C=(2,5). \\ \\text{Oblicz pole trójkąta } ABC",
        "steps": [
          {"text": "Podstawiamy współrzędne do wzoru wyznacznikowego.", "formula": "P=\\frac12|0\\cdot(0-5)+6\\cdot(5-0)+2\\cdot(0-0)|"},
          {"text": "Obliczamy wyrażenie w module.", "formula": "P=\\frac12|0+30+0|=\\frac12\\cdot30"}
        ],
        "answer": "P=15"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Pole trójkąta o wierzchołkach $A=(0,0)$, $B=(4,0)$, $C=(0,3)$ wynosi:",
    "options": ["$6$", "$12$", "$3.5$", "$7$"],
    "correctIndex": 0,
    "explanation": "Trójkąt jest prostokątny o przyprostokątnych $4$ i $3$: $P=\\frac12\\cdot4\\cdot3=6$."
  },
  {
    "type": "reveal-steps",
    "title": "Pole trójkąta z wyznacznika — krok po kroku",
    "problem": "Dane są punkty $A=(1,1)$, $B=(5,1)$, $C=(3,7)$. Oblicz pole trójkąta $ABC$.",
    "steps": [
      {
        "prompt": "Podstaw współrzędne do wzoru wyznacznikowego i oblicz wartość wyrażenia pod modułem.",
        "kind": "input",
        "acceptedAnswers": ["24"],
        "reveal": "$1\\cdot(1-7)+5\\cdot(7-1)+3\\cdot(1-1)=-6+30+0=24$.",
        "formula": "-6+30+0=24"
      },
      {
        "prompt": "Oblicz pole: połowa wartości bezwzględnej wyniku z poprzedniego kroku.",
        "kind": "input",
        "acceptedAnswers": ["12"],
        "reveal": "$P=\\frac12\\cdot|24|=12$.",
        "formula": "P=\\frac12\\cdot24=12"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Jeżeli trzy punkty A, B, C są współliniowe (leżą na jednej prostej), to pole trójkąta ABC obliczone ze wzoru wyznacznikowego wynosi:",
    "options": ["$0$", "$1$", "zależy od punktów", "nie da się obliczyć"],
    "correctIndex": 0,
    "explanation": "Współliniowe punkty nie tworzą trójkąta o dodatnim polu — wyrażenie pod modułem wzoru wyznacznikowego wynosi wtedy dokładnie zero."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli sprawnie zapisujesz równanie okręgu w postaci kanonicznej i ogólnej (i zamieniasz jedną na drugą przez uzupełnianie do pełnego kwadratu), potrafisz zbadać wzajemne położenie prostej i okręgu oraz dwóch okręgów, porównując odpowiednie odległości z promieniami, a także obliczasz pole trójkąta o danych współrzędnych wierzchołków ze wzoru wyznacznikowego."
  }
]$content4$::jsonb,
  3
);
