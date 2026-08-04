/*
 * Pieces every invitation layout shares: music, the paid intro effects,
 * countdown, gallery and the RSVP form. Layouts compose these; only the
 * arrangement and styling differ between templates.
 */
import { useEffect, useRef, useState } from 'react'
import { Music, Pause, Phone, User, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'

/*
 * YouTube background music: hidden iframe player + a floating toggle.
 * Loops the chosen clip (or the whole track); starts on the guest's
 * first tap — either the floating button or the intro open button.
 */
export function MusicPlayer({ music }) {
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

export function Countdown({ target }) {
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
    <div className="pv-countdown" data-reveal aria-label="Тооллого">
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
export function Gallery({ images }) {
  return (
    <section className="pv-gallery" data-reveal aria-label="Зургийн цомог">
      <div className={`pv-gallery-track ${images.length === 1 ? 'single' : ''}`}>
        {images.map((url, index) => (
          <img key={url} src={url} alt={`Зураг ${index + 1}`} loading="lazy" />
        ))}
      </div>
      {images.length > 1 && <p className="pv-gallery-hint">← зургуудыг гүйлгэж үзээрэй →</p>}
    </section>
  )
}

/*
 * RSVP form. Owns its own state so every layout can drop it in.
 * `demo` short-circuits the insert so /demo/:id stays read-only.
 */
export function RsvpForm({ invitationId, demo, initialGuest, heading = 'Ирэх эсэхээ мэдэгдээрэй' }) {
  const [response, setResponse] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [guestName, setGuestName] = useState(initialGuest || '')
  const [guestPhone, setGuestPhone] = useState('')
  const [wish, setWish] = useState('')
  const [partySize, setPartySize] = useState(1)
  const [error, setError] = useState('')

  async function submitRsvp() {
    if (!response) return
    if (demo) { setSubmitted(true); return }
    setError('')
    const base = {
      invitation_id: invitationId,
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

  return (
    <section className="pv-section pv-rsvp" data-reveal>
      <h2>{heading}</h2>
      {submitted ? (
        <div className="pv-thanks">Баярлалаа 💜<br /><span>Таны хариуг хүлээн авлаа</span></div>
      ) : (
        <>
          <div className="pv-choice">
            <button className={response === 'yes' ? 'selected' : ''} onClick={() => setResponse('yes')}>Тийм, ирнэ</button>
            <button className={response === 'no' ? 'selected' : ''} onClick={() => setResponse('no')}>Харамсалтай нь үгүй</button>
          </div>
          <label className="pv-field"><span className="pv-field-name"><User size={18} /> Таны нэр</span>
            <input type="text" lang="mn" value={guestName} onChange={(event) => setGuestName(event.target.value)} placeholder="Нэрээ бичнэ үү" maxLength={80} />
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
          <textarea className="pv-wish" lang="mn" maxLength={300} value={wish} onChange={(event) => setWish(event.target.value)} placeholder="Мэндчилгээ, ерөөлөө үлдээгээрэй (заавал биш)" />
          <button className="pv-submit" disabled={!response} onClick={submitRsvp}>Хариу илгээх</button>
          {error && <p className="pv-error" role="alert">{error}</p>}
        </>
      )}
    </section>
  )
}
