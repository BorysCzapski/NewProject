-- ============================================================================
-- 0013_matura.sql
-- "Matura Angielski" mini-app: CKE-aligned exam prep for the Polish English
-- matura (poziom podstawowy / rozszerzony) — a sibling app to Matma, same
-- shape: shared content (sections/lessons/task bank) + per-user attempts,
-- mastery-per-section, mock exams, a study plan to exam day, and a teacher
-- assignment/import panel. Prefix `matura_`, mirroring Matma's `math_`.
--
-- CKE English matura has FOUR exam parts (same at both levels, different
-- difficulty/weight): rozumienie ze słuchu, rozumienie tekstów pisanych,
-- znajomość środków językowych, wypowiedź pisemna — modeled as
-- matura_sections, one row per (level, part). exam_weight is an editable
-- ADMIN APPROXIMATION (same caveat as math_topics.exam_weight in
-- 0007_matma.sql) — CKE does not publish a fixed point split that's stable
-- across sessions. The overall exam totals (60 pkt podstawowa / 50 pkt
-- rozszerzona) ARE a structural fact of the exam format, not an estimate —
-- see MATURA_MAX_POINTS in lib/matura/constants.ts.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
do $$ begin
  create type matura_level as enum ('podstawowa', 'rozszerzona');
exception when duplicate_object then null; end $$;

do $$ begin
  create type matura_task_source as enum ('topic', 'past_exam', 'curated', 'ai_generated');
exception when duplicate_object then null; end $$;

do $$ begin
  create type matura_mock_exam_status as enum ('in_progress', 'completed', 'abandoned');
exception when duplicate_object then null; end $$;

do $$ begin
  create type matura_study_plan_week_status as enum (
    'upcoming', 'in_progress', 'completed', 'partially_completed', 'skipped'
  );
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- matura_sections: the 4 CKE exam parts, once per level (see
-- lib/matura/sections.ts MATURA_SECTIONS for the canonical seeded list).
-- Shared content.
-- ----------------------------------------------------------------------------
create table if not exists matura_sections (
  id uuid primary key default gen_random_uuid(),
  level matura_level not null,
  slug text not null,
  title text not null,
  description text not null default '',
  order_index int not null,
  -- Orientacyjna waga do "szacowanego wyniku" na dashboardzie — NIE jest
  -- twardą regułą CKE, edytowalna przez admina. Patrz komentarz wyżej.
  exam_weight numeric not null default 0.25 check (exam_weight >= 0 and exam_weight <= 1),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (level, slug),
  unique (level, order_index)
);

-- ----------------------------------------------------------------------------
-- matura_lessons: ordered, block-based lesson content per section (jsonb
-- array of GrammarBlock, reusing lib/grammar/lesson-blocks.ts — this is text
-- content like grammar explanations, not interactive math widgets, so it
-- reuses that renderer instead of inventing a parallel block type).
-- ----------------------------------------------------------------------------
create table if not exists matura_lessons (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references matura_sections (id) on delete cascade,
  title text not null,
  content jsonb not null default '[]'::jsonb,
  order_index int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists matura_lessons_section_idx on matura_lessons (section_id, order_index);

-- ----------------------------------------------------------------------------
-- matura_tasks: the task bank (all four sources — see matura_task_source).
-- content is jsonb: { instructions, items: MaturaTaskItem[] } — see
-- lib/types/database.ts MaturaTaskContent. Each item is graded independently
-- (1 point each), matching the real exam's numbered sub-item convention
-- (e.g. "zadanie 4.1–4.5").
-- ----------------------------------------------------------------------------
create table if not exists matura_tasks (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references matura_sections (id) on delete cascade,
  content jsonb not null,
  points_max smallint not null check (points_max > 0),
  source matura_task_source not null default 'topic',
  -- past_exam: { year, session, source_url }. curated: { attribution }.
  -- Both (plus ai_generated) may carry needsReview — see MathPastExamMetadata
  -- precedent in 0007_matma.sql.
  source_metadata jsonb,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists matura_tasks_section_idx on matura_tasks (section_id);
create index if not exists matura_tasks_source_idx on matura_tasks (source);

-- ----------------------------------------------------------------------------
-- matura_mock_exams: full exam simulations across all 4 sections. Created
-- BEFORE matura_task_attempts below, which references it.
-- ----------------------------------------------------------------------------
create table if not exists matura_mock_exams (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  level matura_level not null,
  task_ids jsonb not null default '[]'::jsonb,
  time_limit_seconds int not null default 9000,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  total_points numeric,
  max_points numeric not null,
  breakdown jsonb,
  draft_answers jsonb not null default '{}'::jsonb,
  status matura_mock_exam_status not null default 'in_progress'
);
create index if not exists matura_mock_exams_user_idx on matura_mock_exams (user_id, started_at desc);

-- ----------------------------------------------------------------------------
-- matura_task_attempts: one row per submitted attempt at a task. Grading for
-- the language-in-use section is purely programmatic (exact-normalized
-- string match, see lib/matura/grading.ts) — item_results records the
-- per-item breakdown so the UI can show what was right/wrong without
-- re-deriving it from matura_tasks.content.
-- ----------------------------------------------------------------------------
create table if not exists matura_task_attempts (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references matura_tasks (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  answers jsonb not null default '{}'::jsonb,
  points_awarded numeric not null,
  max_points numeric not null,
  item_results jsonb not null default '[]'::jsonb,
  -- set when this attempt was submitted as part of a mock exam, rather than
  -- standalone section practice.
  mock_exam_id uuid references matura_mock_exams (id) on delete set null,
  attempted_at timestamptz not null default now()
);
create index if not exists matura_task_attempts_user_idx on matura_task_attempts (user_id, attempted_at desc);
create index if not exists matura_task_attempts_task_idx on matura_task_attempts (task_id);
create index if not exists matura_task_attempts_exam_idx on matura_task_attempts (mock_exam_id);

-- ----------------------------------------------------------------------------
-- matura_section_progress: per-user, per-section mastery — same shape as
-- math_topic_progress, reuses the existing mastery_status enum.
-- ----------------------------------------------------------------------------
create table if not exists matura_section_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  section_id uuid not null references matura_sections (id) on delete cascade,
  status mastery_status not null default 'new',
  mastery_score numeric not null default 0 check (mastery_score >= 0 and mastery_score <= 100),
  diagnosed_at timestamptz,
  last_reviewed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, section_id)
);
create index if not exists matura_section_progress_user_idx on matura_section_progress (user_id);

-- ----------------------------------------------------------------------------
-- matura_progress_snapshots: point-in-time dashboard trend data.
-- ----------------------------------------------------------------------------
create table if not exists matura_progress_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  level matura_level not null,
  snapshot_at timestamptz not null default now(),
  estimated_score numeric not null,
  estimated_percent numeric not null,
  section_breakdown jsonb not null default '{}'::jsonb
);
create index if not exists matura_progress_snapshots_user_idx on matura_progress_snapshots (user_id, snapshot_at);

-- ----------------------------------------------------------------------------
-- matura_study_plans / matura_study_plan_weeks: optional calendar-anchored
-- plan to a specific exam date. Same shape as math_study_plans.
-- ----------------------------------------------------------------------------
create table if not exists matura_study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  level matura_level not null,
  exam_date date,
  weekly_hours_target numeric,
  generated_at timestamptz not null default now(),
  last_recomputed_at timestamptz,
  unique (user_id)
);

create table if not exists matura_study_plan_weeks (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references matura_study_plans (id) on delete cascade,
  week_index int not null,
  target_start_date date not null,
  target_end_date date not null,
  section_ids jsonb not null default '[]'::jsonb,
  is_review_week boolean not null default false,
  status matura_study_plan_week_status not null default 'upcoming',
  unique (plan_id, week_index)
);
create index if not exists matura_study_plan_weeks_plan_idx on matura_study_plan_weeks (plan_id, week_index);

-- ----------------------------------------------------------------------------
-- matura_assigned_practice: admin panel "one-click assign practice from a
-- weak section" — same analogue as math_assigned_practice.
-- ----------------------------------------------------------------------------
create table if not exists matura_assigned_practice (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references profiles (id) on delete cascade,
  section_id uuid not null references matura_sections (id) on delete cascade,
  assigned_by uuid references profiles (id) on delete set null,
  note text,
  created_at timestamptz not null default now(),
  dismissed_at timestamptz
);
create index if not exists matura_assigned_practice_student_idx on matura_assigned_practice (student_id, created_at desc);

-- ----------------------------------------------------------------------------
-- matura_settings: one row per user — the chosen poziom matury (podstawowa/
-- rozszerzona), picked on first visit and changeable later. Deliberately
-- separate from matura_study_plans (which may not exist yet when the level
-- is first picked, and isn't required just to practice).
-- ----------------------------------------------------------------------------
create table if not exists matura_settings (
  user_id uuid primary key references profiles (id) on delete cascade,
  level matura_level not null default 'podstawowa',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- updated_at maintenance (reuses public.set_updated_at() from 0001_init.sql)
-- ----------------------------------------------------------------------------
do $$ begin
  create trigger matura_sections_set_updated_at before update on matura_sections
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger matura_lessons_set_updated_at before update on matura_lessons
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger matura_section_progress_set_updated_at before update on matura_section_progress
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger matura_settings_set_updated_at before update on matura_settings
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table matura_sections enable row level security;
alter table matura_lessons enable row level security;
alter table matura_tasks enable row level security;
alter table matura_task_attempts enable row level security;
alter table matura_mock_exams enable row level security;
alter table matura_section_progress enable row level security;
alter table matura_progress_snapshots enable row level security;
alter table matura_study_plans enable row level security;
alter table matura_study_plan_weeks enable row level security;
alter table matura_assigned_practice enable row level security;
alter table matura_settings enable row level security;

-- shared content: readable by all authenticated users, writable by admins
do $$ begin
  create policy "matura_sections_select" on matura_sections for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_sections_admin_write" on matura_sections for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "matura_lessons_select" on matura_lessons for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_lessons_admin_write" on matura_lessons for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "matura_tasks_select" on matura_tasks for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_tasks_admin_write" on matura_tasks for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

-- per-user tables: own rows + admin read, repo-wide convention
do $$ begin
  create policy "matura_task_attempts_own" on matura_task_attempts for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_task_attempts_admin_read" on matura_task_attempts for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "matura_mock_exams_own" on matura_mock_exams for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_mock_exams_admin_read" on matura_mock_exams for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "matura_section_progress_own" on matura_section_progress for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_section_progress_admin_read" on matura_section_progress for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "matura_progress_snapshots_own" on matura_progress_snapshots for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_progress_snapshots_admin_read" on matura_progress_snapshots for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "matura_study_plans_own" on matura_study_plans for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_study_plans_admin_read" on matura_study_plans for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

-- matura_study_plan_weeks has no user_id column directly — ownership flows
-- through plan_id, so RLS checks the parent matura_study_plans row.
do $$ begin
  create policy "matura_study_plan_weeks_own" on matura_study_plan_weeks for all to authenticated
    using (exists (
      select 1 from matura_study_plans p where p.id = plan_id and p.user_id = auth.uid()
    ))
    with check (exists (
      select 1 from matura_study_plans p where p.id = plan_id and p.user_id = auth.uid()
    ));
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_study_plan_weeks_admin_read" on matura_study_plan_weeks for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "matura_assigned_practice_student_read" on matura_assigned_practice for select to authenticated
    using (auth.uid() = student_id or public.is_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_assigned_practice_student_dismiss" on matura_assigned_practice for update to authenticated
    using (auth.uid() = student_id) with check (auth.uid() = student_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_assigned_practice_admin_write" on matura_assigned_practice for insert to authenticated
    with check (public.is_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_assigned_practice_admin_delete" on matura_assigned_practice for delete to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "matura_settings_own" on matura_settings for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_settings_admin_read" on matura_settings for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;
