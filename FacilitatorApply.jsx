import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "./supabase";
import "./ApplyForm.css";

const HEARD_OPTIONS = [
  "Personal connection with Leo",
  "Instagram",
  "WhatsApp",
  "Word of mouth",
  "Other",
];

export default function FacilitatorApply() {
  const [form, setForm] = useState({
    your_name: "",
    email: "",
    phone: "",
    website: "",
    instagram: "",
    city: "",
    country: "",
    also_based: "",
    offerings: "",
    intention: "",
    heard_from: "",
  });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.your_name || !form.email || !form.city || !form.country) {
      setErrorMsg("Please fill in your name, email, and location.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    const { error } = await supabase.from("facilitator_applications").insert([
      {
        your_name: form.your_name,
        email: form.email,
        phone: form.phone || null,
        website: form.website || null,
        instagram: form.instagram || null,
        city: form.city,
        country: form.country,
        also_based: form.also_based || null,
        offerings: form.offerings,
        lineage: form.intention,
        heard_from: form.heard_from || null,
        role: "facilitator",
      },
    ]);
    if (error) {
      console.error(error);
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again or email us directly.");
    } else {
      setStatus("success");
    }
  };

  if (status === "success") {
    return (
      <div className="apply-page">
        <div className="apply-success">
          <div className="apply-success-mark">✦</div>
          <h2 className="apply-success-heading">You're in the circle.</h2>
          <p className="apply-success-body">
            Every application is reviewed personally. You'll hear from us within 48 hours.
            This is not automated. There is a human on the other side.
          </p>
          <Link to="/" className="apply-success-link">Return to Xanadu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="apply-page">
      <nav className="apply-nav">
        <Link to="/" className="apply-nav-logo">XANADU</Link>
      </nav>

      <div className="apply-container">
        <div className="apply-header">
          <p className="apply-overline">The Origin · 66 Facilitators</p>
          <h1 className="apply-heading">Apply as a Facilitator</h1>
          <p className="apply-subheading">
            A Facilitator is a guide — someone who holds space for human transformation.
            Breathwork, ceremony, somatic work, yoga, sound healing, or any practice
            rooted in genuine care for others.
          </p>
          <div className="apply-trust-line">
            <span>Reviewed personally.</span>
            <span>You will hear back within 48 hours.</span>
          </div>
        </div>

        <div className="apply-form">
          <div className="apply-section-label">You</div>
          <div className="apply-field">
            <label>Your name <span className="req">*</span></label>
            <input type="text" value={form.your_name} onChange={set("your_name")} placeholder="Your full name" />
          </div>
          <div className="apply-row">
            <div className="apply-field">
              <label>Email <span className="req">*</span></label>
              <input type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />
            </div>
            <div className="apply-field">
              <label>Phone <span className="optional">(optional)</span></label>
              <input type="tel" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" />
            </div>
          </div>
          <div className="apply-row">
            <div className="apply-field">
              <label>Website <span className="optional">(optional)</span></label>
              <input type="url" value={form.website} onChange={set("website")} placeholder="https://" />
            </div>
            <div className="apply-field">
              <label>Instagram <span className="optional">(optional)</span></label>
              <input type="text" value={form.instagram} onChange={set("instagram")} placeholder="@yourhandle" />
            </div>
          </div>

          <div className="apply-section-label" style={{ marginTop: 40 }}>Location</div>
          <div className="apply-row">
            <div className="apply-field">
              <label>City <span className="req">*</span></label>
              <input type="text" value={form.city} onChange={set("city")} placeholder="Nosara" />
            </div>
            <div className="apply-field">
              <label>Country <span className="req">*</span></label>
              <input type="text" value={form.country} onChange={set("country")} placeholder="Costa Rica" />
            </div>
          </div>
          <div className="apply-field">
            <label>Also based in <span className="optional">(optional)</span></label>
            <input type="text" value={form.also_based} onChange={set("also_based")} placeholder="Bali Nov–Mar, Tulum in spring..." />
          </div>

          <div className="apply-section-label" style={{ marginTop: 40 }}>The Work</div>
          <div className="apply-field">
            <label>What do you offer?</label>
            <textarea
              value={form.offerings}
              onChange={set("offerings")}
              placeholder="Breathwork, ceremony, somatic work, yoga, sound healing... Describe what you do and who you do it for."
              rows={4}
            />
          </div>
          <div className="apply-field">
            <label>What is your intention?</label>
            <textarea
              value={form.intention}
              onChange={set("intention")}
              placeholder="Why do you do this work? What called you to it? What do you hold for the people you guide?"
              rows={4}
            />
          </div>

          <div className="apply-field">
            <label>How did you hear about Xanadu? <span className="optional">(optional)</span></label>
            <select value={form.heard_from} onChange={set("heard_from")}>
              <option value="">Select one</option>
              {HEARD_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          {errorMsg && <p className="apply-error">{errorMsg}</p>}

          <button
            className={`apply-submit ${status === "loading" ? "loading" : ""}`}
            onClick={handleSubmit}
            disabled={status === "loading"}
          >
            {status === "loading" ? "Sending..." : "Join The Origin"}
          </button>

          <p className="apply-footnote">
            This is not a public directory. Every application is reviewed by a human.
            We will reach out personally.
          </p>
        </div>
      </div>
    </div>
  );
}
