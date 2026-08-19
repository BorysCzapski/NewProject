"use client";

// ============================================================================
// components/modlitwa/intentions-list.tsx
// Lista intencji: dodawanie, edycja, „pomodliłem się za tę osobę”, oznaczanie
// jako wysłuchane i usuwanie.
//
// Cała lista żyje w stanie klienta i jest aktualizowana natychmiast po każdej
// akcji jej wynikiem (Server Action zwraca zaktualizowany wiersz), więc ekran
// nie miga przeładowaniem przy każdym kliknięciu. Walidację pustego imienia
// robimy tu (spec) ORAZ w akcji — formularz nie jest zabezpieczeniem.
// ============================================================================
import { useState, useTransition } from "react";
import { Check, HeartHandshake, Pencil, Plus, Trash2, Undo2, X } from "lucide-react";
import {
  addIntention,
  deleteIntention,
  markIntentionPrayed,
  setIntentionFulfilled,
  updateIntention,
} from "@/lib/modlitwa/intentions-actions";
import type { PrayerRequest } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormState {
  personName: string;
  reason: string;
  promiseDate: string;
  notes: string;
}

const EMPTY_FORM = (today: string): FormState => ({
  personName: "",
  reason: "",
  promiseDate: today,
  notes: "",
});

export function IntentionsList({
  initialActive,
  initialFulfilled,
  today,
}: {
  initialActive: PrayerRequest[];
  initialFulfilled: PrayerRequest[];
  today: string;
}) {
  const [active, setActive] = useState(initialActive);
  const [fulfilled, setFulfilled] = useState(initialFulfilled);
  const [form, setForm] = useState<FormState>(EMPTY_FORM(today));
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function resetForm() {
    setForm(EMPTY_FORM(today));
    setEditingId(null);
    setFormOpen(false);
    setError(null);
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.personName.trim()) {
      setError("Podaj imię osoby, za którą się modlisz.");
      return;
    }
    setError(null);

    startTransition(async () => {
      const payload = {
        personName: form.personName,
        reason: form.reason,
        promiseDate: form.promiseDate,
        notes: form.notes,
      };

      const result = editingId
        ? await updateIntention(editingId, payload)
        : await addIntention(payload);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      const saved = result.data;
      setActive((prev) =>
        editingId ? prev.map((r) => (r.id === saved.id ? saved : r)) : [saved, ...prev]
      );
      resetForm();
    });
  }

  function startEdit(request: PrayerRequest) {
    setEditingId(request.id);
    setFormOpen(true);
    setError(null);
    setForm({
      personName: request.person_name,
      reason: request.reason ?? "",
      promiseDate: request.promise_date,
      notes: request.notes ?? "",
    });
  }

  function handlePrayed(request: PrayerRequest) {
    startTransition(async () => {
      const result = await markIntentionPrayed(request.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setActive((prev) => prev.map((r) => (r.id === request.id ? result.data : r)));
    });
  }

  function handleFulfil(request: PrayerRequest, value: boolean) {
    startTransition(async () => {
      const result = await setIntentionFulfilled(request.id, value);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (value) {
        setActive((prev) => prev.filter((r) => r.id !== request.id));
        setFulfilled((prev) => [result.data, ...prev]);
      } else {
        setFulfilled((prev) => prev.filter((r) => r.id !== request.id));
        setActive((prev) => [result.data, ...prev]);
      }
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteIntention(id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setActive((prev) => prev.filter((r) => r.id !== id));
      setFulfilled((prev) => prev.filter((r) => r.id !== id));
      setConfirmDeleteId(null);
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {formOpen ? (
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-foreground">
                {editingId ? "Edytuj intencję" : "Nowa intencja"}
              </h2>
              <button type="button" onClick={resetForm} aria-label="Zamknij" className="text-foreground-muted">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="personName">Za kogo się modlisz *</Label>
              <Input
                id="personName"
                value={form.personName}
                onChange={(e) => setForm((f) => ({ ...f, personName: e.target.value }))}
                placeholder="np. Babcia Zofia"
                maxLength={120}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="reason">Intencja</Label>
              <Input
                id="reason"
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
                placeholder="np. o zdrowie po operacji"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="promiseDate">Data obietnicy</Label>
              <Input
                id="promiseDate"
                type="date"
                value={form.promiseDate}
                onChange={(e) => setForm((f) => ({ ...f, promiseDate: e.target.value }))}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes">Notatki</Label>
              <textarea
                id="notes"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={3}
                maxLength={2000}
                className="w-full rounded-(--radius-control) border border-border bg-surface px-3 py-2.5 text-base text-foreground placeholder:text-foreground-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            <Button type="submit" isLoading={isPending}>
              {editingId ? "Zapisz zmiany" : "Dodaj intencję"}
            </Button>
          </form>
        </Card>
      ) : (
        <Button onClick={() => setFormOpen(true)} className="w-full">
          <Plus className="h-5 w-5" />
          Dodaj intencję
        </Button>
      )}

      {!formOpen && error && <p className="text-sm text-danger">{error}</p>}

      <section className="flex flex-col gap-2">
        <h2 className="text-base font-semibold text-foreground">
          Aktualne intencje ({active.length})
        </h2>

        {active.length === 0 ? (
          <Card>
            <CardDescription>
              Nie masz jeszcze intencji. Dodaj osobę, za którą obiecałeś się modlić — aplikacja
              przypomni Ci o niej przy codziennej modlitwie.
            </CardDescription>
          </Card>
        ) : (
          <ul className="flex flex-col gap-2">
            {active.map((request) => (
              <li key={request.id}>
                <Card className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-base font-semibold text-foreground">{request.person_name}</p>
                      {request.reason && <p className="text-sm text-foreground">{request.reason}</p>}
                      <p className="text-xs text-foreground-muted">
                        Obietnica: {request.promise_date}
                        {request.prayed_count > 0 && ` · modlitw: ${request.prayed_count}`}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(request)}
                        aria-label={`Edytuj intencję za ${request.person_name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-(--radius-control) text-foreground-muted active:opacity-70"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteId(request.id)}
                        aria-label={`Usuń intencję za ${request.person_name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-(--radius-control) text-foreground-muted active:opacity-70"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {request.notes && (
                    <p className="whitespace-pre-line rounded-(--radius-control) bg-surface-muted px-3 py-2 text-sm text-foreground">
                      {request.notes}
                    </p>
                  )}

                  {confirmDeleteId === request.id ? (
                    <div className="flex items-center gap-2">
                      <p className="flex-1 text-sm text-foreground">Usunąć tę intencję?</p>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(request.id)} isLoading={isPending}>
                        Usuń
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setConfirmDeleteId(null)}>
                        Anuluj
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => handlePrayed(request)} disabled={isPending}>
                        <HeartHandshake className="h-4 w-4" />
                        Pomodliłem się
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleFulfil(request, true)} disabled={isPending}>
                        <Check className="h-4 w-4" />
                        Wysłuchana
                      </Button>
                    </div>
                  )}
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      {fulfilled.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-base font-semibold text-foreground">
            Wysłuchane ({fulfilled.length})
          </h2>
          <ul className="flex flex-col gap-2">
            {fulfilled.map((request) => (
              <li key={request.id}>
                <Card className="flex items-center justify-between gap-3 bg-accent-soft">
                  <div>
                    <p className="text-base font-medium text-foreground">{request.person_name}</p>
                    {request.reason && <p className="text-sm text-foreground-muted">{request.reason}</p>}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleFulfil(request, false)}
                    aria-label="Przywróć do aktualnych"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius-control) text-foreground-muted active:opacity-70"
                  >
                    <Undo2 className="h-4 w-4" />
                  </button>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
