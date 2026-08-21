// ============================================================================
// components/modlitwa/breviary-view.tsx
// Pełny tekst godziny brewiarza pobrany z ILG (brewiarz.pl).
//
// Rubryki (w brewiarzu drukowane na czerwono: „K.”, „W.”, wskazówki, numery
// zwrotek) renderujemy czerwoną barwą — nie jest to ozdoba, tylko sposób
// odróżnienia tego, co się MÓWI, od tego, co się ROBI. Reszta idzie zwykłym,
// dużym krojem, bo aplikacja ma być czytelna także dla osób starszych.
//
// Dane pochodzą z zaufanego, sparsowanego źródła i są przechowywane jako
// struktura (nie HTML), więc renderujemy je jak zwykły tekst — żadnego
// dangerouslySetInnerHTML.
// ============================================================================
import type { BreviaryHourContent } from "@/lib/modlitwa/breviary-source";
import { SOURCE_COPYRIGHT } from "@/lib/modlitwa/breviary-source";
import { Card } from "@/components/ui/card";

export function BreviaryView({ content }: { content: BreviaryHourContent }) {
  return (
    <div className="flex flex-col gap-3">
      {(content.title || content.subtitle) && (
        <div>
          {content.title && <h2 className="text-lg font-semibold text-foreground">{content.title}</h2>}
          {content.subtitle && <p className="text-sm text-foreground-muted">{content.subtitle}</p>}
        </div>
      )}

      {content.sections.map((section, sectionIndex) => (
        <Card key={`${section.id}-${sectionIndex}`} className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-primary">{section.title}</h3>

          <div className="flex flex-col gap-1">
            {section.lines.map((line, lineIndex) => (
              <p key={lineIndex} className="text-[1.0625rem] leading-relaxed text-foreground">
                {line.map((segment, segmentIndex) =>
                  segment.r ? (
                    <span key={segmentIndex} className="text-danger">
                      {segment.t}
                    </span>
                  ) : (
                    <span key={segmentIndex}>{segment.t}</span>
                  )
                )}
              </p>
            ))}
          </div>
        </Card>
      ))}

      <p className="text-xs text-foreground-muted">
        Źródło:{" "}
        <a href={content.sourceUrl} target="_blank" rel="noreferrer" className="underline">
          brewiarz.pl — Internetowa Liturgia Godzin
        </a>
        . {SOURCE_COPYRIGHT}
      </p>
    </div>
  );
}
