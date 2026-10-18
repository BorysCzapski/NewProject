"use client";

// ============================================================================
// components/informatyka/problem-solver.tsx
// The workspace of one problem: statement crops, tabbed tools (canvas, written
// answer; code / SQL / spreadsheet tabs join as those tools land), and the
// "check with the key" + self-scoring flow that marks the problem done.
// ============================================================================
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, CheckCircle2, Eye, FileCode2, RotateCcw, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CanvasPanel } from "@/components/ink/canvas-panel";
import { PythonRunner, type CodeAreaHandle } from "@/components/informatyka/python-runner";
import { SqlConsole } from "@/components/informatyka/sql-console";
import { completeProblem, reopenProblem, saveCanvas, saveWork } from "@/lib/informatyka/actions";
import { matches, type AnswerCheck } from "@/lib/informatyka/answer-check";
import { isExamLocked, useExamSession } from "@/lib/informatyka/exam-session";
import type { InformatykaKind, InformatykaStatus } from "@/lib/types/database";

// Univer is heavy — only fetched for spreadsheet problems.
const Spreadsheet = dynamic(() => import("@/components/informatyka/spreadsheet"), { ssr: false });

type TabId = "canvas" | "answer" | "code" | "sql" | "sheet";

const DEFAULT_TAB: Partial<Record<InformatykaKind, TabId>> = { program: "code", sql: "sql", arkusz: "sheet" };

function tabsFor(kind: InformatykaKind): { id: TabId; label: string }[] {
  return [
    ...(kind === "program" || kind === "pisemne" ? [{ id: "code" as const, label: "Kod" }] : []),
    ...(kind === "arkusz" ? [{ id: "sheet" as const, label: "Arkusz" }] : []),
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

type CheckState = "match" | "nomatch" | "empty" | null;

function AnswerPane({
  value,
  onChange,
  saveState,
  check,
  onCheck,
  canCheck,
  lockedNote,
}: {
  value: string;
  onChange: (next: string) => void;
  saveState: "idle" | "saving" | "saved" | "error";
  check: CheckState;
  onCheck: () => void;
  canCheck: boolean;
  lockedNote: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={10}
        spellCheck={false}
        placeholder="Twoja odpowiedź: wynik, pseudokod, zawartość pliku wynikowego…"
        className="w-full rounded-(--radius-control) border border-border bg-surface p-3 font-mono text-sm text-foreground shadow-(--shadow-control)"
      />
      <div className="flex items-center justify-between gap-3">
        {canCheck ? (
          <Button type="button" variant="secondary" onClick={onCheck}>
            <CheckCircle2 className="h-4 w-4" /> Sprawdź odpowiedź
          </Button>
        ) : (
          <span className="text-xs text-foreground-muted">
            {lockedNote ? "Tryb egzaminu: sprawdzanie po zakończeniu." : "To zadanie sprawdzasz z kluczem."}
          </span>
        )}
        <p className="text-xs text-foreground-muted">
          {saveState === "saving" ? "Zapisuję…" : saveState === "saved" ? "Zapisano" : saveState === "error" ? "Nie udało się zapisać" : ""}
        </p>
      </div>
      {check === "match" && (
        <p className="flex items-start gap-2 rounded-(--radius-control) bg-primary-soft p-2.5 text-sm text-primary">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> Zgadza się z kluczem. Odsłoń klucz, sprawdź schemat punktowy i przyznaj punkty.
        </p>
      )}
      {check === "nomatch" && (
        <p className="flex items-start gap-2 rounded-(--radius-control) bg-warning-soft p-2.5 text-sm text-warning">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0" /> Nie wszystko zgadza się z kluczem. Sprawdź jeszcze raz albo odsłoń klucz — to tylko podpowiedź,
          punkty przyznajesz sobie sam.
        </p>
      )}
      {check === "empty" && <p className="text-sm text-foreground-muted">Najpierw wpisz odpowiedź.</p>}
    </div>
  );
}

export function ProblemSolver({
  problemId,
  examId,
  examSlug,
  kind,
  dataFiles,
  resultFile,
  sqlExtraSchema,
  sheetUrl,
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
  answerCheck,
  referenceCode,
  referenceSql,
  referenceNote,
}: {
  problemId: string;
  examId: string;
  examSlug: string;
  kind: InformatykaKind;
  dataFiles: string[];
  resultFile: string | null;
  sqlExtraSchema: string | null;
  sheetUrl: string | null;
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
  answerCheck: AnswerCheck | null;
  referenceCode: string | null;
  referenceSql: string | null;
  referenceNote: string | null;
}) {
  const router = useRouter();
  // during a timed exam of THIS paper the key and the auto-check stay locked
  const locked = isExamLocked(useExamSession(), examSlug);
  const tabs = tabsFor(kind);
  const [tab, setTab] = useState<TabId>(DEFAULT_TAB[kind] ?? "canvas");
  const [showKey, setShowKey] = useState(initialStatus === "done");
  const [status, setStatus] = useState(initialStatus);
  const [score, setScore] = useState<number | null>(initialScore);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  // the written answer lives here so code / SQL results can be pasted into it
  const [answer, setAnswer] = useState(initialAnswer);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [check, setCheck] = useState<CheckState>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => void (saveTimer.current && clearTimeout(saveTimer.current)), []);

  const changeAnswer = useCallback(
    (next: string) => {
      setAnswer(next);
      setCheck(null);
      setSaveState("saving");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(async () => {
        const result = await saveWork(problemId, "answer_text", next);
        setSaveState(result.ok ? "saved" : "error");
      }, 700);
    },
    [problemId]
  );

  function runCheck() {
    if (!answerCheck) return;
    setCheck(answer.trim() ? (matches(answer, answerCheck) ? "match" : "nomatch") : "empty");
  }

  function useAsAnswer(text: string) {
    changeAnswer(text);
    if (answerCheck) setCheck(matches(text, answerCheck) ? "match" : "nomatch");
    setTab("answer");
  }

  const codeArea = useRef<CodeAreaHandle>(null);
  const sqlArea = useRef<CodeAreaHandle>(null);
  const [loadedRef, setLoadedRef] = useState(false);
  const reference = kind === "sql" ? referenceSql : referenceCode;

  function loadReference() {
    if (!reference) return;
    (kind === "sql" ? sqlArea : codeArea).current?.replace(reference);
    setTab(kind === "sql" ? "sql" : "code");
    setLoadedRef(true);
  }

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
                onUseAsAnswer={useAsAnswer}
                handle={codeArea}
              />
            </div>
          )}
          {kind === "arkusz" && tab === "sheet" && (
            <Spreadsheet problemId={problemId} examId={examId} dataFiles={dataFiles} snapshotUrl={sheetUrl} />
          )}
          {kind === "sql" && (
            <div hidden={tab !== "sql"}>
              <SqlConsole
                problemId={problemId}
                examId={examId}
                dataFiles={dataFiles}
                extraSchema={sqlExtraSchema}
                initialSql={initialSql}
                onUseAsAnswer={useAsAnswer}
                handle={sqlArea}
              />
            </div>
          )}
          <div hidden={tab !== "canvas"}>
            <CanvasPanel initialImageUrl={canvasUrl} save={(dataUrl) => saveCanvas(problemId, dataUrl)} />
          </div>
          <div hidden={tab !== "answer"}>
            <AnswerPane
              value={answer}
              onChange={changeAnswer}
              saveState={saveState}
              check={locked ? null : check}
              onCheck={runCheck}
              canCheck={answerCheck !== null && !locked}
              lockedNote={locked}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-(--radius-card) border border-border/70 bg-surface p-4 shadow-(--shadow-card)">
          {locked ? (
            <p className="text-sm text-foreground-muted">
              Tryb egzaminu — klucz i punktowanie odblokują się po kliknięciu „Zakończ egzamin” albo po upływie czasu.
            </p>
          ) : !showKey ? (
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
              {(reference || referenceNote) && (
                <details className="rounded-(--radius-control) border border-border bg-surface-muted/50 p-3">
                  <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-foreground">
                    <FileCode2 className="h-4 w-4" /> Wzorcowe rozwiązanie {kind === "sql" ? "(SQL)" : reference ? "(Python)" : ""}
                  </summary>
                  <div className="mt-2 flex flex-col gap-2">
                    {referenceNote && <p className="text-xs text-foreground-muted">{referenceNote}</p>}
                    {reference && (
                      <>
                        <pre className="max-h-72 overflow-auto rounded-(--radius-control) bg-surface p-3 font-mono text-xs text-foreground">{reference}</pre>
                        <p className="text-xs text-foreground-muted">
                          Rozwiązanie jest nasze, nie CKE — klucz podaje tylko wynik, a to zapytanie/program daje dokładnie ten wynik na danych
                          z arkusza.
                        </p>
                        <Button type="button" variant="secondary" onClick={loadReference} className="self-start">
                          {loadedRef ? "Wczytano do edytora" : "Wczytaj do edytora (nadpisze Twój kod)"}
                        </Button>
                      </>
                    )}
                  </div>
                </details>
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
                          : "border-border bg-surface text-foreground",
                        check === "match" && n === pointsMax && !(status === "done" && score === n) && "ring-2 ring-primary"
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
