// ============================================================================
// lib/biznes/sheets.ts
// Exam sheets parsed from the maturabiz.pl PDFs by scripts/build-biznes-
// sheets.mjs (content/arkusze.json). Items are either read-only context
// (tekst, opis, wykres) or tasks with a point value.
// ============================================================================
import raw from "./content/arkusze.json";

export interface SheetItem {
  id: string;
  label: string;
  number: number;
  kind: "context" | "task";
  points: number;
  text: string;
}

export interface Sheet {
  slug: string;
  title: string;
  period: string;
  url: string;
  kind: "cke" | "autorski";
  maxPoints: number;
  items: SheetItem[];
}

export const SHEETS = raw as Sheet[];

export function getSheet(slug: string): Sheet | undefined {
  return SHEETS.find((s) => s.slug === slug);
}

export function taskCount(sheet: Sheet): number {
  return sheet.items.filter((i) => i.kind === "task").length;
}
