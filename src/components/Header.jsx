// 📁 src/components/Header.jsx

import React from 'react';

import { NavLink } from 'react-router-dom';

// 🎨 Modernes Glass-Styling
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      {/* 🚀 Branding + Logo */}
      <div className={styles.logoContainer}>
        <img src="/Logo.png" alt="MaklerMate Logo" className={styles.logo} />
        <span className={styles.brandName}>MaklerMate</span>
      </div>

      {/* 🔗 Navigation */}
      <nav className={styles.navLinks}>
        <NavLink to="/" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`} end>
          Home
        </NavLink>
        <NavLink to="/expose" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          Exposés
        </NavLink>
        <NavLink to="/crm" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          CRM
        </NavLink>
        <NavLink to="/impressum" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}>
          Impressum
        </NavLink>
      </nav>
    </header>
  );
}
