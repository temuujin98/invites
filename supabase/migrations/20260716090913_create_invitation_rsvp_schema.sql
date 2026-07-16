create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique check (slug ~ '^[a-z0-9-]{4,80}$'),
  title text not null check (char_length(title) between 1 and 120),
  event_type text not null default 'event' check (char_length(event_type) between 1 and 40),
  event_at timestamptz,
  venue text,
  message text,
  theme text not null default 'luxe-violet',
  status text not null default 'draft' check (status in ('draft', 'active', 'paused', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.rsvps (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  guest_name text,
  response text not null check (response in ('attending', 'declined')),
  party_size smallint not null default 1 check (party_size between 1 and 10),
  created_at timestamptz not null default now()
);

create index invitations_owner_id_idx on public.invitations(owner_id);
create index rsvps_invitation_id_idx on public.rsvps(invitation_id);

alter table public.invitations enable row level security;
alter table public.rsvps enable row level security;

grant select on public.invitations to anon, authenticated;
grant insert on public.rsvps to anon, authenticated;
grant select on public.rsvps to authenticated;

create policy "owners can manage their invitations"
on public.invitations for all
to authenticated
using ((select auth.uid()) = owner_id)
with check ((select auth.uid()) = owner_id);

create policy "public can read active invitations"
on public.invitations for select
to anon, authenticated
using (status = 'active');

create policy "owners can read invitation rsvps"
on public.rsvps for select
to authenticated
using (
  exists (
    select 1 from public.invitations
    where invitations.id = rsvps.invitation_id
      and invitations.owner_id = (select auth.uid())
  )
);

create policy "public can submit rsvp for active invitations"
on public.rsvps for insert
to anon, authenticated
with check (
  exists (
    select 1 from public.invitations
    where invitations.id = rsvps.invitation_id
      and invitations.status = 'active'
  )
);