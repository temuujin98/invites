-- 0012: migrate existing templates to the section model
--
-- Every existing template gets a sensible default section stack + theme so the
-- section-based editor / create flow / public page work on real data. Field
-- content is NOT migrated (the old absolute-canvas fields don't map to section
-- content 1:1); admins refine sections in the editor. Templates that already
-- have sections (e.g. created in the new editor) are left untouched.
--
-- Gift section is included only for templates that had a qr field, matching the
-- old design intent.

with tpl as (
  select
    t.id,
    t.slug,
    exists (
      select 1 from public.template_fields tf
      where tf.template_id = t.id and tf.type = 'qr'
    ) as has_qr
  from public.templates t
  where t.sections = '[]'::jsonb or t.sections is null
)
update public.templates t
set
  theme = jsonb_build_object(
    'palette', jsonb_build_object(
      'bg', '#F4F0EA', 'surface', '#FFFFFF', 'text', '#2C1810',
      'accent', '#8B5CF6', 'muted', '#6D6762'
    ),
    'fonts', jsonb_build_object('heading', 'Playfair Display', 'body', 'Roboto'),
    'motion', 'subtle',
    'radius', 'lg'
  ),
  sections = (
    select jsonb_agg(sec order by ord)
    from (
      select 1 as ord, jsonb_build_object(
        'id', gen_random_uuid(), 'type', 'cover', 'order', 1, 'enabled', true,
        'variant', 'centered', 'showScrollHint', true
      ) as sec
      union all
      select 2, jsonb_build_object(
        'id', gen_random_uuid(), 'type', 'countdown', 'order', 2, 'enabled', true,
        'targetSource', 'event_date', 'style', 'digits'
      )
      union all
      select 3, jsonb_build_object(
        'id', gen_random_uuid(), 'type', 'details', 'order', 3, 'enabled', true,
        'layout', 'cards', 'showCalendarButton', true
      )
      union all
      select 4, jsonb_build_object(
        'id', gen_random_uuid(), 'type', 'gallery', 'order', 4, 'enabled', true,
        'columns', 3, 'aspect', 'square', 'maxImages', 9
      )
      union all
      select 5, jsonb_build_object(
        'id', gen_random_uuid(), 'type', 'rsvp', 'order', 5, 'enabled', true,
        'allowGuestCount', true, 'allowNote', true
      )
      union all
      -- gift only when the template had a qr field
      select 6, jsonb_build_object(
        'id', gen_random_uuid(), 'type', 'gift', 'order', 6, 'enabled', true,
        'showBank', true, 'showQr', tpl.has_qr
      )
      where tpl.has_qr
      union all
      select 7, jsonb_build_object(
        'id', gen_random_uuid(), 'type', 'closing',
        'order', case when tpl.has_qr then 7 else 6 end, 'enabled', true,
        'variant', 'signature'
      )
    ) parts
  )
from tpl
where t.id = tpl.id;
