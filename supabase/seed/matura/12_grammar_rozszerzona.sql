-- ============================================================================
-- supabase/seed/matura/12_grammar_rozszerzona.sql
-- Grammar THEORY for poziom rozszerzony — the ADDITIONS on top of podstawowa
-- (see 11_grammar_podstawowa.sql), per CKE's B2-level scope: extra tenses,
-- full passive range + causative, third/mixed conditionals, inversion/cleft
-- sentences (well-established rozszerzona-level structures for "zakres
-- środków językowych" richness), and advanced wishes/formal conjunctions.
-- A rozszerzona student sees BOTH this file's topics AND all of
-- 11_grammar_podstawowa.sql's (see visibleMaturaLevels() in
-- lib/matura/constants.ts) — this file does not repeat podstawowa content.
--
-- Idempotent: deletes existing topics for this level first (cascades to
-- their exercises).
-- ============================================================================

delete from matura_grammar_topics where level = 'rozszerzona';

-- ----------------------------------------------------------------------------
-- 1. Dodatkowe czasy przyszłe
-- ----------------------------------------------------------------------------
insert into matura_grammar_topics (level, slug, title, blocks, order_index) values (
  'rozszerzona', 'czasy-rozszerzone', 'Dodatkowe czasy: Future Continuous, Future Perfect',
  $b$[
  {"type": "intro", "text": "Na poziomie rozszerzonym dochodzą dwa dodatkowe czasy przyszłe, które pozwalają precyzyjniej mówić o TRWANIU i ZAKOŃCZENIU czynności w konkretnym momencie przyszłości."},
  {"type": "table", "title": "Czasy przyszłe rozszerzone", "headers": ["Czas", "Kiedy używamy", "Przykład"], "rows": [
    ["Future Continuous", "czynność, która będzie trwać w konkretnym momencie przyszłości", "This time tomorrow, I will be flying to New York."],
    ["Future Perfect", "czynność, która zakończy się PRZED konkretnym momentem przyszłości", "By 2030, she will have graduated from university."],
    ["Future Perfect Continuous", "podkreśla DŁUGOŚĆ trwania czynności do danego momentu w przyszłości", "By next June, I will have been working here for ten years."]
  ]},
  {"type": "examples", "title": "Future Continuous vs. Future Perfect", "items": [
    {"en": "At 8 pm I will be having dinner.", "pl": "O 20:00 będę w trakcie jedzenia kolacji (czynność TRWA w tym momencie).", "highlight": "will be having"},
    {"en": "By 8 pm I will have finished dinner.", "pl": "Do 20:00 skończę już kolację (czynność ZAKOŃCZY SIĘ przed tym momentem).", "highlight": "will have finished"}
  ]},
  {"type": "tip", "variant": "tip", "text": "Słowo-klucz 'by' (do jakiegoś momentu) niemal zawsze sygnalizuje Future Perfect — 'by the time', 'by next year', 'by 2030'."},
  {"type": "quiz", "question": "By the end of this year, they ___ (be) married for a decade.", "options": ["will be", "will have been", "are being", "will have"], "correctIndex": 1, "explanation": "'By the end of this year' + podkreślenie czasu trwania → Future Perfect (Continuous)."}
]$b$::jsonb,
  1
);

insert into matura_grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ((select id from matura_grammar_topics where level='rozszerzona' and slug='czasy-rozszerzone'), 'gap_fill', 'Don''t call at 7 pm, I ___ (have) dinner with my parents then.', null, 'will be having', 1),
  ((select id from matura_grammar_topics where level='rozszerzona' and slug='czasy-rozszerzone'), 'multiple_choice', 'By the time you arrive, we ___ the whole house.', '["will clean", "will be cleaning", "will have cleaned", "clean"]'::jsonb, 'will have cleaned', 2),
  ((select id from matura_grammar_topics where level='rozszerzona' and slug='czasy-rozszerzone'), 'gap_fill', 'By next year, I ___ (study) English for eight years.', null, 'will have been studying', 3),
  ((select id from matura_grammar_topics where level='rozszerzona' and slug='czasy-rozszerzone'), 'transformation', 'Rewrite using Future Perfect: The workers will finish the bridge before December.', null, 'The workers will have finished the bridge before December.', 4);

-- ----------------------------------------------------------------------------
-- 2. Strona bierna — zaawansowana
-- ----------------------------------------------------------------------------
insert into matura_grammar_topics (level, slug, title, blocks, order_index) values (
  'rozszerzona', 'strona-bierna-zaawansowana', 'Strona bierna — pełny zakres i strona przyczynowa',
  $b$[
  {"type": "intro", "text": "Na poziomie rozszerzonym strona bierna obejmuje wszystkie czasy (nie tylko podstawowe) oraz specjalną konstrukcję przyczynową 'have something done' — kiedy zlecamy coś komuś innemu."},
  {"type": "table", "title": "Strona bierna w dodatkowych czasach", "headers": ["Czas", "Strona bierna", "Przykład"], "rows": [
    ["Past Perfect", "had been + III forma", "The report had been written before the meeting started."],
    ["Present Continuous", "am/is/are being + III forma", "The bridge is being repaired at the moment."],
    ["Past Continuous", "was/were being + III forma", "The road was being resurfaced when the accident happened."],
    ["konstrukcja przyczynowa", "have/get + dopełnienie + III forma", "I had my hair cut yesterday. / I'm getting my car fixed."]
  ]},
  {"type": "examples", "title": "Strona przyczynowa (causative)", "items": [
    {"en": "I cut my hair.", "pl": "Sam(a) obciąłem/obcięłam sobie włosy.", "highlight": "cut"},
    {"en": "I had my hair cut.", "pl": "Zleciłem/am obcięcie włosów komuś innemu (u fryzjera).", "highlight": "had my hair cut"}
  ]},
  {"type": "tip", "variant": "warning", "text": "Konstrukcja przyczynowa NIE jest zwykłą stroną bierną — podmiot w niej ZLECA czynność, a nie jest jej biernym odbiorcą. To częsty temat w zadaniach na parafrazę na poziomie rozszerzonym."},
  {"type": "quiz", "question": "She doesn't clean her own windows — she ___ them cleaned every month.", "options": ["has", "is", "gets", "makes"], "correctIndex": 2, "explanation": "'get something done' to alternatywna, równie poprawna forma konstrukcji przyczynowej obok 'have something done'."}
]$b$::jsonb,
  2
);

insert into matura_grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ((select id from matura_grammar_topics where level='rozszerzona' and slug='strona-bierna-zaawansowana'), 'transformation', 'Rewrite using the causative: A mechanic is fixing my car right now.', null, 'I am having my car fixed right now.', 1),
  ((select id from matura_grammar_topics where level='rozszerzona' and slug='strona-bierna-zaawansowana'), 'gap_fill', 'The documents ___ (already / sign) before I arrived.', null, 'had already been signed', 2),
  ((select id from matura_grammar_topics where level='rozszerzona' and slug='strona-bierna-zaawansowana'), 'multiple_choice', 'When I looked outside, the street ___ by workmen.', '["was cleaning", "was being cleaned", "had cleaned", "is being cleaned"]'::jsonb, 'was being cleaned', 3),
  ((select id from matura_grammar_topics where level='rozszerzona' and slug='strona-bierna-zaawansowana'), 'gap_fill', 'We ___ (have) our house painted next month.', null, 'are having', 4);

-- ----------------------------------------------------------------------------
-- 3. Tryb warunkowy III i mieszany
-- ----------------------------------------------------------------------------
insert into matura_grammar_topics (level, slug, title, blocks, order_index) values (
  'rozszerzona', 'tryb-warunkowy-iii-mieszany', 'Third Conditional i tryb mieszany',
  $b$[
  {"type": "intro", "text": "Third Conditional wyraża żal dotyczący PRZESZŁOŚCI — sytuację, której już nie można zmienić. Tryb mieszany łączy dwa różne momenty w czasie w jednym zdaniu."},
  {"type": "compare", "title": "Third Conditional i mieszany", "columns": [
    {"title": "Third Conditional", "formula": "If + Past Perfect, ... would have + III forma", "whenToUse": "nierealna sytuacja w PRZESZŁOŚCI — czego nie da się już zmienić", "examples": ["If I had studied harder, I would have passed the exam.", "If she had left earlier, she wouldn't have missed the train."]},
    {"title": "Mixed Conditional (typ 1)", "formula": "If + Past Perfect, ... would + bezokolicznik", "whenToUse": "warunek w PRZESZŁOŚCI, skutek w TERAŹNIEJSZOŚCI", "examples": ["If I had taken that job, I would be rich now."]},
    {"title": "Mixed Conditional (typ 2)", "formula": "If + Past Simple, ... would have + III forma", "whenToUse": "warunek stały (cecha/stan), skutek w PRZESZŁOŚCI", "examples": ["If I weren't so shy, I would have introduced myself at the party."]}
  ]},
  {"type": "tip", "variant": "warning", "text": "Third Conditional dotyczy sytuacji, KTÓRE JUŻ SIĘ NIE ZDARZĄ — to nie 'porada na przyszłość', tylko żal za czymś nieodwracalnym. Nie myl go z Second Conditional (możliwa przyszłość)."},
  {"type": "quiz", "question": "If she ___ (not / forget) her umbrella, she wouldn't have got so wet.", "options": ["didn't forget", "hadn't forgotten", "wouldn't forget", "hasn't forgotten"], "correctIndex": 1, "explanation": "Third Conditional: If + Past Perfect, ... would have + III forma."}
]$b$::jsonb,
  3
);

insert into matura_grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ((select id from matura_grammar_topics where level='rozszerzona' and slug='tryb-warunkowy-iii-mieszany'), 'gap_fill', 'If we ___ (book) tickets earlier, they wouldn''t have been so expensive.', null, 'had booked', 1),
  ((select id from matura_grammar_topics where level='rozszerzona' and slug='tryb-warunkowy-iii-mieszany'), 'multiple_choice', 'If I hadn''t missed the flight, I ___ at the conference right now.', '["would be", "would have been", "will be", "was"]'::jsonb, 'would be', 2),
  ((select id from matura_grammar_topics where level='rozszerzona' and slug='tryb-warunkowy-iii-mieszany'), 'gap_fill', 'If he ___ (be) more careful, he wouldn''t have broken his leg.', null, 'had been', 3),
  ((select id from matura_grammar_topics where level='rozszerzona' and slug='tryb-warunkowy-iii-mieszany'), 'transformation', 'Rewrite as a Third Conditional: I didn''t know about the meeting, so I didn''t go.', null, 'If I had known about the meeting, I would have gone.', 4);

-- ----------------------------------------------------------------------------
-- 4. Inwersja i zdania rozszczepione
-- ----------------------------------------------------------------------------
insert into matura_grammar_topics (level, slug, title, blocks, order_index) values (
  'rozszerzona', 'inwersja-i-podkreslenie', 'Inwersja i zdania rozszczepione (cleft sentences)',
  $b$[
  {"type": "intro", "text": "Inwersja (odwrócenie szyku zdania) i konstrukcje 'cleft' to formalne struktury, które podkreślają wybrany element zdania — typowe dla wyższych ocen w kryterium 'zakres środków językowych' na rozszerzeniu."},
  {"type": "table", "title": "Inwersja po wyrażeniach przeczących/ograniczających", "headers": ["Wyrażenie", "Przykład"], "rows": [
    ["Never / Rarely", "Never have I seen such a beautiful sunset."],
    ["No sooner ... than", "No sooner had he arrived than the phone rang."],
    ["Hardly ... when", "Hardly had she sat down when the doorbell rang."],
    ["Not only ... but also", "Not only did she win the race, but she also broke the record."],
    ["Little", "Little did he know that his plan would fail."]
  ]},
  {"type": "examples", "title": "Zdania rozszczepione (cleft sentences)", "items": [
    {"en": "It was my sister who called you, not me.", "pl": "To moja siostra do ciebie zadzwoniła, nie ja (konstrukcja 'It is/was ... who/that' podkreśla wykonawcę).", "highlight": "It was my sister who"},
    {"en": "What I really need is a holiday.", "pl": "To, czego naprawdę potrzebuję, to wakacje (konstrukcja 'What ... is' podkreśla potrzebę/rzecz).", "highlight": "What I really need is"}
  ]},
  {"type": "tip", "variant": "warning", "text": "Po wyrażeniu wprowadzającym inwersję szyk zdania jest jak w PYTANIU (czasownik posiłkowy przed podmiotem) — 'Never have I seen', NIE 'Never I have seen'."},
  {"type": "quiz", "question": "___ had we left the house when it started to pour with rain.", "options": ["No sooner", "Hardly", "Never", "Not only"], "correctIndex": 1, "explanation": "'Hardly ... when' to poprawna para — 'No sooner' łączy się z 'than', nie z 'when'."}
]$b$::jsonb,
  4
);

insert into matura_grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ((select id from matura_grammar_topics where level='rozszerzona' and slug='inwersja-i-podkreslenie'), 'transformation', 'Rewrite using inversion starting with Never: I have never seen such a mess.', null, 'Never have I seen such a mess.', 1),
  ((select id from matura_grammar_topics where level='rozszerzona' and slug='inwersja-i-podkreslenie'), 'multiple_choice', 'No sooner had the film started ___ my phone rang.', '["when", "than", "then", "as"]'::jsonb, 'than', 2),
  ((select id from matura_grammar_topics where level='rozszerzona' and slug='inwersja-i-podkreslenie'), 'gap_fill', 'Not only ___ (she / win) the competition, but she also set a new record.', null, 'did she win', 3),
  ((select id from matura_grammar_topics where level='rozszerzona' and slug='inwersja-i-podkreslenie'), 'transformation', 'Rewrite as a cleft sentence emphasising "my brother": My brother broke the window, not me.', null, 'It was my brother who broke the window, not me.', 4);

-- ----------------------------------------------------------------------------
-- 5. Zaawansowane życzenia i spójniki formalne
-- ----------------------------------------------------------------------------
insert into matura_grammar_topics (level, slug, title, blocks, order_index) values (
  'rozszerzona', 'zaawansowane-zyczenia', 'Zaawansowane życzenia: would rather, if only, as if',
  $b$[
  {"type": "intro", "text": "Poza podstawowym 'wish' poziom rozszerzony wymaga znajomości kilku dodatkowych, bardziej formalnych konstrukcji wyrażających preferencje i porównania nierealne."},
  {"type": "table", "title": "Dodatkowe konstrukcje", "headers": ["Konstrukcja", "Znaczenie", "Przykład"], "rows": [
    ["would rather + Past Simple", "wolałbym, żeby ktoś inny coś zrobił (teraz/w przyszłości)", "I'd rather you told me the truth."],
    ["if only", "silniejsza forma 'wish' — mocny żal", "If only I had listened to your advice!"],
    ["as if / as though + Past Simple", "porównanie do sytuacji nierealnej w teraźniejszości", "She talks as if she knew everything."],
    ["as if / as though + Past Perfect", "porównanie do sytuacji nierealnej w przeszłości", "He looked as if he had seen a ghost."]
  ]},
  {"type": "tip", "variant": "tip", "text": "'would rather' + bezokolicznik (bez 'to') dotyczy WŁASNEJ preferencji mówiącego ('I'd rather stay home'), a 'would rather' + podmiot + Past Simple dotyczy preferencji co do działania KOGOŚ INNEGO ('I'd rather you stayed home')."},
  {"type": "quiz", "question": "He speaks English as if he ___ a native speaker.", "options": ["is", "was", "were", "has been"], "correctIndex": 2, "explanation": "'as if' + Past Simple (formalnie 'were') dla porównania nierealnego w teraźniejszości."}
]$b$::jsonb,
  5
);

insert into matura_grammar_exercises (topic_id, type, prompt, options, correct_answer, order_index) values
  ((select id from matura_grammar_topics where level='rozszerzona' and slug='zaawansowane-zyczenia'), 'gap_fill', 'If only I ___ (know) about the meeting, I would have come.', null, 'had known', 1),
  ((select id from matura_grammar_topics where level='rozszerzona' and slug='zaawansowane-zyczenia'), 'multiple_choice', 'I''d rather you ___ smoke in the house.', '["don''t", "didn''t", "won''t", "wouldn''t"]'::jsonb, 'didn''t', 2),
  ((select id from matura_grammar_topics where level='rozszerzona' and slug='zaawansowane-zyczenia'), 'gap_fill', 'She acted as if nothing ___ (happen).', null, 'had happened', 3),
  ((select id from matura_grammar_topics where level='rozszerzona' and slug='zaawansowane-zyczenia'), 'transformation', 'Rewrite using if only: I really regret shouting at you.', null, 'If only I hadn''t shouted at you.', 4);
