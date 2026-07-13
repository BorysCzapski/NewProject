-- ============================================================================
-- 03_learning_path.sql
-- Seed data for learning_path_stages: one row per (level, category), paired
-- with a grammar topic (cycling through each level's 5 topics in order —
-- there are more vocabulary categories than grammar topics per level, so
-- topics repeat, which is fine: revisiting grammar while covering new
-- vocabulary is good spaced repetition). category values match
-- vocabulary_words.category EXACTLY (verified against 01_vocabulary_*.sql).
-- grammar_topic_id values match the literal UUIDs used in 02_grammar_*.sql.
-- Idempotent: deletes by level first.
-- ============================================================================

delete from learning_path_stages where language = 'en' and level = 'A1';
delete from learning_path_stages where language = 'en' and level = 'A2';
delete from learning_path_stages where language = 'en' and level = 'B1';
delete from learning_path_stages where language = 'en' and level = 'B2';

-- ----------------------------------------------------------------------------
-- A1 — 10 categories, cycling 5 grammar topics
-- ----------------------------------------------------------------------------
insert into learning_path_stages (level, order_index, category, title, grammar_topic_id) values
  ('A1', 0, 'rodzina', 'Rodzina', 'd27698ac-2cdc-4060-9356-c0717a23ff4a'),               -- to-be
  ('A1', 1, 'kolory', 'Kolory', '3860fe75-73ae-4f76-89ea-a0e14154ff20'),                 -- present-simple
  ('A1', 2, 'liczby', 'Liczby', '1ff09055-c3f1-43d3-8d70-6ccd2ff9f1c8'),                 -- articles-a-an-the
  ('A1', 3, 'jedzenie', 'Jedzenie', 'a6c998f7-344d-4f2f-8500-5a8e47274610'),             -- plural-nouns
  ('A1', 4, 'dom', 'Dom', 'd2280b7a-0d77-4dd2-9fd6-b0a7ca1466c9'),                       -- can-cant
  ('A1', 5, 'dni tygodnia', 'Dni tygodnia', 'd27698ac-2cdc-4060-9356-c0717a23ff4a'),     -- to-be
  ('A1', 6, 'podstawowe czasowniki', 'Podstawowe czasowniki', '3860fe75-73ae-4f76-89ea-a0e14154ff20'), -- present-simple
  ('A1', 7, 'ubrania', 'Ubrania', '1ff09055-c3f1-43d3-8d70-6ccd2ff9f1c8'),               -- articles-a-an-the
  ('A1', 8, 'zwierzęta', 'Zwierzęta', 'a6c998f7-344d-4f2f-8500-5a8e47274610'),           -- plural-nouns
  ('A1', 9, 'czas/godziny', 'Czas i godziny', 'd2280b7a-0d77-4dd2-9fd6-b0a7ca1466c9');   -- can-cant

-- ----------------------------------------------------------------------------
-- A2 — 8 categories, cycling 5 grammar topics
-- ----------------------------------------------------------------------------
insert into learning_path_stages (level, order_index, category, title, grammar_topic_id) values
  ('A2', 0, 'podróże', 'Podróże', 'b1e2c3d4-5f6a-47b8-9c0d-1e2f3a4b5c6d'),               -- past-simple
  ('A2', 1, 'praca', 'Praca', 'c2d3e4f5-6a7b-48c9-9d0e-2f3a4b5c6d7e'),                   -- present-continuous
  ('A2', 2, 'zakupy', 'Zakupy', 'd3e4f5a6-7b8c-49d0-9e1f-3a4b5c6d7e8f'),                 -- going-to
  ('A2', 3, 'pogoda', 'Pogoda', 'e4f5a6b7-8c9d-4a01-9f2a-4b5c6d7e8f9a'),                 -- comparatives-superlatives
  ('A2', 4, 'zdrowie', 'Zdrowie', 'f5a6b7c8-9d0e-4b12-9a3b-5c6d7e8f9a0b'),               -- must-have-to
  ('A2', 5, 'czas wolny', 'Czas wolny', 'b1e2c3d4-5f6a-47b8-9c0d-1e2f3a4b5c6d'),         -- past-simple
  ('A2', 6, 'transport', 'Transport', 'c2d3e4f5-6a7b-48c9-9d0e-2f3a4b5c6d7e'),           -- present-continuous
  ('A2', 7, 'uczucia podstawowe', 'Uczucia podstawowe', 'd3e4f5a6-7b8c-49d0-9e1f-3a4b5c6d7e8f'); -- going-to

-- ----------------------------------------------------------------------------
-- B1 — 8 categories, cycling 5 grammar topics
-- ----------------------------------------------------------------------------
insert into learning_path_stages (level, order_index, category, title, grammar_topic_id) values
  ('B1', 0, 'emocje', 'Emocje', 'a83d559a-6a97-4bbb-b3a7-7e8286ab202c'),                 -- present-perfect
  ('B1', 1, 'edukacja', 'Edukacja', '1977d3b5-1567-4564-b59c-5a7b98ccfeda'),             -- first-conditional
  ('B1', 2, 'technologia', 'Technologia', '8de8f4c2-7ca4-4b26-aab8-9e7ff9d13472'),       -- second-conditional
  ('B1', 3, 'środowisko', 'Środowisko', '48353ae1-cf70-44ff-b3cc-2a8bdf56083b'),         -- passive-voice-basics
  ('B1', 4, 'relacje', 'Relacje', '3286c06d-6383-4b9a-b5d0-5162b69c8987'),               -- reported-speech-basics
  ('B1', 5, 'podstawowe phrasal verbs', 'Podstawowe phrasal verbs', 'a83d559a-6a97-4bbb-b3a7-7e8286ab202c'), -- present-perfect
  ('B1', 6, 'media', 'Media', '1977d3b5-1567-4564-b59c-5a7b98ccfeda'),                   -- first-conditional
  ('B1', 7, 'kultura', 'Kultura', '8de8f4c2-7ca4-4b26-aab8-9e7ff9d13472');               -- second-conditional

-- ----------------------------------------------------------------------------
-- B2 — 8 categories, cycling 5 grammar topics
-- ----------------------------------------------------------------------------
insert into learning_path_stages (level, order_index, category, title, grammar_topic_id) values
  ('B2', 0, 'biznes', 'Biznes', 'e1a2b3c4-d5e6-4f70-8a91-1b2c3d4e5f60'),                 -- mixed-conditionals
  ('B2', 1, 'polityka', 'Polityka', 'f2b3c4d5-e6f7-4801-9a02-2c3d4e5f6071'),             -- passive-voice-advanced
  ('B2', 2, 'nauka', 'Nauka', 'a3c4d5e6-f708-4912-ab13-3d4e5f607182'),                   -- wish-if-only
  ('B2', 3, 'media', 'Media', 'b4d5e6f7-0819-4a23-bc24-4e5f60718293'),                   -- inversion
  ('B2', 4, 'idiomy', 'Idiomy', 'c5e6f708-1920-4b34-cd35-5f6071829304'),                 -- modals-past
  ('B2', 5, 'phrasal verbs', 'Zaawansowane phrasal verbs', 'e1a2b3c4-d5e6-4f70-8a91-1b2c3d4e5f60'), -- mixed-conditionals
  ('B2', 6, 'prawo', 'Prawo', 'f2b3c4d5-e6f7-4801-9a02-2c3d4e5f6071'),                   -- passive-voice-advanced
  ('B2', 7, 'ekonomia', 'Ekonomia', 'a3c4d5e6-f708-4912-ab13-3d4e5f607182');             -- wish-if-only
