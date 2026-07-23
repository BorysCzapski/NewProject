// ============================================================================
// lib/paragony/queries.ts
// Read-only aggregation helpers for the budget dashboard/ledger/budget-vs-
// actual views. Plain server-only functions (not Server Actions) called
// directly from Server Components, same shape as lib/matma/progress.ts.
// Balances/summaries are computed in JS over a user's own (typically small,
// personal-finance-scale) transaction set rather than via SQL views, to keep
// the whole model readable in one place.
// ============================================================================
import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  Account,
  BudgetCategory,
  BudgetCategoryKind,
  RecurringTransaction,
  SavingsGoal,
  Transaction,
} from "@/lib/types/database";

export interface AccountBalance extends Account {
  balance: number;
}

export async function getAccountsWithBalances(
  supabase: SupabaseClient,
  userId: string
): Promise<AccountBalance[]> {
  const [{ data: accounts }, { data: transactions }] = await Promise.all([
    supabase.from("accounts").select("*").eq("user_id", userId).order("created_at"),
    supabase
      .from("transactions")
      .select("account_id, transfer_to_account_id, type, amount")
      .eq("user_id", userId),
  ]);

  const deltas = new Map<string, number>();
  const bump = (accountId: string, amount: number) =>
    deltas.set(accountId, (deltas.get(accountId) ?? 0) + amount);

  for (const tx of transactions ?? []) {
    const amount = tx.amount as number;
    const accountId = tx.account_id as string;
    if (tx.type === "uznanie") bump(accountId, amount);
    else if (tx.type === "obciazenie") bump(accountId, -amount);
    else if (tx.type === "transfer") {
      bump(accountId, -amount);
      if (tx.transfer_to_account_id) bump(tx.transfer_to_account_id as string, amount);
    }
  }

  return (accounts ?? []).map((row) => {
    const account = row as Account;
    return { ...account, balance: account.starting_balance + (deltas.get(account.id) ?? 0) };
  });
}

export interface MonthlyCategoryAmount {
  categoryId: string | null;
  categoryName: string;
  kind: BudgetCategoryKind;
  amount: number;
}

export interface MonthlySummary {
  income: number;
  expenses: number;
  net: number;
  byCategory: MonthlyCategoryAmount[];
}

function monthRange(year: number, month: number): { start: string; end: string } {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const end = new Date(Date.UTC(year, month, 1)).toISOString().slice(0, 10);
  return { start, end };
}

/** Income/expenses for a calendar month, excluding transfers (see the
 * migration comment on why transfers don't count toward budget totals). */
export async function getMonthlySummary(
  supabase: SupabaseClient,
  userId: string,
  year: number,
  month: number
): Promise<MonthlySummary> {
  const { start, end } = monthRange(year, month);
  const { data: rows, error } = await supabase
    .from("transactions")
    .select("type, amount, category_id, budget_categories(name, kind)")
    .eq("user_id", userId)
    .neq("type", "transfer")
    .gte("occurred_at", start)
    .lt("occurred_at", end);

  if (error) console.error("[paragony] getMonthlySummary failed:", error);

  let income = 0;
  let expenses = 0;
  const byCategoryMap = new Map<string, MonthlyCategoryAmount>();

  for (const row of rows ?? []) {
    const amount = row.amount as number;
    const type = row.type as "uznanie" | "obciazenie";
    if (type === "uznanie") income += amount;
    else expenses += amount;

    const catRow = row.budget_categories as unknown as { name: string; kind: BudgetCategoryKind } | null;
    const key = (row.category_id as string | null) ?? "__none__";
    const existing = byCategoryMap.get(key);
    if (existing) {
      existing.amount += amount;
    } else {
      byCategoryMap.set(key, {
        categoryId: row.category_id as string | null,
        categoryName: catRow?.name ?? "Bez kategorii",
        kind: catRow?.kind ?? (type === "uznanie" ? "income" : "expense"),
        amount,
      });
    }
  }

  return {
    income,
    expenses,
    net: income - expenses,
    byCategory: Array.from(byCategoryMap.values()).sort((a, b) => b.amount - a.amount),
  };
}

export interface CategoryBudgetLine {
  categoryId: string;
  categoryName: string;
  icon: string | null;
  planned: number;
  actual: number;
}

/** Plan vs actual per expense category for a given month — drives the
 * budget page's chart + per-category drill-down into transactions. */
export async function getBudgetVsActual(
  supabase: SupabaseClient,
  userId: string,
  year: number,
  month: number
): Promise<CategoryBudgetLine[]> {
  const { start, end } = monthRange(year, month);

  const [{ data: categories }, { data: budgets }, { data: transactions }] = await Promise.all([
    supabase
      .from("budget_categories")
      .select("*")
      .or(`user_id.is.null,user_id.eq.${userId}`)
      .eq("kind", "expense"),
    supabase
      .from("monthly_budgets")
      .select("category_id, planned_amount")
      .eq("user_id", userId)
      .eq("year", year)
      .eq("month", month),
    supabase
      .from("transactions")
      .select("category_id, amount")
      .eq("user_id", userId)
      .eq("type", "obciazenie")
      .gte("occurred_at", start)
      .lt("occurred_at", end),
  ]);

  const plannedByCategory = new Map(
    (budgets ?? []).map((b) => [b.category_id as string, b.planned_amount as number])
  );
  const actualByCategory = new Map<string, number>();
  for (const tx of transactions ?? []) {
    if (!tx.category_id) continue;
    const key = tx.category_id as string;
    actualByCategory.set(key, (actualByCategory.get(key) ?? 0) + (tx.amount as number));
  }

  return (categories ?? [])
    .map((row) => {
      const category = row as BudgetCategory;
      return {
        categoryId: category.id,
        categoryName: category.name,
        icon: category.icon,
        planned: plannedByCategory.get(category.id) ?? 0,
        actual: actualByCategory.get(category.id) ?? 0,
      };
    })
    .sort((a, b) => b.actual - a.actual);
}

export interface TransactionFilters {
  year?: number;
  month?: number;
  /** Pass null explicitly to filter for "no category" rows. */
  categoryId?: string | null;
  accountId?: string;
  limit?: number;
}

export interface TransactionWithRelations extends Transaction {
  category_name: string | null;
  account_name: string;
}

export async function listTransactions(
  supabase: SupabaseClient,
  userId: string,
  filters: TransactionFilters = {}
): Promise<TransactionWithRelations[]> {
  let query = supabase
    .from("transactions")
    .select("*, budget_categories(name), accounts!transactions_account_id_fkey(name)")
    .eq("user_id", userId)
    .order("occurred_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters.year && filters.month) {
    const { start, end } = monthRange(filters.year, filters.month);
    query = query.gte("occurred_at", start).lt("occurred_at", end);
  }
  if (filters.categoryId !== undefined) {
    query = filters.categoryId === null ? query.is("category_id", null) : query.eq("category_id", filters.categoryId);
  }
  if (filters.accountId) query = query.eq("account_id", filters.accountId);
  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) {
    console.error("[paragony] listTransactions failed:", error);
    return [];
  }

  return (data ?? []).map((row) => ({
    ...(row as Transaction),
    category_name: (row.budget_categories as { name: string } | null)?.name ?? null,
    account_name: (row.accounts as { name: string } | null)?.name ?? "?",
  }));
}

export interface UpcomingRecurring extends RecurringTransaction {
  category_name: string | null;
  account_name: string;
  is_overdue: boolean;
}

export async function getUpcomingRecurring(
  supabase: SupabaseClient,
  userId: string
): Promise<UpcomingRecurring[]> {
  const { data, error } = await supabase
    .from("recurring_transactions")
    .select("*, budget_categories(name), accounts(name)")
    .eq("user_id", userId)
    .eq("is_active", true)
    .order("next_due_date", { ascending: true });

  if (error) {
    console.error("[paragony] getUpcomingRecurring failed:", error);
    return [];
  }

  const today = new Date().toISOString().slice(0, 10);
  return (data ?? []).map((row) => ({
    ...(row as RecurringTransaction),
    category_name: (row.budget_categories as { name: string } | null)?.name ?? null,
    account_name: (row.accounts as { name: string } | null)?.name ?? "?",
    is_overdue: (row.next_due_date as string) < today,
  }));
}

export interface GoalWithProgress extends SavingsGoal {
  progressPercent: number;
  /** null when already reached, or when there's no contribution pace yet to
   * extrapolate from. */
  estimatedCompletionDate: string | null;
}

/** Linear extrapolation from the goal's average pace since creation — a
 * real (if naive) estimate from actual data, not a placeholder. */
export function estimateGoalCompletion(goal: SavingsGoal): string | null {
  if (goal.current_amount >= goal.target_amount) return null;
  const daysSinceCreated = Math.max(1, (Date.now() - new Date(goal.created_at).getTime()) / 86_400_000);
  const dailyRate = goal.current_amount / daysSinceCreated;
  if (dailyRate <= 0) return null;
  const daysNeeded = (goal.target_amount - goal.current_amount) / dailyRate;
  return new Date(Date.now() + daysNeeded * 86_400_000).toISOString().slice(0, 10);
}

export async function getGoalsWithProgress(
  supabase: SupabaseClient,
  userId: string
): Promise<GoalWithProgress[]> {
  const { data, error } = await supabase
    .from("savings_goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[paragony] getGoalsWithProgress failed:", error);
    return [];
  }

  return (data ?? []).map((row) => {
    const goal = row as SavingsGoal;
    return {
      ...goal,
      progressPercent: goal.target_amount > 0 ? Math.min(100, (goal.current_amount / goal.target_amount) * 100) : 0,
      estimatedCompletionDate: estimateGoalCompletion(goal),
    };
  });
}

export async function getCategories(
  supabase: SupabaseClient,
  userId: string,
  kind?: BudgetCategoryKind
): Promise<BudgetCategory[]> {
  let query = supabase
    .from("budget_categories")
    .select("*")
    .or(`user_id.is.null,user_id.eq.${userId}`)
    .order("is_default", { ascending: false })
    .order("name", { ascending: true });
  if (kind) query = query.eq("kind", kind);

  const { data, error } = await query;
  if (error) {
    console.error("[paragony] getCategories failed:", error);
    return [];
  }
  return (data ?? []) as BudgetCategory[];
}
