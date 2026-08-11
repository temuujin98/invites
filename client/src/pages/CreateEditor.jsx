import { useEffect, useState } from 'react'
import { isSupabaseConfigured, supabase } from '../lib/supabase'
import { insertDraftInvitation } from '../lib/createInvitation'
import { getTemplate, formatPrice, saveDraft, loadDraft, INTRO_PRICE, messagePresets, templateFields } from '../templates'
import { FunnelHeader } from '../components/Shared'
import PhonePreview from '../components/PhonePreview'
import DateTimeField from '../components/DateTimeField'
import ExtraOptions, { emptyExtras } from '../components/ExtraOptions'
import BackgroundPicker from '../components/BackgroundPicker'

/*
 * One page does it all: fill in details + email, hit continue.
 * Signed-in users go straight to payment; new users get a magic link
 * and continue from their inbox — no separate verification page.
 */
export default function CreateEditor({ templateId }) {
  const template = getTemplate(templateId)
  const existing = loadDraft()
  const initial = existing?.templateId === templateId ? existing.values : {}
  const [title, setTitle] = useState(initial.title || '')
  const [eventAt, setEventAt] = useState(initial.eventAt || '')
  const [dateError, setDateError] = useState(false)
  const [venue, setVenue] = useState(initial.venue || '')
  const [message, setMessage] = useState(initial.message || '')
  const [extras, setExtras] = useState(existing?.templateId === templateId ? { ...emptyExtras, ...existing.extras } : emptyExtras)
  const [email, setEmail] = useState('')
  const [session, setSession] = useState(null)
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) return undefined
    supabase.auth.getSession().then(({ data }) => setSession(data.session))
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => setSession(nextSession))
    return () => listener.subscription.unsubscribe()
  }, [])

  if (!template) {
    return (
      <main className="kpage funnel-page">
        <FunnelHeader />
        <header className="funnel-head"><h1>Загвар олдсонгүй</h1><p className="funnel-lead"><a className="klink" href="/create">Загваруудын жагсаалт руу буцах</a></p></header>
      </main>
    )
  }

  async function continueFlow(event) {
    event.preventDefault()
    if (!eventAt) { setDateError(true); return }
    setDateError(false)
    setError('')
    saveDraft({ templateId, values: { title: title.trim(), eventAt, venue: venue.trim(), message: message.trim() }, extras, savedAt: Date.now() })

    if (!isSupabaseConfigured) { setError('Тохиргоо дутуу байна.'); return }
    setBusy(true)

    if (session) {
      const result = await insertDraftInvitation(session)
      setBusy(false)
      if (result.error) { setError('Урилга хадгалахад алдаа гарлаа. Дахин оролдоно уу.'); return }
      window.location.href = `/pay/${result.id}`
      return
    }

    const { error: sendError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/create/confirm` },
    })
    setBusy(false)
    if (sendError) { setError('Имэйл илгээхэд алдаа гарлаа. Хаягаа шалгаад дахин оролдоно уу.'); return }
    setSent(true)
  }

  return (
    <main className="kpage funnel-page">
      <FunnelHeader label="МЭДЭЭЛЛЭЭ ОРУУЛАХ" />
      <header className="funnel-head">
        <h1>{template.eventType}</h1>
        <p className="funnel-lead">{template.description} Үнэ: <b>{formatPrice(template.price + (extras.intro ? INTRO_PRICE : 0))}</b>{extras.intro ? ' (нээлтийн эффект орсон)' : ''} · <a className="klink" href={`/demo/${template.id}${extras.backgroundId ? `?bg=${extras.backgroundId}` : ''}`} target="_blank" rel="noreferrer">Жишээ үзэх ↗</a></p>
      </header>
      <section className="editor-grid">
        {sent ? (
          <div className="kpanel">
            <p className="kpanel-kicker">ИМЭЙЛЭЭ ШАЛГААРАЙ</p>
            <h1>Холбоос илгээгдлээ</h1>
            <p className="kpanel-copy">
              <b>{email}</b> хаяг руу нэвтрэх холбоос илгээлээ. Холбоос дээр дарахад урилга тань хадгалагдаж,
              төлбөрийн хуудас руу шууд орно.
            </p>
            <p className="kpanel-note">Имэйл 1-2 минутад ирээгүй бол СПАМ хавтсаа шалгаарай.</p>
            <button className="klink klink-button" onClick={() => setSent(false)}>← Буцаж засах</button>
          </div>
        ) : (
          <form className="kform" onSubmit={continueFlow}>
            <label>Арга хэмжээний нэр
              <input required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Жишээ: Тэмүүлэн × Номин" />
            </label>
            <label>Огноо ба цаг
              <DateTimeField value={eventAt} onChange={(next) => { setEventAt(next); if (next) setDateError(false) }} />
              {dateError && <span className="kerror">Огноо, цагаа бүрэн сонгоно уу</span>}
            </label>
            <label>Байршил
              <input required maxLength={160} value={venue} onChange={(event) => setVenue(event.target.value)} placeholder="Жишээ: Улаанбаатар · Тансаг өргөө" />
            </label>
            <label>Урилгын мессеж
              <textarea maxLength={400} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Таныг бидний онцгой өдөрт урьж байна" />
              {(messagePresets[template.eventType] || []).length > 0 && (
                <span className="preset-row">
                  <span className="kfield-hint">Бэлэн текст:</span>
                  {(messagePresets[template.eventType] || []).map((preset, index) => (
                    <button type="button" className="preset-chip" key={index} onClick={() => setMessage(preset)}>
                      {index + 1}. {preset.slice(0, 32)}…
                    </button>
                  ))}
                </span>
              )}
            </label>
            <BackgroundPicker
              template={template}
              value={extras.backgroundId}
              onChange={(backgroundId) => setExtras((current) => ({ ...current, backgroundId }))}
            />
            <ExtraOptions value={extras} onChange={setExtras} fields={templateFields(template)} />
            {!session && (
              <label>Имэйл хаяг
                <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="tanii@gmail.com" />
                <span className="kfield-hint">Имэйл рүү тань нэвтрэх холбоос очно — бүртгэл автоматаар үүснэ</span>
              </label>
            )}
            {error && <p className="kerror">{error}</p>}
            <div className="kform-actions">
              <a className="klink" href="/create">← Өөр загвар</a>
              <button className="kbutton" disabled={busy} type="submit">
                {busy ? 'Илгээж байна…' : session ? 'Төлбөр рүү →' : 'Үргэлжлүүлэх →'}
              </button>
            </div>
          </form>
        )}
        <div className="editor-preview-panel">
          <p>УТСАН ДЭЭР ХЭРХЭН ХАРАГДАХ</p>
          <PhonePreview
            templateId={template.id}
            backgroundId={extras.backgroundId}
            title={title}
            venue={venue}
            message={message}
            eventAt={eventAt}
          />
        </div>
      </section>
    </main>
  )
}
