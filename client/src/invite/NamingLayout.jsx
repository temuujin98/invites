/*
 * Naming-day layout — soft and child-centred.
 *
 * The child's name sits on a rounded plate with the parents named beneath
 * it. Everything is rounded and low-contrast; nothing here shouts.
 */
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react'
import { splitEventDate } from '../templates'
import { readDetails } from '../lib/details'
import { Countdown, DressBlock, Gallery, GiftBlock, RsvpForm } from './shared'

export default function NamingLayout({ invitation, options, gallery, bankParts, mapHref, invitedGuest, demo }) {
  const details = readDetails(options)
  const parts = splitEventDate(invitation.event_at)
  const parents = [details.father, details.mother].filter(Boolean)

  return (
    <div className="pv-content nam">
      <header className="nam-hero" data-reveal>
        {invitedGuest && <p className="nam-guest">Хүндэт {invitedGuest} танд</p>}
        <p className="nam-type">{invitation.event_type}</p>

        <div className="nam-plate">
          <span className="nam-plate-mark" aria-hidden="true">❁</span>
          <h1 className="nam-name">{details.honoree || invitation.title}</h1>
          {details.age && <p className="nam-age">{details.age}</p>}
        </div>

        {parents.length > 0 && (
          <p className="nam-parents">{parents.join(', ')} нарын үр</p>
        )}
        {invitation.message && <p className="nam-message">{invitation.message}</p>}
      </header>

      <section className="nam-facts" data-reveal>
        <p><CalendarDays size={18} /><span>
          {parts ? `${parts.year}.${String(parts.month).padStart(2, '0')}.${parts.day} · ${parts.time}` : 'Огноо тохируулаагүй'}
        </span></p>
        <p><MapPin size={18} /><span>{invitation.venue || 'Байршил удахгүй зарлагдана'}</span></p>
        {mapHref && <a className="pv-map-button" href={mapHref} target="_blank" rel="noreferrer">Газрын зураг нээх ↗</a>}
      </section>

      <Countdown target={invitation.event_at} />

      {gallery.length > 0 && <Gallery images={gallery} />}

      {options.program?.length > 0 && (
        <section className="pv-section nam-section" data-reveal>
          <h2>Хөтөлбөр</h2>
          <div className="pv-program">
            {options.program.map((row, index) => (
              <p key={index}><b>{row.time}</b><span>{row.activity}</span></p>
            ))}
          </div>
        </section>
      )}

      {options.note && (
        <section className="pv-section nam-section" data-reveal>
          <h2>Тэмдэглэл</h2>
          <p className="pv-note">{options.note}</p>
        </section>
      )}

      <DressBlock details={details} />

      <GiftBlock bankParts={bankParts} details={details} />

      <RsvpForm invitationId={invitation.id}
        deadline={details.rsvpBy} demo={demo} initialGuest={invitedGuest} heading="Ерөөл хайрлахаар ирэх үү?" />

      <a className="pv-back" href="/"><ArrowLeft size={15} /> Invites.mn</a>
    </div>
  )
}
