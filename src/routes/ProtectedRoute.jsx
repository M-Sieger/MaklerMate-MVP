// 📄 src/routes/ProtectedRoute.jsx
// Zweck: Router-Guard für ganze Seiten (z. B. /expose).
// Alternativ zu <AuthGate/> wenn man Routen statt einzelne Sektionen schützt.

import React from 'react';

import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div style={{ padding: '1rem' }}>Lade…</div>;
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;

  return <Outlet />;
}
