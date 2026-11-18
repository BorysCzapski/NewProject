// ============================================================================
// app/api/writing/hints/route.ts
// POST { taskId }: "Przydatne słówka" do zadania pisemnego w Linguo.
// Kontrakt jak w /api/reading/translate: zawsze JSON `{ ok, data }` albo
// `{ ok: false, error, retryable }`; brak sesji to 401, nie przekierowanie.
// Zadanie czytamy przez Supabase z sesją użytkownika (RLS), więc nie da się
// zamówić podpowiedzi do cudzego zadania.
// ============================================================================
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isTransientError } from "@/lib/reading/translate-core";
import { generateWritingHints } from "@/lib/writing/hints";

export const dynamic = "force-dynamic";
/** Trzy próby po maks. 9 s + przerwy mieszczą się w 30 s. */
export const maxDuration = 30;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function fail(error: string, status: number, retryable = false) {
  return NextResponse.json({ ok: false, error, retryable }, { status });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  let user = null;
  try {
    ({
      data: { user },
    } = await supabase.auth.getUser());
  } catch {
    return fail("Nie udało się sprawdzić sesji. Spróbuj ponownie.", 503, true);
  }
  if (!user) return fail("Sesja wygasła — zaloguj się ponownie.", 401);

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return fail("Nieprawidłowe żądanie.", 400);
  }

  const taskId = String(body.taskId ?? "");
  if (!UUID.test(taskId)) return fail("Nie rozpoznano zadania.", 400);

  const { data: task, error: taskError } = await supabase
    .from("writing_tasks")
    .select("language, level, scenario, min_words, max_words")
    .eq("id", taskId)
    .maybeSingle();
  if (taskError) {
    console.error("[writing] hints: task lookup failed:", taskError);
    return fail("Nie udało się wczytać zadania. Spróbuj ponownie.", 503, true);
  }
  if (!task) return fail("Nie znaleziono zadania.", 404);

  try {
    const data = await generateWritingHints(task);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    console.error("[writing] hints failed:", error);
    const retryable = isTransientError(error);
    return fail("Nie udało się pobrać słówek. Spróbuj ponownie.", retryable ? 503 : 500, retryable);
  }
}
