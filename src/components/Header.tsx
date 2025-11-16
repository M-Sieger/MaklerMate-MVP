// 📁 src/components/Header.tsx
// Zweck: Einheitlicher App-Header mit Logo, Navigation und Auth-Buttons.
// - Links: Branding (klickbar zur Startseite)
// - Mitte: Primärnavigation (mit Active-State via NavLink)
// - Rechts: Login/Logout + Profil-Link (über <AuthButtons/>)
// Hinweis: <AuthButtons/> zeigt "Login" wenn ausgeloggt, sonst Username + Logout.

import React from 'react';

import {
  Link,
  NavLink,
} from 'react-router-dom';

import AuthButtons from './AuthButtons'; // ⬅️ NEU: Login/Logout/Profil
import { PlanBadge } from './PlanBadge'; // ⬅️ SAAS: Plan-Badge (Free/Pro)
import styles from './Header.module.css';

export default function Header() {
  return (
    // role="banner" → bessere Accessibility für Screenreader
    <header className={styles.header} role="banner">
      {/* 🚀 Branding + Logo → Klick führt zur Startseite */}
      <Link to="/" className={styles.logoContainer} aria-label="MaklerMate Startseite">
        {/* Bild liegt in /public/Logo.png und wird von CRA/Vercel korrekt ausgeliefert */}
        <img src="/Logo.png" alt="MaklerMate Logo" className={styles.logo} />
        <span className={styles.brandName}>MaklerMate</span>
      </Link>

      {/* 🔗 Primäre Navigation (Active-State via NavLink) */}
      <nav className={styles.navLinks} aria-label="Hauptnavigation">
        {/* end → Home ist nur auf "/" aktiv, nicht auf Unterseiten */}
        <NavLink
          to="/"
          end
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          Home
        </NavLink>

        <NavLink
          to="/expose"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          Exposés
        </NavLink>

        <NavLink
          to="/crm"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          CRM
        </NavLink>

        <NavLink
          to="/impressum"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
        >
          Impressum
        </NavLink>
      </nav>

      {/* 🔐 Auth-Bereich rechts: zeigt Plan-Badge + Login/Logout */}
      <div className={styles.authArea}>
        <PlanBadge />
        <AuthButtons />
      </div>
    </header>
  );
}
