-- 0010: fix prevent_role_self_promotion — allow when auth.uid() IS NULL
-- auth.uid() is NULL for direct DB access (SQL Editor, service role, postgres
-- superuser). In that context RLS is bypassed anyway, so this trigger's guard
-- is meaningless — and blocking it prevents appointing the first admin.
-- Keep blocking only when a real authed non-admin API user tries to self-promote.

create or replace function public.prevent_role_self_promotion()
returns trigger
language plpgsql
security definer
set search_path = public, ''
as $$
begin
  -- NULL uid = direct DB / service-role access: let it through
  if auth.uid() is null then
    return new;
  end if;
  if new.role <> old.role and not public.is_admin() then
    raise exception 'Unauthorized: cannot change own role';
  end if;
  return new;
end;
$$;
