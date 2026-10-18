-- ============================================================================
-- 0031_informatyka_references.sql
-- Reference solutions and an automatic answer check for Informatyka problems.
-- The CKE keys carry no code, so the reference SQL / Python is ours — each one
-- is run against the real exam data and compared with the key (see
-- scripts/informatyka-refs.mjs) before it is stored.
-- ============================================================================
alter table informatyka_problems
  add column if not exists reference_sql text,
  add column if not exists reference_code text,
  add column if not exists reference_note text,
  -- { "any": [["token", ...], ...] } — see lib/informatyka/answer-check.ts; null = not auto-checkable
  add column if not exists answer_check jsonb;
