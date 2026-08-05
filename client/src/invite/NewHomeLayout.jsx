/*
 * Housewarming layout — the address is the invitation.
 *
 * A door plaque carries the new address up top, and getting there is given
 * more room than anything else, because that is what the guest actually needs.
 */
import { ArrowLeft, CalendarDays, MapPin } from 'lucide-react'
import { splitEventDate } from '../templates'
import { readDetails } from '../lib/details'
import { Countdown, DressBlock, Gallery, GiftBlock, RsvpForm } from './shared'

export default function NewHomeLayout({ invitation, options, gallery, bankParts, mapHref, invitedGuest, demo }) {
  const details = readDetails(options)
  const parts = splitEventDate(invitation.event_at)

  return (
    <div className="pv-content nh">
      <header className="nh-hero" data-reveal>
        {invitedGuest && <p className="nh-guest">Хүндэт {invitedGuest} танд</p>}
        <p className="nh-type">{invitation.event_type}</p>
        <h1 className="nh-title">{invitation.title}</h1>
        {details.host && <p className="nh-host">{details.host}</p>}
      </header>

      {/* the new address, set as a door plaque */}
      <section className="nh-plaque" data-reveal>
        <span className="nh-plaque-hole" aria-hidden="true" />
        <p className="nh-plaque-label">Шинэ хаяг</p>
        <p className="nh-plaque-address">{invitation.venue || 'Байршил удахгүй зарлагдана'}</p>
        {mapHref && <a className="nh-plaque-link" href={mapHref} target="_blank" rel="noreferrer"><MapPin size={15} /> Зам заавар нээх ↗</a>}
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

      <section className="nh-when" data-reveal>
        <p><CalendarDays size={18} /><span>
          {parts ? `${parts.year}.${String(parts.month).padStart(2, '0')}.${parts.day} · ${parts.weekday} · ${parts.time}` : 'Огноо тохируулаагүй'}
        </span></p>
      </section>

      {invitation.message && <p className="nh-message" data-reveal>{invitation.message}</p>}

      <Countdown target={invitation.event_at} />

      {gallery.length > 0 && <Gallery images={gallery} />}

      {options.program?.length > 0 && (
        <section className="pv-section nh-section" data-reveal>
          <h2>Хөтөлбөр</h2>
          <div className="pv-program">
            {options.program.map((row, index) => (
              <p key={index}><b>{row.time}</b><span>{row.activity}</span></p>
            ))}
          </div>
        </section>
      )}

      {options.note && (
        <section className="pv-section nh-section" data-reveal>
          <h2>Тэмдэглэл</h2>
          <p className="pv-note">{options.note}</p>
        </section>
      )}

      <DressBlock details={details} />

      <GiftBlock bankParts={bankParts} details={details} />

      <RsvpForm invitationId={invitation.id}
        deadline={details.rsvpBy} demo={demo} initialGuest={invitedGuest} heading="Босго алхах уу?" />

      <a className="pv-back" href="/"><ArrowLeft size={15} /> Invites.mn</a>
    </div>
  )
}
