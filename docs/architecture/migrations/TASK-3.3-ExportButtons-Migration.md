# 📘 Task 3.3: ExportButtons.jsx Migration Guide

**Referenz:** `/DEVELOPMENT-INSTRUCTION.md` - Study-Guide Approach
**Status:** 🔴 Pending
**Estimated:** 3h
**Complexity:** Medium (Service-Integration)

---

## 🎯 MIGRATION GOALS (nach DEVELOPMENT-INSTRUCTION.md)

### Service-Layer Pattern
- ✅ Export-Logic in Services (pdf Service, exportService)
- ✅ State via Store (useExposeStore)
- ✅ Component nur UI-Logic (Button-Clicks, Toast-Notifications)

### Study-Guide Comments
- ✅ File-Header mit ZWECK, ARCHITEKTUR, ABHÄNGIGKEITEN
- ✅ JSDoc für alle Export-Functions
- ✅ Inline-Comments bei Service-Calls (WARUM Service, nicht inline)

### Code Quality
- ✅ Component <200 Zeilen
- ✅ Keine direkte jsPDF-Logik (delegiert an pdfService)
- ✅ Error-Handling (try/catch + toast)

---

## 📋 CURRENT STATE ANALYSIS

**Current Code:**
```javascript
// ❌ PROBLEM: Alte Utils importiert
import { exportExposeWithImages } from '../utils/pdfExportExpose';

// ❌ PROBLEM: Props statt Store
export default function ExportButtons({ formData, output, selectedStyle, onSaveExpose }) {

  // ❌ PROBLEM: Inline PDF-Logic
  const handleExportPDF = async () => {
    try {
      const gptText = typeof output === 'string' ? output : /* ... */;
      const images = (formData?.images || []).filter(/* ... */);
      const captions = /* ... */;

      await exportExposeWithImages(gptText, images, captions);
    } catch (error) {
      console.error('❌ Fehler beim PDF-Export:', error);
    }
  };
}
```

**Identified Issues:**
1. **Old Utils**: pdfExportExpose → sollte pdfService sein
2. **Props**: formData, output, selectedStyle → sollte Store nutzen
3. **Inline Logic**: PDF-Aufbereitung im Component → sollte in Service
4. **No Error-Handling**: console.error → sollte Toast + safeApiCall
5. **No Comments**: Keine Study-Guide Comments

---

## 🔄 TARGET STATE

```javascript
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
 * - stores/exposeStore.js (formData, output, images, captions, saveExpose)
 *
 * VERWENDUNG:
 * - Von ExposeTool.jsx importiert
 * - Props: onSaveExpose (callback für "Speichern"-Button)
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-15
 * STATUS: 🟢 Production-Ready (refactored in Phase 3)
 */

import React from 'react';
import toast from 'react-hot-toast';

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
  // VORHER: formData, output, selectedStyle als Props
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
   * 1. Service-Call: pdfService.exportExposeAsPDF()
   * 2. Service erstellt PDF mit jsPDF
   * 3. Browser-Download wird getriggert
   * 4. Toast-Notification
   *
   * SERVICE-DELEGATION:
   * - PDF-Erstellung in pdfService (testbar, wiederverwendbar)
   * - Component nur Event-Handler + Error-Handling
   */
  const handleExportPDF = () => {
    try {
      // VALIDATION: Kein Text → keine PDF
      if (!hasText) {
        toast.error('⚠️ Bitte erst ein Exposé generieren');
        return;
      }

      // SERVICE-CALL: Delegiert an pdfService
      // WARUM: Alle jsPDF-Details sind gekapselt, testbar
      pdfService.exportExposeAsPDF(formData, output, images, captions);

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
   */
  const handleExportJSON = () => {
    try {
      // VALIDATION: Mindestens formData sollte vorhanden sein
      if (!formData || !formData.strasse) {
        toast.error('⚠️ Bitte Formular ausfüllen');
        return;
      }

      // DATA-AGGREGATION: Vollständiges Exposé-Object
      const fullData = {
        formData,
        output,
        selectedStyle,
        images,
        captions,
        exportedAt: new Date().toISOString(),
      };

      // SERVICE-CALL: Delegiert an exportService
      exportService.exportExposeAsJSON(fullData);

      // SUCCESS
      toast.success('📁 JSON erfolgreich exportiert!');
    } catch (error) {
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
   * - Schneller Text-Zugriff
   */
  const handleCopy = async () => {
    try {
      // VALIDATION
      if (!hasText) {
        toast.error('⚠️ Kein Text zum Kopieren vorhanden');
        return;
      }

      // TEXT-EXTRACTION: Unterstützt verschiedene Output-Formate
      const safeText =
        typeof output === 'string'
          ? output
          : output?.text || output?.content || JSON.stringify(output, null, 2);

      // CLIPBOARD-API: Modern Browser API
      await navigator.clipboard.writeText(safeText);

      // SUCCESS
      toast.success('📋 Text kopiert!');
    } catch (error) {
      // FALLBACK: Browser hat keinen Clipboard-Zugriff
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
```

**Key Changes:**
1. **pdfExportExpose → pdfService**: Moderne Service-Architektur
2. **Props → Store**: Direkter Zugriff auf formData, output, images
3. **Inline Logic → Service**: PDF/JSON-Erstellung in Services
4. **Error-Handling**: try/catch + toast statt console.error
5. **Study-Guide Comments**: File-Header, JSDoc, Inline

---

## 🔄 MIGRATION STEPS

### Step 1: Update Imports (10min)
```javascript
// ✅ NEU: Services + Store
import pdfService from '../services/pdfService';
import exportService from '../services/exportService';
import useExposeStore from '../stores/exposeStore';

// 🗑️ ALT: Entfernen
// import { exportExposeWithImages } from '../utils/pdfExportExpose';
```

### Step 2: Remove Props, Add Store Selectors (15min)
```javascript
// ❌ ALT: Props
export default function ExportButtons({ formData, output, selectedStyle, onSaveExpose }) {
  // ...
}

// ✅ NEU: Store + minimal Props
export default function ExportButtons({ onSaveExpose }) {
  const formData = useExposeStore((state) => state.formData);
  const output = useExposeStore((state) => state.output);
  const images = useExposeStore((state) => state.images);
  const captions = useExposeStore((state) => state.captions);
}
```

### Step 3: Replace handleExportPDF Logic (30min)
```javascript
// ❌ ALT: Inline PDF-Logic
const handleExportPDF = async () => {
  try {
    const gptText = typeof output === 'string' ? output : output?.text || /* ... */;
    const images = (formData?.images || []).filter(img => /* ... */);
    const captions = Array.isArray(formData?.captions) ? formData.captions : /* ... */;

    await exportExposeWithImages(gptText, images, captions);
  } catch (error) {
    console.error('❌ Fehler beim PDF-Export:', error);
  }
};

// ✅ NEU: Service-Delegation
const handleExportPDF = () => {
  try {
    if (!hasText) {
      toast.error('⚠️ Bitte erst ein Exposé generieren');
      return;
    }

    // SERVICE-CALL: Alle Details in pdfService gekapselt
    pdfService.exportExposeAsPDF(formData, output, images, captions);

    toast.success('📄 PDF erfolgreich exportiert!');
  } catch (error) {
    console.error('[ExportButtons] PDF export failed:', error);
    toast.error('❌ PDF-Export fehlgeschlagen');
  }
};
```

### Step 4: Add handleExportJSON (15min)
```javascript
// ✅ NEU: JSON-Export via exportService
const handleExportJSON = () => {
  try {
    const fullData = {
      formData,
      output,
      selectedStyle,
      images,
      captions,
      exportedAt: new Date().toISOString(),
    };

    exportService.exportExposeAsJSON(fullData);
    toast.success('📁 JSON erfolgreich exportiert!');
  } catch (error) {
    console.error('[ExportButtons] JSON export failed:', error);
    toast.error('❌ JSON-Export fehlgeschlagen');
  }
};
```

### Step 5: Add Study-Guide Comments (45min)
- File-Header (ZWECK, ARCHITEKTUR, USER-FLOW, ABHÄNGIGKEITEN)
- JSDoc für handleExportPDF, handleExportJSON, handleCopy
- Inline-Comments (SERVICE-DELEGATION, VALIDATION)

### Step 6: Update Parent Component (5min)
```javascript
// src/pages/ExposeTool.jsx

// ❌ ALT: Viele Props
<ExportButtons
  formData={formData}
  output={output}
  selectedStyle={selectedStyle}
  onSaveExpose={handleSaveExpose}
/>

// ✅ NEU: Nur callback
<ExportButtons onSaveExpose={handleSaveExpose} />
```

---

## 📊 TESTING (45min)

### Manual Testing Checklist:

1. **PDF-Export**
   - [ ] PDF wird heruntergeladen
   - [ ] Text ist korrekt formatiert
   - [ ] Bilder sind enthalten
   - [ ] Captions werden angezeigt
   - [ ] Dateiname ist sinnvoll (z.B. "Expose_Musterstrasse_123.pdf")

2. **JSON-Export**
   - [ ] JSON wird heruntergeladen
   - [ ] Alle Daten sind enthalten (formData, output, images, captions)
   - [ ] JSON ist valid (kann geparst werden)
   - [ ] Timestamp ist vorhanden

3. **Text-Kopieren**
   - [ ] Text wird in Clipboard kopiert
   - [ ] Einfügen funktioniert (z.B. in Notepad)
   - [ ] Toast-Notification bei Success

4. **Validierung**
   - [ ] Buttons disabled wenn kein Text
   - [ ] Error-Toast bei fehlendem Text
   - [ ] Tooltip zeigt Info bei disabled

5. **Error-Handling**
   - [ ] Clipboard-Fehler wird abgefangen (z.B. HTTPS required)
   - [ ] PDF-Fehler wird abgefangen (z.B. große Bilder)
   - [ ] Toast-Notification bei Errors

---

## 📝 COMMIT

```bash
git add src/components/ExportButtons.jsx src/pages/ExposeTool.jsx
git commit -m "feat(ExportButtons): migrate to pdfService + exportService

Refactored according to /DEVELOPMENT-INSTRUCTION.md (Study-Guide Approach):

CHANGES:
- Replaced pdfExportExpose util with pdfService
- Removed props (formData, output, selectedStyle) → use exposeStore
- Added JSON-Export via exportService
- Improved error-handling (try/catch + toast)
- Added Study-Guide comments (File-header, JSDoc, Inline)

ARCHITECTURE:
- Service-Layer Pattern: Export-logic in services
- Store-based: formData, output, images, captions from exposeStore
- Error-handling: User-friendly toast notifications
- Component only UI: Event-handlers + validation

SERVICE-INTEGRATION:
- pdfService.exportExposeAsPDF(formData, output, images, captions)
- exportService.exportExposeAsJSON(fullData)
- Clipboard API for text copy

TESTING:
- Manual: PDF, JSON, Clipboard
- Validation: Disabled states, error messages
- Edge cases: No text, large images, clipboard errors

WHY:
- Eliminates inline PDF-logic (testable services)
- Reduces prop-drilling (store-based)
- Adds JSON-export (CRM-integration)
- Improves UX (toast notifications)

PARENT CHANGES:
- ExposeTool.jsx: Removed formData/output/selectedStyle props
                  Now: <ExportButtons onSaveExpose={...} />

Refs: /DEVELOPMENT-INSTRUCTION.md, docs/architecture/migrations/TASK-3.3"
```

---

## ✅ SUCCESS CRITERIA

- ✅ pdfService integration funktioniert
- ✅ exportService integration funktioniert
- ✅ Prop-Drilling eliminiert (nur onSaveExpose callback)
- ✅ Study-Guide Comments vorhanden
- ✅ Error-Handling verbessert
- ✅ Keine Regressions

**Estimated Time:** 3h
**Complexity:** Medium
**Dependencies:** pdfService, exportService, useExposeStore (all ✅)

---

**NEXT:** `TASK-3.4-CRMTool-Migration.md` (4h)
