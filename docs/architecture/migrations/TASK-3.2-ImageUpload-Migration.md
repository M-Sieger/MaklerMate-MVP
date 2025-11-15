# 📘 Task 3.2: ImageUpload.jsx Migration Guide

**Referenz:** `/DEVELOPMENT-INSTRUCTION.md` - Study-Guide Approach
**Status:** 🔴 Pending
**Estimated:** 2h
**Complexity:** Low (nur Prop-Drilling Elimination)

---

## 🎯 MIGRATION GOALS (nach DEVELOPMENT-INSTRUCTION.md)

### Service-Layer Pattern
- ✅ Self-contained Component (kein Prop-Drilling)
- ✅ State via Store (useExposeStore.images, useExposeStore.captions)
- ✅ Auto-Persistierung via Zustand (keine manuelle localStorage-Logik)

### Study-Guide Comments
- ✅ File-Header mit ZWECK, ARCHITEKTUR, STATUS
- ✅ JSDoc für Event-Handler (handleUpload, handleRemove, handleCaptionChange)
- ✅ Inline-Comments bei komplexer Logik (Base64-Encoding, Drag-Drop)

### Code Quality
- ✅ Component <150 Zeilen (aktuell ~120)
- ✅ Keine Props (self-contained)
- ✅ Error-Handling (File-Size, File-Type)

---

## 📋 CURRENT STATE ANALYSIS

**Current Props:**
```javascript
// ❌ PROBLEM: Prop-Drilling von ExposeTool
export default function ImageUpload({ images, setImages }) {
  const [captions, setCaptions] = useState([]);

  // ❌ PROBLEM: Manuelles localStorage
  useEffect(() => {
    const savedCaptions = localStorage.getItem('maklermate_captions');
    if (savedCaptions) setCaptions(JSON.parse(savedCaptions));
  }, []);

  useEffect(() => {
    localStorage.setItem('maklermate_captions', JSON.stringify(captions));
  }, [captions]);
}
```

**Identified Issues:**
1. **Prop-Drilling**: images + setImages von ExposeTool → sollte Store nutzen
2. **Split State**: images als Props, captions lokal → beide sollten im Store
3. **Manual Persistence**: localStorage in useEffect → sollte Store-Persist
4. **No Comments**: Keine Study-Guide Comments

---

## 🔄 TARGET STATE

```javascript
/**
 * @fileoverview ImageUpload Component - Bild-Upload und Verwaltung
 *
 * ZWECK:
 * - Drag & Drop Bild-Upload für Exposé-Fotos
 * - Bild-Preview mit Thumbnail-Ansicht
 * - Bildunterschriften (Captions) pro Bild
 * - Löschen einzelner Bilder
 *
 * ARCHITEKTUR:
 * - Self-contained Component (kein Prop-Drilling!)
 * - State via useExposeStore (images, captions)
 * - Auto-Persistierung via Zustand persist middleware
 * - Error-Handling für File-Size (max 5MB) und File-Type (nur images)
 *
 * TECHNISCHE DETAILS:
 * - Base64-Encoding für Browser-Storage (keine Backend-Upload)
 * - Drag-Drop via HTML5 Drag Events
 * - File-Input als Fallback
 *
 * ABHÄNGIGKEITEN:
 * - stores/exposeStore.js (images, captions, addImage, removeImage, updateCaption)
 *
 * VERWENDUNG:
 * - Von ExposeTool.jsx importiert
 * - Keine Props erforderlich (nutzt Store direkt)
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-15
 * STATUS: 🟢 Production-Ready (refactored in Phase 3)
 */

import React, { useState } from 'react';
import toast from 'react-hot-toast';

// STORE (nach DEVELOPMENT-INSTRUCTION.md: Service-Layer Pattern)
import useExposeStore from '../stores/exposeStore';

// STYLES
import styles from '../styles/ImageUpload.module.css';

// CONSTANTS
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function ImageUpload() {
  // ==================== STATE (via Zustand Store) ====================
  // WARUM: Eliminiert Prop-Drilling, Auto-Persistierung
  // VORHER: images via Props, captions lokal + manuelles localStorage
  // NACHHER: Beide im Store mit Auto-Persist

  const images = useExposeStore((state) => state.images);
  const captions = useExposeStore((state) => state.captions);

  const { addImage, removeImage, updateCaption } = useExposeStore();

  // ==================== LOCAL UI STATE ====================
  // HINWEIS: Nur UI-State, kein Business-State!
  const [isDragging, setIsDragging] = useState(false);

  // ==================== EVENT HANDLERS ====================

  /**
   * Validiert und lädt Bild hoch
   *
   * FLOW:
   * 1. Validierung (Typ, Größe)
   * 2. Base64-Encoding via FileReader
   * 3. Store-Update (addImage)
   *
   * @param {File} file - Bild-Datei
   */
  const handleUpload = (file) => {
    // VALIDATION: File-Typ
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('⚠️ Nur JPG, PNG und WebP erlaubt');
      return;
    }

    // VALIDATION: File-Größe
    if (file.size > MAX_FILE_SIZE) {
      toast.error('⚠️ Bild zu groß (max. 5MB)');
      return;
    }

    // ENCODING: Base64 für localStorage
    // WARUM: Keine Backend-Upload, direktes Browser-Storage
    const reader = new FileReader();

    reader.onload = (e) => {
      const base64 = e.target.result;

      // STEP 3: Store-Update
      addImage(base64);
      toast.success('✅ Bild hinzugefügt');
    };

    reader.onerror = () => {
      toast.error('❌ Fehler beim Lesen der Datei');
    };

    reader.readAsDataURL(file);
  };

  /**
   * Entfernt Bild an Index
   *
   * @param {number} index - Index des zu löschenden Bildes
   */
  const handleRemove = (index) => {
    removeImage(index);
    toast.success('🗑️ Bild entfernt');
  };

  /**
   * Updated Caption an Index
   *
   * @param {number} index - Index des Bildes
   * @param {string} caption - Neue Bildunterschrift
   */
  const handleCaptionChange = (index, caption) => {
    updateCaption(index, caption);
  };

  // DRAG & DROP: HTML5 Events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);

    // VALIDATION: Nur erstes File (single upload)
    if (files.length > 0) {
      handleUpload(files[0]);
    }
  };

  // FILE-INPUT: Fallback für Browser ohne Drag-Drop
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      handleUpload(files[0]);
    }

    // RESET: Input für erneuten Upload mit gleicher Datei
    e.target.value = '';
  };

  // ==================== RENDER ====================

  return (
    <div className={styles.container}>
      <h3>📸 Bilder</h3>

      {/* UPLOAD-ZONE: Drag & Drop + File-Input */}
      <div
        className={`${styles.uploadZone} ${isDragging ? styles.dragging : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileSelect}
          className={styles.fileInput}
          id="imageUpload"
        />
        <label htmlFor="imageUpload" className={styles.uploadLabel}>
          {isDragging ? (
            <span>📥 Loslassen zum Hochladen</span>
          ) : (
            <span>📎 Bild hochladen (Drag & Drop oder Klicken)</span>
          )}
        </label>
      </div>

      {/* IMAGE-LISTE: Thumbnails mit Captions */}
      {images.length > 0 && (
        <div className={styles.imageList}>
          {images.map((img, idx) => (
            <div key={idx} className={styles.imageItem}>
              {/* THUMBNAIL */}
              <img
                src={img}
                alt={`Upload ${idx + 1}`}
                className={styles.thumbnail}
              />

              {/* CAPTION-INPUT */}
              <input
                type="text"
                placeholder="Bildunterschrift (optional)"
                value={captions[idx] || ''}
                onChange={(e) => handleCaptionChange(idx, e.target.value)}
                className={styles.captionInput}
              />

              {/* DELETE-BUTTON */}
              <button
                onClick={() => handleRemove(idx)}
                className={styles.removeButton}
                title="Bild löschen"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}

      {/* INFO-TEXT */}
      <p className={styles.info}>
        Max. 5MB pro Bild • JPG, PNG, WebP erlaubt
      </p>
    </div>
  );
}
```

**Key Changes:**
1. **Props → Store**: Keine Props mehr, nutzt useExposeStore direkt
2. **Manual localStorage → Auto-Persist**: useEffect entfernt, Store macht persist
3. **Split State unified**: images + captions beide im Store
4. **Study-Guide Comments**: File-Header, JSDoc, Inline
5. **Constants extracted**: MAX_FILE_SIZE, ALLOWED_TYPES

---

## 🔄 MIGRATION STEPS

### Step 1: Update Imports (5min)
```javascript
// ✅ NEU: Store
import useExposeStore from '../stores/exposeStore';

// 🗑️ ALT: Entfernen
// Props kommen nicht mehr, werden nicht mehr benötigt
```

### Step 2: Remove Props, Add Store Selectors (10min)
```javascript
// ❌ ALT: Props
export default function ImageUpload({ images, setImages }) {
  const [captions, setCaptions] = useState([]);
  // ...
}

// ✅ NEU: Store
export default function ImageUpload() {
  const images = useExposeStore((state) => state.images);
  const captions = useExposeStore((state) => state.captions);

  const { addImage, removeImage, updateCaption } = useExposeStore();
}
```

### Step 3: Remove Manual localStorage (5min)
```javascript
// ❌ ALT: Löschen
useEffect(() => {
  const saved = localStorage.getItem('maklermate_captions');
  if (saved) setCaptions(JSON.parse(saved));
}, []);

useEffect(() => {
  localStorage.setItem('maklermate_captions', JSON.stringify(captions));
}, [captions]);

// ✅ NEU: Nichts! Store macht persist automatisch
```

### Step 4: Update Event Handlers (15min)
```javascript
// ❌ ALT: Direktes setState
const handleUpload = (file) => {
  // ... validation
  reader.onload = (e) => {
    setImages([...images, e.target.result]);
  };
};

const handleRemove = (index) => {
  setImages(images.filter((_, i) => i !== index));
  setCaptions(captions.filter((_, i) => i !== index));
};

// ✅ NEU: Store-Actions
const handleUpload = (file) => {
  // ... validation
  reader.onload = (e) => {
    addImage(e.target.result);
    toast.success('✅ Bild hinzugefügt');
  };
};

const handleRemove = (index) => {
  removeImage(index);
  toast.success('🗑️ Bild entfernt');
};
```

### Step 5: Add Study-Guide Comments (30min)
- File-Header
- JSDoc für handleUpload, handleRemove, handleCaptionChange
- Inline-Comments (WARUM: Base64, Drag-Drop)

### Step 6: Update Parent Component (5min)
```javascript
// src/pages/ExposeTool.jsx

// ❌ ALT: Mit Props
<ImageUpload images={images} setImages={setImages} />

// ✅ NEU: Ohne Props
<ImageUpload />
```

---

## 📊 TESTING (30min)

### Manual Testing Checklist:

1. **Upload-Funktionalität**
   - [ ] Drag & Drop funktioniert
   - [ ] File-Input (Click) funktioniert
   - [ ] Validation: Nur images erlaubt
   - [ ] Validation: Max 5MB enforced
   - [ ] Toast-Notifications bei Success/Error

2. **Captions**
   - [ ] Caption kann hinzugefügt werden
   - [ ] Caption wird gespeichert (persist)
   - [ ] Caption bleibt nach Reload

3. **Löschen**
   - [ ] Delete-Button funktioniert
   - [ ] Richtiges Bild wird gelöscht
   - [ ] Caption wird mit-gelöscht

4. **Persistierung**
   - [ ] Bilder bleiben nach Reload
   - [ ] Captions bleiben nach Reload
   - [ ] Cross-Tab-Sync funktioniert

5. **Edge Cases**
   - [ ] Viele Bilder (10+) → Performance OK
   - [ ] Sehr große Datei (>5MB) → Validation-Error
   - [ ] Falscher Typ (PDF) → Validation-Error

---

## 📝 COMMIT

**Commit-Message (nach DEVELOPMENT-INSTRUCTION.md):**
```bash
git add src/components/ImageUpload.jsx src/pages/ExposeTool.jsx
git commit -m "feat(ImageUpload): migrate to exposeStore, eliminate prop-drilling

Refactored according to /DEVELOPMENT-INSTRUCTION.md (Study-Guide Approach):

CHANGES:
- Removed props (images, setImages) → self-contained component
- Replaced local captions state with useExposeStore
- Removed manual localStorage logic (auto-persist via Zustand)
- Added Study-Guide comments (File-header, JSDoc, Inline)
- Extracted constants (MAX_FILE_SIZE, ALLOWED_TYPES)

ARCHITECTURE:
- Self-contained: No prop-drilling from ExposeTool
- Store-based: images + captions in exposeStore
- Auto-persist: Zustand middleware handles localStorage
- Error-handling: File validation with toast notifications

TESTING:
- Manual: Upload (drag-drop + click), captions, delete
- Edge cases: Large files, wrong types, many images
- Cross-tab: Persist + sync works

WHY:
- Eliminates prop-drilling (cleaner component tree)
- Unifies state (images + captions both in store)
- Removes manual localStorage (less code, auto-persist)

PARENT CHANGES:
- ExposeTool.jsx: Removed <ImageUpload images={...} setImages={...} />
                  Now: <ImageUpload /> (no props)

Refs: /DEVELOPMENT-INSTRUCTION.md, docs/architecture/migrations/TASK-3.2"
```

---

## ✅ SUCCESS CRITERIA

- ✅ Keine Props (self-contained)
- ✅ Store-basiert (images, captions)
- ✅ Auto-Persistierung funktioniert
- ✅ Study-Guide Comments vorhanden
- ✅ Keine Regressions (alle Features funktionieren)

**Estimated Time:** 2h
**Complexity:** Low
**Dependencies:** useExposeStore (already implemented ✅)

---

**NEXT:** `TASK-3.3-ExportButtons-Migration.md` (3h)
