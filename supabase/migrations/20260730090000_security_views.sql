-- Security hardening + view counter.

-- 1) anon could read ALL columns of active invitations (incl. owner_email).
--    Switch anon to a column-level grant that excludes owner data.
revoke select on public.invitations from anon;
grant select (id, slug, title, event_type, event_at, venue, message, theme, template_id, options, status, created_at)
  on public.invitations to anon;

-- 2) covers bucket: cap size and restrict to images (anon uploads allowed for the pre-auth flow)
update storage.buckets
set file_size_limit = 4194304,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'covers';

-- 3) view counter: guests bump it through a security-definer RPC only
alter table public.invitations add column if not exists views integer not null default 0;

create or replace function public.increment_views(invite_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.invitations set views = views + 1
  where slug = invite_slug and status = 'active';
$$;

revoke all on function public.increment_views(text) from public;
grant execute on function public.increment_views(text) to anon, authenticated;
