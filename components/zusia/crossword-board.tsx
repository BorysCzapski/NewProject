"use client";

// ============================================================================
// components/zusia/crossword-board.tsx
// Interactive crossword: numbered grid + across/down clue lists. Typing moves
// to the next cell along the active direction; Backspace goes back; arrows
// navigate. "Sprawdź" marks wrong letters, "Podpowiedź" reveals the selected
// cell and "Pokaż rozwiązanie" fills the board.
// ============================================================================
import { useMemo, useRef, useState } from "react";
import { Check, Lightbulb, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { layoutCrossword, type Direction, type PlacedWord } from "@/lib/zusia/crossword-layout";
import { CROSSWORDS_KEY, useLocalState, type SolvedCrosswords } from "@/lib/zusia/use-local-state";
import type { Crossword } from "@/lib/zusia/types";

const key = (r: number, c: number) => `${r},${c}`;

export function CrosswordBoard({ crossword }: { crossword: Crossword }) {
  const layout = useMemo(() => layoutCrossword(crossword.entries), [crossword]);
  const [letters, setLetters] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<{ r: number; c: number; dir: Direction } | null>(null);
  const [showErrors, setShowErrors] = useState(false);
  const [, setSolved] = useLocalState<SolvedCrosswords>(CROSSWORDS_KEY, {});
  const wasSelected = useRef(false);

  const startNumbers = useMemo(() => {
    const m = new Map<string, number>();
    for (const w of layout.words) m.set(key(w.row, w.col), w.number);
    return m;
  }, [layout]);

  const cellKeys = Object.keys(layout.cells);
  const filled = cellKeys.filter((k) => letters[k]).length;
  const solved = cellKeys.length > 0 && cellKeys.every((k) => letters[k] === layout.cells[k]);

  const activeWord = useMemo<PlacedWord | null>(() => {
    if (!selected) return null;
    const covers = (w: PlacedWord) =>
      w.direction === "across"
        ? selected.r === w.row && selected.c >= w.col && selected.c < w.col + w.answer.length
        : selected.c === w.col && selected.r >= w.row && selected.r < w.row + w.answer.length;
    return layout.words.find((w) => w.direction === selected.dir && covers(w)) ?? layout.words.find(covers) ?? null;
  }, [selected, layout]);

  /** Single place that updates the board and records completion. */
  function applyLetters(next: Record<string, string>) {
    setLetters(next);
    setShowErrors(false);
    if (cellKeys.every((k) => next[k] === layout.cells[k])) setSolved((sv) => ({ ...sv, [crossword.id]: true }));
  }

  function focusCell(r: number, c: number) {
    document.getElementById(`${crossword.id}-${r}-${c}`)?.focus();
  }

  function selectCell(r: number, c: number, toggle = false) {
    setSelected((cur) => {
      const hasAcross = layout.words.some((w) => w.direction === "across" && w.row === r && c >= w.col && c < w.col + w.answer.length);
      const hasDown = layout.words.some((w) => w.direction === "down" && w.col === c && r >= w.row && r < w.row + w.answer.length);
      let dir: Direction = cur?.dir ?? "across";
      if (toggle && cur && cur.r === r && cur.c === c) dir = dir === "across" ? "down" : "across";
      // Fall back to the direction that actually has a word through this cell.
      if (dir === "across" && !hasAcross && hasDown) dir = "down";
      if (dir === "down" && !hasDown && hasAcross) dir = "across";
      return { r, c, dir };
    });
  }

  function type(r: number, c: number, value: string) {
    const letter = value.toUpperCase().slice(-1);
    if (!letter || !/\p{L}/u.test(letter)) return;
    applyLetters({ ...letters, [key(r, c)]: letter });
    const dir = selected?.dir ?? "across";
    const [nr, nc] = dir === "across" ? [r, c + 1] : [r + 1, c];
    if (layout.cells[key(nr, nc)] !== undefined) {
      setSelected({ r: nr, c: nc, dir });
      focusCell(nr, nc);
    }
  }

  function onKeyDown(e: React.KeyboardEvent, r: number, c: number) {
    const dir = selected?.dir ?? "across";
    const move = (nr: number, nc: number, d: Direction = dir) => {
      if (layout.cells[key(nr, nc)] !== undefined) {
        setSelected({ r: nr, c: nc, dir: d });
        focusCell(nr, nc);
      }
    };
    if (e.key.length === 1 && /\p{L}/u.test(e.key) && !e.metaKey && !e.ctrlKey) {
      // Handle letters here (not in onChange) so rapid typing cannot pile up in one cell.
      e.preventDefault();
      type(r, c, e.key);
    } else if (e.key === "Backspace") {
      e.preventDefault();
      if (letters[key(r, c)]) applyLetters({ ...letters, [key(r, c)]: "" });
      else move(dir === "across" ? r : r - 1, dir === "across" ? c - 1 : c);
    } else if (e.key === "ArrowRight") move(r, c + 1, "across");
    else if (e.key === "ArrowLeft") move(r, c - 1, "across");
    else if (e.key === "ArrowDown") move(r + 1, c, "down");
    else if (e.key === "ArrowUp") move(r - 1, c, "down");
  }

  function hint() {
    if (!selected) return;
    const k = key(selected.r, selected.c);
    applyLetters({ ...letters, [k]: layout.cells[k] });
  }

  function reveal() {
    applyLetters({ ...layout.cells });
  }

  const across = layout.words.filter((w) => w.direction === "across");
  const down = layout.words.filter((w) => w.direction === "down");

  const clueItem = (w: PlacedWord) => {
    const active = activeWord === w;
    return (
      <li key={`${w.number}-${w.direction}`}>
        <button
          type="button"
          onClick={() => {
            setSelected({ r: w.row, c: w.col, dir: w.direction });
            focusCell(w.row, w.col);
          }}
          className={cn("flex w-full gap-2 rounded-lg px-2 py-1.5 text-left text-sm", active ? "bg-primary-soft text-foreground" : "text-foreground-muted hover:bg-surface-muted")}
        >
          <span className="w-5 shrink-0 font-semibold text-primary">{w.number}.</span>
          <span>
            {w.clue} <span className="text-xs opacity-60">({w.answer.length})</span>
          </span>
        </button>
      </li>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-sm text-foreground-muted">
        <span>
          Wypełnione: {filled} / {cellKeys.length}
        </span>
        {solved && (
          <span className="flex items-center gap-1 font-semibold text-primary">
            <Check className="h-4 w-4" /> Rozwiązana!
          </span>
        )}
      </div>

      <div className="rounded-(--radius-card) border border-border bg-surface p-2.5 shadow-(--shadow-card)">
        <div
          className="mx-auto grid gap-0.5"
          style={{ gridTemplateColumns: `repeat(${layout.cols}, minmax(0, 1fr))`, maxWidth: `${layout.cols * 2.4}rem` }}
          role="grid"
          aria-label="Krzyżówka"
        >
          {Array.from({ length: layout.rows }).flatMap((_, r) =>
            Array.from({ length: layout.cols }).map((__, c) => {
              const k = key(r, c);
              if (layout.cells[k] === undefined) return <div key={k} className="aspect-square" aria-hidden />;
              const isSel = selected?.r === r && selected.c === c;
              const inWord =
                activeWord &&
                (activeWord.direction === "across"
                  ? r === activeWord.row && c >= activeWord.col && c < activeWord.col + activeWord.answer.length
                  : c === activeWord.col && r >= activeWord.row && r < activeWord.row + activeWord.answer.length);
              const wrong = showErrors && letters[k] && letters[k] !== layout.cells[k];
              const num = startNumbers.get(k);
              return (
                <div key={k} className="relative aspect-square" role="gridcell">
                  {num && <span className="pointer-events-none absolute left-0.5 top-0 z-10 text-[9px] font-semibold leading-none text-primary">{num}</span>}
                  <input
                    id={`${crossword.id}-${r}-${c}`}
                    value={letters[k] ?? ""}
                    onChange={(e) => type(r, c, e.target.value)}
                    onKeyDown={(e) => onKeyDown(e, r, c)}
                    onFocus={() => selectCell(r, c)}
                    onMouseDown={() => {
                      wasSelected.current = isSel;
                    }}
                    onClick={() => {
                      if (wasSelected.current) selectCell(r, c, true);
                    }}
                    maxLength={2}
                    inputMode="text"
                    autoCapitalize="characters"
                    autoComplete="off"
                    aria-label={`Wiersz ${r + 1}, kolumna ${c + 1}`}
                    className={cn(
                      "h-full w-full rounded-md border pt-1 text-center text-sm font-semibold uppercase text-foreground caret-transparent outline-none sm:text-base",
                      isSel ? "border-primary bg-accent-soft" : inWord ? "border-primary/40 bg-primary-soft" : "border-border bg-surface",
                      wrong && "border-danger bg-danger-soft text-danger"
                    )}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => setShowErrors(true)}>
          <Check className="h-4 w-4" /> Sprawdź
        </Button>
        <Button size="sm" variant="outline" onClick={hint} disabled={!selected}>
          <Lightbulb className="h-4 w-4" /> Podpowiedź
        </Button>
        <Button size="sm" variant="ghost" onClick={() => applyLetters({})}>
          <RotateCcw className="h-4 w-4" /> Wyczyść
        </Button>
        <Button size="sm" variant="ghost" onClick={reveal}>
          Pokaż rozwiązanie
        </Button>
      </div>

      {activeWord && (
        <Card className="bg-primary-soft">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {activeWord.number} {activeWord.direction === "across" ? "poziomo" : "pionowo"}
          </p>
          <p className="mt-0.5 text-sm text-foreground">{activeWord.clue}</p>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <section>
          <h3 className="mb-1 text-sm font-semibold text-foreground">Poziomo →</h3>
          <ul className="flex flex-col">{across.map(clueItem)}</ul>
        </section>
        <section>
          <h3 className="mb-1 text-sm font-semibold text-foreground">Pionowo ↓</h3>
          <ul className="flex flex-col">{down.map(clueItem)}</ul>
        </section>
      </div>

      {layout.dropped.length > 0 && (
        <p className="text-xs text-foreground-muted">Nie zmieściło się w siatce: {layout.dropped.map((d) => d.answer).join(", ")}.</p>
      )}
    </div>
  );
}
