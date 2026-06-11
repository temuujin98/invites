# 05 — Data Model

D1 decision-ы дагуу schema нь **MVP + Phase G хоёуланг** эхнээсээ дэмжинэ. Claude Code эндээс гадуур field зохиохгүй; өөрчлөлт хэрэгтэй бол migration санал болгоно.

## Tables

```sql
-- profiles: auth.users-тэй 1:1
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz not null default now()
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  name_mn text not null,
  name_en text,
  slug text not null unique,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  path text not null,
  type text not null check (type in ('image','video')),
  size_bytes bigint not null,
  width int, height int,
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  unique (bucket, path)
);

create table templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category_id uuid not null references categories(id),
  type text not null check (type in ('image','video')),
  bg_asset_id uuid references assets(id),
  thumb_asset_id uuid references assets(id),
  canvas_width int not null default 1080,
  canvas_height int not null default 1920,
  status text not null default 'draft' check (status in ('draft','published')),
  is_pro boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table template_fields (
  id uuid primary key default gen_random_uuid(),
  template_id uuid not null references templates(id) on delete cascade,
  key text not null,
  label text not null,
  placeholder text,
  type text not null check (type in ('text','date','time','location','image','qr','rsvp','custom')),
  required boolean not null default false,
  x int not null, y int not null, width int not null, height int not null,
  font_family text, font_size int, font_weight int, line_height numeric,
  max_chars int, color text, align text check (align in ('left','center','right')),
  border_radius int, object_fit text check (object_fit in ('cover','contain')),
  visible boolean not null default true,
  locked boolean not null default false,
  layer_order int not null default 0,
  unique (template_id, key)
);

create table invites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  template_id uuid not null references templates(id),
  title text not null,
  -- listing/sorting-д зориулсан denormalized талбарууд:
  event_date date,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  share_slug text unique,
  is_public boolean not null default true,
  rendered_image_url text,
  rendered_video_url text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table invite_values (
  invite_id uuid not null references invites(id) on delete cascade,
  field_key text not null,
  value_text text,
  value_asset_url text,
  primary key (invite_id, field_key)
);

-- Phase G --------------------------------------------------------

create table guests (
  id uuid primary key default gen_random_uuid(),
  invite_id uuid not null references invites(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  token text not null unique,        -- crypto-random, >=24 URL-safe chars
  rsvp_status text not null default 'pending'
    check (rsvp_status in ('pending','accepted','declined','maybe')),
  delivery_status text not null default 'not_sent'
    check (delivery_status in ('not_sent','sending','sent','failed')),
  notes text,
  created_at timestamptz not null default now()
);

create table rsvps (
  id uuid primary key default gen_random_uuid(),
  invite_id uuid not null references invites(id) on delete cascade,
  guest_id uuid references guests(id) on delete set null,  -- null = anonymous public RSVP
  name text not null,
  attending text not null check (attending in ('accepted','declined','maybe')),
  guest_count int not null default 1,
  note text,
  created_at timestamptz not null default now()
);

create table delivery_logs (
  id uuid primary key default gen_random_uuid(),
  guest_id uuid not null references guests(id) on delete cascade,
  invite_id uuid not null references invites(id) on delete cascade,
  provider text not null default 'resend',
  status text not null check (status in ('sending','sent','failed')),
  provider_message_id text,
  error_message text,
  sent_at timestamptz not null default now()
);
```

Indexes: `invites(user_id)`, `invites(share_slug)`, `guests(invite_id)`, `guests(token)`, `rsvps(invite_id)`, `delivery_logs(invite_id)`, `template_fields(template_id)`.

## RLS plan

RLS бүх table дээр enabled. Үндсэн зарчим:

| Table | Policy |
|---|---|
| profiles | own row read/update; admin read all |
| categories, templates, template_fields, assets | public: `status='published'`/`is_active` read; write — admin only |
| invites, invite_values | owner full CRUD (`user_id = auth.uid()`); admin read all |
| guests | owner full CRUD via invite ownership; admin read |
| rsvps | insert — public (anon) боломжтой, гэхдээ **API route-аар дамжина** (rate limit + Zod); read — invite owner + admin |
| delivery_logs | read — invite owner + admin; write — server only (service role) |

Public invite page нь client-аас шууд table уншихгүй — **server component дотор safe public projection** select хийнэ (template fields + values + invite public fields only; user email, guest list зэргийг хэзээ ч expose хийхгүй).

Admin check helper: `is_admin()` security-definer function (`profiles.role='admin'`).

## Storage buckets

| Bucket | Access | Агуулга |
|---|---|---|
| `template-backgrounds` | public read, admin write | Canva export PNG/JPG/MP4 |
| `template-thumbnails` | public read, admin write | |
| `user-uploads` | public read (rendered урилгад орох тул), owner write, path: `user-uploads/{userId}/...` | User зургууд |
| `rendered-invites` | public read, server write | Phase 9 |

Upload validation: image ≤ 8MB (jpg/png/webp), video ≤ 60MB (mp4). Client + server хоёуланд шалгана.

## Анхаарах migration дүрэм

- Migration файлууд `supabase/migrations/` дотор, нэг логик өөрчлөлт = нэг файл.
- TypeScript types: `supabase gen types typescript` → `types/database.ts`. Гараар бичсэн domain types (`types/template.ts` г.м.) нь generated types дээр map хийгдэнэ.
- Existing RLS assumption эвдэхгүй: policy өөрчлөх бол migration-д тусад нь тэмдэглэж тайлбарлана.
