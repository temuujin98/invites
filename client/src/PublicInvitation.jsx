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
              // loop the clip
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
function CurtainIntro({ eventType, guest, onDone }) {
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
    <div className={`intro-overlay ${opening ? 'opening' : ''}`} role="dialog" aria-label="Урилга нээх">
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
    <div className="countdown" aria-label="Тооллого">
      {units.map(([value, label]) => (
        <div className="count-unit" key={label}><b>{value}</b><small>{label}</small></div>
      ))}
    </div>
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
    // graceful fallback while the phone/wish columns are not migrated yet
    if (submitError && /column|schema/i.test(submitError.message || '')) {
      ({ error: submitError } = await supabase.from('rsvps').insert(base))
    }
    if (submitError) setError('Хариу илгээж чадсангүй. Дахин оролдоно уу')
    else setSubmitted(true)
  }

  if (!isSupabaseConfigured) {
    return <main className="public-invite"><p>Тохиргоо дутуу байна.</p></main>
  }

  if (loading) {
    return <main className="public-invite"><a className="public-brand" href="/"><img src="/brand/invites.mn/logo-wordmark-light.png" alt="INVITES.MN" /></a><p style={{ marginTop: 60 }}>Урилгыг ачаалж байна…</p></main>
  }

  if (!invitation) {
    return (
      <main className="public-invite">
        <a className="public-brand" href="/"><img src="/brand/invites.mn/logo-wordmark-light.png" alt="INVITES.MN" /></a>
        <section className="public-card"><h1 style={{ fontSize: '2rem', letterSpacing: 0 }}>{error || 'Урилга олдсонгүй'}</h1></section>
        <a className="public-back" href="/"><ArrowLeft size={15} /> Invites.mn</a>
      </main>
    )
  }

  const layout = getTemplate(invitation.template_id)?.layout || 'classic'
  const options = invitation.options || {}
  const showIntro = options.intro === 'curtain' && !introDone
  const mapHref = options.mapUrl
    || (invitation.venue ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invitation.venue)}` : '')

  return (
    <main className="public-invite">
      {showIntro && <CurtainIntro eventType={invitation.event_type} guest={invitedGuest} onDone={() => setIntroDone(true)} />}
      {options.music?.id && <MusicPlayer music={options.music} />}
      <a className="public-brand" href="/"><img src="/brand/invites.mn/logo-wordmark-light.png" alt="INVITES.MN" /></a>

      <section className={`public-card ${invitation.theme || 'lavender'} layout-${layout} ${invitation.template_id ? `bg-${invitation.template_id}` : ''}`}>
        {options.coverUrl && <img className="public-cover" src={options.coverUrl} alt="" />}
        {invitedGuest && <p className="public-guest">Хүндэт <b>{invitedGuest}</b> танд</p>}
        <p className="public-type">{invitation.event_type}</p>
        <h1>{invitation.title}</h1>
        {invitation.message && <p className="public-message">{invitation.message}</p>}
        <div className="event-facts">
          <p><CalendarDays size={18} /><span>{formatEventDate(invitation.event_at)}</span></p>
          <p>
            <MapPin size={18} />
            <span>
              {invitation.venue || 'Байршил удахгүй зарлагдана'}
              {mapHref && <> · <a className="map-link" href={mapHref} target="_blank" rel="noreferrer">Газрын зурагт харах</a></>}
            </span>
          </p>
          {options.phone && <p><Phone size={18} /><span><a className="map-link" href={`tel:${options.phone}`}>{options.phone}</a></span></p>}
        </div>
      </section>

      <Countdown target={invitation.event_at} />

      {options.program?.length > 0 && (
        <section className="public-section">
          <p className="public-type">ХӨТӨЛБӨР</p>
          <div className="program-list">
            {options.program.map((row, index) => (
              <p className="program-item" key={index}><b>{row.time}</b><span>{row.activity}</span></p>
            ))}
          </div>
        </section>
      )}

      {options.note && (
        <section className="public-section">
          <p className="public-type">ТЭМДЭГЛЭЛ</p>
          <p className="public-note">{options.note}</p>
        </section>
      )}

      {options.bank && (
        <section className="public-section">
          <p className="public-type">ХИШИГ ХҮРГЭХ</p>
          <p className="public-note bank-note"><Gift size={16} /> {options.bank}</p>
        </section>
      )}

      <section className="rsvp">
        <p className="public-type">RSVP</p>
        <h2>Та ирэх үү</h2>
        {submitted ? (
          <div className="thanks">Баярлалаа<br /><span>Таны хариуг хүлээн авлаа</span></div>
        ) : (
          <>
            <div className="response-buttons">
              <button className={response === 'yes' ? 'selected' : ''} onClick={() => setResponse('yes')}>Тийм</button>
              <button className={response === 'no' ? 'selected' : ''} onClick={() => setResponse('no')}>Харамсалтай нь үгүй</button>
            </div>
            <label><User size={17} /> Таны нэр
              <input type="text" value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="Нэрээ бичнэ үү" maxLength={80} />
            </label>
            <label style={{ marginTop: 10 }}><Phone size={17} /> Утасны дугаар
              <input type="tel" value={guestPhone} onChange={(event) => setGuestPhone(event.target.value)} placeholder="9911xxxx" maxLength={20} />
            </label>
            {response === 'yes' && (
              <label style={{ marginTop: 10 }}><Users size={17} /> Зочдын тоо
                <select value={partySize} onChange={(event) => setPartySize(Number(event.target.value))}>
                  {[1, 2, 3, 4, 5].map((size) => <option key={size} value={size}>{size}</option>)}
                </select>
              </label>
            )}
            <textarea className="wish-input" maxLength={300} value={wish} onChange={(event) => setWish(event.target.value)} placeholder="Мэндчилгээ, ерөөлөө үлдээгээрэй (заавал биш)" />
            <button className="rsvp-submit" disabled={!response} onClick={submitRsvp}>Хариу илгээх</button>
            {error && <p role="alert">{error}</p>}
          </>
        )}
      </section>

      <a className="public-back" href="/"><ArrowLeft size={15} /> Invites.mn</a>
    </main>
  )
}
