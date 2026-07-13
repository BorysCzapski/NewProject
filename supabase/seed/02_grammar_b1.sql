-- ============================================================================
-- 02_grammar_b1.sql
-- Seed data for B1-level grammar topics and their exercises.
-- Topics use fixed literal UUIDs so grammar_exercises can reference them
-- directly in the same script (no CTEs needed).
-- Idempotent: deleting by level first (cascades to grammar_exercises via FK)
-- means this file can be re-run safely.
-- ============================================================================

-- learning_path_stages reference these topics (FK without cascade) — clear the
-- stages slice first; re-run 03_learning_path.sql afterwards to restore it.
delete from learning_path_stages where language = 'en' and level = 'B1';
delete from grammar_topics where language = 'en' and level = 'B1';

-- ----------------------------------------------------------------------------
-- Topic 0: Present Perfect
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, level, slug, title, explanation, order_index) values (
  'a83d559a-6a97-4bbb-b3a7-7e8286ab202c',
  'B1',
  'present-perfect',
  'Present Perfect',
  'Present Perfect to czas teraźniejszy dokonany, który łączy przeszłość z teraźniejszością - używamy go, gdy czynność miała miejsce w bliżej nieokreślonym momencie w przeszłości, ale jej skutek jest ważny teraz.
Zdanie tworzymy za pomocą czasownika posiłkowego "have" (lub "has" dla he/she/it) oraz trzeciej formy czasownika (Past Participle), np.: "I have finished my homework."
Czasowniki regularne tworzą Past Participle przez dodanie końcówki -ed, tak samo jak w Past Simple, np.: "worked", natomiast czasowniki nieregularne mają swoją trzecią formę do zapamiętania, np. "see" -> "seen", "go" -> "gone".
Przykład zdania: "She has visited Paris three times."
Present Perfect używamy, gdy nie podajemy dokładnego momentu wykonania czynności, np.: "I have lost my keys." - ważne jest to, że teraz nie mam kluczy, a nie kiedy dokładnie je zgubiłem.
Często używamy z tym czasem słów takich jak: just, already, yet, ever, never, since, for, np.: "Have you ever been to Japan?"
"Just" oznacza "właśnie" i informuje, że coś wydarzyło się chwilę temu, np.: "I have just finished my dinner."
"Already" ("już") podkreśla, że coś zostało zrobione wcześniej niż się spodziewano, np.: "She has already sent the email."
"Yet" ("jeszcze", "już") używamy w pytaniach i przeczeniach, zazwyczaj na końcu zdania, np.: "Have you done your homework yet?"
"For" używamy z okresem czasu (for two years), a "since" z konkretnym momentem w czasie (since 2015), np.: "I have lived here for five years." oraz "I have lived here since 2019."
Zdania przeczące tworzymy, dodając "not" po "have/has", np.: "He has not finished the project yet." (He hasn''t finished...)
Pytania tworzymy, przestawiając "have/has" przed podmiot, np.: "Have you ever tried sushi?"
Present Perfect różni się od Past Simple tym, że Past Simple wymaga konkretnego momentu w przeszłości (yesterday, in 2010), a Present Perfect nie podaje dokładnej daty i skupia się na skutku.
Warto porównać: "I went to London last year." (Past Simple, konkretna data) oraz "I have been to London." (Present Perfect, ważny jest fakt bycia tam, nie kiedy).',
  0
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('a83d559a-6a97-4bbb-b3a7-7e8286ab202c', 'gap_fill', 'I ___ (already / finish) my homework.', null, 'have already finished', 0),
  ('a83d559a-6a97-4bbb-b3a7-7e8286ab202c', 'gap_fill', 'She ___ (never / be) to Australia.', null, 'has never been', 1),
  ('a83d559a-6a97-4bbb-b3a7-7e8286ab202c', 'multiple_choice', '___ you ever tried Thai food?', '["Do","Have","Did"]'::jsonb, 'Have', 2),
  ('a83d559a-6a97-4bbb-b3a7-7e8286ab202c', 'multiple_choice', 'They have lived in this city ___ 2015.', '["for","since","ago"]'::jsonb, 'since', 3),
  ('a83d559a-6a97-4bbb-b3a7-7e8286ab202c', 'gap_fill', 'We ___ (not / finish) the project yet.', null, 'have not finished', 4),
  ('a83d559a-6a97-4bbb-b3a7-7e8286ab202c', 'transformation', 'Rewrite the sentence as a question: "He has already left the office."', null, 'Has he already left the office?', 5);

-- ----------------------------------------------------------------------------
-- Topic 1: First Conditional
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, level, slug, title, explanation, order_index) values (
  '1977d3b5-1567-4564-b59c-5a7b98ccfeda',
  'B1',
  'first-conditional',
  'First Conditional',
  'First Conditional (pierwszy tryb warunkowy) używamy, aby mówić o realnych i prawdopodobnych sytuacjach w przyszłości oraz ich konsekwencjach.
Zdanie składa się z dwóch części: zdania warunkowego z "if" w czasie Present Simple oraz zdania głównego z "will" i czasownikiem w formie podstawowej, np.: "If it rains, I will stay at home."
Kolejność zdań można odwrócić - jeśli zdanie z "if" jest na początku, oddzielamy je przecinkiem, np.: "If it rains, I will stay at home.", a jeśli jest na końcu, przecinek nie jest potrzebny: "I will stay at home if it rains."
W zdaniu z "if" NIGDY nie używamy "will" - to częsty błąd uczniów, poprawnie mówimy "If I have time..." a nie "If I will have time...".
Zamiast "will" w zdaniu głównym możemy użyć innych czasowników modalnych, np. "can", "may", "might", w zależności od pewności lub możliwości, np.: "If you study hard, you can pass the exam."
Możemy również użyć trybu rozkazującego w zdaniu głównym, np.: "If you see him, tell him to call me."
Przykład pytania: "What will you do if you miss the train?"
Przeczenie w zdaniu z "if" tworzymy za pomocą "don''t/doesn''t", np.: "If she doesn''t hurry, she will be late."
Przeczenie w zdaniu głównym tworzymy za pomocą "will not" (won''t), np.: "If you don''t study, you won''t pass the exam."
First Conditional różni się od Second Conditional tym, że opisuje sytuacje realne i możliwe, a nie hipotetyczne czy mało prawdopodobne.
Przykład: "If I finish work early, I will call you." - to realna możliwość, którą można spełnić.
Warto ćwiczyć tworzenie zdań warunkowych na różne tematy codzienne, np. pogoda, plany, decyzje, ponieważ ta konstrukcja jest bardzo często używana w naturalnym języku angielskim.',
  1
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('1977d3b5-1567-4564-b59c-5a7b98ccfeda', 'gap_fill', 'If it ___ (rain) tomorrow, we will cancel the picnic.', null, 'rains', 0),
  ('1977d3b5-1567-4564-b59c-5a7b98ccfeda', 'gap_fill', 'She will be very happy if you ___ (come) to her party.', null, 'come', 1),
  ('1977d3b5-1567-4564-b59c-5a7b98ccfeda', 'multiple_choice', 'If you ___ hard, you will pass the exam.', '["study","studies","will study"]'::jsonb, 'study', 2),
  ('1977d3b5-1567-4564-b59c-5a7b98ccfeda', 'multiple_choice', 'If it does not rain, we ___ go to the beach.', '["go","will go","went"]'::jsonb, 'will go', 3),
  ('1977d3b5-1567-4564-b59c-5a7b98ccfeda', 'gap_fill', 'If I ___ (not / hurry), I will miss the bus.', null, 'do not hurry', 4),
  ('1977d3b5-1567-4564-b59c-5a7b98ccfeda', 'transformation', 'Rewrite using the First Conditional: "Maybe it will rain. In that case, we will stay at home."', null, 'If it rains, we will stay at home.', 5);

-- ----------------------------------------------------------------------------
-- Topic 2: Second Conditional
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, level, slug, title, explanation, order_index) values (
  '8de8f4c2-7ca4-4b26-aab8-9e7ff9d13472',
  'B1',
  'second-conditional',
  'Second Conditional',
  'Second Conditional (drugi tryb warunkowy) używamy, aby mówić o sytuacjach hipotetycznych, nierealnych lub mało prawdopodobnych w teraźniejszości lub przyszłości.
Zdanie składa się z dwóch części: zdania z "if" w czasie Past Simple oraz zdania głównego z "would" i czasownikiem w formie podstawowej, np.: "If I had more money, I would buy a new car."
Mimo że używamy czasu przeszłego po "if", zdanie NIE odnosi się do przeszłości - opisuje sytuację wyimaginowaną w teraźniejszości lub przyszłości.
Z czasownikiem "to be" w zdaniu z "if" często używamy formy "were" dla wszystkich osób, także dla "I", "he", "she", "it", np.: "If I were you, I would apologize."
Konstrukcja "If I were you..." jest bardzo popularna, gdy dajemy komuś radę, np.: "If I were you, I would talk to her."
Zamiast "would" w zdaniu głównym możemy użyć "could" (możliwość) lub "might" (mniejsza pewność), np.: "If I had more time, I could learn another language."
Kolejność zdań można odwrócić, tak jak w First Conditional, np.: "I would travel more if I had more money." lub "If I had more money, I would travel more."
Przeczenie w zdaniu z "if" tworzymy za pomocą "didn''t", np.: "If she didn''t work so much, she would have more free time."
Przeczenie w zdaniu głównym tworzymy za pomocą "would not" (wouldn''t), np.: "If it weren''t so cold, I wouldn''t wear a jacket."
Second Conditional różni się od First Conditional tym, że opisuje sytuacje mniej realne, wyimaginowane, a nie prawdopodobne, np. porównaj: "If I win the lottery, I will buy a house." (realne, First Conditional) i "If I won the lottery, I would buy a house." (mniej realne, marzenie, Second Conditional).
Przykład pytania: "What would you do if you found a wallet on the street?"
Warto ćwiczyć ten czas, wyobrażając sobie różne nierealne sytuacje, np. wygraną na loterii, zmianę pracy czy podróż dookoła świata.',
  2
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('8de8f4c2-7ca4-4b26-aab8-9e7ff9d13472', 'gap_fill', 'If I ___ (have) a lot of money, I would travel around the world.', null, 'had', 0),
  ('8de8f4c2-7ca4-4b26-aab8-9e7ff9d13472', 'gap_fill', 'If she ___ (be) you, she would accept the job offer.', null, 'were', 1),
  ('8de8f4c2-7ca4-4b26-aab8-9e7ff9d13472', 'multiple_choice', 'If I won the lottery, I ___ buy a big house.', '["will","would","would have"]'::jsonb, 'would', 2),
  ('8de8f4c2-7ca4-4b26-aab8-9e7ff9d13472', 'multiple_choice', 'What would you do if you ___ a ghost?', '["see","saw","seen"]'::jsonb, 'saw', 3),
  ('8de8f4c2-7ca4-4b26-aab8-9e7ff9d13472', 'gap_fill', 'If it ___ (not / rain) so much, we would go for a walk.', null, 'did not rain', 4),
  ('8de8f4c2-7ca4-4b26-aab8-9e7ff9d13472', 'transformation', 'Rewrite using the Second Conditional: "I do not have wings, so I cannot fly."', null, 'If I had wings, I would fly.', 5);

-- ----------------------------------------------------------------------------
-- Topic 3: Strona bierna (podstawy)
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, level, slug, title, explanation, order_index) values (
  '48353ae1-cf70-44ff-b3cc-2a8bdf56083b',
  'B1',
  'passive-voice-basics',
  'Strona bierna (podstawy)',
  'Strony biernej (Passive Voice) używamy, gdy ważniejsze jest to, co się dzieje z osobą lub rzeczą, a nie kto wykonuje daną czynność, albo gdy wykonawca czynności jest nieznany lub nieistotny.
Zdanie w stronie biernej tworzymy za pomocą odpowiedniej formy czasownika "to be" oraz trzeciej formy czasownika głównego (Past Participle), np.: "The letter was written by John."
W stronie czynnej mówimy: "John wrote the letter.", a w stronie biernej podmiotem zdania staje się przedmiot czynności: "The letter was written by John."
Forma czasownika "to be" zależy od czasu gramatycznego zdania, np. w Present Simple używamy "is/are", a w Past Simple "was/were", np.: "The house is cleaned every week." oraz "The house was cleaned yesterday."
Strony biernej często używamy, gdy nie znamy wykonawcy czynności lub jest on oczywisty z kontekstu, np.: "My phone was stolen." (nie wiemy, kto ukradł).
Jeśli chcemy podać wykonawcę czynności, używamy "by", np.: "This song was written by a famous composer."
Strona bierna jest bardzo popularna w języku formalnym, naukowym i dziennikarskim, np. w wiadomościach: "The bridge was built in 1990." lub "Millions of dollars are spent on advertising every year."
Pytania w stronie biernej tworzymy, przestawiając czasownik "to be" przed podmiot, np.: "Was this book written by Shakespeare?"
Przeczenia tworzymy, dodając "not" po czasowniku "to be", np.: "The email was not sent on time." (wasn''t sent)
Strona bierna w czasie Present Continuous wygląda następująco: "is/are being" + Past Participle, np.: "The car is being repaired right now."
Warto pamiętać, że tylko czasowniki przechodnie (te, które mają dopełnienie) mogą występować w stronie biernej, ponieważ potrzebujemy przedmiotu, który stanie się nowym podmiotem zdania.
Ćwicząc stronę bierną, warto zwracać uwagę na to, w jakim czasie jest zdanie wyjściowe, aby poprawnie dobrać formę czasownika "to be".',
  3
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('48353ae1-cf70-44ff-b3cc-2a8bdf56083b', 'gap_fill', 'This house ___ (build) in 1990.', null, 'was built', 0),
  ('48353ae1-cf70-44ff-b3cc-2a8bdf56083b', 'gap_fill', 'English ___ (speak) all over the world.', null, 'is spoken', 1),
  ('48353ae1-cf70-44ff-b3cc-2a8bdf56083b', 'multiple_choice', 'The letter ___ by my sister yesterday.', '["was written","were written","is written"]'::jsonb, 'was written', 2),
  ('48353ae1-cf70-44ff-b3cc-2a8bdf56083b', 'multiple_choice', 'Active: "They clean the office every day." Choose the correct passive form: "The office ___ every day."', '["is cleaned","was cleaned","cleans"]'::jsonb, 'is cleaned', 3),
  ('48353ae1-cf70-44ff-b3cc-2a8bdf56083b', 'gap_fill', 'The windows ___ (not / clean) last week.', null, 'were not cleaned', 4),
  ('48353ae1-cf70-44ff-b3cc-2a8bdf56083b', 'transformation', 'Rewrite in the passive voice: "Someone stole my bike last night."', null, 'My bike was stolen last night.', 5);

-- ----------------------------------------------------------------------------
-- Topic 4: Mowa zależna (podstawy)
-- ----------------------------------------------------------------------------
insert into grammar_topics (id, level, slug, title, explanation, order_index) values (
  '3286c06d-6383-4b9a-b5d0-5162b69c8987',
  'B1',
  'reported-speech-basics',
  'Mowa zależna (podstawy)',
  'Mowa zależna (Reported Speech) służy do przekazywania czyichś słów bez cytowania ich dokładnie, czyli "z drugiej ręki".
W mowie zależnej zazwyczaj zmieniamy czas czasownika o jeden stopień "do tyłu" w porównaniu do mowy niezależnej, ponieważ raportujemy coś, co zostało powiedziane wcześniej.
Present Simple zmienia się na Past Simple, np.: bezpośrednio "I like coffee." staje się w mowie zależnej "She said (that) she liked coffee."
Present Continuous zmienia się na Past Continuous, np.: "I am working." -> "He said he was working."
Present Perfect zmienia się na Past Perfect, np.: "I have finished." -> "She said she had finished."
Past Simple zmienia się zazwyczaj na Past Perfect, np.: "I visited Paris." -> "He said he had visited Paris."
Czasowniki modalne również się zmieniają: "will" -> "would", "can" -> "could", "must" -> "had to", np.: "I will help you." -> "She said she would help me."
W mowie zależnej musimy też zmieniać zaimki osobowe i dzierżawcze, aby zdanie miało sens z perspektywy osoby raportującej, np.: "I love my job." -> "He said he loved his job."
Zmieniają się także określenia czasu i miejsca, np. "today" -> "that day", "tomorrow" -> "the next day", "here" -> "there", "this" -> "that", np.: "I will call you tomorrow." -> "She said she would call me the next day."
Do wprowadzenia mowy zależnej najczęściej używamy czasowników "say" i "tell" - "tell" zawsze wymaga podania osoby (tell someone), a "say" nie, np.: "He said that he was tired." oraz "He told me that he was tired."
Pytania w mowie zależnej tracą szyk pytający i inwersję - budujemy je jak zwykłe zdanie twierdzące, wprowadzone przez "if/whether" (pytania ogólne) lub słowo pytające (pytania szczegółowe), np.: "Where do you live?" -> "She asked me where I lived."
Warto ćwiczyć mowę zależną na krótkich dialogach, zwracając uwagę zarówno na zmianę czasu, jak i zaimków oraz określeń czasu.',
  4
);

insert into grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ('3286c06d-6383-4b9a-b5d0-5162b69c8987', 'gap_fill', 'Direct: "I am tired." Reported: She said (that) she ___ tired.', null, 'was', 0),
  ('3286c06d-6383-4b9a-b5d0-5162b69c8987', 'gap_fill', 'Direct: "I will call you tomorrow." Reported: He said he ___ call me the next day.', null, 'would', 1),
  ('3286c06d-6383-4b9a-b5d0-5162b69c8987', 'multiple_choice', 'Direct: "I have finished my homework." Reported: She said she ___ her homework.', '["has finished","had finished","finished"]'::jsonb, 'had finished', 2),
  ('3286c06d-6383-4b9a-b5d0-5162b69c8987', 'multiple_choice', 'Direct: "Where do you live?" Reported: He asked me ___.', '["where do I live","where I lived","where did I live"]'::jsonb, 'where I lived', 3),
  ('3286c06d-6383-4b9a-b5d0-5162b69c8987', 'gap_fill', 'Direct: "I can swim very well." Reported: She said she ___ swim very well.', null, 'could', 4),
  ('3286c06d-6383-4b9a-b5d0-5162b69c8987', 'transformation', 'Rewrite in reported speech: He said, "I am learning English."', null, 'He said (that) he was learning English.', 5);
