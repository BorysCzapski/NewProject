// ============================================================================
// lib/informatyka/exam-session.ts
// "Rozwiąż na czas" mode: one running exam session per browser, kept in
// localStorage so it survives navigation between problems and reloads. While it
// runs, the key and the auto-check of THAT exam's problems stay locked.
// Client-side only.
// ============================================================================
import { useMemo, useSyncExternalStore } from "react";

export interface ExamSession {
  slug: string;
  startedAt: number;
  durationMs: number;
  finishedAt?: number;
}

const KEY = "informatyka-exam-session";
const EVENT = "informatyka-exam-session-change";

function read(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function write(session: ExamSession | null) {
  try {
    if (session) window.localStorage.setItem(KEY, JSON.stringify(session));
    else window.localStorage.removeItem(KEY);
  } catch {
    /* private mode etc. — the mode just won't persist */
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function startExamSession(slug: string, minutes: number) {
  write({ slug, startedAt: Date.now(), durationMs: minutes * 60_000 });
}

export function finishExamSession() {
  const raw = read();
  if (!raw) return;
  try {
    const session = JSON.parse(raw) as ExamSession;
    if (!session.finishedAt) write({ ...session, finishedAt: Date.now() });
  } catch {
    write(null);
  }
}

export function clearExamSession() {
  write(null);
}

export function useExamSession(): ExamSession | null {
  const raw = useSyncExternalStore(subscribe, read, () => null);
  return useMemo(() => {
    if (!raw) return null;
    try {
      return JSON.parse(raw) as ExamSession;
    } catch {
      return null;
    }
  }, [raw]);
}

/** True while a session of exactly this exam is running (not finished). */
export function isExamLocked(session: ExamSession | null, examSlug: string): boolean {
  return Boolean(session && !session.finishedAt && session.slug === examSlug);
}
