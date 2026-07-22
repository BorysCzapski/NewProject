// ============================================================================
// app/(main)/matma/egzamin/[examId]/page.tsx
// Single exam screen: the live timed runner while in_progress, results once
// completed/abandoned. `params` is a Promise per Next.js 16.
// ============================================================================
import { notFound } from "next/navigation";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { getProblemsByIds } from "@/lib/matma/content";
import { ExamRunner } from "@/components/matma/exam/exam-runner";
import { ExamResults } from "@/components/matma/exam/exam-results";
import type { MathMockExam } from "@/lib/types/database";

export default async function ExamDetailPage({
  params,
}: {
  params: Promise<{ examId: string }>;
}) {
  const { examId } = await params;
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data } = await supabase.from("math_mock_exams").select("*").eq("id", examId).maybeSingle();
  const exam = data as MathMockExam | null;
  if (!exam || exam.user_id !== profile.id) notFound();

  if (exam.status !== "in_progress") {
    return <ExamResults exam={exam} />;
  }

  const problems = await getProblemsByIds(supabase, exam.problem_ids);
  return <ExamRunner exam={exam} problems={problems} />;
}
