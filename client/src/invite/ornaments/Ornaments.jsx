/*
 * Ornaments drawn as SVG rather than generated images.
 *
 * For line ornament — filigree, scrollwork, a seal emblem — vector is the
 * right tool: a few KB instead of a few hundred, sharp at any size, and it
 * takes the template's colour straight from `currentColor` with no mask
 * trick and no second copy per tone.
 *
 * The two tiling pieces (lace edge, side vine) live as .svg files under
 * public/ornaments/ instead, because CSS background-repeat does the tiling.
 */

/* Corner flourish — drawn for the top-left, rotated into the other three */
export function Corner({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 120" fill="none" stroke="currentColor" aria-hidden="true">
      <path d="M4 46 C 4 21, 21 4, 46 4" strokeWidth="1.5" />
      <path d="M4 64 C 4 30, 30 4, 64 4" strokeWidth="0.9" opacity=".55" />
      <path d="M46 4 C 62 4, 74 8, 86 14" strokeWidth="1.2" />
      <path d="M4 46 C 4 62, 8 74, 14 86" strokeWidth="1.2" />
      <path d="M86 14 C 92 17, 96 20, 99 24" strokeWidth="0.8" opacity=".5" />
      <path d="M14 86 C 17 92, 20 96, 24 99" strokeWidth="0.8" opacity=".5" />
      <path
        d="M15 45 C 15 31, 31 15, 45 15 C 35 23, 27 31, 23 41 C 21 47, 17 49, 15 45 Z"
        fill="currentColor" stroke="none" opacity=".85"
      />
      <circle cx="32" cy="32" r="2.6" fill="currentColor" stroke="none" />
    </svg>
  )
}

/* Section divider — a medallion with a rule tapering away on both sides */
export function Divider({ className }) {
  return (
    <svg className={className} viewBox="0 0 300 40" fill="currentColor" aria-hidden="true">
      <path d="M18 20 L132 19.3 L132 20.7 Z" />
      <path d="M282 20 L168 19.3 L168 20.7 Z" />
      <path d="M150 7 L159 20 L150 33 L141 20 Z" opacity=".9" />
      <circle cx="150" cy="20" r="3.2" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="136" cy="20" r="1.6" />
      <circle cx="164" cy="20" r="1.6" />
    </svg>
  )
}

/* Emblem pressed into the wax seal */
export function SealEmblem({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <circle cx="50" cy="50" r="41" strokeWidth="2" />
        <circle cx="50" cy="50" r="35" strokeWidth="0.9" opacity=".7" />
      </g>
      <path
        d="M50 26 C 60 26, 68 33, 68 42 C 68 50, 61 55, 50 55 C 39 55, 32 50, 32 42 C 32 33, 40 26, 50 26 Z"
        fill="currentColor" opacity=".9"
      />
      <g fill="none" stroke="currentColor" strokeLinecap="round">
        <path d="M50 74 V44" strokeWidth="2.6" />
        <path d="M50 58 L40 49" strokeWidth="1.8" />
        <path d="M50 58 L60 49" strokeWidth="1.8" />
        <path d="M50 50 L43 43" strokeWidth="1.4" />
        <path d="M50 50 L57 43" strokeWidth="1.4" />
        <path d="M38 75 H62" strokeWidth="1.8" />
      </g>
    </svg>
  )
}
