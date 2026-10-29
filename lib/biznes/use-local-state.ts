"use client";

// ============================================================================
// lib/biznes/use-local-state.ts
// Tiny localStorage-backed state for Matura BiZ progress (question stats, flashcard
// boxes, crossword solves). Matura BiZ keeps content in code and progress in the
// browser (BiznesSync mirrors it to the account). Reads/writes are try/catch-ed:
// storage can be blocked (private mode) and the app must still work.
// ============================================================================
import { useCallback, useEffect, useState } from "react";

/** Fired after every local write (BiznesSync saves to the account) and after a sync merge. */
export const CHANGED_EVENT = "biznes:local-changed";
export const SYNCED_EVENT = "biznes:synced";

export function useLocalState<T>(storageKey: string, initial: T): [T, (updater: (prev: T) => T) => void, boolean] {
  const [value, setValue] = useState<T>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const read = () => {
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (raw) setValue(JSON.parse(raw) as T);
      } catch {
        /* storage unavailable or corrupted – keep the initial value */
      }
    };
    /* eslint-disable react-hooks/set-state-in-effect -- hydrating from storage after mount */
    read();
    setReady(true);
    /* eslint-enable react-hooks/set-state-in-effect */
    // BiznesSync merges the account copy into storage, then announces it here.
    window.addEventListener(SYNCED_EVENT, read);
    return () => window.removeEventListener(SYNCED_EVENT, read);
  }, [storageKey]);

  const update = useCallback(
    (updater: (prev: T) => T) => {
      setValue((prev) => {
        const next = updater(prev);
        try {
          window.localStorage.setItem(storageKey, JSON.stringify(next));
          window.dispatchEvent(new Event(CHANGED_EVENT));
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
export const STATS_KEY = "biznes:question-stats:v1";

/** Flashcard knowledge level 0..3 (0 = don't know yet). */
export type CardLevels = Record<string, number>;
export const CARDS_KEY = "biznes:card-levels:v1";

export type SolvedCrosswords = Record<string, boolean>;
export const CROSSWORDS_KEY = "biznes:crosswords:v1";

export interface TestResult {
  at: number;
  total: number;
  correct: number;
  label: string;
}
export const TESTS_KEY = "biznes:test-results:v1";
