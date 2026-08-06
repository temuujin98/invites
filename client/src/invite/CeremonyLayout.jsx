/*
 * Ceremony layout — dignified and quiet.
 *
 * The stations of the day run down a single centred hairline, so the guest
 * reads the order of events as a vertical journey rather than a list.
 */
import { ArrowLeft, MapPin } from 'lucide-react'
import { formatEventDate, splitEventDate } from '../templates'
import { readDetails } from '../lib/details'
import { Countdown, DressBlock, Gallery, GiftBlock, RsvpForm } from './shared'

export default function CeremonyLayout({ invitation, options, gallery, bankParts, mapHref, invitedGuest, demo }) {
  const details = readDetails(options)
  const parts = splitEventDate(invitation.event_at)

  const stations = []
  if (details.ceremonyAt || details.ceremonyVenue) {
    stations.push({ label: 'Ёслолын ажиллагаа', at: details.ceremonyAt, venue: details.ceremonyVenue })
  }
  stations.push({ label: stations.length ? 'Хүндэтгэлийн зоог' : 'Ёслол', at: invitation.event_at, venue: invitation.venue })

  return (
    <div className="pv-content cer">
      <header className="cer-hero" data-reveal>
        {invitedGuest && <p className="cer-guest">Хүндэт {invitedGuest} танд</p>}
        <p className="cer-type">{invitation.event_type}</p>
        <h1 className="cer-title">{invitation.title}</h1>
        <p className="cer-date">
          {parts ? `${parts.year}.${String(parts.month).padStart(2, '0')}.${parts.day}` : 'Огноо тохируулаагүй'}
        </p>
      </header>

      {invitation.message && <p className="cer-message" data-reveal>{invitation.message}</p>}

      {/* the day as stations on one hairline */}
      <ol className="cer-line" data-reveal>
        {stations.map((station) => (
          <li key={station.label}>
            <p className="cer-station-label">{station.label}</p>
            {station.at && <p className="cer-station-time">{formatEventDate(station.at)}</p>}
            <p className="cer-station-venue"><MapPin size={14} />{station.venue || 'Байршил удахгүй зарлагдана'}</p>
          </li>
        ))}
      </ol>

      {mapHref && <a className="pv-map-button" href={mapHref} target="_blank" rel="noreferrer">Газрын зураг нээх ↗</a>}

      <Countdown target={invitation.event_at} />

      {gallery.length > 0 && <Gallery images={gallery} />}

      {options.program?.length > 0 && (
        <section className="pv-section cer-section" data-reveal>
          <h2>Хөтөлбөр</h2>
          <div className="pv-program">
            {options.program.map((row, index) => (
              <p key={index}><b>{row.time}</b><span>{row.activity}</span></p>
            ))}
          </div>
        </section>
      )}

      {options.note && (
        <section className="pv-section cer-section" data-reveal>
          <h2>Тэмдэглэл</h2>
          <p className="pv-note">{options.note}</p>
        </section>
      )}

      <DressBlock details={details} />

      <GiftBlock bankParts={bankParts} details={details} />

      <RsvpForm invitationId={invitation.id}
        deadline={details.rsvpBy} demo={demo} initialGuest={invitedGuest} heading="Хүрэлцэн ирэхээ мэдэгдээрэй" />

      {/* our mark belongs on the demo, never on a customer's invitation */}

      {demo && <a className="pv-back" href="/"><ArrowLeft size={15} /> Invites.mn</a>}
    </div>
  )
}
