import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import PathPage from './pages/PathPage.jsx'
import TrustPage from './pages/TrustPage.jsx'
import StoryPage from './pages/StoryPage.jsx'
import './styles.css'

// A tiny router: the home page plus three "dive deeper" pages.
// Old addresses (/seeker, /creation…) land on the closest new page.
const ROUTES = {
  '/': App,
  '/path': PathPage,
  '/trust': TrustPage,
  '/story': StoryPage,
  '/creation': StoryPage,
  '/living-network': TrustPage,
}
const path = window.location.pathname.replace(/\/+$/, '') || '/'
const Page = ROUTES[path] ?? App
if (!ROUTES[path]) window.history.replaceState(null, '', '/' + window.location.hash)
if (path === '/creation') window.history.replaceState(null, '', '/story')
if (path === '/living-network') window.history.replaceState(null, '', '/trust')
const titles = { '/path': 'How the match works', '/trust': 'How we verify', '/story': 'Our story', '/creation': 'Our story', '/living-network': 'How we verify' }
if (titles[path]) document.title = `${titles[path]} — Xanadu`

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>
)
