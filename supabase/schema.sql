-- Mazooq Admin - Supabase schema
-- Run this once in Supabase Dashboard -> SQL Editor -> New query -> Run.

-- Products: full product object stored as JSONB (flexible, no migrations needed for new fields).
-- Phase 3: data may include a `retailerPricing` array of tiers:
--   [{ minQty: 10, maxQty: 24, pricePerUnit: 275 }, { minQty: 25, maxQty: 49, pricePerUnit: 245 }, ...]
-- Missing retailerPricing => no wholesale pricing (retailers pay regular variant price).
create table if not exists products (
  id text primary key,
  data jsonb not null,
  sort_index integer not null default 0,
  is_hidden boolean not null default false,
  updated_at timestamptz not null default now()
);

-- Orders: captured from the website (Razorpay payments + Cash on Delivery).
-- Phase 3 additions:
--   user_id   - reference to the user who placed the order (NULL for guest checkout).
--   order_role - 'CUSTOMER' | 'RETAILER' (so admins can segment retailer orders).
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  receipt text,
  type text not null default 'ONLINE_PAYMENT',
  status text not null default 'New',
  customer jsonb,
  items jsonb,
  totals jsonb,
  payment jsonb,
  user_id text,
  order_role text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Retailer leads: B2B applications from the website
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  data jsonb not null,
  created_at timestamptz not null default now()
);

-- Security: enable RLS with NO public policies.
-- Only the server (service_role key) can read/write. The admin panel goes through our own API.
alter table products enable row level security;
alter table orders enable row level security;
alter table leads enable row level security;

-- Indexes for the admin list views
create index if not exists orders_created_at_idx on orders (created_at desc);
create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists orders_role_idx on orders (order_role);
create index if not exists orders_user_id_idx on orders (user_id);

-- Users: customers + retailers (Phase 2). Retailer accounts need admin approval (status).
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  name text,
  phone text,
  role text not null default 'CUSTOMER',   -- CUSTOMER | RETAILER | ADMIN
  status text not null default 'ACTIVE',   -- CUSTOMER: ACTIVE; RETAILER: PENDING | APPROVED | REJECTED | SUSPENDED
  retailer jsonb,                          -- business details for retailer accounts
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Sessions: login tokens (HttpOnly cookie holds the token)
create table if not exists sessions (
  token text primary key,
  user_id uuid not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table users enable row level security;
alter table sessions enable row level security;

create index if not exists sessions_user_idx on sessions (user_id);

-- Phase 3 helper: server-side retailer approval check (used by PostgREST RPC).
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
