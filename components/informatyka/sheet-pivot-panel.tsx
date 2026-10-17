"use client";

// ============================================================================
// components/informatyka/sheet-pivot-panel.tsx
// Pivot-table builder for the spreadsheet tab (Univer's pivots are a paid
// feature): group the selected block (first row = headers) by one or two
// columns and aggregate a value column; the result can be written into a new
// worksheet.
// ============================================================================
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { toNumber, type Matrix } from "@/lib/informatyka/sheet-data";

type Agg = "sum" | "avg" | "count" | "min" | "max";
const AGGS: { id: Agg; label: string }[] = [
  { id: "sum", label: "Suma" },
  { id: "avg", label: "Średnia" },
  { id: "count", label: "Liczba" },
  { id: "min", label: "Min" },
  { id: "max", label: "Max" },
];

function aggregate(values: number[], agg: Agg, count: number): number | string {
  if (agg === "count") return count;
  if (values.length === 0) return "";
  if (agg === "sum") return values.reduce((a, b) => a + b, 0);
  if (agg === "avg") return values.reduce((a, b) => a + b, 0) / values.length;
  return agg === "min" ? Math.min(...values) : Math.max(...values);
}

const cmp = (a: string, b: string) => {
  const x = toNumber(a);
  const y = toNumber(b);
  return x !== null && y !== null ? x - y : a.localeCompare(b, "pl");
};

export function SheetPivotPanel({
  readSelection,
  writeSheet,
}: {
  readSelection: () => Matrix | null;
  writeSheet: (matrix: Matrix) => void;
}) {
  const [source, setSource] = useState<Matrix | null>(null);
  const [rowCol, setRowCol] = useState(0);
  const [colCol, setColCol] = useState(-1);
  const [valueCol, setValueCol] = useState(1);
  const [agg, setAgg] = useState<Agg>("sum");
  const [message, setMessage] = useState<string | null>(null);

  function useSelection() {
    const m = readSelection();
    if (!m || m.length < 2 || m[0].length < 2) {
      setMessage("Zaznacz blok danych z wierszem nagłówków (min. 2 kolumny i 2 wiersze).");
      return;
    }
    setMessage(null);
    setSource(m);
    setRowCol(0);
    setColCol(-1);
    setValueCol(Math.min(1, m[0].length - 1));
  }

  const result = useMemo<Matrix | null>(() => {
    if (!source) return null;
    const headers = source[0].map((h, i) => String(h ?? `Kolumna ${i + 1}`));
    const body = source.slice(1);
    const rowKeys = [...new Set(body.map((r) => String(r[rowCol] ?? "")))].sort(cmp);
    const colKeys = colCol >= 0 ? [...new Set(body.map((r) => String(r[colCol] ?? "")))].sort(cmp) : [null];
    const out: Matrix = [[headers[rowCol], ...colKeys.map((k) => k ?? `${AGGS.find((a) => a.id === agg)?.label}: ${headers[valueCol]}`)]];
    for (const rk of rowKeys) {
      const line: Matrix[number] = [rk];
      for (const ck of colKeys) {
        const cell = body.filter((r) => String(r[rowCol] ?? "") === rk && (ck === null || String(r[colCol] ?? "") === ck));
        const nums = cell.map((r) => toNumber(r[valueCol])).filter((n): n is number => n !== null);
        line.push(aggregate(nums, agg, cell.length));
      }
      out.push(line);
    }
    return out;
  }, [source, rowCol, colCol, valueCol, agg]);

  const headers = source ? source[0].map((h, i) => String(h ?? `Kolumna ${i + 1}`)) : [];
  const select = "h-9 rounded-(--radius-control) border border-border bg-surface px-2 text-sm text-foreground";
  return (
    <div className="flex flex-col gap-3">
      <Button onClick={useSelection} variant="secondary" className="self-start">
        Użyj zaznaczenia
      </Button>
      {message && <p className="text-xs text-danger">{message}</p>}
      {source && (
        <>
          <div className="grid gap-2 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-xs text-foreground-muted">
              Wiersze
              <select className={select} value={rowCol} onChange={(e) => setRowCol(Number(e.target.value))}>
                {headers.map((h, i) => (
                  <option key={i} value={i}>
                    {h}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-foreground-muted">
              Kolumny (opcjonalnie)
              <select className={select} value={colCol} onChange={(e) => setColCol(Number(e.target.value))}>
                <option value={-1}>— brak —</option>
                {headers.map((h, i) => (
                  <option key={i} value={i}>
                    {h}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-foreground-muted">
              Wartości
              <select className={select} value={valueCol} onChange={(e) => setValueCol(Number(e.target.value))}>
                {headers.map((h, i) => (
                  <option key={i} value={i}>
                    {h}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-foreground-muted">
              Funkcja
              <select className={select} value={agg} onChange={(e) => setAgg(e.target.value as Agg)}>
                {AGGS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {result && (
            <>
              <div className="max-h-72 overflow-auto rounded-(--radius-control) border border-border">
                <table className="w-full border-collapse text-left font-mono text-xs">
                  <thead className="sticky top-0 bg-surface-muted">
                    <tr>
                      {result[0].map((c, i) => (
                        <th key={i} className="px-2 py-1.5 font-semibold text-foreground">
                          {String(c)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.slice(1).map((r, ri) => (
                      <tr key={ri} className="odd:bg-surface even:bg-surface-muted/40">
                        {r.map((c, ci) => (
                          <td key={ci} className="px-2 py-1 text-foreground">
                            {typeof c === "number" ? Number(c.toFixed(4)) : String(c ?? "")}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Button onClick={() => writeSheet(result)} variant="secondary" className="self-start">
                Wstaw do nowego arkusza
              </Button>
            </>
          )}
        </>
      )}
    </div>
  );
}
