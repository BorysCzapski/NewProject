-- ============================================================================
-- supabase/seed/matura/11_grammar_podstawowa.sql
-- Grammar THEORY for poziom podstawowy (matura_grammar_topics +
-- matura_grammar_exercises) — the actual scope a B1-level student is tested
-- on, per CKE's Informator (which ties scope to ESOKJ/CEFR B1 rather than a
-- rigid checklist) cross-checked against prep-site consensus lists. blocks
-- are jsonb GrammarBlock[] (lib/grammar/lesson-blocks.ts), rendered by the
-- same GrammarLesson component Linguo uses.
--
-- Idempotent: deletes existing topics for this level first (cascades to
-- their exercises). Run 01_sections.sql first is NOT required — these
-- topics aren't tied to matura_sections, they're their own top-level area
-- (see app/(main)/matura/nauka/gramatyka/).
-- ============================================================================

delete from matura_grammar_topics where level = 'podstawowa';

-- ----------------------------------------------------------------------------
-- 1. Czasy teraźniejsze
-- ----------------------------------------------------------------------------
insert into matura_grammar_topics (level, slug, title, blocks, order_index) values (
  'podstawowa', 'czasy-terazniejsze', 'Czasy teraźniejsze: Present Simple, Continuous, Perfect',
  $b$[
  {"type": "intro", "text": "Na maturze podstawowej musisz swobodnie rozróżniać cztery czasy teraźniejsze. Największym wyzwaniem nie jest budowa zdań, tylko wybór WŁAŚCIWEGO czasu do sytuacji."},
  {"type": "table", "title": "Kiedy którego używać", "headers": ["Czas", "Kiedy używamy", "Sygnały czasowe", "Przykład"], "rows": [
    ["Present Simple", "stałe fakty, nawyki, harmonogramy", "always, usually, every day, on Mondays", "She works in a bank."],
    ["Present Continuous", "czynności trwające teraz lub tymczasowe", "now, at the moment, these days", "She is working from home this week."],
    ["Present Perfect", "doświadczenia bez podanego czasu, skutek widoczny teraz", "ever, never, just, already, yet, since, for", "She has worked here for five years."],
    ["Present Perfect Continuous", "czynność trwająca od jakiegoś czasu — podkreśla DŁUGOŚĆ trwania", "for, since, how long", "She has been working here since 2019."]
  ]},
  {"type": "examples", "title": "Kontrast: nawyk vs. chwila obecna", "items": [
    {"en": "I read a book every evening.", "pl": "Codziennie wieczorem czytam książkę (nawyk).", "highlight": "read"},
    {"en": "I am reading a really interesting book right now.", "pl": "Właśnie teraz czytam naprawdę ciekawą książkę.", "highlight": "am reading"},
    {"en": "I have already seen this film.", "pl": "Już widziałem ten film (nieważne kiedy).", "highlight": "have already seen"},
    {"en": "I saw this film last Friday.", "pl": "Widziałem ten film w zeszły piątek (konkretny czas).", "highlight": "saw"}
  ]},
  {"type": "tip", "variant": "warning", "text": "Najczęstszy błąd: używanie Present Simple zamiast Present Continuous dla czynności dziejącej się TERAZ. Present Simple to nawyk (I play tennis every week), Present Continuous to chwila obecna (I am playing tennis right now)."},
  {"type": "tip", "variant": "tip", "text": "Present Perfect NIGDY nie łączy się z konkretnym czasem przeszłym (yesterday, last week, in 2020) — jeśli podajesz KIEDY coś się stało, użyj Past Simple."},
  {"type": "quiz", "question": "She ___ (live) in Warsaw for three years.", "options": ["lives", "is living", "has lived", "lived"], "correctIndex": 2, "explanation": "Present Perfect + for = czynność trwająca od przeszłości do teraz."}
]$b$::jsonb,
  1
);

insert into matura_grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ((select id from matura_grammar_topics where level='podstawowa' and slug='czasy-terazniejsze'), 'gap_fill', 'Complete: I ___ (not / see) my cousin since Christmas.', null, 'haven''t seen', 1),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='czasy-terazniejsze'), 'multiple_choice', 'Look! It ___ outside.', '["rains", "is raining", "has rained", "rained"]'::jsonb, 'is raining', 2),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='czasy-terazniejsze'), 'gap_fill', 'My brother ___ (work) as a chef for ten years now.', null, 'has worked', 3),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='czasy-terazniejsze'), 'transformation', 'Rewrite using Present Perfect Continuous: She started cooking two hours ago and she is still cooking.', null, 'She has been cooking for two hours.', 4);

-- ----------------------------------------------------------------------------
-- 2. Czasy przeszłe
-- ----------------------------------------------------------------------------
insert into matura_grammar_topics (level, slug, title, blocks, order_index) values (
  'podstawowa', 'czasy-przeszle', 'Czasy przeszłe: Past Simple, Continuous, Perfect',
  $b$[
  {"type": "intro", "text": "Trzy czasy przeszłe pozwalają precyzyjnie ustawić zdarzenia w czasie względem siebie — kluczowe w opowiadaniu historii, częstym elemencie zarówno czytania, jak i pisania na maturze."},
  {"type": "table", "title": "Kiedy którego używać", "headers": ["Czas", "Kiedy używamy", "Sygnały czasowe", "Przykład"], "rows": [
    ["Past Simple", "zakończone zdarzenie w konkretnym momencie przeszłości", "yesterday, last week, in 2020, ago", "She called me yesterday."],
    ["Past Continuous", "czynność trwająca w danym momencie przeszłości (często przerwana)", "while, when, at 8 o'clock yesterday", "I was cooking dinner when she called."],
    ["Past Perfect", "czynność wcześniejsza od innej czynności przeszłej", "before, after, already, by the time", "The train had already left when we arrived."]
  ]},
  {"type": "examples", "title": "Kolejność zdarzeń", "items": [
    {"en": "I was watching TV when the phone rang.", "pl": "Oglądałem telewizję, gdy zadzwonił telefon (dwa zdarzenia jednocześnie).", "highlight": "was watching"},
    {"en": "I had already left the house when it started raining.", "pl": "Już wyszedłem z domu, zanim zaczęło padać (jedno zdarzenie WCZEŚNIEJSZE).", "highlight": "had already left"}
  ]},
  {"type": "tip", "variant": "tip", "text": "Past Perfect to 'wcześniejsza z dwóch przeszłości' — używasz go tylko wtedy, gdy w zdaniu (lub kontekście) jest DRUGIE zdarzenie przeszłe, względem którego to pierwsze było wcześniejsze."},
  {"type": "tip", "variant": "warning", "text": "Nie myl Past Continuous z Present Continuous — sygnałem jest kontekst czasowy (yesterday, when I was young), nie sama forma '-ing'."},
  {"type": "quiz", "question": "By the time we got to the cinema, the film ___.", "options": ["already started", "was already starting", "had already started", "has already started"], "correctIndex": 2, "explanation": "Zdarzenie (rozpoczęcie filmu) było wcześniejsze od innego zdarzenia przeszłego (dotarcia do kina) — Past Perfect."}
]$b$::jsonb,
  2
);

insert into matura_grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ((select id from matura_grammar_topics where level='podstawowa' and slug='czasy-przeszle'), 'gap_fill', 'While I ___ (walk) home, it started to rain.', null, 'was walking', 1),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='czasy-przeszle'), 'multiple_choice', 'She ___ her keys, so she couldn''t get into the flat.', '["lost", "was losing", "had lost", "has lost"]'::jsonb, 'had lost', 2),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='czasy-przeszle'), 'gap_fill', 'We ___ (visit) my grandparents last weekend.', null, 'visited', 3),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='czasy-przeszle'), 'transformation', 'Rewrite using Past Perfect: First the guests left. Then we cleaned the kitchen.', null, 'After the guests had left, we cleaned the kitchen.', 4);

-- ----------------------------------------------------------------------------
-- 3. Formy przyszłości
-- ----------------------------------------------------------------------------
insert into matura_grammar_topics (level, slug, title, blocks, order_index) values (
  'podstawowa', 'czas-przyszly', 'Formy przyszłości: will, going to, Present Continuous',
  $b$[
  {"type": "intro", "text": "Angielski ma kilka sposobów mówienia o przyszłości — wybór zależy od tego, czy decyzja jest spontaniczna, zaplanowana, czy chodzi o ustalony harmonogram."},
  {"type": "compare", "title": "Trzy formy przyszłości", "columns": [
    {"title": "will", "whenToUse": "spontaniczna decyzja podjęta w chwili mówienia, przewidywania, obietnice", "examples": ["I'm thirsty. I'll get some water.", "I think it will rain tomorrow.", "I'll help you with that."]},
    {"title": "going to", "whenToUse": "plan podjęty wcześniej, przewidywanie na podstawie widocznych oznak", "examples": ["I'm going to study medicine next year.", "Look at those clouds — it's going to rain."]},
    {"title": "Present Continuous", "whenToUse": "ustalony termin, konkretna organizacja (bilety, umówione spotkanie)", "examples": ["I'm meeting Sarah at 6 pm tomorrow.", "We're flying to Spain on Friday."]}
  ]},
  {"type": "tip", "variant": "warning", "text": "Typowy błąd: użycie 'will' zamiast 'going to' dla planu podjętego wcześniej. 'I will study medicine' brzmi jak decyzja podjęta W TEJ CHWILI, a nie plan na przyszły rok — poprawnie: 'I'm going to study medicine.'"},
  {"type": "quiz", "question": "A: 'Why do you have your suitcase?' B: 'We ___ to Rome tomorrow morning.'", "options": ["will fly", "are going to fly", "are flying", "fly"], "correctIndex": 2, "explanation": "Ustalony, zaplanowany termin z konkretnymi ustaleniami (bilet, godzina) — Present Continuous."}
]$b$::jsonb,
  3
);

insert into matura_grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ((select id from matura_grammar_topics where level='podstawowa' and slug='czas-przyszly'), 'multiple_choice', 'Careful, that plate is going to fall — it ___ right off the table!', '["will fall", "is falling", "falls", "is going to fall"]'::jsonb, 'is going to fall', 1),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='czas-przyszly'), 'gap_fill', 'A: The phone is ringing. B: I ___ (get) it!', null, 'will get', 2),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='czas-przyszly'), 'gap_fill', 'We ___ (have) a party next Saturday — I''ve already sent the invitations.', null, 'are having', 3),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='czas-przyszly'), 'transformation', 'Rewrite as a spontaneous offer using will: I promise to carry your bag.', null, 'I will carry your bag.', 4);

-- ----------------------------------------------------------------------------
-- 4. Czasowniki modalne
-- ----------------------------------------------------------------------------
insert into matura_grammar_topics (level, slug, title, blocks, order_index) values (
  'podstawowa', 'czasowniki-modalne', 'Czasowniki modalne: umiejętności, obowiązki, przypuszczenia',
  $b$[
  {"type": "intro", "text": "Czasowniki modalne (can, must, should...) wyrażają umiejętność, obowiązek, pozwolenie lub przypuszczenie — nie odmieniają się i po nich zawsze stoi bezokolicznik bez 'to' (z wyjątkiem 'have to' i 'ought to')."},
  {"type": "table", "title": "Najważniejsze czasowniki modalne", "headers": ["Czasownik", "Znaczenie", "Przykład"], "rows": [
    ["can / could", "umiejętność, pozwolenie (could = przeszłość/grzeczniejsza forma)", "She can speak three languages."],
    ["must", "silny obowiązek (wynikający z przekonania mówiącego)", "You must wear a seatbelt."],
    ["have to", "obowiązek wynikający z zewnętrznych zasad/przepisów", "I have to work on Saturdays this month."],
    ["should / ought to", "rada, sugestia", "You should see a doctor."],
    ["needn't / don't have to", "brak konieczności (nie to samo co zakaz!)", "You needn't bring anything, we have everything."],
    ["may / might", "przypuszczenie, formalne pozwolenie", "It might rain later."],
    ["used to", "nawyk/stan z przeszłości, którego już nie ma", "I used to live in Kraków."]
  ]},
  {"type": "tip", "variant": "warning", "text": "'must not' (zakaz — nie wolno) to zupełnie co innego niż 'needn't'/'don't have to' (brak konieczności — nie trzeba, ale można). To jedna z najczęstszych pułapek na maturze."},
  {"type": "examples", "title": "must vs. have to", "items": [
    {"en": "I must finish this essay tonight.", "pl": "Muszę skończyć to wypracowanie dziś wieczorem (moja własna decyzja/przekonanie).", "highlight": "must"},
    {"en": "I have to wear a uniform at school.", "pl": "Muszę nosić mundurek w szkole (zasada narzucona z zewnątrz).", "highlight": "have to"}
  ]},
  {"type": "quiz", "question": "You ___ smoke here — it's strictly forbidden.", "options": ["needn't", "don't have to", "mustn't", "shouldn't"], "correctIndex": 2, "explanation": "Zakaz — 'mustn't' oznacza, że coś jest niedozwolone."}
]$b$::jsonb,
  4
);

insert into matura_grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ((select id from matura_grammar_topics where level='podstawowa' and slug='czasowniki-modalne'), 'multiple_choice', 'You ___ bring your own towel — the hotel provides them for free.', '["mustn''t", "needn''t", "can''t", "shouldn''t"]'::jsonb, 'needn''t', 1),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='czasowniki-modalne'), 'gap_fill', 'When I was a child, I ___ (use) to be afraid of the dark.', null, 'used', 2),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='czasowniki-modalne'), 'gap_fill', 'She ___ (can, negative) come to the party because she is ill.', null, 'can''t', 3),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='czasowniki-modalne'), 'transformation', 'Rewrite giving advice with should: It is a good idea for you to apologise.', null, 'You should apologise.', 4);

-- ----------------------------------------------------------------------------
-- 5. Strona bierna
-- ----------------------------------------------------------------------------
insert into matura_grammar_topics (level, slug, title, blocks, order_index) values (
  'podstawowa', 'strona-bierna', 'Strona bierna (Passive Voice) — podstawy',
  $b$[
  {"type": "intro", "text": "Strony biernej używamy, gdy wykonawca czynności jest nieznany, nieważny albo oczywisty z kontekstu — skupiamy się na tym, CO się stało, nie KTO to zrobił. Budowa: be + III forma czasownika (Past Participle)."},
  {"type": "table", "title": "Strona bierna w podstawowych czasach", "headers": ["Czas (strona czynna)", "Strona bierna", "Przykład"], "rows": [
    ["Present Simple", "am/is/are + III forma", "English is spoken all over the world."],
    ["Past Simple", "was/were + III forma", "This house was built in 1990."],
    ["Present Perfect", "has/have been + III forma", "The email has already been sent."],
    ["Future Simple", "will be + III forma", "The results will be announced tomorrow."],
    ["z czasownikiem modalnym", "modal + be + III forma", "This form must be signed by a parent."]
  ]},
  {"type": "examples", "title": "Czynna vs. bierna", "items": [
    {"en": "Someone stole my bike yesterday.", "pl": "Ktoś ukradł mi wczoraj rower (znamy/nie znamy wykonawcy, ale mówimy o nim).", "highlight": "stole"},
    {"en": "My bike was stolen yesterday.", "pl": "Mój rower został wczoraj skradziony (skupiamy się na rowerze, nie na złodzieju).", "highlight": "was stolen"}
  ]},
  {"type": "tip", "variant": "tip", "text": "Jeśli chcesz jednak wspomnieć wykonawcę w stronie biernej, użyj 'by': 'The Mona Lisa was painted by Leonardo da Vinci.'"},
  {"type": "quiz", "question": "This bridge ___ in the 19th century.", "options": ["built", "was built", "has built", "is building"], "correctIndex": 1, "explanation": "Strona bierna w Past Simple: was/were + III forma."}
]$b$::jsonb,
  5
);

insert into matura_grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ((select id from matura_grammar_topics where level='podstawowa' and slug='strona-bierna'), 'gap_fill', 'Rewrite in passive: They clean this office every evening. → This office ___ (clean) every evening.', null, 'is cleaned', 1),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='strona-bierna'), 'multiple_choice', 'The new stadium ___ next year.', '["will open", "will be opened", "opens", "is opening"]'::jsonb, 'will be opened', 2),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='strona-bierna'), 'gap_fill', 'This letter ___ (write) by my grandmother in 1965.', null, 'was written', 3),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='strona-bierna'), 'transformation', 'Rewrite in passive: Somebody has cancelled the flight.', null, 'The flight has been cancelled.', 4);

-- ----------------------------------------------------------------------------
-- 6. Tryby warunkowe
-- ----------------------------------------------------------------------------
insert into matura_grammar_topics (level, slug, title, blocks, order_index) values (
  'podstawowa', 'tryby-warunkowe', 'Tryby warunkowe: Zero, First, Second Conditional',
  $b$[
  {"type": "intro", "text": "Zdania warunkowe opisują skutek pewnego warunku. Trzy podstawowe typy różnią się tym, JAK PRAWDOPODOBNY jest ten warunek."},
  {"type": "compare", "title": "Trzy typy zdań warunkowych", "columns": [
    {"title": "Zero Conditional", "formula": "If + Present Simple, ... Present Simple", "whenToUse": "fakty ogólne, prawa natury — zawsze prawdziwe", "examples": ["If you heat ice, it melts.", "If it rains, the grass gets wet."]},
    {"title": "First Conditional", "formula": "If + Present Simple, ... will + bezokolicznik", "whenToUse": "realny, prawdopodobny warunek dotyczący przyszłości", "examples": ["If it rains tomorrow, we will stay at home.", "If you study hard, you will pass the exam."]},
    {"title": "Second Conditional", "formula": "If + Past Simple, ... would + bezokolicznik", "whenToUse": "warunek nierealny lub mało prawdopodobny (teraźniejszość/przyszłość)", "examples": ["If I won the lottery, I would travel the world.", "If I were you, I would apologise."]}
  ]},
  {"type": "tip", "variant": "warning", "text": "Nigdy nie używaj 'will' w zdaniu warunkowym (po 'if') — to jeden z najczęstszych błędów. Poprawnie: 'If it rains, we will stay home', NIE 'If it will rain...'."},
  {"type": "tip", "variant": "tip", "text": "W Second Conditional z czasownikiem 'be' formalnie używa się 'were' dla wszystkich osób (If I were you...), choć w mowie potocznej 'was' też się zdarza."},
  {"type": "quiz", "question": "If I ___ more free time, I would learn to play the guitar.", "options": ["have", "had", "will have", "would have"], "correctIndex": 1, "explanation": "Second Conditional: If + Past Simple, ... would + bezokolicznik."}
]$b$::jsonb,
  6
);

insert into matura_grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ((select id from matura_grammar_topics where level='podstawowa' and slug='tryby-warunkowe'), 'gap_fill', 'If you ___ (not / hurry), you will miss the bus.', null, 'don''t hurry', 1),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='tryby-warunkowe'), 'multiple_choice', 'Water ___ at 100 degrees Celsius.', '["boils", "will boil", "would boil", "boiled"]'::jsonb, 'boils', 2),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='tryby-warunkowe'), 'gap_fill', 'If I ___ (be) you, I would talk to her about it.', null, 'were', 3),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='tryby-warunkowe'), 'transformation', 'Rewrite as a First Conditional sentence: Maybe it will be sunny tomorrow. In that case, we will go to the beach.', null, 'If it is sunny tomorrow, we will go to the beach.', 4);

-- ----------------------------------------------------------------------------
-- 7. Mowa zależna
-- ----------------------------------------------------------------------------
insert into matura_grammar_topics (level, slug, title, blocks, order_index) values (
  'podstawowa', 'mowa-zalezna', 'Mowa zależna (Reported Speech) — podstawy',
  $b$[
  {"type": "intro", "text": "Mowy zależnej używamy, gdy relacjonujemy czyjąś wypowiedź, nie cytując jej dosłownie. Zazwyczaj czas w zdaniu 'cofa się' o jeden krok wstecz (tzw. backshift)."},
  {"type": "table", "title": "Przesunięcie czasu (backshift)", "headers": ["Mowa niezależna", "Mowa zależna"], "rows": [
    ["Present Simple: 'I work here.'", "Past Simple: He said (that) he worked there."],
    ["Present Continuous: 'I am working.'", "Past Continuous: He said he was working."],
    ["Present Perfect: 'I have finished.'", "Past Perfect: He said he had finished."],
    ["Past Simple: 'I worked.'", "Past Perfect: He said he had worked."],
    ["will: 'I will call you.'", "would: He said he would call me."],
    ["can: 'I can help.'", "could: He said he could help."]
  ]},
  {"type": "examples", "title": "Pytania i polecenia w mowie zależnej", "items": [
    {"en": "Direct: Where do you live? / Reported: She asked where I lived.", "pl": "Pytanie szczegółowe: szyk zdania TWIERDZĄCEGO, bez znaku zapytania.", "highlight": "where I lived"},
    {"en": "Direct: Are you tired? / Reported: She asked if I was tired.", "pl": "Pytanie ogólne (tak/nie): dodajemy 'if' albo 'whether'.", "highlight": "if I was tired"},
    {"en": "Direct: Close the door. / Reported: He told me to close the door.", "pl": "Polecenie: tell somebody + to + bezokolicznik.", "highlight": "told me to close"}
  ]},
  {"type": "tip", "variant": "warning", "text": "W pytaniach zależnych NIE stosujemy inwersji ani znaku zapytania — 'She asked where I lived', NIE 'She asked where did I live'."},
  {"type": "quiz", "question": "Direct: I will finish it tomorrow, she said. Reported: She said ___.", "options": ["she will finish it tomorrow", "she would finish it the next day", "she finished it tomorrow", "she has finished it tomorrow"], "correctIndex": 1, "explanation": "will → would, a 'tomorrow' zmienia się na 'the next day', bo perspektywa czasowa się przesunęła."}
]$b$::jsonb,
  7
);

insert into matura_grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ((select id from matura_grammar_topics where level='podstawowa' and slug='mowa-zalezna'), 'transformation', 'Report this sentence: "I am tired," he said.', null, 'He said he was tired.', 1),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='mowa-zalezna'), 'transformation', 'Report this question: "Where is the station?" she asked.', null, 'She asked where the station was.', 2),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='mowa-zalezna'), 'gap_fill', 'He told me ___ (not / be) late.', null, 'not to be', 3),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='mowa-zalezna'), 'multiple_choice', 'Direct: "Can you help me?" Reported: She asked if I ___ help her.', '["can", "could", "will", "would"]'::jsonb, 'could', 4);

-- ----------------------------------------------------------------------------
-- 8. Życzenia i rady
-- ----------------------------------------------------------------------------
insert into matura_grammar_topics (level, slug, title, blocks, order_index) values (
  'podstawowa', 'zyczenia-i-rady', 'Życzenia i rady: wish, had better',
  $b$[
  {"type": "intro", "text": "Konstrukcja 'wish' pozwala wyrazić żal albo pragnienie, żeby coś było inaczej niż jest — forma czasownika zależy od tego, czy żal dotyczy teraźniejszości czy przeszłości."},
  {"type": "table", "title": "wish + różne czasy", "headers": ["Konstrukcja", "Kiedy używamy", "Przykład"], "rows": [
    ["wish + Past Simple", "żal dot. TERAŹNIEJSZOŚCI — chcielibyśmy, żeby coś było inaczej teraz", "I wish I had more free time. (ale nie mam)"],
    ["wish + Past Perfect", "żal dot. PRZESZŁOŚCI — chcielibyśmy cofnąć czas", "I wish I had studied harder for the exam. (ale nie uczyłem się)"],
    ["wish + would", "irytacja czyimś zachowaniem, które chcielibyśmy zmienić", "I wish you would stop interrupting me."],
    ["had better", "silna rada, często z ostrzeżeniem o konsekwencjach", "You had better see a doctor, or your cough will get worse."]
  ]},
  {"type": "tip", "variant": "warning", "text": "Po 'wish' dotyczącym teraźniejszości NIGDY nie używamy Present Simple — 'I wish I have a car' jest błędne, poprawnie: 'I wish I had a car.'"},
  {"type": "quiz", "question": "I wish I ___ (know) the answer yesterday, but I had no idea.", "options": ["knew", "know", "had known", "would know"], "correctIndex": 2, "explanation": "Żal dotyczy PRZESZŁOŚCI (yesterday) — wish + Past Perfect."}
]$b$::jsonb,
  8
);

insert into matura_grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ((select id from matura_grammar_topics where level='podstawowa' and slug='zyczenia-i-rady'), 'gap_fill', 'I wish I ___ (can) speak French fluently.', null, 'could', 1),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='zyczenia-i-rady'), 'multiple_choice', 'You had better ___ an umbrella — it looks like rain.', '["take", "to take", "taking", "took"]'::jsonb, 'take', 2),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='zyczenia-i-rady'), 'gap_fill', 'I wish I ___ (not / lose) my phone last week.', null, 'hadn''t lost', 3),
  ((select id from matura_grammar_topics where level='podstawowa' and slug='zyczenia-i-rady'), 'transformation', 'Rewrite expressing a wish: I regret that I don''t have a bigger flat.', null, 'I wish I had a bigger flat.', 4);
