/*
 * Per-template extra details: form fields ⇄ the stored options.details object.
 *
 * Which of these a template asks for is declared by the template itself
 * (`fields` in templates.js) rather than inferred from its event type —
 * a birthday wants an age, a graduation an honoree, a wedding a couple.
 */

const pad = (part) => String(part).padStart(2, '0')

/* 'YYYY-MM-DDTHH:mm' (DateTimeField) → ISO, or null when unset/invalid */
function toIso(value) {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

/* ISO → 'YYYY-MM-DDTHH:mm' in local time (what DateTimeField expects) */
function toLocalInput(iso) {
  if (!iso) return ''
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/* every detail key the field groups can produce */
export const detailKeys = [
  'groom', 'bride', 'groomParents', 'brideParents', 'father', 'mother',
  'ceremonyVenue', 'dressCode', 'dressAvoid', 'age', 'honoree', 'host',
  'giftNote',
]

/* keys that are not plain trimmed text */
const dateKeys = ['ceremonyAt', 'rsvpBy']
const urlKeys = ['giftUrl']
const listKeys = ['dressColors']

export const emptyDetails = {
  ...Object.fromEntries(detailKeys.map((key) => [key, ''])),
  ...Object.fromEntries(dateKeys.map((key) => [key, ''])),
  ...Object.fromEntries(urlKeys.map((key) => [key, ''])),
  dressColors: [],
}

/*
 * Builds the stored details object from the raw form fields.
 * Returns null when nothing was filled in, so `options` stays clean.
 */
export function buildDetails(source = {}) {
  const details = {}
  for (const key of detailKeys) {
    const trimmed = (source[key] || '').trim()
    if (trimmed) details[key] = trimmed
  }
  for (const key of dateKeys) {
    const iso = toIso(source[key])
    if (iso) details[key] = iso
  }
  for (const key of urlKeys) {
    // only http(s), the same rule mapUrl follows — blocks javascript: and friends
    const value = (source[key] || '').trim()
    if (/^https?:\/\//i.test(value)) details[key] = value
  }
  for (const key of listKeys) {
    const list = (source[key] || []).filter((item) => /^#[0-9a-f]{6}$/i.test(item)).slice(0, 8)
    if (list.length) details[key] = list
  }
  return Object.keys(details).length ? details : null
}

/*
 * Stored details → raw form fields.
 * `options.wedding` is the pre-rename shape; invitations saved under it must
 * keep opening and editing, so it is merged in underneath.
 */
export function detailsToFields(options = {}) {
  const stored = { ...(options.wedding || {}), ...(options.details || {}) }
  const fields = { ...emptyDetails }
  for (const key of detailKeys) fields[key] = stored[key] || ''
  for (const key of dateKeys) fields[key] = toLocalInput(stored[key])
  for (const key of urlKeys) fields[key] = stored[key] || ''
  fields.dressColors = Array.isArray(stored.dressColors) ? stored.dressColors : []
  return fields
}

/* What a layout reads: stored details, legacy shape folded in. */
export function readDetails(options = {}) {
  return { ...(options.wedding || {}), ...(options.details || {}) }
}
