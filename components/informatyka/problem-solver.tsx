"use client";

// ============================================================================
// components/informatyka/problem-solver.tsx
// The workspace of one problem: statement crops, tabbed tools (canvas, written
// answer; code / SQL / spreadsheet tabs join as those tools land), and the
// "check with the key" + self-scoring flow that marks the problem done.
// ============================================================================
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CanvasPanel } from "@/components/ink/canvas-panel";
import { PythonRunner } from "@/components/informatyka/python-runner";
import { SqlConsole } from "@/components/informatyka/sql-console";
import { completeProblem, reopenProblem, saveCanvas, saveWork } from "@/lib/informatyka/actions";
import type { InformatykaKind, InformatykaStatus } from "@/lib/types/database";

type TabId = "canvas" | "answer" | "code" | "sql";

const DEFAULT_TAB: Partial<Record<InformatykaKind, TabId>> = { program: "code", sql: "sql" };

function tabsFor(kind: InformatykaKind): { id: TabId; label: string }[] {
  return [
    ...(kind === "program" || kind === "pisemne" ? [{ id: "code" as const, label: "Kod" }] : []),
    ...(kind === "sql" ? [{ id: "sql" as const, label: "SQL" }] : []),
    { id: "canvas", label: "Canvas" },
    { id: "answer", label: "Odpowiedź" },
  ];
}

function Crops({ urls, alt }: { urls: string[]; alt: string }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-(--radius-card) border border-border bg-white">
      {urls.map((url, i) => (
        // Signed URL from a private bucket, unknown height — plain <img>, same as Maturalnik.
        // eslint-disable-next-line @next/next/no-img-element
        <img key={url} src={url} alt={`${alt} (${i + 1})`} className="w-full" />
      ))}
    </div>
  );
}

function AnswerPane({ problemId, initial }: { problemId: string; initial: string }) {
  const [value, setValue] = useState(initial);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  const onChange = useCallback(
    (next: string) => {
      setValue(next);
      setStatus("saving");
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(async () => {
        const result = await saveWork(problemId, "answer_text", next);
        setStatus(result.ok ? "saved" : "error");
      }, 700);
    },
    [problemId]
  );

  return (
    <div className="flex flex-col gap-1.5">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        spellCheck={false}
        placeholder="Twoja odpowiedź: wynik, pseudokod, zawartość pliku wynikowego…"
        className="w-full rounded-(--radius-control) border border-border bg-surface p-3 font-mono text-sm text-foreground shadow-(--shadow-control)"
      />
      <p className="text-right text-xs text-foreground-muted">
        {status === "saving" ? "Zapisuję…" : status === "saved" ? "Zapisano" : status === "error" ? "Nie udało się zapisać" : ""}
      </p>
    </div>
  );
}

export function ProblemSolver({
  problemId,
  examId,
  kind,
  dataFiles,
  resultFile,
  sqlExtraSchema,
  initialCode,
  initialSql,
  pointsMax,
  taskNumber,
  taskTitle,
  introUrls,
  statementUrls,
  keyUrls,
  canvasUrl,
  initialAnswer,
  initialStatus,
  initialScore,
}: {
  problemId: string;
  examId: string;
  kind: InformatykaKind;
  dataFiles: string[];
  resultFile: string | null;
  sqlExtraSchema: string | null;
  initialCode: string;
  initialSql: string;
  pointsMax: number;
  taskNumber: number;
  taskTitle: string;
  introUrls: string[];
  statementUrls: string[];
  keyUrls: string[];
  canvasUrl: string | null;
  initialAnswer: string;
  initialStatus: InformatykaStatus;
  initialScore: number | null;
}) {
  const router = useRouter();
  const tabs = tabsFor(kind);
  const [tab, setTab] = useState<TabId>(DEFAULT_TAB[kind] ?? "canvas");
  const [showKey, setShowKey] = useState(initialStatus === "done");
  const [status, setStatus] = useState(initialStatus);
  const [score, setScore] = useState<number | null>(initialScore);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function award(points: number) {
    setError(null);
    startTransition(async () => {
      const result = await completeProblem(problemId, points);
      if (!result.ok) return setError(result.error);
      setStatus("done");
      setScore(points);
      router.refresh();
    });
  }

  function reopen() {
    setError(null);
    startTransition(async () => {
      const result = await reopenProblem(problemId);
      if (!result.ok) return setError(result.error);
      setStatus("todo");
      setScore(null);
      router.refresh();
    });
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
      <div className="flex flex-col gap-3">
        {introUrls.length > 0 && (
          <details className="group" open>
            <summary className="mb-2 cursor-pointer text-sm font-semibold text-foreground-muted">
              Zadanie {taskNumber}
              {taskTitle ? ` — ${taskTitle}` : ""} (wstęp)
            </summary>
            <Crops urls={introUrls} alt="Wstęp do zadania" />
          </details>
        )}
        {statementUrls.length > 0 ? (
          <Crops urls={statementUrls} alt="Treść zadania" />
        ) : (
          <p className="rounded-(--radius-card) border border-border bg-surface p-4 text-center text-sm text-foreground-muted">
            Nie udało się wczytać treści zadania.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div>
          <div role="tablist" className="mb-3 flex gap-1 rounded-full bg-surface-muted p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                  tab === t.id ? "bg-surface text-foreground shadow-(--shadow-control)" : "text-foreground-muted"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
          {/* Panes stay mounted so switching tabs never drops canvas/editor state. */}
          {tabs.some((t) => t.id === "code") && (
            <div hidden={tab !== "code"}>
              <PythonRunner
                problemId={problemId}
                examId={examId}
                dataFiles={dataFiles}
                resultFile={resultFile}
                initialCode={initialCode}
              />
            </div>
          )}
          {kind === "sql" && (
            <div hidden={tab !== "sql"}>
              <SqlConsole
                problemId={problemId}
                examId={examId}
                dataFiles={dataFiles}
                extraSchema={sqlExtraSchema}
                initialSql={initialSql}
              />
            </div>
          )}
          <div hidden={tab !== "canvas"}>
            <CanvasPanel initialImageUrl={canvasUrl} save={(dataUrl) => saveCanvas(problemId, dataUrl)} />
          </div>
          <div hidden={tab !== "answer"}>
            <AnswerPane problemId={problemId} initial={initialAnswer} />
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-(--radius-card) border border-border/70 bg-surface p-4 shadow-(--shadow-card)">
          {!showKey ? (
            <Button onClick={() => setShowKey(true)} variant="secondary" className="w-full">
              <Eye className="h-4 w-4" /> Sprawdź z kluczem
            </Button>
          ) : (
            <>
              {keyUrls.length > 0 ? (
                <Crops urls={keyUrls} alt="Klucz odpowiedzi" />
              ) : (
                <p className="text-sm text-foreground-muted">Brak klucza dla tego zadania.</p>
              )}
              <div>
                <p className="mb-2 text-sm font-semibold text-foreground">Ile punktów sobie przyznajesz?</p>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: pointsMax + 1 }, (_, n) => (
                    <button
                      key={n}
                      disabled={pending}
                      onClick={() => award(n)}
                      className={cn(
                        "h-10 min-w-10 rounded-full border px-3 text-sm font-semibold transition-colors disabled:opacity-60",
                        status === "done" && score === n
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-surface text-foreground"
                      )}
                    >
                      {n}
                    </button>
                  ))}
                  <span className="self-center text-sm text-foreground-muted">/ {pointsMax} pkt</span>
                </div>
              </div>
              {status === "done" && (
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-1.5 font-medium text-primary">
                    <Check className="h-4 w-4" strokeWidth={3} /> Zaliczone: {score}/{pointsMax} pkt
                  </span>
                  <button onClick={reopen} disabled={pending} className="flex items-center gap-1 text-foreground-muted">
                    <RotateCcw className="h-3.5 w-3.5" /> Cofnij
                  </button>
                </div>
              )}
            </>
          )}
          {error && <p className="text-sm text-danger">{error}</p>}
        </div>
      </div>
    </div>
  );
}
