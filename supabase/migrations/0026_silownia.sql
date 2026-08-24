-- ============================================================================
-- 0026_silownia.sql
-- Mini-aplikacja "Siłownia": dziennik treningów, nawodnienie, posiłki
-- (kalorie/makra liczone przez AI z opisu tekstowego) i suplementacja.
-- Wszystko wyłącznie per-user, jak study_* w 0020_godziny.sql — to prywatny
-- dziennik, nie wspólna baza treści.
--
--   gym_profiles          — waga/wzrost/cel, jedna rola: dane wejściowe do
--                           kalkulatora nawodnienia (lib/silownia/hydration.ts).
--                           Świadomie OSOBNA tabela od `profiles`, a nie nowe
--                           kolumny na wspólnym profilu platformy — to dane
--                           specyficzne dla jednej mini-aplikacji, jak
--                           MaturaSettings czy PrayerSettings.
--
--   gym_workouts           — jedna sesja treningowa. Ćwiczenia (nazwa, serie,
--                           powtórzenia, ciężar) trzymamy jako JSONB, a NIE
--                           w osobnej tabeli: zawsze są czytane i zapisywane
--                           razem z sesją, nigdy pojedynczo ani nie są
--                           agregowane między sesjami (na razie brak funkcji
--                           "progresja ciężaru w czasie dla danego ćwiczenia").
--                           Ten sam kompromis co MathMockExam.draft_answers.
--
--   gym_hydration_logs     — jeden wiersz na dzień (PK user_id+log_date), jak
--                           bottle_counters: klient trzyma bieżącą sumę i
--                           wysyła wartość bezwzględną (patrz
--                           components/silownia/hydration-widget.tsx), więc
--                           bazie nie trzeba liczyć atomowego incrementu.
--
--   gym_meal_entries        — opis posiłku + kalorie/makra zwrócone przez AI
--                           (lib/silownia/ai.ts, ten sam wzorzec co
--                           askAIForJSON gdzie indziej w aplikacji).
--
--   gym_supplement_entries  — nazwa, dawka (tekst — "2 kapsułki" jest równie
--                           częste co "5000 IU", więc nie ma sensu wymuszać
--                           liczby), pora dnia.
--
-- Safe to re-run (create table/policy only if missing).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- gym_profiles: dane wejściowe do kalkulatora nawodnienia i przyszłych
-- sugestii. Brak "płci" — spec ją wymieniał, ale żadna funkcja w tej wersji
-- jej nie używa, więc pole zostało pominięte (YAGNI) do czasu, aż faktycznie
-- czegoś takiego zabraknie.
-- ----------------------------------------------------------------------------
create table if not exists gym_profiles (
  user_id uuid primary key references profiles (id) on delete cascade,
  weight_kg numeric(5, 1) check (weight_kg is null or (weight_kg > 0 and weight_kg <= 400)),
  height_cm numeric(5, 1) check (height_cm is null or (height_cm > 0 and height_cm <= 260)),
  goal text check (goal is null or goal in ('redukcja', 'masa', 'utrzymanie', 'wytrzymalosc')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- gym_workouts: dziennik sesji. `split_label` to wolny tekst (nie enum) —
-- lib/silownia/constants.ts proponuje domyślne warianty ("Triceps / Klatka /
-- Barki", "Biceps / Plecy / Przedramiona"), ale użytkownik może wpisać własny
-- opis dnia, więc baza tego nie ogranicza.
-- ----------------------------------------------------------------------------
create table if not exists gym_workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  workout_date date not null,
  split_label text not null check (length(btrim(split_label)) between 1 and 80),
  duration_minutes integer check (duration_minutes is null or (duration_minutes > 0 and duration_minutes <= 600)),
  -- WorkoutExercise[] z lib/types/database.ts: [{name, sets:[{reps, weightKg}]}].
  exercises jsonb not null default '[]'::jsonb,
  note text check (note is null or length(note) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Główny wzorzec odczytu: „moje treningi, od najnowszych" (dashboard i historia).
create index if not exists gym_workouts_user_date_idx
  on gym_workouts (user_id, workout_date desc, created_at desc);

-- ----------------------------------------------------------------------------
-- gym_hydration_logs: jeden wiersz na dzień, upsert absolutnej sumy ml —
-- patrz komentarz nagłówkowy (ten sam wzorzec co bottle_counters).
-- ----------------------------------------------------------------------------
create table if not exists gym_hydration_logs (
  user_id uuid not null references profiles (id) on delete cascade,
  log_date date not null,
  consumed_ml integer not null default 0 check (consumed_ml >= 0 and consumed_ml <= 15000),
  updated_at timestamptz not null default now(),
  primary key (user_id, log_date)
);

-- ----------------------------------------------------------------------------
-- gym_meal_entries: opis posiłku + oszacowanie AI. `description` jest tym, co
-- naprawdę wpisał użytkownik — kalorie/makra to interpretacja modelu, więc
-- oryginalny opis zawsze zostaje widoczny obok liczb (żeby dało się ocenić,
-- czy oszacowanie ma sens).
-- ----------------------------------------------------------------------------
create table if not exists gym_meal_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  entry_date date not null,
  description text not null check (length(btrim(description)) between 1 and 500),
  calories integer not null check (calories >= 0 and calories <= 10000),
  protein_g numeric(6, 1) not null check (protein_g >= 0),
  carbs_g numeric(6, 1) not null check (carbs_g >= 0),
  fat_g numeric(6, 1) not null check (fat_g >= 0),
  ai_note text,
  created_at timestamptz not null default now()
);

create index if not exists gym_meal_entries_user_date_idx
  on gym_meal_entries (user_id, entry_date desc, created_at desc);

-- ----------------------------------------------------------------------------
-- gym_supplement_entries: log przyjęcia suplementu. Bez osobnego "słownika
-- suplementów" (jak study_topics) — w przeciwieństwie do tematów nauki nazwa
-- suplementu rzadko się powtarza z literówkami w sposób, który rozjeżdżałby
-- statystyki, więc dodatkowa tabela byłaby złożonością bez korzyści.
-- ----------------------------------------------------------------------------
create table if not exists gym_supplement_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  entry_date date not null,
  name text not null check (length(btrim(name)) between 1 and 80),
  dose text check (dose is null or length(btrim(dose)) <= 40),
  time_label text check (time_label is null or length(btrim(time_label)) <= 40),
  note text check (note is null or length(note) <= 300),
  created_at timestamptz not null default now()
);

create index if not exists gym_supplement_entries_user_date_idx
  on gym_supplement_entries (user_id, entry_date desc, created_at desc);

-- ----------------------------------------------------------------------------
-- RLS. Prywatny dziennik zdrowia — jak w 0008 (finanse) i 0020 (godziny) NIE
-- ma tu polityki „_admin_read".
-- ----------------------------------------------------------------------------
alter table gym_profiles enable row level security;
alter table gym_workouts enable row level security;
alter table gym_hydration_logs enable row level security;
alter table gym_meal_entries enable row level security;
alter table gym_supplement_entries enable row level security;

do $$ begin
  create policy "gym_profiles_own" on gym_profiles for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "gym_workouts_own" on gym_workouts for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "gym_hydration_logs_own" on gym_hydration_logs for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "gym_meal_entries_own" on gym_meal_entries for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "gym_supplement_entries_own" on gym_supplement_entries for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
