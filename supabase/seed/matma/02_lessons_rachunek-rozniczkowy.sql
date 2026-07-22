-- ============================================================================
-- supabase/seed/matma/02_lessons_rachunek-rozniczkowy.sql
-- Interactive lesson content (math_lessons) for the "rachunek-rozniczkowy"
-- department: pochodna funkcji, interpretacja geometryczna (styczna do
-- wykresu), monotoniczność i ekstrema z pochodnej, zadania optymalizacyjne
-- z kontekstem praktycznym.
-- content is a jsonb array of MathBlock (see lib/matma/lesson-blocks.ts).
--
-- Idempotent: deletes existing lessons for this topic first. Run
-- 01_topics.sql BEFORE this file — it looks up topic_id by slug.
-- ============================================================================

delete from math_lessons
where topic_id = (select id from math_topics where slug = 'rachunek-rozniczkowy');

-- ----------------------------------------------------------------------------
-- Lesson 1: Pochodna funkcji — definicja i interpretacja geometryczna
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'rachunek-rozniczkowy'),
  $title1$Pochodna funkcji — definicja i interpretacja geometryczna$title1$,
  $content1$[
  {
    "type": "basics-recap",
    "title": "Zanim zaczniesz: nachylenie prostej, sieczna i granica funkcji",
    "text": "Współczynnik kierunkowy prostej przechodzącej przez dwa punkty $A(x_1,y_1)$ i $B(x_2,y_2)$ to $a=\\dfrac{y_2-y_1}{x_2-x_1}$ — liczba mówiąca, jak bardzo prosta jest „stroma” i czy rośnie, czy maleje. Dla wykresu dowolnej funkcji, prosta przechodząca przez dwa jego punkty nazywa się sieczną. Iloraz $\\dfrac{f(x_2)-f(x_1)}{x_2-x_1}$ to właśnie współczynnik kierunkowy takiej siecznej — mówi, jak szybko średnio zmienia się wartość funkcji między $x_1$ a $x_2$. Potrzebna będzie też intuicja granicy: gdy mówimy, że pewna wielkość $h$ „dąży do zera”, mamy na myśli, że przyjmuje wartości coraz bliższe zeru (ale różne od zera), a wyrażenie zależne od $h$ może wtedy zbliżać się do konkretnej, dobrze określonej liczby — nawet jeśli podstawienie $h=0$ wprost dałoby wyrażenie nieokreślone typu $\\frac{0}{0}$. Właśnie na tej idei opiera się definicja pochodnej.",
    "formula": "a=\\dfrac{y_2-y_1}{x_2-x_1}",
    "controlQuiz": [
      {
        "question": "Współczynnik kierunkowy prostej przechodzącej przez punkty $A(1,2)$ i $B(3,8)$ wynosi:",
        "options": [
          "$3$",
          "$6$",
          "$2$",
          "$4$"
        ],
        "correctIndex": 0,
        "explanation": "$a=\\dfrac{8-2}{3-1}=\\dfrac{6}{2}=3$."
      },
      {
        "question": "Sieczna wykresu funkcji to prosta, która:",
        "options": [
          "przechodzi przez dwa punkty wykresu funkcji",
          "jest styczna do wykresu w jednym punkcie",
          "jest zawsze pozioma",
          "ma zawsze dodatni współczynnik kierunkowy"
        ],
        "correctIndex": 0,
        "explanation": "Sieczna to prosta przechodząca przez dwa (różne) punkty wykresu funkcji."
      },
      {
        "question": "Stwierdzenie „$h$ dąży do $0$” oznacza, że:",
        "options": [
          "$h$ przyjmuje wartości coraz bliższe zeru, ale różne od zera",
          "$h$ jest zawsze równe zeru",
          "$h$ rośnie do nieskończoności",
          "$h$ jest liczbą ujemną"
        ],
        "correctIndex": 0,
        "explanation": "„Dążenie do zera” to zbliżanie się wartości do $0$ bez konieczności jego osiągnięcia — to sedno pojęcia granicy."
      }
    ]
  },
  {
    "type": "intro",
    "text": "Pochodna funkcji to jedno z najważniejszych narzędzi rachunku różniczkowego — pozwala precyzyjnie opisać, jak szybko zmienia się funkcja w konkretnym punkcie, wyznaczyć styczną do wykresu, zbadać monotoniczność i ekstrema, a także rozwiązywać zadania optymalizacyjne (np. „jakie wymiary powinien mieć prostokąt o zadanym obwodzie, aby jego pole było największe?”). W tej lekcji poznasz definicję pochodnej oraz jej interpretację geometryczną."
  },
  {
    "type": "definition",
    "term": "Iloraz różnicowy",
    "text": "Ilorazem różnicowym funkcji $f$ między punktami $x_0$ a $x_0+h$ (gdzie $h\\neq0$) nazywamy wyrażenie $\\dfrac{f(x_0+h)-f(x_0)}{h}$. Jest to średnie tempo zmian funkcji na przedziale między $x_0$ a $x_0+h$ — geometrycznie: współczynnik kierunkowy siecznej przechodzącej przez punkty $(x_0,f(x_0))$ oraz $(x_0+h,f(x_0+h))$.",
    "formula": "\\dfrac{f(x_0+h)-f(x_0)}{h}"
  },
  {
    "type": "formula",
    "title": "Definicja pochodnej funkcji w punkcie",
    "expression": "f'(x_0) = \\lim_{h\\to0} \\dfrac{f(x_0+h)-f(x_0)}{h}",
    "variables": [
      {
        "symbol": "x_0",
        "meaning": "punkt, w którym liczymy pochodną"
      },
      {
        "symbol": "h",
        "meaning": "przyrost argumentu, dążący do zera"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Pochodna funkcji w punkcie $x_0$ to granica, do której dąży:",
    "options": [
      "iloraz różnicowy, gdy $h\\to0$",
      "wartość funkcji, gdy $x\\to\\infty$",
      "iloczyn $f(x_0)\\cdot h$",
      "suma $f(x_0)+h$"
    ],
    "correctIndex": 0,
    "explanation": "Z definicji $f'(x_0)=\\lim_{h\\to0}\\dfrac{f(x_0+h)-f(x_0)}{h}$ — pochodna to granica ilorazu różnicowego przy $h$ dążącym do zera."
  },
  {
    "type": "reveal-steps",
    "title": "Obliczanie pochodnej z definicji w konkretnym punkcie",
    "problem": "Korzystając z definicji pochodnej, oblicz $f'(3)$ dla funkcji $f(x)=x^2$.",
    "steps": [
      {
        "prompt": "Zapisz iloraz różnicowy $\\dfrac{f(3+h)-f(3)}{h}$, podstawiając $f(x)=x^2$.",
        "kind": "choice",
        "options": [
          "$\\dfrac{(3+h)^2-9}{h}$",
          "$\\dfrac{(3+h)-3}{h}$",
          "$\\dfrac{9+h^2}{h}$",
          "$\\dfrac{2\\cdot3}{h}$"
        ],
        "correctIndex": 0,
        "reveal": "Podstawiamy $f(3+h)=(3+h)^2$ oraz $f(3)=3^2=9$."
      },
      {
        "prompt": "Rozwiń i uprość licznik $(3+h)^2-9$.",
        "kind": "input",
        "acceptedAnswers": [
          "6h+h^2",
          "h^2+6h"
        ],
        "reveal": "$(3+h)^2-9=9+6h+h^2-9=6h+h^2$.",
        "formula": "(3+h)^2-9=6h+h^2"
      },
      {
        "prompt": "Podziel licznik przez $h$ (dla $h\\neq0$) i uprość.",
        "kind": "input",
        "acceptedAnswers": [
          "6+h"
        ],
        "reveal": "$\\dfrac{6h+h^2}{h}=6+h$.",
        "formula": "\\dfrac{6h+h^2}{h}=6+h"
      },
      {
        "prompt": "Oblicz granicę $\\lim_{h\\to0}(6+h)$ — to szukana wartość $f'(3)$.",
        "kind": "input",
        "acceptedAnswers": [
          "6"
        ],
        "reveal": "Gdy $h\\to0$, wyrażenie $6+h$ dąży do $6$. Zatem $f'(3)=6$, co zgadza się ze wzorem $f'(x)=2x$: $f'(3)=2\\cdot3=6$.",
        "formula": "f'(3)=6"
      }
    ]
  },
  {
    "type": "table",
    "title": "Wzory pochodnych funkcji elementarnych",
    "caption": "Te wzory warto znać na pamięć — pozwalają różniczkować bez wracania do definicji.",
    "headers": [
      "Funkcja $f(x)$",
      "Pochodna $f'(x)$"
    ],
    "rows": [
      [
        "$c$ (stała)",
        "$0$"
      ],
      [
        "$x$",
        "$1$"
      ],
      [
        "$x^n$",
        "$nx^{n-1}$"
      ],
      [
        "$\\sqrt{x}$",
        "$\\dfrac{1}{2\\sqrt{x}}$"
      ],
      [
        "$\\sin x$",
        "$\\cos x$"
      ],
      [
        "$\\cos x$",
        "$-\\sin x$"
      ],
      [
        "$e^x$",
        "$e^x$"
      ],
      [
        "$\\ln x$",
        "$\\dfrac{1}{x}$"
      ]
    ]
  },
  {
    "type": "quiz",
    "question": "Pochodna funkcji $f(x)=x^5$ to:",
    "options": [
      "$5x^4$",
      "$x^4$",
      "$5x^5$",
      "$4x^4$"
    ],
    "correctIndex": 0,
    "explanation": "Ze wzoru $(x^n)'=nx^{n-1}$ dla $n=5$ otrzymujemy $5x^{5-1}=5x^4$."
  },
  {
    "type": "definition",
    "term": "Styczna do wykresu funkcji",
    "text": "Styczna do wykresu funkcji $f$ w punkcie $(x_0,f(x_0))$ to prosta, która w tym punkcie „przylega” do wykresu — jest granicznym położeniem siecznych przechodzących przez ten punkt i punkt sąsiedni, gdy odległość między nimi dąży do zera. Jej współczynnik kierunkowy jest równy wartości pochodnej funkcji w tym punkcie, $f'(x_0)$. To najważniejsza interpretacja geometryczna pochodnej.",
    "formula": "a_{\\text{styczna}} = f'(x_0)"
  },
  {
    "type": "formula",
    "title": "Równanie stycznej do wykresu funkcji w punkcie $x_0$",
    "expression": "y = f(x_0) + f'(x_0)(x-x_0)",
    "variables": [
      {
        "symbol": "x_0",
        "meaning": "odcięta punktu styczności"
      },
      {
        "symbol": "f(x_0)",
        "meaning": "wartość funkcji w punkcie styczności"
      },
      {
        "symbol": "f'(x_0)",
        "meaning": "współczynnik kierunkowy stycznej"
      }
    ]
  },
  {
    "type": "examples",
    "title": "Wyznaczanie równania stycznej",
    "items": [
      {
        "problem": "f(x)=x^2, \\quad \\text{wyznacz równanie stycznej w punkcie } x_0=1",
        "steps": [
          {
            "text": "Obliczamy wartość funkcji w punkcie styczności.",
            "formula": "f(1)=1^2=1"
          },
          {
            "text": "Obliczamy pochodną funkcji i jej wartość w punkcie $x_0=1$.",
            "formula": "f'(x)=2x \\implies f'(1)=2"
          },
          {
            "text": "Podstawiamy do wzoru na styczną $y=f(x_0)+f'(x_0)(x-x_0)$.",
            "formula": "y=1+2(x-1)=2x-1"
          }
        ],
        "answer": "y=2x-1"
      },
      {
        "problem": "f(x)=x^3, \\quad \\text{wyznacz równanie stycznej w punkcie } x_0=-1",
        "steps": [
          {
            "text": "Obliczamy wartość funkcji w punkcie styczności.",
            "formula": "f(-1)=(-1)^3=-1"
          },
          {
            "text": "Obliczamy pochodną i jej wartość w $x_0=-1$.",
            "formula": "f'(x)=3x^2 \\implies f'(-1)=3"
          },
          {
            "text": "Podstawiamy do wzoru na styczną.",
            "formula": "y=-1+3(x-(-1))=3x+2"
          }
        ],
        "answer": "y=3x+2"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Współczynnik kierunkowy stycznej do wykresu funkcji $f$ w punkcie $x_0$ jest równy:",
    "options": [
      "$f'(x_0)$",
      "$f(x_0)$",
      "$x_0$",
      "$f''(x_0)$"
    ],
    "correctIndex": 0,
    "explanation": "Z definicji stycznej jej współczynnik kierunkowy to wartość pochodnej funkcji w punkcie styczności, $f'(x_0)$."
  },
  {
    "type": "function-plot",
    "title": "Zobacz pochodną jako nachylenie stycznej",
    "caption": "Funkcja $f(x)=ax^2+bx+c$ zmienia kształt wraz z suwakami $a$, $b$, $c$. Zwróć uwagę, jak zmienia się „stromizna” wykresu w różnych miejscach — to właśnie ta stromizna, precyzyjnie zdefiniowana, jest wartością pochodnej w danym punkcie.",
    "expression": "a*x*x + b*x + c",
    "params": [
      {
        "symbol": "a",
        "label": "Współczynnik przy $x^2$",
        "min": -3,
        "max": 3,
        "step": 0.5,
        "default": 1
      },
      {
        "symbol": "b",
        "label": "Współczynnik przy $x$",
        "min": -5,
        "max": 5,
        "step": 1,
        "default": 0
      },
      {
        "symbol": "c",
        "label": "Wyraz wolny",
        "min": -5,
        "max": 5,
        "step": 1,
        "default": 0
      }
    ],
    "domain": [-6, 6]
  },
  {
    "type": "quiz",
    "question": "Jeśli pochodna funkcji w punkcie $x_0$ jest dodatnia, to styczna do wykresu w tym punkcie:",
    "options": [
      "jest rosnąca (skierowana „w górę”)",
      "jest malejąca",
      "jest pozioma",
      "nie istnieje"
    ],
    "correctIndex": 0,
    "explanation": "Dodatni współczynnik kierunkowy $f'(x_0)>0$ oznacza, że styczna (a więc lokalnie i sama funkcja) rośnie w tym punkcie."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli rozumiesz, że pochodna to granica ilorazu różnicowego i potrafisz intuicyjnie wytłumaczyć, co to znaczy, znasz na pamięć podstawowe wzory pochodnych ($x^n$, $\\sin x$, $\\cos x$, $e^x$, $\\ln x$) oraz umiesz wyznaczyć równanie stycznej do wykresu funkcji w danym punkcie, korzystając ze wzoru $y=f(x_0)+f'(x_0)(x-x_0)$."
  }
]$content1$::jsonb,
  0
);

-- ----------------------------------------------------------------------------
-- Lesson 2: Reguły różniczkowania — suma, iloczyn, iloraz, funkcja złożona
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'rachunek-rozniczkowy'),
  $title2$Reguły różniczkowania: suma, iloczyn, iloraz i funkcja złożona$title2$,
  $content2$[
  {
    "type": "intro",
    "text": "Obliczanie pochodnej wprost z definicji (jako granicy ilorazu różnicowego) jest czasochłonne. W tej lekcji poznasz reguły różniczkowania, które pozwalają szybko różniczkować sumy, iloczyny, ilorazy oraz funkcje złożone, korzystając z tabeli pochodnych podstawowych funkcji z poprzedniej lekcji."
  },
  {
    "type": "definition",
    "term": "Pochodna sumy i różnicy funkcji",
    "text": "Pochodna sumy (lub różnicy) dwóch funkcji różniczkowalnych jest równa sumie (różnicy) ich pochodnych. Stałą liczbową można „wyciągnąć” przed znak pochodnej.",
    "formula": "(f(x)\\pm g(x))' = f'(x)\\pm g'(x), \\qquad (c\\cdot f(x))' = c\\cdot f'(x)"
  },
  {
    "type": "examples",
    "title": "Różniczkowanie sumy funkcji",
    "items": [
      {
        "problem": "f(x)=3x^2+5x-7",
        "steps": [
          {
            "text": "Różniczkujemy każdy składnik osobno, korzystając ze wzoru $(x^n)'=nx^{n-1}$.",
            "formula": "(3x^2)'=3\\cdot2x=6x, \\quad (5x)'=5, \\quad (-7)'=0"
          },
          {
            "text": "Sumujemy pochodne poszczególnych składników."
          }
        ],
        "answer": "f'(x)=6x+5"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Pochodna funkcji $f(x)=4x^3-2x+9$ to:",
    "options": [
      "$12x^2-2$",
      "$12x^2+9$",
      "$4x^2-2$",
      "$12x^2-2x$"
    ],
    "correctIndex": 0,
    "explanation": "$(4x^3)'=12x^2$, $(-2x)'=-2$, $(9)'=0$. Suma: $12x^2-2$."
  },
  {
    "type": "definition",
    "term": "Pochodna iloczynu funkcji (reguła Leibniza)",
    "text": "Pochodna iloczynu dwóch funkcji różniczkowalnych $f$ i $g$ nie jest po prostu iloczynem ich pochodnych! Obowiązuje reguła: pochodna pierwszej funkcji razy druga funkcja, plus pierwsza funkcja razy pochodna drugiej.",
    "formula": "(f(x)\\cdot g(x))' = f'(x)g(x)+f(x)g'(x)"
  },
  {
    "type": "examples",
    "title": "Różniczkowanie iloczynu funkcji",
    "items": [
      {
        "problem": "f(x)=(x^2+1)(3x-2)",
        "steps": [
          {
            "text": "Oznaczamy $u(x)=x^2+1$ oraz $v(x)=3x-2$ i obliczamy ich pochodne.",
            "formula": "u'(x)=2x, \\quad v'(x)=3"
          },
          {
            "text": "Stosujemy wzór na pochodną iloczynu $u'v+uv'$.",
            "formula": "f'(x)=2x(3x-2)+(x^2+1)\\cdot3"
          },
          {
            "text": "Upraszczamy wyrażenie.",
            "formula": "f'(x)=6x^2-4x+3x^2+3=9x^2-4x+3"
          }
        ],
        "answer": "f'(x)=9x^2-4x+3"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Dla $f(x)=x\\cdot\\sin x$, pochodna $f'(x)$ to:",
    "options": [
      "$\\sin x + x\\cos x$",
      "$\\cos x$",
      "$x\\cos x$",
      "$\\sin x \\cdot \\cos x$"
    ],
    "correctIndex": 0,
    "explanation": "Stosując regułę Leibniza dla $u=x$ ($u'=1$) i $v=\\sin x$ ($v'=\\cos x$): $f'(x)=1\\cdot\\sin x + x\\cdot\\cos x = \\sin x+x\\cos x$."
  },
  {
    "type": "reveal-steps",
    "title": "Pochodna ilorazu funkcji",
    "problem": "Oblicz pochodną funkcji $f(x)=\\dfrac{x^2}{x+1}$.",
    "steps": [
      {
        "prompt": "Jaki wzór stosujemy do pochodnej ilorazu $\\dfrac{u(x)}{v(x)}$?",
        "kind": "choice",
        "options": [
          "$\\dfrac{u'v-uv'}{v^2}$",
          "$\\dfrac{u'v+uv'}{v^2}$",
          "$\\dfrac{u'}{v'}$",
          "$u'v-uv'$"
        ],
        "correctIndex": 0,
        "reveal": "Wzór na pochodną ilorazu to $\\left(\\dfrac{u}{v}\\right)'=\\dfrac{u'v-uv'}{v^2}$, dla $v(x)\\neq0$."
      },
      {
        "prompt": "Wskaż $u(x)$, $v(x)$ oraz ich pochodne dla $f(x)=\\dfrac{x^2}{x+1}$.",
        "kind": "choice",
        "options": [
          "$u=x^2,\\ u'=2x,\\ v=x+1,\\ v'=1$",
          "$u=x+1,\\ u'=1,\\ v=x^2,\\ v'=2x$",
          "$u=x^2,\\ u'=x,\\ v=x+1,\\ v'=1$"
        ],
        "correctIndex": 0,
        "reveal": "$u(x)=x^2 \\Rightarrow u'(x)=2x$; $v(x)=x+1 \\Rightarrow v'(x)=1$."
      },
      {
        "prompt": "Podstaw do wzoru $\\dfrac{u'v-uv'}{v^2}$ i zapisz licznik przed uproszczeniem.",
        "kind": "input",
        "acceptedAnswers": [
          "2x(x+1)-x^2",
          "2x(x+1)-x^2*1"
        ],
        "reveal": "Licznik: $u'v-uv' = 2x(x+1)-x^2\\cdot1 = 2x(x+1)-x^2$.",
        "formula": "2x(x+1)-x^2"
      },
      {
        "prompt": "Uprość licznik $2x(x+1)-x^2$.",
        "kind": "input",
        "acceptedAnswers": [
          "x^2+2x"
        ],
        "reveal": "$2x(x+1)-x^2 = 2x^2+2x-x^2 = x^2+2x$.",
        "formula": "2x^2+2x-x^2=x^2+2x"
      },
      {
        "prompt": "Zapisz ostateczny wzór na $f'(x)$.",
        "kind": "choice",
        "options": [
          "$\\dfrac{x^2+2x}{(x+1)^2}$",
          "$\\dfrac{x^2+2x}{x+1}$",
          "$\\dfrac{x^2-2x}{(x+1)^2}$",
          "$x^2+2x$"
        ],
        "correctIndex": 0,
        "reveal": "$f'(x)=\\dfrac{x^2+2x}{(x+1)^2}$, przy czym dziedzina pochodnej to $x\\neq-1$ (tak jak dziedzina funkcji $f$)."
      }
    ]
  },
  {
    "type": "formula",
    "title": "Pochodna ilorazu funkcji",
    "expression": "\\left(\\dfrac{f(x)}{g(x)}\\right)' = \\dfrac{f'(x)g(x)-f(x)g'(x)}{[g(x)]^2}, \\qquad g(x)\\neq0"
  },
  {
    "type": "quiz",
    "question": "We wzorze na pochodną ilorazu $\\left(\\dfrac{f}{g}\\right)'$ w mianowniku występuje:",
    "options": [
      "$[g(x)]^2$",
      "$g(x)$",
      "$f(x)\\cdot g(x)$",
      "$[f(x)]^2$"
    ],
    "correctIndex": 0,
    "explanation": "Wzór na pochodną ilorazu ma w mianowniku kwadrat funkcji $g$: $\\dfrac{f'g-fg'}{g^2}$."
  },
  {
    "type": "definition",
    "term": "Pochodna funkcji złożonej (reguła łańcuchowa)",
    "text": "Jeśli funkcja $h(x)=f(g(x))$ jest złożeniem dwóch funkcji różniczkowalnych, to jej pochodną obliczamy, mnożąc pochodną funkcji „zewnętrznej” (liczoną względem całego $g(x)$) przez pochodną funkcji „wewnętrznej”. To jedna z najczęściej wykorzystywanych reguł na maturze, np. przy różniczkowaniu $(3x+1)^5$ czy $\\sin(2x)$.",
    "formula": "h(x)=f(g(x)) \\implies h'(x)=f'(g(x))\\cdot g'(x)"
  },
  {
    "type": "examples",
    "title": "Różniczkowanie funkcji złożonej",
    "items": [
      {
        "problem": "h(x)=(3x+1)^5",
        "steps": [
          {
            "text": "Funkcja zewnętrzna to $t^5$ (z $t=3x+1$), funkcja wewnętrzna to $g(x)=3x+1$.",
            "formula": "f(t)=t^5, \\quad g(x)=3x+1"
          },
          {
            "text": "Pochodna zewnętrzna: $f'(t)=5t^4$. Pochodna wewnętrzna: $g'(x)=3$.",
            "formula": "f'(g(x))=5(3x+1)^4, \\quad g'(x)=3"
          },
          {
            "text": "Mnożymy zgodnie z regułą łańcuchową.",
            "formula": "h'(x)=5(3x+1)^4\\cdot3=15(3x+1)^4"
          }
        ],
        "answer": "h'(x)=15(3x+1)^4"
      },
      {
        "problem": "h(x)=\\sin(2x)",
        "steps": [
          {
            "text": "Funkcja zewnętrzna to $\\sin t$ (z $t=2x$), wewnętrzna to $g(x)=2x$.",
            "formula": "f(t)=\\sin t, \\quad g(x)=2x"
          },
          {
            "text": "Pochodna zewnętrzna: $f'(t)=\\cos t$. Pochodna wewnętrzna: $g'(x)=2$.",
            "formula": "f'(g(x))=\\cos(2x), \\quad g'(x)=2"
          },
          {
            "text": "Mnożymy zgodnie z regułą łańcuchową.",
            "formula": "h'(x)=\\cos(2x)\\cdot2=2\\cos(2x)"
          }
        ],
        "answer": "h'(x)=2\\cos(2x)"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Pochodna funkcji $h(x)=(x^2+1)^3$ to:",
    "options": [
      "$6x(x^2+1)^2$",
      "$3(x^2+1)^2$",
      "$(x^2+1)^2$",
      "$6x^2(x^2+1)^2$"
    ],
    "correctIndex": 0,
    "explanation": "Zewnętrzna: $t^3$, pochodna $3t^2$; wewnętrzna: $x^2+1$, pochodna $2x$. Razem: $3(x^2+1)^2\\cdot2x=6x(x^2+1)^2$."
  },
  {
    "type": "reveal-steps",
    "title": "Łączenie reguł: pochodna funkcji $h(x)=x^2\\cdot e^{3x}$",
    "problem": "Oblicz pochodną funkcji $h(x)=x^2\\cdot e^{3x}$.",
    "steps": [
      {
        "prompt": "Jakiej reguły użyjesz jako głównej, skoro funkcja jest iloczynem $x^2$ i $e^{3x}$?",
        "kind": "choice",
        "options": [
          "Reguły pochodnej iloczynu (Leibniza)",
          "Reguły pochodnej ilorazu",
          "Reguły łańcuchowej bez reguły iloczynu",
          "Wzoru na pochodną sumy"
        ],
        "correctIndex": 0,
        "reveal": "To iloczyn dwóch funkcji, więc stosujemy $(uv)'=u'v+uv'$, a przy liczeniu pochodnej $e^{3x}$ dodatkowo regułę łańcuchową."
      },
      {
        "prompt": "Oblicz $u'(x)$ dla $u(x)=x^2$.",
        "kind": "input",
        "acceptedAnswers": [
          "2x"
        ],
        "reveal": "$u'(x)=2x$.",
        "formula": "u'(x)=2x"
      },
      {
        "prompt": "Oblicz $v'(x)$ dla $v(x)=e^{3x}$, korzystając z reguły łańcuchowej ($(e^{g(x)})'=e^{g(x)}\\cdot g'(x)$).",
        "kind": "input",
        "acceptedAnswers": [
          "3e^{3x}",
          "3e^(3x)"
        ],
        "reveal": "$v'(x)=e^{3x}\\cdot3=3e^{3x}$.",
        "formula": "v'(x)=3e^{3x}"
      },
      {
        "prompt": "Podstaw do wzoru $u'v+uv'$ i zapisz ostateczną pochodną.",
        "kind": "choice",
        "options": [
          "$2xe^{3x}+3x^2e^{3x}$",
          "$2xe^{3x}$",
          "$3x^2e^{3x}$",
          "$2x\\cdot3e^{3x}$"
        ],
        "correctIndex": 0,
        "reveal": "$h'(x)=u'v+uv'=2x\\cdot e^{3x}+x^2\\cdot3e^{3x}=2xe^{3x}+3x^2e^{3x}=xe^{3x}(2+3x)$."
      }
    ]
  },
  {
    "type": "function-plot",
    "title": "Iloczyn i złożenie w jednej funkcji",
    "caption": "Funkcja $f(x)=a\\cdot x\\cdot\\sin(bx)+c$ łączy iloczyn ($x\\cdot\\sin(bx)$) i funkcję złożoną ($\\sin(bx)$) — dokładnie to, czego dotyczy ta lekcja. Zmieniaj $a$, $b$, $c$ i obserwuj, jak zmienia się kształt wykresu wraz ze wzrostem częstości oscylacji.",
    "expression": "a * x * Math.sin(b * x) + c",
    "params": [
      {
        "symbol": "a",
        "label": "Skala amplitudy",
        "min": 0.2,
        "max": 2,
        "step": 0.2,
        "default": 1
      },
      {
        "symbol": "b",
        "label": "Częstość wewnątrz $\\sin$",
        "min": 0.5,
        "max": 3,
        "step": 0.5,
        "default": 1
      },
      {
        "symbol": "c",
        "label": "Przesunięcie pionowe",
        "min": -3,
        "max": 3,
        "step": 1,
        "default": 0
      }
    ],
    "domain": [-6, 6]
  },
  {
    "type": "table",
    "title": "Podsumowanie reguł różniczkowania",
    "headers": [
      "Reguła",
      "Wzór"
    ],
    "rows": [
      [
        "Suma/różnica",
        "$(f\\pm g)'=f'\\pm g'$"
      ],
      [
        "Iloczyn",
        "$(fg)'=f'g+fg'$"
      ],
      [
        "Iloraz",
        "$\\left(\\dfrac{f}{g}\\right)'=\\dfrac{f'g-fg'}{g^2}$"
      ],
      [
        "Funkcja złożona",
        "$(f(g(x)))'=f'(g(x))\\cdot g'(x)$"
      ]
    ]
  },
  {
    "type": "quiz",
    "question": "Aby obliczyć pochodną funkcji $h(x)=\\cos(x^2+1)$, jakiej reguły użyjesz?",
    "options": [
      "Reguły łańcuchowej (funkcja złożona)",
      "Reguły iloczynu",
      "Reguły ilorazu",
      "Wzoru na pochodną sumy"
    ],
    "correctIndex": 0,
    "explanation": "Funkcja $\\cos(x^2+1)$ to złożenie: zewnętrzna $\\cos t$, wewnętrzna $t=x^2+1$ — stosujemy regułę łańcuchową."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli sprawnie różniczkujesz sumy i różnice funkcji, potrafisz zastosować regułę Leibniza do iloczynu, znasz wzór na pochodną ilorazu oraz — co najważniejsze — rozpoznajesz funkcję złożoną i potrafisz zastosować regułę łańcuchową, mnożąc pochodną zewnętrzną przez pochodną wewnętrzną."
  }
]$content2$::jsonb,
  1
);

-- ----------------------------------------------------------------------------
-- Lesson 3: Monotoniczność i ekstrema funkcji z pochodnej
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'rachunek-rozniczkowy'),
  $title3$Monotoniczność i ekstrema funkcji z pochodnej$title3$,
  $content3$[
  {
    "type": "intro",
    "text": "Pochodna funkcji nie tylko opisuje nachylenie stycznej — jej znak mówi wprost, czy funkcja rośnie, czy maleje, a miejsca zerowe pochodnej wskazują kandydatów na ekstrema lokalne (maksima i minima). W tej lekcji nauczysz się badać monotoniczność i wyznaczać ekstrema funkcji, korzystając z pochodnej — to jedna z najczęściej sprawdzanych umiejętności na maturze rozszerzonej."
  },
  {
    "type": "definition",
    "term": "Związek znaku pochodnej z monotonicznością",
    "text": "Jeśli funkcja $f$ jest różniczkowalna w przedziale i $f'(x)>0$ dla każdego $x$ z tego przedziału, to funkcja $f$ jest rosnąca w tym przedziale. Jeśli $f'(x)<0$ dla każdego $x$ z przedziału, to funkcja jest malejąca. Jeśli $f'(x)=0$ w całym przedziale, funkcja jest stała.",
    "formula": "f'(x)>0 \\implies f \\text{ rosnąca}, \\qquad f'(x)<0 \\implies f \\text{ malejąca}"
  },
  {
    "type": "table",
    "title": "Znak pochodnej a monotoniczność",
    "headers": [
      "Znak $f'(x)$ na przedziale",
      "Zachowanie funkcji $f$"
    ],
    "rows": [
      [
        "$f'(x)>0$",
        "funkcja rosnąca"
      ],
      [
        "$f'(x)<0$",
        "funkcja malejąca"
      ],
      [
        "$f'(x)=0$ (w całym przedziale)",
        "funkcja stała"
      ]
    ]
  },
  {
    "type": "quiz",
    "question": "Jeśli $f'(x)<0$ dla każdego $x$ z pewnego przedziału, to funkcja $f$ w tym przedziale jest:",
    "options": [
      "malejąca",
      "rosnąca",
      "stała",
      "nieokreślona"
    ],
    "correctIndex": 0,
    "explanation": "Ujemna pochodna na całym przedziale oznacza, że funkcja w tym przedziale maleje."
  },
  {
    "type": "examples",
    "title": "Badanie monotoniczności funkcji za pomocą pochodnej",
    "items": [
      {
        "problem": "f(x)=x^2-4x+3",
        "steps": [
          {
            "text": "Obliczamy pochodną funkcji.",
            "formula": "f'(x)=2x-4"
          },
          {
            "text": "Badamy znak pochodnej — rozwiązujemy nierówność $f'(x)>0$.",
            "formula": "2x-4>0 \\iff x>2"
          },
          {
            "text": "Analogicznie $f'(x)<0$ dla $x<2$. W punkcie $x=2$ pochodna się zeruje."
          }
        ],
        "answer": "f \\text{ malejąca w } (-\\infty,2], \\ f \\text{ rosnąca w } [2,\\infty)"
      }
    ]
  },
  {
    "type": "reveal-steps",
    "title": "Wyznaczanie przedziałów monotoniczności funkcji sześciennej",
    "problem": "Wyznacz przedziały monotoniczności funkcji $f(x)=x^3-3x^2$.",
    "steps": [
      {
        "prompt": "Oblicz pochodną $f'(x)$.",
        "kind": "input",
        "acceptedAnswers": [
          "3x^2-6x"
        ],
        "reveal": "$f'(x)=3x^2-6x$.",
        "formula": "f'(x)=3x^2-6x"
      },
      {
        "prompt": "Rozwiąż równanie $f'(x)=0$, aby znaleźć punkty krytyczne.",
        "kind": "choice",
        "options": [
          "$x=0$ lub $x=2$",
          "$x=0$ lub $x=-2$",
          "$x=3$",
          "$x=0$ lub $x=6$"
        ],
        "correctIndex": 0,
        "reveal": "$3x^2-6x=0 \\iff 3x(x-2)=0 \\iff x=0 \\text{ lub } x=2$."
      },
      {
        "prompt": "Zbadaj znak $f'(x)=3x(x-2)$ dla $x<0$ (weź np. $x=-1$).",
        "kind": "choice",
        "options": [
          "dodatni",
          "ujemny",
          "zero"
        ],
        "correctIndex": 0,
        "reveal": "$f'(-1)=3\\cdot(-1)\\cdot(-1-2)=3\\cdot(-1)\\cdot(-3)=9>0$ — pochodna jest dodatnia."
      },
      {
        "prompt": "Zbadaj znak $f'(x)$ dla $0<x<2$ (weź np. $x=1$).",
        "kind": "choice",
        "options": [
          "ujemny",
          "dodatni",
          "zero"
        ],
        "correctIndex": 0,
        "reveal": "$f'(1)=3\\cdot1\\cdot(1-2)=3\\cdot1\\cdot(-1)=-3<0$ — pochodna jest ujemna."
      },
      {
        "prompt": "Zbadaj znak $f'(x)$ dla $x>2$ (weź np. $x=3$) i podsumuj przedziały monotoniczności funkcji $f$.",
        "kind": "choice",
        "options": [
          "$f'(3)=9>0$, więc: rosnąca w $(-\\infty,0]$, malejąca w $[0,2]$, rosnąca w $[2,\\infty)$",
          "$f'(3)=9>0$, więc funkcja jest rosnąca w całej dziedzinie",
          "$f'(3)=-9<0$, więc funkcja jest malejąca w całej dziedzinie",
          "$f'(3)=0$, więc $x=3$ to kolejny punkt krytyczny"
        ],
        "correctIndex": 0,
        "reveal": "$f'(3)=3\\cdot3\\cdot(3-2)=9\\cdot1=9>0$. Zbierając wszystkie znaki: $f$ rośnie na $(-\\infty,0]$, maleje na $[0,2]$, i znów rośnie na $[2,\\infty)$."
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Punkty, w których $f'(x)=0$, nazywamy punktami:",
    "options": [
      "krytycznymi (podejrzanymi o ekstremum)",
      "stycznymi",
      "granicznymi dziedziny",
      "punktami przegięcia zawsze"
    ],
    "correctIndex": 0,
    "explanation": "Miejsca zerowe pochodnej to punkty krytyczne — kandydaci na ekstrema lokalne funkcji, choć nie każdy taki punkt musi być ekstremum."
  },
  {
    "type": "definition",
    "term": "Ekstremum lokalne funkcji (maksimum i minimum)",
    "text": "Funkcja $f$ ma w punkcie $x_0$ maksimum lokalne, jeśli pochodna zmienia znak z dodatniego na ujemny w tym punkcie (funkcja przestaje rosnąć, zaczyna maleć). Analogicznie minimum lokalne występuje, gdy pochodna zmienia znak z ujemnego na dodatni (funkcja przestaje maleć, zaczyna rosnąć). Warunkiem koniecznym istnienia ekstremum w punkcie różniczkowalności jest $f'(x_0)=0$, ale to nie warunek wystarczający — trzeba jeszcze sprawdzić zmianę znaku.",
    "formula": "f'(x_0)=0 \\ \\text{i zmiana znaku } f' \\text{ w } x_0 \\implies \\text{ekstremum lokalne}"
  },
  {
    "type": "quiz",
    "question": "Warunek $f'(x_0)=0$ jest warunkiem:",
    "options": [
      "koniecznym, ale niewystarczającym istnienia ekstremum",
      "wystarczającym istnienia ekstremum",
      "koniecznym i wystarczającym",
      "niepotrzebnym do znalezienia ekstremum"
    ],
    "correctIndex": 0,
    "explanation": "Zerowanie się pochodnej jest warunkiem koniecznym istnienia ekstremum w punkcie różniczkowalności, ale nie wystarczającym — trzeba jeszcze sprawdzić, czy pochodna faktycznie zmienia znak (np. $f(x)=x^3$ ma $f'(0)=0$, ale w $x=0$ nie ma ekstremum, bo $f'(x)=3x^2\\ge0$ nie zmienia znaku)."
  },
  {
    "type": "examples",
    "title": "Wyznaczanie ekstremów lokalnych",
    "items": [
      {
        "problem": "f(x)=x^3-3x^2, \\quad \\text{wyznacz ekstrema lokalne}",
        "steps": [
          {
            "text": "Z poprzedniej analizy wiemy, że $f'(x)=3x(x-2)$ oraz pochodna zmienia znak: dodatnia dla $x<0$, ujemna dla $0<x<2$, dodatnia dla $x>2$.",
            "formula": "f'(x)=3x(x-2)"
          },
          {
            "text": "W $x=0$ pochodna zmienia znak z dodatniego na ujemny — to maksimum lokalne. Obliczamy $f(0)$.",
            "formula": "f(0)=0^3-3\\cdot0^2=0"
          },
          {
            "text": "W $x=2$ pochodna zmienia znak z ujemnego na dodatni — to minimum lokalne. Obliczamy $f(2)$.",
            "formula": "f(2)=2^3-3\\cdot2^2=8-12=-4"
          }
        ],
        "answer": "\\text{maksimum lokalne } (0,0), \\ \\text{minimum lokalne } (2,-4)"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Dla funkcji $f(x)=x^3-3x^2$ (patrz przykład wyżej), minimum lokalne znajduje się w punkcie:",
    "options": [
      "$(2,-4)$",
      "$(0,0)$",
      "$(3,0)$",
      "$(1,-2)$"
    ],
    "correctIndex": 0,
    "explanation": "Pochodna zmienia znak z ujemnego na dodatni w $x=2$, a $f(2)=-4$, więc minimum lokalne to punkt $(2,-4)$."
  },
  {
    "type": "function-plot",
    "title": "Ekstrema funkcji sześciennej",
    "caption": "Zmieniaj współczynniki $a$, $b$, $c$ funkcji $f(x)=x^3+ax^2+bx+c$ i obserwuj, jak przesuwają się „górka” (maksimum lokalne) i „dołek” (minimum lokalne) na wykresie.",
    "expression": "x*x*x + a*x*x + b*x + c",
    "params": [
      {
        "symbol": "a",
        "label": "Współczynnik przy $x^2$",
        "min": -6,
        "max": 6,
        "step": 1,
        "default": -3
      },
      {
        "symbol": "b",
        "label": "Współczynnik przy $x$",
        "min": -6,
        "max": 6,
        "step": 1,
        "default": 0
      },
      {
        "symbol": "c",
        "label": "Wyraz wolny",
        "min": -5,
        "max": 5,
        "step": 1,
        "default": 0
      }
    ],
    "domain": [-4, 6]
  },
  {
    "type": "table",
    "title": "Algorytm badania ekstremów za pomocą pochodnej",
    "headers": [
      "Krok",
      "Co robimy"
    ],
    "rows": [
      [
        "1",
        "Wyznacz dziedzinę funkcji $f$."
      ],
      [
        "2",
        "Oblicz pochodną $f'(x)$."
      ],
      [
        "3",
        "Rozwiąż równanie $f'(x)=0$ — wyznacz punkty krytyczne."
      ],
      [
        "4",
        "Zbadaj znak $f'(x)$ w przedziałach między punktami krytycznymi."
      ],
      [
        "5",
        "Odczytaj ekstrema: zmiana znaku $+\\to-$ to maksimum, $-\\to+$ to minimum."
      ]
    ]
  },
  {
    "type": "quiz",
    "question": "Jeśli pochodna funkcji zmienia znak z ujemnego na dodatni w punkcie $x_0$, to w $x_0$ funkcja ma:",
    "options": [
      "minimum lokalne",
      "maksimum lokalne",
      "punkt przegięcia zawsze",
      "brak ekstremum"
    ],
    "correctIndex": 0,
    "explanation": "Zmiana znaku pochodnej z ujemnego na dodatni oznacza, że funkcja przestaje maleć i zaczyna rosnąć — to definicja minimum lokalnego."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli potrafisz zbadać znak pochodnej na przedziałach wyznaczonych przez jej miejsca zerowe, sprawnie wyznaczasz przedziały monotoniczności funkcji, oraz — co kluczowe — rozumiesz różnicę między warunkiem koniecznym ($f'(x_0)=0$) a wystarczającym (zmiana znaku pochodnej) istnienia ekstremum lokalnego."
  }
]$content3$::jsonb,
  2
);

-- ----------------------------------------------------------------------------
-- Lesson 4: Zadania optymalizacyjne z kontekstem praktycznym
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'rachunek-rozniczkowy'),
  $title4$Zadania optymalizacyjne z kontekstem praktycznym$title4$,
  $content4$[
  {
    "type": "intro",
    "text": "Zadania optymalizacyjne to klasyka matury rozszerzonej: mamy pewną wielkość praktyczną (pole, objętość, koszt, długość) zależną od jednej zmiennej i szukamy jej największej lub najmniejszej wartości. Pochodna jest tu idealnym narzędziem — pozwala precyzyjnie znaleźć ekstremum funkcji opisującej tę wielkość, zamiast zgadywać."
  },
  {
    "type": "table",
    "title": "Algorytm rozwiązywania zadań optymalizacyjnych",
    "headers": [
      "Krok",
      "Co robimy"
    ],
    "rows": [
      [
        "1",
        "Wprowadzamy zmienną (np. $x$) i zapisujemy zależności z treści zadania."
      ],
      [
        "2",
        "Wyrażamy szukaną wielkość jako funkcję jednej zmiennej $f(x)$."
      ],
      [
        "3",
        "Wyznaczamy dziedzinę funkcji wynikającą z sensu zadania (np. $x>0$)."
      ],
      [
        "4",
        "Obliczamy pochodną $f'(x)$ i wyznaczamy punkty krytyczne."
      ],
      [
        "5",
        "Sprawdzamy, że w danym punkcie jest to rzeczywiście maksimum/minimum (zmiana znaku pochodnej)."
      ],
      [
        "6",
        "Podajemy odpowiedź w kontekście zadania (z jednostkami, jeśli występują)."
      ]
    ]
  },
  {
    "type": "reveal-steps",
    "title": "Klasyczne zadanie: prostokąt o największym polu przy zadanym obwodzie",
    "problem": "Obwód prostokąta wynosi $40$ cm. Jakie powinny być jego wymiary, aby pole było największe?",
    "steps": [
      {
        "prompt": "Oznacz jeden bok prostokąta jako $x$. Jak zapiszesz drugi bok $y$, korzystając z warunku na obwód $2x+2y=40$?",
        "kind": "input",
        "acceptedAnswers": [
          "20-x",
          "y=20-x"
        ],
        "reveal": "Z $2x+2y=40$ mamy $x+y=20$, czyli $y=20-x$.",
        "formula": "y=20-x"
      },
      {
        "prompt": "Zapisz pole prostokąta jako funkcję zmiennej $x$.",
        "kind": "input",
        "acceptedAnswers": [
          "x(20-x)",
          "20x-x^2"
        ],
        "reveal": "$P(x)=x\\cdot y = x(20-x)=20x-x^2$.",
        "formula": "P(x)=20x-x^2"
      },
      {
        "prompt": "Jaka jest dziedzina funkcji $P(x)$, wynikająca z sensu zadania (oba boki muszą być dodatnie)?",
        "kind": "choice",
        "options": [
          "$x\\in(0,20)$",
          "$x\\in(-\\infty,\\infty)$",
          "$x\\in(0,40)$",
          "$x\\in[0,20]$"
        ],
        "correctIndex": 0,
        "reveal": "Oba boki muszą być dodatnie: $x>0$ oraz $y=20-x>0$, czyli $x<20$. Dziedzina to $(0,20)$."
      },
      {
        "prompt": "Oblicz pochodną $P'(x)$.",
        "kind": "input",
        "acceptedAnswers": [
          "20-2x"
        ],
        "reveal": "$P'(x)=20-2x$.",
        "formula": "P'(x)=20-2x"
      },
      {
        "prompt": "Rozwiąż $P'(x)=0$, aby znaleźć punkt krytyczny.",
        "kind": "input",
        "acceptedAnswers": [
          "x=10",
          "10"
        ],
        "reveal": "$20-2x=0 \\iff x=10$.",
        "formula": "x=10"
      },
      {
        "prompt": "Sprawdź znak $P'(x)$ przed i po $x=10$, aby potwierdzić, że to maksimum, a następnie podaj wymiary prostokąta o największym polu.",
        "kind": "choice",
        "options": [
          "Kwadrat o boku $10$ cm ($P'$ zmienia znak z $+$ na $-$, więc to maksimum)",
          "Prostokąt $5\\times15$ cm",
          "Prostokąt $1\\times19$ cm",
          "Nie da się znaleźć maksimum"
        ],
        "correctIndex": 0,
        "reveal": "Dla $x<10$: $P'(x)>0$ (np. $P'(5)=10>0$); dla $x>10$: $P'(x)<0$ (np. $P'(15)=-10<0$) — pochodna zmienia znak z dodatniego na ujemny, więc w $x=10$ jest maksimum. Wtedy $y=20-10=10$, więc największe pole ma kwadrat o boku $10$ cm (pole $P(10)=100\\text{ cm}^2$)."
      }
    ]
  },
  {
    "type": "quiz",
    "question": "W zadaniu o prostokącie z zadanym obwodem, pole jest największe, gdy prostokąt jest:",
    "options": [
      "kwadratem",
      "bardzo wąski i długi",
      "trójkątem",
      "nie ma to znaczenia"
    ],
    "correctIndex": 0,
    "explanation": "Dla ustalonego obwodu pole prostokąta jest maksymalne, gdy jest to kwadrat — wynika to z rozwiązania zadania optymalizacyjnego powyżej."
  },
  {
    "type": "examples",
    "title": "Minimalizacja zużycia materiału na otwarte pudełko o zadanej objętości",
    "items": [
      {
        "problem": "\\text{Otwarte (bez wieka) pudełko o podstawie kwadratowej ma mieć objętość } V=32\\text{ cm}^3.\\ \\text{Dla jakiej krawędzi podstawy } x \\text{ zużycie materiału (pole powierzchni) będzie najmniejsze?}",
        "steps": [
          {
            "text": "Oznaczmy krawędź podstawy przez $x$, a wysokość przez $h$. Z warunku na objętość $V=x^2h=32$ wyznaczamy $h$.",
            "formula": "h=\\dfrac{32}{x^2}"
          },
          {
            "text": "Pole powierzchni otwartego pudełka (bez górnej ścianki) to pole podstawy plus 4 ściany boczne. Podstawiamy $h$ i upraszczamy.",
            "formula": "S(x)=x^2+4xh=x^2+4x\\cdot\\dfrac{32}{x^2}=x^2+\\dfrac{128}{x}"
          },
          {
            "text": "Obliczamy pochodną $S'(x)$ i przyrównujemy do zera (dla $x>0$).",
            "formula": "S'(x)=2x-\\dfrac{128}{x^2}=0 \\implies 2x^3=128 \\implies x^3=64 \\implies x=4"
          },
          {
            "text": "Sprawdzamy znak pochodnej: dla $x<4$ jest ujemna, dla $x>4$ dodatnia — to potwierdza minimum. Obliczamy wysokość.",
            "formula": "h=\\dfrac{32}{4^2}=\\dfrac{32}{16}=2"
          }
        ],
        "answer": "x=4\\text{ cm},\\ h=2\\text{ cm}"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "W zadaniu o otwartym pudełku o objętości $32\\text{ cm}^3$ i kwadratowej podstawie, krawędź podstawy przy najmniejszym zużyciu materiału wynosi:",
    "options": [
      "$4$ cm",
      "$2$ cm",
      "$8$ cm",
      "$32$ cm"
    ],
    "correctIndex": 0,
    "explanation": "Pochodna $S'(x)=2x-\\dfrac{128}{x^2}$ zeruje się dla $x=4$, a analiza znaku potwierdza, że to minimum."
  },
  {
    "type": "function-plot",
    "title": "Zobacz funkcję kosztu/pola i jej minimum",
    "caption": "Funkcja $S(x)=x^2+\\dfrac{k}{x}$ (tu $k$ to suwak) ma charakterystyczny kształt zadań optymalizacyjnych: maleje, osiąga minimum, potem rośnie. Zmieniaj $k$ i obserwuj, jak przesuwa się minimum.",
    "expression": "x*x + k/x",
    "params": [
      {
        "symbol": "k",
        "label": "Stała $k$ w liczniku ułamka",
        "min": 8,
        "max": 64,
        "step": 8,
        "default": 32
      }
    ],
    "domain": [1, 6]
  },
  {
    "type": "quiz",
    "question": "W zadaniach optymalizacyjnych dziedzinę funkcji, którą różniczkujemy, wyznaczamy na podstawie:",
    "options": [
      "sensu fizycznego/geometrycznego wielkości z treści zadania (np. długości muszą być dodatnie)",
      "zawsze całego zbioru liczb rzeczywistych",
      "wyłącznie miejsc zerowych funkcji",
      "wartości podanych w odpowiedzi"
    ],
    "correctIndex": 0,
    "explanation": "Dziedzinę funkcji opisującej wielkość z zadania optymalizacyjnego zawsze ograniczamy do wartości sensownych w kontekście zadania, np. długości i pola muszą być dodatnie."
  },
  {
    "type": "examples",
    "title": "Zadanie z kontekstem: minimalizacja kosztu produkcji",
    "items": [
      {
        "problem": "K(x)=\\dfrac{x^2}{4}+\\dfrac{4}{x}, \\quad x>0 \\quad \\text{(koszt produkcji w pewnych jednostkach)} \\text{ — dla jakiego } x \\text{ koszt jest najmniejszy?}",
        "steps": [
          {
            "text": "Obliczamy pochodną funkcji kosztu.",
            "formula": "K'(x)=\\dfrac{x}{2}-\\dfrac{4}{x^2}"
          },
          {
            "text": "Przyrównujemy pochodną do zera i rozwiązujemy równanie (dla $x>0$).",
            "formula": "\\dfrac{x}{2}=\\dfrac{4}{x^2} \\implies x^3=8 \\implies x=2"
          },
          {
            "text": "Sprawdzamy znak pochodnej: dla $x<2$ jest ujemna (np. $K'(1)=-3{,}5$), dla $x>2$ dodatnia (np. $K'(3)\\approx1{,}06$) — to potwierdza minimum."
          }
        ],
        "answer": "x=2 \\ (\\text{koszt minimalny } K(2)=3)"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "W zadaniu o funkcji kosztu $K(x)=\\dfrac{x^2}{4}+\\dfrac{4}{x}$ minimalny koszt osiągany jest dla:",
    "options": [
      "$x=2$",
      "$x=4$",
      "$x=1$",
      "$x=8$"
    ],
    "correctIndex": 0,
    "explanation": "Pochodna $K'(x)=\\dfrac{x}{2}-\\dfrac{4}{x^2}$ zeruje się dla $x=2$, a analiza znaku potwierdza, że to minimum."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli potrafisz samodzielnie przejść cały algorytm zadania optymalizacyjnego: wprowadzić zmienną, zapisać szukaną wielkość jako funkcję jednej zmiennej, wyznaczyć sensowną dziedzinę, znaleźć punkty krytyczne pochodnej, potwierdzić, że to faktycznie maksimum lub minimum, oraz sformułować odpowiedź w kontekście zadania (z odpowiednimi jednostkami)."
  }
]$content4$::jsonb,
  3
);
