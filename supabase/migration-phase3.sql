-- Mazooq Phase 3 migration: retailer pricing tiers & orderRole/userId on orders
-- Run this in Supabase -> SQL Editor IF you already created the original
-- tables (products / orders / leads / users / sessions) before Phase 3.
-- Fresh setups: just run the updated schema.sql instead - it includes everything.
--
-- Phase 3 additions:
--   1. `orders.user_id`     - optional reference to the user who placed the order
--   2. `orders.order_role`  - 'CUSTOMER' | 'RETAILER' (audit / segmentation)
--   3. `products.data` JSONB - now may contain a `retailerPricing` array of
--      { minQty, maxQty, pricePerUnit } tiers. No schema change required
--      (still JSONB), but documented here so future migrations don't drop it.
--
-- The new fields are NULL-safe: existing orders/products continue to work.

-- 1. Add user_id + order_role columns to orders (idempotent)
alter table orders add column if not exists user_id text;
alter table orders add column if not exists order_role text;
alter table orders add column if not exists updated_at timestamptz not null default now();

-- Optional index for retailer-only order queries
create index if not exists orders_role_idx on orders (order_role);
create index if not exists orders_user_id_idx on orders (user_id);

-- 2. Document the products.data JSONB shape (informational only).
--    A Phase 3 product's `data` field may contain:
--      retailerPricing: [
--        { minQty: 10,  maxQty: 24,  pricePerUnit: 275 },
--        { minQty: 25,  maxQty: 49,  pricePerUnit: 245 },
--        { minQty: 50,  maxQty: null, pricePerUnit: 215 }
--      ]
--    Missing retailerPricing means "no wholesale pricing" - retailers fall back
--    to the regular variant price.
comment on column products.data is 'JSONB product object. Phase 3 adds optional retailerPricing tiers (array of {minQty, maxQty|null, pricePerUnit}).';

-- 3. Add a retailer-status check function (returns true only for APPROVED retailers).
--    Useful for server-side logic via PostgREST RPC if you ever need it.
create or replace function is_approved_retailer(p_email text)
returns boolean
language sql
security definer
as $$
  select exists (
    select 1 from users
    where email = p_email
      and role = 'RETAILER'
      and status = 'APPROVED'
  );
$$;
