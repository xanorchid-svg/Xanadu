/**
 * The Xanadu emblem, built from the same aligned layers as the app and the pitch deck,
 * cut from the original artwork (the "-lit" colouring, made to glow on navy):
 *  - logo-static.png: petals, stars and the vertical needle (never move)
 *  - logo-orbit-outer.png: the outer fine lines (large rings and side curves)
 *  - logo-orbit-inner.png: the inner fine lines (the diamond around the star)
 *  - logo-nucleus.png: the central star, softly glowing
 * When animated, the two sets of lines turn around the central star at different speeds,
 * in opposite directions and on slightly different tilts, like electrons around a nucleus.
 * Each full turn returns to the exact logo, so the design is unchanged at rest.
 *
 * The layers are cropped to the artwork (376 × 518) with the star centred horizontally.
 * NUCLEUS_ORIGIN is the star's centre, used for the orbits and for zooming into the logo.
 */
export const NUCLEUS_ORIGIN = '49.918% 56.283%'

// `electrons` is accepted for older call sites but no longer draws anything:
// the logo matches the app exactly.
// eslint-disable-next-line no-unused-vars
export default function Emblem({ animated = true, electrons, drawIn = false, className = '' }) {
  return (
    <div className={`emblem ${animated ? 'is-animated' : ''} ${drawIn ? 'draw-in' : ''} ${className}`} role="img" aria-label="Xanadu emblem">
      <img src="/logo-static.png" alt="" draggable={false} className="em-static" />
      <img src="/logo-orbit-outer.png" alt="" draggable={false} className="em-orbit em-orbit-outer" />
      <img src="/logo-orbit-inner.png" alt="" draggable={false} className="em-orbit em-orbit-inner" />
      <img src="/logo-nucleus.png" alt="" draggable={false} className="em-nucleus" />
    </div>
  )
}
