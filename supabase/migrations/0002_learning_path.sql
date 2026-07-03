-- ============================================================================
-- 0002_learning_path.sql
-- "Ścieżka nauki" (learning path/roadmap): an ordered sequence of stages per
-- level, each pairing one vocabulary category with one grammar topic. A
-- stage unlocks once the previous stage's vocabulary reaches the mastery
-- threshold — see lib/learning-path/progress.ts, which computes unlock
-- status live from vocabulary_progress (no new per-user progress table
-- needed, same pattern as lib/homework/progress.ts).
-- ============================================================================

create table learning_path_stages (
  id uuid primary key default gen_random_uuid(),
  level user_level not null,
  order_index int not null,
  category text not null, -- must match vocabulary_words.category exactly
  title text not null, -- display name, e.g. "Rodzina"
  grammar_topic_id uuid references grammar_topics (id),
  created_at timestamptz not null default now(),
  unique (level, order_index)
);
create index learning_path_stages_level_idx on learning_path_stages (level);

alter table learning_path_stages enable row level security;

create policy "learning_path_stages_select" on learning_path_stages for select to authenticated
  using (true);
create policy "learning_path_stages_admin_write" on learning_path_stages for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
