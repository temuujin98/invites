/* Wedding-template field helpers: form fields ⇄ the stored options.wedding object. */

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

/*
 * Builds the stored wedding object from the raw form fields.
 * Returns null when the host filled in nothing, so `options` stays clean.
 */
export function buildWedding(source = {}) {
  const wedding = {}
  const text = {
    groom: source.weddingGroom,
    bride: source.weddingBride,
    groomParents: source.weddingGroomParents,
    brideParents: source.weddingBrideParents,
    ceremonyVenue: source.weddingCeremonyVenue,
    dressCode: source.weddingDressCode,
  }
  for (const [key, value] of Object.entries(text)) {
    const trimmed = (value || '').trim()
    if (trimmed) wedding[key] = trimmed
  }
  const ceremonyAt = toIso(source.weddingCeremonyAt)
  if (ceremonyAt) wedding.ceremonyAt = ceremonyAt
  return Object.keys(wedding).length ? wedding : null
}

/* stored wedding object → raw form fields (for the edit page) */
export function weddingToFields(wedding) {
  const source = wedding || {}
  return {
    weddingGroom: source.groom || '',
    weddingBride: source.bride || '',
    weddingGroomParents: source.groomParents || '',
    weddingBrideParents: source.brideParents || '',
    weddingCeremonyAt: toLocalInput(source.ceremonyAt),
    weddingCeremonyVenue: source.ceremonyVenue || '',
    weddingDressCode: source.dressCode || '',
  }
}
