"use client";

// ============================================================================
// components/silownia/meal-form.tsx
// Dodanie posiłku dwuetapowo: (1) opis tekstowy → "Oszacuj AI" woła
// lib/silownia/ai.ts przez estimateMeal i pokazuje wynik jako EDYTOWALNE pola
// — spec chce oszacowania z dokładnością ±15%, nie 1:1, więc użytkownik musi
// mieć jak poprawić model przed zapisem; (2) "Zapisz posiłek" persystuje to,
// co faktycznie widać na ekranie (poprawki użytkownika, nie surowy wynik AI).
// ============================================================================
import { useState, type FormEvent } from "react";
import { Sparkles, X } from "lucide-react";
import { estimateMeal, saveMeal } from "@/lib/silownia/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function MealForm({
  today,
  onSaved,
  onCancel,
}: {
  today: string;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const [date, setDate] = useState(today);
  const [description, setDescription] = useState("");
  const [estimate, setEstimate] = useState<{
    calories: string;
    proteinG: string;
    carbsG: string;
    fatG: string;
    note: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEstimating, setIsEstimating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleEstimate() {
    if (!description.trim()) {
      setError("Opisz, co zjadłeś.");
      return;
    }
    setError(null);
    setIsEstimating(true);
    const result = await estimateMeal(description);
    setIsEstimating(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setEstimate({
      calories: String(result.data.calories),
      proteinG: String(result.data.proteinG),
      carbsG: String(result.data.carbsG),
      fatG: String(result.data.fatG),
      note: result.data.note,
    });
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!estimate) return;

    setError(null);
    setIsSaving(true);
    const result = await saveMeal({
      date,
      description,
      calories: Number(estimate.calories) || 0,
      proteinG: Number(estimate.proteinG) || 0,
      carbsG: Number(estimate.carbsG) || 0,
      fatG: Number(estimate.fatG) || 0,
      aiNote: estimate.note,
    });
    setIsSaving(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    onSaved();
  }

  return (
    <Card>
      <form onSubmit={handleSave} className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Dodaj posiłek</h2>
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
          <Label htmlFor="meal-date">Kiedy?</Label>
          <Input id="meal-date" type="date" value={date} max={today} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="meal-description">Co zjadłeś? *</Label>
          <textarea
            id="meal-description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setEstimate(null);
            }}
            rows={2}
            maxLength={500}
            placeholder="np. kurczak z ryżem i brokułami, ok. 300g"
            className="w-full rounded-(--radius-control) border border-border bg-surface px-3 py-2.5 text-base text-foreground placeholder:text-foreground-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        {!estimate && (
          <Button type="button" variant="secondary" onClick={handleEstimate} isLoading={isEstimating}>
            <Sparkles className="h-4 w-4" /> Oszacuj AI
          </Button>
        )}

        {estimate && (
          <div className="flex flex-col gap-3 rounded-(--radius-control) bg-surface-muted p-3">
            <p className="text-xs text-foreground-muted">
              Oszacowanie AI — popraw wartości, jeśli wiesz lepiej.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <Label htmlFor="meal-calories">Kalorie (kcal)</Label>
                <Input
                  id="meal-calories"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={10000}
                  value={estimate.calories}
                  onChange={(e) => setEstimate((est) => est && { ...est, calories: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="meal-protein">Białko (g)</Label>
                <Input
                  id="meal-protein"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={estimate.proteinG}
                  onChange={(e) => setEstimate((est) => est && { ...est, proteinG: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="meal-carbs">Węglowodany (g)</Label>
                <Input
                  id="meal-carbs"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={estimate.carbsG}
                  onChange={(e) => setEstimate((est) => est && { ...est, carbsG: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="meal-fat">Tłuszcz (g)</Label>
                <Input
                  id="meal-fat"
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={estimate.fatG}
                  onChange={(e) => setEstimate((est) => est && { ...est, fatG: e.target.value })}
                />
              </div>
            </div>
            {estimate.note && <p className="text-xs text-foreground-muted">{estimate.note}</p>}
            <button type="button" onClick={() => setEstimate(null)} className="self-start text-xs text-primary">
              Oszacuj ponownie
            </button>
          </div>
        )}

        {error && <p className="text-sm text-danger">{error}</p>}

        {estimate && (
          <Button type="submit" isLoading={isSaving}>
            Zapisz posiłek
          </Button>
        )}
      </form>
    </Card>
  );
}
