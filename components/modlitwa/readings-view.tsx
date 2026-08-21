"use client";

// ============================================================================
// components/modlitwa/readings-view.tsx
// Czytania dnia w rozwijanych sekcjach: I czytanie, psalm responsoryjny,
// II czytanie (niedziele i święta), aklamacja i Ewangelia.
//
// Ewangelia jest rozwinięta domyślnie — to ten fragment, po który sięga się
// najczęściej. Reszta jest zwinięta, żeby na telefonie dało się ogarnąć całość
// jednym spojrzeniem.
// ============================================================================
import { useState, useTransition } from "react";
import { ChevronDown, RefreshCw } from "lucide-react";
import { refreshReadingsAction } from "@/lib/modlitwa/readings-actions";
import type { DailyReading } from "@/lib/types/database";
import { Button } from "@/components/ui/button";

interface Section {
  id: string;
  label: string;
  citation: string | null;
  refrain?: string | null;
  text: string | null;
}

function buildSections(readings: DailyReading): Section[] {
  return [
    {
      id: "pierwsze",
      label: "Pierwsze czytanie",
      citation: readings.first_reading_citation,
      text: readings.first_reading_text,
    },
    {
      id: "psalm",
      label: "Psalm responsoryjny",
      citation: readings.psalm_citation,
      refrain: readings.psalm_refrain,
      text: readings.psalm_text,
    },
    {
      id: "drugie",
      label: "Drugie czytanie",
      citation: readings.second_reading_citation,
      text: readings.second_reading_text,
    },
    {
      id: "aklamacja",
      label: "Aklamacja",
      citation: readings.acclamation_citation,
      text: readings.acclamation_text,
    },
    {
      id: "ewangelia",
      label: "Ewangelia",
      citation: readings.gospel_citation,
      text: readings.gospel_text,
    },
  ].filter((section) => section.text);
}

export function ReadingsView({
  readings,
  dateKey,
  isStale,
  error,
}: {
  readings: DailyReading | null;
  dateKey: string;
  isStale: boolean;
  error: string | null;
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({ ewangelia: true });
  const [refreshError, setRefreshError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleRefresh() {
    setRefreshError(null);
    startTransition(async () => {
      const result = await refreshReadingsAction(dateKey);
      if (!result.ok) setRefreshError(result.error);
    });
  }

  if (!readings) {
    return (
      <div className="flex flex-col gap-3 rounded-(--radius-card) border border-border bg-surface p-5">
        <p className="text-base text-foreground">
          {error ?? "Nie udało się wczytać czytań na dziś."}
        </p>
        <Button variant="outline" onClick={handleRefresh} isLoading={isPending} className="self-start">
          <RefreshCw className="h-4 w-4" />
          Spróbuj ponownie
        </Button>
        {refreshError && <p className="text-sm text-danger">{refreshError}</p>}
      </div>
    );
  }

  const sections = buildSections(readings);

  return (
    <div className="flex flex-col gap-3">
      {(isStale || error) && (
        <div className="flex flex-col gap-2 rounded-(--radius-card) border border-warning/40 bg-warning-soft p-4">
          <p className="text-sm text-foreground">
            {error ?? "Pokazujemy ostatnio pobrane czytania."}
            {isStale && readings.reading_date !== dateKey && ` (z dnia ${readings.reading_date})`}
          </p>
          <Button variant="outline" size="sm" onClick={handleRefresh} isLoading={isPending} className="self-start">
            <RefreshCw className="h-4 w-4" />
            Pobierz ponownie
          </Button>
          {refreshError && <p className="text-sm text-danger">{refreshError}</p>}
        </div>
      )}

      {readings.day_name && (
        <p className="text-sm text-foreground-muted">{readings.day_name}</p>
      )}

      {sections.map((section) => {
        const isOpen = open[section.id] ?? false;
        return (
          <section key={section.id} className="overflow-hidden rounded-(--radius-card) border border-border bg-surface">
            <button
              type="button"
              onClick={() => setOpen((prev) => ({ ...prev, [section.id]: !isOpen }))}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
            >
              <span>
                <span className="block text-base font-semibold text-foreground">{section.label}</span>
                {section.citation && (
                  <span className="block text-sm text-foreground-muted">{section.citation}</span>
                )}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-foreground-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <div className="border-t border-border px-4 py-4">
                {section.refrain && (
                  <p className="mb-3 rounded-(--radius-control) bg-primary-soft px-3 py-2 text-base font-medium text-foreground">
                    Refren: {section.refrain}
                  </p>
                )}
                <p className="whitespace-pre-line text-[1.0625rem] leading-relaxed text-foreground">
                  {section.text}
                </p>
              </div>
            )}
          </section>
        );
      })}

      {readings.source_url && (
        <p className="text-xs text-foreground-muted">
          Źródło czytań:{" "}
          <a href={readings.source_url} target="_blank" rel="noreferrer" className="underline">
            mateusz.pl/czytania
          </a>
        </p>
      )}
    </div>
  );
}
