// ============================================================================
// components/geografia/lesson/data-blocks.tsx
// Static reference blocks: key-numbers, formula, table, compare and
// classification. Grouped for the same reason as text-blocks.tsx — each is
// short, stateless markup over authored data.
//
// `compare` gets a mobile-first treatment (stacked pairs, not a 3-column
// table) because side-by-side contrasts are the single most common geography
// structure — ciepły vs chłodny front, wietrzenie vs erozja, kraje wysoko vs
// słabo rozwinięte — and a 3-column table is unreadable at 390px.
// ============================================================================
import { Card, CardTitle } from "@/components/ui/card";
import { RichText, FormulaDisplay } from "@/components/geografia/lesson/rich-text";

export function KeyNumbersBlock({
  title,
  items,
}: {
  title?: string;
  items: { value: string; unit?: string; label: string; note?: string }[];
}) {
  return (
    <Card className="flex flex-col gap-3">
      <CardTitle>{title ?? "Liczby do zapamiętania"}</CardTitle>
      <div className="grid grid-cols-2 gap-3">
        {items.map((item, i) => (
          <div key={i} className="rounded-(--radius-control) bg-surface-muted px-3 py-2.5">
            <p className="text-xl font-bold leading-tight text-foreground">
              {item.value}
              {item.unit && <span className="ml-1 text-sm font-medium text-foreground-muted">{item.unit}</span>}
            </p>
            <p className="mt-0.5 text-xs font-medium text-foreground">{item.label}</p>
            {item.note && <p className="mt-0.5 text-xs text-foreground-muted">{item.note}</p>}
          </div>
        ))}
      </div>
    </Card>
  );
}

export function FormulaBlock({
  title,
  expression,
  variables,
  caption,
}: {
  title?: string;
  expression: string;
  variables?: { symbol: string; meaning: string }[];
  caption?: string;
}) {
  return (
    <Card className="flex flex-col gap-2">
      {title && <CardTitle>{title}</CardTitle>}
      <FormulaDisplay expression={expression} className="text-foreground" />
      {variables && variables.length > 0 && (
        <ul className="flex flex-col gap-1">
          {variables.map((v, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="shrink-0 font-semibold text-primary">{v.symbol}</span>
              <span className="text-foreground-muted">— {v.meaning}</span>
            </li>
          ))}
        </ul>
      )}
      {caption && <RichText text={caption} className="text-xs text-foreground-muted" />}
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
    <Card className="flex flex-col gap-2">
      {title && <CardTitle>{title}</CardTitle>}
      <div className="-mx-1 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              {headers.map((h, i) => (
                <th key={i} className="px-1.5 py-2 font-semibold text-foreground-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-border/60 last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className="px-1.5 py-2 align-top text-foreground">
                    <RichText text={cell} as="span" className="whitespace-normal" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <RichText text={caption} className="text-xs text-foreground-muted" />}
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
  rows: { aspect: string; left: string; right: string }[];
}) {
  return (
    <Card className="flex flex-col gap-3">
      <CardTitle>{title}</CardTitle>
      <div className="flex flex-col gap-3">
        {rows.map((row, i) => (
          <div key={i}>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-foreground-muted">{row.aspect}</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-(--radius-control) bg-primary-soft px-2.5 py-2">
                <p className="text-xs font-semibold text-primary">{leftLabel}</p>
                <RichText text={row.left} className="text-sm text-foreground" />
              </div>
              <div className="rounded-(--radius-control) bg-warning-soft px-2.5 py-2">
                <p className="text-xs font-semibold text-warning">{rightLabel}</p>
                <RichText text={row.right} className="text-sm text-foreground" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

export function ClassificationBlock({
  title,
  caption,
  groups,
}: {
  title: string;
  caption?: string;
  groups: { name: string; description: string; examples: string[] }[];
}) {
  return (
    <Card className="flex flex-col gap-3">
      <CardTitle>{title}</CardTitle>
      {caption && <RichText text={caption} className="text-sm text-foreground-muted" />}
      <div className="flex flex-col gap-2.5">
        {groups.map((group, i) => (
          <div key={i} className="rounded-(--radius-control) border border-border px-3 py-2.5">
            <p className="text-sm font-semibold text-foreground">{group.name}</p>
            <RichText text={group.description} className="mt-0.5 text-sm text-foreground-muted" />
            {group.examples.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {group.examples.map((example, j) => (
                  <span
                    key={j}
                    className="rounded-full bg-surface-muted px-2 py-0.5 text-xs font-medium text-foreground-muted"
                  >
                    {example}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
