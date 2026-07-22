-- ============================================================================
-- supabase/seed/matma/02_lessons_rownania-nierownosci.sql
-- Interactive lesson content (math_lessons) for the "rownania-nierownosci" department:
-- Rownania i nierownosci (liniowe, kwadratowe, wielomianowe, wymierne, z
-- wartoscia bezwzgledna, z parametrem, uklady rownan).
-- content is a jsonb array of MathBlock (see lib/matma/lesson-blocks.ts).
--
-- Idempotent: deletes existing lessons for this topic first. Run
-- 01_topics.sql BEFORE this file — it looks up topic_id by slug.
-- ============================================================================

delete from math_lessons
where topic_id = (select id from math_topics where slug = 'rownania-nierownosci');

-- ----------------------------------------------------------------------------
-- Lesson 1: Podstawy: równania, nierówności i proste układy równań
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $title1$Podstawy: równania, nierówności i proste układy równań$title1$,
  $content1$[
  {
    "type": "basics-recap",
    "title": "Czym jest równanie i nierówność?",
    "text": "Równanie to zapis mówiący, że dwa wyrażenia zawierające niewiadomą (najczęściej $x$) są sobie równe, np. $2x+1=7$. „Rozwiązać równanie” oznacza znaleźć wszystkie liczby, które podstawione za $x$ dają prawdziwą równość — taki zbiór liczb nazywamy zbiorem rozwiązań. Nierówność wygląda podobnie, ale zamiast znaku „=” występuje jeden ze znaków $<$, $>$, $\\le$, $\\ge$, a jej rozwiązaniem zwykle jest cały przedział liczb, a nie pojedyncza wartość. Oba typy zadań rozwiązujemy, wykonując na obu stronach te same, dozwolone przekształcenia: możemy dodać lub odjąć tę samą liczbę, a także pomnożyć lub podzielić przez liczbę różną od zera — z jednym wyjątkiem: mnożąc lub dzieląc NIERÓWNOŚĆ przez liczbę ujemną, musimy odwrócić jej znak.",
    "formula": "ax+b=0 \\quad (a\\neq 0)",
    "controlQuiz": [
      {
        "question": "Co dokładnie oznacza polecenie „rozwiąż równanie $3x-6=0$”?",
        "options": [
          "Znajdź wszystkie liczby $x$, dla których lewa strona równa się prawej",
          "Podstaw dowolną liczbę za $x$ i oblicz wynik",
          "Zamień równanie na nierówność",
          "Sprawdź, czy $3x-6$ jest liczbą dodatnią"
        ],
        "correctIndex": 0,
        "explanation": "Rozwiązać równanie to znaleźć zbiór wszystkich liczb, które po podstawieniu za $x$ dają prawdziwą równość. Tutaj jedyną taką liczbą jest $x=2$."
      },
      {
        "question": "Które przekształcenie jest zawsze dozwolone i nie zmienia zbioru rozwiązań równania?",
        "options": [
          "Podniesienie obu stron do kwadratu",
          "Dodanie tej samej liczby do obu stron równania",
          "Pomnożenie tylko jednej strony przez $2$",
          "Pominięcie jednego składnika bez żadnej operacji"
        ],
        "correctIndex": 1,
        "explanation": "Dodanie (lub odjęcie) tej samej liczby do obu stron to przekształcenie równoważne. Podnoszenie do kwadratu bywa niebezpieczne — może wprowadzić rozwiązania obce."
      },
      {
        "question": "Rozwiązujesz nierówność $-2x<8$ i dzielisz obie strony przez $-2$. Co musisz zrobić ze znakiem nierówności?",
        "options": [
          "Zostawić bez zmian",
          "Odwrócić go na przeciwny",
          "Zamienić na znak równości",
          "Usunąć go całkowicie"
        ],
        "correctIndex": 1,
        "explanation": "Przy mnożeniu lub dzieleniu obu stron nierówności przez liczbę ujemną zawsze odwracamy znak nierówności: $-2x<8 \\Rightarrow x>-4$."
      }
    ]
  },
  {
    "type": "definition",
    "term": "Równanie liniowe",
    "text": "Równanie liniowe z jedną niewiadomą $x$ to takie, które po uproszczeniu (redukcji wyrazów podobnych) można zapisać w postaci $ax+b=0$, gdzie $a$ i $b$ są liczbami rzeczywistymi oraz $a\\neq 0$. Dla $a\\neq 0$ takie równanie ma zawsze dokładnie jedno rozwiązanie.",
    "formula": "x=-\\dfrac{b}{a}"
  },
  {
    "type": "quiz",
    "question": "Ile rozwiązań ma równanie liniowe $ax+b=0$, jeśli $a\\neq 0$?",
    "options": [
      "Zero",
      "Dokładnie jedno",
      "Dwa",
      "Nieskończenie wiele"
    ],
    "correctIndex": 1,
    "explanation": "Dla $a\\neq 0$ przekształcamy równanie do postaci $x=-\\dfrac{b}{a}$ — istnieje dokładnie jedna taka liczba."
  },
  {
    "type": "examples",
    "title": "Równania liniowe — przykłady krok po kroku",
    "items": [
      {
        "problem": "3x+5=20",
        "steps": [
          {
            "text": "Odejmujemy $5$ od obu stron równania, aby zostawić po lewej stronie tylko wyraz z $x$.",
            "formula": "3x=15"
          },
          {
            "text": "Dzielimy obie strony przez $3$.",
            "formula": "x=5"
          }
        ],
        "answer": "x=5"
      },
      {
        "problem": "\\dfrac{x}{3}+1=\\dfrac{x}{2}",
        "steps": [
          {
            "text": "Mnożymy obie strony przez wspólny mianownik $6$, aby pozbyć się ułamków.",
            "formula": "2x+6=3x"
          },
          {
            "text": "Przenosimy wyrazy z $x$ na jedną stronę, a liczby na drugą.",
            "formula": "6=x"
          }
        ],
        "answer": "x=6"
      }
    ]
  },
  {
    "type": "reveal-steps",
    "title": "Rozwiąż samodzielnie: nierówność liniowa",
    "problem": "Rozwiąż nierówność $-3x+6>0$.",
    "steps": [
      {
        "prompt": "Pierwszy krok: co zrobimy z liczbą $6$, żeby zostawić po lewej stronie sam wyraz z $x$?",
        "kind": "choice",
        "options": [
          "Odejmiemy $6$ od obu stron",
          "Dodamy $6$ do obu stron",
          "Pomnożymy obie strony przez $6$"
        ],
        "correctIndex": 0,
        "reveal": "Odejmujemy $6$ od obu stron nierówności.",
        "formula": "-3x>-6"
      },
      {
        "prompt": "Teraz dzielimy obie strony przez $-3$. O czym musimy pamiętać?",
        "kind": "choice",
        "options": [
          "Nic się nie zmienia",
          "Musimy odwrócić znak nierówności",
          "Musimy zamienić nierówność na równość"
        ],
        "correctIndex": 1,
        "reveal": "Dzieląc obie strony przez liczbę ujemną, odwracamy znak nierówności.",
        "formula": "x<2"
      },
      {
        "prompt": "Podaj pełny zbiór rozwiązań nierówności $-3x+6>0$ (np. w postaci x<... lub x>...).",
        "kind": "input",
        "acceptedAnswers": [
          "x<2",
          "x < 2"
        ],
        "reveal": "Zbiorem rozwiązań jest przedział otwarty od minus nieskończoności do $2$.",
        "formula": "x\\in(-\\infty,2)"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Rozwiązaniem nierówności $2x-4\\le 10$ jest:",
    "options": [
      "$x\\le 3$",
      "$x\\le 7$",
      "$x\\ge 7$",
      "$x\\le -7$"
    ],
    "correctIndex": 1,
    "explanation": "$2x-4\\le 10 \\Rightarrow 2x\\le 14 \\Rightarrow x\\le 7$."
  },
  {
    "type": "definition",
    "term": "Układ równań liniowych",
    "text": "Układ dwóch równań liniowych z niewiadomymi $x$ i $y$ rozwiązujemy najczęściej jedną z dwóch metod. Metoda podstawiania: z jednego równania wyznaczamy jedną niewiadomą i podstawiamy ją do drugiego równania. Metoda przeciwnych współczynników: mnożymy równania przez odpowiednie liczby tak, aby po dodaniu (lub odjęciu) ich stronami jedna niewiadoma się zredukowała.",
    "formula": "\\begin{cases}a_1x+b_1y=c_1\\\\a_2x+b_2y=c_2\\end{cases}"
  },
  {
    "type": "examples",
    "title": "Układ równań — przykład",
    "items": [
      {
        "problem": "\\begin{cases}x+y=7\\\\x-y=1\\end{cases}",
        "steps": [
          {
            "text": "Dodajemy oba równania stronami — niewiadoma $y$ się redukuje.",
            "formula": "2x=8"
          },
          {
            "text": "Wyznaczamy $x$.",
            "formula": "x=4"
          },
          {
            "text": "Podstawiamy $x=4$ do pierwszego równania i wyznaczamy $y$.",
            "formula": "4+y=7 \\Rightarrow y=3"
          }
        ],
        "answer": "x=4,\\ y=3"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "W układzie $\\begin{cases}2x+3y=12\\\\x-y=1\\end{cases}$ z drugiego równania możemy od razu zapisać:",
    "options": [
      "$y=x-1$",
      "$x=y+1$",
      "$x=1-y$",
      "$y=1-x$"
    ],
    "correctIndex": 1,
    "explanation": "Z równania $x-y=1$ dodajemy $y$ do obu stron i otrzymujemy $x=y+1$ — to wyrażenie podstawiamy do pierwszego równania."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Opanowanie tej lekcji oznacza, że bez wahania rozwiązujesz równania i nierówności liniowe (także z ułamkami), pamiętasz o zmianie znaku nierówności przy mnożeniu/dzieleniu przez liczbę ujemną i sprawnie rozwiązujesz prosty układ dwóch równań dowolną metodą. Jeśli to wszystko brzmi znajomo — czas na równania i nierówności kwadratowe."
  }
]$content1$::jsonb,
  0
);

-- ----------------------------------------------------------------------------
-- Lesson 2: Równania i nierówności kwadratowe
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $title2$Równania i nierówności kwadratowe$title2$,
  $content2$[
  {
    "type": "intro",
    "text": "W tej lekcji nauczysz się rozwiązywać równania i nierówności kwadratowe — jedno z najczęściej sprawdzanych narzędzi na maturze rozszerzonej, które przyda się też w zadaniach z parametrem."
  },
  {
    "type": "definition",
    "term": "Równanie kwadratowe",
    "text": "Równanie kwadratowe z niewiadomą $x$ ma postać $ax^2+bx+c=0$, gdzie $a,b,c$ są liczbami rzeczywistymi oraz $a\\neq 0$. Aby je rozwiązać, obliczamy wyróżnik równania, zwany deltą.",
    "formula": "\\Delta=b^2-4ac"
  },
  {
    "type": "table",
    "title": "Liczba rozwiązań w zależności od Δ",
    "headers": [
      "Wartość $\\Delta$",
      "Liczba rozwiązań",
      "Wzory na pierwiastki"
    ],
    "rows": [
      [
        "$\\Delta>0$",
        "dwa różne rozwiązania rzeczywiste",
        "$x_1=\\dfrac{-b-\\sqrt{\\Delta}}{2a},\\ x_2=\\dfrac{-b+\\sqrt{\\Delta}}{2a}$"
      ],
      [
        "$\\Delta=0$",
        "jedno rozwiązanie (podwójne)",
        "$x_0=-\\dfrac{b}{2a}$"
      ],
      [
        "$\\Delta<0$",
        "brak rozwiązań rzeczywistych",
        "—"
      ]
    ]
  },
  {
    "type": "quiz",
    "question": "Ile rozwiązań rzeczywistych ma równanie kwadratowe, dla którego $\\Delta<0$?",
    "options": [
      "Dwa",
      "Jedno",
      "Zero",
      "Nieskończenie wiele"
    ],
    "correctIndex": 2,
    "explanation": "Gdy $\\Delta<0$, wzory na pierwiastki wymagałyby pierwiastka z liczby ujemnej — równanie nie ma rozwiązań w zbiorze liczb rzeczywistych."
  },
  {
    "type": "examples",
    "title": "Rozwiązywanie równania kwadratowego — przykład",
    "items": [
      {
        "problem": "x^2-5x+6=0",
        "steps": [
          {
            "text": "Odczytujemy współczynniki: $a=1$, $b=-5$, $c=6$, i obliczamy deltę.",
            "formula": "\\Delta=(-5)^2-4\\cdot1\\cdot6=25-24=1"
          },
          {
            "text": "Ponieważ $\\Delta>0$, obliczamy pierwiastek z delty.",
            "formula": "\\sqrt{\\Delta}=1"
          },
          {
            "text": "Podstawiamy do wzorów i wyznaczamy oba rozwiązania.",
            "formula": "x_1=\\dfrac{5-1}{2}=2,\\quad x_2=\\dfrac{5+1}{2}=3"
          }
        ],
        "answer": "x=2 \\lor x=3"
      }
    ]
  },
  {
    "type": "reveal-steps",
    "title": "Rozwiąż samodzielnie: równanie kwadratowe niezupełne",
    "problem": "Rozwiąż równanie $x^2-9=0$.",
    "steps": [
      {
        "prompt": "To równanie kwadratowe niezupełne (brak wyrazu z $x$ w pierwszej potędze). Jak najszybciej je rozwiązać?",
        "kind": "choice",
        "options": [
          "Obliczyć deltę ze wzoru ogólnego",
          "Przenieść $9$ na prawą stronę i rozłożyć na czynniki jako różnicę kwadratów",
          "Podzielić obie strony przez $x$"
        ],
        "correctIndex": 1,
        "reveal": "Najszybciej skorzystać ze wzoru skróconego mnożenia: $x^2-9=(x-3)(x+3)$.",
        "formula": "(x-3)(x+3)=0"
      },
      {
        "prompt": "Iloczyn dwóch czynników równa się zero. Kiedy tak się dzieje?",
        "kind": "choice",
        "options": [
          "Gdy oba czynniki są równe zero jednocześnie",
          "Gdy przynajmniej jeden z czynników jest równy zero",
          "Nigdy — to niemożliwe"
        ],
        "correctIndex": 1,
        "reveal": "Iloczyn jest równy zeru wtedy i tylko wtedy, gdy przynajmniej jeden z czynników jest równy zero.",
        "formula": "x-3=0 \\lor x+3=0"
      },
      {
        "prompt": "Podaj obydwa rozwiązania równania $x^2-9=0$.",
        "kind": "input",
        "acceptedAnswers": [
          "x=-3 lub x=3",
          "x=3 lub x=-3",
          "x=-3 i x=3",
          "x=3 i x=-3"
        ],
        "reveal": "Z każdego czynnika otrzymujemy jedno rozwiązanie.",
        "formula": "x=3 \\lor x=-3"
      }
    ]
  },
  {
    "type": "definition",
    "term": "Nierówność kwadratowa",
    "text": "Nierówność kwadratową (np. $ax^2+bx+c>0$) rozwiązujemy, analizując znak funkcji kwadratowej $f(x)=ax^2+bx+c$. Najpierw wyznaczamy miejsca zerowe (rozwiązując odpowiadające jej równanie kwadratowe), a następnie — korzystając z kształtu paraboli (ramiona w górę dla $a>0$, ramiona w dół dla $a<0$) — odczytujemy, na jakich przedziałach funkcja przyjmuje wartości dodatnie, a na jakich ujemne."
  },
  {
    "type": "examples",
    "title": "Nierówność kwadratowa — przykład",
    "items": [
      {
        "problem": "x^2-5x+6\\le 0",
        "steps": [
          {
            "text": "Wyznaczamy miejsca zerowe funkcji $f(x)=x^2-5x+6$ — to te same pierwiastki, co w poprzednim przykładzie: $x_1=2$ oraz $x_2=3$.",
            "formula": "x_1=2,\\quad x_2=3"
          },
          {
            "text": "Ponieważ współczynnik $a=1>0$, parabola ma ramiona skierowane do góry, więc funkcja przyjmuje wartości niedodatnie (czyli $\\le 0$) dokładnie pomiędzy miejscami zerowymi, łącznie z nimi."
          },
          {
            "text": "Zapisujemy zbiór rozwiązań jako przedział domknięty.",
            "formula": "x\\in[2,3]"
          }
        ],
        "answer": "x\\in[2,3]"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Funkcja kwadratowa $f(x)=x^2-5x+6$ ma miejsca zerowe $x=2$ i $x=3$, a współczynnik przy $x^2$ jest dodatni. Dla jakich $x$ zachodzi $f(x)\\ge 0$?",
    "options": [
      "$x\\in[2,3]$",
      "$x\\in(-\\infty,2]\\cup[3,\\infty)$",
      "$x\\in(2,3)$",
      "Dla żadnego $x$"
    ],
    "correctIndex": 1,
    "explanation": "Parabola ma ramiona w górę, więc funkcja jest nieujemna poza przedziałem między pierwiastkami (włącznie z pierwiastkami)."
  },
  {
    "type": "reveal-steps",
    "title": "Rozwiąż samodzielnie: nierówność kwadratowa ostra",
    "problem": "Rozwiąż nierówność $x^2-4>0$.",
    "steps": [
      {
        "prompt": "Jakie są miejsca zerowe funkcji $f(x)=x^2-4$?",
        "kind": "choice",
        "options": [
          "$x=-2$ i $x=2$",
          "$x=-4$ i $x=4$",
          "$x=0$ i $x=4$"
        ],
        "correctIndex": 0,
        "reveal": "Rozkładamy różnicę kwadratów: $x^2-4=(x-2)(x+2)$, stąd miejsca zerowe to $x=-2$ i $x=2$.",
        "formula": "(x-2)(x+2)=0"
      },
      {
        "prompt": "Współczynnik przy $x^2$ jest dodatni ($a=1$). Gdzie parabola przyjmuje wartości dodatnie?",
        "kind": "choice",
        "options": [
          "Między pierwiastkami",
          "Poza pierwiastkami (na zewnątrz przedziału)",
          "Nigdzie"
        ],
        "correctIndex": 1,
        "reveal": "Dla $a>0$ parabola ma ramiona w górę — wartości dodatnie są poza przedziałem między pierwiastkami."
      },
      {
        "prompt": "Podaj zbiór rozwiązań nierówności $x^2-4>0$.",
        "kind": "input",
        "acceptedAnswers": [
          "x<-2 lub x>2",
          "x>2 lub x<-2"
        ],
        "reveal": "Ponieważ nierówność jest ostra, same pierwiastki nie należą do zbioru rozwiązań.",
        "formula": "x\\in(-\\infty,-2)\\cup(2,\\infty)"
      }
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Jeśli sprawnie liczysz deltę, rozpoznajesz liczbę rozwiązań na podstawie jej znaku i potrafisz zamienić równanie kwadratowe w nierówność kwadratową, patrząc na kształt paraboli (a szczególnie pamiętasz, kiedy pierwiastki należą do zbioru rozwiązań, a kiedy nie) — jesteś gotowy na równania i nierówności wielomianowe oraz wymierne."
  }
]$content2$::jsonb,
  1
);

-- ----------------------------------------------------------------------------
-- Lesson 3: Równania i nierówności wielomianowe oraz wymierne
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $title3$Równania i nierówności wielomianowe oraz wymierne$title3$,
  $content3$[
  {
    "type": "intro",
    "text": "Wielomiany wyższych stopni oraz wyrażenia wymierne (czyli ułamki z niewiadomą w mianowniku) wymagają dodatkowej ostrożności — rozkładania na czynniki, ustalania dziedziny i analizy znaku na wielu przedziałach naraz."
  },
  {
    "type": "definition",
    "term": "Równanie wielomianowe wyższego stopnia",
    "text": "Aby rozwiązać równanie wielomianowe stopnia wyższego niż $2$, staramy się rozłożyć wielomian na czynniki (np. wyłączając wspólny czynnik przed nawias, grupując wyrazy albo dzieląc przez znaleziony czynnik liniowy) i skorzystać z faktu, że iloczyn jest równy zeru tylko wtedy, gdy przynajmniej jeden z czynników jest równy zeru."
  },
  {
    "type": "examples",
    "title": "Równanie dwukwadratowe — przykład",
    "items": [
      {
        "problem": "x^4-5x^2+4=0",
        "steps": [
          {
            "text": "Wprowadzamy pomocniczą zmienną $t=x^2$, pamiętając o warunku $t\\ge 0$.",
            "formula": "t^2-5t+4=0"
          },
          {
            "text": "Rozwiązujemy równanie kwadratowe względem $t$ (wyróżnik wynosi $25-16=9$).",
            "formula": "t_1=1,\\quad t_2=4"
          },
          {
            "text": "Wracamy do zmiennej $x$: dla każdej dodatniej wartości $t$ otrzymujemy dwa rozwiązania.",
            "formula": "x^2=1 \\Rightarrow x=\\pm1;\\qquad x^2=4 \\Rightarrow x=\\pm2"
          }
        ],
        "answer": "x=-2 \\lor x=-1 \\lor x=1 \\lor x=2"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Podstawiając $t=x^2$ w równaniu dwukwadratowym, jaki dodatkowy warunek musi spełniać $t$?",
    "options": [
      "$t\\le 0$",
      "$t\\ge 0$",
      "$t\\neq 0$",
      "Brak dodatkowego warunku"
    ],
    "correctIndex": 1,
    "explanation": "Skoro $t=x^2$, to $t$ jest kwadratem liczby rzeczywistej, więc zawsze $t\\ge 0$ — ujemne rozwiązania dla $t$ należy odrzucić."
  },
  {
    "type": "reveal-steps",
    "title": "Rozwiąż samodzielnie: równanie wielomianowe przez wyłączenie czynnika",
    "problem": "Rozwiąż równanie $x^3-4x=0$.",
    "steps": [
      {
        "prompt": "Co możemy wyłączyć przed nawias po lewej stronie równania?",
        "kind": "choice",
        "options": [
          "Liczbę $4$",
          "Zmienną $x$",
          "Nic nie da się wyłączyć"
        ],
        "correctIndex": 1,
        "reveal": "Każdy składnik zawiera $x$, więc wyłączamy $x$ przed nawias.",
        "formula": "x(x^2-4)=0"
      },
      {
        "prompt": "Wyrażenie $x^2-4$ w nawiasie to różnica kwadratów. Jak rozłożyć je na czynniki?",
        "kind": "choice",
        "options": [
          "$(x-2)(x+2)$",
          "$(x-4)(x+1)$",
          "$(x-2)^2$"
        ],
        "correctIndex": 0,
        "reveal": "$x^2-4=x^2-2^2=(x-2)(x+2)$.",
        "formula": "x(x-2)(x+2)=0"
      },
      {
        "prompt": "Podaj wszystkie rozwiązania równania $x^3-4x=0$.",
        "kind": "input",
        "acceptedAnswers": [
          "x=-2 lub x=0 lub x=2",
          "x=0 lub x=-2 lub x=2",
          "x=-2 lub x=2 lub x=0"
        ],
        "reveal": "Iloczyn trzech czynników jest równy zeru, gdy którykolwiek z nich jest równy zeru.",
        "formula": "x=-2 \\lor x=0 \\lor x=2"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Wielomian $W(x)=x^3-9x$ rozłożony na czynniki ma postać:",
    "options": [
      "$x(x-3)(x+3)$",
      "$x(x-9)(x+9)$",
      "$(x-3)(x+3)^2$",
      "$x^2(x-9)$"
    ],
    "correctIndex": 0,
    "explanation": "Wyłączamy $x$ przed nawias: $x(x^2-9)$, a $x^2-9=(x-3)(x+3)$."
  },
  {
    "type": "definition",
    "term": "Dziedzina wyrażenia wymiernego",
    "text": "W równaniach i nierównościach wymiernych niewiadoma występuje w mianowniku, dlatego zanim zaczniemy przekształcać, musimy wyznaczyć dziedzinę — zbiór tych $x$, dla których mianownik jest różny od zera. Każde rozwiązanie spoza dziedziny trzeba odrzucić, nawet jeśli formalnie spełnia przekształcone równanie."
  },
  {
    "type": "examples",
    "title": "Równanie wymierne — przykład",
    "items": [
      {
        "problem": "\\dfrac{2}{x-1}=3",
        "steps": [
          {
            "text": "Wyznaczamy dziedzinę: mianownik nie może być zerem.",
            "formula": "x\\neq 1"
          },
          {
            "text": "Mnożymy obie strony przez $(x-1)$, aby pozbyć się ułamka.",
            "formula": "2=3(x-1)"
          },
          {
            "text": "Rozwiązujemy powstałe równanie liniowe i sprawdzamy, czy wynik należy do dziedziny.",
            "formula": "2=3x-3 \\Rightarrow x=\\dfrac{5}{3}"
          }
        ],
        "answer": "x=\\dfrac{5}{3}"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "W równaniu $\\dfrac{3}{x+2}=x$ jaki jest warunek na dziedzinę?",
    "options": [
      "$x\\neq 0$",
      "$x\\neq -2$",
      "$x\\neq 2$",
      "Brak warunku"
    ],
    "correctIndex": 1,
    "explanation": "Mianownik $x+2$ nie może być równy zeru, więc $x\\neq -2$."
  },
  {
    "type": "definition",
    "term": "Nierówność wymierna i metoda siatki znaków",
    "text": "Nierówność wymierną sprowadzamy do postaci, w której po jednej stronie mamy $0$, a po drugiej jeden ułamek (nie wolno mnożyć obu stron przez wyrażenie z niewiadomą, bo nie znamy jego znaku!). Następnie wyznaczamy miejsca zerowe licznika i mianownika, zaznaczamy je na osi liczbowej i w każdym powstałym przedziale badamy znak całego wyrażenia — to tzw. siatka znaków. Miejsca zerowe mianownika zawsze wykluczamy z rozwiązania, nawet jeśli nierówność jest nieostra."
  },
  {
    "type": "examples",
    "title": "Nierówność wymierna — przykład",
    "items": [
      {
        "problem": "\\dfrac{x-2}{x+1}\\ge 0",
        "steps": [
          {
            "text": "Wyznaczamy dziedzinę.",
            "formula": "x\\neq -1"
          },
          {
            "text": "Wyznaczamy miejsca zerowe licznika i mianownika: $x=2$ zeruje licznik, $x=-1$ zeruje mianownik."
          },
          {
            "text": "Budujemy siatkę znaków na przedziałach wyznaczonych przez te punkty i sprawdzamy znak całego wyrażenia w każdym z nich."
          },
          {
            "text": "Odczytujemy przedziały, w których wyrażenie jest dodatnie lub równe zeru — pamiętając, że $x=-1$ zawsze odrzucamy (poza dziedziną), a $x=2$ dołączamy, bo zeruje licznik, a nierówność jest nieostra.",
            "formula": "x\\in(-\\infty,-1)\\cup[2,\\infty)"
          }
        ],
        "answer": "x\\in(-\\infty,-1)\\cup[2,\\infty)"
      }
    ]
  },
  {
    "type": "reveal-steps",
    "title": "Rozwiąż samodzielnie: nierówność wymierna",
    "problem": "Rozwiąż nierówność $\\dfrac{x+1}{x-2}\\le 0$.",
    "steps": [
      {
        "prompt": "Zanim cokolwiek policzymy, jaki warunek musimy nałożyć na dziedzinę?",
        "kind": "choice",
        "options": [
          "$x\\neq -1$",
          "$x\\neq 2$",
          "$x\\neq 0$"
        ],
        "correctIndex": 1,
        "reveal": "Mianownik $x-2$ nie może być zerem, więc $x\\neq 2$.",
        "formula": "x\\neq 2"
      },
      {
        "prompt": "Jakie są miejsca zerowe licznika i mianownika?",
        "kind": "choice",
        "options": [
          "$x=-1$ (licznik) i $x=2$ (mianownik)",
          "$x=1$ (licznik) i $x=-2$ (mianownik)",
          "$x=0$ (licznik) i $x=2$ (mianownik)"
        ],
        "correctIndex": 0,
        "reveal": "Licznik $x+1$ zeruje się dla $x=-1$, mianownik $x-2$ zeruje się dla $x=2$."
      },
      {
        "prompt": "Po zbadaniu znaku na każdym przedziale, podaj pełny zbiór rozwiązań nierówności.",
        "kind": "input",
        "acceptedAnswers": [
          "-1<=x<2",
          "x>=-1 i x<2",
          "x>=-1 oraz x<2"
        ],
        "reveal": "Wyrażenie jest ujemne lub zerowe między $-1$ (włącznie, bo zeruje licznik) a $2$ (wyłącznie, bo to poza dziedziną).",
        "formula": "x\\in[-1,2)"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Rozwiązując nierówność wymierną $\\dfrac{x-1}{x+3}\\ge 0$ metodą siatki znaków, wartość $x=-3$:",
    "options": [
      "Zawsze należy do zbioru rozwiązań, bo nierówność jest nieostra",
      "Nigdy nie należy do zbioru rozwiązań, bo zeruje mianownik (jest poza dziedziną)",
      "Należy do rozwiązań tylko gdy licznik też się zeruje",
      "Nie ma znaczenia dla rozwiązania"
    ],
    "correctIndex": 1,
    "explanation": "$x=-3$ zeruje mianownik, więc nie należy do dziedziny wyrażenia — zawsze wykluczamy taki punkt, niezależnie od tego, czy nierówność jest ostra czy nieostra."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Ten materiał masz opanowany, jeśli sprawnie rozkładasz wielomiany na czynniki (także metodą podstawienia, np. w równaniach dwukwadratowych), zawsze wyznaczasz dziedzinę przed przekształceniem wyrażenia wymiernego oraz potrafisz zbudować i odczytać siatkę znaków, pamiętając, że miejsca zerowe mianownika są zawsze wykluczone ze zbioru rozwiązań."
  }
]$content3$::jsonb,
  2
);

-- ----------------------------------------------------------------------------
-- Lesson 4: Równania i nierówności z wartością bezwzględną i z parametrem
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'rownania-nierownosci'),
  $title4$Równania i nierówności z wartością bezwzględną i z parametrem$title4$,
  $content4$[
  {
    "type": "intro",
    "text": "Ostatnia lekcja tego działu łączy dwa wymagające, ale bardzo „maturalne” tematy: równania i nierówności z wartością bezwzględną (moduł potrafi rozbić zadanie na kilka przypadków) oraz równania i nierówności z parametrem, w których wynik zależy od dodatkowej litery, np. $m$."
  },
  {
    "type": "definition",
    "term": "Wartość bezwzględna (przypomnienie)",
    "text": "Wartość bezwzględna liczby $a$ to jej odległość od zera na osi liczbowej — zawsze liczba nieujemna. Dla wyrażeń z niewiadomą pod modułem, np. $|x-3|$, rozpisujemy równanie lub nierówność na przypadki w zależności od znaku wyrażenia pod modułem.",
    "formula": "|a|=\\begin{cases}a & \\text{gdy } a\\ge0\\\\-a & \\text{gdy } a<0\\end{cases}"
  },
  {
    "type": "examples",
    "title": "Równanie z wartością bezwzględną — przykład",
    "items": [
      {
        "problem": "|x-3|=5",
        "steps": [
          {
            "text": "Równanie $|A|=b$ (dla $b\\ge 0$) rozbijamy na dwa przypadki: $A=b$ lub $A=-b$.",
            "formula": "x-3=5 \\lor x-3=-5"
          },
          {
            "text": "Rozwiązujemy każdy przypadek osobno.",
            "formula": "x=8 \\lor x=-2"
          }
        ],
        "answer": "x=-2 \\lor x=8"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Ile rozwiązań ma równanie $|x+1|=-4$?",
    "options": [
      "Jedno",
      "Dwa",
      "Zero — wartość bezwzględna nigdy nie jest ujemna",
      "Nieskończenie wiele"
    ],
    "correctIndex": 2,
    "explanation": "Wartość bezwzględna zawsze jest nieujemna, więc nie może być równa liczbie ujemnej — to równanie nie ma rozwiązań."
  },
  {
    "type": "reveal-steps",
    "title": "Rozwiąż samodzielnie: równanie z wartością bezwzględną i niewiadomą po drugiej stronie",
    "problem": "Rozwiąż równanie $|2x-1|=x+4$.",
    "steps": [
      {
        "prompt": "Zanim rozbijesz na przypadki, jaki warunek musi spełniać prawa strona, żeby równanie mogło mieć rozwiązanie?",
        "kind": "choice",
        "options": [
          "$x+4\\ge 0$",
          "$x+4\\le 0$",
          "$x+4=0$"
        ],
        "correctIndex": 0,
        "reveal": "Lewa strona $|2x-1|$ jest zawsze nieujemna, więc prawa strona też musi być nieujemna: $x+4\\ge 0$, czyli $x\\ge -4$.",
        "formula": "x+4\\ge0 \\iff x\\ge-4"
      },
      {
        "prompt": "Rozbij równanie na dwa przypadki, zależne od znaku wyrażenia $2x-1$.",
        "kind": "choice",
        "options": [
          "$2x-1=x+4$ lub $-(2x-1)=x+4$",
          "$2x-1=x+4$ lub $2x-1=-(x+4)$",
          "$2x-1=x-4$ lub $2x-1=4-x$"
        ],
        "correctIndex": 0,
        "reveal": "Przypadek 1 (gdy $2x-1\\ge 0$): $2x-1=x+4$. Przypadek 2 (gdy $2x-1<0$): $-(2x-1)=x+4$.",
        "formula": "2x-1=x+4 \\lor -(2x-1)=x+4"
      },
      {
        "prompt": "Rozwiąż oba przypadki i podaj wszystkie rozwiązania równania (pamiętaj o sprawdzeniu ich w równaniu wyjściowym).",
        "kind": "input",
        "acceptedAnswers": [
          "x=-1 lub x=5",
          "x=5 lub x=-1"
        ],
        "reveal": "Przypadek 1: $2x-1=x+4$ daje $x=5$. Przypadek 2: $-(2x-1)=x+4$, czyli $-2x+1=x+4$, daje $-3=3x$, więc $x=-1$. Sprawdzenie: dla $x=5$: $|9|=9=5+4$ ✓; dla $x=-1$: $|-3|=3=-1+4$ ✓. Oba rozwiązania są poprawne.",
        "formula": "x=-1 \\lor x=5"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Rozwiązując równanie $|x-2|=2x-7$, dlaczego warto na końcu sprawdzić otrzymane rozwiązania w równaniu wyjściowym?",
    "options": [
      "Bo rozbicie na przypadki czasem daje rozwiązania pozorne, które nie spełniają warunku, że prawa strona musi być nieujemna",
      "Nie trzeba tego robić — metoda przypadków zawsze daje pewne rozwiązania",
      "Żeby sprawdzić błędy rachunkowe w dodawaniu",
      "Bo równanie może nie mieć wyrazu wolnego"
    ],
    "correctIndex": 0,
    "explanation": "Każdy przypadek rozwiązujemy przy założeniu o znaku wyrażenia pod modułem — otrzymane $x$ może temu założeniu nie spełniać, dlatego warto sprawdzić je w równaniu wyjściowym (lub porównać z warunkiem, że prawa strona musi być nieujemna)."
  },
  {
    "type": "definition",
    "term": "Równanie i nierówność z parametrem",
    "text": "W równaniu lub nierówności z parametrem (najczęściej oznaczanym literą $m$, $k$ lub $a$) jedna z liczb występujących we wzorze nie jest ustalona — traktujemy ją jako dodatkową „niewiadomą”, dla której wynik zależy od jej wartości. Typowe pytania to: „dla jakich wartości parametru równanie ma dokładnie jedno / dwa / żadne rozwiązanie” albo „rozwiąż równanie w zależności od parametru”, co oznacza, że trzeba rozpatrzyć wszystkie możliwe przypadki."
  },
  {
    "type": "examples",
    "title": "Równanie liniowe z parametrem — przykład",
    "items": [
      {
        "problem": "(m-2)x=3m-6",
        "steps": [
          {
            "text": "Prawą stronę zapisujemy jako wielokrotność $(m-2)$.",
            "formula": "(m-2)x=3(m-2)"
          },
          {
            "text": "Rozważamy przypadek $m\\neq 2$ — dzielimy obie strony przez $(m-2)$.",
            "formula": "m\\neq2:\\quad x=3"
          },
          {
            "text": "Rozważamy przypadek $m=2$ — równanie przyjmuje postać $0\\cdot x=0$, prawdziwą dla każdego $x$.",
            "formula": "m=2:\\quad 0\\cdot x=0"
          }
        ],
        "answer": "m\\neq2:\\ x=3;\\quad m=2:\\ x\\in\\mathbb{R}"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "W przykładzie powyżej, dla $m=2$ równanie $(m-2)x=3m-6$ ma:",
    "options": [
      "Dokładnie jedno rozwiązanie $x=3$",
      "Nieskończenie wiele rozwiązań (każda liczba $x$ jest rozwiązaniem)",
      "Żadnego rozwiązania (równanie sprzeczne)",
      "Dokładnie dwa rozwiązania"
    ],
    "correctIndex": 1,
    "explanation": "Dla $m=2$ równanie sprowadza się do $0\\cdot x=0$, czyli tożsamości prawdziwej dla każdej liczby rzeczywistej $x$."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "W zadaniach z parametrem przy równaniu kwadratowym $ax^2+bx+c=0$ pamiętaj, żeby najpierw sprawdzić, czy współczynnik przy $x^2$ (zwykle zależny od parametru) może się wyzerować — wtedy równanie „kwadratowe” staje się liniowe i trzeba rozważyć ten przypadek osobno!"
  },
  {
    "type": "reveal-steps",
    "title": "Rozwiąż samodzielnie: równanie kwadratowe z parametrem",
    "problem": "Dla jakich wartości parametru $m$ równanie $x^2-4x+m=0$ ma dwa różne rozwiązania rzeczywiste?",
    "steps": [
      {
        "prompt": "Jaki warunek na wyróżnik $\\Delta$ musi być spełniony, żeby równanie kwadratowe miało dwa różne rozwiązania rzeczywiste?",
        "kind": "choice",
        "options": [
          "$\\Delta>0$",
          "$\\Delta\\ge0$",
          "$\\Delta=0$",
          "$\\Delta<0$"
        ],
        "correctIndex": 0,
        "reveal": "Dwa różne rozwiązania rzeczywiste istnieją wtedy i tylko wtedy, gdy $\\Delta>0$.",
        "formula": "\\Delta>0"
      },
      {
        "prompt": "Oblicz $\\Delta$ dla równania $x^2-4x+m=0$ (współczynniki: $a=1$, $b=-4$, $c=m$).",
        "kind": "input",
        "acceptedAnswers": [
          "16-4m",
          "delta=16-4m"
        ],
        "reveal": "$\\Delta=b^2-4ac=(-4)^2-4\\cdot1\\cdot m=16-4m$.",
        "formula": "\\Delta=(-4)^2-4\\cdot1\\cdot m=16-4m"
      },
      {
        "prompt": "Rozwiąż nierówność $16-4m>0$ ze względu na $m$ i podaj odpowiedź.",
        "kind": "input",
        "acceptedAnswers": [
          "m<4"
        ],
        "reveal": "$16-4m>0 \\Rightarrow -4m>-16 \\Rightarrow m<4$ (dzieląc przez $-4$, odwracamy znak nierówności).",
        "formula": "m<4"
      }
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Ten dział masz opanowany, jeśli sprawnie rozbijasz równania i nierówności z wartością bezwzględną na przypadki (i pamiętasz, żeby sprawdzić otrzymane rozwiązania), a w zadaniach z parametrem umiesz rozważyć wszystkie istotne przypadki — także te „brzegowe”, w których współczynnik przy najwyższej potędze się zeruje. Razem z poprzednimi trzema lekcjami masz teraz komplet narzędzi do rozwiązywania równań i nierówności na maturze rozszerzonej."
  }
]$content4$::jsonb,
  3
);

