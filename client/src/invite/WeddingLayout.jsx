/*
 * Wedding layout — Монгол ёслолын сүр жавхлан.
 *
 * Built around what a Mongolian wedding invitation actually carries and
 * the shared page could not express: the two names as the hero, both
 * families named with respect, the ceremony and the banquet as separate
 * appointments, and a dress code. Dark ground + gold rules, matching the
 * envelope and curtain intros the guest just opened.
 */
import { ArrowLeft, MapPin, Phone } from 'lucide-react'
import { formatEventDate, splitEventDate } from '../templates'
import { Countdown, DressBlock, Gallery, GiftBlock, RsvpForm } from './shared'
import { readDetails } from '../lib/details'
import ScratchReveal from './ScratchReveal'

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
  const details = readDetails(options)
  const hasCouple = Boolean(details.groom && details.bride)
  const hasParents = Boolean(details.groomParents || details.brideParents)

  /* Ceremony and banquet are separate appointments when the host set both */
  const appointments = []
  if (details.ceremonyAt || details.ceremonyVenue) {
    appointments.push({ label: 'Ёслолын ажиллагаа', at: details.ceremonyAt, venue: details.ceremonyVenue })
  }
  appointments.push({
    label: appointments.length ? 'Хуримын найр' : 'Хуримын ёслол',
    at: invitation.event_at,
    venue: invitation.venue,
  })

  return (
    <div className="pv-content wed">
      <header className="wed-hero" data-reveal>
        <span className="wed-frame" aria-hidden="true" />
        {invitedGuest && <p className="wed-guest">Хүндэт <b>{invitedGuest}</b> танд</p>}
        <p className="wed-kicker">Хуримын ёслол</p>

        {hasCouple ? (
          <div className="wed-names">
            <p className="wed-name">{details.groom}</p>
            <span className="wed-amp" aria-hidden="true">&</span>
            <p className="wed-name">{details.bride}</p>
          </div>
        ) : (
          <h1 className="wed-title">{invitation.title}</h1>
        )}

        <Ornament />
        <ScratchReveal color="#d9b25c">
          <DatePlate value={invitation.event_at} />
        </ScratchReveal>
      </header>

      {hasParents && (
        <section className="wed-parents" data-reveal aria-label="Хос талын эцэг эх">
          {details.groomParents && (
            <div>
              <p className="wed-parents-label">Хүргэний эцэг эх</p>
              <p className="wed-parents-name">{details.groomParents}</p>
            </div>
          )}
          {details.brideParents && (
            <div>
              <p className="wed-parents-label">Бэрийн эцэг эх</p>
              <p className="wed-parents-name">{details.brideParents}</p>
            </div>
          )}
        </section>
      )}

      <Countdown target={invitation.event_at} />

      {invitation.message && (
        <blockquote className="wed-message" data-reveal>{invitation.message}</blockquote>
      )}

      <section className="wed-appointments" data-reveal aria-label="Хөтөлбөрийн цаг, байршил">
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
        <section className="pv-section wed-section" data-reveal>
          <h2>Хөтөлбөр</h2>
          <div className="pv-program">
            {options.program.map((row, index) => (
              <p key={index}><b>{row.time}</b><span>{row.activity}</span></p>
            ))}
          </div>
        </section>
      )}

      {options.note && (
        <section className="pv-section wed-section" data-reveal>
          <h2>Тэмдэглэл</h2>
          <p className="pv-note">{options.note}</p>
        </section>
      )}

      {options.phone && (
        <section className="pv-section wed-section" data-reveal>
          <h2>Холбоо барих</h2>
          <p className="wed-contact"><Phone size={18} /><a href={`tel:${options.phone}`}>{options.phone}</a></p>
        </section>
      )}

      <DressBlock details={details} />

      <GiftBlock bankParts={bankParts} details={details} />

      <RsvpForm
        invitationId={invitation.id}
        deadline={details.rsvpBy}
        demo={demo}
        initialGuest={invitedGuest}
        heading="Ерөөлөө хүргэж, ирэхээ мэдэгдээрэй"
      />

      <Ornament mark="✧" />
      {/* our mark belongs on the demo, never on a customer's invitation */}
      {demo && <a className="pv-back" href="/"><ArrowLeft size={15} /> Invites.mn</a>}
    </div>
  )
}
