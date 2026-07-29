/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, CalendarDays, Gift, MapPin, Music, Pause, Phone, User, Users } from 'lucide-react'
import { isSupabaseConfigured, supabase } from './lib/supabase'
import { formatEventDate, getTemplate } from './templates'

/*
 * YouTube background music: hidden iframe player + a floating toggle.
 * Loops the chosen clip (or the whole track); starts on the guest's
 * first tap — either the floating button or the curtain-open button.
 */
function MusicPlayer({ music }) {
  const [playing, setPlaying] = useState(false)
  const playerRef = useRef(null)
  const readyRef = useRef(false)

  useEffect(() => {
    let cancelled = false

    function createPlayer() {
      if (cancelled) return
      playerRef.current = new window.YT.Player('yt-music-holder', {
        width: 1,
        height: 1,
        videoId: music.id,
        playerVars: { start: music.start || 0, end: music.end, playsinline: 1, controls: 0, disablekb: 1, rel: 0 },
        events: {
          onReady: () => { readyRef.current = true },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) setPlaying(true)
            if (event.data === window.YT.PlayerState.PAUSED) setPlaying(false)
            if (event.data === window.YT.PlayerState.ENDED) {
              playerRef.current.loadVideoById({ videoId: music.id, startSeconds: music.start || 0, endSeconds: music.end })
            }
          },
        },
      })
    }

    if (window.YT?.Player) createPlayer()
    else {
      const previous = window.onYouTubeIframeAPIReady
      window.onYouTubeIframeAPIReady = () => { previous?.(); createPlayer() }
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const script = document.createElement('script')
        script.src = 'https://www.youtube.com/iframe_api'
        document.head.appendChild(script)
      }
    }

    function startFromGesture() {
      if (readyRef.current) playerRef.current?.playVideo()
    }
    window.addEventListener('invite-open-clicked', startFromGesture)
    return () => {
      cancelled = true
      window.removeEventListener('invite-open-clicked', startFromGesture)
      playerRef.current?.destroy?.()
    }
  }, [music])

  function toggle() {
    if (!readyRef.current) return
    if (playing) playerRef.current.pauseVideo()
    else playerRef.current.playVideo()
  }

  return (
    <div className="music-dock">
      <div id="yt-music-holder" className="yt-hidden" aria-hidden="true" />
      <button className={`music-toggle ${playing ? 'playing' : ''}`} onClick={toggle} aria-label={playing ? 'Дууг зогсоох' : 'Дуу тоглуулах'}>
        {playing ? <Pause size={20} /> : <Music size={20} />}
      </button>
    </div>
  )
}

/*
 * Ceremonial curtain intro (paid add-on): velvet curtains part when the
 * guest presses «Урилгыг нээх», then the overlay fades away.
 */
function CurtainIntro({ eventType, guest, color, onDone }) {
  const [opening, setOpening] = useState(false)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function openCurtains() {
    // synchronous dispatch keeps the user-gesture context for audio start
    window.dispatchEvent(new Event('invite-open-clicked'))
    if (reduceMotion) { onDone(); return }
    setOpening(true)
    setTimeout(onDone, 2100)
  }

  return (
    <div className={`intro-overlay c-${color || 'violet'} ${opening ? 'opening' : ''}`} role="dialog" aria-label="Урилга нээх">
      <div className="curtain curtain-left" />
      <div className="curtain curtain-right" />
      <div className="intro-center">
        <p className="intro-type">{eventType}</p>
        {guest && <p className="intro-guest">Хүндэт {guest} танд</p>}
        <button className="intro-open" onClick={openCurtains}>Урилгыг нээх</button>
      </div>
    </div>
  )
}

function Countdown({ target }) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [])
  const diff = new Date(target).getTime() - now
  if (!target || diff <= 0) return null
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor(diff / 3600000) % 24
  const minutes = Math.floor(diff / 60000) % 60
  const seconds = Math.floor(diff / 1000) % 60
  const pad = (part) => String(part).padStart(2, '0')
  const units = [[days, 'ХОНОГ'], [pad(hours), 'ЦАГ'], [pad(minutes), 'МИН'], [pad(seconds), 'СЕК']]
  return (
    <div className="pv-countdown" aria-label="Тооллого">
      {units.map(([value, label], index) => (
        <div className="pv-count" key={label}>
          <b>{value}</b><small>{label}</small>
          {index < 3 && <span className="pv-count-sep" aria-hidden="true" />}
        </div>
      ))}
    </div>
  )
}

/* Horizontal photo album with scroll-snap */
function Gallery({ images }) {
  return (
    <section className="pv-gallery" aria-label="Зургийн цомог">
      <div className={`pv-gallery-track ${images.length === 1 ? 'single' : ''}`}>
        {images.map((url, index) => (
          <img key={url} src={url} alt={`Зураг ${index + 1}`} loading="lazy" />
        ))}
      </div>
      {images.length > 1 && <p className="pv-gallery-hint">← зургуудыг гүйлгэж үзээрэй →</p>}
    </section>
  )
}

export default function PublicInvitation() {
  const [response, setResponse] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [wish, setWish] = useState('')
  const [partySize, setPartySize] = useState(1)
  const [invitation, setInvitation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [introDone, setIntroDone] = useState(false)
  const [error, setError] = useState('')
  const slug = window.location.pathname.split('/').filter(Boolean).at(-1)
  const invitedGuest = new URLSearchParams(window.location.search).get('g') || ''

  useEffect(() => {
    if (!supabase || !slug) { setLoading(false); return undefined }
    let alive = true
    supabase
      .from('invitations')
      .select('id, event_type, title, message, event_at, venue, theme, template_id, options')
      .eq('slug', slug)
      .eq('status', 'active')
      .maybeSingle()
      .then(({ data, error: requestError }) => {
        if (!alive) return
        if (requestError || !data) setError('Энэ урилга олдсонгүй эсвэл идэвхгүй байна')
        else setInvitation(data)
        setLoading(false)
      })
    return () => { alive = false }
  }, [slug])

  useEffect(() => {
    if (invitedGuest) setGuestName(invitedGuest)
  }, [invitedGuest])

  async function submitRsvp() {
    if (!response) return
    setError('')
    const base = {
      invitation_id: invitation.id,
      guest_name: guestName.trim() || null,
      response: response === 'yes' ? 'attending' : 'declined',
      party_size: partySize,
    }
    let { error: submitError } = await supabase.from('rsvps').insert({
      ...base,
      guest_phone: guestPhone.trim() || null,
      wish: wish.trim() || null,
    })
    if (submitError && /column|schema/i.test(submitError.message || '')) {
      ({ error: submitError } = await supabase.from('rsvps').insert(base))
    }
    if (submitError) setError('Хариу илгээж чадсангүй. Дахин оролдоно уу')
    else setSubmitted(true)
  }

  if (!isSupabaseConfigured) {
    return <main className="pv"><p className="pv-loading">Тохиргоо дутуу байна.</p></main>
  }

  if (loading) {
    return <main className="pv"><p className="pv-loading">Урилгыг ачаалж байна…</p></main>
  }

  if (!invitation) {
    return (
      <main className="pv">
        <div className="pv-content">
          <a className="pv-brand" href="/"><img src="/brand/invites.mn/logo-wordmark-light.png" alt="INVITES.MN" /></a>
          <h1 className="pv-missing">{error || 'Урилга олдсонгүй'}</h1>
          <a className="pv-back" href="/"><ArrowLeft size={15} /> Invites.mn</a>
        </div>
      </main>
    )
  }

  const template = getTemplate(invitation.template_id)
  const layout = template?.layout || 'classic'
  const tone = invitation.theme || 'lavender'
  const options = invitation.options || {}
  const gallery = options.gallery || (options.coverUrl ? [options.coverUrl] : [])
  // the curtain shows once per device: repeat visits go straight to the invitation
  const introSeenKey = `invites.introSeen.${slug}`
  const showIntro = options.intro === 'curtain' && !introDone && !localStorage.getItem(introSeenKey)
  const bank = options.bank
  const bankParts = typeof bank === 'object'
    ? [bank.bank, bank.number, bank.holder].filter(Boolean)
    : bank ? [bank] : []
  const mapHref = options.mapUrl
    || (invitation.venue ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invitation.venue)}` : '')
  const bgUrl = invitation.template_id ? `/backgrounds/${invitation.template_id}.jpg` : ''

  return (
    <main className={`pv tone-${tone} layout-${layout}`} style={bgUrl ? { backgroundImage: `url(${bgUrl})` } : undefined}>
      <div className="pv-veil" aria-hidden="true" />
      {showIntro && <CurtainIntro eventType={invitation.event_type} guest={invitedGuest} color={options.introColor} onDone={() => { localStorage.setItem(introSeenKey, '1'); setIntroDone(true) }} />}
      {options.music?.id && <MusicPlayer music={options.music} />}

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

        <section className="pv-section pv-rsvp">
          <h2>Ирэх эсэхээ мэдэгдээрэй</h2>
          {submitted ? (
            <div className="pv-thanks">Баярлалаа 💜<br /><span>Таны хариуг хүлээн авлаа</span></div>
          ) : (
            <>
              <div className="pv-choice">
                <button className={response === 'yes' ? 'selected' : ''} onClick={() => setResponse('yes')}>Тийм, ирнэ</button>
                <button className={response === 'no' ? 'selected' : ''} onClick={() => setResponse('no')}>Харамсалтай нь үгүй</button>
              </div>
              <label className="pv-field"><span className="pv-field-name"><User size={18} /> Таны нэр</span>
                <input type="text" value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="Нэрээ бичнэ үү" maxLength={80} />
              </label>
              <label className="pv-field"><span className="pv-field-name"><Phone size={18} /> Утасны дугаар</span>
                <input type="tel" value={guestPhone} onChange={(event) => setGuestPhone(event.target.value)} placeholder="9911xxxx" maxLength={20} />
              </label>
              {response === 'yes' && (
                <label className="pv-field"><span className="pv-field-name"><Users size={18} /> Хэдүүлээ ирэх вэ?</span>
                  <select value={partySize} onChange={(event) => setPartySize(Number(event.target.value))}>
                    {[1, 2, 3, 4, 5].map((size) => <option key={size} value={size}>{size}</option>)}
                  </select>
                </label>
              )}
              <textarea className="pv-wish" maxLength={300} value={wish} onChange={(event) => setWish(event.target.value)} placeholder="Мэндчилгээ, ерөөлөө үлдээгээрэй (заавал биш)" />
              <button className="pv-submit" disabled={!response} onClick={submitRsvp}>Хариу илгээх</button>
              {error && <p className="pv-error" role="alert">{error}</p>}
            </>
          )}
        </section>

        <a className="pv-back" href="/"><ArrowLeft size={15} /> Invites.mn</a>
      </div>
    </main>
  )
}
