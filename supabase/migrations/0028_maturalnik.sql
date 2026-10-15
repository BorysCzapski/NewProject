-- ============================================================================
-- 0028_maturalnik.sql
-- "Maturalnik" mini-app: a digitized problem book for matura rozszerzona
-- matematyki, imported once from a scanned OneNote notebook (17 chapters,
-- ~612 cropped problem-statement images — no solutions or diagrams in the
-- source material, the book expects the student to draw their own figure).
-- Shared content (chapters/problems, admin-write) + per-user progress/canvas
-- + per-user exam-date setting, same shape as math_* (0007_matma.sql) and
-- matura_settings (0013_matura.sql). Prefix `maturalnik_`.
--
-- ai_solution is generated lazily (on first "pokaż rozwiązanie" click) by the
-- app itself via Groq vision, cached here — NOT part of the source material,
-- always shown with an "AI-generated, may be wrong" disclaimer in the UI.
--
-- flagged_for_review: the ingestion script (scripts/maturalnik-ingest.mjs)
-- carves images out of the notebook's binary format by scanning for JPEG
-- byte signatures, which occasionally mis-bounds two adjacent images into one
-- corrupted/"double-exposed" blob. Flagged rows are still shown to students
-- (with a visible badge) rather than hidden, so nothing silently disappears.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- maturalnik_chapters: the 17 book chapters. Shared content.
-- ----------------------------------------------------------------------------
create table if not exists maturalnik_chapters (
  id uuid primary key default gen_random_uuid(),
  number smallint not null,
  slug text not null,
  title text not null,
  order_index int not null,
  created_at timestamptz not null default now(),
  unique (number),
  unique (slug)
);

-- ----------------------------------------------------------------------------
-- maturalnik_problems: one row per cropped problem image. The "Zadanie N.M
-- [źródło, punkty]" citation is already baked into the image itself, so it's
-- not duplicated as separate columns here. Shared content.
-- ----------------------------------------------------------------------------
create table if not exists maturalnik_problems (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references maturalnik_chapters (id) on delete cascade,
  number int not null,
  image_path text not null,
  ai_solution jsonb,
  flagged_for_review boolean not null default false,
  created_at timestamptz not null default now(),
  unique (chapter_id, number)
);
create index if not exists maturalnik_problems_chapter_idx on maturalnik_problems (chapter_id, number);

-- ----------------------------------------------------------------------------
-- maturalnik_progress: per-user done flag + canvas drawing, one row per
-- (user, problem). canvas_path points at a single, overwritten PNG per pair
-- (not an append-only attempt log like math_problem_attempts) — the student
-- keeps working on the same drawing across visits.
-- ----------------------------------------------------------------------------
create table if not exists maturalnik_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  problem_id uuid not null references maturalnik_problems (id) on delete cascade,
  done boolean not null default false,
  done_at timestamptz,
  canvas_path text,
  updated_at timestamptz not null default now(),
  unique (user_id, problem_id)
);
create index if not exists maturalnik_progress_user_idx on maturalnik_progress (user_id);
-- Powers the exam-countdown heatmap's "count done-today" query.
create index if not exists maturalnik_progress_done_at_idx
  on maturalnik_progress (user_id, done_at) where done_at is not null;

-- ----------------------------------------------------------------------------
-- maturalnik_settings: one row per user — just the exam date. No row / null
-- exam_date both mean "not set yet" (same semantics as matura_settings).
-- ----------------------------------------------------------------------------
create table if not exists maturalnik_settings (
  user_id uuid primary key references profiles (id) on delete cascade,
  exam_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- updated_at maintenance (reuses public.set_updated_at() from 0001_init.sql)
-- ----------------------------------------------------------------------------
do $$ begin
  create trigger maturalnik_progress_set_updated_at before update on maturalnik_progress
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger maturalnik_settings_set_updated_at before update on maturalnik_settings
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table maturalnik_chapters enable row level security;
alter table maturalnik_problems enable row level security;
alter table maturalnik_progress enable row level security;
alter table maturalnik_settings enable row level security;

-- shared content: readable by all authenticated users, writable by admins
-- (the lazy ai_solution cache-write goes through the service-role client from
-- a Server Action instead, see lib/maturalnik/solutions.ts — never widened to
-- regular authenticated users here, that would let anyone vandalize a shared
-- problem's cached solution)
do $$ begin
  create policy "maturalnik_chapters_select" on maturalnik_chapters for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "maturalnik_chapters_admin_write" on maturalnik_chapters for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "maturalnik_problems_select" on maturalnik_problems for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "maturalnik_problems_admin_write" on maturalnik_problems for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

-- per-user
do $$ begin
  create policy "maturalnik_progress_own" on maturalnik_progress for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "maturalnik_progress_admin_read" on maturalnik_progress for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "maturalnik_settings_own" on maturalnik_settings for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "maturalnik_settings_admin_read" on maturalnik_settings for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Storage: problem images (shared, admin/service-role write, any
-- authenticated user read — NOT public, this is a scanned copyrighted
-- textbook, kept behind auth rather than handing out guessable URLs).
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
  values ('maturalnik-problems', 'maturalnik-problems', false)
  on conflict (id) do nothing;

do $$ begin
  create policy "maturalnik_problems_storage_read" on storage.objects for select to authenticated
    using (bucket_id = 'maturalnik-problems');
exception when duplicate_object then null; end $$;
-- No insert/update/delete policy for regular users: only the ingestion
-- script's service-role client writes here, which bypasses RLS entirely.

-- ----------------------------------------------------------------------------
-- Storage: per-user canvas drawings, folder-per-user (same pattern as
-- math-attempts in 0007_matma.sql).
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
  values ('maturalnik-canvas', 'maturalnik-canvas', false)
  on conflict (id) do nothing;

do $$ begin
  create policy "maturalnik_canvas_storage_own" on storage.objects for all to authenticated
    using (bucket_id = 'maturalnik-canvas' and (storage.foldername(name))[1] = auth.uid()::text)
    with check (bucket_id = 'maturalnik-canvas' and (storage.foldername(name))[1] = auth.uid()::text);
exception when duplicate_object then null; end $$;
