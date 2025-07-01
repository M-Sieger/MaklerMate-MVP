// src/components/ExportButtons.jsx

import React from 'react';

// 🎨 Styling für den PDF-Export-Button (Glassmorphismus etc.)
import styles from '../styles/ExportBox.module.css';
// 🧠 Korrigierter Import der PDF-Exportfunktion aus utils
// Wichtig: Groß-/Kleinschreibung exakt wie Dateiname (Linux/WSL!)
import {
  exportExposeWithImages as exportExposeAsPDF,
} from '../utils/pdfExportExpose';

export default function ExportButtons({ formData, output, selectedStyle }) {
  // 📁 JSON-Export: speichert das komplette Exposé als .json-Datei
  const handleExportJSON = () => {
    const fullData = {
      ...formData,        // alle Formulardaten
      output,             // GPT-Text
      selectedStyle,      // Stilwahl (emotional, sachlich etc.)
    };

    const blob = new Blob([JSON.stringify(fullData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'expose-export.json';
    a.click();

    URL.revokeObjectURL(url); // Speicher aufräumen
  };

  // 📋 Copy-Button: kopiert den generierten Text (GPT-Output) in die Zwischenablage
  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    alert('📋 Text kopiert!');
  };

  // 📄 PDF-Export: ruft die zentrale PDF-Logik auf (Bilder, Text, Captions etc.)
  const handleExportPDF = async () => {
    try {
      await exportExposeAsPDF(formData, output);
    } catch (error) {
      console.error('❌ Fehler beim PDF-Export:', error);
    }
  };

  // 🧱 UI mit drei Buttons: JSON, Text kopieren, PDF exportieren
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
