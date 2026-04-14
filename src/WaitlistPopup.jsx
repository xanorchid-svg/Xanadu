import { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import './WaitlistPopup.css';

const supabaseUrl = 'https://nmstrfmxflwgbgkiyeyq.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY || '';

// Import from your existing supabase.js instead if preferred
import { supabase } from './supabase.js';

const SHOWN_KEY = 'xanadu_popup_shown';

export default function WaitlistPopup() {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Seeker');
  const [intention, setIntention] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const exitListenerRef = useRef(null);
  const entryTimerRef = useRef(null);

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(SHOWN_KEY);
    if (alreadyShown) return; // Never show again this session

    // Strategy 1: Show after 8 seconds on entry (first visit this session)
    entryTimerRef.current = setTimeout(() => {
      // Only show entry popup if user hasn't scrolled past 20% of page
      const scrollPct = window.scrollY / document.documentElement.scrollHeight;
      if (scrollPct < 0.2) {
        showPopup();
      } else {
        // If they've already scrolled, fall back to exit intent only
        setupExitIntent();
      }
    }, 8000);

    return () => {
      clearTimeout(entryTimerRef.current);
      removeExitIntent();
    };
  }, []);

  const setupExitIntent = () => {
    exitListenerRef.current = (e) => {
      // Exit intent: mouse moves above viewport
      if (e.clientY <= 10) {
        removeExitIntent();
        showPopup();
      }
    };
    document.addEventListener('mousemove', exitListenerRef.current);
  };

  const removeExitIntent = () => {
    if (exitListenerRef.current) {
      document.removeEventListener('mousemove', exitListenerRef.current);
      exitListenerRef.current = null;
    }
  };

  const showPopup = () => {
    sessionStorage.setItem(SHOWN_KEY, 'true'); // Mark as shown — won't show again
    setVisible(true);
  };

  const handleClose = () => {
    setVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) return;
    setLoading(true);
    setError('');
    try {
      const { error: sbError } = await supabase
        .from('waitlist')
        .insert([{ name, email, role, intention }]);
      if (sbError) throw sbError;
      setSubmitted(true);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="popup-overlay" onClick={handleClose}>
      <div className="popup-modal" onClick={e => e.stopPropagation()}>
        <button className="popup-close" onClick={handleClose} aria-label="Close">✕</button>

        {!submitted ? (
          <>
            <p className="popup-overline">The Network Is Forming</p>
            <h2 className="popup-heading">Step Inside</h2>
            <p className="popup-sub">
              Leave your name and intention. We'll reach out when the time is right.
            </p>
            <form className="popup-form" onSubmit={handleSubmit}>
              <input
                className="popup-input"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <input
                className="popup-input"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <select
                className="popup-input popup-select"
                value={role}
                onChange={e => setRole(e.target.value)}
              >
                <option value="Seeker">I am a Seeker</option>
                <option value="Facilitator">I am a Facilitator</option>
                <option value="Container">I hold a Container</option>
              </select>
              <textarea
                className="popup-input popup-textarea"
                placeholder="What brings you here? (optional)"
                value={intention}
                onChange={e => setIntention(e.target.value)}
                rows={3}
              />
              {error && <p className="popup-error">{error}</p>}
              <button className="popup-btn" type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Come as You Are'}
              </button>
            </form>
          </>
        ) : (
          <div className="popup-success">
            <div className="popup-success-mark">✦</div>
            <h2 className="popup-heading">You're inside.</h2>
            <p className="popup-sub">We'll be in touch when the time is right.</p>
          </div>
        )}
      </div>
    </div>
  );
}
