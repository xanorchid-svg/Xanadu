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

export default function ContainerApply() {
  const [form, setForm] = useState({
    your_name: "",
    email: "",
    phone: "",
    container_name: "",
    website: "",
    instagram: "",
    city: "",
    country: "",
    also_based: "",
    offerings: "",
    heard_from: "",
  });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.your_name || !form.email || !form.container_name || !form.city || !form.country) {
      setErrorMsg("Please fill in your name, email, container name, and location.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    const { error } = await supabase.from("container_applications").insert([
      {
        your_name: form.your_name,
        email: form.email,
        phone: form.phone || null,
        container_name: form.container_name,
        website: form.website || null,
        instagram: form.instagram || null,
        city: form.city,
        country: form.country,
        also_based: form.also_based || null,
        offerings: form.offerings,
        heard_from: form.heard_from || null,
        role: "container",
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
          <p className="apply-overline">The Origin · 33 Containers</p>
          <h1 className="apply-heading">Apply as a Container</h1>
          <p className="apply-subheading">
            A Container is a sacred space — a retreat center, ecovillage, temple, or land-based
            sanctuary. If you hold space, this is for you.
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

          <div className="apply-section-label" style={{ marginTop: 40 }}>Your Space</div>
          <div className="apply-field">
            <label>Container name <span className="req">*</span></label>
            <input type="text" value={form.container_name} onChange={set("container_name")} placeholder="The name of your space" />
          </div>
          <div className="apply-row">
            <div className="apply-field">
              <label>Website <span className="optional">(optional)</span></label>
              <input type="url" value={form.website} onChange={set("website")} placeholder="https://" />
            </div>
            <div className="apply-field">
              <label>Instagram <span className="optional">(optional)</span></label>
              <input type="text" value={form.instagram} onChange={set("instagram")} placeholder="@yourspace" />
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
            <input type="text" value={form.also_based} onChange={set("also_based")} placeholder="Seasonal locations, second spaces..." />
          </div>

          <div className="apply-section-label" style={{ marginTop: 40 }}>The Work</div>
          <div className="apply-field">
            <label>What kinds of experiences do you host or want to host?</label>
            <textarea
              value={form.offerings}
              onChange={set("offerings")}
              placeholder="Retreats, ceremonies, residencies, workshops... Tell us about what happens in your space and what you're looking for."
              rows={5}
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
