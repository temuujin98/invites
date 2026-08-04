/*
 * The curtain drawn as SVG rather than a CSS gradient.
 *
 * A repeating-linear-gradient can only make stripes; real velvet has folds
 * of uneven width, each lit on its crest and dark in its valley, hung under
 * a swagged valance with fringe. All of that is geometry, so it is drawn —
 * and because it is inline SVG the template's own fabric colours flow in
 * through props, no second copy per tone.
 */

/* fold widths in viewBox units, deliberately uneven — even spacing reads fake */
const FOLD_WIDTHS = [9, 6, 11, 7, 13, 8, 10, 6, 12, 9, 9]
const TOTAL = FOLD_WIDTHS.reduce((sum, width) => sum + width, 0)

function foldRects(idPrefix) {
  const rects = []
  let x = 0
  for (const width of FOLD_WIDTHS) {
    rects.push(<rect key={x} x={`${(x / TOTAL) * 100}%`} y="0" width={`${(width / TOTAL) * 100}%`} height="100%" fill={`url(#${idPrefix}-fold)`} />)
    x += width
  }
  return rects
}

/*
 * One panel of hanging velvet. `side` only picks unique gradient ids so two
 * panels can sit in the same document without clashing.
 */
export function CurtainPanel({ side, colors }) {
  const id = `cur-${side}`
  const [deep, mid, light] = colors
  return (
    <svg className="curtain-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        {/* objectBoundingBox units: the same gradient fits every fold width */}
        <linearGradient id={`${id}-fold`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={deep} />
          <stop offset="0.28" stopColor={mid} />
          <stop offset="0.46" stopColor={light} />
          <stop offset="0.62" stopColor={mid} />
          <stop offset="1" stopColor={deep} />
        </linearGradient>
        <linearGradient id={`${id}-drape`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#000" stopOpacity="0.55" />
          <stop offset="0.16" stopColor="#000" stopOpacity="0" />
          <stop offset="0.66" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      {foldRects(id)}
      <rect x="0" y="0" width="100%" height="100%" fill={`url(#${id}-drape)`} />
    </svg>
  )
}

/* y of the swag's lower edge at t (0..1) across one scallop */
const swagY = (t, depth, top) => top + Math.sin(Math.PI * t) * depth

/*
 * The valance: three swags of gathered fabric, a rosette where each pair
 * meets, and fringe hanging along the lower edge.
 */
export function CurtainValance({ colors, metal }) {
  const [deep, mid, light] = colors
  const swags = 3
  const width = 300
  const span = width / swags
  const depth = 26
  const top = 34

  // one closed path across all three swags
  let path = `M0 0 H${width} V${top}`
  for (let s = swags - 1; s >= 0; s -= 1) {
    const x0 = s * span
    path += ` Q${x0 + span * 0.5} ${top + depth * 1.5}, ${x0} ${top}`
  }
  path += ' Z'

  // fringe: short strokes following each scallop's curve
  const fringe = []
  for (let s = 0; s < swags; s += 1) {
    for (let i = 1; i < 26; i += 1) {
      const t = i / 26
      const x = s * span + t * span
      const y = swagY(t, depth * 1.13, top)
      fringe.push(<line key={`${s}-${i}`} x1={x} y1={y - 1} x2={x} y2={y + 9} stroke={metal} strokeWidth="1.1" strokeLinecap="round" opacity="0.75" />)
    }
  }

  return (
    <svg className="curtain-valance-svg" viewBox={`0 0 ${width} 78`} preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="val-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={light} />
          <stop offset="0.45" stopColor={mid} />
          <stop offset="1" stopColor={deep} />
        </linearGradient>
        <linearGradient id="val-gather" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.4" />
          <stop offset="0.5" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </linearGradient>
      </defs>

      <path d={path} fill="url(#val-fill)" />
      {/* gathered shading repeated over each swag */}
      {Array.from({ length: swags }, (_, s) => (
        <path key={s} d={`M${s * span} 0 H${(s + 1) * span} V${top} Q${s * span + span * 0.5} ${top + depth * 1.5}, ${s * span} ${top} Z`} fill="url(#val-gather)" />
      ))}
      {fringe}
      {/* rosettes where the swags are tied */}
      {Array.from({ length: swags + 1 }, (_, s) => (
        <g key={s} transform={`translate(${s * span} 8)`}>
          <circle r="7.5" fill={mid} />
          <circle r="7.5" fill="none" stroke={metal} strokeWidth="1.4" opacity="0.8" />
          <circle r="2.6" fill={metal} opacity="0.9" />
        </g>
      ))}
    </svg>
  )
}
