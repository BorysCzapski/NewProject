-- ============================================================================
-- 0014_matura_writing.sql
-- "Wypowiedź pisemna" for Matura Angielski: a task bank of writing prompts
-- (e-mail/blog for podstawowa, rozprawka za i przeciw for rozszerzona) plus
-- AI-graded submissions. Kept as SEPARATE tables from matura_tasks/
-- matura_task_attempts (0013_matura.sql) rather than reusing them — those
-- are shaped for exact-match, per-item grading (środki językowe); a writing
-- submission is one free-text answer graded holistically against a 4-part
-- CKE rubric with per-criterion commentary, which needs a different shape
-- entirely (same reasoning that gave Linguo's writing_tasks/
-- writing_submissions their own tables instead of reusing grammar_exercises).
--
-- Rubric point totals are STRUCTURAL FACTS of the current CKE format (not an
-- admin approximation): 12 pts total at poziom podstawowy (treść 5 +
-- spójność i logika 2 + zakres środków językowych 3 + poprawność 2), 13 pts
-- at poziom rozszerzony (zgodność z poleceniem 5 + spójność i logika 2 +
-- zakres 3 + poprawność 3) — see lib/matura/writing-grading.ts for the full
-- rubric text used to prompt the AI grader, sourced from the official CKE
-- "Informator o egzaminie maturalnym z języka angielskiego" (2024/2025+).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- matura_writing_tasks: the task bank. content_points is the ordered list of
-- Polish "podpunkty" (bullet points) the student's response must address —
-- CKE always gives exactly 4 at podstawowy, and rozprawka za i przeciw has
-- an implicit 2 (for-arguments / against-arguments), modeled the same way
-- for a consistent UI. model_answer is an ORIGINAL, full-mark-quality
-- reference text (never a copied CKE past-exam model answer) revealed to
-- the student only after they submit their own attempt.
-- ----------------------------------------------------------------------------
create table if not exists matura_writing_tasks (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references matura_sections (id) on delete cascade,
  -- 'email' | 'blog_post' | 'forum_post' (podstawowa) | 'rozprawka_za_i_przeciw' (rozszerzona)
  form_type text not null,
  instructions text not null,
  content_points jsonb not null default '[]'::jsonb,
  min_words int not null,
  max_words int not null,
  points_max smallint not null check (points_max > 0),
  source matura_task_source not null default 'topic',
  source_metadata jsonb,
  model_answer text not null,
  model_answer_notes text not null default '',
  created_by uuid references profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists matura_writing_tasks_section_idx on matura_writing_tasks (section_id);

-- ----------------------------------------------------------------------------
-- matura_writing_submissions: one row per graded attempt. ai_feedback is
-- jsonb: MaturaWritingAiFeedback (see lib/types/database.ts) — an array of
-- per-criterion {key,label,pointsAwarded,pointsMax,comment} plus
-- generalFeedback/improvementTip. points_awarded/max_points are duplicated
-- out of ai_feedback for cheap querying (progress/dashboard reads), same
-- pattern as math_problem_attempts.points_awarded next to ai_feedback.
-- ----------------------------------------------------------------------------
create table if not exists matura_writing_submissions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references matura_writing_tasks (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  content text not null,
  word_count int not null,
  points_awarded numeric not null,
  max_points numeric not null,
  ai_feedback jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists matura_writing_submissions_user_idx on matura_writing_submissions (user_id, created_at desc);
create index if not exists matura_writing_submissions_task_idx on matura_writing_submissions (task_id);

-- ----------------------------------------------------------------------------
-- Row Level Security
-- ----------------------------------------------------------------------------
alter table matura_writing_tasks enable row level security;
alter table matura_writing_submissions enable row level security;

do $$ begin
  create policy "matura_writing_tasks_select" on matura_writing_tasks for select to authenticated using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_writing_tasks_admin_write" on matura_writing_tasks for all to authenticated
    using (public.is_admin()) with check (public.is_admin());
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "matura_writing_submissions_own" on matura_writing_submissions for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "matura_writing_submissions_admin_read" on matura_writing_submissions for select to authenticated
    using (public.is_admin());
exception when duplicate_object then null; end $$;
