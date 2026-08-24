"use client";

// ============================================================================
// components/silownia/meal-log.tsx
// Stream posiłków: przycisk „Dodaj posiłek" + lista pogrupowana po dniach z
// sumą kalorii dnia i kasowaniem w miejscu. Ten sam wzorzec co
// components/godziny/study-log.tsx.
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { deleteMeal } from "@/lib/silownia/actions";
import { formatDayLabel } from "@/lib/silownia/format";
import type { GymMealEntry } from "@/lib/types/database";
import { MealForm } from "@/components/silownia/meal-form";
import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";

export function MealLog({ meals, today }: { meals: GymMealEntry[]; today: string }) {
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
      const result = await deleteMeal(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setConfirmDeleteId(null);
      setError(null);
      router.refresh();
    });
  }

  const days = groupByDay(meals);

  return (
    <div className="flex flex-col gap-4">
      {formOpen ? (
        <MealForm today={today} onSaved={handleSaved} onCancel={() => setFormOpen(false)} />
      ) : (
        <Button size="lg" className="w-full" onClick={() => setFormOpen(true)}>
          <Plus className="h-5 w-5" />
          Dodaj posiłek
        </Button>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      {meals.length === 0 ? (
        <Card>
          <CardDescription>
            Nie masz jeszcze żadnych posiłków. Opisz, co zjadłeś — AI oszacuje kalorie i makroskładniki.
          </CardDescription>
        </Card>
      ) : (
        <section className="flex flex-col gap-4">
          {days.map((day) => (
            <div key={day.date} className="flex flex-col gap-2">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
                  {formatDayLabel(day.date, today)}
                </h3>
                <p className="text-sm text-foreground-muted">{day.calories} kcal</p>
              </div>

              <ul className="flex flex-col gap-2">
                {day.meals.map((meal) => (
                  <li key={meal.id}>
                    <Card className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="min-w-0 flex-1 text-sm text-foreground">{meal.description}</p>
                        <p className="shrink-0 text-base font-semibold text-foreground">{meal.calories} kcal</p>
                      </div>
                      <p className="text-xs text-foreground-muted">
                        B: {meal.protein_g} g · W: {meal.carbs_g} g · T: {meal.fat_g} g
                      </p>

                      {confirmDeleteId === meal.id ? (
                        <div className="flex items-center gap-2">
                          <p className="flex-1 text-sm text-foreground">Usunąć ten posiłek?</p>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(meal.id)}
                            isLoading={isPending}
                          >
                            Usuń
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => setConfirmDeleteId(null)}>
                            Anuluj
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(meal.id)}
                            aria-label={`Usuń posiłek: ${meal.description}`}
                            className="flex h-9 w-9 items-center justify-center rounded-(--radius-control) text-foreground-muted active:opacity-70"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
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
  calories: number;
  meals: GymMealEntry[];
}

function groupByDay(meals: GymMealEntry[]): DayGroup[] {
  const days: DayGroup[] = [];
  for (const meal of meals) {
    const last = days[days.length - 1];
    if (last && last.date === meal.entry_date) {
      last.meals.push(meal);
      last.calories += meal.calories;
    } else {
      days.push({ date: meal.entry_date, calories: meal.calories, meals: [meal] });
    }
  }
  return days;
}
