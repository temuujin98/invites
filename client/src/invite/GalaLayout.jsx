/*
 * Gala layout — a formal reception card.
 *
 * The programme of the evening is the centrepiece here, set as a numbered
 * gold list rather than the plain time/activity rows the other layouts use.
 * Symmetric, wide-tracked, no photograph competing with the type.
 */
import { ArrowLeft, MapPin } from 'lucide-react'
import { splitEventDate } from '../templates'
import { readDetails } from '../lib/details'
import { Countdown, DressBlock, Gallery, GiftBlock, RsvpForm } from './shared'

export default function GalaLayout({ invitation, options, gallery, bankParts, mapHref, invitedGuest, demo }) {
  const details = readDetails(options)
  const parts = splitEventDate(invitation.event_at)

  return (
    <div className="pv-content gala">
      <header className="gala-hero" data-reveal>
        <span className="gala-rule" aria-hidden="true" />
        {details.host && <p className="gala-host">{details.host}</p>}
        <p className="gala-invites">хүндэтгэн урьж байна</p>
        {invitedGuest && <p className="gala-guest">Хүндэт {invitedGuest} танд</p>}
        <h1 className="gala-title">{invitation.title}</h1>
        <p className="gala-type">{invitation.event_type}</p>
        <span className="gala-rule" aria-hidden="true" />
      </header>

      <section className="gala-when" data-reveal>
        <p className="gala-date">
          {parts ? `${parts.year}.${String(parts.month).padStart(2, '0')}.${parts.day}` : 'Огноо тохируулаагүй'}
        </p>
        <p className="gala-time">{parts ? `${parts.weekday} гараг · ${parts.time}` : ''}</p>
        <p className="gala-venue"><MapPin size={16} />{invitation.venue || 'Байршил удахгүй зарлагдана'}</p>
        {mapHref && <a className="pv-map-button" href={mapHref} target="_blank" rel="noreferrer">Газрын зураг нээх ↗</a>}
      </section>

      {invitation.message && <p className="gala-message" data-reveal>{invitation.message}</p>}

      <Countdown target={invitation.event_at} />

      {/* the evening's order of events, numbered — this layout's centrepiece */}
      {options.program?.length > 0 && (
        <section className="gala-programme" data-reveal>
          <h2>Үдшийн хөтөлбөр</h2>
          <ol>
            {options.program.map((row, index) => (
              <li key={index}>
                <span className="gala-no">{String(index + 1).padStart(2, '0')}</span>
                <span className="gala-act">
                  <b>{row.activity}</b>
                  {row.time && <small>{row.time}</small>}
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {gallery.length > 0 && <Gallery images={gallery} />}

      {options.note && (
        <section className="pv-section gala-section" data-reveal>
          <h2>Тэмдэглэл</h2>
          <p className="pv-note">{options.note}</p>
        </section>
      )}

      <DressBlock details={details} />

      <GiftBlock bankParts={bankParts} details={details} />

      <RsvpForm invitationId={invitation.id}
        deadline={details.rsvpBy} demo={demo} initialGuest={invitedGuest} heading="Хүрэлцэн ирэхээ баталгаажуулна уу" />

      <a className="pv-back" href="/"><ArrowLeft size={15} /> Invites.mn</a>
    </div>
  )
}
