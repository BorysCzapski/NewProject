-- ============================================================================
-- 0032_lexicon.sql
-- "Codzienne" — daily words & phrases for Linguo (English), built on public
-- frequency lists: EF's "Top 3000 words" and UMN CCAPS's "150 most common
-- phrasal verbs".
--
-- WHY NOT REUSE vocabulary_words (0001_init.sql)? That table is the CEFR-leveled
-- curriculum behind the Ścieżka and the flashcard trainer; pouring 3000 extra
-- rows into it would silently change what those modules teach. This is a
-- separate, frequency-ordered deck with its own progress — the same call 0021
-- made for the matura vocabulary bank.
--
-- WHY IS translation_pl ALLOWED TO BE EMPTY? The source lists are bare headwords.
-- Polish translations and example sentences are filled in lazily by the AI the
-- first time a word is scheduled (lib/lexicon/enrich.ts) and then cached here,
-- so the AI cost is paid once per word for everybody, not per student.
--
-- Progress mirrors matura_vocab_progress: Leitner box + next_review_at, with the
-- intervals shared from lib/matura/vocab-review.ts.
-- ============================================================================

create table if not exists lexicon_decks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null default '',
  -- 'word' | 'phrase' — drives the labels and the AI brief.
  kind text not null check (kind in ('word', 'phrase')),
  -- Where the list comes from; shown on the deck card.
  source_name text not null default '',
  source_url text not null default '',
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists lexicon_entries (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid not null references lexicon_decks (id) on delete cascade,
  -- Position in the source list (frequency rank for EF) — new words are taught
  -- in this order, most common first.
  rank int not null,
  term text not null,
  part_of_speech text not null default '',
  translation_pl text not null default '',
  example text not null default '',
  example_pl text not null default '',
  note text not null default '',
  -- Set once the AI has filled the card in. Distinguishes "not enriched yet"
  -- from "enriched, and the note happens to be empty".
  enriched_at timestamptz,
  created_at timestamptz not null default now(),
  unique (deck_id, term),
  unique (deck_id, rank)
);
create index if not exists lexicon_entries_deck_rank_idx on lexicon_entries (deck_id, rank);

create table if not exists lexicon_progress (
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
create index if not exists lexicon_progress_user_idx on lexicon_progress (user_id);
create index if not exists lexicon_progress_due_idx on lexicon_progress (user_id, next_review_at);

do $$ begin
  create trigger lexicon_progress_set_updated_at before update on lexicon_progress
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------------
-- Row Level Security — shared content readable by every authenticated user,
-- writable by admins (AI enrichment goes through the service-role client);
-- progress is own-row plus admin read.
-- ---------------------------------------------------------------------------
alter table lexicon_decks enable row level security;
alter table lexicon_entries enable row level security;
alter table lexicon_progress enable row level security;

do $$ begin
  create policy "lexicon_decks_select" on lexicon_decks for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "lexicon_decks_admin_write" on lexicon_decks for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "lexicon_entries_select" on lexicon_entries for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "lexicon_entries_admin_write" on lexicon_entries for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "lexicon_progress_own" on lexicon_progress for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "lexicon_progress_admin_read" on lexicon_progress for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;
