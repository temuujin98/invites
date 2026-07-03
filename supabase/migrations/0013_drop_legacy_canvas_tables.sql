-- 0013: drop the legacy canvas tables
--
-- The section-based model fully replaced the single-canvas-poster model:
--   • templates.sections / templates.theme hold the template structure
--   • invites.content (+ denormalized event_date/time/location) hold user content
--
-- No application code reads template_fields or invite_values anymore (verified:
-- InviteRenderer, GeneratedInviteForm, the create/edit/detail flows, and the ICS
-- route were all migrated to the section model). These tables are now dead.
--
-- SAFE TO APPLY once the section path has run in production for a while. Drop is
-- irreversible; keep the tables until you're confident no rollback is needed.

drop table if exists public.invite_values;
drop table if exists public.template_fields;
