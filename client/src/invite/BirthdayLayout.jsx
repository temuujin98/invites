/*
 * Birthday layout — loud and kinetic, the opposite of the ceremonial ones.
 *
 * The age is the hero: one enormous numeral, with the name under it and a
 * skewed marquee band cutting across. Everything is left-aligned, which is
 * what separates it at a glance from the centred ceremonial templates.
 */
import { ArrowLeft, MapPin } from 'lucide-react'
import { splitEventDate } from '../templates'
import { readDetails } from '../lib/details'
import { Countdown, DressBlock, Gallery, GiftBlock, RsvpForm } from './shared'

export default function BirthdayLayout({ invitation, options, gallery, bankParts, mapHref, invitedGuest, demo }) {
  const details = readDetails(options)
  const parts = splitEventDate(invitation.event_at)
  const band = [invitation.event_type, 'БАЯР ХҮРГЭЕ', invitation.title].filter(Boolean)

  return (
    <div className="pv-content bd">
      <header className="bd-hero" data-reveal>
        {invitedGuest && <p className="bd-guest">Хүндэт <b>{invitedGuest}</b> танд</p>}
        <p className="bd-type">{invitation.event_type}</p>
        {details.age && <p className="bd-age">{details.age}</p>}
        <h1 className="bd-name">{invitation.title}</h1>
        {invitation.message && <p className="bd-message">{invitation.message}</p>}
      </header>

      <div className="bd-band" aria-hidden="true">
        <div className="bd-band-track">
          {[...band, ...band, ...band].map((word, index) => <span key={index}>{word}</span>)}
        </div>
      </div>

      <section className="bd-when" data-reveal>
        <div className="bd-cell">
          <p className="bd-label">Хэзээ</p>
          <p className="bd-big">{parts ? `${parts.day}.${String(parts.month).padStart(2, '0')}` : '—'}</p>
          <p className="bd-sub">{parts ? `${parts.weekday} · ${parts.time}` : 'Огноо тохируулаагүй'}</p>
        </div>
        <div className="bd-cell">
          <p className="bd-label">Хаана</p>
          <p className="bd-place">{invitation.venue || 'Байршил удахгүй зарлагдана'}</p>
          {mapHref && <a className="bd-link" href={mapHref} target="_blank" rel="noreferrer"><MapPin size={15} /> Газрын зураг ↗</a>}
        </div>
      </section>

      <Countdown target={invitation.event_at} />

      {gallery.length > 0 && <Gallery images={gallery} />}

      {options.program?.length > 0 && (
        <section className="pv-section bd-section" data-reveal>
          <h2>Хөтөлбөр</h2>
          <div className="pv-program">
            {options.program.map((row, index) => (
              <p key={index}><b>{row.time}</b><span>{row.activity}</span></p>
            ))}
          </div>
        </section>
      )}

      {options.note && (
        <section className="pv-section bd-section" data-reveal>
          <h2>Тэмдэглэл</h2>
          <p className="pv-note">{options.note}</p>
        </section>
      )}

      <DressBlock details={details} />

      <GiftBlock bankParts={bankParts} details={details} />

      <RsvpForm invitationId={invitation.id}
        deadline={details.rsvpBy} demo={demo} initialGuest={invitedGuest} heading="Ирэх үү?" />

      {/* our mark belongs on the demo, never on a customer's invitation */}

      {demo && <a className="pv-back" href="/"><ArrowLeft size={15} /> Invites.mn</a>}
    </div>
  )
}
