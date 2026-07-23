"use client";

// ============================================================================
// components/paragony/goals-manager.tsx
// Full CRUD for savings goals: per-goal card (progress bar, contribute/
// withdraw, edit, delete-with-confirmation) plus a "new goal" form at the
// bottom of the list.
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createGoal, updateGoal, deleteGoal, contributeToGoal } from "@/lib/paragony/goals-actions";
import type { GoalWithProgress } from "@/lib/paragony/queries";

const currencyFormatter = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" });
const dateFormatter = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" });

type Panel = "deposit" | "withdraw" | "edit" | "delete" | null;

export function GoalsManager({ goals }: { goals: GoalWithProgress[] }) {
  return (
    <div className="flex flex-col gap-4">
      {goals.length === 0 ? (
        <Card>
          <CardDescription>
            Nie masz jeszcze żadnych celów oszczędnościowych. Załóż pierwszy poniżej.
          </CardDescription>
        </Card>
      ) : (
        goals.map((goal) => <GoalCard key={goal.id} goal={goal} />)
      )}
      <NewGoalForm />
    </div>
  );
}

function GoalCard({ goal }: { goal: GoalWithProgress }) {
  const router = useRouter();
  const [panel, setPanel] = useState<Panel>(null);
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState(goal.title);
  const [targetAmount, setTargetAmount] = useState(String(goal.target_amount));
  const [targetDate, setTargetDate] = useState(goal.target_date ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const progress = Math.min(100, Math.max(0, goal.progressPercent));
  const isComplete = goal.progressPercent >= 100;

  function openPanel(next: Exclude<Panel, null>) {
    setError(null);
    setAmount("");
    setTitle(goal.title);
    setTargetAmount(String(goal.target_amount));
    setTargetDate(goal.target_date ?? "");
    setPanel(next);
  }

  function closePanel() {
    setError(null);
    setPanel(null);
  }

  function submitContribution(direction: "deposit" | "withdraw") {
    const value = Number(amount);
    if (!(value > 0)) {
      setError("Podaj dodatnią kwotę.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await contributeToGoal(goal.id, direction === "deposit" ? value : -value);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setPanel(null);
      router.refresh();
    });
  }

  function submitEdit() {
    if (!title.trim()) {
      setError("Podaj nazwę celu.");
      return;
    }
    const parsedAmount = Number(targetAmount);
    if (!(parsedAmount > 0)) {
      setError("Kwota docelowa musi być większa od zera.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await updateGoal(goal.id, {
        title,
        targetAmount: parsedAmount,
        targetDate: targetDate.trim() ? targetDate : null,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setPanel(null);
      router.refresh();
    });
  }

  function submitDelete() {
    setError(null);
    startTransition(async () => {
      const result = await deleteGoal(goal.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <CardTitle className="truncate">{goal.title}</CardTitle>
        <span className="shrink-0 text-sm text-foreground-muted">{Math.round(progress)}%</span>
      </div>

      <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-surface-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
      </div>

      <p className="mt-1.5 text-sm text-foreground-muted">
        {currencyFormatter.format(goal.current_amount)} / {currencyFormatter.format(goal.target_amount)}
      </p>

      {isComplete ? (
        <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-primary">
          <CheckCircle2 className="h-4 w-4" /> Cel osiągnięty!
        </p>
      ) : (
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-foreground-muted">
          {goal.target_date && <span>Termin: {dateFormatter.format(new Date(goal.target_date))}</span>}
          {goal.estimatedCompletionDate ? (
            <span>Szacowane osiągnięcie: {dateFormatter.format(new Date(goal.estimatedCompletionDate))}</span>
          ) : (
            <span>Za mało danych, by oszacować tempo oszczędzania.</span>
          )}
        </div>
      )}

      {panel === null && (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => openPanel("deposit")}>
            Wpłać
          </Button>
          <Button variant="outline" size="sm" onClick={() => openPanel("withdraw")}>
            Wypłać
          </Button>
          <Button variant="outline" size="sm" onClick={() => openPanel("edit")}>
            <Pencil className="h-3.5 w-3.5" /> Edytuj
          </Button>
          <Button variant="outline" size="sm" onClick={() => openPanel("delete")}>
            <Trash2 className="h-3.5 w-3.5" /> Usuń
          </Button>
        </div>
      )}

      {(panel === "deposit" || panel === "withdraw") && (
        <div className="mt-3 flex flex-col gap-2">
          <Label htmlFor={`amount-${goal.id}`}>{panel === "deposit" ? "Kwota wpłaty" : "Kwota wypłaty"}</Label>
          <Input
            id={`amount-${goal.id}`}
            type="number"
            step="0.01"
            min="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="np. 100.00"
            disabled={isPending}
          />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={closePanel} disabled={isPending}>
              Anuluj
            </Button>
            <Button size="sm" className="flex-1" isLoading={isPending} onClick={() => submitContribution(panel)}>
              {panel === "deposit" ? "Wpłać" : "Wypłać"}
            </Button>
          </div>
        </div>
      )}

      {panel === "edit" && (
        <div className="mt-3 flex flex-col gap-3">
          <div>
            <Label htmlFor={`title-${goal.id}`}>Nazwa celu</Label>
            <Input id={`title-${goal.id}`} value={title} onChange={(e) => setTitle(e.target.value)} disabled={isPending} />
          </div>
          <div>
            <Label htmlFor={`target-amount-${goal.id}`}>Kwota docelowa</Label>
            <Input
              id={`target-amount-${goal.id}`}
              type="number"
              step="0.01"
              min="0.01"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div>
            <Label htmlFor={`target-date-${goal.id}`}>Data docelowa (opcjonalnie)</Label>
            <Input
              id={`target-date-${goal.id}`}
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={closePanel} disabled={isPending}>
              Anuluj
            </Button>
            <Button size="sm" className="flex-1" isLoading={isPending} onClick={submitEdit}>
              Zapisz
            </Button>
          </div>
        </div>
      )}

      {panel === "delete" && (
        <Card className="mt-3 flex flex-col gap-3 bg-warning-soft">
          <div className="flex gap-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
            <p className="text-sm text-foreground">
              Na pewno chcesz usunąć cel „{goal.title}”? Tej operacji nie da się cofnąć.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" disabled={isPending} onClick={closePanel}>
              Anuluj
            </Button>
            <Button variant="danger" className="flex-1" isLoading={isPending} onClick={submitDelete}>
              Usuń
            </Button>
          </div>
        </Card>
      )}

      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </Card>
  );
}

function NewGoalForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canSubmit = title.trim() !== "" && targetAmount.trim() !== "";

  function submit() {
    if (!canSubmit || isPending) return;
    const parsedAmount = Number(targetAmount);
    if (!(parsedAmount > 0)) {
      setError("Kwota docelowa musi być większa od zera.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await createGoal({
        title,
        targetAmount: parsedAmount,
        targetDate: targetDate.trim() ? targetDate : null,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setTitle("");
      setTargetAmount("");
      setTargetDate("");
      router.refresh();
    });
  }

  return (
    <Card>
      <CardTitle>Nowy cel oszczędnościowy</CardTitle>
      <div className="mt-3 flex flex-col gap-3">
        <div>
          <Label htmlFor="new-goal-title">Nazwa celu</Label>
          <Input
            id="new-goal-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="np. Fundusz awaryjny"
            disabled={isPending}
          />
        </div>
        <div>
          <Label htmlFor="new-goal-target-amount">Kwota docelowa</Label>
          <Input
            id="new-goal-target-amount"
            type="number"
            step="0.01"
            min="0.01"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="np. 10000"
            disabled={isPending}
          />
        </div>
        <div>
          <Label htmlFor="new-goal-target-date">Data docelowa (opcjonalnie)</Label>
          <Input
            id="new-goal-target-date"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            disabled={isPending}
          />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button className="w-full" isLoading={isPending} disabled={!canSubmit} onClick={submit}>
          <Plus className="h-4 w-4" /> Dodaj cel
        </Button>
      </div>
    </Card>
  );
}
