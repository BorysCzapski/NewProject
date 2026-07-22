// ============================================================================
// components/matma/lesson/table-block.tsx
// A simple data table (e.g. sign charts, value tables). Header/cell text may
// embed $...$ KaTeX like any other prose field, so each cell renders through
// MathText rather than being dumped as a raw string.
// ============================================================================
import { Card, CardTitle } from "@/components/ui/card";
import { MathText } from "@/components/matma/math";
import { cn } from "@/lib/utils";

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
    <Card>
      {title && <CardTitle className="mb-3">{title}</CardTitle>}
      <div className="-mx-4 overflow-x-auto px-4">
        <table className="w-full min-w-max border-collapse text-sm">
          <thead>
            <tr>
              {headers.map((header, i) => (
                <th
                  key={i}
                  className="border-b-2 border-border px-2.5 py-2 text-left font-semibold text-foreground"
                >
                  <MathText text={header} className="whitespace-nowrap" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={cn(i % 2 === 1 && "bg-surface-muted/60")}>
                {row.map((cell, j) => (
                  <td
                    key={j}
                    className={cn(
                      "border-b border-border px-2.5 py-2 leading-relaxed",
                      j === 0 ? "font-medium text-foreground" : "text-foreground-muted"
                    )}
                  >
                    <MathText text={cell} className="whitespace-nowrap" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption && <p className="mt-2 text-sm text-foreground-muted">{caption}</p>}
    </Card>
  );
}
