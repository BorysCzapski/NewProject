-- ============================================================================
-- supabase/seed/matma/02_lessons_funkcje.sql
-- Interactive lesson content (math_lessons) for the "funkcje" department:
-- Funkcje — własności ogólne (dziedzina, zbiór wartości, monotoniczność,
-- parzystość/nieparzystość, okresowość, złożenie funkcji, funkcja odwrotna)
-- oraz funkcja liniowa, kwadratowa, wielomianowa, wymierna, wykładnicza,
-- logarytmiczna, trygonometryczne.
-- content is a jsonb array of MathBlock (see lib/matma/lesson-blocks.ts).
--
-- Idempotent: deletes existing lessons for this topic first. Run
-- 01_topics.sql BEFORE this file — it looks up topic_id by slug.
-- ============================================================================

delete from math_lessons
where topic_id = (select id from math_topics where slug = 'funkcje');

-- ----------------------------------------------------------------------------
-- Lesson 1: Czym jest funkcja? Dziedzina i zbiór wartości
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'funkcje'),
  $title1$Czym jest funkcja? Dziedzina i zbiór wartości$title1$,
  $content1$[
  {
    "type": "basics-recap",
    "title": "Zanim zaczniesz: co to naprawdę jest funkcja?",
    "text": "Funkcja to reguła (przyporządkowanie), która każdemu elementowi $x$ ze zbioru zwanego dziedziną przypisuje dokładnie jedną wartość $y=f(x)$. Słowo „dokładnie jedną” jest kluczowe — to właśnie ono odróżnia funkcję od dowolnego, luźnego przyporządkowania. Argument to $x$ (zmienna niezależna, to, co „wkładamy” do funkcji), a wartość funkcji to $y=f(x)$ (to, co „wychodzi”). Wykres funkcji to zbiór wszystkich punktów $(x, f(x))$ narysowanych w układzie współrzędnych. Aby sprawdzić na wykresie, czy dana krzywa faktycznie jest wykresem jakiejś funkcji, stosujemy test pionowej prostej: jeśli każda prosta pionowa $x=\\text{const}$ przecina krzywą co najwyżej raz, to jest to wykres funkcji.",
    "formula": "f\\colon x \\mapsto y = f(x)",
    "controlQuiz": [
      {
        "question": "Który warunek MUSI spełniać przyporządkowanie, aby było funkcją?",
        "options": [
          "Każdemu $x$ przypisana jest dokładnie jedna wartość $y$",
          "Każdemu $y$ przypisany jest dokładnie jeden $x$",
          "Wykres musi przechodzić przez początek układu współrzędnych",
          "Dziedzina musi być zbiorem liczb dodatnich"
        ],
        "correctIndex": 0,
        "explanation": "Definicja funkcji wymaga tylko jednego: każdemu argumentowi $x$ musi odpowiadać dokładnie jedna wartość $y$."
      },
      {
        "question": "Na wykresie funkcji punkt $(2,5)$ oznacza, że:",
        "options": [
          "$f(5)=2$",
          "$f(2)=5$",
          "dziedzina zawiera liczbę $5$",
          "zbiór wartości zawiera liczby $2$ i $5$"
        ],
        "correctIndex": 1,
        "explanation": "Punkt $(x,y)$ na wykresie funkcji oznacza, że dla argumentu $x$ wartość funkcji wynosi $y$, czyli $f(2)=5$."
      },
      {
        "question": "Test pionowej prostej służy do sprawdzenia, czy:",
        "options": [
          "Krzywa na płaszczyźnie jest wykresem funkcji",
          "Funkcja jest rosnąca",
          "Funkcja ma miejsca zerowe",
          "Funkcja jest okresowa"
        ],
        "correctIndex": 0,
        "explanation": "Jeśli każda prosta pionowa $x=\\text{const}$ przecina krzywą co najwyżej raz, krzywa jest wykresem pewnej funkcji."
      }
    ]
  },
  {
    "type": "definition",
    "term": "Dziedzina funkcji ($D_f$)",
    "text": "Dziedziną funkcji nazywamy zbiór wszystkich argumentów $x$, dla których funkcja jest określona, czyli przyjmuje jakąś wartość liczbową. Jeśli funkcja dana jest wzorem bez dodatkowo podanej dziedziny, przyjmujemy tzw. dziedzinę naturalną — zbiór wszystkich liczb rzeczywistych, dla których wzór ma sens.",
    "formula": "D_f \\subseteq \\mathbb{R}"
  },
  {
    "type": "table",
    "title": "Kiedy zawężamy dziedzinę naturalną?",
    "caption": "To trzy najczęstsze sytuacje na maturze — zawsze warto sprawdzić wzór pod tym kątem, zanim zaczniesz cokolwiek przekształcać.",
    "headers": [
      "Sytuacja we wzorze",
      "Warunek na $x$"
    ],
    "rows": [
      [
        "Mianownik: $\\dfrac{1}{x-a}$",
        "$x-a\\neq0$"
      ],
      [
        "Pierwiastek stopnia parzystego: $\\sqrt{g(x)}$",
        "$g(x)\\ge0$"
      ],
      [
        "Logarytm: $\\log_b g(x)$",
        "$g(x)>0$"
      ],
      [
        "Pierwiastek w mianowniku: $\\dfrac{1}{\\sqrt{g(x)}}$",
        "$g(x)>0$"
      ]
    ]
  },
  {
    "type": "examples",
    "title": "Wyznaczanie dziedziny funkcji",
    "items": [
      {
        "problem": "f(x) = \\dfrac{x+1}{x-3}",
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
        "answer": "D_f = \\mathbb{R}\\setminus\\{3\\}"
      },
      {
        "problem": "f(x) = \\sqrt{x-2}",
        "steps": [
          {
            "text": "Wyrażenie pod pierwiastkiem parzystego stopnia musi być nieujemne.",
            "formula": "x-2\\ge0"
          },
          {
            "text": "Rozwiązujemy warunek.",
            "formula": "x\\ge2"
          }
        ],
        "answer": "D_f=[2,\\infty)"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Jaka jest dziedzina funkcji $f(x)=\\dfrac{5}{x+4}$?",
    "options": [
      "$x\\neq-4$",
      "$x\\neq4$",
      "$x\\ge-4$",
      "$x\\in\\mathbb{R}$"
    ],
    "correctIndex": 0,
    "explanation": "Mianownik nie może być zerem: $x+4\\neq0$, czyli $x\\neq-4$."
  },
  {
    "type": "reveal-steps",
    "title": "Dziedzina funkcji z pierwiastkiem i mianownikiem",
    "problem": "Wyznacz dziedzinę funkcji $f(x)=\\dfrac{1}{\\sqrt{x-1}}$",
    "steps": [
      {
        "prompt": "Jaki warunek musi spełniać wyrażenie pod pierwiastkiem, skoro pierwiastek stoi jednocześnie w mianowniku?",
        "kind": "choice",
        "options": [
          "$x-1\\ge0$",
          "$x-1>0$",
          "$x-1\\neq0$",
          "$x-1<0$"
        ],
        "correctIndex": 1,
        "reveal": "Ponieważ pierwiastek stoi w mianowniku, nie może być równy zeru — wyrażenie pod nim musi więc być ściśle dodatnie.",
        "formula": "x-1>0"
      },
      {
        "prompt": "Rozwiąż nierówność $x-1>0$.",
        "kind": "input",
        "acceptedAnswers": [
          "x>1"
        ],
        "reveal": "$x-1>0 \\iff x>1$."
      },
      {
        "prompt": "Zapisz dziedzinę w postaci przedziału.",
        "kind": "choice",
        "options": [
          "$(1,\\infty)$",
          "$[1,\\infty)$",
          "$(-\\infty,1)$",
          "$(-\\infty,1]$"
        ],
        "correctIndex": 0,
        "reveal": "Dziedziną jest przedział otwarty — $x=1$ nie należy do dziedziny, bo wtedy mianownik byłby równy zeru.",
        "formula": "D_f=(1,\\infty)"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Dla jakich $x$ istnieje funkcja $f(x)=\\log_3(x+2)$?",
    "options": [
      "$x>-2$",
      "$x\\ge-2$",
      "$x>2$",
      "$x\\neq-2$"
    ],
    "correctIndex": 0,
    "explanation": "Argument logarytmu musi być dodatni: $x+2>0$, czyli $x>-2$."
  },
  {
    "type": "definition",
    "term": "Zbiór wartości funkcji ($ZW_f$)",
    "text": "Zbiorem wartości funkcji nazywamy zbiór wszystkich liczb $y$, jakie funkcja rzeczywiście przyjmuje dla argumentów należących do dziedziny. Z wykresu odczytujemy go, rzutując wykres na oś $OY$ — to zbiór wszystkich „wysokości”, na jakich wykres się pojawia.",
    "formula": "ZW_f = \\{f(x) : x\\in D_f\\}"
  },
  {
    "type": "examples",
    "title": "Odczytywanie zbioru wartości",
    "items": [
      {
        "problem": "f(x) = x^2, \\quad x\\in\\mathbb{R}",
        "steps": [
          {
            "text": "Kwadrat dowolnej liczby rzeczywistej jest zawsze nieujemny.",
            "formula": "x^2\\ge0"
          },
          {
            "text": "Każda liczba nieujemna jest osiągana (np. $x=\\sqrt{y}$), więc zbiorem wartości jest cała półprosta.",
            "formula": "ZW_f=[0,\\infty)"
          }
        ],
        "answer": "ZW_f=[0,\\infty)"
      },
      {
        "problem": "f(x) = -x^2+3",
        "steps": [
          {
            "text": "Wyrażenie $-x^2$ przyjmuje wartości niedodatnie, z maksimum $0$ dla $x=0$.",
            "formula": "-x^2\\le0"
          },
          {
            "text": "Dodając $3$, otrzymujemy maksimum funkcji równe $3$, a dalej wartości maleją do $-\\infty$.",
            "formula": "f(x)\\le3"
          }
        ],
        "answer": "ZW_f=(-\\infty,3]"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Funkcja $f(x)=\\sqrt{x}$ ma zbiór wartości równy:",
    "options": [
      "$[0,\\infty)$",
      "$(-\\infty,\\infty)$",
      "$(0,\\infty)$",
      "$[0,1]$"
    ],
    "correctIndex": 0,
    "explanation": "Pierwiastek arytmetyczny jest zawsze nieujemny i przyjmuje każdą wartość nieujemną, więc $ZW_f=[0,\\infty)$."
  },
  {
    "type": "function-plot",
    "title": "Zobacz, jak zmienia się dziedzina i zbiór wartości",
    "caption": "Przesuwaj suwaki $a$ i $b$ funkcji $f(x)=\\sqrt{x-a}+b$. Zauważ, że dziedziną zawsze jest $x\\ge a$ (dla $x<a$ wykres po prostu się nie pojawia), a zbiorem wartości $y\\ge b$ — wykres zaczyna się dokładnie w punkcie $(a,b)$.",
    "expression": "Math.sqrt(x - a) + b",
    "params": [
      {
        "symbol": "a",
        "label": "Przesunięcie w poziomie (próg dziedziny)",
        "min": -4,
        "max": 4,
        "step": 1,
        "default": 0
      },
      {
        "symbol": "b",
        "label": "Przesunięcie w pionie (próg zbioru wartości)",
        "min": -4,
        "max": 4,
        "step": 1,
        "default": 0
      }
    ],
    "domain": [-5, 8]
  },
  {
    "type": "quiz",
    "question": "Dla funkcji $f(x)=\\sqrt{x+3}-2$, jaka jest dziedzina i zbiór wartości?",
    "options": [
      "$D_f=[-3,\\infty)$, $ZW_f=[-2,\\infty)$",
      "$D_f=[3,\\infty)$, $ZW_f=[2,\\infty)$",
      "$D_f=(-\\infty,-3]$, $ZW_f=(-\\infty,-2]$",
      "$D_f=[-3,\\infty)$, $ZW_f=[2,\\infty)$"
    ],
    "correctIndex": 0,
    "explanation": "Wyrażenie pod pierwiastkiem: $x+3\\ge0$, czyli $x\\ge-3$, więc $D_f=[-3,\\infty)$. Pierwiastek jest zawsze $\\ge0$, po odjęciu $2$ najmniejsza możliwa wartość to $-2$, więc $ZW_f=[-2,\\infty)$."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli rozumiesz, że funkcja przypisuje każdemu argumentowi dokładnie jedną wartość, sprawnie wyznaczasz dziedzinę naturalną (pilnując mianowników, pierwiastków parzystego stopnia i logarytmów) oraz potrafisz odczytać lub wyznaczyć zbiór wartości funkcji z jej wzoru lub wykresu. To fundament, na którym oprze się reszta działu."
  }
]$content1$::jsonb,
  0
);

-- ----------------------------------------------------------------------------
-- Lesson 2: Monotoniczność, parzystość i okresowość funkcji
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'funkcje'),
  $title2$Monotoniczność, parzystość i okresowość funkcji$title2$,
  $content2$[
  {
    "type": "intro",
    "text": "W tej lekcji poznasz trzy własności, które pozwalają szybko opisać zachowanie wykresu funkcji: monotoniczność (czy funkcja rośnie, czy maleje), parzystość/nieparzystość (symetria wykresu) oraz okresowość (czy wykres się powtarza). Regularnie pojawiają się one w zadaniach maturalnych, często jako pytania „na uzasadnienie”, bez rysowania wykresu."
  },
  {
    "type": "definition",
    "term": "Funkcja rosnąca i malejąca",
    "text": "Funkcja $f$ jest rosnąca w przedziale, jeśli dla dowolnych argumentów $x_1<x_2$ z tego przedziału zachodzi $f(x_1)<f(x_2)$ — czyli wraz ze wzrostem argumentu rośnie też wartość funkcji. Funkcja jest malejąca, gdy większemu argumentowi zawsze odpowiada mniejsza wartość.",
    "formula": "x_1<x_2 \\implies f(x_1)<f(x_2) \\quad \\text{(funkcja rosnąca)}"
  },
  {
    "type": "table",
    "title": "Rodzaje monotoniczności",
    "headers": [
      "Rodzaj",
      "Warunek dla $x_1<x_2$"
    ],
    "rows": [
      [
        "rosnąca",
        "$f(x_1)<f(x_2)$"
      ],
      [
        "malejąca",
        "$f(x_1)>f(x_2)$"
      ],
      [
        "nierosnąca",
        "$f(x_1)\\ge f(x_2)$"
      ],
      [
        "niemalejąca",
        "$f(x_1)\\le f(x_2)$"
      ],
      [
        "stała",
        "$f(x_1)=f(x_2)$"
      ]
    ]
  },
  {
    "type": "quiz",
    "question": "Funkcja jest malejąca w przedziale, jeśli dla $x_1<x_2$ z tego przedziału zachodzi:",
    "options": [
      "$f(x_1)>f(x_2)$",
      "$f(x_1)<f(x_2)$",
      "$f(x_1)=f(x_2)$",
      "$f(x_1)\\ge f(x_2)$"
    ],
    "correctIndex": 0,
    "explanation": "Malejąca oznacza, że większemu argumentowi odpowiada mniejsza wartość funkcji: $f(x_1)>f(x_2)$."
  },
  {
    "type": "examples",
    "title": "Odczytywanie przedziałów monotoniczności z wykresu paraboli",
    "items": [
      {
        "problem": "f(x) = (x-2)^2, \\quad x\\in\\mathbb{R}",
        "steps": [
          {
            "text": "Wierzchołek paraboli znajduje się w punkcie $x=2$ — to tam funkcja zmienia kierunek.",
            "formula": "x=2"
          },
          {
            "text": "Dla argumentów mniejszych od $2$ funkcja maleje.",
            "formula": "(-\\infty,2] \\text{ — funkcja malejąca}"
          },
          {
            "text": "Dla argumentów większych od $2$ funkcja rośnie.",
            "formula": "[2,\\infty) \\text{ — funkcja rosnąca}"
          }
        ],
        "answer": "malejąca\\ w\\ (-\\infty,2],\\ rosnąca\\ w\\ [2,\\infty)"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Funkcja liniowa $f(x)=-3x+7$ jest:",
    "options": [
      "malejąca w całej dziedzinie",
      "rosnąca w całej dziedzinie",
      "stała",
      "rosnąca dla $x<0$, malejąca dla $x>0$"
    ],
    "correctIndex": 0,
    "explanation": "Współczynnik kierunkowy $a=-3<0$, więc funkcja liniowa jest malejąca w całej dziedzinie."
  },
  {
    "type": "definition",
    "term": "Funkcja parzysta i nieparzysta",
    "text": "Funkcja $f$ o dziedzinie symetrycznej względem zera jest parzysta, jeśli dla każdego $x$ z dziedziny zachodzi $f(-x)=f(x)$ — jej wykres jest wtedy symetryczny względem osi $OY$. Jest nieparzysta, jeśli $f(-x)=-f(x)$ dla każdego $x$ z dziedziny — jej wykres jest symetryczny względem początku układu współrzędnych. Większość funkcji nie jest ani parzysta, ani nieparzysta.",
    "formula": "f(-x)=f(x) \\text{ (parzysta)}, \\qquad f(-x)=-f(x) \\text{ (nieparzysta)}"
  },
  {
    "type": "reveal-steps",
    "title": "Sprawdzanie parzystości funkcji",
    "problem": "Sprawdź, czy funkcja $f(x)=x^4-2x^2$ jest parzysta, nieparzysta, czy żadna z nich.",
    "steps": [
      {
        "prompt": "Oblicz $f(-x)$, podstawiając $-x$ za $x$ we wzorze.",
        "kind": "input",
        "acceptedAnswers": [
          "x^4-2x^2",
          "(-x)^4-2(-x)^2"
        ],
        "reveal": "$f(-x)=(-x)^4-2(-x)^2=x^4-2x^2$.",
        "formula": "f(-x)=(-x)^4-2(-x)^2=x^4-2x^2"
      },
      {
        "prompt": "Porównaj $f(-x)$ z $f(x)$: czy są sobie równe?",
        "kind": "choice",
        "options": [
          "Tak, $f(-x)=f(x)$",
          "Nie, $f(-x)=-f(x)$",
          "Nie, $f(-x)$ nie jest równe ani $f(x)$, ani $-f(x)$"
        ],
        "correctIndex": 0,
        "reveal": "$f(-x)=x^4-2x^2=f(x)$ dla każdego $x$, więc warunek parzystości jest spełniony."
      },
      {
        "prompt": "Jaki wniosek o funkcji $f(x)=x^4-2x^2$?",
        "kind": "choice",
        "options": [
          "Funkcja jest parzysta",
          "Funkcja jest nieparzysta",
          "Funkcja nie jest ani parzysta, ani nieparzysta"
        ],
        "correctIndex": 0,
        "reveal": "Ponieważ $f(-x)=f(x)$ dla każdego $x$ z dziedziny, funkcja $f(x)=x^4-2x^2$ jest parzysta — jej wykres jest symetryczny względem osi $OY$."
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Funkcja $f(x)=x^3$ jest:",
    "options": [
      "nieparzysta, bo $f(-x)=-x^3=-f(x)$",
      "parzysta, bo $f(-x)=f(x)$",
      "ani parzysta, ani nieparzysta",
      "stała"
    ],
    "correctIndex": 0,
    "explanation": "$f(-x)=(-x)^3=-x^3=-f(x)$ dla każdego $x$, więc funkcja jest nieparzysta."
  },
  {
    "type": "definition",
    "term": "Funkcja okresowa",
    "text": "Funkcja $f$ jest okresowa, jeśli istnieje liczba $T>0$ (okres) taka, że dla każdego $x$ z dziedziny liczby $x+T$ i $x-T$ też należą do dziedziny oraz $f(x+T)=f(x)$. Najmniejszą taką dodatnią liczbę $T$ nazywamy okresem podstawowym. Klasycznym przykładem funkcji okresowych są funkcje trygonometryczne.",
    "formula": "f(x+T) = f(x) \\text{ dla każdego } x, \\qquad T>0"
  },
  {
    "type": "function-plot",
    "title": "Okresowość funkcji sinus",
    "caption": "Suwak $a$ zmienia amplitudę, $b$ zmienia częstość (im większe $b$, tym krótszy okres), a $c$ przesuwa wykres w pionie. Niezależnie od suwaków wykres zawsze się powtarza — to właśnie okresowość.",
    "expression": "a * Math.sin(b * x) + c",
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
        "label": "Częstość (wpływa na okres)",
        "min": 0.5,
        "max": 3,
        "step": 0.5,
        "default": 1
      },
      {
        "symbol": "c",
        "label": "Przesunięcie pionowe",
        "min": -2,
        "max": 2,
        "step": 0.5,
        "default": 0
      }
    ],
    "domain": [-6.28, 6.28]
  },
  {
    "type": "formula",
    "title": "Okres funkcji $f(x)=\\sin(bx)$ oraz $f(x)=\\cos(bx)$",
    "expression": "T = \\dfrac{2\\pi}{|b|}",
    "variables": [
      {
        "symbol": "b",
        "meaning": "częstość — mnożnik przy x wewnątrz sinusa lub kosinusa"
      },
      {
        "symbol": "T",
        "meaning": "okres podstawowy funkcji"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Jaki jest okres podstawowy funkcji $f(x)=\\sin(2x)$?",
    "options": [
      "$\\pi$",
      "$2\\pi$",
      "$4\\pi$",
      "$\\dfrac{\\pi}{2}$"
    ],
    "correctIndex": 0,
    "explanation": "Dla $f(x)=\\sin(bx)$ okres podstawowy wynosi $T=\\dfrac{2\\pi}{|b|}$. Tutaj $b=2$, więc $T=\\dfrac{2\\pi}{2}=\\pi$."
  },
  {
    "type": "examples",
    "title": "Łączenie własności: monotoniczność, parzystość, okresowość",
    "items": [
      {
        "problem": "f(x) = \\cos x, \\quad x \\in \\mathbb{R}",
        "steps": [
          {
            "text": "Sprawdzamy parzystość: $\\cos(-x)=\\cos x$.",
            "formula": "f(-x)=\\cos(-x)=\\cos x=f(x)"
          },
          {
            "text": "Funkcja kosinus jest więc parzysta — jej wykres jest symetryczny względem osi $OY$."
          },
          {
            "text": "Funkcja kosinus jest okresowa z okresem podstawowym $T=2\\pi$.",
            "formula": "T=2\\pi"
          }
        ],
        "answer": "parzysta,\\ okresowa\\ z\\ T=2\\pi"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Jeśli wykres funkcji jest symetryczny względem początku układu współrzędnych, to funkcja jest:",
    "options": [
      "nieparzysta",
      "parzysta",
      "rosnąca",
      "okresowa"
    ],
    "correctIndex": 0,
    "explanation": "Symetria względem początku układu współrzędnych (punktu $(0,0)$) to definicja funkcji nieparzystej."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli sprawnie rozpoznajesz i uzasadniasz przedziały monotoniczności funkcji, potrafisz algebraicznie sprawdzić parzystość/nieparzystość funkcji, badając $f(-x)$, oraz rozumiesz, co oznacza okres funkcji i potrafisz go odczytać ze wzoru typu $\\sin(bx)$ lub $\\cos(bx)$."
  }
]$content2$::jsonb,
  1
);

-- ----------------------------------------------------------------------------
-- Lesson 3: Złożenie funkcji i funkcja odwrotna
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'funkcje'),
  $title3$Złożenie funkcji i funkcja odwrotna$title3$,
  $content3$[
  {
    "type": "intro",
    "text": "W tej lekcji nauczysz się łączyć dwie funkcje w jedną (złożenie funkcji) oraz „odwracać” funkcję, czyli budować funkcję, która cofa jej działanie (funkcja odwrotna). Obie operacje są ważne — złożenie funkcji pojawia się np. przy funkcji wykładniczej i logarytmicznej, a funkcja odwrotna tłumaczy, dlaczego logarytmowanie i potęgowanie „się znoszą”."
  },
  {
    "type": "definition",
    "term": "Złożenie funkcji",
    "text": "Złożeniem funkcji $f$ i $g$ (w tej kolejności: najpierw $g$, potem $f$) nazywamy funkcję $f\\circ g$ określoną wzorem $(f\\circ g)(x)=f(g(x))$. Aby złożenie istniało dla danego $x$, argument $x$ musi należeć do dziedziny $g$, a wartość $g(x)$ musi należeć do dziedziny $f$. Kolejność ma znaczenie: na ogół $f\\circ g \\neq g\\circ f$.",
    "formula": "(f\\circ g)(x) = f(g(x))"
  },
  {
    "type": "examples",
    "title": "Obliczanie złożenia funkcji",
    "items": [
      {
        "problem": "f(x)=x^2, \\ \\ g(x)=x+3. \\ \\text{Wyznacz } (f\\circ g)(x)",
        "steps": [
          {
            "text": "Złożenie $(f\\circ g)(x)$ oznacza $f(g(x))$ — najpierw liczymy $g(x)$, potem wstawiamy wynik do $f$.",
            "formula": "(f\\circ g)(x)=f(g(x))=f(x+3)"
          },
          {
            "text": "Podstawiamy $x+3$ w miejsce argumentu funkcji $f$.",
            "formula": "f(x+3)=(x+3)^2"
          }
        ],
        "answer": "(f\\circ g)(x)=(x+3)^2"
      },
      {
        "problem": "f(x)=x^2, \\ \\ g(x)=x+3. \\ \\text{Wyznacz } (g\\circ f)(x)",
        "steps": [
          {
            "text": "Tym razem najpierw liczymy $f(x)$, potem wstawiamy do $g$.",
            "formula": "(g\\circ f)(x)=g(f(x))=g(x^2)"
          },
          {
            "text": "Podstawiamy $x^2$ w miejsce argumentu funkcji $g$.",
            "formula": "g(x^2)=x^2+3"
          }
        ],
        "answer": "(g\\circ f)(x)=x^2+3"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Dla $f(x)=2x$ i $g(x)=x-1$, ile wynosi $(f\\circ g)(4)$?",
    "options": [
      "$6$",
      "$7$",
      "$8$",
      "$3$"
    ],
    "correctIndex": 0,
    "explanation": "$(f\\circ g)(4)=f(g(4))=f(3)=2\\cdot3=6$."
  },
  {
    "type": "reveal-steps",
    "title": "Krok po kroku: złożenie funkcji",
    "problem": "Dla $f(x)=\\sqrt{x}$ oraz $g(x)=x^2+1$, oblicz $(f\\circ g)(3)$.",
    "steps": [
      {
        "prompt": "Który wzór stosujemy jako pierwszy: $f$ czy $g$?",
        "kind": "choice",
        "options": [
          "Najpierw $g$, potem $f$",
          "Najpierw $f$, potem $g$",
          "Nie ma znaczenia, w jakiej kolejności"
        ],
        "correctIndex": 0,
        "reveal": "Zapis $f\\circ g$ oznacza $f(g(x))$ — działanie wewnętrzne ($g$) wykonujemy jako pierwsze."
      },
      {
        "prompt": "Oblicz $g(3)$.",
        "kind": "input",
        "acceptedAnswers": [
          "10"
        ],
        "reveal": "$g(3)=3^2+1=9+1=10$.",
        "formula": "g(3)=3^2+1=10"
      },
      {
        "prompt": "Oblicz $f(10)$, czyli wynik $(f\\circ g)(3)$.",
        "kind": "input",
        "acceptedAnswers": [
          "\\sqrt{10}",
          "sqrt(10)",
          "√10"
        ],
        "reveal": "$(f\\circ g)(3)=f(10)=\\sqrt{10}$.",
        "formula": "(f\\circ g)(3)=\\sqrt{10}"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Dla $f(x)=x+1$ i $g(x)=x^2$, wzór funkcji $(g\\circ f)(x)$ to:",
    "options": [
      "$(x+1)^2$",
      "$x^2+1$",
      "$x^2+2x$",
      "$x+1$"
    ],
    "correctIndex": 0,
    "explanation": "$(g\\circ f)(x)=g(f(x))=g(x+1)=(x+1)^2$."
  },
  {
    "type": "definition",
    "term": "Funkcja różnowartościowa (injekcja)",
    "text": "Funkcja $f$ jest różnowartościowa, jeśli różnym argumentom zawsze odpowiadają różne wartości — żadna wartość nie jest osiągana dwukrotnie. Na wykresie sprawdzamy to testem poziomej prostej: jeśli każda prosta pozioma $y=\\text{const}$ przecina wykres co najwyżej raz, funkcja jest różnowartościowa. To właśnie warunek konieczny istnienia funkcji odwrotnej.",
    "formula": "x_1\\neq x_2 \\implies f(x_1)\\neq f(x_2)"
  },
  {
    "type": "quiz",
    "question": "Czy funkcja $f(x)=x^2$ (w dziedzinie $\\mathbb{R}$) jest różnowartościowa?",
    "options": [
      "Nie, bo np. $f(-2)=f(2)=4$",
      "Tak, bo jest parzysta",
      "Tak, bo jest rosnąca",
      "Nie, bo nie ma miejsc zerowych"
    ],
    "correctIndex": 0,
    "explanation": "Funkcja $f(x)=x^2$ przyjmuje tę samą wartość dla przeciwnych argumentów, np. $f(-2)=f(2)=4$, więc w całej dziedzinie $\\mathbb{R}$ nie jest różnowartościowa."
  },
  {
    "type": "definition",
    "term": "Funkcja odwrotna",
    "text": "Jeśli funkcja $f$ jest różnowartościowa, to istnieje do niej funkcja odwrotna $f^{-1}$, która „cofa” działanie $f$: jeśli $f(a)=b$, to $f^{-1}(b)=a$. Wykres funkcji odwrotnej jest symetryczny do wykresu funkcji $f$ względem prostej $y=x$. Aby wyznaczyć wzór $f^{-1}$ dla funkcji danej jako $y=f(x)$, zamieniamy miejscami $x$ i $y$, a następnie wyznaczamy nowe $y$.",
    "formula": "f(a)=b \\iff f^{-1}(b)=a"
  },
  {
    "type": "reveal-steps",
    "title": "Wyznaczanie wzoru funkcji odwrotnej",
    "problem": "Wyznacz funkcję odwrotną do funkcji liniowej $f(x)=2x-6$.",
    "steps": [
      {
        "prompt": "Zapisz $y=f(x)$ i zamień miejscami $x$ i $y$. Co otrzymujemy?",
        "kind": "choice",
        "options": [
          "$x=2y-6$",
          "$y=2x-6$",
          "$x=2y+6$",
          "$y=\\dfrac{x}{2}-6$"
        ],
        "correctIndex": 0,
        "reveal": "Startujemy od $y=2x-6$ i zamieniamy $x$ z $y$: otrzymujemy $x=2y-6$."
      },
      {
        "prompt": "Wyznacz $y$ z równania $x=2y-6$.",
        "kind": "input",
        "acceptedAnswers": [
          "y=(x+6)/2",
          "y=x/2+3"
        ],
        "reveal": "$x=2y-6 \\implies x+6=2y \\implies y=\\dfrac{x+6}{2}=\\dfrac{x}{2}+3$.",
        "formula": "y=\\dfrac{x+6}{2}=\\dfrac{x}{2}+3"
      },
      {
        "prompt": "Jaki jest ostateczny wzór funkcji odwrotnej?",
        "kind": "choice",
        "options": [
          "$f^{-1}(x)=\\dfrac{x}{2}+3$",
          "$f^{-1}(x)=2x+6$",
          "$f^{-1}(x)=\\dfrac{x}{2}-3$",
          "$f^{-1}(x)=\\dfrac{x-6}{2}$"
        ],
        "correctIndex": 0,
        "reveal": "Funkcja odwrotna to $f^{-1}(x)=\\dfrac{x}{2}+3$. Sprawdzenie: $f^{-1}(f(x))=f^{-1}(2x-6)=\\dfrac{2x-6}{2}+3=x-3+3=x$ — zgadza się.",
        "formula": "f^{-1}(x)=\\dfrac{x}{2}+3"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Funkcją odwrotną do $f(x)=x+5$ jest:",
    "options": [
      "$f^{-1}(x)=x-5$",
      "$f^{-1}(x)=x+5$",
      "$f^{-1}(x)=-x-5$",
      "$f^{-1}(x)=\\dfrac{1}{x+5}$"
    ],
    "correctIndex": 0,
    "explanation": "Zamieniamy $x=y+5$ i wyznaczamy $y=x-5$, więc $f^{-1}(x)=x-5$."
  },
  {
    "type": "function-plot",
    "title": "Funkcja liniowa i jej symetria względem $y=x$",
    "caption": "Suwaki $a$ (współczynnik kierunkowy) i $b$ (wyraz wolny) zmieniają funkcję $f(x)=ax+b$. Dla $a\\neq0$ funkcja odwrotna to $f^{-1}(x)=\\dfrac{x-b}{a}$ — jej wykres byłby lustrzanym odbiciem tego wykresu względem prostej $y=x$.",
    "expression": "a * x + b",
    "params": [
      {
        "symbol": "a",
        "label": "Współczynnik kierunkowy",
        "min": -3,
        "max": 3,
        "step": 0.5,
        "default": 1
      },
      {
        "symbol": "b",
        "label": "Wyraz wolny",
        "min": -4,
        "max": 4,
        "step": 1,
        "default": 0
      }
    ],
    "domain": [-6, 6]
  },
  {
    "type": "table",
    "title": "Podsumowanie: złożenie i funkcja odwrotna",
    "headers": [
      "Pojęcie",
      "Kluczowa własność"
    ],
    "rows": [
      [
        "Złożenie $f\\circ g$",
        "$(f\\circ g)(x)=f(g(x))$ — kolejność ma znaczenie"
      ],
      [
        "Różnowartościowość",
        "różnym $x$ odpowiadają różne $f(x)$ — warunek istnienia $f^{-1}$"
      ],
      [
        "Funkcja odwrotna $f^{-1}$",
        "$f^{-1}(f(x))=x$ oraz $f(f^{-1}(x))=x$"
      ],
      [
        "Wykres $f^{-1}$",
        "symetryczny do wykresu $f$ względem prostej $y=x$"
      ]
    ]
  },
  {
    "type": "quiz",
    "question": "Wykres funkcji odwrotnej $f^{-1}$ powstaje z wykresu funkcji $f$ przez symetrię względem:",
    "options": [
      "prostej $y=x$",
      "osi $OX$",
      "osi $OY$",
      "początku układu współrzędnych"
    ],
    "correctIndex": 0,
    "explanation": "Wykres funkcji odwrotnej jest zawsze symetryczny do wykresu funkcji wyjściowej względem prostej $y=x$."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli sprawnie obliczasz $(f\\circ g)(x)$ i $(g\\circ f)(x)$ (pamiętając, że kolejność ma znaczenie), rozumiesz, że tylko funkcja różnowartościowa ma funkcję odwrotną, oraz potrafisz wyznaczyć wzór $f^{-1}$, zamieniając miejscami $x$ i $y$ i wyliczając nowe $y$."
  }
]$content3$::jsonb,
  2
);

-- ----------------------------------------------------------------------------
-- Lesson 4: Przegląd funkcji elementarnych
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'funkcje'),
  $title4$Przegląd funkcji elementarnych: liniowa, kwadratowa, wielomianowa, wymierna, wykładnicza, logarytmiczna, trygonometryczne$title4$,
  $content4$[
  {
    "type": "intro",
    "text": "W tej lekcji zobaczysz przegląd najważniejszych rodzajów funkcji z matury rozszerzonej: liniową, kwadratową, wielomianową, wymierną, wykładniczą, logarytmiczną oraz funkcje trygonometryczne. Dla każdej z nich poznasz wzór ogólny, dziedzinę, zbiór wartości oraz podstawowy kształt wykresu."
  },
  {
    "type": "definition",
    "term": "Funkcja liniowa",
    "text": "Funkcja liniowa dana jest wzorem $f(x)=ax+b$, gdzie $a,b\\in\\mathbb{R}$. Liczba $a$ to współczynnik kierunkowy (decyduje o monotoniczności: $a>0$ — rosnąca, $a<0$ — malejąca, $a=0$ — stała), a $b$ to wyraz wolny (rzędna punktu przecięcia z osią $OY$). Jej dziedziną i zbiorem wartości jest cały zbiór $\\mathbb{R}$ (gdy $a\\neq0$).",
    "formula": "f(x)=ax+b, \\qquad a,b\\in\\mathbb{R}"
  },
  {
    "type": "definition",
    "term": "Funkcja kwadratowa",
    "text": "Funkcja kwadratowa dana jest wzorem $f(x)=ax^2+bx+c$, gdzie $a\\neq0$. Jej wykresem jest parabola o wierzchołku $(p,q)$, gdzie $p=-\\dfrac{b}{2a}$, a $q=f(p)$. Dziedziną jest zawsze $\\mathbb{R}$. Zbiór wartości zależy od znaku $a$: dla $a>0$ (ramiona w górę) to $[q,\\infty)$, a dla $a<0$ (ramiona w dół) to $(-\\infty,q]$.",
    "formula": "f(x)=ax^2+bx+c=a(x-p)^2+q, \\qquad a\\neq0"
  },
  {
    "type": "quiz",
    "question": "Funkcja kwadratowa $f(x)=-2x^2+8x-3$ ma zbiór wartości (bez obliczania dokładnego wierzchołka — na podstawie samego znaku $a$):",
    "options": [
      "postaci $(-\\infty,q]$ dla pewnego $q$",
      "postaci $[q,\\infty)$ dla pewnego $q$",
      "cały zbiór $\\mathbb{R}$",
      "przedział ograniczony z obu stron"
    ],
    "correctIndex": 0,
    "explanation": "Współczynnik $a=-2<0$, więc ramiona paraboli są skierowane w dół, a zbiór wartości ma postać $(-\\infty,q]$, gdzie $q$ to wartość w wierzchołku."
  },
  {
    "type": "reveal-steps",
    "title": "Wyznaczanie wierzchołka paraboli",
    "problem": "Wyznacz współrzędne wierzchołka paraboli $f(x)=x^2-4x+1$.",
    "steps": [
      {
        "prompt": "Odczytaj współczynniki $a$, $b$, $c$.",
        "kind": "choice",
        "options": [
          "$a=1,\\ b=-4,\\ c=1$",
          "$a=1,\\ b=4,\\ c=1$",
          "$a=-4,\\ b=1,\\ c=1$"
        ],
        "correctIndex": 0,
        "reveal": "Porównując z $f(x)=ax^2+bx+c$: $a=1$, $b=-4$, $c=1$."
      },
      {
        "prompt": "Oblicz odciętą wierzchołka $p=-\\dfrac{b}{2a}$.",
        "kind": "input",
        "acceptedAnswers": [
          "2"
        ],
        "reveal": "$p=-\\dfrac{-4}{2\\cdot1}=\\dfrac{4}{2}=2$.",
        "formula": "p=-\\dfrac{b}{2a}=2"
      },
      {
        "prompt": "Oblicz rzędną wierzchołka $q=f(p)$.",
        "kind": "input",
        "acceptedAnswers": [
          "-3"
        ],
        "reveal": "$q=f(2)=2^2-4\\cdot2+1=4-8+1=-3$.",
        "formula": "q=f(2)=-3"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Współrzędne wierzchołka paraboli z poprzedniego zadania to:",
    "options": [
      "$(2,-3)$",
      "$(-2,3)$",
      "$(4,1)$",
      "$(2,3)$"
    ],
    "correctIndex": 0,
    "explanation": "Z poprzednich obliczeń: $p=2$, $q=-3$, więc wierzchołek to $(2,-3)$."
  },
  {
    "type": "definition",
    "term": "Funkcja wielomianowa",
    "text": "Funkcja wielomianowa (stopnia $n\\ge3$ — funkcje liniowa i kwadratowa to szczególne przypadki wielomianów niższego stopnia) ma wzór $f(x)=a_nx^n+\\ldots+a_1x+a_0$. Jej dziedziną jest zawsze cały zbiór $\\mathbb{R}$. Dla wielomianów stopnia nieparzystego zbiorem wartości jest cały zbiór $\\mathbb{R}$; dla wielomianów stopnia parzystego zbiór wartości jest ograniczony z jednej strony, podobnie jak dla paraboli.",
    "formula": "f(x)=a_nx^n+a_{n-1}x^{n-1}+\\ldots+a_1x+a_0, \\qquad a_n\\neq0"
  },
  {
    "type": "definition",
    "term": "Funkcja wymierna",
    "text": "Funkcja wymierna to iloraz dwóch wielomianów, $f(x)=\\dfrac{P(x)}{Q(x)}$, gdzie $Q(x)$ nie jest wielomianem zerowym. Jej dziedziną jest zbiór $\\mathbb{R}$ z wyłączonymi miejscami zerowymi mianownika $Q(x)$. Najprostszym przykładem jest $f(x)=\\dfrac{1}{x}$ (proporcjonalność odwrotna), której wykres nazywamy hiperbolą.",
    "formula": "f(x)=\\dfrac{P(x)}{Q(x)}, \\qquad Q(x)\\not\\equiv0"
  },
  {
    "type": "quiz",
    "question": "Jaka jest dziedzina funkcji wymiernej $f(x)=\\dfrac{x}{x^2-1}$?",
    "options": [
      "$\\mathbb{R}\\setminus\\{-1,1\\}$",
      "$\\mathbb{R}\\setminus\\{0\\}$",
      "$\\mathbb{R}\\setminus\\{1\\}$",
      "$\\mathbb{R}$"
    ],
    "correctIndex": 0,
    "explanation": "Mianownik zeruje się dla $x^2-1=0$, czyli $x=-1$ lub $x=1$ — te wartości wykluczamy z dziedziny."
  },
  {
    "type": "definition",
    "term": "Funkcja wykładnicza",
    "text": "Funkcja wykładnicza dana jest wzorem $f(x)=a^x$, gdzie podstawa $a>0$ i $a\\neq1$. Jej dziedziną jest cały zbiór $\\mathbb{R}$, a zbiorem wartości — przedział $(0,\\infty)$ (funkcja wykładnicza nigdy nie przyjmuje wartości ujemnych ani zera). Dla $a>1$ funkcja jest rosnąca, a dla $0<a<1$ — malejąca. Wykres zawsze przechodzi przez punkt $(0,1)$, bo $a^0=1$.",
    "formula": "f(x)=a^x, \\qquad a>0,\\ a\\neq1"
  },
  {
    "type": "function-plot",
    "title": "Funkcja wykładnicza $f(x)=a\\cdot b^x+c$",
    "caption": "Zmieniaj podstawę $b$ — dla $b>1$ funkcja rośnie, dla $0<b<1$ maleje. Wykres zawsze zbliża się do poziomej asymptoty $y=c$, ale nigdy jej nie osiąga.",
    "expression": "a * Math.pow(b, x) + c",
    "params": [
      {
        "symbol": "a",
        "label": "Skala pionowa",
        "min": 0.5,
        "max": 2,
        "step": 0.5,
        "default": 1
      },
      {
        "symbol": "b",
        "label": "Podstawa",
        "min": 0.2,
        "max": 3,
        "step": 0.1,
        "default": 2
      },
      {
        "symbol": "c",
        "label": "Asymptota pozioma",
        "min": -3,
        "max": 3,
        "step": 1,
        "default": 0
      }
    ],
    "domain": [-4, 4]
  },
  {
    "type": "quiz",
    "question": "Funkcja wykładnicza $f(x)=\\left(\\dfrac{1}{2}\\right)^x$ jest:",
    "options": [
      "malejąca, bo podstawa jest mniejsza od $1$",
      "rosnąca, bo podstawa jest dodatnia",
      "stała",
      "nieokreślona dla $x<0$"
    ],
    "correctIndex": 0,
    "explanation": "Podstawa $\\frac12$ spełnia $0<\\frac12<1$, więc funkcja wykładnicza jest malejąca."
  },
  {
    "type": "definition",
    "term": "Funkcja logarytmiczna",
    "text": "Funkcja logarytmiczna dana jest wzorem $f(x)=\\log_a x$, gdzie podstawa $a>0$, $a\\neq1$. Jest to funkcja odwrotna do funkcji wykładniczej $g(x)=a^x$ — dlatego jej dziedziną jest przedział $(0,\\infty)$ (dziedzina zamienia się miejscami ze zbiorem wartości funkcji wykładniczej), a zbiorem wartości cały zbiór $\\mathbb{R}$. Dla $a>1$ funkcja jest rosnąca, dla $0<a<1$ — malejąca. Wykres zawsze przechodzi przez punkt $(1,0)$, bo $\\log_a 1=0$.",
    "formula": "f(x)=\\log_a x, \\qquad a>0,\\ a\\neq1,\\ x>0"
  },
  {
    "type": "quiz",
    "question": "Jaka jest dziedzina funkcji $f(x)=\\log_2(x)$?",
    "options": [
      "$(0,\\infty)$",
      "$\\mathbb{R}$",
      "$[0,\\infty)$",
      "$(-\\infty,0)$"
    ],
    "correctIndex": 0,
    "explanation": "Argument logarytmu musi być dodatni, więc dziedziną jest przedział $(0,\\infty)$."
  },
  {
    "type": "examples",
    "title": "Wartości funkcji wykładniczej i logarytmicznej",
    "items": [
      {
        "problem": "f(x)=2^x, \\quad \\text{oblicz } f(3)",
        "steps": [
          {
            "text": "Podstawiamy $x=3$ do wzoru.",
            "formula": "f(3)=2^3"
          },
          {
            "text": "Obliczamy potęgę.",
            "formula": "2^3=8"
          }
        ],
        "answer": "8"
      },
      {
        "problem": "f(x)=\\log_2 x, \\quad \\text{oblicz } f(8)",
        "steps": [
          {
            "text": "Szukamy wykładnika, do którego trzeba podnieść $2$, aby otrzymać $8$.",
            "formula": "2^{?}=8"
          },
          {
            "text": "Ponieważ $2^3=8$, otrzymujemy odpowiedź.",
            "formula": "2^3=8"
          }
        ],
        "answer": "3"
      }
    ]
  },
  {
    "type": "definition",
    "term": "Funkcje trygonometryczne",
    "text": "Funkcje $\\sin x$ i $\\cos x$ mają dziedzinę $\\mathbb{R}$ i zbiór wartości $[-1,1]$ oraz są okresowe z okresem $T=2\\pi$. Funkcja $\\tan x=\\dfrac{\\sin x}{\\cos x}$ ma dziedzinę $\\mathbb{R}$ z wyłączonymi punktami, w których $\\cos x=0$ (czyli $x\\neq\\frac{\\pi}{2}+k\\pi$ dla $k\\in\\mathbb{Z}$), zbiór wartości $\\mathbb{R}$ i okres $T=\\pi$.",
    "formula": "D_{\\sin}=D_{\\cos}=\\mathbb{R}, \\quad ZW_{\\sin}=ZW_{\\cos}=[-1,1], \\quad D_{\\tan}=\\mathbb{R}\\setminus\\left\\{\\tfrac{\\pi}{2}+k\\pi\\right\\}"
  },
  {
    "type": "quiz",
    "question": "Zbiorem wartości funkcji $f(x)=\\cos x$ jest:",
    "options": [
      "$[-1,1]$",
      "$\\mathbb{R}$",
      "$(0,\\infty)$",
      "$[0,1]$"
    ],
    "correctIndex": 0,
    "explanation": "Wartości funkcji kosinus zawsze mieszczą się w przedziale $[-1,1]$."
  },
  {
    "type": "table",
    "title": "Podsumowanie: dziedzina, zbiór wartości i monotoniczność funkcji elementarnych",
    "headers": [
      "Funkcja",
      "Wzór",
      "Dziedzina",
      "Zbiór wartości"
    ],
    "rows": [
      [
        "Liniowa",
        "$f(x)=ax+b$",
        "$\\mathbb{R}$",
        "$\\mathbb{R}$ (dla $a\\neq0$)"
      ],
      [
        "Kwadratowa",
        "$f(x)=ax^2+bx+c$",
        "$\\mathbb{R}$",
        "$[q,\\infty)$ lub $(-\\infty,q]$"
      ],
      [
        "Wielomianowa (stopień nieparzysty)",
        "$f(x)=a_nx^n+\\ldots$",
        "$\\mathbb{R}$",
        "$\\mathbb{R}$"
      ],
      [
        "Wymierna",
        "$f(x)=\\dfrac{P(x)}{Q(x)}$",
        "$\\mathbb{R}$ bez zer $Q(x)$",
        "zależy od wzoru"
      ],
      [
        "Wykładnicza",
        "$f(x)=a^x$",
        "$\\mathbb{R}$",
        "$(0,\\infty)$"
      ],
      [
        "Logarytmiczna",
        "$f(x)=\\log_a x$",
        "$(0,\\infty)$",
        "$\\mathbb{R}$"
      ],
      [
        "Sinus / kosinus",
        "$f(x)=\\sin x$ / $\\cos x$",
        "$\\mathbb{R}$",
        "$[-1,1]$"
      ]
    ]
  },
  {
    "type": "quiz",
    "question": "Która funkcja ma zbiór wartości $(0,\\infty)$?",
    "options": [
      "$f(x)=3^x$",
      "$f(x)=x^2$",
      "$f(x)=\\sin x$",
      "$f(x)=x$"
    ],
    "correctIndex": 0,
    "explanation": "Funkcja wykładnicza $f(x)=3^x$ przyjmuje wyłącznie wartości dodatnie, więc jej zbiór wartości to $(0,\\infty)$. Uwaga: $f(x)=x^2$ ma zbiór wartości $[0,\\infty)$ — zawiera $0$, więc to inny przedział."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli dla każdej z podstawowych funkcji — liniowej, kwadratowej, wielomianowej, wymiernej, wykładniczej, logarytmicznej i trygonometrycznych — potrafisz od razu podać jej dziedzinę, zbiór wartości i ogólny kształt wykresu, a także rozpoznajesz, kiedy funkcja jest rosnąca, a kiedy malejąca, na podstawie samych współczynników wzoru."
  }
]$content4$::jsonb,
  3
);
