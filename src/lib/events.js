// The community calendar on dreamxanadu.com: the same live events members see in the app, open to everyone.
// Reads only what's public (RLS "community events: guests read live"); who's going and chat stay in the app.
import { useEffect, useState } from 'react'
import { supabase } from './account'

/* ---------- Types: the same lists as the app (src/events.ts in xanadu-app), so filters speak one language ---------- */
export const CATEGORIES = [
  // Move
  { label: 'Yoga', tags: ['Yoga'], practices: ['Yoga'] },
  { label: 'Pilates & mobility', tags: ['Pilates'] },
  { label: 'Acro & aerial', tags: ['Acro'] },
  { label: 'Ecstatic dance', tags: ['Ecstatic dance'], practices: ['Ecstatic dance'] },
  { label: 'Dance & movement', tags: ['Dance', 'Ecstatic dance'], practices: ['Ecstatic dance'] },
  { label: 'Contact improv', tags: ['Contact improv'] },
  { label: 'Martial arts', tags: ['Martial arts'] },
  { label: 'Surf & ocean', tags: ['Surf & ocean'] },
  // Still & heal
  { label: 'Meditation', tags: ['Meditation'], practices: ['Meditation'] },
  { label: 'Breathwork', tags: ['Breathwork'], practices: ['Breathwork'] },
  { label: 'Sound healing', tags: ['Sound healing'], practices: ['Sound'] },
  { label: 'Healing & bodywork', tags: ['Healing', 'Bodywork', 'Reiki'], practices: ['Bodywork & therapy'] },
  { label: 'Ice bath & sauna', tags: ['Ice bath & sauna'] },
  // Inner work
  { label: 'Shadow & inner child', tags: ['Inner work'] },
  { label: 'Family constellations', tags: ['Family constellations'] },
  { label: 'Somatic & embodied', tags: ['Embodiment'] },
  { label: 'Tantra & relating', tags: ['Tantra'] },
  // Gather
  { label: "Women's", tags: ["Women's circle", 'Womb work'], practices: ["Women's"] },
  { label: "Men's", tags: ["Men's circle"], practices: ["Men's"] },
  { label: 'Cacao & ceremony', tags: ['Cacao'] },
  { label: 'Moon gatherings', tags: ['Moon gathering'] },
  { label: 'Music & jams', tags: ['Music', 'Kirtan'], practices: ['Kirtan'] },
  { label: 'Community gatherings', tags: ['Community gathering'] },
  { label: 'Festivals & parties', tags: ['Festival'] },
  // Create & learn
  { label: 'Art & creativity', tags: ['Art & creativity'] },
  { label: 'Writing', tags: ['Writing'] },
  { label: 'Theater & improv', tags: ['Theater'] },
  { label: 'Workshops & trainings', tags: ['Workshop'], practices: ['Trainings'], formats: ['Training'] },
  { label: 'Retreats', tags: ['Retreat'], formats: ['Retreat'] },
  { label: 'Spanish & languages', tags: ['Language'] },
  // Family & nature
  { label: 'Kids & family', tags: ['Kids & family'] },
  { label: 'Nature & adventure', tags: ['Nature & adventure'] },
  { label: 'Permaculture & garden', tags: ['Permaculture'] },
  { label: 'Volunteering', tags: ['Volunteering'] },
]

/** The types in six families, so the filter row stays short: tap a family for all of it, or open it to pick. */
export const FAMILIES = [
  { label: 'Move', types: ['Yoga', 'Pilates & mobility', 'Acro & aerial', 'Ecstatic dance', 'Dance & movement', 'Contact improv', 'Martial arts', 'Surf & ocean'] },
  { label: 'Still & heal', types: ['Meditation', 'Breathwork', 'Sound healing', 'Healing & bodywork', 'Ice bath & sauna'] },
  { label: 'Inner work', types: ['Shadow & inner child', 'Family constellations', 'Somatic & embodied', 'Tantra & relating'] },
  { label: 'Gather', types: ["Women's", "Men's", 'Cacao & ceremony', 'Moon gatherings', 'Music & jams', 'Community gatherings', 'Festivals & parties'] },
  { label: 'Create & learn', types: ['Art & creativity', 'Writing', 'Theater & improv', 'Workshops & trainings', 'Retreats', 'Spanish & languages'] },
  { label: 'Family & nature', types: ['Kids & family', 'Nature & adventure', 'Permaculture & garden', 'Volunteering'] },
]

/**
 * The words that put an event under each type. The same list reads a seeker's own words
 * ("I want yoga and sound baths by the ocean"), so what they ask for and what's on speak one language.
 * Tags set by the importer or the team still count; these words catch anything the tags missed.
 */
const KEYWORDS = {
  'Yoga': /\b(yoga|yin|vinyasa|hatha|ashtanga|asanas?|nidra|kundalini|acro ?yoga)\b/,
  'Pilates & mobility': /\b(pilates|mobility|stretch\w*|barre|reformer|functional (training|movement)|fitness)\b/,
  'Acro & aerial': /\b(acro|acroyoga|acro ?yoga|partner yoga|acrobatic\w*|aerial\w*|silks|trapeze|circus|handstands?|hoop)\b/,
  'Ecstatic dance': /\b(ecstatic)\b/,
  'Dance & movement': /\b(danc\w*|ecstatic|5 ?rhythms|qi ?gong|tai chi|salsa|bachata|tango|(conscious|free|authentic) movement|movement (practice|medicine))\b/,
  'Contact improv': /\b(contact improv\w*|contact dance)\b/,
  'Martial arts': /\b(martial arts?|capoeira|jiu[- ]?jitsu|bjj|boxing|muay thai|kung fu|karate|aikido|self[- ]defen[cs]e)\b/,
  'Surf & ocean': /\b(surf\w*|ocean|paddle ?board\w*|snorkel\w*|free ?div\w*|swim\w*|kayak\w*|sea)\b/,
  'Meditation': /\b(meditat\w*|mindful\w*|vipassana|silent|silence|stillness|contemplat\w*|koans?|nidra)\b/,
  'Breathwork': /\b(breath\w*|pranayama|holotropic|wim hof)\b/,
  'Sound healing': /\b(sound|sound ?baths?|sound bowls?|bowls|gongs?|mantras?|chant\w*|voices?|frequenc\w*|cymatic\w*)\b/,
  'Healing & bodywork': /\b(heal\w*|bodywork|massage|reiki|acupuncture|craniosacral|chiropract\w*|osteopath\w*|myofascial|lymphatic|cupping|therap\w*|detox|cleanse|water ?fast\w*|fasting|recovery)\b/,
  'Ice bath & sauna': /\b(ice ?baths?|cold (plunge\w*|water|exposure)|sauna\w*|temazcal|sweat lodge|wim hof|contrast therapy)\b/,
  'Shadow & inner child': /\b(inner work|shadow ?work|shadow|inner child|archetypes?|rage|grief|self-?love|internal family systems|ifs|parts work|drama therapy|psychodrama|enneagram|death|die|dying|release|integration)\b/,
  'Family constellations': /\b(constellations?|systemic)\b/,
  'Somatic & embodied': /\b(somatic\w*|embodi\w*|trauma\w*|nervous system|polyvagal|body awareness|trust the body)\b/,
  'Tantra & relating': /\b(tantra\w*|circling|authentic relating|relational|connection practices?|intimacy|couples?)\b/,
  "Women's": /\b(women'?s|womens|woman|sisterhood|sisters|goddess\w*|feminine|womb|red tent|red temple|moon ?time|menstrua\w*)\b/,
  "Men's": /\b(men'?s|mens|brotherhood|brothers|masculine)\b/,
  'Cacao & ceremony': /\b(cacao|ceremon\w*|rituals?|temazcal|plant medicine)\b/,
  'Moon gatherings': /\b(full moon|new moon|moon (circle|gathering|ceremony|ritual)|equinox|solstice|eclipse)\b/,
  'Music & jams': /\b(music|musical|musicians?|drums?|drumming|drum circles?|music jams?|jam sessions?|jammings?|concerts?|live (band|set|music)|dj|djs|kirtan|songs?|singing|sing-?along|guitar|bands?|open mic)\b/,
  'Community gatherings': /\b(potlucks?|dinners?|suppers?|brunch|feasts?|community (gathering|meal|night|celebration)|(community|social) gatherings?|socials?|meet-?ups?|mixers?|bonfires?|fire circles?|drum circles?|open mic)\b/,
  'Festivals & parties': /\b(festivals?|fest|part(y|ies)|celebrat\w*|carnival|fiesta|gala)\b/,
  'Art & creativity': /\b(art|arts|artist\w*|paint\w*|pottery|ceramic\w*|clay|craft\w*|drawing|creativ\w*|photograph\w*)\b/,
  'Writing': /\b(writing|writers?|poetry|poems?|poets?|journal\w*|storytelling|book club)\b/,
  'Theater & improv': /\b(theat(er|re)|drama|improv|acting|clown\w*|performance|play reading)\b/,
  'Workshops & trainings': /\b(workshops?|trainings?|teacher training|certifications?|courses?|masterclass|ytt)\b/,
  'Retreats': /\b(retreats?|residenc\w*|residential|(four|five|six|seven|eight|nine|ten|[4-9]|[1-9]\d)[- ]day)\b/,
  'Spanish & languages': /\b(spanish|español|espanol|language (exchange|class\w*|school)|english class\w*|intercambio)\b/,
  'Kids & family': /\b(kids?|children|families|parents?|all ages|ages \d+|toddlers?|teens?|family (day|workshop|yoga|friendly))\b/,
  'Nature & adventure': /\b(hikes?|hiking|trails?|jungle|rivers?|riverbanks?|waterfalls?|plant walk|nature|outdoors?|horse\w*|turtles?|birding|bird ?watching|camping|adventure\w*)\b/,
  'Permaculture & garden': /\b(permaculture|garden\w*|farm\w*|seed (swap|saving)|compost\w*|ferment\w*|food forest)\b/,
  'Volunteering': /\b(volunteer\w*|beach clean\w*|clean[- ]?ups?|tree planting|reforest\w*|conservation|community service)\b/,
}

/** Lower-case text with "sound healing" read as sound, not general healing. */
const prep = (s) => ` ${s.toLowerCase().replace(/’/g, "'").replace(/sound[ -]heal\w*/g, 'sound bath').replace(/singing bowls?/g, 'sound bowls').replace(/\bthe art of\b/g, 'the way of')} `

/** Every filter a piece of text speaks to. */
export function categoriesIn(text) {
  const t = prep(text)
  return CATEGORIES.map((c) => c.label).filter((l) => KEYWORDS[l]?.test(t))
}


const cache = new WeakMap()
/** The types an event belongs to: its tags, plus what its title and description say. */
export function categoriesOf(e) {
  const hit = cache.get(e)
  if (hit) return hit
  const out = new Set()
  for (const c of CATEGORIES) if ((e.tags ?? []).some((t) => c.tags.includes(t))) out.add(c.label)
  const kids = (e.tags ?? []).includes('Kids & family')
  for (const l of categoriesIn(kids ? e.title ?? '' : `${e.title ?? ''}. ${e.description ?? ''}`)) out.add(l)
  cache.set(e, out)
  return out
}
/** Does the event fit this family (any of its types)? */
export const inFamily = (e, family) => {
  const f = FAMILIES.find((x) => x.label === family)
  if (!f) return true
  const mine = categoriesOf(e)
  return f.types.some((t) => mine.has(t))
}

/* ---------- Dates ---------- */
export const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const at = (s) => new Date(s + 'T12:00:00')
export const addDays = (s, n) => { const d = at(s); d.setDate(d.getDate() + n); return iso(d) }
export const fmtDay = (s, o = { weekday: 'long', month: 'long', day: 'numeric' }) => at(s).toLocaleDateString('en-US', o)
/** "6:30 pm" → minutes after midnight (unknown times sort last). */
export const minutes = (t = '') => {
  const m = t.trim().toLowerCase().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/)
  if (!m) return 24 * 60
  let h = Number(m[1]) % 12
  if (m[3] === 'pm') h += 12
  return h * 60 + Number(m[2] ?? 0)
}
export const timeRange = (e) => [e.start_time, e.end_time].filter(Boolean).join(' – ')
export function whenText(e) {
  if (!e.start_date) return 'Date to be confirmed'
  const one = fmtDay(e.start_date, { weekday: 'short', month: 'short', day: 'numeric' })
  if (e.end_date && e.end_date !== e.start_date) return `${one} – ${fmtDay(e.end_date, { weekday: 'short', month: 'short', day: 'numeric' })}`
  return one
}

/* ---------- Contact ---------- */
/** A tappable WhatsApp, email or Instagram link (8-digit numbers are Costa Rican). */
export function contactLink(contact = '') {
  const c = contact.trim()
  if (/^[\w.+-]+@[\w-]+\.[\w.]+$/.test(c)) return { href: `mailto:${c}`, label: 'Email the host' }
  if (/^@[\w.]{2,30}$/.test(c)) return { href: `https://instagram.com/${c.slice(1)}`, label: 'Message on Instagram' }
  const digits = c.replace(/[^\d+]/g, '')
  if (/^\+?\d{8,15}$/.test(digits)) {
    const n = digits.startsWith('+') ? digits.slice(1) : digits.length === 8 ? `506${digits}` : digits
    return { href: `https://wa.me/${n}`, label: 'WhatsApp the host' }
  }
  return null
}
export function safeLink(raw = '') {
  if (!raw.trim()) return null
  try {
    const u = new URL(/^https?:\/\//i.test(raw.trim()) ? raw.trim() : `https://${raw.trim()}`)
    return /^https?:$/.test(u.protocol) && u.hostname.includes('.') ? u.href : null
  } catch { return null }
}

/* ---------- Loading ---------- */
const COLS = 'id,title,description,start_date,end_date,start_time,end_time,venue,town,price_note,contact,link,tags,photo_url,space_id,facilitator_id'
const sortEvents = (a, b) => (a.start_date ?? '9999').localeCompare(b.start_date ?? '9999') || minutes(a.start_time) - minutes(b.start_time)

/** Approved events that haven't ended, soonest first. */
export function useEvents() {
  const [state, setState] = useState({ events: [], loading: true, failed: false })
  useEffect(() => {
    let live = true
    const today = iso(new Date())
    supabase.from('community_events').select(COLS).eq('status', 'live')
      .order('start_date', { ascending: true, nullsFirst: false }).limit(400)
      .then(({ data, error }) => {
        if (!live) return
        const events = (data ?? []).filter((e) => !e.start_date || (e.end_date || e.start_date) >= today).sort(sortEvents)
        setState({ events, loading: false, failed: !!error })
      })
    return () => { live = false }
  }, [])
  return state
}

/** One event, live only. */
export function useEvent(id) {
  const [state, setState] = useState({ event: null, loading: true })
  useEffect(() => {
    let live = true
    supabase.from('community_events').select(COLS).eq('status', 'live').eq('id', id).maybeSingle()
      .then(({ data }) => { if (live) setState({ event: data ?? null, loading: false }) })
    return () => { live = false }
  }, [id])
  return state
}

/* ---------- Studio classes: daily timetables from each studio's own schedule ---------- */
const CLASS_COLS = 'id,studio,title,weekday,class_date,start_time,end_time,teacher,room,price_note,venue,town,contact,link,tags,notes,checked_on'

/** Every active class slot (weekly ones and dated ones). */
export function useStudioClasses() {
  const [classes, setClasses] = useState([])
  useEffect(() => {
    let live = true
    supabase.from('studio_classes').select(CLASS_COLS).eq('active', true).limit(1000)
      .then(({ data }) => { if (live) setClasses(data ?? []) })
    return () => { live = false }
  }, [])
  return classes
}

/** The classes on each date from a to b (at most 14 days), weekly slots placed on their weekdays. */
export function classesBetween(classes, a, b) {
  const out = []
  let d = a
  for (let i = 0; i < 14 && d <= b; i++, d = addDays(d, 1)) {
    const wd = (at(d).getDay() + 6) % 7 // Monday = 0
    // a studio with dated classes that day uses those; its weekly slots fill days it hasn't dated
    const dated = new Set(classes.filter((c) => c.class_date === d).map((c) => c.studio))
    for (const c of classes) {
      if (c.class_date === d || (c.class_date == null && c.weekday === wd && !dated.has(c.studio))) out.push({ ...c, date: d })
    }
  }
  return out.sort((x, y) => x.date.localeCompare(y.date) || minutes(x.start_time) - minutes(y.start_time))
}
