-- ============================================================================
-- 0037_lexicon_recall.sql
-- Moduł "Trening fiszki": widzisz polskie słowo i WPISUJESZ angielskie.
--
-- 1. lexicon_entries.alternatives — dopuszczalne warianty odpowiedzi
--    ("staircase/stairwell", "pavement/sidewalk"). `term` zostaje hasłem
--    głównym (to je ćwiczy Pisownia), a trening przyjmuje term ORAZ każdy
--    wariant. Lista, a nie sklejony tekst, żeby porównanie nie zależało od
--    separatora wpisanego w treści.
--
-- 2. lexicon_recall_progress — postęp tego ćwiczenia. Osobna tabela z tego
--    samego powodu co lexicon_spelling_progress (0036): rozpoznać słowo,
--    napisać je i przypomnieć je sobie z polskiego to trzy różne umiejętności
--    i każda ma się powtarzać we własnym tempie. Kształt i harmonogram jak w
--    lexicon_progress (pudełka Leitnera, interwały z lib/matura/vocab-review.ts).
-- ============================================================================

alter table lexicon_entries add column if not exists alternatives text[] not null default '{}';

create table if not exists lexicon_recall_progress (
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
create index if not exists lexicon_recall_progress_user_idx on lexicon_recall_progress (user_id);
create index if not exists lexicon_recall_progress_due_idx
  on lexicon_recall_progress (user_id, next_review_at);

do $$ begin
  create trigger lexicon_recall_progress_set_updated_at before update on lexicon_recall_progress
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

alter table lexicon_recall_progress enable row level security;

do $$ begin
  create policy "lexicon_recall_progress_own" on lexicon_recall_progress for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "lexicon_recall_progress_admin_read" on lexicon_recall_progress for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;
