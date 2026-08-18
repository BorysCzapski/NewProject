-- ============================================================================
-- 0015_geografia.sql
-- "Geografia" module: matura rozszerzona z geografii exam prep. Topics mirror
-- the 23 CKE "zakres rozszerzony" sections (I-XXIII, 2024 podstawa
-- programowa — zpe.gov.pl); exercises are multiple-choice, open-ended
-- (self-graded by the student, AI gives hints only — never an authoritative
-- score, per product requirement "nie zastępować nauczyciela w ocenie
-- otwartych odpowiedzi") or map-based (graded programmatically, partial
-- credit allowed, see lib/geografia/map-grading.ts).
--
-- Content model follows the SHARED-LIBRARY pattern from 0012_textbooks_
-- shared.sql for exercises/topics (any student benefits from any upload or
-- admin/AI-generated content: "_select" open / "_insert_own" / admin write),
-- but annotations stay strictly private per the product spec ("domyślnie
-- annotacje są prywatne... dostęp tylko dla właściciela i administratora") —
-- same shape as textbook_word_progress: shared content, private per-user
-- overlay table.
--
-- Uploaded worksheet PDFs themselves are NOT shared (unlike textbook's fully
-- shared model) — they live in a private-per-uploader storage bucket (same
-- "own folder" pattern as math-attempts/paragony-receipts) since annotations
-- are tied to the original file and are private; only the AI-EXTRACTED
-- exercise content (geo_exercises rows) is shared with other students.
--
-- Safe to re-run (create table/policy only if missing).
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
create type geo_exercise_type as enum ('mc', 'open', 'map');
create type geo_exercise_source as enum ('built_in', 'ai_generated', 'uploaded');
-- 'region': click one of several predefined GeoJSON polygons (implemented).
-- 'layer_select': reserved for a future thematic-layer picker — not built yet,
-- kept in the enum so the schema doesn't need a migration when it lands.
create type geo_map_interaction as enum ('point', 'region', 'layer_select');
create type geo_annotation_type as enum ('note', 'highlight');
create type geo_file_status as enum ('processing', 'ready', 'failed');

-- ----------------------------------------------------------------------------
-- geo_topics: shared, admin-writable. 23 CKE rozszerzona sections, seeded by
-- supabase/seed/geografia/01_topics.sql from lib/geografia/topics.ts.
-- ----------------------------------------------------------------------------
create table if not exists geo_topics (
  id uuid primary key default gen_random_uuid(),
  cke_number text not null,
  slug text unique not null,
  title text not null,
  description text not null default '',
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists geo_topics_order_idx on geo_topics (order_index);

-- ----------------------------------------------------------------------------
-- geo_files: metadata for uploaded worksheet PDFs. The PDF bytes live in the
-- private 'geografia-uploads' storage bucket (see policy below) — this row
-- tracks extraction status so the upload UI can show "przetwarzanie..." /
-- "gotowe" / "błąd" without polling storage directly.
-- ----------------------------------------------------------------------------
create table if not exists geo_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  title text not null,
  mime_type text not null,
  size_bytes int not null,
  storage_path text not null,
  status geo_file_status not null default 'processing',
  error_message text,
  exercises_extracted int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists geo_files_user_idx on geo_files (user_id);

-- ----------------------------------------------------------------------------
-- geo_exercises: the shared exercise library. `prompt`/`options`/
-- `correct_answer`/`hints` are jsonb so MC/open/map variants can each store
-- their own shape without three separate tables:
--   mc:   options = [{id,text}], correct_answer = {correctOptionIds:[id,...]}
--   open: options = null,        correct_answer = {modelAnswer, rubric:[...]}
--   map:  options = null, correct_answer = null (see geo_map_tasks instead)
-- ----------------------------------------------------------------------------
create table if not exists geo_exercises (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references geo_topics (id) on delete cascade,
  type geo_exercise_type not null,
  difficulty smallint not null default 2 check (difficulty between 1 and 3),
  points_max smallint not null default 1 check (points_max > 0),
  prompt jsonb not null,
  options jsonb,
  correct_answer jsonb,
  hints jsonb not null default '[]'::jsonb,
  source geo_exercise_source not null default 'built_in',
  -- true for ai_generated/uploaded content an admin hasn't reviewed yet —
  -- mirrors math_problems.source_metadata.needsReview (0007_matma.sql /
  -- lib/matma/import-past-exams.ts), same reasoning: don't silently drop
  -- AI output, just flag it for a human to confirm before it's fully trusted.
  needs_review boolean not null default false,
  file_id uuid references geo_files (id) on delete set null,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);
create index if not exists geo_exercises_topic_idx on geo_exercises (topic_id);
create index if not exists geo_exercises_file_idx on geo_exercises (file_id);

-- ----------------------------------------------------------------------------
-- geo_map_tasks: 1:1 extension of geo_exercises where type = 'map'.
--   point:  correct_answer = {lat, lng, toleranceKm}
--   region: correct_answer = {correctRegionIds:[...], partialRegionIds?:[...]}
-- input_data carries the initial Leaflet view + (for 'region') the GeoJSON
-- FeatureCollection of clickable regions, so the exercise is fully
-- self-contained (no separate geodata fetch at solve time).
-- ----------------------------------------------------------------------------
create table if not exists geo_map_tasks (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null unique references geo_exercises (id) on delete cascade,
  interaction_type geo_map_interaction not null,
  input_data jsonb not null default '{}'::jsonb,
  correct_answer jsonb not null,
  feedback_description text
);

-- ----------------------------------------------------------------------------
-- geo_exercise_attempts: per-user. points_awarded is programmatic for mc/map,
-- self-assessed (by the student, informed by ai_feedback) for open — never
-- AI-authoritative, per product spec.
-- ----------------------------------------------------------------------------
create table if not exists geo_exercise_attempts (
  id uuid primary key default gen_random_uuid(),
  exercise_id uuid not null references geo_exercises (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  answer jsonb not null,
  points_awarded numeric not null default 0 check (points_awarded >= 0),
  points_max smallint not null,
  self_assessed boolean not null default false,
  ai_feedback jsonb,
  duration_seconds int,
  attempted_at timestamptz not null default now()
);
create index if not exists geo_exercise_attempts_user_idx on geo_exercise_attempts (user_id);
create index if not exists geo_exercise_attempts_exercise_idx on geo_exercise_attempts (exercise_id);

-- ----------------------------------------------------------------------------
-- geo_topic_progress: per-user mastery, same "recompute from latest attempts"
-- design as math_topic_progress (lib/matma/progress.ts) — see
-- lib/geografia/progress.ts.
-- ----------------------------------------------------------------------------
create table if not exists geo_topic_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  topic_id uuid not null references geo_topics (id) on delete cascade,
  status mastery_status not null default 'new',
  mastery_score numeric not null default 0,
  solved_count int not null default 0,
  last_reviewed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, topic_id)
);
create index if not exists geo_topic_progress_user_idx on geo_topic_progress (user_id);

-- ----------------------------------------------------------------------------
-- geo_progress_snapshots: per-user trend line for the dashboard chart.
-- ----------------------------------------------------------------------------
create table if not exists geo_progress_snapshots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  snapshot_at timestamptz not null default now(),
  estimated_percent numeric not null,
  topic_breakdown jsonb not null default '{}'::jsonb
);
create index if not exists geo_progress_snapshots_user_idx on geo_progress_snapshots (user_id, snapshot_at);

-- ----------------------------------------------------------------------------
-- geo_favorites: per-user bookmark on a shared exercise.
-- ----------------------------------------------------------------------------
create table if not exists geo_favorites (
  user_id uuid not null references profiles (id) on delete cascade,
  exercise_id uuid not null references geo_exercises (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, exercise_id)
);

-- ----------------------------------------------------------------------------
-- geo_annotations: private per-user notes/highlights on an uploaded file.
-- content capped at 2KB and per-file count capped at 200 in application code
-- (lib/geografia/annotations.ts) per the product spec's stated limits —
-- enforcing the count limit in SQL would need a trigger for little benefit
-- over a pre-insert count check in the one Server Action that creates rows.
-- ----------------------------------------------------------------------------
create table if not exists geo_annotations (
  id uuid primary key default gen_random_uuid(),
  file_id uuid not null references geo_files (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  page_number int not null default 1 check (page_number > 0),
  type geo_annotation_type not null default 'note',
  content text not null check (char_length(content) <= 2000),
  excerpt text,
  color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists geo_annotations_file_idx on geo_annotations (file_id);
create index if not exists geo_annotations_user_idx on geo_annotations (user_id);

-- ----------------------------------------------------------------------------
-- updated_at maintenance (reuses public.set_updated_at() from 0001_init.sql)
-- ----------------------------------------------------------------------------
do $$ begin
  create trigger geo_topics_set_updated_at before update on geo_topics
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger geo_topic_progress_set_updated_at before update on geo_topic_progress
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger geo_annotations_set_updated_at before update on geo_annotations
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- RLS
-- ----------------------------------------------------------------------------
alter table geo_topics enable row level security;
alter table geo_files enable row level security;
alter table geo_exercises enable row level security;
alter table geo_map_tasks enable row level security;
alter table geo_exercise_attempts enable row level security;
alter table geo_topic_progress enable row level security;
alter table geo_progress_snapshots enable row level security;
alter table geo_favorites enable row level security;
alter table geo_annotations enable row level security;

-- shared content: read for every authenticated user, write for admins
do $$ begin
  create policy "geo_topics_select" on geo_topics for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "geo_topics_admin_write" on geo_topics for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

-- geo_files: NOT shared (see header) — strictly own, admin can read/delete
-- for moderation.
do $$ begin
  create policy "geo_files_own" on geo_files for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "geo_files_admin_read" on geo_files for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

-- geo_exercises / geo_map_tasks: shared library — select open, insert by the
-- authoring user (uploads) or admin (built_in/ai_generated), no update
-- (immutable after creation, admin corrects via delete+recreate), delete by
-- the author or an admin.
do $$ begin
  create policy "geo_exercises_select" on geo_exercises for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "geo_exercises_insert_own" on geo_exercises for insert to authenticated
    with check (auth.uid() = created_by or public.is_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "geo_exercises_delete_own" on geo_exercises for delete to authenticated
    using (auth.uid() = created_by or public.is_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "geo_exercises_admin_update" on geo_exercises for update to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "geo_map_tasks_select" on geo_map_tasks for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "geo_map_tasks_write" on geo_map_tasks for all to authenticated
    using (
      exists (
        select 1 from geo_exercises e
        where e.id = exercise_id and (e.created_by = auth.uid() or public.is_admin())
      )
    )
    with check (
      exists (
        select 1 from geo_exercises e
        where e.id = exercise_id and (e.created_by = auth.uid() or public.is_admin())
      )
    );
exception when duplicate_object then null; end $$;

-- per-user tables: strictly own rows, admins get read access
do $$ begin
  create policy "geo_exercise_attempts_own" on geo_exercise_attempts for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "geo_exercise_attempts_admin_read" on geo_exercise_attempts for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "geo_topic_progress_own" on geo_topic_progress for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "geo_topic_progress_admin_read" on geo_topic_progress for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "geo_progress_snapshots_own" on geo_progress_snapshots for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "geo_favorites_own" on geo_favorites for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- geo_annotations: private, owner + admin only (per product spec)
do $$ begin
  create policy "geo_annotations_own" on geo_annotations for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "geo_annotations_admin_read" on geo_annotations for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Storage: private per-uploader bucket for source worksheet PDFs (annotations
-- are tied to the original file and are private, so the file itself isn't
-- shared — only the extracted geo_exercises rows are; see header comment).
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('geografia-uploads', 'geografia-uploads', false)
on conflict (id) do nothing;

do $$ begin
  create policy "geografia_uploads_storage_own" on storage.objects for all to authenticated
    using (bucket_id = 'geografia-uploads' and (storage.foldername(name))[1] = auth.uid()::text)
    with check (bucket_id = 'geografia-uploads' and (storage.foldername(name))[1] = auth.uid()::text);
exception when duplicate_object then null; end $$;
