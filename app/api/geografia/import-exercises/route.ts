// ============================================================================
// app/api/geografia/import-exercises/route.ts
// Uploads a worksheet PDF: stores the original in the private
// 'geografia-uploads' bucket (own folder — needed later for annotations),
// records a geo_files row, then extracts exercises via AI and inserts them
// as SHARED library content (source='uploaded', needs_review=true). A Route
// Handler, not a Server Action, for the same reason as Podręcznik's import:
// a multi-MB PDF is over the default Server Action body cap.
//
// Auth is checked manually (not requireProfile(), which redirects — wrong
// for a JSON-returning fetch() endpoint).
// ============================================================================
import { randomUUID } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { createClient } from "@/lib/supabase/server";
import { splitIntoImportChunks } from "@/lib/schola/pdf-chunking";
import { extractExercisesFromChunk } from "@/lib/geografia/extract";
import type { GeoTopic } from "@/lib/types/database";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Same ~4.5MB Vercel serverless request-body ceiling as Podręcznik/Schola.
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_IMPORT_CHUNKS = 8;

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Musisz być zalogowany." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Nieprawidłowe żądanie." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "Nie przesłano pliku." }, { status: 400 });
  }
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return NextResponse.json(
      { ok: false, error: "Obecnie obsługujemy tylko pliki PDF (Docx w przygotowaniu)." },
      { status: 400 }
    );
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Plik jest za duży (maksymalnie ok. 4 MB). Prześlij np. jeden arkusz naraz." },
      { status: 413 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const storagePath = `${user.id}/${randomUUID()}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("geografia-uploads")
    .upload(storagePath, buffer, { contentType: "application/pdf", upsert: false });
  if (uploadError) {
    console.error("[geografia] storage upload failed:", uploadError);
    return NextResponse.json({ ok: false, error: "Nie udało się zapisać pliku." }, { status: 500 });
  }

  const title = file.name.replace(/\.pdf$/i, "").trim() || "Arkusz ćwiczeń";
  const { data: fileRow, error: fileError } = await supabase
    .from("geo_files")
    .insert({
      user_id: user.id,
      title,
      mime_type: "application/pdf",
      size_bytes: file.size,
      storage_path: storagePath,
      status: "processing",
    })
    .select("id")
    .single();
  if (fileError || !fileRow) {
    console.error("[geografia] file row insert failed:", fileError);
    return NextResponse.json({ ok: false, error: "Nie udało się zapisać pliku." }, { status: 500 });
  }
  const fileId = fileRow.id as string;

  const markFailed = async (message: string) => {
    await supabase.from("geo_files").update({ status: "failed", error_message: message }).eq("id", fileId);
  };

  let text: string;
  try {
    const parsed = await pdfParse(buffer);
    text = parsed.text;
  } catch (err) {
    console.error("[geografia] PDF parse failed:", err);
    await markFailed("Nie udało się odczytać pliku PDF.");
    return NextResponse.json({ ok: false, error: "Nie udało się odczytać pliku PDF.", fileId }, { status: 400 });
  }

  if (!text.trim()) {
    await markFailed("Nie znaleziono tekstu w tym pliku PDF (może to skan bez warstwy tekstowej).");
    return NextResponse.json(
      { ok: false, error: "Nie znaleziono tekstu w tym pliku PDF.", fileId },
      { status: 400 }
    );
  }

  const chunks = splitIntoImportChunks(text);
  if (chunks.length > MAX_IMPORT_CHUNKS) {
    await markFailed("Plik jest zbyt obszerny do jednorazowego importu.");
    return NextResponse.json(
      { ok: false, error: "Ten plik jest zbyt obszerny do jednorazowego importu. Prześlij np. jeden arkusz naraz.", fileId },
      { status: 413 }
    );
  }

  const { data: topicRows } = await supabase.from("geo_topics").select("*").order("order_index");
  const topics = (topicRows ?? []) as GeoTopic[];
  if (topics.length === 0) {
    await markFailed("Baza działów CKE jest pusta — skontaktuj się z administratorem.");
    return NextResponse.json({ ok: false, error: "Baza działów CKE jest pusta.", fileId }, { status: 500 });
  }
  const topicIdBySlug = new Map(topics.map((t) => [t.slug, t.id]));

  // Sequential, not Promise.all: respects Groq rate limits and keeps total
  // request time bounded within maxDuration.
  const extracted = [];
  for (const chunk of chunks) {
    extracted.push(...(await extractExercisesFromChunk(chunk, topics)));
  }

  if (extracted.length === 0) {
    await markFailed("Nie znaleziono żadnych rozpoznawalnych zadań w tym pliku.");
    return NextResponse.json(
      { ok: false, error: "Nie znaleziono żadnych rozpoznawalnych zadań (pytania zamknięte/otwarte z kluczem) w tym pliku.", fileId },
      { status: 400 }
    );
  }

  const rows = extracted.map((e) => ({
    topic_id: topicIdBySlug.get(e.topicSlug)!,
    type: e.type,
    difficulty: e.difficulty,
    points_max: e.pointsMax,
    prompt: { statement: e.statement },
    options: e.type === "mc" ? e.options!.map((o, i) => ({ id: `o${i}`, text: o.text })) : null,
    correct_answer:
      e.type === "mc"
        ? { correctOptionIds: e.options!.map((o, i) => ({ o, i })).filter((x) => x.o.correct).map((x) => `o${x.i}`) }
        : { modelAnswer: e.modelAnswer, rubric: e.rubric },
    hints: e.hints,
    source: "uploaded" as const,
    needs_review: true,
    file_id: fileId,
    created_by: user.id,
  }));

  const { error: insertError } = await supabase.from("geo_exercises").insert(rows);
  if (insertError) {
    console.error("[geografia] exercises insert failed:", insertError);
    await markFailed("Nie udało się zapisać wyodrębnionych zadań.");
    return NextResponse.json({ ok: false, error: "Nie udało się zapisać wyodrębnionych zadań.", fileId }, { status: 500 });
  }

  await supabase
    .from("geo_files")
    .update({ status: "ready", exercises_extracted: rows.length })
    .eq("id", fileId);

  return NextResponse.json({ ok: true, fileId, exercisesExtracted: rows.length });
}
