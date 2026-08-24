"use client";

// ============================================================================
// components/silownia/workout-form.tsx
// Formularz jednej sesji treningowej — data, rodzaj dnia (presety + własny
// tekst), czas trwania, lista ćwiczeń z seriami (powtórzenia + ciężar), notatka.
// Ten sam wzorzec co components/godziny/entry-form.tsx: walidacja tu jest po
// to, żeby nie płacić rundy do serwera za literówkę — prawdziwą bramką jest
// lib/silownia/actions.ts.
// ============================================================================
import { useState, type FormEvent } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { addWorkout, updateWorkout } from "@/lib/silownia/actions";
import { SPLIT_PRESETS } from "@/lib/silownia/constants";
import type { GymWorkout, WorkoutExercise } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormState {
  date: string;
  splitLabel: string;
  duration: string;
  exercises: WorkoutExercise[];
  note: string;
}

function emptyExercise(): WorkoutExercise {
  return { name: "", sets: [{ reps: 10, weightKg: null }] };
}

function initialState(today: string, workout?: GymWorkout, suggestedSplit?: string): FormState {
  if (workout) {
    return {
      date: workout.workout_date,
      splitLabel: workout.split_label,
      duration: workout.duration_minutes ? String(workout.duration_minutes) : "",
      exercises: workout.exercises.length > 0 ? workout.exercises : [emptyExercise()],
      note: workout.note ?? "",
    };
  }
  return {
    date: today,
    splitLabel: suggestedSplit ?? "",
    duration: "",
    exercises: [emptyExercise()],
    note: "",
  };
}

export function WorkoutForm({
  today,
  workout,
  suggestedSplit,
  onSaved,
  onCancel,
}: {
  today: string;
  workout?: GymWorkout;
  suggestedSplit?: string;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => initialState(today, workout, suggestedSplit));
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function updateExercise(index: number, patch: Partial<WorkoutExercise>) {
    setForm((f) => ({
      ...f,
      exercises: f.exercises.map((ex, i) => (i === index ? { ...ex, ...patch } : ex)),
    }));
  }

  function addExercise() {
    setForm((f) => ({ ...f, exercises: [...f.exercises, emptyExercise()] }));
  }

  function removeExercise(index: number) {
    setForm((f) => ({ ...f, exercises: f.exercises.filter((_, i) => i !== index) }));
  }

  function addSet(exerciseIndex: number) {
    setForm((f) => ({
      ...f,
      exercises: f.exercises.map((ex, i) => {
        if (i !== exerciseIndex) return ex;
        const last = ex.sets[ex.sets.length - 1];
        return { ...ex, sets: [...ex.sets, { reps: last?.reps ?? 10, weightKg: last?.weightKg ?? null }] };
      }),
    }));
  }

  function updateSet(exerciseIndex: number, setIndex: number, patch: Partial<{ reps: number; weightKg: number | null }>) {
    setForm((f) => ({
      ...f,
      exercises: f.exercises.map((ex, i) =>
        i !== exerciseIndex
          ? ex
          : { ...ex, sets: ex.sets.map((s, j) => (j === setIndex ? { ...s, ...patch } : s)) }
      ),
    }));
  }

  function removeSet(exerciseIndex: number, setIndex: number) {
    setForm((f) => ({
      ...f,
      exercises: f.exercises.map((ex, i) =>
        i !== exerciseIndex ? ex : { ...ex, sets: ex.sets.filter((_, j) => j !== setIndex) }
      ),
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!form.splitLabel.trim()) {
      setError("Podaj rodzaj treningu.");
      return;
    }
    if (form.date > today) {
      setError("Nie można zapisać treningu z przyszłości.");
      return;
    }

    setError(null);
    setIsSaving(true);
    const payload = {
      date: form.date,
      splitLabel: form.splitLabel.trim(),
      durationMinutes: form.duration.trim() ? Number(form.duration) : null,
      exercises: form.exercises.filter((ex) => ex.name.trim()),
      note: form.note,
    };
    const result = workout ? await updateWorkout(workout.id, payload) : await addWorkout(payload);
    setIsSaving(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    onSaved();
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            {workout ? "Edytuj trening" : "Dodaj trening"}
          </h2>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              aria-label="Zamknij formularz"
              className="text-foreground-muted"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Rodzaj treningu *</Label>
          <div className="flex flex-wrap gap-2">
            {SPLIT_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setForm((f) => ({ ...f, splitLabel: preset.label }))}
                aria-pressed={form.splitLabel === preset.label}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  form.splitLabel === preset.label
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border bg-surface text-foreground-muted"
                )}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <Input
            value={form.splitLabel}
            onChange={(e) => setForm((f) => ({ ...f, splitLabel: e.target.value }))}
            placeholder="np. Własny trening"
            maxLength={80}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="workout-date">Kiedy?</Label>
            <Input
              id="workout-date"
              type="date"
              value={form.date}
              max={today}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="workout-duration">Czas (min)</Label>
            <Input
              id="workout-duration"
              type="number"
              inputMode="numeric"
              min={1}
              max={600}
              value={form.duration}
              onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
              placeholder="np. 60"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Label>Ćwiczenia</Label>
          {form.exercises.map((exercise, exerciseIndex) => (
            <div
              key={exerciseIndex}
              className="flex flex-col gap-2 rounded-(--radius-control) border border-border p-3"
            >
              <div className="flex items-center gap-2">
                <Input
                  value={exercise.name}
                  onChange={(e) => updateExercise(exerciseIndex, { name: e.target.value })}
                  placeholder="Nazwa ćwiczenia (np. Wyciskanie sztangi)"
                  maxLength={80}
                  className="flex-1"
                />
                {form.exercises.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeExercise(exerciseIndex)}
                    aria-label={`Usuń ćwiczenie ${exercise.name || exerciseIndex + 1}`}
                    className="flex h-10 w-10 shrink-0 items-center justify-center text-foreground-muted active:opacity-70"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="flex items-center gap-2">
                    <span className="w-5 shrink-0 text-xs text-foreground-muted">{setIndex + 1}.</span>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={200}
                      value={set.reps}
                      onChange={(e) => updateSet(exerciseIndex, setIndex, { reps: Number(e.target.value) })}
                      aria-label={`Powtórzenia, seria ${setIndex + 1}`}
                      className="h-10 w-16 text-center"
                    />
                    <span className="text-xs text-foreground-muted">×</span>
                    <Input
                      type="number"
                      inputMode="decimal"
                      min={0}
                      max={500}
                      step={0.5}
                      value={set.weightKg ?? ""}
                      onChange={(e) =>
                        updateSet(exerciseIndex, setIndex, {
                          weightKg: e.target.value === "" ? null : Number(e.target.value),
                        })
                      }
                      placeholder="kg"
                      aria-label={`Ciężar, seria ${setIndex + 1}`}
                      className="h-10 w-20 text-center"
                    />
                    {exercise.sets.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSet(exerciseIndex, setIndex)}
                        aria-label={`Usuń serię ${setIndex + 1}`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center text-foreground-muted active:opacity-70"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSet(exerciseIndex)}
                  className="mt-1 self-start text-sm font-medium text-primary"
                >
                  + Seria
                </button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" onClick={addExercise} className="self-start">
            <Plus className="h-4 w-4" /> Dodaj ćwiczenie
          </Button>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="workout-note">Notatka</Label>
          <textarea
            id="workout-note"
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            rows={2}
            maxLength={500}
            placeholder="np. samopoczucie, kontuzje, co poprawić następnym razem"
            className="w-full rounded-(--radius-control) border border-border bg-surface px-3 py-2.5 text-base text-foreground placeholder:text-foreground-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" isLoading={isSaving}>
          {workout ? "Zapisz zmiany" : "Zapisz trening"}
        </Button>
      </form>
    </Card>
  );
}
