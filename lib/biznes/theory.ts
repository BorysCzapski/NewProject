// ============================================================================
// lib/biznes/theory.ts
// Theory sections: one per article of the maturabiz.pl knowledge base,
// converted from the scraped content/wiedza.json into the app's block types.
// Server-side only (the JSON is ~350 kB) - client code imports lessons.ts.
// ============================================================================
import wiedza from "./content/wiedza.json";
import { CATEGORY_TO_LESSON, getLesson, LESSONS } from "./lessons";
import type { Block, LessonId, TheorySection } from "./types";

export { LESSONS, getLesson };

interface RawBlock {
  t: "h" | "p" | "li" | "table" | "box";
  l?: number;
  x: string | string[] | string[][];
  label?: string;
}
interface RawArticle {
  category: string;
  url: string;
  title: string;
  blocks: RawBlock[];
}

/** Boxes that only link to other maturabiz.pl pages (quiz / glossary). */
const LINK_BOXES = new Set(["Sprawdź wiedzę", "Słownik pojęć"]);

function convert(raw: RawBlock[]): Block[] {
  const out: Block[] = [];
  for (const b of raw) {
    switch (b.t) {
      case "h":
        if (b.l && b.l <= 3 && b.l >= 2 && typeof b.x === "string") out.push({ type: "h", text: b.x, level: b.l === 2 ? 2 : 3 });
        else if (typeof b.x === "string") out.push({ type: "h", text: b.x, level: 3 });
        break;
      case "p":
        if (typeof b.x === "string" && b.x.trim()) out.push({ type: "p", text: b.x });
        break;
      case "li":
        if (Array.isArray(b.x) && b.x.length) out.push({ type: "list", items: b.x as string[] });
        break;
      case "table": {
        const rows = b.x as string[][];
        if (rows.length >= 1) out.push({ type: "table", head: rows[0], rows: rows.slice(1) });
        break;
      }
      case "box":
        if (b.label && !LINK_BOXES.has(b.label) && typeof b.x === "string" && b.x.trim()) {
          out.push({ type: "important", title: b.label, text: b.x });
        }
        break;
    }
  }
  return out;
}

export const THEORY: TheorySection[] = (wiedza as RawArticle[]).map((a) => {
  const slug = a.url.split("/").pop() ?? a.title;
  const lesson = CATEGORY_TO_LESSON[a.category];
  const isSummary = slug === "podsumowanie-dzialu";
  return {
    id: `${lesson}-${slug}`,
    lesson,
    title: isSummary ? "Podsumowanie działu" : a.title,
    blocks: convert(a.blocks),
  };
});

export function getTheoryForLesson(lesson: LessonId): TheorySection[] {
  return THEORY.filter((s) => s.lesson === lesson);
}
