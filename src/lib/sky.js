// A tiny shared store for the living sky. Any section can tint it; the Aurora eases toward it.
const hexToRgb = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

export const sky = {
  tint: [0.71, 0.55, 0.88], // violet by default
  tintAmount: 0,
  velocity: 0, // smoothed scroll velocity, feeds the warp
  mouse: [0.5, 0.5],
}

export function tintSky(hex, amount = 0.85) {
  if (!hex) {
    sky.tintAmount = 0
    return
  }
  sky.tint = hexToRgb(hex)
  sky.tintAmount = amount
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const isTouch = () =>
  typeof window !== 'undefined' && window.matchMedia('(hover: none), (pointer: coarse)').matches
