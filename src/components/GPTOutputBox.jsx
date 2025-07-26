// ✅ Globale Button-Styles
import '../styles/button.css';

import React from 'react';

// ✅ Modulbasierter CSS-Import
import styles
  from './GPTOutputBox.module.css'; // 🎨 Styling für Box, Text & Galerie

export default function GPTOutputBox({ output, images = [], captions = [] }) {
  return (
    <div className={styles.previewBox}>
      {/* 🧠 Titel & Aktionen */}
      <div className={styles.headingRow}>
        <h2 className={styles.heading}>📄 Exposé-Vorschau</h2>
        {/* 🧩 Optional: Copy-Button oder Export */}
      </div>

      {/* 🤖 GPT-Textvorschau */}
      <div className={styles.outputText}>
        {output || 'Noch kein Text generiert.'}
      </div>

      {/* 🖼️ Bildgalerie inkl. Captions */}
      {images.length > 0 && (
        <div className={styles.gptGallery}>
          {images.map((img, index) => (
            <div key={index} className={styles.gptImageWrapper}>
              <img
                src={img}
                alt={`Bild ${index + 1}`}
                className={styles.gptImage}
              />
              {captions[index] && (
                <div className={styles.gptCaption}>{captions[index]}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
