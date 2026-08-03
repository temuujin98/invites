/*
 * Wedding layout — Монгол ёслолын сүр жавхлан.
 *
 * Built around what a Mongolian wedding invitation actually carries and
 * the shared page could not express: the two names as the hero, both
 * families named with respect, the ceremony and the banquet as separate
 * appointments, and a dress code. Dark ground + gold rules, matching the
 * envelope and curtain intros the guest just opened.
 */
import { ArrowLeft, Gift, MapPin, Phone } from 'lucide-react'
import { formatEventDate, splitEventDate } from '../templates'
import { Countdown, Gallery, RsvpForm } from './shared'

function Ornament({ mark = '✦' }) {
  return <p className="wed-ornament" aria-hidden="true"><span /> {mark} <span /></p>
}

/* The date as a wedding invitation sets it: weekday · day · month/year */
function DatePlate({ value }) {
  const parts = splitEventDate(value)
  if (!parts) return null
  return (
    <div className="wed-date" aria-label={formatEventDate(value)}>
      <span className="wed-date-side">{parts.weekday}</span>
      <b className="wed-date-day">{parts.day}</b>
      <span className="wed-date-side">
        {parts.month} сар
        <small>{parts.year} он · {parts.time}</small>
      </span>
    </div>
  )
}

export default function WeddingLayout({ invitation, options, gallery, bankParts, mapHref, invitedGuest, demo }) {
  const wedding = options.wedding || {}
  const hasCouple = Boolean(wedding.groom && wedding.bride)
  const hasParents = Boolean(wedding.groomParents || wedding.brideParents)

  /* Ceremony and banquet are separate appointments when the host set both */
  const appointments = []
  if (wedding.ceremonyAt || wedding.ceremonyVenue) {
    appointments.push({ label: 'Ёслолын ажиллагаа', at: wedding.ceremonyAt, venue: wedding.ceremonyVenue })
  }
  appointments.push({
    label: appointments.length ? 'Хуримын найр' : 'Хуримын ёслол',
    at: invitation.event_at,
    venue: invitation.venue,
  })

  return (
    <div className="pv-content wed">
      <header className="wed-hero">
        <span className="wed-frame" aria-hidden="true" />
        {invitedGuest && <p className="wed-guest">Хүндэт <b>{invitedGuest}</b> танд</p>}
        <p className="wed-kicker">Хуримын ёслол</p>

        {hasCouple ? (
          <div className="wed-names">
            <p className="wed-name">{wedding.groom}</p>
            <span className="wed-amp" aria-hidden="true">&</span>
            <p className="wed-name">{wedding.bride}</p>
          </div>
        ) : (
          <h1 className="wed-title">{invitation.title}</h1>
        )}

        <Ornament />
        <DatePlate value={invitation.event_at} />
      </header>

      {hasParents && (
        <section className="wed-parents" aria-label="Хос талын эцэг эх">
          {wedding.groomParents && (
            <div>
              <p className="wed-parents-label">Хүргэний эцэг эх</p>
              <p className="wed-parents-name">{wedding.groomParents}</p>
            </div>
          )}
          {wedding.brideParents && (
            <div>
              <p className="wed-parents-label">Бэрийн эцэг эх</p>
              <p className="wed-parents-name">{wedding.brideParents}</p>
            </div>
          )}
        </section>
      )}

      <Countdown target={invitation.event_at} />

      {invitation.message && (
        <blockquote className="wed-message">{invitation.message}</blockquote>
      )}

      <section className="wed-appointments" aria-label="Хөтөлбөрийн цаг, байршил">
        {appointments.map((item) => (
          <div className="wed-appointment" key={item.label}>
            <p className="wed-appointment-label">{item.label}</p>
            {item.at && <p className="wed-appointment-time">{formatEventDate(item.at)}</p>}
            <p className="wed-appointment-venue"><MapPin size={16} />{item.venue || 'Байршил удахгүй зарлагдана'}</p>
          </div>
        ))}
      </section>

      {invitation.venue && (
        <div className="pv-map">
          <iframe
            src={`https://www.google.com/maps?q=${encodeURIComponent(invitation.venue)}&output=embed`}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title="Газрын зураг"
          />
        </div>
      )}
      {mapHref && <a className="pv-map-button" href={mapHref} target="_blank" rel="noreferrer">Газрын зураг нээх ↗</a>}

      {gallery.length > 0 && <Gallery images={gallery} />}

      {options.program?.length > 0 && (
        <section className="pv-section wed-section">
          <h2>Хөтөлбөр</h2>
          <div className="pv-program">
            {options.program.map((row, index) => (
              <p key={index}><b>{row.time}</b><span>{row.activity}</span></p>
            ))}
          </div>
        </section>
      )}

      {wedding.dressCode && (
        <section className="pv-section wed-section">
          <h2>Хувцаслалт</h2>
          <p className="pv-note">{wedding.dressCode}</p>
        </section>
      )}

      {options.note && (
        <section className="pv-section wed-section">
          <h2>Тэмдэглэл</h2>
          <p className="pv-note">{options.note}</p>
        </section>
      )}

      {options.phone && (
        <section className="pv-section wed-section">
          <h2>Холбоо барих</h2>
          <p className="wed-contact"><Phone size={18} /><a href={`tel:${options.phone}`}>{options.phone}</a></p>
        </section>
      )}

      {bankParts.length > 0 && (
        <section className="pv-section wed-section">
          <h2>Данс</h2>
          <div className="pv-bank">
            <Gift size={18} />
            <div className="pv-bank-lines">
              {bankParts.map((part, index) => <p key={index} className={index === 1 || bankParts.length === 1 ? 'pv-bank-number' : ''}>{part}</p>)}
            </div>
          </div>
        </section>
      )}

      <RsvpForm
        invitationId={invitation.id}
        demo={demo}
        initialGuest={invitedGuest}
        heading="Ерөөлөө хүргэж, ирэхээ мэдэгдээрэй"
      />

      <Ornament mark="✧" />
      <a className="pv-back" href="/"><ArrowLeft size={15} /> Invites.mn</a>
    </div>
  )
}
