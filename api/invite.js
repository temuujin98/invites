/*
 * Serves /i/:slug with per-invitation OG meta injected into the SPA shell,
 * so shared links preview with the invitation's own title and details.
 * Humans get the exact same SPA — only the <head> differs.
 */
export default async function handler(req, res) {
  const slug = (req.query.slug || '').toString()
  const host = req.headers['x-forwarded-host'] || req.headers.host
  const base = `https://${host}`

  let html = ''
  try {
    const shell = await fetch(`${base}/index.html`)
    html = await shell.text()
  } catch {
    res.status(500).send('shell unavailable')
    return
  }

  try {
    const url = process.env.VITE_SUPABASE_URL
    const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
    if (url && key && slug) {
      const query = `${url}/rest/v1/invitations?slug=eq.${encodeURIComponent(slug)}&status=eq.active&select=title,event_type,event_at,venue&limit=1`
      const response = await fetch(query, { headers: { apikey: key, Authorization: `Bearer ${key}` } })
      const [invitation] = await response.json()
      if (invitation) {
        const esc = (value) => String(value || '')
          .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
        const title = `${esc(invitation.title)} — ${esc(invitation.event_type)} урилга`
        const dateText = invitation.event_at
          ? new Date(invitation.event_at).toISOString().slice(0, 10).replace(/-/g, '.')
          : ''
        const description = [dateText, invitation.venue].filter(Boolean).map(esc).join(' · ')
          || 'Таныг урьж байна — дэлгэрэнгүйг үзээрэй.'
        html = html
          .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
          .replace(/(property="og:title" content=")[^"]*(")/, `$1${title}$2`)
          .replace(/(property="og:description" content=")[^"]*(")/, `$1${description}$2`)
          .replace(/(name="twitter:title" content=")[^"]*(")/, `$1${title}$2`)
          .replace(/(name="twitter:description" content=")[^"]*(")/, `$1${description}$2`)
          .replace(/(property="og:url" content=")[^"]*(")/, `$1${base}/i/${esc(slug)}$2`)
          .replace(/(name="description" content=")[^"]*(")/, `$1${description}$2`)
      }
    }
  } catch {
    // fall through: serve the untouched shell
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300')
  res.status(200).send(html)
}
