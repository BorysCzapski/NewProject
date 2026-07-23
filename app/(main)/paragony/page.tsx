// ============================================================================
// app/(main)/paragony/page.tsx
// Paragony home ("Pulpit") screen: total balance across accounts, per-account
// balances, this month's income/expenses/net, upcoming recurring bills, top
// savings goals, and the two primary CTAs (scan a receipt / add a manual
// transaction).
// ============================================================================
import Link from "next/link";
import {
  Camera,
  ChevronRight,
  Coins,
  CreditCard,
  Landmark,
  Plus,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { requireProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import {
  getAccountsWithBalances,
  getGoalsWithProgress,
  getMonthlySummary,
  getUpcomingRecurring,
} from "@/lib/paragony/queries";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarkRecurringPaidButton } from "@/components/paragony/mark-recurring-paid-button";
import { cn } from "@/lib/utils";
import type { AccountKind } from "@/lib/types/database";

const currencyFormatter = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" });
const dateFormatter = new Intl.DateTimeFormat("pl-PL", { day: "numeric", month: "long", year: "numeric" });

const ACCOUNT_KIND_ICONS: Record<AccountKind, LucideIcon> = {
  cash: Wallet,
  bank: Landmark,
  credit_card: CreditCard,
  other: Coins,
};

const ACCOUNT_KIND_LABELS: Record<AccountKind, string> = {
  cash: "Gotówka",
  bank: "Konto bankowe",
  credit_card: "Karta kredytowa",
  other: "Inne",
};

export default async function ParagonyDashboardPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const [accounts, summary, upcomingRecurring, goals] = await Promise.all([
    getAccountsWithBalances(supabase, profile.id),
    getMonthlySummary(supabase, profile.id, year, month),
    getUpcomingRecurring(supabase, profile.id),
    getGoalsWithProgress(supabase, profile.id),
  ]);

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const topGoals = [...goals].sort((a, b) => b.progressPercent - a.progressPercent).slice(0, 2);

  return (
    <div>
      <PageHeader title="Pulpit" subtitle="Twój budżet i portfel" />
      <div className="mx-auto max-w-lg px-5 py-5">
        <div className="flex flex-col gap-4">
          <div className="text-center">
            <p className="text-sm text-foreground-muted">Łączne saldo</p>
            <p className={cn("text-3xl font-bold", totalBalance < 0 ? "text-danger" : "text-foreground")}>
              {currencyFormatter.format(totalBalance)}
            </p>
          </div>

          <section>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground-muted">Konta</h2>
              <Link href="/paragony/konta" className="text-sm font-medium text-primary">
                Zarządzaj kontami
              </Link>
            </div>
            {accounts.length === 0 ? (
              <Card>
                <CardDescription>Nie masz jeszcze żadnego konta.</CardDescription>
              </Card>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {accounts.map((account) => {
                  const Icon = ACCOUNT_KIND_ICONS[account.kind];
                  return (
                    <Card key={account.id} className="flex min-w-[168px] shrink-0 flex-col gap-2">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-soft text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="truncate text-sm font-medium text-foreground">{account.name}</p>
                        <p className="text-xs text-foreground-muted">{ACCOUNT_KIND_LABELS[account.kind]}</p>
                      </div>
                      <p
                        className={cn(
                          "text-base font-semibold",
                          account.balance < 0 ? "text-danger" : "text-foreground"
                        )}
                      >
                        {currencyFormatter.format(account.balance)}
                      </p>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>

          <Card>
            <div className="flex items-center justify-between">
              <CardTitle>Podsumowanie miesiąca</CardTitle>
              <Link href="/paragony/budzet" className="text-sm font-medium text-primary">
                Zobacz budżet
              </Link>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xs text-foreground-muted">Przychody</p>
                <p className="text-base font-semibold text-foreground">{currencyFormatter.format(summary.income)}</p>
              </div>
              <div>
                <p className="text-xs text-foreground-muted">Wydatki</p>
                <p className="text-base font-semibold text-foreground">
                  {currencyFormatter.format(summary.expenses)}
                </p>
              </div>
              <div>
                <p className="text-xs text-foreground-muted">Bilans</p>
                <p className={cn("text-base font-semibold", summary.net >= 0 ? "text-accent" : "text-danger")}>
                  {currencyFormatter.format(summary.net)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <CardTitle>Nadchodzące rachunki cykliczne</CardTitle>
            {upcomingRecurring.length === 0 ? (
              <div className="mt-3 flex flex-col items-center gap-2 py-2 text-center">
                <CardDescription>Nie masz jeszcze żadnych rachunków cyklicznych.</CardDescription>
                <Link href="/paragony/cykliczne" className="text-sm font-medium text-primary">
                  Dodaj rachunek cykliczny
                </Link>
              </div>
            ) : (
              <div className="mt-3 flex flex-col gap-2">
                {upcomingRecurring.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-(--radius-control) p-3",
                      item.is_overdue ? "bg-danger-soft" : "bg-surface-muted"
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-medium text-foreground">{item.description}</p>
                        {item.is_overdue && <Badge className="bg-danger text-white">Zaległe</Badge>}
                      </div>
                      <p className="text-xs text-foreground-muted">
                        {item.account_name} · {dateFormatter.format(new Date(item.next_due_date))}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          item.type === "obciazenie" ? "text-danger" : "text-accent"
                        )}
                      >
                        {currencyFormatter.format(item.amount)}
                      </p>
                      <MarkRecurringPaidButton id={item.id} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <CardTitle>Cele oszczędnościowe</CardTitle>
            {topGoals.length === 0 ? (
              <CardDescription className="mt-2">
                Nie masz jeszcze żadnych celów oszczędnościowych. Załóż pierwszy cel i śledź postępy.
              </CardDescription>
            ) : (
              <div className="mt-3 flex flex-col gap-4">
                {topGoals.map((goal) => (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-foreground">{goal.title}</p>
                      <p className="shrink-0 text-sm text-foreground-muted">
                        {Math.round(goal.progressPercent)}%
                      </p>
                    </div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-surface-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${Math.min(100, goal.progressPercent)}%` }}
                      />
                    </div>
                    <div className="mt-1 flex items-center justify-between gap-2 text-xs text-foreground-muted">
                      <span>
                        {currencyFormatter.format(goal.current_amount)} /{" "}
                        {currencyFormatter.format(goal.target_amount)}
                      </span>
                      <span>
                        {goal.estimatedCompletionDate
                          ? dateFormatter.format(new Date(goal.estimatedCompletionDate))
                          : "—"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link href="/paragony/cele" className="mt-3 inline-block text-sm font-medium text-primary">
              Zobacz wszystkie cele
            </Link>
          </Card>

          <div className="grid grid-cols-2 gap-3">
            <Link href="/paragony/paragon/nowy">
              <Button size="lg" className="w-full">
                <Camera className="h-5 w-5" />
                Skanuj paragon
              </Button>
            </Link>
            <Link href="/paragony/transakcje/nowa">
              <Button size="lg" variant="secondary" className="w-full">
                <Plus className="h-5 w-5" />
                Dodaj transakcję
              </Button>
            </Link>
          </div>

          <Link
            href="/paragony/etf"
            className="flex items-center justify-between gap-2 rounded-(--radius-card) border border-border bg-surface px-4 py-3.5 active:opacity-80"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-foreground">
              <TrendingUp className="h-4 w-4 text-primary" />
              Zobacz portfel ETF
            </span>
            <ChevronRight className="h-4 w-4 text-foreground-muted" />
          </Link>
        </div>
      </div>
    </div>
  );
}
