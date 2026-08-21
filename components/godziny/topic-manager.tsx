"use client";

// ============================================================================
// components/godziny/topic-manager.tsx
// Zarządzanie listą tematów: dodawanie, edycja (nazwa, kategoria, kolor),
// archiwizacja i kasowanie.
//
// Rozróżnienie archiwum vs kasowanie jest tu widoczne wprost, bo to jedyna
// rzecz w tej aplikacji, którą da się nieodwracalnie stracić. Temat z
// zapisanymi godzinami można tylko zarchiwizować — przycisk kasowania w ogóle
// się dla niego nie pojawia, żeby użytkownik nie klikał w coś, co i tak
// odbije się od serwera komunikatem błędu.
// ============================================================================
import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, Pencil, Plus, Trash2, X } from "lucide-react";
import {
  addTopic,
  deleteTopic,
  setTopicArchived,
  updateTopic,
} from "@/lib/godziny/topic-actions";
import { formatEntryCount, formatMinutes } from "@/lib/godziny/format";
import { chartColor, CHART_COLORS } from "@/lib/paragony/chart-colors";
import type { StudyTopic } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface TopicUsage {
  minutes: number;
  entries: number;
}

interface FormState {
  name: string;
  category: string;
  colorIndex: number;
}

const EMPTY_FORM: FormState = { name: "", category: "", colorIndex: 0 };

export function TopicManager({
  topics,
  usage,
}: {
  topics: StudyTopic[];
  usage: Record<string, TopicUsage>;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const active = topics.filter((topic) => !topic.is_archived);
  const archived = topics.filter((topic) => topic.is_archived);

  function resetForm() {
    setForm(EMPTY_FORM);
    setFormOpen(false);
    setEditingId(null);
    setError(null);
  }

  function startEdit(topic: StudyTopic) {
    setEditingId(topic.id);
    setFormOpen(true);
    setConfirmDeleteId(null);
    setError(null);
    setForm({
      name: topic.name,
      category: topic.category ?? "",
      colorIndex: topic.color_index,
    });
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!form.name.trim()) {
      setError("Podaj nazwę tematu.");
      return;
    }
    setError(null);

    startTransition(async () => {
      const payload = {
        name: form.name,
        category: form.category,
        colorIndex: form.colorIndex,
      };
      const result = editingId ? await updateTopic(editingId, payload) : await addTopic(payload);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      resetForm();
      router.refresh();
    });
  }

  function handleArchive(topic: StudyTopic, archived: boolean) {
    startTransition(async () => {
      const result = await setTopicArchived(topic.id, archived);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setError(null);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteTopic(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setConfirmDeleteId(null);
      setError(null);
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {formOpen ? (
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">
                {editingId ? "Edytuj temat" : "Nowy temat"}
              </h2>
              <button
                type="button"
                onClick={resetForm}
                aria-label="Zamknij formularz"
                className="text-foreground-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="topic-name">Nazwa *</Label>
              <Input
                id="topic-name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                placeholder="np. Matematyka — Algebra"
                maxLength={80}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="topic-category">Kategoria</Label>
              <Input
                id="topic-category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="np. Szkoła"
                maxLength={40}
                list="godziny-kategorie"
              />
              <datalist id="godziny-kategorie">
                {[...new Set(topics.map((t) => t.category).filter(Boolean))].map((category) => (
                  <option key={category as string} value={category as string} />
                ))}
              </datalist>
            </div>

            <fieldset className="flex flex-col gap-1.5">
              <legend className="mb-1.5 block text-sm font-medium text-foreground-muted">
                Kolor na wykresie
              </legend>
              <div className="flex flex-wrap gap-2">
                {CHART_COLORS.map((color, index) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, colorIndex: index }))}
                    aria-label={`Kolor ${index + 1}`}
                    aria-pressed={form.colorIndex === index}
                    className={cn(
                      "h-9 w-9 rounded-full border-2 transition-transform",
                      form.colorIndex === index
                        ? "scale-110 border-foreground"
                        : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </fieldset>

            {error && <p className="text-sm text-danger">{error}</p>}

            <Button type="submit" isLoading={isPending}>
              {editingId ? "Zapisz zmiany" : "Dodaj temat"}
            </Button>
          </form>
        </Card>
      ) : (
        <Button className="w-full" onClick={() => setFormOpen(true)}>
          <Plus className="h-5 w-5" />
          Dodaj temat
        </Button>
      )}

      {!formOpen && error && <p className="text-sm text-danger">{error}</p>}

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
          Twoje tematy ({active.length})
        </h2>

        {active.length === 0 ? (
          <Card>
            <CardDescription>
              Nie masz żadnego aktywnego tematu. Dodaj przynajmniej jeden — bez tego nie da się
              zapisać nauki.
            </CardDescription>
          </Card>
        ) : (
          <ul className="flex flex-col gap-2">
            {active.map((topic) => {
              const used = usage[topic.id] ?? { minutes: 0, entries: 0 };
              return (
                <li key={topic.id}>
                  <Card className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-start gap-2.5">
                        <span
                          aria-hidden
                          className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: chartColor(topic.color_index) }}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-base font-medium text-foreground">
                            {topic.name}
                          </p>
                          <p className="truncate text-xs text-foreground-muted">
                            {topic.category ? `${topic.category} · ` : ""}
                            {used.entries === 0
                              ? "brak wpisów"
                              : `${formatMinutes(used.minutes)} · ${formatEntryCount(used.entries)}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-1">
                        <button
                          type="button"
                          onClick={() => startEdit(topic)}
                          aria-label={`Edytuj temat ${topic.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-(--radius-control) text-foreground-muted active:opacity-70"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleArchive(topic, true)}
                          disabled={isPending}
                          aria-label={`Zarchiwizuj temat ${topic.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-(--radius-control) text-foreground-muted active:opacity-70 disabled:opacity-50"
                        >
                          <Archive className="h-4 w-4" />
                        </button>
                        {/* Kasowanie tylko dla tematu bez historii — z wpisami
                            zostaje archiwum (patrz deleteTopic w akcjach). */}
                        {used.entries === 0 && (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(topic.id)}
                            aria-label={`Usuń temat ${topic.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-(--radius-control) text-foreground-muted active:opacity-70"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {confirmDeleteId === topic.id && (
                      <div className="flex items-center gap-2">
                        <p className="flex-1 text-sm text-foreground">Usunąć ten temat?</p>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(topic.id)}
                          isLoading={isPending}
                        >
                          Usuń
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setConfirmDeleteId(null)}>
                          Anuluj
                        </Button>
                      </div>
                    )}
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {archived.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-foreground-muted">
            Archiwum ({archived.length})
          </h2>
          <CardDescription>
            Tematy poza listą wyboru. Ich godziny nadal liczą się w historii.
          </CardDescription>
          <ul className="flex flex-col gap-2">
            {archived.map((topic) => {
              const used = usage[topic.id] ?? { minutes: 0, entries: 0 };
              return (
                <li key={topic.id}>
                  <Card className="flex items-center justify-between gap-3 bg-surface-muted">
                    <div className="min-w-0">
                      <p className="truncate text-base font-medium text-foreground">{topic.name}</p>
                      <p className="truncate text-xs text-foreground-muted">
                        {used.entries === 0
                          ? "brak wpisów"
                          : `${formatMinutes(used.minutes)} · ${formatEntryCount(used.entries)}`}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleArchive(topic, false)}
                      disabled={isPending}
                      aria-label={`Przywróć temat ${topic.name}`}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius-control) text-foreground-muted active:opacity-70 disabled:opacity-50"
                    >
                      <ArchiveRestore className="h-4 w-4" />
                    </button>
                  </Card>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
