// ============================================================================
// app/api/jezyki/import-textbook/route.ts
// Splits an uploaded English-textbook PDF into units/vocabulary/grammar via
// AI and persists them directly (no draft-review step — unlike Schola's song
// import, a textbook's structure is too deeply nested — units -> words +
// grammar topics + exercises — to review inline; see lib/textbook/extract.ts
// for the "AI call per chunk, code merges" pipeline). A Route Handler, not a
// Server Action, for the same reason as Schola's import: a multi-MB PDF is
// over the default Server Action body cap.
//
// Auth is checked manually (not requireProfile(), which redirects — wrong
// for an endpoint returning JSON to a fetch() call). Any authenticated user
// may upload a textbook — this module has no admin/membership gate. Once
// uploaded, the textbook is visible to every student (0012_textbooks_shared.
// sql); only the uploader can delete it, and each student's flashcard/
// exercise progress on its words is tracked separately per-user.
// ============================================================================
import { NextResponse, type NextRequest } from "next/server";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { createClient } from "@/lib/supabase/server";
import { splitIntoImportChunks } from "@/lib/schola/pdf-chunking";
import {
  extractUnitsFromChunk,
  mergeUnits,
  sanitizeExercise,
  toGrammarBlocks,
} from "@/lib/textbook/extract";
import type { UserLevel } from "@/lib/types/database";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Same ~4.5MB Vercel serverless request-body ceiling as Schola's import.
const MAX_FILE_BYTES = 4 * 1024 * 1024;
// Lower than Schola's 12: each chunk here does richer extraction (words +
// grammar + exercises, not just a title/lyrics pair), so keeping total
// sequential AI calls bounded matters more for staying under maxDuration.
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
    return NextResponse.json({ ok: false, error: "Plik musi być w formacie PDF." }, { status: 400 });
  }
  if (file.size > MAX_FILE_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Plik jest za duży (maksymalnie ok. 4 MB). Prześlij np. jeden rozdział naraz." },
      { status: 413 }
    );
  }

  let text: string;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await pdfParse(buffer);
    text = parsed.text;
  } catch (err) {
    console.error("[textbook] PDF parse failed:", err);
    return NextResponse.json({ ok: false, error: "Nie udało się odczytać pliku PDF." }, { status: 400 });
  }

  if (!text.trim()) {
    return NextResponse.json(
      { ok: false, error: "Nie znaleziono tekstu w tym pliku PDF." },
      { status: 400 }
    );
  }

  const chunks = splitIntoImportChunks(text);
  if (chunks.length > MAX_IMPORT_CHUNKS) {
    return NextResponse.json(
      {
        ok: false,
        error: "Ten plik jest zbyt obszerny do jednorazowego importu. Prześlij np. jeden rozdział naraz.",
      },
      { status: 413 }
    );
  }

  // Sequential, not Promise.all: respects Groq rate limits and keeps total
  // request time bounded within maxDuration (see MAX_IMPORT_CHUNKS comment).
  const chunkResults = [];
  for (const chunk of chunks) {
    chunkResults.push(await extractUnitsFromChunk(chunk));
  }

  const units = mergeUnits(chunkResults).filter((unit) => unit.words.length > 0 || unit.grammar_topics.length > 0);
  if (units.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Nie znaleziono żadnych słówek ani reguł gramatycznych w tym pliku." },
      { status: 400 }
    );
  }

  const { data: profile } = await supabase.from("profiles").select("level").eq("id", user.id).single();
  const level = (profile?.level as UserLevel | undefined) ?? "A2";

  const title = file.name.replace(/\.pdf$/i, "").trim() || "Podręcznik";
  const { data: textbook, error: textbookError } = await supabase
    .from("textbooks")
    .insert({ user_id: user.id, title, language: "en" })
    .select("id")
    .single();
  if (textbookError || !textbook) {
    console.error("[textbook] insert failed:", textbookError);
    return NextResponse.json({ ok: false, error: "Nie udało się zapisać podręcznika." }, { status: 500 });
  }
  const textbookId = textbook.id as string;

  for (let unitIndex = 0; unitIndex < units.length; unitIndex++) {
    const unit = units[unitIndex];

    const { data: unitRow, error: unitError } = await supabase
      .from("textbook_units")
      .insert({
        textbook_id: textbookId,
        user_id: user.id,
        title: unit.unit_title,
        order_index: unitIndex,
      })
      .select("id")
      .single();
    if (unitError || !unitRow) {
      console.error("[textbook] unit insert failed, skipping unit:", unitError);
      continue;
    }
    const unitId = unitRow.id as string;

    if (unit.words.length > 0) {
      const { error: wordsError } = await supabase.from("textbook_words").insert(
        unit.words.map((word, i) => ({
          unit_id: unitId,
          textbook_id: textbookId,
          user_id: user.id,
          language: "en",
          level,
          category: unit.unit_title,
          word_en: word.word_en,
          translation_pl: word.translation_pl,
          example_sentence: word.example_sentence,
          order_index: i,
        }))
      );
      if (wordsError) console.error("[textbook] words insert failed for unit:", wordsError);
    }

    for (let topicIndex = 0; topicIndex < unit.grammar_topics.length; topicIndex++) {
      const topic = unit.grammar_topics[topicIndex];

      const { data: topicRow, error: topicError } = await supabase
        .from("textbook_grammar_topics")
        .insert({
          textbook_id: textbookId,
          unit_id: unitId,
          user_id: user.id,
          language: "en",
          title: topic.title,
          blocks: toGrammarBlocks(topic),
          order_index: topicIndex,
        })
        .select("id")
        .single();
      if (topicError || !topicRow) {
        console.error("[textbook] grammar topic insert failed, skipping topic:", topicError);
        continue;
      }

      if (topic.exercises.length > 0) {
        const { error: exercisesError } = await supabase.from("textbook_grammar_exercises").insert(
          topic.exercises.map((exercise, i) => {
            const sanitized = sanitizeExercise(exercise);
            return {
              topic_id: topicRow.id,
              user_id: user.id,
              type: sanitized.type,
              prompt: sanitized.prompt,
              options: sanitized.options,
              correct_answer: sanitized.correct_answer,
              order_index: i,
            };
          })
        );
        if (exercisesError) console.error("[textbook] exercises insert failed for topic:", exercisesError);
      }
    }
  }

  return NextResponse.json({ ok: true, textbookId });
}
