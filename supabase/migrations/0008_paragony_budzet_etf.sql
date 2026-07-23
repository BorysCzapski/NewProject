-- ============================================================================
-- 0008_paragony_budzet_etf.sql
-- "Paragony" mini-app: receipt scanning + home budget ledger + ETF portfolio
-- tracking. Two independent feature sets sharing one module:
--
--   Budget: accounts (cash/bank/card balances) <- transactions (uznanie /
--   obciazenie / transfer) <- optionally generated from a scanned receipt
--   (receipts + receipt_items) or from a recurring_transactions template.
--   monthly_budgets is a per-category plan the dashboard compares against
--   actual transactions. savings_goals track progress toward a target.
--
--   ETF: etf_holdings (one row per ticker per user) <- etf_transactions
--   (buy/sell, many rows per holding so average cost is derived, never
--   overwritten) and etf_dividends. etf_price_history is a GLOBAL cache
--   shared across all users (market prices are public data) — see its RLS
--   section below for why it's deliberately not scoped to user_id.
--
-- RLS: every per-user table uses the repo-wide "<table>_own" policy
-- (auth.uid() = user_id, for all). Financial data is more sensitive than
-- Linguo's educational content, so — unlike math_topics/vocabulary_words —
-- there is NO "_admin_read" policy anywhere in this migration; an admin
-- role has no standing access to another user's money data.
--
-- Safe to re-run (create table/policy only if missing).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- accounts: cash / bank / credit card "buckets" a transaction can belong to.
-- ----------------------------------------------------------------------------
create table if not exists accounts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('cash', 'bank', 'credit_card', 'other')),
  starting_balance numeric not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists accounts_user_idx on accounts (user_id);

-- ----------------------------------------------------------------------------
-- budget_categories: user_id null = shared default category (seeded below,
-- visible to everyone); user_id set = a user's own custom category. Needs
-- finer-grained policies than the usual "_own for all" since the SELECT
-- condition (own OR global) differs from the write conditions (own only).
-- ----------------------------------------------------------------------------
create table if not exists budget_categories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles (id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('expense', 'income')),
  icon text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists budget_categories_user_idx on budget_categories (user_id);

-- ----------------------------------------------------------------------------
-- recurring_transactions: a template (rent, subscription, insurance) the app
-- reads to know what's "due" this period — no RRULE engine, just three fixed
-- frequencies and a rolling next_due_date advanced by the action layer.
-- ----------------------------------------------------------------------------
create table if not exists recurring_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  type text not null check (type in ('uznanie', 'obciazenie')),
  amount numeric not null check (amount > 0),
  description text not null default '',
  category_id uuid references budget_categories (id) on delete set null,
  -- No ON DELETE CASCADE here on purpose: deleting an account should not
  -- silently discard the recurring bill that pays from it (and, below, must
  -- not silently discard transaction history either) — the action layer
  -- requires moving/deleting dependents first and surfaces the FK violation
  -- as a friendly Polish error otherwise.
  account_id uuid not null references accounts (id),
  frequency text not null check (frequency in ('monthly', 'quarterly', 'yearly')),
  day_of_period int not null check (day_of_period between 1 and 31),
  next_due_date date not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists recurring_transactions_user_idx on recurring_transactions (user_id);

-- ----------------------------------------------------------------------------
-- savings_goals
-- ----------------------------------------------------------------------------
create table if not exists savings_goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  title text not null,
  target_amount numeric not null check (target_amount > 0),
  target_date date,
  current_amount numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists savings_goals_user_idx on savings_goals (user_id);

-- ----------------------------------------------------------------------------
-- receipts / receipt_items: raw_ocr_json keeps the AI's original structured
-- read for audit/debugging even after the user edits it during review.
-- image_path points into the private "paragony-receipts" storage bucket
-- (created below) — never a public URL, always signed on read.
-- ----------------------------------------------------------------------------
create table if not exists receipts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  store_name text,
  purchase_date date,
  total_amount numeric,
  raw_ocr_json jsonb,
  status text not null default 'pending_review' check (status in ('pending_review', 'confirmed')),
  image_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists receipts_user_idx on receipts (user_id);

create table if not exists receipt_items (
  id uuid primary key default gen_random_uuid(),
  receipt_id uuid not null references receipts (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  name text not null,
  quantity numeric not null default 1,
  unit_price numeric,
  total_price numeric not null default 0,
  category_id uuid references budget_categories (id) on delete set null,
  created_at timestamptz not null default now()
);
create index if not exists receipt_items_receipt_idx on receipt_items (receipt_id);
create index if not exists receipt_items_user_idx on receipt_items (user_id);

-- ----------------------------------------------------------------------------
-- transactions: the single ledger. type='transfer' moves money between two
-- of the user's own accounts and is deliberately excluded from budget
-- totals (category_id stays null for transfers) so it can't inflate both
-- income and expense sides of the monthly summary.
-- ----------------------------------------------------------------------------
create table if not exists transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  type text not null check (type in ('uznanie', 'obciazenie', 'transfer')),
  amount numeric not null check (amount > 0),
  occurred_at date not null default current_date,
  description text not null default '',
  category_id uuid references budget_categories (id) on delete set null,
  -- See the comment on recurring_transactions.account_id above: no cascade,
  -- so deleting an account with existing transactions fails loudly instead
  -- of quietly erasing ledger history.
  account_id uuid not null references accounts (id),
  transfer_to_account_id uuid references accounts (id),
  receipt_id uuid references receipts (id) on delete set null,
  recurring_transaction_id uuid references recurring_transactions (id) on delete set null,
  savings_goal_id uuid references savings_goals (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint transactions_transfer_target check (
    (type = 'transfer' and transfer_to_account_id is not null and transfer_to_account_id <> account_id)
    or (type <> 'transfer' and transfer_to_account_id is null)
  )
);
create index if not exists transactions_user_idx on transactions (user_id, occurred_at desc);
create index if not exists transactions_account_idx on transactions (account_id);
create index if not exists transactions_receipt_idx on transactions (receipt_id);

-- ----------------------------------------------------------------------------
-- monthly_budgets: planned_amount per category per calendar month.
-- ----------------------------------------------------------------------------
create table if not exists monthly_budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  category_id uuid not null references budget_categories (id) on delete cascade,
  year int not null,
  month int not null check (month between 1 and 12),
  planned_amount numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, category_id, year, month)
);
create index if not exists monthly_budgets_user_idx on monthly_budgets (user_id, year, month);

-- ----------------------------------------------------------------------------
-- etf_holdings: one row per (user, ticker). Repeated buys/sells are separate
-- etf_transactions rows so the average purchase price is always DERIVED,
-- never stored/overwritten.
-- ----------------------------------------------------------------------------
create table if not exists etf_holdings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  ticker text not null,
  provider text not null check (provider in ('stooq', 'fmp')),
  name text,
  currency text not null default 'PLN',
  asset_class text,
  region text,
  ter numeric,
  created_at timestamptz not null default now(),
  unique (user_id, ticker)
);
create index if not exists etf_holdings_user_idx on etf_holdings (user_id);

create table if not exists etf_transactions (
  id uuid primary key default gen_random_uuid(),
  holding_id uuid not null references etf_holdings (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  type text not null check (type in ('buy', 'sell')),
  units numeric not null check (units > 0),
  price_per_unit numeric not null check (price_per_unit >= 0),
  transaction_date date not null,
  created_at timestamptz not null default now()
);
create index if not exists etf_transactions_holding_idx on etf_transactions (holding_id, transaction_date);
create index if not exists etf_transactions_user_idx on etf_transactions (user_id);

create table if not exists etf_dividends (
  id uuid primary key default gen_random_uuid(),
  holding_id uuid not null references etf_holdings (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  amount numeric not null check (amount > 0),
  payment_date date not null,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists etf_dividends_holding_idx on etf_dividends (holding_id);
create index if not exists etf_dividends_user_idx on etf_dividends (user_id);

-- ----------------------------------------------------------------------------
-- etf_price_history: GLOBAL cache, deliberately NOT scoped by user_id — the
-- same ticker's closing price is identical for every user who holds it, so
-- caching per-user would multiply redundant Stooq/FMP calls. RLS grants
-- read to any authenticated user; there is intentionally no insert/update
-- policy for the "authenticated" role at all — writes only ever happen
-- through lib/supabase/admin.ts's service-role client from server-side price
-- refresh code (lib/paragony/etf-prices.ts), never directly from a client.
-- ----------------------------------------------------------------------------
create table if not exists etf_price_history (
  id uuid primary key default gen_random_uuid(),
  ticker text not null,
  price_date date not null,
  close_price numeric not null,
  currency text not null default 'PLN',
  fetched_at timestamptz not null default now(),
  unique (ticker, price_date)
);
create index if not exists etf_price_history_ticker_idx on etf_price_history (ticker, price_date desc);

-- ----------------------------------------------------------------------------
-- RLS
-- ----------------------------------------------------------------------------
alter table accounts enable row level security;
alter table budget_categories enable row level security;
alter table recurring_transactions enable row level security;
alter table savings_goals enable row level security;
alter table receipts enable row level security;
alter table receipt_items enable row level security;
alter table transactions enable row level security;
alter table monthly_budgets enable row level security;
alter table etf_holdings enable row level security;
alter table etf_transactions enable row level security;
alter table etf_dividends enable row level security;
alter table etf_price_history enable row level security;

do $$ begin
  create policy "accounts_own" on accounts for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "budget_categories_select" on budget_categories for select to authenticated
    using (user_id is null or auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "budget_categories_insert" on budget_categories for insert to authenticated
    with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "budget_categories_update" on budget_categories for update to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "budget_categories_delete" on budget_categories for delete to authenticated
    using (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "recurring_transactions_own" on recurring_transactions for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "savings_goals_own" on savings_goals for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "receipts_own" on receipts for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "receipt_items_own" on receipt_items for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "transactions_own" on transactions for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "monthly_budgets_own" on monthly_budgets for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "etf_holdings_own" on etf_holdings for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "etf_transactions_own" on etf_transactions for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "etf_dividends_own" on etf_dividends for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "etf_price_history_select" on etf_price_history for select to authenticated
    using (true);
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Storage: receipt photos. Private bucket, one folder per user (same shape
-- as 0007_matma.sql's "math-attempts" bucket).
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('paragony-receipts', 'paragony-receipts', false)
on conflict (id) do nothing;

do $$ begin
  create policy "paragony_receipts_storage_own" on storage.objects for all to authenticated
    using (bucket_id = 'paragony-receipts' and (storage.foldername(name))[1] = auth.uid()::text)
    with check (bucket_id = 'paragony-receipts' and (storage.foldername(name))[1] = auth.uid()::text);
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Seed: shared default budget categories (user_id null = visible to all).
-- Idempotent: only inserts a name+kind combo that isn't already a default.
-- ----------------------------------------------------------------------------
insert into budget_categories (name, kind, icon, is_default, user_id)
select v.name, v.kind, v.icon, true, null
from (values
  ('Spożywcze', 'expense', 'ShoppingCart'),
  ('Transport', 'expense', 'Car'),
  ('Rozrywka', 'expense', 'Popcorn'),
  ('Rachunki', 'expense', 'FileText'),
  ('Zdrowie', 'expense', 'HeartPulse'),
  ('Dom', 'expense', 'Home'),
  ('Odzież', 'expense', 'Shirt'),
  ('Inne wydatki', 'expense', 'MoreHorizontal'),
  ('Wynagrodzenie', 'income', 'Banknote'),
  ('Zwrot', 'income', 'Undo2'),
  ('Inne przychody', 'income', 'PlusCircle')
) as v(name, kind, icon)
where not exists (
  select 1 from budget_categories bc
  where bc.is_default and bc.name = v.name and bc.kind = v.kind
);
