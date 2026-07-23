"use client";

// ============================================================================
// components/paragony/recurring-manager.tsx
// Full CRUD for recurring bills (rent, subscriptions, insurance...): per-item
// card (frequency/next due date, active/paused badge, pause-resume toggle,
// mark-as-paid, edit, delete-with-confirmation) plus a "new recurring bill"
// form at the bottom of the list. Includes paused items too — this is the
// one screen where those are manageable (the dashboard widget only shows
// active upcoming ones).
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  createRecurringTransaction,
  updateRecurringTransaction,
  setRecurringActive,
  deleteRecurringTransaction,
  markRecurringPaid,
  type RecurringInput,
} from "@/lib/paragony/recurring-actions";
import type { AccountBalance } from "@/lib/paragony/queries";
import { cn } from "@/lib/utils";
import type { BudgetCategory, BudgetCategoryKind, RecurringFrequency, RecurringTransaction } from "@/lib/types/database";

const selectClass =
  "h-12 w-full rounded-(--radius-control) border border-border bg-surface px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary";

const currencyFormatter = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" });
const dateFormatter = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" });

const TYPE_LABELS: Record<RecurringInput["type"], string> = {
  uznanie: "Uznanie (przychód)",
  obciazenie: "Obciążenie (wydatek)",
};
const TYPE_OPTIONS = Object.entries(TYPE_LABELS) as [RecurringInput["type"], string][];

const FREQUENCY_LABELS: Record<RecurringFrequency, string> = {
  monthly: "Miesięczna",
  quarterly: "Kwartalna",
  yearly: "Roczna",
};
const FREQUENCY_OPTIONS = Object.entries(FREQUENCY_LABELS) as [RecurringFrequency, string][];

export interface RecurringItem extends RecurringTransaction {
  category_name: string | null;
  account_name: string;
}

type Panel = "edit" | "delete" | null;

export function RecurringManager({
  items,
  categories,
  accounts,
}: {
  items: RecurringItem[];
  categories: BudgetCategory[];
  accounts: AccountBalance[];
}) {
  return (
    <div className="flex flex-col gap-4">
      {items.length === 0 ? (
        <Card>
          <CardDescription>
            Nie masz jeszcze żadnych rachunków cyklicznych. Dodaj pierwszy poniżej.
          </CardDescription>
        </Card>
      ) : (
        items.map((item) => <RecurringCard key={item.id} item={item} categories={categories} accounts={accounts} />)
      )}

      {accounts.length === 0 ? (
        <Card>
          <CardDescription>Załóż najpierw konto, aby dodać rachunek cykliczny.</CardDescription>
        </Card>
      ) : (
        <NewRecurringForm categories={categories} accounts={accounts} />
      )}
    </div>
  );
}

function RecurringCard({
  item,
  categories,
  accounts,
}: {
  item: RecurringItem;
  categories: BudgetCategory[];
  accounts: AccountBalance[];
}) {
  const router = useRouter();
  const [panel, setPanel] = useState<Panel>(null);
  const [type, setType] = useState<RecurringInput["type"]>(item.type);
  const [amount, setAmount] = useState(String(item.amount));
  const [description, setDescription] = useState(item.description);
  const [accountId, setAccountId] = useState(item.account_id);
  const [categoryId, setCategoryId] = useState(item.category_id ?? "");
  const [frequency, setFrequency] = useState<RecurringFrequency>(item.frequency);
  const [nextDueDate, setNextDueDate] = useState(item.next_due_date);
  const [error, setError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();
  const [isTogglePending, startToggleTransition] = useTransition();
  const [isPaidPending, startPaidTransition] = useTransition();

  const categoryKind: BudgetCategoryKind = type === "uznanie" ? "income" : "expense";
  const filteredCategories = categories.filter((c) => c.kind === categoryKind);

  function openEdit() {
    setError(null);
    setType(item.type);
    setAmount(String(item.amount));
    setDescription(item.description);
    setAccountId(item.account_id);
    setCategoryId(item.category_id ?? "");
    setFrequency(item.frequency);
    setNextDueDate(item.next_due_date);
    setPanel("edit");
  }

  function openDelete() {
    setError(null);
    setPanel("delete");
  }

  function closePanel() {
    setError(null);
    setPanel(null);
  }

  function handleTypeChange(next: RecurringInput["type"]) {
    setType(next);
    setCategoryId("");
  }

  const canSubmitEdit =
    amount.trim() !== "" && Number(amount) > 0 && description.trim() !== "" && !!accountId && !!nextDueDate;

  function submitEdit() {
    if (!canSubmitEdit || isPending) return;
    setError(null);
    startTransition(async () => {
      const input: RecurringInput = {
        type,
        amount: Number(amount),
        description,
        categoryId: categoryId || null,
        accountId,
        frequency,
        nextDueDate,
      };
      const result = await updateRecurringTransaction(item.id, input);
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
      const result = await deleteRecurringTransaction(item.id);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function toggleActive() {
    setError(null);
    startToggleTransition(async () => {
      const result = await setRecurringActive(item.id, !item.is_active);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  function markPaid() {
    setError(null);
    startPaidTransition(async () => {
      const result = await markRecurringPaid(item.id);
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
        <CardTitle className="truncate">{item.description}</CardTitle>
        <Badge className={item.is_active ? "bg-primary-soft text-primary" : "bg-warning-soft text-warning"}>
          {item.is_active ? "Aktywny" : "Wstrzymany"}
        </Badge>
      </div>

      <div className="mt-1.5 flex items-center justify-between gap-2">
        <p className="min-w-0 truncate text-sm text-foreground-muted">
          {FREQUENCY_LABELS[item.frequency]} · {item.account_name}
          {item.category_name ? ` · ${item.category_name}` : ""}
        </p>
        <p
          className={cn(
            "shrink-0 text-sm font-semibold",
            item.type === "obciazenie" ? "text-danger" : "text-accent"
          )}
        >
          {currencyFormatter.format(item.amount)}
        </p>
      </div>

      <p className="mt-1 text-xs text-foreground-muted">
        Najbliższy termin: {dateFormatter.format(new Date(item.next_due_date))}
      </p>

      {panel === null && (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" isLoading={isTogglePending} onClick={toggleActive}>
            {item.is_active ? "Wstrzymaj" : "Aktywuj"}
          </Button>
          {item.is_active && (
            <Button variant="secondary" size="sm" isLoading={isPaidPending} onClick={markPaid}>
              Oznacz jako zapłacone
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={openEdit}>
            <Pencil className="h-3.5 w-3.5" /> Edytuj
          </Button>
          <Button variant="outline" size="sm" onClick={openDelete}>
            <Trash2 className="h-3.5 w-3.5" /> Usuń
          </Button>
        </div>
      )}

      {panel === "edit" && (
        <div className="mt-3 flex flex-col gap-3">
          <div>
            <Label htmlFor={`type-${item.id}`}>Typ</Label>
            <select
              id={`type-${item.id}`}
              value={type}
              onChange={(e) => handleTypeChange(e.target.value as RecurringInput["type"])}
              disabled={isPending}
              className={selectClass}
            >
              {TYPE_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor={`amount-${item.id}`}>Kwota</Label>
            <Input
              id={`amount-${item.id}`}
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div>
            <Label htmlFor={`description-${item.id}`}>Opis</Label>
            <Input
              id={`description-${item.id}`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div>
            <Label htmlFor={`account-${item.id}`}>Konto</Label>
            <select
              id={`account-${item.id}`}
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              disabled={isPending}
              className={selectClass}
            >
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor={`category-${item.id}`}>Kategoria</Label>
            <select
              id={`category-${item.id}`}
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              disabled={isPending}
              className={selectClass}
            >
              <option value="">Bez kategorii</option>
              {filteredCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor={`frequency-${item.id}`}>Częstotliwość</Label>
            <select
              id={`frequency-${item.id}`}
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as RecurringFrequency)}
              disabled={isPending}
              className={selectClass}
            >
              {FREQUENCY_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor={`next-due-date-${item.id}`}>Najbliższa płatność</Label>
            <Input
              id={`next-due-date-${item.id}`}
              type="date"
              value={nextDueDate}
              onChange={(e) => setNextDueDate(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={closePanel} disabled={isPending}>
              Anuluj
            </Button>
            <Button
              size="sm"
              className="flex-1"
              isLoading={isPending}
              disabled={!canSubmitEdit}
              onClick={submitEdit}
            >
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
              Na pewno chcesz usunąć rachunek cykliczny „{item.description}”? Tej operacji nie da się cofnąć.
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

function NewRecurringForm({ categories, accounts }: { categories: BudgetCategory[]; accounts: AccountBalance[] }) {
  const router = useRouter();
  const [type, setType] = useState<RecurringInput["type"]>("obciazenie");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");
  const [categoryId, setCategoryId] = useState("");
  const [frequency, setFrequency] = useState<RecurringFrequency>("monthly");
  const [nextDueDate, setNextDueDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const categoryKind: BudgetCategoryKind = type === "uznanie" ? "income" : "expense";
  const filteredCategories = categories.filter((c) => c.kind === categoryKind);

  function handleTypeChange(next: RecurringInput["type"]) {
    setType(next);
    setCategoryId("");
  }

  const canSubmit =
    amount.trim() !== "" && Number(amount) > 0 && description.trim() !== "" && !!accountId && !!nextDueDate;

  function submit() {
    if (!canSubmit || isPending) return;
    setError(null);
    startTransition(async () => {
      const input: RecurringInput = {
        type,
        amount: Number(amount),
        description,
        categoryId: categoryId || null,
        accountId,
        frequency,
        nextDueDate,
      };
      const result = await createRecurringTransaction(input);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setAmount("");
      setDescription("");
      setCategoryId("");
      setFrequency("monthly");
      setNextDueDate("");
      router.refresh();
    });
  }

  return (
    <Card>
      <CardTitle>Nowy rachunek cykliczny</CardTitle>
      <div className="mt-3 flex flex-col gap-3">
        <div>
          <Label htmlFor="new-recurring-type">Typ</Label>
          <select
            id="new-recurring-type"
            value={type}
            onChange={(e) => handleTypeChange(e.target.value as RecurringInput["type"])}
            disabled={isPending}
            className={selectClass}
          >
            {TYPE_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="new-recurring-amount">Kwota</Label>
          <Input
            id="new-recurring-amount"
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="np. 79.99"
            disabled={isPending}
          />
        </div>
        <div>
          <Label htmlFor="new-recurring-description">Opis</Label>
          <Input
            id="new-recurring-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="np. Czynsz za mieszkanie"
            disabled={isPending}
          />
        </div>
        <div>
          <Label htmlFor="new-recurring-account">Konto</Label>
          <select
            id="new-recurring-account"
            value={accountId}
            onChange={(e) => setAccountId(e.target.value)}
            disabled={isPending}
            className={selectClass}
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="new-recurring-category">Kategoria</Label>
          <select
            id="new-recurring-category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={isPending}
            className={selectClass}
          >
            <option value="">Bez kategorii</option>
            {filteredCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="new-recurring-frequency">Częstotliwość</Label>
          <select
            id="new-recurring-frequency"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value as RecurringFrequency)}
            disabled={isPending}
            className={selectClass}
          >
            {FREQUENCY_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="new-recurring-next-due-date">Najbliższa/pierwsza płatność</Label>
          <Input
            id="new-recurring-next-due-date"
            type="date"
            value={nextDueDate}
            onChange={(e) => setNextDueDate(e.target.value)}
            disabled={isPending}
          />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button className="w-full" isLoading={isPending} disabled={!canSubmit} onClick={submit}>
          <Plus className="h-4 w-4" /> Dodaj rachunek cykliczny
        </Button>
      </div>
    </Card>
  );
}
