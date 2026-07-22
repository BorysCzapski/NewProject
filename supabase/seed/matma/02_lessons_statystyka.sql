-- ============================================================================
-- supabase/seed/matma/02_lessons_statystyka.sql
-- Interactive lesson content (math_lessons) for the "statystyka" department:
-- Elementy statystyki opisowej (średnia arytmetyczna i ważona, mediana,
-- dominanta, rozstęp, wariancja, odchylenie standardowe — także liczone
-- z tabeli liczebności/szeregu rozdzielczego).
-- content is a jsonb array of MathBlock (see lib/matma/lesson-blocks.ts).
--
-- Idempotent: deletes existing lessons for this topic first. Run
-- 01_topics.sql BEFORE this file — it looks up topic_id by slug.
-- ============================================================================

delete from math_lessons
where topic_id = (select id from math_topics where slug = 'statystyka');

-- ----------------------------------------------------------------------------
-- Lesson 1: Średnia arytmetyczna, średnia ważona i mediana
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'statystyka'),
  $title1$Średnia arytmetyczna, średnia ważona i mediana$title1$,
  $content1$[
  {
    "type": "basics-recap",
    "title": "Zanim zaczniesz: czym są dane statystyczne i średnia arytmetyczna",
    "text": "Statystyka opisowa zajmuje się opisywaniem zbioru danych liczbowych (nazywanego też próbą lub szeregiem danych) za pomocą kilku liczb, które streszczają jego najważniejsze cechy. Najprostszą i najczęściej używaną miarą jest średnia arytmetyczna: sumujemy wszystkie wartości z próby i dzielimy sumę przez liczbę tych wartości $n$. Aby porządkować dane (co przyda się już w tej lekcji przy medianie), zapisujemy je rosnąco: od najmniejszej do największej.",
    "formula": "\\bar{x} = \\dfrac{x_1+x_2+\\cdots+x_n}{n}",
    "controlQuiz": [
      {
        "question": "Ile wynosi średnia arytmetyczna liczb $2, 4, 6$?",
        "options": [
          "$3$",
          "$4$",
          "$12$",
          "$2$"
        ],
        "correctIndex": 1,
        "explanation": "Sumujemy: $2+4+6=12$, a następnie dzielimy przez liczbę wartości: $12:3=4$."
      },
      {
        "question": "Zbiór danych $\\{5, 1, 3\\}$ zapisany rosnąco to:",
        "options": [
          "$1, 3, 5$",
          "$5, 3, 1$",
          "$1, 5, 3$",
          "$3, 1, 5$"
        ],
        "correctIndex": 0,
        "explanation": "Porządkujemy liczby od najmniejszej do największej: $1, 3, 5$."
      },
      {
        "question": "Ile elementów liczy próba (zbiór danych) $7, 2, 9, 4, 1$?",
        "options": [
          "$4$",
          "$5$",
          "$6$",
          "$3$"
        ],
        "correctIndex": 1,
        "explanation": "Wypisano pięć liczb, więc liczebność próby wynosi $n=5$."
      }
    ]
  },
  {
    "type": "examples",
    "title": "Obliczanie średniej arytmetycznej",
    "items": [
      {
        "problem": "2, 3, 3, 4, 5",
        "steps": [
          {
            "text": "Sumujemy wszystkie wartości.",
            "formula": "2+3+3+4+5=17"
          },
          {
            "text": "Dzielimy sumę przez liczbę wartości ($n=5$).",
            "formula": "\\bar{x}=\\dfrac{17}{5}"
          },
          {
            "text": "Zapisujemy wynik w postaci ułamka dziesiętnego.",
            "formula": "\\bar{x}=3{,}4"
          }
        ],
        "answer": "3{,}4"
      },
      {
        "problem": "-2, 0, 5, -1",
        "steps": [
          {
            "text": "Sumujemy wartości (pamiętając o znakach).",
            "formula": "-2+0+5+(-1)=2"
          },
          {
            "text": "Dzielimy przez $n=4$.",
            "formula": "\\bar{x}=\\dfrac{2}{4}=0{,}5"
          }
        ],
        "answer": "0{,}5"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Ile wynosi średnia arytmetyczna liczb $1, 2, 3, 4, 10$?",
    "options": [
      "$4$",
      "$4{,}5$",
      "$5$",
      "$3$"
    ],
    "correctIndex": 0,
    "explanation": "Suma: $1+2+3+4+10=20$, a $20:5=4$."
  },
  {
    "type": "definition",
    "term": "Średnia ważona",
    "text": "Czasem poszczególne wartości w zbiorze danych mają różne „znaczenie” (wagę) — np. oceny z różnych sprawdzianów mogą mieć różną wagę, albo pewna wartość powtarza się w danych kilka razy. Wtedy zamiast zwykłej średniej arytmetycznej liczymy średnią ważoną: każdą wartość $x_i$ mnożymy przez jej wagę $w_i$, sumujemy te iloczyny, a następnie dzielimy przez sumę wszystkich wag.",
    "formula": "\\bar{x}_w = \\dfrac{x_1w_1+x_2w_2+\\cdots+x_kw_k}{w_1+w_2+\\cdots+w_k}"
  },
  {
    "type": "examples",
    "title": "Obliczanie średniej ważonej",
    "items": [
      {
        "problem": "x_i:\\ 5, 4, 3 \\qquad w_i:\\ 2, 1, 1",
        "steps": [
          {
            "text": "Oceny i ich wagi: ocena $5$ z wagą $2$, ocena $4$ z wagą $1$, ocena $3$ z wagą $1$. Mnożymy każdą wartość przez jej wagę.",
            "formula": "5\\cdot2=10,\\quad4\\cdot1=4,\\quad3\\cdot1=3"
          },
          {
            "text": "Sumujemy te iloczyny.",
            "formula": "10+4+3=17"
          },
          {
            "text": "Sumujemy wagi.",
            "formula": "2+1+1=4"
          },
          {
            "text": "Dzielimy sumę iloczynów przez sumę wag.",
            "formula": "\\bar{x}_w=\\dfrac{17}{4}=4{,}25"
          }
        ],
        "answer": "4{,}25"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "W klasie 20 uczniów napisało sprawdzian: 12 osób dostało ocenę 4, a 8 osób ocenę 5. Jaka jest średnia ważona ocen w klasie?",
    "options": [
      "$4{,}4$",
      "$4{,}5$",
      "$4{,}6$",
      "$4{,}0$"
    ],
    "correctIndex": 0,
    "explanation": "$\\bar{x}_w=\\dfrac{4\\cdot12+5\\cdot8}{12+8}=\\dfrac{48+40}{20}=\\dfrac{88}{20}=4{,}4$."
  },
  {
    "type": "reveal-steps",
    "title": "Średnia ważona w praktyce",
    "problem": "W sklepie sprzedano w ciągu dnia: $3$ sztuki towaru po $10$ zł, $5$ sztuk po $12$ zł i $2$ sztuki po $15$ zł. Oblicz średnią cenę sprzedanego towaru (średnią ważoną).",
    "steps": [
      {
        "prompt": "Ile wynosi suma iloczynów cen i liczby sztuk (licznik średniej ważonej)?",
        "kind": "input",
        "acceptedAnswers": [
          "120"
        ],
        "reveal": "$3\\cdot10+5\\cdot12+2\\cdot15=30+60+30=120$.",
        "formula": "3\\cdot10+5\\cdot12+2\\cdot15=120"
      },
      {
        "prompt": "Ile wynosi suma wag, czyli łączna liczba sprzedanych sztuk?",
        "kind": "input",
        "acceptedAnswers": [
          "10"
        ],
        "reveal": "$3+5+2=10$ sztuk."
      },
      {
        "prompt": "Jaka jest średnia cena sprzedanego towaru?",
        "kind": "choice",
        "options": [
          "$12$ zł",
          "$10$ zł",
          "$15$ zł",
          "$14$ zł"
        ],
        "correctIndex": 0,
        "reveal": "$\\bar{x}_w=\\dfrac{120}{10}=12$ zł.",
        "formula": "\\bar{x}_w=\\dfrac{120}{10}=12"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Czym różni się średnia ważona od zwykłej średniej arytmetycznej?",
    "options": [
      "Średnia ważona uwzględnia różne wagi (znaczenie) poszczególnych wartości",
      "Średnia ważona to zawsze największa wartość w zbiorze",
      "Średnia ważona jest zawsze mniejsza od średniej arytmetycznej",
      "Nie ma żadnej różnicy — to dwie nazwy tego samego pojęcia"
    ],
    "correctIndex": 0,
    "explanation": "W średniej ważonej każda wartość jest mnożona przez swoją wagę, co pozwala uwzględnić, że niektóre wartości „liczą się bardziej” niż inne — np. powtarzają się częściej."
  },
  {
    "type": "definition",
    "term": "Mediana",
    "text": "Mediana to wartość środkowa uporządkowanego (rosnąco) zbioru danych — dzieli go na dwie równoliczne części: połowa danych jest od niej nie większa, a połowa nie mniejsza. Sposób jej wyznaczania zależy od tego, czy liczba danych $n$ jest nieparzysta, czy parzysta.",
    "formula": "n\\ \\text{nieparzyste}:\\ Me = x_{\\frac{n+1}{2}} \\qquad n\\ \\text{parzyste}:\\ Me = \\dfrac{x_{\\frac{n}{2}}+x_{\\frac{n}{2}+1}}{2}"
  },
  {
    "type": "table",
    "title": "Wyznaczanie mediany",
    "caption": "Dane muszą być wcześniej uporządkowane rosnąco.",
    "headers": [
      "Liczba danych $n$",
      "Sposób wyznaczenia mediany"
    ],
    "rows": [
      [
        "nieparzysta",
        "Mediana to wartość na środkowej pozycji: $Me=x_{\\frac{n+1}{2}}$."
      ],
      [
        "parzysta",
        "Mediana to średnia dwóch środkowych wartości: $Me=\\dfrac{x_{\\frac{n}{2}}+x_{\\frac{n}{2}+1}}{2}$."
      ]
    ]
  },
  {
    "type": "examples",
    "title": "Wyznaczanie mediany",
    "items": [
      {
        "problem": "3, 7, 1, 9, 4",
        "steps": [
          {
            "text": "Porządkujemy dane rosnąco.",
            "formula": "1, 3, 4, 7, 9"
          },
          {
            "text": "Liczba danych $n=5$ jest nieparzysta, więc medianą jest wartość środkowa (trzecia z pięciu).",
            "formula": "Me=4"
          }
        ],
        "answer": "4"
      },
      {
        "problem": "2, 8, 5, 3",
        "steps": [
          {
            "text": "Porządkujemy dane rosnąco.",
            "formula": "2, 3, 5, 8"
          },
          {
            "text": "Liczba danych $n=4$ jest parzysta, więc medianą jest średnia dwóch środkowych wartości.",
            "formula": "Me=\\dfrac{3+5}{2}"
          },
          {
            "text": "Obliczamy wynik.",
            "formula": "Me=4"
          }
        ],
        "answer": "4"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Wyznacz medianę zbioru danych $10, 2, 6, 8, 4$.",
    "options": [
      "$6$",
      "$8$",
      "$4$",
      "$5$"
    ],
    "correctIndex": 0,
    "explanation": "Po uporządkowaniu: $2,4,6,8,10$. Liczba danych jest nieparzysta ($n=5$), więc medianą jest środkowa wartość: $6$."
  },
  {
    "type": "reveal-steps",
    "title": "Mediana danych parzystych",
    "problem": "Zmierzone czasy (w minutach) sześciu uczniów biegnących na $1000$ m to: $5{,}2$, $4{,}8$, $6{,}1$, $5{,}0$, $4{,}9$, $5{,}5$. Wyznacz medianę tych czasów.",
    "steps": [
      {
        "prompt": "Uporządkuj dane rosnąco. Jaka jest najmniejsza wartość?",
        "kind": "input",
        "acceptedAnswers": [
          "4.8"
        ],
        "reveal": "Najmniejszy czas to $4{,}8$ min. Uporządkowany rosnąco ciąg to: $4{,}8, 4{,}9, 5{,}0, 5{,}2, 5{,}5, 6{,}1$."
      },
      {
        "prompt": "Liczba danych $n=6$ jest parzysta. Które dwie wartości są środkowe (trzecia i czwarta w kolejności)?",
        "kind": "choice",
        "options": [
          "$5{,}0$ i $5{,}2$",
          "$4{,}9$ i $5{,}0$",
          "$5{,}2$ i $5{,}5$",
          "$4{,}8$ i $6{,}1$"
        ],
        "correctIndex": 0,
        "reveal": "Środkowe wartości (na pozycjach $3$ i $4$) to $5{,}0$ oraz $5{,}2$."
      },
      {
        "prompt": "Ile wynosi mediana?",
        "kind": "input",
        "acceptedAnswers": [
          "5.1"
        ],
        "reveal": "$Me=\\dfrac{5{,}0+5{,}2}{2}=5{,}1$ minuty.",
        "formula": "Me=\\dfrac{5{,}0+5{,}2}{2}=5{,}1"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Dla jakiej liczby danych $n$ mediana jest średnią dwóch środkowych wartości?",
    "options": [
      "Gdy $n$ jest parzyste",
      "Gdy $n$ jest nieparzyste",
      "Zawsze",
      "Nigdy"
    ],
    "correctIndex": 0,
    "explanation": "Gdy liczba danych jest parzysta, nie ma jednej środkowej wartości — medianę liczymy jako średnią dwóch środkowych wartości uporządkowanego zbioru."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli sprawnie liczysz średnią arytmetyczną i średnią ważoną zbioru danych (także wtedy, gdy dane są pogrupowane w postaci wartość–waga/liczba wystąpień), a także bezbłędnie wyznaczasz medianę — pamiętając, że dane trzeba najpierw uporządkować rosnąco i że sposób odczytania mediany zależy od tego, czy liczba danych jest parzysta, czy nieparzysta."
  }
]$content1$::jsonb,
  0
);

-- ----------------------------------------------------------------------------
-- Lesson 2: Dominanta, rozstęp, wariancja i odchylenie standardowe
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'statystyka'),
  $title2$Dominanta, rozstęp, wariancja i odchylenie standardowe$title2$,
  $content2$[
  {
    "type": "intro",
    "text": "Średnia i mediana mówią, gdzie w przybliżeniu „leżą” dane, ale nic nie mówią o tym, jak bardzo dane są rozproszone (rozrzucone) wokół tej wartości. W tej lekcji poznasz dominantę oraz rozstęp — proste miary opisowe — a przede wszystkim wariancję i odchylenie standardowe, które są głównym narzędziem do mierzenia rozproszenia danych na maturze."
  },
  {
    "type": "definition",
    "term": "Dominanta (moda)",
    "text": "Dominantą (modą) zbioru danych nazywamy wartość, która występuje w nim najczęściej. Zbiór danych może mieć jedną dominantę, kilka dominant (gdy kilka wartości występuje najczęściej, po tyle samo razy) albo — jeśli wszystkie wartości występują tyle samo razy — nie mieć dominanty w ogóle."
  },
  {
    "type": "examples",
    "title": "Wyznaczanie dominanty",
    "items": [
      {
        "problem": "2, 3, 3, 5, 3, 7",
        "steps": [
          {
            "text": "Zliczamy, ile razy występuje każda wartość: $2$ — raz, $3$ — trzy razy, $5$ — raz, $7$ — raz."
          },
          {
            "text": "Najczęściej występuje wartość $3$, więc to ona jest dominantą."
          }
        ],
        "answer": "3"
      },
      {
        "problem": "4, 4, 5, 5, 6",
        "steps": [
          {
            "text": "Wartość $4$ występuje dwa razy, wartość $5$ również dwa razy, a $6$ tylko raz."
          },
          {
            "text": "Dwie wartości występują najczęściej (po dwa razy) — zbiór ma dwie dominanty."
          }
        ],
        "answer": "4\\ \\text{i}\\ 5"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Jaka jest dominanta zbioru danych $1, 2, 2, 2, 3, 4$?",
    "options": [
      "$2$",
      "$1$",
      "$4$",
      "$2{,}4$"
    ],
    "correctIndex": 0,
    "explanation": "Wartość $2$ występuje trzy razy — częściej niż jakakolwiek inna wartość w zbiorze."
  },
  {
    "type": "definition",
    "term": "Rozstęp",
    "text": "Rozstęp to najprostsza miara rozproszenia danych — różnica między największą a najmniejszą wartością w zbiorze. Mówi, jak szeroki jest „przedział”, w którym mieszczą się wszystkie dane, ale jest bardzo wrażliwy na pojedyncze skrajne wartości (odstające).",
    "formula": "R = x_{max} - x_{min}"
  },
  {
    "type": "quiz",
    "question": "Oblicz rozstęp zbioru danych $12, 7, 15, 9, 3$.",
    "options": [
      "$12$",
      "$15$",
      "$9$",
      "$3$"
    ],
    "correctIndex": 0,
    "explanation": "$x_{max}=15$, $x_{min}=3$, więc rozstęp wynosi $R=15-3=12$."
  },
  {
    "type": "definition",
    "term": "Wariancja",
    "text": "Wariancja mierzy przeciętne (kwadratowe) odchylenie danych od ich średniej arytmetycznej. Dla każdej wartości obliczamy różnicę od średniej, podnosimy ją do kwadratu (żeby odchylenia dodatnie i ujemne się nie znosiły), a następnie liczymy średnią arytmetyczną tych kwadratów.",
    "formula": "\\sigma^2 = \\dfrac{(x_1-\\bar{x})^2+(x_2-\\bar{x})^2+\\cdots+(x_n-\\bar{x})^2}{n}"
  },
  {
    "type": "examples",
    "title": "Obliczanie wariancji",
    "items": [
      {
        "problem": "2, 4, 6, 8",
        "steps": [
          {
            "text": "Obliczamy średnią arytmetyczną.",
            "formula": "\\bar{x}=\\dfrac{2+4+6+8}{4}=5"
          },
          {
            "text": "Obliczamy odchylenia każdej wartości od średniej.",
            "formula": "2-5=-3,\\ 4-5=-1,\\ 6-5=1,\\ 8-5=3"
          },
          {
            "text": "Podnosimy każde odchylenie do kwadratu.",
            "formula": "(-3)^2=9,\\ (-1)^2=1,\\ 1^2=1,\\ 3^2=9"
          },
          {
            "text": "Sumujemy kwadraty odchyleń i dzielimy przez $n=4$.",
            "formula": "\\sigma^2=\\dfrac{9+1+1+9}{4}=\\dfrac{20}{4}=5"
          }
        ],
        "answer": "5"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Oblicz wariancję zbioru danych $1, 2, 3, 4, 5$.",
    "options": [
      "$2$",
      "$1{,}5$",
      "$3$",
      "$\\sqrt{2}$"
    ],
    "correctIndex": 0,
    "explanation": "Średnia wynosi $\\bar{x}=3$. Odchylenia od średniej: $-2,-1,0,1,2$, ich kwadraty: $4,1,0,1,4$, suma kwadratów: $10$. Wariancja: $\\sigma^2=\\dfrac{10}{5}=2$."
  },
  {
    "type": "definition",
    "term": "Odchylenie standardowe",
    "text": "Odchylenie standardowe to pierwiastek kwadratowy z wariancji. Ma tę zaletę, że jest wyrażone w tej samej jednostce co dane (wariancja jest w jednostce podniesionej do kwadratu), dzięki czemu łatwiej je interpretować jako „przeciętne odchylenie od średniej”.",
    "formula": "\\sigma = \\sqrt{\\sigma^2}"
  },
  {
    "type": "formula",
    "title": "Wariancja i odchylenie standardowe — podsumowanie wzorów",
    "caption": "Wzory dla danych „surowych” (niepogrupowanych) $x_1, x_2, \\ldots, x_n$.",
    "expression": "\\sigma^2 = \\dfrac{1}{n}\\sum_{i=1}^n (x_i-\\bar{x})^2, \\qquad \\sigma=\\sqrt{\\sigma^2}",
    "variables": [
      {
        "symbol": "n",
        "meaning": "liczba wszystkich danych w zbiorze"
      },
      {
        "symbol": "\\bar{x}",
        "meaning": "średnia arytmetyczna zbioru danych"
      },
      {
        "symbol": "\\sigma^2",
        "meaning": "wariancja"
      },
      {
        "symbol": "\\sigma",
        "meaning": "odchylenie standardowe"
      }
    ]
  },
  {
    "type": "reveal-steps",
    "title": "Obliczanie odchylenia standardowego krok po kroku",
    "problem": "Oblicz odchylenie standardowe zbioru danych: $3, 5, 7, 9, 11$.",
    "steps": [
      {
        "prompt": "Ile wynosi średnia arytmetyczna tych danych?",
        "kind": "input",
        "acceptedAnswers": [
          "7"
        ],
        "reveal": "$\\bar{x}=\\dfrac{3+5+7+9+11}{5}=\\dfrac{35}{5}=7$."
      },
      {
        "prompt": "Ile wynosi suma kwadratów odchyleń od średniej?",
        "kind": "input",
        "acceptedAnswers": [
          "40"
        ],
        "reveal": "Odchylenia od średniej: $-4,-2,0,2,4$; ich kwadraty: $16,4,0,4,16$; suma: $16+4+0+4+16=40$.",
        "formula": "16+4+0+4+16=40"
      },
      {
        "prompt": "Ile wynosi wariancja?",
        "kind": "input",
        "acceptedAnswers": [
          "8"
        ],
        "reveal": "$\\sigma^2=\\dfrac{40}{5}=8$."
      },
      {
        "prompt": "Ile wynosi odchylenie standardowe (dokładna wartość, z pierwiastkiem)?",
        "kind": "choice",
        "options": [
          "$2\\sqrt2$",
          "$4$",
          "$8$",
          "$2\\sqrt5$"
        ],
        "correctIndex": 0,
        "reveal": "$\\sigma=\\sqrt8=\\sqrt{4\\cdot2}=2\\sqrt2\\approx2{,}83$.",
        "formula": "\\sigma=\\sqrt8=2\\sqrt2"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Odchylenie standardowe to:",
    "options": [
      "Pierwiastek kwadratowy z wariancji",
      "Kwadrat wariancji",
      "Różnica między maksimum a minimum",
      "Średnia arytmetyczna odchyleń od średniej (bez podnoszenia do kwadratu)"
    ],
    "correctIndex": 0,
    "explanation": "Odchylenie standardowe $\\sigma$ definiujemy jako pierwiastek kwadratowy z wariancji: $\\sigma=\\sqrt{\\sigma^2}$."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Częsty błąd: licząc wariancję, pamiętaj o podniesieniu KAŻDEGO odchylenia do kwadratu, zanim je zsumujesz — nie wolno najpierw zsumować odchyleń (i tak zawsze wyjdzie $0$!), a dopiero potem podnosić do kwadratu. Pamiętaj też, że w tym kursie wariancję liczymy zawsze dzieląc przez $n$ (liczbę wszystkich danych), a nie przez $n-1$."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli potrafisz wskazać dominantę i obliczyć rozstęp zbioru danych, a przede wszystkim — krok po kroku, bez pomyłek — obliczyć wariancję (średnią kwadratów odchyleń od średniej) oraz odchylenie standardowe (pierwiastek z wariancji) i rozumiesz, że są to miary tego, jak bardzo dane są rozproszone wokół średniej."
  }
]$content2$::jsonb,
  1
);

-- ----------------------------------------------------------------------------
-- Lesson 3: Statystyka danych w tabeli i porównywanie zestawów danych
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'statystyka'),
  $title3$Statystyka danych w tabeli i porównywanie zestawów danych$title3$,
  $content3$[
  {
    "type": "intro",
    "text": "W zadaniach maturalnych dane bardzo często są podane w postaci tabeli: wartość $x_i$ i liczba jej wystąpień (liczebność) $n_i$ — to tzw. szereg rozdzielczy punktowy. W tej lekcji nauczysz się liczyć średnią, medianę, wariancję i odchylenie standardowe wprost z takiej tabeli oraz porównywać rozproszenie dwóch zestawów danych."
  },
  {
    "type": "definition",
    "term": "Średnia z tabeli liczebności (szeregu rozdzielczego)",
    "text": "Gdy dane są podane w tabeli — wartość $x_i$ i liczba jej wystąpień $n_i$ — średnią liczymy tak samo jak średnią ważoną: wagami są liczebności $n_i$, a sumą wszystkich wag jest liczba wszystkich danych $N=n_1+n_2+\\cdots+n_k$.",
    "formula": "\\bar{x} = \\dfrac{x_1n_1+x_2n_2+\\cdots+x_kn_k}{N}, \\qquad N=n_1+n_2+\\cdots+n_k"
  },
  {
    "type": "table",
    "title": "Liczba rodzeństwa uczniów w klasie",
    "caption": "Ankietę przeprowadzono wśród 20 uczniów.",
    "headers": [
      "Liczba rodzeństwa $x_i$",
      "Liczba uczniów $n_i$"
    ],
    "rows": [
      [
        "0",
        "4"
      ],
      [
        "1",
        "9"
      ],
      [
        "2",
        "5"
      ],
      [
        "3",
        "2"
      ]
    ]
  },
  {
    "type": "examples",
    "title": "Średnia z tabeli liczebności",
    "items": [
      {
        "problem": "x_i:\\ 0, 1, 2, 3 \\qquad n_i:\\ 4, 9, 5, 2",
        "steps": [
          {
            "text": "Korzystając z powyższej tabeli (liczba rodzeństwa uczniów), mnożymy każdą wartość przez jej liczebność.",
            "formula": "0\\cdot4=0,\\ \\ 1\\cdot9=9,\\ \\ 2\\cdot5=10,\\ \\ 3\\cdot2=6"
          },
          {
            "text": "Sumujemy te iloczyny.",
            "formula": "0+9+10+6=25"
          },
          {
            "text": "Dzielimy przez łączną liczbę uczniów $N=20$.",
            "formula": "\\bar{x}=\\dfrac{25}{20}=1{,}25"
          }
        ],
        "answer": "1{,}25"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Ile wynosi mediana liczby rodzeństwa w powyższej tabeli (20 uczniów)?",
    "options": [
      "$1$",
      "$0$",
      "$2$",
      "$1{,}5$"
    ],
    "correctIndex": 0,
    "explanation": "Uporządkowane dane to: cztery zera, dziewięć jedynek, pięć dwójek i dwie trójki (razem $20$ liczb). Środkowe pozycje ($10.$ i $11.$ wartość) mieszczą się wśród dziewięciu jedynek (pozycje od $5$ do $13$), więc obie środkowe wartości to $1$ — mediana wynosi $1$."
  },
  {
    "type": "definition",
    "term": "Wariancja i odchylenie standardowe z tabeli liczebności",
    "text": "Dla danych podanych w tabeli wartość–liczebność wariancję liczymy analogicznie: każde odchylenie od średniej podnosimy do kwadratu, mnożymy przez odpowiadającą mu liczebność, sumujemy i dzielimy przez łączną liczbę danych $N$.",
    "formula": "\\sigma^2 = \\dfrac{n_1(x_1-\\bar{x})^2+n_2(x_2-\\bar{x})^2+\\cdots+n_k(x_k-\\bar{x})^2}{N}"
  },
  {
    "type": "table",
    "title": "Wyniki testu (w punktach) w małej grupie uczniów",
    "caption": "$N=4$ uczniów.",
    "headers": [
      "Wynik $x_i$",
      "Liczba uczniów $n_i$"
    ],
    "rows": [
      [
        "2",
        "1"
      ],
      [
        "4",
        "2"
      ],
      [
        "6",
        "1"
      ]
    ]
  },
  {
    "type": "reveal-steps",
    "title": "Wariancja z tabeli liczebności",
    "problem": "Korzystając z powyższej tabeli, oblicz wariancję i odchylenie standardowe wyników testu.",
    "steps": [
      {
        "prompt": "Najpierw oblicz średnią. Ile ona wynosi?",
        "kind": "input",
        "acceptedAnswers": [
          "4"
        ],
        "reveal": "$\\bar{x}=\\dfrac{2\\cdot1+4\\cdot2+6\\cdot1}{4}=\\dfrac{2+8+6}{4}=\\dfrac{16}{4}=4$."
      },
      {
        "prompt": "Ile wynosi suma $n_i\\cdot(x_i-\\bar{x})^2$ dla wszystkich wierszy tabeli?",
        "kind": "input",
        "acceptedAnswers": [
          "8"
        ],
        "reveal": "Odchylenia od średniej: $2-4=-2$, $4-4=0$, $6-4=2$. Ważone kwadraty: $1\\cdot(-2)^2=4$, $2\\cdot0^2=0$, $1\\cdot2^2=4$. Suma: $4+0+4=8$.",
        "formula": "1\\cdot(-2)^2+2\\cdot0^2+1\\cdot2^2=4+0+4=8"
      },
      {
        "prompt": "Ile wynosi wariancja?",
        "kind": "input",
        "acceptedAnswers": [
          "2"
        ],
        "reveal": "$\\sigma^2=\\dfrac{8}{4}=2$."
      },
      {
        "prompt": "Ile wynosi odchylenie standardowe (dokładna wartość, z pierwiastkiem)?",
        "kind": "choice",
        "options": [
          "$\\sqrt2$",
          "$2$",
          "$4$",
          "$\\sqrt8$"
        ],
        "correctIndex": 0,
        "reveal": "$\\sigma=\\sqrt{\\sigma^2}=\\sqrt2\\approx1{,}41$.",
        "formula": "\\sigma=\\sqrt2"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Odchylenie standardowe otrzymane w powyższym przykładzie ($\\sqrt2\\approx1{,}41$) mówi, że wyniki uczniów:",
    "options": [
      "Przeciętnie odchylają się od średniej o około $1{,}41$ punktu",
      "Są identyczne dla każdego ucznia",
      "Mają rozstęp równy $2$",
      "Mają medianę równą $2$"
    ],
    "correctIndex": 0,
    "explanation": "Odchylenie standardowe to przeciętne odchylenie wartości od średniej — tutaj wynosi ono $\\sqrt2\\approx1{,}41$ punktu."
  },
  {
    "type": "definition",
    "term": "Porównywanie rozproszenia dwóch zestawów danych",
    "text": "Odchylenie standardowe pozwala porównać, który z dwóch zestawów danych jest bardziej „rozrzucony” wokół swojej średniej. Im większe odchylenie standardowe, tym dane są bardziej zróżnicowane (mniej skupione wokół średniej); im mniejsze — tym bardziej wyniki są do siebie zbliżone. Takie porównanie ma największy sens, gdy oba zestawy danych mają zbliżone średnie lub są wyrażone w tych samych jednostkach."
  },
  {
    "type": "examples",
    "title": "Porównanie rozproszenia dwóch grup wyników",
    "items": [
      {
        "problem": "A:\\ 5, 5, 5, 5 \\qquad B:\\ 1, 5, 5, 9",
        "steps": [
          {
            "text": "Obie grupy mają tę samą średnią: $\\bar{x}=5$. W grupie A wszystkie wyniki są identyczne, więc każde odchylenie od średniej wynosi $0$.",
            "formula": "\\sigma_A^2=0,\\quad\\sigma_A=0"
          },
          {
            "text": "W grupie B liczymy odchylenia od średniej: $1-5=-4$, $5-5=0$, $5-5=0$, $9-5=4$.",
            "formula": "(-4)^2+0^2+0^2+4^2=16+0+0+16=32"
          },
          {
            "text": "Obliczamy wariancję i odchylenie standardowe grupy B.",
            "formula": "\\sigma_B^2=\\dfrac{32}{4}=8,\\quad\\sigma_B=\\sqrt8=2\\sqrt2\\approx2{,}83"
          },
          {
            "text": "Porównujemy odchylenia standardowe: grupa B ma większe rozproszenie wyników, bo $\\sigma_B>\\sigma_A$."
          }
        ],
        "answer": "\\sigma_A=0,\\ \\ \\sigma_B=2\\sqrt2"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Jeśli odchylenie standardowe zestawu danych wynosi $0$, to oznacza to, że:",
    "options": [
      "Wszystkie wartości w zestawie są sobie równe",
      "Średnia arytmetyczna wynosi $0$",
      "W zestawie jest tylko jedna dana",
      "Mediana jest równa rozstępowi"
    ],
    "correctIndex": 0,
    "explanation": "Odchylenie standardowe równe $0$ oznacza, że wszystkie wartości pokrywają się ze średnią — czyli są identyczne."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Średnia arytmetyczna jest bardzo wrażliwa na wartości odstające (skrajne) — jedna bardzo duża lub bardzo mała liczba potrafi znacząco ją zmienić. Mediana jest na to znacznie odporniejsza, bo zależy tylko od „środka” uporządkowanych danych. Na przykład dla danych $2, 3, 4, 5, 100$ średnia wynosi $22{,}8$, a mediana tylko $4$ — mediana znacznie lepiej opisuje „typową” wartość w tym zbiorze."
  },
  {
    "type": "quiz",
    "question": "Dlaczego w zbiorze danych zawierającym wartość znacznie odstającą (np. bardzo wysoką pensję w grupie pracowników) mediana bywa lepszą miarą „typowej” wartości niż średnia?",
    "options": [
      "Bo mediana nie jest tak wrażliwa na pojedyncze skrajne wartości jak średnia",
      "Bo mediana zawsze jest większa od średniej",
      "Bo mediany nie da się obliczyć, gdy są wartości odstające",
      "Bo średnia zawsze jest błędna"
    ],
    "correctIndex": 0,
    "explanation": "Mediana zależy tylko od położenia środkowych wartości w uporządkowanym zbiorze, więc pojedyncza bardzo duża lub mała wartość nie wpływa na nią tak mocno, jak na średnią arytmetyczną."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli potrafisz obliczyć średnią, medianę, wariancję i odchylenie standardowe wprost z tabeli liczebności (szeregu rozdzielczego), umiesz na podstawie odchylenia standardowego porównać rozproszenie dwóch zestawów danych oraz rozumiesz, dlaczego mediana bywa odporniejsza na wartości odstające niż średnia arytmetyczna. To domyka cały dział statystyki opisowej."
  }
]$content3$::jsonb,
  2
);

