import { useState } from 'react'
import { getIntroTheme, introStyle } from './themes'
import Particles from './Particles'

/*
 * Envelope intro: a sealed letter opens. The wax breaks, the flap falls
 * back — casting a moving shadow on the paper below, which is what sells
 * the thickness — then the letter rises out and the overlay clears.
 */
export default function EnvelopeIntro({ eventType, guest, tone, color, onDone }) {
  const [opening, setOpening] = useState(false)
  const theme = getIntroTheme(tone, color)
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function openEnvelope() {
    window.dispatchEvent(new Event('invite-open-clicked'))
    if (reduceMotion) { onDone(); return }
    setOpening(true)
    setTimeout(onDone, 2700)
  }

  return (
    <div
      className={`intro-overlay env ${opening ? 'opening' : ''}`}
      style={introStyle(theme)}
      role="dialog"
      aria-label="Урилга нээх"
    >
      <Particles preset={theme.particle} />

      <div className="env-stage">
        <div className="envelope">
          <div className="env-back" aria-hidden="true" />

          <div className="env-letter">
            <span className="env-letter-rule" aria-hidden="true" />
            <p className="env-letter-type">{eventType}</p>
            {guest && <p className="env-letter-guest">Хүндэт {guest} танд</p>}
            <p className="env-letter-mark" aria-hidden="true">✦</p>
            <span className="env-letter-rule" aria-hidden="true" />
          </div>

          {/* shadow the flap throws across the letter as it lifts */}
          <div className="env-flap-shadow" aria-hidden="true" />

          <div className="env-front" aria-hidden="true" />
          <div className="env-flap" aria-hidden="true"><span className="env-flap-edge" /></div>

          <button className="env-seal" onClick={openEnvelope} aria-label="Урилгыг нээх">
            <span className="env-seal-face" aria-hidden="true" />
            <span className="env-seal-mark">✦</span>
          </button>
        </div>
        <p className="env-hint">Лац дээр дарж урилгаа нээгээрэй</p>
      </div>
    </div>
  )
}
