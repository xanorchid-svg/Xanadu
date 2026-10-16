import { useId } from 'react'

/**
 * One fine-line symbol per path, drawn in the door's own colours.
 *  seeker      — an eye of light with a star in it: the one who is looking
 *  container   — an arch over the land with a sun rising inside: the space that holds
 *  facilitator — a flame with an inner flame and rays: the one who carries the light
 */
const star = (cx, cy, r, k = 0.28) =>
  `M${cx},${cy - r} Q${cx + r * k},${cy - r * k} ${cx + r},${cy} Q${cx + r * k},${cy + r * k} ${cx},${cy + r} Q${cx - r * k},${cy + r * k} ${cx - r},${cy} Q${cx - r * k},${cy - r * k} ${cx},${cy - r}Z`

export default function Sigil({ kind, hues }) {
  const id = useId().replace(/:/g, '')
  const g = `sg-${id}`
  const stroke = `url(#${g})`
  const common = { fill: 'none', stroke, strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round', pathLength: 1, className: 'sg-ln' }

  return (
    <svg className={`sigil sigil-${kind}`} viewBox="0 0 80 80" aria-hidden="true">
      <defs>
        <linearGradient id={g} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={hues[0]} />
          <stop offset=".5" stopColor={hues[1]} />
          <stop offset="1" stopColor={hues[2]} />
          <animateTransform attributeName="gradientTransform" type="rotate" values="0 .5 .5;360 .5 .5" dur="9s" repeatCount="indefinite" />
        </linearGradient>
        <radialGradient id={`${g}-c`}>
          <stop offset="0" stopColor="#FFF8EA" />
          <stop offset=".5" stopColor={hues[1]} />
          <stop offset="1" stopColor={hues[1]} stopOpacity="0" />
        </radialGradient>
      </defs>

      {kind === 'seeker' && (
        <>
          <path {...common} d="M6,40 Q40,8 74,40 Q40,72 6,40 Z" />
          <circle {...common} cx="40" cy="40" r="14" />
          <circle cx="40" cy="40" r="14" fill={`url(#${g}-c)`} opacity=".35" className="sg-glow" />
          <path d={star(40, 40, 9)} fill="#FFF3DC" className="sg-star" />
          <path {...common} d="M40,4 L40,12 M40,68 L40,76" opacity=".6" />
        </>
      )}

      {kind === 'container' && (
        <>
          <path {...common} d="M14,66 L14,36 A26,26 0 0 1 66,36 L66,66" />
          <path {...common} d="M22,66 L22,38 A18,18 0 0 1 58,38 L58,66" opacity=".55" />
          <path {...common} d="M6,66 L74,66" />
          <circle cx="40" cy="56" r="10" fill={`url(#${g}-c)`} className="sg-sun" />
          <path {...common} d="M30,66 A10,10 0 0 1 50,66" />
          <path d={star(40, 20, 4)} fill="#FFF3DC" className="sg-star" />
        </>
      )}

      {kind === 'facilitator' && (
        <>
          <path {...common} d="M40,8 C52,26 60,36 60,50 A20,20 0 0 1 20,50 C20,36 28,26 40,8 Z" />
          <path {...common} d="M40,30 C46,40 50,45 50,53 A10,10 0 0 1 30,53 C30,45 34,40 40,30 Z" opacity=".7" />
          <ellipse cx="40" cy="52" rx="7" ry="9" fill={`url(#${g}-c)`} className="sg-flame" />
          <g className="sg-rays" opacity=".7">
            <path {...common} d="M10,30 L4,26 M70,30 L76,26 M8,48 L2,48 M72,48 L78,48" />
          </g>
        </>
      )}
    </svg>
  )
}
