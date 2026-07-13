-- ============================================================================
-- 0005_phoenix_installed_apps.sql
-- Phoenix platform shell: per-user list of "installed" mini-apps shown on
-- the launcher home screen. App ids reference lib/phoenix/apps.ts (code-side
-- registry, no FK). Everyone starts with the language app installed —
-- existing users included.
--
-- Safe to re-run (add column if not exists).
-- ============================================================================

alter table profiles
  add column if not exists installed_apps text[] not null default array['jezyki'];
