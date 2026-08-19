// ============================================================================
// lib/modlitwa/readings-source.ts
// Pobranie i sparsowanie czytań liturgicznych na dany dzień z serwisu
// mateusz.pl/czytania (publicznie dostępne czytania mszalne w języku polskim).
//
// Dlaczego scraping, a nie „oficjalne API”: dla polskiego lekcjonarza nie ma
// publicznego API. Serwis ma stabilny, przewidywalny adres na każdy dzień
// (/czytania/<rok>/<RRRRMMDD>.html) i prosty HTML, a my i tak zapisujemy wynik
// w cache (daily_readings), więc jedno pobranie obsługuje wszystkich
// użytkowników na dany dzień.
//
// Struktura strony (zweryfikowana na dniu powszednim i na niedzieli):
//   <article class="mtc"> ... <p class="data">, <h1>, <p class="subtitle">
//   <section> z kotwicą <a name="czytania"> i serią <p>:
//     „(Iz 56, 1. 6-7) tekst…”              -> I czytanie
//     „(Ps 67 (66)…) REFREN: … ” + kolejne <p> bez cytatu -> psalm + zwrotki
//     „(Rz 11, 13-15…) tekst…”              -> II czytanie (tylko niedziele/święta)
//     „Aklamacja (Mt 4, 23) tekst…”         -> aklamacja
//     „(Mt 15, 21-28) tekst…”               -> Ewangelia (ostatni blok)
// Parser jest defensywny: brak dowolnego elementu daje null w tym polu, a nie
// wyjątek — czytania bez II czytania to norma, nie błąd.
// ============================================================================
import "server-only";
import * as cheerio from "cheerio";

/** Skróty ksiąg, po których poznajemy blok z Ewangelią. */
const GOSPEL_BOOKS = ["Mt", "Mk", "Łk", "Lk", "J"];

// Tylko ASCII: nagłówki HTTP są kodowane jako ByteString, więc polski znak
// (np. „ł”) wywala całe fetch() zanim poleci zapytanie.
const USER_AGENT = "PhoenixModlitwa/1.0 (prayer app; contact via instance owner)";
const FETCH_TIMEOUT_MS = 10_000;

export interface ParsedReadings {
  dayName: string | null;
  firstReadingCitation: string | null;
  firstReadingText: string | null;
  psalmCitation: string | null;
  psalmRefrain: string | null;
  psalmText: string | null;
  secondReadingCitation: string | null;
  secondReadingText: string | null;
  acclamationCitation: string | null;
  acclamationText: string | null;
  gospelCitation: string | null;
  gospelText: string | null;
  sourceUrl: string;
}

/** Adres strony źródłowej dla "YYYY-MM-DD". */
export function readingsSourceUrl(dateKey: string): string {
  const compact = dateKey.replaceAll("-", "");
  return `https://mateusz.pl/czytania/${compact.slice(0, 4)}/${compact}.html`;
}

interface Block {
  citation: string | null;
  text: string;
  isAcclamation: boolean;
}

function normalize(text: string): string {
  return text
    .replace(/ /g, " ")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/** Zamienia <br> na twarde końce linii, żeby zwrotki psalmu nie zlały się w jeden akapit. */
function blockText(node: cheerio.Cheerio<never>): string {
  const clone = node.clone();
  clone.find("br").replaceWith("\n");
  clone.find("aside, iframe, script, style").remove();
  return normalize(clone.text());
}

/** Wyciąga bloki (cytat + tekst) z sekcji „Czytania”. */
function extractBlocks($: cheerio.CheerioAPI): Block[] {
  const section = $('a[name="czytania"]').first().closest("section");
  if (section.length === 0) return [];

  const blocks: Block[] = [];

  section.find("p").each((_i, el) => {
    const raw = blockText($(el) as unknown as cheerio.Cheerio<never>);
    if (!raw) return;

    const acclamation = /^Aklamacja/i.test(raw);
    const match = raw.match(/^(?:Aklamacja\s*)?\(([^)]*(?:\([^)]*\))?[^)]*)\)\s*/);

    if (match) {
      blocks.push({
        citation: match[1].trim(),
        text: normalize(raw.slice(match[0].length)),
        isAcclamation: acclamation,
      });
      return;
    }

    // Akapit bez cytatu = ciąg dalszy poprzedniego bloku (zwrotki psalmu).
    const previous = blocks[blocks.length - 1];
    if (previous) previous.text = normalize(`${previous.text}\n\n${raw}`);
  });

  return blocks;
}

function bookOf(citation: string | null): string {
  if (!citation) return "";
  return citation.trim().split(/[\s,]/)[0];
}

function splitRefrain(text: string): { refrain: string | null; body: string } {
  const match = text.match(/REFREN:?\s*(.*)/i);
  if (!match) return { refrain: null, body: text };
  const refrain = match[1].split("\n")[0].trim();
  const body = normalize(text.replace(/REFREN:?\s*.*(\n|$)/i, ""));
  return { refrain: refrain || null, body };
}

export function parseReadingsHtml(html: string, sourceUrl: string): ParsedReadings | null {
  const $ = cheerio.load(html);

  const dayName =
    $("article.mtc p.subtitle").first().text().replace(/\s+/g, " ").trim() ||
    $("article.mtc header h1").first().text().replace(/\s+/g, " ").trim() ||
    null;

  const blocks = extractBlocks($);
  if (blocks.length === 0) return null;

  const acclamationIndex = blocks.findIndex((b) => b.isAcclamation);
  const psalmIndex = blocks.findIndex((b, i) => i > 0 && /REFREN/i.test(b.text));

  // Ewangelia: ostatni blok z księgą ewangeliczną, ale nie aklamacja (ta też
  // najczęściej cytuje Ewangelię).
  let gospelIndex = -1;
  for (let i = blocks.length - 1; i >= 0; i--) {
    if (!blocks[i].isAcclamation && GOSPEL_BOOKS.includes(bookOf(blocks[i].citation))) {
      gospelIndex = i;
      break;
    }
  }
  if (gospelIndex === -1) gospelIndex = blocks.length - 1;

  const usedIndexes = new Set([0, psalmIndex, acclamationIndex, gospelIndex].filter((i) => i >= 0));
  const secondReadingIndex = blocks.findIndex((_b, i) => !usedIndexes.has(i));

  const psalm = psalmIndex >= 0 ? splitRefrain(blocks[psalmIndex].text) : null;

  return {
    dayName,
    firstReadingCitation: blocks[0]?.citation ?? null,
    firstReadingText: blocks[0]?.text ?? null,
    psalmCitation: psalmIndex >= 0 ? blocks[psalmIndex].citation : null,
    psalmRefrain: psalm?.refrain ?? null,
    psalmText: psalm?.body ?? null,
    secondReadingCitation: secondReadingIndex >= 0 ? blocks[secondReadingIndex].citation : null,
    secondReadingText: secondReadingIndex >= 0 ? blocks[secondReadingIndex].text : null,
    acclamationCitation: acclamationIndex >= 0 ? blocks[acclamationIndex].citation : null,
    acclamationText: acclamationIndex >= 0 ? blocks[acclamationIndex].text : null,
    gospelCitation: gospelIndex >= 0 ? blocks[gospelIndex].citation : null,
    gospelText: gospelIndex >= 0 ? blocks[gospelIndex].text : null,
    sourceUrl,
  };
}

/**
 * Pobiera czytania na dany dzień. Zwraca null przy dowolnym problemie
 * (brak sieci, 404, zmiana układu strony) — wołający ma wtedy pokazać dane z
 * cache, zgodnie ze specyfikacją („nieudane pobranie -> fallback”).
 */
export async function fetchReadings(dateKey: string): Promise<ParsedReadings | null> {
  const url = readingsSourceUrl(dateKey);

  try {
    const response = await fetch(url, {
      headers: { "user-agent": USER_AGENT },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      // Czytania na dany dzień się nie zmieniają, a i tak trzymamy je w bazie.
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`[modlitwa] readings fetch ${url} -> HTTP ${response.status}`);
      return null;
    }

    const parsed = parseReadingsHtml(await response.text(), url);
    if (!parsed?.gospelText) {
      console.error(`[modlitwa] readings parse produced no gospel for ${dateKey}`);
      return parsed?.firstReadingText ? parsed : null;
    }
    return parsed;
  } catch (error) {
    console.error(`[modlitwa] readings fetch failed for ${dateKey}:`, error);
    return null;
  }
}
