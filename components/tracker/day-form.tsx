"use client";

// ============================================================================
// components/tracker/day-form.tsx
// Formularz jednego dnia + lista ostatnich dni. Jeden dzień = jeden wpis:
// wybranie daty, która już ma wpis, wczytuje go do edycji, a zapis nadpisuje
// (upsert po stronie serwera). Dzięki temu poprawka wczorajszej liczby zadań
// to zmiana daty i jedno kliknięcie, a nie kasowanie i dodawanie od nowa.
//
// Walidacja tu jest tylko po to, żeby nie płacić rundy do serwera za literówkę
// — prawdziwą bramką jest lib/tracker/actions.ts.
// ============================================================================
import { useMemo, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2 } from "lucide-react";
import { deleteDay, saveDay } from "@/lib/tracker/actions";
import { formatDayLong, formatHours } from "@/lib/tracker/format";
import type { DayPoint } from "@/lib/tracker/stats";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const HOUR_PRESETS = [1, 2, 4, 6, 8];
const RECENT_LIMIT = 14;

interface FormState {
  day: string;
  hours: string;
  tasks: string;
  note: string;
}

function stateFor(day: string, byDay: Map<string, DayPoint>): FormState {
  const existing = byDay.get(day);
  return existing
    ? { day, hours: String(existing.hours), tasks: String(existing.tasks), note: existing.note ?? "" }
    : { day, hours: "", tasks: "0", note: "" };
}

export function DayForm({ days, today }: { days: DayPoint[]; today: string }) {
  const router = useRouter();
  const byDay = useMemo(() => new Map(days.map((d) => [d.day, d])), [days]);
  const [form, setForm] = useState<FormState>(() => stateFor(today, byDay));
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  const editing = byDay.has(form.day);
  const recent = [...days].reverse().slice(0, RECENT_LIMIT);

  function selectDay(day: string) {
    setForm(stateFor(day, byDay));
    setError(null);
    setSaved(false);
  }

  function bumpTasks(delta: number) {
    setForm((current) => ({
      ...current,
      tasks: String(Math.max(0, Math.min(999, (Number(current.tasks) || 0) + delta))),
    }));
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const hours = Number(form.hours.replace(",", "."));
    const tasks = Number(form.tasks);

    if (form.hours.trim() === "" || !Number.isFinite(hours) || hours < 0) {
      setError("Podaj liczbę godzin (0 lub więcej).");
      return;
    }
    if (hours > 24) {
      setError("W dobie jest tylko 24 godziny.");
      return;
    }
    if (!Number.isFinite(tasks) || tasks < 0 || tasks > 999) {
      setError("Podaj liczbę zadań od 0 do 999.");
      return;
    }
    if (form.day > today) {
      setError("Nie można zapisać dnia z przyszłości.");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await saveDay({ day: form.day, hours, tasks, note: form.note });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSaved(true);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!editing || !window.confirm(`Skasować wpis z dnia ${formatDayLong(form.day)}?`)) return;
    startTransition(async () => {
      const result = await deleteDay(form.day);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setForm(stateFor(form.day, new Map([...byDay].filter(([k]) => k !== form.day))));
      setSaved(false);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <CardTitle>{editing ? "Edytuj dzień" : "Zapisz dzień"}</CardTitle>
            {editing && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="inline-flex items-center gap-1 text-sm text-danger"
              >
                <Trash2 className="h-4 w-4" />
                Skasuj
              </button>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tracker-day">Dzień</Label>
            <Input
              id="tracker-day"
              type="date"
              value={form.day}
              max={today}
              onChange={(e) => e.target.value && selectDay(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tracker-hours">Godziny pracy</Label>
            <Input
              id="tracker-hours"
              type="number"
              inputMode="decimal"
              min={0}
              max={24}
              step={0.25}
              placeholder="np. 5,5"
              value={form.hours}
              onChange={(e) => setForm((c) => ({ ...c, hours: e.target.value }))}
            />
            <div className="flex flex-wrap gap-1.5">
              {HOUR_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setForm((c) => ({ ...c, hours: String(preset) }))}
                  className={cn(
                    "rounded-full px-3 py-1 text-sm transition-colors",
                    Number(form.hours) === preset
                      ? "bg-primary text-primary-foreground"
                      : "bg-surface-muted text-foreground-muted"
                  )}
                >
                  {preset} h
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tracker-tasks">Zrobione zadania</Label>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="lg" onClick={() => bumpTasks(-1)} aria-label="Mniej zadań">
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="tracker-tasks"
                type="number"
                inputMode="numeric"
                min={0}
                max={999}
                step={1}
                value={form.tasks}
                onChange={(e) => setForm((c) => ({ ...c, tasks: e.target.value }))}
                className="text-center"
              />
              <Button type="button" variant="outline" size="lg" onClick={() => bumpTasks(1)} aria-label="Więcej zadań">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tracker-note">Notatka (opcjonalnie)</Label>
            <textarea
              id="tracker-note"
              rows={3}
              maxLength={1000}
              value={form.note}
              onChange={(e) => setForm((c) => ({ ...c, note: e.target.value }))}
              placeholder="Co poszło dobrze, co Cię rozpraszało, co jutro?"
              className="w-full rounded-(--radius-control) border border-border bg-surface px-4 py-3 text-base text-foreground shadow-(--shadow-control) placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}
          {saved && !error && <p className="text-sm text-accent">✓ Zapisane — punkt jest już na wykresie.</p>}

          <Button type="submit" size="lg" disabled={isPending}>
            {isPending ? "Zapisuję…" : editing ? "Zapisz zmiany" : "Zapisz dzień"}
          </Button>
        </form>
      </Card>

      {recent.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-foreground-muted">Ostatnie dni</h2>
          {recent.map((entry) => (
            <button
              key={entry.day}
              type="button"
              onClick={() => selectDay(entry.day)}
              className={cn(
                "rounded-(--radius-card) border bg-surface p-3 text-left transition-colors",
                form.day === entry.day ? "border-primary" : "border-border/70"
              )}
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-foreground">{formatDayLong(entry.day)}</span>
                <span className="shrink-0 text-xs tabular-nums text-foreground-muted">
                  {formatHours(entry.hours)} • {entry.tasks} zad.
                </span>
              </div>
              {entry.note && <p className="mt-1 line-clamp-2 text-xs text-foreground-muted">{entry.note}</p>}
            </button>
          ))}
        </section>
      )}
    </div>
  );
}
