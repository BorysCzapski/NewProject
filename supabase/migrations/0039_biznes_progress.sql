-- ============================================================================
-- 0039_biznes_progress.sql
-- Matura BiZ (matura rozszerzona z biznesu i zarządzania): postępy zapisane na
-- koncie, żeby były takie same na telefonie i komputerze. Treść (teoria,
-- fiszki, pytania, arkusze…) siedzi w kodzie (lib/biznes), więc w bazie jest
-- tylko jeden wiersz na użytkownika z jsonb: statystyki pytań, poziomy fiszek,
-- rozwiązane krzyżówki i wyniki testów oraz arkuszy. Kształt pilnuje serwer
-- (lib/biznes/progress-actions.ts), a RLS daje dostęp tylko właścicielowi.
-- ============================================================================

create table if not exists biznes_progress (
  user_id uuid primary key references profiles (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

do $$ begin
  create trigger biznes_progress_set_updated_at before update on biznes_progress
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

alter table biznes_progress enable row level security;

do $$ begin
  create policy "biznes_progress_own" on biznes_progress for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
