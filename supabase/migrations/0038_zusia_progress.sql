-- ============================================================================
-- 0038_zusia_progress.sql
-- ZUSia (przygotowanie do olimpiady o ubezpieczeniach społecznych): postępy
-- zapisane na koncie, żeby były takie same na telefonie i komputerze.
-- Treść (teoria, zadania, fiszki…) siedzi w kodzie (lib/zusia), więc w bazie
-- jest tylko jeden wiersz na użytkownika z jsonb: statystyki pytań, poziomy
-- fiszek, rozwiązane krzyżówki i wyniki testów. Kształt pilnuje serwer
-- (lib/zusia/progress-actions.ts), a RLS daje dostęp tylko właścicielowi.
-- ============================================================================

create table if not exists zusia_progress (
  user_id uuid primary key references profiles (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

do $$ begin
  create trigger zusia_progress_set_updated_at before update on zusia_progress
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

alter table zusia_progress enable row level security;

do $$ begin
  create policy "zusia_progress_own" on zusia_progress for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
