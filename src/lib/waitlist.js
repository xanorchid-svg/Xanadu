// Saves a Seeker to the waitlist in the Xanadu app's database (Supabase project "xanadu app"), through join_waitlist.
// Same database as app.dreamxanadu.com and the team console, so every sign-up shows in Console → Waitlist.
// The publishable key is public by design: the public can only call that function, nobody can read the list from the site.
// The same email signing up again updates their existing row instead of adding a duplicate.
const RPC = 'https://gutqzqxybcnnpwfbkjsq.supabase.co/rest/v1/rpc/join_waitlist'
const KEY = 'sb_publishable_7jInxBTTLrcqSP_OgCZApA_NlZG8Mpg'

const list = (a) => (Array.isArray(a) && a.length ? a : null)

/**
 * @param {object} p
 * @param {string} p.name
 * @param {string} p.email
 * @param {string} [p.intention]  what they're seeking, in their own words (plus a readable stay summary)
 * @param {object} [p.stay]       the stay they designed: { seeking, length, work, where }
 * @param {string} [p.source]     which form: 'join-section' | 'join-modal'
 * @param {string} [p.trap]       honeypot field; bots fill it, people never see it
 */
export async function joinWaitlist({ name, email, intention, stay, source, trap }) {
  if (trap) return // quietly drop bots, and still show them "received"
  const body = {
    p_name: name.trim(),
    p_email: email.trim().toLowerCase(),
    p_intention: intention?.trim() || null,
    p_seeking: list(stay?.seeking),
    p_length: stay?.length || null,
    p_work: stay?.work || null,
    p_where: list(stay?.where),
    p_source: source || null,
  }
  let lastErr
  // one quiet retry for flaky mobile connections; the function is safe to repeat (it never duplicates)
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(RPC, {
        method: 'POST',
        headers: { apikey: KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) return
      lastErr = new Error(`Waitlist error ${res.status}`)
      if (res.status < 500) break // a bad email or name won't succeed on retry
    } catch (e) {
      lastErr = e
    }
    await new Promise((r) => setTimeout(r, 800))
  }
  throw lastErr
}
