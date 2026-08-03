import { useState } from 'react'

/*
 * Brutalist-styled date+time picker built from selects, replacing the
 * native datetime-local input whose popup can't be themed.
 * Emits 'YYYY-MM-DDTHH:mm' (same shape as datetime-local) once all parts
 * are chosen, '' while partial. Partial picks live in local state.
 */
const months = ['1-р сар', '2-р сар', '3-р сар', '4-р сар', '5-р сар', '6-р сар', '7-р сар', '8-р сар', '9-р сар', '10-р сар', '11-р сар', '12-р сар']

function parse(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value || '')
  if (!match) return { y: '', mo: '', d: '', h: '', mi: '' }
  return { y: match[1], mo: match[2], d: match[3], h: match[4], mi: match[5] }
}

function daysInMonth(year, month) {
  if (!year || !month) return 31
  return new Date(Number(year), Number(month), 0).getDate()
}

const pad = (part) => String(part).padStart(2, '0')

function toValue(parts) {
  if (parts.y && parts.mo && parts.d && parts.h !== '' && parts.mi !== '') {
    return `${parts.y}-${pad(parts.mo)}-${pad(parts.d)}T${pad(parts.h)}:${pad(parts.mi)}`
  }
  return ''
}

export default function DateTimeField({ value, onChange }) {
  const [parts, setParts] = useState(() => parse(value))
  const [lastValue, setLastValue] = useState(value)

  /*
   * Sync down when the upstream value arrives later (e.g. edit page load).
   * Adjusted during render rather than in an effect — a partial pick emits
   * '' upstream, and that must not wipe the parts chosen so far.
   */
  if (value !== lastValue) {
    setLastValue(value)
    if (value && toValue(parse(value)) !== toValue(parts)) setParts(parse(value))
  }

  const nowYear = new Date().getFullYear()
  const years = [nowYear, nowYear + 1, nowYear + 2]
  const dayCount = daysInMonth(parts.y, parts.mo)

  /*
   * Next state is computed outside the updater: an updater may re-run during
   * render, and notifying the parent from there updates it mid-render.
   */
  function update(patch) {
    const next = { ...parts, ...patch }
    if (next.d && Number(next.d) > daysInMonth(next.y, next.mo)) next.d = pad(daysInMonth(next.y, next.mo))
    setParts(next)
    onChange(toValue(next))
  }

  return (
    <div className="kdate" role="group" aria-label="Огноо ба цаг">
      <select className="kdate-select" value={parts.y} onChange={(event) => update({ y: event.target.value })} aria-label="Он">
        <option value="" disabled>Он</option>
        {years.map((year) => <option key={year} value={String(year)}>{year}</option>)}
      </select>
      <select className="kdate-select" value={parts.mo} onChange={(event) => update({ mo: event.target.value })} aria-label="Сар">
        <option value="" disabled>Сар</option>
        {months.map((name, index) => <option key={name} value={pad(index + 1)}>{name}</option>)}
      </select>
      <select className="kdate-select" value={parts.d} onChange={(event) => update({ d: event.target.value })} aria-label="Өдөр">
        <option value="" disabled>Өдөр</option>
        {Array.from({ length: dayCount }, (_, index) => <option key={index + 1} value={pad(index + 1)}>{index + 1}</option>)}
      </select>
      <span className="kdate-sep" aria-hidden="true">·</span>
      <select className="kdate-select" value={parts.h} onChange={(event) => update({ h: event.target.value })} aria-label="Цаг">
        <option value="" disabled>Цаг</option>
        {Array.from({ length: 24 }, (_, index) => <option key={index} value={pad(index)}>{pad(index)}</option>)}
      </select>
      <select className="kdate-select" value={parts.mi} onChange={(event) => update({ mi: event.target.value })} aria-label="Минут">
        <option value="" disabled>Мин</option>
        {['00', '15', '30', '45'].map((minute) => <option key={minute} value={minute}>{minute}</option>)}
      </select>
    </div>
  )
}
