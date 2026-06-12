-- 0003: templates and template_fields tables + RLS

-- ── templates ─────────────────────────────────────────────────────────────────
create table public.templates (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  slug           text not null unique,
  category_id    uuid not null references public.categories(id),
  type           text not null check (type in ('image', 'video')),
  bg_asset_id    uuid references public.assets(id),
  thumb_asset_id uuid references public.assets(id),
  canvas_width   int not null default 1080,
  canvas_height  int not null default 1920,
  status         text not null default 'draft' check (status in ('draft', 'published')),
  is_pro         boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.templates enable row level security;

-- Anyone (including anon) can read published templates
create policy "templates: public read published"
  on public.templates for select
  using (status = 'published');

-- Admins can read all templates (draft + published)
create policy "templates: admin read all"
  on public.templates for select
  using (public.is_admin());

-- Admins can insert
create policy "templates: admin insert"
  on public.templates for insert
  with check (public.is_admin());

-- Admins can update
create policy "templates: admin update"
  on public.templates for update
  using (public.is_admin())
  with check (public.is_admin());

-- Admins can delete
create policy "templates: admin delete"
  on public.templates for delete
  using (public.is_admin());

-- ── template_fields ───────────────────────────────────────────────────────────
create table public.template_fields (
  id            uuid primary key default gen_random_uuid(),
  template_id   uuid not null references public.templates(id) on delete cascade,
  key           text not null,
  label         text not null,
  placeholder   text,
  type          text not null check (type in ('text','date','time','location','image','qr','rsvp','custom')),
  required      boolean not null default false,
  x             int not null,
  y             int not null,
  width         int not null,
  height        int not null,
  font_family   text,
  font_size     int,
  font_weight   int,
  line_height   numeric,
  max_chars     int,
  color         text,
  align         text check (align in ('left','center','right')),
  border_radius int,
  object_fit    text check (object_fit in ('cover','contain')),
  visible       boolean not null default true,
  locked        boolean not null default false,
  layer_order   int not null default 0,
  unique (template_id, key)
);

alter table public.template_fields enable row level security;

-- Anyone can read fields of published templates
create policy "template_fields: public read published"
  on public.template_fields for select
  using (
    exists (
      select 1 from public.templates t
      where t.id = template_id and t.status = 'published'
    )
  );

-- Admins can read all fields
create policy "template_fields: admin read all"
  on public.template_fields for select
  using (public.is_admin());

-- Admins can insert
create policy "template_fields: admin insert"
  on public.template_fields for insert
  with check (public.is_admin());

-- Admins can update
create policy "template_fields: admin update"
  on public.template_fields for update
  using (public.is_admin())
  with check (public.is_admin());

-- Admins can delete
create policy "template_fields: admin delete"
  on public.template_fields for delete
  using (public.is_admin());

-- Auto-update updated_at on templates
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger templates_updated_at
  before update on public.templates
  for each row execute procedure public.set_updated_at();
