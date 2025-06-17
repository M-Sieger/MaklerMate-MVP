import '../styles/Tabs.css';

// 📦 React & Styles importieren
import React, { useState } from 'react';

// 🧠 Dynamische Tab-Komponente
export default function TabbedForm({ tabs }) {
  // 📌 Aktuell aktiver Tab (Initialwert = erstes Tab-Label)
  const [activeTab, setActiveTab] = useState(tabs[0].label);

  return (
    <div>
      {/* 🔘 Tab-Leiste oben */}
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.label} // 🏷 eindeutiger Schlüssel für React
            className={`tab-button ${activeTab === tab.label ? 'active' : ''}`} // 🔄 aktiv hervorheben
            onClick={() => setActiveTab(tab.label)} // 🖱 Tab aktivieren
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 📦 Inhalt des aktiven Tabs anzeigen */}
      <div className="tab-content">
        {
          // 🔍 Tab-Objekt mit aktivem Label finden und seinen Inhalt rendern
          tabs.find((t) => t.label === activeTab).content
        }
      </div>
    </div>
  );
}
