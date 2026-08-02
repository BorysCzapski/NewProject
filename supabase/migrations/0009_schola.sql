-- ============================================================================
-- 0009_schola.sql
-- "Schola" mini-app: a fully separate realm (own membership table, own auth
-- pages under app/schola/*, own proxy.ts branch that skips Phoenix's
-- onboarding gate) for a church choir's song library and Mass planning.
-- Lives in the SAME Supabase project as Phoenix for hosting simplicity, but
-- is logically walled off: RLS here checks is_schola_member(), never
-- profiles or auth.uid() = <owner column> like every other module — there
-- is no per-row ownership model, any Schola member can edit anything.
--
-- Every Schola signup also creates a harmless, unused Phoenix `profiles`
-- row via 0001_init.sql's unconditional handle_new_user() trigger — left
-- untouched deliberately, see lib/schola/auth-actions.ts.
--
-- Safe to re-run (create table/policy/trigger only if missing).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- schola_members: membership table, INDEPENDENT of profiles. A person can
-- be a schola_member with no meaningful Phoenix profile, and vice versa.
-- ----------------------------------------------------------------------------
create table if not exists schola_members (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now()
);

create or replace function public.is_schola_member()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from schola_members where id = auth.uid());
$$;
grant execute on function public.is_schola_member() to authenticated;

-- ----------------------------------------------------------------------------
-- schola_songs: shared song library. lyrics_chordpro stores lyrics+chords
-- using inline ChordPro-style tags ("[C]inline chord tag") — see
-- lib/schola/chordpro.ts. tags is a free array, no fixed taxonomy table.
-- ----------------------------------------------------------------------------
create table if not exists schola_songs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  lyrics_chordpro text not null default '',
  tags text[] not null default '{}',
  youtube_url text,
  sheet_music_url text,
  created_by uuid references schola_members (id) on delete set null,
  updated_by uuid references schola_members (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists schola_songs_tags_idx on schola_songs using gin (tags);

do $$ begin
  create trigger schola_songs_set_updated_at before update on schola_songs
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- schola_mass_plans: one ordered songlist for one Mass/date.
-- ----------------------------------------------------------------------------
create table if not exists schola_mass_plans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  mass_date date not null,
  notes text not null default '',
  created_by uuid references schola_members (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists schola_mass_plans_date_idx on schola_mass_plans (mass_date desc);

do $$ begin
  create trigger schola_mass_plans_set_updated_at before update on schola_mass_plans
    for each row execute function public.set_updated_at();
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- schola_mass_plan_items: ordered songs within a plan + a free-text note per
-- song ("2x refren, 1x zwrotka"). order_index is rewritten in full on every
-- reorder (lists are ~4-12 songs) — no gap/fraction cleverness. Deleting a
-- song from the library also drops it from any plan referencing it — plans
-- are living working documents, not an audit trail.
-- ----------------------------------------------------------------------------
create table if not exists schola_mass_plan_items (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references schola_mass_plans (id) on delete cascade,
  song_id uuid not null references schola_songs (id) on delete cascade,
  order_index int not null default 0,
  note text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists schola_mass_plan_items_plan_idx on schola_mass_plan_items (plan_id, order_index);

-- ----------------------------------------------------------------------------
-- RLS — every policy checks public.is_schola_member(), never a per-row
-- owner column: "any Schola member can edit anything" per product
-- requirement. `to authenticated` alone is NOT enough — this is the SAME
-- Supabase project as Phoenix, so a plain Phoenix user (authenticated, but
-- not a schola_member) must still be rejected; is_schola_member() is
-- exactly that extra check.
-- ----------------------------------------------------------------------------
alter table schola_members enable row level security;
alter table schola_songs enable row level security;
alter table schola_mass_plans enable row level security;
alter table schola_mass_plan_items enable row level security;

do $$ begin
  create policy "schola_members_select" on schola_members for select to authenticated
    using (public.is_schola_member());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "schola_members_insert_self" on schola_members for insert to authenticated
    with check (auth.uid() = id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "schola_songs_all" on schola_songs for all to authenticated
    using (public.is_schola_member()) with check (public.is_schola_member());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "schola_mass_plans_all" on schola_mass_plans for all to authenticated
    using (public.is_schola_member()) with check (public.is_schola_member());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "schola_mass_plan_items_all" on schola_mass_plan_items for all to authenticated
    using (public.is_schola_member()) with check (public.is_schola_member());
exception when duplicate_object then null; end $$;

-- No storage bucket: PDF/photo song imports are processed transiently in
-- the request and never persisted — the resulting schola_songs rows are
-- the only durable artifact.
