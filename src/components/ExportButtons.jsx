// 📁 src/components/ExportButtons.jsx

import PropTypes from 'prop-types';
import React from 'react';

import styles from '../styles/ExportActions.module.css'; // 🧊 Neues Ivy-Design
import {
  exportExposeWithImages as exportExposeAsPDF,
} from '../utils/pdfExportExpose';

function ExportButtons({ formData, output, selectedStyle, onSaveExpose }) {
  // 📁 JSON-Export (für Weiterverarbeitung oder CRM)
  const handleExportJSON = () => {
    const fullData = { ...formData, output, selectedStyle };
    const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expose-export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // 📋 GPT-Text in Zwischenablage kopieren
  const handleCopy = () => {
    const safeText = typeof output === 'string' ? output : JSON.stringify(output, null, 2);
    navigator.clipboard.writeText(safeText);
    alert('📋 Text kopiert!');
  };

  // 📄 PDF-Export mit GPT-Text + Bildern
  const handleExportPDF = async () => {
    try {
      const gptText =
        typeof output === 'string'
          ? output
          : output?.text || output?.content || '[Kein GPT-Text]';

      const images = (formData?.images || []).filter(img =>
        typeof img === 'string' && img.startsWith('data:image')
      );
      const captions = Array.isArray(formData?.captions)
        ? formData.captions
        : images.map(() => '');

      await exportExposeAsPDF(gptText, images, captions);
    } catch (error) {
      console.error('❌ Fehler beim PDF-Export:', error);
    }
  };

  const hasText = output && (
    (typeof output === 'string' && output.trim() !== '') ||
    output?.text?.trim() ||
    output?.content?.trim()
  );

  return (
    <div className={styles.exportGrid}>
      <button className={styles.exportCard} onClick={handleExportPDF}>
        📄 PDF exportieren
        <span className={styles.sub}>Ideal zum Teilen oder Ausdrucken</span>
      </button>

      <button className={styles.exportCard} onClick={handleCopy}>
        📋 Text kopieren
        <span className={styles.sub}>Z. B. für ImmoScout oder E‑Mail</span>
      </button>

      <button className={styles.exportCard} onClick={handleExportJSON}>
        📁 Für CRM exportieren
        <span className={styles.sub}>Zur Weiterverarbeitung in Software</span>
      </button>

      {hasText && (
        <button className={`${styles.exportCard} ${styles.primary}`} onClick={onSaveExpose}>
          💾 Exposé speichern
          <span className={styles.sub}>Lokale Sicherung im Browser</span>
        </button>
      )}
    </div>
  );
}

ExportButtons.propTypes = {
  formData: PropTypes.shape({
    images: PropTypes.arrayOf(PropTypes.string),
    captions: PropTypes.arrayOf(PropTypes.string),
  }),
  output: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      text: PropTypes.string,
      content: PropTypes.string,
    }),
  ]),
  selectedStyle: PropTypes.string,
  onSaveExpose: PropTypes.func.isRequired,
};

export default ExportButtons;
