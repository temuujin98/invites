-- 0005: guests, rsvps, delivery_logs tables + RLS (Phase G tables)

-- ── guests ────────────────────────────────────────────────────────────────────
create table public.guests (
  id              uuid primary key default gen_random_uuid(),
  invite_id       uuid not null references public.invites(id) on delete cascade,
  name            text not null,
  email           text,
  phone           text,
  token           text not null unique,
  rsvp_status     text not null default 'pending'
                  check (rsvp_status in ('pending','accepted','declined','maybe')),
  delivery_status text not null default 'not_sent'
                  check (delivery_status in ('not_sent','sending','sent','failed')),
  notes           text,
  created_at      timestamptz not null default now()
);

alter table public.guests enable row level security;

-- Owner can read guests for their own invites
create policy "guests: owner read"
  on public.guests for select
  using (
    exists (
      select 1 from public.invites i
      where i.id = invite_id and i.user_id = auth.uid()
    )
  );

-- Owner can insert guests for their own invites
create policy "guests: owner insert"
  on public.guests for insert
  with check (
    exists (
      select 1 from public.invites i
      where i.id = invite_id and i.user_id = auth.uid()
    )
  );

-- Owner can update guests for their own invites
create policy "guests: owner update"
  on public.guests for update
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

-- Owner can delete guests for their own invites
create policy "guests: owner delete"
  on public.guests for delete
  using (
    exists (
      select 1 from public.invites i
      where i.id = invite_id and i.user_id = auth.uid()
    )
  );

-- Admins can read all guests
create policy "guests: admin read"
  on public.guests for select
  using (public.is_admin());

-- ── rsvps ─────────────────────────────────────────────────────────────────────
create table public.rsvps (
  id          uuid primary key default gen_random_uuid(),
  invite_id   uuid not null references public.invites(id) on delete cascade,
  guest_id    uuid references public.guests(id) on delete set null,
  name        text not null,
  attending   text not null check (attending in ('accepted','declined','maybe')),
  guest_count int not null default 1 check (guest_count >= 1 and guest_count <= 20),
  note        text,
  created_at  timestamptz not null default now()
);

alter table public.rsvps enable row level security;

-- Public RSVP insert is NOT allowed via RLS — the /api/rsvp route handler
-- uses the service-role client to insert after rate-limit + Zod validation.
-- Anon users cannot directly insert into this table.

-- Owner can read RSVPs for their own invites
create policy "rsvps: owner read"
  on public.rsvps for select
  using (
    exists (
      select 1 from public.invites i
      where i.id = invite_id and i.user_id = auth.uid()
    )
  );

-- Admins can read all RSVPs
create policy "rsvps: admin read"
  on public.rsvps for select
  using (public.is_admin());

-- ── delivery_logs ─────────────────────────────────────────────────────────────
create table public.delivery_logs (
  id                  uuid primary key default gen_random_uuid(),
  guest_id            uuid not null references public.guests(id) on delete cascade,
  invite_id           uuid not null references public.invites(id) on delete cascade,
  provider            text not null default 'resend',
  status              text not null check (status in ('sending','sent','failed')),
  provider_message_id text,
  error_message       text,
  sent_at             timestamptz not null default now()
);

alter table public.delivery_logs enable row level security;

-- Owner can read delivery logs for their own invites
create policy "delivery_logs: owner read"
  on public.delivery_logs for select
  using (
    exists (
      select 1 from public.invites i
      where i.id = invite_id and i.user_id = auth.uid()
    )
  );

-- Admins can read all delivery logs
create policy "delivery_logs: admin read"
  on public.delivery_logs for select
  using (public.is_admin());

-- No direct client write to delivery_logs — service role only (Phase G send API)
