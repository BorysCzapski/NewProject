-- ============================================================================
-- supabase/seed/algorytmy/02_exercises.sql
-- Kuratorowany bank startowy: po SZEŚĆ zadań na dział (komplet wszystkich
-- typów z lib/algorytmy/task-types.ts — zlozonosc, wynik-kodu, krok-algorytmu,
-- wybor-struktury, pojecia, analiza-bledu), 72 zadania łącznie.
--
-- To wciąż jest ROZBIEG, nie docelowa baza — kolejka ćwiczeń dogenerowuje
-- zadania danego typu, kiedy uczniowi kończą się nierozwiązane
-- (lib/algorytmy/exercise-stock.ts). Ale skoro poprzednia wersja pokrywała
-- tylko 2 z 6 typów na dział, pierwsze wejście w pozostałe 4 typy zawsze
-- czekało na model — ten plik domyka komplet, żeby każdy typ w każdym dziale
-- miał od razu przynajmniej jeden przykład.
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
  (
    (select id from algo_topics where slug = 'zlozonosc-obliczeniowa'),
    'wynik-kodu',
    'Co wypisze ten kod?',
    'def licz(n):
    c = 0
    for i in range(n):
        for j in range(n):
            c += 1
    return c

print(licz(3))',
    'python',
    '[{"id":"a","text":"3"},{"id":"b","text":"6"},{"id":"c","text":"9"},{"id":"d","text":"27"}]'::jsonb,
    'c',
    'Dwie zagnieżdżone pętle po n=3 elementach dają 3 · 3 = 9 obiegów wewnętrznej pętli, a każdy zwiększa c o 1.',
    1
  ),
  (
    (select id from algo_topics where slug = 'zlozonosc-obliczeniowa'),
    'krok-algorytmu',
    'Śledzisz działanie pętli `total = 0; for i in range(1, 5): total += i`. Jaka jest wartość `total` bezpośrednio po TRZECIM obiegu pętli?',
    null, null,
    '[{"id":"a","text":"3"},{"id":"b","text":"6"},{"id":"c","text":"10"},{"id":"d","text":"1"}]'::jsonb,
    'b',
    'Obieg 1 (i=1): total=1. Obieg 2 (i=2): total=3. Obieg 3 (i=3): total=6. Czwarty obieg dodałby jeszcze 4, dając 10.',
    1
  ),
  (
    (select id from algo_topics where slug = 'zlozonosc-obliczeniowa'),
    'wybor-struktury',
    'Musisz bardzo często sprawdzać, czy dany element już wystąpił w zbiorze. Który wybór da najniższą złożoność czasową tego sprawdzenia?',
    null, null,
    '[{"id":"a","text":"Tablica nieposortowana, przeszukiwana liniowo"},{"id":"b","text":"Tablica posortowana z wyszukiwaniem binarnym"},{"id":"c","text":"Zbiór oparty na tablicy haszującej (hash set)"},{"id":"d","text":"Lista jednokierunkowa"}]'::jsonb,
    'c',
    'Hash set daje średnio O(1) na sprawdzenie przynależności — tablica posortowana daje O(log n) na samo sprawdzenie, ale O(n) na wstawienie nowego elementu z zachowaniem porządku.',
    2
  ),
  (
    (select id from algo_topics where slug = 'zlozonosc-obliczeniowa'),
    'analiza-bledu',
    'Ktoś twierdzi, że poniższa funkcja ma złożoność O(n), bo ma tylko jedną pętlę `for`. Na czym polega błąd w tym rozumowaniu?',
    'def zawiera_duplikat(lista):
    for i in range(len(lista)):
        if lista[i] in lista[i+1:]:
            return True
    return False',
    'python',
    '[{"id":"a","text":"Pętla for jest O(n), ale sprawdzenie `in` na liście jest samo w sobie O(n) — razem wychodzi O(n²)"},{"id":"b","text":"Funkcja ma złożoność O(1), bo zawsze się kończy"},{"id":"c","text":"Błąd polega na tym, że funkcja źle działa dla pustej listy"},{"id":"d","text":"Złożoność zależy wyłącznie od typu elementów listy"}]'::jsonb,
    'a',
    'Licząc złożoność, trzeba uwzględnić koszt KAŻDEJ operacji wewnątrz pętli, nie tylko samą pętlę. `x in lista[i+1:]` przeszukuje liniowo, więc n wywołań takiego sprawdzenia daje O(n²).',
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
  (
    (select id from algo_topics where slug = 'rekurencja'),
    'zlozonosc',
    'Jaka jest złożoność czasowa i pamięciowa (stosu wywołań) tej funkcji?',
    'def silnia(n):
    if n <= 1:
        return 1
    return n * silnia(n - 1)',
    'python',
    '[{"id":"a","text":"O(1) czasowo i pamięciowo"},{"id":"b","text":"O(n) czasowo i pamięciowo"},{"id":"c","text":"O(n) czasowo, O(1) pamięciowo"},{"id":"d","text":"O(2ⁿ) czasowo"}]'::jsonb,
    'b',
    'n wywołań, każde wykonuje stałą pracę poza rekursją — O(n) czasu. Każde wywołanie zostaje na stosie do powrotu z głębszego, więc stos sięga głębokości n — O(n) pamięci.',
    1
  ),
  (
    (select id from algo_topics where slug = 'rekurencja'),
    'krok-algorytmu',
    'Wywołujesz silnia(4) (z poprzedniego przykładu). Ile aktywnych wywołań funkcji — łącznie z pierwszym — znajduje się na stosie w momencie, gdy rekurencja osiąga warunek bazowy?',
    null, null,
    '[{"id":"a","text":"1"},{"id":"b","text":"3"},{"id":"c","text":"4"},{"id":"d","text":"5"}]'::jsonb,
    'c',
    'silnia(4) wywołuje silnia(3), ta silnia(2), ta silnia(1) — warunek bazowy n<=1 zatrzymuje dalsze schodzenie. Na stosie czekają więc 4 wywołania: dla 4, 3, 2 i 1.',
    2
  ),
  (
    (select id from algo_topics where slug = 'rekurencja'),
    'wybor-struktury',
    'Chcesz zamienić funkcję rekurencyjną na iteracyjną, żeby uniknąć przepełnienia stosu dla dużych n. Jakiej struktury danych użyjesz, żeby jawnie symulować stos wywołań?',
    null, null,
    '[{"id":"a","text":"Stosu (LIFO)"},{"id":"b","text":"Kolejki (FIFO)"},{"id":"c","text":"Kopca"},{"id":"d","text":"Tablicy haszującej"}]'::jsonb,
    'a',
    'Stos wywołań jest stosem — ostatnie wywołanie kończy się jako pierwsze. Jawny stos (LIFO) odtwarza dokładnie tę semantykę w wersji iteracyjnej.',
    2
  ),
  (
    (select id from algo_topics where slug = 'rekurencja'),
    'pojecia',
    'Co to jest warunek bazowy rekurencji i dlaczego jego brak jest błędem?',
    null, null,
    '[{"id":"a","text":"Warunek, który spowalnia rekurencję"},{"id":"b","text":"Przypadek, w którym funkcja zwraca wynik bez dalszego wywoływania samej siebie — bez niego rekurencja nie ma jak się zatrzymać"},{"id":"c","text":"Warunek sprawdzający poprawność argumentów wejściowych"},{"id":"d","text":"Pierwsza instrukcja funkcji, niezależnie od jej treści"}]'::jsonb,
    'b',
    'Każde wywołanie rekurencyjne musi w końcu trafić na przypadek, który nie wywołuje funkcji ponownie. Bez takiego punktu zatrzymania rekurencja schodzi w nieskończoność i kończy się przepełnieniem stosu.',
    1
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
  (
    (select id from algo_topics where slug = 'tablice-i-listy'),
    'wynik-kodu',
    'Co wypisze ten kod?',
    'a = [1, 2, 3]
b = a
b.append(4)
print(a)',
    'python',
    '[{"id":"a","text":"[1, 2, 3]"},{"id":"b","text":"[1, 2, 3, 4]"},{"id":"c","text":"[1, 2, 3, 4, 4]"},{"id":"d","text":"Błąd wykonania"}]'::jsonb,
    'b',
    '`b = a` nie kopiuje listy — `b` wskazuje na dokładnie ten sam obiekt co `a`. Zmiana przez `b` jest więc widoczna przez `a`.',
    2
  ),
  (
    (select id from algo_topics where slug = 'tablice-i-listy'),
    'krok-algorytmu',
    'Masz listę wiązaną 1 → 2 → 3. Wykonujesz: wstaw węzeł 9 bezpośrednio PO węźle z wartością 2. Jak wygląda lista po tej operacji?',
    null, null,
    '[{"id":"a","text":"1 → 9 → 2 → 3"},{"id":"b","text":"1 → 2 → 9 → 3"},{"id":"c","text":"9 → 1 → 2 → 3"},{"id":"d","text":"1 → 2 → 3 → 9"}]'::jsonb,
    'b',
    'Wstawienie „po węźle 2" oznacza, że 9 trafia między 2 a 3 — wskaźnik węzła 2 ma teraz prowadzić do 9, a wskaźnik 9 do dotychczasowego następnika, czyli 3.',
    1
  ),
  (
    (select id from algo_topics where slug = 'tablice-i-listy'),
    'pojecia',
    'Dlaczego dostęp do n-tego elementu listy jednokierunkowej kosztuje O(n), a w tablicy O(1)?',
    null, null,
    '[{"id":"a","text":"Bo lista zajmuje więcej pamięci na element"},{"id":"b","text":"Bo w tablicy elementy leżą w pamięci jeden po drugim, więc adres liczy się ze wzoru — w liście trzeba przejść węzeł po węźle od początku"},{"id":"c","text":"Bo listy są zawsze posortowane"},{"id":"d","text":"Bo tablice nie obsługują więcej niż określonej liczby elementów"}]'::jsonb,
    'b',
    'Ciągłe ułożenie w pamięci pozwala policzyć adres n-tego elementu tablicy jednym wzorem. Lista nie ma takiej gwarancji — jedyna droga do węzła n jest przez wszystkie poprzednie.',
    1
  ),
  (
    (select id from algo_topics where slug = 'tablice-i-listy'),
    'analiza-bledu',
    'Ta funkcja ma usuwać wszystkie parzyste liczby z listy. Dla wejścia [2, 4, 6, 8] zwraca [4, 8] zamiast pustej listy. Na czym polega błąd?',
    'def usun_parzyste(lista):
    for x in lista:
        if x % 2 == 0:
            lista.remove(x)
    return lista',
    'python',
    '[{"id":"a","text":"range() źle liczy długość listy"},{"id":"b","text":"Modyfikacja listy podczas iteracji po niej przesuwa indeksy, więc niektóre elementy są pomijane"},{"id":"c","text":"remove() usuwa tylko pierwsze wystąpienie wartości"},{"id":"d","text":"Sprawdzenie parzystości jest napisane błędnie"}]'::jsonb,
    'b',
    'Iterator trzyma bieżący indeks niezależnie od tego, że lista się kurczy. Po usunięciu elementu wszystkie kolejne przesuwają się o jedną pozycję w lewo, a iterator i tak idzie do następnego indeksu — omijając jeden element za każdym usunięciem.',
    3
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
  (
    (select id from algo_topics where slug = 'stos-i-kolejka'),
    'zlozonosc',
    'Jaka jest złożoność czasowa operacji push i pop na stosie zaimplementowanym na tablicy dynamicznej (działamy wyłącznie na jej końcu)?',
    null, null,
    '[{"id":"a","text":"O(1) amortyzowane"},{"id":"b","text":"O(n)"},{"id":"c","text":"O(log n)"},{"id":"d","text":"O(n²)"}]'::jsonb,
    'a',
    'Operacje na samym końcu tablicy dynamicznej nie wymagają przesuwania innych elementów — kosztują O(1), z amortyzacją za rzadkie powiększanie pojemności.',
    1
  ),
  (
    (select id from algo_topics where slug = 'stos-i-kolejka'),
    'wynik-kodu',
    'Co wypisze ten kod?',
    'stos = []
stos.append(1)
stos.append(2)
stos.append(3)
stos.pop()
stos.append(4)
print(stos)',
    'python',
    '[{"id":"a","text":"[1, 2, 4]"},{"id":"b","text":"[1, 2, 3, 4]"},{"id":"c","text":"[1, 2, 3]"},{"id":"d","text":"[4, 2, 1]"}]'::jsonb,
    'a',
    '`pop()` bez argumentu zdejmuje z WIERZCHOŁKA stosu, czyli 3: zostaje [1,2]. Dopisanie 4 daje [1,2,4].',
    1
  ),
  (
    (select id from algo_topics where slug = 'stos-i-kolejka'),
    'pojecia',
    'Co odróżnia kolejkę priorytetową od zwykłej kolejki FIFO?',
    null, null,
    '[{"id":"a","text":"Priorytetowa zawsze zwraca ostatnio dodany element"},{"id":"b","text":"Priorytetowa zwraca element o najwyższym (albo najniższym) priorytecie, niezależnie od kolejności dodania"},{"id":"c","text":"Priorytetowa jest wolniejsza, ale daje te same wyniki co FIFO"},{"id":"d","text":"To synonimy tej samej struktury"}]'::jsonb,
    'b',
    'FIFO zwraca zawsze najstarszy element. Kolejka priorytetowa ignoruje kolejność dodania — liczy się wyłącznie przypisany priorytet.',
    1
  ),
  (
    (select id from algo_topics where slug = 'stos-i-kolejka'),
    'analiza-bledu',
    'Implementacja stosu na tablicy o stałym rozmiarze. Jeśli `push` wywoła się, gdy `wskaznik == len(stos)` (stos pełny), co się stanie i dlaczego to błąd?',
    'def push(stos, wskaznik, x):
    stos[wskaznik] = x
    return wskaznik + 1',
    'python',
    '[{"id":"a","text":"Nic — Python automatycznie powiększy tablicę"},{"id":"b","text":"Rzuci IndexError, bo próbuje zapisać poza granicami tablicy — implementacja powinna sprawdzać przepełnienie przed zapisem"},{"id":"c","text":"Nadpisze cicho pierwszy element stosu"},{"id":"d","text":"Zwróci -1 jako sygnał błędu"}]'::jsonb,
    'b',
    'Tablica o stałym rozmiarze nie rośnie sama. Zapis pod indeksem równym jej długości wychodzi poza zaalokowany obszar i Python zgłasza IndexError — poprawna implementacja musi sprawdzić `wskaznik < len(stos)` przed zapisem.',
    2
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
  (
    (select id from algo_topics where slug = 'wyszukiwanie'),
    'zlozonosc',
    'Jaka jest złożoność czasowa wyszukiwania liniowego w najgorszym przypadku, dla tablicy o n elementach?',
    null, null,
    '[{"id":"a","text":"O(1)"},{"id":"b","text":"O(log n)"},{"id":"c","text":"O(n)"},{"id":"d","text":"O(n²)"}]'::jsonb,
    'c',
    'W najgorszym razie (szukany element jest ostatni albo go nie ma) trzeba sprawdzić wszystkie n elementów po kolei.',
    1
  ),
  (
    (select id from algo_topics where slug = 'wyszukiwanie'),
    'wynik-kodu',
    'Co wypisze ten kod?',
    'def znajdz(tab, cel):
    for i, x in enumerate(tab):
        if x == cel:
            return i
    return -1

print(znajdz([4, 7, 1, 9], 1))',
    'python',
    '[{"id":"a","text":"1"},{"id":"b","text":"2"},{"id":"c","text":"3"},{"id":"d","text":"-1"}]'::jsonb,
    'b',
    'Wartość 1 znajduje się pod indeksem 2 tablicy [4, 7, 1, 9] (indeksowanie od 0) — funkcja zwraca ten indeks, gdy tylko go napotka.',
    1
  ),
  (
    (select id from algo_topics where slug = 'wyszukiwanie'),
    'wybor-struktury',
    'Masz dane, do których dostęp odbywa się wyłącznie przez wyszukiwanie po kluczu, a wstawianie i usuwanie zdarzają się równie często co wyszukiwanie. Co da najlepszy średni czas tych trzech operacji razem?',
    null, null,
    '[{"id":"a","text":"Tablicę posortowaną z wyszukiwaniem binarnym"},{"id":"b","text":"Tablicę haszującą"},{"id":"c","text":"Listę jednokierunkową"},{"id":"d","text":"Stos"}]'::jsonb,
    'b',
    'Tablica haszująca daje średnio O(1) dla wyszukiwania, wstawiania i usuwania. Tablica posortowana ma wprawdzie szybkie wyszukiwanie binarne, ale wstawianie z zachowaniem porządku kosztuje O(n).',
    2
  ),
  (
    (select id from algo_topics where slug = 'wyszukiwanie'),
    'analiza-bledu',
    'Dla tab = [1, 3, 5] i cel = 1 ta funkcja zwraca -1, mimo że 1 jest pierwszym elementem tablicy. Na czym polega błąd?',
    'def wyszukaj_binarnie(tab, cel):
    lewy, prawy = 0, len(tab) - 1
    while lewy < prawy:
        srodek = (lewy + prawy) // 2
        if tab[srodek] == cel:
            return srodek
        elif tab[srodek] < cel:
            lewy = srodek + 1
        else:
            prawy = srodek - 1
    return -1',
    'python',
    '[{"id":"a","text":"Pętla kończy się warunkiem `lewy < prawy`, więc nigdy nie sprawdza przedziału jednoelementowego (lewy == prawy)"},{"id":"b","text":"tab musi mieć nieparzystą długość"},{"id":"c","text":"Środek jest liczony błędnym wzorem"},{"id":"d","text":"cel musi znajdować się pod indeksem 0"}]'::jsonb,
    'a',
    'Dla [1,3,5] i cel=1: pierwszy krok zawęża zakres do lewy=0, prawy=0. Warunek `lewy < prawy` jest wtedy fałszywy, więc pętla kończy się, nie sprawdzając jedynego pozostałego kandydata. Potrzebny jest warunek `lewy <= prawy`.',
    3
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
  (
    (select id from algo_topics where slug = 'sortowanie-proste'),
    'zlozonosc',
    'Jaka jest złożoność czasowa sortowania przez wstawianie w najgorszym przypadku (tablica posortowana malejąco)?',
    null, null,
    '[{"id":"a","text":"O(n)"},{"id":"b","text":"O(n log n)"},{"id":"c","text":"O(n²)"},{"id":"d","text":"O(2ⁿ)"}]'::jsonb,
    'c',
    'Każdy kolejny element trzeba przesunąć przez wszystkie już wstawione, bo jest od nich mniejszy — to suma 1+2+…+(n−1), czyli O(n²).',
    1
  ),
  (
    (select id from algo_topics where slug = 'sortowanie-proste'),
    'wynik-kodu',
    'Co wypisze ten kod?',
    'def sortuj_babelkowo(tab):
    n = len(tab)
    zamiany = 0
    for i in range(n):
        for j in range(n - i - 1):
            if tab[j] > tab[j+1]:
                tab[j], tab[j+1] = tab[j+1], tab[j]
                zamiany += 1
    return zamiany

print(sortuj_babelkowo([3, 1, 2]))',
    'python',
    '[{"id":"a","text":"0"},{"id":"b","text":"1"},{"id":"c","text":"2"},{"id":"d","text":"3"}]'::jsonb,
    'c',
    '[3,1,2]: porównanie (3,1) zamiana → [1,3,2], zamiany=1. (3,2) zamiana → [1,2,3], zamiany=2. Kolejne przebiegi nie znajdują już nic do zamiany. Łącznie 2 zamiany.',
    2
  ),
  (
    (select id from algo_topics where slug = 'sortowanie-proste'),
    'wybor-struktury',
    'Masz bardzo małą tablicę (kilka elementów) do posortowania wewnątrz pętli wykonywanej miliony razy. Który z prostych algorytmów sortowania najlepiej się nada?',
    null, null,
    '[{"id":"a","text":"Bąbelkowe — zawsze O(n²) niezależnie od danych"},{"id":"b","text":"Przez wstawianie — na małych i prawie posortowanych tablicach ma niewielką stałą czasową"},{"id":"c","text":"Przez wybór — zawsze wykonuje tyle samo porównań"},{"id":"d","text":"Żaden, bo O(n²) jest zawsze za wolne"}]'::jsonb,
    'b',
    'Dla małych n stała czasowa liczy się bardziej niż rząd wielkości — dlatego nawet szybkie sortowania hybrydowe (np. Timsort) przełączają się na sortowanie przez wstawianie poniżej pewnego progu długości.',
    2
  ),
  (
    (select id from algo_topics where slug = 'sortowanie-proste'),
    'analiza-bledu',
    'Ta funkcja ma sortować rosnąco, ale dla [5, 3, 1] zwraca [5, 1, 3] zamiast [1, 3, 5]. Na czym polega błąd?',
    'def sortuj_przez_wstawianie(tab):
    for i in range(1, len(tab)):
        klucz = tab[i]
        j = i - 1
        while j > 0 and tab[j] > klucz:
            tab[j+1] = tab[j]
            j -= 1
        tab[j+1] = klucz
    return tab',
    'python',
    '[{"id":"a","text":"Warunek pętli while powinien brzmieć `j >= 0`, nie `j > 0` — bez tego element nigdy nie trafia na samą pierwszą pozycję"},{"id":"b","text":"Pętla for powinna zaczynać się od 0, nie od 1"},{"id":"c","text":"klucz powinien być kopiowany głęboko"},{"id":"d","text":"Porównanie powinno brzmieć tab[j] < klucz"}]'::jsonb,
    'a',
    'Warunek `j > 0` blokuje porównanie z indeksem 0 — element, który powinien trafić na sam początek, zatrzymuje się na pozycji 1. Dla [5,3,1]: 1 powinno wylądować przed 3, ale pętla kończy się zanim do tego dojdzie.',
    3
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
  (
    (select id from algo_topics where slug = 'sortowanie-szybkie'),
    'wynik-kodu',
    'Co wypisze ten kod (`scal` łączy dwie posortowane listy w jedną)?',
    'def scal(lewa, prawa):
    wynik = []
    i = j = 0
    while i < len(lewa) and j < len(prawa):
        if lewa[i] <= prawa[j]:
            wynik.append(lewa[i]); i += 1
        else:
            wynik.append(prawa[j]); j += 1
    wynik.extend(lewa[i:])
    wynik.extend(prawa[j:])
    return wynik

print(scal([1, 4, 7], [2, 3, 8]))',
    'python',
    '[{"id":"a","text":"[1, 2, 3, 4, 7, 8]"},{"id":"b","text":"[1, 4, 7, 2, 3, 8]"},{"id":"c","text":"[1, 2, 4, 3, 7, 8]"},{"id":"d","text":"[2, 3, 8, 1, 4, 7]"}]'::jsonb,
    'a',
    'Krok po kroku porównujemy czoła obu list: 1<2→1; 4 vs 2→2; 4 vs 3→3; 4 vs 8→4; 7 vs 8→7; lewa się kończy, dopisujemy resztę prawej: 8. Wynik: [1,2,3,4,7,8].',
    2
  ),
  (
    (select id from algo_topics where slug = 'sortowanie-szybkie'),
    'krok-algorytmu',
    'Dzielisz tablicę [5, 2, 8, 1] metodą partycjonowania Lomuto z pivotem = ostatni element (1). Jak wygląda tablica bezpośrednio po zakończeniu partycjonowania?',
    null, null,
    '[{"id":"a","text":"[1, 2, 8, 5]"},{"id":"b","text":"[1, 5, 2, 8]"},{"id":"c","text":"[5, 2, 8, 1]"},{"id":"d","text":"[1, 8, 2, 5]"}]'::jsonb,
    'a',
    'Pivot = 1 jest najmniejszy, więc żaden element nie trafia przed niego — wskaźnik mniejszych elementów zostaje na pozycji 0. Na końcu zamienia się pivot (ostatni element) z pozycją 0: [5,2,8,1] → [1,2,8,5].',
    3
  ),
  (
    (select id from algo_topics where slug = 'sortowanie-szybkie'),
    'pojecia',
    'Dlaczego sortowanie przez scalanie zawsze działa w czasie O(n log n), niezależnie od wejściowych danych — w odróżnieniu od quicksorta?',
    null, null,
    '[{"id":"a","text":"Bo zawsze dzieli tablicę dokładnie na pół, niezależnie od wartości elementów — podział zależy tylko od liczby elementów, nie od danych"},{"id":"b","text":"Bo scalanie jest szybsze niż porównywanie"},{"id":"c","text":"Bo nie używa rekurencji"},{"id":"d","text":"Bo działa tylko na liczbach całkowitych"}]'::jsonb,
    'a',
    'Quicksort dzieli tablicę według wartości pivota, więc podział może być bardzo nierówny dla pechowych danych. Scalanie zawsze dzieli po indeksie, na pół — gwarantowana równowaga daje gwarantowaną złożoność.',
    2
  ),
  (
    (select id from algo_topics where slug = 'sortowanie-szybkie'),
    'analiza-bledu',
    'W poniższym quicksorcie zamiast `quicksort(tab, lewy, p - 1)` ktoś napisał `quicksort(tab, lewy, p)`. Jaki jest skutek tego błędu?',
    'def quicksort(tab, lewy, prawy):
    if lewy < prawy:
        p = partycjonuj(tab, lewy, prawy)
        quicksort(tab, lewy, p)
        quicksort(tab, p + 1, prawy)',
    'python',
    '[{"id":"a","text":"Element na pozycji p (pivot, już we właściwym miejscu) trafia ponownie do lewej rekurencji, co dla pewnych danych prowadzi do nieskończonej rekurencji"},{"id":"b","text":"Tablica zostanie posortowana malejąco zamiast rosnąco"},{"id":"c","text":"Złożoność spadnie do O(n)"},{"id":"d","text":"Kod zadziała identycznie jak poprawna wersja"}]'::jsonb,
    'a',
    'Pivot po partycjonowaniu stoi już na swojej docelowej pozycji p i nie powinien wracać do żadnej rekurencji. Włączenie go do lewej połowy może przy niektórych układach danych (np. same powtarzające się wartości) sprawić, że granice wywołania się nie zmienią — rekurencja nie posuwa się naprzód.',
    3
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
  (
    (select id from algo_topics where slug = 'tablice-haszujace'),
    'wynik-kodu',
    'Co wypisze ten kod?',
    'slownik = {}
slownik["a"] = 1
slownik["b"] = 2
slownik["a"] = 3
print(slownik)',
    'python',
    '[{"id":"a","text":"{''a'': 3, ''b'': 2}"},{"id":"b","text":"{''a'': 1, ''b'': 2, ''a'': 3}"},{"id":"c","text":"Błąd — zduplikowany klucz"},{"id":"d","text":"{''a'': 1, ''a'': 3, ''b'': 2}"}]'::jsonb,
    'a',
    'Przypisanie do istniejącego klucza nadpisuje jego wartość, nie tworzy drugiego wpisu — słownik nie może mieć dwóch wpisów o tym samym kluczu.',
    1
  ),
  (
    (select id from algo_topics where slug = 'tablice-haszujace'),
    'krok-algorytmu',
    'Tablica haszująca ma 3 kubełki (indeksy 0, 1, 2), a funkcja haszująca to h(x) = x mod 3. Wstawiasz po kolei 4, 7, 10 (łańcuchowanie). Co zawiera kubełek o indeksie 1 po tych trzech wstawieniach?',
    null, null,
    '[{"id":"a","text":"[4, 7, 10]"},{"id":"b","text":"[4]"},{"id":"c","text":"[7, 10]"},{"id":"d","text":"[]"}]'::jsonb,
    'a',
    'h(4)=1, h(7)=1, h(10)=1 — wszystkie trzy klucze haszują się do tego samego kubełka i trafiają tam w kolejności wstawiania.',
    2
  ),
  (
    (select id from algo_topics where slug = 'tablice-haszujace'),
    'wybor-struktury',
    'Chcesz zliczyć, ile razy każde słowo pojawia się w długim tekście, i na koniec szybko odpytywać o liczbę wystąpień konkretnego słowa. Jaka struktura da najlepszy średni czas zarówno zliczania, jak i odpytywania?',
    null, null,
    '[{"id":"a","text":"Tablica haszująca (słownik słowo → licznik)"},{"id":"b","text":"Tablica posortowana alfabetycznie"},{"id":"c","text":"Lista par (słowo, licznik) przeszukiwana liniowo"},{"id":"d","text":"Stos"}]'::jsonb,
    'a',
    'Tablica haszująca daje O(1) średnio zarówno na odczyt, jak i aktualizację licznika dla danego słowa — lista liniowa i tablica posortowana (przy częstych aktualizacjach) są wolniejsze.',
    1
  ),
  (
    (select id from algo_topics where slug = 'tablice-haszujace'),
    'analiza-bledu',
    'Tę funkcję haszującą zastosowano do kluczy "kot", "kura", "koń", "kasa" — wszystkie trafiają do tego samego kubełka. Na czym polega błąd projektowy?',
    'def hashuj(klucz_tekstowy):
    return ord(klucz_tekstowy[0]) % 10',
    'python',
    '[{"id":"a","text":"Funkcja używa tylko pierwszego znaku klucza, więc wszystkie słowa zaczynające się tą samą literą kolidują — dobra funkcja haszująca powinna uwzględniać CAŁY klucz"},{"id":"b","text":"ord() źle liczy kod znaku"},{"id":"c","text":"Modulo 10 jest za małe dla liter alfabetu"},{"id":"d","text":"Funkcja powinna zwracać wartość ujemną"}]'::jsonb,
    'a',
    'Ignorując resztę klucza, funkcja traci informację, która odróżniałaby te słowa — wszystkie zaczynające się na „k" zawsze wylądują w tym samym kubełku, niezależnie od tego, co jest dalej.',
    2
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
  (
    (select id from algo_topics where slug = 'drzewa-bst'),
    'wynik-kodu',
    'Co wypisze ten kod (węzeł to krotka (wartość, lewe, prawe))?',
    'def preorder(wezel):
    if wezel is None:
        return
    print(wezel[0], end=" ")
    preorder(wezel[1])
    preorder(wezel[2])

drzewo = (5, (3, None, None), (8, (7, None, None), None))
preorder(drzewo)',
    'python',
    '[{"id":"a","text":"5 3 8 7"},{"id":"b","text":"3 5 7 8"},{"id":"c","text":"5 8 7 3"},{"id":"d","text":"7 3 5 8"}]'::jsonb,
    'a',
    'Pre-order to węzeł → lewo → prawo: najpierw 5, potem całe lewe poddrzewo (samo 3), potem prawe (8, a w nim najpierw 8 samo, potem jego lewe dziecko 7).',
    2
  ),
  (
    (select id from algo_topics where slug = 'drzewa-bst'),
    'wybor-struktury',
    'Chcesz przechowywać zbiór liczb tak, żeby szybko (średnio O(log n)) sprawdzać przynależność ORAZ szybko wypisywać wszystkie elementy w kolejności rosnącej. Co wybierzesz?',
    null, null,
    '[{"id":"a","text":"Drzewo poszukiwań binarnych (BST)"},{"id":"b","text":"Tablicę haszującą"},{"id":"c","text":"Stos"},{"id":"d","text":"Kolejkę FIFO"}]'::jsonb,
    'a',
    'In-order po BST daje elementy posortowane za darmo. Tablica haszująca ma szybkie sprawdzanie przynależności, ale nie przechowuje żadnego użytecznego porządku do przechodzenia.',
    2
  ),
  (
    (select id from algo_topics where slug = 'drzewa-bst'),
    'pojecia',
    'Dlaczego przechodzenie in-order po poprawnym BST zawsze daje elementy w kolejności rosnącej?',
    null, null,
    '[{"id":"a","text":"Bo BST jest zawsze zbalansowane"},{"id":"b","text":"Bo definicja BST gwarantuje, że dla każdego węzła wartości w lewym poddrzewie są mniejsze, a w prawym większe — in-order odwiedza je dokładnie w tym porządku"},{"id":"c","text":"Bo in-order sortuje dane w trakcie przechodzenia"},{"id":"d","text":"Bo każdy węzeł ma co najwyżej jedno dziecko"}]'::jsonb,
    'b',
    'In-order (lewo → węzeł → prawo) w połączeniu z niezmiennikiem BST (lewo < węzeł < prawo) wymusza odwiedzanie wartości w kolejności rosnącej — to własność struktury, nie dodatkowe sortowanie.',
    2
  ),
  (
    (select id from algo_topics where slug = 'drzewa-bst'),
    'analiza-bledu',
    'Ta funkcja wyszukiwania w BST ma zamienione gałęzie. Dla drzewa z korzeniem 5, lewym dzieckiem 3 i prawym dzieckiem 8, co zwróci wywołanie szukaj(korzen, 3)?',
    'def szukaj(wezel, cel):
    if wezel is None:
        return False
    if wezel[0] == cel:
        return True
    elif cel < wezel[0]:
        return szukaj(wezel[2], cel)
    else:
        return szukaj(wezel[1], cel)',
    'python',
    '[{"id":"a","text":"False, mimo że 3 jest w drzewie"},{"id":"b","text":"True, poprawnie"},{"id":"c","text":"Zgłosi wyjątek"},{"id":"d","text":"Zapętli się w nieskończoność"}]'::jsonb,
    'a',
    'Gdy cel < wartość węzła, funkcja błędnie schodzi w PRAWE poddrzewo (wezel[2]) zamiast w lewe. Dla celu 3 < 5 idzie więc do węzła 8, a stamtąd dalej w złą stronę — nigdy nie trafia do 3, choć ten istnieje w drzewie.',
    3
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
  (
    (select id from algo_topics where slug = 'kopce'),
    'wynik-kodu',
    'Co wypisze ten kod?',
    'import heapq

kopiec = []
heapq.heappush(kopiec, 5)
heapq.heappush(kopiec, 1)
heapq.heappush(kopiec, 3)
print(heapq.heappop(kopiec))',
    'python',
    '[{"id":"a","text":"5"},{"id":"b","text":"1"},{"id":"c","text":"3"},{"id":"d","text":"0"}]'::jsonb,
    'b',
    '`heapq` implementuje kopiec typu min — `heappop` zawsze zwraca najmniejszy aktualnie przechowywany element, niezależnie od kolejności wstawiania.',
    1
  ),
  (
    (select id from algo_topics where slug = 'kopce'),
    'krok-algorytmu',
    'Do kopca min reprezentowanego jako tablica [1, 3, 2, 7, 8] dodajesz wartość 0 na koniec i wykonujesz przesiewanie w górę. Jak wygląda tablica po zakończeniu operacji?',
    null, null,
    '[{"id":"a","text":"[0, 3, 1, 7, 8, 2]"},{"id":"b","text":"[0, 1, 3, 7, 8, 2]"},{"id":"c","text":"[1, 3, 2, 7, 8, 0]"},{"id":"d","text":"[0, 3, 2, 7, 8, 1]"}]'::jsonb,
    'a',
    'Nowy element (indeks 5, wartość 0) ma rodzica pod indeksem 2 (wartość 2) — 0<2, zamiana: [1,3,0,7,8,2]. Teraz on jest pod indeksem 2, rodzic pod indeksem 0 (wartość 1) — 0<1, zamiana: [0,3,1,7,8,2]. Dotarł do korzenia, koniec.',
    3
  ),
  (
    (select id from algo_topics where slug = 'kopce'),
    'wybor-struktury',
    'Musisz wielokrotnie wyciągać NAJMNIEJSZY element ze zbioru, który cały czas rośnie o nowe elementy. Jaka struktura da najlepszą złożoność obu operacji (wstaw, wyciągnij minimum)?',
    null, null,
    '[{"id":"a","text":"Kopiec min — O(log n) dla obu operacji"},{"id":"b","text":"Tablica nieposortowana — O(1) wstaw, O(n) minimum"},{"id":"c","text":"Tablica posortowana — O(n) wstaw, O(1) minimum"},{"id":"d","text":"Stos"}]'::jsonb,
    'a',
    'Kopiec min to jedyna z wymienionych struktur, która daje O(log n) dla OBU operacji naraz — pozostałe są szybkie w jednej, ale kosztowne w drugiej.',
    2
  ),
  (
    (select id from algo_topics where slug = 'kopce'),
    'analiza-bledu',
    'Na czym polega błąd w tej implementacji przesiewania w dół?',
    'def przesiej_w_dol(kopiec, i, n):
    while True:
        lewy = 2 * i + 1
        prawy = 2 * i + 2
        najmniejszy = i
        if lewy < n and kopiec[lewy] < kopiec[najmniejszy]:
            najmniejszy = lewy
        if prawy < n and kopiec[prawy] < kopiec[najmniejszy]:
            najmniejszy = prawy
        if najmniejszy == i:
            break
        kopiec[i], kopiec[najmniejszy] = kopiec[najmniejszy], kopiec[i]
        i = lewy',
    'python',
    '[{"id":"a","text":"Po zamianie algorytm zawsze kontynuuje w lewym dziecku zamiast w tym, z którym faktycznie zamienił wartość — jeśli zamiana była z prawym dzieckiem, przesiewanie idzie w złą gałąź"},{"id":"b","text":"Powinno być i = prawy zamiast i = lewy"},{"id":"c","text":"Warunek powinien używać > zamiast <"},{"id":"d","text":"najmniejszy powinien startować jako -1"}]'::jsonb,
    'a',
    'Ostatnia linia powinna brzmieć `i = najmniejszy`, nie `i = lewy`. Gdy to prawe dziecko było mniejsze i doszło do zamiany, kontynuowanie w lewym dziecku pomija właściwą gałąź, w której wartość rzeczywiście powinna dalej „spadać".',
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
  (
    (select id from algo_topics where slug = 'grafy'),
    'zlozonosc',
    'Jaka jest złożoność czasowa BFS na grafie z V wierzchołkami i E krawędziami, reprezentowanym jako lista sąsiedztwa?',
    null, null,
    '[{"id":"a","text":"O(V)"},{"id":"b","text":"O(V + E)"},{"id":"c","text":"O(V · E)"},{"id":"d","text":"O(V²)"}]'::jsonb,
    'b',
    'Każdy wierzchołek odwiedzamy raz (O(V)), a każdą krawędź przeglądamy przy okazji odwiedzin jej końców (O(E)) — razem O(V + E).',
    2
  ),
  (
    (select id from algo_topics where slug = 'grafy'),
    'wynik-kodu',
    'Co wypisze ten kod?',
    'from collections import deque

def bfs(graf, start):
    odwiedzeni = {start}
    kolejka = deque([start])
    kolejnosc = []
    while kolejka:
        w = kolejka.popleft()
        kolejnosc.append(w)
        for sasiad in graf[w]:
            if sasiad not in odwiedzeni:
                odwiedzeni.add(sasiad)
                kolejka.append(sasiad)
    return kolejnosc

graf = {1: [2, 3], 2: [1, 4], 3: [1], 4: [2]}
print(bfs(graf, 1))',
    'python',
    '[{"id":"a","text":"[1, 2, 3, 4]"},{"id":"b","text":"[1, 3, 2, 4]"},{"id":"c","text":"[1, 2, 4, 3]"},{"id":"d","text":"[4, 3, 2, 1]"}]'::jsonb,
    'a',
    'Z 1 odwiedzamy sąsiadów w kolejności [2, 3] → kolejka [2,3]. Z 2 dochodzi nowy sąsiad 4 → kolejka [3,4]. Kolejność odwiedzin: 1, 2, 3, 4.',
    2
  ),
  (
    (select id from algo_topics where slug = 'grafy'),
    'krok-algorytmu',
    'Przeszukujesz graf DFS (rekurencyjnie) od wierzchołka A w grafie A–B, A–C, B–D, odwiedzając sąsiadów w kolejności podania. Jaka jest kolejność odwiedzin?',
    null, null,
    '[{"id":"a","text":"A, B, D, C"},{"id":"b","text":"A, B, C, D"},{"id":"c","text":"A, C, B, D"},{"id":"d","text":"A, D, B, C"}]'::jsonb,
    'a',
    'DFS schodzi najgłębiej jak może, zanim zawróci: z A idzie do pierwszego sąsiada B, z B do jego pierwszego (jedynego) nieodwiedzonego sąsiada D, dopiero po wyczerpaniu tej gałęzi wraca do A i odwiedza C.',
    2
  ),
  (
    (select id from algo_topics where slug = 'grafy'),
    'analiza-bledu',
    'Ta implementacja BFS działa poprawnie, ale jest mniej wydajna niż standardowa wersja. Na czym polega problem?',
    'from collections import deque

def bfs_wolny(graf, start):
    odwiedzeni = set()
    kolejka = deque([start])
    kolejnosc = []
    while kolejka:
        w = kolejka.popleft()
        if w in odwiedzeni:
            continue
        odwiedzeni.add(w)
        kolejnosc.append(w)
        for sasiad in graf[w]:
            kolejka.append(sasiad)
    return kolejnosc',
    'python',
    '[{"id":"a","text":"Sąsiedzi trafiają do kolejki bez sprawdzenia, czy już są odwiedzeni (albo już czekają) — ten sam wierzchołek może wylądować w kolejce wielokrotnie"},{"id":"b","text":"Funkcja nie znajdzie wszystkich wierzchołków grafu"},{"id":"c","text":"Zwróci wierzchołki w odwrotnej kolejności"},{"id":"d","text":"Zapętli się w nieskończoność dla każdego grafu"}]'::jsonb,
    'a',
    'Sprawdzenie `odwiedzeni` następuje dopiero przy ZDJĘCIU z kolejki, a nie przy dodawaniu — więc zanim dany wierzchołek zostanie zdjęty i oznaczony, mógł już trafić do kolejki po raz drugi czy trzeci przez różnych sąsiadów.',
    2
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
  ),
  (
    (select id from algo_topics where slug = 'programowanie-dynamiczne'),
    'wynik-kodu',
    'Co wypisze ten kod?',
    'def fib_tab(n):
    tab = [0, 1]
    for i in range(2, n + 1):
        tab.append(tab[i-1] + tab[i-2])
    return tab

print(fib_tab(6))',
    'python',
    '[{"id":"a","text":"[0, 1, 1, 2, 3, 5, 8]"},{"id":"b","text":"[1, 1, 2, 3, 5, 8, 13]"},{"id":"c","text":"[0, 1, 2, 3, 5, 8, 13]"},{"id":"d","text":"[0, 1, 1, 2, 3, 5]"}]'::jsonb,
    'a',
    'Tabulacja dodaje kolejno: tab[2]=1+0=1, tab[3]=1+1=2, tab[4]=2+1=3, tab[5]=3+2=5, tab[6]=5+3=8. Finalnie: [0,1,1,2,3,5,8].',
    1
  ),
  (
    (select id from algo_topics where slug = 'programowanie-dynamiczne'),
    'krok-algorytmu',
    'Budujesz tabelę DP dla minimalnej liczby monet (nominały {1, 3}), gdzie dp[0]=0. Po wypełnieniu masz dp[0..2] = [0, 1, 2]. Jaka będzie wartość dp[3]?',
    null, null,
    '[{"id":"a","text":"1"},{"id":"b","text":"2"},{"id":"c","text":"3"},{"id":"d","text":"4"}]'::jsonb,
    'a',
    'dp[3] = min(dp[3-1]+1, dp[3-3]+1) = min(dp[2]+1=3, dp[0]+1=1) = 1 — jedna moneta nominału 3 wystarcza, więc wynik jest dużo lepszy niż gdyby liczyć tylko nominałem 1.',
    2
  ),
  (
    (select id from algo_topics where slug = 'programowanie-dynamiczne'),
    'wybor-struktury',
    'Rozwiązujesz problem plecakowy metodą programowania dynamicznego z memoizacją wyników dla par (indeks, pozostała_pojemność). Jakiej struktury użyjesz do przechowywania już policzonych wyników, żeby sprawdzenie „czy to już liczyłem" było szybkie?',
    null, null,
    '[{"id":"a","text":"Słownika (tablicy haszującej) z kluczem (indeks, pojemność)"},{"id":"b","text":"Stosu"},{"id":"c","text":"Kolejki FIFO"},{"id":"d","text":"Listy przeszukiwanej liniowo"}]'::jsonb,
    'a',
    'Klucz jest parą wartości, więc naturalnym wyborem jest słownik z krotką jako kluczem — daje średnio O(1) na sprawdzenie i zapis wyniku dla danego podproblemu.',
    2
  ),
  (
    (select id from algo_topics where slug = 'programowanie-dynamiczne'),
    'pojecia',
    'Czym różni się podejście „od dołu" (bottom-up, tabulacja) od podejścia „od góry" (top-down, memoizacja) w programowaniu dynamicznym?',
    null, null,
    '[{"id":"a","text":"Tabulacja wypełnia tablicę wyników iteracyjnie od najmniejszych podproblemów w górę; memoizacja liczy rekurencyjnie od dużego problemu i zapamiętuje wyniki po drodze — oba dają tę samą złożoność"},{"id":"b","text":"Tabulacja jest zawsze wolniejsza od memoizacji"},{"id":"c","text":"Memoizacja nie wymaga przechowywania żadnych wyników pośrednich"},{"id":"d","text":"To dokładnie to samo, różni je tylko nazwa"}]'::jsonb,
    'a',
    'Obie techniki unikają ponownego liczenia tych samych podproblemów i mają tę samą złożoność asymptotyczną — różni je wyłącznie kierunek: iteracyjny od dołu, albo rekurencyjny od góry z zapamiętywaniem.',
    2
  );
