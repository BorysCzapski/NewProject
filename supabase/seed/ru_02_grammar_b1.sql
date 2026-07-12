-- ============================================================================
-- Seed: Russian grammar for Polish speakers (B1)
-- File: supabase/seed/ru_02_grammar_b1.sql
-- Target: grammar_topics + grammar_exercises, language = 'ru', level = 'B1'
-- 5 topics, each with 6 exercises (mix of gap_fill / multiple_choice / transformation)
-- Idempotent: the delete below cascades to grammar_exercises before re-seeding.
-- ============================================================================

delete from grammar_topics where language = 'ru' and level = 'B1';

-- ----------------------------------------------------------------------------
-- Topic 0: Aspekt czasownika (dokonany/niedokonany)
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000c1',
  'ru',
  'B1',
  'ru-aspekt',
  'Aspekt czasownika (dokonany/niedokonany)',
  'Aspekt to jedna z najważniejszych cech rosyjskiego czasownika. Prawie każdy czasownik tworzy parę: forma niedokonana i forma dokonana, np. читать/прочитать, писать/написать, делать/сделать.
Aspekt niedokonany opisuje czynność jako proces, powtarzanie albo czynność trwającą w czasie. Aspekt dokonany podkreśla rezultat, jednorazowość lub zakończenie czynności.
Porównaj: Я читал книгу весь вечер (czytałem, proces) i Я прочитал книгу за два дня (przeczytałem, wynik).
W czasie przeszłym oba aspekty mają zwykłe końcówki, ale różnią się znaczeniem. W czasie przyszłym forma niedokonana używa czasownika быть: Я буду читать, a forma dokonana ma proste odmiany: Я прочитаю.
Czynności powtarzające się i nawykowe wymagają aspektu niedokonanego, np. Каждый день я пишу письма.
Kiedy mówimy o konkretnym, zakończonym wyniku, wybieramy aspekt dokonany: Она уже написала письмо.
Słowa takie jak обычно, всегда, часто zwykle łączą się z aspektem niedokonanym, a słowa вдруг, уже, наконец często sygnalizują aspekt dokonany.
Wybór aspektu zmienia sens zdania, dlatego zawsze warto zapytać: czy chodzi o proces, czy o rezultat?',
  0
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('f0000000-0000-4000-8000-0000000000c1', 'gap_fill', 'Wstaw właściwą formę (proces trwający cały dzień): Вчера я весь день ___ письмо.', NULL, 'писал', 0),
  ('f0000000-0000-4000-8000-0000000000c1', 'multiple_choice', 'Wybierz formę wskazującą zakończony rezultat: Она уже ___ этот роман.', '["читала","прочитала","читает"]'::jsonb, 'прочитала', 1),
  ('f0000000-0000-4000-8000-0000000000c1', 'gap_fill', 'Wstaw czasownik w aspekcie niedokonanym (czynność nawykowa): Обычно я ___ кофе по утрам.', NULL, 'пью', 2),
  ('f0000000-0000-4000-8000-0000000000c1', 'multiple_choice', 'Wybierz formę czasu przyszłego dokonanego: Завтра я ___ эту работу.', '["делаю","буду делать","сделаю"]'::jsonb, 'сделаю', 3),
  ('f0000000-0000-4000-8000-0000000000c1', 'multiple_choice', 'Wybierz formę pasującą do czynności powtarzającej się: Каждый день он ___ по-русски.', '["говорит","скажет","сказал"]'::jsonb, 'говорит', 4),
  ('f0000000-0000-4000-8000-0000000000c1', 'transformation', 'Przekształć zdanie z aspektu niedokonanego na dokonany: Я читал статью.', NULL, 'Я прочитал статью.', 5);

-- ----------------------------------------------------------------------------
-- Topic 1: Celownik
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000c2',
  'ru',
  'B1',
  'ru-celownik',
  'Celownik',
  'Celownik (по-русски дательный падеж) odpowiada na pytania кому? чему? Najczęściej wskazuje odbiorcę czynności, czyli osobę, której coś dajemy, mówimy albo pomagamy.
Typowe końcówki to -у/-ю dla rodzaju męskiego i nijakiego oraz -е/-и dla rodzaju żeńskiego, np. брат — брату, мама — маме, дверь — двери.
Celownik występuje po czasownikach takich jak дать, помогать, звонить, говорить, показывать. Na przykład: Я звоню другу (dzwonię do przyjaciela) albo Он помогает сестре (pomaga siostrze).
Celownika używamy też w konstrukcjach bezosobowych z wyrazami нравится, нужно, можно, холодно: Мне нравится эта песня.
W ten sposób wyrażamy również wiek: Моему брату двадцать лет.
Ważnym przyimkiem łączącym się z celownikiem jest к (do, w stronę): Мы идём к врачу. Drugi częsty przyimek to по, na przykład гулять по городу.
Zaimki osobowe mają specjalne formy: я — мне, ты — тебе, он — ему, она — ей, мы — нам.
Zapamiętaj, że w zdaniach typu Мне холодно osoba stoi w celowniku, a nie w mianowniku.
Celownik pomaga więc pokazać, komu coś się dzieje lub dla kogo coś robimy.',
  1
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('f0000000-0000-4000-8000-0000000000c2', 'gap_fill', 'Wstaw rzeczownik мама w celowniku: Я подарил цветы ___.', NULL, 'маме', 0),
  ('f0000000-0000-4000-8000-0000000000c2', 'multiple_choice', 'Wybierz właściwą formę: ___ нравится этот фильм.', '["Я","Мне","Меня"]'::jsonb, 'Мне', 1),
  ('f0000000-0000-4000-8000-0000000000c2', 'gap_fill', 'Wstaw rzeczownik брат w celowniku po przyimku к: Мы идём в гости к ___.', NULL, 'брату', 2),
  ('f0000000-0000-4000-8000-0000000000c2', 'multiple_choice', 'Wybierz właściwą formę zaimka dzierżawczego: Сколько лет ___ сыну?', '["твой","твоему","твоего"]'::jsonb, 'твоему', 3),
  ('f0000000-0000-4000-8000-0000000000c2', 'gap_fill', 'Wstaw rzeczownik друг w celowniku: Он часто звонит ___.', NULL, 'другу', 4),
  ('f0000000-0000-4000-8000-0000000000c2', 'transformation', 'Ułóż zdanie w czasie teraźniejszym z czasownikiem помогать i rzeczownikiem сестра (w celowniku), podmiot я.', NULL, 'Я помогаю сестре.', 5);

-- ----------------------------------------------------------------------------
-- Topic 2: Narzędnik
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000c3',
  'ru',
  'B1',
  'ru-narzednik',
  'Narzędnik',
  'Narzędnik (творительный падеж) odpowiada na pytania кем? чем? Podstawowe znaczenie to narzędzie lub środek, którym wykonujemy czynność: Я пишу ручкой (piszę długopisem), Он режет хлеб ножом.
Końcówki to zwykle -ом/-ем dla rodzaju męskiego i nijakiego oraz -ой/-ей dla rodzaju żeńskiego, a w liczbie mnogiej -ами/-ями.
Bardzo ważne jest użycie narzędnika z przyimkiem с w znaczeniu razem z: Я иду в кино с другом. Uwaga: samo narzędzie NIE wymaga przyimka, ale towarzystwo już tak.
Narzędnika używamy też po czasownikach быть, стать, работать, заниматься, интересоваться: Он работает врачом, Она хочет стать учителем.
Dzięki temu wyrażamy zawód lub rolę: Мой брат стал инженером.
Narzędnik pojawia się także po przyimkach miejsca над, под, перед, за, между: Кот сидит под столом.
W konstrukcjach typu заниматься спортом i интересоваться музыкой rzeczownik zawsze stoi w narzędniku.
Zaimki mają formy мной, тобой, им, ей, нами, вами, ими.
Pamiętaj więc: narzędnik to nie tylko narzędzie, ale też zawód, towarzystwo i pozycja w przestrzeni.',
  2
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('f0000000-0000-4000-8000-0000000000c3', 'gap_fill', 'Wstaw rzeczownik нож w narzędniku (narzędzie): Я режу хлеб ___.', NULL, 'ножом', 0),
  ('f0000000-0000-4000-8000-0000000000c3', 'multiple_choice', 'Wybierz formę zawodu po czasowniku стать: Она хочет стать ___.', '["учитель","учителем","учителя"]'::jsonb, 'учителем', 1),
  ('f0000000-0000-4000-8000-0000000000c3', 'gap_fill', 'Wstaw rzeczownik молоко w narzędniku po przyimku с: Я люблю чай с ___.', NULL, 'молоком', 2),
  ('f0000000-0000-4000-8000-0000000000c3', 'multiple_choice', 'Wybierz formę po przyimku под: Кот сидит под ___.', '["стол","столом","стола"]'::jsonb, 'столом', 3),
  ('f0000000-0000-4000-8000-0000000000c3', 'gap_fill', 'Wstaw rzeczownik спорт w narzędniku po czasowniku заниматься: Мой отец занимается ___.', NULL, 'спортом', 4),
  ('f0000000-0000-4000-8000-0000000000c3', 'transformation', 'Przekształć zdanie Он врач. tak, aby opisać jego zawód czasownikiem работать (narzędnik).', NULL, 'Он работает врачом.', 5);

-- ----------------------------------------------------------------------------
-- Topic 3: Miejscownik
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000c4',
  'ru',
  'B1',
  'ru-miejscownik',
  'Miejscownik',
  'Miejscownik (предложный падеж) to jedyny przypadek, który zawsze występuje z przyimkiem, dlatego po rosyjsku nazywa się предложный.
Najczęstsze przyimki to в i на dla miejsca oraz о (об) dla tematu rozmowy. Odpowiada na pytania где? о ком? о чём?
Typowa końcówka to -е, np. Москва — в Москве, стол — на столе, работа — о работе.
Kiedy mówimy, gdzie ktoś jest lub coś się znajduje, używamy в albo на: Я живу в Москве, Книга лежит на столе.
Przyimka о (об przed samogłoską) używamy, gdy mówimy o czymś lub o kimś: Мы говорим о фильме, Он думает об экзамене.
Niektóre rzeczowniki męskie mają w miejscowniku akcentowaną końcówkę -у: в лесу, в саду, на берегу.
Rzeczowniki na -ия oraz -ие kończą się na -и: в России, в здании.
Wybór między в i на zależy od słowa i od tradycji: mówimy в школе, ale на работе, в театре, ale на концерте.
Zaimki osobowe też się odmieniają: обо мне, о тебе, о нём, о ней, о нас.
Miejscownik jest więc niezbędny, gdy chcemy powiedzieć, gdzie jesteśmy albo o czym rozmawiamy.',
  3
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('f0000000-0000-4000-8000-0000000000c4', 'gap_fill', 'Wstaw nazwę Москва w miejscowniku: Я живу в ___.', NULL, 'Москве', 0),
  ('f0000000-0000-4000-8000-0000000000c4', 'multiple_choice', 'Wybierz formę po przyimku на: Книга лежит на ___.', '["стол","столе","столом"]'::jsonb, 'столе', 1),
  ('f0000000-0000-4000-8000-0000000000c4', 'gap_fill', 'Wstaw rzeczownik работа w miejscowniku po przyimku о: Мы говорили о ___.', NULL, 'работе', 2),
  ('f0000000-0000-4000-8000-0000000000c4', 'multiple_choice', 'Wybierz formę po przyimku в (miejsce): Дети играют в ___.', '["парк","парке","парком"]'::jsonb, 'парке', 3),
  ('f0000000-0000-4000-8000-0000000000c4', 'gap_fill', 'Wstaw rzeczownik море w miejscowniku po przyimku на: Летом мы отдыхали на ___.', NULL, 'море', 4),
  ('f0000000-0000-4000-8000-0000000000c4', 'transformation', 'Odpowiedz na pytanie Где ты был? pełnym zdaniem, używając rzeczownika музей w miejscowniku (podmiot я).', NULL, 'Я был в музее.', 5);

-- ----------------------------------------------------------------------------
-- Topic 4: Czasowniki ruchu
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000c5',
  'ru',
  'B1',
  'ru-czasowniki-ruchu',
  'Czasowniki ruchu',
  'Rosyjskie czasowniki ruchu tworzą pary, które różnią się kierunkiem i sposobem poruszania się. Najważniejsze pary to идти/ходить (iść pieszo) oraz ехать/ездить (jechać pojazdem).
Forma jednokierunkowa (идти, ехать) opisuje ruch w jednym kierunku, tu i teraz: Сейчас я иду домой.
Forma wielokierunkowa (ходить, ездить) opisuje ruch powtarzający się, nawykowy albo w obie strony: Каждый день я хожу в школу.
Porównaj: Я еду в Москву (jadę właśnie teraz) i Я часто езжу в Москву (jeżdżę regularnie).
W czasie przeszłym forma wielokierunkowa często oznacza jednorazową podróż tam i z powrotem: Вчера мы ходили в театр.
Bardzo ważną rolę odgrywają przedrostki, które nadają czasownikom nowe znaczenia.
Przedrostek по- tworzy początek ruchu i czas przyszły dokonany: Завтра я пойду в кино, Летом я поеду на море.
Przedrostek при- oznacza przybycie: Он приехал вчера, a przedrostek у- oznacza oddalenie się: Она ушла домой.
Pamiętaj, że wybór między идти a ходить zależy od tego, czy ruch jest jednorazowy i skierowany, czy powtarzalny.
Dobre pytania pomocnicze to: czy to teraz i w jedną stronę, czy regularnie i w obie strony?',
  4
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('f0000000-0000-4000-8000-0000000000c5', 'multiple_choice', 'Wybierz formę dla ruchu tu i teraz, w jedną stronę: Сейчас я ___ в магазин.', '["хожу","иду","ходил"]'::jsonb, 'иду', 0),
  ('f0000000-0000-4000-8000-0000000000c5', 'gap_fill', 'Wstaw czasownik ходить w formie dla czynności nawykowej: Каждое утро он ___ на работу пешком.', NULL, 'ходит', 1),
  ('f0000000-0000-4000-8000-0000000000c5', 'multiple_choice', 'Wybierz formę dla jednorazowej podróży tam i z powrotem: Вчера мы ___ в театр.', '["ходили","идём","идти"]'::jsonb, 'ходили', 2),
  ('f0000000-0000-4000-8000-0000000000c5', 'gap_fill', 'Wstaw czasownik ехать z przedrostkiem по- w czasie przyszłym: Завтра я ___ в Санкт-Петербург на поезде.', NULL, 'поеду', 3),
  ('f0000000-0000-4000-8000-0000000000c5', 'multiple_choice', 'Wybierz formę dla czynności regularnej (pojazdem): Ты часто ___ на машине?', '["едешь","ездишь","ехал"]'::jsonb, 'ездишь', 4),
  ('f0000000-0000-4000-8000-0000000000c5', 'transformation', 'Przekształć zdanie Я иду в кино. na czas przyszły dokonany z przedrostkiem по-.', NULL, 'Я пойду в кино.', 5);
