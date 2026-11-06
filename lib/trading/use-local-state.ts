"use client";

// ============================================================================
// lib/trading/use-local-state.ts
// Mały hook trzymający stan w localStorage (postępy w nauce tradingu żyją
// tylko w tej przeglądarce — bez bazy). Używa useSyncExternalStore, więc nie
// ma rozbieżności serwer/klient i nie trzeba setState w efekcie.
// ============================================================================
import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/** Zwraca [wartość, ustaw]. Wartość to JSON; przy braku/uszkodzeniu — `fallback`. */
export function useLocalState<T>(key: string, fallback: T): [T, (next: T | ((prev: T) => T)) => void] {
  const raw = useSyncExternalStore(
    subscribe,
    () => readRaw(key),
    () => null
  );

  let value = fallback;
  if (raw !== null) {
    try {
      value = JSON.parse(raw) as T;
    } catch {
      value = fallback;
    }
  }

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      let prev = fallback;
      const current = readRaw(key);
      if (current !== null) {
        try {
          prev = JSON.parse(current) as T;
        } catch {
          prev = fallback;
        }
      }
      const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
      try {
        window.localStorage.setItem(key, JSON.stringify(resolved));
      } catch {
        /* pełny/zablokowany storage — pomijamy */
      }
      listeners.forEach((l) => l());
    },
    [key, fallback]
  );

  return [value, set];
}
