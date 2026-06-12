-- 0007: storage buckets + access policies

-- ── Create buckets ────────────────────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('template-backgrounds', 'template-backgrounds', true,  62914560, array['image/jpeg','image/png','image/webp','video/mp4']),
  ('template-thumbnails',  'template-thumbnails',  true,  8388608,  array['image/jpeg','image/png','image/webp']),
  ('user-uploads',         'user-uploads',         true,  8388608,  array['image/jpeg','image/png','image/webp']),
  ('rendered-invites',     'rendered-invites',     true,  62914560, array['image/jpeg','image/png','image/webp','video/mp4'])
on conflict (id) do nothing;

-- ── template-backgrounds: public read, admin write ────────────────────────────
create policy "template-backgrounds: public read"
  on storage.objects for select
  using (bucket_id = 'template-backgrounds');

create policy "template-backgrounds: admin insert"
  on storage.objects for insert
  with check (bucket_id = 'template-backgrounds' and public.is_admin());

create policy "template-backgrounds: admin update"
  on storage.objects for update
  using (bucket_id = 'template-backgrounds' and public.is_admin())
  with check (bucket_id = 'template-backgrounds' and public.is_admin());

create policy "template-backgrounds: admin delete"
  on storage.objects for delete
  using (bucket_id = 'template-backgrounds' and public.is_admin());

-- ── template-thumbnails: public read, admin write ─────────────────────────────
create policy "template-thumbnails: public read"
  on storage.objects for select
  using (bucket_id = 'template-thumbnails');

create policy "template-thumbnails: admin insert"
  on storage.objects for insert
  with check (bucket_id = 'template-thumbnails' and public.is_admin());

create policy "template-thumbnails: admin update"
  on storage.objects for update
  using (bucket_id = 'template-thumbnails' and public.is_admin())
  with check (bucket_id = 'template-thumbnails' and public.is_admin());

create policy "template-thumbnails: admin delete"
  on storage.objects for delete
  using (bucket_id = 'template-thumbnails' and public.is_admin());

-- ── user-uploads: public read, owner write (path-scoped to userId) ────────────
-- Path must begin with the authenticated user's UUID: {userId}/...
create policy "user-uploads: public read"
  on storage.objects for select
  using (bucket_id = 'user-uploads');

create policy "user-uploads: owner insert"
  on storage.objects for insert
  with check (
    bucket_id = 'user-uploads'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "user-uploads: owner update"
  on storage.objects for update
  using (
    bucket_id = 'user-uploads'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'user-uploads'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "user-uploads: owner delete"
  on storage.objects for delete
  using (
    bucket_id = 'user-uploads'
    and auth.uid() is not null
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- ── rendered-invites: public read, server write only (service role, Phase 9) ──
create policy "rendered-invites: public read"
  on storage.objects for select
  using (bucket_id = 'rendered-invites');

-- No client-side write policy — service role bypasses RLS for server writes
