import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { NOSARA_CENTER, miles } from '../lib/places'

/**
 * Nosara on a night map, with a pin for every place something is on (the same map as the app).
 * Pins with several events show the count. Known venues sit on their own point; area-only places
 * (private homes, "address on RSVP") get a soft dashed ring. Tapping a pin calls onPick.
 * mini: one place, no gestures (the event page).
 */
export default function EventMap({ pins, picked = null, onPick = () => {}, mini = false, className = '' }) {
  const box = useRef(null)
  const map = useRef(null)
  const layer = useRef(null)
  const pick = useRef(onPick)
  useEffect(() => { pick.current = onPick }, [onPick])
  const lastFit = useRef('')
  const refit = useRef(() => {})

  useEffect(() => {
    if (!box.current || map.current) return
    const touch = L.Browser.mobile || L.Browser.touch
    const m = L.map(box.current, {
      zoomControl: false, attributionControl: true, center: [NOSARA_CENTER.lat, NOSARA_CENTER.lng], zoom: 13,
      // on phones one finger scrolls the page and two fingers move the map; the wheel always scrolls the page
      dragging: !mini && !touch, scrollWheelZoom: false, touchZoom: !mini, doubleClickZoom: !mini, boxZoom: false, keyboard: !mini,
    })
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap' }).addTo(m)
    if (!mini) L.control.zoom({ position: 'bottomright' }).addTo(m)
    m.attributionControl.setPrefix(false)
    m.on('click', () => pick.current(null))
    layer.current = L.layerGroup().addTo(m)
    map.current = m
    const ro = new ResizeObserver(() => { m.invalidateSize(); lastFit.current = ''; refit.current() })
    ro.observe(box.current)
    return () => { ro.disconnect(); m.remove(); map.current = null }
  }, [mini])

  const fitKey = pins.map((p) => p.key).join('|')
  useEffect(() => {
    const m = map.current, g = layer.current
    if (!m || !g) return
    g.clearLayers()
    const pts = []
    for (const p of pins) {
      const on = p.key === picked
      const size = p.count > 1 ? 34 : 26
      const mk = L.marker([p.spot.lat, p.spot.lng], {
        title: p.title, riseOnHover: true, zIndexOffset: on ? 1000 : 0, keyboard: !mini,
        icon: L.divIcon({
          className: '',
          html: `<div class="xmap-pin${p.spot.exact ? '' : ' xmap-area'}${on ? ' xmap-on' : ''}" style="width:${size}px;height:${size}px">${p.count > 1 ? p.count : '✦'}</div>`,
          iconSize: [size, size], iconAnchor: [size / 2, size / 2],
        }),
      })
      if (!mini) mk.on('click', (ev) => { L.DomEvent.stopPropagation(ev); pick.current(p.key) })
      mk.addTo(g)
      pts.push([p.spot.lat, p.spot.lng])
    }
    refit.current = () => {
      if (lastFit.current === fitKey || !m.getSize().y) return
      lastFit.current = fitKey
      // open on the heart of Nosara (Guiones, Pelada, town); farther pins are a pinch away
      const core = pts.filter(([lat, lng]) => miles(NOSARA_CENTER, { lat, lng }) <= 3.5)
      const use = core.length ? core : pts
      if (use.length > 1) m.fitBounds(L.latLngBounds(use), { padding: [28, 28], maxZoom: 15 })
      else if (use.length === 1) m.setView(use[0], mini ? 15 : 14)
    }
    refit.current()
  }, [pins, picked, fitKey, mini])

  useEffect(() => {
    const p = pins.find((x) => x.key === picked)
    if (p && map.current) map.current.panTo([p.spot.lat, p.spot.lng], { animate: true })
  }, [picked]) // eslint-disable-line react-hooks/exhaustive-deps

  return <div ref={box} className={`xmap ${mini ? 'xmap-mini' : ''} ${className}`} role="application" aria-label="Map of where events are held" />
}
