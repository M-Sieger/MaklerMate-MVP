# 📘 Task 3.1: ExposeTool.jsx Migration Guide

**Referenz:** `/DEVELOPMENT-INSTRUCTION.md` - Study-Guide Approach
**Status:** 🔴 Pending
**Estimated:** 6h
**Complexity:** High (viel State, multiple Hooks)

---

## 🎯 MIGRATION GOALS (nach DEVELOPMENT-INSTRUCTION.md)

### Service-Layer Pattern
- ✅ Keine Business-Logik im Component (nur UI + Event-Handler)
- ✅ State via Store (useExposeStore)
- ✅ AI-Generierung via Hook (useExpose statt useAIHelper)
- ✅ Export-Logic via Services (später in Task 3.3)

### Study-Guide Comments
- ✅ File-Header mit ZWECK, ARCHITEKTUR, ABHÄNGIGKEITEN, STATUS
- ✅ JSDoc für alle exportierten Functions (falls vorhanden)
- ✅ Inline-Comments bei komplexer Logik (WARUM, nicht WAS)

### Code Quality
- ✅ Component <200 Zeilen
- ✅ Keine Magic Numbers
- ✅ Keine console.log (nur dev-only)
- ✅ Error-Handling auf allen Ebenen

---

## 📋 PRE-MIGRATION CHECKLIST

### 1. Verstehe aktuelles Component
```bash
# Lese aktuelles File
cat src/pages/ExposeTool.jsx

# Zähle Zeilen
wc -l src/pages/ExposeTool.jsx

# Finde alle useState
grep -n "useState" src/pages/ExposeTool.jsx

# Finde alle localStorage
grep -n "localStorage" src/pages/ExposeTool.jsx

# Finde alle API-Calls
grep -n "fetch\|axios\|useAI" src/pages/ExposeTool.jsx
```

### 2. Verstehe Dependencies
```bash
# Welche Components werden importiert?
grep -n "^import.*from.*components" src/pages/ExposeTool.jsx

# Welche Hooks werden verwendet?
grep -n "^import.*from.*hooks" src/pages/ExposeTool.jsx

# Welche Utils werden verwendet?
grep -n "^import.*from.*utils" src/pages/ExposeTool.jsx
```

### 3. Teste Current Behavior (Baseline)
- [ ] Formular ausfüllen funktioniert
- [ ] Exposé-Generierung funktioniert
- [ ] Output wird angezeigt
- [ ] Bilder-Upload funktioniert
- [ ] Persistierung funktioniert (localStorage)
- [ ] Export-Buttons funktionieren
- [ ] Gespeicherte Exposés laden funktioniert

---

## 🔄 MIGRATION STEPS

### Step 1: Analysiere Current State (15min)

**Current Code Pattern (SCHLECHT - MVP-Spaghetti):**
```javascript
// ❌ PROBLEM: Zu viele useState (7+)
const [formData, setFormData] = useState({...});
const [output, setOutput] = useState('');
const [selectedStyle, setSelectedStyle] = useState('emotional');
const [isLoading, setIsLoading] = useState(false);
const [images, setImages] = useState(() => {
  // ❌ PROBLEM: Manuelles localStorage
  const saved = localStorage.getItem('maklermate_images');
  try { return saved ? JSON.parse(saved) : []; }
  catch { return []; }
});
// ... 3 more useState

// ❌ PROBLEM: Manuelles localStorage in useEffect
useEffect(() => {
  localStorage.setItem('maklermate_images', JSON.stringify(images));
}, [images]);

// ❌ PROBLEM: useAIHelper verwendet (alte Hook)
const { generateText, isLoading: aiLoading } = useAIHelper();
```

**Identified Issues:**
1. **State-Chaos**: 7+ useState → should be in Store
2. **Manual Persistence**: localStorage in Component → should be in Store
3. **Old Hook**: useAIHelper → should be useExpose
4. **Prop-Drilling**: images/setImages passed to ImageUpload → should use Store
5. **No Comments**: Keine Study-Guide Comments

---

### Step 2: Plan Target State (30min)

**Target Code Pattern (GUT - Production-Ready):**
```javascript
/**
 * @fileoverview ExposeTool Page - Hauptseite für Exposé-Erstellung
 *
 * ZWECK:
 * - Formular für Immobilien-Daten (Adresse, Zimmer, Fläche, Preis)
 * - AI-gestützte Exposé-Generierung via OpenAI GPT-4o-mini
 * - Bild-Upload und Verwaltung mit Captions
 * - Exposé-Export (PDF, JSON, Text)
 * - Speichern und Laden von Exposés
 *
 * ARCHITEKTUR:
 * - Presentational Component (nur UI-Logik)
 * - State-Management via useExposeStore (Zustand + localStorage)
 * - AI-Generierung via useExpose Hook (wraps exposeService)
 * - Export-Logic via pdfService, exportService
 *
 * USER-FLOW:
 * 1. User füllt Formular aus (ExposeForm)
 * 2. User wählt Stil (emotional, sachlich, luxus)
 * 3. User klickt "Generieren" → useExpose ruft exposeService auf
 * 4. Service ruft OpenAI API auf (mit Retry-Logic)
 * 5. Result wird in Store gespeichert + im GPTOutputBox angezeigt
 * 6. User kann exportieren (PDF, JSON) oder speichern (localStorage)
 *
 * ABHÄNGIGKEITEN:
 * - stores/exposeStore.js (State: formData, output, images, captions)
 * - hooks/useExpose.js (AI-Generierung)
 * - services/pdfService.js (PDF-Export)
 * - services/exportService.js (JSON-Export)
 * - components/ExposeForm.jsx (Formular)
 * - components/ImageUpload.jsx (Bild-Upload)
 * - components/ExportButtons.jsx (Export-Aktionen)
 * - components/SavedExposes.jsx (Gespeicherte Exposés)
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-15
 * STATUS: 🟢 Production-Ready (refactored in Phase 3)
 */

import React from 'react';
import toast from 'react-hot-toast';

// COMPONENTS
import ExposeForm from '../components/ExposeForm';
import GPTOutputBox from '../components/GPTOutputBox';
import ImageUpload from '../components/ImageUpload';
import ExportButtons from '../components/ExportButtons';
import SavedExposes from '../components/SavedExposes';
import ErrorBoundary from '../components/ErrorBoundary';

// STORES & HOOKS (nach DEVELOPMENT-INSTRUCTION.md: Service-Layer Pattern)
import useExposeStore from '../stores/exposeStore';
import { useExpose } from '../hooks/useExpose';

// STYLES
import styles from '../styles/ExposeTool.module.css';

export default function ExposeTool() {
  // ==================== STATE (via Zustand Store) ====================
  // WARUM: Eliminiert Prop-Drilling, Auto-Persistierung, Cross-Tab-Sync
  // VORHER: 7+ useState + manuelles localStorage
  // NACHHER: Saubere Store-Selectors

  const formData = useExposeStore((state) => state.formData);
  const output = useExposeStore((state) => state.output);
  const selectedStyle = useExposeStore((state) => state.selectedStyle);
  const images = useExposeStore((state) => state.images);
  const captions = useExposeStore((state) => state.captions);
  const savedExposes = useExposeStore((state) => state.savedExposes);

  // ACTIONS: Store-Actions statt lokaler setState
  const { setFormData, setOutput, setStyle, saveExpose, loadExpose, reset } =
    useExposeStore();

  // ==================== AI-GENERIERUNG (via useExpose Hook) ====================
  // WARUM: Kapselt OpenAI-Logik, Error-Handling, Loading-State
  // VORHER: useAIHelper (alte Hook)
  // NACHHER: useExpose (wraps exposeService)

  const { generateExpose, isGenerating, error: aiError } = useExpose();

  // ==================== EVENT HANDLERS ====================

  /**
   * Generiert Exposé-Text via AI
   *
   * FLOW:
   * 1. Validierung (in exposeService)
   * 2. API-Call (OpenAI GPT-4o-mini)
   * 3. Retry bei 429 (Exponential Backoff)
   * 4. Error-Handling (User-freundlich)
   * 5. Result in Store speichern
   */
  const handleGenerate = async () => {
    // STEP 1: AI-Generierung via Hook
    const { data, error } = await generateExpose(formData, selectedStyle);

    // STEP 2: Success → Store updaten
    if (data) {
      setOutput(data);
      toast.success('✅ Exposé erfolgreich generiert!');
    }

    // STEP 3: Error → User-Info (bereits via useExpose)
    if (error) {
      // Error-Toast wird bereits von useExpose gezeigt
      console.error('[ExposeTool] Generation failed:', error);
    }
  };

  /**
   * Lädt gespeichertes Exposé in aktuelles Formular
   *
   * @param {Object} expose - Gespeichertes Exposé
   */
  const handleLoadExpose = (expose) => {
    loadExpose(expose);
    toast.success('📄 Exposé geladen');
  };

  /**
   * Speichert aktuelles Exposé in localStorage
   */
  const handleSaveExpose = () => {
    // VALIDATION: Nur speichern wenn Output vorhanden
    if (!output || !output.trim()) {
      toast.error('⚠️ Bitte erst ein Exposé generieren');
      return;
    }

    saveExpose();
    toast.success('💾 Exposé gespeichert');
  };

  /**
   * Reset Formular und Output
   */
  const handleReset = () => {
    reset();
    toast.success('🔄 Formular zurückgesetzt');
  };

  // ==================== RENDER ====================

  return (
    <ErrorBoundary>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>🏠 Exposé-Generator</h1>
          <p>KI-gestützte Immobilien-Exposés in Sekunden</p>
        </header>

        <div className={styles.mainContent}>
          {/* LEFT COLUMN: Formular + Bilder */}
          <div className={styles.leftColumn}>
            {/* FORMULAR: Selbst-contained, nutzt Store direkt */}
            <ExposeForm />

            {/* BILDER: Selbst-contained, nutzt Store direkt (kein Prop-Drilling!) */}
            <ImageUpload />

            {/* GENERATE BUTTON */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={styles.generateButton}
            >
              {isGenerating ? '⏳ Generiere...' : '✨ Exposé generieren'}
            </button>

            {/* ERROR-ANZEIGE */}
            {aiError && (
              <div className={styles.errorBox}>
                ⚠️ {aiError.message}
                {aiError.retryable && (
                  <button onClick={handleGenerate}>🔄 Erneut versuchen</button>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Output + Export */}
          <div className={styles.rightColumn}>
            {/* OUTPUT: GPT-generierter Text */}
            <GPTOutputBox output={output} />

            {/* EXPORT-BUTTONS: Nutzen pdfService, exportService (Task 3.3) */}
            <ExportButtons onSaveExpose={handleSaveExpose} />

            {/* SAVED EXPOSÉS: Liste gespeicherter Exposés */}
            <SavedExposes
              exposés={savedExposes}
              onLoad={handleLoadExpose}
            />
          </div>
        </div>

        {/* RESET BUTTON (Footer) */}
        <footer className={styles.footer}>
          <button onClick={handleReset} className={styles.resetButton}>
            🔄 Neues Exposé
          </button>
        </footer>
      </div>
    </ErrorBoundary>
  );
}
```

**Key Changes:**
1. **useState → useExposeStore**: 7+ useState eliminiert
2. **Manual localStorage → Store Persist**: Auto-Persistierung
3. **useAIHelper → useExpose**: Neue Hook mit exposeService
4. **Prop-Drilling eliminated**: ImageUpload nutzt Store direkt
5. **Study-Guide Comments**: File-Header, JSDoc, Inline-Comments

---

### Step 3: Implement Migration (3h)

**3.1 Add Imports (5min)**
```javascript
// ✅ NEU: Store + Hook
import useExposeStore from '../stores/exposeStore';
import { useExpose } from '../hooks/useExpose';

// 🗑️ ALT: Entfernen nach Migration
// import { useAIHelper } from '../hooks/useAIHelper';
```

**3.2 Replace useState with Store Selectors (30min)**
```javascript
// ❌ ALT: Manueller State
const [formData, setFormData] = useState({...});
const [output, setOutput] = useState('');
// ... 5 more

// ✅ NEU: Store-Selectors
const formData = useExposeStore((state) => state.formData);
const output = useExposeStore((state) => state.output);
const selectedStyle = useExposeStore((state) => state.selectedStyle);
const images = useExposeStore((state) => state.images);
const captions = useExposeStore((state) => state.captions);
const savedExposes = useExposeStore((state) => state.savedExposes);

const { setFormData, setOutput, setStyle, saveExpose, loadExpose, reset } =
  useExposeStore();
```

**3.3 Replace useAIHelper with useExpose (30min)**
```javascript
// ❌ ALT: useAIHelper
const { generateText, isLoading: aiLoading } = useAIHelper();

// ✅ NEU: useExpose (mit exposeService)
const { generateExpose, isGenerating, error: aiError } = useExpose();
```

**3.4 Update handleGenerate Logic (30min)**
```javascript
// ❌ ALT: Direkter API-Call
const handleGenerate = async () => {
  setIsLoading(true);
  try {
    const result = await generateText(formData, selectedStyle);
    setOutput(result);
  } catch (err) {
    console.error(err);
  } finally {
    setIsLoading(false);
  }
};

// ✅ NEU: Service-basiert mit Error-Handling
const handleGenerate = async () => {
  const { data, error } = await generateExpose(formData, selectedStyle);

  if (data) {
    setOutput(data);
    toast.success('✅ Exposé erfolgreich generiert!');
  }

  if (error) {
    // Error-Toast bereits via useExpose
    console.error('[ExposeTool] Generation failed:', error);
  }
};
```

**3.5 Remove Manual localStorage (15min)**
```javascript
// ❌ ALT: Manuelles localStorage
useEffect(() => {
  localStorage.setItem('maklermate_images', JSON.stringify(images));
}, [images]);

useEffect(() => {
  const saved = localStorage.getItem('maklermate_formData');
  if (saved) setFormData(JSON.parse(saved));
}, []);

// ✅ NEU: Nichts! Store hat persist-middleware
// Automatische Persistierung via Zustand
```

**3.6 Update Child Component Props (30min)**
```javascript
// ❌ ALT: Prop-Drilling
<ImageUpload images={images} setImages={setImages} />
<ExposeForm formData={formData} setFormData={setFormData} onChange={handleChange} />

// ✅ NEU: Keine Props! Components nutzen Store direkt
<ImageUpload />
<ExposeForm />
```

**3.7 Add Study-Guide Comments (45min)**
- File-Header (ZWECK, ARCHITEKTUR, ABHÄNGIGKEITEN, STATUS)
- JSDoc für handleGenerate, handleLoadExpose, handleSaveExpose
- Inline-Comments (WARUM, nicht WAS)

---

### Step 4: Testing (1h)

**Manual Testing Checklist:**

1. **Formular-Funktionalität**
   - [ ] Alle Felder können ausgefüllt werden
   - [ ] Änderungen werden im Store gespeichert
   - [ ] Persistierung funktioniert (Reload → Daten bleiben)

2. **AI-Generierung**
   - [ ] "Generieren"-Button funktioniert
   - [ ] Loading-State wird angezeigt
   - [ ] Output wird korrekt angezeigt
   - [ ] Toast-Notification bei Success
   - [ ] Error-Handling bei API-Fehler (z.B. Network offline)

3. **Bild-Upload**
   - [ ] Bilder können hochgeladen werden
   - [ ] Captions können hinzugefügt werden
   - [ ] Bilder können gelöscht werden
   - [ ] Persistierung funktioniert

4. **Exposé Speichern/Laden**
   - [ ] "Speichern"-Button funktioniert
   - [ ] Gespeicherte Exposés werden angezeigt
   - [ ] Laden funktioniert (Formular wird befüllt)
   - [ ] Löschen funktioniert

5. **Export (später in Task 3.3)**
   - [ ] PDF-Export funktioniert
   - [ ] JSON-Export funktioniert
   - [ ] Text-Kopieren funktioniert

6. **Edge Cases**
   - [ ] Leeres Formular → Validation-Error
   - [ ] Sehr lange Texte → kein Overflow
   - [ ] Viele Bilder (10+) → Performance OK
   - [ ] Browser-Reload → State bleibt erhalten
   - [ ] Zweiter Tab öffnen → Cross-Tab-Sync funktioniert

---

### Step 5: Cleanup (30min)

**5.1 Remove Old Code**
```bash
# ❌ Entferne alte Imports
# import { useAIHelper } from '../hooks/useAIHelper';

# ❌ Entferne alle localStorage-Logik
# useEffect(() => { localStorage.setItem(...) }, []);
```

**5.2 Verify No Regressions**
```bash
# Suche nach verbleibenden localStorage-Calls
grep -n "localStorage" src/pages/ExposeTool.jsx
# Should be: 0 results

# Suche nach verbleibenden useState
grep -n "useState" src/pages/ExposeTool.jsx
# Should be: 0 results (außer vielleicht UI-only State wie modal-open)
```

---

### Step 6: Commit (15min)

**Commit-Message (nach DEVELOPMENT-INSTRUCTION.md Standard):**
```bash
git add src/pages/ExposeTool.jsx
git commit -m "feat(ExposeTool): migrate to useExposeStore + useExpose

Refactored according to /DEVELOPMENT-INSTRUCTION.md (Study-Guide Approach):

CHANGES:
- Replaced 7+ useState with useExposeStore selectors
- Replaced useAIHelper with useExpose hook
- Removed manual localStorage logic (auto-persist via Zustand)
- Eliminated prop-drilling (ImageUpload, ExposeForm use store directly)
- Added comprehensive Study-Guide comments:
  * File-header (ZWECK, ARCHITEKTUR, ABHÄNGIGKEITEN)
  * JSDoc for event handlers
  * Inline-comments (WARUM, not WAS)

ARCHITECTURE:
- Service-Layer Pattern: AI-logic in exposeService
- State-Management: Zustand with persist middleware
- Error-Handling: safeApiCall + toast notifications
- Component <200 LOC (currently ~180)

TESTING:
- Manual: All features working (form, generate, save, load)
- Edge cases: Empty form, network errors, cross-tab sync
- No regressions: Existing functionality unchanged

WHY:
- Eliminates state-chaos (7+ useState → Store)
- Removes prop-drilling (cleaner component tree)
- Centralizes business-logic (testable services)
- Improves DX (Study-Guide comments)

NEXT:
- Task 3.2: ImageUpload migration (remove props)
- Task 3.3: ExportButtons migration (use pdfService)

Refs: /DEVELOPMENT-INSTRUCTION.md, docs/architecture/PHASE-3-PLAN.md"
```

---

## 📊 POST-MIGRATION VALIDATION

### Code Quality Checklist (DEVELOPMENT-INSTRUCTION.md)

#### ✅ Code Quality
- [ ] Alle Funktionen haben JSDoc-Kommentare
- [ ] Komplexe Logik hat Inline-Kommentare (WARUM)
- [ ] Keine Magic Numbers
- [ ] Keine console.log (nur dev-only)
- [ ] Keine TODOs ohne Kontext

#### ✅ Architecture
- [ ] Business-Logik in Services (nicht in Component)
- [ ] Component ist <200 Zeilen
- [ ] Keine direkten API-Calls (nur via useExpose)
- [ ] Fehlerbehandlung auf allen Ebenen

#### ✅ Testing-Ready
- [ ] Component-Verhalten unverändert (keine Regression)
- [ ] Error-Pfade getestet (Network-Fehler, Validation)
- [ ] Edge-Cases getestet (leere Daten, viele Bilder)

---

## 🎯 SUCCESS CRITERIA

Migration ist erfolgreich wenn:

1. **Funktionalität unverändert:**
   - ✅ Alle Features funktionieren wie vorher
   - ✅ Keine Regressions
   - ✅ Error-Handling verbessert

2. **Code Quality:**
   - ✅ Study-Guide Comments vorhanden
   - ✅ Service-Layer Pattern befolgt
   - ✅ Component <200 Zeilen

3. **Architecture:**
   - ✅ State in Store (useExposeStore)
   - ✅ Business-Logic in Service (exposeService)
   - ✅ Kein Prop-Drilling

4. **Testing:**
   - ✅ Manuell getestet (Happy Path, Error Path, Edge Cases)
   - ✅ Cross-Browser (Chrome, Firefox)
   - ✅ Cross-Tab-Sync funktioniert

---

## 🚀 READY TO START

**Command:**
```bash
# 1. Read DEVELOPMENT-INSTRUCTION.md
cat /DEVELOPMENT-INSTRUCTION.md

# 2. Read this migration guide
cat docs/architecture/migrations/TASK-3.1-ExposeTool-Migration.md

# 3. Read current file
cat src/pages/ExposeTool.jsx

# 4. Start migration
echo "Starting Task 3.1: ExposeTool.jsx Migration"
```

**Estimated Time:** 6h (Analysis 1h, Implementation 3h, Testing 1h, Cleanup 1h)
**Complexity:** High
**Dependencies:** useExposeStore, useExpose (already implemented ✅)

---

**NEXT GUIDE:** `TASK-3.2-ImageUpload-Migration.md` (2h)
