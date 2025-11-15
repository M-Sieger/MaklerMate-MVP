// 📁 src/components/Hero.tsx

import './Hero.css'; // 🎨 Stil & Animation

import React from 'react';

import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-inner">
        <img
          src="/Logo.png"
          alt="MaklerMate Logo"
          className="hero-logo animate-fade"
        />

        <h1 className="hero-claim animate-up delay-1">
          Weniger tippen. Mehr verkaufen.
        </h1>

        <p className="hero-subline animate-up delay-2">
          Erstelle dein Exposé in 3 Minuten – mit KI, CRM & PDF-Export.
        </p>

        <Link to="/expose" className="hero-btn primary animate-up delay-3">
          Jetzt starten
        </Link>
      </div>
    </section>
  );
}
