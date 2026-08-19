"use client";

// ============================================================================
// components/modlitwa/pray-button.tsx
// Główna akcja aplikacji: „Pomodliłem się dzisiaj”. Odhacza dzień, podbija
// streak i pozwala dopisać krótką notatkę.
//
// Stan jest optymistyczny — kliknięcie od razu pokazuje nowy streak, a błąd
// zapisu cofa go i wyświetla komunikat zwrócony przez Server Action (w
// produkcji Next.js redaguje treść wyjątków, więc komunikaty są ZWRACANE,
// patrz lib/action-result.ts).
// ============================================================================
import { useState, useTransition } from "react";
import { Check, Flame, NotebookPen, Undo2 } from "lucide-react";
import { markPrayed, savePrayerNote, unmarkPrayed } from "@/lib/modlitwa/prayer-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function PrayButton({
  dateKey,
  initialPrayed,
  initialStreak,
  initialNote,
  broken,
}: {
  dateKey: string;
  initialPrayed: boolean;
  initialStreak: number;
  initialNote: string | null;
  /** Łańcuch przerwany — pokazujemy zachętę zamiast wyrzutu. */
  broken: boolean;
}) {
  const [prayed, setPrayed] = useState(initialPrayed);
  const [streak, setStreak] = useState(initialStreak);
  const [note, setNote] = useState(initialNote ?? "");
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteSaved, setNoteSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handlePray() {
    setError(null);
    const previous = { prayed, streak };
    setPrayed(true);
    setStreak((s) => s + 1);

    startTransition(async () => {
      const result = await markPrayed(dateKey);
      if (!result.ok) {
        setPrayed(previous.prayed);
        setStreak(previous.streak);
        setError(result.error);
        return;
      }
      setStreak(result.data.streak.currentStreak);
    });
  }

  function handleUndo() {
    setError(null);
    const previous = { prayed, streak };
    setPrayed(false);
    setStreak((s) => Math.max(0, s - 1));

    startTransition(async () => {
      const result = await unmarkPrayed(dateKey);
      if (!result.ok) {
        setPrayed(previous.prayed);
        setStreak(previous.streak);
        setError(result.error);
        return;
      }
      setStreak(result.data.currentStreak);
    });
  }

  function handleSaveNote() {
    setError(null);
    setNoteSaved(false);
    startTransition(async () => {
      const result = await savePrayerNote(dateKey, note);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setNoteSaved(true);
      setTimeout(() => setNoteSaved(false), 2000);
    });
  }

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-base font-semibold text-foreground">
            {prayed ? "Modlitwa odnotowana" : "Czy modliłeś się dzisiaj?"}
          </p>
          <p className="text-sm text-foreground-muted">
            {prayed
              ? "Dzień policzony do Twojego łańcucha modlitwy."
              : broken
                ? "Łańcuch został przerwany — zacznij go dziś od nowa."
                : "Odhacz dzień, żeby nie przerwać łańcucha."}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-center rounded-(--radius-control) bg-primary-soft px-3 py-2">
          <Flame className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold tabular-nums text-foreground">{streak}</span>
          <span className="text-[11px] text-foreground-muted">dni</span>
        </div>
      </div>

      {prayed ? (
        <div className="flex items-center gap-2">
          <div className="flex h-12 flex-1 items-center justify-center gap-2 rounded-(--radius-control) bg-accent-soft text-base font-medium text-foreground">
            <Check className="h-5 w-5 text-accent" />
            Pomodliłem się
          </div>
          <Button variant="ghost" size="icon" onClick={handleUndo} disabled={isPending} aria-label="Cofnij">
            <Undo2 className="h-5 w-5" />
          </Button>
        </div>
      ) : (
        <Button size="lg" onClick={handlePray} isLoading={isPending} className="w-full">
          Pomodliłem się dzisiaj
        </Button>
      )}

      <button
        type="button"
        onClick={() => setNoteOpen((open) => !open)}
        className="flex items-center gap-2 self-start text-sm font-medium text-primary"
      >
        <NotebookPen className="h-4 w-4" />
        {noteOpen ? "Ukryj notatkę" : note ? "Notatka z dziś" : "Dodaj notatkę"}
      </button>

      {noteOpen && (
        <div className="flex flex-col gap-2">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            maxLength={2000}
            placeholder="Za co dziś dziękujesz? O co prosisz?"
            className="w-full rounded-(--radius-control) border border-border bg-surface px-3 py-2.5 text-base text-foreground placeholder:text-foreground-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
          <Button variant="outline" size="sm" onClick={handleSaveNote} isLoading={isPending} className="self-start">
            {noteSaved ? "Zapisano" : "Zapisz notatkę"}
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}
    </Card>
  );
}
