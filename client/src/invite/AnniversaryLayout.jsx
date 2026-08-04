/*
 * Anniversary layout — the years are the subject.
 *
 * A ring holds the count of years, with the two names beneath it. The ring
 * is the one big shape on an otherwise very quiet, deep-night page.
 */
import { ArrowLeft, CalendarDays, Gift, MapPin } from 'lucide-react'
import { splitEventDate } from '../templates'
import { readDetails } from '../lib/details'
import { Countdown, Gallery, RsvpForm } from './shared'

export default function AnniversaryLayout({ invitation, options, gallery, bankParts, mapHref, invitedGuest, demo }) {
  const details = readDetails(options)
  const parts = splitEventDate(invitation.event_at)
  const hasCouple = Boolean(details.groom && details.bride)

  return (
    <div className="pv-content ann">
      <header className="ann-hero" data-reveal>
        {invitedGuest && <p className="ann-guest">Хүндэт {invitedGuest} танд</p>}
        <p className="ann-type">{invitation.event_type}</p>

        {details.age && (
          <span className="ann-ring" aria-hidden="true">
            <span className="ann-ring-inner">
              <b>{details.age}</b>
            </span>
          </span>
        )}

        <h1 className="ann-names">
          {hasCouple ? <>{details.groom} <span className="ann-amp">&</span> {details.bride}</> : invitation.title}
        </h1>
        {invitation.message && <p className="ann-message">{invitation.message}</p>}
      </header>

      <section className="ann-facts" data-reveal>
        <p><CalendarDays size={18} /><span>
          {parts ? `${parts.year}.${String(parts.month).padStart(2, '0')}.${parts.day} · ${parts.time}` : 'Огноо тохируулаагүй'}
        </span></p>
        <p><MapPin size={18} /><span>{invitation.venue || 'Байршил удахгүй зарлагдана'}</span></p>
        {mapHref && <a className="pv-map-button" href={mapHref} target="_blank" rel="noreferrer">Газрын зураг нээх ↗</a>}
      </section>

      <Countdown target={invitation.event_at} />

      {gallery.length > 0 && <Gallery images={gallery} />}

      {options.program?.length > 0 && (
        <section className="pv-section ann-section" data-reveal>
          <h2>Хөтөлбөр</h2>
          <div className="pv-program">
            {options.program.map((row, index) => (
              <p key={index}><b>{row.time}</b><span>{row.activity}</span></p>
            ))}
          </div>
        </section>
      )}

      {options.note && (
        <section className="pv-section ann-section" data-reveal>
          <h2>Тэмдэглэл</h2>
          <p className="pv-note">{options.note}</p>
        </section>
      )}

      {bankParts.length > 0 && (
        <section className="pv-section ann-section" data-reveal>
          <h2>Данс</h2>
          <div className="pv-bank">
            <Gift size={18} />
            <div className="pv-bank-lines">
              {bankParts.map((part, index) => <p key={index} className={index === 1 || bankParts.length === 1 ? 'pv-bank-number' : ''}>{part}</p>)}
            </div>
          </div>
        </section>
      )}

      <RsvpForm invitationId={invitation.id} demo={demo} initialGuest={invitedGuest} heading="Хамт байх уу?" />

      <a className="pv-back" href="/"><ArrowLeft size={15} /> Invites.mn</a>
    </div>
  )
}
