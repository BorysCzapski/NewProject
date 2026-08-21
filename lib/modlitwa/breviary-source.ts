// ============================================================================
// lib/modlitwa/breviary-source.ts
// Pobranie PEŁNYCH tekstów Liturgii Godzin z Internetowej Liturgii Godzin
// (brewiarz.pl) — hymn, psalmodia z antyfonami, czytanie, responsorium,
// kantyk, prośby i modlitwa dnia.
//
// Prawa autorskie: teksty Liturgii Godzin © Konferencja Episkopatu Polski i
// Wydawnictwo Pallottinum, opracowanie i edycja © ILG (brewiarz.pl). Aplikacja
// ich NIE przepisuje ani nie redaguje — pobiera je z serwisu i cache'uje, a
// każdy ekran pokazuje źródło wraz z notą copyright (patrz SOURCE_COPYRIGHT).
//
// Adresy w ILG mają postać:
//   https://brewiarz.pl/<rzymski_miesiąc>_<rr>/<DDMM><wariant>/<godzina>.php3
// gdzie <wariant> jest pusty, gdy dzień ma jeden obchód, albo „p” / „w1”…„w6”,
// gdy do wyboru jest kilka (wspomnienie dowolne, święto własne diecezji itd.).
// Listę wariantów podaje strona dnia `/<DDMM>/index.php3`.
//
// Dwie pułapki tego serwisu, obie obsłużone niżej:
//   1. Strony deklarują ISO-8859-2, ale część wstawek (np. „LG tom IV: Środa
//      IV, str. 911”) jest w UTF-8 — czyste dekodowanie latin-2 daje „Ĺroda”.
//      repairMixedEncoding() naprawia dokładnie te sekwencje.
//   2. Teksty starsze niż mniej więcej tydzień oddają 401, a odległe przyszłe
//      przekierowują do premium.brewiarz.pl. To NIE jest błąd aplikacji —
//      wołający dostaje null i pokazuje przewodnik po strukturze godziny.
// ============================================================================
import "server-only";
import * as cheerio from "cheerio";
import type { HourId } from "@/lib/modlitwa/hours";

export const SOURCE_NAME = "brewiarz.pl — Internetowa Liturgia Godzin";
export const SOURCE_COPYRIGHT =
  "Teksty Liturgii Godzin © Konferencja Episkopatu Polski i Wydawnictwo Pallottinum; opracowanie i edycja © ILG (brewiarz.pl).";

const USER_AGENT = "PhoenixModlitwa/1.0 (prayer app; contact via instance owner)";
const FETCH_TIMEOUT_MS = 12_000;

const ROMAN_MONTHS = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii"];

/** Nazwa pliku w ILG dla każdej godziny. */
const HOUR_FILES: Record<HourId, string> = {
  wezwanie: "wezw",
  "godzina-czytan": "godzczyt",
  jutrznia: "jutrznia",
  przedpoludniowa: "modlitwa1",
  poludniowa: "modlitwa2",
  popoludniowa: "modlitwa3",
  nieszpory: "nieszpory",
  kompleta: "kompleta",
};

/** Kotwica w HTML -> tytuł sekcji. „piesn” zależy od godziny (patrz canticleTitle). */
const SECTION_TITLES: Record<string, string> = {
  hymn: "Hymn",
  psalm: "Psalmodia",
  czyt: "Czytanie",
  czyt1: "I czytanie",
  czyt2: "II czytanie",
  resp: "Responsorium krótkie",
  resp1: "Responsorium",
  resp2: "Responsorium",
  prosby: "Prośby",
  modl: "Modlitwa",
  ant: "Antyfona maryjna",
};

function canticleTitle(hourId: HourId): string {
  if (hourId === "jutrznia") return "Pieśń Zachariasza";
  if (hourId === "nieszpory") return "Pieśń Maryi";
  if (hourId === "kompleta") return "Pieśń Symeona";
  return "Pieśń";
}

// ---------------------------------------------------------------------------
// Kodowanie
// ---------------------------------------------------------------------------

/**
 * Mapa „tekst UTF-8 zdekodowany jako ISO-8859-2” -> właściwy znak. Budowana
 * z listy polskich liter, więc nie zgaduje: naprawia wyłącznie te sekwencje,
 * które faktycznie powstają z podwójnego kodowania.
 */
const MOJIBAKE = (() => {
  const letters = "ąćęłńóśźżĄĆĘŁŃÓŚŹŻ„”–—…";
  const encoder = new TextEncoder();
  const latin2 = new TextDecoder("iso-8859-2");
  const pairs: Array<[string, string]> = [];
  for (const letter of letters) {
    const broken = latin2.decode(encoder.encode(letter));
    if (broken !== letter) pairs.push([broken, letter]);
  }
  // Najdłuższe sekwencje najpierw — inaczej krótsza mogłaby zjeść fragment dłuższej.
  return pairs.sort((a, b) => b[0].length - a[0].length);
})();

export function repairMixedEncoding(text: string): string {
  let out = text;
  for (const [broken, fixed] of MOJIBAKE) out = out.replaceAll(broken, fixed);
  return out;
}

// ---------------------------------------------------------------------------
// Model wyniku
// ---------------------------------------------------------------------------

/** Fragment wiersza. `rubric` = tekst czerwony w brewiarzu (rubryki, K./W.). */
export interface BreviarySegment {
  t: string;
  r?: boolean;
}

export interface BreviarySection {
  id: string;
  title: string;
  lines: BreviarySegment[][];
}

export interface BreviaryHourContent {
  /** Np. „BŁ. GWERYKA, OPATA” albo „Środa XX tygodnia Okresu Zwykłego”. */
  title: string | null;
  /** Np. „Wspomnienie obowiązkowe”. */
  subtitle: string | null;
  sections: BreviarySection[];
  sourceUrl: string;
  variant: string;
}

export interface BreviaryVariant {
  /** „” (brak wariantów), „p”, „w1”… */
  id: string;
  label: string;
}

// ---------------------------------------------------------------------------
// Adresy
// ---------------------------------------------------------------------------

function dayPath(dateKey: string): { month: string; ddmm: string } {
  const [year, month, day] = dateKey.split("-");
  return {
    month: `${ROMAN_MONTHS[Number(month) - 1]}_${year.slice(2)}`,
    ddmm: `${day}${month}`,
  };
}

export function breviaryUrl(dateKey: string, hourId: HourId, variant: string): string {
  const { month, ddmm } = dayPath(dateKey);
  return `https://brewiarz.pl/${month}/${ddmm}${variant}/${HOUR_FILES[hourId]}.php3`;
}

export function breviaryDayUrl(dateKey: string): string {
  const { month, ddmm } = dayPath(dateKey);
  return `https://brewiarz.pl/${month}/${ddmm}/index.php3`;
}

// ---------------------------------------------------------------------------
// Pobieranie
// ---------------------------------------------------------------------------

/**
 * Pobiera stronę ILG. `redirect: "manual"` jest istotne: odległe daty ILG
 * przekierowuje do premium.brewiarz.pl, a tam i tak nie mamy dostępu — lepiej
 * potraktować to jako „brak tekstu” niż czekać na timeout połączenia.
 */
async function fetchIlgPage(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: { "user-agent": USER_AGENT },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      redirect: "manual",
      cache: "no-store",
    });

    if (response.status >= 300 && response.status < 400) return null; // premium
    if (!response.ok) return null; // 401 = archiwum, 404 = brak dnia

    const html = repairMixedEncoding(
      new TextDecoder("iso-8859-2").decode(await response.arrayBuffer())
    );
    return html.includes("class=ww") ? html : null;
  } catch (error) {
    console.error(`[modlitwa] brewiarz fetch failed ${url}:`, error);
    return null;
  }
}

/**
 * Warianty obchodu na dany dzień. Pusta lista = dzień ma jeden formularz i
 * pliki godzin leżą wprost w katalogu dnia (wariant "").
 */
export async function fetchVariants(dateKey: string): Promise<BreviaryVariant[]> {
  const { ddmm } = dayPath(dateKey);
  const url = breviaryDayUrl(dateKey);

  let html: string | null = null;
  try {
    const response = await fetch(url, {
      headers: { "user-agent": USER_AGENT },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      redirect: "manual",
      cache: "no-store",
    });
    if (!response.ok) return [];
    html = repairMixedEncoding(new TextDecoder("iso-8859-2").decode(await response.arrayBuffer()));
  } catch {
    return [];
  }

  const $ = cheerio.load(html);
  const found = new Map<string, string>();

  $("a").each((_i, el) => {
    const href = $(el).attr("href") ?? "";
    const match = new RegExp(`^\\.\\./${ddmm}(p|w\\d)/`).exec(href);
    if (!match) return;
    const label = $(el).text().replace(/\s+/g, " ").trim();
    if (!label) return;
    // Pierwsza etykieta wygrywa: strona dnia powtarza te same linki w menu.
    if (!found.has(match[1])) found.set(match[1], label);
  });

  return [...found.entries()].map(([id, label]) => ({ id, label }));
}

// ---------------------------------------------------------------------------
// Parser
// ---------------------------------------------------------------------------

const SKIP_LINE_PATTERNS = [
  /W wersji PREMIUM/i,
  /Możliwość wydruku dostępna/i,
  /wersji premium/i,
  /^Pomoc$/i,
];

/**
 * Minimalny opis węzła DOM-u, jakiego potrzebuje walk(). Własny typ zamiast
 * typów cheerio, bo ta wersja pakietu nie re-eksportuje `AnyNode`/`Element`,
 * a jedyne, czego tu używamy, to nazwa tagu, atrybuty, tekst i dzieci.
 */
interface DomNode {
  type: string;
  name?: string;
  data?: string;
  attribs?: Record<string, string>;
  children?: DomNode[];
}

interface RawEvent {
  kind: "anchor" | "text" | "break";
  value: string;
  rubric?: boolean;
}

/** Spłaszcza komórkę treści do strumienia zdarzeń: kotwice, tekst, końce linii. */
function collectEvents($: cheerio.CheerioAPI, root: cheerio.Cheerio<never>): RawEvent[] {
  const events: RawEvent[] = [];

  function walk(node: DomNode, rubric: boolean) {
    if (node.type === "text") {
      const value = (node.data ?? "").replace(/\s+/g, " ");
      if (value.trim()) events.push({ kind: "text", value, rubric });
      return;
    }
    if (node.type !== "tag" || !node.name) return;

    // Zawężenie z warunku wyżej nie przechodzi przez przypisanie, stąd jawny typ.
    const el = node as DomNode & { name: string };
    const tag = el.name.toLowerCase();

    if (tag === "script" || tag === "style" || tag === "img") return;

    if (tag === "a") {
      const name = el.attribs?.name;
      if (name) events.push({ kind: "anchor", value: name });
      // Nagłówki sekcji („HYMN”, „PSALMODIA”) są linkami „do góry” — tytuł
      // bierzemy z mapy kotwic, więc sam link pomijamy.
      if (el.attribs?.href === "#top") return;
    }

    if (tag === "br") {
      events.push({ kind: "break", value: "" });
      return;
    }

    const isRubric =
      rubric ||
      (tag === "font" && (el.attribs?.color ?? "").toLowerCase() === "red") ||
      (el.attribs?.class ?? "").split(/\s+/).includes("zak");

    for (const child of el.children ?? []) walk(child, isRubric);

    if (["div", "p", "tr", "table", "h1", "h2", "h3"].includes(tag)) {
      events.push({ kind: "break", value: "" });
    }
  }

  root.each((_i, el) => walk(el as unknown as DomNode, false));
  return events;
}

/** Zamienia strumień zdarzeń na sekcje z wierszami. */
function buildSections(events: RawEvent[], hourId: HourId): BreviarySection[] {
  const sections: BreviarySection[] = [];
  let current: BreviarySection = {
    id: "wstep",
    // Wezwanie nie ma w ILG żadnych kotwic — cała treść to jedna sekcja, więc
    // nazywamy ją wprost, zamiast zostawiać mylące „Wprowadzenie”.
    title: hourId === "wezwanie" ? "Wezwanie" : "Wprowadzenie",
    lines: [],
  };
  let line: BreviarySegment[] = [];

  function flushLine() {
    const text = line.map((s) => s.t).join("").replace(/\s+/g, " ").trim();
    if (text && !SKIP_LINE_PATTERNS.some((p) => p.test(text))) {
      // Scal sąsiadujące fragmenty o tym samym kolorze — mniej śmieci w JSON.
      const merged: BreviarySegment[] = [];
      for (const segment of line) {
        const value = segment.t;
        if (!value.trim() && merged.length === 0) continue;
        const last = merged[merged.length - 1];
        if (last && Boolean(last.r) === Boolean(segment.r)) last.t += value;
        else merged.push({ t: value, ...(segment.r ? { r: true } : {}) });
      }
      const trimmed = merged
        .map((s, i) => ({ ...s, t: i === 0 ? s.t.replace(/^\s+/, "") : s.t }))
        .map((s, i, arr) => ({ ...s, t: i === arr.length - 1 ? s.t.replace(/\s+$/, "") : s.t }))
        .filter((s) => s.t !== "");
      if (trimmed.length > 0) current.lines.push(trimmed);
    }
    line = [];
  }

  function flushSection() {
    flushLine();
    if (current.lines.length > 0) sections.push(current);
  }

  for (const event of events) {
    if (event.kind === "anchor") {
      // „top” i „dalej” to kotwice nawigacyjne, nie początki sekcji.
      if (event.value === "top" || event.value === "dalej") continue;
      const title = event.value === "piesn" ? canticleTitle(hourId) : SECTION_TITLES[event.value];
      if (!title) continue;
      flushSection();
      current = { id: event.value, title, lines: [] };
      continue;
    }
    if (event.kind === "break") {
      flushLine();
      continue;
    }
    line.push({ t: event.value, ...(event.rubric ? { r: true } : {}) });
  }

  flushSection();
  return sections;
}

/**
 * Kontener treści w ILG to tabela `width=490` — i tylko ona. Nie da się iść po
 * `td.ww`, bo część komórek (m.in. z kotwicami „czytanie” i „pieśń”) tej klasy
 * nie ma; menu i stopka używają innych szerokości, więc filtr jest ostry.
 * Godzina czytań rozbija treść na kilka takich tabel — stąd zbiór, nie jedna.
 */
function contentTables($: cheerio.CheerioAPI): cheerio.Cheerio<never> {
  const tables = $("table").filter((_i, el) => {
    if ($(el).attr("width") !== "490") return false;
    // Tabela zagnieżdżona w innej tabeli treści byłaby policzona dwa razy.
    return $(el).parents("table[width=490]").length === 0;
  });
  return (tables.length > 0 ? tables : $("td.ww")) as unknown as cheerio.Cheerio<never>;
}

export function parseBreviaryHtml(
  html: string,
  hourId: HourId,
  sourceUrl: string,
  variant: string
): BreviaryHourContent | null {
  const $ = cheerio.load(html);
  const roots = contentTables($);
  if (roots.length === 0) return null;

  const sections = buildSections(collectEvents($, roots), hourId);
  if (sections.length === 0) return null;

  // Nagłówek dnia stoi nad tabelą treści: nazwa obchodu i jego ranga.
  const headerLines = $("div.d, div.t, div.s")
    .map((_i, el) => $(el).text().replace(/\s+/g, " ").trim())
    .get()
    .filter(Boolean);

  const title = headerLines.find((l) => /^[A-ZĄĆĘŁŃÓŚŹŻ][^a-ząćęłńóśźż]{3,}/.test(l)) ?? null;
  const subtitle =
    headerLines.find((l) => /^(Wspomnienie|Święto|Uroczystość|Dzień powszedni)/i.test(l)) ?? null;

  return { title, subtitle, sections, sourceUrl, variant };
}

/**
 * Pełny tekst godziny na dany dzień. Zwraca null, gdy ILG nie udostępnia tego
 * dnia (archiwum/premium) albo gdy sieć zawiodła — wtedy UI pokazuje
 * przewodnik po strukturze godziny zamiast pustego ekranu.
 */
export async function fetchBreviaryHour(
  dateKey: string,
  hourId: HourId,
  variant?: string
): Promise<BreviaryHourContent | null> {
  // Kolejność prób: podany wariant -> brak wariantu -> „p” -> pierwszy z listy.
  const candidates: string[] = [];
  if (variant !== undefined) candidates.push(variant);
  else candidates.push("", "p");

  for (const candidate of candidates) {
    const url = breviaryUrl(dateKey, hourId, candidate);
    const html = await fetchIlgPage(url);
    if (html) {
      const parsed = parseBreviaryHtml(html, hourId, url, candidate);
      if (parsed) return parsed;
    }
  }

  if (variant === undefined) {
    const variants = await fetchVariants(dateKey);
    for (const option of variants) {
      const url = breviaryUrl(dateKey, hourId, option.id);
      const html = await fetchIlgPage(url);
      if (!html) continue;
      const parsed = parseBreviaryHtml(html, hourId, url, option.id);
      if (parsed) return parsed;
    }
  }

  return null;
}
