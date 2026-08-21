-- ============================================================================
-- 0019_modlitwa_brewiarz.sql
-- Cache pełnych tekstów Liturgii Godzin pobieranych z brewiarz.pl (ILG).
--
-- Ta sama zasada co daily_readings w 0017: teksty są identyczne dla wszystkich
-- użytkowników, więc cache jest GLOBALNY — SELECT dla zalogowanych, a zapis
-- wyłącznie przez service-role (lib/supabase/admin.ts). Jedno pobranie danego
-- dnia i godziny obsługuje całą instancję, co jest też zwykłą uprzejmością
-- wobec serwisu źródłowego.
--
-- Prawa autorskie: teksty Liturgii Godzin © Konferencja Episkopatu Polski i
-- Wydawnictwo Pallottinum, opracowanie © ILG. Aplikacja ich nie redaguje ani
-- nie przypisuje sobie — przechowuje kopię roboczą i przy każdym wyświetleniu
-- pokazuje źródło oraz notę copyright.
--
-- Klucz (data, godzina, wariant): jeden dzień może mieć kilka formularzy
-- (wspomnienie dowolne, święto własne diecezji), a użytkownik może je
-- przełączać — trzymamy każdy wariant osobno.
--
-- Safe to re-run (create table/policy only if missing).
-- ============================================================================

create table if not exists breviary_hours (
  hour_date date not null,
  hour_id text not null check (
    hour_id in (
      'wezwanie', 'godzina-czytan', 'jutrznia', 'przedpoludniowa',
      'poludniowa', 'popoludniowa', 'nieszpory', 'kompleta'
    )
  ),
  -- '' = dzień bez wariantów, 'p'/'w1'…'w6' = numeracja wariantów w ILG.
  variant text not null default '',
  title text,
  subtitle text,
  -- [{ id, title, lines: [[{ t, r? }]] }] — patrz lib/modlitwa/breviary-source.ts.
  sections jsonb not null,
  source_url text not null,
  fetched_at timestamptz not null default now(),
  primary key (hour_date, hour_id, variant)
);
create index if not exists breviary_hours_date_idx on breviary_hours (hour_date);

-- ----------------------------------------------------------------------------
-- breviary_days: lista wariantów obchodu na dany dzień (do przełącznika w UI).
-- Osobna tabela, bo warianty są wspólne dla wszystkich godzin danego dnia.
-- ----------------------------------------------------------------------------
create table if not exists breviary_days (
  day_date date primary key,
  -- [{ id, label }]
  variants jsonb not null default '[]'::jsonb,
  source_url text not null,
  fetched_at timestamptz not null default now()
);

alter table breviary_hours enable row level security;
alter table breviary_days enable row level security;

do $$ begin
  create policy "breviary_hours_select" on breviary_hours for select to authenticated using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "breviary_days_select" on breviary_days for select to authenticated using (true);
exception when duplicate_object then null; end $$;
