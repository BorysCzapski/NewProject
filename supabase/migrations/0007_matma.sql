-- ============================================================================
-- 0007_matma.sql
-- "Matma" mini-app: a full self-study course + problem trainer + exam
-- simulator for the Polish "matura rozszerzona z matematyki" (CKE). Product
-- goal: help the student reach >=80% (40/50 pts) on the real exam.
--
-- Content tables (math_topics/math_lessons/math_problems/
-- math_learning_path_stages) are shared, admin-authored content — readable
-- by every authenticated user, writable only by admins, same pattern as
-- grammar_topics/vocabulary_words in 0001_init.sql. Per-user tables follow
-- the repo-wide RLS convention: "<table>_own" (auth.uid() = user_id) +
-- "<table>_admin_read" (public.is_admin()).
--
-- math_topics.exam_weight is intentionally a plain editable numeric column,
-- not a hardcoded constant: CKE does not publish a fixed per-topic point
-- distribution, so it is only ever used to compute an ESTIMATE, and admins
-- must be able to retune it as new exam sessions are analyzed.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
do $$ begin
  create type math_problem_source as enum ('topic', 'past_exam', 'curated', 'ai_generated');
exception when duplicate_object then null; end $$;

do $$ begin
  create type math_mock_exam_status as enum ('in_progress', 'completed', 'abandoned');
exception when duplicate_object then null; end $$;

do $$ begin
  create type math_study_plan_week_status as enum (
    'upcoming', 'in_progress', 'completed', 'partially_completed', 'skipped'
  );
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- math_topics: the 12 CKE-rozszerzona departments (see lib/matma/topics.ts
-- MATH_TOPIC_SLUGS for the canonical seeded list). Shared content.
-- ----------------------------------------------------------------------------
create table if not exists math_topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  order_index int not null,
  -- Orientacyjna waga do "szacowanego wyniku" na dashboardzie — NIE jest
  -- twardą regułą CKE (rozkład bywa inny co roku), edytowalna przez admina.
  exam_weight numeric not null default 0.08 check (exam_weight >= 0 and exam_weight <= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists math_topics_order_idx on math_topics (order_index);

-- ----------------------------------------------------------------------------
-- math_lessons: ordered, block-based lesson content per topic (jsonb array
-- of MathBlock, see lib/matma/lesson-blocks.ts). A topic can have several
-- lessons (e.g. "powtórka podstaw" first, then rozszerzenie).
-- ----------------------------------------------------------------------------
create table if not exists math_lessons (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references math_topics (id) on delete cascade,
  title text not null,
  content jsonb not null default '[]'::jsonb,
  order_index int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists math_lessons_topic_idx on math_lessons (topic_id, order_index);

-- ----------------------------------------------------------------------------
-- math_problems: the problem bank (all four sources — see math_problem_source).
-- content is jsonb: { statement: string (KaTeX-friendly text), imageUrl?: string }.
-- grading_criteria is jsonb: [{ step: string, points: number, description: string }],
-- the analytical CKE-style partial-credit scheme used by the AI grader.
-- ----------------------------------------------------------------------------
create table if not exists math_problems (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references math_topics (id) on delete cascade,
  content jsonb not null,
  difficulty smallint not null check (difficulty between 1 and 3),
  is_proof boolean not null default false,
  points_max smallint not null check (points_max > 0),
  source math_problem_source not null default 'topic',
  grading_criteria jsonb not null default '[]'::jsonb,
  -- past_exam: { year, session, formula, source_url }. curated: { attribution }.
  source_metadata jsonb,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists math_problems_topic_idx on math_problems (topic_id, difficulty);
create index if not exists math_problems_source_idx on math_problems (source);

-- ----------------------------------------------------------------------------
-- math_mock_exams: full 180-minute / 50-point exam simulations. Created
-- BEFORE math_problem_attempts below, which references it.
-- draft_answers autosaves in-progress work (student can refresh/resume
-- within the 180-minute window) as { [problem_id]: { answerText,
-- canvasImageUrl, methodDescription, savedAt } }; it is cleared once the
-- exam is graded and finalized into per-problem math_problem_attempts rows.
-- ----------------------------------------------------------------------------
create table if not exists math_mock_exams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  problem_ids jsonb not null default '[]'::jsonb,
  time_limit_seconds int not null default 10800,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  total_points numeric,
  max_points numeric not null default 50,
  breakdown jsonb,
  draft_answers jsonb not null default '{}'::jsonb,
  status math_mock_exam_status not null default 'in_progress'
);
create index if not exists math_mock_exams_user_idx on math_mock_exams (user_id, started_at desc);

-- ----------------------------------------------------------------------------
-- math_problem_attempts: one row per submitted attempt at a problem.
-- canvas_image_url points at Supabase Storage bucket "math-attempts"
-- (path convention: <user_id>/<attempt-id>.png, see storage policies below).
-- ----------------------------------------------------------------------------
create table if not exists math_problem_attempts (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null references math_problems (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  answer_text text,
  canvas_image_url text,
  method_description text,
  points_awarded numeric,
  -- { max_points, step_breakdown: [{step,points_awarded,satisfied,justification}], improvement_tip }
  ai_feedback jsonb,
  -- set when this attempt was submitted as part of a mock exam, rather than
  -- standalone topic practice — lets the exam-finish flow aggregate its own
  -- attempts into `math_mock_exams.breakdown` without a join table.
  mock_exam_id uuid references math_mock_exams (id) on delete set null,
  attempted_at timestamptz not null default now()
);
create index if not exists math_problem_attempts_user_idx on math_problem_attempts (user_id, attempted_at desc);
create index if not exists math_problem_attempts_problem_idx on math_problem_attempts (problem_id);
create index if not exists math_problem_attempts_exam_idx on math_problem_attempts (mock_exam_id);

-- ----------------------------------------------------------------------------
-- math_topic_progress: per-user, per-topic mastery — the "ścieżka nauki"
-- gate (see lib.constants.MIN_MASTERY_THRESHOLD, applied PER TOPIC here).
-- Reuses the existing mastery_status enum ('new'/'learning'/'mastered').
-- ----------------------------------------------------------------------------
create table if not exists math_topic_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  topic_id uuid not null references math_topics (id) on delete cascade,
  status mastery_status not null default 'new',
  mastery_score numeric not null default 0 check (mastery_score >= 0 and mastery_score <= 100),
  diagnosed_at timestamptz,
  last_reviewed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, topic_id)
);
create index if not exists math_topic_progress_user_idx on math_topic_progress (user_id);

-- ----------------------------------------------------------------------------
-- math_learning_path_stages: ordered roadmap, one stage per topic (shared
-- content, same pattern as learning_path_stages in 0002).
-- ----------------------------------------------------------------------------
create table if not exists math_learning_path_stages (
  id uuid primary key default gen_random_uuid(),
  order_index int not null,
  topic_id uuid not null references math_topics (id) on delete cascade,
  title text not null,
  created_at timestamptz not null default now(),
  unique (order_index)
);

-- ----------------------------------------------------------------------------
-- math_progress_snapshots: point-in-time dashboard trend data, written after
-- each completed study session / mock exam.
-- ----------------------------------------------------------------------------
create table if not exists math_progress_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  snapshot_at timestamptz not null default now(),
  estimated_score numeric not null,
  estimated_percent numeric not null,
  topic_breakdown jsonb not null default '{}'::jsonb
);
create index if not exists math_progress_snapshots_user_idx on math_progress_snapshots (user_id, snapshot_at);

-- ----------------------------------------------------------------------------
-- math_study_plans / math_study_plan_weeks: optional calendar-anchored plan
-- to a specific exam date. exam_date null => the timed schedule is simply
-- switched off in the UI; the untimed learning path keeps working.
-- ----------------------------------------------------------------------------
create table if not exists math_study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  exam_date date,
  weekly_hours_target numeric,
  generated_at timestamptz not null default now(),
  last_recomputed_at timestamptz,
  unique (user_id)
);

create table if not exists math_study_plan_weeks (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references math_study_plans (id) on delete cascade,
  week_index int not null,
  target_start_date date not null,
  target_end_date date not null,
  topic_ids jsonb not null default '[]'::jsonb,
  is_review_week boolean not null default false,
  status math_study_plan_week_status not null default 'upcoming',
  unique (plan_id, week_index)
);
create index if not exists math_study_plan_weeks_plan_idx on math_study_plan_weeks (plan_id, week_index);

-- ----------------------------------------------------------------------------
-- math_assigned_practice: admin panel "one-click assign practice from a weak
-- topic" (spec's homework-panel equivalent for Matma). NOT the Linguo
-- `homework` table — that table's `language` column is a hard `en|es|ru`
-- enum, incompatible with a math assignment. This is a much smaller
-- analogue: a note the student's dashboard surfaces as a teacher pointer.
-- ----------------------------------------------------------------------------
create table if not exists math_assigned_practice (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles (id) on delete cascade,
  topic_id uuid not null references math_topics (id) on delete cascade,
  assigned_by uuid references profiles (id) on delete set null,
  note text,
  created_at timestamptz not null default now(),
  dismissed_at timestamptz
);
create index if not exists math_assigned_practice_student_idx on math_assigned_practice (student_id, created_at desc);

alter table math_assigned_practice enable row level security;

do $$ begin
  create policy "math_assigned_practice_student_read" on math_assigned_practice for select to authenticated
    using (auth.uid() = student_id or public.is_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "math_assigned_practice_student_dismiss" on math_assigned_practice for update to authenticated
    using (auth.uid() = student_id) with check (auth.uid() = student_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "math_assigned_practice_admin_write" on math_assigned_practice for insert to authenticated
    with check (public.is_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "math_assigned_practice_admin_delete" on math_assigned_practice for delete to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- updated_at maintenance (reuses public.set_updated_at() from 0001_init.sql)
-- ----------------------------------------------------------------------------
do $$ begin
  create trigger math_topics_set_updated_at before update on math_topics
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger math_lessons_set_updated_at before update on math_lessons
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger math_topic_progress_set_updated_at before update on math_topic_progress
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table math_topics enable row level security;
alter table math_lessons enable row level security;
alter table math_problems enable row level security;
alter table math_problem_attempts enable row level security;
alter table math_mock_exams enable row level security;
alter table math_topic_progress enable row level security;
alter table math_learning_path_stages enable row level security;
alter table math_progress_snapshots enable row level security;
alter table math_study_plans enable row level security;
alter table math_study_plan_weeks enable row level security;

-- shared content: readable by all authenticated users, writable by admins
do $$ begin
  create policy "math_topics_select" on math_topics for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "math_topics_admin_write" on math_topics for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "math_lessons_select" on math_lessons for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "math_lessons_admin_write" on math_lessons for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "math_problems_select" on math_problems for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "math_problems_admin_write" on math_problems for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "math_learning_path_stages_select" on math_learning_path_stages for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "math_learning_path_stages_admin_write" on math_learning_path_stages for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

-- per-user tables: own rows + admin read, repo-wide convention
do $$ begin
  create policy "math_problem_attempts_own" on math_problem_attempts for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "math_problem_attempts_admin_read" on math_problem_attempts for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "math_mock_exams_own" on math_mock_exams for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "math_mock_exams_admin_read" on math_mock_exams for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "math_topic_progress_own" on math_topic_progress for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "math_topic_progress_admin_read" on math_topic_progress for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "math_progress_snapshots_own" on math_progress_snapshots for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "math_progress_snapshots_admin_read" on math_progress_snapshots for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "math_study_plans_own" on math_study_plans for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "math_study_plans_admin_read" on math_study_plans for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

-- math_study_plan_weeks has no user_id column directly — ownership flows
-- through plan_id, so RLS checks the parent math_study_plans row.
do $$ begin
  create policy "math_study_plan_weeks_own" on math_study_plan_weeks for all to authenticated
    using (exists (
      select 1 from math_study_plans p where p.id = plan_id and p.user_id = auth.uid()
    ))
    with check (exists (
      select 1 from math_study_plans p where p.id = plan_id and p.user_id = auth.uid()
    ));
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "math_study_plan_weeks_admin_read" on math_study_plan_weeks for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Storage: canvas snapshots (ink layer / brudnopis, see math_problem_attempts
-- .canvas_image_url). Private bucket, one folder per user.
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('math-attempts', 'math-attempts', false)
on conflict (id) do nothing;

do $$ begin
  create policy "math_attempts_storage_own" on storage.objects for all to authenticated
    using (bucket_id = 'math-attempts' and (storage.foldername(name))[1] = auth.uid()::text)
    with check (bucket_id = 'math-attempts' and (storage.foldername(name))[1] = auth.uid()::text);
exception when duplicate_object then null; end $$;
