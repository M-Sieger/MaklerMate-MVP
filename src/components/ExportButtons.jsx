/**
 * @fileoverview ExportButtons Component - Export-Aktionen für Exposé
 *
 * ZWECK:
 * - PDF-Export (Exposé-Text + Bilder + Captions)
 * - JSON-Export (Vollständige Daten für Backup/Import)
 * - Text-Kopieren (Zwischenablage für ImmoScout, E-Mail)
 * - Exposé Speichern (localStorage via Store)
 *
 * ARCHITEKTUR:
 * - Presentational Component (nur UI + Event-Handler)
 * - Export-Logic in Services (pdfService, exportService)
 * - State via useExposeStore (formData, output, images, captions)
 * - Error-Handling via toast notifications
 *
 * USER-FLOW:
 * 1. User klickt Export-Button
 * 2. Component ruft entsprechenden Service auf
 * 3. Service generiert File (PDF/JSON)
 * 4. Browser-Download wird getriggert
 * 5. Toast-Notification bei Success/Error
 *
 * ABHÄNGIGKEITEN:
 * - services/pdfService.js (exportExposeAsPDF)
 * - services/exportService.js (exportExposeAsJSON)
 * - stores/exposeStore.js (formData, output, images, captions)
 *
 * VERWENDUNG:
 * - Von ExposeTool.jsx importiert
 * - Props: onSaveExpose (callback für "Speichern"-Button)
 *
 * MIGRATION-NOTES:
 * - VORHER: pdfExportExpose util + inline JSON-Export
 * - NACHHER: pdfService + exportService (Service-Layer Pattern)
 * - VORHER: Props (formData, output, selectedStyle)
 * - NACHHER: Store-based (nur onSaveExpose callback als Prop)
 * - VORHER: alert() für User-Feedback
 * - NACHHER: toast notifications
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-15
 * STATUS: 🟢 Production-Ready (refactored in Phase 3)
 */

import React from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

// SERVICES (nach DEVELOPMENT-INSTRUCTION.md: Service-Layer Pattern)
import pdfService from '../services/pdfService';
import exportService from '../services/exportService';

// STORE
import useExposeStore from '../stores/exposeStore';

// STYLES
import styles from '../styles/ExportActions.module.css';

export default function ExportButtons({ onSaveExpose }) {
  // ==================== STATE (via Zustand Store) ====================
  // WARUM: Eliminiert Prop-Drilling, Zugriff auf alle Export-relevanten Daten
  // VORHER: formData, output, selectedStyle, images als Props
  // NACHHER: Direkt aus Store

  const formData = useExposeStore((state) => state.formData);
  const output = useExposeStore((state) => state.output);
  const selectedStyle = useExposeStore((state) => state.selectedStyle);
  const images = useExposeStore((state) => state.images);
  const captions = useExposeStore((state) => state.captions);

  // ==================== COMPUTED ====================

  /**
   * Prüft ob Exposé-Text vorhanden ist
   * WARUM: Disable "Speichern"-Button wenn kein Text generiert
   */
  const hasText =
    output &&
    ((typeof output === 'string' && output.trim() !== '') ||
      output?.text?.trim() ||
      output?.content?.trim());

  // ==================== EVENT HANDLERS ====================

  /**
   * Exportiert Exposé als PDF (Text + Bilder)
   *
   * FLOW:
   * 1. Validation: Kein Text → Error-Toast
   * 2. Service-Call: pdfService.exportExposeAsPDF()
   * 3. Service erstellt PDF mit jsPDF
   * 4. Browser-Download wird getriggert
   * 5. Toast-Notification bei Success/Error
   *
   * SERVICE-DELEGATION:
   * - PDF-Erstellung in pdfService (testbar, wiederverwendbar)
   * - Component nur Event-Handler + Error-Handling
   * - Service enthält alle jsPDF-Details (Fonts, Layout, Images)
   */
  const handleExportPDF = async () => {
    try {
      // VALIDATION: Kein Text → keine PDF
      if (!hasText) {
        toast.error('⚠️ Bitte erst ein Exposé generieren');
        return;
      }

      // SERVICE-CALL: Delegiert an pdfService
      // WARUM: Alle jsPDF-Details sind gekapselt, testbar
      await pdfService.exportExposeAsPDF(formData, output, images, captions);

      // SUCCESS: User-Feedback
      toast.success('📄 PDF erfolgreich exportiert!');
    } catch (error) {
      // ERROR-HANDLING: User-freundliche Nachricht
      console.error('[ExportButtons] PDF export failed:', error);
      toast.error('❌ PDF-Export fehlgeschlagen. Bitte erneut versuchen.');
    }
  };

  /**
   * Exportiert Exposé als JSON (vollständige Daten)
   *
   * USE-CASE:
   * - Backup des Exposés
   * - Import in CRM-System
   * - Weiterverarbeitung in anderen Tools
   * - Debugging (alle Daten einsehbar)
   *
   * SERVICE-DELEGATION:
   * - JSON-Erstellung in exportService (standardisiert)
   * - Enthält: formData, output, selectedStyle, images, captions, timestamp
   */
  const handleExportJSON = () => {
    try {
      // VALIDATION: Mindestens formData sollte vorhanden sein
      if (!formData || Object.keys(formData).length === 0) {
        toast.error('⚠️ Bitte Formular ausfüllen');
        return;
      }

      // DATA-AGGREGATION: Vollständiges Exposé-Object
      // WARUM: Alle relevanten Daten für vollständigen Export
      const fullData = {
        formData,
        output,
        selectedStyle,
        images,
        captions,
        exportedAt: new Date().toISOString(),
      };

      // SERVICE-CALL: Delegiert an exportService
      // WARUM: Standardisiertes JSON-Format, wiederverwendbar
      exportService.exportExposeAsJSON(fullData);

      // SUCCESS: User-Feedback
      toast.success('📁 JSON erfolgreich exportiert!');
    } catch (error) {
      // ERROR-HANDLING: User-freundliche Nachricht
      console.error('[ExportButtons] JSON export failed:', error);
      toast.error('❌ JSON-Export fehlgeschlagen');
    }
  };

  /**
   * Kopiert Exposé-Text in Zwischenablage
   *
   * USE-CASE:
   * - Einfügen in ImmoScout-Formular
   * - Kopieren für E-Mail
   * - Schneller Text-Zugriff ohne PDF
   * - Weiterverarbeitung in Word/Docs
   *
   * CLIPBOARD-API:
   * - Modern Browser API (navigator.clipboard.writeText)
   * - Benötigt HTTPS oder localhost
   * - Async-Operation (await)
   */
  const handleCopy = async () => {
    try {
      // VALIDATION: Kein Text → Error
      if (!hasText) {
        toast.error('⚠️ Kein Text zum Kopieren vorhanden');
        return;
      }

      // TEXT-EXTRACTION: Unterstützt verschiedene Output-Formate
      // WARUM: Output kann string oder object sein (je nach API-Response)
      const safeText =
        typeof output === 'string'
          ? output
          : output?.text || output?.content || JSON.stringify(output, null, 2);

      // CLIPBOARD-API: Modern Browser API
      // WARUM: Sicher, async, standardisiert (keine document.execCommand mehr)
      await navigator.clipboard.writeText(safeText);

      // SUCCESS: User-Feedback
      toast.success('📋 Text kopiert!');
    } catch (error) {
      // FALLBACK: Browser hat keinen Clipboard-Zugriff
      // URSACHEN: HTTP (nicht HTTPS), Browser-Permissions, alte Browser
      console.error('[ExportButtons] Clipboard failed:', error);
      toast.error('❌ Kopieren fehlgeschlagen (Browser-Einstellungen?)');
    }
  };

  // ==================== RENDER ====================

  return (
    <div className={styles.exportGrid}>
      {/* PDF-EXPORT */}
      <button
        className={styles.exportCard}
        onClick={handleExportPDF}
        disabled={!hasText}
        title={!hasText ? 'Bitte erst Exposé generieren' : 'Als PDF exportieren'}
      >
        📄 PDF exportieren
        <span className={styles.sub}>Ideal zum Teilen oder Ausdrucken</span>
      </button>

      {/* TEXT-KOPIEREN */}
      <button
        className={styles.exportCard}
        onClick={handleCopy}
        disabled={!hasText}
        title={!hasText ? 'Kein Text vorhanden' : 'In Zwischenablage kopieren'}
      >
        📋 Text kopieren
        <span className={styles.sub}>Z. B. für ImmoScout oder E‑Mail</span>
      </button>

      {/* JSON-EXPORT */}
      <button
        className={styles.exportCard}
        onClick={handleExportJSON}
        title="Als JSON für CRM-Import exportieren"
      >
        📁 Für CRM exportieren
        <span className={styles.sub}>Zur Weiterverarbeitung in Software</span>
      </button>

      {/* SPEICHERN (callback zu Parent) */}
      {/* WARUM: Parent (ExposeTool) managed savedExposes via Store */}
      {hasText && (
        <button
          className={`${styles.exportCard} ${styles.primary}`}
          onClick={onSaveExpose}
          title="Exposé in Browser speichern"
        >
          💾 Exposé speichern
          <span className={styles.sub}>Lokale Sicherung im Browser</span>
        </button>
      )}
    </div>
  );
}

ExportButtons.propTypes = {
  onSaveExpose: PropTypes.func.isRequired,
};
