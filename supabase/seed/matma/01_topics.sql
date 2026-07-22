-- ============================================================================
-- supabase/seed/matma/01_topics.sql
-- The 11 CKE-rozszerzona departments (math_topics) + the recommended
-- curriculum-order roadmap (math_learning_path_stages, one stage per topic).
-- Mirrors lib/matma/topics.ts MATH_TOPICS exactly — keep both in sync.
-- exam_weight is an editable admin approximation, not an official CKE
-- distribution (see 0007_matma.sql header comment).
--
-- Idempotent: deletes by slug first. Run this BEFORE any
-- 02_lessons_<slug>.sql / 03_problems_<slug>.sql file (they look up
-- topic_id via `(select id from math_topics where slug = '...')`).
-- ============================================================================

delete from math_learning_path_stages where topic_id in (select id from math_topics);
delete from math_topics where slug in (
  'liczby-rzeczywiste', 'rownania-nierownosci', 'funkcje', 'ciagi', 'trygonometria',
  'planimetria', 'geometria-analityczna', 'stereometria', 'rachunek-rozniczkowy',
  'kombinatoryka-prawdopodobienstwo', 'statystyka'
);

insert into math_topics (slug, title, description, order_index, exam_weight) values
  ('liczby-rzeczywiste', 'Liczby rzeczywiste i wyrażenia algebraiczne',
   'Potęgi, pierwiastki, logarytmy, wartość bezwzględna, wielomiany (dzielenie, tw. Bézouta, wzory Viète''a), wyrażenia wymierne.',
   1, 0.10),
  ('rownania-nierownosci', 'Równania i nierówności',
   'Liniowe, kwadratowe, wielomianowe, wymierne, z wartością bezwzględną, z parametrem, układy równań.',
   2, 0.12),
  ('funkcje', 'Funkcje',
   'Własności ogólne (dziedzina, monotoniczność, parzystość, złożenie, funkcja odwrotna) oraz funkcja liniowa, kwadratowa, wielomianowa, wymierna, wykładnicza, logarytmiczna, trygonometryczne.',
   3, 0.12),
  ('ciagi', 'Ciągi liczbowe',
   'Ciąg arytmetyczny, geometryczny, rekurencyjny, granice ciągów, zastosowania finansowe (procent składany, kredyty, lokaty).',
   4, 0.08),
  ('trygonometria', 'Trygonometria',
   'Tożsamości, równania i nierówności trygonometryczne, funkcje trygonometryczne kąta w trójkącie prostokątnym i dowolnym.',
   5, 0.08),
  ('planimetria', 'Planimetria',
   'Twierdzenia o trójkątach, czworokątach, okręgach, podobieństwo figur, trygonometria w geometrii płaskiej.',
   6, 0.08),
  ('geometria-analityczna', 'Geometria analityczna na płaszczyźnie',
   'Równanie prostej, okręgu, wzajemne położenie prostych/okręgów, symetrie, odległość punktu od prostej, pola figur w układzie współrzędnych.',
   7, 0.10),
  ('stereometria', 'Stereometria',
   'Graniastosłupy, ostrosłupy, walec, stożek, kula, przekroje, kąty między prostymi/płaszczyznami, pola powierzchni i objętości.',
   8, 0.08),
  ('rachunek-rozniczkowy', 'Rachunek różniczkowy',
   'Pochodna funkcji, interpretacja geometryczna (styczna), monotoniczność i ekstrema z pochodnej, zadania optymalizacyjne z kontekstem praktycznym.',
   9, 0.12),
  ('kombinatoryka-prawdopodobienstwo', 'Kombinatoryka i rachunek prawdopodobieństwa',
   'Permutacje, kombinacje, wariacje (z powtórzeniami i bez), prawdopodobieństwo klasyczne i warunkowe, schemat Bernoulliego, prawdopodobieństwo całkowite, wartość oczekiwana.',
   10, 0.08),
  ('statystyka', 'Elementy statystyki opisowej',
   'Średnia, mediana, odchylenie standardowe, wariancja.',
   11, 0.04);

insert into math_learning_path_stages (order_index, topic_id, title)
select order_index - 1, id, title from math_topics order by order_index;
