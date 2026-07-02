-- 0011: section-based invitation model (additive, non-breaking)
--
-- Migrates the data model from single-canvas-poster (template_fields with
-- absolute x/y/w/h) toward a section-based scrolling invitation:
--   • templates.sections  — ordered SectionConfig[] as JSONB
--   • templates.theme      — shared InviteTheme as JSONB
--   • invites.content      — user-entered content keyed by section id
--   • invites.event_time / event_location — promote the two values the public
--     page + ICS already special-case, so denormalized sorting/ICS keep working
--
-- Legacy template_fields / invite_values tables are left intact and are dropped
-- in a later cleanup migration (0013) once the section path is proven in prod.

alter table public.templates
  add column if not exists sections jsonb not null default '[]'::jsonb,
  add column if not exists theme    jsonb not null default '{}'::jsonb;

alter table public.invites
  add column if not exists content        jsonb not null default '{}'::jsonb,
  add column if not exists event_time     text,
  add column if not exists event_location text;

-- Canvas dims are no longer required by the section model. Keep the columns
-- (dropped in 0014) but relax NOT NULL so new section templates need not set them.
alter table public.templates
  alter column canvas_width  drop not null,
  alter column canvas_height drop not null;

-- No new RLS policies needed: sections/theme/content are columns on tables that
-- already have row-level policies (templates: public read published / admin write;
-- invites: owner CRUD / admin read).
