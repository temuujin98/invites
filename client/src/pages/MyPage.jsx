/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { formatPrice } from '../templates'
import { FunnelHeader, InvitationSummary, ShareQr, statusLabels } from '../components/Shared'

/* Minimal user area: just your invitations, their status, and RSVP details. */
export default function MyPage() {
  const [session, setSession] = useState(null)
  const [checked, setChecked] = useState(false)
  const [invitations, setInvitations] = useState([])
  const [loading, setLoading] = useState(false)
  const [openId, setOpenId] = useState(null)
  const [rsvps, setRsvps] = useState({})
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) return undefined
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setChecked(true) })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    setLoading(true)
    supabase
      .from('invitations')
      .select('*, rsvps(count), payments(status, amount, method)')
      .eq('owner_id', session.user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error: requestError }) => {
        if (requestError) setError('Урилгуудыг ачаалж чадсангүй.')
        else setInvitations(data || [])
        setLoading(false)
      })
  }, [session])

  async function toggleDetails(invitation) {
    const next = openId === invitation.id ? null : invitation.id
    setOpenId(next)
    if (next && !rsvps[invitation.id]) {
      const { data } = await supabase
        .from('rsvps')
        .select('guest_name, response, party_size, created_at')
        .eq('invitation_id', invitation.id)
        .order('created_at', { ascending: false })
      setRsvps((current) => ({ ...current, [invitation.id]: data || [] }))
    }
  }

  async function sendLink(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const { error: sendError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/my` },
    })
    setBusy(false)
    if (sendError) setError('Илгээхэд алдаа гарлаа. Дахин оролдоно уу.')
    else setSent(true)
  }

  async function signOut() {
    await supabase.auth.signOut()
    setInvitations([])
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
            <p className="kpanel-kicker">МИНИЙ УРИЛГУУД</p>
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

  return (
    <main className="kpage funnel-page">
      <FunnelHeader label="МИНИЙ УРИЛГУУД" />
      <header className="funnel-head">
        <h1>Миний урилгууд</h1>
        <p className="funnel-lead">{session.user.email} · <button className="klink klink-button" onClick={signOut}>Гарах</button></p>
      </header>
      {error && <p className="kerror">{error}</p>}
      {loading ? (
        <p className="kpanel-note">Ачаалж байна…</p>
      ) : invitations.length === 0 ? (
        <section className="kpanel-center">
          <div className="kpanel">
            <h1>Урилга алга байна</h1>
            <p className="kpanel-copy">Эхний урилгаа үүсгээрэй — 3 минут л зарцуулна.</p>
            <a className="kbutton" href="/create">Урилга үүсгэх →</a>
          </div>
        </section>
      ) : (
        <section className="my-grid">
          {invitations.map((invitation) => {
            const rsvpCount = invitation.rsvps?.[0]?.count || 0
            const paidPayment = invitation.payments?.find((payment) => payment.status === 'paid')
            const details = rsvps[invitation.id]
            const attending = details?.filter((rsvp) => rsvp.response === 'attending') || []
            const guestTotal = attending.reduce((total, rsvp) => total + rsvp.party_size, 0)
            return (
              <article className="my-card" key={invitation.id}>
                <InvitationSummary invitation={invitation} />
                <div className="my-card-body">
                  <div className="my-status">
                    <span className={`kbadge ${invitation.status}`}>{statusLabels[invitation.status] || invitation.status}</span>
                    <span className="my-price">{formatPrice(invitation.price)}{paidPayment ? ' · Төлөгдсөн' : ''}</span>
                  </div>
                  <h2>{invitation.title}</h2>
                  <p className="my-facts">{invitation.event_type} · {invitation.venue || 'Байршилгүй'} · RSVP {rsvpCount}</p>
                  {invitation.status === 'active' ? (
                    <>
                      <div className="share-row">
                        <code>/i/{invitation.slug}</code>
                        <button
                          className="kbutton kbutton-small"
                          onClick={() => navigator.clipboard.writeText(`${window.location.origin}/i/${invitation.slug}`)}
                        >Хуулах</button>
                      </div>
                      <ShareQr url={`${window.location.origin}/i/${invitation.slug}`} size={120} />
                    </>
                  ) : invitation.status === 'pending_payment' ? (
                    <a className="kbutton kbutton-small" href={`/pay/${invitation.id}`}>Төлбөр төлөх →</a>
                  ) : null}
                  <div className="my-actions">
                    <a className="klink" href={`/edit/${invitation.id}`}>Засах</a>
                    <button className="klink klink-button" onClick={() => toggleDetails(invitation)}>
                      {openId === invitation.id ? 'Хариунуудыг хаах ↑' : 'RSVP хариунууд ↓'}
                    </button>
                  </div>
                  {openId === invitation.id && (
                    <div className="rsvp-details">
                      {!details ? <p className="kpanel-note">Ачаалж байна…</p> : details.length === 0 ? (
                        <p className="kpanel-note">Одоогоор хариу ирээгүй байна.</p>
                      ) : (
                        <>
                          <p className="rsvp-total">Ирнэ: {attending.length} хариу · нийт {guestTotal} зочин</p>
                          {details.map((rsvp, index) => (
                            <p className="rsvp-line" key={index}>
                              <span className={`rsvp-flag ${rsvp.response}`}>{rsvp.response === 'attending' ? 'ИРНЭ' : 'ҮГҮЙ'}</span>
                              <b>{rsvp.guest_name || 'Нэргүй зочин'}</b>
                              <small>{rsvp.party_size} хүн</small>
                            </p>
                          ))}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </section>
      )}
    </main>
  )
}
