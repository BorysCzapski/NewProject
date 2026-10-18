"use client";

// ============================================================================
// components/informatyka/sql-console.tsx
// "SQL" tab: write queries against the exam's tables (imported from the data
// files, plus empty tables for those the statement only describes) and see the
// result grid. The SQL autosaves; a result can be copied into the answer.
// ============================================================================
import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { ClipboardPaste, Loader2, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeEditor, type CodeEditorHandle } from "@/components/informatyka/code-editor";
import type { CodeAreaHandle } from "@/components/informatyka/python-runner";
import { loadDataFiles } from "@/lib/informatyka/data-files-client";
import { openSession, type QueryResult, type SqlSession } from "@/lib/informatyka/sql-db";
import { saveWork } from "@/lib/informatyka/actions";

const MAX_ROWS = 500;

export function SqlConsole({
  problemId,
  examId,
  dataFiles,
  extraSchema,
  initialSql,
  onUseAsAnswer,
  handle,
}: {
  problemId: string;
  examId: string;
  dataFiles: string[];
  extraSchema: string | null;
  initialSql: string;
  /** "Use as answer": the last result set as plain text (one row per line). */
  onUseAsAnswer?: (text: string) => void;
  handle?: Ref<CodeAreaHandle>;
}) {
  const editor = useRef<CodeEditorHandle>(null);
  useImperativeHandle(handle, () => ({ replace: (text: string) => editor.current?.replace(text) }));
  const [sql, setSql] = useState(initialSql || "SELECT * FROM ");
  const [session, setSession] = useState<SqlSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<QueryResult[] | null>(null);
  const [loading, setLoading] = useState(true);
  const sqlRef = useRef(sql);
  const sessionRef = useRef<SqlSession | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [epoch, setEpoch] = useState(0);

  function reset() {
    setLoading(true);
    setError(null);
    setResults(null);
    setEpoch((n) => n + 1);
  }

  useEffect(() => {
    let cancelled = false;
    loadDataFiles(examId, dataFiles)
      .then((files) => openSession(files, extraSchema))
      .then((next) => {
        if (cancelled) return next.close();
        sessionRef.current?.close();
        sessionRef.current = next;
        setSession(next);
      })
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : String(err)))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // data files / schema are fixed per problem; `epoch` re-opens a clean database
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epoch]);

  useEffect(
    () => () => {
      sessionRef.current?.close();
      if (saveTimer.current) clearTimeout(saveTimer.current);
    },
    []
  );

  function handleChange(next: string) {
    setSql(next);
    sqlRef.current = next;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => void saveWork(problemId, "sql_text", next), 1000);
  }

  function run() {
    const active = sessionRef.current;
    if (!active) return;
    setError(null);
    try {
      setResults(active.run(sqlRef.current));
    } catch (err) {
      setResults(null);
      setError(err instanceof Error ? err.message : String(err));
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {session && (
        <details className="text-xs text-foreground-muted">
          <summary className="cursor-pointer font-semibold">
            Tabele: {session.tables.map((t) => t.name).join(", ")}
          </summary>
          <ul className="mt-1.5 flex flex-col gap-1 font-mono">
            {session.tables.map((t) => (
              <li key={t.name}>
                <span className="text-foreground">{t.name}</span>({t.columns.join(", ")}) — {t.rowCount} wierszy
                {t.rowCount === 0 && extraSchema ? " (tylko schemat z treści zadania)" : ""}
              </li>
            ))}
          </ul>
        </details>
      )}
      <CodeEditor value={sql} onChange={handleChange} onRun={run} language="sql" minHeight="9rem" handle={editor} />
      <div className="flex items-center gap-3">
        <Button onClick={run} disabled={!session}>
          <Play className="h-4 w-4" /> Wykonaj
        </Button>
        <Button variant="ghost" onClick={reset} disabled={loading}>
          <RotateCcw className="h-4 w-4" /> Reset bazy
        </Button>
        {loading && (
          <span className="flex items-center gap-1.5 text-xs text-foreground-muted">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Przygotowuję bazę…
          </span>
        )}
      </div>
      <p className="text-xs text-foreground-muted">
        Silnik to SQLite z podstawowymi funkcjami MySQL (YEAR, MONTH, CONCAT, DATEDIFF, IF…). Uwaga: dzielenie dwóch
        liczb całkowitych daje tu liczbę całkowitą — użyj np. <span className="font-mono">x * 1.0 / y</span>.
      </p>
      {error && <pre className="whitespace-pre-wrap rounded-(--radius-control) bg-danger-soft p-3 font-mono text-xs text-danger">{error}</pre>}
      {results && results.length === 0 && <p className="text-xs text-foreground-muted">Zapytanie wykonane — brak wyniku do pokazania.</p>}
      {results?.map((r, i) => (
        <div key={i} className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-foreground-muted">
              {r.rows.length} {r.rows.length === 1 ? "wiersz" : "wierszy"}
              {r.rows.length > MAX_ROWS ? ` (pokazano pierwsze ${MAX_ROWS})` : ""}
            </p>
            {onUseAsAnswer && i === results.length - 1 && r.rows.length > 0 && (
              <button
                type="button"
                onClick={() => onUseAsAnswer(r.rows.map((row) => row.map((c) => (c === null ? "" : String(c))).join(" ")).join("\n"))}
                className="flex items-center gap-1.5 text-xs font-medium text-primary"
              >
                <ClipboardPaste className="h-3.5 w-3.5" /> Użyj jako odpowiedzi
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-auto rounded-(--radius-control) border border-border">
            <table className="w-full border-collapse text-left font-mono text-xs">
              <thead className="sticky top-0 bg-surface-muted">
                <tr>
                  {r.columns.map((c) => (
                    <th key={c} className="border-b border-border px-2 py-1.5 font-semibold text-foreground">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {r.rows.slice(0, MAX_ROWS).map((row, ri) => (
                  <tr key={ri} className="odd:bg-surface even:bg-surface-muted/40">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-2 py-1 text-foreground">
                        {cell === null ? <span className="text-foreground-muted">NULL</span> : String(cell)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
