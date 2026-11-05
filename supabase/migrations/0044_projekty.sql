-- ============================================================================
-- 0044_projekty.sql
-- Mini-aplikacja "Projekty": własne projekty z hobby (naprawa magnetofonu,
-- nauka piosenki na gitarze...) z postępem, listą potrzebnych rzeczy i
-- dziennikiem sesji. Prywatne, per-user (RLS "*_own").
--   projects          — tytuł, opis "co dokładnie chcę zrobić", status
--   project_items     — kind 'step' (kroki/części; z nich liczy się postęp)
--                       albo 'need' (czego potrzebuję: części, narzędzia; done = "mam")
--   project_sessions  — wpis w dzienniku: dzień + co robiłem / co dalej
-- Safe to re-run.
-- ============================================================================
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  title text not null check (length(btrim(title)) between 1 and 100),
  description text not null default '' check (length(description) <= 4000),
  status text not null default 'pomysl' check (status in ('pomysl', 'w_trakcie', 'wstrzymany', 'ukonczony')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists projects_user_idx on projects (user_id, updated_at desc);

create table if not exists project_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  kind text not null check (kind in ('step', 'need')),
  text text not null check (length(btrim(text)) between 1 and 200),
  note text not null default '' check (length(note) <= 1000),
  done boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists project_items_project_idx on project_items (project_id, kind, position);

create table if not exists project_sessions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  day date not null,
  note text not null check (length(btrim(note)) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists project_sessions_project_idx on project_sessions (project_id, day desc, created_at desc);

alter table projects enable row level security;
alter table project_items enable row level security;
alter table project_sessions enable row level security;

do $$ begin
  create policy "projects_own" on projects for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "project_items_own" on project_items for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "project_sessions_own" on project_sessions for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
