-- ============================================================================
-- 0018_geografia_lessons.sql
-- Interactive theory for Geografia: the lesson bank (geo_lessons) plus
-- per-user "przerobione" tracking (geo_lesson_progress).
--
-- Mirrors math_lessons (0007_matma.sql): shared content, admin-writable,
-- `content` is a jsonb array of GeoBlock (lib/geografia/lesson-blocks.ts).
-- Two additions Matma doesn't have:
--   * `slug` — lessons are addressed by a readable slug within their topic
--     (/geografia/tematy/<topic>/lekcja/<slug>) instead of a uuid, so seed
--     files can be re-run idempotently by (topic_id, slug) and links stay
--     stable across re-seeds.
--   * `reading_minutes` — an authored estimate shown in the lesson list;
--     with 100+ lessons, "ile to zajmie" is what makes the list navigable.
--
-- geo_lesson_progress is deliberately SEPARATE from geo_topic_progress
-- (which is derived from graded attempts, see lib/geografia/progress.ts):
-- reading theory is self-declared and must never inflate a mastery score
-- that's supposed to mean "solves exercises correctly".
--
-- Safe to re-run (create table/policy only if missing).
-- ============================================================================

create table if not exists geo_lessons (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references geo_topics (id) on delete cascade,
  slug text not null,
  title text not null,
  summary text not null default '',
  content jsonb not null default '[]'::jsonb,
  reading_minutes int not null default 8,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (topic_id, slug)
);
create index if not exists geo_lessons_topic_idx on geo_lessons (topic_id, order_index);

create table if not exists geo_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  lesson_id uuid not null references geo_lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);
create index if not exists geo_lesson_progress_user_idx on geo_lesson_progress (user_id);

do $$ begin
  create trigger geo_lessons_set_updated_at before update on geo_lessons
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- RLS: lessons are shared read-only content (admin-writable); progress is
-- strictly per-user, same split as everywhere else in this module.
-- ----------------------------------------------------------------------------
alter table geo_lessons enable row level security;
alter table geo_lesson_progress enable row level security;

do $$ begin
  create policy "geo_lessons_select" on geo_lessons for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "geo_lessons_admin_write" on geo_lessons for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "geo_lesson_progress_own" on geo_lesson_progress for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "geo_lesson_progress_admin_read" on geo_lesson_progress for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;
