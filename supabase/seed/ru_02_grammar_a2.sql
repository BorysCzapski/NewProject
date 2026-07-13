-- =============================================================================
-- Seed: Russian (ru) grammar topics + exercises, level A2
-- File: supabase/seed/ru_02_grammar_a2.sql
-- App: Polish-language app teaching Russian to Polish speakers.
-- Note: target-language content is in Russian (Cyrillic).
--       Explanations are in Polish. Idempotent: re-running replaces A2/ru data.
-- =============================================================================

-- learning_path_stages reference these topics (FK without cascade) — clear the
-- stages slice first; re-run ru_03_learning_path.sql afterwards to restore it.
delete from learning_path_stages where language = 'ru' and level = 'A2';
delete from grammar_topics where language = 'ru' and level = 'A2';

-- -----------------------------------------------------------------------------
-- Topic 0: Przypadki: mianownik i biernik
-- -----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000b1',
  'ru',
  'A2',
  'ru-mianownik-biernik',
  'Przypadki: mianownik i biernik',
  'W rosyjskim, tak jak w polskim, rzeczowniki odmieniają się przez przypadki, a końcówka zmienia się zależnie od roli słowa w zdaniu.
Mianownik (именительный падеж) odpowiada na pytania kto? co? i jest formą podstawową, czyli tą ze słownika.
W zdaniu mianownik pełni rolę podmiotu, czyli osoby lub rzeczy, która wykonuje czynność.
Biernik (винительный падеж) odpowiada na pytania kogo? co? i oznacza dopełnienie bliższe, czyli obiekt czynności.
Najważniejszą zmianę widać przy rzeczownikach rodzaju żeńskiego zakończonych na -а lub -я: w bierniku dostają one końcówkę -у lub -ю, na przykład книга (książka) → книгу, Москва (Moskwa) → Москву.
Rzeczowniki rodzaju męskiego nieżywotne oraz rzeczowniki rodzaju nijakiego mają biernik taki sam jak mianownik, dlatego стол i окно nie zmieniają formy.
Przy rzeczownikach męskich żywotnych (osoby, zwierzęta) biernik wygląda jak dopełniacz, na przykład брат → брата, но to poznasz dokładniej później.
Zwróć uwagę, że czasowniki takie jak читать (czytać), видеть (widzieć), любить (kochać) łączą się właśnie z biernikiem.
Popatrz na przykłady:
Это книга. Я читаю книгу. (To jest książka. Czytam książkę.)
Это Москва. Я люблю Москву. (To jest Moskwa. Kocham Moskwę.)
Он видит собаку. (On widzi psa.)
Na początku ćwicz zamianę końcówki -а/-я na -у/-ю, bo to najczęstszy wzór na tym poziomie.',
  0
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('f0000000-0000-4000-8000-0000000000b1', 'gap_fill', 'Wpisz biernik rzeczownika „книга": „Я читаю ___."', NULL, 'книгу', 0),
('f0000000-0000-4000-8000-0000000000b1', 'multiple_choice', 'Na jakie pytania odpowiada biernik?', '["kto? co?","kogo? co?","kogo? czego?","komu? czemu?"]'::jsonb, 'kogo? co?', 1),
('f0000000-0000-4000-8000-0000000000b1', 'multiple_choice', 'Wybierz poprawną formę: „Я люблю ___."', '["Москва","Москву","Москвы","Москве"]'::jsonb, 'Москву', 2),
('f0000000-0000-4000-8000-0000000000b1', 'multiple_choice', 'Które słowo w bierniku wygląda tak samo jak w mianowniku?', '["книга","мама","окно","Анна"]'::jsonb, 'окно', 3),
('f0000000-0000-4000-8000-0000000000b1', 'gap_fill', 'Uzupełnij biernik: „Он видит ___." (собака — pies/suka)', NULL, 'собаку', 4),
('f0000000-0000-4000-8000-0000000000b1', 'transformation', 'Przekształć zdanie tak, aby rzeczownik był dopełnieniem w bierniku: „Это газета. Я читаю ___." →', NULL, 'Я читаю газету.', 5);

-- -----------------------------------------------------------------------------
-- Topic 1: Czas przeszły
-- -----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000b2',
  'ru',
  'A2',
  'ru-czas-przeszly',
  'Czas przeszły',
  'Czas przeszły w rosyjskim jest zaskakująco prosty, bo nie odmienia się przez osoby, tylko przez rodzaj i liczbę.
Aby utworzyć czas przeszły, najczęściej bierzemy bezokolicznik, odrzucamy końcówkę -ть i dodajemy odpowiednią końcówkę rodzajową.
Dla rodzaju męskiego dodajemy -л, dla żeńskiego -ла, dla nijakiego -ло, a dla liczby mnogiej -ли.
Popatrz na czasownik читать (czytać): он читал, она читала, оно читало, они читали.
Podobnie odmienia się говорить (mówić): он говорил, она говорила, они говорили.
Bardzo ważne: forma zależy od rodzaju osoby lub rzeczy, która wykonuje czynność, a nie od tego, czy mówimy „ja", „ty" czy „on".
Dlatego kobieta powie я читала, a mężczyzna я читал, mimo że oboje mówią o sobie „ja".
Czasownik быть (być) w czasie przeszłym brzmi был, была, было, были i bardzo często się go używa, w odróżnieniu od czasu teraźniejszego.
Popatrz na przykłady:
Вчера я читал книгу. (Wczoraj czytałem książkę.)
Она была дома. (Ona była w domu.)
Мы жили в Москве. (Mieszkaliśmy w Moskwie.)
Pamiętaj o dobraniu końcówki do rodzaju podmiotu, bo to najczęstszy błąd na tym poziomie.',
  1
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('f0000000-0000-4000-8000-0000000000b2', 'gap_fill', 'Czas przeszły, mężczyzna o sobie: „Вчера я ___ книгу." (читать)', NULL, 'читал', 0),
('f0000000-0000-4000-8000-0000000000b2', 'gap_fill', 'Czas przeszły, kobieta o sobie: „Я ___ дома." (być)', NULL, 'была', 1),
('f0000000-0000-4000-8000-0000000000b2', 'multiple_choice', 'Wybierz poprawną formę: „Они ___ в Москве." (жить)', '["жил","жила","жило","жили"]'::jsonb, 'жили', 2),
('f0000000-0000-4000-8000-0000000000b2', 'multiple_choice', 'Jaką końcówkę ma czas przeszły dla rodzaju żeńskiego?', '["-л","-ла","-ло","-ли"]'::jsonb, '-ла', 3),
('f0000000-0000-4000-8000-0000000000b2', 'multiple_choice', 'Jak powiemy „Ona mówiła"?', '["Она говорил","Она говорила","Она говорило","Она говорили"]'::jsonb, 'Она говорила', 4),
('f0000000-0000-4000-8000-0000000000b2', 'transformation', 'Zamień zdanie na czas przeszły (podmiot to kobieta): „Она читает книгу." →', NULL, 'Она читала книгу.', 5);

-- -----------------------------------------------------------------------------
-- Topic 2: Czas przyszły
-- -----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000b3',
  'ru',
  'A2',
  'ru-czas-przyszly',
  'Czas przyszły',
  'W rosyjskim istnieją dwa sposoby tworzenia czasu przyszłego i wybór zależy od aspektu czasownika.
Czas przyszły złożony tworzymy od czasowników niedokonanych za pomocą odmienionego czasownika быть oraz bezokolicznika.
Czasownik быть w czasie przyszłym odmienia się tak: я буду, ты будешь, он будет, мы будем, вы будете, они будут.
Na przykład zdanie „będę czytać" to я буду читать, a „będziemy mówić" to мы будем говорить.
Ta forma opisuje czynność trwającą lub powtarzającą się w przyszłości.
Drugi sposób to czas przyszły prosty, który tworzymy od czasowników dokonanych i wygląda on jak czas teraźniejszy, ale ma znaczenie przyszłe.
Na przykład прочитать (przeczytać) daje я прочитаю (przeczytam), a написать (napisać) daje я напишу (napiszę).
Forma prosta podkreśla, że czynność zostanie zakończona i przyniesie rezultat.
Popatrz na przykłady:
Завтра я буду работать. (Jutro będę pracować.)
Мы будем говорить по-русски. (Będziemy mówić po rosyjsku.)
Я прочитаю эту книгу вечером. (Przeczytam tę książkę wieczorem.)
Na początku najważniejsze jest opanowanie odmiany быть, bo bez niej nie zbudujesz przyszłości niedokonanej.',
  2
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('f0000000-0000-4000-8000-0000000000b3', 'gap_fill', 'Uzupełnij formę „быть" w czasie przyszłym: „Завтра я ___ работать."', NULL, 'буду', 0),
('f0000000-0000-4000-8000-0000000000b3', 'gap_fill', 'Uzupełnij formę „быть" (my): „Мы ___ говорить по-русски."', NULL, 'будем', 1),
('f0000000-0000-4000-8000-0000000000b3', 'multiple_choice', 'Wybierz poprawną formę: „Ты ___ читать?"', '["буду","будешь","будет","будут"]'::jsonb, 'будешь', 2),
('f0000000-0000-4000-8000-0000000000b3', 'multiple_choice', 'Który czasownik jest w czasie przyszłym prostym (dokonany)?', '["буду читать","читаю","прочитаю","читал"]'::jsonb, 'прочитаю', 3),
('f0000000-0000-4000-8000-0000000000b3', 'multiple_choice', 'Jak powiemy „Oni będą pracować"?', '["Они буду работать","Они будешь работать","Они будут работать","Они будете работать"]'::jsonb, 'Они будут работать', 4),
('f0000000-0000-4000-8000-0000000000b3', 'transformation', 'Zamień zdanie na czas przyszły złożony: „Я читаю книгу." →', NULL, 'Я буду читать книгу.', 5);

-- -----------------------------------------------------------------------------
-- Topic 3: Przyimki miejsca
-- -----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000b4',
  'ru',
  'A2',
  'ru-przyimki-miejsca',
  'Przyimki miejsca',
  'Przyimki miejsca pomagają powiedzieć, gdzie coś się znajduje, i łączą się z konkretnymi przypadkami.
Najważniejsze przyimki to в (w), на (na), под (pod), над (nad), у (przy, obok) i около (koło).
Kiedy mówimy o położeniu i odpowiadamy na pytanie где? (gdzie?), przyimki в i на łączą się z miejscownikiem (предложный падеж).
Rzeczowniki rodzaju męskiego i żeńskiego dostają wtedy zwykle końcówkę -е, na przykład Москва → в Москве, стол → на столе, школа → в школе.
Przyimka в używamy dla miejsc zamkniętych lub obszarów (в доме, в городе), a на dla powierzchni oraz niektórych miejsc otwartych i wydarzeń (на столе, на работе).
Przyimki под i над przy określaniu położenia łączą się z narzędnikiem (творительный падеж), na przykład под столом (pod stołem), над домом (nad domem).
Przyimek у łączy się z dopełniaczem i oznacza „przy" lub „u kogoś", na przykład у окна (przy oknie).
Zwróć uwagę, że ten sam polski przyimek „na" nie zawsze odpowiada rosyjskiemu на, dlatego warto uczyć się połączeń w całości.
Popatrz na przykłady:
Книга на столе. (Książka jest na stole.)
Я живу в Москве. (Mieszkam w Moskwie.)
Кот под столом. (Kot jest pod stołem.)
Ćwicz całe wyrażenia z przyimkiem, a nie same rzeczowniki, bo końcówka zależy od przyimka.',
  3
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('f0000000-0000-4000-8000-0000000000b4', 'gap_fill', 'Uzupełnij przyimek miejsca: „Книга ___ столе." (na)', NULL, 'на', 0),
('f0000000-0000-4000-8000-0000000000b4', 'gap_fill', 'Uzupełnij miejscownik: „Я живу в ___." (Москва)', NULL, 'Москве', 1),
('f0000000-0000-4000-8000-0000000000b4', 'multiple_choice', 'Wybierz poprawną formę: „Кот ___ столом." (pod)', '["на","под","в","у"]'::jsonb, 'под', 2),
('f0000000-0000-4000-8000-0000000000b4', 'multiple_choice', 'Który przyimek oznacza „w" (wewnątrz)?', '["на","под","в","над"]'::jsonb, 'в', 3),
('f0000000-0000-4000-8000-0000000000b4', 'multiple_choice', 'Wybierz poprawną formę miejscownika: „Дети в ___." (школа)', '["школа","школу","школе","школы"]'::jsonb, 'школе', 4),
('f0000000-0000-4000-8000-0000000000b4', 'transformation', 'Uzupełnij zdanie właściwym przyimkiem i formą (miejscownik): „Мама (на) ___." (работа) →', NULL, 'Мама на работе.', 5);

-- -----------------------------------------------------------------------------
-- Topic 4: Dopełniacz
-- -----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000b5',
  'ru',
  'A2',
  'ru-dopelniacz',
  'Dopełniacz',
  'Dopełniacz (родительный падеж) to bardzo ważny przypadek, który odpowiada na pytania kogo? czego?.
Najczęściej używamy go, aby wyrazić przynależność, czyli powiedzieć, że coś do kogoś należy, na przykład книга брата (książka brata).
Dopełniacz pojawia się też przy przeczeniu z нет, gdy mówimy, że czegoś nie ma, na przykład у меня нет времени (nie mam czasu).
Trzecie ważne użycie to ilość i miara, na przykład чашка чая (filiżanka herbaty), стакан воды (szklanka wody).
Dopełniacza wymagają również liczne przyimki: у (u, przy), из (z), от (od), до (do), без (bez), около (koło).
Jak tworzymy dopełniacz? Rzeczowniki rodzaju męskiego i nijakiego dostają zwykle końcówkę -а lub -я, na przykład брат → брата, окно → окна.
Rzeczowniki rodzaju żeńskiego zakończone na -а/-я zmieniają ją na -ы lub -и, na przykład Москва → Москвы, Польша → Польши.
Konstrukcja „mam" po rosyjsku brzmi у меня есть, a jej przeczenie to właśnie у меня нет + dopełniacz.
Popatrz na przykłady:
У меня нет времени. (Nie mam czasu.)
Это книга брата. (To jest książka brata.)
Я из Польши. (Jestem z Polski.)
Zapamiętaj typowe końcówki i najważniejsze przyimki, a szybko rozpoznasz, kiedy potrzebny jest dopełniacz.',
  4
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
('f0000000-0000-4000-8000-0000000000b5', 'gap_fill', 'Uzupełnij dopełniacz: „Это книга ___." (брат)', NULL, 'брата', 0),
('f0000000-0000-4000-8000-0000000000b5', 'gap_fill', 'Uzupełnij dopełniacz po przyimku „из": „Я из ___." (Польша)', NULL, 'Польши', 1),
('f0000000-0000-4000-8000-0000000000b5', 'multiple_choice', 'Na jakie pytania odpowiada dopełniacz?', '["kto? co?","kogo? co?","kogo? czego?","kim? czym?"]'::jsonb, 'kogo? czego?', 2),
('f0000000-0000-4000-8000-0000000000b5', 'multiple_choice', 'Wybierz poprawną formę: „У меня нет ___." (время)', '["время","времени","временю","времена"]'::jsonb, 'времени', 3),
('f0000000-0000-4000-8000-0000000000b5', 'multiple_choice', 'Który przyimek łączy się z dopełniaczem?', '["в","на","без","под"]'::jsonb, 'без', 4),
('f0000000-0000-4000-8000-0000000000b5', 'transformation', 'Zamień zdanie na przeczenie z dopełniaczem: „У меня есть книга." →', NULL, 'У меня нет книги.', 5);
