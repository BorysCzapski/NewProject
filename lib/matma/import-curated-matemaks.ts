// ============================================================================
// lib/matma/import-curated-matemaks.ts
// ADMIN-RUN curated-content import from matemaks.pl (math_problems.source =
// 'curated'). NOT a Server Action — see lib/matma/import-actions.ts's
// requireAdmin()-gated runMatemaksImport for the entry point. Same overall
// shape as lib/matma/import-past-exams.ts (discover -> fetch -> extract ->
// AI-structure -> insert, every failure caught into a summary instead of
// aborting the batch) but crawling live HTML instead of parsing PDFs.
//
// ----------------------------------------------------------------------------
// SITE STRUCTURE — verified against REAL HTML (2026-07-22)
// ----------------------------------------------------------------------------
// This sandbox's egress policy blocks direct fetches to matemaks.pl (same
// restriction documented in import-past-exams.ts for cke.gov.pl — confirmed
// via curl: 403 from the sandbox's own proxy). The admin pasted the raw
// HTML of a real topic ("temat") page (matemaks.pl/zadania-optymalizacyjne)
// directly into chat, which is what the parsing logic below is built
// against — NOT guessed. Confirmed real structure:
//  - Flat URLs, no folders: matemaks.pl/<slug> (e.g. /zadania-optymalizacyjne).
//  - Every temat page links to: its parent "dział" page (.pasek_root .center
//    .bold a), the previous temat (.sasiednie_blok a) and the next temat
//    (.next_temat a) — a genuine, site-authored linked list within a dział.
//    Crawling this chain from ONE known starting temat self-discovers every
//    other temat in that dział, without needing to guess or scrape a
//    separate table-of-contents page.
//  - A temat page can mix poziom podstawowy / rozszerzony content in
//    separate `.blok_strony` sections; each carries a `poziom` attribute
//    ("LO3PR" observed for rozszerzony) and a `.poziom_blok_info` label
//    ("Poziom rozszerzony") — ONLY blocks whose label mentions
//    "rozszerzony" are scraped.
//  - Each problem is `.zadanie[data-id][data-nr_zad][pkt]` — `pkt` is the
//    REAL point value (no need to guess it, unlike the CKE PDF pipeline).
//    Statement is `.z_tresc` (may contain nested `.podzadanie[data-pkt]`
//    sub-parts — a/b/c compound problems). CRUCIALLY, the final answer is
//    present in the raw HTML at `.p_o` even though it's CSS-hidden
//    (`class="... hide"`) — a real, reliable answer key per problem, just
//    no step-by-step solution (matemaks doesn't publish those inline; some
//    problems link to a YouTube walkthrough via a `yt` attribute, out of
//    scope here). Math uses MathJax `\(...\)` / `\[...\]` delimiters —
//    converted to this app's `$...$` / `$$...$$` convention below.
//  - DIZAŁ (topic-page) seed slugs below are only ONE confirmed
//    (elementy-analizy-matematycznej, whose first known temat is
//    zadania-optymalizacyjne) — the rest are informed guesses from the
//    curriculum + matching site naming conventions, each independently
//    probed at runtime (never assumed) exactly like the CKE PDF URL
//    candidates: a 404 just skips that dział and gets reported, it never
//    produces wrong data. An admin can always supply a confirmed starting
//    slug manually via runMatemaksImport's `startSlug` override.
// ============================================================================
import "server-only";
import * as cheerio from "cheerio";
import { askAIForJSON } from "@/lib/ai";
import { getTopics } from "@/lib/matma/content";
import { MATH_TOPIC_SLUGS } from "@/lib/matma/topics";
import { MATEMAKS_DZIAL_SEEDS } from "@/lib/matma/matemaks-seeds";
import type { MathCuratedMetadata, MathGradingCriterion } from "@/lib/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

export { MATEMAKS_DZIAL_SEEDS };

const SITE_ROOT = "https://www.matemaks.pl";
const ATTRIBUTION = "Matemaks.pl (M. Budzyński)";
const REQUEST_TIMEOUT_MS = 10_000;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const MAX_TEMATY_PER_DZIAL = 40; // safety ceiling against an accidental infinite next_temat loop

export interface MatemaksImportSummary {
  dzialSlug: string;
  tematyVisited: number;
  problemsFound: number;
  problemsInserted: number;
  errors: string[];
}

async function timedFetch(url: string): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    // Headers beyond User-Agent matter here: some anti-bot/WAF rules key off
    // a request "looking like a browser" (missing Accept/Accept-Language is
    // a common automated-request signal) — a real failure mode observed in
    // production was a page that loads fine in an actual browser but fails
    // server-side with no HTTP-level reason, consistent with this.
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "pl-PL,pl;q=0.9,en;q=0.8",
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

function errMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function resolveUrl(href: string, base: string): string {
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

function slugFromUrl(url: string): string {
  return url.replace(/\/+$/, "").split("/").pop() ?? url;
}

/** MathJax `\(...\)` / `\[...\]` -> this app's `$...$` / `$$...$$`. */
function convertMathDelimiters(text: string): string {
  return text
    .replace(/\\\[/g, "$$$$")
    .replace(/\\\]/g, "$$$$")
    .replace(/\\\(/g, "$")
    .replace(/\\\)/g, "$");
}

interface RawMatemaksProblem {
  matemaksId: string;
  nrZad: number;
  points: number | null;
  statementText: string;
  answerText: string | null;
  imageUrl: string | null;
}

interface ParsedTematPage {
  title: string;
  dzialSlug: string | null;
  dzialTitle: string | null;
  nextSlug: string | null;
  problems: RawMatemaksProblem[];
}

/** Turns one `.z_tresc` block's HTML into plain text: podzadanie sub-parts
 * become lettered "a) (N pkt) ..." lines, the first <img> becomes both a
 * `[rysunek: URL]` marker (so the AI knows a diagram existed) and the
 * returned imageUrl candidate, MathJax delimiters are converted, and
 * everything else is flattened to text via a second cheerio pass (cleanly
 * decodes HTML entities without hand-rolling that). */
function extractStatement($: cheerio.CheerioAPI, el: cheerio.Cheerio<never>, pageUrl: string): { text: string; imageUrl: string | null } {
  let imageUrl: string | null = null;
  const clone = $(el).clone();

  const firstImg = clone.find("img").first();
  if (firstImg.length) {
    const src = firstImg.attr("src");
    if (src) imageUrl = resolveUrl(src, pageUrl);
  }
  clone.find("img").remove();

  let letterIndex = 0;
  clone.find(".podzadanie").each((_, node) => {
    const $node = $(node);
    const letter = String.fromCharCode(97 + letterIndex);
    letterIndex += 1;
    const pkt = $node.attr("data-pkt");
    const prefix = `\n${letter}) ${pkt ? `(${pkt} pkt) ` : ""}`;
    $node.replaceWith(`<div>${prefix}${$node.html() ?? ""}</div>`);
  });

  const rawHtml = clone.html() ?? "";
  const flattened = cheerio.load(`<div id="root">${rawHtml}</div>`)("#root").text();
  const text = convertMathDelimiters(flattened).replace(/[ \t]+/g, " ").trim();
  return { text, imageUrl };
}

/** Throws a DESCRIPTIVE error on any failure (HTTP status, timeout, network
 * error, or "fetched fine but doesn't look like a temat page") instead of
 * silently returning null — a live production report showed a page that
 * loads fine in a browser still failing server-side with no visible reason,
 * so surfacing the real cause (status code / body snippet) matters more
 * here than in the CKE PDF pipeline, where a 404 is unambiguous. Likely
 * culprits for "loads in browser, fails server-side": bot/anti-scraping
 * protection keyed off User-Agent or missing browser-only headers, or a
 * cookie-consent gate serving different content without a consent cookie. */
async function fetchAndParseTematPage(slug: string): Promise<ParsedTematPage> {
  const url = `${SITE_ROOT}/${slug}`;
  let res: Response;
  try {
    res = await timedFetch(url);
  } catch (err) {
    const reason = err instanceof Error && err.name === "AbortError" ? "przekroczono czas oczekiwania (timeout)" : errMessage(err);
    throw new Error(`nie udało się połączyć z ${url} (${reason})`);
  }
  if (!res.ok) {
    throw new Error(`serwer zwrócił status ${res.status} ${res.statusText} dla ${url}`);
  }
  const html = await res.text();
  if (!/<h1[^>]*class="tytuldzialu"/i.test(html) || !/class="zadanie"/.test(html)) {
    // Fetched SOMETHING (200 OK) but it doesn't look like a real temat page
    // — likely a cookie-consent interstitial, an anti-bot challenge page,
    // or a redirect target that isn't a temat. Surface a snippet so the
    // admin can tell which.
    const snippet = html.replace(/\s+/g, " ").trim().slice(0, 300);
    throw new Error(
      `${url} zwrócił 200 OK, ale treść nie wygląda jak strona tematu (brak spodziewanej struktury) — ` +
        `możliwa blokada bota/ciasteczek. Fragment odpowiedzi: "${snippet}"`
    );
  }

  const $ = cheerio.load(html);
  const title = $("h1.tytuldzialu").first().text().trim();

  const dzialAnchor = $(".pasek_root.druk_ukryj .center.bold a").first();
  const dzialHref = dzialAnchor.attr("href");
  const dzialSlug = dzialHref ? slugFromUrl(resolveUrl(dzialHref, url)) : null;
  const dzialTitle = dzialAnchor.text().trim() || null;

  const nextHref = $("a.next_temat").first().attr("href");
  const nextSlug = nextHref ? slugFromUrl(resolveUrl(nextHref, url)) : null;

  const problems: RawMatemaksProblem[] = [];
  $(".blok_strony").each((_, blockEl) => {
    const $block = $(blockEl);
    const levelLabel = $block.find(".poziom_blok_info").first().text().toLowerCase();
    // Only scrape sections explicitly labeled rozszerzony; skip podstawowy
    // (and skip unlabeled blocks too, to stay conservative — a false
    // negative here just means fewer problems found, a false positive
    // would wrongly import podstawowy content as rozszerzony).
    if (!levelLabel.includes("rozszerz")) return;

    $block.find(".zadanie").each((_, zadEl) => {
      const $zad = $(zadEl);
      const matemaksId = $zad.attr("data-id") ?? $zad.attr("id") ?? "";
      const nrZad = Number($zad.attr("data-nr_zad") ?? "0") || problems.length + 1;
      const pointsAttr = $zad.attr("pkt");
      const points = pointsAttr ? Number(pointsAttr) : null;

      const $tresc = $zad.find(".z_tresc").first();
      if (!$tresc.length) return;
      const { text: statementText, imageUrl } = extractStatement($, $tresc as unknown as cheerio.Cheerio<never>, url);
      if (!statementText) return;

      const $answer = $zad.find(".p_o").first();
      const answerHtml = $answer.html();
      const answerText = answerHtml
        ? convertMathDelimiters(cheerio.load(`<div id="root">${answerHtml}</div>`)("#root").text()).trim()
        : null;

      problems.push({
        matemaksId,
        nrZad,
        points: points && points > 0 ? points : null,
        statementText,
        answerText: answerText || null,
        imageUrl,
      });
    });
  });

  return { title, dzialSlug, dzialTitle, nextSlug, problems };
}

// ----------------------------------------------------------------------------
// AI structuring — raw scraped problem -> math_problems row shape
// ----------------------------------------------------------------------------

interface StructuredCuratedProblem {
  statement: string;
  difficulty: number;
  is_proof: boolean;
  topic_slug: string;
  grading_criteria: MathGradingCriterion[];
}

const CURATED_SYSTEM_PROMPT =
  "Jesteś redaktorem treści matematycznych porządkującym zadanie pobrane ze strony edukacyjnej (Matemaks.pl) do " +
  "formatu używanego w aplikacji do nauki matury rozszerzonej z matematyki. Otrzymujesz surowy tekst zadania " +
  "(ekstrakcja z HTML — może zawierać drobne artefakty formatowania), PRAWDZIWĄ liczbę punktów za zadanie oraz, " +
  "jeśli dostępna, prawdziwą odpowiedź końcową podaną przez źródło. Zasady: " +
  "1) statement: pełna, czytelna treść zadania PO POLSKU, wzory w LaTeX ($...$ dla wzorów w tekście, $$...$$ dla " +
  "wzorów blokowych), zachowaj podpunkty a)/b)/c) jeśli występują. " +
  "2) difficulty: 1 (bardzo łatwe, jednoetapowe), 2 (typowe maturalne) albo 3 (trudne, wieloetapowe) — oceń na " +
  "podstawie treści i liczby punktów. " +
  "3) is_proof: true TYLKO gdy polecenie brzmi „Udowodnij”, „Wykaż, że” lub równoważnie. " +
  `4) topic_slug: DOKŁADNIE jeden z: ${MATH_TOPIC_SLUGS.join(", ")}. ` +
  "5) grading_criteria: analityczny schemat punktowania w stylu CKE (krok + opis + liczba punktów). SUMA points " +
  "MUSI być równa podanej liczbie punktów za zadanie — to twardy wymóg. Jeśli podano prawdziwą odpowiedź końcową, " +
  "upewnij się że ostatni krok schematu odpowiada dokładnie tej odpowiedzi.";

const CURATED_SCHEMA = {
  statement: { type: "string", description: "Pełna treść zadania po polsku, wzory w LaTeX." },
  difficulty: { type: "number", description: "1, 2 lub 3." },
  is_proof: { type: "boolean" },
  topic_slug: { type: "string", description: `Jeden z: ${MATH_TOPIC_SLUGS.join(", ")}` },
  grading_criteria: {
    type: "array",
    description: "Schemat punktowania — suma points musi równać się podanej liczbie punktów.",
    items: {
      type: "object",
      properties: {
        step: { type: "string" },
        points: { type: "number" },
        description: { type: "string" },
      },
      required: ["step", "points", "description"],
    },
  },
};

async function structureCuratedProblem(raw: RawMatemaksProblem, pointsMax: number): Promise<StructuredCuratedProblem> {
  const prompt =
    `Treść zadania (nr ${raw.nrZad}):\n${raw.statementText}\n\n` +
    `Liczba punktów (STAŁA, nie zmieniaj): ${pointsMax}\n` +
    (raw.answerText ? `Prawdziwa odpowiedź końcowa podana przez źródło: ${raw.answerText}` : "Brak podanej odpowiedzi końcowej.");

  return askAIForJSON<StructuredCuratedProblem>({
    system: CURATED_SYSTEM_PROMPT,
    prompt,
    schema: CURATED_SCHEMA,
    maxTokens: 2_000,
  });
}

// ----------------------------------------------------------------------------
// Orchestration — one dział -> N math_problems rows
// ----------------------------------------------------------------------------

async function getTopicIdBySlug(supabase: SupabaseClient): Promise<Map<string, string>> {
  const topics = await getTopics(supabase);
  return new Map(topics.map((t) => [t.slug, t.id]));
}

/** Shared per-problem tail of both import paths (live crawl and pasted-
 * console-extraction): dedupe check, AI structuring, validation, insert.
 * Mutates `summary` in place; never throws, every failure is caught into
 * summary.errors so one bad problem can't abort the batch. */
async function structureAndInsertRawProblems(
  supabase: SupabaseClient,
  topicIdBySlug: Map<string, string>,
  problems: RawMatemaksProblem[],
  pageInfo: { title: string; url: string },
  summary: { problemsFound: number; problemsInserted: number; errors: string[] },
  opts?: { createdBy?: string | null }
): Promise<void> {
  for (const raw of problems) {
    if (!raw.points) {
      summary.errors.push(`"${pageInfo.title}" zadanie ${raw.nrZad}: brak punktacji w źródle — pominięto.`);
      continue;
    }

    const { count: existing } = await supabase
      .from("math_problems")
      .select("id", { count: "exact", head: true })
      .eq("source", "curated")
      .eq("source_metadata->>matemaksId", raw.matemaksId);
    if (existing && existing > 0) continue; // already imported, skip quietly

    summary.problemsFound += 1;
    let structured: StructuredCuratedProblem;
    try {
      structured = await structureCuratedProblem(raw, raw.points);
    } catch (err) {
      summary.errors.push(`"${pageInfo.title}" zadanie ${raw.nrZad}: AI nie ustrukturyzowało treści — ${errMessage(err)}`);
      continue;
    }

    const topicId = topicIdBySlug.get(structured.topic_slug);
    if (!topicId) {
      summary.errors.push(`"${pageInfo.title}" zadanie ${raw.nrZad}: nierozpoznany dział „${structured.topic_slug}” — pominięto.`);
      continue;
    }
    const criteriaSum = (structured.grading_criteria ?? []).reduce((sum, c) => sum + (c.points || 0), 0);
    if (criteriaSum !== raw.points) {
      summary.errors.push(
        `"${pageInfo.title}" zadanie ${raw.nrZad}: kryteria sumują się do ${criteriaSum} zamiast ${raw.points} — pominięto, wymaga ręcznej korekty.`
      );
      continue;
    }

    const sourceMetadata: MathCuratedMetadata & { matemaksId: string } = {
      attribution: `${ATTRIBUTION} — ${pageInfo.title} (${pageInfo.url})`,
      matemaksId: raw.matemaksId,
    };

    const { error } = await supabase.from("math_problems").insert({
      topic_id: topicId,
      content: {
        statement: structured.statement,
        ...(raw.imageUrl ? { imageUrl: raw.imageUrl } : {}),
      },
      difficulty: structured.difficulty >= 3 ? 3 : structured.difficulty <= 1 ? 1 : 2,
      is_proof: !!structured.is_proof,
      points_max: raw.points,
      source: "curated",
      grading_criteria: structured.grading_criteria,
      source_metadata: sourceMetadata,
      created_by: opts?.createdBy ?? null,
    });
    if (error) {
      summary.errors.push(`"${pageInfo.title}" zadanie ${raw.nrZad}: błąd zapisu do bazy — ${error.message}`);
      continue;
    }
    summary.problemsInserted += 1;
  }
}

/** Crawls one dział starting from `startSlug` (following next_temat until
 * the parent dział link changes, MAX_TEMATY_PER_DZIAL is hit, or there's no
 * next link), structuring and inserting every rozszerzony-level problem
 * found as source='curated'. Idempotent per problem: skips a matemaks
 * problem id already imported (checked via source_metadata->>matemaksId),
 * same rationale as importArkusz's per-arkusz skip in import-past-exams.ts
 * — safe/cheap to re-run. Never throws; every failure is caught into
 * summary.errors.
 *
 * NOTE: matemaks.pl actively blocks automated/datacenter requests (403 on
 * every request, confirmed in production — even a confirmed-correct URL
 * fails this way) — this function will currently fail to fetch anything.
 * Kept in the codebase for if that ever changes (site policy, official
 * access, etc.); the SUPPORTED import path today is
 * importMatemaksFromPastedExtraction below, fed by a script the admin runs
 * in their own browser console while normally viewing the page (see
 * MATEMAKS_CONSOLE_SCRIPT) — that never touches matemaks.pl outside of the
 * admin's own regular, legitimate page views. */
export async function importMatemaksDzial(
  supabase: SupabaseClient,
  dzialSlug: string,
  startSlug: string,
  opts?: { createdBy?: string | null }
): Promise<MatemaksImportSummary> {
  const summary: MatemaksImportSummary = {
    dzialSlug,
    tematyVisited: 0,
    problemsFound: 0,
    problemsInserted: 0,
    errors: [],
  };

  const topicIdBySlug = await getTopicIdBySlug(supabase);
  const visited = new Set<string>();
  let currentSlug: string | null = startSlug;

  while (currentSlug && !visited.has(currentSlug) && summary.tematyVisited < MAX_TEMATY_PER_DZIAL) {
    visited.add(currentSlug);
    let page: ParsedTematPage;
    try {
      page = await fetchAndParseTematPage(currentSlug);
    } catch (err) {
      summary.errors.push(`Nie udało się pobrać/przetworzyć strony "${currentSlug}": ${errMessage(err)}`);
      break;
    }
    summary.tematyVisited += 1;

    // Stop once the crawl leaves this dział (a next_temat link can cross
    // into the following dział on the site).
    if (page.dzialSlug && page.dzialSlug !== dzialSlug && summary.tematyVisited > 1) break;

    await structureAndInsertRawProblems(
      supabase,
      topicIdBySlug,
      page.problems,
      { title: page.title, url: `${SITE_ROOT}/${currentSlug}` },
      summary,
      opts
    );

    currentSlug = page.nextSlug;
  }

  return summary;
}

// ----------------------------------------------------------------------------
// Pasted-extraction import — the SUPPORTED path (see importMatemaksDzial's
// header comment on why the live crawler doesn't work against matemaks.pl).
// ----------------------------------------------------------------------------

/** Shape produced by lib/matma/matemaks-console-script.ts's browser script —
 * the admin pastes its JSON output (via clipboard) here. Intentionally the
 * exact same fields as RawMatemaksProblem/ParsedTematPage so validation is
 * a straightforward structural check, not a remapping. */
export interface PastedMatemaksExtraction {
  title: string;
  url: string;
  problems: Array<{
    matemaksId: string;
    nrZad: number;
    points: number | null;
    statementText: string;
    answerText: string | null;
    imageUrl: string | null;
  }>;
}

function isValidExtraction(value: unknown): value is PastedMatemaksExtraction {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (typeof v.title !== "string" || typeof v.url !== "string" || !Array.isArray(v.problems)) return false;
  return v.problems.every(
    (p) =>
      p &&
      typeof p === "object" &&
      typeof (p as Record<string, unknown>).matemaksId === "string" &&
      typeof (p as Record<string, unknown>).nrZad === "number" &&
      typeof (p as Record<string, unknown>).statementText === "string"
  );
}

/** Structures + inserts problems from a PastedMatemaksExtraction (the
 * console script's clipboard output, pasted by the admin as raw JSON text).
 * This is the path that actually works against matemaks.pl's anti-bot
 * blocking — see importMatemaksDzial's header comment. Never throws;
 * validation and every per-problem failure go into summary.errors. */
export async function importMatemaksFromPastedExtraction(
  supabase: SupabaseClient,
  rawJson: string,
  opts?: { createdBy?: string | null }
): Promise<MatemaksImportSummary> {
  const summary: MatemaksImportSummary = {
    dzialSlug: "(wklejone)",
    tematyVisited: 0,
    problemsFound: 0,
    problemsInserted: 0,
    errors: [],
  };

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawJson);
  } catch (err) {
    summary.errors.push(`Wklejony tekst nie jest poprawnym JSON-em: ${errMessage(err)}`);
    return summary;
  }
  if (!isValidExtraction(parsed)) {
    summary.errors.push(
      "Wklejone dane nie mają oczekiwanego kształtu (title/url/problems[]) — upewnij się, że to wynik działania " +
        "skryptu konsoli, wklejony bez modyfikacji."
    );
    return summary;
  }

  summary.dzialSlug = parsed.title || "(wklejone)";
  summary.tematyVisited = 1;

  const topicIdBySlug = await getTopicIdBySlug(supabase);
  await structureAndInsertRawProblems(
    supabase,
    topicIdBySlug,
    parsed.problems,
    { title: parsed.title, url: parsed.url },
    summary,
    opts
  );

  return summary;
}
