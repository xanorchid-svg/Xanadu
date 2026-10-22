import { LINKS } from '../lib/links'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <a href="/" className="footer-word">XANADU</a>
          <span className="footer-sub">A network for awakening places</span>
        </div>
        <div className="footer-col">
          <a href="/path">How the match works</a>
          <a href="/trust">How we verify</a>
          <a href="/living-network">The living network</a>
          <a href="/origin">The Origin</a>
          <a href="/story">Our story</a>
        </div>
        <div className="footer-col">
          <a href={LINKS.email}>networkxanadu@gmail.com</a>
          <a href={LINKS.instagram} rel="noopener" target="_blank">Instagram @dreamxanadu</a>
          <a href={LINKS.facebook} rel="noopener" target="_blank">Facebook @dreamxanadu</a>
        </div>
        <div className="footer-col">
          <a href={LINKS.container}>Apply as a Container</a>
          <a href={LINKS.facilitator}>Apply as a Facilitator</a>
          <a href={LINKS.privacy}>Privacy</a>
          <a href={LINKS.terms}>Terms</a>
        </div>
      </div>
      <p className="footer-legal">© {new Date().getFullYear()} Xanadu</p>
    </footer>
  )
}
