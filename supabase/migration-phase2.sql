-- Mazooq Phase 2 migration: users & sessions
-- Run this in Supabase -> SQL Editor ONLY IF you already created the original
-- tables (products / orders / leads) before Phase 2.
-- Fresh setups: just run the updated schema.sql instead - it includes everything.

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

create table if not exists sessions (
  token text primary key,
  user_id uuid not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

alter table users enable row level security;
alter table sessions enable row level security;

create index if not exists sessions_user_idx on sessions (user_id);
