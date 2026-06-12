-- 0004: invites and invite_values tables + RLS

-- ── invites ───────────────────────────────────────────────────────────────────
create table public.invites (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  template_id         uuid not null references public.templates(id),
  title               text not null,
  event_date          date,
  status              text not null default 'draft' check (status in ('draft','published','archived')),
  share_slug          text unique,
  is_public           boolean not null default true,
  rendered_image_url  text,
  rendered_video_url  text,
  published_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.invites enable row level security;

-- Owner can read their own invites (all statuses)
create policy "invites: owner read"
  on public.invites for select
  using (auth.uid() = user_id);

-- Owner can insert (user_id must equal their own uid)
create policy "invites: owner insert"
  on public.invites for insert
  with check (auth.uid() = user_id);

-- Owner can update their own invites
create policy "invites: owner update"
  on public.invites for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Owner can delete their own invites
create policy "invites: owner delete"
  on public.invites for delete
  using (auth.uid() = user_id);

-- Admins can read all invites
create policy "invites: admin read all"
  on public.invites for select
  using (public.is_admin());

-- Anon can read published AND archived (is_public=true) so /i/[shareSlug] server component
-- can distinguish "archived" (show Урилга хүчингүй болсон per D10) vs "not found".
-- invite_values public policy stays published-only — archived page renders no content.
create policy "invites: public read published or archived"
  on public.invites for select
  using (status in ('published', 'archived') and is_public = true);

-- Auto-update updated_at
create trigger invites_updated_at
  before update on public.invites
  for each row execute procedure public.set_updated_at();

-- ── invite_values ─────────────────────────────────────────────────────────────
create table public.invite_values (
  invite_id       uuid not null references public.invites(id) on delete cascade,
  field_key       text not null,
  value_text      text,
  value_asset_url text,
  primary key (invite_id, field_key)
);

alter table public.invite_values enable row level security;

-- Owner can read their own invite's values (via invite ownership)
create policy "invite_values: owner read"
  on public.invite_values for select
  using (
    exists (
      select 1 from public.invites i
      where i.id = invite_id and i.user_id = auth.uid()
    )
  );

-- Owner can insert values for their own invites
create policy "invite_values: owner insert"
  on public.invite_values for insert
  with check (
    exists (
      select 1 from public.invites i
      where i.id = invite_id and i.user_id = auth.uid()
    )
  );

-- Owner can update values for their own invites
create policy "invite_values: owner update"
  on public.invite_values for update
  using (
    exists (
      select 1 from public.invites i
      where i.id = invite_id and i.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.invites i
      where i.id = invite_id and i.user_id = auth.uid()
    )
  );

-- Owner can delete values for their own invites
create policy "invite_values: owner delete"
  on public.invite_values for delete
  using (
    exists (
      select 1 from public.invites i
      where i.id = invite_id and i.user_id = auth.uid()
    )
  );

-- Admins can read all invite values
create policy "invite_values: admin read all"
  on public.invite_values for select
  using (public.is_admin());

-- Public can read values of published public invites (for /i/[shareSlug] server component)
create policy "invite_values: public read published"
  on public.invite_values for select
  using (
    exists (
      select 1 from public.invites i
      where i.id = invite_id and i.status = 'published' and i.is_public = true
    )
  );
