-- ============================================================================
-- supabase/seed/matma/02_lessons_ciagi.sql
-- Interactive lesson content (math_lessons) for the "ciagi" department:
-- Ciągi liczbowe (ciąg arytmetyczny, geometryczny, rekurencyjny, granice
-- ciągów, zastosowania finansowe — procent składany, kredyty, lokaty).
-- content is a jsonb array of MathBlock (see lib/matma/lesson-blocks.ts).
--
-- Idempotent: deletes existing lessons for this topic first. Run
-- 01_topics.sql BEFORE this file — it looks up topic_id by slug.
-- ============================================================================

delete from math_lessons
where topic_id = (select id from math_topics where slug = 'ciagi');

-- ----------------------------------------------------------------------------
-- Lesson 1: Czym jest ciąg liczbowy? Ciąg arytmetyczny
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'ciagi'),
  $title1$Czym jest ciąg liczbowy? Ciąg arytmetyczny$title1$,
  $content1$[
  {
    "type": "basics-recap",
    "title": "Zanim zaczniesz: podstawy, które musisz znać",
    "text": "Ciąg liczbowy to funkcja, która każdej liczbie naturalnej $n=1,2,3,\\ldots$ przyporządkowuje dokładnie jedną liczbę rzeczywistą — nazywamy ją $n$-tym wyrazem ciągu i oznaczamy $a_n$. Cały ciąg zapisujemy jako $(a_n)$ lub wypisując kolejne wyrazy: $a_1, a_2, a_3, \\ldots$. Liczbę $n$ nazywamy numerem (indeksem) wyrazu. Ciąg może być określony wzorem ogólnym — wtedy, żeby obliczyć dowolny wyraz, wystarczy podstawić jego numer za $n$ — albo rekurencyjnie, czyli poprzez podanie pierwszego wyrazu oraz przepisu, jak z wyrazu poprzedniego obliczyć kolejny.",
    "formula": "a_n = f(n), \\qquad n=1,2,3,\\ldots",
    "controlQuiz": [
      {
        "question": "Ciąg $(a_n)$ jest dany wzorem $a_n=3n-1$. Ile wynosi $a_4$?",
        "options": ["$9$", "$11$", "$12$", "$8$"],
        "correctIndex": 1,
        "explanation": "Podstawiamy $n=4$: $a_4=3\\cdot4-1=11$."
      },
      {
        "question": "Co oznacza zapis $a_1$?",
        "options": ["Pierwszy wyraz ciągu", "Liczbę wszystkich wyrazów ciągu", "Różnicę między kolejnymi wyrazami", "Sumę wszystkich wyrazów"],
        "correctIndex": 0,
        "explanation": "$a_1$ to wartość ciągu dla $n=1$, czyli jego pierwszy wyraz."
      },
      {
        "question": "Ciąg jest określony rekurencyjnie, gdy:",
        "options": ["Znamy wzór na dowolny wyraz w zależności od $n$", "Podany jest pierwszy wyraz oraz sposób obliczania kolejnego wyrazu na podstawie wyrazu (lub wyrazów) poprzednich", "Ciąg ma skończenie wiele wyrazów", "Wszystkie wyrazy ciągu są sobie równe"],
        "correctIndex": 1,
        "explanation": "Definicja rekurencyjna nie podaje wzoru na $a_n$ wprost — trzeba obliczać wyrazy kolejno, korzystając z wyrazów wcześniejszych."
      }
    ]
  },
  {
    "type": "definition",
    "term": "Ciąg arytmetyczny",
    "text": "Ciąg $(a_n)$ nazywamy arytmetycznym, jeśli każdy jego wyraz (poza pierwszym) powstaje z wyrazu poprzedniego przez dodanie tej samej stałej liczby $r$, zwanej różnicą ciągu.",
    "formula": "a_{n+1} = a_n + r, \\qquad n=1,2,3,\\ldots"
  },
  {
    "type": "quiz",
    "question": "Który z podanych ciągów jest ciągiem arytmetycznym?",
    "options": ["$2, 5, 8, 11, \\ldots$", "$1, 2, 4, 8, \\ldots$", "$1, 4, 9, 16, \\ldots$", "$1, 1, 2, 3, 5, \\ldots$"],
    "correctIndex": 0,
    "explanation": "Różnica między kolejnymi wyrazami jest zawsze taka sama i wynosi $3$ ($5-2=3$, $8-5=3$, $11-8=3$), więc to ciąg arytmetyczny."
  },
  {
    "type": "formula",
    "title": "Wzór na n-ty wyraz ciągu arytmetycznego",
    "expression": "a_n = a_1 + (n-1)r",
    "variables": [
      {"symbol": "a_1", "meaning": "pierwszy wyraz ciągu"},
      {"symbol": "r", "meaning": "różnica ciągu"},
      {"symbol": "n", "meaning": "numer wyrazu"}
    ]
  },
  {
    "type": "examples",
    "title": "Obliczanie wyrazów ciągu arytmetycznego",
    "items": [
      {
        "problem": "a_1=3,\\ r=4,\\quad a_{10}=?",
        "steps": [
          {"text": "Podstawiamy dane do wzoru na $n$-ty wyraz.", "formula": "a_{10}=a_1+(10-1)r"},
          {"text": "Podstawiamy liczby.", "formula": "a_{10}=3+9\\cdot4"},
          {"text": "Obliczamy.", "formula": "a_{10}=3+36=39"}
        ],
        "answer": "39"
      },
      {
        "problem": "a_1=-5,\\ a_2=-2,\\quad a_n=?",
        "steps": [
          {"text": "Obliczamy różnicę ciągu.", "formula": "r=a_2-a_1=-2-(-5)=3"},
          {"text": "Podstawiamy do wzoru ogólnego.", "formula": "a_n=-5+(n-1)\\cdot3"},
          {"text": "Upraszczamy wyrażenie.", "formula": "a_n=3n-8"}
        ],
        "answer": "a_n=3n-8"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Ciąg arytmetyczny ma $a_1=7$ i $r=-2$. Ile wynosi $a_5$?",
    "options": ["$-1$", "$1$", "$-9$", "$15$"],
    "correctIndex": 0,
    "explanation": "$a_5=7+4\\cdot(-2)=7-8=-1$."
  },
  {
    "type": "reveal-steps",
    "title": "Wyznaczanie ciągu arytmetycznego z dwóch danych wyrazów",
    "problem": "Wiadomo, że w ciągu arytmetycznym $a_3=11$ oraz $a_7=27$. Oblicz $r$ i $a_1$.",
    "steps": [
      {
        "prompt": "Ile kroków (o różnicę $r$) dzieli $a_3$ od $a_7$?",
        "kind": "choice",
        "options": ["$4$ kroki, czyli $4r$", "$7$ kroków, czyli $7r$", "$3$ kroki, czyli $3r$"],
        "correctIndex": 0,
        "reveal": "Od $a_3$ do $a_7$ mijają 4 kroki (indeksy $3\\to4\\to5\\to6\\to7$), więc $a_7-a_3=4r$.",
        "formula": "a_7-a_3=4r"
      },
      {
        "prompt": "Oblicz $r$, wiedząc że $a_7-a_3=27-11=16=4r$.",
        "kind": "input",
        "acceptedAnswers": ["4"],
        "reveal": "$16=4r$, więc $r=4$.",
        "formula": "r=4"
      },
      {
        "prompt": "Wyznacz $a_1$, wiedząc że $a_3=a_1+2r$.",
        "kind": "input",
        "acceptedAnswers": ["3"],
        "reveal": "$a_3=a_1+2r$, czyli $11=a_1+8$, skąd $a_1=3$.",
        "formula": "a_1=3"
      }
    ]
  },
  {
    "type": "formula",
    "title": "Suma n początkowych wyrazów ciągu arytmetycznego",
    "expression": "S_n = \\dfrac{a_1+a_n}{2}\\cdot n = \\dfrac{2a_1+(n-1)r}{2}\\cdot n",
    "variables": [
      {"symbol": "a_1", "meaning": "pierwszy wyraz ciągu"},
      {"symbol": "a_n", "meaning": "n-ty (ostatni w sumie) wyraz ciągu"},
      {"symbol": "r", "meaning": "różnica ciągu"},
      {"symbol": "n", "meaning": "liczba sumowanych wyrazów"}
    ]
  },
  {
    "type": "examples",
    "title": "Obliczanie sumy wyrazów ciągu arytmetycznego",
    "items": [
      {
        "problem": "a_1=2,\\ r=3,\\quad S_{20}=?",
        "steps": [
          {"text": "Obliczamy $a_{20}$.", "formula": "a_{20}=2+19\\cdot3=59"},
          {"text": "Stosujemy wzór na sumę.", "formula": "S_{20}=\\dfrac{a_1+a_{20}}{2}\\cdot20"},
          {"text": "Podstawiamy dane.", "formula": "S_{20}=\\dfrac{2+59}{2}\\cdot20"},
          {"text": "Obliczamy wynik.", "formula": "S_{20}=61\\cdot10=610"}
        ],
        "answer": "610"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Ciąg arytmetyczny ma $a_1=5$, $r=2$. Ile wynosi suma pierwszych 10 wyrazów $S_{10}$?",
    "options": ["$140$", "$130$", "$150$", "$120$"],
    "correctIndex": 0,
    "explanation": "$a_{10}=5+9\\cdot2=23$, więc $S_{10}=\\dfrac{5+23}{2}\\cdot10=14\\cdot10=140$."
  },
  {
    "type": "table",
    "title": "Monotoniczność ciągu arytmetycznego",
    "caption": "Zależy wyłącznie od znaku różnicy $r$.",
    "headers": ["Znak różnicy $r$", "Zachowanie ciągu"],
    "rows": [
      ["$r>0$", "Ciąg rosnący"],
      ["$r<0$", "Ciąg malejący"],
      ["$r=0$", "Ciąg stały (wszystkie wyrazy równe)"]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli wiesz, czym jest ciąg i jego wyraz ogólny, swobodnie rozróżniasz definicję wzorem ogólnym od definicji rekurencyjnej, potrafisz z dwóch danych wyrazów ciągu arytmetycznego wyznaczyć jego różnicę i pierwszy wyraz oraz sprawnie liczysz sumę początkowych wyrazów ciągu arytmetycznego."
  }
]$content1$::jsonb,
  0
);

-- ----------------------------------------------------------------------------
-- Lesson 2: Ciąg geometryczny
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'ciagi'),
  $title2$Ciąg geometryczny$title2$,
  $content2$[
  {
    "type": "intro",
    "text": "Ciąg geometryczny działa podobnie do arytmetycznego, ale zamiast dodawać stałą liczbę, każdy kolejny wyraz otrzymujemy, mnożąc poprzedni przez stałą liczbę. Takie ciągi świetnie opisują procesy o stałym tempie wzrostu lub spadku procentowego — np. wzrost populacji, rozpad promieniotwórczy czy kapitał na lokacie z procentem składanym, o czym przekonasz się w dalszej części kursu."
  },
  {
    "type": "definition",
    "term": "Ciąg geometryczny",
    "text": "Ciąg $(a_n)$ o wyrazach różnych od zera nazywamy geometrycznym, jeśli iloraz dowolnych dwóch kolejnych wyrazów jest stały i wynosi $q\\neq0$ — nazywamy go ilorazem ciągu.",
    "formula": "a_{n+1} = a_n \\cdot q, \\qquad a_n\\neq0,\\ q\\neq0"
  },
  {
    "type": "quiz",
    "question": "Który z podanych ciągów jest ciągiem geometrycznym?",
    "options": ["$3, 6, 12, 24, \\ldots$", "$3, 6, 9, 12, \\ldots$", "$2, 4, 8, 15, \\ldots$", "$1, 3, 6, 10, \\ldots$"],
    "correctIndex": 0,
    "explanation": "Iloraz kolejnych wyrazów jest stały i wynosi $2$ ($6:3=2$, $12:6=2$, $24:12=2$), więc to ciąg geometryczny."
  },
  {
    "type": "formula",
    "title": "Wzór na n-ty wyraz ciągu geometrycznego",
    "expression": "a_n = a_1 \\cdot q^{n-1}",
    "variables": [
      {"symbol": "a_1", "meaning": "pierwszy wyraz ciągu"},
      {"symbol": "q", "meaning": "iloraz ciągu"},
      {"symbol": "n", "meaning": "numer wyrazu"}
    ]
  },
  {
    "type": "examples",
    "title": "Obliczanie wyrazów ciągu geometrycznego",
    "items": [
      {
        "problem": "a_1=2,\\ q=3,\\quad a_5=?",
        "steps": [
          {"text": "Podstawiamy do wzoru na $n$-ty wyraz.", "formula": "a_5=a_1\\cdot q^{4}"},
          {"text": "Podstawiamy liczby.", "formula": "a_5=2\\cdot3^4"},
          {"text": "Obliczamy.", "formula": "a_5=2\\cdot81=162"}
        ],
        "answer": "162"
      },
      {
        "problem": "a_1=100,\\ a_2=50,\\quad a_n=?",
        "steps": [
          {"text": "Obliczamy iloraz ciągu.", "formula": "q=\\dfrac{a_2}{a_1}=\\dfrac{50}{100}=\\dfrac12"},
          {"text": "Podstawiamy do wzoru ogólnego.", "formula": "a_n=100\\cdot\\left(\\dfrac12\\right)^{n-1}"}
        ],
        "answer": "a_n=100\\cdot\\left(\\dfrac12\\right)^{n-1}"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Ciąg geometryczny ma $a_1=4$ i $q=-2$. Ile wynosi $a_4$?",
    "options": ["$-32$", "$32$", "$-16$", "$16$"],
    "correctIndex": 0,
    "explanation": "$a_4=4\\cdot(-2)^3=4\\cdot(-8)=-32$."
  },
  {
    "type": "reveal-steps",
    "title": "Wyznaczanie ilorazu i pierwszego wyrazu ciągu geometrycznego",
    "problem": "W ciągu geometrycznym $a_2=6$ oraz $a_5=48$. Oblicz $q$ oraz $a_1$.",
    "steps": [
      {
        "prompt": "Ile razy mnożymy $a_2$ przez $q$, aby otrzymać $a_5$?",
        "kind": "choice",
        "options": ["$q^3$ (3 kroki)", "$q^5$", "$q^2$"],
        "correctIndex": 0,
        "reveal": "Od $a_2$ do $a_5$ są 3 kroki (indeksy $2\\to3\\to4\\to5$), więc $a_5=a_2\\cdot q^3$.",
        "formula": "a_5=a_2\\cdot q^3"
      },
      {
        "prompt": "Oblicz $q^3$, wiedząc że $48=6\\cdot q^3$.",
        "kind": "input",
        "acceptedAnswers": ["8"],
        "reveal": "$48:6=8$, więc $q^3=8$.",
        "formula": "q^3=8"
      },
      {
        "prompt": "Ile wynosi $q$?",
        "kind": "input",
        "acceptedAnswers": ["2"],
        "reveal": "Pierwiastek sześcienny z $8$ to $2$, więc $q=2$.",
        "formula": "q=2"
      },
      {
        "prompt": "Wyznacz $a_1$, wiedząc że $a_2=a_1\\cdot q$.",
        "kind": "input",
        "acceptedAnswers": ["3"],
        "reveal": "$a_2=a_1\\cdot q$, czyli $6=a_1\\cdot2$, skąd $a_1=3$.",
        "formula": "a_1=3"
      }
    ]
  },
  {
    "type": "formula",
    "title": "Suma n początkowych wyrazów ciągu geometrycznego",
    "expression": "S_n = \\begin{cases} a_1\\cdot\\dfrac{1-q^n}{1-q} & \\text{gdy } q\\neq1 \\\\[4pt] n\\cdot a_1 & \\text{gdy } q=1 \\end{cases}",
    "variables": [
      {"symbol": "a_1", "meaning": "pierwszy wyraz ciągu"},
      {"symbol": "q", "meaning": "iloraz ciągu"},
      {"symbol": "n", "meaning": "liczba sumowanych wyrazów"}
    ]
  },
  {
    "type": "examples",
    "title": "Obliczanie sumy wyrazów ciągu geometrycznego",
    "items": [
      {
        "problem": "a_1=1,\\ q=3,\\quad S_6=?",
        "steps": [
          {"text": "Ponieważ $q\\neq1$, stosujemy wzór na sumę.", "formula": "S_6=a_1\\cdot\\dfrac{1-q^6}{1-q}"},
          {"text": "Podstawiamy dane.", "formula": "S_6=1\\cdot\\dfrac{1-3^6}{1-3}"},
          {"text": "Obliczamy $3^6=729$.", "formula": "S_6=\\dfrac{1-729}{-2}"},
          {"text": "Obliczamy wynik.", "formula": "S_6=\\dfrac{-728}{-2}=364"}
        ],
        "answer": "364"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Ciąg geometryczny ma $a_1=2$, $q=1$. Ile wynosi suma $S_5$ pierwszych pięciu wyrazów?",
    "options": ["$10$", "$32$", "$62$", "$5$"],
    "correctIndex": 0,
    "explanation": "Gdy $q=1$, wszystkie wyrazy są równe $a_1$, więc suma to $n\\cdot a_1=5\\cdot2=10$."
  },
  {
    "type": "table",
    "title": "Monotoniczność ciągu geometrycznego",
    "caption": "Zależy od znaku $a_1$ oraz wartości ilorazu $q$.",
    "headers": ["Warunek", "Zachowanie ciągu"],
    "rows": [
      ["$a_1>0$ i $q>1$", "Ciąg rosnący"],
      ["$a_1>0$ i $0<q<1$", "Ciąg malejący"],
      ["$q<0$", "Ciąg naprzemienny (wyrazy na przemian dodatnie i ujemne)"],
      ["$q=1$", "Ciąg stały"]
    ]
  },
  {
    "type": "definition",
    "term": "Trzy kolejne wyrazy ciągu geometrycznego",
    "text": "Jeśli $a_{n-1}, a_n, a_{n+1}$ są trzema kolejnymi wyrazami ciągu geometrycznego, to kwadrat środkowego wyrazu jest równy iloczynowi wyrazów skrajnych — tę zależność wykorzystuje się m.in. do wyznaczania niewiadomej „w środku” trójki liczb tworzących taki ciąg.",
    "formula": "a_n^2 = a_{n-1}\\cdot a_{n+1}"
  },
  {
    "type": "quiz",
    "question": "Liczby $4, x, 9$ tworzą (w tej kolejności) ciąg geometryczny o dodatnich wyrazach. Ile wynosi $x$?",
    "options": ["$6$", "$6{,}5$", "$36$", "$-6$"],
    "correctIndex": 0,
    "explanation": "$x^2=4\\cdot9=36$, a ponieważ wyrazy są dodatnie, $x=6$."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli sprawnie liczysz wyrazy i iloraz ciągu geometrycznego, potrafisz z dwóch danych wyrazów wyznaczyć $q$ i $a_1$, znasz i stosujesz wzór na sumę początkowych wyrazów oraz umiesz wykorzystać własność $a_n^2=a_{n-1}a_{n+1}$ do wyznaczania niewiadomej w trójce liczb tworzących ciąg geometryczny."
  }
]$content2$::jsonb,
  1
);

-- ----------------------------------------------------------------------------
-- Lesson 3: Granice ciągów
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'ciagi'),
  $title3$Granice ciągów$title3$,
  $content3$[
  {
    "type": "intro",
    "text": "W tej lekcji poznasz pojęcie granicy ciągu — odpowiedź na pytanie, do jakiej liczby „zmierzają” wyrazy ciągu, gdy ich numer $n$ rośnie nieograniczenie. Nauczysz się obliczać granice ciągów wymiernych oraz sumować nieskończone ciągi geometryczne. Na koniec poznasz zasadę indukcji matematycznej — metodę dowodzenia wzorów prawdziwych dla wszystkich liczb naturalnych, bardzo przydatną właśnie przy ciągach."
  },
  {
    "type": "definition",
    "term": "Granica ciągu (ujęcie intuicyjne)",
    "text": "Mówimy, że ciąg $(a_n)$ ma granicę $g$ (jest zbieżny do $g$), jeśli wyrazy ciągu dla coraz większych $n$ są coraz bliżej liczby $g$ — praktycznie nieodróżnialne od $g$, gdy $n$ jest bardzo duże. Ciąg, który nie ma granicy, nazywamy rozbieżnym.",
    "formula": "\\lim_{n\\to\\infty} a_n = g"
  },
  {
    "type": "table",
    "title": "Podstawowe granice ciągów",
    "headers": ["Ciąg", "Granica", "Warunek"],
    "rows": [
      ["$a_n=c$ (ciąg stały)", "$c$", "zawsze"],
      ["$a_n=\\dfrac1n$", "$0$", "zawsze"],
      ["$a_n=\\dfrac1{n^k}$", "$0$", "$k>0$"],
      ["$a_n=q^n$", "$0$", "$|q|<1$"],
      ["$a_n=q^n$", "$1$", "$q=1$"],
      ["$a_n=q^n$", "nie istnieje", "$q\\le-1$"],
      ["$a_n=q^n$", "$+\\infty$", "$q>1$"]
    ]
  },
  {
    "type": "quiz",
    "question": "Ile wynosi $\\lim_{n\\to\\infty}\\dfrac{1}{n}$?",
    "options": ["$0$", "$1$", "$\\infty$", "Granica nie istnieje"],
    "correctIndex": 0,
    "explanation": "Gdy $n$ rośnie do nieskończoności, ułamek $\\frac1n$ staje się coraz bliższy zeru."
  },
  {
    "type": "definition",
    "term": "Działania na granicach ciągów zbieżnych",
    "text": "Jeśli ciągi $(a_n)$ i $(b_n)$ mają granice skończone, to granica ich sumy, różnicy i iloczynu istnieje i jest równa odpowiednio sumie, różnicy lub iloczynowi granic. Podobnie dla ilorazu, o ile granica mianownika jest różna od zera.",
    "formula": "\\lim_{n\\to\\infty}(a_n\\pm b_n)=\\lim_{n\\to\\infty}a_n\\pm\\lim_{n\\to\\infty}b_n, \\qquad \\lim_{n\\to\\infty}(a_n\\cdot b_n)=\\lim_{n\\to\\infty}a_n\\cdot\\lim_{n\\to\\infty}b_n"
  },
  {
    "type": "definition",
    "term": "Granice ciągów wymiernych",
    "text": "Aby obliczyć granicę ciągu będącego ilorazem dwóch wielomianów zmiennej $n$, dzielimy licznik i mianownik przez $n$ w najwyższej potędze występującej w mianowniku. Wtedy wszystkie składniki postaci $\\frac{c}{n^k}$ (dla $k>0$) dążą do zera, a o wyniku decydują współczynniki przy najwyższych potęgach.",
    "formula": "\\lim_{n\\to\\infty}\\dfrac{a_kn^k+\\cdots+a_0}{b_mn^m+\\cdots+b_0} = \\begin{cases}0 & k<m\\\\ \\dfrac{a_k}{b_m} & k=m\\\\ \\pm\\infty & k>m\\end{cases}"
  },
  {
    "type": "examples",
    "title": "Obliczanie granic ciągów wymiernych",
    "items": [
      {
        "problem": "\\lim_{n\\to\\infty}\\dfrac{3n+1}{n+5}",
        "steps": [
          {"text": "Dzielimy licznik i mianownik przez najwyższą potęgę $n$ w mianowniku, czyli przez $n$.", "formula": "\\dfrac{3n+1}{n+5}=\\dfrac{3+\\frac1n}{1+\\frac5n}"},
          {"text": "Gdy $n\\to\\infty$, składniki $\\frac1n$ oraz $\\frac5n$ dążą do zera.", "formula": "\\dfrac{3+0}{1+0}"},
          {"text": "Obliczamy granicę.", "formula": "=3"}
        ],
        "answer": "3"
      },
      {
        "problem": "\\lim_{n\\to\\infty}\\dfrac{2n^2-1}{n^3+n}",
        "steps": [
          {"text": "Stopień licznika ($2$) jest mniejszy niż stopień mianownika ($3$).", "formula": "k=2<m=3"},
          {"text": "W takim przypadku granica zawsze wynosi zero.", "formula": "\\lim_{n\\to\\infty}\\dfrac{2n^2-1}{n^3+n}=0"}
        ],
        "answer": "0"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Ile wynosi $\\lim_{n\\to\\infty}\\dfrac{5n^2+2}{2n^2-3}$?",
    "options": ["$\\dfrac{5}{2}$", "$0$", "$\\infty$", "$5$"],
    "correctIndex": 0,
    "explanation": "Stopnie licznika i mianownika są równe ($2$), więc granica to iloraz współczynników przy najwyższych potęgach: $\\dfrac52$."
  },
  {
    "type": "reveal-steps",
    "title": "Krok po kroku: granica ciągu wymiernego",
    "problem": "Oblicz $\\lim_{n\\to\\infty}\\dfrac{4n^3-2n}{2n^3+n^2+1}$",
    "steps": [
      {
        "prompt": "Przez jaką potęgę $n$ należy podzielić licznik i mianownik?",
        "kind": "choice",
        "options": ["$n^3$", "$n^2$", "$n$"],
        "correctIndex": 0,
        "reveal": "Najwyższa potęga $n$ w mianowniku (i w liczniku) to $n^3$, więc dzielimy przez nią.",
        "formula": "\\dfrac{4n^3-2n}{2n^3+n^2+1} = \\dfrac{4-\\frac2{n^2}}{2+\\frac1n+\\frac1{n^3}}"
      },
      {
        "prompt": "Do jakiej liczby dąży każdy składnik postaci $\\frac{c}{n^k}$ ($k>0$), gdy $n\\to\\infty$?",
        "kind": "input",
        "acceptedAnswers": ["0"],
        "reveal": "Każdy taki składnik dąży do zera, bo jego mianownik rośnie nieograniczenie.",
        "formula": "\\lim_{n\\to\\infty}\\dfrac{c}{n^k}=0"
      },
      {
        "prompt": "Jaka jest granica całego wyrażenia?",
        "kind": "choice",
        "options": ["$2$", "$4$", "$0$", "$\\infty$"],
        "correctIndex": 0,
        "reveal": "Po podstawieniu granic składników otrzymujemy $\\dfrac{4-0}{2+0+0}=\\dfrac42=2$.",
        "formula": "\\lim_{n\\to\\infty}\\dfrac{4n^3-2n}{2n^3+n^2+1}=2"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Ile wynosi $\\lim_{n\\to\\infty} q^n$ dla $q=\\dfrac12$?",
    "options": ["$0$", "$1$", "$\\dfrac12$", "$\\infty$"],
    "correctIndex": 0,
    "explanation": "Ponieważ $|q|<1$, kolejne potęgi $q^n$ dążą do zera."
  },
  {
    "type": "definition",
    "term": "Suma nieskończonego szeregu geometrycznego",
    "text": "Jeśli ciąg geometryczny $(a_n)$ ma iloraz spełniający $|q|<1$, to sumy częściowe $S_n$ mają skończoną granicę — nazywamy ją sumą nieskończonego szeregu geometrycznego. Wynika ona z przejścia granicznego we wzorze na $S_n$, ponieważ wtedy $q^n\\to0$.",
    "formula": "S = \\lim_{n\\to\\infty} S_n = \\dfrac{a_1}{1-q}, \\qquad |q|<1"
  },
  {
    "type": "examples",
    "title": "Obliczanie sumy nieskończonego szeregu geometrycznego",
    "items": [
      {
        "problem": "a_1=8,\\ q=\\dfrac12,\\quad S=?",
        "steps": [
          {"text": "Sprawdzamy warunek zbieżności.", "formula": "\\left|\\dfrac12\\right|<1"},
          {"text": "Stosujemy wzór na sumę szeregu geometrycznego.", "formula": "S=\\dfrac{a_1}{1-q}"},
          {"text": "Podstawiamy dane.", "formula": "S=\\dfrac{8}{1-\\frac12}=\\dfrac{8}{\\frac12}"},
          {"text": "Obliczamy wynik.", "formula": "S=16"}
        ],
        "answer": "16"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Dla jakiego warunku na $q$ istnieje suma nieskończonego szeregu geometrycznego?",
    "options": ["$|q|<1$", "$q>0$", "$q\\neq0$", "$q\\ge1$"],
    "correctIndex": 0,
    "explanation": "Tylko wtedy sumy częściowe $S_n$ mają skończoną granicę — dla $|q|\\ge1$ szereg jest rozbieżny."
  },
  {
    "type": "definition",
    "term": "Zasada indukcji matematycznej",
    "text": "To metoda dowodzenia, że jakieś stwierdzenie $T(n)$ jest prawdziwe dla każdej liczby naturalnej $n\\ge n_0$. Składa się z dwóch kroków: (1) krok bazowy — sprawdzamy, że $T(n_0)$ jest prawdziwe; (2) krok indukcyjny — zakładamy, że $T(k)$ jest prawdziwe dla pewnego $k\\ge n_0$ (założenie indukcyjne), i na tej podstawie wykazujemy, że $T(k+1)$ też jest prawdziwe. Jeśli oba kroki się powiodą, to $T(n)$ jest prawdziwe dla wszystkich $n\\ge n_0$.",
    "formula": "T(n_0)\\ \\land\\ \\big(T(k)\\Rightarrow T(k+1)\\big) \\implies T(n)\\ \\text{dla każdego } n\\ge n_0"
  },
  {
    "type": "examples",
    "title": "Dowód przez indukcję matematyczną: suma początkowych liczb naturalnych",
    "items": [
      {
        "problem": "1+2+3+\\cdots+n=\\dfrac{n(n+1)}{2}, \\qquad n\\ge1",
        "steps": [
          {"text": "Krok bazowy: sprawdzamy wzór dla $n=1$.", "formula": "1=\\dfrac{1\\cdot2}{2}=1"},
          {"text": "Założenie indukcyjne: zakładamy, że wzór zachodzi dla pewnego $k$.", "formula": "1+2+\\cdots+k=\\dfrac{k(k+1)}{2}"},
          {"text": "Krok indukcyjny: do obu stron dodajemy $(k+1)$.", "formula": "1+2+\\cdots+k+(k+1)=\\dfrac{k(k+1)}{2}+(k+1)"},
          {"text": "Sprowadzamy prawą stronę do wspólnego mianownika i wyłączamy $(k+1)$ przed nawias.", "formula": "\\dfrac{k(k+1)+2(k+1)}{2}=\\dfrac{(k+1)(k+2)}{2}"},
          {"text": "Otrzymaliśmy dokładnie wzór dla $n=k+1$, więc na mocy zasady indukcji matematycznej wzór jest prawdziwy dla każdego $n\\ge1$.", "formula": "1+2+\\cdots+k+(k+1)=\\dfrac{(k+1)(k+2)}{2}"}
        ],
        "answer": "\\text{teza prawdziwa dla każdego } n\\ge1"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "W dowodzie indukcyjnym krok indukcyjny polega na wykazaniu, że:",
    "options": ["Jeśli teza zachodzi dla $k$, to zachodzi też dla $k+1$", "Teza zachodzi dla wszystkich liczb parzystych", "Teza zachodzi dla $n=1$", "Teza nie zachodzi dla żadnego $k$"],
    "correctIndex": 0,
    "explanation": "To właśnie krok indukcyjny — wykazanie implikacji $T(k)\\Rightarrow T(k+1)$ — w połączeniu z krokiem bazowym pozwala wnioskować o prawdziwości tezy dla wszystkich $n\\ge n_0$."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli rozumiesz intuicyjnie, czym jest granica ciągu, sprawnie obliczasz granice ciągów wymiernych (dzieląc przez najwyższą potęgę $n$), znasz i potrafisz zastosować wzór na sumę nieskończonego szeregu geometrycznego (dla $|q|<1$) oraz rozumiesz i umiesz przeprowadzić prosty dowód przez indukcję matematyczną, wskazując wyraźnie krok bazowy i krok indukcyjny."
  }
]$content3$::jsonb,
  2
);

-- ----------------------------------------------------------------------------
-- Lesson 4: Ciągi rekurencyjne i zastosowania finansowe
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'ciagi'),
  $title4$Ciągi rekurencyjne i zastosowania finansowe$title4$,
  $content4$[
  {
    "type": "intro",
    "text": "W tej lekcji przyjrzymy się bliżej ciągom określonym rekurencyjnie oraz zobaczymy, jak ciągi arytmetyczne i geometryczne opisują realne sytuacje finansowe — oszczędzanie na lokacie, spłatę kredytu czy wzrost kapitału przy różnych sposobach naliczania odsetek."
  },
  {
    "type": "definition",
    "term": "Ciąg rekurencyjny",
    "text": "Ciąg rekurencyjny to taki, w którym podajemy pierwszy wyraz (lub kilka pierwszych wyrazów) oraz wzór pozwalający obliczyć każdy kolejny wyraz na podstawie wyrazu (lub wyrazów) poprzednich. W przeciwieństwie do wzoru ogólnego, żeby policzyć np. setny wyraz, zwykle trzeba wcześniej policzyć wszystkie wyrazy poprzedzające.",
    "formula": "a_1 = \\text{(dane)}, \\qquad a_{n+1} = f(a_n)"
  },
  {
    "type": "examples",
    "title": "Obliczanie wyrazów ciągu rekurencyjnego",
    "items": [
      {
        "problem": "a_1=2,\\quad a_{n+1}=a_n+3",
        "steps": [
          {"text": "Obliczamy $a_2$, podstawiając $n=1$.", "formula": "a_2=a_1+3=2+3=5"},
          {"text": "Obliczamy $a_3$.", "formula": "a_3=a_2+3=5+3=8"},
          {"text": "Obliczamy $a_4$.", "formula": "a_4=a_3+3=8+3=11"}
        ],
        "answer": "a_2=5,\\ a_3=8,\\ a_4=11"
      },
      {
        "problem": "a_1=1,\\quad a_{n+1}=2a_n-1",
        "steps": [
          {"text": "Obliczamy $a_2$.", "formula": "a_2=2\\cdot1-1=1"},
          {"text": "Obliczamy $a_3$.", "formula": "a_3=2\\cdot1-1=1"},
          {"text": "Zauważamy, że ciąg jest stały — każdy kolejny wyraz też będzie równy $1$.", "formula": "a_n=1\\ \\text{dla każdego } n"}
        ],
        "answer": "a_n=1"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Ciąg dany jest rekurencyjnie: $a_1=5$, $a_{n+1}=a_n-2$. Ile wynosi $a_4$?",
    "options": ["$-1$", "$3$", "$1$", "$-3$"],
    "correctIndex": 0,
    "explanation": "$a_2=3$, $a_3=1$, $a_4=-1$."
  },
  {
    "type": "reveal-steps",
    "title": "Ciąg zależny od dwóch poprzednich wyrazów",
    "problem": "Ciąg spełnia $a_1=1$, $a_2=1$, $a_{n+2}=a_{n+1}+a_n$ (tzw. ciąg Fibonacciego). Oblicz $a_5$.",
    "steps": [
      {
        "prompt": "Ile wynosi $a_3$?",
        "kind": "input",
        "acceptedAnswers": ["2"],
        "reveal": "$a_3=a_2+a_1=1+1=2$.",
        "formula": "a_3=1+1=2"
      },
      {
        "prompt": "Ile wynosi $a_4$?",
        "kind": "input",
        "acceptedAnswers": ["3"],
        "reveal": "$a_4=a_3+a_2=2+1=3$.",
        "formula": "a_4=2+1=3"
      },
      {
        "prompt": "Ile wynosi $a_5$?",
        "kind": "input",
        "acceptedAnswers": ["5"],
        "reveal": "$a_5=a_4+a_3=3+2=5$.",
        "formula": "a_5=3+2=5"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Który wzór definiuje ciąg rekurencyjnie zależny od DWÓCH poprzednich wyrazów?",
    "options": ["$a_{n+2}=a_{n+1}+a_n$", "$a_{n+1}=3a_n$", "$a_n=2n+1$", "$a_{n+1}=a_n+5$"],
    "correctIndex": 0,
    "explanation": "Tylko w tym wzorze, żeby obliczyć kolejny wyraz, potrzebujemy obu dwóch wyrazów bezpośrednio go poprzedzających."
  },
  {
    "type": "intro",
    "text": "Ciągi arytmetyczne i geometryczne mają ważne zastosowania w finansach — pozwalają obliczać, jak rośnie kapitał na lokacie przy różnych sposobach naliczania odsetek oraz jak zmienia się zadłużenie w trakcie spłaty kredytu."
  },
  {
    "type": "definition",
    "term": "Procent prosty",
    "text": "Przy oprocentowaniu prostym odsetki za każdy okres liczone są zawsze od kwoty początkowej (kapitału), a nie od kwoty już powiększonej o wcześniej naliczone odsetki. Kapitał po $n$ okresach rośnie więc jak ciąg arytmetyczny.",
    "formula": "K_n = K_0(1+n\\cdot r) \\quad \\text{(procent prosty)}"
  },
  {
    "type": "definition",
    "term": "Procent składany",
    "text": "Przy oprocentowaniu składanym odsetki naliczone w poprzednim okresie doliczane są do kapitału i w kolejnym okresie same przynoszą odsetki. Kapitał po $n$ okresach rośnie więc jak ciąg geometryczny o ilorazie $(1+r)$.",
    "formula": "K_n = K_0(1+r)^n \\quad \\text{(procent składany)}"
  },
  {
    "type": "examples",
    "title": "Lokata z oprocentowaniem składanym",
    "items": [
      {
        "problem": "K_0=2000\\ \\text{zł},\\quad r=5\\%=0{,}05\\ \\text{rocznie},\\quad n=3\\ \\text{lata}",
        "steps": [
          {"text": "Stosujemy wzór na procent składany.", "formula": "K_3=K_0(1+r)^3"},
          {"text": "Podstawiamy dane.", "formula": "K_3=2000\\cdot(1{,}05)^3"},
          {"text": "Obliczamy $(1{,}05)^3\\approx1{,}157625$.", "formula": "K_3\\approx2000\\cdot1{,}157625"},
          {"text": "Zaokrąglamy wynik do pełnych groszy.", "formula": "K_3\\approx2315{,}25\\ \\text{zł}"}
        ],
        "answer": "\\approx2315{,}25\\ \\text{zł}"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Kapitał 1000 zł ulokowano na 2 lata przy oprocentowaniu składanym $10\\%$ rocznie. Ile wynosi kapitał po 2 latach?",
    "options": ["$1210$ zł", "$1200$ zł", "$1100$ zł", "$1221$ zł"],
    "correctIndex": 0,
    "explanation": "$K_2=1000\\cdot(1{,}1)^2=1000\\cdot1{,}21=1210$ zł."
  },
  {
    "type": "table",
    "title": "Procent prosty a procent składany",
    "headers": ["Rodzaj oprocentowania", "Wzór", "Typ ciągu"],
    "rows": [
      ["Procent prosty", "$K_n=K_0(1+nr)$", "arytmetyczny"],
      ["Procent składany", "$K_n=K_0(1+r)^n$", "geometryczny"]
    ]
  },
  {
    "type": "reveal-steps",
    "title": "Kredyt spłacany w równych ratach kapitałowych",
    "problem": "Kredyt w wysokości $K_0=6000$ zł spłacany jest w 6 równych ratach kapitałowych (czyli co miesiąc spłaca się tę samą część kapitału). Ile wynosi rata kapitałowa oraz ile wynosi zadłużenie po 4 miesiącach?",
    "steps": [
      {
        "prompt": "Jaka jest wysokość jednej raty kapitałowej?",
        "kind": "input",
        "acceptedAnswers": ["1000"],
        "reveal": "Ratę kapitałową obliczamy, dzieląc $K_0$ przez liczbę rat: $6000:6=1000$ zł.",
        "formula": "\\dfrac{6000}{6}=1000"
      },
      {
        "prompt": "Czy zadłużenie po kolejnych miesiącach tworzy ciąg arytmetyczny czy geometryczny?",
        "kind": "choice",
        "options": ["Arytmetyczny (maleje o stałą kwotę)", "Geometryczny (maleje o stały procent)", "Żaden z powyższych"],
        "correctIndex": 0,
        "reveal": "Skoro co miesiąc spłacamy tę samą kwotę kapitału (1000 zł), zadłużenie maleje o stałą liczbę — to ciąg arytmetyczny o różnicy $r=-1000$."
      },
      {
        "prompt": "Ile wynosi zadłużenie po 4 miesiącach (czyli po spłaceniu 4 rat)?",
        "kind": "input",
        "acceptedAnswers": ["2000"],
        "reveal": "Po 4 ratach spłacono $4\\cdot1000=4000$ zł, więc zostało $6000-4000=2000$ zł zadłużenia.",
        "formula": "6000-4\\cdot1000=2000"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Kredyt 9000 zł jest spłacany w 9 równych ratach kapitałowych. Ile wynosi zadłużenie po 3 ratach?",
    "options": ["$6000$ zł", "$3000$ zł", "$8000$ zł", "$1000$ zł"],
    "correctIndex": 0,
    "explanation": "Rata kapitałowa to $9000:9=1000$ zł. Po 3 ratach spłacono $3000$ zł, więc zostało $9000-3000=6000$ zł zadłużenia."
  },
  {
    "type": "tip",
    "variant": "warning",
    "text": "Uważaj przy zadaniach z lokatami i kredytami: dokładnie sprawdzaj, czy oprocentowanie jest podane w skali rocznej i jak często następuje kapitalizacja odsetek (rocznie, kwartalnie, miesięcznie). Jeśli kapitalizacja jest częstsza niż raz w roku, oprocentowanie i liczbę okresów trzeba odpowiednio przeliczyć."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli potrafisz obliczać kolejne wyrazy ciągu rekurencyjnego (także zależnego od dwóch poprzednich wyrazów), rozumiesz różnicę między procentem prostym a składanym i wiążesz je z ciągiem arytmetycznym oraz geometrycznym, a także umiesz obliczyć kapitał po kilku okresach oszczędzania lub zadłużenie w trakcie spłaty kredytu w równych ratach kapitałowych."
  }
]$content4$::jsonb,
  3
);
