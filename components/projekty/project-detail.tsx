"use client";

// ============================================================================
// components/projekty/project-detail.tsx
// Strona projektu: status i opis, postęp z kroków, lista "czego potrzebuję"
// (odhaczasz, gdy już masz) i dziennik sesji. Każda zmiana to Server Action;
// stan z serwera wraca po revalidatePath.
// ============================================================================
import { useState, useTransition } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import {
  addItem,
  addSession,
  deleteItem,
  deleteProject,
  deleteSession,
  setItemDone,
  updateProject,
} from "@/lib/projekty/actions";
import { STATUSES, STATUS_LABELS, stepProgress } from "@/lib/projekty/constants";
import { dayMonthLabel } from "@/lib/habits/dates";
import type { Project, ProjectItem, ProjectSession, ProjectStatus } from "@/lib/types/database";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Result = { ok: true } | { ok: false; error: string };

export function ProjectDetail({
  project,
  items,
  sessions,
}: {
  project: Project;
  items: ProjectItem[];
  sessions: ProjectSession[];
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [description, setDescription] = useState(project.description);
  const [descDirty, setDescDirty] = useState(false);

  const steps = items.filter((i) => i.kind === "step");
  const needs = items.filter((i) => i.kind === "need");
  const progress = stepProgress(items);

  function run(action: () => Promise<Result>, onOk?: () => void) {
    setError(null);
    startTransition(async () => {
      const res = await action();
      if (!res.ok) setError(res.error);
      else onOk?.();
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              disabled={isPending}
              onClick={() => run(() => updateProject(project.id, { status: s as ProjectStatus }))}
              aria-pressed={project.status === s}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                project.status === s
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground-muted hover:border-primary/50"
              )}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        <div>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Postęp</span>
            <span className="tabular-nums text-foreground-muted">
              {progress.total === 0 ? "dodaj kroki, aby śledzić postęp" : `${progress.done}/${progress.total} • ${progress.pct}%`}
            </span>
          </div>
          <div
            className="h-3 overflow-hidden rounded-full bg-surface-muted"
            role="progressbar"
            aria-valuenow={progress.pct ?? 0}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${progress.pct ?? 0}%` }} />
          </div>
        </div>

        <div>
          <label htmlFor="desc" className="mb-1 block text-sm font-medium text-foreground">
            Co dokładnie chcę zrobić
          </label>
          <textarea
            id="desc"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              setDescDirty(true);
            }}
            rows={4}
            maxLength={4000}
            className="w-full rounded-(--radius-control) border border-border bg-surface px-4 py-3 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {descDirty && (
            <Button
              size="sm"
              className="mt-2"
              disabled={isPending}
              onClick={() => run(() => updateProject(project.id, { description }), () => setDescDirty(false))}
            >
              Zapisz opis
            </Button>
          )}
        </div>
      </Card>

      <ItemList
        title="Kroki"
        hint="Etapy, części do nauczenia, rzeczy do zrobienia — z nich liczy się postęp."
        placeholder="np. Refren, Wyczyścić głowice"
        kind="step"
        items={steps}
        projectId={project.id}
        run={run}
        isPending={isPending}
        withNote={false}
      />

      <ItemList
        title="Czego potrzebuję"
        hint="Części, narzędzia, materiały. Odhacz, gdy już to masz."
        placeholder="np. Pasek napędowy"
        kind="need"
        items={needs}
        projectId={project.id}
        run={run}
        isPending={isPending}
        withNote
      />

      <SessionLog projectId={project.id} sessions={sessions} run={run} isPending={isPending} />

      {error && (
        <p role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      <form
        action={deleteProject.bind(null, project.id)}
        onSubmit={(e) => {
          if (!window.confirm(`Usunąć projekt „${project.title}” razem z krokami i sesjami?`)) e.preventDefault();
        }}
      >
        <Button type="submit" variant="ghost" className="text-danger">
          <Trash2 className="h-4 w-4" />
          Usuń projekt
        </Button>
      </form>
    </div>
  );
}

function ItemList({
  title,
  hint,
  placeholder,
  kind,
  items,
  projectId,
  run,
  isPending,
  withNote,
}: {
  title: string;
  hint: string;
  placeholder: string;
  kind: "step" | "need";
  items: ProjectItem[];
  projectId: string;
  run: (action: () => Promise<Result>, onOk?: () => void) => void;
  isPending: boolean;
  withNote: boolean;
}) {
  const [text, setText] = useState("");
  const [note, setNote] = useState("");

  function onAdd(e: React.FormEvent) {
    e.preventDefault();
    run(
      () => addItem(projectId, kind, text, note),
      () => {
        setText("");
        setNote("");
      }
    );
  }

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-foreground-muted">{hint}</p>
      </div>
      <ul className="flex flex-col">
        {items.length === 0 && <li className="py-2 text-sm text-foreground-muted">Nic tu jeszcze nie ma.</li>}
        {items.map((item) => (
          <li key={item.id} className="flex items-start gap-3 border-t border-border/70 py-2.5 first:border-t-0">
            <button
              type="button"
              disabled={isPending}
              onClick={() => run(() => setItemDone(item.id, projectId, !item.done))}
              aria-pressed={item.done}
              aria-label={`${item.text}: ${item.done ? "zrobione" : "niezrobione"}`}
              className={cn(
                "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors",
                item.done ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50"
              )}
            >
              {item.done && <Check className="h-4 w-4" />}
            </button>
            <div className="min-w-0 flex-1">
              <p className={cn("text-foreground", item.done && "text-foreground-muted line-through")}>{item.text}</p>
              {item.note && <p className="text-sm text-foreground-muted">{item.note}</p>}
            </div>
            <button
              type="button"
              onClick={() => run(() => deleteItem(item.id, projectId))}
              aria-label={`Usuń: ${item.text}`}
              className="text-foreground-muted hover:text-danger"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={onAdd} className="flex flex-col gap-2">
        <div className="flex gap-2">
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} maxLength={200} aria-label={`Dodaj do: ${title}`} />
          <Button type="submit" disabled={isPending || !text.trim()} aria-label={`Dodaj do: ${title}`}>
            <Plus className="h-5 w-5" />
          </Button>
        </div>
        {withNote && (
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Notatka (opcjonalnie): model, rozmiar, gdzie kupić"
            maxLength={1000}
            aria-label="Notatka"
          />
        )}
      </form>
    </Card>
  );
}

function SessionLog({
  projectId,
  sessions,
  run,
  isPending,
}: {
  projectId: string;
  sessions: ProjectSession[];
  run: (action: () => Promise<Result>, onOk?: () => void) => void;
  isPending: boolean;
}) {
  const [note, setNote] = useState("");

  function onAdd(e: React.FormEvent) {
    e.preventDefault();
    run(() => addSession(projectId, note), () => setNote(""));
  }

  return (
    <Card className="flex flex-col gap-3">
      <div>
        <CardTitle>Dziennik sesji</CardTitle>
        <p className="text-sm text-foreground-muted">Nad czym dziś pracowałeś, co poszło, co robić dalej.</p>
      </div>
      <form onSubmit={onAdd} className="flex flex-col gap-2">
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
          maxLength={2000}
          placeholder="np. Zwrotka 1 wychodzi płynnie, refren jeszcze zgrzyta na przejściu G–D"
          aria-label="Wpis do dziennika sesji"
          className="w-full rounded-(--radius-control) border border-border bg-surface px-4 py-3 text-base text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <Button type="submit" disabled={isPending || !note.trim()} className="self-start">
          <Plus className="h-5 w-5" />
          Dodaj sesję
        </Button>
      </form>
      <ul className="flex flex-col">
        {sessions.map((s) => (
          <li key={s.id} className="flex items-start gap-3 border-t border-border/70 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground-muted">{dayMonthLabel(s.day)}</p>
              <p className="whitespace-pre-wrap text-foreground">{s.note}</p>
            </div>
            <button
              type="button"
              onClick={() => run(() => deleteSession(s.id, projectId))}
              aria-label="Usuń sesję"
              className="text-foreground-muted hover:text-danger"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
