-- ============================================================================
-- 0020_matura_language.sql
-- Makes the "Matura" mini-app multilingual: the same CKE exam-prep module now
-- serves English AND Spanish. This is a schema change, not a new app, because
-- the CKE format for języki obce nowożytne is IDENTICAL across languages —
-- the same four parts (słuchanie / czytanie / środki językowe / wypowiedź
-- pisemna), the same two poziomy, the same 60/50 point totals, the same
-- 12/13-point writing rubric and the same word-count "guillotine". Only the
-- CONTENT differs. Forking a parallel `es_*` module would have duplicated
-- every one of those rules, i.e. two places to fix whenever CKE republishes
-- the Informator. Linguo already made the same call for its own content
-- (TargetLanguage 'en'|'es'|'ru' over one shared schema).
--
-- Every language column defaults to 'en' ON PURPOSE: the existing English
-- sections, tasks, lessons, attempts and per-student progress must survive
-- this migration untouched and keep working with no manual backfill.
--
-- Where the column goes, and where it deliberately does NOT:
--   * matura_sections    — the content root, so it carries `language`. Its
--                          (level, slug) / (level, order_index) uniqueness
--                          becomes (language, level, ...).
--   * matura_lessons, matura_tasks, matura_writing_tasks, and everything
--     hanging off them (attempts, submissions, section_progress,
--     assigned_practice) — NO column: they reach a section via section_id and
--     inherit its language. A denormalized copy could only ever drift.
--   * matura_mock_exams, matura_progress_snapshots, matura_study_plans — these
--     store `level` directly with no section_id, so they each need `language`.
--
-- matura_study_plans additionally loses its unique(user_id) in favour of
-- unique(user_id, language): a student preparing for two languages must be
-- able to hold two plans, otherwise generating the Spanish plan would silently
-- overwrite the English one.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Enum. Deliberately NOT reusing Linguo's TargetLanguage ('en'|'es'|'ru') —
-- there is no Russian matura content and none is planned, and a type that
-- claims support the app does not have is a type that lies.
-- ----------------------------------------------------------------------------
do $$ begin
  create type matura_language as enum ('en', 'es');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- matura_sections: the content root.
-- ----------------------------------------------------------------------------
alter table matura_sections add column if not exists language matura_language not null default 'en';

-- The originals were declared inline in 0013_matura.sql as `unique (level, slug)`
-- and `unique (level, order_index)`, so Postgres auto-named them like this.
alter table matura_sections drop constraint if exists matura_sections_level_slug_key;
alter table matura_sections drop constraint if exists matura_sections_level_order_index_key;

create unique index if not exists matura_sections_lang_level_slug_idx
  on matura_sections (language, level, slug);
create unique index if not exists matura_sections_lang_level_order_idx
  on matura_sections (language, level, order_index);

-- ----------------------------------------------------------------------------
-- Per-user tables that key off `level` without a section_id.
-- ----------------------------------------------------------------------------
alter table matura_mock_exams add column if not exists language matura_language not null default 'en';
create index if not exists matura_mock_exams_user_lang_idx
  on matura_mock_exams (user_id, language, started_at desc);

alter table matura_progress_snapshots add column if not exists language matura_language not null default 'en';
create index if not exists matura_progress_snapshots_user_lang_idx
  on matura_progress_snapshots (user_id, language, snapshot_at);

alter table matura_study_plans add column if not exists language matura_language not null default 'en';
alter table matura_study_plans drop constraint if exists matura_study_plans_user_id_key;
create unique index if not exists matura_study_plans_user_lang_idx
  on matura_study_plans (user_id, language);

-- ----------------------------------------------------------------------------
-- matura_settings: the student's CURRENT choice — which language they are
-- preparing for, alongside which poziom. Stays keyed by user_id alone (one
-- active choice at a time); switching language does not destroy any progress,
-- because progress lives on section-scoped rows, not here.
-- ----------------------------------------------------------------------------
alter table matura_settings add column if not exists language matura_language not null default 'en';

-- ----------------------------------------------------------------------------
-- Row Level Security: nothing to add. Content tables stay "readable by every
-- authenticated user, writable only by public.is_admin()"; per-user tables
-- keep their <table>_own + <table>_admin_read pair. Adding a column does not
-- change who may see a row, and language is not a privacy boundary.
-- ----------------------------------------------------------------------------
