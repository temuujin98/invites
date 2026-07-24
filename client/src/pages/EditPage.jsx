
import { useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { FunnelHeader, InvitePreview } from '../components/Shared'

/*
 * Edit an existing invitation. The share link (slug) never changes, so
 * guests always see the latest details.
 */
export default function EditPage({ invitationId }) {
  const [invitation, setInvitation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [checked, setChecked] = useState(false)
  const [title, setTitle] = useState('')
  const [eventAt, setEventAt] = useState('')
  const [venue, setVenue] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  useEffect(() => {
    if (!supabase) return undefined
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setChecked(true) })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    supabase
      .from('invitations')
      .select('*')
      .eq('id', invitationId)
      .maybeSingle()
      .then(({ data, error: requestError }) => {
        if (requestError || !data) setError('Урилга олдсонгүй. Зөв имэйлээр нэвтэрсэн эсэхээ шалгана уу.')
        else {
          setInvitation(data)
          setTitle(data.title)
          setEventAt(data.event_at ? toLocalInputValue(data.event_at) : '')
          setVenue(data.venue || '')
          setMessage(data.message || '')
        }
        setLoading(false)
      })
  }, [session, invitationId])

  function toLocalInputValue(iso) {
    const date = new Date(iso)
    const pad = (part) => String(part).padStart(2, '0')
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
  }

  async function save(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    setSaved(false)
    const { error: updateError } = await supabase
      .from('invitations')
      .update({
        title: title.trim(),
        event_at: eventAt ? new Date(eventAt).toISOString() : null,
        venue: venue.trim() || null,
        message: message.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', invitationId)
    setBusy(false)
    if (updateError) { setError('Хадгалахад алдаа гарлаа. Дахин оролдоно уу.'); return }
    setSaved(true)
  }

  async function sendLink(event) {
    event.preventDefault()
    setBusy(true)
    const { error: sendError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/edit/${invitationId}` },
    })
    setBusy(false)
    if (sendError) setError('Илгээхэд алдаа гарлаа. Дахин оролдоно уу.')
    else setSent(true)
  }

  if (!isSupabaseConfigured) {
    return <main className="kpage funnel-page"><FunnelHeader /><header className="funnel-head"><h1>Тохиргоо дутуу</h1></header></main>
  }

  if (!checked) {
    return <main className="kpage funnel-page"><FunnelHeader /><section className="kpanel-center"><p className="kpanel-note">Ачаалж байна…</p></section></main>
  }

  if (!session) {
    return (
      <main className="kpage funnel-page">
        <FunnelHeader label="НЭВТРЭХ" />
        <section className="kpanel-center">
          <div className="kpanel">
            <p className="kpanel-kicker">УРИЛГА ЗАСАХ</p>
            <h1>Имэйлээрээ нэвтэрнэ үү</h1>
            {sent ? (
              <p className="kpanel-note">Холбоос илгээгдлээ — <b>{email}</b> хаягаа шалгана уу.</p>
            ) : (
              <form className="kform" onSubmit={sendLink}>
                <label>Имэйл хаяг
                  <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tanii@gmail.com" />
                </label>
                {error && <p className="kerror">{error}</p>}
                <button className="kbutton" disabled={busy} type="submit">{busy ? 'Илгээж байна…' : 'Нэвтрэх холбоос илгээх'}</button>
              </form>
            )}
          </div>
        </section>
      </main>
    )
  }

  if (loading) {
    return <main className="kpage funnel-page"><FunnelHeader /><section className="kpanel-center"><p className="kpanel-note">Ачаалж байна…</p></section></main>
  }

  if (!invitation) {
    return (
      <main className="kpage funnel-page">
        <FunnelHeader />
        <section className="kpanel-center">
          <div className="kpanel"><h1>Урилга олдсонгүй</h1><p className="kpanel-copy">{error} <a className="klink" href="/my">Миний урилгууд →</a></p></div>
        </section>
      </main>
    )
  }

  const previewDate = eventAt
    ? new Intl.DateTimeFormat('mn-MN', { dateStyle: 'medium' }).format(new Date(eventAt))
    : 'Огноо тохируулаагүй'

  return (
    <main className="kpage funnel-page">
      <FunnelHeader label="УРИЛГА ЗАСАХ" />
      <header className="funnel-head">
        <h1>Урилгаа засах</h1>
        <p className="funnel-lead">Холбоос хэвээрээ — хадгалмагц зочдод хамгийн сүүлийн мэдээлэл харагдана.</p>
      </header>
      <section className="editor-grid">
        <form className="kform" onSubmit={save}>
          <label>Арга хэмжээний нэр
            <input required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
          <label>Огноо ба цаг
            <input type="datetime-local" required value={eventAt} onChange={(event) => setEventAt(event.target.value)} />
          </label>
          <label>Байршил
            <input required maxLength={160} value={venue} onChange={(event) => setVenue(event.target.value)} />
          </label>
          <label>Урилгын мессеж
            <textarea maxLength={400} value={message} onChange={(event) => setMessage(event.target.value)} />
          </label>
          {error && <p className="kerror">{error}</p>}
          {saved && <p className="kpanel-note">✓ Хадгалагдлаа — зочдод шинэ мэдээлэл харагдана</p>}
          <div className="kform-actions">
            <a className="klink" href="/my">← Миний урилгууд</a>
            <button className="kbutton" disabled={busy} type="submit">{busy ? 'Хадгалж байна…' : 'Хадгалах'}</button>
          </div>
        </form>
        <div className="editor-preview-panel">
          <p>ШУУД ХАРАГДАЦ</p>
          <InvitePreview
            tone={invitation.theme}
            eventType={invitation.event_type}
            title={title || invitation.title}
            dateText={venue ? `${previewDate} · ${venue}` : previewDate}
            big
          />
        </div>
      </section>
    </main>
  )
}
