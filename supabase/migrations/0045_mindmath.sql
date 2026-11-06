-- ============================================================================
-- 0045_mindmath.sql
-- Mini-aplikacja "Mind Math": historia sesji treningu rachunku w głowie.
-- Treść (techniki, generatory zadań) siedzi w kodzie (lib/mindmath), w bazie
-- jest tylko wynik każdej sesji. Prywatne, per-user (RLS "*_own").
-- Safe to re-run.
-- ============================================================================
create table if not exists mindmath_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  mode text not null check (length(mode) between 1 and 30),
  level smallint not null check (level between 1 and 3),
  total smallint not null check (total between 1 and 100),
  correct smallint not null check (correct >= 0 and correct <= total),
  seconds numeric(7, 1) not null check (seconds > 0 and seconds <= 7200),
  created_at timestamptz not null default now()
);
create index if not exists mindmath_sessions_user_idx on mindmath_sessions (user_id, created_at desc);

alter table mindmath_sessions enable row level security;

do $$ begin
  create policy "mindmath_sessions_own" on mindmath_sessions for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
