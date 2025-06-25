// Datei: GPTOutputBox.jsx

import React from 'react';

import styles from '../styles/GPTOutputBox.module.css';

const GPTOutputBox = ({ output }) => {
  const isEmpty = !output || output.trim() === '';

  return (
    <div className={styles.previewBox}>
      <h3 className={styles.heading}>🧠 GPT-Ergebnis</h3>

      {/* 🧠 Vorschau anzeigen, wenn kein GPT-Text vorhanden ist */}
      {isEmpty ? (
        <pre className={styles.outputText}>
          📝 Vorschau

          Willkommen bei MaklerMate!
          Hier erscheint dein automatisch generierter Immobilientext,
          sobald du auf "Exposé generieren" klickst.

          👉 Beispiel: "Dieses charmante Altbaujuwel in Köln besticht durch hohe Decken,
          stilvolle Dielen und einen sonnigen Balkon mit Blick auf den Rhein."
        </pre>
      ) : (
        <pre className={styles.outputText}>{output}</pre>
      )}
    </div>
  );
};

export default GPTOutputBox;
