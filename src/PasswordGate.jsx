import { useState, useEffect } from 'react';

const STORAGE_KEY = 'xanadu_auth';
const PASSWORD = 'xanadulife';

export default function PasswordGate({ children }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) === 'true') {
      setAuthed(true);
    }
  }, []);

  const handleSubmit = () => {
    if (pw === PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setAuthed(true);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setError(false), 2000);
      setPw('');
    }
  };

  if (authed) return children;

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f6f3ee',
      padding: '24px',
      fontFamily: "'Raleway', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@300;400&family=Raleway:wght@200;300;400&display=swap');
        @keyframes xanadu-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
        @keyframes xanadu-fade-in {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .xanadu-gate-form {
          animation: xanadu-fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .xanadu-gate-form.shake {
          animation: xanadu-shake 0.45s ease;
        }
        .xanadu-gate-input {
          font-family: 'Raleway', sans-serif;
          font-weight: 300;
          font-size: 15px;
          padding: 14px 20px;
          border: 1px solid #d4cfc8;
          background: white;
          color: #0d1c2b;
          outline: none;
          width: 100%;
          letter-spacing: 0.08em;
          transition: border-color 0.2s;
          border-radius: 0;
        }
        .xanadu-gate-input:focus {
          border-color: #b8862a;
        }
        .xanadu-gate-input.error {
          border-color: #6b2d4e;
        }
        .xanadu-gate-btn {
          font-family: 'Cinzel', serif;
          font-size: 11px;
          font-weight: 400;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 14px 32px;
          background: #0d1c2b;
          color: #f6f3ee;
          border: none;
          cursor: pointer;
          width: 100%;
          margin-top: 12px;
          transition: background 0.2s;
        }
        .xanadu-gate-btn:hover {
          background: #162638;
        }
      `}</style>

      {/* Logomark — simple SVG stand-in, uses your brand colours */}
      <div style={{ marginBottom: 40, opacity: 0.35 }}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <polygon points="20,4 36,32 4,32" stroke="#b8862a" strokeWidth="1" fill="none" />
          <circle cx="20" cy="20" r="6" stroke="#b8862a" strokeWidth="1" fill="none" />
          <circle cx="20" cy="20" r="2" fill="#b8862a" />
        </svg>
      </div>

      <div className={`xanadu-gate-form${shake ? ' shake' : ''}`} style={{ textAlign: 'center', width: '100%', maxWidth: 320 }}>
        <h1 style={{
          fontFamily: "'Cinzel', serif",
          fontWeight: 300,
          fontSize: 22,
          letterSpacing: '0.3em',
          color: '#0d1c2b',
          marginBottom: 8,
          textTransform: 'uppercase',
        }}>
          Xanadu
        </h1>
        <p style={{
          fontFamily: "'Raleway', sans-serif",
          fontWeight: 200,
          fontSize: 12,
          letterSpacing: '0.15em',
          color: '#8a7e74',
          marginBottom: 36,
          textTransform: 'uppercase',
        }}>
          A Network for Awakening Places
        </p>

        <input
          className={`xanadu-gate-input${error ? ' error' : ''}`}
          type="password"
          placeholder="Enter password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          autoFocus
        />

        {error && (
          <p style={{
            fontFamily: "'Raleway', sans-serif",
            fontSize: 12,
            color: '#6b2d4e',
            marginTop: 8,
            letterSpacing: '0.05em',
          }}>
            That's not the word.
          </p>
        )}

        <button className="xanadu-gate-btn" onClick={handleSubmit}>
          Enter
        </button>
      </div>
    </div>
  );
}
