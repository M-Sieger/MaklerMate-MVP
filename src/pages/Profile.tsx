// 📄 src/pages/Profile.tsx
// Zweck: Minimaler Profil-Screen zum Setzen eines Display-Namens in user_metadata.
// Vorteil: Kein zusätzliches DB-Schema nötig, perfekt für Sprint 1.

import React, { useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

export default function Profile() {
  const { user } = useAuth() as any;
  const initial = ((user?.user_metadata?.display_name || '').toString());
  const [displayName, setDisplayName] = useState<string>(initial);
  const [busy, setBusy] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>('');

  if (!user) return null; // Route ist ohnehin geschützt

  async function save(): Promise<void> {
    setBusy(true);
    setMsg('');
    // ✏️ user_metadata schreiben
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName.trim() },
    });
    setBusy(false);
    if (error) return setMsg(`Fehler: ${error.message}`);
    setMsg('Gespeichert ✔');
  }

  return (
    <div style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
      <div style={{ width: 420, maxWidth: '95vw', padding: '1.25rem', borderRadius: 12,
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <h1 style={{ margin: 0, marginBottom: 12 }}>👤 Profil</h1>

        <div style={{ fontSize: 14, opacity: 0.8, marginBottom: 12 }}>
          Eingeloggt als <strong>{user.email}</strong>
        </div>

        <label style={{ display: 'block', marginTop: 12 }}>
          <span>Anzeigename</span>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="z. B. Mo"
            maxLength={40}
            style={{ width: '100%', padding: '0.75rem', borderRadius: 8, marginTop: 6 }}
          />
        </label>

        <button
          onClick={save}
          disabled={busy}
          style={{ width: '100%', marginTop: 16, padding: '0.75rem', borderRadius: 8 }}
        >
          {busy ? 'Speichern…' : 'Speichern'}
        </button>

        {!!msg && <div style={{ marginTop: 10, fontSize: 14, opacity: 0.9 }}>{msg}</div>}
      </div>
    </div>
  );
}
