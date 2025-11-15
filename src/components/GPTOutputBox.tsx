// ✅ Globale Button-Styles (für z. B. Exportbuttons unten)
import '../styles/button.css';

import React from 'react';

// ✅ Galerie-Komponente korrekt importieren
import ExposeImageGallery from './ExposeImageGallery';
// ✅ Modul-CSS für Vorschau-Box & Text
import styles from './GPTOutputBox.module.css';

// ==================== TYPES ====================

interface GPTOutputBoxProps {
  /** Generierter Exposé-Text */
  output: string;

  /** Array von Bild-URLs (Base64) */
  images?: string[];

  /** Array von Bildunterschriften */
  captions?: string[];
}

// ==================== COMPONENT ====================

export default function GPTOutputBox({ output, images = [], captions = [] }: GPTOutputBoxProps) {
  return (
    <div className={styles.previewBox}>
      {/* 🧠 Titelzeile mit Trenner */}
      <div className={styles.headingRow}>
        <h2 className={styles.heading}>📝 Exposé-Vorschau</h2>
        <div className={styles.separator}></div>
      </div>

      {/* ✏️ GPT-generierter Textbereich */}
      <div className={styles.outputText}>
        {output || 'Noch kein Text generiert.'}
      </div>

      {/* 🖼️ Bild-Galerie über eigene Komponente */}
      {images.length > 0 && (
        <ExposeImageGallery
          images={images.map((img, i) => ({
            url: img,
            caption: captions[i] || '',
          }))}
        />
      )}
    </div>
  );
}
