import { useId } from 'react'

/**
 * The Xanadu portal emblem, redrawn as vector layers so it stays crisp at any size:
 *  - static: the needle, the stars and the four iridescent petals
 *  - outer orbit: the two great rings and the outer lens lines
 *  - inner orbit: the diamond around the star
 *  - nucleus: the central star, breathing light
 *  - electrons (optional): small sparks travelling on tilted orbits
 * The two orbit layers turn in 3D around the star at different speeds and opposite directions.
 * Each full turn returns to the exact logo.
 */

const star = (cx, cy, rx, ry) =>
  `M${cx},${cy - ry} Q${cx},${cy} ${cx + rx},${cy} Q${cx},${cy} ${cx},${cy + ry} Q${cx},${cy} ${cx - rx},${cy} Q${cx},${cy} ${cx},${cy - ry}Z`

// upper-left petal; the other three are mirrors of it
const PETAL = 'M200,148 C200,212 92,214 52,300 L132,300 C160,262 200,246 200,192 Z'

const PETALS = [
  { key: 'ul', t: '', stops: ['#E8BF8A', '#6FB7BF', '#8F9BE6', '#5b4a8c'] },
  { key: 'ur', t: 'translate(400,0) scale(-1,1)', stops: ['#E8BF8A', '#E09AC4', '#B58BE0', '#4a2f5e'] },
  { key: 'll', t: 'translate(0,600) scale(1,-1)', stops: ['#c9a25f', '#9DBB7A', '#7b8f4a', '#4f5f3a'] },
  { key: 'lr', t: 'translate(400,600) scale(-1,-1)', stops: ['#c9a25f', '#8F9BE6', '#6FB7BF', '#3e4f86'] },
]

export default function Emblem({ animated = true, electrons = false, drawIn = false, className = '' }) {
  const id = useId().replace(/:/g, '')
  const g = (n) => `${id}-${n}`
  const lineStroke = `url(#${g('line')})`

  const shimmer = (dur, from = 0) =>
    animated ? (
      <animateTransform attributeName="gradientTransform" type="rotate"
        values={`${from} .5 .5;${from + 360} .5 .5`} dur={dur} repeatCount="indefinite" />
    ) : null

  const Defs = () => (
    <defs>
      <linearGradient id={g('line')} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#D2B488" />
        <stop offset=".35" stopColor="#E8BF8A" />
        <stop offset=".55" stopColor="#B58BE0" />
        <stop offset=".75" stopColor="#6FB7BF" />
        <stop offset="1" stopColor="#D2B488" />
        {shimmer('16s')}
      </linearGradient>
      <radialGradient id={g('halo')} cx=".5" cy=".5" r=".5">
        <stop offset="0" stopColor="#FFF6E0" stopOpacity=".9" />
        <stop offset=".3" stopColor="#E8BF8A" stopOpacity=".45" />
        <stop offset=".65" stopColor="#E09AC4" stopOpacity=".12" />
        <stop offset="1" stopColor="#B58BE0" stopOpacity="0" />
      </radialGradient>
      <radialGradient id={g('gold')} cx=".5" cy=".5" r=".6">
        <stop offset="0" stopColor="#FFF4DA" />
        <stop offset=".45" stopColor="#E8BF8A" />
        <stop offset="1" stopColor="#B8862A" />
      </radialGradient>
      {PETALS.map((p, i) => (
        <linearGradient key={p.key} id={g(p.key)} x1="0" y1="0" x2="1" y2="1">
          {p.stops.map((c, j) => <stop key={j} offset={j / (p.stops.length - 1)} stopColor={c} />)}
          {shimmer(`${11 + i * 2}s`, i * 70)}
        </linearGradient>
      ))}
    </defs>
  )

  // gradients live once, in the first layer; the other layers reference them by id
  const svg = (children, cls, withDefs = false) => (
    <svg className={`emblem-layer ${cls}`} viewBox="0 0 400 600" aria-hidden="true">
      {withDefs && <Defs />}
      {children}
    </svg>
  )

  return (
    <div className={`emblem ${animated ? 'is-animated' : ''} ${drawIn ? 'draw-in' : ''} ${className}`} role="img" aria-label="Xanadu emblem">
      {svg(
        <g fill="none" stroke={lineStroke} strokeWidth="1.1" strokeLinecap="round">
          <circle className="ln" pathLength="1" cx="200" cy="232" r="104" />
          <circle className="ln" pathLength="1" cx="200" cy="368" r="104" />
          <path className="ln" pathLength="1" d="M200,138 C120,192 72,250 52,300 C72,350 120,408 200,462" />
          <path className="ln" pathLength="1" d="M200,138 C280,192 328,250 348,300 C328,350 280,408 200,462" />
          <circle cx="52" cy="300" r="2.4" fill="#9DBB7A" stroke="none" />
          <circle cx="348" cy="300" r="2.4" fill="#E09AC4" stroke="none" />
        </g>,
        'orbit-outer',
        true
      )}

      {svg(
        <g>
          <line className="ln" pathLength="1" x1="200" y1="62" x2="200" y2="500" stroke={lineStroke} strokeWidth="1.2" />
          <path d={star(200, 112, 9, 20)} fill={`url(#${g('gold')})`} />
          <path d={star(44, 300, 6, 9)} fill="#9DBB7A" opacity=".9" />
          <path d={star(356, 300, 6, 9)} fill="#E09AC4" opacity=".9" />
          <circle cx="200" cy="514" r="2" fill="#D2B488" />
          <circle cx="200" cy="526" r="1.6" fill="#D2B488" opacity=".8" />
          <circle cx="200" cy="536" r="1.2" fill="#D2B488" opacity=".6" />
          <g className="petals">
            {PETALS.map((p) => (
              <g key={p.key} transform={p.t}>
                <path className="petal" d={PETAL} fill={`url(#${g(p.key)})`} />
              </g>
            ))}
          </g>
        </g>,
        'static'
      )}

      {svg(
        <g fill="none" stroke={lineStroke} strokeWidth="1" strokeLinecap="round">
          <path className="ln" pathLength="1" d="M200,168 Q170,236 134,300 Q170,364 200,432 Q230,364 266,300 Q232,232 200,168 Z" />
          <path className="ln" pathLength="1" d="M200,92 Q150,140 140,196 M200,92 Q250,140 260,196" />
          <path d="M150,300 h18 M232,300 h18" />
        </g>,
        'orbit-inner'
      )}

      {electrons &&
        svg(
          <g>
            {[
              { rot: -28, rx: 168, ry: 46, dur: '7s', c: '#6FB7BF' },
              { rot: 32, rx: 150, ry: 40, dur: '9.5s', c: '#E09AC4' },
              { rot: 90, rx: 200, ry: 30, dur: '12s', c: '#E8BF8A' },
            ].map((e, i) => (
              <g key={i} transform={`rotate(${e.rot} 200 300)`}>
                <ellipse cx="200" cy="300" rx={e.rx} ry={e.ry} fill="none" stroke={e.c} strokeOpacity=".16" strokeWidth=".8" />
                {animated && (
                  <circle r="3" fill={e.c} className="electron">
                    <animateMotion dur={e.dur} repeatCount="indefinite"
                      path={`M${200 - e.rx},300 a${e.rx},${e.ry} 0 1,0 ${e.rx * 2},0 a${e.rx},${e.ry} 0 1,0 -${e.rx * 2},0`} />
                  </circle>
                )}
              </g>
            ))}
          </g>,
          'electrons'
        )}

      {svg(
        <g className="nucleus">
          <circle cx="200" cy="300" r="70" fill={`url(#${g('halo')})`} className="nucleus-halo" />
          <path d={star(200, 300, 26, 36)} fill={`url(#${g('gold')})`} />
        </g>,
        'nucleus-layer'
      )}
    </div>
  )
}
