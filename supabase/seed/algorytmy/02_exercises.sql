-- ============================================================================
-- supabase/seed/algorytmy/02_exercises.sql
-- Kuratorowany bank startowy: po dwa zadania na dział, rozłożone na wszystkie
-- sześć typów z lib/algorytmy/task-types.ts.
--
-- To jest ROZBIEG, nie docelowa baza. Kolejka ćwiczeń dogenerowuje zadania
-- danego typu, kiedy uczniowi kończą się nierozwiązane (lib/algorytmy/
-- exercise-stock.ts) — ten plik istnieje po to, żeby pierwsze wejście w typ nie
-- musiało czekać na model, i żeby generator miał wzorzec, do którego się
-- dostraja.
--
-- Idempotentny: kasuje własne wiersze (source = 'curated') przed wstawieniem,
-- tak jak seedy zadań Matury. Wiersze wygenerowane przez AI zostają nietknięte.
-- Uruchom PO 01_topics.sql.
-- ============================================================================

delete from algo_exercises where source = 'curated';

insert into algo_exercises
  (topic_id, task_type, statement, code, code_language, options, correct_option_id, explanation, difficulty)
values
  -- ——— Złożoność obliczeniowa ———
  (
    (select id from algo_topics where slug = 'zlozonosc-obliczeniowa'),
    'zlozonosc',
    'Jaka jest złożoność czasowa tej funkcji względem długości listy `dane`?',
    'def suma_par(dane):
    wynik = 0
    for a in dane:
        for b in dane:
            wynik += a * b
    return wynik',
    'python',
    '[{"id":"a","text":"O(1)"},{"id":"b","text":"O(n)"},{"id":"c","text":"O(n²)"},{"id":"d","text":"O(n log n)"}]'::jsonb,
    'c',
    'Dwie zagnieżdżone pętle, każda po wszystkich n elementach, dają n · n operacji dodawania. Ani liczba zmiennych, ani mnożenie nie zmieniają rzędu wielkości.',
    1
  ),
  (
    (select id from algo_topics where slug = 'zlozonosc-obliczeniowa'),
    'pojecia',
    'Algorytm ma złożoność pesymistyczną O(n²) i średnią O(n log n). Co z tego wynika dla użytkownika?',
    null, null,
    '[{"id":"a","text":"Na typowych danych zachowa się jak n log n, ale istnieją dane, na których spadnie do n²"},{"id":"b","text":"Zawsze działa w czasie n log n"},{"id":"c","text":"Zawsze działa w czasie n²"},{"id":"d","text":"Złożoność średnia jest ważniejsza, więc n² można zignorować"}]'::jsonb,
    'a',
    'Przypadek średni opisuje typowe dane, pesymistyczny jest gwarancją górnego ograniczenia. Quicksort to dokładnie ten profil — i dlatego jego implementacje zabezpieczają wybór pivota.',
    2
  ),

  -- ——— Rekurencja ———
  (
    (select id from algo_topics where slug = 'rekurencja'),
    'analiza-bledu',
    'Ta funkcja miała liczyć sumę liczb od 1 do n. Na czym polega błąd?',
    'def suma(n):
    return n + suma(n - 1)',
    'python',
    '[{"id":"a","text":"Brakuje warunku bazowego — rekurencja nigdy się nie zatrzyma"},{"id":"b","text":"Powinno być suma(n) zamiast suma(n - 1)"},{"id":"c","text":"Funkcja zwraca zły typ"},{"id":"d","text":"Powinno być n * suma(n - 1)"}]'::jsonb,
    'a',
    'Argument owszem maleje, ale nic nie przerywa schodzenia w dół — po zerze przyjdzie −1, −2 i tak dalej, aż do przepełnienia stosu. Potrzebne jest `if n <= 0: return 0`.',
    1
  ),
  (
    (select id from algo_topics where slug = 'rekurencja'),
    'wynik-kodu',
    'Co wypisze ten kod?',
    'def f(n):
    if n == 0:
        return
    print(n, end=" ")
    f(n - 1)
    print(n, end=" ")

f(3)',
    'python',
    '[{"id":"a","text":"3 2 1"},{"id":"b","text":"3 2 1 1 2 3"},{"id":"c","text":"1 2 3 3 2 1"},{"id":"d","text":"3 2 1 3 2 1"}]'::jsonb,
    'b',
    'Pierwszy print wykonuje się w drodze w dół (3, 2, 1), drugi w drodze powrotnej — a powroty idą w odwrotnej kolejności (1, 2, 3). Stąd lustrzany ciąg.',
    2
  ),

  -- ——— Tablice i listy ———
  (
    (select id from algo_topics where slug = 'tablice-i-listy'),
    'wybor-struktury',
    'Przechowujesz dane, do których najczęściej sięgasz po numerze pozycji, a wstawiasz wyłącznie na końcu. Co wybierzesz?',
    null, null,
    '[{"id":"a","text":"Tablicę dynamiczną"},{"id":"b","text":"Listę jednokierunkową"},{"id":"c","text":"Listę dwukierunkową"},{"id":"d","text":"Tablicę haszującą"}]'::jsonb,
    'a',
    'Odczyt po indeksie to O(1) tylko w tablicy, a dopisanie na koniec tablicy dynamicznej jest amortyzowane O(1). Oba wymagania spełnia więc tablica; listy przegrywają na dostępie po indeksie.',
    1
  ),
  (
    (select id from algo_topics where slug = 'tablice-i-listy'),
    'zlozonosc',
    'Jaki jest koszt usunięcia pierwszego elementu z tablicy o n elementach?',
    null, null,
    '[{"id":"a","text":"O(1)"},{"id":"b","text":"O(log n)"},{"id":"c","text":"O(n)"},{"id":"d","text":"O(n log n)"}]'::jsonb,
    'c',
    'Po usunięciu pierwszego elementu wszystkie pozostałe muszą przesunąć się o jedną pozycję w lewo, żeby tablica dalej była ciągła — to n−1 przepisań.',
    1
  ),

  -- ——— Stos i kolejka ———
  (
    (select id from algo_topics where slug = 'stos-i-kolejka'),
    'krok-algorytmu',
    'Na pustą kolejkę wykonano: enqueue(A), enqueue(B), dequeue, enqueue(C), enqueue(D), dequeue. Co jest w kolejce?',
    null, null,
    '[{"id":"a","text":"[C, D]"},{"id":"b","text":"[A, B]"},{"id":"c","text":"[B, C]"},{"id":"d","text":"[D, C]"}]'::jsonb,
    'a',
    'FIFO: po enqueue(A), enqueue(B) mamy [A,B]. dequeue zdejmuje A → [B]. Dokładamy C i D → [B,C,D]. Drugi dequeue zdejmuje B → [C,D].',
    1
  ),
  (
    (select id from algo_topics where slug = 'stos-i-kolejka'),
    'wybor-struktury',
    'Implementujesz funkcję „cofnij" w edytorze. Która struktura odpowiada tej semantyce?',
    null, null,
    '[{"id":"a","text":"Kolejka — operacje w kolejności wykonania"},{"id":"b","text":"Stos — cofa się zawsze ostatnią zmianę"},{"id":"c","text":"Kopiec — najważniejsza zmiana na wierzchu"},{"id":"d","text":"Tablica haszująca — szybki dostęp do zmian"}]'::jsonb,
    'b',
    '„Cofnij" zawsze odwraca NAJNOWSZĄ zmianę, czyli ostatnią włożoną — to definicja LIFO. Kolejka cofałaby zmiany od najstarszej, co nie ma sensu.',
    1
  ),

  -- ——— Wyszukiwanie ———
  (
    (select id from algo_topics where slug = 'wyszukiwanie'),
    'krok-algorytmu',
    'W tablicy [2, 5, 8, 12, 16, 23, 38] szukasz binarnie liczby 5, licząc środek jako (lewy + prawy) // 2. Które elementy zostaną porównane z celem i w jakiej kolejności?',
    null, null,
    '[{"id":"a","text":"12, 5"},{"id":"b","text":"12, 8, 5"},{"id":"c","text":"2, 5"},{"id":"d","text":"12, 2, 5"}]'::jsonb,
    'a',
    'Start: lewy = 0, prawy = 6, środek = 3 → wartość 12. Cel jest mniejszy, więc prawy = 2. Drugi krok: lewy = 0, prawy = 2, środek = 1 → wartość 5, trafiona. Dwa porównania wystarczają.',
    2
  ),
  (
    (select id from algo_topics where slug = 'wyszukiwanie'),
    'pojecia',
    'Dlaczego wyszukiwanie binarne wymaga posortowanych danych?',
    null, null,
    '[{"id":"a","text":"Bo inaczej działa wolniej, w O(n)"},{"id":"b","text":"Bo decyzja o odrzuceniu połowy zakresu opiera się na uporządkowaniu — bez niego wynik może być błędny"},{"id":"c","text":"Bo indeks środkowy nie da się policzyć"},{"id":"d","text":"Bo tablica musi mieć parzystą długość"}]'::jsonb,
    'b',
    'Algorytm odrzuca połowę danych na podstawie jednego porównania. To poprawne wyłącznie wtedy, gdy uporządkowanie gwarantuje, że w odrzuconej połowie celu na pewno nie ma.',
    2
  ),

  -- ——— Sortowanie proste ———
  (
    (select id from algo_topics where slug = 'sortowanie-proste'),
    'krok-algorytmu',
    'Jak wygląda tablica [5, 1, 4, 2] po JEDNYM pełnym przebiegu sortowania bąbelkowego?',
    null, null,
    '[{"id":"a","text":"[1, 4, 2, 5]"},{"id":"b","text":"[1, 2, 4, 5]"},{"id":"c","text":"[1, 5, 4, 2]"},{"id":"d","text":"[5, 4, 2, 1]"}]'::jsonb,
    'a',
    'Porównania sąsiadów: (5,1)→zamiana [1,5,4,2]; (5,4)→zamiana [1,4,5,2]; (5,2)→zamiana [1,4,2,5]. Po pierwszym przebiegu największy element jest na końcu.',
    2
  ),
  (
    (select id from algo_topics where slug = 'sortowanie-proste'),
    'pojecia',
    'Które ze zdań poprawnie opisuje stabilność sortowania?',
    null, null,
    '[{"id":"a","text":"Algorytm zawsze działa w tym samym czasie"},{"id":"b","text":"Elementy o równych kluczach zachowują wzajemną kolejność sprzed sortowania"},{"id":"c","text":"Algorytm nie potrzebuje dodatkowej pamięci"},{"id":"d","text":"Algorytm działa poprawnie na danych już posortowanych"}]'::jsonb,
    'b',
    'Stabilność dotyczy wyłącznie elementów RÓWNYCH pod względem klucza sortowania. Brak dodatkowej pamięci to osobna własność — sortowanie w miejscu.',
    1
  ),

  -- ——— Sortowanie n log n ———
  (
    (select id from algo_topics where slug = 'sortowanie-szybkie'),
    'zlozonosc',
    'Quicksort zawsze wybiera pivota jako pierwszy element. Jaka będzie jego złożoność na tablicy już posortowanej rosnąco?',
    null, null,
    '[{"id":"a","text":"O(n)"},{"id":"b","text":"O(n log n)"},{"id":"c","text":"O(n²)"},{"id":"d","text":"O(log n)"}]'::jsonb,
    'c',
    'Pivot jest wtedy zawsze najmniejszym elementem, więc podział daje 0 i n−1 elementów. Rekursja schodzi n poziomów, każdy kosztuje O(n) — najlepsze możliwe dane dają najgorsze zachowanie.',
    2
  ),
  (
    (select id from algo_topics where slug = 'sortowanie-szybkie'),
    'wybor-struktury',
    'Sortujesz rekordy, które trzeba uporządkować po dacie, zachowując dotychczasową kolejność rekordów z tej samej daty. Który algorytm wybierzesz?',
    null, null,
    '[{"id":"a","text":"Quicksort"},{"id":"b","text":"Sortowanie przez kopcowanie"},{"id":"c","text":"Sortowanie przez scalanie"},{"id":"d","text":"Sortowanie przez wybór"}]'::jsonb,
    'c',
    'Wymóg „zachowując dotychczasową kolejność przy równych kluczach" to stabilność. Spośród wymienionych stabilne jest tylko sortowanie przez scalanie.',
    2
  ),

  -- ——— Tablice haszujące ———
  (
    (select id from algo_topics where slug = 'tablice-haszujace'),
    'zlozonosc',
    'Wszystkie klucze wstawione do tablicy haszującej trafiły do jednego kubełka (łańcuchowanie). Jaka jest wtedy złożoność wyszukiwania?',
    null, null,
    '[{"id":"a","text":"O(1)"},{"id":"b","text":"O(log n)"},{"id":"c","text":"O(n)"},{"id":"d","text":"O(n log n)"}]'::jsonb,
    'c',
    'Kubełek staje się listą o długości n i trzeba ją przejść liniowo. Właśnie dlatego stały koszt tablicy haszującej podaje się jako średni, nie pesymistyczny.',
    2
  ),
  (
    (select id from algo_topics where slug = 'tablice-haszujace'),
    'pojecia',
    'Obiekt użyty jako klucz w słowniku został zmodyfikowany tak, że zmienił się jego skrót. Co się stanie?',
    null, null,
    '[{"id":"a","text":"Słownik automatycznie przeniesie go do właściwego kubełka"},{"id":"b","text":"Element zostanie w starym kubełku i przestanie być odnajdywalny"},{"id":"c","text":"Słownik zgłosi błąd przy najbliższym odczycie"},{"id":"d","text":"Nic — skrót liczony jest przy każdym odczycie od nowa"}]'::jsonb,
    'b',
    'Skrót decyduje o kubełku w momencie wstawienia. Po zmianie klucza wyszukiwanie liczy NOWY skrót i idzie do innego kubełka — element wciąż jest w strukturze, ale nieosiągalny. Dlatego klucze muszą być niezmienne.',
    3
  ),

  -- ——— Drzewa i BST ———
  (
    (select id from algo_topics where slug = 'drzewa-bst'),
    'krok-algorytmu',
    'BST ma korzeń 8, jego dzieci to 3 i 10, dziećmi 3 są 1 i 6. Jaki będzie wynik przechodzenia in-order?',
    null, null,
    '[{"id":"a","text":"8, 3, 1, 6, 10"},{"id":"b","text":"1, 3, 6, 8, 10"},{"id":"c","text":"1, 6, 3, 10, 8"},{"id":"d","text":"10, 8, 6, 3, 1"}]'::jsonb,
    'b',
    'In-order to lewo → węzeł → prawo, a na poprawnym BST daje zawsze ciąg rosnący. Odpowiedź a to pre-order, c to post-order.',
    2
  ),
  (
    (select id from algo_topics where slug = 'drzewa-bst'),
    'zlozonosc',
    'Do pustego BST wstawiono po kolei wartości 1, 2, 3, …, n. Jaka jest złożoność wyszukiwania w powstałym drzewie?',
    null, null,
    '[{"id":"a","text":"O(1)"},{"id":"b","text":"O(log n)"},{"id":"c","text":"O(n)"},{"id":"d","text":"O(n log n)"}]'::jsonb,
    'c',
    'Każda kolejna wartość jest większa od poprzedniej, więc trafia do prawego poddrzewa — drzewo degeneruje się do listy o wysokości n. Koszt wyszukiwania równa się wysokości.',
    2
  ),

  -- ——— Kopce ———
  (
    (select id from algo_topics where slug = 'kopce'),
    'pojecia',
    'Która tablica NIE spełnia własności kopca typu min?',
    null, null,
    '[{"id":"a","text":"[1, 3, 6, 5, 9, 8]"},{"id":"b","text":"[2, 4, 3, 7, 8]"},{"id":"c","text":"[1, 5, 2, 9, 3]"},{"id":"d","text":"[4, 6, 5, 9, 7, 8]"}]'::jsonb,
    'c',
    'W [1, 5, 2, 9, 3] węzeł o indeksie 1 (wartość 5) ma dziecko o indeksie 4 (wartość 3), a 5 > 3 — rodzic jest większy od dziecka. Pozostałe tablice spełniają warunek rodzic ≤ dzieci.',
    3
  ),
  (
    (select id from algo_topics where slug = 'kopce'),
    'zlozonosc',
    'Jaki jest koszt zbudowania kopca z n-elementowej tablicy metodą przesiewania w dół od ostatniego rodzica?',
    null, null,
    '[{"id":"a","text":"O(n)"},{"id":"b","text":"O(n log n)"},{"id":"c","text":"O(log n)"},{"id":"d","text":"O(n²)"}]'::jsonb,
    'a',
    'Intuicja podpowiada n log n, ale połowa węzłów to liście z zerową drogą w dół, ćwierć ma jeden krok, ósma część dwa — suma tego szeregu jest liniowa.',
    3
  ),

  -- ——— Grafy ———
  (
    (select id from algo_topics where slug = 'grafy'),
    'wybor-struktury',
    'Chcesz zamienić przeszukiwanie wszerz w przeszukiwanie w głąb, zmieniając jak najmniej kodu. Co wystarczy podmienić?',
    null, null,
    '[{"id":"a","text":"Kolejkę na stos"},{"id":"b","text":"Listę sąsiedztwa na macierz sąsiedztwa"},{"id":"c","text":"Zbiór odwiedzonych na słownik odległości"},{"id":"d","text":"Nic — to zupełnie inne algorytmy"}]'::jsonb,
    'a',
    'BFS i DFS to ten sam algorytm; różni je wyłącznie to, z którego końca pojemnika na wierzchołki-do-odwiedzenia zdejmujesz kolejny element.',
    2
  ),
  (
    (select id from algo_topics where slug = 'grafy'),
    'pojecia',
    'W grafie z ujemnymi wagami krawędzi algorytm Dijkstry może zwrócić błędny wynik. Dlaczego?',
    null, null,
    '[{"id":"a","text":"Bo kolejka priorytetowa nie obsługuje liczb ujemnych"},{"id":"b","text":"Bo zakłada, że odległość zamkniętego wierzchołka jest już ostateczna"},{"id":"c","text":"Bo ujemne wagi zawsze tworzą cykl"},{"id":"d","text":"Bo rośnie mu złożoność do O(V³)"}]'::jsonb,
    'b',
    'Dijkstra domyka wierzchołek o najmniejszej znanej odległości i nigdy do niego nie wraca. Ujemna krawędź mogłaby tę odległość później zmniejszyć — stąd potrzeba Bellmana-Forda.',
    3
  ),

  -- ——— Programowanie dynamiczne ———
  (
    (select id from algo_topics where slug = 'programowanie-dynamiczne'),
    'zlozonosc',
    'Jaka jest złożoność czasowa tej funkcji?',
    'def fib(n, pamiec={}):
    if n < 2:
        return n
    if n not in pamiec:
        pamiec[n] = fib(n - 1, pamiec) + fib(n - 2, pamiec)
    return pamiec[n]',
    'python',
    '[{"id":"a","text":"O(2ⁿ)"},{"id":"b","text":"O(n)"},{"id":"c","text":"O(n²)"},{"id":"d","text":"O(log n)"}]'::jsonb,
    'b',
    'Różnych podproblemów jest n, a każdy liczy się dokładnie raz — kolejne wywołania trafiają w słownik. Bez spamiętywania ta sama funkcja byłaby wykładnicza.',
    2
  ),
  (
    (select id from algo_topics where slug = 'programowanie-dynamiczne'),
    'analiza-bledu',
    'Wydajesz resztę zachłannie: bierz największy nominał, który się mieści. Dla nominałów 1, 3, 4 i kwoty 6 algorytm zwraca 3 monety. Na czym polega problem?',
    null, null,
    '[{"id":"a","text":"Na niczym — 3 monety to optimum"},{"id":"b","text":"Optimum to 3 + 3, czyli 2 monety; zachłanność nie działa dla dowolnych nominałów"},{"id":"c","text":"Algorytm powinien brać najmniejszy nominał"},{"id":"d","text":"Kwota 6 jest nieosiągalna tymi nominałami"}]'::jsonb,
    'b',
    'Zachłannie: 4 + 1 + 1 = 3 monety. Optymalnie: 3 + 3 = 2 monety. Poprawność zachłanności zależy od konkretnego zestawu nominałów; programowanie dynamiczne działa dla dowolnego.',
    3
  );
