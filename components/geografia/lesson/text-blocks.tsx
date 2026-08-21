// ============================================================================
// components/geografia/lesson/text-blocks.tsx
// The purely presentational, non-interactive blocks: intro, definition,
// case-study, mnemonic and tip. Grouped in one file (unlike Matma's
// one-component-per-file lesson blocks) because each is a handful of lines
// of markup with no state and no logic — splitting five 12-line components
// across five files with five header comments would be noise, not structure.
// Every interactive block still gets its own file.
// ============================================================================
import { GraduationCap, Lightbulb, MapPinned, Sparkles, TriangleAlert } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { RichText } from "@/components/geografia/lesson/rich-text";
import { cn } from "@/lib/utils";

export function IntroBlock({ text }: { text: string }) {
  return <RichText text={text} className="text-base text-foreground" />;
}

export function DefinitionBlock({ term, text, note }: { term: string; text: string; note?: string }) {
  return (
    <Card className="border-l-4 border-l-primary">
      <CardTitle className="text-primary">{term}</CardTitle>
      <RichText text={text} className="mt-1.5 text-sm text-foreground" />
      {note && <RichText text={note} className="mt-2 text-xs text-foreground-muted" />}
    </Card>
  );
}

export function CaseStudyBlock({
  title,
  region,
  text,
  takeaway,
}: {
  title: string;
  region: string;
  text: string;
  takeaway: string;
}) {
  return (
    <Card className="flex flex-col gap-2 bg-surface-muted">
      <div className="flex items-start gap-2">
        <MapPinned className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
            Studium przypadku · {region}
          </p>
          <CardTitle>{title}</CardTitle>
        </div>
      </div>
      <RichText text={text} className="text-sm text-foreground" />
      <div className="rounded-(--radius-control) bg-surface px-3 py-2">
        <p className="text-xs font-semibold text-foreground-muted">Wniosek</p>
        <RichText text={takeaway} className="text-sm text-foreground" />
      </div>
    </Card>
  );
}

export function MnemonicBlock({ title, text, expansion }: { title?: string; text: string; expansion?: string }) {
  return (
    <div className="flex gap-2.5 rounded-(--radius-control) bg-accent-soft px-3.5 py-3">
      <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-accent">
          {title ?? "Sposób na zapamiętanie"}
        </p>
        <RichText text={text} className="text-sm font-medium text-accent" />
        {expansion && <RichText text={expansion} className="mt-1 text-xs text-accent/80" />}
      </div>
    </div>
  );
}

const TIP_STYLES = {
  tip: { wrap: "bg-primary-soft", text: "text-primary", Icon: Lightbulb, label: "Wskazówka" },
  warning: { wrap: "bg-warning-soft", text: "text-warning", Icon: TriangleAlert, label: "Uwaga — częsty błąd" },
  exam: { wrap: "bg-accent-soft", text: "text-accent", Icon: GraduationCap, label: "Na maturze" },
} as const;

export function TipBlock({ variant, text }: { variant: "tip" | "warning" | "exam"; text: string }) {
  const { wrap, text: textClass, Icon, label } = TIP_STYLES[variant];
  return (
    <div className={cn("flex gap-2.5 rounded-(--radius-control) px-3.5 py-3", wrap)}>
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", textClass)} />
      <div className="min-w-0 flex-1">
        <p className={cn("text-xs font-semibold uppercase tracking-wide", textClass)}>{label}</p>
        <RichText text={text} className={cn("text-sm", textClass)} />
      </div>
    </div>
  );
}
