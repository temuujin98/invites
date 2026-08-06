/*
 * Party layout — a club flyer, not an invitation card.
 *
 * Heavy stacked type at tight leading, and the practical details live on a
 * perforated ticket stub instead of in prose. Loud on purpose.
 */
import { ArrowLeft, MapPin } from 'lucide-react'
import { splitEventDate } from '../templates'
import { readDetails } from '../lib/details'
import { Countdown, DressBlock, Gallery, GiftBlock, RsvpForm } from './shared'

export default function PartyLayout({ invitation, options, gallery, bankParts, mapHref, invitedGuest, demo }) {
  const details = readDetails(options)
  const parts = splitEventDate(invitation.event_at)

  return (
    <div className="pv-content pty">
      <header className="pty-hero" data-reveal>
        <p className="pty-type">{invitation.event_type}</p>
        <h1 className="pty-title">{invitation.title}</h1>
        {details.host && <p className="pty-host">{details.host}</p>}
        {invitedGuest && <p className="pty-guest">Хүндэт {invitedGuest} танд</p>}
      </header>

      {/* the details as a torn ticket stub */}
      <section className="pty-ticket" data-reveal>
        <div className="pty-stub">
          <p className="pty-stub-label">Огноо</p>
          <p className="pty-stub-value">{parts ? `${parts.day}.${String(parts.month).padStart(2, '0')}` : '—'}</p>
          <p className="pty-stub-sub">{parts ? parts.weekday : ''}</p>
        </div>
        <span className="pty-perf" aria-hidden="true" />
        <div className="pty-stub">
          <p className="pty-stub-label">Эхлэх</p>
          <p className="pty-stub-value">{parts ? parts.time : '—'}</p>
        </div>
      </section>

      <section className="pty-where" data-reveal>
        <p className="pty-where-label"><MapPin size={15} /> Хаана</p>
        <p className="pty-where-value">{invitation.venue || 'Байршил удахгүй зарлагдана'}</p>
        {mapHref && <a className="pty-link" href={mapHref} target="_blank" rel="noreferrer">Газрын зураг ↗</a>}
      </section>

      {invitation.message && <p className="pty-message" data-reveal>{invitation.message}</p>}

      <Countdown target={invitation.event_at} />

      {gallery.length > 0 && <Gallery images={gallery} />}

      {options.program?.length > 0 && (
        <section className="pv-section pty-section" data-reveal>
          <h2>Хөтөлбөр</h2>
          <div className="pv-program">
            {options.program.map((row, index) => (
              <p key={index}><b>{row.time}</b><span>{row.activity}</span></p>
            ))}
          </div>
        </section>
      )}

      {options.note && (
        <section className="pv-section pty-section" data-reveal>
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
