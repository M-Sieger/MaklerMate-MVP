// 📄 src/components/Layout.tsx
import React from 'react';

import {
  Outlet,
} from 'react-router-dom'; // 🔁 Platzhalter für jeweils aktive Seite

import styles from '../styles/Layout.module.css';
// 🎨 CSS-Modul für Layout/Footer
import Header from './Header'; // ✅ Neuer Header

export default function Layout() {
  return (
    <>
      {/* 🧭 Oben: Header mit Branding + Navigation */}
      <Header />

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
