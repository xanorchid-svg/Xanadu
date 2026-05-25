import { useEffect, useRef } from 'react'

// Sacred geometry star sizes — golden ratio proportions
const SIZES = [1, 1.618, 2.618, 1.272, 0.786]

function randomBetween(a, b) {
  return a + Math.random() * (b - a)
}

function generateStars(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: randomBetween(2, 98),       // % across container
    y: randomBetween(2, 98),       // % down container
    size: SIZES[i % SIZES.length] * randomBetween(0.7, 1.4),
    opacity: randomBetween(0.08, 0.32),
    speed: randomBetween(0.3, 1.1),
    angle: randomBetween(0, Math.PI * 2),
    pulse: randomBetween(2.5, 7),  // pulse period in seconds
    pulseOffset: randomBetween(0, Math.PI * 2),
  }))
}

export default function StarField({ count = 48, style = {} }) {
  const canvasRef = useRef(null)
  const starsRef = useRef(generateStars(count))
  const frameRef = useRef(null)
  const startRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const stars = starsRef.current

    const draw = (ts) => {
      if (!startRef.current) startRef.current = ts
      const elapsed = (ts - startRef.current) / 1000 // seconds

      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      stars.forEach(star => {
        // Slow drift
        star.x += Math.cos(star.angle) * star.speed * 0.008
        star.y += Math.sin(star.angle) * star.speed * 0.008

        // Wrap at edges
        if (star.x < 0) star.x = 100
        if (star.x > 100) star.x = 0
        if (star.y < 0) star.y = 100
        if (star.y > 100) star.y = 0

        // Gentle pulse
        const pulse = 0.5 + 0.5 * Math.sin((elapsed / star.pulse) * Math.PI * 2 + star.pulseOffset)
        const opacity = star.opacity * (0.6 + 0.4 * pulse)

        const px = (star.x / 100) * w
        const py = (star.y / 100) * h

        // Draw star: larger ones get a 4-point sparkle
        if (star.size > 2) {
          // 4-point cross sparkle for biggest stars
          const r = star.size
          ctx.save()
          ctx.globalAlpha = opacity * 0.9
          ctx.fillStyle = '#d4a84b'
          ctx.beginPath()
          ctx.ellipse(px, py, r * 0.28, r, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.beginPath()
          ctx.ellipse(px, py, r, r * 0.28, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        } else {
          // Simple circle dot
          ctx.save()
          ctx.globalAlpha = opacity
          ctx.fillStyle = '#d4a84b'
          ctx.beginPath()
          ctx.arc(px, py, star.size, 0, Math.PI * 2)
          ctx.fill()
          ctx.restore()
        }
      })

      frameRef.current = requestAnimationFrame(draw)
    }

    frameRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frameRef.current)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        ...style,
      }}
    />
  )
}
