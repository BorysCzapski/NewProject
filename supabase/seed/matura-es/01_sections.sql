-- ============================================================================
-- supabase/seed/matura-es/01_sections.sql
-- The 4 CKE exam parts, once per poziom, for HISZPAŃSKI (matura_sections).
-- Mirrors the language='es' half of lib/matura/sections.ts MATURA_SECTIONS —
-- keep both in sync. The English half lives in supabase/seed/matura/.
--
-- The parts, their order and their weights are IDENTICAL to the English seed
-- on purpose: CKE publishes one exam format for all języki obce nowożytne, so
-- a Spanish maturzysta sits the same structure for the same points. Only the
-- CONTENT of the lessons and tasks differs — which is exactly why the module
-- carries a `language` column instead of being forked (0020_matura_language.sql).
-- exam_weight stays an editable admin approximation, NOT an official CKE split.
--
-- Idempotent: deletes by (language, level, slug) first. The language scope is
-- load-bearing — without it this file would delete the English sections too,
-- cascading away every English lesson, task and student progress row.
--
-- Run this BEFORE any 0x_lessons_<slug>.sql / 0x_tasks_<slug>.sql file in this
-- directory (they look up section_id via
-- `(select id from matura_sections where language = 'es' and level = '...' and slug = '...')`).
-- ============================================================================

delete from matura_sections where language = 'es' and (level, slug) in (
  ('podstawowa', 'sluchanie'), ('podstawowa', 'czytanie'), ('podstawowa', 'srodki-jezykowe'), ('podstawowa', 'pisanie'),
  ('rozszerzona', 'sluchanie'), ('rozszerzona', 'czytanie'), ('rozszerzona', 'srodki-jezykowe'), ('rozszerzona', 'pisanie')
);

insert into matura_sections (language, level, slug, title, description, order_index, exam_weight) values
  ('es', 'podstawowa', 'sluchanie', 'Rozumienie ze słuchu', 'Nagrania i zadania sprawdzające rozumienie ze słuchu.', 1, 0.25),
  ('es', 'podstawowa', 'czytanie', 'Rozumienie tekstów pisanych', 'Teksty i zadania sprawdzające rozumienie tekstów pisanych.', 2, 0.33),
  ('es', 'podstawowa', 'srodki-jezykowe', 'Znajomość środków językowych', 'Słowotwórstwo, parafrazy zdań i uzupełnianie luk — sprawdza znajomość gramatyki i słownictwa w kontekście.', 3, 0.25),
  ('es', 'podstawowa', 'pisanie', 'Wypowiedź pisemna', 'Wypowiedź pisemna oceniana pod kątem treści, spójności, zakresu i poprawności językowej.', 4, 0.17),

  ('es', 'rozszerzona', 'sluchanie', 'Rozumienie ze słuchu', 'Nagrania i zadania sprawdzające rozumienie ze słuchu.', 1, 0.22),
  ('es', 'rozszerzona', 'czytanie', 'Rozumienie tekstów pisanych', 'Teksty i zadania sprawdzające rozumienie tekstów pisanych.', 2, 0.28),
  ('es', 'rozszerzona', 'srodki-jezykowe', 'Znajomość środków językowych', 'Słowotwórstwo, parafrazy zdań i uzupełnianie luk — sprawdza znajomość gramatyki i słownictwa w kontekście.', 3, 0.18),
  ('es', 'rozszerzona', 'pisanie', 'Wypowiedź pisemna', 'Wypowiedź pisemna oceniana pod kątem treści, spójności, zakresu i poprawności językowej.', 4, 0.32);
