// src/components/ExportButtons.jsx

import React from 'react';

import styles
  from '../styles/ExportBox.module.css'; // 🎨 Für Styling des Buttons
import {
  exportExposeAsPDF,
} from '../utils/pdfExportExpose'; // 🧠 PDF-Export-Logik importieren

export default function ExportButtons({ formData, output, selectedStyle }) {
  const handleExportJSON = () => {
    const fullData = {
      ...formData,
      output,
      selectedStyle,
    };

    const blob = new Blob([JSON.stringify(fullData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'expose-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    alert('📋 Text kopiert!');
  };

  const handleExportPDF = async () => {
    try {
      await exportExposeAsPDF(formData, output); // 📤 GPT-Output + Formulardaten an PDF-Funktion übergeben
    } catch (error) {
      console.error('❌ Fehler beim PDF-Export:', error);
    }
  };

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
