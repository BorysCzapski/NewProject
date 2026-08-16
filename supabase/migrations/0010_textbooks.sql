-- ============================================================================
-- 0010_textbooks.sql
-- "Podręcznik" (jezyki module): a student uploads a PDF of their own English
-- textbook; AI reads it, splits it into units/działy, and extracts per-unit
-- vocabulary (word + Polish translation + example sentence) and any
-- explicitly-taught grammar rules. Fully per-user content (any student can
-- upload their own book) — mirrors the repo-wide "<table>_own" RLS pattern
-- throughout, no admin bypass.
--
-- The PDF itself is processed transiently in the API route (app/api/jezyki/
-- import-textbook/route.ts) and never stored — same reasoning as Schola's
-- song-PDF import (0009_schola.sql): the extracted rows are the only durable
-- artifact the student needs, nothing in the app re-displays the original
-- file.
--
-- textbook_words mirrors vocabulary_words' column names (word_en/
-- translation_pl/example_sentence/category/level/language) on purpose, plus
-- its own correct_count/incorrect_count/mastery_status inline (unlike the
-- global vocabulary_words/vocabulary_progress split — pointless here since
-- these rows are never shared between users) so a textbook_words row is
-- structurally a VocabularyWord and components/vocabulary/flashcard-trainer.tsx
-- can render it unmodified.
--
-- textbook_grammar_topics.blocks stores a GrammarBlock[] (jsonb) so
-- components/grammar/lesson/grammar-lesson.tsx can render it unmodified;
-- textbook_grammar_exercises mirrors grammar_exercises' shape so
-- components/grammar/grammar-exercise-stepper.tsx can render it unmodified
-- too (both components already accept arbitrary serializable data — see
-- their own header comments).
--
-- Safe to re-run (create table/policy only if missing).
-- ============================================================================

create table if not exists textbooks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  title text not null,
  language target_language not null default 'en',
  created_at timestamptz not null default now()
);
create index if not exists textbooks_user_idx on textbooks (user_id);

create table if not exists textbook_units (
  id uuid primary key default gen_random_uuid(),
  textbook_id uuid not null references textbooks (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  title text not null,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists textbook_units_textbook_idx on textbook_units (textbook_id);

create table if not exists textbook_words (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null references textbook_units (id) on delete cascade,
  textbook_id uuid not null references textbooks (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  language target_language not null default 'en',
  level user_level not null,
  category text not null,
  word_en text not null,
  translation_pl text not null,
  example_sentence text,
  order_index int not null default 0,
  correct_count int not null default 0,
  incorrect_count int not null default 0,
  mastery_status mastery_status not null default 'new',
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create index if not exists textbook_words_unit_idx on textbook_words (unit_id);
create index if not exists textbook_words_textbook_idx on textbook_words (textbook_id);

create table if not exists textbook_grammar_topics (
  id uuid primary key default gen_random_uuid(),
  textbook_id uuid not null references textbooks (id) on delete cascade,
  unit_id uuid references textbook_units (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  language target_language not null default 'en',
  title text not null,
  blocks jsonb not null default '[]'::jsonb,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists textbook_grammar_topics_textbook_idx on textbook_grammar_topics (textbook_id);
create index if not exists textbook_grammar_topics_unit_idx on textbook_grammar_topics (unit_id);

create table if not exists textbook_grammar_exercises (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references textbook_grammar_topics (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  type text not null check (type in ('gap_fill', 'multiple_choice')),
  prompt text not null,
  options jsonb,
  correct_answer text not null,
  order_index int not null default 0
);
create index if not exists textbook_grammar_exercises_topic_idx on textbook_grammar_exercises (topic_id);

-- ----------------------------------------------------------------------------
-- RLS
-- ----------------------------------------------------------------------------
alter table textbooks enable row level security;
alter table textbook_units enable row level security;
alter table textbook_words enable row level security;
alter table textbook_grammar_topics enable row level security;
alter table textbook_grammar_exercises enable row level security;

do $$ begin
  create policy "textbooks_own" on textbooks for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "textbook_units_own" on textbook_units for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "textbook_words_own" on textbook_words for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "textbook_grammar_topics_own" on textbook_grammar_topics for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "textbook_grammar_exercises_own" on textbook_grammar_exercises for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- updated_at maintenance (reuses public.set_updated_at() from 0001_init.sql)
-- ----------------------------------------------------------------------------
do $$ begin
  create trigger textbook_words_set_updated_at before update on textbook_words
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;
