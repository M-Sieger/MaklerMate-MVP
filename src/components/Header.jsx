// 📁 src/components/Header.jsx

import './Header.css'; // 🎨 Stil bleibt bestehen

import React from 'react';

import { NavLink } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header">
      {/* 🔄 Branding-Logo ersetzt */}
      <div className="logoContainer">
        <img src="/Logo.png" alt="MaklerMate Logo" />
        <span className="brandName">MaklerMate</span>
      </div>

      {/* 🔗 Navigation */}
      <nav className="navLinks">
        <NavLink to="/" className="navLink" end>Home</NavLink>
        <NavLink to="/expose" className="navLink">Exposés</NavLink>
        <NavLink to="/crm" className="navLink">CRM</NavLink>
        <NavLink to="/impressum" className="navLink">Impressum</NavLink>
      </nav>
    </header>
  );
}
