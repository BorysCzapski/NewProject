// ============================================================================
// lib/homework/admin-queries.ts
// Read-only helpers backing the admin homework screens: the dashboard list
// (with a rough completion count per item) and the per-homework "who
// completed it" breakdown, plus a couple of small lookups used to populate
// the creator form's type-specific fields (vocabulary categories, grammar
// topics).
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { GrammarTopic, Homework, HomeworkStatus, Profile, UserLevel } from "@/lib/types/database";

export interface HomeworkListItem extends Homework {
  completedCount: number;
  eligibleCount: number;
}

/**
 * All homework, newest first, each annotated with a rough completion count:
 * how many homework_progress rows are 'completed' vs how many profiles are
 * even at a matching level. This is approximate — a profile only gets a
 * homework_progress row once it visits /prace-domowe (see progress.ts) — but
 * good enough for a dashboard overview.
 */
export async function listHomeworkForAdmin(supabase: SupabaseClient): Promise<HomeworkListItem[]> {
  const { data: homeworkList } = await supabase
    .from("homework")
    .select("*")
    .order("created_at", { ascending: false });

  if (!homeworkList || homeworkList.length === 0) return [];

  const results: HomeworkListItem[] = [];
  for (const hw of homeworkList as Homework[]) {
    const [{ count: eligibleCount }, { count: completedCount }] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }).in("level", hw.levels),
      supabase
        .from("homework_progress")
        .select("id", { count: "exact", head: true })
        .eq("homework_id", hw.id)
        .eq("status", "completed"),
    ]);
    results.push({ ...hw, eligibleCount: eligibleCount ?? 0, completedCount: completedCount ?? 0 });
  }
  return results;
}

export interface CompletionRow {
  profile: Profile;
  status: HomeworkStatus;
  progress_current: number;
  progress_target: number;
  completed_at: string | null;
}

/**
 * Every profile eligible for `homeworkId` (level in homework.levels), each
 * paired with its homework_progress row. Profiles who haven't opened
 * /prace-domowe yet have no homework_progress row at all — that's expected
 * (the row is created lazily by getHomeworkWithProgress on first view), NOT
 * a bug — so those default to status 'todo' with 0/0 progress here.
 */
export async function getCompletionsForHomework(
  supabase: SupabaseClient,
  homeworkId: string
): Promise<{ homework: Homework; completions: CompletionRow[] } | null> {
  const { data: homework } = await supabase.from("homework").select("*").eq("id", homeworkId).maybeSingle();
  if (!homework) return null;

  const [{ data: profiles }, { data: progressRows }] = await Promise.all([
    supabase.from("profiles").select("*").in("level", (homework as Homework).levels).order("username"),
    supabase.from("homework_progress").select("*").eq("homework_id", homeworkId),
  ]);

  const progressByUser = new Map((progressRows ?? []).map((p) => [p.user_id, p]));

  const completions: CompletionRow[] = ((profiles ?? []) as Profile[]).map((profile) => {
    const progress = progressByUser.get(profile.id);
    return {
      profile,
      status: (progress?.status as HomeworkStatus) ?? "todo",
      progress_current: progress?.progress_current ?? 0,
      progress_target: progress?.progress_target ?? 0,
      completed_at: progress?.completed_at ?? null,
    };
  });

  // Completed first, then by progress descending, so the most engaged
  // students float to the top.
  completions.sort((a, b) => {
    if (a.status === "completed" && b.status !== "completed") return -1;
    if (b.status === "completed" && a.status !== "completed") return 1;
    return b.progress_current - a.progress_current;
  });

  return { homework: homework as Homework, completions };
}

export interface VocabularyCategoryOption {
  level: UserLevel;
  category: string;
}

/** Distinct (level, category) pairs from vocabulary_words, for the creator form's category suggestions. */
export async function getVocabularyCategories(supabase: SupabaseClient): Promise<VocabularyCategoryOption[]> {
  const { data } = await supabase.from("vocabulary_words").select("level, category");
  const seen = new Set<string>();
  const options: VocabularyCategoryOption[] = [];
  for (const row of data ?? []) {
    const key = `${row.level}::${row.category}`;
    if (seen.has(key)) continue;
    seen.add(key);
    options.push({ level: row.level as UserLevel, category: row.category as string });
  }
  return options.sort((a, b) => a.category.localeCompare(b.category));
}

/** All grammar topics (small table), for the creator form's per-level topic select. */
export async function getGrammarTopics(supabase: SupabaseClient): Promise<GrammarTopic[]> {
  const { data } = await supabase.from("grammar_topics").select("*").order("level").order("order_index");
  return (data ?? []) as GrammarTopic[];
}
