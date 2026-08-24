"use client";

// ============================================================================
// components/silownia/supplement-log.tsx
// Stream suplementacji: przycisk „Dodaj suplement" + lista pogrupowana po
// dniach z kasowaniem w miejscu. Ten sam wzorzec co components/silownia/meal-log.tsx.
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { deleteSupplement } from "@/lib/silownia/actions";
import { formatDayLabel, plural } from "@/lib/silownia/format";
import type { GymSupplementEntry } from "@/lib/types/database";
import { SupplementForm } from "@/components/silownia/supplement-form";
import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";

export function SupplementLog({ entries, today }: { entries: GymSupplementEntry[]; today: string }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSaved() {
    setFormOpen(false);
    setError(null);
    startTransition(() => router.refresh());
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteSupplement(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setConfirmDeleteId(null);
      setError(null);
      router.refresh();
    });
  }

  const days = groupByDay(entries);

  return (
    <div className="flex flex-col gap-4">
      {formOpen ? (
        <SupplementForm today={today} onSaved={handleSaved} onCancel={() => setFormOpen(false)} />
      ) : (
        <Button size="lg" className="w-full" onClick={() => setFormOpen(true)}>
          <Plus className="h-5 w-5" />
          Dodaj suplement
        </Button>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      {entries.length === 0 ? (
        <Card>
          <CardDescription>Nie masz jeszcze żadnych wpisów suplementacji.</CardDescription>
        </Card>
      ) : (
        <section className="flex flex-col gap-4">
          {days.map((day) => (
            <div key={day.date} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
                  {formatDayLabel(day.date, today)}
                </h3>
                <p className="text-sm text-foreground-muted">
                  {day.entries.length} {plural(day.entries.length, "wpis", "wpisy", "wpisów")}
                </p>
              </div>

              <ul className="flex flex-col gap-2">
                {day.entries.map((entry) => (
                  <li key={entry.id}>
                    <Card className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-base font-medium text-foreground">{entry.name}</p>
                        <p className="truncate text-xs text-foreground-muted">
                          {[entry.dose, entry.time_label].filter(Boolean).join(" · ") || "—"}
                        </p>
                      </div>

                      {confirmDeleteId === entry.id ? (
                        <div className="flex shrink-0 items-center gap-2">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(entry.id)}
                            isLoading={isPending}
                          >
                            Usuń
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setConfirmDeleteId(null)}>
                            Anuluj
                          </Button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(entry.id)}
                          aria-label={`Usuń suplement: ${entry.name}`}
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius-control) text-foreground-muted active:opacity-70"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </Card>
                  </li>
                ))}
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
  entries: GymSupplementEntry[];
}

function groupByDay(entries: GymSupplementEntry[]): DayGroup[] {
  const days: DayGroup[] = [];
  for (const entry of entries) {
    const last = days[days.length - 1];
    if (last && last.date === entry.entry_date) {
      last.entries.push(entry);
    } else {
      days.push({ date: entry.entry_date, entries: [entry] });
    }
  }
  return days;
}
