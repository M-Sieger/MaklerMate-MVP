// Rendert immer den Header + darunter die aktuelle Seite via <Outlet/>
import React from 'react';

import { Outlet } from 'react-router-dom';

import Header from '../components/Header';

export default function AppShell() {
  return (
    <>
      <Header />
      <main style={{ paddingTop: 12 }}>
        <Outlet />
      </main>
    </>
  );
}
