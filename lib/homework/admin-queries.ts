// ============================================================================
// lib/homework/admin-queries.ts
// Read-only helpers backing the admin homework screens: the dashboard list
// (with a rough completion count per item) and the per-homework "who
// completed it" breakdown, plus lookups used to populate the creator form's
// type-specific fields (vocabulary categories, grammar topics), all scoped by
// the homework's target language.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  GrammarTopic,
  Homework,
  HomeworkStatus,
  Profile,
  TargetLanguage,
  UserLevel,
} from "@/lib/types/database";

export interface HomeworkListItem extends Homework {
  completedCount: number;
  eligibleCount: number;
}

/**
 * All homework, newest first, each annotated with a rough completion count.
 * eligibleCount: for a personal homework it's 1; for a level-wide one it's the
 * number of students at a matching level AND language. This is approximate —
 * a profile only gets a homework_progress row once it visits /prace-domowe.
 */
export async function listHomeworkForAdmin(supabase: SupabaseClient): Promise<HomeworkListItem[]> {
  const { data: homeworkList } = await supabase
    .from("homework")
    .select("*")
    .order("created_at", { ascending: false });

  if (!homeworkList || homeworkList.length === 0) return [];

  const [{ data: profiles }, { data: completedRows }] = await Promise.all([
    supabase.from("profiles").select("level, target_language, role"),
    supabase.from("homework_progress").select("homework_id").eq("status", "completed"),
  ]);

  // eligible students indexed by "language::level" (students only, not admins)
  const eligibleByLangLevel = new Map<string, number>();
  for (const p of profiles ?? []) {
    if (p.role === "admin") continue;
    const key = `${p.target_language}::${p.level}`;
    eligibleByLangLevel.set(key, (eligibleByLangLevel.get(key) ?? 0) + 1);
  }

  const completedByHomeworkId = new Map<string, number>();
  for (const row of completedRows ?? []) {
    completedByHomeworkId.set(row.homework_id, (completedByHomeworkId.get(row.homework_id) ?? 0) + 1);
  }

  return (homeworkList as Homework[]).map((hw) => ({
    ...hw,
    eligibleCount: hw.target_user_id
      ? 1
      : hw.levels.reduce((sum, level) => sum + (eligibleByLangLevel.get(`${hw.language}::${level}`) ?? 0), 0),
    completedCount: completedByHomeworkId.get(hw.id) ?? 0,
  }));
}

export interface CompletionRow {
  profile: Profile;
  status: HomeworkStatus;
  progress_current: number;
  progress_target: number;
  completed_at: string | null;
}

/**
 * Every student the homework applies to (a single target student, or all
 * students at a matching level + language), each paired with its
 * homework_progress row (defaulting to todo/0 if they haven't opened
 * /prace-domowe yet — the row is created lazily by getHomeworkWithProgress).
 */
export async function getCompletionsForHomework(
  supabase: SupabaseClient,
  homeworkId: string
): Promise<{ homework: Homework; completions: CompletionRow[] } | null> {
  const { data: homeworkRow } = await supabase
    .from("homework")
    .select("*")
    .eq("id", homeworkId)
    .maybeSingle();
  if (!homeworkRow) return null;
  const homework = homeworkRow as Homework;

  let profilesQuery = supabase.from("profiles").select("*").eq("role", "user").order("username");
  if (homework.target_user_id) {
    profilesQuery = profilesQuery.eq("id", homework.target_user_id);
  } else {
    profilesQuery = profilesQuery.eq("target_language", homework.language).in("level", homework.levels);
  }

  const [{ data: profiles }, { data: progressRows }] = await Promise.all([
    profilesQuery,
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

  completions.sort((a, b) => {
    if (a.status === "completed" && b.status !== "completed") return -1;
    if (b.status === "completed" && a.status !== "completed") return 1;
    return b.progress_current - a.progress_current;
  });

  return { homework, completions };
}

export interface VocabularyCategoryOption {
  level: UserLevel;
  category: string;
}

/** Distinct (level, category) pairs for a language, for the creator form's category suggestions. */
export async function getVocabularyCategories(
  supabase: SupabaseClient,
  language: TargetLanguage
): Promise<VocabularyCategoryOption[]> {
  const { data } = await supabase
    .from("vocabulary_words")
    .select("level, category")
    .eq("language", language);
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

/** Grammar topics for a language, for the creator form's per-level topic select. */
export async function getGrammarTopics(
  supabase: SupabaseClient,
  language: TargetLanguage
): Promise<GrammarTopic[]> {
  const { data } = await supabase
    .from("grammar_topics")
    .select("*")
    .eq("language", language)
    .order("level")
    .order("order_index");
  return (data ?? []) as GrammarTopic[];
}

/** Students (not admins) for the "assign to individual student" picker in the homework creator. */
export interface StudentOption {
  id: string;
  username: string;
  level: UserLevel;
  target_language: TargetLanguage;
}

export async function listStudents(supabase: SupabaseClient): Promise<StudentOption[]> {
  const { data } = await supabase
    .from("profiles")
    .select("id, username, level, target_language")
    .eq("role", "user")
    .order("username");
  return (data ?? []) as StudentOption[];
}
