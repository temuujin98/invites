 
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { getTemplate, formatPrice } from '../templates'
import { FunnelHeader, InvitationSummary } from '../components/Shared'

/*
 * Step 4/4: payment. Mock for now — the pay button records a paid mock
 * payment and activates the invitation. Bonum integration replaces the
 * payMock body later, everything else stays.
 */
export default function PayPage({ invitationId }) {
  const [invitation, setInvitation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [paid, setPaid] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!supabase) return
    supabase
      .from('invitations')
      .select('*')
      .eq('id', invitationId)
      .maybeSingle()
      .then(({ data, error: requestError }) => {
        if (requestError || !data) setError('Урилга олдсонгүй. Нэвтэрсэн имэйлээ шалгана уу.')
        else { setInvitation(data); setPaid(data.status === 'active') }
        setLoading(false)
      })
  }, [invitationId])

  async function payMock() {
    setBusy(true)
    setError('')
    const { error: paymentError } = await supabase.from('payments').insert({
      invitation_id: invitation.id,
      amount: invitation.price,
      method: 'mock',
      status: 'paid',
      paid_at: new Date().toISOString(),
    })
    if (paymentError) { setBusy(false); setError('Төлбөр бүртгэхэд алдаа гарлаа. Дахин оролдоно уу.'); return }
    const { error: activateError } = await supabase
      .from('invitations')
      .update({ status: 'active' })
      .eq('id', invitation.id)
    setBusy(false)
    if (activateError) { setError('Идэвхжүүлэхэд алдаа гарлаа. Дахин оролдоно уу.'); return }
    setInvitation({ ...invitation, status: 'active' })
    setPaid(true)
  }

  async function copyLink() {
    await navigator.clipboard.writeText(`${window.location.origin}/i/${invitation.slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const template = invitation ? getTemplate(invitation.template_id) : null

  return (
    <main className="kpage funnel-page">
      <FunnelHeader label={paid ? 'БЭЛЭН БОЛЛОО' : '4/4 · ТӨЛБӨР'} />
      <section className="kpanel-center">
        {loading ? (
          <p className="kpanel-note">Ачаалж байна…</p>
        ) : !invitation ? (
          <div className="kpanel"><h1>Урилга олдсонгүй</h1><p className="kpanel-copy">{error} <a className="klink" href="/my">Миний урилгууд →</a></p></div>
        ) : paid ? (
          <div className="kpanel">
            <p className="kpanel-kicker">АМЖИЛТТАЙ ИДЭВХЖЛЭЭ</p>
            <h1>Урилга тань бэлэн боллоо</h1>
            <div className="pay-summary"><InvitationSummary invitation={invitation} /></div>
            <p className="kpanel-copy">Доорх холбоосыг зочдодоо илгээгээрэй:</p>
            <div className="share-row">
              <code>{window.location.origin}/i/{invitation.slug}</code>
              <button className="kbutton kbutton-small" onClick={copyLink}>{copied ? 'Хуулагдлаа ✓' : 'Хуулах'}</button>
            </div>
            <div className="kform-actions">
              <a className="klink" href={`/i/${invitation.slug}`} target="_blank" rel="noreferrer">Урилгаа үзэх ↗</a>
              <a className="kbutton" href="/my">Миний урилгууд →</a>
            </div>
          </div>
        ) : (
          <div className="kpanel">
            <p className="kpanel-kicker">ТӨЛБӨР</p>
            <h1>Төлбөрөө төлөөд идэвхжүүлээрэй</h1>
            <div className="pay-summary"><InvitationSummary invitation={invitation} /></div>
            <div className="pay-lines">
              <p><span>Загвар</span><b>{template ? `${template.name} · ${template.eventType}` : invitation.template_id}</b></p>
              <p><span>Үнэ</span><b>{formatPrice(invitation.price)}</b></p>
              <p><span>Төлбөрийн хэлбэр</span><b>Туршилтын төлбөр</b></p>
            </div>
            {error && <p className="kerror">{error}</p>}
            <button className="kbutton" disabled={busy} onClick={payMock}>
              {busy ? 'Боловсруулж байна…' : `${formatPrice(invitation.price)} төлөх (тест)`}
            </button>
            <p className="kpanel-note">Туршилтын горим: төлбөр шууд амжилттай болно. Bonum холболт удахгүй.</p>
          </div>
        )}
      </section>
    </main>
  )
}
