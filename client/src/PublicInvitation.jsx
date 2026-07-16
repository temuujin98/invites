import { useEffect, useState } from 'react'
import { ArrowLeft, CalendarDays, MapPin, Users } from 'lucide-react'
import { isSupabaseConfigured, supabase } from './lib/supabase'

const fallbackInvitation = {
  id: null,
  event_type: 'ХУРИМ',
  title: 'Тэмүүжин × Номин',
  message: 'Бидний дурсамжтай өдрийг хамтдаа тэмдэглэхийг урьж байна',
  event_at: '2026-09-18T18:00:00+08:00',
  venue: 'Улаанбаатар · Тансаг өргөө',
}

function formatEventDate(value) {
  if (!value) return 'Огноо удахгүй зарлагдана'
  return new Intl.DateTimeFormat('mn-MN', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(value))
}

export default function PublicInvitation() {
  const [response, setResponse] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [partySize, setPartySize] = useState(1)
  const [invitation, setInvitation] = useState(fallbackInvitation)
  const [loading, setLoading] = useState(isSupabaseConfigured)
  const [error, setError] = useState('')
  const slug = window.location.pathname.split('/').filter(Boolean).at(-1)

  useEffect(() => {
    if (!supabase || !slug) return undefined
    let alive = true
    supabase
      .from('invitations')
      .select('id, event_type, title, message, event_at, venue')
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
    if (!supabase || !invitation.id) {
      setError('RSVP илгээхийн тулд Supabase publishable key тохируулна уу')
      return
    }
    setError('')
    const { error: submitError } = await supabase.from('rsvps').insert({
      invitation_id: invitation.id,
      response: response === 'yes' ? 'attending' : 'declined',
      party_size: partySize,
    })
    if (submitError) setError('Хариу илгээж чадсангүй. Дахин оролдоно уу')
    else setSubmitted(true)
  }

  return <main className="public-invite"><a className="public-brand" href="/"><img src="/brand/invites.mn/logo-wordmark-light.png" alt="INVITES.MN" /></a><section className="public-card"><p className="public-type">{invitation.event_type}</p><h1>{invitation.title}</h1><p className="public-message">{invitation.message}</p><div className="event-facts"><p><CalendarDays size={18}/><span>{formatEventDate(invitation.event_at)}</span></p><p><MapPin size={18}/><span>{invitation.venue || 'Байршил удахгүй зарлагдана'}</span></p></div></section><section className="rsvp"><p className="public-type">RSVP</p><h2>Та ирэх үү</h2>{loading ? <p>Урилгыг ачаалж байна</p> : submitted ? <div className="thanks">Баярлалаа<br /><span>Таны хариуг хүлээн авлаа</span></div> : <><div className="response-buttons"><button className={response === 'yes' ? 'selected' : ''} onClick={() => setResponse('yes')}>Тийм</button><button className={response === 'no' ? 'selected' : ''} onClick={() => setResponse('no')}>Харамсалтай нь үгүй</button></div><label><Users size={17}/> Зочдын тоо<select value={partySize} onChange={(event) => setPartySize(Number(event.target.value))}><option value="1">1</option><option value="2">2</option><option value="3">3</option></select></label><button className="rsvp-submit" disabled={!response} onClick={submitRsvp}>Хариу илгээх</button>{error && <p role="alert">{error}</p>}</>}</section><a className="public-back" href="/"><ArrowLeft size={15}/> Invites.mn</a></main>
}