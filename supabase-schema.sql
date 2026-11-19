-- Ejecuta este SQL en Supabase: SQL Editor -> New query -> Run
-- Crea las tablas, RLS y el bucket de imágenes.

-- ========== TABLA products ==========
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price integer not null default 0,
  category text not null check (category in ('cosmetica','ropa')),
  size text,
  condition text check (condition in ('nuevo','usado')),
  images text[] default '{}',
  stock integer not null default 0,
  sold boolean not null default false,
  active boolean not null default true,
  featured boolean not null default false,
  original_price integer,
  colors text[],
  whatsapp_message text,
  usage_instructions text,
  created_at timestamptz not null default now()
);

-- ========== TABLA sales ==========
create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete set null,
  buyer_name text,
  buyer_phone text,
  notes text,
  created_at timestamptz not null default now()
);

-- ========== TABLA promotions ==========
create table if not exists public.promotions (
  id uuid primary key default gen_random_uuid(),
  title text,
  image_url text,
  product_id uuid references public.products(id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ========== TABLA reviews ==========
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  author_name text,
  text text not null,
  image_url text,
  created_at timestamptz not null default now()
);

-- ========== RLS ==========
alter table public.products enable row level security;
alter table public.sales enable row level security;
alter table public.promotions enable row level security;

-- Lectura pública de productos activos
create policy "products public read" on public.products
  for select using (active = true);

-- Lectura pública de promociones activas
create policy "promotions public read" on public.promotions
  for select using (active = true);

-- Lectura pública de reseñas
create policy "reviews public read" on public.reviews
  for select using (true);

-- Cualquiera puede escribir reseñas (sin cuenta)
create policy "reviews public insert" on public.reviews
  for insert with check (true);

-- Solo usuarios autenticados (admin) pueden escribir
create policy "products admin write" on public.products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "sales admin all" on public.sales
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

create policy "promotions admin write" on public.promotions
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ========== STORAGE BUCKET ==========
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product images public read" on storage.objects
  for select using (bucket_id = 'product-images');

create policy "product images admin write" on storage.objects
  for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "product images admin update" on storage.objects
  for update using (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "product images admin delete" on storage.objects
  for delete using (bucket_id = 'product-images' and auth.role() = 'authenticated');