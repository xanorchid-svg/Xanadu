import Button from '../components/Button'
import Emblem from '../components/Emblem'
import { Reveal, Rise, Shimmer } from '../components/Reveal'
import { LINKS } from '../lib/links'

export default function Closing() {
  return (
    <>
      <section className="closing">
        <div className="closing-emblem" aria-hidden="true"><Emblem electrons /></div>
        <div className="wrap center">
          <Reveal className="display huge center">Xanadu begins<br />with <Shimmer>you</Shimmer>.</Reveal>
          <Rise className="closing-actions" delay={0.2}>
            <Button href={LINKS.seeker}>Download the app</Button>
            <Button href={LINKS.container} variant="ghost">Host a space</Button>
            <Button href={LINKS.facilitator} variant="ghost">Guide with us</Button>
          </Rise>
        </div>
      </section>

      <footer className="footer">
        <div className="wrap footer-grid">
          <div className="footer-brand">
            <span className="footer-word">XANADU</span>
            <span className="footer-sub">A network for awakening places</span>
          </div>
          <div className="footer-col">
            <a href={LINKS.email}>networkxanadu@gmail.com</a>
            <a href={LINKS.instagram} rel="noopener" target="_blank">Instagram @dreamxanadu</a>
            <a href={LINKS.facebook} rel="noopener" target="_blank">Facebook @dreamxanadu</a>
          </div>
          <div className="footer-col">
            <a href={LINKS.signIn}>Sign in</a>
            <a href={LINKS.privacy}>Privacy</a>
            <a href={LINKS.terms}>Terms</a>
          </div>
        </div>
        <p className="footer-legal">© {new Date().getFullYear()} Xanadu</p>
      </footer>
    </>
  )
}
