-- ============================================================================
-- 0016_matura_theory.sql
-- Fills the gap the practice-only sections left: actual THEORY a student
-- needs to learn grammar and vocabulary from, not just be tested on it (the
-- original spec's "Interaktywna teoria" requirement, missing until now for
-- Matura Angielski specifically — Linguo already has this for CEFR levels,
-- but Matura's own exam-level structure (podstawowa/rozszerzona) needed its
-- own content, same reasoning that gave every other Matura table its own
-- copy instead of reusing Linguo's).
--
-- Grammar: matura_grammar_topics stores interactive lesson content as jsonb
-- GrammarBlock[] (lib/grammar/lesson-blocks.ts) DIRECTLY in the row, unlike
-- Linguo's grammar_topics (plain-text `explanation` column + a SEPARATE
-- hardcoded TS content file matched by slug) — simpler, and consistent with
-- how every other Matura lesson already stores its blocks (matura_lessons).
-- matura_grammar_exercises / matura_grammar_progress mirror
-- grammar_exercises / grammar_progress from 0001_init.sql exactly (same
-- column shapes) so the existing GrammarExercise type and
-- GrammarExerciseStepper component can be reused as-is via its
-- onAttempt/onComplete override props — no new component needed.
--
-- Vocabulary: matura_vocabulary_words / matura_vocabulary_progress mirror
-- vocabulary_words / vocabulary_progress the same way, organized by CKE's
-- official "kręgi tematyczne" (thematic circles) instead of Linguo's
-- CEFR-driven categories — reused via FlashcardTrainer's onAnswer override,
-- same pattern the Podręcznik feature already established.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Gramatyka
-- ----------------------------------------------------------------------------
create table if not exists matura_grammar_topics (
  id uuid primary key default gen_random_uuid(),
  level matura_level not null,
  slug text not null,
  title text not null,
  blocks jsonb not null default '[]'::jsonb,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (level, slug),
  unique (level, order_index)
);

create table if not exists matura_grammar_exercises (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references matura_grammar_topics (id) on delete cascade,
  type text not null check (type in ('gap_fill', 'multiple_choice', 'transformation')),
  prompt text not null,
  options jsonb,
  correct_answer text not null,
  order_index int not null default 0
);
create index if not exists matura_grammar_exercises_topic_idx on matura_grammar_exercises (topic_id);

create table if not exists matura_grammar_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  topic_id uuid not null references matura_grammar_topics (id) on delete cascade,
  exercise_id uuid references matura_grammar_exercises (id) on delete cascade,
  is_correct boolean not null,
  attempted_at timestamptz not null default now()
);
create index if not exists matura_grammar_progress_user_idx on matura_grammar_progress (user_id);
create index if not exists matura_grammar_progress_topic_idx on matura_grammar_progress (user_id, topic_id);

-- ----------------------------------------------------------------------------
-- Słownictwo
-- ----------------------------------------------------------------------------
create table if not exists matura_vocabulary_words (
  id uuid primary key default gen_random_uuid(),
  level matura_level not null,
  -- CKE "krąg tematyczny" (e.g. "Podróżowanie i turystyka") — reused as-is
  -- for FlashcardTrainer's word.category badge, see header comment.
  category text not null,
  word_en text not null,
  translation_pl text not null,
  example_sentence text,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists matura_vocabulary_words_level_idx on matura_vocabulary_words (level);
create index if not exists matura_vocabulary_words_category_idx on matura_vocabulary_words (category);

create table if not exists matura_vocabulary_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  word_id uuid not null references matura_vocabulary_words (id) on delete cascade,
  correct_count int not null default 0,
  incorrect_count int not null default 0,
  status mastery_status not null default 'new',
  last_reviewed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, word_id)
);
create index if not exists matura_vocabulary_progress_user_idx on matura_vocabulary_progress (user_id);

-- ----------------------------------------------------------------------------
-- updated_at maintenance
-- ----------------------------------------------------------------------------
do $$ begin
  create trigger matura_grammar_topics_set_updated_at before update on matura_grammar_topics
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table matura_grammar_topics enable row level security;
alter table matura_grammar_exercises enable row level security;
alter table matura_grammar_progress enable row level security;
alter table matura_vocabulary_words enable row level security;
alter table matura_vocabulary_progress enable row level security;

-- shared content: readable by all authenticated users, writable by admins
do $$ begin
  create policy "matura_grammar_topics_select" on matura_grammar_topics for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_grammar_topics_admin_write" on matura_grammar_topics for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "matura_grammar_exercises_select" on matura_grammar_exercises for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_grammar_exercises_admin_write" on matura_grammar_exercises for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "matura_vocabulary_words_select" on matura_vocabulary_words for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_vocabulary_words_admin_write" on matura_vocabulary_words for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

-- per-user tables: own rows + admin read, repo-wide convention
do $$ begin
  create policy "matura_grammar_progress_own" on matura_grammar_progress for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_grammar_progress_admin_read" on matura_grammar_progress for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "matura_vocabulary_progress_own" on matura_vocabulary_progress for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_vocabulary_progress_admin_read" on matura_vocabulary_progress for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;
