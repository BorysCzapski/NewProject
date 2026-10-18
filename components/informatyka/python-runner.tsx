"use client";

// ============================================================================
// components/informatyka/python-runner.tsx
// "Kod" tab: a Python editor that runs against the real exam data files, in a
// Pyodide Web Worker (public/pyodide-worker.js). The code autosaves; files the
// program writes (wyniki*.txt) are shown so they can be copied into the answer.
// ============================================================================
import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { ClipboardPaste, Loader2, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CodeEditor, type CodeEditorHandle } from "@/components/informatyka/code-editor";
import { loadDataFiles } from "@/lib/informatyka/data-files-client";
import { saveWork } from "@/lib/informatyka/actions";

const TIME_LIMIT_MS = 30_000;

interface RunResult {
  stdout: string;
  stderr: string;
  outputs: Record<string, string>;
  ms: number;
  timedOut?: boolean;
}

function starter(files: string[]): string {
  const first = files.find((f) => !f.includes("_przyklad")) ?? files[0];
  return first
    ? `# Pliki z danymi leżą obok programu — otwierasz je po nazwie, jak na egzaminie.\nwith open("${first}") as f:\n    dane = [linia.strip() for linia in f]\n\nprint(len(dane))\n`
    : "# Tu napisz program.\n";
}

export interface CodeAreaHandle {
  replace: (text: string) => void;
}

export function PythonRunner({
  problemId,
  examId,
  dataFiles,
  resultFile,
  initialCode,
  onUseAsAnswer,
  handle,
}: {
  problemId: string;
  examId: string;
  dataFiles: string[];
  resultFile: string | null;
  initialCode: string;
  /** "Use as answer": the file the program wrote (e.g. wyniki.txt) or, failing that, its output. */
  onUseAsAnswer?: (text: string) => void;
  handle?: Ref<CodeAreaHandle>;
}) {
  const editor = useRef<CodeEditorHandle>(null);
  useImperativeHandle(handle, () => ({ replace: (text: string) => editor.current?.replace(text) }));
  const [code, setCode] = useState(initialCode || starter(dataFiles));
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [engine, setEngine] = useState<"loading" | "ready">("loading");
  const [loadError, setLoadError] = useState<string | null>(null);
  const worker = useRef<Worker | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const codeRef = useRef(code);
  const pending = useRef<{ id: number; start: number } | null>(null);

  const createWorker = useCallback(() => {
    const w = new Worker("/pyodide-worker.js", { type: "module" });
    w.onmessage = (e: MessageEvent) => {
      const msg = e.data;
      if (msg.type === "ready") return setEngine("ready");
      const current = pending.current;
      if (current && msg.type === "done" && current.id === msg.id) {
        if (timer.current) clearTimeout(timer.current);
        setResult({ stdout: msg.stdout, stderr: msg.stderr, outputs: msg.outputs, ms: Date.now() - current.start });
        pending.current = null;
        setRunning(false);
      }
    };
    w.onerror = () => setLoadError("Nie udało się uruchomić środowiska Pythona (sprawdź połączenie z internetem).");
    return w;
  }, []);

  /** Drops the current worker (e.g. a runaway loop) and starts a clean one. */
  const spawn = useCallback(() => {
    worker.current?.terminate();
    setEngine("loading");
    worker.current = createWorker();
  }, [createWorker]);

  useEffect(() => {
    worker.current = createWorker(); // warm up while the student reads the task
    return () => {
      worker.current?.terminate();
      if (timer.current) clearTimeout(timer.current);
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [createWorker]);

  function handleChange(next: string) {
    setCode(next);
    codeRef.current = next;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => void saveWork(problemId, "code", next), 1000);
  }

  async function run() {
    if (running || !worker.current) return;
    setRunning(true);
    setResult(null);
    setLoadError(null);
    try {
      const files = await loadDataFiles(examId, dataFiles);
      const id = Date.now();
      const start = Date.now();
      pending.current = { id, start };
      timer.current = setTimeout(() => {
        // an endless loop can't be interrupted — drop the worker and start a clean one
        pending.current = null;
        setResult({ stdout: "", stderr: "Przekroczono limit czasu (30 s) — program przerwany.", outputs: {}, ms: TIME_LIMIT_MS, timedOut: true });
        setRunning(false);
        spawn();
      }, TIME_LIMIT_MS);
      worker.current.postMessage({
        id,
        code: codeRef.current,
        files: Object.fromEntries(files.map((f) => [f.name, f.content])),
      });
    } catch (err) {
      setRunning(false);
      setLoadError(`Nie udało się wczytać plików danych: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  function stop() {
    if (timer.current) clearTimeout(timer.current);
    pending.current = null;
    setRunning(false);
    setResult({ stdout: "", stderr: "Przerwano.", outputs: {}, ms: 0 });
    spawn();
  }

  const outputNames = result ? Object.keys(result.outputs) : [];
  const answerText = result
    ? (resultFile && result.outputs[resultFile]) || (outputNames.length === 1 ? result.outputs[outputNames[0]] : "") || result.stdout
    : "";

  return (
    <div className="flex flex-col gap-3">
      {dataFiles.length > 0 && (
        <p className="text-xs text-foreground-muted">
          Pliki dostępne w programie: <span className="font-mono">{dataFiles.join(", ")}</span>
          {resultFile ? (
            <>
              {" "}
              · wynik zapisz do <span className="font-mono">{resultFile}</span>
            </>
          ) : null}
        </p>
      )}
      <CodeEditor value={code} onChange={handleChange} onRun={run} language="python" handle={editor} />
      <div className="flex items-center gap-3">
        {running ? (
          <Button onClick={stop} variant="secondary">
            <Square className="h-4 w-4" /> Zatrzymaj
          </Button>
        ) : (
          <Button onClick={run}>
            <Play className="h-4 w-4" /> Uruchom
          </Button>
        )}
        <span className="flex items-center gap-1.5 text-xs text-foreground-muted">
          {engine === "loading" && (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Wczytuję Pythona (pierwszy raz ~10 MB)…
            </>
          )}
          {engine === "ready" && !running && !result && "Ctrl/Cmd + Enter uruchamia"}
          {running && "Działa…"}
          {result && !running && `${(result.ms / 1000).toFixed(2)} s`}
        </span>
        {onUseAsAnswer && result && !running && answerText.trim() && !result.stderr && (
          <button
            type="button"
            onClick={() => onUseAsAnswer(answerText.trim())}
            className="ml-auto flex items-center gap-1.5 text-xs font-medium text-primary"
          >
            <ClipboardPaste className="h-3.5 w-3.5" /> Użyj jako odpowiedzi
          </button>
        )}
      </div>
      {loadError && <p className="text-sm text-danger">{loadError}</p>}
      {result && (
        <div className="flex flex-col gap-2">
          {result.stdout && (
            <pre className="max-h-72 overflow-auto rounded-(--radius-control) bg-surface-muted p-3 font-mono text-xs text-foreground">
              {result.stdout}
            </pre>
          )}
          {result.stderr && (
            <pre className="max-h-72 overflow-auto rounded-(--radius-control) bg-danger-soft p-3 font-mono text-xs text-danger">
              {result.stderr}
            </pre>
          )}
          {!result.stdout && !result.stderr && outputNames.length === 0 && (
            <p className="text-xs text-foreground-muted">Program zakończył się bez wyjścia (użyj print()).</p>
          )}
          {outputNames.map((name) => (
            <details key={name} open>
              <summary className="cursor-pointer text-xs font-semibold text-foreground-muted">
                Plik zapisany przez program: <span className="font-mono">{name}</span>
              </summary>
              <pre className="mt-1 max-h-72 overflow-auto rounded-(--radius-control) bg-surface-muted p-3 font-mono text-xs text-foreground">
                {result.outputs[name]}
              </pre>
            </details>
          ))}
        </div>
      )}
    </div>
  );
}
