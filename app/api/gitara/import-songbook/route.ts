// ============================================================================
// app/api/gitara/import-songbook/route.ts
// Splits an uploaded songbook PDF into individual song drafts via AI. A
// Route Handler, not a Server Action — a multi-MB PDF is well over the
// default Server Action body cap, same reason
// app/api/schola/import-pdf/route.ts is a Route Handler too. Nothing is
// written to the DB here; the client reviews the returned drafts and calls
// importGtrSongs (lib/gitara/import-actions.ts) to actually save.
//
// Any authenticated user may import (checked manually, not via
// requireProfile which redirects — wrong for an endpoint returning JSON to
// fetch()) — this app has no membership gate the way Schola does.
// ============================================================================
import { NextResponse, type NextRequest } from "next/server";
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { createClient } from "@/lib/supabase/server";
import { askAIForJSON } from "@/lib/ai";
import { splitIntoImportChunks, MAX_IMPORT_CHUNKS } from "@/lib/gitara/pdf-chunking";
import type { DraftGtrSong } from "@/lib/gitara/import-actions";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Practical ceiling given Vercel serverless functions' own request-body
// limit (~4.5MB on most plans) — not "unlimited".
const MAX_FILE_BYTES = 4 * 1024 * 1024;

interface ChunkSongsResponse {
  songs: DraftGtrSong[];
}

async function extractSongsFromChunk(chunk: string): Promise<DraftGtrSong[]> {
  try {
    const result = await askAIForJSON<ChunkSongsResponse>({
      system:
        "Jesteś asystentem digitalizującym śpiewnik gitarowy (akordy nad tekstem). Otrzymujesz FRAGMENT " +
        "zeskanowanego śpiewnika (może zaczynać/kończyć się w połowie piosenki). Wyodrębnij WSZYSTKIE " +
        "kompletne piosenki z tego fragmentu. Jeśli piosenka na początku lub końcu fragmentu wygląda na " +
        "uciętą (brak wyraźnego początku/końca), POMIŃ ją — lepiej nic nie zwrócić niż zgadywać brakujący " +
        'tekst. Tekst każdej piosenki zapisz w formacie ChordPro: akordy w nawiasach kwadratowych ' +
        'BEZPOŚREDNIO przed sylabą, do której pasują (np. "Hej, [C]dokąd jedziesz [G]tak?"), zachowaj ' +
        "puste linie oddzielające zwrotki i refren. Nie używaj żadnych innych znaczników ChordPro. Jeśli " +
        "wykonawca/artysta jest widoczny przy tytule, wpisz go, inaczej zostaw puste pole.",
      prompt: `Oto fragment śpiewnika do przetworzenia:\n\n${chunk}`,
      schema: {
        songs: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              artist: { type: "string" },
              content_chordpro: { type: "string" },
            },
            required: ["title", "content_chordpro"],
          },
        },
      },
      maxTokens: 4000,
    });
    return result.songs ?? [];
  } catch (err) {
    console.error("[gitara] PDF import chunk failed, skipping:", err);
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
      { ok: false, error: "Plik jest za duży (maksymalnie ok. 4 MB). Podziel śpiewnik na mniejsze części." },
      { status: 413 }
    );
  }

  let text: string;
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const parsed = await pdfParse(buffer);
    text = parsed.text;
  } catch (err) {
    console.error("[gitara] PDF parse failed:", err);
    return NextResponse.json({ ok: false, error: "Nie udało się odczytać pliku PDF." }, { status: 400 });
  }

  if (!text.trim()) {
    return NextResponse.json({ ok: false, error: "Nie znaleziono tekstu w tym pliku PDF." }, { status: 400 });
  }

  const chunks = splitIntoImportChunks(text);
  if (chunks.length > MAX_IMPORT_CHUNKS) {
    return NextResponse.json(
      { ok: false, error: "Ten plik jest zbyt obszerny do jednorazowego importu. Podziel go na mniejsze części." },
      { status: 413 }
    );
  }

  // Sequential, not Promise.all: respects Groq rate limits and keeps total
  // request time bounded within maxDuration.
  const songs: DraftGtrSong[] = [];
  for (const chunk of chunks) {
    const chunkSongs = await extractSongsFromChunk(chunk);
    songs.push(...chunkSongs);
  }

  return NextResponse.json({ ok: true, songs });
}
