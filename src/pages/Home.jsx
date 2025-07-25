// 📄 src/pages/Home.jsx

import './Home.css'; // 🎨 spezifisches Styling

import React from 'react';

import Hero from '../components/Hero'; // 🔁 Apple-like Hero importiert
import ToolCards from '../components/ToolCards'; // 🧰 ToolCards eingebunden
import WhyMaklerMate from '../components/WhyMaklerMate';

export default function Home() {
  return (
    <div className="home-wrapper">
      <Hero /> {/* 🦅 Branding Hero */}

      {/* 🛠 ToolCards Sektion */}
      <section className="tools-section">
        <ToolCards />
      
      </section>

<WhyMaklerMate />
      
    </div>
  );
}
