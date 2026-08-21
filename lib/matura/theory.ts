// ============================================================================
// lib/matura/theory.ts
// Reads for the theory library: a section's lessons with the student's
// completion marks, grouped for display.
//
// The index deliberately selects everything EXCEPT `content` — a section can
// hold a dozen lessons whose jsonb blocks run to tens of kilobytes each, and
// none of it is needed to render a list of titles. Only the lesson page itself
// pulls `content`.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { MaturaLesson, MaturaLessonKind } from "@/lib/types/database";

export type MaturaLessonSummary = Omit<MaturaLesson, "content">;

export interface LessonWithProgress {
  lesson: MaturaLessonSummary;
  completed: boolean;
}

export interface LessonGroup {
  kind: MaturaLessonKind;
  label: string;
  lessons: LessonWithProgress[];
}

export const MATURA_LESSON_KIND_LABELS: Record<MaturaLessonKind, string> = {
  gramatyka: "Gramatyka",
  slownictwo: "Słownictwo",
  strategia: "Strategia egzaminacyjna",
};

/** Order groups appear in on a section page: technique first (it frames how to
 * read the rest), then grammar, then vocabulary. */
const KIND_ORDER: MaturaLessonKind[] = ["strategia", "gramatyka", "slownictwo"];

const SUMMARY_COLUMNS =
  "id, section_id, slug, title, summary, kind, estimated_minutes, order_index, created_at, updated_at";

export async function getSectionLessons(
  supabase: SupabaseClient,
  userId: string,
  sectionId: string
): Promise<LessonWithProgress[]> {
  const { data: lessonRows } = await supabase
    .from("matura_lessons")
    .select(SUMMARY_COLUMNS)
    .eq("section_id", sectionId)
    .order("order_index");
  const lessons = (lessonRows ?? []) as MaturaLessonSummary[];
  if (lessons.length === 0) return [];

  const { data: progressRows } = await supabase
    .from("matura_lesson_progress")
    .select("lesson_id")
    .eq("user_id", userId)
    .in(
      "lesson_id",
      lessons.map((lesson) => lesson.id)
    );
  const completed = new Set(((progressRows ?? []) as Array<{ lesson_id: string }>).map((row) => row.lesson_id));

  return lessons.map((lesson) => ({ lesson, completed: completed.has(lesson.id) }));
}

export function groupLessonsByKind(lessons: LessonWithProgress[]): LessonGroup[] {
  return KIND_ORDER.map((kind) => ({
    kind,
    label: MATURA_LESSON_KIND_LABELS[kind],
    lessons: lessons.filter((item) => item.lesson.kind === kind),
  })).filter((group) => group.lessons.length > 0);
}

/** One lesson with its blocks, plus its neighbours for prev/next navigation. */
export interface LessonWithNeighbours {
  lesson: MaturaLesson;
  completed: boolean;
  previous: MaturaLessonSummary | null;
  next: MaturaLessonSummary | null;
}

export async function getLessonBySlug(
  supabase: SupabaseClient,
  userId: string,
  sectionId: string,
  slug: string
): Promise<LessonWithNeighbours | null> {
  const { data: lessonRow } = await supabase
    .from("matura_lessons")
    .select("*")
    .eq("section_id", sectionId)
    .eq("slug", slug)
    .maybeSingle();
  if (!lessonRow) return null;
  const lesson = lessonRow as MaturaLesson;

  const { data: siblingRows } = await supabase
    .from("matura_lessons")
    .select(SUMMARY_COLUMNS)
    .eq("section_id", sectionId)
    .order("order_index");
  const siblings = (siblingRows ?? []) as MaturaLessonSummary[];
  const index = siblings.findIndex((item) => item.id === lesson.id);

  const { data: progressRow } = await supabase
    .from("matura_lesson_progress")
    .select("lesson_id")
    .eq("user_id", userId)
    .eq("lesson_id", lesson.id)
    .maybeSingle();

  return {
    lesson,
    completed: Boolean(progressRow),
    previous: index > 0 ? siblings[index - 1] : null,
    next: index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : null,
  };
}
