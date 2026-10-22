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
const back = (tag) => `${window.location.origin}/?joined=${tag}`

const keep = (v) => { try { localStorage.setItem(PENDING, JSON.stringify(v)) } catch { /* private mode */ } }
const take = () => {
  try { const v = JSON.parse(localStorage.getItem(PENDING) || 'null'); localStorage.removeItem(PENDING); return v } catch { return null }
}

/** Plain-language versions of Supabase's sign-up errors. */
function friendly(msg = '') {
  const m = msg.toLowerCase()
  if (m.includes('password') && (m.includes('6') || m.includes('short') || m.includes('weak'))) return 'Please choose a password of at least 8 characters.'
  if (m.includes('already registered') || m.includes('already exists')) return 'You already have a Xanadu account with this email. Sign in on the app with it.'
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
