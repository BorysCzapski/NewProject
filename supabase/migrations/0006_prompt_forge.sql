-- ============================================================================
-- 0006_prompt_forge.sql
-- Kuźnia (prompt-forge mini-app): one row per prompt-building session. The
-- whole conversation + the live draft document live in ONE row (messages/
-- conflicts as jsonb) rather than a separate messages table — there's no
-- other place in this schema needing per-session history, so a join table
-- would be pure overhead for a document that's only ever read/written whole.
--
-- Safe to re-run (create table/policy only if missing).
-- ============================================================================

create table if not exists prompt_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  title text not null default 'Nowy prompt',
  goal text not null default '',
  draft text not null default '',
  messages jsonb not null default '[]'::jsonb,
  conflicts jsonb not null default '[]'::jsonb,
  suggestions jsonb not null default '[]'::jsonb,
  ready_to_copy boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists prompt_sessions_user_idx on prompt_sessions (user_id);

alter table prompt_sessions enable row level security;

do $$ begin
  create policy "prompt_sessions_own" on prompt_sessions for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "prompt_sessions_admin_read" on prompt_sessions for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;
