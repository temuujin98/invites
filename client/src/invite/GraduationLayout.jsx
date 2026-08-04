/*
 * Graduation layout — the achievement is the subject.
 *
 * The graduate's name carries the page and a circular seal states the year,
 * the way a diploma does. The school or faculty runs above it as a kicker.
 */
import { ArrowLeft, CalendarDays, Gift, MapPin } from 'lucide-react'
import { splitEventDate } from '../templates'
import { readDetails } from '../lib/details'
import { Countdown, Gallery, RsvpForm } from './shared'

export default function GraduationLayout({ invitation, options, gallery, bankParts, mapHref, invitedGuest, demo }) {
  const details = readDetails(options)
  const parts = splitEventDate(invitation.event_at)

  return (
    <div className="pv-content grad">
      <header className="grad-hero" data-reveal>
        {details.host && <p className="grad-school">{details.host}</p>}
        <p className="grad-type">{invitation.event_type}</p>
        <h1 className="grad-name">{details.honoree || invitation.title}</h1>

        <span className="grad-seal" aria-hidden="true">
          <span className="grad-seal-top">Төгсөлт</span>
          <b className="grad-seal-year">{parts ? parts.year : '—'}</b>
          <span className="grad-seal-bottom">✦</span>
        </span>

        {invitedGuest && <p className="grad-guest">Хүндэт {invitedGuest} танд</p>}
      </header>

      {invitation.message && <p className="grad-message" data-reveal>{invitation.message}</p>}

      <section className="grad-facts" data-reveal>
        <p><CalendarDays size={18} /><span>
          {parts ? `${parts.year}.${String(parts.month).padStart(2, '0')}.${parts.day} · ${parts.time}` : 'Огноо тохируулаагүй'}
        </span></p>
        <p><MapPin size={18} /><span>{invitation.venue || 'Байршил удахгүй зарлагдана'}</span></p>
        {mapHref && <a className="pv-map-button" href={mapHref} target="_blank" rel="noreferrer">Газрын зураг нээх ↗</a>}
      </section>

      <Countdown target={invitation.event_at} />

      {gallery.length > 0 && <Gallery images={gallery} />}

      {options.program?.length > 0 && (
        <section className="pv-section grad-section" data-reveal>
          <h2>Хөтөлбөр</h2>
          <div className="pv-program">
            {options.program.map((row, index) => (
              <p key={index}><b>{row.time}</b><span>{row.activity}</span></p>
            ))}
          </div>
        </section>
      )}

      {options.note && (
        <section className="pv-section grad-section" data-reveal>
          <h2>Тэмдэглэл</h2>
          <p className="pv-note">{options.note}</p>
        </section>
      )}

      {bankParts.length > 0 && (
        <section className="pv-section grad-section" data-reveal>
          <h2>Данс</h2>
          <div className="pv-bank">
            <Gift size={18} />
            <div className="pv-bank-lines">
              {bankParts.map((part, index) => <p key={index} className={index === 1 || bankParts.length === 1 ? 'pv-bank-number' : ''}>{part}</p>)}
            </div>
          </div>
        </section>
      )}

      <RsvpForm invitationId={invitation.id} demo={demo} initialGuest={invitedGuest} heading="Баярт минь ирэх үү?" />

      <a className="pv-back" href="/"><ArrowLeft size={15} /> Invites.mn</a>
    </div>
  )
}
