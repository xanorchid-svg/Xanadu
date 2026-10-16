import { useSyncExternalStore } from 'react'

// Opens and closes the "Join Xanadu" popup from anywhere on the page.
let open = false
const subs = new Set()
const emit = () => subs.forEach((f) => f())

export const openJoin = () => { open = true; emit() }
export const closeJoin = () => { open = false; emit() }
export const useJoinOpen = () =>
  useSyncExternalStore((f) => { subs.add(f); return () => subs.delete(f) }, () => open)
