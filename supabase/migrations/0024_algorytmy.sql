-- ============================================================================
-- 0024_algorytmy.sql
-- "Algorytmy" mini-app: interactive teaching of programming concepts, data
-- structures and algorithms. Prefix `algo_`, same shape as the other learning
-- apps — shared content (topics, lessons, exercise bank) plus per-user
-- progress and attempts.
--
-- Two deliberate differences from its siblings:
--
-- 1. Exercises are SINGLE-CHOICE only. algo_exercises has options/
--    correct_option_id and no free-text answer path, because an answer about
--    an algorithm graded by an LLM is a verdict nobody can check (see
--    lib/algorytmy/task-types.ts). Grading here is exact and programmatic.
--
-- 2. task_type is NOT NULL from the start. Matura had to backfill the column
--    onto an existing bank (0023_matura_task_types.sql); this app is born with
--    the type axis, so a row without a type is simply invalid — it could never
--    be handed out, since every route into an exercise goes through a type.
--
-- Numeracja: `0024` jest kolejnym wolnym numerem W REPO. Baza deweloperska
-- bywa wyprzedzona przez migracje z równoległych worktree, a runner
-- (scripts/db.mjs) rozpoznaje migracje po numerze wersji, nie po nazwie pliku —
-- zajęty numer zostałby po cichu uznany za wgrany i NIGDY by się nie wykonał.
-- Przed wgraniem: `npm run db status`.
-- ============================================================================

do $$ begin
  create type algo_category as enum ('podstawy', 'struktury', 'algorytmy');
exception when duplicate_object then null; end $$;

do $$ begin
  create type algo_exercise_source as enum ('curated', 'ai_generated');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- algo_topics: the 12 działy. Shared content, seeded from
-- supabase/seed/algorytmy/01_topics.sql (authored from lib/algorytmy/topics.ts).
-- ----------------------------------------------------------------------------
create table if not exists algo_topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  category algo_category not null,
  order_index int not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists algo_topics_order_idx on algo_topics (order_index);

-- ----------------------------------------------------------------------------
-- algo_lessons: block-based lesson content (jsonb array of AlgoBlock — see
-- lib/algorytmy/lesson-blocks.ts). Generated into
-- supabase/seed/algorytmy/03_lessons.sql from authored JSON by
-- scripts/algorytmy-build-lessons.mjs, which validates every block against the
-- same contract before any of it can reach the database.
-- ----------------------------------------------------------------------------
create table if not exists algo_lessons (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references algo_topics (id) on delete cascade,
  slug text not null,
  title text not null,
  summary text not null default '',
  content jsonb not null default '[]'::jsonb,
  reading_minutes int not null default 8,
  order_index int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (topic_id, slug)
);
create index if not exists algo_lessons_topic_idx on algo_lessons (topic_id, order_index);

-- ----------------------------------------------------------------------------
-- algo_lesson_progress: the "przerobione" marker. One row per (user, lesson),
-- same shape as matura_lesson_progress.
-- ----------------------------------------------------------------------------
create table if not exists algo_lesson_progress (
  user_id uuid not null references profiles (id) on delete cascade,
  lesson_id uuid not null references algo_lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- ----------------------------------------------------------------------------
-- algo_exercises: the shared bank. `task_type` is a slug from
-- lib/algorytmy/task-types.ts and is the axis the student practises along.
--
-- options is a jsonb array of { id, text }; correct_option_id names one of
-- them. Storing the answer as an ID rather than the option text means an
-- exercise whose options get re-worded cannot silently lose its answer.
--
-- code is nullable and holds the snippet shown above the question for the
-- wynik-kodu / analiza-bledu types.
-- ----------------------------------------------------------------------------
create table if not exists algo_exercises (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references algo_topics (id) on delete cascade,
  task_type text not null,
  statement text not null,
  code text,
  code_language text,
  options jsonb not null,
  correct_option_id text not null,
  explanation text not null default '',
  difficulty smallint not null default 2 check (difficulty between 1 and 3),
  points_max smallint not null default 1 check (points_max > 0),
  source algo_exercise_source not null default 'curated',
  -- Generated rows are usable immediately but flagged, mirroring
  -- geo_exercises.needs_review and math_problems' needsReview metadata: an
  -- admin confirms them before they count as fully trusted.
  needs_review boolean not null default false,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists algo_exercises_topic_type_idx on algo_exercises (topic_id, task_type);

-- ----------------------------------------------------------------------------
-- algo_exercise_attempts: one row per submitted answer. Grading is exact
-- (chosen option vs correct_option_id), so points_awarded is derived
-- server-side in lib/algorytmy/actions.ts and never sent by the client.
-- ----------------------------------------------------------------------------
create table if not exists algo_exercise_attempts (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references algo_exercises (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  chosen_option_id text not null,
  is_correct boolean not null,
  points_awarded numeric not null default 0 check (points_awarded >= 0),
  points_max smallint not null,
  attempted_at timestamptz not null default now()
);
create index if not exists algo_attempts_user_idx on algo_exercise_attempts (user_id, attempted_at desc);
create index if not exists algo_attempts_exercise_idx on algo_exercise_attempts (exercise_id);

-- ----------------------------------------------------------------------------
-- RLS
-- ----------------------------------------------------------------------------
alter table algo_topics enable row level security;
alter table algo_lessons enable row level security;
alter table algo_lesson_progress enable row level security;
alter table algo_exercises enable row level security;
alter table algo_exercise_attempts enable row level security;

-- shared content: everyone reads, admin writes
do $$ begin
  create policy "algo_topics_select" on algo_topics for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "algo_topics_admin_write" on algo_topics for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "algo_lessons_select" on algo_lessons for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "algo_lessons_admin_write" on algo_lessons for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

-- Exercises: readable by everyone, and insertable by the student who authored
-- the row. That is what lets the practice queue top itself up without a
-- service-role key — exactly the arrangement geo_exercises already uses
-- (0015_geografia.sql). The generated row still lands in the SHARED bank;
-- created_by only records who caused it to exist.
do $$ begin
  create policy "algo_exercises_select" on algo_exercises for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "algo_exercises_insert_own" on algo_exercises for insert to authenticated
    with check (auth.uid() = created_by or public.is_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "algo_exercises_admin_update" on algo_exercises for update to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "algo_exercises_delete_own" on algo_exercises for delete to authenticated
    using (auth.uid() = created_by or public.is_admin());
exception when duplicate_object then null; end $$;

-- per-user tables: own rows only
do $$ begin
  create policy "algo_lesson_progress_own" on algo_lesson_progress for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "algo_attempts_own" on algo_exercise_attempts for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
