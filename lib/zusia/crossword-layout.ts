// ============================================================================
// lib/zusia/crossword-layout.ts
// Deterministic crossword generator: places the longest word first, then
// greedily adds every other word where it crosses an existing letter, never
// touching parallel words side by side. Words that cannot be crossed with the
// grid are reported in `dropped` instead of being silently lost.
// ============================================================================
import type { CrosswordEntry } from "./types";

export type Direction = "across" | "down";

export interface PlacedWord {
  number: number;
  answer: string;
  clue: string;
  row: number;
  col: number;
  direction: Direction;
}

export interface CrosswordLayout {
  rows: number;
  cols: number;
  words: PlacedWord[];
  /** Solution letters keyed "row,col" (after normalising to 0,0). */
  cells: Record<string, string>;
  dropped: CrosswordEntry[];
}

interface RawPlacement {
  entry: CrosswordEntry;
  row: number;
  col: number;
  direction: Direction;
}

const key = (r: number, c: number) => `${r},${c}`;

function step(direction: Direction): [number, number] {
  return direction === "across" ? [0, 1] : [1, 0];
}

/** Score for placing `word` at (row,col); -1 when the placement is illegal. */
function scorePlacement(
  grid: Map<string, string>,
  word: string,
  row: number,
  col: number,
  direction: Direction,
  used: Set<string>
): number {
  const [dr, dc] = step(direction);
  const [pr, pc] = [dc, dr]; // perpendicular
  // The cells just before and after the word must be empty.
  if (grid.has(key(row - dr, col - dc)) || grid.has(key(row + dr * word.length, col + dc * word.length))) return -1;

  let crossings = 0;
  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    const existing = grid.get(key(r, c));
    if (existing !== undefined) {
      // Never overlap a word that already runs the same way.
      if (existing !== word[i] || used.has(key(r, c))) return -1;
      crossings++;
    } else if (grid.has(key(r + pr, c + pc)) || grid.has(key(r - pr, c - pc))) {
      // A fresh letter would sit directly beside another word.
      return -1;
    }
  }
  return crossings;
}

export function layoutCrossword(entries: CrosswordEntry[]): CrosswordLayout {
  const sorted = [...entries]
    .map((e) => ({ ...e, answer: e.answer.toUpperCase() }))
    .sort((a, b) => b.answer.length - a.answer.length || a.answer.localeCompare(b.answer, "pl"));

  const grid = new Map<string, string>();
  const placed: RawPlacement[] = [];
  const usedBy: Record<Direction, Set<string>> = { across: new Set(), down: new Set() };
  const dropped: CrosswordEntry[] = [];

  const put = (entry: CrosswordEntry, row: number, col: number, direction: Direction) => {
    const [dr, dc] = step(direction);
    for (let i = 0; i < entry.answer.length; i++) {
      grid.set(key(row + dr * i, col + dc * i), entry.answer[i]);
      usedBy[direction].add(key(row + dr * i, col + dc * i));
    }
    placed.push({ entry, row, col, direction });
  };

  sorted.forEach((entry, index) => {
    if (index === 0) {
      put(entry, 0, 0, "across");
      return;
    }
    let best: { row: number; col: number; direction: Direction; score: number; area: number } | null = null;
    for (const direction of ["across", "down"] as const) {
      const [dr, dc] = step(direction);
      for (const p of placed) {
        if (p.direction === direction) continue;
        const [pdr, pdc] = step(p.direction);
        for (let pi = 0; pi < p.entry.answer.length; pi++) {
          for (let wi = 0; wi < entry.answer.length; wi++) {
            if (p.entry.answer[pi] !== entry.answer[wi]) continue;
            const row = p.row + pdr * pi - dr * wi;
            const col = p.col + pdc * pi - dc * wi;
            const score = scorePlacement(grid, entry.answer, row, col, direction, usedBy[direction]);
            if (score < 1) continue;
            const area = boundingArea(grid, entry.answer, row, col, direction);
            if (!best || score > best.score || (score === best.score && area < best.area)) {
              best = { row, col, direction, score, area };
            }
          }
        }
      }
    }
    if (best) put(entry, best.row, best.col, best.direction);
    else dropped.push(entry);
  });

  // Normalise to a 0,0 origin.
  let minR = Infinity;
  let minC = Infinity;
  let maxR = -Infinity;
  let maxC = -Infinity;
  for (const k of grid.keys()) {
    const [r, c] = k.split(",").map(Number);
    minR = Math.min(minR, r);
    minC = Math.min(minC, c);
    maxR = Math.max(maxR, r);
    maxC = Math.max(maxC, c);
  }

  const cells: Record<string, string> = {};
  for (const [k, letter] of grid) {
    const [r, c] = k.split(",").map(Number);
    cells[key(r - minR, c - minC)] = letter;
  }

  const normalised = placed.map((p) => ({ ...p, row: p.row - minR, col: p.col - minC }));
  // Number by reading order of the start cell; across + down starting together share a number.
  const starts = [...new Set(normalised.map((p) => key(p.row, p.col)))].sort((a, b) => {
    const [ar, ac] = a.split(",").map(Number);
    const [br, bc] = b.split(",").map(Number);
    return ar - br || ac - bc;
  });
  const numberOf = new Map(starts.map((k, i) => [k, i + 1]));

  const words: PlacedWord[] = normalised
    .map((p) => ({
      number: numberOf.get(key(p.row, p.col))!,
      answer: p.entry.answer,
      clue: p.entry.clue,
      row: p.row,
      col: p.col,
      direction: p.direction,
    }))
    .sort((a, b) => a.number - b.number || (a.direction === "across" ? -1 : 1));

  return { rows: maxR - minR + 1, cols: maxC - minC + 1, words, cells, dropped };
}

function boundingArea(grid: Map<string, string>, word: string, row: number, col: number, direction: Direction): number {
  const [dr, dc] = step(direction);
  let minR = row;
  let maxR = row + dr * (word.length - 1);
  let minC = col;
  let maxC = col + dc * (word.length - 1);
  for (const k of grid.keys()) {
    const [r, c] = k.split(",").map(Number);
    minR = Math.min(minR, r);
    maxR = Math.max(maxR, r);
    minC = Math.min(minC, c);
    maxC = Math.max(maxC, c);
  }
  return (maxR - minR + 1) * (maxC - minC + 1);
}
