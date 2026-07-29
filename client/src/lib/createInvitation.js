import { supabase } from './supabase'
import { getTemplate, loadDraft, clearDraft, makeSlug, INTRO_PRICE } from '../templates'

/* keep only known option keys, drop empty values and blank program rows */
export function sanitizeExtras(extras) {
  const source = extras || {}
  const program = (source.program || [])
    .map((row) => ({ time: (row.time || '').trim(), activity: (row.activity || '').trim() }))
    .filter((row) => row.time || row.activity)
  const clean = {}
  if (source.coverUrl) clean.coverUrl = source.coverUrl
  if (source.mapUrl?.trim()) clean.mapUrl = source.mapUrl.trim()
  if (program.length) clean.program = program
  if (source.note?.trim()) clean.note = source.note.trim()
  if (source.phone?.trim()) clean.phone = source.phone.trim()
  if (source.bank?.trim()) clean.bank = source.bank.trim()
  if (source.intro === 'curtain') clean.intro = 'curtain'
  return clean
}

/*
 * Inserts the locally saved draft as a pending_payment invitation for the
 * signed-in user and returns { id } or { error }.
 */
export async function insertDraftInvitation(session) {
  const draft = loadDraft()
  const template = draft ? getTemplate(draft.templateId) : null
  if (!draft || !template || !draft.values?.title) return { error: 'no-draft' }
  const values = draft.values
  const options = sanitizeExtras(draft.extras)
  const { data, error } = await supabase.from('invitations').insert({
    owner_id: session.user.id,
    owner_email: session.user.email,
    slug: makeSlug(values.title),
    title: values.title,
    event_type: template.eventType,
    event_at: values.eventAt ? new Date(values.eventAt).toISOString() : null,
    venue: values.venue || null,
    message: values.message || null,
    theme: template.tone,
    template_id: template.id,
    price: template.price + (options.intro ? INTRO_PRICE : 0),
    status: 'pending_payment',
    options,
  }).select('id').single()
  if (error) return { error: 'insert-failed' }
  clearDraft()
  return { id: data.id }
}
