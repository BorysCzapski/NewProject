-- ============================================================================
-- Seed: Russian grammar for Polish speakers (B1)
-- File: supabase/seed/ru_02_grammar_b1.sql
-- Target: grammar_topics + grammar_exercises, language = 'ru', level = 'B1'
-- 5 topics, each with 6 exercises (mix of gap_fill / multiple_choice / transformation)
-- Idempotent: the delete below cascades to grammar_exercises before re-seeding.
-- ============================================================================

-- learning_path_stages reference these topics (FK without cascade) — clear the
-- stages slice first; re-run ru_03_learning_path.sql afterwards to restore it.
delete from learning_path_stages where language = 'ru' and level = 'B1';
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

-- ----------------------------------------------------------------------------
-- Topic 5: Tryb warunkowy (бы)
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000c6',
  'ru',
  'B1',
  'ru-tryb-warunkowy',
  'Tryb warunkowy (бы)',
  'Tryb warunkowy tworzy się w rosyjskim bardzo prosto: bierzemy czasownik w czasie przeszłym i dodajemy niezmienną cząstkę бы. W odróżnieniu od polskiego rosyjski nie rozróżnia formalnie zdań realnych i nierealnych ani czasu warunku — jedna forma z бы obsługuje teraźniejszość, przyszłość i przeszłość, a to, o który moment chodzi, wynika z kontekstu.
Podstawowa formuła: если бы + forma przeszła, ... forma przeszła + бы. Na przykład: Если бы я знал ответ, я сказал бы тебе (Gdybym znał odpowiedź, powiedziałbym ci).
Cząstka бы zwykle stoi zaraz po czasowniku (сказал бы, пришла бы) albo po spójniku если (если бы), nigdy jednak samodzielnie na początku zdania.
Zdania odnoszące się do przeszłości wyglądają identycznie jak te dotyczące teraźniejszości: Если бы вчера не было дождя, мы пошли бы гулять (Gdyby wczoraj nie padał deszcz, poszlibyśmy na spacer) — nie ma osobnej formy odpowiadającej polskiemu trybowi zaprzeszłemu.
Bardzo częsty błąd Polaków to próba odmiany бы przez osoby albo łączenie go z czasem teraźniejszym lub przyszłym — tak się nie da: бы łączy się WYŁĄCZNIE z formą przeszłą czasownika i ma zawsze tę samą, niezmienną postać.
Druga pułapka to szyk: po polsku mówimy ja bym chciał, z by zaraz po zaimku, a standardowy rosyjski szyk to czasownik + бы, czyli я хотел бы, a nie я бы хотел (ta druga wersja bywa potoczna, ale mniej naturalna).
Warto odróżnić zdanie z если bez бы, które opisuje warunek realny i spełnialny: Если у меня будет время, я приду (Jeśli będę miał czas, przyjdę) — brak бы, bo warunek dotyczy realnej przyszłości, a nie sytuacji hipotetycznej.
Tryb warunkowy służy też do grzecznych próśb i życzeń: Я хотел бы кофе, пожалуйста (Chciałbym kawę, poproszę) oraz Хорошо бы отдохнуть! (Dobrze byłoby odpocząć!).',
  5
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('f0000000-0000-4000-8000-0000000000c6', 'gap_fill', 'Wstaw czasownik знать w formie trybu warunkowego (rodzaj męski): Если бы я ___, я сказал бы тебе.', NULL, 'знал', 0),
  ('f0000000-0000-4000-8000-0000000000c6', 'multiple_choice', 'Wybierz poprawną kolejność (Gdybym miał czas, przyjechałbym): Если бы у меня было время, я ___.', '["приеду","приехал бы","бы приехал"]'::jsonb, 'приехал бы', 1),
  ('f0000000-0000-4000-8000-0000000000c6', 'gap_fill', 'Uzupełnij cząstkę trybu warunkowego: Она сделала ___ это с удовольствием.', NULL, 'бы', 2),
  ('f0000000-0000-4000-8000-0000000000c6', 'multiple_choice', 'Wybierz zdanie z warunkiem REALNYM (bez бы):', '["Если у меня будет время, я приду.","Если бы у меня было время, я пришёл бы.","Я пришёл бы, если было время."]'::jsonb, 'Если у меня будет время, я приду.', 3),
  ('f0000000-0000-4000-8000-0000000000c6', 'multiple_choice', 'Wybierz grzeczną prośbę z trybem warunkowym: ___ кофе, пожалуйста.', '["Я хочу","Я хотел бы","Я буду хотеть"]'::jsonb, 'Я хотел бы', 4),
  ('f0000000-0000-4000-8000-0000000000c6', 'transformation', 'Przekształć zdanie realne na nierealne (warunek niespełniony): Если будет дождь, мы останемся дома.', NULL, 'Если бы был дождь, мы остались бы дома.', 5);

-- ----------------------------------------------------------------------------
-- Topic 6: Stopniowanie przymiotników i przysłówków
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000c7',
  'ru',
  'B1',
  'ru-stopniowanie-przymiotnikow',
  'Stopniowanie przymiotników i przysłówków',
  'Stopniowanie przymiotników i przysłówków w rosyjskim ma dwie ścieżki: prostą (syntetyczną, jedno słowo) i złożoną (analityczną, dwa słowa) — podobnie jak w polskim mamy ładny → ładniejszy oraz interesujący → bardziej interesujący.
Stopień wyższy prosty tworzymy najczęściej przyrostkiem -ее: красивый → красивее (ładniejszy), интересный → интереснее (ciekawszy). Ta forma jest nieodmienna i pasuje do każdego rodzaju i liczby.
Niektóre częste przymiotniki mają nieregularny, krótszy stopień wyższy na -е z wymianą spółgłoski: хороший → лучше (lepszy), плохой → хуже (gorszy), большой → больше (większy), маленький → меньше (mniejszy), молодой → моложе (młodszy), дорогой → дороже (droższy).
Stopień wyższy złożony tworzymy słowem более (bardziej) lub менее (mniej) + przymiotnik w formie podstawowej, odmienny przez rodzaje: более интересный фильм, более интересная книга. Tej formy używamy zwłaszcza wtedy, gdy przymiotnik stoi PRZED rzeczownikiem.
Porównanie z drugim elementem wyraża się na dwa sposoby: dopełniaczem bez spójnika (Она старше меня) albo spójnikiem чем + mianownik (Она старше, чем я) — obie wersje znaczą to samo, ale dopełniacz jest krótszy i bardziej naturalny w mowie.
Stopień najwyższy tworzymy najczęściej słowem самый + przymiotnik w formie podstawowej, odmienny: самый красивый, самая красивая, самое красивое. Możliwa jest też forma z наиболее, bardziej książkowa: наиболее важный вопрос.
Przysłówki stopniujemy tak samo jak krótki stopień wyższy przymiotnika, ale forma jest zawsze nieodmienna i pełni funkcję przysłówka w zdaniu: быстро → быстрее (szybciej), хорошо → лучше (lepiej): Он бежит быстрее, чем я.
Typowa pułapka Polaków: mylenie krótkiego stopnia wyższego przymiotnika z przysłówkiem — formy takie jak быстрее czy лучше wyglądają identycznie w obu funkcjach, więc rolę rozstrzyga kontekst (czy opisujemy rzeczownik, czy czynność). Druga pułapka: podwajanie stopnia, np. более лучше — to błąd, bo лучше jest już formą stopnia wyższego i nie łączy się z более.
Zwróć uwagę, że rosyjskie самый różni się od polskiego najbardziej: łączy się bezpośrednio z przymiotnikiem w formie podstawowej, a nie z jego stopniem wyższym — самый быстрый (najszybszy).',
  6
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('f0000000-0000-4000-8000-0000000000c7', 'gap_fill', 'Utwórz stopień wyższy przymiotnika красивый: Эта картина ___, чем та.', NULL, 'красивее', 0),
  ('f0000000-0000-4000-8000-0000000000c7', 'multiple_choice', 'Wybierz poprawny nieregularny stopień wyższy: Этот фильм ___, чем предыдущий.', '["хороший","лучше","более хороший"]'::jsonb, 'лучше', 1),
  ('f0000000-0000-4000-8000-0000000000c7', 'gap_fill', 'Wstaw słowo tworzące stopień najwyższy (rodzaj żeński): Эверест — ___ высокая гора в мире.', NULL, 'самая', 2),
  ('f0000000-0000-4000-8000-0000000000c7', 'multiple_choice', 'Wybierz poprawną formę porównania (dopełniacz): Она старше ___.', '["я","меня","мне"]'::jsonb, 'меня', 3),
  ('f0000000-0000-4000-8000-0000000000c7', 'multiple_choice', 'Wybierz poprawny stopień wyższy przysłówka: Он бежит ___, чем я.', '["быстрый","быстрее","самый быстрый"]'::jsonb, 'быстрее', 4),
  ('f0000000-0000-4000-8000-0000000000c7', 'transformation', 'Przekształć zdanie, tworząc stopień wyższy złożony (более): Это интересный фильм.', NULL, 'Это более интересный фильм.', 5);
