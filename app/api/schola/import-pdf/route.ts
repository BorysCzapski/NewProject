// ============================================================================
// app/api/schola/import-pdf/route.ts
// Splits an uploaded songbook PDF into individual song drafts via AI. A
// Route Handler, not a Server Action: a multi-MB PDF is well over the
// ~1MB default Server Action body cap (no experimental.serverActions.
// bodySizeLimit override exists in next.config.ts) — that's exactly why
// Paragony's receipt flow downscales photos client-side before sending,
// but that trick doesn't apply to a text PDF. Nothing is written to the DB
// here; the client reviews the returned drafts and calls importScholaSongs
// (lib/schola/import-actions.ts) to actually save, same "AI output is
// always a draft" principle as every other AI-assisted import in this app.
//
// Auth is checked manually (not via lib/schola/get-member.ts's
// requireScholaMember(), which redirects — wrong for an endpoint meant to
// return JSON to a fetch() call, not a page navigation).
// ============================================================================
import { NextResponse, type NextRequest } from "next/server";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { createClient } from "@/lib/supabase/server";
import { askAIForJSON } from "@/lib/ai";
import { splitIntoImportChunks, MAX_IMPORT_CHUNKS } from "@/lib/schola/pdf-chunking";
import { SUGGESTED_SCHOLA_TAGS } from "@/lib/schola/tags";
import type { DraftScholaSong } from "@/lib/schola/import-actions";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Practical ceiling given Vercel serverless functions' own request-body
// limit (~4.5MB on most plans) — not "unlimited".
const MAX_FILE_BYTES = 4 * 1024 * 1024;

interface ChunkSongsResponse {
  songs: DraftScholaSong[];
}

async function extractSongsFromChunk(chunk: string): Promise<DraftScholaSong[]> {
  try {
    const result = await askAIForJSON<ChunkSongsResponse>({
      system:
        "Jesteś asystentem digitalizującym śpiewnik kościelny. Otrzymujesz FRAGMENT zeskanowanego " +
        "śpiewnika (może zaczynać/kończyć się w połowie pieśni). Wyodrębnij WSZYSTKIE kompletne pieśni " +
        "z tego fragmentu. Jeśli pieśń na początku lub końcu fragmentu wygląda na uciętą (brak wyraźnego " +
        "początku/końca), POMIŃ ją — lepiej nic nie zwrócić niż zgadywać brakujący tekst. Tekst każdej " +
        'pieśni zapisz w formacie ChordPro: akordy w nawiasach kwadratowych BEZPOŚREDNIO przed sylabą, ' +
        'do której pasują (np. "Panie, [C]przyjdź [G]do nas"), zachowaj puste linie oddzielające zwrotki ' +
        "i refren. Nie używaj żadnych innych znaczników ChordPro (żadnych {tytuł:}, {komentarz:} itp.).",
      prompt:
        `Oto fragment śpiewnika do przetworzenia:\n\n${chunk}\n\n` +
        `Dla każdej pieśni zaproponuj 0-3 tagi spośród: ${SUGGESTED_SCHOLA_TAGS.join(", ")} ` +
        "(albo zostaw pustą listę, jeśli żaden nie pasuje).",
      schema: {
        songs: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              lyrics_chordpro: { type: "string" },
              tags: { type: "array", items: { type: "string" } },
            },
            required: ["title", "lyrics_chordpro"],
          },
        },
      },
      maxTokens: 4000,
    });
    return result.songs ?? [];
  } catch (err) {
    console.error("[schola] PDF import chunk failed, skipping:", err);
    return [];
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Musisz być zalogowany." }, { status: 401 });
  }
  const { data: member } = await supabase
    .from("schola_members")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();
  if (!member) {
    return NextResponse.json({ ok: false, error: "Brak dostępu do Scholi." }, { status: 403 });
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
      {
        ok: false,
        error: "Plik jest za duży (maksymalnie ok. 4 MB). Podziel śpiewnik na mniejsze części.",
      },
      { status: 413 }
    );
  }

  let text: string;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await pdfParse(buffer);
    text = parsed.text;
  } catch (err) {
    console.error("[schola] PDF parse failed:", err);
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
        error: "Ten plik jest zbyt obszerny do jednorazowego importu. Podziel go na mniejsze części.",
      },
      { status: 413 }
    );
  }

  // Sequential, not Promise.all: respects Groq rate limits and keeps total
  // request time bounded within maxDuration (see MAX_IMPORT_CHUNKS comment).
  const songs: DraftScholaSong[] = [];
  for (const chunk of chunks) {
    const chunkSongs = await extractSongsFromChunk(chunk);
    songs.push(...chunkSongs);
  }

  return NextResponse.json({ ok: true, songs });
}
