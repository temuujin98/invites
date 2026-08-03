/*
 * The layout every non-wedding template uses: one column, open sections
 * separated by thin rules, over a full-bleed photo background.
 */
import { ArrowLeft, CalendarDays, Gift, MapPin, Phone } from 'lucide-react'
import { formatEventDate } from '../templates'
import { Countdown, Gallery, RsvpForm } from './shared'

export default function DefaultLayout({ invitation, options, gallery, bankParts, mapHref, invitedGuest, demo }) {
  return (
    <div className="pv-content">
      <header className="pv-hero">
        {invitedGuest && <p className="pv-guest">Хүндэт <b>{invitedGuest}</b> танд</p>}
        <p className="pv-type">{invitation.event_type}</p>
        <h1>{invitation.title}</h1>
        {invitation.message && <p className="pv-message">{invitation.message}</p>}
      </header>

      <Countdown target={invitation.event_at} />

      <section className="pv-facts">
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
        <section className="pv-section">
          <h2>Хөтөлбөр</h2>
          <div className="pv-program">
            {options.program.map((row, index) => (
              <p key={index}><b>{row.time}</b><span>{row.activity}</span></p>
            ))}
          </div>
        </section>
      )}

      {options.note && (
        <section className="pv-section">
          <h2>Тэмдэглэл</h2>
          <p className="pv-note">{options.note}</p>
        </section>
      )}

      {bankParts.length > 0 && (
        <section className="pv-section">
          <h2>Данс</h2>
          <div className="pv-bank">
            <Gift size={18} />
            <div className="pv-bank-lines">
              {bankParts.map((part, index) => <p key={index} className={index === 1 || bankParts.length === 1 ? 'pv-bank-number' : ''}>{part}</p>)}
            </div>
          </div>
        </section>
      )}

      <RsvpForm invitationId={invitation.id} demo={demo} initialGuest={invitedGuest} />

      <a className="pv-back" href="/"><ArrowLeft size={15} /> Invites.mn</a>
    </div>
  )
}
