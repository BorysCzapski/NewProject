-- ============================================================================
-- 0017_modlitwa.sql
-- "Modlitwa" mini-app: werset dnia, czytania liturgiczne, liturgia godzin,
-- streak modlitewny, intencje (modlitwa za innych) i kalendarz liturgiczny.
--
-- Podział tabel na dwie grupy:
--
--   GLOBALNE (treści wspólne, te same dla każdego użytkownika):
--     bible_verses            — kuratorowany zbiór krótkich wersetów do
--                               losowania „wersetu dnia”. Świadomie NIE jest
--                               to pełny tekst Pisma (patrz „Czego nie robić”
--                               w specyfikacji) — tylko wybór cytatów.
--     daily_readings          — cache czytań na dany dzień pobranych z
--                               zewnętrznego źródła (mateusz.pl/czytania).
--                               Czytania są identyczne dla wszystkich, więc
--                               cache jest globalny — jak etf_price_history w
--                               0008: SELECT dla zalogowanych, a zapis TYLKO
--                               przez service-role (lib/supabase/admin.ts),
--                               nigdy bezpośrednio z klienta.
--     special_liturgical_dates— uroczystości/święta wyliczone lokalnie przez
--                               lib/modlitwa/liturgical-calendar.ts i zapisane
--                               tu jako cache dla kalendarza i eksportu ICS.
--
--   PER-USER (dane prywatne, polityka „<table>_own”):
--     prayer_streaks, prayer_log, prayer_requests, prayer_settings,
--     daily_verse_picks.
--
-- Prywatność: intencje modlitewne to dane wrażliwe (imiona osób trzecich i
-- powody modlitwy), więc — jak w 0008 przy danych finansowych — NIE ma tu
-- żadnej polityki „_admin_read”. Administrator nie widzi cudzych intencji.
--
-- Safe to re-run (create table/policy only if missing).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- bible_verses: kuratorowany zbiór wersetów (seed: supabase/seed/modlitwa/).
-- `season` = null oznacza werset „na każdy czas”; wersety z ustawionym okresem
-- (adwent, wielki_post, wielkanoc, boze_narodzenie) są preferowane w tym
-- okresie liturgicznym przez lib/modlitwa/verses.ts.
-- ----------------------------------------------------------------------------
create table if not exists bible_verses (
  id uuid primary key default gen_random_uuid(),
  reference text not null unique,
  text text not null,
  translation text not null default 'Biblia Tysiąclecia',
  themes text[] not null default '{}',
  season text check (season in ('adwent', 'boze_narodzenie', 'wielki_post', 'wielkanoc', 'zwykly')),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists bible_verses_season_idx on bible_verses (season) where is_active;

-- ----------------------------------------------------------------------------
-- daily_verse_picks: co użytkownik zobaczył danego dnia. Losowanie samo w
-- sobie jest deterministyczne (hash user_id + data), ale zapis sprawia, że
-- werset nie zmienia się po dodaniu nowych wersetów do bible_verses w środku
-- dnia, i daje historię „ostatnie wersety”.
-- ----------------------------------------------------------------------------
create table if not exists daily_verse_picks (
  user_id uuid not null references profiles (id) on delete cascade,
  verse_date date not null,
  verse_id uuid not null references bible_verses (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, verse_date)
);

-- ----------------------------------------------------------------------------
-- daily_readings: jeden wiersz na dzień. Teksty pochodzą z zewnętrznego
-- serwisu i są tu wyłącznie cache'owane, żeby aplikacja działała bez sieci
-- (spec: „brak połączenia -> pokaż ostatnio pobrane czytania”).
-- ----------------------------------------------------------------------------
create table if not exists daily_readings (
  reading_date date primary key,
  day_name text,
  first_reading_citation text,
  first_reading_text text,
  psalm_citation text,
  psalm_refrain text,
  psalm_text text,
  second_reading_citation text,
  second_reading_text text,
  acclamation_citation text,
  acclamation_text text,
  gospel_citation text,
  gospel_text text,
  source_url text,
  fetched_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- special_liturgical_dates: cache wyliczonego kalendarza liturgicznego.
-- (data, nazwa) jako klucz — jednego dnia może wypaść więcej niż jeden wpis.
-- ----------------------------------------------------------------------------
create table if not exists special_liturgical_dates (
  observance_date date not null,
  name text not null,
  rank text not null check (rank in ('uroczystosc', 'swieto', 'wspomnienie', 'niedziela')),
  color text not null check (color in ('bialy', 'czerwony', 'zielony', 'fioletowy', 'rozowy')),
  season text not null,
  is_holy_day_of_obligation boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (observance_date, name)
);
create index if not exists special_liturgical_dates_date_idx on special_liturgical_dates (observance_date);

-- ----------------------------------------------------------------------------
-- prayer_streaks: licznik nieprzerwanych dni modlitwy. Świadomie osobny od
-- profiles.current_streak (tamten liczy naukę w Linguo) — modlitwa ma własny
-- rytm i nie powinna ani „psuć”, ani dziedziczyć streaka z nauki.
-- ----------------------------------------------------------------------------
create table if not exists prayer_streaks (
  user_id uuid primary key references profiles (id) on delete cascade,
  current_streak integer not null default 0 check (current_streak >= 0),
  longest_streak integer not null default 0 check (longest_streak >= 0),
  total_days integer not null default 0 check (total_days >= 0),
  last_prayer_date date,
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- prayer_log: jeden wiersz na dzień modlitwy — źródło prawdy dla kalendarza i
-- do przeliczenia streaka; prayer_streaks jest tylko denormalizacją.
-- `hours` = odhaczone godziny liturgiczne (może być puste — samo
-- „Pomodliłem się” też liczy się do streaka).
-- ----------------------------------------------------------------------------
create table if not exists prayer_log (
  user_id uuid not null references profiles (id) on delete cascade,
  prayer_date date not null,
  hours text[] not null default '{}',
  note text,
  created_at timestamptz not null default now(),
  primary key (user_id, prayer_date)
);

-- ----------------------------------------------------------------------------
-- prayer_requests: lista osób, za które użytkownik obiecał się modlić.
-- ----------------------------------------------------------------------------
create table if not exists prayer_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  person_name text not null check (length(btrim(person_name)) > 0),
  reason text,
  promise_date date not null default current_date,
  fulfilled boolean not null default false,
  fulfilled_at timestamptz,
  notes text,
  last_prayed_at timestamptz,
  prayed_count integer not null default 0 check (prayed_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists prayer_requests_user_idx on prayer_requests (user_id, fulfilled);

-- ----------------------------------------------------------------------------
-- prayer_settings: preferencje aplikacji. calendar_token to sekret w URL-u
-- feedu ICS (/api/modlitwa/kalendarz.ics?token=...) — kalendarz Google/Apple
-- subskrybuje adres bez ciasteczek sesji, więc token JEST tu autoryzacją.
-- Rotacja tokenu natychmiast unieważnia stare subskrypcje.
-- ----------------------------------------------------------------------------
create table if not exists prayer_settings (
  user_id uuid primary key references profiles (id) on delete cascade,
  notifications_enabled boolean not null default false,
  reminder_time time not null default '21:00',
  calendar_sync_enabled boolean not null default false,
  calendar_token uuid not null default gen_random_uuid(),
  include_intentions_in_calendar boolean not null default false,
  large_text boolean not null default false,
  updated_at timestamptz not null default now()
);
create unique index if not exists prayer_settings_calendar_token_idx on prayer_settings (calendar_token);

-- ----------------------------------------------------------------------------
-- RLS
-- ----------------------------------------------------------------------------
alter table bible_verses enable row level security;
alter table daily_verse_picks enable row level security;
alter table daily_readings enable row level security;
alter table special_liturgical_dates enable row level security;
alter table prayer_streaks enable row level security;
alter table prayer_log enable row level security;
alter table prayer_requests enable row level security;
alter table prayer_settings enable row level security;

-- treści wspólne: czytelne dla zalogowanych, zapis przez admina/service-role
do $$ begin
  create policy "bible_verses_select" on bible_verses for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "bible_verses_admin_write" on bible_verses for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "daily_readings_select" on daily_readings for select to authenticated using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "special_liturgical_dates_select" on special_liturgical_dates for select to authenticated using (true);
exception when duplicate_object then null; end $$;

-- dane prywatne: wyłącznie własne wiersze, bez wyjątku dla admina
do $$ begin
  create policy "daily_verse_picks_own" on daily_verse_picks for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "prayer_streaks_own" on prayer_streaks for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "prayer_log_own" on prayer_log for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "prayer_requests_own" on prayer_requests for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "prayer_settings_own" on prayer_settings for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
