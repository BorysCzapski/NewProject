-- ============================================================================
-- supabase/seed/algorytmy/01_topics.sql
-- 12 działów aplikacji Algorytmy. Autorytatywna lista (kolejność, opisy,
-- uzasadnienie kolejności) siedzi w lib/algorytmy/topics.ts — ten plik jest jej
-- odwzorowaniem, tak jak supabase/seed/matma/01_topics.sql wobec
-- lib/matma/topics.ts. Slugi muszą się zgadzać: scripts/algorytmy-build-lessons.mjs
-- odmawia wygenerowania SQL-a z lekcjami, jeśli lekcja wskazuje na slug spoza
-- tej listy.
--
-- Idempotentny: upsert po slug, więc ponowne uruchomienie aktualizuje treść
-- zamiast duplikować działy. Uruchom PRZED 02_exercises.sql i 03_lessons.sql —
-- oba szukają działu po slugu.
-- ============================================================================

insert into algo_topics (slug, title, description, category, order_index) values
  (
    'zlozonosc-obliczeniowa',
    'Złożoność obliczeniowa',
    'Notacja O, koszt czasowy i pamięciowy, przypadek pesymistyczny i średni. Język, w którym mówi się o każdym kolejnym dziale.',
    'podstawy', 1
  ),
  (
    'rekurencja',
    'Rekurencja',
    'Warunek bazowy, wywołanie rekurencyjne, stos wywołań i koszt pamięciowy. Dlaczego naiwne Fibonacciego jest wykładnicze.',
    'podstawy', 2
  ),
  (
    'tablice-i-listy',
    'Tablice i listy',
    'Tablica o stałym dostępie kontra lista wiązana o tanim wstawianiu. Co naprawdę kosztuje indeksowanie, a co przepinanie wskaźników.',
    'struktury', 3
  ),
  (
    'stos-i-kolejka',
    'Stos i kolejka',
    'LIFO i FIFO: dwie struktury, które nie dają dostępu swobodnego i właśnie dzięki temu są szybkie. Stos wywołań, cofanie, bufory.',
    'struktury', 4
  ),
  (
    'wyszukiwanie',
    'Wyszukiwanie',
    'Przeszukiwanie liniowe i binarne. Skąd bierze się logarytm i dlaczego wyszukiwanie binarne wymaga posortowanych danych.',
    'algorytmy', 5
  ),
  (
    'sortowanie-proste',
    'Sortowanie proste',
    'Bąbelkowe, przez wstawianie i przez wybór — trzy algorytmy O(n²), które różnią się tym, kiedy są dobrym wyborem.',
    'algorytmy', 6
  ),
  (
    'sortowanie-szybkie',
    'Sortowanie w czasie n log n',
    'Sortowanie przez scalanie i szybkie. Dziel i zwyciężaj, wybór pivota, przypadek pesymistyczny quicksorta i granica O(n log n).',
    'algorytmy', 7
  ),
  (
    'tablice-haszujace',
    'Tablice haszujące',
    'Funkcja haszująca, kolizje, adresowanie łańcuchowe i otwarte. Dlaczego słownik jest O(1) średnio, ale O(n) pesymistycznie.',
    'struktury', 8
  ),
  (
    'drzewa-bst',
    'Drzewa i BST',
    'Drzewo binarne, przechodzenie pre/in/post-order, drzewo poszukiwań binarnych i to, co się psuje, gdy BST się zdegeneruje.',
    'struktury', 9
  ),
  (
    'kopce',
    'Kopce i kolejki priorytetowe',
    'Kopiec binarny w tablicy, przesiewanie w górę i w dół, budowa kopca i sortowanie przez kopcowanie.',
    'struktury', 10
  ),
  (
    'grafy',
    'Grafy',
    'Reprezentacje grafu, przeszukiwanie wszerz i w głąb, najkrótsza ścieżka w grafie nieważonym i algorytm Dijkstry.',
    'struktury', 11
  ),
  (
    'programowanie-dynamiczne',
    'Programowanie dynamiczne i zachłanność',
    'Nakładające się podproblemy, spamiętywanie, budowa od dołu — i kiedy prostsze podejście zachłanne wystarcza, a kiedy zawodzi.',
    'algorytmy', 12
  )
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  category = excluded.category,
  order_index = excluded.order_index,
  updated_at = now();
