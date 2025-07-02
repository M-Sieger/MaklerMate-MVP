// src/components/ExportButtons.jsx

import React from 'react';

// 🎨 Styling für die Export-Schaltflächen (Glassmorphismus etc.)
import styles from '../styles/ExportBox.module.css';
// 🧠 PDF-Export-Funktion importieren (als alias für bessere Lesbarkeit)
import {
  exportExposeWithImages as exportExposeAsPDF,
} from '../utils/pdfExportExpose';

export default function ExportButtons({ formData, output, selectedStyle }) {
  // 📁 JSON-Export: Speichert das komplette Exposé (Daten, GPT-Text, Stil)
  const handleExportJSON = () => {
    const fullData = {
      ...formData,        // Formularfelder
      output,             // GPT-Output (kann Objekt sein)
      selectedStyle,      // Stilwahl: sachlich, emotional etc.
    };

    const blob = new Blob([JSON.stringify(fullData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expose-export.json';
    a.click();
    URL.revokeObjectURL(url); // Aufräumen
  };

  // 📋 Copy: GPT-Text in Zwischenablage (falls output als Objekt, dann stringifizieren)
  const handleCopy = () => {
    const safeText = typeof output === 'string' ? output : JSON.stringify(output, null, 2);
    navigator.clipboard.writeText(safeText);
    alert('📋 Text kopiert!');
  };

  // 📄 PDF-Export: Übergibt Daten an die Exportfunktion (Text, Bilder, Captions)
  const handleExportPDF = async () => {
    try {
      // 🔍 Fix: Wenn output ein Objekt ist (z. B. { text: '...' }), nimm explizit das Textfeld
      const gptText =
        typeof output === 'string'
          ? output
          : output?.text || output?.content || '[Kein GPT-Text]';

      const images = (formData?.images || []).filter(img => typeof img === 'string' && img.startsWith('data:image'));

      const captions = Array.isArray(formData?.captions) ? formData.captions : images.map(() => '');

      // 🧾 Aufruf der zentralen PDF-Exportfunktion
      await exportExposeAsPDF(gptText, images, captions);
    } catch (error) {
      console.error('❌ Fehler beim PDF-Export:', error);
    }
  };

  // 🧱 UI: Drei Schaltflächen – JSON speichern, Text kopieren, PDF exportieren
  return (
    <div style={{ marginTop: '1rem' }}>
      <button onClick={handleExportJSON}>📁 JSON exportieren</button>
      <button onClick={handleCopy}>📋 Text kopieren</button>
      <button className={styles.exportButton} onClick={handleExportPDF}>
        📄 PDF exportieren
      </button>
    </div>
  );
}
