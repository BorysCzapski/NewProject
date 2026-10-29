"use client";

// ============================================================================
// components/zusia/zusia-sync.tsx
// Keeps ZUSia progress on the account. On mount it loads the saved copy and
// merges it into localStorage (so a new device picks up where another left
// off); afterwards every local change is pushed to the account, debounced.
// Local storage stays the source the UI reads, so the app works offline and
// when saving fails - the small status line says which case you are in.
// ============================================================================
import { useEffect, useRef, useState } from "react";
import { Cloud, CloudOff } from "lucide-react";
import { loadZusiaProgress, saveZusiaProgress } from "@/lib/zusia/progress-actions";
import { EMPTY_PROGRESS, mergeProgress, progressSchema, type ZusiaProgress } from "@/lib/zusia/progress";
import { CARDS_KEY, CHANGED_EVENT, CROSSWORDS_KEY, STATS_KEY, SYNCED_EVENT, TESTS_KEY } from "@/lib/zusia/use-local-state";

function readLocal(): ZusiaProgress {
  const read = (key: string, fallback: unknown) => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  };
  const parsed = progressSchema.safeParse({
    questionStats: read(STATS_KEY, {}),
    cardLevels: read(CARDS_KEY, {}),
    crosswords: read(CROSSWORDS_KEY, {}),
    tests: read(TESTS_KEY, []),
  });
  return parsed.success ? parsed.data : EMPTY_PROGRESS;
}

function writeLocal(p: ZusiaProgress) {
  try {
    window.localStorage.setItem(STATS_KEY, JSON.stringify(p.questionStats));
    window.localStorage.setItem(CARDS_KEY, JSON.stringify(p.cardLevels));
    window.localStorage.setItem(CROSSWORDS_KEY, JSON.stringify(p.crosswords));
    window.localStorage.setItem(TESTS_KEY, JSON.stringify(p.tests));
  } catch {
    /* storage blocked – the account copy still gets saved */
  }
}

type Status = "loading" | "saved" | "saving" | "offline";

export function ZusiaSync() {
  const [status, setStatus] = useState<Status>("loading");
  const loaded = useRef(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    async function push() {
      setStatus("saving");
      const res = await saveZusiaProgress(readLocal());
      if (!cancelled) setStatus(res.ok ? "saved" : "offline");
    }

    const schedule = () => {
      if (!loaded.current) return;
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(push, 1500);
    };
    const flush = () => {
      if (document.visibilityState === "hidden" && timer.current !== undefined && loaded.current) {
        window.clearTimeout(timer.current);
        timer.current = undefined;
        void saveZusiaProgress(readLocal());
      }
    };

    (async () => {
      const res = await loadZusiaProgress();
      if (cancelled) return;
      if (!res.ok) {
        setStatus("offline");
        return;
      }
      const merged = mergeProgress(readLocal(), res.data);
      writeLocal(merged);
      window.dispatchEvent(new Event(SYNCED_EVENT));
      loaded.current = true;
      await push();
    })();

    window.addEventListener(CHANGED_EVENT, schedule);
    document.addEventListener("visibilitychange", flush);
    return () => {
      cancelled = true;
      window.clearTimeout(timer.current);
      window.removeEventListener(CHANGED_EVENT, schedule);
      document.removeEventListener("visibilitychange", flush);
    };
  }, []);

  const text = { loading: "Łączenie z kontem…", saving: "Zapisuję na koncie…", saved: "Postępy zapisane na koncie", offline: "Postępy tylko w tej przeglądarce" }[status];
  return (
    <p className="mx-auto flex max-w-lg items-center justify-center gap-1.5 px-5 pt-2 text-xs text-foreground-muted" role="status" aria-live="polite">
      {status === "offline" ? <CloudOff className="h-3.5 w-3.5" aria-hidden /> : <Cloud className="h-3.5 w-3.5" aria-hidden />}
      {text}
    </p>
  );
}
