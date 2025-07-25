// 📄 Home.jsx – Apple-inspiriertes Dashboard

import React from 'react';

import { Link } from 'react-router-dom';

import ToolCards
  from '../components/ToolCards'; // 🛠 ToolCards laden (morph + theme-based)

export default function Home() {
  return (
    <div className="home-wrapper">
      {/* 🎯 Hero zentriert */}
      <section className="hero">
        <img src="/logo1.png" alt="MaklerMate Logo" className="hero-logo" />
        <h1 className="hero-title">MaklerMate</h1>
        <p className="hero-sub">Weniger tippen. Mehr verkaufen.</p>

        <div className="hero-actions">
          <Link to="/expose" className="cta-button">Jetzt starten</Link>
          <Link to="/crm" className="cta-outline">CRM öffnen</Link>
        </div>
      </section>

      {/* 🧰 Tool Cards */}
      <section className="tool-grid">
        <ToolCards />
      </section>
    </div>
  );
}
