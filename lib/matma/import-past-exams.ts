// ============================================================================
// lib/matma/import-past-exams.ts
// ADMIN-RUN bulk import pipeline for real historical CKE "matura rozszerzona
// z matematyki" exam problems (math_problems.source = 'past_exam'). NOT a
// Server Action and NOT invoked during normal app usage/build — this does
// slow, multi-step, network-heavy work (crawl CKE's archive, download PDFs,
// call an LLM per arkusz) that has no place in a web request. It is invoked
// from lib/matma/import-actions.ts's requireAdmin()-gated runPastExamImport.
//
// ----------------------------------------------------------------------------
// REAL CKE URL STRUCTURE — how this was actually verified
// ----------------------------------------------------------------------------
// This sandbox's outbound network egress policy blocks direct HTTP(S) fetches
// to arbitrary hosts (confirmed: WebFetch and raw curl both got a 403 from
// the *session's own egress proxy*, not from CKE, for cke.gov.pl AND for
// unrelated control hosts like en.wikipedia.org/example.com — see the task's
// final report for the full diagnosis). WebSearch, however, runs server-side
// outside that restriction and was used instead to pull real, currently-
// indexed cke.gov.pl / static2.cke.gov.pl URLs and confirm the *actual* file
// layout below. Every URL template comment below cites a concrete real URL
// that was returned by a live WebSearch query during this task (2026-07-22).
//
// CKE has reorganized its arkusz hosting path at least three times across
// 2015-2026 (and clearly does so roughly every 1-2 years), so — rather than
// hardcoding one URL per year and hoping it still resolves — every discover*
// function below builds a small ordered list of REAL, observed URL templates
// per era and PROBES each with a live HTTP request (urlExists), keeping
// whichever one actually resolves. This is deliberately more robust to CKE
// reshuffling paths again than a single guessed template would be, and it
// keeps the discovery function self-correcting without a code change every
// time CKE moves things. Where only ONE real example URL could be found for
// an era (rather than confirmed cross-year stability), that is called out
// below and in the final report as a lower-confidence candidate — it will
// either resolve (great) or simply return null and get flagged as "not
// found", never silently produce a wrong URL that looks plausible.
//
// Confirmed eras for "matematyka, poziom rozszerzony":
//  - Formula 2023 (2023-now, the current core curriculum):
//      2023: cke.gov.pl/images/_EGZAMIN_MATURALNY_OD_2023/Arkusze_egzaminacyjne/2023/Matematyka/poziom_rozszerzony/MMAP-R0-100-2305.pdf
//      2024: cke.gov.pl/images/_EGZAMIN_MATURALNY_OD_2023/Arkusze_egzaminacyjne/2024/Matematyka/poziom_rozszerzony/MMAP-R0-100-A-2405-arkusz.pdf
//            static2.cke.gov.pl/EGZAMIN_MATURALNY/2024/Formula_2023/Matematyka/poziom_rozszerzony/MMAP-R0-100-A-2405-arkusz.pdf (mirror)
//            zasady oceniania: cke.gov.pl/images/_EGZAMIN_MATURALNY_OD_2023/Arkusze_egzaminacyjne/2024/Matematyka/poziom_rozszerzony/MMAP-R0-100-2405-zasady.pdf
//      2026: static2.cke.gov.pl/EGZAMIN_MATURALNY/2026/Matematyka/poziom_rozszerzony/MMAP-R0-100-A-2605-arkusz.pdf (Formula_2023 segment dropped)
//  - Formula 2015 (2015-~2025, administered in parallel to retaking students):
//      2021/2022: cke.gov.pl/images/_EGZAMIN_MATURALNY_OD_2015/Arkusze_egzaminacyjne/2021/Matematyka/poziom_rozszerzony/EMAP-R0-100-2105.pdf
//                 (same path also mirrored on static2.cke.gov.pl)
//      2024: static2.cke.gov.pl/EGZAMIN_MATURALNY/2024/Formula_2015/Matematyka/poziom_rozszerzony/EMAP-R0-100-A-2405-arkusz.pdf
//      2017/2018: a DIFFERENT symbol scheme was found (cke.gov.pl/images/_EGZAMIN_MATURALNY_OD_2015/Arkusze_egzaminacyjne/2018/formula_od_2015/matematyka/MMA-R1_1P-182.pdf) —
//                 kept as a last-resort candidate only; NOT confirmed to be the
//                 main May session vs. a resit/alternate-part variant.
//  - Stara formuła (pre-2015, ~2005-2014): no stable PDF filename convention
//    was found via search (unlike the eras above) — only confirmed INDEX
//    page URLs (cke.gov.pl/egzamin-maturalny/egzamin-w-starej-formule/arkusze/{year}-2/{sesja}-{year}/)
//    and one confirmed klucz filename for 2012
//    (cke.gov.pl/images/_EGZAMIN_MATURALNY_OD_2015/Arkusze_egzaminacyjne/2012/maj/klucze/matemat_pr_klucz.pdf).
//    So discoverStaraFormulaYear() does REAL HTML scraping of those index
//    pages at runtime (fetch + regex link extraction) instead of guessing
//    filenames — the only reliable approach for this era.
//
// Scope decision: only the MAIN "maj" (May) session is targeted for Formula
// 2015/2023 years; August resit ("poprawka") sheets cover the same
// curriculum and are intentionally out of scope to keep discovery bounded —
// see the final task report.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
// Imported from the internal subpath, not the package root — see
// lib/types/pdf-parse.d.ts for why (root index.js has bundler-breaking
// debug code that runs at import time).
import pdfParse from "pdf-parse/lib/pdf-parse.js";
import { askAIForJSON } from "@/lib/ai";
import { getTopics } from "@/lib/matma/content";
import { MATH_TOPIC_SLUGS } from "@/lib/matma/topics";
import type { MathGradingCriterion, MathPastExamMetadata } from "@/lib/types/database";

const CKE_ROOT = "https://cke.gov.pl";
const CKE_STATIC_ROOT = "https://static2.cke.gov.pl";

export interface ArkuszDescriptor {
  year: number;
  /** Polish session label, e.g. "maj", "czerwiec", "sierpień". */
  session: string;
  /** "2023" | "2015" | "stara" — matches MathPastExamMetadata.formula (free text). */
  formula: string;
  problemsPdfUrl: string;
  answerKeyPdfUrl: string | null;
  /** The CKE page this descriptor was discovered from — used for legal
   * attribution in source_metadata.source_url (CKE arkusze require citing
   * the source; this is the only obligation, see product spec). */
  sourceUrl: string;
}

export interface ArkuszImportSummary {
  year: number;
  session: string;
  formula: string;
  problemsFound: number;
  problemsInserted: number;
  errors: string[];
  /** True when this arkusz was already in the database and importArkusz
   * skipped it without spending any network/AI budget — see importArkusz's
   * header comment. Not an error; the UI should render it neutrally. */
  alreadyImported?: boolean;
}

// ----------------------------------------------------------------------------
// Low-level HTTP helpers
// ----------------------------------------------------------------------------

// Kept fairly tight: this fires once per candidate URL (up to ~7 per
// discover*Year() call, see formula2023/2015ArkuszCandidates), and the whole
// admin import UI now runs one YEAR per request (see import-trigger-form.tsx)
// specifically to stay well under typical serverless function time limits —
// a slow-but-alive host should still resolve well inside 10s; anything
// longer is treated as unreachable rather than risking the request itself
// timing out first.
const REQUEST_TIMEOUT_MS = 10_000;
// A real browser UA — some CKE-adjacent hosts / CDNs reject default
// server-side fetch UAs outright.
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

async function timedFetch(url: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: { "User-Agent": USER_AGENT, ...(init?.headers ?? {}) },
    });
  } finally {
    clearTimeout(timeout);
  }
}

/** HEAD first (cheap); some CKE hosts reject HEAD (405) or block it (403), so
 * fall back to a 1-byte ranged GET, which is still cheap and works almost
 * everywhere. */
async function urlExists(url: string): Promise<boolean> {
  try {
    const head = await timedFetch(url, { method: "HEAD" });
    if (head.ok) return true;
    if (head.status !== 405 && head.status !== 403) return false;
  } catch {
    // network error on HEAD — still worth trying a GET below
  }
  try {
    const get = await timedFetch(url, { headers: { Range: "bytes=0-0" } });
    return get.ok || get.status === 206;
  } catch {
    return false;
  }
}

async function firstExistingUrl(candidates: string[]): Promise<string | null> {
  for (const url of candidates) {
    if (await urlExists(url)) return url;
  }
  return null;
}

async function fetchText(url: string): Promise<string | null> {
  try {
    const res = await timedFetch(url);
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function extractHrefs(html: string): string[] {
  const hrefs: string[] = [];
  const re = /href\s*=\s*["']([^"']+)["']/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) hrefs.push(m[1]);
  return hrefs;
}

function resolveUrl(href: string, base: string): string {
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

async function downloadPdfText(url: string): Promise<string> {
  const res = await timedFetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} podczas pobierania ${url}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const parsed = await pdfParse(buffer);
  return parsed.text;
}

function errMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function yy(year: number): string {
  return String(year % 100).padStart(2, "0");
}

// ----------------------------------------------------------------------------
// Discovery — "Formula 2023" (2023-now)
// ----------------------------------------------------------------------------

function formula2023ArkuszCandidates(year: number): string[] {
  const y = yy(year);
  return [
    // 2026+: static2, no per-formula subfolder (confirmed real: MMAP-R0-100-A-2605-arkusz.pdf)
    `${CKE_STATIC_ROOT}/EGZAMIN_MATURALNY/${year}/Matematyka/poziom_rozszerzony/MMAP-R0-100-A-${y}05-arkusz.pdf`,
    // 2024-2025: static2, dual-hosted with Formula_2015 retake track (confirmed real for 2024)
    `${CKE_STATIC_ROOT}/EGZAMIN_MATURALNY/${year}/Formula_2023/Matematyka/poziom_rozszerzony/MMAP-R0-100-A-${y}05-arkusz.pdf`,
    // mirrored under the older /images/ media root (confirmed real for 2024)
    `${CKE_ROOT}/images/_EGZAMIN_MATURALNY_OD_2023/Arkusze_egzaminacyjne/${year}/Matematyka/poziom_rozszerzony/MMAP-R0-100-A-${y}05-arkusz.pdf`,
    // 2023 (first Formula 2023 session): no "-A-"/"-arkusz" suffix (confirmed real: MMAP-R0-100-2305.pdf)
    `${CKE_ROOT}/images/_EGZAMIN_MATURALNY_OD_2023/Arkusze_egzaminacyjne/${year}/Matematyka/poziom_rozszerzony/MMAP-R0-100-${y}05.pdf`,
  ];
}

function formula2023ZasadyCandidates(year: number): string[] {
  const y = yy(year);
  return [
    `${CKE_STATIC_ROOT}/EGZAMIN_MATURALNY/${year}/Matematyka/poziom_rozszerzony/MMAP-R0-100-A-${y}05-zasady.pdf`,
    `${CKE_STATIC_ROOT}/EGZAMIN_MATURALNY/${year}/Formula_2023/Matematyka/poziom_rozszerzony/MMAP-R0-100-A-${y}05-zasady.pdf`,
    // confirmed real exact 2024 filename — note no "-A-" infix on zasady, unlike the arkusz
    `${CKE_ROOT}/images/_EGZAMIN_MATURALNY_OD_2023/Arkusze_egzaminacyjne/${year}/Matematyka/poziom_rozszerzony/MMAP-R0-100-${y}05-zasady.pdf`,
  ];
}

async function discoverFormula2023Year(year: number): Promise<ArkuszDescriptor | null> {
  const problemsPdfUrl = await firstExistingUrl(formula2023ArkuszCandidates(year));
  if (!problemsPdfUrl) return null;
  const answerKeyPdfUrl = await firstExistingUrl(formula2023ZasadyCandidates(year));
  return {
    year,
    session: "maj",
    formula: "2023",
    problemsPdfUrl,
    answerKeyPdfUrl,
    sourceUrl: `${CKE_ROOT}/arkusze/egzamin-maturalny/`,
  };
}

// ----------------------------------------------------------------------------
// Discovery — "Formula 2015" (2015-~2025, retake track)
// ----------------------------------------------------------------------------

function formula2015ArkuszCandidates(year: number): string[] {
  const y = yy(year);
  return [
    `${CKE_STATIC_ROOT}/EGZAMIN_MATURALNY/${year}/Formula_2015/Matematyka/poziom_rozszerzony/EMAP-R0-100-A-${y}05-arkusz.pdf`,
    `${CKE_STATIC_ROOT}/images/_EGZAMIN_MATURALNY_OD_2015/Arkusze_egzaminacyjne/${year}/Matematyka/poziom_rozszerzony/EMAP-R0-100-${y}05.pdf`,
    `${CKE_ROOT}/images/_EGZAMIN_MATURALNY_OD_2015/Arkusze_egzaminacyjne/${year}/Matematyka/poziom_rozszerzony/EMAP-R0-100-${y}05.pdf`,
    // low-confidence fallback for 2015-2018 — see header comment
    `${CKE_ROOT}/images/_EGZAMIN_MATURALNY_OD_2015/Arkusze_egzaminacyjne/${year}/formula_od_2015/matematyka/MMA-R1_1P-${y}2.pdf`,
  ];
}

function formula2015ZasadyCandidates(year: number): string[] {
  const y = yy(year);
  return [
    `${CKE_STATIC_ROOT}/EGZAMIN_MATURALNY/${year}/Formula_2015/Matematyka/poziom_rozszerzony/EMAP-R0-100-A-${y}05-zasady.pdf`,
    `${CKE_ROOT}/images/_EGZAMIN_MATURALNY_OD_2015/Arkusze_egzaminacyjne/${year}/Matematyka/poziom_rozszerzony/EMAP-R0-100-${y}05-zasady.pdf`,
    `${CKE_ROOT}/images/_EGZAMIN_MATURALNY_OD_2015/Arkusze_egzaminacyjne/${year}/formula_od_2015/Zasady_oceniania/MMA-R1_1P-${y}2_zasady_oceniania.pdf`,
  ];
}

async function discoverFormula2015Year(year: number): Promise<ArkuszDescriptor | null> {
  const problemsPdfUrl = await firstExistingUrl(formula2015ArkuszCandidates(year));
  if (!problemsPdfUrl) return null;
  const answerKeyPdfUrl = await firstExistingUrl(formula2015ZasadyCandidates(year));
  return {
    year,
    session: "maj",
    formula: "2015",
    problemsPdfUrl,
    answerKeyPdfUrl,
    sourceUrl: `${CKE_ROOT}/egzamin-maturalny/egzamin-maturalny-w-formule-2015/arkusze/${year}-2/`,
  };
}

// ----------------------------------------------------------------------------
// Discovery — "stara formuła" (pre-2015, ~2005-2014): real HTML scraping,
// since no stable filename pattern was confirmed (see header comment).
// ----------------------------------------------------------------------------

const STARA_FORMULA_SESSION_LABELS: Record<string, string> = {
  maj: "maj",
  czerwiec: "czerwiec",
  sierpien: "sierpień",
};

async function discoverStaraFormulaYear(year: number): Promise<ArkuszDescriptor[]> {
  const indexUrl = `${CKE_ROOT}/egzamin-maturalny/egzamin-w-starej-formule/arkusze/${year}-2/`;
  const html = await fetchText(indexUrl);
  if (!html) return [];

  const sessionUrlPattern = new RegExp(`/arkusze/${year}-2/(maj|czerwiec|sierpien)-${year}/?$`);
  const sessionUrls = [
    ...new Set(extractHrefs(html).map((href) => resolveUrl(href, indexUrl)).filter((url) => sessionUrlPattern.test(url))),
  ];

  const results: ArkuszDescriptor[] = [];
  for (const sessionUrl of sessionUrls) {
    const sessionHtml = await fetchText(sessionUrl);
    if (!sessionHtml) continue;

    const pdfUrls = extractHrefs(sessionHtml)
      .map((href) => resolveUrl(href, sessionUrl))
      .filter((url) => /\.pdf(\?.*)?$/i.test(url));

    // Extended-level math: filename mentions "matemat" + a rozszerzony-level
    // marker, and explicitly NOT the basic-level ("_pp"/"podstaw") variant.
    const isExtendedMath = (url: string) =>
      /matemat/i.test(url) && !/(_pp\b|podstaw)/i.test(url) && /(_pr\b|rozszerz)/i.test(url);
    const isAnswerKey = (url: string) => /(klucz|zasady|odpowied)/i.test(url);

    const mathPdfs = pdfUrls.filter(isExtendedMath);
    const problemsPdfUrl = mathPdfs.find((u) => !isAnswerKey(u));
    if (!problemsPdfUrl) continue;
    const answerKeyPdfUrl = mathPdfs.find(isAnswerKey) ?? null;

    const sessionSlug = /\/(maj|czerwiec|sierpien)-\d{4}\/?$/.exec(sessionUrl)?.[1] ?? "maj";
    results.push({
      year,
      session: STARA_FORMULA_SESSION_LABELS[sessionSlug] ?? sessionSlug,
      formula: "stara",
      problemsPdfUrl,
      answerKeyPdfUrl,
      sourceUrl: sessionUrl,
    });
  }
  return results;
}

// ----------------------------------------------------------------------------
// Discovery — combined entry point
// ----------------------------------------------------------------------------

/** Enumerates every matura-rozszerzona-z-matematyki arkusz CKE currently
 * publishes in [yearFrom, yearTo] across all three formula eras, probing
 * real candidate URLs (Formula 2015/2023) or scraping real index pages
 * (stara formuła) — see the header comment for exactly what's confirmed.
 * Returns only arkusze that were actually found to exist; years with no
 * resolvable arkusz are silently skipped (not an error — CKE simply may
 * not have published under a guessed path, or the exam didn't happen). */
export async function discoverPastExamArkusze(opts?: {
  yearFrom?: number;
  yearTo?: number;
}): Promise<ArkuszDescriptor[]> {
  const currentYear = new Date().getFullYear();
  const yearFrom = Math.max(2005, opts?.yearFrom ?? 2007);
  const yearTo = Math.min(currentYear, opts?.yearTo ?? currentYear);

  const results: ArkuszDescriptor[] = [];
  for (let year = yearFrom; year <= yearTo; year++) {
    // Formula 2023 and Formula 2015 checks are independent (different hosts/
    // paths) — run them concurrently instead of sequentially so a year in
    // the 2023-2025 overlap doesn't pay for both discovery passes back to
    // back (this roughly halves worst-case latency per year, which matters
    // now that the admin UI issues one Server Action call per year).
    const [formula2023, formula2015] = await Promise.all([
      year >= 2023 ? discoverFormula2023Year(year).catch(() => null) : Promise.resolve(null),
      year >= 2015 && year <= 2025 ? discoverFormula2015Year(year).catch(() => null) : Promise.resolve(null),
    ]);
    if (formula2023) results.push(formula2023);
    if (formula2015) results.push(formula2015);
    if (year <= 2014) {
      const found = await discoverStaraFormulaYear(year).catch(() => [] as ArkuszDescriptor[]);
      results.push(...found);
    }
  }
  return results;
}

// ----------------------------------------------------------------------------
// Structuring — raw extracted PDF text -> structured problems via Groq
// ----------------------------------------------------------------------------

interface StructuredExamProblem {
  statement: string;
  imageUrl?: string;
  difficulty: number;
  is_proof: boolean;
  points_max: number;
  topic_slug: string;
  grading_criteria: MathGradingCriterion[];
}

const IMPORT_SYSTEM_PROMPT =
  "Jesteś redaktorem treści CKE porządkującym tekst wyodrębniony z PDF prawdziwego arkusza maturalnego z " +
  "matematyki (poziom rozszerzony) w ustrukturyzowane dane. Otrzymujesz surowy tekst arkusza (ekstrakcja z PDF — " +
  "może zawierać złamane linie, brakujące/zniekształcone symbole matematyczne i polskie znaki diakrytyczne) oraz, " +
  "jeśli dostępny, tekst zasad oceniania/klucza odpowiedzi dla tego samego arkusza. Zasady: " +
  "1) Wyodrębnij KAŻDE osobne zadanie („Zadanie N.”) jako osobny obiekt — pomiń stronę tytułową, instrukcję dla " +
  "zdającego i tablice wzorów. " +
  "2) statement: pełna treść zadania PO POLSKU, popraw ewentualne zniekształcenia ekstrakcji (np. brakujące ą ę ł " +
  "ń ó ś ź ż), wzory matematyczne zapisz w LaTeX ($...$ dla wzorów w tekście, $$...$$ dla wzorów blokowych). " +
  "3) difficulty: ZAWSZE 2 albo 3 — prawdziwe zadania maturalne nigdy nie są difficulty=1. Zadanie rutynowe/" +
  "jednoetapowe -> 2, zadanie wieloetapowe lub nietypowe -> 3. " +
  "4) is_proof: true TYLKO gdy polecenie brzmi „Udowodnij”, „Wykaż, że” lub równoważnie. " +
  "5) points_max: maksymalna liczba punktów za to zadanie zgodnie z arkuszem/kluczem. " +
  `6) topic_slug: DOKŁADNIE jeden z: ${MATH_TOPIC_SLUGS.join(", ")}. ` +
  "7) grading_criteria: analityczny schemat punktowania w stylu CKE (krok + opis + liczba punktów), zgodny z " +
  "podanym kluczem/zasadami oceniania jeśli dostępne; jeśli klucz niedostępny, skonstruuj rozsądny schemat " +
  "(założenie/metoda, przekształcenie, wynik). SUMA points we wszystkich krokach MUSI być równa points_max — to " +
  "twardy wymóg. " +
  "8) Jeśli fragment jest zbyt zniekształcony by wiernie go odtworzyć (np. zadanie geometryczne opisane przez " +
  "nieczytelne dane z rysunku), i tak zwróć najlepszą możliwą próbę — administrator przejrzy i poprawi wynik " +
  "ręcznie, nie musisz być idealny. " +
  "9) KRYTYCZNE dla poprawności JSON: pola statement/step/description trafiają do pól typu string w JSON, więc " +
  "KAŻDY pojedynczy znak backslash użyty w komendzie LaTeX MUSI być zapisany jako PODWÓJNY backslash — np. " +
  "zamiast \\frac napisz \\\\frac, zamiast \\left( napisz \\\\left(, zamiast \\sqrt napisz \\\\sqrt. Jeśli " +
  "zostawisz pojedynczy backslash, wygenerowany JSON będzie niepoprawny i cała odpowiedź zostanie odrzucona.";

const IMPORT_SCHEMA = {
  problems: {
    type: "array",
    description: "Lista zadań wyodrębnionych z arkusza maturalnego (jeden obiekt na jedno „Zadanie N.”).",
    items: {
      type: "object",
      properties: {
        statement: { type: "string", description: "Pełna treść zadania po polsku, wzory w LaTeX." },
        difficulty: { type: "number", description: "2 lub 3." },
        is_proof: { type: "boolean" },
        points_max: { type: "number" },
        topic_slug: { type: "string", description: `Jeden z: ${MATH_TOPIC_SLUGS.join(", ")}` },
        grading_criteria: {
          type: "array",
          description: "Schemat punktowania — suma points musi równać się points_max.",
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
      },
      required: ["statement", "difficulty", "is_proof", "points_max", "topic_slug", "grading_criteria"],
    },
  },
};

// Groq's FREE on-demand tier caps a single request at ~12,000 tokens total
// (system + schema + prompt + requested completion) — confirmed in
// production by a real "413 Request too large ... Limit 12000, Requested
// 12566" failure. An earlier version of this file reacted by shrinking
// MAX_PROMPT_CHARS all the way down to 6,000 — but that silently TRUNCATED
// real arkusze mid-arkusz (a full rozszerzony arkusz's problem text easily
// runs past that), so the AI only ever saw the first ~3 zadania of a real
// ~14-zadanie arkusz and correctly extracted only those. Once the account
// is on a paid tier (removes the 12k/request ceiling; the model's actual
// context window is 128k tokens), the right fix is a MUCH higher ceiling
// so truncation essentially never triggers for a real arkusz — these
// numbers are sized generously (est. ~1.6 chars/token for Polish text) with
// real headroom under a 128k-token context, not tuned to any specific rate
// limit. If a future run ever needs the free tier again, lower these back
// down — but prefer processing fewer arkusze per day over silently
// dropping most of an arkusz's problems.
const MAX_PROMPT_CHARS = 40_000;
const MAX_ANSWER_KEY_CHARS = 25_000;
const DEFAULT_MAX_COMPLETION_TOKENS = 12_000;
const RETRY_MAX_COMPLETION_TOKENS = 6_000;

function truncate(text: string, maxChars: number): string {
  return text.length > maxChars ? `${text.slice(0, maxChars)}\n[...treść obcięta...]` : text;
}

function buildStructurePrompt(
  problemsText: string,
  answerKeyText: string,
  descriptor: Pick<ArkuszDescriptor, "year" | "session" | "formula">,
  promptChars: number,
  answerChars: number
): string {
  return (
    `Rok: ${descriptor.year}, sesja: ${descriptor.session}, formuła: ${descriptor.formula}.\n\n` +
    `--- TEKST ARKUSZA (wyodrębniony z PDF) ---\n${truncate(problemsText, promptChars)}\n\n` +
    (answerKeyText
      ? `--- TEKST ZASAD OCENIANIA / KLUCZA ODPOWIEDZI (wyodrębniony z PDF) ---\n${truncate(answerKeyText, answerChars)}`
      : "--- Brak dostępnego klucza odpowiedzi — skonstruuj rozsądny schemat punktowania. ---")
  );
}

async function structureExamProblems(
  problemsText: string,
  answerKeyText: string,
  descriptor: Pick<ArkuszDescriptor, "year" | "session" | "formula">
): Promise<StructuredExamProblem[]> {
  try {
    const result = await askAIForJSON<{ problems: StructuredExamProblem[] }>({
      system: IMPORT_SYSTEM_PROMPT,
      prompt: buildStructurePrompt(problemsText, answerKeyText, descriptor, MAX_PROMPT_CHARS, MAX_ANSWER_KEY_CHARS),
      schema: IMPORT_SCHEMA,
      maxTokens: DEFAULT_MAX_COMPLETION_TOKENS,
    });
    return result.problems ?? [];
  } catch (err) {
    // One retry with a much smaller prompt/completion budget — recovers
    // from both failure modes above (over-budget input, truncated output)
    // at the cost of possibly dropping a few problems from a very long
    // arkusz, which is preferable to losing the whole arkusz.
    console.error(
      `[matma] structureExamProblems failed for ${descriptor.year}/${descriptor.session}, retrying smaller:`,
      err
    );
    const result = await askAIForJSON<{ problems: StructuredExamProblem[] }>({
      system: IMPORT_SYSTEM_PROMPT,
      prompt: buildStructurePrompt(
        problemsText,
        answerKeyText,
        descriptor,
        Math.floor(MAX_PROMPT_CHARS / 2),
        Math.floor(MAX_ANSWER_KEY_CHARS / 2)
      ),
      schema: IMPORT_SCHEMA,
      maxTokens: RETRY_MAX_COMPLETION_TOKENS,
    });
    return result.problems ?? [];
  }
}

// ----------------------------------------------------------------------------
// Import — one arkusz -> N math_problems rows
// ----------------------------------------------------------------------------

async function getTopicIdBySlug(supabase: SupabaseClient): Promise<Map<string, string>> {
  const topics = await getTopics(supabase);
  return new Map(topics.map((t) => [t.slug, t.id]));
}

/** Downloads both PDFs for one arkusz, extracts text, asks the AI to
 * structure it, and inserts each resulting problem as source='past_exam'.
 * Never throws — every failure (download, extraction, AI, per-problem
 * validation, insert) is caught and pushed into summary.errors so ONE bad
 * arkusz/problem can't fail the whole batch; callers (runPastExamImport)
 * surface summary.errors in the admin UI for manual correction.
 *
 * IDEMPOTENT BY DEFAULT: bails out immediately (before any download or AI
 * call) if this exact (year, session, formula) already has past_exam rows
 * — makes it safe and cheap to just re-run the same broad year range after
 * hitting Groq's daily token cap; already-done years cost one quick DB
 * count instead of a full download+parse+LLM pass, and re-runs can't
 * create duplicate rows. Pass `force: true` to instead DELETE those
 * existing rows and re-import fresh — needed because "already has rows"
 * doesn't mean "fully/correctly imported": an earlier bug (since fixed)
 * silently truncated long arkusze to their first ~3 zadania, and those
 * partial imports would otherwise be permanently skipped forever. */
export async function importArkusz(
  supabase: SupabaseClient,
  descriptor: ArkuszDescriptor,
  opts?: { createdBy?: string | null; force?: boolean }
): Promise<ArkuszImportSummary> {
  const summary: ArkuszImportSummary = {
    year: descriptor.year,
    session: descriptor.session,
    formula: descriptor.formula,
    problemsFound: 0,
    problemsInserted: 0,
    errors: [],
  };

  const existingQuery = supabase
    .from("math_problems")
    .select("id", { count: "exact", head: true })
    .eq("source", "past_exam")
    .eq("source_metadata->>year", String(descriptor.year))
    .eq("source_metadata->>session", descriptor.session)
    .eq("source_metadata->>formula", descriptor.formula);

  if (opts?.force) {
    // Delete first so a re-import can't leave old + new rows side by side.
    await supabase
      .from("math_problems")
      .delete()
      .eq("source", "past_exam")
      .eq("source_metadata->>year", String(descriptor.year))
      .eq("source_metadata->>session", descriptor.session)
      .eq("source_metadata->>formula", descriptor.formula);
  } else {
    const { count: existingCount } = await existingQuery;
    if (existingCount && existingCount > 0) {
      summary.problemsFound = existingCount;
      summary.problemsInserted = 0;
      summary.alreadyImported = true;
      return summary;
    }
  }

  let problemsText: string;
  try {
    problemsText = await downloadPdfText(descriptor.problemsPdfUrl);
  } catch (err) {
    summary.errors.push(`Nie udało się pobrać/odczytać arkusza (${descriptor.problemsPdfUrl}): ${errMessage(err)}`);
    return summary;
  }

  let answerKeyText = "";
  if (descriptor.answerKeyPdfUrl) {
    try {
      answerKeyText = await downloadPdfText(descriptor.answerKeyPdfUrl);
    } catch (err) {
      summary.errors.push(
        `Nie udało się pobrać/odczytać klucza odpowiedzi — arkusz zaimportowany bez niego (mniej dokładny schemat ` +
          `punktowania): ${errMessage(err)}`
      );
    }
  }

  let structured: StructuredExamProblem[];
  try {
    structured = await structureExamProblems(problemsText, answerKeyText, descriptor);
  } catch (err) {
    summary.errors.push(`AI nie ustrukturyzowało treści arkusza: ${errMessage(err)}`);
    return summary;
  }

  summary.problemsFound = structured.length;
  if (structured.length === 0) {
    summary.errors.push("AI nie zwróciło żadnych zadań — arkusz wymaga ręcznego dodania (adminUpsertProblem).");
    return summary;
  }

  const topicIdBySlug = await getTopicIdBySlug(supabase);
  const fallbackTopicId = topicIdBySlug.get(MATH_TOPIC_SLUGS[0]);
  const baseSourceMetadata = {
    year: descriptor.year,
    session: descriptor.session,
    formula: descriptor.formula,
    source_url: descriptor.problemsPdfUrl,
  };

  for (let i = 0; i < structured.length; i++) {
    const p = structured[i];
    const label = `Zadanie ${i + 1}`;
    let needsReview = false;

    // Nierozpoznany dział przez AI nie oznacza, że zadanie jest bezużyteczne
    // — zapisujemy je pod domyślnym działem i flagujemy do przeglądu, zamiast
    // tracić całą treść (jw. import-curated-matemaks.ts — użytkownik wprost
    // poprosił, by import z CKE też nigdy po cichu nie pomijał zadań).
    let topicId = topicIdBySlug.get(p.topic_slug);
    if (!topicId) {
      if (!fallbackTopicId) {
        summary.errors.push(`${label}: nierozpoznany dział „${p.topic_slug}” i brak działu domyślnego — pominięto.`);
        continue;
      }
      topicId = fallbackTopicId;
      needsReview = true;
      summary.errors.push(
        `${label}: nierozpoznany dział „${p.topic_slug}” — zapisano pod domyślnym działem, wymaga przeglądu.`
      );
    }

    // Brak treści lub punktacji czyni zadanie nie do ocenienia — to jedyny
    // przypadek, w którym nadal pomijamy (nie ma czego zapisać/ocenić).
    if (!p.statement?.trim() || !p.points_max || p.points_max <= 0) {
      summary.errors.push(`${label}: brak treści lub nieprawidłowa punktacja — pominięto, wymaga ręcznego dodania.`);
      continue;
    }

    let gradingCriteria = p.grading_criteria ?? [];
    const criteriaSum = gradingCriteria.reduce((sum, c) => sum + (c.points || 0), 0);
    if (criteriaSum !== p.points_max) {
      needsReview = true;
      summary.errors.push(
        `${label}: kryteria oceniania sumowały się do ${criteriaSum} pkt zamiast ${p.points_max} — skorygowano ` +
          `automatycznie, wymaga przeglądu (adminUpsertProblem).`
      );
      gradingCriteria =
        gradingCriteria.length === 0
          ? [{ step: "Całe zadanie", points: p.points_max, description: "Brak schematu punktowania od AI — wymaga przeglądu." }]
          : (() => {
              const adjusted = [...gradingCriteria];
              const lastIndex = adjusted.length - 1;
              adjusted[lastIndex] = {
                ...adjusted[lastIndex],
                points: Math.max(0, (adjusted[lastIndex].points || 0) + (p.points_max - criteriaSum)),
              };
              return adjusted;
            })();
    }

    const sourceMetadata: MathPastExamMetadata = needsReview
      ? { ...baseSourceMetadata, needsReview: true }
      : baseSourceMetadata;

    const { error } = await supabase.from("math_problems").insert({
      topic_id: topicId,
      content: { statement: p.statement, ...(p.imageUrl ? { imageUrl: p.imageUrl } : {}) },
      difficulty: p.difficulty >= 3 ? 3 : 2,
      is_proof: !!p.is_proof,
      points_max: p.points_max,
      source: "past_exam",
      grading_criteria: gradingCriteria,
      source_metadata: sourceMetadata,
      created_by: opts?.createdBy ?? null,
    });
    if (error) {
      summary.errors.push(`${label}: błąd zapisu do bazy — ${error.message}`);
      continue;
    }
    summary.problemsInserted += 1;
  }

  return summary;
}

// ----------------------------------------------------------------------------
// Coverage read — for the admin page's "how much have we imported so far"
// ----------------------------------------------------------------------------

/** math_problems counts where source='past_exam', grouped by the `year`
 * field INSIDE source_metadata (a direct jsonb field query via PostgREST's
 * `column->key` select syntax) — lets the admin see cumulative coverage
 * across multiple import runs without re-deriving it client-side from every
 * row's full source_metadata blob. */
export async function getPastExamYearCoverage(supabase: SupabaseClient): Promise<Array<{ year: number; count: number }>> {
  const { data } = await supabase
    .from("math_problems")
    .select("year:source_metadata->year")
    .eq("source", "past_exam");

  const counts = new Map<number, number>();
  for (const row of (data ?? []) as Array<{ year: number | null }>) {
    if (row.year == null) continue;
    counts.set(row.year, (counts.get(row.year) ?? 0) + 1);
  }
  return [...counts.entries()].map(([year, count]) => ({ year, count })).sort((a, b) => b.year - a.year);
}
