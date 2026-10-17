"use client";

// ============================================================================
// components/informatyka/spreadsheet.tsx
// "Arkusz" tab: an in-browser spreadsheet (Univer core — formulas, sorting,
// filtering, formatting) preloaded with the exam data files, one worksheet per
// file, plus our own Chart / Pivot / formula-cheatsheet panels underneath.
// The workbook snapshot autosaves to the informatyka-sheets bucket and is
// restored on the next visit. Loaded with next/dynamic (ssr: false) — Univer is heavy.
// ============================================================================
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { createUniver, LocaleType, mergeLocales } from "@univerjs/presets";
import { UniverSheetsCorePreset } from "@univerjs/preset-sheets-core";
import plPL from "@univerjs/preset-sheets-core/locales/pl-PL";
import "@univerjs/preset-sheets-core/lib/index.css";
import { cn } from "@/lib/utils";
import { loadDataFiles } from "@/lib/informatyka/data-files-client";
import { buildWorkbook, type Matrix } from "@/lib/informatyka/sheet-data";
import { saveSheet } from "@/lib/informatyka/actions";
import { translateFormula } from "@/lib/informatyka/formula-translate";
import { FormulaCheatsheet } from "@/components/informatyka/formula-cheatsheet";
import { SheetChartPanel } from "@/components/informatyka/sheet-chart-panel";
import { SheetPivotPanel } from "@/components/informatyka/sheet-pivot-panel";

type Api = ReturnType<typeof createUniver>["univerAPI"];
type PanelId = "chart" | "pivot" | "cheat";
const PANELS: { id: PanelId; label: string }[] = [
  { id: "chart", label: "Wykres" },
  { id: "pivot", label: "Tabela przestawna" },
  { id: "cheat", label: "Ściągawka funkcji" },
];

export default function Spreadsheet({
  problemId,
  examId,
  dataFiles,
  snapshotUrl,
}: {
  problemId: string;
  examId: string;
  dataFiles: string[];
  snapshotUrl: string | null;
}) {
  const container = useRef<HTMLDivElement>(null);
  const api = useRef<Api | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [panel, setPanel] = useState<PanelId>("chart");

  useEffect(() => {
    let disposed = false;
    let dispose: (() => void) | null = null;
    let saveTimer: ReturnType<typeof setTimeout> | null = null;
    let dirty = false;

    (async () => {
      try {
        const [files, snapshot] = await Promise.all([
          loadDataFiles(examId, dataFiles),
          snapshotUrl ? fetch(snapshotUrl).then((r) => (r.ok ? r.json() : null)).catch(() => null) : null,
        ]);
        if (disposed || !container.current) return;

        const { univer, univerAPI } = createUniver({
          locale: LocaleType.PL_PL,
          locales: { [LocaleType.PL_PL]: mergeLocales(plPL) },
          presets: [UniverSheetsCorePreset({ container: container.current })],
        });
        api.current = univerAPI;
        dispose = () => univer.dispose();
        univerAPI.createWorkbook(snapshot ?? buildWorkbook(files));

        // exam-style (Polish) formulas → the English dialect Univer understands
        univerAPI.addEvent(univerAPI.Event.CommandExecuted, (event) => {
          if (event.id !== "sheet.command.set-range-values") return;
          const params = event.params as
            | {
                range?: { startRow: number; startColumn: number };
                value?: { f?: string } | Record<number, Record<number, { f?: string }>>;
              }
            | undefined;
          const sheet = univerAPI.getActiveWorkbook()?.getActiveSheet();
          if (!params?.value || !sheet) return;

          const fix = (row: number, col: number, f: unknown) => {
            if (typeof f !== "string") return;
            const translated = translateFormula(f);
            if (translated !== f) sheet.getRange(row, col).setFormula(translated);
          };
          const value = params.value as Record<string, unknown>;
          if ("f" in value || "v" in value || "p" in value) {
            // editor commit: one cell + the range it was written to
            if (params.range) fix(params.range.startRow, params.range.startColumn, value.f);
          } else {
            // matrix form: row → column → cell
            for (const [r, row] of Object.entries(value as Record<string, Record<string, { f?: string }>>)) {
              for (const [c, cell] of Object.entries(row ?? {})) fix(Number(r), Number(c), cell?.f);
            }
          }
        });

        // debounce-save the whole workbook after any edit
        univerAPI.addEvent(univerAPI.Event.CommandExecuted, (event) => {
          if (event.type !== 2 /* CommandType.MUTATION */) return;
          if (saveTimer) clearTimeout(saveTimer);
          dirty = true;
          setSaved("saving");
          saveTimer = setTimeout(async () => {
            const wb = univerAPI.getActiveWorkbook();
            if (!wb) return;
            dirty = false;
            const result = await saveSheet(problemId, JSON.stringify(wb.save()));
            setSaved(result.ok ? "saved" : "error");
          }, 2000);
        });
        setStatus("ready");
      } catch (err) {
        if (!disposed) {
          setError(err instanceof Error ? err.message : String(err));
          setStatus("error");
        }
      }
    })();

    return () => {
      disposed = true;
      if (saveTimer) clearTimeout(saveTimer);
      // leaving the tab within the debounce window must not lose the last edits
      const wb = dirty ? api.current?.getActiveWorkbook() : null;
      if (wb) void saveSheet(problemId, JSON.stringify(wb.save()));
      api.current = null;
      dispose?.();
    };
    // data files / snapshot are fixed per problem
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function readSelection(): Matrix | null {
    const range = api.current?.getActiveWorkbook()?.getActiveSheet().getSelection()?.getActiveRange();
    return range ? (range.getValues() as Matrix) : null;
  }

  function writeSheet(matrix: Matrix) {
    const wb = api.current?.getActiveWorkbook();
    if (!wb) return;
    const rows = matrix.length;
    const cols = Math.max(...matrix.map((r) => r.length));
    const sheet = wb.create(`Przestawna ${wb.getSheets().length + 1}`, rows + 20, cols + 5);
    sheet
      .getRange(0, 0, rows, cols)
      .setValues(matrix.map((r) => Array.from({ length: cols }, (_, i) => r[i] ?? "")) as never);
    wb.setActiveSheet(sheet);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative h-[34rem] overflow-hidden rounded-(--radius-card) border border-border bg-white">
        <div ref={container} className="h-full w-full" />
        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-white text-sm text-neutral-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Wczytuję arkusz…
          </div>
        )}
      </div>
      {status === "error" && <p className="text-sm text-danger">Nie udało się uruchomić arkusza: {error}</p>}
      <p className="text-right text-xs text-foreground-muted">
        {saved === "saving" ? "Zapisuję…" : saved === "saved" ? "Zapisano" : saved === "error" ? "Nie udało się zapisać" : ""}
      </p>

      <div className="flex flex-col gap-3 rounded-(--radius-card) border border-border/70 bg-surface p-3 shadow-(--shadow-card)">
        <div role="tablist" className="flex gap-1 rounded-full bg-surface-muted p-1">
          {PANELS.map((p) => (
            <button
              key={p.id}
              role="tab"
              aria-selected={panel === p.id}
              onClick={() => setPanel(p.id)}
              className={cn(
                "flex-1 rounded-full px-2 py-1.5 text-xs font-medium transition-colors",
                panel === p.id ? "bg-surface text-foreground shadow-(--shadow-control)" : "text-foreground-muted"
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        {panel === "chart" && <SheetChartPanel readSelection={readSelection} />}
        {panel === "pivot" && <SheetPivotPanel readSelection={readSelection} writeSheet={writeSheet} />}
        {panel === "cheat" && <FormulaCheatsheet />}
      </div>
    </div>
  );
}
