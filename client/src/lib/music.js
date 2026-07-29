/* YouTube background-music helpers for invitations. */

export function parseYouTubeId(input) {
  if (!input) return null
  const match = String(input).match(/(?:youtu\.be\/|[?&]v=|shorts\/|embed\/|live\/)([A-Za-z0-9_-]{11})/)
  return match ? match[1] : null
}

/* accepts "90", "1:30" or "01:30" → seconds */
export function parseTimeToSeconds(value) {
  if (value === null || value === undefined) return null
  const text = String(value).trim()
  if (!text) return null
  if (/^\d+$/.test(text)) return Number(text)
  const match = text.match(/^(\d+):([0-5]?\d)$/)
  if (match) return Number(match[1]) * 60 + Number(match[2])
  return null
}

export function formatSeconds(seconds) {
  if (seconds === null || seconds === undefined) return ''
  const pad = (part) => String(part).padStart(2, '0')
  return `${Math.floor(seconds / 60)}:${pad(seconds % 60)}`
}

export const MIN_CLIP_SECONDS = 10

/*
 * Builds the stored music object from the raw form fields.
 * Returns null when no valid video; drops an end time that would make the
 * looped clip shorter than MIN_CLIP_SECONDS.
 */
export function buildMusic({ musicUrl, musicStart, musicEnd }) {
  const id = parseYouTubeId(musicUrl)
  if (!id) return null
  const start = parseTimeToSeconds(musicStart) || 0
  let end = parseTimeToSeconds(musicEnd)
  if (end !== null && end - start < MIN_CLIP_SECONDS) end = null
  const music = { id, url: String(musicUrl).trim(), start }
  if (end !== null) music.end = end
  return music
}

/* stored music object → raw form fields (for the edit page) */
export function musicToFields(music) {
  if (!music?.id) return { musicUrl: '', musicStart: '', musicEnd: '' }
  return {
    musicUrl: music.url || `https://youtu.be/${music.id}`,
    musicStart: music.start ? formatSeconds(music.start) : '',
    musicEnd: music.end !== undefined ? formatSeconds(music.end) : '',
  }
}
