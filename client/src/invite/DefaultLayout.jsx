/*
 * The layout every non-wedding template uses: one column, open sections
 * separated by thin rules, over a full-bleed photo background.
 */
import { ArrowLeft, CalendarDays, MapPin, Phone } from 'lucide-react'
import { formatEventDate } from '../templates'
import { Countdown, DressBlock, Gallery, GiftBlock, RsvpForm } from './shared'
import { readDetails } from '../lib/details'

export default function DefaultLayout({ invitation, options, gallery, bankParts, mapHref, invitedGuest, demo }) {
  const details = readDetails(options)
  return (
    <div className="pv-content">
      <header className="pv-hero" data-reveal>
        {invitedGuest && <p className="pv-guest">Хүндэт <b>{invitedGuest}</b> танд</p>}
        <p className="pv-type">{invitation.event_type}</p>
        <h1>{invitation.title}</h1>
        {invitation.message && <p className="pv-message">{invitation.message}</p>}
      </header>

      <Countdown target={invitation.event_at} />

      <section className="pv-facts" data-reveal>
        <p><CalendarDays size={20} /><span>{formatEventDate(invitation.event_at)}</span></p>
        <p><MapPin size={20} /><span>{invitation.venue || 'Байршил удахгүй зарлагдана'}</span></p>
        {options.phone && <p><Phone size={20} /><a href={`tel:${options.phone}`}>{options.phone}</a></p>}
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
      </section>

      {gallery.length > 0 && <Gallery images={gallery} />}

      {options.program?.length > 0 && (
        <section className="pv-section" data-reveal>
          <h2>Хөтөлбөр</h2>
          <div className="pv-program">
            {options.program.map((row, index) => (
              <p key={index}><b>{row.time}</b><span>{row.activity}</span></p>
            ))}
          </div>
        </section>
      )}

      {options.note && (
        <section className="pv-section" data-reveal>
          <h2>Тэмдэглэл</h2>
          <p className="pv-note">{options.note}</p>
        </section>
      )}

      <DressBlock details={details} />

      <GiftBlock bankParts={bankParts} details={details} />

      <RsvpForm invitationId={invitation.id}
        deadline={details.rsvpBy} demo={demo} initialGuest={invitedGuest} />

      <a className="pv-back" href="/"><ArrowLeft size={15} /> Invites.mn</a>
    </div>
  )
}
