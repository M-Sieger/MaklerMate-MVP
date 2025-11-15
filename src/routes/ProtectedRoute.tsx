/**
 * @fileoverview Protected Route Component
 *
 * ZWECK:
 * - Router-Guard für geschützte Seiten
 * - Redirect zu /login wenn nicht eingeloggt
 * - State-Preserving für Rückkehr-Navigation
 *
 * VERWENDUNG:
 * ```tsx
 * <Route element={<ProtectedRoute />}>
 *   <Route path="/expose" element={<ExposeTool />} />
 * </Route>
 * ```
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * STATUS: 🟢 Production-Ready (TypeScript Migration)
 */

import React from 'react';

import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

/**
 * Protected Route Component
 *
 * FLOW:
 * 1. Check Auth-Status
 * 2. Show Loading während Auth-Check
 * 3. Redirect zu /login wenn nicht eingeloggt
 * 4. Render Outlet wenn eingeloggt
 */
export default function ProtectedRoute(): JSX.Element {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Loading State
  if (loading) {
    return <div style={{ padding: '1rem' }}>Lade…</div>;
  }

  // Not Authenticated - Redirect to Login
  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Authenticated - Render Child Routes
  return <Outlet />;
}
