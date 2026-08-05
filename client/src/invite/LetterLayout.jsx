/*
 * Letter layout — a sheet of ivory paper drawn out of a coloured envelope.
 *
 * The envelope front is fixed to the bottom of the viewport while the sheet
 * scrolls up behind it, so the letter reads as being pulled out as you read.
 * The page itself does the scrolling: a nested scroll area inside the sheet
 * would fight the thumb on a phone, and this looks the same without that.
 */
import { ArrowLeft } from 'lucide-react'
import { formatEventDate, splitEventDate } from '../templates'
import { Countdown, DressBlock, Gallery, GiftBlock, RsvpForm } from './shared'
import { readDetails } from '../lib/details'
import { Corner, Divider, SealEmblem } from './ornaments/Ornaments'

function Mark() {
  return <span className="lt-mark" aria-hidden="true">✻</span>
}

/* label · value block, the way an engraved invitation sets its details */
function Detail({ label, children }) {
  return (
    <div className="lt-detail">
      <p className="lt-detail-label"><Mark /> {label}</p>
      <div className="lt-detail-body">{children}</div>
    </div>
  )
}

export default function LetterLayout({ invitation, options, gallery, bankParts, mapHref, invitedGuest, demo }) {
  const details = readDetails(options)
  const hasCouple = Boolean(details.groom && details.bride)
  const parts = splitEventDate(invitation.event_at)

  return (
    <div className="pv-content letter">
      <article className="lt-sheet">
        {/* lace runs along the top and foot, a filigree vine down each side */}
        <span className="lt-edge lt-edge-top" aria-hidden="true" />
        <span className="lt-edge lt-edge-bottom" aria-hidden="true" />
        <span className="lt-edge lt-edge-left" aria-hidden="true" />
        <span className="lt-edge lt-edge-right" aria-hidden="true" />
        <Corner className="lt-corner lt-corner-tl" />
        <Corner className="lt-corner lt-corner-tr" />
        <Corner className="lt-corner lt-corner-bl" />
        <Corner className="lt-corner lt-corner-br" />

        <header className="lt-head" data-reveal>
          {invitedGuest && <p className="lt-guest">Хүндэт {invitedGuest} танд</p>}
          <p className="lt-script">Урилга</p>
          <p className="lt-kicker">Танхимд хүрэлцэн ирэхийг хүсье</p>
          {hasCouple ? (
            <>
              <p className="lt-type">{invitation.event_type}</p>
              <h1 className="lt-names">{details.groom} <span className="lt-amp">ба</span> {details.bride}</h1>
            </>
          ) : (
            <>
              <p className="lt-type">{invitation.event_type}</p>
              <h1 className="lt-names">{invitation.title}</h1>
            </>
          )}
          <Divider className="lt-divider" />
        </header>

        <section className="lt-details" data-reveal>
          <Detail label="Цаг">
            <p className="lt-strong">{parts ? parts.time : '—'}</p>
            {details.ceremonyAt && <p className="lt-soft">Ёслол: {formatEventDate(details.ceremonyAt)}</p>}
          </Detail>

          <Detail label="Огноо">
            <p className="lt-strong">
              {parts ? `${parts.year}.${String(parts.month).padStart(2, '0')}.${parts.day}` : 'Огноо тохируулаагүй'}
            </p>
            {parts && <p className="lt-soft">{parts.weekday} гараг</p>}
          </Detail>

          <Detail label="Байршил">
            <p className="lt-strong">{invitation.venue || 'Байршил удахгүй зарлагдана'}</p>
            {details.ceremonyVenue && <p className="lt-soft">Ёслол: {details.ceremonyVenue}</p>}
            {mapHref && <a className="lt-link" href={mapHref} target="_blank" rel="noreferrer">Газрын зураг нээх ↗</a>}
          </Detail>

          {(details.groomParents || details.brideParents) && (
            <Detail label="Гэр бүл">
              {details.groomParents && <p className="lt-soft">Хүргэний эцэг эх — {details.groomParents}</p>}
              {details.brideParents && <p className="lt-soft">Бэрийн эцэг эх — {details.brideParents}</p>}
            </Detail>
          )}

          {options.phone && (
            <Detail label="Холбоо барих">
              <p className="lt-strong"><a href={`tel:${options.phone}`}>{options.phone}</a></p>
            </Detail>
          )}
        </section>

        {invitation.message && (
          <p className="lt-message" data-reveal>{invitation.message}</p>
        )}

        <Divider className="lt-divider" />

        <Countdown target={invitation.event_at} />

        {gallery.length > 0 && <Gallery images={gallery} />}

        {options.program?.length > 0 && (
          <section className="pv-section lt-section" data-reveal>
            <h2>Хөтөлбөр</h2>
            <div className="pv-program">
              {options.program.map((row, index) => (
                <p key={index}><b>{row.time}</b><span>{row.activity}</span></p>
              ))}
            </div>
          </section>
        )}

        {options.note && (
          <section className="pv-section lt-section" data-reveal>
            <h2>Тэмдэглэл</h2>
            <p className="pv-note">{options.note}</p>
          </section>
        )}

      <DressBlock details={details} />

      <GiftBlock bankParts={bankParts} details={details} />

        <RsvpForm
          invitationId={invitation.id}
        deadline={details.rsvpBy}
          demo={demo}
          initialGuest={invitedGuest}
          heading="Ирэх эсэхээ мэдэгдээрэй"
        />

        <p className="lt-closing" data-reveal>Таныг хүлээж байна</p>
      </article>

      <a className="pv-back lt-back" href="/"><ArrowLeft size={15} /> Invites.mn</a>

      {/* envelope front — fixed, the sheet slides up behind it */}
      <div className="lt-pocket" aria-hidden="true">
        <span className="lt-pocket-seal"><SealEmblem className="lt-seal-emblem" /></span>
      </div>
    </div>
  )
}
