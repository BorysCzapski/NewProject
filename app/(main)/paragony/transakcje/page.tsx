// ============================================================================
// app/(main)/paragony/transakcje/page.tsx
// Transaction ledger: every manual/receipt-derived transaction, grouped by
// day, with a rok/miesiac/kategoria/konto GET filter bar (see
// lib/paragony/queries.ts listTransactions/TransactionFilters).
// ============================================================================
import Link from "next/link";
import { Plus } from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import {
  getAccountsWithBalances,
  getCategories,
  listTransactions,
  type TransactionFilters,
  type TransactionWithRelations,
} from "@/lib/paragony/queries";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CategoryIcon } from "@/components/paragony/category-icon";
import { cn } from "@/lib/utils";

const selectClass =
  "h-12 w-full rounded-(--radius-control) border border-border bg-surface px-4 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary";

const MONTH_NAMES = [
  "styczeń",
  "luty",
  "marzec",
  "kwiecień",
  "maj",
  "czerwiec",
  "lipiec",
  "sierpień",
  "wrzesień",
  "październik",
  "listopad",
  "grudzień",
];

const currencyFormatter = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" });
const dateFormatter = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" });

function groupByDate(transactions: TransactionWithRelations[]): Map<string, TransactionWithRelations[]> {
  const groups = new Map<string, TransactionWithRelations[]>();
  for (const tx of transactions) {
    const existing = groups.get(tx.occurred_at);
    if (existing) existing.push(tx);
    else groups.set(tx.occurred_at, [tx]);
  }
  return groups;
}

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ rok?: string; miesiac?: string; kategoria?: string; konto?: string }>;
}) {
  const { rok, miesiac, kategoria, konto } = await searchParams;
  const profile = await requireProfile();
  const supabase = await createClient();

  const year = rok ? parseInt(rok, 10) : undefined;
  const month = miesiac ? parseInt(miesiac, 10) : undefined;
  const filters: TransactionFilters = {
    year: year && month ? year : undefined,
    month: year && month ? month : undefined,
    categoryId: kategoria || undefined,
    accountId: konto || undefined,
  };

  const [transactions, categories, accounts] = await Promise.all([
    listTransactions(supabase, profile.id, filters),
    getCategories(supabase, profile.id),
    getAccountsWithBalances(supabase, profile.id),
  ]);

  const categoriesById = new Map(categories.map((c) => [c.id, c]));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const groups = groupByDate(transactions);

  return (
    <div>
      <PageHeader
        title="Transakcje"
        action={
          <Link href="/paragony/transakcje/nowa">
            <Button size="sm">
              <Plus className="h-4 w-4" /> Dodaj
            </Button>
          </Link>
        }
      />
      <div className="mx-auto max-w-lg px-5 py-5">
        <form method="get" className="mb-5 grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="rok">Rok</Label>
            <select id="rok" name="rok" defaultValue={rok ?? ""} className={selectClass}>
              <option value="">Wszystkie</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="miesiac">Miesiąc</Label>
            <select id="miesiac" name="miesiac" defaultValue={miesiac ?? ""} className={selectClass}>
              <option value="">Wszystkie</option>
              {MONTH_NAMES.map((name, i) => (
                <option key={name} value={i + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="kategoria">Kategoria</Label>
            <select id="kategoria" name="kategoria" defaultValue={kategoria ?? ""} className={selectClass}>
              <option value="">Wszystkie</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="konto">Konto</Label>
            <select id="konto" name="konto" defaultValue={konto ?? ""} className={selectClass}>
              <option value="">Wszystkie</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </select>
          </div>

          <Button type="submit" size="sm" className="col-span-2">
            Filtruj
          </Button>
        </form>

        {transactions.length === 0 ? (
          <Card>
            <CardDescription>Brak transakcji spełniających wybrane kryteria.</CardDescription>
          </Card>
        ) : (
          <div className="flex flex-col gap-4">
            {Array.from(groups.entries()).map(([date, txs]) => (
              <div key={date}>
                <h2 className="mb-2 text-sm font-semibold text-foreground-muted">
                  {dateFormatter.format(new Date(date))}
                </h2>
                <div className="flex flex-col gap-2">
                  {txs.map((tx) => {
                    const category = tx.category_id ? categoriesById.get(tx.category_id) : undefined;
                    const isCredit = tx.type === "uznanie";
                    return (
                      <Card key={tx.id} className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary">
                            <CategoryIcon name={category?.icon ?? null} className="h-4 w-4" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">{tx.description}</p>
                            <p className="truncate text-xs text-foreground-muted">
                              {tx.type === "transfer" ? "Przelew" : tx.category_name ?? "Bez kategorii"} ·{" "}
                              {tx.account_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-1">
                          <p className={cn("text-sm font-semibold", isCredit ? "text-accent" : "text-danger")}>
                            {isCredit ? "+" : "-"}
                            {currencyFormatter.format(tx.amount)}
                          </p>
                          <Link
                            href={`/paragony/transakcje/${tx.id}/edytuj`}
                            className="text-xs font-medium text-primary"
                          >
                            Edytuj
                          </Link>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
