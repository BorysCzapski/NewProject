"use client";

// ============================================================================
// components/silownia/supplement-form.tsx
// Formularz jednego wpisu suplementacji: nazwa, dawka (tekst — "2 kapsułki"
// jest równie częste jak "5000 IU"), pora dnia, notatka.
// ============================================================================
import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { addSupplement } from "@/lib/silownia/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TIME_PRESETS = ["Rano", "Przed treningiem", "Po treningu", "Wieczorem"];

export function SupplementForm({
  today,
  onSaved,
  onCancel,
}: {
  today: string;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const [date, setDate] = useState(today);
  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [timeLabel, setTimeLabel] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Podaj nazwę suplementu.");
      return;
    }
    setError(null);
    setIsSaving(true);
    const result = await addSupplement({ date, name, dose, timeLabel });
    setIsSaving(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setName("");
    setDose("");
    setTimeLabel("");
    onSaved();
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Dodaj suplement</h2>
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
          <Label htmlFor="supplement-name">Nazwa *</Label>
          <Input
            id="supplement-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="np. Kreatyna"
            maxLength={80}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="supplement-dose">Dawka</Label>
            <Input
              id="supplement-dose"
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              placeholder="np. 5 g"
              maxLength={40}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="supplement-date">Kiedy?</Label>
            <Input id="supplement-date" type="date" value={date} max={today} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Pora</Label>
          <div className="flex flex-wrap gap-2">
            {TIME_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setTimeLabel(preset)}
                aria-pressed={timeLabel === preset}
                className={
                  timeLabel === preset
                    ? "rounded-full border border-primary bg-primary-soft px-3 py-1.5 text-sm font-medium text-primary"
                    : "rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground-muted"
                }
              >
                {preset}
              </button>
            ))}
          </div>
          <Input
            value={timeLabel}
            onChange={(e) => setTimeLabel(e.target.value)}
            placeholder="np. z posiłkiem"
            maxLength={40}
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" isLoading={isSaving}>
          Zapisz suplement
        </Button>
      </form>
    </Card>
  );
}
