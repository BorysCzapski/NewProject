-- ============================================================================
-- 0001_init.sql
-- Core schema for the English learning app: profiles, vocabulary, grammar,
-- reading, writing, songs, listening, homework, activity/streak tracking.
-- Row Level Security: every user reads/writes only their own progress rows;
-- shared content (vocabulary, grammar, homework, ...) is readable by all
-- authenticated users and writable only by admins (role = 'admin').
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
create type user_level as enum ('A1', 'A2', 'B1', 'B2');
create type user_role as enum ('user', 'admin');
create type mastery_status as enum ('new', 'learning', 'mastered');
create type homework_type as enum (
  'song_translation',
  'vocabulary_mastery',
  'training_count',
  'reading_count',
  'flashcards_count',
  'grammar_topic',
  'writing_task',
  'listening_task'
);
create type homework_status as enum ('todo', 'in_progress', 'completed', 'overdue');
create type training_module as enum ('vocabulary', 'grammar', 'writing');

-- ----------------------------------------------------------------------------
-- profiles: one row per auth user, created automatically on signup
-- ----------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  email text not null,
  level user_level not null default 'A1',
  role user_role not null default 'user',
  current_streak int not null default 0,
  longest_streak int not null default 0,
  last_activity_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- security definer helper so RLS policies can check admin role without
-- recursively re-querying profiles under RLS
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- creates a profile row automatically whenever a new auth user signs up.
-- username/level come from the signUp() options.data metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, email, level)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    new.email,
    coalesce((new.raw_user_meta_data ->> 'level')::user_level, 'A1')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- vocabulary
-- ----------------------------------------------------------------------------
create table vocabulary_words (
  id uuid primary key default gen_random_uuid(),
  level user_level not null,
  category text not null,
  word_en text not null,
  translation_pl text not null,
  example_sentence text,
  created_at timestamptz not null default now()
);
create index vocabulary_words_level_idx on vocabulary_words (level);
create index vocabulary_words_category_idx on vocabulary_words (category);

create table vocabulary_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  word_id uuid not null references vocabulary_words (id) on delete cascade,
  correct_count int not null default 0,
  incorrect_count int not null default 0,
  status mastery_status not null default 'new',
  last_reviewed_at timestamptz,
  next_review_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, word_id)
);
create index vocabulary_progress_user_idx on vocabulary_progress (user_id);

-- ----------------------------------------------------------------------------
-- grammar
-- ----------------------------------------------------------------------------
create table grammar_topics (
  id uuid primary key default gen_random_uuid(),
  level user_level not null,
  slug text unique not null,
  title text not null,
  explanation text not null,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);
create index grammar_topics_level_idx on grammar_topics (level);

create table grammar_exercises (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references grammar_topics (id) on delete cascade,
  type text not null check (type in ('gap_fill', 'multiple_choice', 'transformation')),
  prompt text not null,
  options jsonb,
  correct_answer text not null,
  order_index int not null default 0
);
create index grammar_exercises_topic_idx on grammar_exercises (topic_id);

create table grammar_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  topic_id uuid not null references grammar_topics (id) on delete cascade,
  exercise_id uuid references grammar_exercises (id) on delete cascade,
  is_correct boolean not null,
  attempted_at timestamptz not null default now()
);
create index grammar_progress_user_idx on grammar_progress (user_id);
create index grammar_progress_topic_idx on grammar_progress (user_id, topic_id);

-- ----------------------------------------------------------------------------
-- reading (AI-generated articles)
-- ----------------------------------------------------------------------------
create table reading_texts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles (id) on delete cascade,
  level user_level not null,
  topic text not null,
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);
create index reading_texts_user_idx on reading_texts (user_id);

create table reading_questions (
  id uuid primary key default gen_random_uuid(),
  text_id uuid not null references reading_texts (id) on delete cascade,
  type text not null check (type in ('multiple_choice', 'open')),
  question text not null,
  options jsonb,
  correct_answer text,
  order_index int not null default 0
);
create index reading_questions_text_idx on reading_questions (text_id);

create table reading_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  text_id uuid not null references reading_texts (id) on delete cascade,
  answers jsonb not null,
  score numeric,
  feedback text,
  completed_at timestamptz not null default now()
);
create index reading_attempts_user_idx on reading_attempts (user_id);

-- ----------------------------------------------------------------------------
-- writing (AI scenarios + AI grading)
-- ----------------------------------------------------------------------------
create table writing_tasks (
  id uuid primary key default gen_random_uuid(),
  level user_level not null,
  task_type text not null check (
    task_type in ('comment_reply', 'message_friend', 'formal_email', 'question_answer')
  ),
  scenario text not null,
  min_words int not null default 30,
  max_words int not null default 120,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

create table writing_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  task_id uuid not null references writing_tasks (id) on delete cascade,
  content text not null,
  ai_feedback text,
  ai_corrected_version text,
  ai_followup_question text,
  score numeric,
  created_at timestamptz not null default now()
);
create index writing_submissions_user_idx on writing_submissions (user_id);

-- ----------------------------------------------------------------------------
-- songs (AI-checked line/word translation)
-- ----------------------------------------------------------------------------
create table songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  artist text,
  lyrics text not null,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

create table song_translation_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  song_id uuid not null references songs (id) on delete cascade,
  line_index int not null,
  user_translation text not null,
  is_correct boolean not null,
  ai_feedback text,
  created_at timestamptz not null default now()
);
create index song_translation_attempts_user_idx on song_translation_attempts (user_id);

-- ----------------------------------------------------------------------------
-- listening (YouTube transcript + gap fill)
-- ----------------------------------------------------------------------------
create table listening_exercises (
  id uuid primary key default gen_random_uuid(),
  youtube_url text not null,
  video_id text not null,
  title text not null,
  level user_level not null,
  transcript jsonb not null,
  gaps jsonb not null,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

create table listening_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  exercise_id uuid not null references listening_exercises (id) on delete cascade,
  answers jsonb not null,
  score numeric not null,
  completed_at timestamptz not null default now()
);
create index listening_attempts_user_idx on listening_attempts (user_id);

-- ----------------------------------------------------------------------------
-- homework (admin-authored, auto-tracked progress)
-- ----------------------------------------------------------------------------
create table homework (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  type homework_type not null,
  config jsonb not null default '{}'::jsonb,
  levels user_level[] not null,
  deadline timestamptz,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

create table homework_progress (
  id uuid primary key default gen_random_uuid(),
  homework_id uuid not null references homework (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  status homework_status not null default 'todo',
  progress_current numeric not null default 0,
  progress_target numeric not null default 1,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (homework_id, user_id)
);
create index homework_progress_user_idx on homework_progress (user_id);

-- ----------------------------------------------------------------------------
-- activity log: single source of truth for streaks + the monthly calendar
-- ----------------------------------------------------------------------------
create table activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  activity_type text not null,
  activity_date date not null default ((now() at time zone 'utc')::date),
  metadata jsonb,
  created_at timestamptz not null default now()
);
create index activity_log_user_date_idx on activity_log (user_id, activity_date);

-- records one activity + updates the streak counters on profiles in a single
-- atomic call. Every learning module calls this after a "meaningful" action
-- (10 flashcards, one training, one text, ...) instead of duplicating streak
-- math in application code.
create or replace function public.record_activity(p_type text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_today date := (now() at time zone 'utc')::date;
  v_last date;
  v_current int;
  v_longest int;
begin
  if v_user_id is null then
    raise exception 'record_activity: not authenticated';
  end if;

  insert into activity_log (user_id, activity_type, activity_date)
  values (v_user_id, p_type, v_today);

  select last_activity_date, current_streak, longest_streak
    into v_last, v_current, v_longest
    from profiles
    where id = v_user_id;

  if v_last is not null and v_last = v_today then
    return; -- streak already counted today
  elsif v_last is not null and v_last = v_today - 1 then
    v_current := v_current + 1;
  else
    v_current := 1;
  end if;

  if v_longest is null or v_current > v_longest then
    v_longest := v_current;
  end if;

  update profiles
    set last_activity_date = v_today,
        current_streak = v_current,
        longest_streak = v_longest,
        updated_at = now()
    where id = v_user_id;
end;
$$;

grant execute on function public.record_activity(text) to authenticated;
grant execute on function public.is_admin() to authenticated;

-- ----------------------------------------------------------------------------
-- updated_at maintenance
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on profiles
  for each row execute function public.set_updated_at();
create trigger vocabulary_progress_set_updated_at before update on vocabulary_progress
  for each row execute function public.set_updated_at();
create trigger homework_progress_set_updated_at before update on homework_progress
  for each row execute function public.set_updated_at();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table profiles enable row level security;
alter table vocabulary_words enable row level security;
alter table vocabulary_progress enable row level security;
alter table grammar_topics enable row level security;
alter table grammar_exercises enable row level security;
alter table grammar_progress enable row level security;
alter table reading_texts enable row level security;
alter table reading_questions enable row level security;
alter table reading_attempts enable row level security;
alter table writing_tasks enable row level security;
alter table writing_submissions enable row level security;
alter table songs enable row level security;
alter table song_translation_attempts enable row level security;
alter table listening_exercises enable row level security;
alter table listening_attempts enable row level security;
alter table homework enable row level security;
alter table homework_progress enable row level security;
alter table activity_log enable row level security;

-- profiles: users can only read their own row; admins can read every row
-- (needed for the "who completed what" homework view). Username->email
-- lookup at login happens unauthenticated, via the service-role admin
-- client in lib/supabase/admin.ts, so it never goes through this policy.
create policy "profiles_select_own_or_admin" on profiles for select to authenticated
  using (auth.uid() = id or public.is_admin());
create policy "profiles_update_own" on profiles for update to authenticated
  using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_update_admin" on profiles for update to authenticated
  using (public.is_admin());

-- shared content tables: read for every authenticated user, write for admins
create policy "vocabulary_words_select" on vocabulary_words for select to authenticated using (true);
create policy "vocabulary_words_admin_write" on vocabulary_words for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "grammar_topics_select" on grammar_topics for select to authenticated using (true);
create policy "grammar_topics_admin_write" on grammar_topics for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "grammar_exercises_select" on grammar_exercises for select to authenticated using (true);
create policy "grammar_exercises_admin_write" on grammar_exercises for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "reading_texts_select" on reading_texts for select to authenticated using (true);
create policy "reading_texts_insert_own" on reading_texts for insert to authenticated
  with check (auth.uid() = user_id or public.is_admin());
create policy "reading_texts_admin_write" on reading_texts for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "reading_questions_select" on reading_questions for select to authenticated using (true);
create policy "reading_questions_write" on reading_questions for all to authenticated
  using (
    public.is_admin()
    or exists (select 1 from reading_texts t where t.id = text_id and t.user_id = auth.uid())
  )
  with check (
    public.is_admin()
    or exists (select 1 from reading_texts t where t.id = text_id and t.user_id = auth.uid())
  );

create policy "writing_tasks_select" on writing_tasks for select to authenticated using (true);
create policy "writing_tasks_admin_write" on writing_tasks for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "songs_select" on songs for select to authenticated using (true);
create policy "songs_insert_own" on songs for insert to authenticated
  with check (auth.uid() = created_by or public.is_admin());
create policy "songs_admin_write" on songs for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "listening_exercises_select" on listening_exercises for select to authenticated using (true);
create policy "listening_exercises_insert_own" on listening_exercises for insert to authenticated
  with check (auth.uid() = created_by or public.is_admin());
create policy "listening_exercises_admin_write" on listening_exercises for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

create policy "homework_select" on homework for select to authenticated using (true);
create policy "homework_admin_write" on homework for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- per-user progress / attempt tables: strictly own rows, admins get read access
-- where useful for the "who completed what" admin view
create policy "vocabulary_progress_own" on vocabulary_progress for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "grammar_progress_own" on grammar_progress for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "reading_attempts_own" on reading_attempts for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "reading_attempts_admin_read" on reading_attempts for select to authenticated
  using (public.is_admin());

create policy "writing_submissions_own" on writing_submissions for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "writing_submissions_admin_read" on writing_submissions for select to authenticated
  using (public.is_admin());

create policy "song_translation_attempts_own" on song_translation_attempts for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "listening_attempts_own" on listening_attempts for all to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "homework_progress_own" on homework_progress for select to authenticated
  using (auth.uid() = user_id or public.is_admin());
create policy "homework_progress_own_write" on homework_progress for insert to authenticated
  with check (auth.uid() = user_id);
create policy "homework_progress_own_update" on homework_progress for update to authenticated
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "activity_log_own" on activity_log for select to authenticated
  using (auth.uid() = user_id or public.is_admin());
create policy "activity_log_insert_own" on activity_log for insert to authenticated
  with check (auth.uid() = user_id);
