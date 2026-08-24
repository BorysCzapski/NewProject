-- ============================================================================
-- 02_grammar_b2.sql
-- Seed data for B2-level grammar topics and their exercises.
-- Topics use fixed literal UUIDs so grammar_exercises can reference them
-- directly in the same script (no CTEs needed).
-- Idempotent: deleting by level first (cascades to grammar_exercises via FK)
-- means this file can be re-run safely.
-- ============================================================================

-- learning_path_stages reference these topics (FK without cascade) — clear the
-- stages slice first; re-run 03_learning_path.sql afterwards to restore it.
delete from learning_path_stages where language = 'en' and level = 'B2';
delete from grammar_topics where language = 'en' and level = 'B2';

-- ----------------------------------------------------------------------------
-- Topic 0: Mixed Conditionals
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, level, slug, title, explanation, order_index) values (
  'e1a2b3c4-d5e6-4f70-8a91-1b2c3d4e5f60',
  'B2',
  'mixed-conditionals',
  'Mixed Conditionals',
  'Mixed Conditionals (tryby warunkowe mieszane) łączą różne części zdania warunkowego drugiego i trzeciego typu, gdy przyczyna i skutek dotyczą różnych momentów w czasie.
Najczęstszy typ to połączenie warunku z przeszłości (Third Conditional) ze skutkiem w teraźniejszości (Second Conditional), np.: "If I had studied medicine, I would be a doctor now." - warunek dotyczy przeszłości, ale skutek widoczny jest dzisiaj.
Zdanie z "if" tworzymy wtedy w Past Perfect (had + Past Participle), a zdanie główne z "would" i czasownikiem podstawowym (bez "have"), ponieważ mówimy o teraźniejszości: "If she had taken that job, she would live in London now."
Drugi typ mieszany łączy warunek nieprawdziwy w teraźniejszości ze skutkiem w przeszłości, np.: "If I were you, I would have accepted the offer." - gdybym był tobą (teraz, cecha stała), przyjąłbym tę ofertę (w przeszłości).
W tym przypadku zdanie z "if" jest w Past Simple (często "were" dla wszystkich osób), a zdanie główne w formie "would have" + Past Participle: "If he weren''t so shy, he would have asked her out."
Mixed Conditionals używamy, gdy chcemy pokazać, że nierealna sytuacja z przeszłości ma wpływ na teraźniejszość, albo że stała cecha lub sytuacja teraźniejsza tłumaczy coś, co (nie) wydarzyło się w przeszłości.
Przykład: "If I hadn''t missed the flight, I would be at the conference right now." - konsekwencja spóźnienia się na samolot (przeszłość) jest widoczna teraz.
Kluczowe jest rozpoznanie, do jakiego momentu odnosi się każda część zdania - warto zadać sobie pytanie: "Kiedy dzieje się warunek, a kiedy skutek?"
Warto porównać ze zwykłym Third Conditional: "If I had studied harder, I would have passed the exam." (obie części dotyczą przeszłości) - w Mixed Conditional skutek przesuwa się do teraźniejszości.
Przeczenia i pytania tworzymy tak samo jak w standardowych trybach warunkowych, zachowując odpowiednie czasy w obu częściach zdania, np.: "Would you be richer now if you hadn''t bought that car?"
Mixed Conditionals są bardzo naturalne w codziennej angielszczyźnie, szczególnie gdy mówimy o żalu za przeszłymi decyzjami i ich obecnych konsekwencjach, dlatego warto ćwiczyć je na własnych, prawdziwych przykładach z życia.',
  0
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('e1a2b3c4-d5e6-4f70-8a91-1b2c3d4e5f60', 'gap_fill', 'If I ___ (study) harder at university, I would have a much better job now.', null, 'had studied', 0),
  ('e1a2b3c4-d5e6-4f70-8a91-1b2c3d4e5f60', 'gap_fill', 'If she ___ (not / be) so stubborn, she would have listened to our advice.', null, 'were not', 1),
  ('e1a2b3c4-d5e6-4f70-8a91-1b2c3d4e5f60', 'multiple_choice', 'If he had taken that job offer, he ___ in New York now.', '["would live","would have lived","lives"]'::jsonb, 'would live', 2),
  ('e1a2b3c4-d5e6-4f70-8a91-1b2c3d4e5f60', 'multiple_choice', 'If I were more patient, I ___ so angry at the meeting yesterday.', '["would not get","would not have gotten","did not get"]'::jsonb, 'would not have gotten', 3),
  ('e1a2b3c4-d5e6-4f70-8a91-1b2c3d4e5f60', 'gap_fill', 'We ___ (be) on holiday right now if we hadn''t lost our jobs last month.', null, 'would be', 4),
  ('e1a2b3c4-d5e6-4f70-8a91-1b2c3d4e5f60', 'transformation', 'Rewrite as a mixed conditional: "I didn''t save money when I was young, so I am not rich now."', null, 'If I had saved money when I was young, I would be rich now.', 5);

-- ----------------------------------------------------------------------------
-- Topic 1: Strona bierna zaawansowana
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, level, slug, title, explanation, order_index) values (
  'f2b3c4d5-e6f7-4801-9a02-2c3d4e5f6071',
  'B2',
  'passive-voice-advanced',
  'Strona bierna zaawansowana',
  'Na poziomie B2 strona bierna (Passive Voice) obejmuje bardziej złożone konstrukcje niż podstawowe czasy - m.in. czasowniki modalne, bezokoliczniki, czasy złożone oraz czasowniki z dwoma dopełnieniami.
Ze czasownikami modalnymi tworzymy stronę bierną według wzoru: modal + be + Past Participle, np.: "The report must be finished by Friday." lub "This problem can be solved easily."
W bezokoliczniku bierny stronę tworzymy jako "to be" + Past Participle, np.: "There is a lot of work to be done before the deadline."
Czasowniki, które w stronie czynnej mają dwa dopełnienia (np. "give", "send", "show", "tell"), można przekształcić na dwa różne sposoby w stronie biernej, np. z "They gave her a prize." otrzymujemy "She was given a prize." (częściej używane) lub "A prize was given to her."
Strona bierna w Present Perfect wygląda następująco: "has/have been" + Past Participle, np.: "The documents have been signed already."
W Past Perfect: "had been" + Past Participle, np.: "The house had been sold before we arrived."
Konstrukcję "it is said/believed/thought that..." używamy, aby zrelacjonować powszechną opinię bez podawania źródła, np.: "It is believed that the treasure is hidden somewhere on the island." - można to też przekształcić na "The treasure is believed to be hidden somewhere on the island."
Podobnie działa to z czasownikami takimi jak "know", "report", "expect", "consider", np.: "He is known to be a brilliant scientist." zamiast "People know that he is a brilliant scientist."
Strony biernej używamy też z czasownikami przyczynowymi w konstrukcji "have something done", np.: "I had my car repaired yesterday." - oznacza to, że ktoś inny wykonał czynność dla mnie.
Strona bierna jest szczególnie przydatna w tekstach formalnych, naukowych i newsach, gdzie liczy się fakt, a nie wykonawca czynności, np.: "New regulations are being introduced to reduce emissions."
Przy tworzeniu strony biernej w bardziej złożonych czasach warto zawsze najpierw zidentyfikować czas zdania wyjściowego, a następnie zastosować odpowiednią formę "to be" plus Past Participle, zachowując resztę struktury zdania.',
  1
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('f2b3c4d5-e6f7-4801-9a02-2c3d4e5f6071', 'gap_fill', 'This letter ___ (must / send) before noon.', null, 'must be sent', 0),
  ('f2b3c4d5-e6f7-4801-9a02-2c3d4e5f6071', 'gap_fill', 'The new bridge ___ (already / build) by the local council.', null, 'has already been built', 1),
  ('f2b3c4d5-e6f7-4801-9a02-2c3d4e5f6071', 'multiple_choice', 'Active: "People say that he is very rich." Passive: "He ___ to be very rich."', '["is said","is saying","says"]'::jsonb, 'is said', 2),
  ('f2b3c4d5-e6f7-4801-9a02-2c3d4e5f6071', 'multiple_choice', 'Active: "They gave Mary an award." Passive: "Mary ___ an award."', '["was given","was giving","gave"]'::jsonb, 'was given', 3),
  ('f2b3c4d5-e6f7-4801-9a02-2c3d4e5f6071', 'gap_fill', 'I ___ (have / my hair / cut) yesterday afternoon.', null, 'had my hair cut', 4),
  ('f2b3c4d5-e6f7-4801-9a02-2c3d4e5f6071', 'transformation', 'Rewrite in the passive voice: "People believe that the company is losing money."', null, 'The company is believed to be losing money.', 5);

-- ----------------------------------------------------------------------------
-- Topic 2: Wish / if only
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, level, slug, title, explanation, order_index) values (
  'a3c4d5e6-f708-4912-ab13-3d4e5f607182',
  'B2',
  'wish-if-only',
  'Wish / if only',
  '"Wish" i "if only" używamy, aby wyrazić żal, marzenie lub chęć zmiany czegoś w teraźniejszości, przeszłości lub przyszłości - "if only" jest po prostu mocniejszym, bardziej emocjonalnym odpowiednikiem "wish".
Gdy żałujemy czegoś w teraźniejszości lub mówimy o sytuacji, którą chcielibyśmy zmienić teraz, używamy "wish/if only" + Past Simple, np.: "I wish I had more free time." (ale nie mam)
Z czasownikiem "to be" w tej konstrukcji zwykle używamy formy "were" dla wszystkich osób, np.: "If only I were taller." lub "I wish she were here with us."
Gdy żałujemy czegoś, co wydarzyło się (lub nie wydarzyło się) w przeszłości, używamy "wish/if only" + Past Perfect, np.: "I wish I had studied harder for the exam." (ale nie uczyłem się wystarczająco i teraz tego żałuję)
Przykład z "if only": "If only I hadn''t said that to her." - żałuję, że to powiedziałem.
Gdy chcemy wyrazić irytację lub niezadowolenie z czyjegoś zachowania, którego nie możemy zmienić, używamy "wish" + "would" + czasownik podstawowy, np.: "I wish you would stop interrupting me." - to konstrukcja krytyki lub prośby o zmianę zachowania.
Konstrukcji "wish + would" NIE używamy, gdy mówimy o sobie - nie powiemy "I wish I would be taller", tylko "I wish I were taller".
Gdy mówimy o przyszłości i chcemy wyrazić chęć, aby coś się zmieniło, również stosujemy "wish + would", np.: "I wish it would stop raining." - chcę, żeby przestało padać.
Warto zauważyć różnicę między "hope" a "wish" - "hope" używamy dla sytuacji realnych i możliwych ("I hope you pass the exam."), a "wish" dla sytuacji nierealnych lub żali ("I wish I had passed the exam.").
"If only" jest bardziej emfatyczne niż "wish" i często kończy zdanie wykrzyknikiem, np.: "If only I had listened to my parents!"
Struktury z "wish" i "if only" są bardzo przydatne do wyrażania emocji i osobistych refleksji, dlatego warto ćwiczyć je na przykładach z własnego życia - zarówno drobnych codziennych żali, jak i większych życiowych decyzji.',
  2
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('a3c4d5e6-f708-4912-ab13-3d4e5f607182', 'gap_fill', 'I wish I ___ (know) the answer to this question right now.', null, 'knew', 0),
  ('a3c4d5e6-f708-4912-ab13-3d4e5f607182', 'gap_fill', 'If only I ___ (not / eat) so much cake at the party last night.', null, 'had not eaten', 1),
  ('a3c4d5e6-f708-4912-ab13-3d4e5f607182', 'multiple_choice', 'I wish my neighbour ___ playing loud music every night.', '["would stop","stopped","stops"]'::jsonb, 'would stop', 2),
  ('a3c4d5e6-f708-4912-ab13-3d4e5f607182', 'multiple_choice', 'If only I ___ taller when I was younger, I could have been a professional basketball player.', '["was","were","had been"]'::jsonb, 'had been', 3),
  ('a3c4d5e6-f708-4912-ab13-3d4e5f607182', 'gap_fill', 'She wishes she ___ (be) on holiday instead of sitting in this boring meeting.', null, 'were', 4),
  ('a3c4d5e6-f708-4912-ab13-3d4e5f607182', 'transformation', 'Rewrite using "wish": "I regret that I did not call my grandmother last week."', null, 'I wish I had called my grandmother last week.', 5);

-- ----------------------------------------------------------------------------
-- Topic 3: Inwersja
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, level, slug, title, explanation, order_index) values (
  'b4d5e6f7-0819-4a23-bc24-4e5f60718293',
  'B2',
  'inversion',
  'Inwersja',
  'Inwersja (Inversion) polega na odwróceniu normalnego szyku zdania - zamiast podmiot + czasownik, mamy czasownik (posiłkowy) + podmiot - i jest używana głównie w formalnym lub literackim języku angielskim, aby podkreślić coś w zdaniu.
Najczęściej inwersję stosujemy po przysłówkach negatywnych lub ograniczających umieszczonych na początku zdania, np. "never", "rarely", "seldom", "hardly", "no sooner", "not only".
Przykład: "Never have I seen such a beautiful sunset." zamiast zwykłego "I have never seen such a beautiful sunset." - inwersja nadaje zdaniu bardziej emfatyczny, dramatyczny charakter.
Z "hardly" i "no sooner" często łączymy inwersję z "when" lub "than" w konstrukcji opisującej dwie następujące po sobie czynności, np.: "Hardly had I arrived when the phone rang." oraz "No sooner had she sat down than the meeting started."
Konstrukcja "Not only... but also" wymaga inwersji w pierwszej części zdania, np.: "Not only did he forget her birthday, but he also lost her present."
Inwersję stosujemy również po wyrażeniach z "little", gdy oznacza to "prawie wcale", np.: "Little did he know that his life was about to change forever."
Po wyrażeniach warunkowych bez "if" w bardzo formalnym stylu, np.: "Should you have any questions, please contact us." (zamiast "If you should have any questions...") lub "Had I known about the problem, I would have helped you." (zamiast "If I had known...").
Inwersja pojawia się także po przysłówkach miejsca w opisach literackich, np.: "Down the street came a strange figure." lub "Here comes the bus!"
Po "so" i "such" w konstrukcjach podkreślających intensywność, np.: "So tired was she that she fell asleep at her desk." lub "Such was the storm that many trees were destroyed."
Warto pamiętać, że inwersja wymaga czasownika posiłkowego (do/does/did, have/has/had, is/are/was/were, czasowniki modalne) tak jak w pytaniach, np.: "Rarely does he complain about his job."
Inwersja jest typowa dla języka pisanego, formalnych przemówień i literatury, dlatego w codziennej, nieformalnej rozmowie rzadziej ją usłyszymy, ale znajomość tej struktury jest bardzo ważna na poziomie B2 i wyższych egzaminach językowych.',
  3
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('b4d5e6f7-0819-4a23-bc24-4e5f60718293', 'gap_fill', 'Never ___ (I / see) such a chaotic meeting in my whole career.', null, 'have I seen', 0),
  ('b4d5e6f7-0819-4a23-bc24-4e5f60718293', 'gap_fill', 'Hardly ___ (we / sit) down when the fire alarm went off.', null, 'had we sat', 1),
  ('b4d5e6f7-0819-4a23-bc24-4e5f60718293', 'multiple_choice', 'Not only ___ late, but he also forgot the documents.', '["he was","was he","he did be"]'::jsonb, 'was he', 2),
  ('b4d5e6f7-0819-4a23-bc24-4e5f60718293', 'multiple_choice', '___ any questions, feel free to contact our support team.', '["If you should have","Should you have","You should have"]'::jsonb, 'Should you have', 3),
  ('b4d5e6f7-0819-4a23-bc24-4e5f60718293', 'gap_fill', 'Little ___ (he / know) that his business partner was planning to leave the company.', null, 'did he know', 4),
  ('b4d5e6f7-0819-4a23-bc24-4e5f60718293', 'transformation', 'Rewrite using inversion: "I have rarely met such a talented young musician."', null, 'Rarely have I met such a talented young musician.', 5);

-- ----------------------------------------------------------------------------
-- Topic 4: Czasowniki modalne w przeszłości
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, level, slug, title, explanation, order_index) values (
  'c5e6f708-1920-4b34-cd35-5f6071829304',
  'B2',
  'modals-past',
  'Czasowniki modalne w przeszłości',
  'Czasowniki modalne w przeszłości (Modal Verbs in the Past) tworzymy według wzoru: modal + have + Past Participle, i używamy ich, aby mówić o przypuszczeniach, żalach, krytyce lub możliwościach dotyczących wydarzeń, które już się wydarzyły.
"Must have + Past Participle" wyraża silne przypuszczenie na podstawie dowodów, że coś na pewno się wydarzyło, np.: "The ground is wet - it must have rained last night."
"Can''t have + Past Participle" (lub "couldn''t have") wyraża silne przekonanie, że coś na pewno się NIE wydarzyło, np.: "She can''t have finished already, it''s only been five minutes."
"May have" i "might have" wyrażają mniejszą pewność - przypuszczenie, że coś być może się wydarzyło, np.: "He might have missed the train, that''s why he''s late." oraz "They may have forgotten about the meeting."
"Should have + Past Participle" wyraża krytykę lub żal dotyczący czegoś, co powinno się było zrobić, ale tego nie zrobiono, np.: "You should have told me about the change of plans." - powinieneś był mi powiedzieć, ale tego nie zrobiłeś.
Przeczenie "shouldn''t have + Past Participle" wyraża krytykę czynności, która została wykonana, choć nie powinna była być, np.: "I shouldn''t have eaten so much at dinner, I feel sick now."
"Could have + Past Participle" wyraża możliwość, która istniała w przeszłości, ale nie została wykorzystana, np.: "You could have called me if you needed help." - miałeś taką możliwość, ale z niej nie skorzystałeś.
"Needn''t have + Past Participle" oznacza, że ktoś zrobił coś niepotrzebnie, choć nie musiał tego robić, np.: "You needn''t have brought an umbrella, the weather forecast was wrong." - to różni się od "didn''t need to", które mówi tylko, że coś nie było konieczne, bez informacji, czy zostało zrobione.
Warto porównać "must have" i "should have": "must have" to przypuszczenie oparte na dowodach (jestem prawie pewien, że coś się wydarzyło), a "should have" to opinia o tym, co powinno się było wydarzyć, ale się nie wydarzyło.
Konstrukcje te są bardzo ważne w rozmowach o przeszłych wydarzeniach, domysłach i wyrażaniu żalu, dlatego są częstym elementem egzaminów na poziomie B2, np. FCE.
Przykład pełnego dialogu: "Why is John so tired?" - "He must have worked all night on that project." - "Really? He shouldn''t have left it until the last minute."
Ćwicząc te konstrukcje, warto zastanowić się nad realnymi sytuacjami z własnego życia i spróbować opisać je za pomocą odpowiedniego czasownika modalnego w przeszłości, zwracając uwagę na stopień pewności lub charakter opinii (przypuszczenie, krytyka, możliwość).',
  4
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('c5e6f708-1920-4b34-cd35-5f6071829304', 'gap_fill', 'The lights are off and nobody is answering - they ___ (must / leave) already.', null, 'must have left', 0),
  ('c5e6f708-1920-4b34-cd35-5f6071829304', 'gap_fill', 'I ___ (should / call) you earlier, I''m really sorry for the delay.', null, 'should have called', 1),
  ('c5e6f708-1920-4b34-cd35-5f6071829304', 'multiple_choice', 'She can''t have failed the exam - she ___ so hard for it.', '["must have studied","should have studied","needn''t have studied"]'::jsonb, 'must have studied', 2),
  ('c5e6f708-1920-4b34-cd35-5f6071829304', 'multiple_choice', 'You ___ so rude to the waiter - it wasn''t his fault the food was cold.', '["shouldn''t have been","mustn''t have been","couldn''t have been"]'::jsonb, 'shouldn''t have been', 3),
  ('c5e6f708-1920-4b34-cd35-5f6071829304', 'gap_fill', 'We ___ (needn''t / buy) so much food, half of it went to waste.', null, 'needn''t have bought', 4),
  ('c5e6f708-1920-4b34-cd35-5f6071829304', 'transformation', 'Rewrite expressing regret with "should have": "It was a mistake that I did not save my document before the computer crashed."', null, 'I should have saved my document before the computer crashed.', 5);

-- ----------------------------------------------------------------------------
-- Topic 5: Causative: have / get something done
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, level, slug, title, explanation, order_index) values (
  '4616d08b-72cb-4047-bb12-b043169c5ff6',
  'B2',
  'causative-have-get',
  'Causative: have / get something done',
  'Konstrukcji przyczynowej (causative) "have/get something done" używamy, gdy mówimy, że ktoś inny wykonuje dla nas jakąś czynność - zwykle usługę - a nie robimy jej sami.
Budowa: have/get + dopełnienie (rzecz) + Past Participle (III forma czasownika), np.: "I had my car repaired." - oznacza to, że nie naprawiłem samochodu sam, tylko zleciłem to komuś (mechanikowi).
Porównaj ze zdaniem bez konstrukcji przyczynowej: "I repaired my car." (zrobiłem to sam) a "I had my car repaired." (ktoś zrobił to za mnie) - ta różnica w znaczeniu jest kluczowa.
"Get something done" znaczy dokładnie to samo co "have something done", ale jest bardziej nieformalne i częściej pojawia się w mówionym języku angielskim, np.: "I need to get my hair cut this week." zamiast bardziej formalnego "I need to have my hair cut this week."
Czasownik "have/get" można odmieniać w dowolnym czasie gramatycznym, a reszta konstrukcji (dopełnienie + Past Participle) pozostaje bez zmian, np. Present Simple: "She has her nails done every month.", Past Simple: "We had our house painted last spring.", Present Perfect: "I have just had my phone screen fixed.", Future: "They will have their kitchen renovated next year."
Konstrukcji przyczynowej używamy też w znaczeniu "coś nieprzyjemnego przydarzyło się komuś" (zwykle poza jego kontrolą), np.: "She had her wallet stolen on the train." - to nie znaczy, że zleciła kradzież, tylko że coś złego jej się przytrafiło.
Warto odróżnić causative "have something done" od zwykłej strony biernej - strona bierna po prostu opisuje fakt, że coś zostało zrobione, bez podkreślania, że ktoś to zlecił, np.: "My car was repaired." (fakt - naprawiono go, nie wiemy przez kogo ani czy ktoś to zlecił) a "I had my car repaired." (podkreśla, że TY zleciłeś tę czynność).
Możemy też użyć aktywnej wersji konstrukcji przyczynowej: "have someone do something" (bez Past Participle, z bezokolicznikiem bez "to"), gdy chcemy podać, KTO wykonał czynność, np.: "I had the mechanic check my brakes." - kazałem mechanikowi sprawdzić hamulce.
Pytania w konstrukcji przyczynowej tworzymy tak samo jak w zwykłych zdaniach z have/get, np.: "Where did you have your hair cut?" oraz "Have you had your car serviced recently?"
Przeczenia tworzymy identycznie: "I haven''t had my suit dry-cleaned yet." oraz "We didn''t get our windows cleaned this month."
Konstrukcja "have/get something done" jest bardzo praktyczna w codziennym życiu - opisuje usługi takie jak fryzjer, mechanik, dentysta, malarz czy firma sprzątająca, dlatego warto znać ją na pamięć i ćwiczyć na przykładach z własnych codziennych spraw.',
  5
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('4616d08b-72cb-4047-bb12-b043169c5ff6', 'gap_fill', 'I ___ (have / my hair / cut) every six weeks.', null, 'have my hair cut', 0),
  ('4616d08b-72cb-4047-bb12-b043169c5ff6', 'gap_fill', 'We ___ (get / our roof / repair) after the storm last month.', null, 'got our roof repaired', 1),
  ('4616d08b-72cb-4047-bb12-b043169c5ff6', 'multiple_choice', 'Which sentence means that someone else painted the fence, not you?', '["I painted the fence.","I had the fence painted.","I was painting the fence."]'::jsonb, 'I had the fence painted.', 2),
  ('4616d08b-72cb-4047-bb12-b043169c5ff6', 'multiple_choice', 'She ___ her phone screen fixed yesterday.', '["had","did","made"]'::jsonb, 'had', 3),
  ('4616d08b-72cb-4047-bb12-b043169c5ff6', 'transformation', 'Rewrite using the causative: "A dentist checked my teeth last week." (Start with "I...")', null, 'I had my teeth checked last week.', 4),
  ('4616d08b-72cb-4047-bb12-b043169c5ff6', 'transformation', 'Rewrite using the causative: "Someone stole her bag on the bus." (Start with "She...")', null, 'She had her bag stolen on the bus.', 5);

-- ----------------------------------------------------------------------------
-- Topic 6: Imiesłowowe równoważniki zdań (-ing / -ed)
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, level, slug, title, explanation, order_index) values (
  '05e4ed61-96ea-4aae-a087-54c204e6c0aa',
  'B2',
  'participle-clauses',
  'Imiesłowowe równoważniki zdań (-ing / -ed)',
  'Zdania imiesłowowe (participle clauses) to skrócone konstrukcje, które zastępują pełne zdania podrzędne z "who", "which", "because", "after", "while" itd. - używamy ich, aby zdania brzmiały bardziej zwięźle i naturalnie, zwłaszcza w piśmie.
Imiesłów czynny (Present Participle, czasownik + -ing) zastępuje zdanie, w którym podmiot WYKONUJE czynność, np.: "The man who is standing by the door is my uncle." można skrócić do "The man standing by the door is my uncle."
Imiesłów bierny (Past Participle, zwykle czasownik + -ed lub III forma) zastępuje zdanie, w którym podmiot DOZNAJE czynności (strona bierna), np.: "The letter which was written in French was difficult to translate." można skrócić do "The letter written in French was difficult to translate."
Konstrukcji -ing używamy też, aby połączyć dwie czynności wykonywane przez tę samą osobę, zwłaszcza gdy jedna wynika z drugiej lub dzieje się jednocześnie, np.: "Feeling tired, she decided to go to bed early." zamiast "Because she felt tired, she decided to go to bed early."
Konstrukcje z -ing mogą też zastępować "while" lub "as" przy dwóch czynnościach dziejących się jednocześnie, np.: "Walking home, I saw an old friend." zamiast "While I was walking home, I saw an old friend."
Zdania imiesłowowe z -ing mogą zastępować też zdania przyczynowo-skutkowe z "because"/"since", np.: "Not knowing what to say, he just stayed silent." zamiast "Because he did not know what to say, he just stayed silent."
Ważna zasada: podmiot zdania głównego i zdania imiesłowowego musi być TEN SAM, inaczej zdanie staje się niejasne lub błędne (tzw. "dangling participle"), np. błędne: "Walking down the street, the trees looked beautiful." (to nie drzewa szły ulicą!) - poprawnie: "Walking down the street, I thought the trees looked beautiful."
Konstrukcje z -ed (lub inną formą Past Participle) zastępują zdania bierne, np.: "Built in the 19th century, the bridge is now a popular tourist attraction." zamiast "Because it was built in the 19th century, the bridge is now a popular tourist attraction."
Aby podkreślić, że jedna czynność zakończyła się PRZED drugą, używamy "having" + Past Participle (Perfect Participle), np.: "Having finished his homework, he went out to play." - najpierw skończył pracę domową, a potem wyszedł się bawić.
Zdania imiesłowowe są bardzo częste w formalnym piśmie - artykułach, esejach, literaturze - ponieważ pozwalają unikać powtarzania podmiotu i zaimków względnych w każdym zdaniu podrzędnym.
Warto ćwiczyć przekształcanie pełnych zdań podrzędnych na imiesłowowe równoważniki, zwracając szczególną uwagę na to, czy potrzebny jest imiesłów czynny (-ing, podmiot wykonuje czynność) czy bierny (-ed/III forma, podmiot doznaje czynności).',
  6
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('05e4ed61-96ea-4aae-a087-54c204e6c0aa', 'gap_fill', 'The woman ___ (stand) at the bus stop is my colleague.', null, 'standing', 0),
  ('05e4ed61-96ea-4aae-a087-54c204e6c0aa', 'gap_fill', '___ (not / know) what to say, she just smiled awkwardly.', null, 'Not knowing', 1),
  ('05e4ed61-96ea-4aae-a087-54c204e6c0aa', 'multiple_choice', 'Which sentence correctly reduces: "The book which was written by a famous author became a bestseller."?', '["The book writing by a famous author became a bestseller.","The book written by a famous author became a bestseller.","The book that written by a famous author became a bestseller."]'::jsonb, 'The book written by a famous author became a bestseller.', 2),
  ('05e4ed61-96ea-4aae-a087-54c204e6c0aa', 'multiple_choice', 'Choose the correct perfect participle clause: ___ his homework, he went out to play.', '["Having finished","Having finish","Finished"]'::jsonb, 'Having finished', 3),
  ('05e4ed61-96ea-4aae-a087-54c204e6c0aa', 'transformation', 'Rewrite as a participle clause: "Because he felt exhausted, he cancelled the meeting."', null, 'Feeling exhausted, he cancelled the meeting.', 4),
  ('05e4ed61-96ea-4aae-a087-54c204e6c0aa', 'transformation', 'Rewrite as a participle clause: "The castle, which was built in the 12th century, attracts thousands of visitors."', null, 'Built in the 12th century, the castle attracts thousands of visitors.', 5);
