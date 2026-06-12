-- 0009: Re-declare handle_new_user with explicit search_path = public, ''
-- Supabase security advisor flags functions without a fixed search_path.
-- 0001 already has "set search_path = public" but this idempotent re-apply
-- ensures the live DB matches if it was provisioned before that clause existed.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, ''
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    'user'
  );
  return new;
end;
$$;
