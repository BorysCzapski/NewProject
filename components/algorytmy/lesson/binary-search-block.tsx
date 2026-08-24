"use client";

// ============================================================================
// components/algorytmy/lesson/binary-search-block.tsx
// Steps through binary search on the authored (sorted) array, showing which
// part of the range each comparison eliminates.
//
// The build script rejects an unsorted `values`
// (scripts/algorytmy-build-lessons.mjs), which matters more here than anywhere
// else: run on unsorted input the algorithm still terminates and still returns
// something — just the wrong thing. A visualiser demonstrating a correct
// algorithm producing a wrong answer teaches the opposite of what it should.
// ============================================================================
import { useMemo } from "react";
import { Stepper, type Frame } from "@/components/algorytmy/lesson/stepper";
import { cn } from "@/lib/utils";

interface SearchState {
  lo: number;
  hi: number;
  mid: number | null;
  /** Indices already eliminated from the search. */
  eliminated: number[];
  found: number | null;
}

function run(values: number[], target: number): Frame<SearchState>[] {
  const frames: Frame<SearchState>[] = [];
  const eliminated: number[] = [];
  let lo = 0;
  let hi = values.length - 1;

  frames.push({
    state: { lo, hi, mid: null, eliminated: [], found: null },
    note: `Szukamy ${target} w całym zakresie 0–${hi}.`,
  });

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    frames.push({
      state: { lo, hi, mid, eliminated: [...eliminated], found: null },
      note: `Środek zakresu ${lo}–${hi} to indeks ${mid}, czyli ${values[mid]}. Porównujemy z ${target}.`,
    });

    if (values[mid] === target) {
      frames.push({
        state: { lo, hi, mid, eliminated: [...eliminated], found: mid },
        note: `Trafione: ${target} leży pod indeksem ${mid}.`,
      });
      return frames;
    }

    if (values[mid] < target) {
      for (let i = lo; i <= mid; i += 1) eliminated.push(i);
      lo = mid + 1;
      frames.push({
        state: { lo, hi, mid: null, eliminated: [...eliminated], found: null },
        note: `${values[mid]} < ${target} — odrzucamy lewą połowę razem ze środkiem. Zostaje ${lo}–${hi}.`,
      });
    } else {
      for (let i = mid; i <= hi; i += 1) eliminated.push(i);
      hi = mid - 1;
      frames.push({
        state: { lo, hi, mid: null, eliminated: [...eliminated], found: null },
        note: `${values[mid]} > ${target} — odrzucamy prawą połowę razem ze środkiem. Zostaje ${
          lo <= hi ? `${lo}–${hi}` : "pusty zakres"
        }.`,
      });
    }
  }

  frames.push({
    state: { lo, hi, mid: null, eliminated: values.map((_, i) => i), found: null },
    note: `Zakres się wyczerpał — ${target} nie ma w tablicy.`,
  });
  return frames;
}

export function BinarySearchBlock({
  title,
  values,
  target,
  caption,
}: {
  title: string;
  values: number[];
  target: number;
  caption?: string;
}) {
  const frames = useMemo(() => run(values, target), [values, target]);

  return (
    <Stepper
      title={title}
      frames={frames}
      caption={caption}
      render={(state) => (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-foreground-muted">
            Szukana wartość: <span className="font-bold text-foreground">{target}</span>
          </p>
          <div className="flex flex-wrap justify-center gap-1">
            {values.map((value, i) => {
              const isMid = state.mid === i;
              const isFound = state.found === i;
              const isEliminated = state.eliminated.includes(i);
              return (
                <div
                  key={i}
                  className={cn(
                    "flex h-11 min-w-[2.25rem] flex-col items-center justify-center rounded-(--radius-control) px-1 text-xs tabular-nums transition-colors",
                    isFound
                      ? "bg-accent font-bold text-accent-foreground"
                      : isMid
                        ? "bg-warning font-bold text-foreground"
                        : isEliminated
                          ? "bg-surface-muted text-foreground-muted/40 line-through"
                          : "bg-primary-soft text-foreground"
                  )}
                >
                  <span>{value}</span>
                  <span className="text-[0.6rem] opacity-60">{i}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}
