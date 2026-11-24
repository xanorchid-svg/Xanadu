// Where events are held, for the map: the same places the app knows (src/places.ts in xanadu-app).
// Events carry a venue name and a town in words; known venues get their own point, everything else its area.
// Private addresses ("shared when you RSVP") only ever get the area, never a precise point.

// area centers from Google Maps (Nov 2026)
const AREAS = {
  guionesNorte: { lat: 9.9465, lng: -85.6685, label: 'Guiones Norte' },
  guiones: { lat: 9.9361, lng: -85.6639, label: 'Playa Guiones' },
  kSection: { lat: 9.9385, lng: -85.6592, label: 'Section K, Guiones' },
  guionesSur: { lat: 9.9300, lng: -85.6600, label: 'South Guiones' },
  pelada: { lat: 9.9575, lng: -85.6731, label: 'Playa Pelada' },
  town: { lat: 9.9800, lng: -85.6530, label: 'Nosara town' },
  garza: { lat: 9.9096, lng: -85.6432, label: 'Garza' },
  sanJuanillo: { lat: 10.0346, lng: -85.7391, label: 'San Juanillo' },
  rioMontana: { lat: 9.9867, lng: -85.6666, label: 'Río Montaña' },
  ostional: { lat: 10.0004, lng: -85.7015, label: 'Ostional' },
  nosara: { lat: 9.9560, lng: -85.6620, label: 'Nosara (spot not listed)' },
  samara: { lat: 9.8818, lng: -85.5289, label: 'Sámara' },
  santaTeresa: { lat: 9.6440, lng: -85.1690, label: 'Santa Teresa' },
}

/** Words in the town or venue that name an area. Most specific first. */
const AREA_WORDS = [
  [/\bsan juanillo\b/, 'sanJuanillo'],
  [/\bostional\b/, 'ostional'],
  [/\brio montana\b/, 'rioMontana'],
  [/\b(k section|section k|seccion k)\b/, 'kSection'],
  [/\b(guiones norte|north guiones|guiones north)\b/, 'guionesNorte'],
  [/\b(south guiones|guiones sur|bakers)\b/, 'guionesSur'],
  [/\bpelada\b/, 'pelada'],
  [/\bgarza\b/, 'garza'],
  [/\bguiones\b/, 'guiones'],
  [/\b(nosara town|town of nosara|bocas de nosara|airport|downtown nosara)\b/, 'town'],
  [/\bsamara\b/, 'samara'],
  [/\b(santa teresa|mal pais)\b/, 'santaTeresa'],
  [/\bnosara\b/, 'nosara'],
]

/** Regular venues with their own point on the map, from Google Maps (Nov 2026). Most specific first. */
const VENUES = [
  [/\bharmony co-?op\b|\bla ventanita\b/, { lat: 9.9411, lng: -85.6646 }], // Harmony Co-Op Playground, behind La Ventanita
  [/\bharmony hotel\b|\bthe harmony\b/, { lat: 9.9430, lng: -85.6666 }],
  [/\bwild ?child\b/, { lat: 9.9829, lng: -85.6585 }], // Wild Child Playgarden & Wildschooling
  [/\bnosara retreat center\b/, { lat: 9.9867, lng: -85.6666 }],
  [/\bbodhi tree\b/, { lat: 9.9409, lng: -85.6603 }],
  [/\bcasa pacifico\b/, { lat: 9.9378, lng: -85.6586 }],
  [/\bcasa de las estrellas\b/, { lat: 9.9049, lng: -85.6539 }],
  [/\bnalu\b/, { lat: 9.9471, lng: -85.6665 }],
  [/^ norte /, { lat: 9.9487, lng: -85.6704 }], // Norte Nosara
  [/\bnorte nosara\b/, { lat: 9.9487, lng: -85.6704 }],
  [/\bnanku\b/, { lat: 9.9923, lng: -85.6451 }],
  [/\bnosara blue\b/, { lat: 9.9572, lng: -85.6716 }],
  [/\bhamaca\b/, { lat: 9.9553, lng: -85.6721 }],
  [/\bolga'?s\b/, { lat: 9.9532, lng: -85.6741 }],
  [/\bpacha ?mama\b/, { lat: 10.0348, lng: -85.7064 }],
  [/\beterna\b/, { lat: 10.0388, lng: -85.7364 }],
  [/\bbakers?'? beach\b/, { lat: 9.9367, lng: -85.6654 }],
  [/\bnorth guiones beach\b/, { lat: 9.9445, lng: -85.6700 }],
]

const PRIVATE = /(shared when|address shared|private (home|space|house)|\bon rsvp\b|when you (book|register|rsvp))/

const norm = (s) => ` ${s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[’‘]/g, "'")} `

/** Places a venue and town. Returns null when the words don't name anywhere we know. */
export function locate(venue = "", town = "") {
  const v = norm(venue), t = norm(town), both = `${v} ${t}`
  const area = AREA_WORDS.find(([re]) => re.test(both))?.[1]
  const areaLabel = area ? AREAS[area].label : ''
  if (!PRIVATE.test(v)) {
    const hit = VENUES.find(([re]) => re.test(v))
    if (hit) return { ...hit[1], label: area && area !== 'nosara' ? areaLabel : 'Nosara', exact: true }
  }
  return area ? { ...AREAS[area], exact: false } : null
}

export const NOSARA_CENTER = { lat: 9.9600, lng: -85.6650 }
export const spotOf = (e) => locate(e.venue ?? '', e.town ?? '')
/** Miles between two points. */
export function miles(a, b) {
  const r = (d) => (d * Math.PI) / 180
  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lng - a.lng) / 2) ** 2
  return 3958.8 * 2 * Math.asin(Math.sqrt(h))
}
export const spotKey = (s) => `${s.lat.toFixed(4)},${s.lng.toFixed(4)}`
