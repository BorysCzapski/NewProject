// ============================================================================
// lib/maturalnik/solutions.ts
// Lazy AI-generated worked solutions. The source notebook has NO solutions —
// generated on first "pokaż rozwiązanie" click, cached on the problem row.
// The write goes through the service-role client (lib/supabase/admin.ts)
// because maturalnik_problems is shared content with an admin-write RLS
// policy (0028_maturalnik.sql) — a regular student can't UPDATE it directly,
// and widening that policy would let anyone vandalize a shared solution.
// Always show the UI disclaimer alongside the result — see
// components/maturalnik/solution-panel.tsx.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { askAIForJSONWithImage } from "@/lib/ai";
import { createAdminClient } from "@/lib/supabase/admin";
import type { MaturalnikAiSolution, MaturalnikProblem } from "@/lib/types/database";

const SYSTEM_PROMPT =
  "Jesteś nauczycielem matematyki przygotowującym uczniów do matury rozszerzonej w Polsce. " +
  "Na zdjęciu widzisz zadanie maturalne. Podaj pełne, poprawne rozwiązanie krok po kroku, po " +
  "polsku, z jasno zaznaczonym wynikiem końcowym. Pisz zwięźle, bez zbędnego wstępu. Zapisuj " +
  "wzory matematyczne w LaTeX pomiędzy znakami $ (inline) albo $$ (blok).";

async function downloadImageAsDataUrl(supabase: SupabaseClient, imagePath: string): Promise<string> {
  const { data, error } = await supabase.storage.from("maturalnik-problems").download(imagePath);
  if (error || !data) throw new Error(`Nie udało się pobrać obrazka zadania: ${error?.message}`);
  const buffer = Buffer.from(await data.arrayBuffer());
  return `data:image/jpeg;base64,${buffer.toString("base64")}`;
}

/** Generates (if missing) and returns the cached AI solution for a problem.
 * `supabase` is the caller's own authenticated client — fine for the storage
 * read (maturalnik-problems is any-authenticated-read), the cache WRITE uses
 * its own service-role client regardless of who's asking. */
export async function getOrGenerateSolution(
  supabase: SupabaseClient,
  problem: MaturalnikProblem
): Promise<MaturalnikAiSolution> {
  if (problem.ai_solution) return problem.ai_solution;

  const imageUrl = await downloadImageAsDataUrl(supabase, problem.image_path);
  const result = await askAIForJSONWithImage<{ solutionText: string }>({
    system: SYSTEM_PROMPT,
    prompt: "Rozwiąż zadanie maturalne widoczne na zdjęciu.",
    imageUrl,
    schema: {
      solutionText: {
        type: "string",
        description: "Pełne rozwiązanie krok po kroku, po polsku, w Markdown/LaTeX.",
      },
    },
    maxTokens: 2048,
  });

  const solution: MaturalnikAiSolution = {
    solutionText: result.solutionText,
    model: "groq-vision",
    generatedAt: new Date().toISOString(),
  };

  const admin = createAdminClient();
  const { error } = await admin.from("maturalnik_problems").update({ ai_solution: solution }).eq("id", problem.id);
  if (error) console.error("[maturalnik] failed to cache ai_solution:", error);

  return solution;
}
