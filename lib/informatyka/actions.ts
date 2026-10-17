"use server";

// ============================================================================
// lib/informatyka/actions.ts
// All Informatyka Server Actions (mutations). Reads live in
// lib/informatyka/{content,progress,settings}.ts. Failures are RETURNED as
// ActionResult, never thrown — see lib/action-result.ts.
// ============================================================================
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/get-profile";
import { actionFailure, type ActionResult } from "@/lib/action-result";

function revalidateAll() {
  revalidatePath("/informatyka");
  revalidatePath("/informatyka/arkusze", "layout");
  revalidatePath("/informatyka/typy", "layout");
}

/** Autosaved work fields (the student's written answer, Python code, SQL). */
export type WorkField = "answer_text" | "code" | "sql_text";
const WORK_FIELDS: WorkField[] = ["answer_text", "code", "sql_text"];

export async function saveWork(problemId: string, field: WorkField, value: string): Promise<ActionResult<void>> {
  if (!WORK_FIELDS.includes(field)) return actionFailure("Nieznane pole.");
  if (value.length > 200_000) return actionFailure("Tekst jest za długi.");
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .from("informatyka_progress")
    .upsert({ user_id: profile.id, problem_id: problemId, [field]: value }, { onConflict: "user_id,problem_id" });
  if (error) {
    console.error("[informatyka] saveWork failed:", error);
    return actionFailure("Nie udało się zapisać.");
  }
  return { ok: true, data: undefined };
}

/** Marks the problem done with the points the student awarded themselves
 * against the CKE scoring scheme (0…points_max). */
export async function completeProblem(problemId: string, score: number): Promise<ActionResult<void>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: problem } = await supabase
    .from("informatyka_problems")
    .select("points_max")
    .eq("id", problemId)
    .maybeSingle();
  if (!problem) return actionFailure("Nie znaleziono zadania.");
  const max = (problem as { points_max: number }).points_max;
  if (!Number.isInteger(score) || score < 0 || score > max) return actionFailure(`Punkty muszą być z zakresu 0–${max}.`);

  const { error } = await supabase.from("informatyka_progress").upsert(
    { user_id: profile.id, problem_id: problemId, status: "done", score, done_at: new Date().toISOString() },
    { onConflict: "user_id,problem_id" }
  );
  if (error) {
    console.error("[informatyka] completeProblem failed:", error);
    return actionFailure("Nie udało się zapisać postępu.");
  }
  revalidateAll();
  return { ok: true, data: undefined };
}

export async function reopenProblem(problemId: string): Promise<ActionResult<void>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .from("informatyka_progress")
    .upsert(
      { user_id: profile.id, problem_id: problemId, status: "todo", score: null, done_at: null },
      { onConflict: "user_id,problem_id" }
    );
  if (error) {
    console.error("[informatyka] reopenProblem failed:", error);
    return actionFailure("Nie udało się zapisać postępu.");
  }
  revalidateAll();
  return { ok: true, data: undefined };
}

/** Uploads a "data:image/png;base64,..." canvas snapshot to a deterministic
 * per-user path (one evolving drawing per problem). Called by the autosave
 * debounce in components/ink/ink-canvas.tsx. */
export async function saveCanvas(problemId: string, dataUrl: string): Promise<ActionResult<void>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const match = /^data:image\/png;base64,(.+)$/.exec(dataUrl);
  if (!match) return actionFailure("Nieprawidłowy format rysunku.");
  const path = `${profile.id}/${problemId}.png`;

  const { error: uploadError } = await supabase.storage
    .from("informatyka-canvas")
    .upload(path, Buffer.from(match[1], "base64"), { contentType: "image/png", upsert: true });
  if (uploadError) {
    console.error("[informatyka] canvas upload failed:", uploadError);
    return actionFailure("Nie udało się zapisać rysunku.");
  }

  const { error } = await supabase
    .from("informatyka_progress")
    .upsert({ user_id: profile.id, problem_id: problemId, canvas_path: path }, { onConflict: "user_id,problem_id" });
  if (error) {
    console.error("[informatyka] canvas upsert failed:", error);
    return actionFailure("Nie udało się zapisać rysunku.");
  }
  return { ok: true, data: undefined };
}

/** Stores the spreadsheet workbook snapshot (JSON) at a deterministic per-user path. */
export async function saveSheet(problemId: string, snapshotJson: string): Promise<ActionResult<void>> {
  if (snapshotJson.length > 12_000_000) return actionFailure("Arkusz jest za duży, by go zapisać.");
  const profile = await requireProfile();
  const supabase = await createClient();

  const path = `${profile.id}/${problemId}.json`;
  const { error: uploadError } = await supabase.storage
    .from("informatyka-sheets")
    .upload(path, Buffer.from(snapshotJson, "utf8"), { contentType: "application/json", upsert: true });
  if (uploadError) {
    console.error("[informatyka] sheet upload failed:", uploadError);
    return actionFailure("Nie udało się zapisać arkusza.");
  }

  const { error } = await supabase
    .from("informatyka_progress")
    .upsert({ user_id: profile.id, problem_id: problemId, sheet_path: path }, { onConflict: "user_id,problem_id" });
  if (error) {
    console.error("[informatyka] sheet upsert failed:", error);
    return actionFailure("Nie udało się zapisać arkusza.");
  }
  return { ok: true, data: undefined };
}

export async function setExamDate(examDate: string | null): Promise<ActionResult<void>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .from("informatyka_settings")
    .upsert({ user_id: profile.id, exam_date: examDate }, { onConflict: "user_id" });
  if (error) {
    console.error("[informatyka] setExamDate failed:", error);
    return actionFailure("Nie udało się zapisać daty matury.");
  }
  revalidatePath("/informatyka");
  revalidatePath("/informatyka/ustawienia");
  return { ok: true, data: undefined };
}
