"use client";

// ============================================================================
// components/silownia/workout-log.tsx
// Stream treningów: przycisk „Dodaj trening" + lista pogrupowana po dniach,
// z edycją i kasowaniem w miejscu. Ten sam wzorzec co
// components/godziny/study-log.tsx — lista nie jest trzymana w stanie
// klienta, router.refresh() po każdej zmianie jest jednym źródłem prawdy.
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { deleteWorkout } from "@/lib/silownia/actions";
import { formatDayLabel } from "@/lib/silownia/format";
import type { GymWorkout } from "@/lib/types/database";
import { WorkoutForm } from "@/components/silownia/workout-form";
import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";

export function WorkoutLog({
  workouts,
  today,
  suggestedSplit,
}: {
  workouts: GymWorkout[];
  today: string;
  suggestedSplit?: string;
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
      const result = await deleteWorkout(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setConfirmDeleteId(null);
      setError(null);
      router.refresh();
    });
  }

  const days = groupByDay(workouts);

  return (
    <div className="flex flex-col gap-4">
      {formOpen ? (
        <WorkoutForm
          today={today}
          suggestedSplit={suggestedSplit}
          onSaved={handleSaved}
          onCancel={() => setFormOpen(false)}
        />
      ) : (
        <Button size="lg" className="w-full" onClick={() => setFormOpen(true)}>
          <Plus className="h-5 w-5" />
          Dodaj trening
        </Button>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      {workouts.length === 0 ? (
        <Card>
          <CardDescription>
            Nie masz jeszcze żadnych treningów. Zapisz pierwszą sesję — pojawi się tutaj razem z
            ćwiczeniami i seriami.
          </CardDescription>
        </Card>
      ) : (
        <section className="flex flex-col gap-4">
          {days.map((day) => (
            <div key={day.date} className="flex flex-col gap-2">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
                {formatDayLabel(day.date, today)}
              </h3>

              <ul className="flex flex-col gap-2">
                {day.workouts.map((workout) =>
                  editingId === workout.id ? (
                    <li key={workout.id}>
                      <WorkoutForm
                        today={today}
                        workout={workout}
                        onSaved={handleSaved}
                        onCancel={() => setEditingId(null)}
                      />
                    </li>
                  ) : (
                    <li key={workout.id}>
                      <Card className="flex flex-col gap-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-base font-semibold text-foreground">{workout.split_label}</p>
                            {workout.duration_minutes && (
                              <p className="text-xs text-foreground-muted">{workout.duration_minutes} min</p>
                            )}
                          </div>
                        </div>

                        {workout.exercises.length > 0 && (
                          <ul className="flex flex-col gap-1">
                            {workout.exercises.map((exercise, i) => (
                              <li key={i} className="text-sm text-foreground">
                                <span className="font-medium">{exercise.name}</span>{" "}
                                <span className="text-foreground-muted">
                                  {exercise.sets
                                    .map((s) => (s.weightKg ? `${s.reps}×${s.weightKg}kg` : `${s.reps}×`))
                                    .join(", ")}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {workout.note && (
                          <p className="whitespace-pre-line rounded-(--radius-control) bg-surface-muted px-3 py-2 text-sm text-foreground">
                            {workout.note}
                          </p>
                        )}

                        {confirmDeleteId === workout.id ? (
                          <div className="flex items-center gap-2">
                            <p className="flex-1 text-sm text-foreground">Usunąć ten trening?</p>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDelete(workout.id)}
                              isLoading={isPending}
                            >
                              Usuń
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setConfirmDeleteId(null)}>
                              Anuluj
                            </Button>
                          </div>
                        ) : (
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmDeleteId(null);
                                setEditingId(workout.id);
                              }}
                              aria-label={`Edytuj trening: ${workout.split_label}`}
                              className="flex h-9 w-9 items-center justify-center rounded-(--radius-control) text-foreground-muted active:opacity-70"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(workout.id)}
                              aria-label={`Usuń trening: ${workout.split_label}`}
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
  workouts: GymWorkout[];
}

function groupByDay(workouts: GymWorkout[]): DayGroup[] {
  const days: DayGroup[] = [];
  for (const workout of workouts) {
    const last = days[days.length - 1];
    if (last && last.date === workout.workout_date) {
      last.workouts.push(workout);
    } else {
      days.push({ date: workout.workout_date, workouts: [workout] });
    }
  }
  return days;
}
