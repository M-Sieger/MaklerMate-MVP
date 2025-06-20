// 📄 src/components/Layout.jsx
// ✅ Globales Layout: enthält Navbar + Seiteninhalt + Footer für alle Seiten

import React from 'react';

import {
  Outlet,
} from 'react-router-dom'; // 🔁 Platzhalter für jeweils aktive Seite

import styles from '../styles/Layout.module.css';
// 🎨 CSS-Modul für Layout/Footer
import Navbar from './Navbar';

export default function Layout() {
  return (
    <>
      {/* 🧭 Navigationsleiste oben */}
      <Navbar />

      {/* 📄 Hauptbereich für Seiteninhalte */}
      <main className={styles.main}>
        <Outlet />
      </main>

      {/* 📌 Footer am unteren Rand der Seite */}
      <footer className={styles.footer}>
        © {new Date().getFullYear()} MaklerMate · powered by GPT ·{' '}
        <a href="#" className={styles.footerLink}>Impressum</a>
      </footer>
    </>
  );
}
