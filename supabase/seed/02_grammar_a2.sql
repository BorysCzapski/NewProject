-- ============================================================================
-- 02_grammar_a2.sql
-- Seed data for A2-level grammar topics and their exercises.
-- Topics use fixed literal UUIDs so grammar_exercises can reference them
-- directly in the same script (no CTEs needed).
-- Idempotent: deleting by level first (cascades to grammar_exercises via FK)
-- means this file can be re-run safely.
-- ============================================================================

delete from grammar_topics where language = 'en' and level = 'A2';

-- ----------------------------------------------------------------------------
-- Topic 0: Past Simple
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, level, slug, title, explanation, order_index) values (
  'b1e2c3d4-5f6a-47b8-9c0d-1e2f3a4b5c6d',
  'A2',
  'past-simple',
  'Past Simple',
  'Past Simple to czas przeszły prosty, którego używamy, aby mówić o czynnościach zakończonych w przeszłości, zwłaszcza gdy znamy moment ich wykonania.
Czasowniki regularne w czasie przeszłym tworzymy, dodając końcówkę -ed do formy podstawowej, np.: "I worked in a shop last year."
Czasowniki nieregularne mają swoją drugą formę, której trzeba nauczyć się na pamięć, np.: "go" -> "went", "see" -> "saw", "have" -> "had".
Przykład zdania z czasownikiem nieregularnym: "She went to London two years ago."
Forma czasownika w Past Simple jest taka sama dla wszystkich osób, nie dodajemy końcówki -s, np.: "He played football yesterday."
Zdania przeczące tworzymy za pomocą "did not" (didn''t) oraz czasownika w formie podstawowej, np.: "I didn''t watch the film."
Pytania tworzymy, dodając "did" na początku zdania, a czasownik główny wraca do formy podstawowej, np.: "Did you visit your grandmother last weekend?"
Z Past Simple często używamy określników czasu przeszłego, takich jak: yesterday, last week, last year, two days ago, in 2010.
Na przykład: "We moved to a new flat last month."
Czasownik "to be" w czasie przeszłym ma dwie formy: "was" (I, he, she, it) oraz "were" (you, we, they), np.: "I was tired after work."
Pamiętaj, że w pytaniach i przeczeniach z "did" czasownik główny nigdy nie przyjmuje końcówki -ed ani formy nieregularnej, np.: "Did she finish her homework?", a nie "Did she finished".
Warto systematycznie uczyć się listy czasowników nieregularnych, ponieważ pojawiają się one bardzo często w codziennych rozmowach.',
  0
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('b1e2c3d4-5f6a-47b8-9c0d-1e2f3a4b5c6d', 'gap_fill', 'I ___ (visit) my aunt last Sunday.', null, 'visited', 0),
  ('b1e2c3d4-5f6a-47b8-9c0d-1e2f3a4b5c6d', 'gap_fill', 'She ___ (go) to the cinema two days ago.', null, 'went', 1),
  ('b1e2c3d4-5f6a-47b8-9c0d-1e2f3a4b5c6d', 'multiple_choice', '___ you see that film last night?', '["Do","Did","Were"]'::jsonb, 'Did', 2),
  ('b1e2c3d4-5f6a-47b8-9c0d-1e2f3a4b5c6d', 'multiple_choice', 'They ___ not go to school yesterday.', '["did","didn''t","doesn''t"]'::jsonb, 'did', 3),
  ('b1e2c3d4-5f6a-47b8-9c0d-1e2f3a4b5c6d', 'gap_fill', 'We ___ (be) very happy at the party.', null, 'were', 4),
  ('b1e2c3d4-5f6a-47b8-9c0d-1e2f3a4b5c6d', 'transformation', 'Rewrite the sentence in the negative form: "He finished his homework."', null, 'He didn''t finish his homework.', 5);

-- ----------------------------------------------------------------------------
-- Topic 1: Present Continuous
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, level, slug, title, explanation, order_index) values (
  'c2d3e4f5-6a7b-48c9-9d0e-2f3a4b5c6d7e',
  'A2',
  'present-continuous',
  'Present Continuous',
  'Present Continuous to czas teraźniejszy ciągły, którego używamy do opisywania czynności trwających właśnie teraz, w momencie mówienia.
Zdanie tworzymy za pomocą odpowiedniej formy czasownika "to be" (am/is/are) oraz czasownika głównego z końcówką -ing, np.: "I am reading a book right now."
Formę "am" łączymy z "I", "is" z "he/she/it", a "are" z "you/we/they", np.: "She is cooking dinner at the moment."
Present Continuous używamy również do mówienia o planach i ustaleniach na najbliższą przyszłość, np.: "We are meeting our friends tomorrow."
Zdania przeczące tworzymy, dodając "not" po czasowniku "to be", np.: "He is not working today." (He isn''t working today.)
Pytania tworzymy, przestawiając czasownik "to be" przed podmiot, np.: "Are you listening to me?"
Niektóre czasowniki kończące się na "-e" tracą tę literę przed dodaniem "-ing", np. "make" -> "making", "write" -> "writing".
Czasowniki jednosylabowe zakończone spółgłoską po krótkiej samogłosce podwajają ostatnią spółgłoskę, np. "run" -> "running", "sit" -> "sitting".
Present Continuous często występuje z określeniami czasu takimi jak: now, right now, at the moment, currently, np.: "Look! It is raining now."
Niektórych czasowników stanu (np. know, like, want, believe) zazwyczaj nie używamy w formie ciągłej, ponieważ opisują stałe stany, a nie czynności.
Warto porównywać Present Continuous z Present Simple, aby dobrze rozumieć różnicę między czynnością chwilową a rutynową.',
  1
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('c2d3e4f5-6a7b-48c9-9d0e-2f3a4b5c6d7e', 'gap_fill', 'I ___ (write) an email right now.', null, 'am writing', 0),
  ('c2d3e4f5-6a7b-48c9-9d0e-2f3a4b5c6d7e', 'gap_fill', 'They ___ (play) football at the moment.', null, 'are playing', 1),
  ('c2d3e4f5-6a7b-48c9-9d0e-2f3a4b5c6d7e', 'multiple_choice', 'She ___ dinner in the kitchen now.', '["cook","is cooking","cooks"]'::jsonb, 'is cooking', 2),
  ('c2d3e4f5-6a7b-48c9-9d0e-2f3a4b5c6d7e', 'multiple_choice', '___ it raining outside?', '["Is","Are","Do"]'::jsonb, 'Is', 3),
  ('c2d3e4f5-6a7b-48c9-9d0e-2f3a4b5c6d7e', 'gap_fill', 'We ___ (not / study) at the moment.', null, 'are not studying', 4),
  ('c2d3e4f5-6a7b-48c9-9d0e-2f3a4b5c6d7e', 'transformation', 'Rewrite the sentence as a question: "He is watching TV."', null, 'Is he watching TV?', 5);

-- ----------------------------------------------------------------------------
-- Topic 2: Going to
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, level, slug, title, explanation, order_index) values (
  'd3e4f5a6-7b8c-49d0-9e1f-3a4b5c6d7e8f',
  'A2',
  'going-to',
  'Going to',
  'Konstrukcji "be going to" używamy, aby mówić o planach i zamiarach na przyszłość, które już podjęliśmy, np.: "I am going to visit my grandparents next week."
Używamy jej również, aby przewidywać przyszłość na podstawie tego, co widzimy teraz, np.: "Look at those clouds! It is going to rain."
Zdanie tworzymy za pomocą czasownika "to be" (am/is/are), słowa "going to" oraz czasownika głównego w formie podstawowej, np.: "She is going to study medicine."
Forma "am" łączy się z "I", "is" z "he/she/it", a "are" z "you/we/they", np.: "They are going to move to a new city."
Zdania przeczące tworzymy, dodając "not" po czasowniku "to be", np.: "We are not going to buy a new car." (We aren''t going to buy a new car.)
Pytania tworzymy, przestawiając "to be" przed podmiot, np.: "Are you going to travel this summer?"
"Going to" różni się od Present Continuous tym, że częściej podkreśla intencję i decyzję, a nie samo ustalenie w kalendarzu, choć w wielu sytuacjach obie formy są możliwe.
Przykład pytania o plany: "What are you going to do tonight?"
Możemy też używać "going to" z pierwszą osobą liczby pojedynczej, mówiąc o osobistych zamiarach, np.: "I am going to start a new diet."
W mowie potocznej "going to" często skraca się do "gonna", ale jest to forma nieformalna i nie powinna być używana w pisaniu formalnym.
Warto zapamiętać, że po "going to" zawsze stawiamy czasownik w formie podstawowej, bez końcówki -s ani -ing.',
  2
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('d3e4f5a6-7b8c-49d0-9e1f-3a4b5c6d7e8f', 'gap_fill', 'I ___ (visit) my friend tomorrow.', null, 'am going to visit', 0),
  ('d3e4f5a6-7b8c-49d0-9e1f-3a4b5c6d7e8f', 'gap_fill', 'Look at the sky! It ___ (rain).', null, 'is going to rain', 1),
  ('d3e4f5a6-7b8c-49d0-9e1f-3a4b5c6d7e8f', 'multiple_choice', 'They ___ to buy a new house next year.', '["is going","are going","go"]'::jsonb, 'are going', 2),
  ('d3e4f5a6-7b8c-49d0-9e1f-3a4b5c6d7e8f', 'multiple_choice', '___ you going to travel this summer?', '["Do","Are","Is"]'::jsonb, 'Are', 3),
  ('d3e4f5a6-7b8c-49d0-9e1f-3a4b5c6d7e8f', 'gap_fill', 'She ___ (not / study) abroad next year.', null, 'is not going to study', 4),
  ('d3e4f5a6-7b8c-49d0-9e1f-3a4b5c6d7e8f', 'transformation', 'Rewrite the sentence using "going to": "He plans to buy a new phone."', null, 'He is going to buy a new phone.', 5);

-- ----------------------------------------------------------------------------
-- Topic 3: Stopniowanie przymiotników
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, level, slug, title, explanation, order_index) values (
  'e4f5a6b7-8c9d-4a01-9f2a-4b5c6d7e8f9a',
  'A2',
  'comparatives-superlatives',
  'Stopniowanie przymiotników',
  'Stopniowanie przymiotników pozwala nam porównywać dwie lub więcej rzeczy pod względem jakiejś cechy.
Krótkie przymiotniki (jedno- lub dwusylabowe) tworzą stopień wyższy przez dodanie końcówki "-er", np.: "tall" -> "taller", a stopień najwyższy przez dodanie "the" oraz końcówki "-est", np.: "the tallest".
Przykład zdania: "My brother is taller than me, but my father is the tallest in the family."
Przymiotniki zakończone na "-e" dodają tylko "-r" lub "-st", np.: "nice" -> "nicer" -> "the nicest".
Przymiotniki jednosylabowe zakończone spółgłoską po krótkiej samogłosce podwajają spółgłoskę, np.: "big" -> "bigger" -> "the biggest".
Przymiotniki zakończone na spółgłoskę + "-y" zamieniają "y" na "i" przed dodaniem końcówki, np.: "happy" -> "happier" -> "the happiest".
Dłuższe przymiotniki (zazwyczaj trzy sylaby i więcej) tworzą stopień wyższy za pomocą "more", a najwyższy za pomocą "the most", np.: "expensive" -> "more expensive" -> "the most expensive".
Przykład zdania: "This restaurant is more expensive than that one, but it is the most popular in the city."
W stopniu wyższym używamy słowa "than", aby porównać dwie rzeczy, np.: "This book is more interesting than that film."
Istnieją też przymiotniki nieregularne, które nie stosują się do tych zasad, np.: "good" -> "better" -> "the best", "bad" -> "worse" -> "the worst", "far" -> "farther/further" -> "the farthest/furthest".
Aby powiedzieć, że dwie rzeczy są takie same, używamy konstrukcji "as...as", np.: "She is as tall as her sister."
Warto ćwiczyć stopniowanie na wielu przykładach, ponieważ przymiotniki nieregularne trzeba po prostu zapamiętać.',
  3
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('e4f5a6b7-8c9d-4a01-9f2a-4b5c6d7e8f9a', 'gap_fill', 'This car is ___ (fast) than mine.', null, 'faster', 0),
  ('e4f5a6b7-8c9d-4a01-9f2a-4b5c6d7e8f9a', 'gap_fill', 'Mount Everest is ___ (high) mountain in the world.', null, 'the highest', 1),
  ('e4f5a6b7-8c9d-4a01-9f2a-4b5c6d7e8f9a', 'multiple_choice', 'This film is ___ than the last one.', '["more interesting","interestinger","most interesting"]'::jsonb, 'more interesting', 2),
  ('e4f5a6b7-8c9d-4a01-9f2a-4b5c6d7e8f9a', 'multiple_choice', 'What is the comparative form of "good"?', '["gooder","better","best"]'::jsonb, 'better', 3),
  ('e4f5a6b7-8c9d-4a01-9f2a-4b5c6d7e8f9a', 'gap_fill', 'She is ___ (happy) today than yesterday.', null, 'happier', 4),
  ('e4f5a6b7-8c9d-4a01-9f2a-4b5c6d7e8f9a', 'transformation', 'Rewrite the sentence using the superlative form: "This is a big city. (big, in the country)"', null, 'This is the biggest city in the country.', 5);

-- ----------------------------------------------------------------------------
-- Topic 4: Must / have to
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, level, slug, title, explanation, order_index) values (
  'f5a6b7c8-9d0e-4b12-9a3b-5c6d7e8f9a0b',
  'A2',
  'must-have-to',
  'Must / have to',
  'Czasowników "must" i "have to" używamy, aby mówić o obowiązku, nakazie lub konieczności zrobienia czegoś.
"Must" jest czasownikiem modalnym i ma taką samą formę dla wszystkich osób, po nim czasownik główny występuje w formie podstawowej, np.: "You must wear a seatbelt in the car."
"Must" często wyraża obowiązek wynikający z opinii mówiącego, np.: "I must call my mother today." (uważam, że to konieczne).
"Have to" wyraża obowiązek wynikający z zewnętrznych zasad lub okoliczności, np.: "I have to work on Saturday." (bo tak nakazuje szef lub grafik).
"Have to" odmienia się przez osoby jak zwykły czasownik: "have to" dla I/you/we/they oraz "has to" dla he/she/it, np.: "She has to finish the report by Friday."
Pytania z "have to" tworzymy za pomocą "do/does", np.: "Do you have to work tomorrow?"
Przeczenie "must not" (mustn''t) oznacza zakaz, czyli że czegoś nie wolno robić, np.: "You mustn''t smoke here."
Przeczenie "don''t have to" / "doesn''t have to" oznacza brak konieczności, czyli że coś nie jest obowiązkowe, np.: "You don''t have to come if you are busy."
To bardzo ważna różnica: "mustn''t" to zakaz, a "don''t have to" to brak obowiązku - te dwa wyrażenia nie są synonimami.
Przykład: "You mustn''t park here." (jest to zabronione) w porównaniu do "You don''t have to park here." (możesz, ale nie musisz).
"Have to" jest bardziej naturalne w czasie przeszłym i przyszłym, np.: "I had to study hard for the exam." oraz "We will have to leave early."
Warto zapamiętać oba wyrażenia i ćwiczyć je w kontekście zasad, obowiązków szkolnych i domowych, ponieważ pojawiają się bardzo często w codziennym języku.',
  4
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('f5a6b7c8-9d0e-4b12-9a3b-5c6d7e8f9a0b', 'gap_fill', 'You ___ (must) wear a helmet when you ride a bike.', null, 'must', 0),
  ('f5a6b7c8-9d0e-4b12-9a3b-5c6d7e8f9a0b', 'gap_fill', 'She ___ (have to) finish the report today.', null, 'has to', 1),
  ('f5a6b7c8-9d0e-4b12-9a3b-5c6d7e8f9a0b', 'multiple_choice', 'You ___ tell anyone this secret.', '["mustn''t","don''t have to","doesn''t have to"]'::jsonb, 'mustn''t', 2),
  ('f5a6b7c8-9d0e-4b12-9a3b-5c6d7e8f9a0b', 'multiple_choice', '___ you have to work on Sundays?', '["Must","Do","Does"]'::jsonb, 'Do', 3),
  ('f5a6b7c8-9d0e-4b12-9a3b-5c6d7e8f9a0b', 'gap_fill', 'We ___ (not / have to) pay for the tickets, they are free.', null, 'don''t have to', 4),
  ('f5a6b7c8-9d0e-4b12-9a3b-5c6d7e8f9a0b', 'transformation', 'Rewrite the sentence using "have to": "It is necessary for him to wake up early."', null, 'He has to wake up early.', 5);
