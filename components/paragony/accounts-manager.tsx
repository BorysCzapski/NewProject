"use client";

// ============================================================================
// components/paragony/accounts-manager.tsx
// Full CRUD for accounts: per-account card (balance, edit, delete-with-
// confirmation) plus a "new account" form at the bottom of the list.
// ============================================================================
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAccount, updateAccount, deleteAccount } from "@/lib/paragony/accounts-actions";
import type { AccountBalance } from "@/lib/paragony/queries";
import type { AccountKind } from "@/lib/types/database";

const selectClass =
  "h-12 w-full rounded-(--radius-control) border border-border bg-surface px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary";

const currencyFormatter = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" });

const KIND_LABELS: Record<AccountKind, string> = {
  cash: "Gotówka",
  bank: "Konto bankowe",
  credit_card: "Karta kredytowa",
  other: "Inne",
};

const KIND_OPTIONS = Object.entries(KIND_LABELS) as [AccountKind, string][];

type Panel = "edit" | "delete" | null;

export function AccountsManager({ accounts }: { accounts: AccountBalance[] }) {
  return (
    <div className="flex flex-col gap-4">
      {accounts.length === 0 ? (
        <Card>
          <CardDescription>Nie masz jeszcze żadnych kont. Załóż pierwsze poniżej.</CardDescription>
        </Card>
      ) : (
        accounts.map((account) => <AccountCard key={account.id} account={account} />)
      )}
      <NewAccountForm />
    </div>
  );
}

function AccountCard({ account }: { account: AccountBalance }) {
  const router = useRouter();
  const [panel, setPanel] = useState<Panel>(null);
  const [name, setName] = useState(account.name);
  const [kind, setKind] = useState<AccountKind>(account.kind);
  const [startingBalance, setStartingBalance] = useState(String(account.starting_balance));
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openPanel(next: Exclude<Panel, null>) {
    setError(null);
    setName(account.name);
    setKind(account.kind);
    setStartingBalance(String(account.starting_balance));
    setPanel(next);
  }

  function closePanel() {
    setError(null);
    setPanel(null);
  }

  function submitEdit() {
    if (!name.trim()) {
      setError("Podaj nazwę konta.");
      return;
    }
    const parsedStartingBalance = Number(startingBalance);
    if (Number.isNaN(parsedStartingBalance)) {
      setError("Saldo początkowe musi być liczbą.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await updateAccount(account.id, {
        name,
        kind,
        startingBalance: parsedStartingBalance,
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
      const result = await deleteAccount(account.id);
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
        <CardTitle className="truncate">{account.name}</CardTitle>
        <span
          className={`shrink-0 text-sm font-medium ${account.balance < 0 ? "text-danger" : "text-foreground"}`}
        >
          {currencyFormatter.format(account.balance)}
        </span>
      </div>
      <CardDescription className="mt-1">{KIND_LABELS[account.kind]}</CardDescription>

      {panel === null && (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => openPanel("edit")}>
            <Pencil className="h-3.5 w-3.5" /> Edytuj
          </Button>
          <Button variant="outline" size="sm" onClick={() => openPanel("delete")}>
            <Trash2 className="h-3.5 w-3.5" /> Usuń
          </Button>
        </div>
      )}

      {panel === "edit" && (
        <div className="mt-3 flex flex-col gap-3">
          <div>
            <Label htmlFor={`name-${account.id}`}>Nazwa konta</Label>
            <Input
              id={`name-${account.id}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
            />
          </div>
          <div>
            <Label htmlFor={`kind-${account.id}`}>Rodzaj</Label>
            <select
              id={`kind-${account.id}`}
              value={kind}
              onChange={(e) => setKind(e.target.value as AccountKind)}
              disabled={isPending}
              className={selectClass}
            >
              {KIND_OPTIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor={`starting-balance-${account.id}`}>Saldo początkowe</Label>
            <Input
              id={`starting-balance-${account.id}`}
              type="number"
              step="0.01"
              value={startingBalance}
              onChange={(e) => setStartingBalance(e.target.value)}
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
              Na pewno chcesz usunąć konto „{account.name}”? Tej operacji nie da się cofnąć.
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

function NewAccountForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [kind, setKind] = useState<AccountKind>("cash");
  const [startingBalance, setStartingBalance] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const canSubmit = name.trim() !== "";

  function submit() {
    if (!canSubmit || isPending) return;
    const parsedStartingBalance = Number(startingBalance);
    if (Number.isNaN(parsedStartingBalance)) {
      setError("Saldo początkowe musi być liczbą.");
      return;
    }
    setError(null);
    startTransition(async () => {
      const result = await createAccount({ name, kind, startingBalance: parsedStartingBalance });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setName("");
      setKind("cash");
      setStartingBalance("0");
      router.refresh();
    });
  }

  return (
    <Card>
      <CardTitle>Nowe konto</CardTitle>
      <div className="mt-3 flex flex-col gap-3">
        <div>
          <Label htmlFor="new-account-name">Nazwa konta</Label>
          <Input
            id="new-account-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="np. Konto ROR"
            disabled={isPending}
          />
        </div>
        <div>
          <Label htmlFor="new-account-kind">Rodzaj</Label>
          <select
            id="new-account-kind"
            value={kind}
            onChange={(e) => setKind(e.target.value as AccountKind)}
            disabled={isPending}
            className={selectClass}
          >
            {KIND_OPTIONS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="new-account-starting-balance">Saldo początkowe</Label>
          <Input
            id="new-account-starting-balance"
            type="number"
            step="0.01"
            value={startingBalance}
            onChange={(e) => setStartingBalance(e.target.value)}
            disabled={isPending}
          />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button className="w-full" isLoading={isPending} disabled={!canSubmit} onClick={submit}>
          <Plus className="h-4 w-4" /> Dodaj konto
        </Button>
      </div>
    </Card>
  );
}
