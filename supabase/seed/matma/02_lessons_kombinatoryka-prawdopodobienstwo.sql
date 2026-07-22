-- ============================================================================
-- supabase/seed/matma/02_lessons_kombinatoryka-prawdopodobienstwo.sql
-- Interactive lesson content (math_lessons) for the
-- "kombinatoryka-prawdopodobienstwo" department: Kombinatoryka i rachunek
-- prawdopodobieństwa (permutacje, wariacje, kombinacje, prawdopodobieństwo
-- klasyczne i warunkowe, schemat Bernoulliego, prawdopodobieństwo całkowite,
-- wartość oczekiwana). content is a jsonb array of MathBlock (see
-- lib/matma/lesson-blocks.ts).
--
-- Idempotent: deletes existing lessons for this topic first. Run
-- 01_topics.sql BEFORE this file — it looks up topic_id by slug.
-- ============================================================================

delete from math_lessons
where topic_id = (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo');

-- ----------------------------------------------------------------------------
-- Lesson 1: Reguła mnożenia, silnia i permutacje
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo'),
  $title1$Reguła mnożenia, silnia i permutacje$title1$,
  $content1$[
  {
    "type": "basics-recap",
    "title": "Zanim zaczniesz: reguła mnożenia i silnia",
    "text": "Reguła mnożenia (podstawowa zasada zliczania) mówi: jeśli pewną czynność A można wykonać na $m$ sposobów, a niezależnie od tego wyboru czynność B można wykonać na $n$ sposobów, to obie czynności wykonane razem (najpierw A, potem B) można wykonać na $m\\cdot n$ sposobów. Jeśli czynności jest więcej, po prostu mnożymy wszystkie liczby sposobów przez siebie. Na przykład: jeśli masz 3 koszulki i 2 pary spodni, to możesz skomponować $3\\cdot2=6$ różnych strojów. Ta prosta zasada jest fundamentem całej kombinatoryki — wszystkie wzory, które poznasz w tym dziale (permutacje, wariacje, kombinacje), są w gruncie rzeczy konsekwencją reguły mnożenia. Przyda ci się też pojęcie silni: $n!$ (czytaj: „n silnia”) to iloczyn wszystkich liczb naturalnych od $1$ do $n$, a dodatkowo umawiamy się, że $0!=1$.",
    "formula": "m\\cdot n \\qquad\\text{oraz}\\qquad n! = n\\cdot(n-1)\\cdot(n-2)\\cdots2\\cdot1,\\ \\ 0!=1",
    "controlQuiz": [
      {
        "question": "Na obiad można wybrać jedną z 3 zup i jedno z 4 drugich dań. Na ile sposobów można skomponować obiad (zupa + drugie danie)?",
        "options": ["7", "12", "3", "4"],
        "correctIndex": 1,
        "explanation": "Z reguły mnożenia: liczba zup razy liczba drugich dań, czyli $3\\cdot4=12$."
      },
      {
        "question": "Ile wynosi $4!$ (cztery silnia)?",
        "options": ["24", "10", "16", "4"],
        "correctIndex": 0,
        "explanation": "$4!=4\\cdot3\\cdot2\\cdot1=24$."
      },
      {
        "question": "Rzucamy kolejno monetą i kostką do gry. Ile jest wszystkich możliwych wyników (orzeł/reszka oraz liczba oczek 1–6)?",
        "options": ["8", "12", "6", "2"],
        "correctIndex": 1,
        "explanation": "Moneta daje 2 możliwe wyniki, kostka 6, więc z reguły mnożenia: $2\\cdot6=12$."
      }
    ]
  },
  {
    "type": "definition",
    "term": "Silnia",
    "text": "Silnią liczby naturalnej $n\\ge1$ nazywamy iloczyn wszystkich liczb naturalnych od $1$ do $n$. Dodatkowo przyjmujemy umownie $0!=1$ — dzięki temu wzory kombinatoryczne działają poprawnie również w przypadkach brzegowych.",
    "formula": "n! = n\\cdot(n-1)\\cdot(n-2)\\cdots2\\cdot1, \\qquad 0!=1"
  },
  {
    "type": "quiz",
    "question": "Ile wynosi $\\dfrac{6!}{4!}$?",
    "options": ["30", "2", "720", "6"],
    "correctIndex": 0,
    "explanation": "$\\dfrac{6!}{4!}=\\dfrac{6\\cdot5\\cdot4!}{4!}=6\\cdot5=30$ — czynnik $4!$ się skraca."
  },
  {
    "type": "definition",
    "term": "Permutacja zbioru n-elementowego",
    "text": "Permutacją zbioru złożonego z $n$ różnych elementów nazywamy dowolne ustawienie wszystkich tych elementów w ciąg (w jakiejś kolejności). Liczbę wszystkich permutacji $n$-elementowego zbioru oznaczamy $P_n$ i obliczamy jako $n!$ — wynika to wprost z reguły mnożenia: na pierwsze miejsce mamy $n$ możliwości, na drugie $n-1$ (bo jeden element już zajęty), na trzecie $n-2$, i tak dalej.",
    "formula": "P_n = n!"
  },
  {
    "type": "examples",
    "title": "Obliczanie liczby permutacji",
    "items": [
      {
        "problem": "\\text{5 różnych książek ustawiamy na półce w rzędzie.}\\quad P_5=?",
        "steps": [
          {"text": "Permutacja zbioru 5-elementowego to liczba sposobów ustawienia wszystkich 5 elementów w kolejności.", "formula": "P_5=5!"},
          {"text": "Obliczamy silnię.", "formula": "P_5=5\\cdot4\\cdot3\\cdot2\\cdot1"},
          {"text": "Wynik.", "formula": "P_5=120"}
        ],
        "answer": "120"
      },
      {
        "problem": "\\text{Ile jest sposobów ustawienia w kolejce 4 osób?}",
        "steps": [
          {"text": "Liczba sposobów ustawienia 4 osób w kolejce to permutacja zbioru 4-elementowego.", "formula": "P_4=4!"},
          {"text": "Obliczamy.", "formula": "P_4=24"}
        ],
        "answer": "24"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Na ile sposobów można ustawić w rzędzie 6 różnych książek?",
    "options": ["720", "36", "46656", "6"],
    "correctIndex": 0,
    "explanation": "$P_6=6!=720$."
  },
  {
    "type": "reveal-steps",
    "title": "Permutacje z ograniczeniem",
    "problem": "Na ile sposobów można ustawić w rzędzie 5 osób, jeśli dwie konkretne osoby (A i B) muszą stać obok siebie?",
    "steps": [
      {
        "prompt": "Jeśli osoby A i B mają stać obok siebie, ile „bloków” mamy łącznie do ustawienia (traktując A i B razem jako jeden sklejony blok)?",
        "kind": "choice",
        "options": ["4 bloki (blok AB oraz 3 pozostałe osoby)", "5 bloków", "3 bloki"],
        "correctIndex": 0,
        "reveal": "Traktując A i B jako jeden „sklejony” blok, mamy do ustawienia 4 elementy: ten blok oraz pozostałe 3 osoby."
      },
      {
        "prompt": "Na ile sposobów można ustawić w rzędzie te 4 bloki?",
        "kind": "input",
        "acceptedAnswers": ["24", "4!"],
        "reveal": "To permutacja 4-elementowa: $4!=24$.",
        "formula": "4!=24"
      },
      {
        "prompt": "Na ile sposobów osoby A i B mogą zamienić się miejscami wewnątrz swojego bloku (kolejność AB lub BA)?",
        "kind": "input",
        "acceptedAnswers": ["2", "2!"],
        "reveal": "Są dwie możliwe kolejności: AB lub BA, czyli $2!=2$ sposoby.",
        "formula": "2!=2"
      },
      {
        "prompt": "Ile łącznie jest ustawień spełniających warunek zadania?",
        "kind": "input",
        "acceptedAnswers": ["48"],
        "reveal": "Z reguły mnożenia mnożymy liczby sposobów: $24\\cdot2=48$.",
        "formula": "24\\cdot2=48"
      }
    ]
  },
  {
    "type": "definition",
    "term": "Permutacje z powtórzeniami",
    "text": "Gdy wśród $n$ elementów do ustawienia niektóre są nierozróżnialne (powtarzają się) — np. $k_1$ elementów jednego rodzaju, $k_2$ elementów drugiego rodzaju, itd., przy czym $k_1+k_2+\\cdots+k_m=n$ — to liczba różnych ustawień jest mniejsza niż $n!$, bo zamiana miejscami elementów tego samego rodzaju nie daje nowego ustawienia. Liczbę tę obliczamy, dzieląc $n!$ przez silnie liczebności poszczególnych grup.",
    "formula": "P_n^{k_1,k_2,\\ldots,k_m} = \\dfrac{n!}{k_1!\\,k_2!\\,\\cdots\\,k_m!}, \\qquad k_1+k_2+\\cdots+k_m=n"
  },
  {
    "type": "examples",
    "title": "Permutacje z powtórzeniami",
    "items": [
      {
        "problem": "\\text{Ile różnych ciągów liter można ułożyć ze wszystkich liter słowa MAMA?}",
        "steps": [
          {"text": "Słowo MAMA ma 4 litery: M występuje 2 razy, A występuje 2 razy.", "formula": "n=4,\\ k_M=2,\\ k_A=2"},
          {"text": "Stosujemy wzór na permutacje z powtórzeniami.", "formula": "P=\\dfrac{4!}{2!\\cdot2!}"},
          {"text": "Obliczamy.", "formula": "P=\\dfrac{24}{4}=6"}
        ],
        "answer": "6"
      },
      {
        "problem": "\\text{Ile różnych ciągów liter można ułożyć ze wszystkich liter słowa ANANAS?}",
        "steps": [
          {"text": "Słowo ANANAS ma 6 liter: A występuje 3 razy, N występuje 2 razy, S występuje 1 raz.", "formula": "n=6,\\ k_A=3,\\ k_N=2,\\ k_S=1"},
          {"text": "Stosujemy wzór na permutacje z powtórzeniami.", "formula": "P=\\dfrac{6!}{3!\\cdot2!\\cdot1!}"},
          {"text": "Obliczamy.", "formula": "P=\\dfrac{720}{6\\cdot2\\cdot1}=\\dfrac{720}{12}=60"}
        ],
        "answer": "60"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Ile różnych ciągów liter można ułożyć ze wszystkich liter słowa TATA?",
    "options": ["6", "24", "12", "4"],
    "correctIndex": 0,
    "explanation": "Słowo TATA ma 4 litery: T i A powtarzają się po 2 razy, więc $P=\\dfrac{4!}{2!\\cdot2!}=\\dfrac{24}{4}=6$."
  },
  {
    "type": "table",
    "title": "Podsumowanie: silnia i permutacje",
    "headers": ["Pojęcie", "Wzór", "Kiedy stosować"],
    "rows": [
      ["Silnia $n!$", "$n!=n(n-1)\\cdots1,\\ 0!=1$", "Liczenie porządków i w innych wzorach kombinatorycznych"],
      ["Permutacja bez powtórzeń", "$P_n=n!$", "Ustawianie w kolejności $n$ RÓŻNYCH elementów"],
      ["Permutacja z powtórzeniami", "$P_n^{k_1,\\ldots,k_m}=\\dfrac{n!}{k_1!\\cdots k_m!}$", "Ustawianie $n$ elementów, gdy niektóre się powtarzają"]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli swobodnie stosujesz regułę mnożenia do liczenia wariantów złożonych czynności, sprawnie liczysz silnię i upraszczasz wyrażenia typu $n!/k!$, rozumiesz, czym jest permutacja zbioru $n$-elementowego, i potrafisz obliczyć liczbę permutacji zarówno wtedy, gdy wszystkie elementy są różne, jak i gdy niektóre się powtarzają."
  }
]$content1$::jsonb,
  0
);

-- ----------------------------------------------------------------------------
-- Lesson 2: Wariacje i kombinacje
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo'),
  $title2$Wariacje i kombinacje$title2$,
  $content2$[
  {
    "type": "intro",
    "text": "W poprzedniej lekcji ustawialiśmy w kolejności WSZYSTKIE elementy zbioru. Teraz nauczysz się liczyć sytuacje, w których wybieramy tylko CZĘŚĆ elementów ($k$ z $n$) — a to, czy kolejność wyboru ma znaczenie, decyduje o tym, czy liczymy wariację (kolejność ważna), czy kombinację (kolejność nieważna)."
  },
  {
    "type": "definition",
    "term": "Wariacja bez powtórzeń",
    "text": "Wariacją bez powtórzeń $k$-elementową ze zbioru $n$-elementowego ($k\\le n$) nazywamy dowolny ciąg $k$ RÓŻNYCH elementów wybranych z tego zbioru, w którym kolejność ma znaczenie. Liczbę takich wariacji obliczamy podobnie jak permutację, tylko zatrzymujemy się po $k$ krokach.",
    "formula": "V_n^k = \\dfrac{n!}{(n-k)!} = n\\cdot(n-1)\\cdots(n-k+1)"
  },
  {
    "type": "examples",
    "title": "Obliczanie liczby wariacji bez powtórzeń",
    "items": [
      {
        "problem": "\\text{W zawodach startuje 8 zawodników. Na ile sposobów można rozdać podium (miejsca I, II, III)?}",
        "steps": [
          {"text": "Wybieramy i ustawiamy w kolejności 3 spośród 8 zawodników — to wariacja bez powtórzeń.", "formula": "V_8^3=\\dfrac{8!}{(8-3)!}=\\dfrac{8!}{5!}"},
          {"text": "Upraszczamy, skracając silnię.", "formula": "V_8^3=8\\cdot7\\cdot6"},
          {"text": "Obliczamy.", "formula": "V_8^3=336"}
        ],
        "answer": "336"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "W konkursie startuje 10 osób. Na ile sposobów można przyznać złoty, srebrny i brązowy medal (dla trzech różnych osób)?",
    "options": ["720", "1000", "30", "120"],
    "correctIndex": 0,
    "explanation": "Kolejność (kto zdobył które miejsce) ma znaczenie, więc liczymy wariację: $V_{10}^3=10\\cdot9\\cdot8=720$."
  },
  {
    "type": "definition",
    "term": "Wariacja z powtórzeniami",
    "text": "Wariacją z powtórzeniami $k$-elementową ze zbioru $n$-elementowego nazywamy dowolny ciąg długości $k$, którego wyrazy wybieramy ze zbioru $n$-elementowego, przy czym elementy MOGĄ się powtarzać, a kolejność ma znaczenie. Na każdą z $k$ pozycji mamy $n$ możliwości, niezależnie od wcześniejszych wyborów — stąd z reguły mnożenia wychodzi $n^k$.",
    "formula": "\\overline{V}_n^k = n^k"
  },
  {
    "type": "examples",
    "title": "Obliczanie liczby wariacji z powtórzeniami",
    "items": [
      {
        "problem": "\\text{Ile jest różnych kodów PIN złożonych z 4 cyfr (cyfry mogą się powtarzać)?}",
        "steps": [
          {"text": "Każdą z 4 pozycji kodu można wypełnić dowolną z 10 cyfr, a cyfry mogą się powtarzać — to wariacja z powtórzeniami.", "formula": "\\overline{V}_{10}^4=10^4"},
          {"text": "Obliczamy.", "formula": "\\overline{V}_{10}^4=10\\,000"}
        ],
        "answer": "10000"
      },
      {
        "problem": "\\text{Ile jest możliwych wyników trzykrotnego rzutu kostką (z uwzględnieniem kolejności rzutów)?}",
        "steps": [
          {"text": "Każdy z 3 rzutów daje 6 możliwych wyników, wyniki mogą się powtarzać, a kolejność rzutów ma znaczenie.", "formula": "\\overline{V}_6^3=6^3"},
          {"text": "Obliczamy.", "formula": "\\overline{V}_6^3=216"}
        ],
        "answer": "216"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Hasło składa się z 3 liter alfabetu angielskiego (26 liter), litery mogą się powtarzać. Ile jest możliwych haseł?",
    "options": ["17576", "15600", "78", "26"],
    "correctIndex": 0,
    "explanation": "To wariacja z powtórzeniami: $\\overline{V}_{26}^3=26^3=17576$."
  },
  {
    "type": "reveal-steps",
    "title": "Wariacja czy permutacja? Krok po kroku",
    "problem": "W grupie 12 uczniów wybieramy przewodniczącego i zastępcę (to dwie różne funkcje). Na ile sposobów można to zrobić?",
    "steps": [
      {
        "prompt": "Czy kolejność wyboru (kto jest przewodniczącym, a kto zastępcą) ma tu znaczenie?",
        "kind": "choice",
        "options": ["Tak, to różne funkcje, więc kolejność ma znaczenie", "Nie, kolejność nie ma znaczenia"],
        "correctIndex": 0,
        "reveal": "Przewodniczący i zastępca to różne role, więc zamiana osób miejscami daje inny wynik — kolejność jest istotna, liczymy więc wariację."
      },
      {
        "prompt": "Na ile sposobów można wybrać przewodniczącego spośród 12 uczniów?",
        "kind": "input",
        "acceptedAnswers": ["12"],
        "reveal": "Przewodniczącego można wybrać na 12 sposobów (dowolny z 12 uczniów).",
        "formula": "12"
      },
      {
        "prompt": "Ilu uczniów zostaje do wyboru na zastępcę, gdy przewodniczący jest już wybrany?",
        "kind": "input",
        "acceptedAnswers": ["11"],
        "reveal": "Zastępcą nie może zostać już wybrany przewodniczący, więc zostaje 11 kandydatów.",
        "formula": "11"
      },
      {
        "prompt": "Ile łącznie jest sposobów wyboru przewodniczącego i zastępcy?",
        "kind": "input",
        "acceptedAnswers": ["132"],
        "reveal": "Z reguły mnożenia: $12\\cdot11=132$.",
        "formula": "12\\cdot11=132"
      }
    ]
  },
  {
    "type": "definition",
    "term": "Kombinacja (bez powtórzeń)",
    "text": "Kombinacją $k$-elementową ze zbioru $n$-elementowego ($k\\le n$) nazywamy dowolny $k$-elementowy PODZBIÓR tego zbioru — tu kolejność wyboru elementów NIE ma znaczenia. Liczbę kombinacji zapisujemy symbolem Newtona (dwumianowym) $\\binom{n}{k}$ i wyznaczamy, dzieląc liczbę wariacji $V_n^k$ przez liczbę sposobów uporządkowania $k$ wybranych elementów ($k!$), bo te wszystkie uporządkowania odpowiadają temu samemu podzbiorowi.",
    "formula": "C_n^k=\\binom{n}{k}=\\dfrac{n!}{k!\\,(n-k)!}, \\qquad 0\\le k\\le n"
  },
  {
    "type": "examples",
    "title": "Obliczanie liczby kombinacji",
    "items": [
      {
        "problem": "\\text{Na ile sposobów można wybrać 3-osobową delegację spośród 8 uczniów?}",
        "steps": [
          {"text": "Kolejność wyboru osób nie ma znaczenia — liczymy kombinację.", "formula": "C_8^3=\\binom{8}{3}=\\dfrac{8!}{3!\\cdot5!}"},
          {"text": "Upraszczamy silnię.", "formula": "C_8^3=\\dfrac{8\\cdot7\\cdot6}{3\\cdot2\\cdot1}"},
          {"text": "Obliczamy.", "formula": "C_8^3=\\dfrac{336}{6}=56"}
        ],
        "answer": "56"
      },
      {
        "problem": "\\text{Na ile sposobów można wybrać 2-osobowy zespół z grupy 6 osób?}",
        "steps": [
          {"text": "Kolejność w zespole nie ma znaczenia — liczymy kombinację.", "formula": "C_6^2=\\binom{6}{2}=\\dfrac{6!}{2!\\cdot4!}"},
          {"text": "Upraszczamy.", "formula": "C_6^2=\\dfrac{6\\cdot5}{2\\cdot1}"},
          {"text": "Obliczamy.", "formula": "C_6^2=15"}
        ],
        "answer": "15"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Ile jest sposobów wybrania 4-osobowej grupy dyżurnych spośród 10 uczniów w klasie?",
    "options": ["210", "5040", "40", "24"],
    "correctIndex": 0,
    "explanation": "To kombinacja: $C_{10}^4=\\binom{10}{4}=\\dfrac{10!}{4!\\cdot6!}=210$."
  },
  {
    "type": "formula",
    "title": "Własności symbolu Newtona",
    "expression": "\\binom{n}{k}=\\binom{n}{n-k}, \\qquad \\binom{n}{0}=\\binom{n}{n}=1",
    "variables": [
      {"symbol": "n", "meaning": "liczba elementów zbioru, z którego wybieramy"},
      {"symbol": "k", "meaning": "liczba wybieranych elementów"}
    ]
  },
  {
    "type": "table",
    "title": "Wariacje, kombinacje, permutacje — kiedy który wzór?",
    "caption": "Dwa pytania, które trzeba sobie zadać: czy kolejność ma znaczenie i czy elementy mogą się powtarzać.",
    "headers": ["Sytuacja", "Kolejność ważna?", "Powtórzenia?", "Wzór"],
    "rows": [
      ["Ustawiamy wszystkie $n$ elementów w rzędzie", "Tak", "Nie", "$P_n=n!$"],
      ["Wybieramy i ustawiamy $k$ z $n$ elementów", "Tak", "Nie", "$V_n^k=\\dfrac{n!}{(n-k)!}$"],
      ["Tworzymy ciąg długości $k$ z $n$ elementów (mogą się powtarzać)", "Tak", "Tak", "$\\overline{V}_n^k=n^k$"],
      ["Wybieramy $k$-elementowy podzbiór z $n$ elementów", "Nie", "Nie", "$C_n^k=\\binom{n}{k}=\\dfrac{n!}{k!(n-k)!}$"]
    ]
  },
  {
    "type": "quiz",
    "question": "Rzucamy monetą 5 razy i zapisujemy w kolejności wyniki (orzeł/reszka). Ile jest możliwych ciągów wyników?",
    "options": ["32", "10", "120", "25"],
    "correctIndex": 0,
    "explanation": "To wariacja z powtórzeniami: dwie możliwości na każdej z 5 pozycji, $\\overline{V}_2^5=2^5=32$."
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli bezbłędnie rozróżniasz, kiedy stosować permutację, wariację, a kiedy kombinację (pytając siebie o kolejność i o powtórzenia), sprawnie obliczasz każdą z tych wielkości oraz znasz podstawowe własności symbolu Newtona $\\binom{n}{k}$."
  }
]$content2$::jsonb,
  1
);

-- ----------------------------------------------------------------------------
-- Lesson 3: Prawdopodobieństwo klasyczne, warunkowe i niezależność zdarzeń
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo'),
  $title3$Prawdopodobieństwo klasyczne, warunkowe i niezależność zdarzeń$title3$,
  $content3$[
  {
    "type": "intro",
    "text": "Teraz wykorzystamy poznane techniki zliczania do policzenia, jak prawdopodobne są różne zdarzenia losowe — od rzutu kostką, przez losowanie kart, po bardziej złożone sytuacje z warunkami."
  },
  {
    "type": "definition",
    "term": "Doświadczenie losowe i przestrzeń zdarzeń elementarnych",
    "text": "Doświadczeniem losowym nazywamy doświadczenie, którego wyniku nie da się przewidzieć z całkowitą pewnością (np. rzut kostką). Zbiór wszystkich możliwych wyników takiego doświadczenia nazywamy przestrzenią zdarzeń elementarnych i oznaczamy $\\Omega$, a pojedynczy możliwy wynik — zdarzeniem elementarnym.",
    "formula": "\\Omega = \\{\\omega_1,\\omega_2,\\ldots,\\omega_n\\}"
  },
  {
    "type": "definition",
    "term": "Zdarzenie losowe",
    "text": "Zdarzeniem losowym nazywamy dowolny podzbiór przestrzeni zdarzeń elementarnych $\\Omega$. Na przykład przy rzucie kostką zdarzenie „wypadła liczba parzysta” to podzbiór $A=\\{2,4,6\\}\\subseteq\\Omega$.",
    "formula": "A\\subseteq\\Omega"
  },
  {
    "type": "quiz",
    "question": "Rzucamy kostką sześcienną. Ile elementów ma przestrzeń zdarzeń elementarnych $\\Omega$?",
    "options": ["6", "36", "1", "12"],
    "correctIndex": 0,
    "explanation": "Możliwe wyniki to 1, 2, 3, 4, 5, 6 — razem 6 elementów."
  },
  {
    "type": "definition",
    "term": "Klasyczna definicja prawdopodobieństwa",
    "text": "Gdy przestrzeń $\\Omega$ jest skończona i wszystkie zdarzenia elementarne są jednakowo prawdopodobne, prawdopodobieństwo zdarzenia $A$ obliczamy jako stosunek liczby zdarzeń sprzyjających (elementów $A$) do liczby wszystkich zdarzeń elementarnych.",
    "formula": "P(A)=\\dfrac{|A|}{|\\Omega|} = \\dfrac{\\text{liczba zdarzeń sprzyjających}}{\\text{liczba wszystkich zdarzeń elementarnych}}"
  },
  {
    "type": "examples",
    "title": "Obliczanie prawdopodobieństwa klasycznego",
    "items": [
      {
        "problem": "\\text{Rzucamy raz kostką sześcienną. Jakie jest prawdopodobieństwo wyrzucenia liczby parzystej?}",
        "steps": [
          {"text": "Wyznaczamy przestrzeń zdarzeń elementarnych.", "formula": "|\\Omega|=6"},
          {"text": "Wyznaczamy zdarzenia sprzyjające: liczby parzyste to 2, 4, 6.", "formula": "A=\\{2,4,6\\},\\ |A|=3"},
          {"text": "Stosujemy klasyczną definicję prawdopodobieństwa.", "formula": "P(A)=\\dfrac{3}{6}=\\dfrac12"}
        ],
        "answer": "\\dfrac12"
      },
      {
        "problem": "\\text{Z talii 52 kart losujemy jedną kartę. Jakie jest prawdopodobieństwo wylosowania asa?}",
        "steps": [
          {"text": "Przestrzeń zdarzeń elementarnych to wszystkie karty.", "formula": "|\\Omega|=52"},
          {"text": "Zdarzenia sprzyjające to wylosowanie jednego z 4 asów.", "formula": "|A|=4"},
          {"text": "Obliczamy prawdopodobieństwo.", "formula": "P(A)=\\dfrac{4}{52}=\\dfrac{1}{13}"}
        ],
        "answer": "\\dfrac1{13}"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "W urnie jest 5 kul białych i 3 czarne. Losujemy jedną kulę. Jakie jest prawdopodobieństwo wylosowania kuli czarnej?",
    "options": ["3/8", "5/8", "3/5", "1/8"],
    "correctIndex": 0,
    "explanation": "$|\\Omega|=5+3=8$, kul czarnych jest 3, więc $P=\\dfrac38$."
  },
  {
    "type": "definition",
    "term": "Własności prawdopodobieństwa",
    "text": "Prawdopodobieństwo zawsze spełnia $0\\le P(A)\\le1$, $P(\\Omega)=1$, $P(\\varnothing)=0$. Zdarzenie przeciwne do $A$ (oznaczane $A'$) to „nie zaszło $A$” — jego prawdopodobieństwo to $1-P(A)$. Dla dowolnych dwóch zdarzeń $A$, $B$ prawdopodobieństwo ich sumy obliczamy, odejmując prawdopodobieństwo części wspólnej (żeby nie policzyć jej podwójnie).",
    "formula": "P(A')=1-P(A), \\qquad P(A\\cup B)=P(A)+P(B)-P(A\\cap B)"
  },
  {
    "type": "examples",
    "title": "Zdarzenie przeciwne i suma zdarzeń",
    "items": [
      {
        "problem": "\\text{Prawdopodobieństwo, że jutro będzie padał deszcz, wynosi }0{,}3. \\text{ Jakie jest prawdopodobieństwo, że jutro NIE będzie padać?}",
        "steps": [
          {"text": "Korzystamy ze wzoru na zdarzenie przeciwne.", "formula": "P(A')=1-P(A)"},
          {"text": "Podstawiamy dane.", "formula": "P(A')=1-0{,}3"},
          {"text": "Obliczamy.", "formula": "P(A')=0{,}7"}
        ],
        "answer": "0{,}7"
      },
      {
        "problem": "\\text{Rzucamy kostką. Niech }A\\text{ — wypadła liczba parzysta, }B\\text{ — wypadła liczba podzielna przez 3. Oblicz }P(A\\cup B).",
        "steps": [
          {"text": "Wypisujemy zdarzenia sprzyjające.", "formula": "A=\\{2,4,6\\},\\ B=\\{3,6\\},\\ A\\cap B=\\{6\\}"},
          {"text": "Obliczamy odpowiednie prawdopodobieństwa.", "formula": "P(A)=\\dfrac36,\\ P(B)=\\dfrac26,\\ P(A\\cap B)=\\dfrac16"},
          {"text": "Stosujemy wzór na sumę zdarzeń.", "formula": "P(A\\cup B)=\\dfrac36+\\dfrac26-\\dfrac16=\\dfrac46=\\dfrac23"}
        ],
        "answer": "\\dfrac23"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Prawdopodobieństwo zdania egzaminu przez ucznia wynosi $0{,}85$. Jakie jest prawdopodobieństwo, że uczeń NIE zda egzaminu?",
    "options": ["0,15", "0,85", "0,5", "1"],
    "correctIndex": 0,
    "explanation": "$P(A')=1-0{,}85=0{,}15$."
  },
  {
    "type": "definition",
    "term": "Prawdopodobieństwo warunkowe",
    "text": "Prawdopodobieństwo warunkowe $P(A\\mid B)$ to prawdopodobieństwo, że zajdzie zdarzenie $A$, jeśli WIEMY, że zaszło już zdarzenie $B$ (i $P(B)>0$). Znajomość zajścia $B$ „zawęża” przestrzeń zdarzeń elementarnych do samego $B$, dlatego dzielimy prawdopodobieństwo części wspólnej przez $P(B)$.",
    "formula": "P(A\\mid B)=\\dfrac{P(A\\cap B)}{P(B)}, \\qquad P(B)>0"
  },
  {
    "type": "examples",
    "title": "Obliczanie prawdopodobieństwa warunkowego",
    "items": [
      {
        "problem": "\\text{W urnie jest 5 kul białych i 3 czarne. Losujemy bez zwracania dwie kule. Jakie jest prawdopodobieństwo, że druga kula jest czarna, jeśli wiadomo, że pierwsza była czarna?}",
        "steps": [
          {"text": "Skoro pierwsza wylosowana kula była czarna, w urnie zostało 7 kul: 5 białych i 2 czarne.", "formula": "\\text{pozostało: } 5\\text{ białych},\\ 2\\text{ czarne},\\ \\text{razem }7"},
          {"text": "Prawdopodobieństwo wylosowania czarnej spośród pozostałych kul.", "formula": "P(\\text{2. kula czarna}\\mid\\text{1. kula czarna})=\\dfrac{2}{7}"}
        ],
        "answer": "\\dfrac27"
      },
      {
        "problem": "\\text{Rzucamy dwiema kostkami. Niech }A\\text{ — suma oczek wynosi 8, }B\\text{ — na pierwszej kostce wypadła liczba parzysta. Oblicz }P(A\\mid B).",
        "steps": [
          {"text": "Wyznaczamy $P(B)$: pierwsza kostka parzysta — to 18 z 36 wyników.", "formula": "P(B)=\\dfrac{18}{36}=\\dfrac12"},
          {"text": "Wyznaczamy $P(A\\cap B)$: suma równa 8 ORAZ pierwsza kostka parzysta — pary $(2,6),(4,4),(6,2)$.", "formula": "P(A\\cap B)=\\dfrac{3}{36}=\\dfrac1{12}"},
          {"text": "Stosujemy wzór na prawdopodobieństwo warunkowe.", "formula": "P(A\\mid B)=\\dfrac{P(A\\cap B)}{P(B)}=\\dfrac{1/12}{1/2}=\\dfrac16"}
        ],
        "answer": "\\dfrac16"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "W klasie jest 12 chłopców i 8 dziewczynek. Wśród chłopców 3 gra na gitarze. Losujemy jedną osobę z klasy i wiadomo, że jest to chłopiec. Jakie jest prawdopodobieństwo, że gra na gitarze?",
    "options": ["1/4", "1/5", "3/20", "3/8"],
    "correctIndex": 0,
    "explanation": "Skoro wiemy, że to chłopiec, liczy się tylko grupa chłopców: $3$ z $12$ gra na gitarze, więc $P=\\dfrac{3}{12}=\\dfrac14$."
  },
  {
    "type": "definition",
    "term": "Niezależność zdarzeń",
    "text": "Zdarzenia $A$ i $B$ nazywamy niezależnymi, jeśli zajście jednego z nich nie wpływa na prawdopodobieństwo zajścia drugiego (czyli $P(A\\mid B)=P(A)$, gdy $P(B)>0$). Równoważnie: $A$ i $B$ są niezależne wtedy i tylko wtedy, gdy prawdopodobieństwo ich iloczynu jest równe iloczynowi ich prawdopodobieństw.",
    "formula": "A, B \\text{ niezależne} \\iff P(A\\cap B)=P(A)\\cdot P(B)"
  },
  {
    "type": "examples",
    "title": "Prawdopodobieństwo iloczynu zdarzeń niezależnych",
    "items": [
      {
        "problem": "\\text{Rzucamy dwa razy monetą. Niech }A\\text{ — w 1. rzucie wypadł orzeł, }B\\text{ — w 2. rzucie wypadł orzeł. Oblicz }P(A\\cap B).",
        "steps": [
          {"text": "Wyniki kolejnych rzutów monetą są od siebie niezależne.", "formula": "P(A)=\\dfrac12,\\ P(B)=\\dfrac12"},
          {"text": "Dla zdarzeń niezależnych mnożymy prawdopodobieństwa.", "formula": "P(A\\cap B)=P(A)\\cdot P(B)"},
          {"text": "Obliczamy.", "formula": "P(A\\cap B)=\\dfrac12\\cdot\\dfrac12=\\dfrac14"}
        ],
        "answer": "\\dfrac14"
      }
    ]
  },
  {
    "type": "reveal-steps",
    "title": "Niezależne czy zależne? Krok po kroku",
    "problem": "W urnie są 4 kule białe i 6 czarnych. Losujemy jedną kulę, zapisujemy kolor i ZWRACAMY ją do urny, a następnie losujemy drugą kulę. Jakie jest prawdopodobieństwo, że obie wylosowane kule są białe?",
    "steps": [
      {
        "prompt": "Czy losowanie ze zwracaniem sprawia, że skład urny przy drugim losowaniu jest taki sam jak przy pierwszym?",
        "kind": "choice",
        "options": ["Tak, bo kulę wracamy do urny przed drugim losowaniem", "Nie, skład urny się zmienia"],
        "correctIndex": 0,
        "reveal": "Losowanie ze zwracaniem oznacza, że po pierwszym losowaniu urna wraca do stanu początkowego, więc oba losowania są od siebie niezależne."
      },
      {
        "prompt": "Ile wynosi $P(\\text{1. kula biała})$?",
        "kind": "input",
        "acceptedAnswers": ["2/5", "0.4", "4/10"],
        "reveal": "$P=\\dfrac{4}{10}=\\dfrac25$.",
        "formula": "\\dfrac{4}{10}=\\dfrac25"
      },
      {
        "prompt": "Ile wynosi $P(\\text{2. kula biała})$?",
        "kind": "input",
        "acceptedAnswers": ["2/5", "0.4", "4/10"],
        "reveal": "Skład urny jest taki sam jak za pierwszym razem, więc znów $P=\\dfrac25$.",
        "formula": "\\dfrac25"
      },
      {
        "prompt": "Ile wynosi $P(\\text{obie kule białe})$?",
        "kind": "input",
        "acceptedAnswers": ["4/25", "0.16"],
        "reveal": "Zdarzenia są niezależne, więc mnożymy prawdopodobieństwa: $\\dfrac25\\cdot\\dfrac25=\\dfrac4{25}$.",
        "formula": "\\dfrac25\\cdot\\dfrac25=\\dfrac{4}{25}"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Losujemy BEZ zwracania dwie kule z urny zawierającej 4 białe i 6 czarnych kul. Czy zdarzenia „pierwsza kula biała” i „druga kula biała” są niezależne?",
    "options": ["Nie, bo skład urny zmienia się po pierwszym losowaniu", "Tak, zawsze są niezależne", "Nie da się tego określić"],
    "correctIndex": 0,
    "explanation": "Losowanie bez zwracania zmniejsza liczbę kul w urnie, więc prawdopodobieństwo przy drugim losowaniu zależy od wyniku pierwszego — zdarzenia są zależne."
  },
  {
    "type": "table",
    "title": "Podsumowanie wzorów prawdopodobieństwa",
    "headers": ["Wzór", "Znaczenie"],
    "rows": [
      ["$P(A)=\\dfrac{|A|}{|\\Omega|}$", "klasyczna definicja prawdopodobieństwa"],
      ["$P(A')=1-P(A)$", "prawdopodobieństwo zdarzenia przeciwnego"],
      ["$P(A\\cup B)=P(A)+P(B)-P(A\\cap B)$", "prawdopodobieństwo sumy zdarzeń"],
      ["$P(A\\mid B)=\\dfrac{P(A\\cap B)}{P(B)}$", "prawdopodobieństwo warunkowe"],
      ["$P(A\\cap B)=P(A)\\cdot P(B)$", "iloczyn zdarzeń NIEZALEŻNYCH"]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli sprawnie stosujesz klasyczną definicję prawdopodobieństwa, potrafisz obliczyć prawdopodobieństwo zdarzenia przeciwnego i sumy zdarzeń, rozumiesz i umiesz zastosować wzór na prawdopodobieństwo warunkowe oraz potrafisz rozpoznać, czy dane zdarzenia są niezależne, i wykorzystać to przy obliczaniu prawdopodobieństwa ich iloczynu."
  }
]$content3$::jsonb,
  2
);

-- ----------------------------------------------------------------------------
-- Lesson 4: Schemat Bernoulliego, prawdopodobieństwo całkowite, wartość
-- oczekiwana
-- ----------------------------------------------------------------------------
insert into math_lessons (topic_id, title, content, order_index) values (
  (select id from math_topics where slug = 'kombinatoryka-prawdopodobienstwo'),
  $title4$Schemat Bernoulliego, prawdopodobieństwo całkowite, wartość oczekiwana$title4$,
  $content4$[
  {
    "type": "intro",
    "text": "W tej lekcji poznasz trzy narzędzia, które bardzo często pojawiają się w trudniejszych zadaniach maturalnych: schemat Bernoulliego (wielokrotne, niezależne powtórzenia tego samego doświadczenia), wzór na prawdopodobieństwo całkowite (gdy doświadczenie ma kilka „scenariuszy”) oraz wartość oczekiwaną (średni wynik zmiennej losowej)."
  },
  {
    "type": "definition",
    "term": "Schemat Bernoulliego",
    "text": "Schemat Bernoulliego to $n$ niezależnych powtórzeń tego samego doświadczenia, w którym interesuje nas tylko, czy zaszedł „sukces” (z prawdopodobieństwem $p$) czy „porażka” (z prawdopodobieństwem $1-p$). Prawdopodobieństwo uzyskania dokładnie $k$ sukcesów w $n$ próbach obliczamy, wybierając kombinacyjnie, w których $k$ z $n$ prób zaszedł sukces, i mnożąc przez odpowiednie prawdopodobieństwa.",
    "formula": "P(X=k) = \\binom{n}{k}\\,p^k(1-p)^{n-k}, \\qquad k=0,1,\\ldots,n"
  },
  {
    "type": "quiz",
    "question": "Rzucamy 5 razy monetą. Sukcesem nazywamy wyrzucenie orła. Ile wynosi prawdopodobieństwo sukcesu $p$ w pojedynczej próbie?",
    "options": ["1/2", "1/5", "1", "0"],
    "correctIndex": 0,
    "explanation": "Moneta jest symetryczna, więc orzeł wypada z prawdopodobieństwem $\\frac12$."
  },
  {
    "type": "examples",
    "title": "Obliczanie prawdopodobieństwa w schemacie Bernoulliego",
    "items": [
      {
        "problem": "\\text{Rzucamy 4 razy symetryczną monetą. Jakie jest prawdopodobieństwo wyrzucenia dokładnie 3 orłów?}",
        "steps": [
          {"text": "Rozpoznajemy dane schematu Bernoulliego: $n=4$ próby, sukces (orzeł) z prawdopodobieństwem $p=\\frac12$, szukamy $k=3$ sukcesów.", "formula": "n=4,\\ p=\\dfrac12,\\ k=3"},
          {"text": "Podstawiamy do wzoru.", "formula": "P(X=3)=\\binom{4}{3}\\left(\\dfrac12\\right)^3\\left(\\dfrac12\\right)^1"},
          {"text": "Obliczamy współczynnik dwumianowy i potęgi.", "formula": "P(X=3)=4\\cdot\\dfrac18\\cdot\\dfrac12"},
          {"text": "Obliczamy wynik.", "formula": "P(X=3)=\\dfrac{4}{16}=\\dfrac14"}
        ],
        "answer": "\\dfrac14"
      },
      {
        "problem": "\\text{Strzelec trafia do tarczy z prawdopodobieństwem }p=0{,}8\\text{ przy każdym z 3 niezależnych strzałów. Jakie jest prawdopodobieństwo, że trafi dokładnie 2 razy?}",
        "steps": [
          {"text": "Rozpoznajemy dane schematu Bernoulliego.", "formula": "n=3,\\ p=0{,}8,\\ k=2"},
          {"text": "Podstawiamy do wzoru.", "formula": "P(X=2)=\\binom{3}{2}\\cdot0{,}8^2\\cdot0{,}2^1"},
          {"text": "Obliczamy poszczególne czynniki.", "formula": "\\binom32=3,\\quad0{,}8^2=0{,}64,\\quad0{,}2^1=0{,}2"},
          {"text": "Obliczamy wynik.", "formula": "P(X=2)=3\\cdot0{,}64\\cdot0{,}2=0{,}384"}
        ],
        "answer": "0{,}384"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "W schemacie Bernoulliego $n=6$, $p=\\dfrac13$. Który wzór poprawnie opisuje prawdopodobieństwo dokładnie 0 sukcesów (same porażki)?",
    "options": ["$\\left(\\frac23\\right)^6=\\frac{64}{729}$", "$\\left(\\frac13\\right)^6$", "$0$", "$\\frac13$"],
    "correctIndex": 0,
    "explanation": "$P(X=0)=\\binom60\\left(\\frac13\\right)^0\\left(\\frac23\\right)^6=\\left(\\frac23\\right)^6=\\frac{64}{729}$ — same porażki, więc podnosimy do potęgi prawdopodobieństwo porażki $1-p=\\frac23$."
  },
  {
    "type": "reveal-steps",
    "title": "Prawdopodobieństwo „co najmniej” w schemacie Bernoulliego",
    "problem": "Rzucamy 3 razy kostką. Sukcesem jest wyrzucenie szóstki ($p=\\frac16$). Jakie jest prawdopodobieństwo, że szóstka wypadnie CO NAJMNIEJ RAZ?",
    "steps": [
      {
        "prompt": "Jak najłatwiej obliczyć prawdopodobieństwo zdarzenia „co najmniej jeden sukces”?",
        "kind": "choice",
        "options": ["Przez zdarzenie przeciwne: $1-P(\\text{0 sukcesów})$", "Sumując osobno $P(X=1)+P(X=2)+P(X=3)$", "Nie da się tego obliczyć"],
        "correctIndex": 0,
        "reveal": "Zdarzeniem przeciwnym do „co najmniej jeden sukces” jest „zero sukcesów” — zwykle dużo prościej policzyć właśnie to."
      },
      {
        "prompt": "Ile wynosi $P(X=0)$, czyli prawdopodobieństwo, że w żadnym z 3 rzutów nie wypadnie szóstka?",
        "kind": "input",
        "acceptedAnswers": ["125/216"],
        "reveal": "$P(X=0)=\\left(\\dfrac56\\right)^3=\\dfrac{125}{216}$.",
        "formula": "P(X=0)=\\left(\\dfrac56\\right)^3=\\dfrac{125}{216}"
      },
      {
        "prompt": "Ile wynosi szukane prawdopodobieństwo $P(X\\ge1)$?",
        "kind": "input",
        "acceptedAnswers": ["91/216"],
        "reveal": "$P(X\\ge1)=1-P(X=0)=1-\\dfrac{125}{216}=\\dfrac{91}{216}$.",
        "formula": "P(X\\ge1)=1-\\dfrac{125}{216}=\\dfrac{91}{216}"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Prawdopodobieństwo, że losowo wybrany produkt jest wadliwy, wynosi $p=0{,}1$. Sprawdzamy 2 produkty (niezależnie). Jakie jest prawdopodobieństwo, że co najmniej jeden z nich jest wadliwy?",
    "options": ["0,19", "0,1", "0,81", "0,2"],
    "correctIndex": 0,
    "explanation": "$P(X\\ge1)=1-P(X=0)=1-0{,}9^2=1-0{,}81=0{,}19$."
  },
  {
    "type": "definition",
    "term": "Prawdopodobieństwo całkowite",
    "text": "Jeśli zdarzenia $B_1,B_2,\\ldots,B_n$ są parami rozłączne, ich suma to cała przestrzeń $\\Omega$ oraz każde ma dodatnie prawdopodobieństwo (mówimy, że tworzą zupełny układ zdarzeń), to prawdopodobieństwo dowolnego zdarzenia $A$ można obliczyć, sumując prawdopodobieństwa warunkowe $A$ pod warunkiem każdego z „scenariuszy” $B_i$, ważone prawdopodobieństwem tego scenariusza.",
    "formula": "P(A)=\\sum_{i=1}^{n} P(A\\mid B_i)\\cdot P(B_i), \\qquad \\text{gdy } B_1,\\ldots,B_n \\text{ tworzą zupełny układ zdarzeń}"
  },
  {
    "type": "examples",
    "title": "Zastosowanie wzoru na prawdopodobieństwo całkowite",
    "items": [
      {
        "problem": "\\text{W pierwszej urnie są 3 kule białe i 2 czarne, w drugiej 4 białe i 4 czarne. Rzucamy symetryczną monetą: gdy wypadnie orzeł, losujemy kulę z 1. urny, gdy reszka — z 2. urny. Jakie jest prawdopodobieństwo wylosowania kuli białej?}",
        "steps": [
          {"text": "Zdarzenia $B_1$ (wybór 1. urny) i $B_2$ (wybór 2. urny) tworzą zupełny układ zdarzeń, każde z prawdopodobieństwem $\\frac12$.", "formula": "P(B_1)=P(B_2)=\\dfrac12"},
          {"text": "Obliczamy prawdopodobieństwa warunkowe wylosowania kuli białej z każdej urny.", "formula": "P(A\\mid B_1)=\\dfrac35,\\qquad P(A\\mid B_2)=\\dfrac48=\\dfrac12"},
          {"text": "Stosujemy wzór na prawdopodobieństwo całkowite.", "formula": "P(A)=\\dfrac12\\cdot\\dfrac35+\\dfrac12\\cdot\\dfrac12"},
          {"text": "Sprowadzamy do wspólnego mianownika i obliczamy.", "formula": "P(A)=\\dfrac{6}{20}+\\dfrac{5}{20}=\\dfrac{11}{20}"}
        ],
        "answer": "\\dfrac{11}{20}"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "W fabryce maszyna A produkuje 60% wyrobów i wśród nich 2% jest wadliwych, a maszyna B produkuje 40% wyrobów i wśród nich 5% jest wadliwych. Jakie jest prawdopodobieństwo, że losowo wybrany wyrób jest wadliwy?",
    "options": ["0,032", "0,035", "0,07", "0,02"],
    "correctIndex": 0,
    "explanation": "$P=0{,}6\\cdot0{,}02+0{,}4\\cdot0{,}05=0{,}012+0{,}02=0{,}032$."
  },
  {
    "type": "definition",
    "term": "Zmienna losowa i wartość oczekiwana",
    "text": "Zmienna losowa $X$ przypisuje liczbę każdemu wynikowi doświadczenia losowego. Jeśli $X$ przyjmuje wartości $x_1,x_2,\\ldots,x_n$ odpowiednio z prawdopodobieństwami $p_1,p_2,\\ldots,p_n$ (sumującymi się do 1), to wartością oczekiwaną $E(X)$ nazywamy „średnią ważoną” tych wartości — liczbę, wokół której średnio oscylują wyniki przy wielokrotnym powtarzaniu doświadczenia.",
    "formula": "E(X) = \\sum_{i=1}^n x_i \\cdot p_i = x_1p_1+x_2p_2+\\cdots+x_np_n"
  },
  {
    "type": "examples",
    "title": "Obliczanie wartości oczekiwanej",
    "items": [
      {
        "problem": "\\text{Rzucamy symetryczną kostką sześcienną. Niech }X\\text{ oznacza liczbę wyrzuconych oczek. Oblicz }E(X).",
        "steps": [
          {"text": "Zmienna $X$ przyjmuje wartości $1,2,3,4,5,6$, każdą z prawdopodobieństwem $\\frac16$.", "formula": "P(X=k)=\\dfrac16,\\quad k=1,\\ldots,6"},
          {"text": "Stosujemy wzór na wartość oczekiwaną.", "formula": "E(X)=1\\cdot\\dfrac16+2\\cdot\\dfrac16+\\cdots+6\\cdot\\dfrac16"},
          {"text": "Wyłączamy $\\frac16$ przed nawias i sumujemy.", "formula": "E(X)=\\dfrac16(1+2+3+4+5+6)=\\dfrac{21}{6}"},
          {"text": "Obliczamy wynik.", "formula": "E(X)=3{,}5"}
        ],
        "answer": "3{,}5"
      },
      {
        "problem": "\\text{Grasz w grę: rzucasz monetą. Jeśli wypadnie orzeł, wygrywasz 10 zł, jeśli reszka — tracisz 4 zł. Oblicz wartość oczekiwaną wygranej.}",
        "steps": [
          {"text": "Zmienna $X$ (wygrana) przyjmuje wartość $10$ z prawdopodobieństwem $\\frac12$ oraz $-4$ z prawdopodobieństwem $\\frac12$.", "formula": "P(X=10)=\\dfrac12,\\quad P(X=-4)=\\dfrac12"},
          {"text": "Stosujemy wzór na wartość oczekiwaną.", "formula": "E(X)=10\\cdot\\dfrac12+(-4)\\cdot\\dfrac12"},
          {"text": "Obliczamy.", "formula": "E(X)=5-2=3"}
        ],
        "answer": "3\\ \\text{zł}"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Zmienna losowa $X$ przyjmuje wartości $0,1,2$ z prawdopodobieństwami odpowiednio $0{,}2$, $0{,}5$, $0{,}3$. Ile wynosi $E(X)$?",
    "options": ["1,1", "1", "1,5", "0,3"],
    "correctIndex": 0,
    "explanation": "$E(X)=0\\cdot0{,}2+1\\cdot0{,}5+2\\cdot0{,}3=0{,}5+0{,}6=1{,}1$."
  },
  {
    "type": "reveal-steps",
    "title": "Wartość oczekiwana: gra losowa krok po kroku",
    "problem": "Losujemy jedną kulę z urny zawierającej 2 kule czerwone, 3 zielone i 5 niebieskich. Za czerwoną wygrywasz 20 zł, za zieloną 5 zł, a za niebieską płacisz 3 zł (wygrana wynosi wtedy $-3$ zł). Oblicz wartość oczekiwaną wygranej w tej grze.",
    "steps": [
      {
        "prompt": "Ile wynosi prawdopodobieństwo wylosowania kuli czerwonej?",
        "kind": "input",
        "acceptedAnswers": ["1/5", "0.2", "2/10"],
        "reveal": "$P(\\text{czerwona})=\\dfrac{2}{10}=\\dfrac15$.",
        "formula": "\\dfrac{2}{10}=\\dfrac15"
      },
      {
        "prompt": "Ile wynosi prawdopodobieństwo wylosowania kuli zielonej?",
        "kind": "input",
        "acceptedAnswers": ["3/10", "0.3"],
        "reveal": "$P(\\text{zielona})=\\dfrac{3}{10}$.",
        "formula": "\\dfrac{3}{10}"
      },
      {
        "prompt": "Ile wynosi prawdopodobieństwo wylosowania kuli niebieskiej?",
        "kind": "input",
        "acceptedAnswers": ["1/2", "0.5", "5/10"],
        "reveal": "$P(\\text{niebieska})=\\dfrac{5}{10}=\\dfrac12$.",
        "formula": "\\dfrac{5}{10}=\\dfrac12"
      },
      {
        "prompt": "Oblicz wartość oczekiwaną wygranej: $E(X)=20\\cdot\\frac15+5\\cdot\\frac{3}{10}+(-3)\\cdot\\frac12$.",
        "kind": "input",
        "acceptedAnswers": ["4", "4 zł"],
        "reveal": "$E(X)=4+1{,}5-1{,}5=4$ zł. Gra jest więc dla gracza korzystna, średnio o 4 zł na rundę.",
        "formula": "E(X)=4+1{,}5-1{,}5=4"
      }
    ]
  },
  {
    "type": "quiz",
    "question": "Jeśli wartość oczekiwana wygranej w grze losowej jest ujemna, to...",
    "options": ["Średnio w dłuższej perspektywie gracz traci pieniądze", "Gra jest zawsze sprawiedliwa", "Gracz zawsze wygrywa", "Wartość oczekiwana nie ma znaczenia praktycznego"],
    "correctIndex": 0,
    "explanation": "Wartość oczekiwana to średni wynik przy wielokrotnym powtarzaniu gry — jeśli jest ujemna, gracz średnio traci."
  },
  {
    "type": "table",
    "title": "Podsumowanie: schemat Bernoulliego, prawdopodobieństwo całkowite, wartość oczekiwana",
    "headers": ["Pojęcie", "Wzór"],
    "rows": [
      ["Schemat Bernoulliego", "$P(X=k)=\\binom{n}{k}p^k(1-p)^{n-k}$"],
      ["Prawdopodobieństwo całkowite", "$P(A)=\\sum_i P(A\\mid B_i)P(B_i)$"],
      ["Wartość oczekiwana", "$E(X)=\\sum_i x_iP(X=x_i)$"]
    ]
  },
  {
    "type": "tip",
    "variant": "tip",
    "text": "Tę lekcję opanowałeś/aś, jeśli rozpoznajesz sytuacje opisane schematem Bernoulliego i sprawnie obliczasz prawdopodobieństwo dokładnie $k$ oraz co najmniej jednego sukcesu, potrafisz zastosować wzór na prawdopodobieństwo całkowite przy zupełnym układzie zdarzeń, a także umiesz wyznaczyć rozkład zmiennej losowej i obliczyć jej wartość oczekiwaną, poprawnie interpretując wynik."
  }
]$content4$::jsonb,
  3
);
