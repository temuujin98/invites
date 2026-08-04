/*
 * Corporate layout — an event brief, not a celebration.
 *
 * Details are a labelled table rather than prose, and the agenda runs down
 * a left time rail the way a conference programme does. Left-aligned, mono
 * labels, no ornament: an attendee should be able to scan it in seconds.
 */
import { ArrowLeft, MapPin } from 'lucide-react'
import { splitEventDate } from '../templates'
import { readDetails } from '../lib/details'
import { Countdown, Gallery, RsvpForm } from './shared'

function Row({ label, children }) {
  return (
    <div className="corp-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

export default function CorporateLayout({ invitation, options, gallery, bankParts, mapHref, invitedGuest, demo }) {
  const details = readDetails(options)
  const parts = splitEventDate(invitation.event_at)

  return (
    <div className="pv-content corp">
      <header className="corp-hero" data-reveal>
        {details.host && <p className="corp-org">{details.host}</p>}
        <h1 className="corp-title">{invitation.title}</h1>
        <p className="corp-type">{invitation.event_type}</p>
        {invitedGuest && <p className="corp-guest">Хүндэт {invitedGuest} танд</p>}
      </header>

      {invitation.message && <p className="corp-message" data-reveal>{invitation.message}</p>}

      {/* the brief: scannable, labelled, no prose */}
      <dl className="corp-facts" data-reveal>
        <Row label="Огноо">
          {parts ? `${parts.year}.${String(parts.month).padStart(2, '0')}.${parts.day}` : 'Тодорхойгүй'}
          {parts && <span className="corp-dim"> · {parts.weekday} гараг</span>}
        </Row>
        <Row label="Цаг">{parts ? parts.time : 'Тодорхойгүй'}</Row>
        <Row label="Байршил">
          <span className="corp-venue"><MapPin size={15} />{invitation.venue || 'Тодорхойгүй'}</span>
          {mapHref && <a className="corp-link" href={mapHref} target="_blank" rel="noreferrer">Газрын зураг ↗</a>}
        </Row>
        {details.dressCode && <Row label="Хувцаслалт">{details.dressCode}</Row>}
        {options.phone && <Row label="Холбоо барих"><a href={`tel:${options.phone}`}>{options.phone}</a></Row>}
      </dl>

      <Countdown target={invitation.event_at} />

      {/* agenda on a time rail */}
      {options.program?.length > 0 && (
        <section className="corp-agenda" data-reveal>
          <h2>Хөтөлбөр</h2>
          <ul>
            {options.program.map((row, index) => (
              <li key={index}>
                <span className="corp-time">{row.time || '—'}</span>
                <span className="corp-act">{row.activity}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {gallery.length > 0 && <Gallery images={gallery} />}

      {options.note && (
        <section className="pv-section corp-section" data-reveal>
          <h2>Нэмэлт мэдээлэл</h2>
          <p className="pv-note">{options.note}</p>
        </section>
      )}

      {bankParts.length > 0 && (
        <section className="pv-section corp-section" data-reveal>
          <h2>Дансны мэдээлэл</h2>
          <div className="pv-bank-lines">
            {bankParts.map((part, index) => <p key={index} className={index === 1 || bankParts.length === 1 ? 'pv-bank-number' : ''}>{part}</p>)}
          </div>
        </section>
      )}

      <RsvpForm invitationId={invitation.id} demo={demo} initialGuest={invitedGuest} heading="Оролцоогоо бүртгүүлнэ үү" />

      <a className="pv-back" href="/"><ArrowLeft size={15} /> Invites.mn</a>
    </div>
  )
}
