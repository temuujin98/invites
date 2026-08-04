import { useState } from 'react'
import { getIntroTheme, introStyle } from './themes'
import Particles from './Particles'

/*
 * Curtain intro (paid add-on): two velvet panels part when the guest
 * presses the seal. The panels gather toward their rod ends rather than
 * sliding flat, the right one trails the left, and stage light blooms
 * through the gap — a curtain has weight and is never quite symmetric.
 */
export default function CurtainIntro({ eventType, guest, tone, color, onDone }) {
  const [opening, setOpening] = useState(false)
  const theme = getIntroTheme(tone, color)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function openCurtains() {
    // synchronous dispatch keeps the user-gesture context for audio start
    window.dispatchEvent(new Event('invite-open-clicked'))
    if (reduceMotion) { onDone(); return }
    setOpening(true)
    setTimeout(onDone, 2400)
  }

  return (
    <div
      className={`intro-overlay curtain-intro ${opening ? 'opening' : ''}`}
      style={introStyle(theme)}
      role="dialog"
      aria-label="Урилга нээх"
    >
      <div className="curtain-stagelight" aria-hidden="true" />
      <Particles preset={theme.particle} />

      <div className="curtain curtain-left" aria-hidden="true">
        <span className="curtain-sheen" />
      </div>
      <div className="curtain curtain-right" aria-hidden="true">
        <span className="curtain-sheen" />
      </div>
      <div className="curtain-rod" aria-hidden="true" />

      <div className="intro-center">
        <p className="intro-ornament" aria-hidden="true"><span /> ✦ <span /></p>
        <p className="intro-type">{eventType}</p>
        {guest && <p className="intro-guest">Хүндэт {guest} танд</p>}
        <button className="intro-seal" onClick={openCurtains} aria-label="Урилгыг нээх">
          <span className="intro-seal-ring" aria-hidden="true" />
          <span className="intro-seal-text">Нээх</span>
        </button>
        <p className="intro-ornament" aria-hidden="true"><span /> ✦ <span /></p>
      </div>
    </div>
  )
}
