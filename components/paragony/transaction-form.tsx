"use client";

// ============================================================================
// components/paragony/transaction-form.tsx
// Reusable manual ledger entry form for both creating and editing a
// transaction (uznanie/obciazenie/przychód-wydatek, or a transfer between
// two of the user's own accounts). When transactionId is provided the form
// also renders a delete section below it, since this is the only client
// component for the ledger and the edit page itself stays a server
// component (see app/(main)/paragony/transakcje/[id]/edytuj/page.tsx).
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Trash2 } from "lucide-react";
import {
  addTransaction,
  deleteTransaction,
  updateTransaction,
  type TransactionInput,
} from "@/lib/paragony/transactions-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toDateKey } from "@/lib/utils";
import type { Account, BudgetCategory, BudgetCategoryKind, Transaction, TransactionType } from "@/lib/types/database";

const selectClass =
  "h-12 w-full rounded-(--radius-control) border border-border bg-surface px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary";

const TYPE_OPTIONS: { value: TransactionType; label: string }[] = [
  { value: "uznanie", label: "Uznanie (przychód)" },
  { value: "obciazenie", label: "Obciążenie (wydatek)" },
  { value: "transfer", label: "Transfer między kontami" },
];

export function TransactionForm({
  accounts,
  categories,
  transaction,
  transactionId,
}: {
  accounts: Account[];
  categories: BudgetCategory[];
  transaction?: Transaction;
  transactionId?: string;
}) {
  const router = useRouter();

  const [type, setType] = useState<TransactionType>(transaction?.type ?? "obciazenie");
  const [amount, setAmount] = useState(transaction ? String(transaction.amount) : "");
  const [occurredAt, setOccurredAt] = useState(transaction?.occurred_at ?? toDateKey(new Date()));
  const [description, setDescription] = useState(transaction?.description ?? "");
  const [accountId, setAccountId] = useState(transaction?.account_id ?? accounts[0]?.id ?? "");
  const [categoryId, setCategoryId] = useState(transaction?.category_id ?? "");
  const [transferToAccountId, setTransferToAccountId] = useState(transaction?.transfer_to_account_id ?? "");

  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, startDeleteTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  function handleTypeChange(next: TransactionType) {
    setType(next);
    setCategoryId("");
    setTransferToAccountId("");
  }

  function handleAccountIdChange(next: string) {
    setAccountId(next);
    if (transferToAccountId === next) setTransferToAccountId("");
  }

  const categoryKind: BudgetCategoryKind = type === "uznanie" ? "income" : "expense";
  const filteredCategories = categories.filter((c) => c.kind === categoryKind);
  const transferTargets = accounts.filter((a) => a.id !== accountId);

  const canSubmit =
    amount.trim() !== "" &&
    Number(amount) > 0 &&
    !!occurredAt &&
    description.trim() !== "" &&
    !!accountId &&
    (type !== "transfer" || (!!transferToAccountId && transferToAccountId !== accountId));

  function submit() {
    if (!canSubmit || pending) return;
    setError(null);
    startTransition(async () => {
      const input: TransactionInput = {
        type,
        amount: Number(amount),
        occurredAt,
        description,
        categoryId: type === "transfer" ? null : categoryId || null,
        accountId,
        transferToAccountId: type === "transfer" ? transferToAccountId || null : null,
        savingsGoalId: null,
      };

      const result = transactionId
        ? await updateTransaction(transactionId, input)
        : await addTransaction(input);

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.push("/paragony/transakcje");
      router.refresh();
    });
  }

  function handleDelete() {
    if (!transactionId || deleting) return;
    setDeleteError(null);
    startDeleteTransition(async () => {
      const result = await deleteTransaction(transactionId);
      if (!result.ok) {
        setDeleteError(result.error);
        return;
      }
      router.push("/paragony/transakcje");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <Label htmlFor="type">Typ transakcji</Label>
        <select
          id="type"
          value={type}
          onChange={(e) => handleTypeChange(e.target.value as TransactionType)}
          disabled={pending}
          className={selectClass}
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <Label htmlFor="amount">Kwota</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="np. 49.99"
          disabled={pending}
        />
      </div>

      <div>
        <Label htmlFor="occurred-at">Data</Label>
        <Input
          id="occurred-at"
          type="date"
          value={occurredAt}
          onChange={(e) => setOccurredAt(e.target.value)}
          disabled={pending}
        />
      </div>

      <div>
        <Label htmlFor="description">Opis</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="np. Zakupy spożywcze"
          disabled={pending}
        />
      </div>

      <div>
        <Label htmlFor="account-id">{type === "transfer" ? "Konto źródłowe" : "Konto"}</Label>
        <select
          id="account-id"
          value={accountId}
          onChange={(e) => handleAccountIdChange(e.target.value)}
          disabled={pending}
          className={selectClass}
        >
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>

      {type !== "transfer" && (
        <div>
          <Label htmlFor="category-id">Kategoria</Label>
          <select
            id="category-id"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={pending}
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
      )}

      {type === "transfer" && (
        <div>
          <Label htmlFor="transfer-to-account-id">Konto docelowe</Label>
          <select
            id="transfer-to-account-id"
            value={transferToAccountId}
            onChange={(e) => setTransferToAccountId(e.target.value)}
            disabled={pending}
            className={selectClass}
          >
            <option value="" disabled>
              Wybierz konto docelowe...
            </option>
            {transferTargets.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button size="lg" className="w-full" onClick={submit} disabled={!canSubmit} isLoading={pending}>
        {transactionId ? "Zapisz zmiany" : "Dodaj transakcję"}
      </Button>

      {transactionId && (
        <div>
          {confirmDelete ? (
            <Card className="flex flex-col gap-3 bg-warning-soft">
              <div className="flex gap-2.5">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                <p className="text-sm text-foreground">
                  Na pewno chcesz usunąć tę transakcję? Tej operacji nie można cofnąć.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  disabled={deleting}
                  onClick={() => setConfirmDelete(false)}
                >
                  Anuluj
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  className="flex-1"
                  isLoading={deleting}
                  onClick={handleDelete}
                >
                  Usuń
                </Button>
              </div>
            </Card>
          ) : (
            <Button
              type="button"
              variant="danger"
              className="w-full"
              disabled={pending}
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-4 w-4" /> Usuń transakcję
            </Button>
          )}
          {deleteError && <p className="mt-2 text-sm text-danger">{deleteError}</p>}
        </div>
      )}
    </div>
  );
}
