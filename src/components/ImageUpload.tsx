/**
 * @fileoverview ImageUpload Component - Bild-Upload und Verwaltung
 *
 * ZWECK:
 * - Multi-Upload für Exposé-Fotos (max. 5 Bilder)
 * - Drag & Drop Support via HTML5 File Input
 * - Bildunterschriften (Captions) pro Bild
 * - Reorder-Funktionalität (Bilder verschieben ↑ ↓)
 * - Optional: KI-basierte Bildoptimierung via GPT-Enhancer
 * - Löschen einzelner Bilder
 *
 * ARCHITEKTUR:
 * - Self-contained Component (kein Prop-Drilling!)
 * - State via useExposeStore (images, captions)
 * - Auto-Persistierung via Zustand persist middleware
 * - Error-Handling für File-Size (implizit via Base64)
 *
 * TECHNISCHE DETAILS:
 * - Base64-Encoding für Browser-Storage (keine Backend-Upload)
 * - File-Input mit multiple-Attribut
 * - Optional: enhanceImage() via GPT-Vision API
 * - Max. 5 Bilder (UX-optimiert für Exposés)
 *
 * USER-FLOW:
 * 1. User klickt auf File-Input
 * 2. User wählt Bilder (max. 5 minus bereits hochgeladene)
 * 3. Optional: Auto-Enhance via GPT (wenn aktiviert)
 * 4. Bilder werden als Base64 im Store gespeichert
 * 5. User kann Captions hinzufügen
 * 6. User kann Bilder reordern (↑ ↓) oder löschen (❌)
 *
 * ABHÄNGIGKEITEN:
 * - stores/exposeStore.js (images, captions, addImage, removeImage, updateCaption, moveImage)
 * - utils/imageEnhancer.js (enhanceImage - optional GPT-Enhancement)
 *
 * VERWENDUNG:
 * - Von ExposeTool.tsx importiert
 * - Keine Props erforderlich (nutzt Store direkt)
 *
 * MIGRATION-NOTES:
 * - VORHER: usePersistentImages hook für localStorage
 * - NACHHER: useExposeStore (auto-persist)
 * - VORHER: Lokales State für captions
 * - NACHHER: Store-basiert (images + captions zusammen)
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-15
 * STATUS: 🟢 Production-Ready (TypeScript Migration)
 */

import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';

// STORE (nach DEVELOPMENT-INSTRUCTION.md: Service-Layer Pattern)
import useExposeStore from '../stores/exposeStore';

// UTILS
import { enhanceImage } from '../utils/imageEnhancer'; // 🧽 GPT-Bildoptimierung (optional)

// STYLES
import styles from './ImageUpload.module.css';

// CONSTANTS
const MAX_IMAGES = 5; // UX-optimiert für Exposés

// ==================== COMPONENT ====================

export default function ImageUpload() {
  // ==================== STATE (via Zustand Store) ====================
  // WARUM: Eliminiert Prop-Drilling, Auto-Persistierung
  // VORHER: usePersistentImages('maklermate_images') + usePersistentImages('maklermate_captions')
  // NACHHER: useExposeStore (beide im Store)

  const images = useExposeStore((state) => state.images);
  const captions = useExposeStore((state) => state.captions);

  const { addImage, removeImage, updateCaption, moveImage } = useExposeStore();

  // ==================== LOCAL UI STATE ====================
  // HINWEIS: Nur UI-State, kein Business-State!

  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Auto-Enhance Toggle (optional GPT-Bildoptimierung)
   * WARUM: Erlaubt User, Bilder vor Upload zu optimieren (Kontrast, Helligkeit, etc.)
   * TRADE-OFF: Langsamer Upload (GPT-API-Call), bessere Bildqualität
   */
  const [autoEnhance, setAutoEnhance] = useState<boolean>(false);

  // ==================== EVENT HANDLERS ====================

  /**
   * Verarbeitet hochgeladene Bilder
   *
   * FLOW:
   * 1. Max. (5 - bereits hochgeladene) Bilder akzeptieren
   * 2. Für jedes Bild: Base64-Encoding via FileReader
   * 3. Optional: GPT-Enhancement (wenn autoEnhance aktiv)
   * 4. Store-Update (addImage)
   *
   * ENCODING:
   * - Base64 für localStorage (keine Backend-Upload)
   * - FileReader.readAsDataURL() liefert data:image/jpeg;base64,...
   *
   * @param files - Hochgeladene Dateien
   */
  const handleFiles = async (files: FileList | null): Promise<void> => {
    // GUARD: Keine Dateien
    if (!files || files.length === 0) return;

    // GUARD: Max. Bilder erreicht
    if (images.length >= MAX_IMAGES) {
      toast.error(`⚠️ Maximal ${MAX_IMAGES} Bilder erlaubt`);
      return;
    }

    // LIMIT: Nur noch freie Plätze verwenden
    const remainingSlots = MAX_IMAGES - images.length;
    const fileArray = Array.from(files).slice(0, remainingSlots);

    // INFO: User-Feedback bei Upload
    if (fileArray.length > 0) {
      toast.loading(`📸 ${fileArray.length} Bild(er) werden hochgeladen...`);
    }

    // ENCODING: Base64 + optional GPT-Enhancement
    // WARUM: Promise.all für parallele Verarbeitung (schneller)
    const base64Array = await Promise.all(
      fileArray.map((file: File) => {
        return new Promise<string | null>((resolve) => {
          const reader = new FileReader();

          reader.onload = async (e: ProgressEvent<FileReader>) => {
            let base64 = e.target?.result as string;

            // OPTIONAL: GPT-Enhancement
            // WARUM: Verbessert Bildqualität (Kontrast, Helligkeit, Schärfe)
            // TRADE-OFF: Langsamer Upload (GPT-API-Call)
            if (autoEnhance) {
              try {
                const enhanced = await enhanceImage(base64);
                resolve(enhanced);
              } catch (error) {
                // FALLBACK: Original-Bild bei Enhancer-Fehler
                console.warn(
                  '[ImageUpload] Enhancement failed, using original:',
                  error
                );
                resolve(base64);
              }
            } else {
              resolve(base64);
            }
          };

          reader.onerror = () => {
            // ERROR-HANDLING: FileReader-Fehler
            console.error('[ImageUpload] FileReader error');
            toast.error('❌ Fehler beim Lesen der Datei');
            resolve(null); // null wird später gefiltert
          };

          reader.readAsDataURL(file);
        });
      })
    );

    // FILTER: Fehlgeschlagene Uploads entfernen
    const validImages = base64Array.filter(
      (img): img is string => img !== null
    );

    // STORE-UPDATE: Bilder hinzufügen (inkl. leere Captions)
    // WARUM: Captions werden initial leer erstellt, User kann später befüllen
    validImages.forEach((img) => {
      addImage(img);
    });

    // SUCCESS: User-Feedback
    toast.dismiss(); // Loading-Toast entfernen
    if (validImages.length > 0) {
      toast.success(`✅ ${validImages.length} Bild(er) hochgeladen!`);
    }
  };

  /**
   * Entfernt Bild an Index
   *
   * @param index - Index des zu löschenden Bildes
   */
  const handleRemove = (index: number): void => {
    removeImage(index);
    toast.success('🗑️ Bild entfernt');
  };

  /**
   * Verschiebt Bild von einem Index zum anderen
   *
   * USE-CASE:
   * - User möchte Reihenfolge der Bilder ändern (z.B. Hauptbild nach vorne)
   * - Wichtig für PDF-Export (Reihenfolge wird beibehalten)
   *
   * @param fromIndex - Quell-Index
   * @param toIndex - Ziel-Index
   */
  const handleMove = (fromIndex: number, toIndex: number): void => {
    // GUARD: Ungültige Indizes (Store macht auch Guard, aber hier für UX)
    if (toIndex < 0 || toIndex >= images.length) return;

    moveImage(fromIndex, toIndex);
  };

  /**
   * Updated Caption an Index
   *
   * @param index - Index des Bildes
   * @param caption - Neue Bildunterschrift
   */
  const handleCaptionChange = (index: number, caption: string): void => {
    updateCaption(index, caption);
  };

  // ==================== RENDER ====================

  return (
    <div className={styles.uploadWrapper}>
      {/* 🧭 LABEL */}
      <label className={styles.label}>
        📸 Objektfotos (max. {MAX_IMAGES}):
      </label>

      {/* ✅ AUTO-ENHANCE TOGGLE */}
      {/* HINWEIS: Optional, erhöht Upload-Zeit */}
      <div className={styles.checkboxRow}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={autoEnhance}
            onChange={() => setAutoEnhance(!autoEnhance)}
          />
          Bild automatisch optimieren (via GPT-Vision)
        </label>
      </div>

      {/* 📁 FILE-INPUT */}
      {/* HINWEIS: multiple-Attribut erlaubt Multi-Upload */}
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}
        disabled={images.length >= MAX_IMAGES}
      />

      {/* INFO: Max-Limit erreicht */}
      {images.length >= MAX_IMAGES && (
        <p className={styles.info}>
          ℹ️ Maximale Anzahl Bilder erreicht. Bitte löschen Sie zuerst ein
          Bild.
        </p>
      )}

      {/* 🖼️ BILD-GRID: Thumbnails mit Captions + Controls */}
      <div className={styles.gridContainer}>
        {images.map((img: string, index: number) => (
          <div key={index} className={styles.gridItem}>
            {/* THUMBNAIL */}
            <img
              src={img}
              alt={`Bild ${index + 1}`}
              className={styles.gridImage}
            />

            {/* CAPTION-INPUT */}
            <input
              type="text"
              value={captions[index] || ''}
              onChange={(e) => handleCaptionChange(index, e.target.value)}
              className={styles.captionInput}
              placeholder="Bildunterschrift (optional)"
            />

            {/* CONTROLS: ↑ ↓ ❌ */}
            <div className={styles.buttonRow}>
              {/* MOVE-UP */}
              <button
                onClick={() => handleMove(index, index - 1)}
                disabled={index === 0}
                className={styles.btnIcon}
                title="Bild nach oben verschieben"
              >
                ▲
              </button>

              {/* MOVE-DOWN */}
              <button
                onClick={() => handleMove(index, index + 1)}
                disabled={index === images.length - 1}
                className={styles.btnIcon}
                title="Bild nach unten verschieben"
              >
                ▼
              </button>

              {/* DELETE */}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className={styles.btnIcon}
                title="Bild löschen"
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
