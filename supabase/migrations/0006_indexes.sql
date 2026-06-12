-- 0006: all performance indexes

create index on public.invites (user_id);
create index on public.invites (share_slug);
create index on public.invites (status);
create index on public.guests (invite_id);
create index on public.guests (token);
create index on public.rsvps (invite_id);
create index on public.delivery_logs (invite_id);
create index on public.delivery_logs (guest_id);
create index on public.template_fields (template_id);
create index on public.templates (category_id);
create index on public.templates (status);
create index on public.categories (slug);
create index on public.categories (sort_order);
