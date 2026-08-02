"use server";
// ============================================================================
// lib/schola/song-photo-actions.ts
// Photo -> AI OCR draft for a single song. Mirrors lib/paragony/
// receipts-actions.ts's scanReceipt in spirit, but simpler: nothing is
// persisted here at all (no Storage bucket, no intermediate DB row) — the
// review screen is just SongForm pre-filled with the AI's answer, and
// confirming calls the same createScholaSong() used for manual entry.
// ============================================================================
import { requireScholaMember } from "@/lib/schola/get-member";
import { askAIForJSONWithImage } from "@/lib/ai";
import { actionFailure, type ActionResult } from "@/lib/action-result";
import { SUGGESTED_SCHOLA_TAGS } from "@/lib/schola/tags";

export interface ScannedSong {
  title: string;
  lyrics_chordpro: string;
  tags: string[];
}

export async function scanSongPhoto(imageDataUrl: string): Promise<ActionResult<ScannedSong>> {
  await requireScholaMember();

  try {
    const result = await askAIForJSONWithImage<ScannedSong>({
      system:
        "Jesteś asystentem odczytującym zdjęcie nut/tekstu pieśni kościelnej (drukowanego lub " +
        "odręcznego). Odpowiadasz WYŁĄCZNIE danymi zgodnymi ze schematem. Jeśli czegoś nie da się " +
        "odczytać, zostaw pusty string — nigdy nie zmyślaj tekstu, którego nie widać na zdjęciu.",
      prompt:
        "Odczytaj tytuł oraz tekst z akordami z tego zdjęcia. Zapisz tekst w formacie ChordPro: akordy " +
        'w nawiasach kwadratowych BEZPOŚREDNIO przed sylabą, do której pasują (np. "Panie, [C]przyjdź ' +
        '[G]do nas"), zachowaj puste linie oddzielające zwrotki i refren. Zaproponuj 0-3 tagi spośród: ' +
        `${SUGGESTED_SCHOLA_TAGS.join(", ")} (albo pustą listę, jeśli żaden nie pasuje).`,
      imageUrl: imageDataUrl,
      schema: {
        title: { type: "string", description: "Tytuł pieśni, pusty string jeśli nieczytelny" },
        lyrics_chordpro: { type: "string", description: "Tekst z akordami w formacie ChordPro" },
        tags: { type: "array", items: { type: "string" } },
      },
      maxTokens: 2500,
    });
    return { ok: true, data: result };
  } catch (err) {
    console.error("[schola] song photo OCR failed:", err);
    return actionFailure("Nie udało się automatycznie odczytać zdjęcia. Uzupełnij dane ręcznie.");
  }
}
