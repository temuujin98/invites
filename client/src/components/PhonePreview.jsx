import { useEffect, useState } from 'react'

/*
 * Live preview of the real guest page inside a phone frame.
 *
 * It frames /demo/:templateId rather than re-drawing a mock card, so what the
 * host sees is the same layout, backdrop and veil a guest gets — an earlier
 * mock preview showed backdrops the guest page never rendered. The intro
 * animation is switched off so the sheet is visible straight away.
 *
 * The src is debounced: every keystroke would otherwise reload the frame.
 */
export default function PhonePreview({ templateId, backgroundId, title, venue, message, eventAt }) {
  const query = new URLSearchParams({ intro: 'off', cue: 'off' })
  if (backgroundId) query.set('bg', backgroundId)
  if (title) query.set('title', title)
  if (venue) query.set('venue', venue)
  if (message) query.set('message', message)
  if (eventAt) query.set('at', eventAt)
  const target = `/demo/${templateId}?${query}`

  const [src, setSrc] = useState(target)
  useEffect(() => {
    const timer = setTimeout(() => setSrc(target), 500)
    return () => clearTimeout(timer)
  }, [target])

  return (
    <div className="phone-preview">
      <div className="phone-frame">
        <span className="phone-notch" aria-hidden="true" />
        <iframe src={src} title="Урилга утсан дээр хэрхэн харагдах" loading="lazy" />
      </div>
      <a className="phone-preview-open" href={target} target="_blank" rel="noreferrer">Бүтэн хэмжээгээр нээх ↗</a>
    </div>
  )
}
