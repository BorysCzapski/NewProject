-- ============================================================================
-- 0004_writing_tasks_insert_own.sql
-- Bugfix: students could not generate writing tasks. writing_tasks only had
-- an admin-write policy (unlike songs/listening_exercises, which both have an
-- insert_own policy), so a regular user's "Nowe zadanie" insert was rejected
-- by RLS and the UI showed "Nie udało się utworzyć zadania pisemnego."
-- Mirrors the songs/listening_exercises pattern: a user may insert a task
-- they own (created_by = their uid); admins may insert anything.
--
-- Safe to re-run (drops the policy first if it exists).
-- ============================================================================

drop policy if exists "writing_tasks_insert_own" on writing_tasks;
create policy "writing_tasks_insert_own" on writing_tasks for insert to authenticated
  with check (auth.uid() = created_by or public.is_admin());
