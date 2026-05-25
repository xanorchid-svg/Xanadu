import { useNavigate } from "react-router-dom";
import flameImg from "./assets/origin-flame.webp";
import "./TheOrigin.css";

export default function TheOrigin() {
  const navigate = useNavigate();

  const scrollToJoin = () => {
    const el = document.getElementById('join');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="origin-section">
      <div className="origin-flame-bg" style={{ backgroundImage: `url(${flameImg})` }} aria-hidden="true" />
      <div className="origin-overlay" aria-hidden="true" />

      <div className="origin-bg" aria-hidden="true">
        <div className="origin-ring origin-ring-1" />
        <div className="origin-ring origin-ring-2" />
        <div className="origin-ring origin-ring-3" />
      </div>

      <div className="origin-inner">
        <p className="origin-overline">Where It Begins</p>

        <h2 className="origin-heading">The Origin</h2>

        <p className="origin-body">
          We are beginning with the people and places we already trust.
          Not through an open call. Not through an algorithm.
          Through personal connection, discernment, and the slow work of knowing.
        </p>

        <p className="origin-body">
          When the circle feels complete, we open Xanadu to Seekers.
          Not before.
        </p>

        <p className="origin-body origin-body-italic">
          Xanadu begins with you.
        </p>

        <p className="origin-invitation">
          This network grows together. Every member is known. Every space is held.
          Every guide is witnessed. When you join, you are not a listing —
          you are part of something.
        </p>

        <div className="origin-ctas">
          <button className="origin-cta origin-cta-primary" onClick={scrollToJoin}>
            Apply as a Container
          </button>
          <button className="origin-cta origin-cta-secondary" onClick={scrollToJoin}>
            Apply as a Facilitator
          </button>
        </div>

        <p className="origin-note">
          Every application is reviewed personally.
        </p>
      </div>
    </section>
  );
}
