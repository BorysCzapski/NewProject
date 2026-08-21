-- ============================================================================
-- supabase/seed/matura/01_sections.sql
-- The 4 CKE exam parts, once per poziom, for ANGIELSKI (matura_sections).
-- Mirrors the language='en' half of lib/matura/sections.ts MATURA_SECTIONS —
-- keep both in sync. The Spanish half lives in supabase/seed/matura-es/.
-- exam_weight is an editable admin approximation (see 0013_matura.sql header
-- comment), NOT an official CKE point distribution.
--
-- Idempotent: deletes by (language, level, slug) first. The language scope is
-- load-bearing since 0016_matura_language.sql — without it this file would
-- delete the Spanish sections too, cascading away every Spanish lesson, task
-- and student progress row. Run this BEFORE any
-- 02_lessons_<slug>.sql / 03_tasks_<slug>.sql file (they look up section_id
-- via `(select id from matura_sections where language = 'en' and level = '...' and slug = '...')`).
-- ============================================================================

delete from matura_sections where language = 'en' and (level, slug) in (
  ('en', 'podstawowa', 'sluchanie'), ('podstawowa', 'czytanie'), ('podstawowa', 'srodki-jezykowe'), ('podstawowa', 'pisanie'),
  ('en', 'rozszerzona', 'sluchanie'), ('rozszerzona', 'czytanie'), ('rozszerzona', 'srodki-jezykowe'), ('rozszerzona', 'pisanie')
);

insert into matura_sections (language, level, slug, title, description, order_index, exam_weight) values
  ('en', 'podstawowa', 'sluchanie', 'Rozumienie ze słuchu', 'Nagrania i zadania sprawdzające rozumienie ze słuchu.', 1, 0.25),
  ('en', 'podstawowa', 'czytanie', 'Rozumienie tekstów pisanych', 'Teksty i zadania sprawdzające rozumienie tekstów pisanych.', 2, 0.33),
  ('en', 'podstawowa', 'srodki-jezykowe', 'Znajomość środków językowych', 'Słowotwórstwo, parafrazy zdań i uzupełnianie luk — sprawdza znajomość gramatyki i słownictwa w kontekście.', 3, 0.25),
  ('en', 'podstawowa', 'pisanie', 'Wypowiedź pisemna', 'Wypowiedź pisemna oceniana pod kątem treści, spójności, zakresu i poprawności językowej.', 4, 0.17),

  ('en', 'rozszerzona', 'sluchanie', 'Rozumienie ze słuchu', 'Nagrania i zadania sprawdzające rozumienie ze słuchu.', 1, 0.22),
  ('en', 'rozszerzona', 'czytanie', 'Rozumienie tekstów pisanych', 'Teksty i zadania sprawdzające rozumienie tekstów pisanych.', 2, 0.28),
  ('en', 'rozszerzona', 'srodki-jezykowe', 'Znajomość środków językowych', 'Słowotwórstwo, parafrazy zdań i uzupełnianie luk — sprawdza znajomość gramatyki i słownictwa w kontekście.', 3, 0.18),
  ('en', 'rozszerzona', 'pisanie', 'Wypowiedź pisemna', 'Wypowiedź pisemna oceniana pod kątem treści, spójności, zakresu i poprawności językowej.', 4, 0.32);
