// 📄 src/components/AuthButtons.jsx
// Zweck: Drop-in-Komponente für Header/Navi: zeigt Login/Logout & User-Mail.
// Styling bewusst schlicht, damit sie überall einsetzbar ist.

import React from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

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
      <span style={{ fontSize: 13, opacity: 0.85 }}>{user.email}</span>
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
