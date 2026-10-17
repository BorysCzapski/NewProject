// ============================================================================
// lib/informatyka/content.ts
// Reads over the shared exam content (exams / tasks / problems / data files).
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  InformatykaDataFile,
  InformatykaExam,
  InformatykaKind,
  InformatykaProblem,
  InformatykaTask,
} from "@/lib/types/database";

/** A problem with just enough of its task/exam to list, group and link it. */
export interface ProblemSummary {
  id: string;
  label: string;
  order_index: number;
  points_max: number;
  kind: InformatykaKind;
  topic: string;
  task_number: number;
  task_part: 1 | 2 | null;
  task_title: string;
  exam: Pick<InformatykaExam, "id" | "slug" | "year" | "session" | "order_index">;
}

interface SummaryRow {
  id: string;
  label: string;
  order_index: number;
  points_max: number;
  kind: InformatykaKind;
  topic: string;
  informatyka_tasks: {
    number: number;
    part: 1 | 2 | null;
    title: string;
    informatyka_exams: ProblemSummary["exam"] | ProblemSummary["exam"][] | null;
  } | null;
}

const one = <T,>(v: T | T[] | null | undefined): T | null => (Array.isArray(v) ? (v[0] ?? null) : (v ?? null));

/** Every problem (≈240 rows) — drives all the aggregates, lists and filters. */
export async function getAllProblems(supabase: SupabaseClient): Promise<ProblemSummary[]> {
  const { data } = await supabase
    .from("informatyka_problems")
    .select(
      "id, label, order_index, points_max, kind, topic, informatyka_tasks(number, part, title, informatyka_exams(id, slug, year, session, order_index))"
    );
  const out: ProblemSummary[] = [];
  for (const row of (data ?? []) as unknown as SummaryRow[]) {
    const task = row.informatyka_tasks;
    const exam = one(task?.informatyka_exams);
    if (!task || !exam) continue;
    out.push({
      id: row.id,
      label: row.label,
      order_index: row.order_index,
      points_max: row.points_max,
      kind: row.kind,
      topic: row.topic,
      task_number: task.number,
      task_part: task.part,
      task_title: task.title,
      exam,
    });
  }
  // newest session first, then paper order
  return out.sort(
    (a, b) => a.exam.order_index - b.exam.order_index || a.task_number - b.task_number || a.order_index - b.order_index
  );
}

export async function getExams(supabase: SupabaseClient): Promise<InformatykaExam[]> {
  const { data } = await supabase.from("informatyka_exams").select("*").order("order_index");
  return (data ?? []) as InformatykaExam[];
}

export async function getExamBySlug(supabase: SupabaseClient, slug: string): Promise<InformatykaExam | null> {
  const { data } = await supabase.from("informatyka_exams").select("*").eq("slug", slug).maybeSingle();
  return (data as InformatykaExam | null) ?? null;
}

export interface ProblemDetail {
  problem: InformatykaProblem;
  task: InformatykaTask;
  exam: InformatykaExam;
}

export async function getProblemDetail(supabase: SupabaseClient, problemId: string): Promise<ProblemDetail | null> {
  const { data: problem } = await supabase.from("informatyka_problems").select("*").eq("id", problemId).maybeSingle();
  if (!problem) return null;
  const { data: task } = await supabase
    .from("informatyka_tasks")
    .select("*")
    .eq("id", (problem as InformatykaProblem).task_id)
    .maybeSingle();
  if (!task) return null;
  const { data: exam } = await supabase
    .from("informatyka_exams")
    .select("*")
    .eq("id", (task as InformatykaTask).exam_id)
    .maybeSingle();
  if (!exam) return null;
  return { problem: problem as InformatykaProblem, task: task as InformatykaTask, exam: exam as InformatykaExam };
}

/** Data files of one exam by name (content included) — only those the problem uses. */
export async function getDataFiles(
  supabase: SupabaseClient,
  examId: string,
  names: string[]
): Promise<InformatykaDataFile[]> {
  if (names.length === 0) return [];
  const { data } = await supabase
    .from("informatyka_data_files")
    .select("*")
    .eq("exam_id", examId)
    .in("name", names)
    .order("name");
  return (data ?? []) as InformatykaDataFile[];
}
