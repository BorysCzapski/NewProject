"use server";

// ============================================================================
// lib/matma/import-actions.ts
// ADMIN-ONLY Server Actions for the past-exam import pipeline
// (lib/matma/import-past-exams.ts). Kept OUT of lib/matma/actions.ts (owned
// by another workstream) — same ActionResult/requireAdmin conventions as
// that file, see its header comment. Failures are RETURNED, never thrown
// (production redacts thrown Server Action errors).
// ============================================================================
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { discoverPastExamArkusze, importArkusz, type ArkuszImportSummary } from "@/lib/matma/import-past-exams";
import { importMatemaksDzial, type MatemaksImportSummary } from "@/lib/matma/import-curated-matemaks";
import type {
  MathGradingCriterion,
  MathPastExamMetadata,
  MathProblem,
  MathProblemContent,
} from "@/lib/types/database";

/** Discovers every arkusz CKE currently publishes in [yearFrom, yearTo]
 * (default: full 2007-today range) and imports each one, never letting a
 * single bad arkusz fail the whole batch — see importArkusz's own
 * try/catch-into-summary.errors behavior. WARNING: slow (downloads +
 * parses multiple PDFs and makes one LLM call per arkusz) — callers must
 * show a loading state, not assume a fast response.
 * `force: true` re-imports years that already have rows (deleting the old
 * ones first) instead of skipping them — use this to fix years imported
 * before a bug fix (e.g. the truncated-arkusz bug), not for routine runs. */
export async function runPastExamImport(
  yearFrom?: number,
  yearTo?: number,
  force?: boolean
): Promise<ActionResult<ArkuszImportSummary[]>> {
  const admin = await requireAdmin();
  const supabase = await createClient();

  let descriptors;
  try {
    descriptors = await discoverPastExamArkusze({ yearFrom, yearTo });
  } catch (err) {
    console.error("[matma] runPastExamImport discovery failed:", err);
    return actionFailure("Nie udało się przeszukać archiwum CKE. Spróbuj ponownie za chwilę.");
  }

  if (descriptors.length === 0) {
    return actionFailure("Nie znaleziono żadnych arkuszy CKE dla podanego zakresu lat.");
  }

  const summaries: ArkuszImportSummary[] = [];
  for (const descriptor of descriptors) {
    try {
      summaries.push(await importArkusz(supabase, descriptor, { createdBy: admin.id, force }));
    } catch (err) {
      // importArkusz already catches its own internal errors — this is a
      // last-resort guard so one truly unexpected throw still can't abort
      // the rest of the batch.
      console.error(
        `[matma] importArkusz threw unexpectedly for ${descriptor.year}/${descriptor.session}/${descriptor.formula}:`,
        err
      );
      summaries.push({
        year: descriptor.year,
        session: descriptor.session,
        formula: descriptor.formula,
        problemsFound: 0,
        problemsInserted: 0,
        errors: [`Nieoczekiwany błąd importu: ${err instanceof Error ? err.message : String(err)}`],
      });
    }
  }

  revalidatePath("/matma/admin/import");
  revalidatePath("/matma/admin");
  return { ok: true, data: summaries };
}

export interface AdminUpsertProblemInput {
  /** Present -> update that row; absent -> insert a new one. */
  id?: string;
  topic_id: string;
  content: MathProblemContent;
  difficulty: 1 | 2 | 3;
  is_proof: boolean;
  points_max: number;
  grading_criteria: MathGradingCriterion[];
  source_metadata: MathPastExamMetadata;
}

/** Manual add/correct for a past-exam problem the automated import parsed
 * badly or skipped entirely (image-heavy geometry, malformed AI output,
 * unrecognized topic, etc — see importArkusz's per-problem validation).
 * Always writes source='past_exam' with full attribution metadata, since
 * that is this module's whole purpose (CKE arkusze require citing the
 * source). Enforces the same grading_criteria-sums-to-points_max rule the
 * automated importer does, so manual corrections can't silently violate it. */
export async function adminUpsertProblem(input: AdminUpsertProblemInput): Promise<ActionResult<MathProblem>> {
  const admin = await requireAdmin();

  if (!input.topic_id) return actionFailure("Wybierz dział.");
  if (!input.content?.statement?.trim()) return actionFailure("Treść zadania jest wymagana.");
  if (![1, 2, 3].includes(input.difficulty)) return actionFailure("Poziom trudności musi być 1, 2 lub 3.");
  if (!Number.isFinite(input.points_max) || input.points_max <= 0) {
    return actionFailure("Maksymalna liczba punktów musi być dodatnią liczbą.");
  }
  const criteriaSum = (input.grading_criteria ?? []).reduce((sum, c) => sum + (c.points || 0), 0);
  if (criteriaSum !== input.points_max) {
    return actionFailure(`Kryteria oceniania sumują się do ${criteriaSum} pkt, a powinny do ${input.points_max} pkt.`);
  }
  const meta = input.source_metadata;
  if (!meta?.year || !meta.session?.trim() || !meta.formula?.trim() || !meta.source_url?.trim()) {
    return actionFailure("Rok, sesja, formuła i adres źródłowy (source_url) arkusza są wymagane dla zadań z matury.");
  }

  const supabase = await createClient();
  const row = {
    topic_id: input.topic_id,
    content: input.content,
    difficulty: input.difficulty,
    is_proof: input.is_proof,
    points_max: input.points_max,
    source: "past_exam" as const,
    grading_criteria: input.grading_criteria,
    source_metadata: meta,
    created_by: admin.id,
  };

  const { data, error } = input.id
    ? await supabase.from("math_problems").update(row).eq("id", input.id).select("*").single()
    : await supabase.from("math_problems").insert(row).select("*").single();

  if (error || !data) {
    console.error("[matma] adminUpsertProblem failed:", error);
    return actionFailure("Nie udało się zapisać zadania.");
  }

  revalidatePath("/matma/admin/import");
  revalidatePath("/matma/admin");
  return { ok: true, data: data as MathProblem };
}

/** Imports curated problems from matemaks.pl for ONE dział (department) —
 * chunked per dział for the same reason runPastExamImport is chunked per
 * year: crawling+structuring a whole department can take a while, so one
 * Server Action call per dział keeps each call short and lets the UI show
 * per-dział progress. `dzialSlug`/`startSlug` default to the built-in seed
 * list (MATEMAKS_DZIAL_SEEDS) when omitted, but can be overridden — the
 * seeds beyond "elementy-analizy-matematycznej" are informed guesses, not
 * confirmed URLs (see import-curated-matemaks.ts header comment), so an
 * admin who finds the real slug for a dział that came back empty should
 * pass it here directly. */
export async function runMatemaksDzialImport(
  dzialSlug: string,
  startSlug: string
): Promise<ActionResult<MatemaksImportSummary>> {
  const admin = await requireAdmin();
  const supabase = await createClient();

  try {
    const summary = await importMatemaksDzial(supabase, dzialSlug, startSlug, { createdBy: admin.id });
    revalidatePath("/matma/admin/import");
    revalidatePath("/matma/admin");
    return { ok: true, data: summary };
  } catch (err) {
    console.error(`[matma] runMatemaksDzialImport failed for ${dzialSlug}:`, err);
    return actionFailure(`Import działu "${dzialSlug}" nie powiódł się: ${err instanceof Error ? err.message : String(err)}`);
  }
}
