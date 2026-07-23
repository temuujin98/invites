-- Funnel rebuild: template pricing on invitations, payments, admins.

-- invitations: template + pricing + owner email (admin needs it without auth.users access)
alter table public.invitations
  add column if not exists template_id text,
  add column if not exists options jsonb not null default '{}'::jsonb,
  add column if not exists price integer not null default 0 check (price >= 0),
  add column if not exists owner_email text;

alter table public.invitations drop constraint if exists invitations_status_check;
alter table public.invitations
  add constraint invitations_status_check
  check (status in ('draft', 'pending_payment', 'active', 'paused', 'archived'));

-- payments
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  amount integer not null check (amount >= 0),
  method text not null default 'mock' check (method in ('mock', 'bonum')),
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists payments_invitation_id_idx on public.payments(invitation_id);

alter table public.payments enable row level security;
grant select, insert on public.payments to authenticated;

create policy "owners can create payments for their invitations"
on public.payments for insert
to authenticated
with check (
  exists (
    select 1 from public.invitations
    where invitations.id = payments.invitation_id
      and invitations.owner_id = (select auth.uid())
  )
);

create policy "owners can read their payments"
on public.payments for select
to authenticated
using (
  exists (
    select 1 from public.invitations
    where invitations.id = payments.invitation_id
      and invitations.owner_id = (select auth.uid())
  )
);

-- admins
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
grant select on public.admins to authenticated;

create policy "admins can see their own membership"
on public.admins for select
to authenticated
using ((select auth.uid()) = user_id);

-- security definer helper so admin policies avoid RLS recursion
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- admin powers
create policy "admins can manage all invitations"
on public.invitations for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy "admins can read all rsvps"
on public.rsvps for select
to authenticated
using (public.is_admin());

create policy "admins can manage all payments"
on public.payments for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

grant update, delete on public.payments to authenticated;

-- the original schema only granted select; the funnel needs owner writes (RLS still applies)
grant insert, update, delete on public.invitations to authenticated;
