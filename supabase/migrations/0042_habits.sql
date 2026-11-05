-- ============================================================================
-- 0042_habits.sql
-- Mini-aplikacja "Habit Tracking": nawyki użytkownika i dzienne odhaczenia.
--   habits        — lista nawyków (bez celu tygodniowego: liczy się każdy dzień)
--   habit_checks  — jeden wiersz = nawyk odhaczony danego dnia; brak wiersza =
--                   nieodhaczony. Prywatne, per-user (RLS "*_own").
-- Safe to re-run.
-- ============================================================================
create table if not exists habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  name text not null check (length(btrim(name)) between 1 and 60),
  position integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists habits_user_idx on habits (user_id, position);

create table if not exists habit_checks (
  habit_id uuid not null references habits (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  day date not null,
  primary key (habit_id, day)
);
create index if not exists habit_checks_user_day_idx on habit_checks (user_id, day);

alter table habits enable row level security;
alter table habit_checks enable row level security;

do $$ begin
  create policy "habits_own" on habits for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "habit_checks_own" on habit_checks for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
