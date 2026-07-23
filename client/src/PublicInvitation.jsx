/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { ArrowLeft, CalendarDays, MapPin, User, Users } from 'lucide-react'
import { isSupabaseConfigured, supabase } from './lib/supabase'
import { formatEventDate } from './templates'

export default function PublicInvitation() {
  const [response, setResponse] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [partySize, setPartySize] = useState(1)
  const [invitation, setInvitation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const slug = window.location.pathname.split('/').filter(Boolean).at(-1)

  useEffect(() => {
    if (!supabase || !slug) { setLoading(false); return undefined }
    let alive = true
    supabase
      .from('invitations')
      .select('id, event_type, title, message, event_at, venue, theme')
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle()
      .then(({ data, error: requestError }) => {
        if (!alive) return
        if (requestError || !data) setError('Энэ урилга олдсонгүй эсвэл идэвхгүй байна')
        else setInvitation(data)
        setLoading(false)
      })
    return () => { alive = false }
  }, [slug])

  async function submitRsvp() {
    if (!response) return
    setError('')
    const { error: submitError } = await supabase.from('rsvps').insert({
      invitation_id: invitation.id,
      guest_name: guestName.trim() || null,
      response: response === 'yes' ? 'attending' : 'declined',
      party_size: partySize,
    })
    if (submitError) setError('Хариу илгээж чадсангүй. Дахин оролдоно уу')
    else setSubmitted(true)
  }

  if (!isSupabaseConfigured) {
    return <main className="public-invite"><p>Тохиргоо дутуу байна.</p></main>
  }

  if (loading) {
    return <main className="public-invite"><a className="public-brand" href="/"><img src="/brand/invites.mn/logo-wordmark-light.png" alt="INVITES.MN" /></a><p style={{ marginTop: 60 }}>Урилгыг ачаалж байна…</p></main>
  }

  if (!invitation) {
    return (
      <main className="public-invite">
        <a className="public-brand" href="/"><img src="/brand/invites.mn/logo-wordmark-light.png" alt="INVITES.MN" /></a>
        <section className="public-card"><h1 style={{ fontSize: '2rem', letterSpacing: 0 }}>{error || 'Урилга олдсонгүй'}</h1></section>
        <a className="public-back" href="/"><ArrowLeft size={15} /> Invites.mn</a>
      </main>
    )
  }

  return (
    <main className="public-invite">
      <a className="public-brand" href="/"><img src="/brand/invites.mn/logo-wordmark-light.png" alt="INVITES.MN" /></a>
      <section className={`public-card ${invitation.theme || 'lavender'}`}>
        <p className="public-type">{invitation.event_type}</p>
        <h1>{invitation.title}</h1>
        {invitation.message && <p className="public-message">{invitation.message}</p>}
        <div className="event-facts">
          <p><CalendarDays size={18} /><span>{formatEventDate(invitation.event_at)}</span></p>
          <p><MapPin size={18} /><span>{invitation.venue || 'Байршил удахгүй зарлагдана'}</span></p>
        </div>
      </section>
      <section className="rsvp">
        <p className="public-type">RSVP</p>
        <h2>Та ирэх үү</h2>
        {submitted ? (
          <div className="thanks">Баярлалаа<br /><span>Таны хариуг хүлээн авлаа</span></div>
        ) : (
          <>
            <div className="response-buttons">
              <button className={response === 'yes' ? 'selected' : ''} onClick={() => setResponse('yes')}>Тийм</button>
              <button className={response === 'no' ? 'selected' : ''} onClick={() => setResponse('no')}>Харамсалтай нь үгүй</button>
            </div>
            <label><User size={17} /> Таны нэр
              <input type="text" value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="Нэрээ бичнэ үү" maxLength={80} />
            </label>
            {response === 'yes' && (
              <label style={{ marginTop: 10 }}><Users size={17} /> Зочдын тоо
                <select value={partySize} onChange={(event) => setPartySize(Number(event.target.value))}>
                  {[1, 2, 3, 4, 5].map((size) => <option key={size} value={size}>{size}</option>)}
                </select>
              </label>
            )}
            <button className="rsvp-submit" disabled={!response} onClick={submitRsvp}>Хариу илгээх</button>
            {error && <p role="alert">{error}</p>}
          </>
        )}
      </section>
      <a className="public-back" href="/"><ArrowLeft size={15} /> Invites.mn</a>
    </main>
  )
}
