-- ============================================================================
-- 02_grammar_a1.sql
-- Seed data for A1-level grammar topics and their exercises.
-- Topics use fixed literal UUIDs so grammar_exercises can reference them
-- directly in the same script (no CTEs needed).
-- Idempotent: deleting by level first (cascades to grammar_exercises via FK)
-- means this file can be re-run safely.
-- ============================================================================

delete from grammar_topics where level = 'A1';

-- ----------------------------------------------------------------------------
-- Topic 0: Czasownik "to be"
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, level, slug, title, explanation, order_index) values (
  'd27698ac-2cdc-4060-9356-c0717a23ff4a',
  'A1',
  'to-be',
  'Czasownik "to be"',
  'Czasownik "to be" oznacza "być" i jest jednym z najważniejszych czasowników w języku angielskim.
W czasie teraźniejszym ma trzy formy: am, is oraz are, w zależności od osoby.
Formy "to be" łączymy z zaimkami osobowymi w następujący sposób: I am, you are, he/she/it is, we are, they are.
Na przykład: "I am a student." (Jestem uczniem.)
Formę "is" używamy z on, ona, ono oraz z rzeczownikami w liczbie pojedynczej, np.: "She is my sister."
Formę "are" używamy z ty, my, wy, oni oraz z rzeczownikami w liczbie mnogiej, np.: "They are happy."
W zdaniach przeczących dodajemy "not" po czasowniku: I am not, you are not (aren''t), he is not (isn''t).
Możemy też używać form skróconych, np. I''m, you''re, he''s, we''re, they''re.
Aby zadać pytanie, zamieniamy kolejność podmiotu i czasownika, np.: "Is she your friend?"
Czasownika "to be" używamy również, mówiąc o wieku, np.: "I am twelve years old."
Pamiętaj, że w języku polskim czasami pomijamy "być" w zdaniu (np. "Jestem szczęśliwy"), ale w angielskim jest on zawsze obowiązkowy.
Warto ćwiczyć te formy codziennie, ponieważ czasownik "to be" pojawia się niemal w każdym zdaniu.',
  0
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('d27698ac-2cdc-4060-9356-c0717a23ff4a', 'gap_fill', 'I ___ a teacher.', null, 'am', 0),
  ('d27698ac-2cdc-4060-9356-c0717a23ff4a', 'gap_fill', 'They ___ from Poland.', null, 'are', 1),
  ('d27698ac-2cdc-4060-9356-c0717a23ff4a', 'multiple_choice', 'She ___ my best friend.', '["is","am","are"]'::jsonb, 'is', 2),
  ('d27698ac-2cdc-4060-9356-c0717a23ff4a', 'multiple_choice', '___ you ready?', '["Is","Are","Am"]'::jsonb, 'Are', 3),
  ('d27698ac-2cdc-4060-9356-c0717a23ff4a', 'gap_fill', 'He ___ not at home right now.', null, 'is', 4),
  ('d27698ac-2cdc-4060-9356-c0717a23ff4a', 'transformation', 'Rewrite the sentence in the negative form: "We are hungry."', null, 'We are not hungry.', 5);

-- ----------------------------------------------------------------------------
-- Topic 1: Present Simple
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, level, slug, title, explanation, order_index) values (
  '3860fe75-73ae-4f76-89ea-a0e14154ff20',
  'A1',
  'present-simple',
  'Present Simple',
  'Present Simple to czas teraźniejszy prosty, którego używamy do opisywania czynności rutynowych, nawyków, faktów i stałych sytuacji.
W trzeciej osobie liczby pojedynczej (he, she, it) dodajemy końcówkę -s lub -es do czasownika, np.: "She works in a bank."
Dla pozostałych osób czasownik pozostaje w formie podstawowej, np.: "I play tennis every Sunday."
Zdania przeczące tworzymy za pomocą "do not" (don''t) lub "does not" (doesn''t), np.: "He doesn''t like coffee."
Pytania tworzymy, dodając "do" lub "does" na początku zdania, np.: "Do you speak English?"
Warto zapamiętać, że w trzeciej osobie liczby pojedynczej w pytaniach i przeczeniach używamy "does", a czasownik główny wraca do formy podstawowej, np.: "Does she like pizza?"
Present Simple używamy też do mówienia o rozkładach jazdy, np.: "The train leaves at six o''clock."
Czasownikami, które często pojawiają się z tym czasem, są określenia częstotliwości: always, usually, often, sometimes, never.
Na przykład: "I always brush my teeth before bed."
Pamiętaj, że czasowniki kończące się na -y po spółgłosce zmieniają końcówkę na -ies, np. study -> studies.
Czasowniki kończące się na -o, -ch, -sh, -x, -s dodają -es, np. go -> goes, watch -> watches.',
  1
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('3860fe75-73ae-4f76-89ea-a0e14154ff20', 'gap_fill', 'She ___ (work) in a hospital.', null, 'works', 0),
  ('3860fe75-73ae-4f76-89ea-a0e14154ff20', 'gap_fill', 'They ___ (not / like) fast food.', null, 'don''t like', 1),
  ('3860fe75-73ae-4f76-89ea-a0e14154ff20', 'multiple_choice', '___ he play football on Saturdays?', '["Do","Does","Is"]'::jsonb, 'Does', 2),
  ('3860fe75-73ae-4f76-89ea-a0e14154ff20', 'multiple_choice', 'My brother ___ TV every evening.', '["watch","watches","watching"]'::jsonb, 'watches', 3),
  ('3860fe75-73ae-4f76-89ea-a0e14154ff20', 'gap_fill', 'We ___ (live) in Warsaw.', null, 'live', 4),
  ('3860fe75-73ae-4f76-89ea-a0e14154ff20', 'transformation', 'Rewrite as a question: "She speaks German."', null, 'Does she speak German?', 5);

-- ----------------------------------------------------------------------------
-- Topic 2: Przedimki a/an/the
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, level, slug, title, explanation, order_index) values (
  '1ff09055-c3f1-43d3-8d70-6ccd2ff9f1c8',
  'A1',
  'articles-a-an-the',
  'Przedimki a/an/the',
  'Przedimki "a", "an" i "the" to krótkie słówka, które stawiamy przed rzeczownikami, aby pokazać, czy mówimy o czymś ogólnym, czy konkretnym.
Przedimka "a" używamy przed rzeczownikami policzalnymi w liczbie pojedynczej, które zaczynają się od spółgłoski, np.: "I have a dog."
Przedimka "an" używamy, gdy rzeczownik zaczyna się od samogłoski (a, e, i, o, u) lub od "cichego h", np.: "She is eating an apple."
Przedimki "a/an" oznaczają "jakiś, jakaś, pewien" i używamy ich, gdy wspominamy o czymś po raz pierwszy lub gdy nie jest to konkretna, znana rzecz, np.: "There is a cat in the garden."
Przedimka "the" używamy, gdy mówimy o czymś konkretnym, znanym rozmówcy lub wspomnianym wcześniej, np.: "The cat in the garden is very friendly." (już wiemy, o którym kocie mowa).
"The" używamy również z rzeczami unikatowymi, np. "the sun", "the moon", oraz z nazwami niektórych miejsc, np. "the United States".
Nie używamy żadnego przedimka przed rzeczownikami niepoliczalnymi w znaczeniu ogólnym ani przed rzeczownikami w liczbie mnogiej, gdy mówimy ogólnie, np.: "I like music." albo "Dogs are loyal animals."
Ważna zasada: wybór między "a" a "an" zależy od wymowy pierwszej głoski, a nie od pisowni, dlatego mówimy "an hour" (bo "h" jest nieme), ale "a university" (bo brzmi jak "y").
Przedimki są jednym z trudniejszych elementów gramatyki dla Polaków, ponieważ w języku polskim ich nie ma, dlatego warto ćwiczyć je na wielu przykładach.',
  2
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('1ff09055-c3f1-43d3-8d70-6ccd2ff9f1c8', 'gap_fill', 'I saw ___ elephant at the zoo.', null, 'an', 0),
  ('1ff09055-c3f1-43d3-8d70-6ccd2ff9f1c8', 'gap_fill', 'Can you close ___ door, please?', null, 'the', 1),
  ('1ff09055-c3f1-43d3-8d70-6ccd2ff9f1c8', 'multiple_choice', 'She wants to be ___ doctor.', '["a","an","the"]'::jsonb, 'a', 2),
  ('1ff09055-c3f1-43d3-8d70-6ccd2ff9f1c8', 'multiple_choice', '___ moon is very bright tonight.', '["A","An","The"]'::jsonb, 'The', 3),
  ('1ff09055-c3f1-43d3-8d70-6ccd2ff9f1c8', 'gap_fill', 'We need ___ umbrella, it is raining.', null, 'an', 4),
  ('1ff09055-c3f1-43d3-8d70-6ccd2ff9f1c8', 'transformation', 'Rewrite the sentence choosing the correct article: "I have (a/an) old car."', null, 'I have an old car.', 5);

-- ----------------------------------------------------------------------------
-- Topic 3: Liczba mnoga rzeczowników
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, level, slug, title, explanation, order_index) values (
  'a6c998f7-344d-4f2f-8500-5a8e47274610',
  'A1',
  'plural-nouns',
  'Liczba mnoga rzeczowników',
  'Liczba mnoga rzeczowników w języku angielskim najczęściej powstaje przez dodanie końcówki -s do rzeczownika w liczbie pojedynczej, np.: "one book" -> "two books".
Jeśli rzeczownik kończy się na -s, -ss, -sh, -ch, -x lub -z, dodajemy końcówkę -es, np.: "one box" -> "two boxes".
Gdy rzeczownik kończy się na spółgłoskę + y, zamieniamy "y" na "i" i dodajemy "es", np.: "one city" -> "two cities".
Jeśli natomiast przed "y" jest samogłoska, dodajemy tylko -s, np.: "one boy" -> "two boys".
Niektóre rzeczowniki kończące się na -f lub -fe zmieniają końcówkę na -ves, np.: "one leaf" -> "two leaves", "one knife" -> "two knives".
Rzeczowniki zakończone na -o czasem dodają -es, np. "one potato" -> "two potatoes", choć są wyjątki, np. "one photo" -> "two photos".
Istnieją też rzeczowniki nieregularne, które mają zupełnie inną formę liczby mnogiej, np.: "one child" -> "two children", "one man" -> "two men", "one woman" -> "two women", "one mouse" -> "two mice".
Niektóre rzeczowniki mają taką samą formę w liczbie pojedynczej i mnogiej, np. "sheep", "fish".
Przykładowe zdanie z liczbą mnogą: "There are three children in the park."
Warto zapamiętywać nieregularne formy osobno, ponieważ nie da się ich wydedukować z żadnej reguły.',
  3
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('a6c998f7-344d-4f2f-8500-5a8e47274610', 'gap_fill', 'I have two ___ (dog).', null, 'dogs', 0),
  ('a6c998f7-344d-4f2f-8500-5a8e47274610', 'gap_fill', 'There are five ___ (box) in the room.', null, 'boxes', 1),
  ('a6c998f7-344d-4f2f-8500-5a8e47274610', 'multiple_choice', 'What is the plural of "child"?', '["childs","children","childes"]'::jsonb, 'children', 2),
  ('a6c998f7-344d-4f2f-8500-5a8e47274610', 'multiple_choice', 'What is the plural of "city"?', '["citys","cities","citiess"]'::jsonb, 'cities', 3),
  ('a6c998f7-344d-4f2f-8500-5a8e47274610', 'gap_fill', 'She has three ___ (child).', null, 'children', 4),
  ('a6c998f7-344d-4f2f-8500-5a8e47274610', 'transformation', 'Rewrite the sentence in the plural: "This is a leaf."', null, 'These are leaves.', 5);

-- ----------------------------------------------------------------------------
-- Topic 4: Can / can't
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, level, slug, title, explanation, order_index) values (
  'd2280b7a-0d77-4dd2-9fd6-b0a7ca1466c9',
  'A1',
  'can-cant',
  'Can / can''t',
  'Czasownik modalny "can" używamy, aby mówić o umiejętnościach, możliwościach oraz aby prosić o pozwolenie.
Forma "can" jest taka sama dla wszystkich osób i nie dodajemy do niej końcówki -s, nawet w trzeciej osobie liczby pojedynczej, np.: "She can swim very well."
Forma przecząca to "cannot" lub w skrócie "can''t", np.: "I can''t speak Chinese."
Po "can" zawsze używamy czasownika w formie podstawowej (bez "to"), np.: "He can play the guitar." (nie: "He can to play").
Pytania tworzymy, przestawiając "can" przed podmiot, np.: "Can you help me, please?"
"Can" używamy również, mówiąc o możliwościach ogólnych, np.: "It can be very cold in winter."
Aby poprosić o pozwolenie, mówimy np.: "Can I open the window?"
"Can''t" wyraża też przekonanie, że coś jest niemożliwe, np.: "That can''t be true!"
W czasie przeszłym "can" zamienia się na "could", np.: "When I was young, I could run very fast."
Pamiętaj, że "can" jest czasownikiem modalnym, więc w pytaniach i przeczeniach nie potrzebujemy dodatkowego "do/does".',
  4
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('d2280b7a-0d77-4dd2-9fd6-b0a7ca1466c9', 'gap_fill', 'I ___ swim, but I can''t ski.', null, 'can', 0),
  ('d2280b7a-0d77-4dd2-9fd6-b0a7ca1466c9', 'gap_fill', 'He ___ (not) drive a car.', null, 'can''t', 1),
  ('d2280b7a-0d77-4dd2-9fd6-b0a7ca1466c9', 'multiple_choice', '___ you play the piano?', '["Do","Can","Are"]'::jsonb, 'Can', 2),
  ('d2280b7a-0d77-4dd2-9fd6-b0a7ca1466c9', 'multiple_choice', 'My cat ___ open doors!', '["can","cans","canning"]'::jsonb, 'can', 3),
  ('d2280b7a-0d77-4dd2-9fd6-b0a7ca1466c9', 'gap_fill', '___ I borrow your pen, please?', null, 'Can', 4),
  ('d2280b7a-0d77-4dd2-9fd6-b0a7ca1466c9', 'transformation', 'Rewrite the sentence in the negative form: "They can come to the party."', null, 'They can''t come to the party.', 5);
