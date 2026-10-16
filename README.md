# Xanadu — dreamxanadu.com

The landing page for Xanadu, a network for awakening places. Its job: make people feel Xanadu, then send them into the app at https://app.dreamxanadu.com.

## Run it locally

```bash
npm install
npm run dev
```

## How it's built

React + Vite, hosted on Vercel. Free libraries only: GSAP (scroll-linked hero), Lenis (smooth scrolling), qrcode.

| File | What it is |
|------|------------|
| `src/App.jsx` | Puts the page together, starts smooth scrolling |
| `src/styles.css` | All styles and brand tokens (colours, iridescence, type) |
| `src/lib/links.js` | Every app link, the landscapes and the places — edit copy-level data here |
| `src/components/Aurora.jsx` | The living iridescent sky (a small WebGL shader) |
| `src/components/Emblem.jsx` | The logo emblem, redrawn as animated vector layers |
| `src/components/Cursor.jsx` | Stardust cursor trail (desktop only) |
| `src/sections/Hero.jsx` | The portal you fall through |
| `src/sections/Living.jsx` | "A way of living" + the drifting word marquees |
| `src/sections/DesignStay.jsx` | The 3-step "Design your stay" moment |
| `src/sections/Paths.jsx` | Seeker / Container / Facilitator doorways |
| `src/sections/Places.jsx` | The star-globe of places |
| `src/sections/AppReveal.jsx` | Phone mockup, download button, QR, install hints |
| `src/sections/Closing.jsx` | Closing line and footer |

People who turn on "Reduce motion" get a calm, still version of everything.

The previous site (waitlist forms, role pages) lives in git history before the `redesign-portal` branch.
