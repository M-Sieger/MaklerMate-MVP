// 📁 src/components/Header.jsx

import './Header.css'; // falls du das globale CSS nutzt

import React from 'react';

import {
  Link,
  NavLink,
} from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo-link">
          <img src="/logo192.png" alt="MaklerMate Logo" className="logo-img" />
          <span className="logo-text">MaklerMate</span>
        </Link>
      </div>
      <nav className="header-nav">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/expose">Exposés</NavLink>
        <NavLink to="/crm">CRM</NavLink>
        <NavLink to="/impressum">Impressum</NavLink>
      </nav>
    </header>
  );
}

export default Header;
