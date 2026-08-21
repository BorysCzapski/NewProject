"use client";

// ============================================================================
// components/godziny/study-log.tsx
// Stream nauki: przycisk „Dodaj naukę" + lista ostatnich wpisów pogrupowana
// po dniach, z edycją i kasowaniem w miejscu.
//
// Lista NIE jest trzymana w stanie klienta (inaczej niż np. lista intencji w
// Modlitwie). Powód: nad streamem stoją kafelki „dziś / tydzień / miesiąc"
// liczone na serwerze przez getOverview, a wpis dodany „na dziś" zmienia i
// listę, i wszystkie trzy sumy naraz. Jedno źródło prawdy (serwer) plus
// router.refresh() po każdej zmianie jest tu prostsze i uczciwsze niż
// aktualizowanie listy lokalnie i pilnowanie, żeby sumy nie skłamały.
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { deleteEntry } from "@/lib/godziny/actions";
import type { StudyEntry } from "@/lib/godziny/queries";
import { formatDayLabel, formatEntryCount, formatMinutes } from "@/lib/godziny/format";
import { chartColor } from "@/lib/paragony/chart-colors";
import type { StudyTopic } from "@/lib/types/database";
import { EntryForm } from "@/components/godziny/entry-form";
import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";

export function StudyLog({
  entries,
  topics,
  today,
}: {
  entries: StudyEntry[];
  topics: StudyTopic[];
  today: string;
}) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSaved() {
    setFormOpen(false);
    setEditingId(null);
    setError(null);
    startTransition(() => router.refresh());
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteEntry(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setConfirmDeleteId(null);
      setError(null);
      router.refresh();
    });
  }

  if (topics.length === 0) {
    return (
      <Card className="flex flex-col gap-2">
        <CardDescription>
          Zanim zapiszesz pierwszą naukę, wybierz swoje tematy — bez tego nie ma czego przypisać do
          godzin.
        </CardDescription>
      </Card>
    );
  }

  const days = groupByDay(entries);

  return (
    <div className="flex flex-col gap-4">
      {formOpen ? (
        <EntryForm
          topics={topics}
          today={today}
          onSaved={handleSaved}
          onCancel={() => setFormOpen(false)}
        />
      ) : (
        <Button size="lg" className="w-full" onClick={() => setFormOpen(true)}>
          <Plus className="h-5 w-5" />
          Dodaj naukę
        </Button>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      {entries.length === 0 ? (
        <Card>
          <CardDescription>
            Nie masz jeszcze żadnych wpisów. Zapisz pierwszą sesję — pojawi się tutaj razem z sumą
            czasu.
          </CardDescription>
        </Card>
      ) : (
        <section className="flex flex-col gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
            Ostatnia nauka
          </h2>

          {days.map((day) => (
            <div key={day.date} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold text-foreground">
                  {formatDayLabel(day.date, today)}
                </h3>
                <p className="text-sm text-foreground-muted">
                  {formatMinutes(day.minutes)} · {formatEntryCount(day.entries.length)}
                </p>
              </div>

              <ul className="flex flex-col gap-2">
                {day.entries.map((entry) =>
                  editingId === entry.id ? (
                    <li key={entry.id}>
                      <EntryForm
                        topics={topics}
                        today={today}
                        entry={entry}
                        onSaved={handleSaved}
                        onCancel={() => setEditingId(null)}
                      />
                    </li>
                  ) : (
                    <li key={entry.id}>
                      <Card className="flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex min-w-0 items-start gap-2.5">
                            {/* Kropka w kolorze tematu tylko podpiera nazwę obok —
                                identyfikacja nigdy nie stoi na samym kolorze. */}
                            <span
                              aria-hidden
                              className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{ backgroundColor: chartColor(entry.topic_color_index) }}
                            />
                            <div className="min-w-0">
                              <p className="truncate text-base font-medium text-foreground">
                                {entry.topic_name}
                              </p>
                              {entry.topic_category && (
                                <p className="truncate text-xs text-foreground-muted">
                                  {entry.topic_category}
                                </p>
                              )}
                            </div>
                          </div>
                          <p className="shrink-0 text-base font-semibold text-foreground">
                            {formatMinutes(entry.duration_minutes)}
                          </p>
                        </div>

                        {entry.note && (
                          <p className="whitespace-pre-line rounded-(--radius-control) bg-surface-muted px-3 py-2 text-sm text-foreground">
                            {entry.note}
                          </p>
                        )}

                        {confirmDeleteId === entry.id ? (
                          <div className="flex items-center gap-2">
                            <p className="flex-1 text-sm text-foreground">Usunąć ten wpis?</p>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(entry.id)}
                              isLoading={isPending}
                            >
                              Usuń
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setConfirmDeleteId(null)}
                            >
                              Anuluj
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmDeleteId(null);
                                setEditingId(entry.id);
                              }}
                              aria-label={`Edytuj wpis: ${entry.topic_name}, ${formatMinutes(entry.duration_minutes)}`}
                              className="flex h-9 w-9 items-center justify-center rounded-(--radius-control) text-foreground-muted active:opacity-70"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(entry.id)}
                              aria-label={`Usuń wpis: ${entry.topic_name}, ${formatMinutes(entry.duration_minutes)}`}
                              className="flex h-9 w-9 items-center justify-center rounded-(--radius-control) text-foreground-muted active:opacity-70"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </Card>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}

interface DayGroup {
  date: string;
  minutes: number;
  entries: StudyEntry[];
}

/**
 * Wpisy przychodzą z serwera posortowane malejąco po dacie, więc wystarczy
 * ciąć je na kolejne serie o tej samej dacie — bez ponownego sortowania.
 */
function groupByDay(entries: StudyEntry[]): DayGroup[] {
  const days: DayGroup[] = [];
  for (const entry of entries) {
    const last = days[days.length - 1];
    if (last && last.date === entry.study_date) {
      last.entries.push(entry);
      last.minutes += entry.duration_minutes;
    } else {
      days.push({ date: entry.study_date, minutes: entry.duration_minutes, entries: [entry] });
    }
  }
  return days;
}
