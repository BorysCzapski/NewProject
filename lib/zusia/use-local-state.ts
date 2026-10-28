"use client";

// ============================================================================
// lib/zusia/use-local-state.ts
// Tiny localStorage-backed state for ZUSia progress (question stats, flashcard
// boxes, crossword solves). ZUSia keeps content in code and progress in the
// browser, so it needs no database migration. Reads/writes are try/catch-ed:
// storage can be blocked (private mode) and the app must still work.
// ============================================================================
import { useCallback, useEffect, useState } from "react";

export function useLocalState<T>(storageKey: string, initial: T): [T, (updater: (prev: T) => T) => void, boolean] {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrating from storage after mount
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* storage unavailable or corrupted – keep the initial value */
    }
    setReady(true);
  }, [storageKey]);

  const update = useCallback(
    (updater: (prev: T) => T) => {
      setValue((prev) => {
        const next = updater(prev);
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          /* ignore quota / privacy-mode errors */
        }
        return next;
      });
    },
    [storageKey]
  );

  return [value, update, ready];
}

/** Per-question result counters: how often answered right/wrong. */
export interface QuestionStat {
  ok: number;
  wrong: number;
}
export type QuestionStats = Record<string, QuestionStat>;
export const STATS_KEY = "zusia:question-stats:v1";

/** Flashcard knowledge level 0..3 (0 = don't know yet). */
export type CardLevels = Record<string, number>;
export const CARDS_KEY = "zusia:card-levels:v1";

export type SolvedCrosswords = Record<string, boolean>;
export const CROSSWORDS_KEY = "zusia:crosswords:v1";

export interface TestResult {
  at: number;
  total: number;
  correct: number;
  label: string;
}
export const TESTS_KEY = "zusia:test-results:v1";
