"use client";

// ============================================================================
// components/informatyka/exam-bar.tsx
// Floating countdown for a running "Rozwiąż na czas" session. Mounted once in
// app/(main)/informatyka/layout.tsx so it follows the student from problem to
// problem. When the time is up (or "Zakończ") the session is finished and the
// student lands on the results page.
// ============================================================================
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Timer } from "lucide-react";
import { finishExamSession, useExamSession } from "@/lib/informatyka/exam-session";

function format(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ExamBar() {
  const router = useRouter();
  const session = useExamSession();
  const [now, setNow] = useState<number | null>(null);
  const running = Boolean(session && !session.finishedAt);

  useEffect(() => {
    if (!running) return;
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [running]);

  const remaining = session && now !== null ? session.startedAt + session.durationMs - now : null;
  const expired = remaining !== null && remaining <= 0;

  function finish() {
    if (!session) return;
    finishExamSession();
    router.push(`/informatyka/egzamin/${session.slug}/wynik?od=${session.startedAt}`);
  }

  useEffect(() => {
    if (running && expired && session) {
      finishExamSession();
      router.push(`/informatyka/egzamin/${session.slug}/wynik?od=${session.startedAt}`);
    }
  }, [running, expired, session, router]);

  if (!session || session.finishedAt) return null;

  return (
    <div
      className="fixed inset-x-4 z-40 mx-auto flex max-w-lg items-center justify-between gap-3 rounded-full border border-border bg-surface/95 px-4 py-2 shadow-(--shadow-card) backdrop-blur"
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 5.25rem)" }}
    >
      <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Timer className="h-4 w-4 text-primary" />
        <span className="tabular-nums">{remaining === null ? "…" : format(remaining)}</span>
        <span className="hidden text-xs font-normal text-foreground-muted sm:inline">tryb egzaminu</span>
      </span>
      <button onClick={finish} className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
        Zakończ egzamin
      </button>
    </div>
  );
}
