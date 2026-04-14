// role: 'seeker' | 'facilitator' | 'container'
export default function SacredTriangle({ role }) {
  const DIM = 220
  const CX = DIM / 2
  // Equilateral triangle points: top, bottom-right, bottom-left
  const top   = { x: CX,       y: 18  }
  const right = { x: DIM - 18, y: DIM - 24 }
  const left  = { x: 18,       y: DIM - 24 }

  // Each role owns one corner and one color
  const roles = {
    container:   { point: top,   color: '#4f5f4a', label: 'Container',   labelPos: { x: CX,       y: 8   }, anchor: 'middle' },
    facilitator: { point: right, color: '#b8862a', label: 'Facilitator', labelPos: { x: DIM - 4,  y: DIM - 10 }, anchor: 'end'    },
    seeker:      { point: left,  color: '#6b2d4e', label: 'Seeker',      labelPos: { x: 4,        y: DIM - 10 }, anchor: 'start'  },
  }

  const active  = roles[role]
  const others  = Object.entries(roles).filter(([k]) => k !== role)

  // Triangle path
  const triPath = `M ${top.x} ${top.y} L ${right.x} ${right.y} L ${left.x} ${left.y} Z`

  // Inner circle — sacred geometry
  const inRadius = 38
  const inCY = (top.y + right.y + left.y) / 3
  const inCX = CX

  return (
    <svg
      width={DIM}
      height={DIM}
      viewBox={`0 0 ${DIM} ${DIM}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', margin: '0 auto' }}
      aria-label={`Sacred triangle — ${role} highlighted`}
    >
      {/* Outer triangle — muted */}
      <path d={triPath} stroke="rgba(184,134,42,0.18)" strokeWidth="1" fill="none" />

      {/* Inner circle */}
      <circle cx={inCX} cy={inCY + 4} r={inRadius} stroke="rgba(184,134,42,0.12)" strokeWidth="1" fill="none" />

      {/* Lines from centre to each corner — subtle */}
      {[top, right, left].map((pt, i) => (
        <line key={i} x1={inCX} y1={inCY + 4} x2={pt.x} y2={pt.y}
          stroke="rgba(184,134,42,0.08)" strokeWidth="1" />
      ))}

      {/* Inactive corner dots */}
      {others.map(([k, r]) => (
        <circle key={k} cx={r.point.x} cy={r.point.y} r="5"
          fill="rgba(184,134,42,0.15)" />
      ))}

      {/* Inactive corner labels */}
      {others.map(([k, r]) => (
        <text key={`lbl-${k}`}
          x={r.labelPos.x} y={r.labelPos.y}
          textAnchor={r.anchor}
          fontFamily="Raleway, sans-serif"
          fontSize="9"
          letterSpacing="0.2em"
          textTransform="uppercase"
          fill="rgba(184,134,42,0.3)"
          style={{ textTransform: 'uppercase' }}
        >
          {r.label.toUpperCase()}
        </text>
      ))}

      {/* Active corner — glowing dot */}
      <circle cx={active.point.x} cy={active.point.y} r="10"
        fill={active.color} opacity="0.15" />
      <circle cx={active.point.x} cy={active.point.y} r="5"
        fill={active.color} opacity="0.9" />

      {/* Active highlight lines from active corner to others */}
      {others.map(([k, r]) => (
        <line key={`hl-${k}`}
          x1={active.point.x} y1={active.point.y}
          x2={r.point.x} y2={r.point.y}
          stroke={active.color} strokeWidth="1" opacity="0.35" />
      ))}

      {/* Active corner label */}
      <text
        x={active.labelPos.x} y={active.labelPos.y}
        textAnchor={active.anchor}
        fontFamily="Raleway, sans-serif"
        fontSize="9"
        fill={active.color}
        opacity="0.9"
        style={{ textTransform: 'uppercase', letterSpacing: '0.2em' }}
      >
        {active.label.toUpperCase()}
      </text>

      {/* Centre mark */}
      <circle cx={inCX} cy={inCY + 4} r="2.5"
        fill="rgba(184,134,42,0.4)" />
    </svg>
  )
}
