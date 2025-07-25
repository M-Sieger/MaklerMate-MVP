// 📄 src/components/ToolCards.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/ToolCards.module.css'; // 🎨 neues CSS-Modul

export default function ToolCards() {
  const navigate = useNavigate();

  return (
    <div className={styles.toolGrid}>
      {/* 🏠 Exposé Generator */}
      <div className={styles.card}>
        <h3 className={styles.title}>🏠 Exposé erstellen</h3>
        <p className={styles.description}>
          Erzeuge in Sekunden ein KI-gestütztes Immobilien-Exposé.
        </p>
        <button onClick={() => navigate('/expose')} className={styles.button}>
          Jetzt starten
        </button>
      </div>

      {/* 📇 CRM */}
      <div className={styles.card}>
        <h3 className={styles.title}>📇 Kontakte verwalten</h3>
        <p className={styles.description}>
          Verwalte Interessenten und Leads ganz einfach – CRM-Light für Makler.
        </p>
        <button onClick={() => navigate('/crm')} className={styles.button}>
          CRM öffnen
        </button>
      </div>

      {/* 📣 Social Media Placeholder */}
      <div className={`${styles.card} ${styles.disabled}`}>
        <h3 className={styles.title}>
          📣 Social Posts <span className={styles.badge}>bald</span>
        </h3>
        <p className={styles.description}>
          Erstelle automatisch Inhalte für Social Media – aus deinen Objektdaten.
        </p>
        <button disabled className={styles.button}>
          Demnächst verfügbar
        </button>
      </div>
    </div>
  );
}
