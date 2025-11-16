/**
 * @fileoverview App Shell mit Header und Outlet
 *
 * ZWECK:
 * - Rendert Header + aktuelle Seite via <Outlet/>
 * - Layout-Wrapper für geschützte Routen
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * STATUS: 🟢 Production-Ready (TypeScript Migration)
 */

import React from 'react';

import { Outlet } from 'react-router-dom';

import Header from '../components/Header';

/**
 * App Shell Component
 *
 * VERWENDUNG:
 * ```tsx
 * <Route element={<AppShell />}>
 *   <Route path="/page" element={<Page />} />
 * </Route>
 * ```
 */
export default function AppShell(): React.ReactElement {
  return (
    <>
      <Header />
      <main style={{ paddingTop: 12 }}>
        <Outlet />
      </main>
    </>
  );
}
