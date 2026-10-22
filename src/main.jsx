/* eslint-disable react-refresh/only-export-components -- entry file, not hot-reloaded */
import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// the deeper pages load only when someone opens them
const PathPage = lazy(() => import('./pages/PathPage.jsx'))
const TrustPage = lazy(() => import('./pages/TrustPage.jsx'))
const StoryPage = lazy(() => import('./pages/StoryPage.jsx'))
const OriginPage = lazy(() => import('./pages/OriginPage.jsx'))
const LivingNetworkPage = lazy(() => import('./pages/LivingNetworkPage.jsx'))
const ApplyPage = lazy(() => import('./pages/ApplyPage.jsx'))
const Privacy = lazy(() => import('./pages/LegalPage.jsx').then((m) => ({ default: m.Privacy })))
const Terms = lazy(() => import('./pages/LegalPage.jsx').then((m) => ({ default: m.Terms })))
import './styles.css'

// A tiny router: the home page plus the "dive deeper" pages.
// Old addresses (/seeker, /creation…) land on the closest new page.
const ROUTES = {
  '/': App,
  '/path': PathPage,
  '/trust': TrustPage,
  '/story': StoryPage,
  '/origin': OriginPage,
  '/living-network': LivingNetworkPage,
  '/creation': StoryPage,
  '/apply/container': () => <ApplyPage role="container" />,
  '/apply/facilitator': () => <ApplyPage role="facilitator" />,
  '/privacy': Privacy,
  '/terms': Terms,
}
const path = window.location.pathname.replace(/\/+$/, '') || '/'
const Page = ROUTES[path] ?? App
if (!ROUTES[path]) window.history.replaceState(null, '', '/' + window.location.hash)
if (path === '/creation') window.history.replaceState(null, '', '/story')
const titles = { '/apply/container': 'Apply as a Container', '/apply/facilitator': 'Apply as a Facilitator', '/privacy': 'Privacy Policy', '/terms': 'Terms of Service', '/path': 'How the match works', '/trust': 'How we verify', '/story': 'Our story', '/creation': 'Our story', '/living-network': 'The living network', '/origin': 'The Origin' }
if (titles[path]) document.title = `${titles[path]} — Xanadu`

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={null}><Page /></Suspense>
  </React.StrictMode>
)
