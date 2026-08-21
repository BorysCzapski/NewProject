// ============================================================================
// components/modlitwa/hour-view.tsx
// Przewodnik po strukturze godziny — ścieżka AWARYJNA, używana gdy nie mamy
// pełnych tekstów z ILG (patrz components/modlitwa/breviary-view.tsx).
//
// Pokazuje kolejne części godziny z tekstami stałymi, siglami psalmów i
// czytaniem z dzisiejszej liturgii słowa. Przycisk odhaczenia jest osobnym
// komponentem (hour-done-button.tsx), bo wspólny dla obu ścieżek.
// ============================================================================
import { ExternalLink } from "lucide-react";
import type { AssembledHour } from "@/lib/modlitwa/hours";
import { Card } from "@/components/ui/card";

export function HourView({ hour }: { hour: AssembledHour }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-foreground-muted">{hour.definition.description}</p>

      <ol className="flex flex-col gap-3">
        {hour.steps.map((step, index) => (
          <li key={`${step.title}-${index}`}>
            <Card className="flex flex-col gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-xs font-semibold text-primary">{index + 1}</span>
                <h2 className="text-base font-semibold text-foreground">{step.title}</h2>
              </div>

              {step.citation && <p className="text-sm font-medium text-foreground-muted">{step.citation}</p>}

              {step.text && (
                <p className="whitespace-pre-line text-[1.0625rem] leading-relaxed text-foreground">
                  {step.text}
                </p>
              )}

              {step.incipit && (
                <p className="text-[1.0625rem] italic leading-relaxed text-foreground">{step.incipit}</p>
              )}

              {step.note && <p className="text-sm text-foreground-muted">{step.note}</p>}
            </Card>
          </li>
        ))}
      </ol>

      <a
        href={hour.fullTextUrl}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 self-start text-sm font-medium text-primary"
      >
        <ExternalLink className="h-4 w-4" />
        Pełne teksty na brewiarz.pl
      </a>
    </div>
  );
}
