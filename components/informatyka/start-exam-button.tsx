"use client";

// Starts a timed exam session and jumps to the paper's problem list.
import { useRouter } from "next/navigation";
import { Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearExamSession, isExamLocked, startExamSession, useExamSession } from "@/lib/informatyka/exam-session";

export function StartExamButton({ slug, minutes }: { slug: string; minutes: number }) {
  const router = useRouter();
  const session = useExamSession();
  const running = session && !session.finishedAt;
  const runningHere = isExamLocked(session, slug);

  function start() {
    startExamSession(slug, minutes);
    router.push(`/informatyka/arkusze/${slug}`);
  }

  if (runningHere) {
    return (
      <Button onClick={() => router.push(`/informatyka/arkusze/${slug}`)} size="lg" className="w-full">
        <Timer className="h-4 w-4" /> Wróć do trwającego egzaminu
      </Button>
    );
  }
  return (
    <div className="flex flex-col gap-2">
      {running && (
        <p className="text-sm text-warning">
          Trwa inny egzamin ({session?.slug}). Rozpoczęcie tego zakończy tamten bez wyniku.
        </p>
      )}
      <Button
        onClick={() => {
          if (running) clearExamSession();
          start();
        }}
        size="lg"
        className="w-full"
      >
        <Timer className="h-4 w-4" /> Rozpocznij ({minutes} min)
      </Button>
    </div>
  );
}
