"use server";

// ============================================================================
// lib/matura/import-actions.ts
// ADMIN-ONLY Server Action for the arkusz PDF import pipeline
// (lib/matura/import-pdf.ts). Same ActionResult/requireAdmin conventions as
// lib/matma/import-actions.ts. Failures are RETURNED, never thrown
// (production redacts thrown Server Action errors).
// ============================================================================
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { importMaturaArkuszPdf, type MaturaPdfImportSummary } from "@/lib/matura/import-pdf";
import { MATURA_LEVELS } from "@/lib/matura/constants";
import type { MaturaLevel } from "@/lib/types/database";

function isMaturaLevel(v: string): v is MaturaLevel {
  return (MATURA_LEVELS as string[]).includes(v);
}

/** Imports środki-językowe/czytanie/pisanie tasks from an admin-uploaded
 * arkusz PDF (+ optional answer-key PDF for more reliable correctAnswers —
 * see lib/matura/import-pdf.ts). `formData` must contain a "level" field
 * and an "arkusz" file field; "klucz" and "note" are optional. */
export async function runMaturaPdfImport(formData: FormData): Promise<ActionResult<MaturaPdfImportSummary>> {
  const admin = await requireAdmin();
  const supabase = await createClient();

  const level = String(formData.get("level") ?? "");
  if (!isMaturaLevel(level)) return actionFailure("Wybierz poziom matury.");

  const arkusz = formData.get("arkusz");
  if (!(arkusz instanceof File) || arkusz.size === 0) {
    return actionFailure("Wybierz plik PDF z arkuszem.");
  }
  if (arkusz.type !== "application/pdf" && !arkusz.name.toLowerCase().endsWith(".pdf")) {
    return actionFailure("Arkusz musi być plikiem PDF.");
  }

  const klucz = formData.get("klucz");
  let kluczBuffer: Buffer | null = null;
  if (klucz instanceof File && klucz.size > 0) {
    if (klucz.type !== "application/pdf" && !klucz.name.toLowerCase().endsWith(".pdf")) {
      return actionFailure("Klucz odpowiedzi musi być plikiem PDF.");
    }
    kluczBuffer = Buffer.from(await klucz.arrayBuffer());
  }

  const note = String(formData.get("note") ?? "").trim() || null;
  const arkuszBuffer = Buffer.from(await arkusz.arrayBuffer());

  const summary = await importMaturaArkuszPdf(supabase, level, arkuszBuffer, arkusz.name, kluczBuffer, note, {
    createdBy: admin.id,
  });

  revalidatePath("/matura/admin/import");
  revalidatePath("/matura/nauka/srodki-jezykowe");
  revalidatePath("/matura/nauka/czytanie");
  revalidatePath("/matura/nauka/pisanie");

  return { ok: true, data: summary };
}
