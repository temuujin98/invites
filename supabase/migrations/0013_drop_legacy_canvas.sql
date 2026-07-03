-- 0013: drop all legacy canvas-model DB objects
--
-- The section-based model fully replaced the single-canvas-poster model:
--   • templates.sections / templates.theme hold the template structure
--   • invites.content (+ denormalized event_date/time/location) hold user content
--
-- Verified no application code reads any of these anymore:
--   • template_fields / invite_values tables — 0 code references
--   • templates.canvas_width / canvas_height columns — 0 code references
--     (the create/edit previews use a hardcoded 390×844 PhonePreviewFrame, not
--      these columns)
--
-- Drop is IRREVERSIBLE. Apply only after the section path is proven in production.

drop table if exists public.invite_values;
drop table if exists public.template_fields;

alter table public.templates
  drop column if exists canvas_width,
  drop column if exists canvas_height;
