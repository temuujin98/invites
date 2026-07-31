import { supabase } from './supabase'
import { getTemplate, loadDraft, clearDraft, makeSlug, INTRO_PRICE } from '../templates'
import { buildMusic } from './music'

/* keep only known option keys, drop empty values and blank program rows */
export function sanitizeExtras(extras) {
  const source = extras || {}
  const program = (source.program || [])
    .map((row) => ({ time: (row.time || '').trim(), activity: (row.activity || '').trim() }))
    .filter((row) => row.time || row.activity)
  const clean = {}
  const gallery = (source.gallery || []).filter(Boolean).slice(0, 8)
  if (gallery.length) clean.gallery = gallery
  // only http(s) links — blocks javascript: and other schemes
  if (/^https?:\/\//i.test(source.mapUrl?.trim() || '')) clean.mapUrl = source.mapUrl.trim()
  if (program.length) clean.program = program
  if (source.note?.trim()) clean.note = source.note.trim()
  if (source.phone?.trim()) clean.phone = source.phone.trim()
  if (source.bankNumber?.trim()) {
    clean.bank = {
      bank: source.bankName || '',
      number: source.bankNumber.trim(),
      holder: (source.bankHolder || '').trim(),
    }
  }
  if (source.intro === 'curtain') {
    clean.intro = 'curtain'
    clean.introColor = source.introColor || 'violet'
  }
  const music = buildMusic(source)
  if (music) clean.music = music
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
