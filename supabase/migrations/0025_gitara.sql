-- ============================================================================
-- 0025_gitara.sql
-- "Gitara" mini-app: guitar lessons from absolute beginner to advanced —
-- chords, note/rhythm reading, the CAGED system, technique, a chord library,
-- a song/tab library (with PDF songbook import) and practice tools
-- (metronome, tuner). Prefix `gtr_`, same shape as Algorytmy (0024) for the
-- shared-content + per-user-progress tables.
--
-- Two departures from Algorytmy's exercise-bank model, both deliberate:
--
-- 1. No gtr_exercises table. Every drill this app can ask ("name this fret",
--    "which chord is this diagram", "how many beats is this note") is public
--    domain music theory computable from lib/gitara/theory.ts — there is no
--    secret answer worth guarding server-side. Drills are generated AND
--    graded client-side (components/gitara/lesson/*, and the /cwicz practice
--    screens); gtr_drill_attempts only records the outcome for stats, the
--    same "the visualiser IS the explanation" stance the interactive lesson
--    blocks take in lib/gitara/lesson-blocks.ts.
--
-- 2. gtr_songs allows self-service insert from ANY authenticated user (not
--    just admin), same policy as algo_exercises — that is what lets the PDF
--    songbook importer (app/api/gitara/import-songbook/route.ts) write
--    directly into the shared library without a service-role key.
--
-- Numeracja: `0025` jest kolejnym wolnym numerem w repo (ostatnia to 0024).
-- Przed wgraniem: `npm run db status`.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- gtr_topics: the 5 działy, a real prerequisite chain (see lib/gitara/topics.ts).
-- ----------------------------------------------------------------------------
create table if not exists gtr_topics (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  order_index int not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists gtr_topics_order_idx on gtr_topics (order_index);

-- ----------------------------------------------------------------------------
-- gtr_lessons: block-based content (jsonb array of GtrBlock — see
-- lib/gitara/lesson-blocks.ts), rendered by components/gitara/lesson/.
-- ----------------------------------------------------------------------------
create table if not exists gtr_lessons (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references gtr_topics (id) on delete cascade,
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
create index if not exists gtr_lessons_topic_idx on gtr_lessons (topic_id, order_index);

-- ----------------------------------------------------------------------------
-- gtr_lesson_progress: the "przerobione" marker, one row per (user, lesson).
-- ----------------------------------------------------------------------------
create table if not exists gtr_lesson_progress (
  user_id uuid not null references profiles (id) on delete cascade,
  lesson_id uuid not null references gtr_lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- ----------------------------------------------------------------------------
-- gtr_chords: the chord library (feature: "Lekcje akordów"). `positions` is a
-- jsonb FrettedChord (see lib/gitara/theory.ts): frets[6]/fingers[6] low-E to
-- high-e (null = muted string, 0 = open), an optional barre, and baseFret for
-- shapes played higher up the neck. Rendered by components/gitara/fretboard.tsx,
-- the one SVG primitive every chord diagram, CAGED shape and note-finder in
-- this app draws through.
-- ----------------------------------------------------------------------------
create table if not exists gtr_chords (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  symbol text not null,
  root text not null,
  quality text not null,
  category text not null check (category in ('open', 'power', 'barre', 'rozszerzony')),
  positions jsonb not null,
  difficulty smallint not null default 1 check (difficulty between 1 and 3),
  order_index int not null,
  description text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists gtr_chords_category_idx on gtr_chords (category, order_index);

-- ----------------------------------------------------------------------------
-- gtr_songs: the tab/chord library (features: "Biblioteka tabulatur" and PDF
-- songbook import). content_chordpro follows lib/gitara/chordpro.ts's inline
-- "[C]lyric" convention; tab_text is a plain monospace 6-line tab excerpt.
-- A song needs at least one of the two, checked below.
-- ----------------------------------------------------------------------------
create table if not exists gtr_songs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  artist text not null default '',
  difficulty smallint not null default 1 check (difficulty between 1 and 3),
  tempo_bpm int,
  capo smallint not null default 0,
  content_chordpro text not null default '',
  tab_text text not null default '',
  source text not null default 'curated' check (source in ('curated', 'imported')),
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  check (content_chordpro <> '' or tab_text <> '')
);

-- ----------------------------------------------------------------------------
-- gtr_practice_sessions: metronome / tuner / free-play practice log, feeding
-- the "czas ćwiczeń" stat on /gitara/postepy.
-- ----------------------------------------------------------------------------
create table if not exists gtr_practice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  kind text not null check (kind in ('metronom', 'strojenie', 'wolna-gra')),
  bpm int,
  duration_seconds int not null check (duration_seconds > 0),
  practiced_at timestamptz not null default now()
);
create index if not exists gtr_practice_user_idx on gtr_practice_sessions (user_id, practiced_at desc);

-- ----------------------------------------------------------------------------
-- gtr_drill_attempts: outcome-only log for the client-generated-and-graded
-- drills (see the module comment above for why there is no exercise bank).
-- drill_type is a slug from lib/gitara/drills.ts.
-- ----------------------------------------------------------------------------
create table if not exists gtr_drill_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  drill_type text not null,
  is_correct boolean not null,
  attempted_at timestamptz not null default now()
);
create index if not exists gtr_drill_user_idx on gtr_drill_attempts (user_id, drill_type, attempted_at desc);

-- ----------------------------------------------------------------------------
-- RLS
-- ----------------------------------------------------------------------------
alter table gtr_topics enable row level security;
alter table gtr_lessons enable row level security;
alter table gtr_lesson_progress enable row level security;
alter table gtr_chords enable row level security;
alter table gtr_songs enable row level security;
alter table gtr_practice_sessions enable row level security;
alter table gtr_drill_attempts enable row level security;

-- shared content: everyone reads, admin writes
do $$ begin
  create policy "gtr_topics_select" on gtr_topics for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "gtr_topics_admin_write" on gtr_topics for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "gtr_lessons_select" on gtr_lessons for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "gtr_lessons_admin_write" on gtr_lessons for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "gtr_chords_select" on gtr_chords for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "gtr_chords_admin_write" on gtr_chords for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

-- Songs: readable by everyone, insertable by the student who imported/added
-- them (see module comment — same arrangement as algo_exercises).
do $$ begin
  create policy "gtr_songs_select" on gtr_songs for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "gtr_songs_insert_own" on gtr_songs for insert to authenticated
    with check (auth.uid() = created_by or public.is_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "gtr_songs_update_own" on gtr_songs for update to authenticated
    using (auth.uid() = created_by or public.is_admin())
    with check (auth.uid() = created_by or public.is_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "gtr_songs_delete_own" on gtr_songs for delete to authenticated
    using (auth.uid() = created_by or public.is_admin());
exception when duplicate_object then null; end $$;

-- per-user tables: own rows only
do $$ begin
  create policy "gtr_lesson_progress_own" on gtr_lesson_progress for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "gtr_practice_sessions_own" on gtr_practice_sessions for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "gtr_drill_attempts_own" on gtr_drill_attempts for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
