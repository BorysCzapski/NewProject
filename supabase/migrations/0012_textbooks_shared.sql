-- ============================================================================
-- 0012_textbooks_shared.sql
-- Makes uploaded textbooks a SHARED library instead of private-per-uploader:
-- any authenticated user can browse/study a textbook (and its units/words/
-- grammar) once someone has uploaded it, but only the uploader can insert or
-- delete it — same "_select" (open) / "_insert_own" / "_delete_own" split
-- already used repo-wide for admin-authored content (songs, reading_texts,
-- writing_tasks in 0001_init.sql), just without the admin bypass since any
-- student can be the "author" here.
--
-- Splits per-user progress OUT of textbook_words (correct_count/
-- incorrect_count/mastery_status) into a new textbook_word_progress table,
-- mirroring vocabulary_words/vocabulary_progress. This was fine to keep
-- inline while a textbook was single-owner-only (0010_textbooks.sql's
-- reasoning), but now that many students can study the SAME word row, each
-- needs their OWN progress — inline counters could only ever track one
-- student's answers.
--
-- No production textbooks exist yet (checked before writing this), so this
-- drops the now-redundant columns outright rather than carrying dead ones.
--
-- Safe to re-run (create table/policy only if missing; drops are guarded).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- textbook_word_progress: one row per (user, word). Genuinely private — no
-- reason for one student to see another's mastery of a shared word.
-- ----------------------------------------------------------------------------
create table if not exists textbook_word_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  word_id uuid not null references textbook_words (id) on delete cascade,
  correct_count int not null default 0,
  incorrect_count int not null default 0,
  mastery_status mastery_status not null default 'new',
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, word_id)
);
create index if not exists textbook_word_progress_user_idx on textbook_word_progress (user_id);
create index if not exists textbook_word_progress_word_idx on textbook_word_progress (word_id);

alter table textbook_word_progress enable row level security;

do $$ begin
  create policy "textbook_word_progress_own" on textbook_word_progress for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger textbook_word_progress_set_updated_at before update on textbook_word_progress
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- textbook_words: drop the per-uploader-only progress columns (now tracked
-- per-student in textbook_word_progress above) and the trigger that
-- maintained them.
-- ----------------------------------------------------------------------------
drop trigger if exists textbook_words_set_updated_at on textbook_words;
alter table textbook_words
  drop column if exists correct_count,
  drop column if exists incorrect_count,
  drop column if exists mastery_status,
  drop column if exists updated_at;

-- ----------------------------------------------------------------------------
-- RLS: replace each "_own" (all-operations) policy with select-open /
-- insert-own / delete-own. No update policy anywhere here — every one of
-- these rows is immutable after the import that created it.
-- ----------------------------------------------------------------------------
drop policy if exists "textbooks_own" on textbooks;
drop policy if exists "textbook_units_own" on textbook_units;
drop policy if exists "textbook_words_own" on textbook_words;
drop policy if exists "textbook_grammar_topics_own" on textbook_grammar_topics;
drop policy if exists "textbook_grammar_exercises_own" on textbook_grammar_exercises;

do $$ begin
  create policy "textbooks_select" on textbooks for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "textbooks_insert_own" on textbooks for insert to authenticated
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "textbooks_delete_own" on textbooks for delete to authenticated
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "textbook_units_select" on textbook_units for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "textbook_units_insert_own" on textbook_units for insert to authenticated
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "textbook_units_delete_own" on textbook_units for delete to authenticated
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "textbook_words_select" on textbook_words for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "textbook_words_insert_own" on textbook_words for insert to authenticated
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "textbook_words_delete_own" on textbook_words for delete to authenticated
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "textbook_grammar_topics_select" on textbook_grammar_topics for select to authenticated
    using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "textbook_grammar_topics_insert_own" on textbook_grammar_topics for insert to authenticated
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "textbook_grammar_topics_delete_own" on textbook_grammar_topics for delete to authenticated
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "textbook_grammar_exercises_select" on textbook_grammar_exercises for select to authenticated
    using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "textbook_grammar_exercises_insert_own" on textbook_grammar_exercises for insert to authenticated
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "textbook_grammar_exercises_delete_own" on textbook_grammar_exercises for delete to authenticated
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
