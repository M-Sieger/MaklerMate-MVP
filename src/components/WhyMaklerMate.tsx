// src/components/WhyMaklerMate.tsx

import React, { useState } from 'react';

import styles from './WhyMaklerMate.module.css';

export default function WhyMaklerMate() {
  const [showPanel, setShowPanel] = useState<boolean>(false);

  return (
    <section className={styles.why}>
      <div className={styles.text}>
        <h2>Warum MaklerMate?</h2>
        <p>
          Viele Makler verlieren täglich wertvolle Zeit mit Word-Dokumenten,
          Excel-Listen und Copy-Paste-Chaos. MaklerMate löst das – in einem Tool.
        </p>

        <ul className={styles.bullets}>
          <li>✍️ Immobilienbeschreibung automatisch per KI erstellen</li>
          <li>🗂 Leads einfach verwalten – ohne großes CRM-System</li>
          <li>📤 Social Media Content direkt aus Objektdaten erzeugen</li>
        </ul>

        {/* 👉 Apple-like Toggle-Button */}
        <button
          className={styles.toggleButton}
          onClick={() => setShowPanel(!showPanel)}
        >
          {showPanel ? 'Weniger anzeigen' : 'Mehr erfahren'} →
        </button>
      </div>

      {/* 🎬 Slide-Panel */}
      {showPanel && (
        <div className={styles.slidePanel}>
          <div className={styles.panelText}>
            <h3>Dein Büro in einer App</h3>
            <p>
              Mit MaklerMate erstellst du hochwertige Exposés in wenigen Minuten,
              verwaltest deine Kontakte und erzeugst sogar Inhalte für Social Media – alles
              in einem einzigen Workflow. Keine Word-Templates mehr, keine Copy-Paste-Orgie.
            </p>
          </div>
          <img
            src="/screenshots/screenshot1.png"
            alt="MaklerMate Beispielansicht"
            className={styles.panelImage}
          />
        </div>
      )}
    </section>
  );
}
