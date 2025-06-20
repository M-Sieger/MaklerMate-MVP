// 📄 src/components/ToolCards.jsx

import React from 'react';

import { useNavigate } from 'react-router-dom';

import styles from '../styles/ToolCards.module.css'; // 🎨 eigenes Stylesheet

export default function ToolCards() {
  const navigate = useNavigate();

  return (
    <div className={styles.cardGrid}>
      
      {/* 🏠 Exposé Generator */}
      <div className={styles.card}>
        <h2>🏠 Exposé erstellen</h2>
        <p>Erzeuge in Sekunden ein KI-gestütztes Immobilien-Exposé.</p>
        <button onClick={() => navigate('/expose')} className={styles.cardButton}>
          Jetzt starten
        </button>
      </div>

      {/* 📇 CRM */}
      <div className={styles.card}>
        <h2>📇 Kontakte verwalten</h2>
        <p>Verwalte Interessenten und Leads ganz einfach – CRM-Light für Makler.</p>
        <button onClick={() => navigate('/crm')} className={styles.cardButton}>
          CRM öffnen
        </button>
      </div>

      {/* 📣 Social Media (Platzhalter) */}
      <div className={`${styles.card} ${styles.disabled}`}>
        <h2>📣 Social Posts (bald)</h2>
        <p>Erstelle Social-Media-Inhalte automatisch aus deinen Objektdaten.</p>
        <button disabled className={styles.cardButton}>
          Demnächst verfügbar
        </button>
      </div>
    </div>
  );
}
