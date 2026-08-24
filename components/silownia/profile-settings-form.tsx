"use client";

// ============================================================================
// components/silownia/profile-settings-form.tsx
// Waga/wzrost/cel — jedyny wkład od użytkownika, jakiego potrzebuje kalkulator
// nawodnienia (lib/silownia/hydration.ts). Bez pola "płeć": spec je wymieniał,
// ale żadna funkcja go nie używa (patrz komentarz w migracji 0025).
// ============================================================================
import { useState, type FormEvent } from "react";
import { saveGymProfile } from "@/lib/silownia/actions";
import { GOALS, GOAL_LABELS } from "@/lib/silownia/constants";
import type { GymGoal, GymProfile } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function ProfileSettingsForm({ profile }: { profile: GymProfile | null }) {
  const [weightKg, setWeightKg] = useState(profile?.weight_kg != null ? String(profile.weight_kg) : "");
  const [heightCm, setHeightCm] = useState(profile?.height_cm != null ? String(profile.height_cm) : "");
  const [goal, setGoal] = useState<GymGoal | null>(profile?.goal ?? null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSaved(false);
    setIsSaving(true);
    const result = await saveGymProfile({
      weightKg: weightKg.trim() ? Number(weightKg) : null,
      heightCm: heightCm.trim() ? Number(heightCm) : null,
      goal,
    });
    setIsSaving(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSaved(true);
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-weight">Waga (kg)</Label>
            <Input
              id="profile-weight"
              type="number"
              inputMode="decimal"
              min={0}
              max={400}
              step={0.5}
              value={weightKg}
              onChange={(e) => {
                setWeightKg(e.target.value);
                setSaved(false);
              }}
              placeholder="np. 80"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="profile-height">Wzrost (cm)</Label>
            <Input
              id="profile-height"
              type="number"
              inputMode="decimal"
              min={0}
              max={260}
              value={heightCm}
              onChange={(e) => {
                setHeightCm(e.target.value);
                setSaved(false);
              }}
              placeholder="np. 180"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Cel treningowy</Label>
          <div className="flex flex-wrap gap-2">
            {GOALS.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => {
                  setGoal((current) => (current === g ? null : g));
                  setSaved(false);
                }}
                aria-pressed={goal === g}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  goal === g
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border bg-surface text-foreground-muted"
                )}
              >
                {GOAL_LABELS[g]}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-foreground-muted">
          Waga jest jedyną daną potrzebną do wyliczenia dziennej rekomendacji nawodnienia — bez niej
          pokazujemy orientacyjną wartość stałą.
        </p>

        {error && <p className="text-sm text-danger">{error}</p>}
        {saved && !error && <p className="text-sm text-accent">Zapisano.</p>}

        <Button type="submit" isLoading={isSaving}>
          Zapisz profil
        </Button>
      </form>
    </Card>
  );
}
