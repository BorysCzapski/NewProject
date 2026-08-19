// ============================================================================
// lib/geografia/lesson-blocks.ts
// Block types for interactive geography lessons. A lesson is an ordered list
// of serializable blocks (safe to pass Server -> Client), same shape as
// lib/matma/lesson-blocks.ts but with the interaction types geography
// actually needs instead of math's function plots and solids.
//
// DESIGN RULE — no free-form SVG. Every visual block is a PARAMETRIC
// primitive whose renderer we hand-wrote (layers / concentric / cycle /
// zones / climate-chart / population-pyramid / chart / map-explore);
// authored content supplies only DATA (names, ranges, values, prose), never
// drawing instructions. Same reasoning as Matma's fixed `solid3d` shapes:
// authored (and especially AI-generated) content can be trusted with facts
// and labels, but not with coordinate geometry that silently renders broken.
//
// TEXT FIELDS carry lightweight markup rendered by components/geografia/
// lesson/rich-text.tsx:
//   **pogrubienie**  -> key term emphasis (used heavily — geography is
//                       vocabulary-dense and bolding the term being defined
//                       is the single most useful didactic affordance here)
//   $KaTeX$          -> inline formula (przyrost naturalny, gradient, skala)
// Plain prose otherwise; no HTML.
// ============================================================================

export interface GeoQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/** One of the 12 months' worth of climate data, Jan..Dec. */
export type MonthlySeries = [
  number, number, number, number, number, number,
  number, number, number, number, number, number,
];

export type GeoBlock =
  // ——— prose / reference ———
  | { type: "intro"; text: string }
  | { type: "definition"; term: string; text: string; note?: string }
  | {
      type: "key-numbers";
      title?: string;
      items: { value: string; unit?: string; label: string; note?: string }[];
    }
  | {
      type: "formula";
      title?: string;
      /** KaTeX source, no delimiters. */
      expression: string;
      variables?: { symbol: string; meaning: string }[];
      caption?: string;
    }
  | { type: "table"; title?: string; caption?: string; headers: string[]; rows: string[][] }
  | {
      type: "compare";
      title: string;
      leftLabel: string;
      rightLabel: string;
      rows: { aspect: string; left: string; right: string }[];
    }
  | {
      type: "classification";
      title: string;
      caption?: string;
      groups: { name: string; description: string; examples: string[] }[];
    }
  | { type: "case-study"; title: string; region: string; text: string; takeaway: string }
  | { type: "mnemonic"; title?: string; text: string; expansion?: string }
  | { type: "tip"; variant: "tip" | "warning" | "exam"; text: string }

  // ——— interactive: click/reveal to explore ———
  /** Sequential process revealed one step at a time (frontogenesis, meandering, subduction). */
  | { type: "process"; title: string; caption?: string; steps: { title: string; text: string }[] }
  /** Chronological phases (przejście demograficzne, orogenezy, etapy urbanizacji). */
  | { type: "timeline"; title: string; caption?: string; events: { period: string; label: string; text: string }[] }
  /**
   * Vertical stack of labeled bands, click one to read it. Covers atmosphere
   * layers, soil horizons, ocean depth zones, mountain vegetation belts,
   * geological columns — anything read top-to-bottom or bottom-to-top.
   */
  | {
      type: "layers";
      title: string;
      caption?: string;
      /** "bottom-up" puts the FIRST array item at the bottom (atmosphere, vegetation belts). */
      orientation?: "top-down" | "bottom-up";
      layers: { name: string; range?: string; text: string; tone?: GeoTone }[];
    }
  /** Nested shells seen in cross-section — Earth's interior, atmosphere as shells. */
  | {
      type: "concentric";
      title: string;
      caption?: string;
      shells: { name: string; range?: string; text: string; tone?: GeoTone }[];
    }
  /** Closed loop with arrows — water cycle, rock cycle, carbon/nitrogen cycle. */
  | { type: "cycle"; title: string; caption?: string; stages: { name: string; text: string }[] }
  /** Latitudinal bands — climate zones, pressure belts, prevailing winds. */
  | {
      type: "zones";
      title: string;
      caption?: string;
      zones: { name: string; latitude: string; text: string; tone?: GeoTone }[];
    }

  // ——— interactive: data reading (the core matura skill) ———
  /**
   * Klimatogram: 12 monthly means. `answer` turns it into a "rozpoznaj
   * klimat" exercise with a reveal button instead of a static figure.
   */
  | {
      type: "climate-chart";
      title?: string;
      station: string;
      caption?: string;
      /** Mean monthly temperature in °C, Jan..Dec. */
      temps: MonthlySeries;
      /** Mean monthly precipitation in mm, Jan..Dec. */
      precip: MonthlySeries;
      answer?: { climate: string; reasoning: string };
    }
  /** Piramida wieku i płci — the other classic "read the figure" matura task. */
  | {
      type: "population-pyramid";
      title?: string;
      country: string;
      caption?: string;
      /** Percent of total population per age band, youngest first. */
      male: number[];
      female: number[];
      /** Defaults to 0-4, 5-9, ... matching the array length. */
      ageLabels?: string[];
      answer?: { shape: string; reasoning: string };
    }
  | {
      type: "chart";
      variant: "bar" | "line";
      title: string;
      caption?: string;
      labels: string[];
      series: { name: string; values: number[] }[];
      unit?: string;
    }
  /** Leaflet map with pins to click — locate and learn (reuses the map stack from the exercise engine). */
  | {
      type: "map-explore";
      title: string;
      caption?: string;
      center: [number, number];
      zoom: number;
      markers: { lat: number; lng: number; label: string; text: string }[];
    }

  // ——— interactive: in-lesson exercises ———
  | { type: "matching"; title: string; instruction?: string; pairs: { left: string; right: string }[] }
  | { type: "ordering"; title: string; instruction?: string; /** Correct order. */ items: string[]; explanation?: string }
  | ({ type: "quiz" } & GeoQuizQuestion);

/** Semantic colour hint for banded visuals; the renderer maps these onto theme tokens. */
export type GeoTone = "sky" | "water" | "earth" | "rock" | "ice" | "vegetation" | "heat" | "neutral";

export type GeoLessonContent = GeoBlock[];

export const GEO_TONE_CLASSES: Record<GeoTone, string> = {
  sky: "bg-sky-500/25 text-sky-950 dark:text-sky-100",
  water: "bg-blue-600/25 text-blue-950 dark:text-blue-100",
  earth: "bg-amber-700/25 text-amber-950 dark:text-amber-100",
  rock: "bg-stone-500/30 text-stone-950 dark:text-stone-100",
  ice: "bg-cyan-300/30 text-cyan-950 dark:text-cyan-100",
  vegetation: "bg-green-600/25 text-green-950 dark:text-green-100",
  heat: "bg-orange-500/25 text-orange-950 dark:text-orange-100",
  neutral: "bg-surface-muted text-foreground",
};

export function toneClass(tone: GeoTone | undefined): string {
  return GEO_TONE_CLASSES[tone ?? "neutral"];
}

export const MONTH_LABELS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

/**
 * Total annual precipitation and thermal amplitude — the two numbers a
 * student is always asked to derive from a klimatogram, computed here so
 * every renderer (and any future exercise generator) agrees on them.
 */
export function climateSummary(temps: MonthlySeries, precip: MonthlySeries) {
  const annualPrecip = precip.reduce((sum, p) => sum + p, 0);
  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);
  return {
    annualPrecip: Math.round(annualPrecip),
    maxTemp,
    minTemp,
    amplitude: Math.round((maxTemp - minTemp) * 10) / 10,
    meanTemp: Math.round((temps.reduce((s, t) => s + t, 0) / 12) * 10) / 10,
  };
}

/** Case/whitespace-insensitive comparison for matching + ordering checks. */
export function normalizeGeoAnswer(raw: string): string {
  return raw.trim().toLowerCase().replace(/\s+/g, " ");
}
