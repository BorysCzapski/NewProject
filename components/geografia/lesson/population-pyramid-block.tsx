"use client";

// ============================================================================
// components/geografia/lesson/population-pyramid-block.tsx
// Piramida wieku i płci — the other guaranteed "read the figure" matura
// task. Same reveal-before-answer treatment as the klimatogram: when the
// author supplies `answer`, the pyramid's TYPE (progresywna / zastojowa /
// regresywna) is hidden until the student has committed to a reading.
// Values are percentages of total population per age band, youngest first.
// ============================================================================
import { useState } from "react";
import { Eye } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/geografia/lesson/rich-text";

export function PopulationPyramidBlock({
  title,
  country,
  caption,
  male,
  female,
  ageLabels,
  answer,
}: {
  title?: string;
  country: string;
  caption?: string;
  male: number[];
  female: number[];
  ageLabels?: string[];
  answer?: { shape: string; reasoning: string };
}) {
  const [revealed, setRevealed] = useState(false);

  const bands = Math.min(male.length, female.length);
  const labels =
    ageLabels ?? Array.from({ length: bands }, (_, i) => (i === bands - 1 ? `${i * 5}+` : `${i * 5}-${i * 5 + 4}`));
  const maxValue = Math.max(...male.slice(0, bands), ...female.slice(0, bands), 1);

  // Youngest band at the BOTTOM, as every textbook draws it.
  const rows = Array.from({ length: bands }, (_, i) => bands - 1 - i);

  const youngShare = share(male, female, 0, 3, bands); // 0-14 across 5-year bands
  const oldShare = shareFrom(male, female, 13, bands); // 65+

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <CardTitle>{title ?? `Piramida wieku i płci — ${country}`}</CardTitle>
        {caption && <RichText text={caption} className="mt-0.5 text-sm text-foreground-muted" />}
      </div>

      <div className="flex items-center justify-center gap-4 text-xs font-semibold">
        <span className="text-blue-600 dark:text-blue-400">Mężczyźni</span>
        <span className="text-pink-600 dark:text-pink-400">Kobiety</span>
      </div>

      <div className="flex flex-col gap-[2px]">
        {rows.map((bandIndex) => (
          <div key={bandIndex} className="flex items-center gap-1">
            <div className="flex flex-1 justify-end">
              <div
                className="h-3.5 rounded-l-sm bg-blue-500/80"
                style={{ width: `${(male[bandIndex] / maxValue) * 100}%` }}
              />
            </div>
            <span className="w-12 shrink-0 text-center text-[10px] tabular-nums text-foreground-muted">
              {labels[bandIndex]}
            </span>
            <div className="flex flex-1 justify-start">
              <div
                className="h-3.5 rounded-r-sm bg-pink-500/80"
                style={{ width: `${(female[bandIndex] / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-(--radius-control) bg-surface-muted px-2.5 py-1.5">
          <p className="text-xs text-foreground-muted">Udział 0–14 lat</p>
          <p className="text-sm font-semibold tabular-nums text-foreground">{youngShare}%</p>
        </div>
        <div className="rounded-(--radius-control) bg-surface-muted px-2.5 py-1.5">
          <p className="text-xs text-foreground-muted">Udział 65+ lat</p>
          <p className="text-sm font-semibold tabular-nums text-foreground">{oldShare}%</p>
        </div>
      </div>

      {answer && (
        <div>
          {revealed ? (
            <div className="rounded-(--radius-control) bg-accent-soft px-3 py-2.5">
              <p className="text-sm font-semibold text-accent">{answer.shape}</p>
              <RichText text={answer.reasoning} className="mt-0.5 text-sm text-foreground" />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="text-sm text-foreground-muted">
                Zanim sprawdzisz: jaki to typ piramidy? Popatrz na szerokość podstawy i udział osób starszych.
              </p>
              <Button variant="outline" size="sm" className="self-start" onClick={() => setRevealed(true)}>
                <Eye className="h-4 w-4" />
                Pokaż odpowiedź
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

/** Sum of both sexes across bands [from..to], as a rounded percentage. */
function share(male: number[], female: number[], from: number, to: number, bands: number): number {
  let total = 0;
  for (let i = from; i <= Math.min(to, bands - 1); i++) total += (male[i] ?? 0) + (female[i] ?? 0);
  return Math.round(total * 10) / 10;
}

function shareFrom(male: number[], female: number[], from: number, bands: number): number {
  let total = 0;
  for (let i = from; i < bands; i++) total += (male[i] ?? 0) + (female[i] ?? 0);
  return Math.round(total * 10) / 10;
}
