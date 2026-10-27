-- ============================================================================
-- 0036_lexicon_spelling.sql
-- Postęp w ćwiczeniu "Pisownia" (uzupełnianie brakujących liter) dla talii
-- leksykonu z 0032_lexicon.sql.
--
-- OSOBNA tabela od lexicon_progress, a nie kolumna "tryb" w niej: znać
-- znaczenie słowa i umieć je napisać to dwie różne umiejętności i mają się
-- powtarzać w różnym tempie. Słowo "neighbour" można rozpoznać od razu i
-- jednocześnie pisać "neibour" przez miesiące. Wspólna skrzynka Leitnera
-- ukryłaby ten drugi problem, gdy tylko pierwsze ćwiczenie pójdzie dobrze.
-- Osobna tabela nie rusza też unique (user_id, entry_id) w lexicon_progress,
-- na którym stoi już działający kod.
--
-- Kształt i harmonogram jak w lexicon_progress (pudełka Leitnera, interwały z
-- lib/matura/vocab-review.ts).
-- ============================================================================

create table if not exists lexicon_spelling_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  entry_id uuid not null references lexicon_entries (id) on delete cascade,
  box smallint not null default 0 check (box >= 0 and box <= 5),
  correct_count int not null default 0,
  incorrect_count int not null default 0,
  status mastery_status not null default 'new',
  last_reviewed_at timestamptz,
  next_review_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, entry_id)
);
create index if not exists lexicon_spelling_progress_user_idx on lexicon_spelling_progress (user_id);
create index if not exists lexicon_spelling_progress_due_idx
  on lexicon_spelling_progress (user_id, next_review_at);

do $$ begin
  create trigger lexicon_spelling_progress_set_updated_at before update on lexicon_spelling_progress
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

-- Dane prywatne: tylko właściciel + odczyt dla admina (jak lexicon_progress).
alter table lexicon_spelling_progress enable row level security;

do $$ begin
  create policy "lexicon_spelling_progress_own" on lexicon_spelling_progress for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "lexicon_spelling_progress_admin_read" on lexicon_spelling_progress for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;
