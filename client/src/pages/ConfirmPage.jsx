 
import { useEffect, useRef, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { getTemplate, loadDraft, clearDraft, makeSlug, formatPrice } from '../templates'
import { FunnelHeader } from '../components/Shared'

/*
 * Step 3/4: verify with email (magic link). The draft lives in localStorage,
 * so after the user clicks the link and returns here with a session we
 * insert the invitation and forward them to payment.
 */
export default function ConfirmPage() {
  const draft = loadDraft()
  const template = draft ? getTemplate(draft.templateId) : null
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [phase, setPhase] = useState('loading') // loading | need-email | saving
  const inserting = useRef(false)

  useEffect(() => {
    if (!supabase) return undefined
    let alive = true

    async function insertAndPay(session) {
      if (inserting.current) return
      inserting.current = true
      setPhase('saving')
      const currentDraft = loadDraft()
      const currentTemplate = currentDraft ? getTemplate(currentDraft.templateId) : null
      if (!currentDraft || !currentTemplate) { window.location.href = '/create'; return }
      const values = currentDraft.values
      const { data, error: insertError } = await supabase.from('invitations').insert({
        owner_id: session.user.id,
        owner_email: session.user.email,
        slug: makeSlug(values.title),
        title: values.title,
        event_type: currentTemplate.eventType,
        event_at: values.eventAt ? new Date(values.eventAt).toISOString() : null,
        venue: values.venue || null,
        message: values.message || null,
        theme: currentTemplate.tone,
        template_id: currentTemplate.id,
        price: currentTemplate.price,
        status: 'pending_payment',
      }).select('id').single()
      if (insertError) {
        inserting.current = false
        setPhase('need-email')
        setError('Урилга хадгалахад алдаа гарлаа. Дахин оролдоно уу.')
        return
      }
      clearDraft()
      window.location.href = `/pay/${data.id}`
    }

    supabase.auth.getSession().then(({ data }) => {
      if (!alive) return
      if (data.session) insertAndPay(data.session)
      else setPhase('need-email')
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) insertAndPay(session)
    })
    return () => { alive = false; listener.subscription.unsubscribe() }
  }, [])

  async function sendLink(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const { error: sendError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/create/confirm` },
    })
    setBusy(false)
    if (sendError) setError('Илгээхэд алдаа гарлаа. Имэйл хаягаа шалгаад дахин оролдоно уу.')
    else setSent(true)
  }

  if (!isSupabaseConfigured) {
    return <main className="kpage funnel-page"><FunnelHeader /><header className="funnel-head"><h1>Тохиргоо дутуу</h1><p className="funnel-lead">.env.local дахь Supabase URL болон key-г шалгана уу.</p></header></main>
  }

  if (!draft || !template) {
    return (
      <main className="kpage funnel-page">
        <FunnelHeader />
        <header className="funnel-head"><h1>Ноорог олдсонгүй</h1><p className="funnel-lead"><a className="klink" href="/create">Загвар сонгож урилгаа үүсгээрэй →</a></p></header>
      </main>
    )
  }

  return (
    <main className="kpage funnel-page">
      <FunnelHeader label="3/4 · БАТАЛГААЖУУЛАХ" />
      <section className="kpanel-center">
        <div className="kpanel">
          <p className="kpanel-kicker">ИМЭЙЛ БАТАЛГААЖУУЛАЛТ</p>
          <h1>Имэйлээ баталгаажуулаад үргэлжлүүлээрэй</h1>
          <p className="kpanel-copy">
            «{draft.values.title}» ({template.name} · {formatPrice(template.price)}) урилгыг таны бүртгэлд холбохын тулд
            имэйл рүү тань нэвтрэх холбоос илгээнэ. Холбоос дээр дарахад бүртгэл автоматаар үүснэ.
          </p>
          {phase === 'saving' ? (
            <p className="kpanel-note">Урилгыг хадгалж байна…</p>
          ) : sent ? (
            <p className="kpanel-note">Холбоос илгээгдлээ — <b>{email}</b> хаягаа шалгаад холбоос дээр дарна уу. Энэ хуудсыг хаасан ч болно, холбоос таныг буцааж авчирна.</p>
          ) : (
            <form className="kform" onSubmit={sendLink}>
              <label>Имэйл хаяг
                <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tanii@gmail.com" />
              </label>
              {error && <p className="kerror">{error}</p>}
              <button className="kbutton" disabled={busy || phase === 'loading'} type="submit">
                {busy ? 'Илгээж байна…' : 'Нэвтрэх холбоос илгээх'}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  )
}
