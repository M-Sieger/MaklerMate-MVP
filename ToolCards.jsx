import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ToolCards.css';

const tools = [
  {
    title: '🧠 Werbetext-Generator',
    desc: 'Erstelle in Sekunden überzeugende Marketingtexte mit GPT.',
    route: '/ads',
    button: 'Jetzt ausprobieren'
  },
  {
    title: '🏡 Immobilien-Exposé-Tool',
    desc: 'Erzeuge automatisch professionelle Exposés für Immobilien.',
    route: '/tools/expose',
    button: 'Demo ansehen'
  },
  {
    title: '📄 HR-Bewerbungsanalyse',
    desc: 'Analysiere Bewerbungen strukturiert & intelligent mit GPT.',
    route: '/tools/hr',
    button: 'Bewerbung prüfen'
  }
];

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
