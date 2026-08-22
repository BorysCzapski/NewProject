"use client";

// ============================================================================
// components/algorytmy/lesson/sorting-block.tsx
// Steps through a sorting algorithm on the authored array.
//
// The frames come from ACTUALLY RUNNING each algorithm and recording the array
// after every comparison and swap — not from a hand-written animation script.
// That distinction is the whole point of the block: a scripted animation can
// quietly disagree with the algorithm it claims to show, and a student who
// spots the disagreement learns the wrong thing. Here the sequence of frames
// IS the execution trace, so the picture cannot lie about the algorithm.
// ============================================================================
import { useMemo } from "react";
import { Stepper, type Frame } from "@/components/algorytmy/lesson/stepper";
import type { AlgoSortingAlgorithm } from "@/lib/algorytmy/lesson-blocks";
import { cn } from "@/lib/utils";

interface SortState {
  values: number[];
  /** Indices currently being compared. */
  comparing: number[];
  /** Indices just swapped or written. */
  active: number[];
  /** Indices already in their final position. */
  done: number[];
}

type Recorder = (state: SortState, note: string) => void;

function bubble(input: number[], emit: Recorder) {
  const a = [...input];
  const done: number[] = [];
  emit({ values: [...a], comparing: [], active: [], done: [] }, "Start. Porównujemy sąsiadów od lewej.");

  for (let pass = 0; pass < a.length - 1; pass += 1) {
    let swapped = false;
    for (let i = 0; i < a.length - 1 - pass; i += 1) {
      emit(
        { values: [...a], comparing: [i, i + 1], active: [], done: [...done] },
        `Porównanie ${a[i]} i ${a[i + 1]}.`
      );
      if (a[i] > a[i + 1]) {
        [a[i], a[i + 1]] = [a[i + 1], a[i]];
        swapped = true;
        emit(
          { values: [...a], comparing: [], active: [i, i + 1], done: [...done] },
          `${a[i + 1]} > ${a[i]} — zamiana.`
        );
      }
    }
    done.unshift(a.length - 1 - pass);
    emit(
      { values: [...a], comparing: [], active: [], done: [...done] },
      `Koniec przebiegu: ${a[a.length - 1 - pass]} jest na swoim miejscu.`
    );
    // The optimisation the lesson mentions: a pass with no swap means done.
    if (!swapped) break;
  }
  emit(
    { values: [...a], comparing: [], active: [], done: a.map((_, i) => i) },
    "Posortowane — żaden przebieg nie wykonał już zamiany."
  );
}

function insertion(input: number[], emit: Recorder) {
  const a = [...input];
  emit({ values: [...a], comparing: [], active: [], done: [0] }, "Pierwszy element uznajemy za posortowany.");

  for (let i = 1; i < a.length; i += 1) {
    const key = a[i];
    const sorted = Array.from({ length: i }, (_, k) => k);
    emit({ values: [...a], comparing: [i], active: [], done: sorted }, `Bierzemy ${key} i szukamy dla niego miejsca.`);

    let j = i - 1;
    while (j >= 0 && a[j] > key) {
      emit(
        { values: [...a], comparing: [j, j + 1], active: [], done: sorted },
        `${a[j]} > ${key} — przesuwamy ${a[j]} w prawo.`
      );
      a[j + 1] = a[j];
      j -= 1;
    }
    a[j + 1] = key;
    emit(
      { values: [...a], comparing: [], active: [j + 1], done: Array.from({ length: i + 1 }, (_, k) => k) },
      `${key} trafia na pozycję ${j + 1}. Lewa część znów jest posortowana.`
    );
  }
  emit({ values: [...a], comparing: [], active: [], done: a.map((_, i) => i) }, "Posortowane.");
}

function selection(input: number[], emit: Recorder) {
  const a = [...input];
  emit({ values: [...a], comparing: [], active: [], done: [] }, "Szukamy najmniejszego elementu w całej tablicy.");

  for (let i = 0; i < a.length - 1; i += 1) {
    const done = Array.from({ length: i }, (_, k) => k);
    let min = i;
    for (let j = i + 1; j < a.length; j += 1) {
      emit(
        { values: [...a], comparing: [min, j], active: [], done },
        `Czy ${a[j]} jest mniejsze od dotychczasowego minimum ${a[min]}?`
      );
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      emit(
        { values: [...a], comparing: [], active: [i, min], done },
        `Minimum to ${a[i]} — zamiana z pozycją ${i}.`
      );
    } else {
      emit({ values: [...a], comparing: [], active: [i], done }, `${a[i]} już jest na swoim miejscu.`);
    }
  }
  emit({ values: [...a], comparing: [], active: [], done: a.map((_, i) => i) }, "Posortowane.");
}

function merge(input: number[], emit: Recorder) {
  const a = [...input];

  function sort(lo: number, hi: number) {
    if (hi - lo < 1) return;
    const mid = Math.floor((lo + hi) / 2);
    const range = Array.from({ length: hi - lo + 1 }, (_, k) => lo + k);
    emit(
      { values: [...a], comparing: range, active: [], done: [] },
      `Dzielimy fragment ${lo}–${hi} na ${lo}–${mid} i ${mid + 1}–${hi}.`
    );
    sort(lo, mid);
    sort(mid + 1, hi);

    const left = a.slice(lo, mid + 1);
    const right = a.slice(mid + 1, hi + 1);
    let i = 0;
    let j = 0;
    let k = lo;
    while (i < left.length && j < right.length) {
      a[k] = left[i] <= right[j] ? left[i++] : right[j++];
      emit(
        { values: [...a], comparing: [], active: [k], done: [] },
        `Scalanie: mniejszy z czoła obu połówek to ${a[k]}.`
      );
      k += 1;
    }
    while (i < left.length) {
      a[k] = left[i++];
      emit({ values: [...a], comparing: [], active: [k], done: [] }, `Dopisujemy resztę lewej połowy: ${a[k]}.`);
      k += 1;
    }
    while (j < right.length) {
      a[k] = right[j++];
      emit({ values: [...a], comparing: [], active: [k], done: [] }, `Dopisujemy resztę prawej połowy: ${a[k]}.`);
      k += 1;
    }
    emit(
      { values: [...a], comparing: [], active: [], done: range },
      `Fragment ${lo}–${hi} jest scalony i posortowany.`
    );
  }

  emit({ values: [...a], comparing: [], active: [], done: [] }, "Dziel i zwyciężaj: najpierw same podziały.");
  sort(0, a.length - 1);
  emit({ values: [...a], comparing: [], active: [], done: a.map((_, i) => i) }, "Posortowane.");
}

function quick(input: number[], emit: Recorder) {
  const a = [...input];
  const done: number[] = [];

  function sort(lo: number, hi: number) {
    if (lo >= hi) {
      if (lo === hi) done.push(lo);
      return;
    }
    const pivot = a[hi];
    emit(
      { values: [...a], comparing: [hi], active: [], done: [...done] },
      `Pivotem fragmentu ${lo}–${hi} jest ostatni element: ${pivot}.`
    );

    let i = lo;
    for (let j = lo; j < hi; j += 1) {
      emit(
        { values: [...a], comparing: [j, hi], active: [], done: [...done] },
        `Czy ${a[j]} < ${pivot}?`
      );
      if (a[j] < pivot) {
        [a[i], a[j]] = [a[j], a[i]];
        emit(
          { values: [...a], comparing: [], active: [i, j], done: [...done] },
          `Tak — ${a[i]} idzie na lewą stronę.`
        );
        i += 1;
      }
    }
    [a[i], a[hi]] = [a[hi], a[i]];
    done.push(i);
    emit(
      { values: [...a], comparing: [], active: [i], done: [...done] },
      `Pivot ${pivot} ląduje na pozycji ${i} — to jego ostateczne miejsce.`
    );

    sort(lo, i - 1);
    sort(i + 1, hi);
  }

  emit({ values: [...a], comparing: [], active: [], done: [] }, "Start. Wybieramy pivota i dzielimy wokół niego.");
  sort(0, a.length - 1);
  emit({ values: [...a], comparing: [], active: [], done: a.map((_, i) => i) }, "Posortowane.");
}

const RUNNERS: Record<AlgoSortingAlgorithm, (input: number[], emit: Recorder) => void> = {
  bubble,
  insertion,
  selection,
  merge,
  quick,
};

export function SortingBlock({
  title,
  algorithm,
  values,
  caption,
}: {
  title: string;
  algorithm: AlgoSortingAlgorithm;
  values: number[];
  caption?: string;
}) {
  const frames = useMemo(() => {
    const collected: Frame<SortState>[] = [];
    RUNNERS[algorithm](values, (state, note) => collected.push({ state, note }));
    return collected;
  }, [algorithm, values]);

  const max = Math.max(...values, 1);

  return (
    <Stepper
      title={title}
      frames={frames}
      caption={caption}
      render={(state) => (
        <div className="flex h-32 items-end justify-center gap-1.5">
          {state.values.map((value, i) => {
            const isComparing = state.comparing.includes(i);
            const isActive = state.active.includes(i);
            const isDone = state.done.includes(i);
            return (
              <div key={i} className="flex min-w-0 flex-1 flex-col items-center gap-1">
                <div
                  className={cn(
                    "w-full rounded-t-sm transition-all duration-300",
                    isActive
                      ? "bg-accent"
                      : isComparing
                        ? "bg-warning"
                        : isDone
                          ? "bg-primary"
                          : "bg-surface-muted"
                  )}
                  style={{ height: `${Math.max((value / max) * 100, 8)}%` }}
                />
                <span
                  className={cn(
                    "text-[0.65rem] tabular-nums",
                    isComparing || isActive ? "font-bold text-foreground" : "text-foreground-muted"
                  )}
                >
                  {value}
                </span>
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
