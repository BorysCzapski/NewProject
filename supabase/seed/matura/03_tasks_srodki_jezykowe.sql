-- ============================================================================
-- supabase/seed/matura/03_tasks_srodki_jezykowe.sql
-- Curated task bank (matura_tasks, source='curated') for "Znajomość środków
-- językowych": 3 tasks per poziom, each a group of graded sub-items (see
-- MaturaTaskContent in lib/types/database.ts). Grading is exact-normalized
-- string match (lib/matura/grading.ts) — no AI involved.
--
-- Idempotent: deletes existing curated tasks for these sections first. Run
-- 01_sections.sql BEFORE this file — it looks up section_id by (level, slug).
-- ============================================================================

delete from matura_tasks
where source = 'curated'
  and section_id in (select id from matura_sections where language = 'en' and slug = 'srodki-jezykowe');

-- ----------------------------------------------------------------------------
-- Poziom podstawowy — zadanie 1: słowotwórstwo
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  $c$
  {
    "instructions": "Uzupełnij zdania, przekształcając podane w nawiasach wyrazy tak, aby powstały poprawne pod względem gramatycznym i logicznym zdania. Wpisz tylko brakujący wyraz.",
    "items": [
      { "id": "1", "type": "gap_fill", "prompt": "My sister is very ___ (CARE) about her health.", "transformWord": "CARE", "correctAnswers": ["careful"], "explanation": "CARE + -ful → careful (przymiotnik: 'dbający o coś')." },
      { "id": "2", "type": "gap_fill", "prompt": "There were a lot of ___ (VISIT) in the museum yesterday.", "transformWord": "VISIT", "correctAnswers": ["visitors"], "explanation": "VISIT + -or/-s → visitors (rzeczownik w liczbie mnogiej)." },
      { "id": "3", "type": "gap_fill", "prompt": "It was the most ___ (BORE) film I have ever seen.", "transformWord": "BORE", "correctAnswers": ["boring"], "explanation": "BORE + -ing → boring (przymiotnik opisujący cechę)." },
      { "id": "4", "type": "gap_fill", "prompt": "Please speak more ___ (QUIET), the baby is sleeping.", "transformWord": "QUIET", "correctAnswers": ["quietly"], "explanation": "QUIET + -ly → quietly (przysłówek)." }
    ]
  }
  $c$::jsonb,
  4, 'curated', '{"attribution": "Zespół Matura Angielski"}'::jsonb
);

-- ----------------------------------------------------------------------------
-- Poziom podstawowy — zadanie 2: wybór wielokrotny
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  $c$
  {
    "instructions": "Wybierz odpowiedź (A, B, C lub D), która najlepiej pasuje do luki w zdaniu.",
    "items": [
      { "id": "1", "type": "multiple_choice", "prompt": "I'm really looking forward ___ you this weekend.", "options": ["A. to see", "B. to seeing", "C. seeing", "D. see"], "correctAnswers": ["B. to seeing"], "explanation": "Po 'look forward to' zawsze następuje czasownik z -ing." },
      { "id": "2", "type": "multiple_choice", "prompt": "She has been living in London ___ 2015.", "options": ["A. for", "B. during", "C. since", "D. while"], "correctAnswers": ["C. since"], "explanation": "'since' + konkretny punkt w czasie." },
      { "id": "3", "type": "multiple_choice", "prompt": "If I ___ more time, I would learn another language.", "options": ["A. have", "B. had", "C. would have", "D. has"], "correctAnswers": ["B. had"], "explanation": "Drugi tryb warunkowy: If + Past Simple, would + bezokolicznik." },
      { "id": "4", "type": "multiple_choice", "prompt": "This is the house ___ I grew up.", "options": ["A. which", "B. where", "C. who", "D. when"], "correctAnswers": ["B. where"], "explanation": "'where' odnosi się do miejsca." }
    ]
  }
  $c$::jsonb,
  4, 'curated', '{"attribution": "Zespół Matura Angielski"}'::jsonb
);

-- ----------------------------------------------------------------------------
-- Poziom podstawowy — zadanie 3: parafraza jednowyrazowa
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'en' and level = 'podstawowa' and slug = 'srodki-jezykowe'),
  $c$
  {
    "instructions": "Uzupełnij drugie zdanie jednym wyrazem tak, aby zachować znaczenie zdania pierwszego.",
    "items": [
      { "id": "1", "type": "gap_fill", "prompt": "Tom is taller than his brother. — His brother is not as ___ as Tom.", "correctAnswers": ["tall"], "explanation": "'not as + przymiotnik w formie podstawowej + as' wyraża porównanie." },
      { "id": "2", "type": "gap_fill", "prompt": "I haven't seen this film before. — This is the ___ time I have seen this film.", "correctAnswers": ["first"], "explanation": "'the first time' z Present Perfect." },
      { "id": "3", "type": "gap_fill", "prompt": "It is possible that she forgot about the meeting. — She ___ have forgotten about the meeting.", "correctAnswers": ["might", "may"], "explanation": "might/may + have + III forma czasownika wyraża przypuszczenie dotyczące przeszłości." }
    ]
  }
  $c$::jsonb,
  3, 'curated', '{"attribution": "Zespół Matura Angielski"}'::jsonb
);

-- ----------------------------------------------------------------------------
-- Poziom rozszerzony — zadanie 1: parafraza ze słowem kluczowym
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  $c$
  {
    "instructions": "Uzupełnij drugie zdanie, używając od dwóch do pięciu wyrazów, tak aby zachować znaczenie zdania pierwszego. Wykorzystaj podane słowo kluczowe w niezmienionej formie.",
    "items": [
      { "id": "1", "type": "gap_fill", "prompt": "He doesn't smoke now, but he smoked in the past. KEY WORD: USED — He ___ smoke, but he doesn't anymore.", "transformWord": "USED", "correctAnswers": ["used to"], "explanation": "'used to' + bezokolicznik opisuje nawyk z przeszłości, którego już nie ma." },
      { "id": "2", "type": "gap_fill", "prompt": "I have never eaten such delicious food before. KEY WORD: MOST — This is the ___ food I have ever eaten.", "transformWord": "MOST", "correctAnswers": ["most delicious"], "explanation": "Stopień najwyższy przymiotnika wielosylabowego: 'the most + przymiotnik'." },
      { "id": "3", "type": "gap_fill", "prompt": "Someone stole my bike yesterday. KEY WORD: STOLEN — My bike ___ yesterday.", "transformWord": "STOLEN", "correctAnswers": ["was stolen"], "explanation": "Strona bierna w czasie przeszłym: was/were + III forma czasownika." },
      { "id": "4", "type": "gap_fill", "prompt": "She said, \"I will call you tomorrow.\" KEY WORD: WOULD — She said that she ___ me the next day.", "transformWord": "WOULD", "correctAnswers": ["would call"], "explanation": "Mowa zależna: 'will' cofa się do 'would' (backshift)." }
    ]
  }
  $c$::jsonb,
  4, 'curated', '{"attribution": "Zespół Matura Angielski"}'::jsonb
);

-- ----------------------------------------------------------------------------
-- Poziom rozszerzony — zadanie 2: słowotwórstwo (zaawansowane)
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  $c$
  {
    "instructions": "Uzupełnij zdania, przekształcając podane w nawiasach wyrazy tak, aby powstały poprawne pod względem gramatycznym i logicznym zdania. Wpisz tylko brakujący wyraz.",
    "items": [
      { "id": "1", "type": "gap_fill", "prompt": "The company's ___ (GROW) has been remarkable over the last decade.", "transformWord": "GROW", "correctAnswers": ["growth"], "explanation": "GROW + -th → growth (rzeczownik abstrakcyjny)." },
      { "id": "2", "type": "gap_fill", "prompt": "His argument was based on false ___ (ASSUME).", "transformWord": "ASSUME", "correctAnswers": ["assumptions"], "explanation": "ASSUME → assumption(s) (rzeczownik, tu w liczbie mnogiej)." },
      { "id": "3", "type": "gap_fill", "prompt": "The negotiations were extremely ___ (SUCCESS).", "transformWord": "SUCCESS", "correctAnswers": ["successful"], "explanation": "SUCCESS + -ful → successful (przymiotnik)." },
      { "id": "4", "type": "gap_fill", "prompt": "Her ___ (ABLE) to speak four languages impressed the interviewers.", "transformWord": "ABLE", "correctAnswers": ["ability"], "explanation": "ABLE → ability (rzeczownik: 'umiejętność')." }
    ]
  }
  $c$::jsonb,
  4, 'curated', '{"attribution": "Zespół Matura Angielski"}'::jsonb
);

-- ----------------------------------------------------------------------------
-- Poziom rozszerzony — zadanie 3: tekst z lukami (spójniki, inwersje)
-- ----------------------------------------------------------------------------
insert into matura_tasks (section_id, content, points_max, source, source_metadata) values (
  (select id from matura_sections where language = 'en' and level = 'rozszerzona' and slug = 'srodki-jezykowe'),
  $c$
  {
    "instructions": "Uzupełnij zdania, wpisując w każdą lukę jeden brakujący wyraz.",
    "items": [
      { "id": "1", "type": "gap_fill", "prompt": "Despite ___ tired, she finished the marathon.", "correctAnswers": ["being"], "explanation": "Po 'despite' następuje rzeczownik lub czasownik z -ing." },
      { "id": "2", "type": "gap_fill", "prompt": "No sooner had he arrived ___ the phone rang.", "correctAnswers": ["than"], "explanation": "Konstrukcja inwersyjna 'no sooner... than'." },
      { "id": "3", "type": "gap_fill", "prompt": "It wasn't until midnight ___ we finally got home.", "correctAnswers": ["that"], "explanation": "Konstrukcja rozszczepiona 'it wasn't until... that'." },
      { "id": "4", "type": "gap_fill", "prompt": "Hardly ___ she sat down when the doorbell rang.", "correctAnswers": ["had"], "explanation": "Inwersja po 'hardly': hardly had + podmiot + imiesłów." }
    ]
  }
  $c$::jsonb,
  4, 'curated', '{"attribution": "Zespół Matura Angielski"}'::jsonb
);
