-- ============================================================================
-- 0003_multilang_homework_matching.sql
-- Three feature areas in one migration:
--  1. Multi-language: the app can now teach English, Spanish or Russian to
--     Polish speakers. profiles.target_language picks which; every content
--     table gets a `language` column so content is scoped per language.
--     Existing rows default to 'en' (the app was English-only before).
--  2. Homework upgrades: per-student targeting (target_user_id), a language
--     scope, and a new 'matching_game' type. Admin-read RLS on the progress
--     tables so the admin roadmap/completion views actually see student data
--     (previously blocked by the own-rows-only policies — the reason the
--     admin learning-path view showed everyone stuck at stage 1).
--  3. The "łączenie tłumaczeń" (matching translations) game: matching_attempts.
--
-- Safe to re-run: uses IF EXISTS / IF NOT EXISTS / DROP..CREATE where possible.
-- NOTE on enum ADD VALUE: 'matching_game' is added but never *used* inside this
-- migration, so it is safe on PostgreSQL 12+ (Supabase is 15+).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Language enum + profile column
-- ----------------------------------------------------------------------------
do $$ begin
  create type target_language as enum ('en', 'es', 'ru');
exception when duplicate_object then null; end $$;

alter table profiles
  add column if not exists target_language target_language not null default 'en';

-- ----------------------------------------------------------------------------
-- language column on every content table (existing rows -> 'en')
-- ----------------------------------------------------------------------------
alter table vocabulary_words   add column if not exists language target_language not null default 'en';
alter table grammar_topics     add column if not exists language target_language not null default 'en';
alter table reading_texts      add column if not exists language target_language not null default 'en';
alter table writing_tasks      add column if not exists language target_language not null default 'en';
alter table songs              add column if not exists language target_language not null default 'en';
alter table listening_exercises add column if not exists language target_language not null default 'en';
alter table learning_path_stages add column if not exists language target_language not null default 'en';

create index if not exists vocabulary_words_lang_level_idx on vocabulary_words (language, level);
create index if not exists grammar_topics_lang_level_idx on grammar_topics (language, level);
create index if not exists learning_path_stages_lang_level_idx on learning_path_stages (language, level);

-- grammar_topics.slug was globally unique; slugs now repeat across languages,
-- so make uniqueness per (language, slug). Detail page looks a topic up by
-- slug + the user's language.
alter table grammar_topics drop constraint if exists grammar_topics_slug_key;
do $$ begin
  alter table grammar_topics add constraint grammar_topics_lang_slug_key unique (language, slug);
exception when duplicate_object then null; end $$;

-- learning_path_stages was unique(level, order_index); now unique per language too.
alter table learning_path_stages drop constraint if exists learning_path_stages_level_order_index_key;
do $$ begin
  alter table learning_path_stages
    add constraint learning_path_stages_lang_level_order_key unique (language, level, order_index);
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- 2. Homework: per-student targeting, language scope, matching_game type
-- ----------------------------------------------------------------------------
alter table homework
  add column if not exists target_user_id uuid references profiles (id) on delete cascade;
alter table homework
  add column if not exists language target_language not null default 'en';
create index if not exists homework_target_user_idx on homework (target_user_id);
create index if not exists homework_language_idx on homework (language);

-- new homework type for the matching game
alter type homework_type add value if not exists 'matching_game';

-- ----------------------------------------------------------------------------
-- 3. matching_attempts (the "łączenie tłumaczeń" game)
-- ----------------------------------------------------------------------------
create table if not exists matching_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  language target_language not null,
  level user_level not null,
  category text,
  score numeric not null,
  total int not null,
  completed_at timestamptz not null default now()
);
create index if not exists matching_attempts_user_idx on matching_attempts (user_id);

alter table matching_attempts enable row level security;
do $$ begin
  create policy "matching_attempts_own" on matching_attempts for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matching_attempts_admin_read" on matching_attempts for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Admin-read RLS on the progress tables. Without these, when the admin views
-- a STUDENT's learning-path / completion status the own-rows-only policies
-- return zero rows, so every student looked stuck at stage 1 / 0% — the bug
-- behind "admin nie ma wglądu w ścieżkę ucznia bo nie aktualizuje się ona".
-- (reading_attempts and writing_submissions already had admin-read policies.)
-- ----------------------------------------------------------------------------
do $$ begin
  create policy "vocabulary_progress_admin_read" on vocabulary_progress for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "grammar_progress_admin_read" on grammar_progress for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "song_translation_attempts_admin_read" on song_translation_attempts for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "listening_attempts_admin_read" on listening_attempts for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

-- Admins also need to read every vocabulary_words row regardless of language
-- (already covered: vocabulary_words_select uses (true)). No change needed.
