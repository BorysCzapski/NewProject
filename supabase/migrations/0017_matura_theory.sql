-- ============================================================================
-- 0017_matura_theory.sql
-- "Teoria" for the Matura module: a browsable library of grammar/strategy
-- lessons per exam part, and a vocabulary bank organised by the CKE thematic
-- blocks — the two things a maturzysta actually revises from, which 0013 only
-- gestured at (one unnamed matura_lessons row per section, no vocabulary at
-- all).
--
-- Three changes:
--
-- 1. matura_lessons becomes ADDRESSABLE and CLASSIFIABLE. It gains a slug (so
--    one lesson can have its own URL instead of every lesson in a section
--    being concatenated onto one page), a summary + estimated_minutes (so an
--    index can be rendered without parsing the jsonb content), and a kind
--    (gramatyka / słownictwo / strategia) so a section can group its theory.
--
-- 2. matura_lesson_progress: per-user "przerobione". Deliberately a plain
--    completion mark, NOT a score — a lesson is read, not graded; scoring
--    already happens in matura_task_attempts.
--
-- 3. matura_vocab_topics / _entries / _progress: the vocabulary bank.
--
-- WHY NOT REUSE vocabulary_words (0001_init.sql)? Three reasons, any one of
-- which would be enough:
--   * Its level axis is user_level (CEFR A1-B2). Matura vocabulary is scoped
--     by matura_level (podstawowa/rozszerzona). Mapping one onto the other
--     would be a fiction — CKE does not publish a CEFR word list.
--   * Its shape is thinner: one optional example_sentence, no translation of
--     that example, no part of speech, no room for the collocation/false-friend
--     notes that are most of the value of a matura word list.
--   * vocabulary_words is Linguo's content and Linguo's flashcard trainer
--     reads it unfiltered. Inserting a few thousand matura entries there would
--     silently change what an unrelated app teaches.
-- The SHAPE still mirrors vocabulary_words/vocabulary_progress on purpose, so
-- the two stay recognisably the same idea.
--
-- Vocabulary topics are per-language (like matura_sections) even though the
-- thematic blocks themselves are language-independent: each block carries its
-- name in the target language, and entries hang off a topic, so a shared topic
-- row would force every entry query to filter on language separately.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------------------
do $$ begin
  create type matura_lesson_kind as enum ('gramatyka', 'slownictwo', 'strategia');
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- 1. matura_lessons: addressable, classifiable theory
-- ----------------------------------------------------------------------------
alter table matura_lessons add column if not exists slug text;
alter table matura_lessons add column if not exists summary text not null default '';
alter table matura_lessons add column if not exists kind matura_lesson_kind not null default 'gramatyka';
alter table matura_lessons add column if not exists estimated_minutes int not null default 8
  check (estimated_minutes > 0);

-- Backfill before enforcing NOT NULL. order_index is already unique per
-- section in practice (the seeds number lessons from 1), so this is collision
-- -free; the seeds rewrite every row with a real slug immediately afterwards.
update matura_lessons set slug = 'lekcja-' || order_index where slug is null;
alter table matura_lessons alter column slug set not null;

create unique index if not exists matura_lessons_section_slug_idx
  on matura_lessons (section_id, slug);

-- ----------------------------------------------------------------------------
-- 2. matura_lesson_progress
-- ----------------------------------------------------------------------------
create table if not exists matura_lesson_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  lesson_id uuid not null references matura_lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);
create index if not exists matura_lesson_progress_user_idx
  on matura_lesson_progress (user_id, completed_at desc);

-- ----------------------------------------------------------------------------
-- 3a. matura_vocab_topics: the CKE thematic blocks
--
-- The block list comes from the podstawa programowa's "zakres tematyczny" for
-- języki obce nowożytne, which CKE's Informator reproduces as the scope every
-- arkusz draws its texts and vocabulary from. The exact wording and count are
-- the podstawa's, NOT a per-session CKE decision — but the split of individual
-- words between blocks is ours (CKE publishes no official word list for
-- języki obce, unlike some other subjects). Treat entry placement as editorial.
-- ----------------------------------------------------------------------------
create table if not exists matura_vocab_topics (
  id uuid primary key default gen_random_uuid(),
  language matura_language not null,
  slug text not null,
  -- Polish name of the thematic block, as the maturzysta knows it.
  title text not null,
  -- Same block named in the target language — students meet it that way in
  -- the arkusz, and it doubles as the first thing the topic teaches.
  title_target text not null,
  description text not null default '',
  order_index int not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (language, slug),
  unique (language, order_index)
);

-- ----------------------------------------------------------------------------
-- 3b. matura_vocab_entries
--
-- `level` is the level FROM WHICH an entry is expected, not the only level it
-- belongs to: a rozszerzona student is still responsible for every podstawowa
-- word, so queries for rozszerzona read both levels while podstawowa reads
-- only its own. See lib/matura/vocab.ts levelsUpTo().
--
-- unique (topic_id, term) is a content guard, not just a constraint: bulk-
-- authored word lists duplicate entries easily, and a deck that shows the same
-- word three times is worse than a seed that refuses to load.
-- ----------------------------------------------------------------------------
create table if not exists matura_vocab_entries (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references matura_vocab_topics (id) on delete cascade,
  level matura_level not null default 'podstawowa',
  -- The word/phrase in the target language.
  term text not null,
  -- 'rzeczownik' | 'czasownik' | 'przymiotnik' | 'przysłówek' | 'zwrot' | ...
  -- Free text rather than an enum: Spanish and English carve up parts of
  -- speech differently and the list would need editing per language.
  part_of_speech text not null default '',
  translation_pl text not null,
  example text not null default '',
  example_pl text not null default '',
  -- Collocations, register, false friends, irregular forms — the part that
  -- turns a word list into something worth revising from.
  note text not null default '',
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  unique (topic_id, term)
);
create index if not exists matura_vocab_entries_topic_idx
  on matura_vocab_entries (topic_id, level, order_index);

-- ----------------------------------------------------------------------------
-- 3c. matura_vocab_progress: Leitner-box spaced repetition
--
-- Unlike vocabulary_progress (0001_init.sql), which only counts hits and
-- misses, this carries a box + next_review_at: the vocabulary bank is far too
-- large to revise by grinding through it linearly, so the drill has to be able
-- to ask "what is due today". Intervals live in lib/matura/vocab-review.ts,
-- following the fixed-interval design already used by lib/matma/spaced-review.ts
-- and lib/geografia/spaced-review.ts rather than inventing a third scheme.
-- ----------------------------------------------------------------------------
create table if not exists matura_vocab_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  entry_id uuid not null references matura_vocab_entries (id) on delete cascade,
  box smallint not null default 0 check (box >= 0 and box <= 5),
  correct_count int not null default 0,
  incorrect_count int not null default 0,
  status mastery_status not null default 'new',
  last_reviewed_at timestamptz,
  next_review_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, entry_id)
);
create index if not exists matura_vocab_progress_user_idx on matura_vocab_progress (user_id);
create index if not exists matura_vocab_progress_due_idx
  on matura_vocab_progress (user_id, next_review_at);

-- ----------------------------------------------------------------------------
-- updated_at maintenance (reuses public.set_updated_at() from 0001_init.sql)
-- ----------------------------------------------------------------------------
do $$ begin
  create trigger matura_vocab_topics_set_updated_at before update on matura_vocab_topics
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

do $$ begin
  create trigger matura_vocab_progress_set_updated_at before update on matura_vocab_progress
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Row Level Security — repo convention: shared content readable by every
-- authenticated user and writable only by admins; per-user tables are own-row
-- plus admin read.
-- ----------------------------------------------------------------------------
alter table matura_lesson_progress enable row level security;
alter table matura_vocab_topics enable row level security;
alter table matura_vocab_entries enable row level security;
alter table matura_vocab_progress enable row level security;

do $$ begin
  create policy "matura_vocab_topics_select" on matura_vocab_topics for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_vocab_topics_admin_write" on matura_vocab_topics for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "matura_vocab_entries_select" on matura_vocab_entries for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_vocab_entries_admin_write" on matura_vocab_entries for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "matura_lesson_progress_own" on matura_lesson_progress for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_lesson_progress_admin_read" on matura_lesson_progress for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "matura_vocab_progress_own" on matura_vocab_progress for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_vocab_progress_admin_read" on matura_vocab_progress for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;
