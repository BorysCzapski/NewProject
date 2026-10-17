-- ============================================================================
-- 0030_informatyka.sql
-- "Informatyka" mini-app: every task of the CKE matura rozszerzona z
-- informatyki (sessions 2022–2026, both the 2015 two-part formula and the 2023
-- formula) to solve in-app — scribble on a canvas, write code against the real
-- exam data files, work in an in-browser spreadsheet / SQL console — with
-- progress tracked in points. Prefix `informatyka_`.
--
-- Task statements are shown as cropped images of the exam PDF (tables, formulas
-- and figures survive that; they don't survive text extraction), imported once
-- by scripts/informatyka/ + scripts/informatyka-ingest.mjs. Shared content
-- (exams/tasks/problems/data files) is admin/service-role write, any
-- authenticated read; per-user rows (progress, settings) are owner-only.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- informatyka_exams: one row per exam session paper.
-- ----------------------------------------------------------------------------
create table if not exists informatyka_exams (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,                 -- e.g. "2026-maj", "2026-czerwiec-stara"
  year smallint not null,
  session text not null check (session in ('maj', 'czerwiec')),
  formula text not null check (formula in ('2015', '2023')),
  title text not null,
  exam_date date,
  duration_minutes int,
  max_points int not null,
  order_index int not null,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- informatyka_tasks: "Zadanie N" — the shared intro/data description that its
-- sub-problems build on. `part` is only set for the 2015 formula (Część I =
-- paper, Część II = on a computer).
-- ----------------------------------------------------------------------------
create table if not exists informatyka_tasks (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references informatyka_exams (id) on delete cascade,
  number int not null,
  part smallint check (part in (1, 2)),
  title text not null default '',
  intro_image_paths text[] not null default '{}',
  created_at timestamptz not null default now(),
  unique (exam_id, number)
);

-- ----------------------------------------------------------------------------
-- informatyka_problems: the scorable unit — "Zadanie N.M (0–k)", or the task
-- itself when it has no sub-numbers. `kind` is the way of working
-- (pisemne/program/arkusz/sql/teoria), `topic` the subject matter.
-- ----------------------------------------------------------------------------
create table if not exists informatyka_problems (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references informatyka_tasks (id) on delete cascade,
  label text not null,                       -- "3.2" (or "5" for standalone tasks)
  order_index int not null,
  points_max smallint not null check (points_max > 0),
  kind text not null check (kind in ('pisemne', 'program', 'arkusz', 'sql', 'teoria')),
  topic text not null default '',
  statement_image_paths text[] not null default '{}',
  key_image_paths text[] not null default '{}',
  scoring_text text not null default '',
  key_text text not null default '',
  result_file text,                          -- e.g. "wyniki3.txt"
  data_files text[] not null default '{}',   -- exam data files this problem uses
  -- Tables described only in the statement (not shipped as files), created
  -- empty in the SQL console so a query can still be written and run.
  sql_extra_schema text,
  needs_review boolean not null default false,
  created_at timestamptz not null default now(),
  unique (task_id, label)
);
create index if not exists informatyka_problems_task_idx on informatyka_problems (task_id, order_index);
create index if not exists informatyka_problems_kind_idx on informatyka_problems (kind, topic);

-- ----------------------------------------------------------------------------
-- informatyka_data_files: the CKE "DANE" files (liczby.txt, pary.txt, …) as
-- text. ~2.4 MB in total, largest ~320 KB, so a text column is fine; the
-- browser fetches only the files of the problem it is on.
-- ----------------------------------------------------------------------------
create table if not exists informatyka_data_files (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references informatyka_exams (id) on delete cascade,
  name text not null,
  content text not null,
  is_example boolean not null default false, -- *_przyklad.txt
  created_at timestamptz not null default now(),
  unique (exam_id, name)
);

-- ----------------------------------------------------------------------------
-- informatyka_progress: per-user work on one problem. `score` is the points the
-- student awarded themselves against the CKE scoring scheme.
-- ----------------------------------------------------------------------------
create table if not exists informatyka_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  problem_id uuid not null references informatyka_problems (id) on delete cascade,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  score numeric check (score >= 0),
  done_at timestamptz,
  code text,
  answer_text text,
  sql_text text,
  canvas_path text,
  sheet_path text,
  updated_at timestamptz not null default now(),
  unique (user_id, problem_id)
);
create index if not exists informatyka_progress_user_idx on informatyka_progress (user_id);
-- Powers the exam-countdown heatmap's per-day aggregation.
create index if not exists informatyka_progress_done_at_idx
  on informatyka_progress (user_id, done_at) where done_at is not null;

-- ----------------------------------------------------------------------------
-- informatyka_settings: just the exam date. No row / null = "not set yet".
-- ----------------------------------------------------------------------------
create table if not exists informatyka_settings (
  user_id uuid primary key references profiles (id) on delete cascade,
  exam_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

do $$ begin
  create trigger informatyka_progress_set_updated_at before update on informatyka_progress
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger informatyka_settings_set_updated_at before update on informatyka_settings
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table informatyka_exams enable row level security;
alter table informatyka_tasks enable row level security;
alter table informatyka_problems enable row level security;
alter table informatyka_data_files enable row level security;
alter table informatyka_progress enable row level security;
alter table informatyka_settings enable row level security;

-- shared content: readable by all authenticated users, writable by admins
-- (the import script uses the service-role key, which bypasses RLS anyway)
do $$ begin
  create policy "informatyka_exams_select" on informatyka_exams for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "informatyka_exams_admin_write" on informatyka_exams for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "informatyka_tasks_select" on informatyka_tasks for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "informatyka_tasks_admin_write" on informatyka_tasks for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "informatyka_problems_select" on informatyka_problems for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "informatyka_problems_admin_write" on informatyka_problems for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "informatyka_data_files_select" on informatyka_data_files for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "informatyka_data_files_admin_write" on informatyka_data_files for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

-- per-user
do $$ begin
  create policy "informatyka_progress_own" on informatyka_progress for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "informatyka_progress_admin_read" on informatyka_progress for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "informatyka_settings_own" on informatyka_settings for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "informatyka_settings_admin_read" on informatyka_settings for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Storage. Exam page crops: shared, any authenticated read, written only by the
-- import script's service-role client. Canvas drawings and spreadsheet
-- snapshots: folder-per-user (same pattern as maturalnik-canvas, math-attempts).
-- All three private — the exam papers are copyrighted CKE material.
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
  values ('informatyka-pages', 'informatyka-pages', false)
  on conflict (id) do nothing;
do $$ begin
  create policy "informatyka_pages_storage_read" on storage.objects for select to authenticated
    using (bucket_id = 'informatyka-pages');
exception when duplicate_object then null; end $$;

insert into storage.buckets (id, name, public)
  values ('informatyka-canvas', 'informatyka-canvas', false)
  on conflict (id) do nothing;
do $$ begin
  create policy "informatyka_canvas_storage_own" on storage.objects for all to authenticated
    using (bucket_id = 'informatyka-canvas' and (storage.foldername(name))[1] = auth.uid()::text)
    with check (bucket_id = 'informatyka-canvas' and (storage.foldername(name))[1] = auth.uid()::text);
exception when duplicate_object then null; end $$;

insert into storage.buckets (id, name, public)
  values ('informatyka-sheets', 'informatyka-sheets', false)
  on conflict (id) do nothing;
do $$ begin
  create policy "informatyka_sheets_storage_own" on storage.objects for all to authenticated
    using (bucket_id = 'informatyka-sheets' and (storage.foldername(name))[1] = auth.uid()::text)
    with check (bucket_id = 'informatyka-sheets' and (storage.foldername(name))[1] = auth.uid()::text);
exception when duplicate_object then null; end $$;
