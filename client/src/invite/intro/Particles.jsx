import { useEffect, useRef } from 'react'
import { startParticles } from './particleField'

/* Canvas layer of drifting petals / confetti / embers behind the intro. */
export default function Particles({ preset }) {
  const ref = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    return startParticles(ref.current, preset)
  }, [preset])

  return <canvas ref={ref} className="intro-particles" aria-hidden="true" />
}
