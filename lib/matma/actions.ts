"use server";

// ============================================================================
// lib/matma/actions.ts
// All Matma Server Actions (mutations). Reads live in lib/matma/{content,
// progress,dashboard,admin-queries}.ts. Failures are RETURNED as
// ActionResult, never thrown — production Next.js redacts thrown Server
// Action error messages (see lib/action-result.ts) — except
// startMockExam(), which ends in redirect() and must be called from the
// client with unstable_rethrow(), same pattern as
// components/writing/new-task-form.tsx.
// ============================================================================
import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin, requireProfile } from "@/lib/auth/get-profile";
import { ACTIVITY_TYPES } from "@/lib/constants";
import { actionFailure, type ActionFailure, type ActionResult } from "@/lib/action-result";
import { getProblemById, getProblemsByIds, getTopics } from "@/lib/matma/content";
import {
  explainProblemDifferently,
  gradeProblemAttempt,
  isNumericOnlyCorrect,
} from "@/lib/matma/grading";
import { getTopicsWithProgress, markTopicReviewed, recomputeTopicProgress } from "@/lib/matma/progress";
import { computeEstimatedScore, writeProgressSnapshot } from "@/lib/matma/dashboard";
import { EXAM_TIME_LIMIT_SECONDS, EXAM_MAX_POINTS, aggregateExamBreakdown, generateMockExamProblemSet } from "@/lib/matma/mock-exam";
import { deriveWeekOutcomeStatus, generateStudyPlanWeeks } from "@/lib/matma/study-plan";
import type {
  MathAiFeedback,
  MathMockExam,
  MathMockExamDraftAnswer,
  MathProblem,
  MathProblemAttempt,
  MathStudyPlanWeek,
} from "@/lib/types/database";

// ----------------------------------------------------------------------------
// Practice: submit / hint
// ----------------------------------------------------------------------------

/** Uploads a "data:image/png;base64,..." ink-layer snapshot to the private
 * math-attempts bucket (see 0007_matma.sql storage policy: one folder per
 * user) and returns its storage PATH (not a public URL — the bucket is
 * private, callers must sign it for display, see getCanvasSignedUrl). */
async function uploadCanvasImage(supabase: SupabaseClient, userId: string, dataUrl: string): Promise<string | null> {
  const match = /^data:image\/(png|jpeg);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  try {
    const ext = match[1] === "jpeg" ? "jpg" : "png";
    const buffer = Buffer.from(match[2], "base64");
    const path = `${userId}/${randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("math-attempts")
      .upload(path, buffer, { contentType: `image/${match[1]}`, upsert: false });
    if (error) {
      console.error("[matma] canvas upload failed:", error);
      return null;
    }
    return path;
  } catch (err) {
    console.error("[matma] canvas upload failed:", err);
    return null;
  }
}

async function gradeAndInsertAttempt(
  supabase: SupabaseClient,
  userId: string,
  problem: MathProblem,
  input: { answerText: string | null; methodDescription: string | null; canvasImageDataUrl?: string | null },
  mockExamId: string | null
): Promise<MathProblemAttempt> {
  const trimmedAnswer = input.answerText?.trim() ?? "";
  const autoAccepted = problem.content.acceptedAnswers ?? [];
  let feedback: MathAiFeedback;

  const canAutoGrade =
    !problem.is_proof && !input.methodDescription && !input.canvasImageDataUrl && trimmedAnswer && autoAccepted.length > 0;

  if (canAutoGrade) {
    const correct = isNumericOnlyCorrect(trimmedAnswer, autoAccepted);
    feedback = {
      points_awarded: correct ? problem.points_max : 0,
      max_points: problem.points_max,
      step_breakdown: [
        {
          step: "Wynik końcowy",
          points_awarded: correct ? problem.points_max : 0,
          points_possible: problem.points_max,
          satisfied: correct,
          justification: correct
            ? "Wynik zgodny z kluczem odpowiedzi."
            : "Wynik niezgodny z kluczem odpowiedzi.",
        },
      ],
      improvement_tip: correct
        ? "Dobrze — przy prawdziwej maturze zapisuj też pełny tok rozwiązania: liczą się punkty cząstkowe za metodę, nie tylko wynik."
        : "Sprawdź obliczenia krok po kroku albo poproś o wskazówkę, jeśli utknąłeś/-aś.",
    };
  } else {
    const { data: priorAttempts } = await supabase
      .from("math_problem_attempts")
      .select("ai_feedback")
      .eq("user_id", userId)
      .eq("problem_id", problem.id)
      .order("attempted_at", { ascending: false })
      .limit(5);
    const previousImprovementTips = (priorAttempts ?? [])
      .map((a) => (a.ai_feedback as MathAiFeedback | null)?.improvement_tip)
      .filter((t): t is string => !!t);

    feedback = await gradeProblemAttempt({
      problem: {
        content: problem.content,
        gradingCriteria: problem.grading_criteria,
        pointsMax: problem.points_max,
        isProof: problem.is_proof,
      },
      answerText: input.answerText,
      methodDescription: input.methodDescription,
      canvasImageDataUrl: input.canvasImageDataUrl,
      previousImprovementTips,
    });
  }

  const canvasImagePath = input.canvasImageDataUrl
    ? await uploadCanvasImage(supabase, userId, input.canvasImageDataUrl)
    : null;

  const { data: inserted, error } = await supabase
    .from("math_problem_attempts")
    .insert({
      problem_id: problem.id,
      user_id: userId,
      answer_text: input.answerText,
      canvas_image_url: canvasImagePath,
      method_description: input.methodDescription,
      points_awarded: feedback.points_awarded,
      ai_feedback: feedback,
      mock_exam_id: mockExamId,
    })
    .select("*")
    .single();

  if (error || !inserted) {
    console.error("[matma] attempt insert failed:", error);
    throw new Error("Nie udało się zapisać próby rozwiązania.");
  }
  return inserted as MathProblemAttempt;
}

/** Submits a standalone practice/diagnostic/spaced-review attempt (not part
 * of a mock exam). `isSpacedReview` just stamps last_reviewed_at — the
 * mastery/status change itself falls out of the normal recompute below. */
export async function submitProblemAttempt(
  problemId: string,
  input: { answerText: string | null; methodDescription: string | null; canvasImageDataUrl?: string | null },
  isSpacedReview = false
): Promise<ActionResult<MathProblemAttempt>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const problem = await getProblemById(supabase, problemId);
  if (!problem) return actionFailure("Nie znaleziono zadania.");

  if (!input.answerText?.trim() && !input.methodDescription?.trim() && !input.canvasImageDataUrl) {
    return actionFailure("Wpisz odpowiedź albo opisz swoją metodę przed wysłaniem.");
  }

  let attempt: MathProblemAttempt;
  try {
    attempt = await gradeAndInsertAttempt(supabase, profile.id, problem, input, null);
  } catch (err) {
    console.error("[matma] submitProblemAttempt failed:", err);
    return actionFailure("Nie udało się ocenić rozwiązania. Spróbuj ponownie za chwilę.");
  }

  await Promise.all([
    recomputeTopicProgress(supabase, profile.id, problem.topic_id),
    supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.MATH }),
    isSpacedReview ? markTopicReviewed(supabase, profile.id, problem.topic_id) : Promise.resolve(),
  ]);

  revalidatePath("/matma");
  revalidatePath("/matma/nauka");
  return { ok: true, data: attempt };
}

/** Marks a topic as diagnosed after the student has solved its diagnostic
 * problem set (each already scored via submitProblemAttempt above). */
export async function finalizeDiagnostic(topicId: string): Promise<ActionResult<void>> {
  const profile = await requireProfile();
  const supabase = await createClient();
  await recomputeTopicProgress(supabase, profile.id, topicId, { diagnosed: true });
  revalidatePath("/matma");
  return { ok: true, data: undefined };
}

/** Safe default when the student skips diagnosis entirely: every topic
 * starts explicitly "new" (never assume a level without evidence). */
export async function skipDiagnostic(): Promise<ActionResult<void>> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const topics = await getTopics(supabase);
  if (topics.length === 0) return { ok: true, data: undefined };

  const { error } = await supabase.from("math_topic_progress").upsert(
    topics.map((t) => ({ user_id: profile.id, topic_id: t.id, status: "new" as const, mastery_score: 0 })),
    { onConflict: "user_id,topic_id", ignoreDuplicates: true }
  );
  if (error) {
    console.error("[matma] skipDiagnostic failed:", error);
    return actionFailure("Nie udało się zapisać. Spróbuj ponownie.");
  }
  revalidatePath("/matma");
  return { ok: true, data: undefined };
}

export async function requestProblemHint(problemId: string): Promise<ActionResult<string>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const problem = await getProblemById(supabase, problemId);
  if (!problem) return actionFailure("Nie znaleziono zadania.");

  const { data: priorAttempts } = await supabase
    .from("math_problem_attempts")
    .select("ai_feedback")
    .eq("user_id", profile.id)
    .eq("problem_id", problemId)
    .order("attempted_at", { ascending: false })
    .limit(5);
  const previousHints = (priorAttempts ?? [])
    .map((a) => (a.ai_feedback as MathAiFeedback | null)?.improvement_tip)
    .filter((t): t is string => !!t);

  try {
    const hint = await explainProblemDifferently({
      problemStatement: problem.content.statement,
      previousHints,
    });
    return { ok: true, data: hint };
  } catch (err) {
    console.error("[matma] requestProblemHint failed:", err);
    return actionFailure("Nie udało się przygotować wskazówki. Spróbuj ponownie za chwilę.");
  }
}

export async function recordLessonActivity(): Promise<ActionResult<void>> {
  await requireProfile();
  const supabase = await createClient();
  await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.MATH });
  return { ok: true, data: undefined };
}

// ----------------------------------------------------------------------------
// Mock exam (180 min / 50 pts)
// ----------------------------------------------------------------------------

/** Starts a new exam and redirects to it. Failures are RETURNED — callers
 * must wrap this in try/catch + unstable_rethrow() (see new-task-form.tsx
 * for the reference pattern), since a successful call throws internally. */
export async function startMockExam(): Promise<ActionFailure> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { problemIds } = await generateMockExamProblemSet(supabase);
  if (problemIds.length === 0) {
    return actionFailure("Bank zadań jest jeszcze pusty — nie można wygenerować egzaminu próbnego.");
  }

  const { data: exam, error } = await supabase
    .from("math_mock_exams")
    .insert({
      user_id: profile.id,
      problem_ids: problemIds,
      time_limit_seconds: EXAM_TIME_LIMIT_SECONDS,
      max_points: EXAM_MAX_POINTS,
      status: "in_progress",
    })
    .select("id")
    .single();

  if (error || !exam) {
    console.error("[matma] startMockExam failed:", error);
    return actionFailure("Nie udało się przygotować egzaminu. Spróbuj ponownie za chwilę.");
  }

  redirect(`/matma/egzamin/${exam.id}`);
}

export async function saveMockExamDraftAnswer(
  examId: string,
  problemId: string,
  draft: { answerText: string | null; methodDescription: string | null; canvasImageDataUrl: string | null }
): Promise<ActionResult<void>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: exam } = await supabase
    .from("math_mock_exams")
    .select("id, user_id, status, draft_answers")
    .eq("id", examId)
    .maybeSingle();
  if (!exam || exam.user_id !== profile.id) return actionFailure("Nie znaleziono egzaminu.");
  if (exam.status !== "in_progress") return actionFailure("Ten egzamin jest już zakończony.");

  const draftAnswers = { ...(exam.draft_answers as Record<string, MathMockExamDraftAnswer>) };
  draftAnswers[problemId] = {
    answerText: draft.answerText,
    methodDescription: draft.methodDescription,
    canvasImageDataUrl: draft.canvasImageDataUrl,
    savedAt: new Date().toISOString(),
  };

  const { error } = await supabase.from("math_mock_exams").update({ draft_answers: draftAnswers }).eq("id", examId);
  if (error) {
    console.error("[matma] saveMockExamDraftAnswer failed:", error);
    return actionFailure("Nie udało się zapisać odpowiedzi.");
  }
  return { ok: true, data: undefined };
}

export async function abandonMockExam(examId: string): Promise<ActionResult<void>> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase
    .from("math_mock_exams")
    .update({ status: "abandoned", finished_at: new Date().toISOString() })
    .eq("id", examId)
    .eq("user_id", profile.id)
    .eq("status", "in_progress");
  if (error) return actionFailure("Nie udało się przerwać egzaminu.");
  revalidatePath("/matma/egzamin");
  return { ok: true, data: undefined };
}

/** Grades every answered (or blank) problem, aggregates the per-topic
 * breakdown, and closes out the exam — called either by the student
 * ("Zakończ i sprawdź") or automatically by the client timer at 00:00. */
export async function finishMockExam(examId: string): Promise<ActionResult<MathMockExam>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: exam } = await supabase.from("math_mock_exams").select("*").eq("id", examId).maybeSingle();
  if (!exam || exam.user_id !== profile.id) return actionFailure("Nie znaleziono egzaminu.");
  if (exam.status !== "in_progress") return actionFailure("Ten egzamin jest już zakończony.");

  const problemIds = exam.problem_ids as string[];
  const problems = await getProblemsByIds(supabase, problemIds);
  const draftAnswers = exam.draft_answers as Record<string, MathMockExamDraftAnswer>;
  const topics = await getTopics(supabase);
  const topicTitleById = new Map(topics.map((t) => [t.id, t.title]));

  let graded;
  try {
    graded = await Promise.all(
      problems.map(async (problem) => {
        const draft = draftAnswers[problem.id];
        const attempt = await gradeAndInsertAttempt(
          supabase,
          profile.id,
          problem,
          {
            answerText: draft?.answerText ?? null,
            methodDescription: draft?.methodDescription ?? null,
            canvasImageDataUrl: draft?.canvasImageDataUrl ?? null,
          },
          examId
        );
        return {
          topicId: problem.topic_id,
          topicTitle: topicTitleById.get(problem.topic_id) ?? "?",
          pointsAwarded: attempt.points_awarded ?? 0,
          pointsMax: problem.points_max,
        };
      })
    );
  } catch (err) {
    console.error("[matma] finishMockExam grading failed:", err);
    return actionFailure("Nie udało się ocenić egzaminu. Spróbuj ponownie za chwilę.");
  }

  const breakdown = aggregateExamBreakdown(graded);
  const totalPoints = graded.reduce((sum, g) => sum + g.pointsAwarded, 0);

  const { data: updated, error } = await supabase
    .from("math_mock_exams")
    .update({
      status: "completed",
      finished_at: new Date().toISOString(),
      total_points: totalPoints,
      breakdown,
      draft_answers: {},
    })
    .eq("id", examId)
    .select("*")
    .single();

  if (error || !updated) {
    console.error("[matma] finishMockExam update failed:", error);
    return actionFailure("Ocena policzona, ale nie udało się zapisać wyniku egzaminu.");
  }

  const affectedTopicIds = [...new Set(problems.map((p) => p.topic_id))];
  await Promise.all(affectedTopicIds.map((topicId) => recomputeTopicProgress(supabase, profile.id, topicId)));

  const topicsWithProgress = await getTopicsWithProgress(supabase, profile.id);
  await writeProgressSnapshot(supabase, profile.id, topicsWithProgress);
  await supabase.rpc("record_activity", { p_type: ACTIVITY_TYPES.MATH });

  revalidatePath("/matma");
  revalidatePath(`/matma/egzamin/${examId}`);
  return { ok: true, data: updated as MathMockExam };
}

// ----------------------------------------------------------------------------
// Study plan
// ----------------------------------------------------------------------------

async function insertPlanWeeks(
  supabase: SupabaseClient,
  planId: string,
  weeks: ReturnType<typeof generateStudyPlanWeeks>,
  startIndex: number
) {
  if (weeks.length === 0) return;
  await supabase.from("math_study_plan_weeks").insert(
    weeks.map((w) => ({
      plan_id: planId,
      week_index: startIndex + w.weekIndex,
      target_start_date: w.targetStartDate,
      target_end_date: w.targetEndDate,
      topic_ids: w.topicIds,
      is_review_week: w.isReviewWeek,
      status: "upcoming" as const,
    }))
  );
}

/** Creates or replaces the study plan. `examDate: null` switches the timed
 * schedule off entirely (the untimed learning path keeps working). */
export async function generateOrUpdateStudyPlan(
  examDate: string | null,
  weeklyHoursTarget: number | null
): Promise<ActionResult<void>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: existingPlan } = await supabase
    .from("math_study_plans")
    .select("id")
    .eq("user_id", profile.id)
    .maybeSingle();

  if (!examDate) {
    if (existingPlan) await supabase.from("math_study_plans").delete().eq("id", existingPlan.id);
    revalidatePath("/matma/plan");
    return { ok: true, data: undefined };
  }

  const { data: plan, error } = await supabase
    .from("math_study_plans")
    .upsert(
      {
        id: existingPlan?.id ?? randomUUID(),
        user_id: profile.id,
        exam_date: examDate,
        weekly_hours_target: weeklyHoursTarget,
        generated_at: new Date().toISOString(),
        last_recomputed_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select("id")
    .single();
  if (error || !plan) {
    console.error("[matma] generateOrUpdateStudyPlan upsert failed:", error);
    return actionFailure("Nie udało się zapisać planu.");
  }

  await supabase.from("math_study_plan_weeks").delete().eq("plan_id", plan.id);

  const topicsWithProgress = await getTopicsWithProgress(supabase, profile.id);
  const weeks = generateStudyPlanWeeks({
    examDate: new Date(examDate),
    today: new Date(),
    topics: topicsWithProgress.map((t) => ({ id: t.id, masteryScore: t.masteryScore, orderIndex: t.order_index })),
  });
  await insertPlanWeeks(supabase, plan.id, weeks, 0);

  revalidatePath("/matma/plan");
  revalidatePath("/matma");
  return { ok: true, data: undefined };
}

/** Adaptive recompute: closes out weeks whose end date has passed (based on
 * whether their topics actually got mastered), then regenerates every
 * FUTURE week from current mastery — so falling behind or running ahead of
 * the original plan both self-correct instead of leaving a stale schedule. */
export async function recomputeStudyPlan(): Promise<ActionResult<void>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: plan } = await supabase
    .from("math_study_plans")
    .select("*")
    .eq("user_id", profile.id)
    .maybeSingle();
  if (!plan || !plan.exam_date) return { ok: true, data: undefined }; // no timed plan active

  const { data: weekRows } = await supabase
    .from("math_study_plan_weeks")
    .select("*")
    .eq("plan_id", plan.id)
    .order("week_index");
  const weeks = (weekRows ?? []) as MathStudyPlanWeek[];

  const topicsWithProgress = await getTopicsWithProgress(supabase, profile.id);
  const masteryByTopic = new Map(topicsWithProgress.map((t) => [t.id, t.masteryScore]));
  const today = new Date().toISOString().slice(0, 10);

  const pastWeeks = weeks.filter((w) => w.target_end_date < today);
  const futureWeeks = weeks.filter((w) => w.target_end_date >= today);

  await Promise.all(
    pastWeeks
      .filter((w) => w.status === "upcoming" || w.status === "in_progress")
      .map((w) =>
        supabase
          .from("math_study_plan_weeks")
          .update({ status: deriveWeekOutcomeStatus(w.topic_ids, masteryByTopic) })
          .eq("id", w.id)
      )
  );

  const examDate = new Date(plan.exam_date);
  if (examDate.getTime() > Date.now() && futureWeeks.length > 0) {
    await supabase
      .from("math_study_plan_weeks")
      .delete()
      .eq("plan_id", plan.id)
      .in("id", futureWeeks.map((w) => w.id));

    const regenerated = generateStudyPlanWeeks({
      examDate,
      today: new Date(),
      topics: topicsWithProgress.map((t) => ({ id: t.id, masteryScore: t.masteryScore, orderIndex: t.order_index })),
    });
    const startIndex = pastWeeks.length;
    await insertPlanWeeks(supabase, plan.id, regenerated, startIndex);
  }

  await supabase.from("math_study_plans").update({ last_recomputed_at: new Date().toISOString() }).eq("id", plan.id);
  revalidatePath("/matma/plan");
  return { ok: true, data: undefined };
}

export async function dismissAssignedPractice(id: string): Promise<ActionResult<void>> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const { error } = await supabase
    .from("math_assigned_practice")
    .update({ dismissed_at: new Date().toISOString() })
    .eq("id", id)
    .eq("student_id", profile.id);
  if (error) return actionFailure("Nie udało się odznaczyć.");
  revalidatePath("/matma");
  return { ok: true, data: undefined };
}

// ----------------------------------------------------------------------------
// Admin
// ----------------------------------------------------------------------------

export async function adminUpdateExamWeight(topicId: string, examWeight: number): Promise<ActionResult<void>> {
  await requireAdmin();
  if (!Number.isFinite(examWeight) || examWeight < 0 || examWeight > 1) {
    return actionFailure("Waga musi być liczbą od 0 do 1.");
  }
  const supabase = await createClient();
  const { error } = await supabase.from("math_topics").update({ exam_weight: examWeight }).eq("id", topicId);
  if (error) return actionFailure("Nie udało się zapisać wagi działu.");
  revalidatePath("/matma/admin");
  return { ok: true, data: undefined };
}

export async function adminAssignTopicPractice(
  studentId: string,
  topicId: string,
  note?: string
): Promise<ActionResult<void>> {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("math_assigned_practice").insert({
    student_id: studentId,
    topic_id: topicId,
    assigned_by: admin.id,
    note: note?.trim() || null,
  });
  if (error) {
    console.error("[matma] adminAssignTopicPractice failed:", error);
    return actionFailure("Nie udało się przypisać ćwiczenia.");
  }
  revalidatePath("/matma/admin");
  return { ok: true, data: undefined };
}

/** Manual correction of an AI-graded attempt (spec: "przegląd/korekta ocen
 * AI dla zadań otwartych i dowodów"). Recomputes that topic's mastery too,
 * since a correction changes the student's real standing. */
export async function adminCorrectAttemptGrade(
  attemptId: string,
  pointsAwarded: number,
  correctionNote: string
): Promise<ActionResult<void>> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: attempt } = await supabase
    .from("math_problem_attempts")
    .select("*, math_problems(topic_id, points_max)")
    .eq("id", attemptId)
    .maybeSingle();
  if (!attempt) return actionFailure("Nie znaleziono próby.");

  const problem = (attempt as unknown as { math_problems: { topic_id: string; points_max: number } }).math_problems;
  if (pointsAwarded < 0 || pointsAwarded > problem.points_max) {
    return actionFailure(`Liczba punktów musi być od 0 do ${problem.points_max}.`);
  }

  const priorFeedback = attempt.ai_feedback as MathAiFeedback | null;
  const correctedFeedback: MathAiFeedback = {
    points_awarded: pointsAwarded,
    max_points: problem.points_max,
    step_breakdown: priorFeedback?.step_breakdown ?? [],
    improvement_tip: correctionNote.trim() || priorFeedback?.improvement_tip || "Ocena skorygowana przez nauczyciela.",
  };

  const { error } = await supabase
    .from("math_problem_attempts")
    .update({ points_awarded: pointsAwarded, ai_feedback: correctedFeedback })
    .eq("id", attemptId);
  if (error) return actionFailure("Nie udało się zapisać korekty.");

  await recomputeTopicProgress(supabase, attempt.user_id, problem.topic_id);
  revalidatePath("/matma/admin");
  return { ok: true, data: undefined };
}

export interface DashboardEstimate {
  points: number;
  percent: number;
}

/** Convenience wrapper so client code can trigger a fresh estimate without
 * importing server-only computeEstimatedScore directly. */
export async function getMyEstimatedScore(): Promise<ActionResult<DashboardEstimate>> {
  const profile = await requireProfile();
  const supabase = await createClient();
  const topics = await getTopicsWithProgress(supabase, profile.id);
  return { ok: true, data: computeEstimatedScore(topics) };
}
