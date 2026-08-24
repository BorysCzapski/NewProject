-- ============================================================================
-- Seed: Russian grammar for Polish speakers (B2)
-- File: supabase/seed/ru_02_grammar_b2.sql
-- Target: grammar_topics + grammar_exercises, language = 'ru', level = 'B2'
-- 5 topics, each with 5-6 exercises (mix of gap_fill / multiple_choice / transformation)
-- Idempotent: the delete below cascades to grammar_exercises before re-seeding.
-- ============================================================================

-- learning_path_stages reference these topics (FK without cascade) — clear the
-- stages slice first; re-run ru_03_learning_path.sql afterwards to restore it.
delete from learning_path_stages where language = 'ru' and level = 'B2';
delete from grammar_topics where language = 'ru' and level = 'B2';

-- ----------------------------------------------------------------------------
-- Topic 0: Imiesłowy
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000d1',
  'ru',
  'B2',
  'ru-imieslowy',
  'Imiesłowy',
  'Rosyjskie imiesłowy dzielą się na dwie duże grupy: przymiotnikowe (причастия) i przysłówkowe (деепричастия). Imiesłowy przymiotnikowe odmieniają się jak przymiotniki i opisują rzeczownik, odpowiadając na pytanie какой?
Wyróżniamy imiesłowy czynne (действительные) i bierne (страдательные), a każdy z nich może być w czasie teraźniejszym lub przeszłym. Imiesłów czynny teraźniejszy tworzymy od tematu czasu teraźniejszego z przyrostkiem -ущ-/-ющ- albo -ащ-/-ящ-, np. читать daje читающий, a говорить daje говорящий.
Porównaj: Студент, читающий книгу, сидит у окна (student, który czyta książkę, siedzi przy oknie).
Imiesłów bierny przeszły tworzymy najczęściej od czasowników dokonanych z przyrostkiem -нн-/-енн-/-т-, np. написать daje написанный, а решить daje решённый.
Na przykład: Книга, написанная известным автором, лежит на столе.
Imiesłowy przysłówkowe (деепричастия) są nieodmienne i opisują dodatkową czynność wykonywaną przez ten sam podmiot. Deepriczastie niedokonane kończy się na -я/-а (читая, делая), a dokonane na -в/-вши (прочитав, сделав).
Na przykład: Прочитав письмо, она заплакала (przeczytawszy list, zapłakała).
Deepriczastie niedokonane opisuje czynność równoczesną: Он шёл по улице, напевая песню.
W języku mówionym Rosjanie często zamieniają imiesłów przymiotnikowy na zdanie z который, ale w stylu pisanym i oficjalnym imiesłowy są bardzo częste.
Zwróć uwagę, że imiesłów przymiotnikowy zgadza się z rzeczownikiem w rodzaju, liczbie i przypadku, dokładnie tak jak zwykły przymiotnik.',
  0
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('f0000000-0000-4000-8000-0000000000d1', 'gap_fill', 'Wstaw imiesłów czynny teraźniejszy od czytać (rodzaj żeński): Девушка, ___ книгу, сидит у окна.', NULL, 'читающая', 0),
  ('f0000000-0000-4000-8000-0000000000d1', 'multiple_choice', 'Wybierz imiesłów bierny przeszły: Письмо, ___ вчера, уже отправлено.', '["написанное","написавшее","пишущее"]'::jsonb, 'написанное', 1),
  ('f0000000-0000-4000-8000-0000000000d1', 'gap_fill', 'Wstaw imiesłów przysłówkowy dokonany od прочитать: ___ письмо, она заплакала.', NULL, 'Прочитав', 2),
  ('f0000000-0000-4000-8000-0000000000d1', 'multiple_choice', 'Wybierz imiesłów przysłówkowy niedokonany (czynność równoczesna): Он шёл по улице, ___ песню.', '["напевая","напевав","напевающий"]'::jsonb, 'напевая', 3),
  ('f0000000-0000-4000-8000-0000000000d1', 'multiple_choice', 'Wybierz imiesłów czynny przeszły: Человек, ___ этот дом, был архитектором.', '["построивший","построенный","строящий"]'::jsonb, 'построивший', 4),
  ('f0000000-0000-4000-8000-0000000000d1', 'transformation', 'Zamień zdanie ze słowem который na konstrukcję z imiesłowem przymiotnikowym: Студент, который читает книгу, — мой брат.', NULL, 'Студент, читающий книгу, — мой брат.', 5);

-- ----------------------------------------------------------------------------
-- Topic 1: Tryb rozkazujący
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000d2',
  'ru',
  'B2',
  'ru-tryb-rozkazujacy',
  'Tryb rozkazujący',
  'Tryb rozkazujący (повелительное наклонение) służy do wydawania poleceń, próśb, rad i zachęt. Formę liczby pojedynczej tworzymy zwykle od tematu czasu teraźniejszego lub przyszłego, dodając -и, -й albo miękki znak -ь.
Jeśli temat kończy się na samogłoskę, dodajemy -й, np. читать daje читай, работать daje работай. Jeśli akcent pada na końcówkę osobową, dodajemy -и, np. говорить daje говори, смотреть daje смотри.
Formę liczby mnogiej albo grzecznościową tworzymy, dodając -те: читайте, говорите, откройте.
Na przykład: Открой окно, пожалуйста! oraz Покажите ваши документы!
Bardzo ważny jest wybór aspektu. W prośbach twierdzących o jednorazową czynność używamy zwykle aspektu dokonanego (Закрой дверь!), a w zakazach prawie zawsze aspektu niedokonanego.
Na przykład: Не опаздывайте на урок! (nie spóźniajcie się na lekcję).
Aby zachęcić do wspólnego działania, używamy konstrukcji z давай/давайте: Давайте пойдём в кино!
Aby wyrazić polecenie skierowane do osoby trzeciej, używamy słowa пусть lub пускай: Пусть он позвонит мне завтра.
Warto pamiętać, że rosyjski tryb rozkazujący brzmi bardziej bezpośrednio niż polski, dlatego często dodajemy пожалуйста albo formy grzecznościowe.
Kilka czasowników ma formy nieregularne, np. есть daje ешь, дать daje дай, а пить daje пей.',
  1
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('f0000000-0000-4000-8000-0000000000d2', 'gap_fill', 'Utwórz tryb rozkazujący (2 os. lp.) od открыть: ___ окно, пожалуйста!', NULL, 'Открой', 0),
  ('f0000000-0000-4000-8000-0000000000d2', 'multiple_choice', 'Wybierz grzecznościową formę liczby mnogiej: ___, пожалуйста, свои документы.', '["Покажи","Покажите","Показывающий"]'::jsonb, 'Покажите', 1),
  ('f0000000-0000-4000-8000-0000000000d2', 'gap_fill', 'Wstaw czasownik опаздывать w trybie rozkazującym (zakaz, lp.): Не ___ на работу!', NULL, 'опаздывай', 2),
  ('f0000000-0000-4000-8000-0000000000d2', 'multiple_choice', 'Wybierz słowo zachęcające do wspólnego działania: ___ пойдём в парк вместе!', '["Давай","Пусть","Будем"]'::jsonb, 'Давай', 3),
  ('f0000000-0000-4000-8000-0000000000d2', 'multiple_choice', 'Wybierz słowo tworzące polecenie do osoby trzeciej: ___ он сам решит эту задачу.', '["Пусть","Давай","Будь"]'::jsonb, 'Пусть', 4),
  ('f0000000-0000-4000-8000-0000000000d2', 'transformation', 'Zamień zdanie na prośbę w trybie rozkazującym (2 os. lp.): Ты должен закрыть дверь.', NULL, 'Закрой дверь.', 5);

-- ----------------------------------------------------------------------------
-- Topic 2: Liczebniki i przypadki
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000d3',
  'ru',
  'B2',
  'ru-liczebniki',
  'Liczebniki i przypadki',
  'Rosyjskie liczebniki rządzą przypadkiem rzeczownika, który po nich stoi, i jest to jeden z trudniejszych tematów gramatyki. Liczebnik один (одна, одно) zachowuje się jak przymiotnik i zgadza się z rzeczownikiem: один стол, одна книга, одно окно.
Po liczebnikach два/две, три, четыре rzeczownik stoi w dopełniaczu liczby pojedynczej: два стола, три книги, четыре окна. Liczebnik два/две rozróżnia rodzaj: две используем dla rodzaju żeńskiego (две сестры), а два dla męskiego i nijakiego.
Po liczebnikach od пять wzwyż rzeczownik stoi w dopełniaczu liczby mnogiej: пять столов, десять книг, двадцать рублей.
Na przykład: На полке лежат пять книг.
Uwaga na liczby złożone: liczy się ostatnie słowo. Двадцать один рубль (mianownik), двадцать два рубля (dopełniacz lp.), двадцать пять рублей (dopełniacz lm.).
Na przykład: В группе двадцать один студент.
Liczby od одиннадцать do четырнадцать zawsze łączą się z dopełniaczem liczby mnogiej, mimo że kończą się na cyfrę 1-4.
W przypadkach zależnych sam liczebnik również się odmienia, np. w narzędniku mówimy с пятью рублями, а w miejscowniku о двух книгах.
Na przykład: Я пришёл с двумя друзьями.
Zapamiętaj prosty schemat: 1 to mianownik, 2-4 to dopełniacz liczby pojedynczej, 5 i więcej to dopełniacz liczby mnogiej.',
  2
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('f0000000-0000-4000-8000-0000000000d3', 'multiple_choice', 'Wybierz właściwą formę po liczebniku два: У меня два ___.', '["брат","брата","братья"]'::jsonb, 'брата', 0),
  ('f0000000-0000-4000-8000-0000000000d3', 'gap_fill', 'Wstaw rzeczownik книга w odpowiedniej formie po пять: На полке лежат пять ___.', NULL, 'книг', 1),
  ('f0000000-0000-4000-8000-0000000000d3', 'multiple_choice', 'Wybierz formę liczebnika zgodną z rodzajem żeńskim: На столе ___ чашки.', '["два","две","двое"]'::jsonb, 'две', 2),
  ('f0000000-0000-4000-8000-0000000000d3', 'gap_fill', 'Wstaw rzeczownik рубль w odpowiedniej formie po десять: Это стоит десять ___.', NULL, 'рублей', 3),
  ('f0000000-0000-4000-8000-0000000000d3', 'multiple_choice', 'Wybierz właściwą formę w liczbie złożonej: В группе двадцать один ___.', '["студент","студента","студентов"]'::jsonb, 'студент', 4),
  ('f0000000-0000-4000-8000-0000000000d3', 'transformation', 'Zapisz poprawnie liczebnik z rzeczownikiem w odpowiednim przypadku: 4 + стол.', NULL, 'четыре стола', 5);

-- ----------------------------------------------------------------------------
-- Topic 3: Strona bierna
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000d4',
  'ru',
  'B2',
  'ru-strona-bierna',
  'Strona bierna',
  'Strona bierna (страдательный залог) przenosi uwagę z wykonawcy czynności na jej przedmiot. W języku rosyjskim tworzymy ją na dwa główne sposoby, zależnie od aspektu czasownika.
Dla czasowników niedokonanych używamy formy zwrotnej z cząstką -ся, zwłaszcza gdy mówimy o procesie lub czynności powtarzalnej: Новые дома строятся рабочими каждый год.
Dla czasowników dokonanych używamy krótkiego imiesłowu biernego, często z czasownikiem быть w czasie przeszłym lub przyszłym: Дом был построен, Письмо будет отправлено.
Na przykład: Этот дом был построен в прошлом веке.
Krótki imiesłów bierny zgadza się z podmiotem w rodzaju i liczbie: письмо написано, книга написана, романы написаны.
Wykonawcę czynności (agensa) wyrażamy w narzędniku, bez przyimka: Роман написан известным писателем.
Na przykład: Задача была решена талантливым студентом.
W czasie teraźniejszym opuszczamy słowo быть, dlatego mówimy po prostu Дверь закрыта albо Магазин открыт.
Strona bierna jest typowa dla stylu oficjalnego, naukowego i dziennikarskiego, natomiast w mowie potocznej Rosjanie częściej używają strony czynnej z podmiotem они lub bez podmiotu.
Zwróć uwagę, że polski i rosyjski agens różnią się: po polsku mówimy przez kogoś, a po rosyjsku po prostu w narzędniku.
Aby zamienić zdanie czynne na bierne, przedmiot staje się podmiotem, a dawny podmiot przechodzi do narzędnika.',
  3
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('f0000000-0000-4000-8000-0000000000d4', 'multiple_choice', 'Wybierz krótki imiesłów bierny: Этот дом ___ в прошлом веке.', '["построен","построил","строящий"]'::jsonb, 'построен', 0),
  ('f0000000-0000-4000-8000-0000000000d4', 'gap_fill', 'Wstaw wykonawcę czynności (писатель) w narzędniku: Роман написан известным ___.', NULL, 'писателем', 1),
  ('f0000000-0000-4000-8000-0000000000d4', 'multiple_choice', 'Wybierz formę bierną z cząstką -ся (proces niedokonany): Новые дома ___ рабочими каждый год.', '["строят","строятся","построены"]'::jsonb, 'строятся', 2),
  ('f0000000-0000-4000-8000-0000000000d4', 'gap_fill', 'Wstaw krótki imiesłów bierny od решить (rodzaj żeński, задача): Эта задача ___ студентом.', NULL, 'решена', 3),
  ('f0000000-0000-4000-8000-0000000000d4', 'multiple_choice', 'Wybierz właściwą formę słowa быть (rodzaj nijaki, письмо): Письмо ___ отправлено вчера.', '["было","был","были"]'::jsonb, 'было', 4),
  ('f0000000-0000-4000-8000-0000000000d4', 'transformation', 'Zamień zdanie ze strony czynnej na bierną (czas przeszły): Рабочие построили дом.', NULL, 'Дом был построен рабочими.', 5);

-- ----------------------------------------------------------------------------
-- Topic 4: Mowa zależna
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000d5',
  'ru',
  'B2',
  'ru-mowa-zalezna',
  'Mowa zależna',
  'Mowa zależna (косвенная речь) służy do przekazania cudzych słów bez cytowania ich dosłownie. Najważniejsza różnica w porównaniu z angielskim jest taka, że w języku rosyjskim NIE ma następstwa czasów, czyli czas czasownika się nie zmienia.
Zdania oznajmujące wprowadzamy spójnikiem что: Он сказал, что любит русскую музыку. Zwróć uwagę, że czas тераźniejszy zostaje, mimo że zdanie nadrzędne jest w czasie przeszłym.
Na przykład: Она сказала, что живёт в Москве.
Pytania rozstrzygające (tak/nie) przekształcamy za pomocą partykuły ли, która stoi po orzeczeniu: Он спросил, придёт ли она.
Na przykład: Мама спросила, сделал ли я уроки.
Pytania szczegółowe zachowują zaimek pytający (где, когда, кто, как), ale bez szyku pytającego: Она спросила, где я работаю.
Musimy pamiętać o zmianie osoby: jeśli ktoś mówi Я устал, to w mowie zależnej powiemy Он сказал, что он устал.
Polecenia i prośby oddajemy konstrukcją чтобы z czasownikiem w formie przeszłej albo czasownikiem попросить z bezokolicznikiem: Учитель сказал, чтобы мы открыли учебники.
Na przykład: Он попросил меня прийти пораньше.
Warto ćwiczyć te przekształcenia na głos, bo zmieniają się jednocześnie zaimki, spójniki i czasem szyk zdania.',
  4
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('f0000000-0000-4000-8000-0000000000d5', 'multiple_choice', 'Wybierz spójnik wprowadzający zdanie oznajmujące: Он сказал, ___ он очень устал.', '["что","чтобы","ли"]'::jsonb, 'что', 0),
  ('f0000000-0000-4000-8000-0000000000d5', 'gap_fill', 'Wstaw partykułę zamieniającą pytanie tak/nie na mowę zależną: Она спросила, приду ___ я завтра.', NULL, 'ли', 1),
  ('f0000000-0000-4000-8000-0000000000d5', 'multiple_choice', 'Wybierz właściwy spójnik dla przekazania polecenia: Мама сказала, ___ я убрал комнату.', '["что","чтобы","ли"]'::jsonb, 'чтобы', 2),
  ('f0000000-0000-4000-8000-0000000000d5', 'gap_fill', 'Wstaw zaimek pytający (miejsce), który zostaje w mowie zależnej: Она не знала, ___ я живу.', NULL, 'где', 3),
  ('f0000000-0000-4000-8000-0000000000d5', 'multiple_choice', 'Wybierz właściwą formę czasownika (zmiana osoby): «Где ты работаешь?» — Она спросила, где я ___.', '["работаю","работаешь","работать"]'::jsonb, 'работаю', 4),
  ('f0000000-0000-4000-8000-0000000000d5', 'transformation', 'Zamień mowę niezależną na zależną: «Я люблю Москву», — сказал он.', NULL, 'Он сказал, что любит Москву.', 5);

-- ----------------------------------------------------------------------------
-- Topic 5: Krótkie formy przymiotników
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000d6',
  'ru',
  'B2',
  'ru-krotkie-przymiotniki',
  'Krótkie formy przymiotników',
  'Rosyjskie przymiotniki jakościowe mają obok pełnej (odmiennej) formy także formę krótką, która nie odmienia się przez przypadki, tylko przez rodzaj i liczbę, i pełni w zdaniu funkcję orzecznika — nigdy nie stoi przed rzeczownikiem. Formę krótką tworzymy, odrywając końcówkę formy pełnej: rodzaj męski dostaje zerową końcówkę, żeński -а, nijaki -о, liczba mnoga -ы/-и: готовый → готов, готова, готово, готовы.
Niektóre przymiotniki, jak рад (zadowolony, uradowany), używane są niemal wyłącznie w formie krótkiej — pełna forma радый nie istnieje we współczesnym języku: Я рад тебя видеть (Cieszę się, że cię widzę).
Podobnie działa должен (musieć, powinienem) — to zawsze forma krótka, forma pełna должный jest archaiczna: Я должен идти, Она должна работать, Они должны прийти.
Przymiotnik свободный ma obie formy, ale ze zmianą znaczenia: forma pełna свободный человек opisuje cechę (człowiek wolny, niezależny), a krótka Я свободен opisuje stan chwilowy (jestem wolny, mam teraz czas) — dokładnie jak polskie wolny człowiek kontra jestem dziś wolny.
Ogólna zasada: forma pełna opisuje trwałą, obiektywną cechę i może stać przed rzeczownikiem (красивая девушка), a forma krótka opisuje stan chwilowy albo subiektywną ocenę i stoi zawsze po podmiocie, jako orzecznik: девушка красива (jest piękna — w tej chwili, w oczach mówiącego).
Niektóre przymiotniki krótkie mają rekcję, czyli łączą się z innym słowem w przypadku zależnym: Он готов к экзамену (gotów do egzaminu), Я доволен результатом (zadowolony z wyniku) — w tym znaczeniu predykatywnym forma pełna готовый tak się nie łączy.
Częsty błąd Polaków: użycie formy pełnej tam, gdzie rosyjski wymaga krótkiej, zwłaszcza z должен i рад — mówią oni готовый zamiast он готов, bo po polsku gotowy działa zarówno orzecznikowo, jak i przydawkowo, a rosyjski to rozróżnia.
Druga pułapka: forma krótka nigdy się nie odmienia przez przypadki i nie łączy się z przyimkami bezpośrednio — nie istnieje с рад ani к готов, bo krótka forma stoi samodzielnie jako orzecznik, najwyżej z dopełnieniem w odpowiednim przypadku (рад чему, готов к чему).
Zapamiętaj więc: рад, должен i намерен istnieją właściwie tylko w formie krótkiej, a przymiotniki takie jak свободен, готов, доволен, счастлив zmieniają odcień znaczenia zależnie od wybranej formy.',
  5
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('f0000000-0000-4000-8000-0000000000d6', 'gap_fill', 'Wstaw krótką formę przymiotnika рад (rodzaj żeński): Она очень ___ этой новости.', NULL, 'рада', 0),
  ('f0000000-0000-4000-8000-0000000000d6', 'multiple_choice', 'Wybierz poprawną formę: Я ___ идти на работу.', '["должный","должен","должного"]'::jsonb, 'должен', 1),
  ('f0000000-0000-4000-8000-0000000000d6', 'gap_fill', 'Wstaw krótką formę przymiotnika готовый (liczba mnoga): Мы ___ к экзамену.', NULL, 'готовы', 2),
  ('f0000000-0000-4000-8000-0000000000d6', 'multiple_choice', 'Wybierz zdanie opisujące stan chwilowy (forma krótka):', '["Он свободный человек.","Сегодня вечером он свободен.","Он свободный сегодня."]'::jsonb, 'Сегодня вечером он свободен.', 3),
  ('f0000000-0000-4000-8000-0000000000d6', 'multiple_choice', 'Wybierz poprawną formę: Я ___ результатом работы.', '["доволен","довольный","довольного"]'::jsonb, 'доволен', 4),
  ('f0000000-0000-4000-8000-0000000000d6', 'transformation', 'Przekształć zdanie, zamieniając formę pełną na krótką w funkcji orzecznika: Эта девушка красивая.', NULL, 'Эта девушка красива.', 5);

-- ----------------------------------------------------------------------------
-- Topic 6: Zdania złożone ze spójnikami podrzędnymi
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, language, level, slug, title, explanation, order_index) values (
  'f0000000-0000-4000-8000-0000000000d7',
  'ru',
  'B2',
  'ru-zdania-zlozone-spojniki',
  'Zdania złożone ze spójnikami podrzędnymi',
  'Zdania złożone podrzędnie łączymy w rosyjskim różnymi spójnikami, z których wiele wygląda znajomo, ale rządzi się swoimi regułami składniowymi, innymi niż w polskim. Najważniejszy spójnik przyczynowy to потому что (ponieważ, bo) — wprowadza przyczynę i stoi zawsze w zdaniu podrzędnym, nigdy na samym początku całej wypowiedzi: Я не пришёл, потому что заболел.
Bliskoznaczny, ale bardziej książkowy jest spójnik так как (skoro, jako że) — w odróżnieniu od потому что może otwierać całe zdanie złożone, stojąc przed przyczyną: Так как было поздно, мы решили остаться.
Spójnik хотя (chociaż, mimo że) wprowadza ustępstwo i, tak jak po polsku, nie wymaga żadnych dodatkowych partykuł: Хотя было холодно, мы пошли гулять.
Spójnik пока ma dwa znaczenia zależne od kontekstu: dopóki / podczas gdy przy czynnościach równoczesnych (Пока ты спал, я приготовила завтрак) oraz, z przeczeniem, пока не w znaczeniu dopóki nie (Подожди, пока я не вернусь).
Spójnik чтобы wprowadza zdania celu i życzenia, a czasownik po nim stoi ZAWSZE w formie przeszłej, gdy podmioty obu zdań są różne, niezależnie od czasu zdania głównego: Я хочу, чтобы ты помог мне (chcę, żebyś mi pomógł) — forma przeszła помог nie oznacza tu przeszłości, to wymóg gramatyczny po чтобы.
Konstrukcja если бы + forma przeszła wprowadza zdanie warunkowe nierealne, znane już z osobnego tematu trybu warunkowego: Если бы я знал, я сказал бы.
Typowa pułapka Polaków: próba postawienia po чтобы bezokolicznika lub czasu teraźniejszego, na wzór polskiego żeby + bezokolicznik (chcę, żeby pomóc) — po rosyjsku to błąd, gdy podmiot zdania podrzędnego różni się od podmiotu zdania głównego: obowiązuje wtedy forma przeszła, nie bezokolicznik.
Druga pułapka: mylenie потому что z так как na początku zdania — потому что zwykle nie otwiera całej wypowiedzi, a так как owszem, dlatego zdanie zaczynające się od przyczyny lepiej otworzyć spójnikiem так как.
Warto zapamiętać wyjątek: gdy podmiot zdania głównego i podrzędnego po чтобы jest ten sam, można użyć bezokolicznika zamiast formy przeszłej, tak jak w Я купил цветы, чтобы порадовать маму (ten sam podmiot я) — ale gdy podmioty się różnią, forma przeszła po чтобы jest obowiązkowa.',
  6
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('f0000000-0000-4000-8000-0000000000d7', 'multiple_choice', 'Wybierz spójnik, który może otwierać całe zdanie złożone (przyczyna na początku): ___ было поздно, мы решили остаться.', '["Потому что","Так как","Хотя"]'::jsonb, 'Так как', 0),
  ('f0000000-0000-4000-8000-0000000000d7', 'gap_fill', 'Wstaw spójnik wprowadzający ustępstwo: ___ было холодно, мы пошли гулять.', NULL, 'Хотя', 1),
  ('f0000000-0000-4000-8000-0000000000d7', 'multiple_choice', 'Wybierz poprawną formę czasownika po чтобы (różne podmioty): Я хочу, чтобы ты мне ___.', '["помочь","помогаешь","помог"]'::jsonb, 'помог', 2),
  ('f0000000-0000-4000-8000-0000000000d7', 'gap_fill', 'Wstaw czasownik w odpowiedniej formie (dopóki nie): Подожди, пока я не ___.', NULL, 'вернусь', 3),
  ('f0000000-0000-4000-8000-0000000000d7', 'multiple_choice', 'Wybierz poprawne zdanie z чтобы (ten sam podmiot, można użyć bezokolicznika):', '["Я купил цветы, чтобы порадовать маму.","Я купил цветы, чтобы я порадовал маму.","Я купил цветы, чтобы радовать маму вчера."]'::jsonb, 'Я купил цветы, чтобы порадовать маму.', 4),
  ('f0000000-0000-4000-8000-0000000000d7', 'transformation', 'Połącz zdania spójnikiem потому что: Я не пришёл. Я заболел.', NULL, 'Я не пришёл, потому что заболел.', 5);
