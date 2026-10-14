-- ============================================================================
-- 0020_godziny.sql
-- Mini-aplikacja "Godziny": rejestr czasu nauki — ile minut i CZEGO dana
-- osoba się uczyła. Dwie tabele, obie wyłącznie per-user (żadnych treści
-- globalnych, w przeciwieństwie np. do 0017_modlitwa.sql).
--
--   study_topics    — lista tematów do wyboru ("Matematyka — Algebra",
--                     "Programowanie — Python", ...). Świadomie PER-USER,
--                     a nie wspólny słownik: spec mówi, że lista ma być
--                     edytowalna przez użytkownika, więc cudze zmiany nie
--                     mogą przestawiać nikomu jego własnych kafelków.
--                     Zestaw startowy zakłada lib/godziny/defaults.ts
--                     (jednorazowo, na życzenie — patrz seedDefaultTopics).
--
--   study_sessions  — pojedynczy wpis: data + liczba minut + temat + notatka.
--
-- DECYZJA PROJEKTOWA (spec zostawiała ją otwartą — „konflikt wpisu w tym
-- samym dniu: zezwolić na wiele wpisów czy sumować je"): ZEZWALAMY na wiele
-- wpisów tego samego dnia, także dla tego samego tematu — nauka realnie
-- rozbija się na sesje (rano 30 min, wieczorem 45 min), a notatka dotyczy
-- konkretnej sesji, nie całego dnia. Sumowanie jest sprawą WIDOKU (dzień /
-- tydzień / miesiąc w lib/godziny/queries.ts), nie schematu. Dlatego NIE ma
-- tu unikalnego indeksu po (user_id, study_date, topic_id).
--
-- Walidacji „data nie z przyszłości" NIE da się wyrazić jako CHECK —
-- current_date jest STABLE, a Postgres wymaga w CHECK funkcji IMMUTABLE.
-- Ten warunek pilnuje lib/godziny/actions.ts (w strefie Europe/Warsaw, żeby
-- wpis zrobiony o 23:30 nie wyglądał na jutrzejszy).
--
-- Safe to re-run (create table/policy only if missing).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- study_topics: czego można się uczyć. `category` grupuje tematy na liście
-- wyboru i w podsumowaniach (spec: „opcjonalnie, ułatwia grupowanie").
--
-- Zamiast kasowania używanych tematów mamy `is_archived` — temat znika z
-- listy wyboru, ale stare wpisy zachowują sensowną nazwę zamiast dziury.
-- Realne kasowanie jest dozwolone tylko dla tematu BEZ wpisów; pilnuje tego
-- deleteTopic() w lib/godziny/topic-actions.ts (patrz komentarz przy
-- topic_id niżej — dlaczego nie robi tego sama baza).
-- ----------------------------------------------------------------------------
create table if not exists study_topics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  name text not null check (length(btrim(name)) between 1 and 80),
  category text check (category is null or length(btrim(category)) between 1 and 40),
  /* Slot palety --chart-1..8 z app/globals.css (patrz lib/paragony/chart-colors.ts). */
  color_index smallint not null default 0 check (color_index between 0 and 7),
  is_archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Bez duplikatów nazw u jednego użytkownika (case-insensitive) — inaczej dwa
-- wpisy „Angielski" i „angielski" rozjeżdżałyby statystyki na dwa słupki.
-- Indeks obejmuje też tematy zarchiwizowane: powtórne dodanie tej samej nazwy
-- ma przywrócić archiwalny temat (z jego historią), a nie tworzyć bliźniaka.
create unique index if not exists study_topics_user_name_idx
  on study_topics (user_id, lower(btrim(name)));

create index if not exists study_topics_user_active_idx
  on study_topics (user_id) where not is_archived;

-- ----------------------------------------------------------------------------
-- study_sessions: właściwy dziennik nauki.
--
-- duration_minutes: górny limit to doba (1440). To nie jest arbitralna
-- ozdoba — bez niego literówka „600" zamiast „60" przy wpisywaniu godzin
-- rozwala każdą sumę tygodniową i wykres.
--
-- topic_id ... on delete cascade, a NIE restrict, mimo że regułą aplikacji
-- jest „temat z historią się archiwizuje, nie kasuje". Powód jest techniczny:
-- przy `delete from profiles` Postgres kaskaduje do study_topics i
-- study_sessions dwoma osobnymi triggerami RI, a RESTRICT sprawdza się
-- NATYCHMIAST — gdyby kaskada trafiła najpierw w tematy, skasowanie konta
-- wywaliłoby się na wciąż istniejących sesjach. Regułę „nie kasuj tematu z
-- historią" egzekwuje więc warstwa akcji (deleteTopic policzy wpisy i każe
-- zarchiwizować), a kaskada tutaj istnieje wyłącznie po to, żeby usunięcie
-- profilu sprzątało po sobie w dowolnej kolejności.
-- ----------------------------------------------------------------------------
create table if not exists study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  topic_id uuid not null references study_topics (id) on delete cascade,
  study_date date not null,
  duration_minutes integer not null check (duration_minutes > 0 and duration_minutes <= 1440),
  note text check (note is null or length(note) <= 500),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Główny wzorzec odczytu: „moje wpisy, od najnowszych" (stream i historia).
create index if not exists study_sessions_user_date_idx
  on study_sessions (user_id, study_date desc, created_at desc);

-- Filtr po temacie (spec: przegląd historii z filtrowaniem po temacie).
create index if not exists study_sessions_topic_idx
  on study_sessions (topic_id, study_date desc);

-- ----------------------------------------------------------------------------
-- RLS. Dziennik nauki to dane prywatne — jak w 0008 (finanse) i 0017
-- (intencje) NIE ma tu polityki „_admin_read": administrator nie ogląda
-- cudzych godzin nauki.
-- ----------------------------------------------------------------------------
alter table study_topics enable row level security;
alter table study_sessions enable row level security;

do $$ begin
  create policy "study_topics_own" on study_topics for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "study_sessions_own" on study_sessions for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
