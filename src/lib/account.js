// Seeker accounts made on dreamxanadu.com are real Xanadu accounts: the same Supabase project ("xanadu app"),
// the same sign-up as app.dreamxanadu.com and the iPhone app. One login works everywhere, the person shows in
// the team console (Members and Waitlist), and the app's welcome email and inbox messages go out as usual.
// Each sign-up is also saved to the waitlist (join_waitlist) with the stay they designed, so the console keeps it.
import { createClient } from '@supabase/supabase-js'
import { joinWaitlist } from './waitlist'

const URL = 'https://gutqzqxybcnnpwfbkjsq.supabase.co'
const KEY = 'sb_publishable_7jInxBTTLrcqSP_OgCZApA_NlZG8Mpg'

export const supabase = createClient(URL, KEY, {
  // the website only needs a session for a moment, to finish joining; links from email may open on another device
  auth: { flowType: 'implicit', detectSessionInUrl: true, persistSession: true, storageKey: 'xanadu-site-auth' },
})

const PENDING = 'xanadu_pending_join'
const back = (tag, path = '/') => `${window.location.origin}${path}?joined=${tag}`

const keep = (v) => { try { localStorage.setItem(PENDING, JSON.stringify(v)) } catch { /* private mode */ } }
const take = () => {
  try { const v = JSON.parse(localStorage.getItem(PENDING) || 'null'); localStorage.removeItem(PENDING); return v } catch { return null }
}

/** Plain-language versions of Supabase's sign-up errors. */
function friendly(msg = '') {
  const m = msg.toLowerCase()
  if (m.includes('password') && (m.includes('6') || m.includes('short') || m.includes('weak'))) return 'Please choose a password of at least 8 characters.'
  if (m.includes('already registered') || m.includes('already exists')) return 'You already have a Xanadu account with this email, so you\u2019re all set.'
  if (m.includes('email') && m.includes('invalid')) return 'That email doesn’t look right. Please check it.'
  if (m.includes('rate') || m.includes('too many')) return 'Too many tries just now. Please wait a minute and try again.'
  return 'Something went wrong. Please try again, or write to networkxanadu@gmail.com.'
}

/**
 * Create a Seeker account with email and password, and save their waitlist answers.
 * Returns 'check-email' when Supabase sends a confirmation link first, 'done' when the account is ready.
 */
export async function createSeeker({ name, email, password, intention, stay, source }) {
  if (password.length < 8) throw new Error('Please choose a password of at least 8 characters.')
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: { role: 'seeker', full_name: name.trim(), name: name.trim() },
      emailRedirectTo: back('confirmed'),
    },
  })
  if (error) throw new Error(friendly(error.message))
  // the waitlist row carries the stay they designed into Console → Waitlist; the account is already made, so a hiccup here isn't fatal
  try { await joinWaitlist({ name, email, intention, stay, source }) } catch { /* the account still shows under Members */ }
  if (data.session) await supabase.auth.signOut({ scope: 'local' })
  return data.session ? 'done' : 'check-email'
}

/** Continue with Google: remember their stay, then go to Google and come back here. */
export async function googleSeeker({ intention, stay, source }) {
  keep({ intention, stay, source, at: Date.now() })
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: back('google'), queryParams: { prompt: 'select_account' } },
  })
  if (error) throw new Error(friendly(error.message))
}

/**
 * On page load: finish a Google sign-up or an email confirmation that just landed here.
 * Resolves to 'google' | 'confirmed' when someone has just joined (so the page can welcome them), otherwise null.
 */
export async function finishJoin() {
  const params = new URLSearchParams(window.location.search)
  const tag = params.get('joined')
  const hashError = new URLSearchParams(window.location.hash.slice(1)).get('error_description')
  if (window.location.pathname.startsWith('/apply')) return null // the application page finishes its own
  if (!tag && !hashError) return null
  const clean = () => window.history.replaceState(null, '', window.location.pathname)
  if (hashError) { clean(); take(); throw new Error(hashError) }

  const { data } = await supabase.auth.getSession()
  const user = data.session?.user
  clean()
  if (!user) return null
  if (tag === 'google') {
    const p = take()
    const m = user.user_metadata || {}
    const name = m.full_name || m.name || user.email.split('@')[0]
    try { await joinWaitlist({ name, email: user.email, intention: p?.intention, stay: p?.stay, source: p?.source }) } catch { /* still a member */ }
  }
  await supabase.auth.signOut({ scope: 'local' })
  return tag === 'google' ? 'google' : 'confirmed'
}

/* ---------------- Container and Facilitator applications ---------------- */
// Applicants make their account first (Google or email), stay signed in on this device while they fill in the
// application (so Xanadu's AI can read their website for them), and are signed out once it's sent.

const applyPath = (role) => `/apply/${role}`

/** The signed-in applicant on this device, if any: { email, name }. */
export async function currentApplicant() {
  const { data } = await supabase.auth.getSession()
  const u = data.session?.user
  if (!u) return null
  const m = u.user_metadata || {}
  return { email: u.email, name: m.full_name || m.name || '' }
}

/** Continue with Google, then come straight back to the application. */
export async function applicantGoogle(role) {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: back('google', applyPath(role)), queryParams: { prompt: 'select_account' } },
  })
  if (error) throw new Error(friendly(error.message))
}

/** New account with email. Returns 'ready' (signed in) or 'check-email' (confirm first, the link brings them back). */
export async function applicantEmail({ role, email, password }) {
  if (password.length < 8) throw new Error('Please choose a password of at least 8 characters.')
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: { data: { role }, emailRedirectTo: back('confirmed', applyPath(role)) },
  })
  if (error) throw new Error(friendly(error.message))
  // Supabase hides whether an email is taken: a "new" user with no sign-in methods means the account already exists
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    const e = new Error('You already have a Xanadu account with this email. Sign in with it below.')
    e.code = 'exists'
    throw e
  }
  return data.session ? 'ready' : 'check-email'
}

/** An existing Xanadu account (for example someone on the waitlist). */
export async function applicantSignIn({ email, password }) {
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
  if (error) throw new Error(/invalid/i.test(error.message) ? 'That email and password don\u2019t match. Try again, or continue with Google if that\u2019s how you joined.' : friendly(error.message))
  return 'ready'
}

export const applicantSignOut = () => supabase.auth.signOut({ scope: 'local' })

/** Back from Google or the confirmation email: tidy the address bar, and surface a link error if there was one. */
export async function finishApplicantReturn() {
  const params = new URLSearchParams(window.location.search)
  const hashError = new URLSearchParams(window.location.hash.slice(1)).get('error_description')
  if (params.get('joined') || hashError) window.history.replaceState(null, '', window.location.pathname)
  if (hashError) throw new Error(hashError)
  return currentApplicant()
}

/** Xanadu's AI reads their website and returns the fields it found ({ fields, photos, notes }). */
export async function readWebsite(kind, url) {
  const { data, error } = await supabase.functions.invoke('import-listing', { body: { kind, url: url.trim() } })
  if (error) {
    let msg = ''
    try { msg = (await error.context?.json())?.error } catch { /* not json */ }
    throw new Error(msg || 'We couldn\u2019t read that website just now. Please fill this in by hand.')
  }
  return data
}

/** Send the application, keep the photos they chose (Containers), then sign out on this device. */
export async function sendApplication(role, app, photos = []) {
  const { data } = await supabase.auth.getSession()
  if (!data.session) { const e = new Error('Please sign in again to send your application.'); e.code = 'signed-out'; throw e }
  const { error } = await supabase.rpc('submit_application', { p_role: role, p_app: { ...app, agreed: true } })
  if (error) throw new Error(error.message || friendly(''))
  if (role === 'container' && photos.length) {
    // their application exists now, so the photos can be copied into their own folder and added to their space
    try {
      const { data: copied } = await supabase.functions.invoke('import-listing', { body: { action: 'photos', urls: photos } })
      if (copied?.photos?.length) await supabase.from('spaces').update({ photos: copied.photos }).eq('owner_id', data.session.user.id)
    } catch { /* the application is in; photos can be added later */ }
  }
  await applicantSignOut()
}
