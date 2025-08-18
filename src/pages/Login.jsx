// 📄 src/pages/Login.jsx
// Zweck: Minimaler Login/Signup-Screen (Email/Passwort + optional Magic Link).
// Fokus: Funktional, kein Polishing nötig.

import React, { useState } from 'react';

import {
  Link,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { signInWithPassword, signInWithMagicLink, signUp, error } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup' | 'magic'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from ?? '/';

  async function handleSubmit(e) {
    e.preventDefault();
    setBusy(true);

    let err;
    if (mode === 'login') {
      err = await signInWithPassword({ email, password });
    } else if (mode === 'signup') {
      err = await signUp({ email, password });
    } else if (mode === 'magic') {
      err = await signInWithMagicLink({ email });
    }

    setBusy(false);
    if (!err) {
      // Magic Link: Info anzeigen, sonst direkt weiter
      if (mode === 'magic') {
        alert('Magic Link gesendet. Bitte Mail prüfen.');
      } else {
        navigate(redirectTo, { replace: true });
      }
    }
  }

  return (
    <div style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <div style={{ width: 380, maxWidth: '95vw', padding: '1.25rem', borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h1 style={{ margin: 0, marginBottom: 12 }}>🔐 {mode === 'login' ? 'Login' : mode === 'signup' ? 'Registrieren' : 'Magic Link'}</h1>

        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginTop: 12 }}>
            <span>E-Mail</span>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="name@example.com"
              style={{ width: '100%', padding: '0.75rem', borderRadius: 8, marginTop: 6 }}
            />
          </label>

          {mode !== 'magic' && (
            <label style={{ display: 'block', marginTop: 12 }}>
              <span>Passwort</span>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 8, marginTop: 6 }}
              />
            </label>
          )}

          {!!error && (
            <div style={{ color: '#f87171', marginTop: 12 }}>
              {error.message ?? 'Fehler beim Login'}
            </div>
          )}

          <button disabled={busy} type="submit" style={{ width: '100%', marginTop: 16, padding: '0.75rem', borderRadius: 8 }}>
            {busy ? 'Bitte warten…' : (mode === 'login' ? 'Einloggen' : mode === 'signup' ? 'Account anlegen' : 'Magic Link senden')}
          </button>
        </form>

        <div style={{ marginTop: 12, fontSize: 14, opacity: 0.9 }}>
          {mode !== 'login' && <button onClick={() => setMode('login')} style={{ marginRight: 8 }}>Login</button>}
          {mode !== 'signup' && <button onClick={() => setMode('signup')} style={{ marginRight: 8 }}>Registrieren</button>}
          {mode !== 'magic' && <button onClick={() => setMode('magic')}>Magic Link</button>}
        </div>

        <div style={{ marginTop: 16, fontSize: 13 }}>
          <Link to="/">⬅︎ Zurück</Link>
        </div>
      </div>
    </div>
  );
}
