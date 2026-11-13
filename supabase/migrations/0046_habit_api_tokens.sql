-- ============================================================================
-- 0046_habit_api_tokens.sql
-- Osobisty token API do nawyków (Skróty macOS / curl → /api/habits).
-- Przechowujemy tylko SHA-256 tokenu (token ma 256 bitów losowości, więc
-- szybki hash wystarcza); sam token widać raz, przy generowaniu. Jeden token
-- na użytkownika — odnowienie nadpisuje wiersz i unieważnia stary.
-- Zapis tylko przez service-role (server action po requireProfile), klient
-- "authenticated" może jedynie odczytać własny wiersz (created_at/last_used_at).
-- Safe to re-run.
-- ============================================================================
create table if not exists habit_api_tokens (
  user_id uuid primary key references profiles (id) on delete cascade,
  token_hash text not null,
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);
create unique index if not exists habit_api_tokens_hash_idx on habit_api_tokens (token_hash);

alter table habit_api_tokens enable row level security;

do $$ begin
  create policy "habit_api_tokens_select_own" on habit_api_tokens for select to authenticated
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
