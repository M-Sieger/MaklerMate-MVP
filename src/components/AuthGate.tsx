// 📄 src/components/AuthGate.tsx
// Zweck: UI-Guard. Rendert Kinder nur wenn eingeloggt – sonst Hinweis + Link.
// Einsatz: Umschließt die Exposé-Erstellung (z. B. Button oder ganze Section).

import React from 'react';

import {
  Link,
  useLocation,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

// ==================== TYPES ====================

interface AuthGateProps {
  /** Child elements to render when authenticated */
  children: React.ReactNode;

  /** Message to show when not authenticated */
  fallbackMessage?: string;
}

// ==================== COMPONENT ====================

export default function AuthGate({
  children,
  fallbackMessage = 'Bitte einloggen, um ein Exposé zu erstellen.'
}: AuthGateProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ opacity: 0.8 }}>Lade…</div>;
  }

  if (!user) {
    return (
      <div style={{ padding: '1rem', border: '1px dashed rgba(255,255,255,0.2)', borderRadius: 12 }}>
        <div style={{ marginBottom: 8 }}>{fallbackMessage}</div>
        <Link to="/login" state={{ from: location.pathname }}>
          <button>Zum Login</button>
        </Link>
      </div>
    );
  }

  return <>{children}</>;
}
