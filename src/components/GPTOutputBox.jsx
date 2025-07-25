// src/components/GPTOutputBox.jsx

import React from 'react';

import styles
  from './GPTOutputBox.module.css'; // 🔁 Für Box, Headings, OutputText

// 📋 Copy-to-Clipboard-Logik
const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    alert('✅ Text wurde in die Zwischenablage kopiert!');
  });
};

const GPTOutputBox = ({ output }) => {
  const isEmpty = !output || output.trim() === '';

  return (
    <div className={styles.previewBox}>
      {/* 🧠 Headline mit Icon */}
      <div className={styles.headingRow}>
        <h3 className={styles.heading}>🧠 KI-Textvorschau</h3>

        {/* ✂️ Copy-Button im Ivy-Stil */}
        {!isEmpty && (
          <button
            className="btn btn-secondary btn-small"
            onClick={() => copyToClipboard(output)}
            title="In Zwischenablage kopieren"
          >
            📋 Kopieren
          </button>
        )}
      </div>

      {/* 📝 GPT-Output oder Vorschau anzeigen */}
      <pre className={styles.outputText}>
        {isEmpty
          ? `📝 Vorschau\n\nWillkommen bei MaklerMate!\nHier erscheint dein automatisch generierter Immobilientext,\nsobald du auf "Exposé generieren" klickst.\n\n👉 Beispiel: "Dieses charmante Altbaujuwel in Köln besticht durch hohe Decken,\nstilvolle Dielen und einen sonnigen Balkon mit Blick auf den Rhein."`
          : output}
      </pre>
    </div>
  );
};

export default GPTOutputBox;
