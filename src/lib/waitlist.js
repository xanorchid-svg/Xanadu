// Saves a Seeker to the waitlist table in Supabase.
// The anon key is public by design: the table only allows inserts, nobody can read it from the site.
const URL = 'https://nmstrfmxflwgbgkiyeyq.supabase.co/rest/v1/waitlist'
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tc3RyZm14Zmx3Z2Jna2l5ZXlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjU2MTYsImV4cCI6MjA5MDkwMTYxNn0.kaMOwTCuRNlya7sQOzocq5wNC8-bq9ygq-Rf3Gq9Y2s'

export async function joinWaitlist({ name, email, intention }) {
  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), role: 'Seeker', intention: intention?.trim() || null }),
  })
  if (!res.ok) throw new Error(`Waitlist error ${res.status}`)
}
