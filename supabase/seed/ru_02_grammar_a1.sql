-- =============================================================================
-- Seed: Russian (ru) grammar topics + exercises, level A1
-- File: supabase/seed/ru_02_grammar_a1.sql
-- App: Polish-language app teaching Russian to Polish speakers.
-- Note: word_en / target-language content is in Russian (Cyrillic).
--       Explanations are in Polish. Idempotent: re-running replaces A1/ru data.
-- =============================================================================

delete from grammar_topics where language = 'ru' and level = 'A1';

-- -----------------------------------------------------------------------------
-- Topic 0: Alfabet i wymowa (cyrylica)
-- -----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000a1',
  'ru',
  'A1',
  'ru-alfabet',
  'Alfabet i wymowa (cyrylica)',
  'Rosyjski alfabet to cyrylica (кириллица) i składa się z 33 liter.
Niektóre litery wyglądają jak polskie i czyta się je podobnie, na przykład А, К, М, О, Т.
Inne wyglądają znajomo, ale czyta się je zupełnie inaczej: В to nasze W, Н to N, Р to R, С to S, a У to U.
Są też litery zupełnie nowe: Ж (ż), Ш (sz), Щ (szcz), Ч (cz), Ц (c), Э (e), Ю (ju), Я (ja).
Litera Ё zawsze jest akcentowana i czyta się ją jak jo.
W rosyjskim bardzo ważny jest akcent (ударение) — pada on na różne sylaby i wpływa na wymowę samogłosek.
Nieakcentowane О często brzmi jak A, dlatego słowo молоко (mleko) czytamy mniej więcej malako.
Miękki znak Ь nie ma własnego dźwięku, ale zmiękcza poprzednią spółgłoskę.
Popatrz na przykłady:
Это Москва. (To jest Moskwa.)
Меня зовут Анна. (Nazywam się Anna.)
Я говорю по-русски. (Mówię po rosyjsku.)
Na początku czytaj litery na głos codziennie, a szybko je zapamiętasz.',
  0
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('f0000000-0000-4000-8000-0000000000a1', 'gap_fill', 'Wpisz brakującą literę cyrylicy: „Это ___осква." (Moskwa)', NULL, 'М', 0),
('f0000000-0000-4000-8000-0000000000a1', 'multiple_choice', 'Która litera cyrylicy odpowiada polskiemu dźwiękowi „w"?', '["В","Б","Н","М"]'::jsonb, 'В', 1),
('f0000000-0000-4000-8000-0000000000a1', 'multiple_choice', 'Jak przeczytamy rosyjską literę „Н"?', '["N","H","I","J"]'::jsonb, 'N', 2),
('f0000000-0000-4000-8000-0000000000a1', 'gap_fill', 'Uzupełnij brakującą literę: „Меня ___овут Анна." (zovut — nazywam się)', NULL, 'з', 3),
('f0000000-0000-4000-8000-0000000000a1', 'multiple_choice', 'Nieakcentowane „о" w słowie „молоко" wymawiamy najczęściej jako:', '["a","o","u","e"]'::jsonb, 'a', 4),
('f0000000-0000-4000-8000-0000000000a1', 'transformation', 'Zapisz w transkrypcji łacińskiej rosyjskie zdanie: „Я говорю по-русски."', NULL, 'Ja govoriu po-russki.', 5);

-- -----------------------------------------------------------------------------
-- Topic 1: Rodzaj rzeczownika
-- -----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000a2',
  'ru',
  'A1',
  'ru-rodzaj',
  'Rodzaj rzeczownika',
  'W języku rosyjskim, tak jak w polskim, rzeczowniki mają rodzaj: męski, żeński lub nijaki.
Rodzaj najłatwiej rozpoznać po końcówce w mianowniku (kto? co?).
Rzeczowniki rodzaju męskiego zwykle kończą się na spółgłoskę, na przykład стол (stół), дом (dom), брат (brat).
Rzeczowniki rodzaju żeńskiego najczęściej kończą się na -а lub -я, na przykład мама (mama), книга (książka), Россия (Rosja).
Rzeczowniki rodzaju nijakiego kończą się zwykle na -о lub -е, na przykład окно (okno), море (morze), слово (słowo).
Uwaga: słowa zakończone na miękki znak Ь mogą być męskie albo żeńskie i trzeba uczyć się ich na pamięć, na przykład день (dzień, r. męski) i ночь (noc, r. żeński).
Rodzaj jest ważny, bo wpływa na formę przymiotników oraz czasowników w czasie przeszłym.
Popatrz na przykłady:
Это мой дом. (To jest mój dom.)
Это моя книга. (To jest moja książka.)
Это моё окно. (To jest moje okno.)
Zapamiętaj typowe końcówki, a szybko nauczysz się rozpoznawać rodzaj.',
  1
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('f0000000-0000-4000-8000-0000000000a2', 'multiple_choice', 'Jakiego rodzaju jest słowo „книга"?', '["męski","żeński","nijaki"]'::jsonb, 'żeński', 0),
('f0000000-0000-4000-8000-0000000000a2', 'multiple_choice', 'Jakiego rodzaju jest słowo „окно"?', '["męski","żeński","nijaki"]'::jsonb, 'nijaki', 1),
('f0000000-0000-4000-8000-0000000000a2', 'gap_fill', 'Uzupełnij zaimek dzierżawczy (rodzaj męski): „Это ___ дом." (mój)', NULL, 'мой', 2),
('f0000000-0000-4000-8000-0000000000a2', 'gap_fill', 'Uzupełnij zaimek dzierżawczy (rodzaj żeński): „Это ___ книга." (moja)', NULL, 'моя', 3),
('f0000000-0000-4000-8000-0000000000a2', 'multiple_choice', 'Które słowo jest rodzaju męskiego?', '["мама","стол","окно","книга"]'::jsonb, 'стол', 4),
('f0000000-0000-4000-8000-0000000000a2', 'transformation', 'Napisz po rosyjsku zdanie: „To jest moje okno." (użyj właściwej formy „moje")', NULL, 'Это моё окно.', 5);

-- -----------------------------------------------------------------------------
-- Topic 2: Zaimki osobowe
-- -----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000a3',
  'ru',
  'A1',
  'ru-zaimki-osobowe',
  'Zaimki osobowe',
  'Zaimki osobowe zastępują osoby lub rzeczy, o których mówimy.
W języku rosyjskim podstawowe zaimki w mianowniku to: я (ja), ты (ty), он (on), она (ona), оно (ono), мы (my), вы (wy), они (oni/one).
Zaimka ты używamy wobec osób, które dobrze znamy, a вы w formie grzecznościowej do jednej osoby (odpowiednik polskiego „Pan/Pani") oraz zawsze do wielu osób.
Zaimek он zastępuje rzeczowniki rodzaju męskiego, она — żeńskiego, a оно — nijakiego, więc „stół" (стол) to он, a „książka" (книга) to она.
W rosyjskim, w przeciwieństwie do polskiego, zaimka osobowego zwykle się nie opuszcza, gdy jest podmiotem.
Popatrz na przykłady:
Я студент. (Jestem studentem.)
Ты дома? (Jesteś w domu?)
Он врач, а она учительница. (On jest lekarzem, a ona nauczycielką.)
Мы говорим по-русски. (Mówimy po rosyjsku.)
Naucz się tych ośmiu zaimków na pamięć — to podstawa każdego zdania.',
  2
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('f0000000-0000-4000-8000-0000000000a3', 'multiple_choice', 'Który zaimek znaczy „my"?', '["я","мы","вы","они"]'::jsonb, 'мы', 0),
('f0000000-0000-4000-8000-0000000000a3', 'multiple_choice', 'Grzecznościowo, do jednej starszej osoby, powiemy:', '["ты","вы","они","он"]'::jsonb, 'вы', 1),
('f0000000-0000-4000-8000-0000000000a3', 'gap_fill', 'Uzupełnij zaimek: „___ студент." (Ja)', NULL, 'Я', 2),
('f0000000-0000-4000-8000-0000000000a3', 'gap_fill', 'Zastąp rzeczownik zaimkiem: „Книга здесь." → „___ здесь." (ona)', NULL, 'Она', 3),
('f0000000-0000-4000-8000-0000000000a3', 'multiple_choice', 'Jakim zaimkiem zastąpimy słowo „стол"?', '["он","она","оно","они"]'::jsonb, 'он', 4),
('f0000000-0000-4000-8000-0000000000a3', 'transformation', 'Przekształć zdanie, wstawiając właściwy zaimek zamiast imienia: „Анна дома." →', NULL, 'Она дома.', 5);

-- -----------------------------------------------------------------------------
-- Topic 3: Czas teraźniejszy
-- -----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000a4',
  'ru',
  'A1',
  'ru-czas-terazniejszy',
  'Czas teraźniejszy',
  'Czas teraźniejszy opisuje to, co dzieje się teraz lub zwykle.
W rosyjskim czasowniki dzielą się na dwie koniugacje i odmieniają się przez osoby, dodając końcówki do tematu.
Popatrz na czasownik говорить (mówić): я говорю, ты говоришь, он/она говорит, мы говорим, вы говорите, они говорят.
Inny wzór ma czasownik читать (czytać): я читаю, ты читаешь, он читает, мы читаем, вы читаете, они читают.
Bardzo ważne jest to, że w czasie teraźniejszym Rosjanie nie używają słowa „być" (быть).
Dlatego nie mówimy „jestem studentem" z czasownikiem, tylko po prostu Я студент.
Z tego samego powodu zdanie „To jest dom" brzmi Это дом, bez żadnego „jest".
Końcówka czasownika zawsze pokazuje osobę, więc zwróć na nią szczególną uwagę.
Popatrz na przykłady:
Я читаю книгу. (Czytam książkę.)
Ты говоришь по-русски? (Mówisz po rosyjsku?)
Мы живём в Москве. (Mieszkamy w Moskwie.)
Ćwicz odmianę na głos, a końcówki wejdą Ci w krew.',
  3
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('f0000000-0000-4000-8000-0000000000a4', 'gap_fill', 'Odmień czasownik „читать" w 1. osobie (ja): „Я ___ книгу."', NULL, 'читаю', 0),
('f0000000-0000-4000-8000-0000000000a4', 'gap_fill', 'Odmień czasownik „говорить" w 2. osobie (ty): „Ты ___ по-русски?"', NULL, 'говоришь', 1),
('f0000000-0000-4000-8000-0000000000a4', 'multiple_choice', 'Wybierz poprawną formę: „Мы ___ в Москве."', '["живу","живёшь","живём","живут"]'::jsonb, 'живём', 2),
('f0000000-0000-4000-8000-0000000000a4', 'multiple_choice', 'Jak powiemy „On mówi"?', '["Он говорю","Он говоришь","Он говорит","Он говорят"]'::jsonb, 'Он говорит', 3),
('f0000000-0000-4000-8000-0000000000a4', 'multiple_choice', 'Które zdanie jest poprawne po rosyjsku (bez czasownika „być")?', '["Я есть студент","Я студент","Я быть студент","Я являюсь студент"]'::jsonb, 'Я студент', 4),
('f0000000-0000-4000-8000-0000000000a4', 'transformation', 'Odmień czasownik w nawiasie do właściwej osoby: „Они (читать) книгу." →', NULL, 'Они читают книгу.', 5);

-- -----------------------------------------------------------------------------
-- Topic 4: Liczba mnoga
-- -----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000a5',
  'ru',
  'A1',
  'ru-liczba-mnoga',
  'Liczba mnoga',
  'Liczba mnoga oznacza, że mówimy o więcej niż jednej rzeczy lub osobie.
W rosyjskim rzeczowniki rodzaju męskiego i żeńskiego zwykle tworzą liczbę mnogą przez końcówkę -ы lub -и.
Na przykład стол (stół) → столы, книга (książka) → книги, студент (student) → студенты.
Końcówki -и używamy po literach г, к, х, ж, ш, щ, ч oraz po miękkim znaku, dlatego mamy книга → книги, a nie „книгы".
Rzeczowniki rodzaju nijakiego zakończone na -о w liczbie mnogiej mają zwykle -а, na przykład окно (okno) → окна, слово (słowo) → слова.
Istnieją też wyjątki, których trzeba nauczyć się osobno: дом → дома (domy), друг → друзья (przyjaciele), человек → люди (ludzie).
Popatrz na przykłady:
Это столы. (To są stoły.)
У меня есть книги. (Mam książki.)
В классе новые студенты. (W klasie są nowi studenci.)
Na początku skup się na regularnych końcówkach -ы i -и, a wyjątki dodawaj stopniowo.',
  4
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('f0000000-0000-4000-8000-0000000000a5', 'gap_fill', 'Utwórz liczbę mnogą: „стол" → „___"', NULL, 'столы', 0),
('f0000000-0000-4000-8000-0000000000a5', 'gap_fill', 'Utwórz liczbę mnogą: „книга" → „___"', NULL, 'книги', 1),
('f0000000-0000-4000-8000-0000000000a5', 'multiple_choice', 'Jaka jest liczba mnoga słowa „окно"?', '["окны","окна","окни","окно"]'::jsonb, 'окна', 2),
('f0000000-0000-4000-8000-0000000000a5', 'multiple_choice', 'Dlaczego mówimy „книги", a nie „книгы"?', '["po literze г używamy końcówki -и","to nieregularny wyjątek","bo to rodzaj nijaki","bo słowo jest obce"]'::jsonb, 'po literze г używamy końcówki -и', 3),
('f0000000-0000-4000-8000-0000000000a5', 'multiple_choice', 'Które słowo to nieregularna liczba mnoga słowa „человек"?', '["человеки","люди","человека","человеков"]'::jsonb, 'люди', 4),
('f0000000-0000-4000-8000-0000000000a5', 'transformation', 'Przekształć zdanie z liczby pojedynczej na mnogą: „Это студент." →', NULL, 'Это студенты.', 5);
