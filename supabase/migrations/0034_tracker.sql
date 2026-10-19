-- ============================================================================
-- 0034_tracker.sql
-- Mini-aplikacja "Tracker": jeden wpis NA DZIEŃ — ile godzin pracowałeś, ile
-- zadań zrobiłeś i opcjonalna notatka. Każdy dzień jest jednym punktem na
-- wykresie (stylu giełdowego), więc schemat pilnuje "jeden dzień = jeden
-- wiersz": unique (user_id, day). Zapis na ten sam dzień nadpisuje wpis
-- (upsert w lib/tracker/actions.ts), zamiast mnożyć punkty.
--
-- To zastępuje aplikację "Godziny". Tabele study_topics / study_sessions z
-- 0027_godziny.sql ZOSTAJĄ nietknięte (tak samo jak math_* po usunięciu Matmy)
-- — kod i UI Godzin zostały usunięte, dane nie.
--
-- Walidacji "dzień nie z przyszłości" nie da się wyrazić jako CHECK
-- (current_date jest STABLE) — pilnuje jej lib/tracker/actions.ts w strefie
-- Europe/Warsaw. Zakresy (0-24 h, 0-999 zadań) pilnuje baza, bo literówka
-- "80" zamiast "8" godzin rozwala każdy wykres i średnią.
--
-- Safe to re-run.
-- ============================================================================

create table if not exists tracker_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  day date not null,
  -- numeric(4,2): do setnych (0.25 = kwadrans), max 24.00
  hours numeric(4, 2) not null default 0 check (hours >= 0 and hours <= 24),
  tasks integer not null default 0 check (tasks >= 0 and tasks <= 999),
  note text check (note is null or length(note) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, day)
);

create index if not exists tracker_days_user_day_idx on tracker_days (user_id, day desc);

do $$ begin
  create trigger tracker_days_set_updated_at before update on tracker_days
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

-- Dane prywatne: tylko właściciel, bez polityki admin_read (jak Godziny).
alter table tracker_days enable row level security;

do $$ begin
  create policy "tracker_days_own" on tracker_days for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- Kto miał zainstalowane "Godziny", dostaje "Tracker" w to samo miejsce na
-- ekranie głównym zamiast cichej dziury po usuniętej aplikacji.
update profiles
set installed_apps = array_replace(installed_apps, 'godziny', 'tracker')
where 'godziny' = any (installed_apps)
  and not ('tracker' = any (installed_apps));

-- Jeśli ktoś miał oba (nie powinno się zdarzyć), zostaje samo "tracker".
update profiles
set installed_apps = array_remove(installed_apps, 'godziny')
where 'godziny' = any (installed_apps);
