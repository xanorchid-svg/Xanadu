import { useEffect, useRef } from 'react'
import { sky, prefersReducedMotion, isTouch } from '../lib/sky'
import { scrollState } from '../lib/scroll'

// A living iridescent aurora behind the whole page.
// Domain-warped noise, coloured with the logo's sheen (sage → teal → periwinkle → violet → rose → gold).
// Scroll speed bends it; the cursor pulls it; sections can tint it.

const VERT = `
attribute vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform float uScroll;
uniform float uVel;
uniform vec2 uMouse;
uniform vec3 uTint;
uniform float uTintAmt;

float hash(vec2 p){ p = fract(p*vec2(123.34, 456.21)); p += dot(p, p+45.32); return fract(p.x*p.y); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
  for(int i=0;i<5;i++){ v += a*noise(p); p = r*p*2.02 + 3.1; a *= 0.5; }
  return v;
}

// The logo's iridescence as a smooth loop
vec3 iri(float t){
  vec3 c0 = vec3(0.616,0.733,0.478); // sage
  vec3 c1 = vec3(0.435,0.718,0.749); // teal
  vec3 c2 = vec3(0.561,0.608,0.902); // periwinkle
  vec3 c3 = vec3(0.710,0.545,0.878); // violet
  vec3 c4 = vec3(0.878,0.604,0.769); // rose
  vec3 c5 = vec3(0.910,0.749,0.541); // gold
  t = fract(t)*6.0;
  if(t<1.0) return mix(c0,c1,t);
  if(t<2.0) return mix(c1,c2,t-1.0);
  if(t<3.0) return mix(c2,c3,t-2.0);
  if(t<4.0) return mix(c3,c4,t-3.0);
  if(t<5.0) return mix(c4,c5,t-4.0);
  return mix(c5,c0,t-5.0);
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 p = uv; p.x *= uRes.x/uRes.y;
  float t = uTime*0.035;

  // the cursor gently pulls the sky
  vec2 m = uMouse; m.x *= uRes.x/uRes.y;
  vec2 toM = p - m;
  p -= toM * 0.08 * exp(-dot(toM,toM)*2.5);

  // scrolling drifts the sky upward, fast scrolling warps it harder
  p.y += uScroll*0.00012;
  float warp = 1.6 + uVel*3.5;

  vec2 q = vec2(fbm(p*1.3 + vec2(0.0, t)), fbm(p*1.3 + vec2(5.2, -t)));
  vec2 r = vec2(fbm(p*1.6 + warp*q + vec2(1.7, 9.2) + t*1.3), fbm(p*1.6 + warp*q + vec2(8.3, 2.8) - t));
  float f = fbm(p*1.2 + warp*r);

  // curtains: bands of light that rise and fall
  float band = smoothstep(0.28, 0.85, f) * (0.55 + 0.45*sin(p.x*2.2 + r.y*4.0 + t*6.0));
  vec3 col = iri(f*0.9 + r.x*0.6 + t*0.6 + uScroll*0.00004);
  col = mix(col, uTint, uTintAmt*0.9);

  vec3 navy = vec3(0.063,0.106,0.173);
  vec3 deep = vec3(0.047,0.082,0.133);
  vec3 base = mix(deep, navy, uv.y);
  base += uTint * uTintAmt * 0.07;

  float glow = band*0.8 + pow(f, 2.2)*0.55;
  glow *= 0.85 + uVel*0.8;
  vec3 c = base + col*glow*0.95;
  // a second, thinner veil in the complementary hue gives the oil-slick shift
  vec3 col2 = iri(f*1.4 - r.y*0.8 - t*0.4 + 0.5);
  c += col2 * smoothstep(0.55, 0.9, r.x) * 0.28;

  // a soft vignette keeps the edges deep
  float v = smoothstep(1.25, 0.25, length(uv-0.5));
  c = mix(deep, c, 0.45 + 0.55*v);

  gl_FragColor = vec4(c, 1.0);
}
`

// star positions are made once, as box-shadows on a single tiny element: hundreds of stars, almost free
const starField = (n, alpha) =>
  Array.from({ length: n }, () => {
    const x = (Math.random() * 100).toFixed(2)
    const y = (Math.random() * 100).toFixed(2)
    const c = ['246,241,232', '232,191,138', '181,139,224', '111,183,191'][Math.floor(Math.random() * 4)]
    return `${x}vw ${y}vh rgba(${c},${(alpha * (0.4 + Math.random() * 0.6)).toFixed(2)})`
  }).join(',')
const STARS1 = starField(220, 0.8)
const STARS2 = starField(60, 0.9)

export default function Aurora() {
  const canvasRef = useRef(null)
  const fallbackRef = useRef(null)

  useEffect(() => {
    let stop = () => {}
    const idle = window.requestIdleCallback || ((f) => setTimeout(f, 200))
    const cancelIdle = window.cancelIdleCallback || clearTimeout
    const id = idle(() => { stop = startAurora(canvasRef.current, fallbackRef.current) }, { timeout: 700 })
    return () => { cancelIdle(id); stop() }
  }, [])

  return (
    <div className="aurora" aria-hidden="true">
      <canvas ref={canvasRef} className="aurora-canvas" />
      <div ref={fallbackRef} className="aurora-fallback" />
      <div className="stars" style={{ boxShadow: STARS1 }} />
      <div className="stars s2" style={{ boxShadow: STARS2 }} />
      <div className="grain" />
    </div>
  )
}

function startAurora(canvas, fallback) {
  {
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' })
    if (!gl) {
      fallback.style.display = 'block'
      canvas.style.display = 'none'
      return () => {}
    }

    const compile = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(s))
      return s
    }
    const prog = gl.createProgram()
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(prog)
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const u = (n) => gl.getUniformLocation(prog, n)
    const U = {
      res: u('uRes'), time: u('uTime'), scroll: u('uScroll'), vel: u('uVel'),
      mouse: u('uMouse'), tint: u('uTint'), tintAmt: u('uTintAmt'),
    }

    // The aurora is soft, so we render it small and let the browser stretch it. Cheap on phones.
    const scale = isTouch() ? 0.22 : 0.33
    const resize = () => {
      const w = Math.max(2, Math.floor(window.innerWidth * scale))
      const h = Math.max(2, Math.floor(window.innerHeight * scale))
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
      gl.uniform2f(U.res, w, h)
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e) => {
      sky.mouse = [e.clientX / window.innerWidth, 1 - e.clientY / window.innerHeight]
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const reduced = prefersReducedMotion()
    const cur = { tint: [...sky.tint], amt: 0, mouse: [0.5, 0.5], vel: 0 }
    let raf, start = performance.now(), running = true

    const minGap = isTouch() ? 1000 / 30 - 2 : 0
    let last = 0
    const frame = (now) => {
      if (running) raf = requestAnimationFrame(frame)
      if (now - last < minGap) return
      last = now
      const k = 0.04
      for (let i = 0; i < 3; i++) cur.tint[i] += (sky.tint[i] - cur.tint[i]) * k
      cur.amt += (sky.tintAmount - cur.amt) * k
      cur.mouse[0] += (sky.mouse[0] - cur.mouse[0]) * 0.05
      cur.mouse[1] += (sky.mouse[1] - cur.mouse[1]) * 0.05
      cur.vel += (Math.min(sky.velocity, 1) - cur.vel) * 0.08

      gl.uniform1f(U.time, reduced ? 40 : (now - start) / 1000)
      gl.uniform1f(U.scroll, scrollState.y)
      gl.uniform1f(U.vel, cur.vel)
      gl.uniform2f(U.mouse, cur.mouse[0], cur.mouse[1])
      gl.uniform3f(U.tint, cur.tint[0], cur.tint[1], cur.tint[2])
      gl.uniform1f(U.tintAmt, cur.amt)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    raf = requestAnimationFrame(frame)

    const onVis = () => {
      if (document.hidden) { running = false; cancelAnimationFrame(raf) }
      else if (!running) { running = true; raf = requestAnimationFrame(frame) }
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVis)
    }
  }
}
