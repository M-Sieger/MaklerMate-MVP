import React from 'react';

import { useNavigate } from 'react-router-dom';

// Liste der verfügbaren Tools – individuell erweiterbar
const tools = [
  {
    title: '📄 Exposé erstellen',
    desc: 'Erzeuge in Sekunden ein KI-gestütztes Immobilien-Exposé.',
    route: '/expose', // neue Route für dein Exposé-Tool
    button: 'Jetzt starten'
  },
  {
    title: '📇 Kontakte verwalten',
    desc: 'Verwalte Interessenten und Leads ganz einfach – CRM-Light für Makler.',
    route: '/crm', // CRM-Bereich
    button: 'CRM öffnen'
  },
  {
    title: '📢 Social Posts (bald)',
    desc: 'Erstelle Social-Media-Inhalte automatisch aus deinen Objektdaten.',
    route: '/social', // Platzhalter für spätere Erweiterung
    button: 'Demnächst verfügbar'
  }
];

// Komponente: ToolCards zeigt alle Tools als klickbare Karten
export default function ToolCards() {
  const navigate = useNavigate();

  return (
    <section id="tools" className="toolcards-section">
      {tools.map((tool, index) => (
        <div key={index} className="toolcard">
          <h3>{tool.title}</h3>
          <p>{tool.desc}</p>
          <button onClick={() => navigate(tool.route)}>
            {tool.button}
          </button>
        </div>
      ))}
    </section>
  );
}
