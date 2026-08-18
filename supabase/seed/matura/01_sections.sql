-- ============================================================================
-- supabase/seed/matura/01_sections.sql
-- The 4 CKE exam parts, once per poziom (matura_sections). Mirrors
-- lib/matura/sections.ts MATURA_SECTIONS exactly — keep both in sync.
-- exam_weight is an editable admin approximation (see 0013_matura.sql header
-- comment), NOT an official CKE point distribution.
--
-- Idempotent: deletes by (level, slug) first. Run this BEFORE any
-- 02_lessons_<slug>.sql / 03_tasks_<slug>.sql file (they look up section_id
-- via `(select id from matura_sections where level = '...' and slug = '...')`).
-- ============================================================================

delete from matura_sections where (level, slug) in (
  ('podstawowa', 'sluchanie'), ('podstawowa', 'czytanie'), ('podstawowa', 'srodki-jezykowe'), ('podstawowa', 'pisanie'),
  ('rozszerzona', 'sluchanie'), ('rozszerzona', 'czytanie'), ('rozszerzona', 'srodki-jezykowe'), ('rozszerzona', 'pisanie')
);

insert into matura_sections (level, slug, title, description, order_index, exam_weight) values
  ('podstawowa', 'sluchanie', 'Rozumienie ze słuchu', 'Nagrania i zadania sprawdzające rozumienie ze słuchu.', 1, 0.25),
  ('podstawowa', 'czytanie', 'Rozumienie tekstów pisanych', 'Teksty i zadania sprawdzające rozumienie tekstów pisanych.', 2, 0.33),
  ('podstawowa', 'srodki-jezykowe', 'Znajomość środków językowych', 'Słowotwórstwo, parafrazy zdań i uzupełnianie luk — sprawdza znajomość gramatyki i słownictwa w kontekście.', 3, 0.25),
  ('podstawowa', 'pisanie', 'Wypowiedź pisemna', 'Wypowiedź pisemna oceniana pod kątem treści, spójności, zakresu i poprawności językowej.', 4, 0.17),

  ('rozszerzona', 'sluchanie', 'Rozumienie ze słuchu', 'Nagrania i zadania sprawdzające rozumienie ze słuchu.', 1, 0.22),
  ('rozszerzona', 'czytanie', 'Rozumienie tekstów pisanych', 'Teksty i zadania sprawdzające rozumienie tekstów pisanych.', 2, 0.28),
  ('rozszerzona', 'srodki-jezykowe', 'Znajomość środków językowych', 'Słowotwórstwo, parafrazy zdań i uzupełnianie luk — sprawdza znajomość gramatyki i słownictwa w kontekście.', 3, 0.18),
  ('rozszerzona', 'pisanie', 'Wypowiedź pisemna', 'Wypowiedź pisemna oceniana pod kątem treści, spójności, zakresu i poprawności językowej.', 4, 0.32);
