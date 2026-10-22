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

const APPLY_PENDING = 'xanadu_pending_apply'
const applyPath = (role) => `/apply/${role}`

/**
 * New account by email: the application travels with the sign-up and the database files it at once
 * (Console → Applications), even before they confirm their email.
 * Returns 'check-email' (confirmation link sent) or 'done'.
 */
export async function applyWithEmail({ role, email, password, app }) {
  if (password.length < 8) throw new Error('Please choose a password of at least 8 characters.')
  const { data, error } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: { role, full_name: app.name?.trim() || '', name: app.name?.trim() || '', application: { ...app, agreed: true } },
      emailRedirectTo: back('applied', applyPath(role)),
    },
  })
  if (error) throw new Error(friendly(error.message))
  // Supabase hides whether an email is taken: a "new" user with no sign-in methods means the account already exists
  if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
    const e = new Error('You already have a Xanadu account with this email. Choose “I already have an account” below to send your application with it.')
    e.code = 'exists'
    throw e
  }
  if (data.session) await supabase.auth.signOut({ scope: 'local' })
  return data.session ? 'done' : 'check-email'
}

/** Existing account (for example a Seeker on the waitlist): sign in and send the application with it. */
export async function applyWithSignIn({ role, email, password, app }) {
  const { error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password })
  if (error) throw new Error(/invalid/i.test(error.message) ? 'That email and password don’t match. Try again, or continue with Google if that’s how you joined.' : friendly(error.message))
  try {
    const { error: e2 } = await supabase.rpc('submit_application', { p_role: role, p_app: { ...app, agreed: true } })
    if (e2) throw new Error(e2.message || friendly(''))
  } finally {
    await supabase.auth.signOut({ scope: 'local' })
  }
  return 'done'
}

/** Continue with Google: keep the application on this device, go to Google, and send it when they come back. */
export async function applyWithGoogle({ role, app }) {
  try { localStorage.setItem(APPLY_PENDING, JSON.stringify({ role, app: { ...app, agreed: true }, at: Date.now() })) } catch { /* private mode */ }
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: back('google-apply', applyPath(role)), queryParams: { prompt: 'select_account' } },
  })
  if (error) throw new Error(friendly(error.message))
}

/**
 * On the application page: finish a Google application, or welcome someone back from their confirmation email.
 * Resolves to 'done' when their application is in, otherwise null.
 */
export async function finishApply() {
  const params = new URLSearchParams(window.location.search)
  const tag = params.get('joined')
  const hashError = new URLSearchParams(window.location.hash.slice(1)).get('error_description')
  if (!tag && !hashError) return null
  window.history.replaceState(null, '', window.location.pathname)
  if (hashError) throw new Error(hashError)
  const { data } = await supabase.auth.getSession()
  if (tag === 'applied') { if (data.session) await supabase.auth.signOut({ scope: 'local' }); return 'done' } // already filed at sign-up
  if (tag !== 'google-apply') return null
  let pending = null
  try { pending = JSON.parse(localStorage.getItem(APPLY_PENDING) || 'null') } catch { /* ignore */ }
  if (!data.session) throw new Error('Google sign-in didn’t finish. Please try again.')
  if (!pending?.app) { await supabase.auth.signOut({ scope: 'local' }); throw new Error('We couldn’t find your answers on this device. Please fill in the application again.') }
  try {
    const { error } = await supabase.rpc('submit_application', { p_role: pending.role, p_app: pending.app })
    if (error) throw new Error(error.message || friendly(''))
    try { localStorage.removeItem(APPLY_PENDING) } catch { /* ignore */ }
    return 'done'
  } finally {
    await supabase.auth.signOut({ scope: 'local' })
  }
}

/** The answers kept on this device while someone went to Google (so a failed return can refill the form). */
export function pendingApplication(role) {
  try { const p = JSON.parse(localStorage.getItem(APPLY_PENDING) || 'null'); return p?.role === role ? p.app : null } catch { return null }
}
