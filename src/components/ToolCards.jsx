// 📄 src/components/ToolCards.jsx

import React from 'react';

import { useNavigate } from 'react-router-dom';

import styles
  from '../styles/ToolCards.module.css'; // 🎨 überarbeitetes Styling

export default function ToolCards() {
  const navigate = useNavigate();

  return (
    <div className={styles.cardGrid}>
      {/* 🏠 Exposé Generator */}
      <div className={styles.card}>
        <h3>🏠 Exposé erstellen</h3>
        <p>Erzeuge in Sekunden ein KI-gestütztes Immobilien-Exposé.</p>
        <button onClick={() => navigate('/expose')} className={styles.cardButton}>
          Jetzt starten
        </button>
      </div>

      {/* 📇 CRM */}
      <div className={styles.card}>
        <h3>📇 Kontakte verwalten</h3>
        <p>Verwalte Interessenten und Leads ganz einfach – CRM-Light für Makler.</p>
        <button onClick={() => navigate('/crm')} className={styles.cardButton}>
          CRM öffnen
        </button>
      </div>

      {/* 📣 Social Media (Platzhalter) */}
      <div className={`${styles.card} ${styles.disabled}`}>
        <h3>📣 Social Posts <span className={styles.badge}>bald</span></h3>
        <p>Erstelle automatisch Inhalte für Social Media – aus deinen Objektdaten.</p>
        <button disabled className={styles.cardButton}>Demnächst verfügbar</button>
      </div>
    </div>
  );
}