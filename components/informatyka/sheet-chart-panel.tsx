"use client";

// ============================================================================
// components/informatyka/sheet-chart-panel.tsx
// Chart builder for the spreadsheet tab (Univer's own charts are a paid
// feature): takes the currently selected cells — first column = categories,
// other columns = series — and draws a column / line / pie chart with an
// editable title and axis labels, which is what the exam tasks ask for.
// ============================================================================
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { toNumber, type Matrix } from "@/lib/informatyka/sheet-data";

type ChartType = "bar" | "line" | "pie";
const COLORS = ["#6f8f7a", "#c9a45c", "#7a8fb5", "#b57a8f", "#8f7ab5", "#5fa8a0", "#c97c5d"];

export function SheetChartPanel({ readSelection }: { readSelection: () => Matrix | null }) {
  const [matrix, setMatrix] = useState<Matrix | null>(null);
  const [type, setType] = useState<ChartType>("bar");
  const [header, setHeader] = useState(true);
  const [title, setTitle] = useState("");
  const [xLabel, setXLabel] = useState("");
  const [yLabel, setYLabel] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function useSelection() {
    const m = readSelection();
    if (!m || m.length === 0 || m[0].length < 2) {
      setMessage("Zaznacz w arkuszu co najmniej dwie kolumny (kategorie + wartości).");
      return;
    }
    setMessage(null);
    setMatrix(m);
  }

  let names: string[] = [];
  let data: Record<string, string | number | null>[] = [];
  if (matrix) {
    const first = header ? matrix[0] : null;
    const rows = header ? matrix.slice(1) : matrix;
    names = matrix[0].slice(1).map((_, i) => (first ? String(first[i + 1] ?? `Seria ${i + 1}`) : `Seria ${i + 1}`));
    data = rows.map((r) => {
      const point: Record<string, string | number | null> = { category: String(r[0] ?? "") };
      names.forEach((n, i) => (point[n] = toNumber(r[i + 1])));
      return point;
    });
  }

  const input = "h-9 rounded-(--radius-control) border border-border bg-surface px-2.5 text-sm text-foreground";
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={useSelection} variant="secondary">
          Użyj zaznaczenia
        </Button>
        <select value={type} onChange={(e) => setType(e.target.value as ChartType)} className={input}>
          <option value="bar">Kolumnowy</option>
          <option value="line">Liniowy</option>
          <option value="pie">Kołowy</option>
        </select>
        <label className="flex items-center gap-1.5 text-xs text-foreground-muted">
          <input type="checkbox" checked={header} onChange={(e) => setHeader(e.target.checked)} />
          1. wiersz = nagłówki
        </label>
      </div>
      <div className="grid gap-2 sm:grid-cols-3">
        <input className={input} placeholder="Tytuł wykresu" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className={input} placeholder="Opis osi X" value={xLabel} onChange={(e) => setXLabel(e.target.value)} />
        <input className={input} placeholder="Opis osi Y" value={yLabel} onChange={(e) => setYLabel(e.target.value)} />
      </div>
      {message && <p className="text-xs text-danger">{message}</p>}
      {matrix && data.length > 0 && (
        <div className="rounded-(--radius-card) border border-border bg-white p-3 text-black">
          {title && <p className="mb-2 text-center text-sm font-semibold">{title}</p>}
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              {type === "pie" ? (
                <PieChart>
                  <Pie data={data} dataKey={names[0]} nameKey="category" label>
                    {data.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              ) : type === "line" ? (
                <LineChart data={data} margin={{ bottom: 16, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" label={{ value: xLabel, position: "insideBottom", offset: -10 }} />
                  <YAxis label={{ value: yLabel, angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  {names.length > 1 && <Legend verticalAlign="top" />}
                  {names.map((n, i) => (
                    <Line key={n} type="monotone" dataKey={n} stroke={COLORS[i % COLORS.length]} dot={false} />
                  ))}
                </LineChart>
              ) : (
                <BarChart data={data} margin={{ bottom: 16, left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" label={{ value: xLabel, position: "insideBottom", offset: -10 }} />
                  <YAxis label={{ value: yLabel, angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  {names.length > 1 && <Legend verticalAlign="top" />}
                  {names.map((n, i) => (
                    <Bar key={n} dataKey={n} fill={COLORS[i % COLORS.length]} />
                  ))}
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}
