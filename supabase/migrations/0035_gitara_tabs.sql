-- ============================================================================
-- 0035_gitara_tabs.sql
-- Playable tabs for Gitara: whole songs as structured note data (bars → events
-- → notes with string/fret), parsed from tab PDFs by scripts/gitara/
-- parse_tab_pdf.py and loaded by scripts/gitara-tabs-ingest.mjs. Structured on
-- purpose (not a PDF or ASCII blob): the same data drives the viewer and the
-- play-along mode that listens to the microphone and checks the notes.
--
-- Readable by every signed-in user; writes by the owner (created_by) or an
-- admin — the import script uses the service role, which bypasses RLS.
-- ============================================================================
create table if not exists gtr_tabs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  artist text not null default '',
  arranger text,                              -- who wrote the arrangement (credited in the UI)
  capo smallint not null default 0,           -- fret numbers are relative to the capo
  tempo smallint,                             -- BPM of the quarter note
  tuning text not null default 'standard',
  note text,                                  -- e.g. "play every note with artificial harmonics"
  source_file text,
  -- GtrTabBar[]: [{ n, section?, events: [{ beat, tech?, notes: [{ s, f?, ah?, mute?, tie? }] }] }]
  bars jsonb not null default '[]'::jsonb,
  bar_count int not null default 0,
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table gtr_tabs enable row level security;

do $$ begin
  create policy "gtr_tabs_select" on gtr_tabs for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "gtr_tabs_insert_own" on gtr_tabs for insert to authenticated
    with check (auth.uid() = created_by or public.is_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "gtr_tabs_update_own" on gtr_tabs for update to authenticated
    using (auth.uid() = created_by or public.is_admin())
    with check (auth.uid() = created_by or public.is_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "gtr_tabs_delete_own" on gtr_tabs for delete to authenticated
    using (auth.uid() = created_by or public.is_admin());
exception when duplicate_object then null; end $$;
