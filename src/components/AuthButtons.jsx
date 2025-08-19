// 📄 src/components/AuthButtons.jsx
// Zweck: Rechts im Header – zeigt Display-Name (oder E-Mail) + Link zum Profil + Logout.

import React from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

function labelFromUser(user) {
  const metaName = user?.user_metadata?.display_name;
  if (metaName && String(metaName).trim()) return String(metaName).trim();
  // Fallback: lokaler Teil der E-Mail
  const email = user?.email || '';
  return email.includes('@') ? email.split('@')[0] : email;
}

export default function AuthButtons() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        <Link to="/login">
          <button>Login</button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Link to="/profile" title="Profil">
        <span style={{ fontSize: 13, opacity: 0.9, textDecoration: 'underline', cursor: 'pointer' }}>
          {labelFromUser(user)}
        </span>
      </Link>
      <button
        onClick={async () => {
          await signOut();
          navigate('/', { replace: true });
        }}
      >
        Logout
      </button>
    </div>
  );
}
