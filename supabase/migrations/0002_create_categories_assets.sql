-- 0002: categories and assets tables + RLS

-- ── categories ────────────────────────────────────────────────────────────────
create table public.categories (
  id          uuid primary key default gen_random_uuid(),
  name_mn     text not null,
  name_en     text,
  slug        text not null unique,
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.categories enable row level security;

-- Anyone (including anon) can read active categories
create policy "categories: public read active"
  on public.categories for select
  using (is_active = true);

-- Admins can read all (including inactive)
create policy "categories: admin read all"
  on public.categories for select
  using (public.is_admin());

-- Admins can insert
create policy "categories: admin insert"
  on public.categories for insert
  with check (public.is_admin());

-- Admins can update
create policy "categories: admin update"
  on public.categories for update
  using (public.is_admin())
  with check (public.is_admin());

-- Admins can delete
create policy "categories: admin delete"
  on public.categories for delete
  using (public.is_admin());

-- ── assets ────────────────────────────────────────────────────────────────────
create table public.assets (
  id           uuid primary key default gen_random_uuid(),
  bucket       text not null,
  path         text not null,
  type         text not null check (type in ('image', 'video')),
  size_bytes   bigint not null,
  width        int,
  height       int,
  created_by   uuid references public.profiles(id),
  created_at   timestamptz not null default now(),
  unique (bucket, path)
);

alter table public.assets enable row level security;

-- Anyone can read assets (they back public template backgrounds/thumbnails)
create policy "assets: public read"
  on public.assets for select
  using (true);

-- Admins can insert assets
create policy "assets: admin insert"
  on public.assets for insert
  with check (public.is_admin());

-- Admins can update assets
create policy "assets: admin update"
  on public.assets for update
  using (public.is_admin())
  with check (public.is_admin());

-- Admins can delete assets
create policy "assets: admin delete"
  on public.assets for delete
  using (public.is_admin());
