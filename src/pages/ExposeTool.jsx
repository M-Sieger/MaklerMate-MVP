/**
 * @fileoverview ExposeTool - Hauptseite für Exposé-Generierung
 *
 * ZWECK:
 * - Formular für Immobilien-Details (Adresse, Größe, Preis, etc.)
 * - KI-generierte Exposé-Texte (via OpenAI GPT-4o-mini)
 * - Bild-Upload mit Captions
 * - Export als PDF, JSON, Text
 * - Speichern/Laden von Exposés (Browser localStorage)
 *
 * ARCHITEKTUR:
 * - Container Component (orchestriert Child-Components)
 * - State via useExposeStore (Zustand store)
 * - API-Calls via useExpose hook (wraps exposeService)
 * - Presentational Components: ExposeForm, ImageUpload, ExportButtons, etc.
 *
 * USER-FLOW:
 * 1. User füllt Formular aus (Adresse, Zimmer, Preis, etc.)
 * 2. User lädt Bilder hoch (optional)
 * 3. User wählt Stil (emotional, sachlich, luxus)
 * 4. User klickt "Generieren"
 * 5. API-Call → OpenAI GPT-4o-mini
 * 6. Exposé-Text wird angezeigt
 * 7. User exportiert als PDF/JSON oder speichert lokal
 *
 * ABHÄNGIGKEITEN:
 * - stores/exposeStore.js (formData, output, images, savedExposes)
 * - hooks/useExpose.js (generateExpose API-wrapper)
 * - components/ExposeForm.jsx, ImageUpload.jsx, ExportButtons.jsx, etc.
 *
 * MIGRATION-NOTES:
 * - VORHER: useState für formData, output, selectedStyle
 * - NACHHER: useExposeStore (eliminiert Prop-Drilling)
 * - VORHER: Direkter fetchWithAuth-Call
 * - NACHHER: useExpose hook (Service-Layer Pattern)
 * - VORHER: useSavedExposes custom hook
 * - NACHHER: Store-Actions (addExpose, deleteExpose, loadExpose)
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-15
 * STATUS: 🟢 Production-Ready (refactored in Phase 3)
 */

import '../styles/ExposeTool.css';

import React, { useEffect } from 'react';

// COMPONENTS
import ExportButtons from '../components/ExportButtons';
import ExposeForm from '../components/ExposeForm';
import GPTOutputBox from '../components/GPTOutputBox';
import ImageUpload from '../components/ImageUpload';
import SavedExposes from '../components/SavedExposes';

// STORE (nach DEVELOPMENT-INSTRUCTION.md: Service-Layer Pattern)
import useExposeStore from '../stores/exposeStore';

// HOOK (wraps exposeService for API calls)
import { useExpose } from '../hooks/useExpose';

export default function ExposeTool() {
  // ==================== STATE (via Zustand Store) ====================
  // WARUM: Eliminiert Prop-Drilling, Auto-Persistierung via Zustand persist
  // VORHER: useState für formData, output, selectedStyle
  // NACHHER: Direkt aus Store

  const formData = useExposeStore((state) => state.formData);
  const output = useExposeStore((state) => state.output);
  const selectedStyle = useExposeStore((state) => state.selectedStyle);
  const images = useExposeStore((state) => state.images);
  const captions = useExposeStore((state) => state.captions);
  const savedExposes = useExposeStore((state) => state.savedExposes);

  const {
    setFormData,
    updateFormData,
    setOutput,
    saveExpose,
    deleteExpose,
    loadExpose,
  } = useExposeStore();

  // ==================== API HOOK ====================
  // WARUM: Service-Layer Pattern - API-Logic in Hook/Service
  // VORHER: Direkter fetchWithAuth-Call in handleGenerate
  // NACHHER: Hook wraps exposeService (testbar, wiederverwendbar)

  const { generateExpose, isGenerating } = useExpose();

  // ==================== SIDE EFFECTS ====================

  /**
   * Sync images array into formData for backward compatibility
   * HINWEIS: Bilder sind im Store, aber formData.images wird für alte Utils benötigt
   * TODO: Nach vollständiger Migration kann dies entfernt werden
   */
  useEffect(() => {
    updateFormData({ images });
  }, [images, updateFormData]);

  // ==================== EVENT HANDLERS ====================

  /**
   * Formular-Input ändern
   *
   * FLOW:
   * 1. User tippt in Input-Feld
   * 2. onChange-Event wird gefeuert
   * 3. Store-Action updateFormData wird aufgerufen
   * 4. Store updated formData (auto-persist)
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - Input-Event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
  };

  /**
   * Exposé-Text generieren via OpenAI API
   *
   * FLOW:
   * 1. Validation: Formular muss ausgefüllt sein
   * 2. API-Call via useExpose hook
   * 3. Hook ruft exposeService.generateExpose auf
   * 4. Service macht HTTP-Request via apiClient
   * 5. Response-Text wird in Store gespeichert
   * 6. Error-Handling via hook (toast notifications)
   *
   * SERVICE-DELEGATION:
   * - useExpose hook wraps exposeService
   * - exposeService wraps apiClient
   * - apiClient wraps axios mit Retry-Logic
   * - Component nur Event-Handler + Validation
   *
   * SECURITY:
   * - API-Key ist serverseitig (Vercel Function /api/generate-expose)
   * - Supabase Auth-Token wird via apiClient mitgeschickt
   * - Input-Validation im Service (validateExposeData)
   */
  const handleGenerate = async () => {
    // VALIDATION: Mindestens ein Feld muss ausgefüllt sein
    // WARUM: Leeres Formular würde sinnlosen API-Call verursachen
    const hasData = Object.entries(formData)
      .filter(([key]) => key !== 'images') // Bilder sind optional
      .some(([_, value]) => value && value !== '');

    if (!hasData) {
      alert('Bitte zuerst das Formular ausfüllen.');
      return;
    }

    // LOCAL DEV GUARD: Vercel Function nur im Deploy verfügbar
    // WARUM: CRA Dev-Server kennt /api/generate-expose nicht
    const isLocalCra =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1';

    if (isLocalCra) {
      setOutput(
        'ℹ️ Die Exposé-Generierung läuft über die Vercel-Function und ist lokal (CRA) nicht aktiv. Bitte nach dem Deploy testen.'
      );
      return;
    }

    // SERVICE-CALL: Delegiert an useExpose hook
    // WARUM: Alle API-Details (retry, error-handling) sind gekapselt
    const result = await generateExpose(formData, selectedStyle);

    // SUCCESS: Store-Update
    if (result) {
      setOutput(result);
    }
    // ERROR: Hook zeigt bereits Toast-Notification (via error state)
  };

  /**
   * Exposé lokal speichern
   *
   * FLOW:
   * 1. User klickt "Speichern"
   * 2. Store-Action saveExpose wird aufgerufen
   * 3. Store erstellt Expose-Object { formData, output, selectedStyle, images, captions }
   * 4. Expose wird zu savedExposes-Array hinzugefügt
   * 5. Auto-Persistierung via Zustand middleware
   *
   * STORAGE:
   * - localStorage Key: "maklermate-expose-storage"
   * - Auto-Sync über Tabs via Zustand persist
   */
  const handleSaveExpose = () => {
    saveExpose();
    // Note: Toast-Notification wird im Store angezeigt
  };

  /**
   * Gespeichertes Exposé laden
   *
   * @param {Object} expose - Gespeichertes Expose-Object
   */
  const handleLoadExpose = (expose) => {
    loadExpose(expose);
    // Note: Toast-Notification wird im Store angezeigt
  };

  /**
   * Gespeichertes Exposé löschen
   *
   * @param {number} index - Index im savedExposes-Array
   */
  const handleDeleteExpose = (index) => {
    deleteExpose(index);
    // Note: Toast-Notification wird im Store angezeigt
  };

  // ==================== RENDER ====================

  return (
    <div className="expose-tool-container">
      {/* 📋 FORMULAR: Immobilien-Details */}
      {/* HINWEIS: ExposeForm nutzt Props für Presentational Component Pattern */}
      <ExposeForm
        formData={formData}
        setFormData={setFormData}
        onChange={handleChange}
      />

      {/* 🖼️ BILDER: Upload mit Drag & Drop */}
      {/* HINWEIS: ImageUpload nutzt Store direkt (keine Props) */}
      <ImageUpload />

      {/* ⚡ GENERATE-BUTTON */}
      <div className="button-group center-buttons">
        <button
          onClick={handleGenerate}
          className={`btn btn-primary ${isGenerating ? 'loading' : ''}`}
          disabled={isGenerating}
          title="Exposé wird serverseitig (Vercel) generiert"
        >
          {isGenerating && <span className="spinner"></span>}
          {isGenerating ? 'Generiere…' : '🔮 Exposé generieren'}
        </button>
      </div>

      {/* 📄 VORSCHAU: Generierter Text + Bilder */}
      <div id="pdf-export-section">
        <GPTOutputBox output={output} images={images} captions={captions} />
      </div>

      {/* 📤 EXPORT-BUTTONS: PDF, JSON, Text, Speichern */}
      {/* HINWEIS: ExportButtons nutzt Store direkt (nur onSaveExpose callback) */}
      <ExportButtons onSaveExpose={handleSaveExpose} />

      {/* 💾 GESPEICHERTE EXPOSÉS: Liste mit Laden/Löschen */}
      <SavedExposes
        exposes={savedExposes}
        onLoad={handleLoadExpose}
        onDelete={handleDeleteExpose}
      />
    </div>
  );
}
