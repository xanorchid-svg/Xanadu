import { useSyncExternalStore } from 'react'

// The stay a visitor designs, shared between "Design your stay" and the waitlist form.
let state = { seeking: [], length: null, work: null, where: [] }
const subs = new Set()

export const setStay = (patch) => {
  state = { ...state, ...(typeof patch === 'function' ? patch(state) : patch) }
  subs.forEach((f) => f())
}

export const useStay = () =>
  useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f) }, () => state)

export const describeStay = (s) =>
  [s.seeking.length ? s.seeking.join(', ') : null, s.length, s.work, s.where.length ? s.where.join(', ') : null].filter(Boolean).join(' · ')
