import React from 'react';

export default function Hero() {
  return (
    <section style={{
      backgroundColor: '#2563eb',
      color: 'white',
      padding: '4rem 2rem',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
        Erledige deine Business-Texte mit nur einem Klick.
      </h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
        GPT Suite generiert dir Werbetexte, Exposés und HR-Analysen – in Sekunden, nicht Stunden.
      </p>
      <a href="#tools" style={{
        backgroundColor: 'white',
        color: '#2563eb',
        padding: '0.75rem 1.5rem',
        borderRadius: '8px',
        fontWeight: 'bold',
        textDecoration: 'none',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        Jetzt starten
      </a>
    </section>
  );
}
