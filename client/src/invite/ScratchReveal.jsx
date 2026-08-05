import { useEffect, useRef, useState } from 'react'

/*
 * Scratch-to-reveal: the date sits under a foil layer the guest rubs away.
 *
 * Progressive enhancement by construction — the children are rendered
 * normally and the canvas is only painted over them once JS runs. If
 * anything here fails, or motion is reduced, the guest simply sees the
 * date. A date must never be hidden behind a broken effect.
 */
export default function ScratchReveal({ children, hint = 'Хусаж огноогоо ил гаргаарай', color = '#c8b18a' }) {
  const canvasRef = useRef(null)
  // decided at render, not in an effect: under reduced motion there is
  // never a foil to rub, so the date is simply shown
  const [revealed, setRevealed] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    if (revealed) return undefined
    const canvas = canvasRef.current
    if (!canvas) return undefined
    // no 2d context: leave the canvas transparent so the date shows through
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return undefined

    const ratio = Math.min(window.devicePixelRatio || 1, 2)
    let width = 0
    let height = 0

    function paintFoil() {
      width = canvas.clientWidth
      height = canvas.clientHeight
      if (!width || !height) return
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      const foil = ctx.createLinearGradient(0, 0, width, height)
      foil.addColorStop(0, color)
      foil.addColorStop(0.35, '#ffffff')
      foil.addColorStop(0.5, color)
      foil.addColorStop(0.75, '#ffffff')
      foil.addColorStop(1, color)
      ctx.globalCompositeOperation = 'source-over'
      ctx.fillStyle = foil
      ctx.fillRect(0, 0, width, height)
      // a little grain so it reads as foil rather than a flat swatch
      ctx.globalAlpha = 0.08
      for (let i = 0; i < width * height / 220; i += 1) {
        ctx.fillStyle = i % 2 ? '#000' : '#fff'
        ctx.fillRect(Math.random() * width, Math.random() * height, 2, 2)
      }
      ctx.globalAlpha = 1
    }

    paintFoil()

    let scratching = false
    let checkAt = 0

    function erase(event) {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath()
      ctx.arc(x, y, Math.max(18, Math.min(width, height) * 0.09), 0, Math.PI * 2)
      ctx.fill()

      // sampling every pixel on every move would stutter on a phone
      const now = performance.now()
      if (now - checkAt < 220) return
      checkAt = now
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data
      let clear = 0
      let total = 0
      for (let i = 3; i < data.length; i += 64) { total += 1; if (data[i] < 40) clear += 1 }
      if (total && clear / total > 0.5) setRevealed(true)
    }

    const down = (event) => { scratching = true; canvas.setPointerCapture?.(event.pointerId); erase(event) }
    const move = (event) => { if (scratching) erase(event) }
    const up = () => { scratching = false }

    canvas.addEventListener('pointerdown', down)
    canvas.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    window.addEventListener('resize', paintFoil)

    return () => {
      canvas.removeEventListener('pointerdown', down)
      canvas.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      window.removeEventListener('resize', paintFoil)
    }
  }, [revealed, color])

  return (
    <div className={`scratch ${revealed ? 'done' : ''}`}>
      <div className="scratch-under">{children}</div>
      {!revealed && (
        <>
          <canvas ref={canvasRef} className="scratch-foil" aria-hidden="true" />
          <p className="scratch-hint">✦ {hint} ✦</p>
        </>
      )}
    </div>
  )
}
