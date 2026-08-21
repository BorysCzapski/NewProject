"use client";

// ============================================================================
// components/godziny/entry-form.tsx
// Formularz jednego wpisu nauki — ten sam w trybie „dodaj" i „edytuj"
// (różni się tylko akcją i podpisem przycisku).
//
// Czas wpisuje się dwoma polami (godziny + minuty), a nie jednym polem
// „minuty": ludzie myślą „uczyłem się półtorej godziny", nie „90". Nad polami
// jest rząd skrótów na typowe długości sesji, bo w praktyce to one obsłużą
// większość wpisów jednym kliknięciem.
//
// Walidacja jest tu po to, żeby nie płacić rundy do serwera za literówkę —
// prawdziwą bramką jest lib/godziny/actions.ts, który sprawdza wszystko
// jeszcze raz.
// ============================================================================
import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { addEntry, updateEntry } from "@/lib/godziny/actions";
import type { StudyEntry } from "@/lib/godziny/queries";
import { formatMinutes } from "@/lib/godziny/format";
import type { StudyTopic } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** Skróty na typowe długości sesji, w minutach. */
const PRESETS = [15, 30, 45, 60, 90, 120];

interface FormState {
  topicId: string;
  date: string;
  hours: string;
  minutes: string;
  note: string;
}

function initialState(today: string, topics: StudyTopic[], entry?: StudyEntry): FormState {
  if (entry) {
    return {
      topicId: entry.topic_id,
      date: entry.study_date,
      hours: String(Math.floor(entry.duration_minutes / 60)),
      minutes: String(entry.duration_minutes % 60),
      note: entry.note ?? "",
    };
  }
  return {
    topicId: topics[0]?.id ?? "",
    date: today,
    hours: "0",
    minutes: "30",
    note: "",
  };
}

function toMinutes(form: FormState): number {
  const hours = Number(form.hours) || 0;
  const minutes = Number(form.minutes) || 0;
  return Math.round(hours * 60 + minutes);
}

export function EntryForm({
  topics,
  today,
  entry,
  onSaved,
  onCancel,
}: {
  topics: StudyTopic[];
  today: string;
  entry?: StudyEntry;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const [form, setForm] = useState<FormState>(() => initialState(today, topics, entry));
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const totalMinutes = toMinutes(form);

  // Temat zarchiwizowany nie jest na liście wyboru, ale wpis, który już go
  // używa, musi dać się edytować bez cichej podmiany tematu.
  const missingTopic =
    entry && !topics.some((topic) => topic.id === entry.topic_id)
      ? { id: entry.topic_id, name: `${entry.topic_name} (archiwum)` }
      : null;

  const byCategory = groupByCategory(topics);

  function setPreset(minutes: number) {
    setForm((current) => ({
      ...current,
      hours: String(Math.floor(minutes / 60)),
      minutes: String(minutes % 60),
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();

    if (!form.topicId) {
      setError("Wybierz temat, którego się uczysz.");
      return;
    }
    if (totalMinutes <= 0) {
      setError("Czas nauki musi być większy od zera.");
      return;
    }
    if (totalMinutes > 1440) {
      setError("Jeden wpis może obejmować najwyżej 24 godziny.");
      return;
    }
    if (form.date > today) {
      setError("Nie można zapisać nauki z przyszłości.");
      return;
    }

    setError(null);
    setIsSaving(true);
    const payload = {
      topicId: form.topicId,
      date: form.date,
      durationMinutes: totalMinutes,
      note: form.note,
    };
    const result = entry ? await updateEntry(entry.id, payload) : await addEntry(payload);
    setIsSaving(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    onSaved();
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">
            {entry ? "Edytuj wpis" : "Dodaj naukę"}
          </h2>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              aria-label="Zamknij formularz"
              className="text-foreground-muted"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="topic">Czego się uczysz? *</Label>
          <select
            id="topic"
            value={form.topicId}
            onChange={(e) => setForm((f) => ({ ...f, topicId: e.target.value }))}
            className="h-12 w-full rounded-(--radius-control) border border-border bg-surface px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            {missingTopic && (
              <option value={missingTopic.id}>{missingTopic.name}</option>
            )}
            {byCategory.map(([category, items]) => (
              <optgroup key={category ?? "bez-kategorii"} label={category ?? "Pozostałe"}>
                {items.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label>Ile czasu? *</Label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((minutes) => (
              <button
                key={minutes}
                type="button"
                onClick={() => setPreset(minutes)}
                aria-pressed={totalMinutes === minutes}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                  totalMinutes === minutes
                    ? "border-primary bg-primary-soft text-primary"
                    : "border-border bg-surface text-foreground-muted"
                )}
              >
                {formatMinutes(minutes)}
              </button>
            ))}
          </div>
          <div className="mt-1 flex items-center gap-2">
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              max={24}
              value={form.hours}
              onChange={(e) => setForm((f) => ({ ...f, hours: e.target.value }))}
              aria-label="Godziny"
              className="w-20 text-center"
            />
            <span className="text-sm text-foreground-muted">godz.</span>
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              max={59}
              step={5}
              value={form.minutes}
              onChange={(e) => setForm((f) => ({ ...f, minutes: e.target.value }))}
              aria-label="Minuty"
              className="w-20 text-center"
            />
            <span className="text-sm text-foreground-muted">min</span>
            <span className="ml-auto text-sm font-semibold text-foreground">
              {formatMinutes(totalMinutes)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="date">Kiedy?</Label>
          <Input
            id="date"
            type="date"
            value={form.date}
            max={today}
            onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="note">Notatka</Label>
          <textarea
            id="note"
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            rows={2}
            maxLength={500}
            placeholder="np. rozdział 4, zadania 1-12"
            className="w-full rounded-(--radius-control) border border-border bg-surface px-3 py-2.5 text-base text-foreground placeholder:text-foreground-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" isLoading={isSaving}>
          {entry ? "Zapisz zmiany" : "Zapisz naukę"}
        </Button>
      </form>
    </Card>
  );
}

/** Tematy pogrupowane po kategorii, z zachowaniem kolejności z serwera. */
function groupByCategory(topics: StudyTopic[]): Array<[string | null, StudyTopic[]]> {
  const groups = new Map<string | null, StudyTopic[]>();
  for (const topic of topics) {
    const key = topic.category ?? null;
    const list = groups.get(key);
    if (list) list.push(topic);
    else groups.set(key, [topic]);
  }
  return [...groups.entries()];
}
