// ============================================================================
// lib/informatyka/sheet-data.ts
// Turns the exam data files into an Univer workbook (one worksheet per file)
// and gives the side panels (chart, pivot) a shared way to read numbers.
// Client-side only.
// ============================================================================
import type { IWorkbookData } from "@univerjs/core";
import type { LoadedFile } from "@/lib/informatyka/data-files-client";

const STRING = 1;
const NUMBER = 2;

/** "9,8" / "9.8" / "12" → number; anything else (incl. "007", dates) → null. */
export function toNumber(value: unknown): number | null {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value !== "string") return null;
  const v = value.trim();
  if (!/^-?\d+([.,]\d+)?$/.test(v) || /^-?0\d/.test(v)) return null;
  return Number(v.replace(",", "."));
}

export function buildWorkbook(files: LoadedFile[]): Partial<IWorkbookData> {
  const sheets: Record<string, unknown> = {};
  const order: string[] = [];
  const list = files.length > 0 ? files : [{ name: "Arkusz1.txt", content: "" }];
  list.forEach((file, index) => {
    const id = `sheet-${index}`;
    const lines = file.content.split("\n").filter((l) => l.length > 0);
    const delimiter = lines[0]?.includes("\t") ? "\t" : lines[0]?.includes(";") ? ";" : ",";
    const cellData: Record<number, Record<number, { v: string | number; t: number }>> = {};
    let width = 0;
    lines.forEach((line, r) => {
      const cells = line.split(delimiter);
      width = Math.max(width, cells.length);
      cellData[r] = {};
      cells.forEach((raw, c) => {
        if (raw === "") return;
        const n = r === 0 ? null : toNumber(raw);
        cellData[r][c] = n === null ? { v: raw, t: STRING } : { v: n, t: NUMBER };
      });
    });
    sheets[id] = {
      id,
      name: file.name.replace(/\.txt$/i, "") || `Arkusz${index + 1}`,
      rowCount: Math.max(lines.length + 50, 100),
      columnCount: Math.max(width + 6, 20),
      cellData,
    };
    order.push(id);
  });
  return { id: "wb", name: "Arkusz", sheetOrder: order, sheets } as Partial<IWorkbookData>;
}

/** A rectangular block of cells as read from the current selection. */
export type Matrix = (string | number | boolean | null | undefined)[][];
