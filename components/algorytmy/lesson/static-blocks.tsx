// ============================================================================
// components/algorytmy/lesson/static-blocks.tsx
// The non-interactive blocks: intro, definition, tip, code, complexity, steps,
// compare and table. Grouped in one file for the same reason Geografia groups
// its text blocks — each is a handful of lines of markup with no state. Every
// interactive block still gets its own file, because each of those carries a
// real algorithm implementation.
// ============================================================================
import { GraduationCap, Lightbulb, TriangleAlert } from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { RichText } from "@/components/algorytmy/lesson/rich-text";
import type {
  AlgoCodeLanguage,
  AlgoComplexityRow,
  AlgoCompareRow,
  AlgoStep,
} from "@/lib/algorytmy/lesson-blocks";
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

const TIP_STYLES = {
  tip: { icon: Lightbulb, wrapper: "bg-accent-soft", accent: "text-accent", label: "Wskazówka" },
  warning: { icon: TriangleAlert, wrapper: "bg-warning-soft", accent: "text-warning", label: "Uwaga" },
  exam: { icon: GraduationCap, wrapper: "bg-primary-soft", accent: "text-primary", label: "Warto zapamiętać" },
} as const;

export function TipBlock({ variant, text }: { variant: "tip" | "warning" | "exam"; text: string }) {
  const style = TIP_STYLES[variant];
  const Icon = style.icon;
  return (
    <div className={cn("flex gap-2.5 rounded-(--radius-control) px-3.5 py-3", style.wrapper)}>
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", style.accent)} />
      <div className="min-w-0 flex-1">
        <p className={cn("text-xs font-semibold uppercase tracking-wide", style.accent)}>{style.label}</p>
        <RichText text={text} className="text-sm text-foreground" />
      </div>
    </div>
  );
}

const LANGUAGE_LABELS: Record<AlgoCodeLanguage, string> = {
  python: "Python",
  javascript: "JavaScript",
  pseudokod: "Pseudokod",
};

export function CodeBlock({
  title,
  language,
  code,
  caption,
}: {
  title?: string;
  language: AlgoCodeLanguage;
  code: string;
  caption?: string;
}) {
  return (
    <figure className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between gap-2">
        {title ? (
          <p className="text-sm font-semibold text-foreground">{title}</p>
        ) : (
          <span />
        )}
        <span className="shrink-0 text-xs font-medium text-foreground-muted">
          {LANGUAGE_LABELS[language]}
        </span>
      </div>
      {/* Horizontal scroll on the <pre> itself: a long line must never widen
          the page on a phone. */}
      <pre className="overflow-x-auto rounded-(--radius-control) bg-surface-muted px-3.5 py-3 text-xs leading-relaxed">
        <code className="font-mono text-foreground">{code}</code>
      </pre>
      {caption && <RichText text={caption} className="text-xs text-foreground-muted" as="figcaption" />}
    </figure>
  );
}

export function ComplexityBlock({
  title,
  rows,
  note,
}: {
  title?: string;
  rows: AlgoComplexityRow[];
  note?: string;
}) {
  // Only render the best/average columns when at least one row fills them —
  // most tables give the worst case alone, and three mostly-empty columns
  // waste the width a phone does not have.
  const hasBest = rows.some((r) => r.best);
  const hasAverage = rows.some((r) => r.average);

  return (
    <figure className="flex flex-col gap-1.5">
      {title && <p className="text-sm font-semibold text-foreground">{title}</p>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[20rem] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-border text-foreground-muted">
              <th className="py-1.5 pr-3 font-medium">Operacja</th>
              {hasBest && <th className="py-1.5 pr-3 font-medium">Najlepszy</th>}
              {hasAverage && <th className="py-1.5 pr-3 font-medium">Średni</th>}
              <th className="py-1.5 font-medium">Pesymistyczny</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0 align-top">
                <td className="py-1.5 pr-3 text-foreground">
                  {row.operation}
                  {row.note && <span className="block text-foreground-muted">{row.note}</span>}
                </td>
                {hasBest && <td className="py-1.5 pr-3 font-mono text-foreground-muted">{row.best ?? "—"}</td>}
                {hasAverage && (
                  <td className="py-1.5 pr-3 font-mono text-foreground-muted">{row.average ?? "—"}</td>
                )}
                <td className="py-1.5 font-mono font-semibold text-foreground">{row.worst}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note && <RichText text={note} className="text-xs text-foreground-muted" as="figcaption" />}
    </figure>
  );
}

export function StepsBlock({ title, steps }: { title: string; steps: AlgoStep[] }) {
  return (
    <Card className="flex flex-col gap-3">
      <CardTitle>{title}</CardTitle>
      <ol className="flex flex-col gap-2.5">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
              {i + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">{step.title}</p>
              <RichText text={step.text} className="text-sm text-foreground-muted" />
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

export function CompareBlock({
  title,
  leftLabel,
  rightLabel,
  rows,
}: {
  title: string;
  leftLabel: string;
  rightLabel: string;
  rows: AlgoCompareRow[];
}) {
  return (
    <Card className="flex flex-col gap-2">
      <CardTitle>{title}</CardTitle>
      <div className="flex flex-col gap-2">
        {rows.map((row, i) => (
          <div key={i} className="rounded-(--radius-control) bg-surface-muted px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">
              {row.aspect}
            </p>
            <div className="mt-1 grid gap-1.5 sm:grid-cols-2">
              <div>
                <p className="text-xs font-medium text-primary">{leftLabel}</p>
                <RichText text={row.left} className="text-sm text-foreground" />
              </div>
              <div>
                <p className="text-xs font-medium text-accent">{rightLabel}</p>
                <RichText text={row.right} className="text-sm text-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function TableBlock({
  title,
  caption,
  headers,
  rows,
}: {
  title?: string;
  caption?: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <figure className="flex flex-col gap-1.5">
      {title && <p className="text-sm font-semibold text-foreground">{title}</p>}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[20rem] border-collapse text-left text-xs">
          <thead>
            <tr className="border-b border-border text-foreground-muted">
              {headers.map((header, i) => (
                <th key={i} className="py-1.5 pr-3 font-medium last:pr-0">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0 align-top">
                {row.map((cell, j) => (
                  <td key={j} className="py-1.5 pr-3 text-foreground last:pr-0">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <RichText text={caption} className="text-xs text-foreground-muted" as="figcaption" />}
    </figure>
  );
}
