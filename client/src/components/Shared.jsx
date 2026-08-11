import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { formatEventDate } from '../templates'
import { invitationBackgroundUrl, isInvitationBackground } from '../backgrounds'

/* QR code for the invitation share link */
export function ShareQr({ url, size = 160 }) {
  const [dataUrl, setDataUrl] = useState('')
  useEffect(() => {
    let alive = true
    QRCode.toDataURL(url, { width: size * 2, margin: 1, color: { dark: '#000000', light: '#ffffff' } })
      .then((result) => { if (alive) setDataUrl(result) })
      .catch(() => {})
    return () => { alive = false }
  }, [url, size])
  if (!dataUrl) return null
  return (
    <div className="share-qr">
      <img src={dataUrl} alt={`QR: ${url}`} width={size} height={size} />
      <a className="klink" href={dataUrl} download="invites-qr.png">QR татах</a>
    </div>
  )
}

/* Header for funnel pages: logo home link + step label only (no CTA — you're already in the flow) */
export function FunnelHeader({ label }) {
  return (
    <nav className="knav" aria-label="Үндсэн хэсэг">
      <a className="knav-brand" href="/"><img src="/brand/invites.mn/logo-wordmark-light.png" alt="INVITES.MN" /></a>
      {label && <p className="knav-step">{label}</p>}
    </nav>
  )
}

/* Invitation preview card used in the gallery, editor, /my and admin */
export function InvitePreview({ tone, eventType, title, dateText, big, bgId }) {
  const customBackground = isInvitationBackground(bgId)
    ? { backgroundImage: `linear-gradient(#fff5, #fff5), url(${invitationBackgroundUrl(bgId)})` }
    : undefined
  return (
    <article className={`tpl-card ${tone} ${bgId ? `bg-${bgId}` : ''} ${big ? 'tpl-card-big' : ''}`} style={customBackground} aria-hidden="true">
      <span>{eventType}</span>
      <div>
        <p className="tpl-name">{title}</p>
        <p className="tpl-date">{dateText}</p>
      </div>
      <i>i</i>
    </article>
  )
}

export function InvitationSummary({ invitation }) {
  return (
    <InvitePreview
      tone={invitation.theme}
      eventType={invitation.event_type}
      title={invitation.title}
      dateText={formatEventDate(invitation.event_at)}
      bgId={invitation.options?.backgroundId || invitation.template_id}
    />
  )
}

export const statusLabels = {
  draft: 'Ноорог',
  pending_payment: 'Төлбөр хүлээгдэж буй',
  active: 'Идэвхтэй',
  paused: 'Түр хаагдсан',
  archived: 'Архивлагдсан',
}
