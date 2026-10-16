"use server";

// ============================================================================
// lib/maturalnik/actions.ts
// All Maturalnik Server Actions (mutations). Reads live in
// lib/maturalnik/{content,progress,settings}.ts. Failures are RETURNED as
// ActionResult, never thrown — see lib/action-result.ts.
// ============================================================================
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth/get-profile";
import { actionFailure, type ActionResult } from "@/lib/action-result";

export async function toggleProblemDone(problemId: string, done: boolean): Promise<ActionResult<void>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase.from("maturalnik_progress").upsert(
    {
      user_id: profile.id,
      problem_id: problemId,
      done,
      done_at: done ? new Date().toISOString() : null,
    },
    { onConflict: "user_id,problem_id" }
  );
  if (error) {
    console.error("[maturalnik] toggleProblemDone failed:", error);
    return actionFailure("Nie udało się zapisać postępu.");
  }

  revalidatePath("/maturalnik");
  return { ok: true, data: undefined };
}

/** Uploads a "data:image/png;base64,..." canvas snapshot to a DETERMINISTIC
 * path (one evolving drawing per user+problem, not an append-only attempt
 * log — see 0028_maturalnik.sql comment on canvas_path) and
 * records it on the progress row. Called by the autosave debounce in
 * components/maturalnik/ink-canvas.tsx, so failures are logged, not
 * surfaced loudly — a dropped autosave shouldn't interrupt drawing. */
export async function autosaveCanvas(problemId: string, dataUrl: string): Promise<ActionResult<void>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const match = /^data:image\/png;base64,(.+)$/.exec(dataUrl);
  if (!match) return actionFailure("Nieprawidłowy format rysunku.");
  const buffer = Buffer.from(match[1], "base64");
  const path = `${profile.id}/${problemId}.png`;

  const { error: uploadError } = await supabase.storage
    .from("maturalnik-canvas")
    .upload(path, buffer, { contentType: "image/png", upsert: true });
  if (uploadError) {
    console.error("[maturalnik] canvas autosave upload failed:", uploadError);
    return actionFailure("Nie udało się zapisać rysunku.");
  }

  const { error: upsertError } = await supabase.from("maturalnik_progress").upsert(
    { user_id: profile.id, problem_id: problemId, canvas_path: path },
    { onConflict: "user_id,problem_id" }
  );
  if (upsertError) {
    console.error("[maturalnik] canvas autosave upsert failed:", upsertError);
    return actionFailure("Nie udało się zapisać rysunku.");
  }

  return { ok: true, data: undefined };
}

export async function setExamDate(examDate: string | null): Promise<ActionResult<void>> {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { error } = await supabase
    .from("maturalnik_settings")
    .upsert({ user_id: profile.id, exam_date: examDate }, { onConflict: "user_id" });
  if (error) {
    console.error("[maturalnik] setExamDate failed:", error);
    return actionFailure("Nie udało się zapisać daty matury.");
  }

  revalidatePath("/maturalnik");
  revalidatePath("/maturalnik/ustawienia");
  return { ok: true, data: undefined };
}
