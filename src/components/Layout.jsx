// Layout.jsx – globales Layout mit Navbar + Seiteninhalt
// Wird als Hülle für alle Routen verwendet (Outlet = Seiteninhalt)

import React from 'react';

import { Outlet } from 'react-router-dom';

import Navbar from './Navbar';

const Layout = () => {
  return (
    <>
      <Navbar />
      <main style={{ padding: '2rem' }}>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
