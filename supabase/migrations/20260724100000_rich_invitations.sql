-- Rich invitations: RSVP contact + wish, cover photo storage.

alter table public.rsvps
  add column if not exists guest_phone text,
  add column if not exists wish text;

-- covers bucket (public read)
insert into storage.buckets (id, name, public)
values ('covers', 'covers', true)
on conflict (id) do nothing;

drop policy if exists "anyone can upload covers" on storage.objects;
create policy "anyone can upload covers"
on storage.objects for insert
to anon, authenticated
with check (bucket_id = 'covers');

drop policy if exists "public can view covers" on storage.objects;
create policy "public can view covers"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'covers');
