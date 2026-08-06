/*
 * Сэвлэг үргээх layout — the child's first haircut ceremony.
 *
 * The age is the reason for the day, so it sits in a medallion above the
 * child's name, with both parents named on a ribbon underneath.
 */
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react'
import { splitEventDate } from '../templates'
import { readDetails } from '../lib/details'
import { Countdown, DressBlock, Gallery, GiftBlock, RsvpForm } from './shared'

export default function SevlegLayout({ invitation, options, gallery, bankParts, mapHref, invitedGuest, demo }) {
  const details = readDetails(options)
  const parts = splitEventDate(invitation.event_at)

  return (
    <div className="pv-content sev">
      <header className="sev-hero" data-reveal>
        {invitedGuest && <p className="sev-guest">Хүндэт {invitedGuest} танд</p>}
        <p className="sev-type">{invitation.event_type}</p>

        {details.age && (
          <span className="sev-medal" aria-hidden="true">
            <b>{details.age}</b>
          </span>
        )}

        <h1 className="sev-name">{details.honoree || invitation.title}</h1>

        {(details.father || details.mother) && (
          <p className="sev-ribbon">
            {details.father && <span>Аав · {details.father}</span>}
            {details.mother && <span>Ээж · {details.mother}</span>}
          </p>
        )}
        {invitation.message && <p className="sev-message">{invitation.message}</p>}
      </header>

      <section className="sev-facts" data-reveal>
        <p><CalendarDays size={18} /><span>
          {parts ? `${parts.year}.${String(parts.month).padStart(2, '0')}.${parts.day} · ${parts.time}` : 'Огноо тохируулаагүй'}
        </span></p>
        <p><MapPin size={18} /><span>{invitation.venue || 'Байршил удахгүй зарлагдана'}</span></p>
        {mapHref && <a className="pv-map-button" href={mapHref} target="_blank" rel="noreferrer">Газрын зураг нээх ↗</a>}
      </section>

      <Countdown target={invitation.event_at} />

      {gallery.length > 0 && <Gallery images={gallery} />}

      {options.program?.length > 0 && (
        <section className="pv-section sev-section" data-reveal>
          <h2>Хөтөлбөр</h2>
          <div className="pv-program">
            {options.program.map((row, index) => (
              <p key={index}><b>{row.time}</b><span>{row.activity}</span></p>
            ))}
          </div>
        </section>
      )}

      {options.note && (
        <section className="pv-section sev-section" data-reveal>
          <h2>Тэмдэглэл</h2>
          <p className="pv-note">{options.note}</p>
        </section>
      )}

      <DressBlock details={details} />

      <GiftBlock bankParts={bankParts} details={details} />

      <RsvpForm invitationId={invitation.id}
        deadline={details.rsvpBy} demo={demo} initialGuest={invitedGuest} heading="Үрийн маань ёслолд ирэх үү?" />

      {/* our mark belongs on the demo, never on a customer's invitation */}

      {demo && <a className="pv-back" href="/"><ArrowLeft size={15} /> Invites.mn</a>}
    </div>
  )
}
