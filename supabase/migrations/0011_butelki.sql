-- ============================================================================
-- 0011_butelki.sql
-- "Kaucje" mini-app: a dead-simple bottle counter (1 butelka = 50 groszy)
-- plus a photo gallery of deposit-return coupons ("kaucyjne kupony") from
-- the bottle machine. No history/sessions table on purpose — the user asked
-- for a plain counter, not a ledger; "Opróżnij" just zeroes it.
--
-- bottle_counters: one row per user, holds the current absolute count. The
-- client debounces taps and always sends the absolute value (see
-- lib/butelki/actions.ts setBottleCount) rather than an atomic increment, so
-- a plain upsert is enough here.
--
-- bottle_coupons: one row per uploaded coupon photo. image_path points into
-- the private "butelki-kupony" storage bucket (same shape as
-- 0008_paragony_budzet_etf.sql's "paragony-receipts" bucket).
--
-- Safe to re-run (create table/policy only if missing).
-- ============================================================================

create table if not exists bottle_counters (
  user_id uuid primary key references profiles (id) on delete cascade,
  count integer not null default 0 check (count >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists bottle_coupons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  image_path text not null,
  created_at timestamptz not null default now()
);
create index if not exists bottle_coupons_user_idx on bottle_coupons (user_id);

alter table bottle_counters enable row level security;
alter table bottle_coupons enable row level security;

do $$ begin
  create policy "bottle_counters_own" on bottle_counters for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "bottle_coupons_own" on bottle_coupons for all to authenticated
    using (auth.uid() = user_id) with check (auth.uid() = user_id);
exception when duplicate_object then null; end $$;

-- ----------------------------------------------------------------------------
-- Storage: coupon photos. Private bucket, one folder per user.
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('butelki-kupony', 'butelki-kupony', false)
on conflict (id) do nothing;

do $$ begin
  create policy "butelki_kupony_storage_own" on storage.objects for all to authenticated
    using (bucket_id = 'butelki-kupony' and (storage.foldername(name))[1] = auth.uid()::text)
    with check (bucket_id = 'butelki-kupony' and (storage.foldername(name))[1] = auth.uid()::text);
exception when duplicate_object then null; end $$;
