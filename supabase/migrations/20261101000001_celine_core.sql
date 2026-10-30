-- CELINE — core schema. Run in the Supabase SQL editor, in file order.
-- No passwords, no keys, no secrets in this file.
-- Requires the pgcrypto extension for gen_random_uuid().

create extension if not exists pgcrypto;

-- Customer profile, created on sign-up (see conta.html). is_admin is set
-- ONLY by the owner in the SQL editor / dashboard, never from the site.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  whatsapp text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- Products. price_mt null = price to confirm; such products can never be
-- paid online (the payment function refuses them). image_url is set only
-- by a file upload from admin, never by pasting a link in the form.
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null default 'Brincos',
  description text not null default '',
  price_mt integer,
  image_url text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- Single settings row (id = 1). The logo and hero here are also used by
-- the chat header, so an admin logo change takes effect in the chat too.
create table if not exists public.site_settings (
  id integer primary key,
  hero_title text not null default 'CELINE',
  hero_text text not null default 'Peças douradas, usadas com presença. O brilho fica na peça — e em quem a usa.',
  hero_image_url text,
  logo_url text,
  store_text text not null default 'A CELINE está em Maputo, na loja física e online, em alguns pontos da cidade.',
  whatsapp_group_url text not null default 'https://chat.whatsapp.com/CELINEGrupo',
  group_banner_delay_seconds integer not null default 90,
  group_banner_scroll_percent integer not null default 70,
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status text not null default 'pending_payment'
    check (status in ('pending_payment', 'paid', 'preparing', 'delivered', 'cancelled')),
  payment_method text not null default 'mpesa',
  phone text,
  total_mt integer,
  provider_reference text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id text not null,
  name text not null,
  qty integer not null check (qty > 0),
  unit_price_mt integer not null check (unit_price_mt > 0)
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

-- Chat messages. sender is 'customer' or 'shop'. Receipt messages after a
-- confirmed payment are written by the payment webhook with sender 'shop'.
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender text not null check (sender in ('customer', 'shop')),
  body text,
  file_url text,
  created_at timestamptz not null default now()
);

create index if not exists idx_orders_user on public.orders (user_id, created_at desc);
create index if not exists idx_order_items_order on public.order_items (order_id);
create index if not exists idx_conversations_user on public.conversations (user_id, created_at desc);
create index if not exists idx_messages_conv on public.messages (conversation_id, created_at);
create index if not exists idx_products_sort on public.products (sort_order);
