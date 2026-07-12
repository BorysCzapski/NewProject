"use client";

// ============================================================================
// components/homework/homework-edit-form.tsx
// Admin homework editor form: lets an admin fix an assignment's wording
// (title/description) and its deadline. Type and per-type config are locked —
// they own backing resources and student progress (see updateHomeworkAction),
// so this form deliberately exposes only the safe-to-change fields.
// ============================================================================
import { useActionState, useState } from "react";
import { updateHomeworkAction, type ActionState } from "@/lib/homework/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import type { Homework } from "@/lib/types/database";

const textareaClass =
  "w-full rounded-(--radius-control) border border-border bg-surface px-4 py-3 text-base text-foreground placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary";

const initialState: ActionState = {};

/** Format a stored UTC ISO instant as a local `datetime-local` value. */
function toLocalInput(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function HomeworkEditForm({ homework }: { homework: Homework }) {
  const [state, formAction, isPending] = useActionState(updateHomeworkAction, initialState);

  const [title, setTitle] = useState(homework.title);
  const [description, setDescription] = useState(homework.description ?? "");
  // The datetime-local display value depends on the browser timezone (differs
  // from the server's), but React does not diff `value` on form inputs during
  // hydration, so a lazy initializer is safe here. The hidden field keeps the
  // original UTC instant so submitting without touching the deadline preserves it.
  const [deadlineLocal, setDeadlineLocal] = useState(() =>
    homework.deadline ? toLocalInput(homework.deadline) : ""
  );
  const [deadlineIso, setDeadlineIso] = useState(homework.deadline ?? "");

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="id" value={homework.id} />

      <Card className="bg-surface-muted text-sm text-foreground-muted">
        Możesz zmienić tylko treść (tytuł, opis) oraz termin. Typ zadania i jego konfiguracja są zablokowane.
      </Card>

      <div>
        <Label htmlFor="title">Tytuł</Label>
        <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div>
        <Label htmlFor="description">Opis</Label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={textareaClass}
          placeholder="Krótki opis dla ucznia..."
        />
      </div>

      <div>
        <Label htmlFor="deadline">Termin (opcjonalnie)</Label>
        {/* datetime-local carries no timezone; convert to a real UTC instant in
            the browser (admin's local tz) and submit that hidden value, exactly
            like the create form does. */}
        <Input
          id="deadline"
          type="datetime-local"
          value={deadlineLocal}
          onChange={(e) => {
            setDeadlineLocal(e.target.value);
            setDeadlineIso(e.target.value ? new Date(e.target.value).toISOString() : "");
          }}
        />
        <input type="hidden" name="deadline" value={deadlineIso} />
      </div>

      {state?.error && <p className="text-sm text-danger">{state.error}</p>}

      <Button type="submit" isLoading={isPending} className="w-full">
        Zapisz zmiany
      </Button>
    </form>
  );
}
