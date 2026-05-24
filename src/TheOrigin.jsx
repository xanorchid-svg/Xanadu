import { useNavigate } from "react-router-dom";
import flameImg from "./assets/origin-flame.webp";
import "./TheOrigin.css";

export default function TheOrigin() {
  const navigate = useNavigate();

  return (
    <section className="origin-section">
      {/* Flame background image */}
      <div className="origin-flame-bg" style={{ backgroundImage: `url(${flameImg})` }} aria-hidden="true" />
      <div className="origin-overlay" aria-hidden="true" />

      {/* Subtle rings over the image */}
      <div className="origin-bg" aria-hidden="true">
        <div className="origin-ring origin-ring-1" />
        <div className="origin-ring origin-ring-2" />
        <div className="origin-ring origin-ring-3" />
      </div>

      <div className="origin-inner">
        <p className="origin-overline">Where It Begins</p>

        <h2 className="origin-heading">The Origin</h2>

        <p className="origin-body">
          We are beginning with people we trust through personal connection — not an algorithm,
          not an open call. Thirty-three Containers. Sixty-six Facilitators. Chosen carefully.
          Invited personally. Once the circle is complete, we build the app that opens Xanadu
          to Seekers.
        </p>

        <p className="origin-body origin-body-italic">
          You are witnessed. You are seen. This is trust.
        </p>

        <div className="origin-numbers">
          <div className="origin-number-card">
            <span className="origin-number">33</span>
            <span className="origin-number-label">Containers</span>
            <span className="origin-number-sub">Sacred spaces</span>
          </div>
          <div className="origin-divider">✦</div>
          <div className="origin-number-card">
            <span className="origin-number">66</span>
            <span className="origin-number-label">Facilitators</span>
            <span className="origin-number-sub">Guides & practitioners</span>
          </div>
        </div>

        <p className="origin-invitation">
          This network grows together. Every member is known. Every space is held.
          Every guide is witnessed. When you join, you are not a listing —
          you are part of something.
        </p>

        <div className="origin-ctas">
          <button
            className="origin-cta origin-cta-primary"
            onClick={() => {
              const el = document.getElementById('join');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Apply as a Container
          </button>
          <button
            className="origin-cta origin-cta-secondary"
            onClick={() => {
              const el = document.getElementById('join');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Apply as a Facilitator
          </button>
        </div>

        <p className="origin-note">
          Every application is reviewed personally. You will hear back within 48 hours.
        </p>
      </div>
    </section>
  );
}
