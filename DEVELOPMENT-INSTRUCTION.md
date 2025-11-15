# 🏗️ MaklerMate Development Instruction
## Claude Code Study-Guide Style Refactoring

---

## 🎯 PROJECT CONTEXT

**MaklerMate** ist ein KI-gestützter Immobilien-Exposé-Generator mit integriertem CRM-Light für deutsche Immobilienmakler.

**Tech Stack:**
- Frontend: React 19
- Backend: Supabase (PostgreSQL, Auth, Storage)
- AI: OpenAI GPT-4o-mini
- Deployment: TBD (Vercel/Netlify empfohlen)

**Aktueller Status:**
- MVP mit ~50+ Files in "Spaghetti-Architektur"
- Funktional, aber nicht production-ready
- Ziel: Transformation zu modularer, enterprise-ready Architektur

---

## 📚 CODING PHILOSOPHY: "STUDY-GUIDE APPROACH"

### Core Principle
**Jede Code-Datei soll wie ein Mini-Tutorial lesbar sein.**

Ein anderer Entwickler (oder du in 6 Monaten) sollte:
1. ✅ Den Code verstehen OHNE die Dokumentation zu lesen
2. ✅ Die Architektur-Entscheidungen nachvollziehen können
3. ✅ Wissen, WO er Änderungen machen muss
4. ✅ Die Business-Logik vom UI-Code trennen können

### Kommentierungs-Levels

#### Level 1: File-Header (IMMER)
```javascript
/**
 * @fileoverview ExposeService - Core-Service für AI-gestützte Exposé-Generierung
 *
 * ZWECK:
 * - Kommunikation mit OpenAI GPT-4o-mini API
 * - Transformation von Immobilien-Rohdaten zu Marketing-Text
 * - Fehlerbehandlung bei API-Failures
 *
 * ABHÄNGIGKEITEN:
 * - OpenAI SDK (npm: openai@^4.0.0)
 * - Supabase Client für Logging
 * - validationService.js für Input-Validierung
 *
 * VERWENDUNG:
 * - Von src/hooks/useExposeGeneration.js aufgerufen
 * - Von src/pages/CreateExpose.jsx importiert
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-15
 * STATUS: 🟢 Production-Ready (refactored from MVP)
 */
```

#### Level 2: Function Documentation (IMMER bei exports)
```javascript
/**
 * Generiert Exposé-Text via OpenAI GPT-4o-mini
 *
 * @async
 * @param {Object} propertyData - Immobilien-Rohdaten vom Formular
 * @param {string} propertyData.address - Vollständige Adresse
 * @param {number} propertyData.rooms - Anzahl Zimmer
 * @param {number} propertyData.squareMeters - Wohnfläche in m²
 * @param {number} propertyData.price - Kaufpreis in EUR
 * @param {string} propertyData.type - Immobilientyp (apartment|house|commercial)
 *
 * @returns {Promise<Object>} Generiertes Exposé
 * @returns {string} .title - Überschrift (max 80 Zeichen)
 * @returns {string} .description - Haupttext (300-500 Wörter)
 * @returns {string[]} .highlights - 5-7 Bullet-Points
 * @returns {number} .tokensUsed - API-Kosten-Tracking
 *
 * @throws {ValidationError} Wenn propertyData unvollständig
 * @throws {OpenAIError} Bei API-Fehler (Rate-Limit, Timeout)
 *
 * @example
 * const expose = await generateExpose({
 *   address: "Musterstraße 123, 10115 Berlin",
 *   rooms: 3,
 *   squareMeters: 85,
 *   price: 450000,
 *   type: "apartment"
 * });
 * console.log(expose.title); // "Moderne 3-Zimmer-Wohnung in Berlin-Mitte"
 */
export async function generateExpose(propertyData) {
  // STEP 1: Input-Validierung
  // Wichtig: Verhindert unnötige API-Calls bei fehlerhaften Daten
  const validated = validatePropertyData(propertyData);

  // STEP 2: OpenAI Prompt Engineering
  // Hinweis: Prompt ist in prompts/exposePrompt.js ausgelagert
  const prompt = buildExposePrompt(validated);

  // STEP 3: API-Call mit Retry-Logik
  // Begründung: OpenAI API kann temporäre 429 Errors werfen
  const response = await callOpenAIWithRetry(prompt);

  // STEP 4: Response-Parsing & Business-Logic
  // TODO: Später in separaten Parser auslagern
  return parseExposeResponse(response);
}
```

#### Level 3: Inline-Kommentare (bei komplexer Logik)
```javascript
// WARUM: React 19 useTransition für nicht-blockierende UI
// ALT: Loading-Spinner blockierte gesamte App
// NEU: Formular bleibt während AI-Generation bedienbar
const [isPending, startTransition] = useTransition();

// PERFORMANCE: Debounce verhindert API-Spam bei schnellem Tippen
// Erst nach 500ms Pause wird API aufgerufen
const debouncedGenerate = useMemo(
  () => debounce(generateExpose, 500),
  [] // WICHTIG: Leere deps = Funktion wird nicht bei jedem Render neu erstellt
);

// FEHLERBEHANDLUNG: Drei Eskalationsstufen
// 1. Toast-Warnung (z.B. "Adresse fehlt")
// 2. Retry-Button (z.B. OpenAI 429)
// 3. Support-Kontakt (z.B. unbekannter Error)
if (error.type === 'validation') {
  showToast('error', error.message); // Stufe 1
} else if (error.retryable) {
  setShowRetryButton(true); // Stufe 2
} else {
  showErrorModal(error); // Stufe 3
}
```

---

## 🏛️ ARCHITEKTUR-PATTERNS (Mandatory)

### 1. Service-Layer Pattern
**REGEL:** Keine Business-Logik in React Components!

```javascript
// ❌ SCHLECHT (MVP-Spaghetti)
function CreateExpose() {
  const [expose, setExpose] = useState(null);

  const handleGenerate = async () => {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({ /* ... */ })
    });
    const data = await response.json();
    setExpose(data.choices[0].message.content);
  };

  return <button onClick={handleGenerate}>Generate</button>;
}

// ✅ GUT (Refactored)
// Component: Nur UI-Logik
function CreateExpose() {
  const { generate, loading, error } = useExposeGeneration();

  return (
    <button onClick={generate} disabled={loading}>
      {loading ? 'Generiere...' : 'Exposé erstellen'}
    </button>
  );
}

// Hook: Zustandsverwaltung
function useExposeGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async (data) => {
    setLoading(true);
    try {
      // Service: Business-Logik
      const result = await exposeService.generate(data);
      return result;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading, error };
}

// Service: API-Kommunikation
const exposeService = {
  async generate(propertyData) {
    // Alle OpenAI-Details gekapselt
    return openAIClient.createExpose(propertyData);
  }
};
```

### 2. Folder-Structure (Current - Post Phase 2)
```
src/
├── api/                 # ✅ API Layer (Phase 2A)
│   ├── clients/
│   │   └── apiClient.js       # Axios + Auth + Interceptors
│   ├── services/
│   │   ├── authService.js     # Supabase Auth Wrapper
│   │   └── exposeService.js   # Exposé-Generierung
│   └── utils/
│       ├── errorHandler.js    # ApiError + safeApiCall
│       ├── retry.js           # Exponential Backoff
│       └── validation.js      # Input-Validation
│
├── services/            # ✅ Domain Services (Phase 2D)
│   ├── LeadsStorageService.js # localStorage-Kapselung
│   ├── exportService.js       # CSV/JSON/TXT Export
│   └── pdfService.js          # PDF Export (Exposé + Leads)
│
├── stores/              # ✅ State Management (Phase 2B)
│   ├── crmStore.js            # Zustand CRM State
│   └── exposeStore.js         # Zustand Exposé State
│
├── hooks/               # ✅ React Hooks (Phase 2C)
│   ├── useExpose.js           # React Wrapper für exposeService
│   ├── useAIHelper.js         # 🔴 TODO: REPLACE with useExpose
│   ├── useLocalStorageLeads.js # 🔴 TODO: REPLACE with crmStore
│   ├── usePersistentImages.js
│   └── useSavedExposes.js     # 🔴 TODO: REPLACE with exposeStore
│
├── utils/               # ✅ Pure Functions (Phase 2C)
│   ├── leadHelpers.js         # Lead-Normalisierung, Validation
│   ├── arrayHelpers.js
│   ├── crmExport.js           # 🔴 TODO: DELETE (replaced by exportService)
│   ├── crmExportLeads.js      # 🔴 TODO: DELETE (replaced by exportService)
│   ├── fetchWithAuth.js
│   ├── pdfExport.js           # 🔴 TODO: DELETE (replaced by pdfService)
│   ├── pdfExportExpose.js
│   └── validateEnv.js
│
├── components/          # 🔴 TODO: REFACTOR to use stores
│   ├── ErrorBoundary.jsx      # ✅ Production-Ready
│   ├── ExposeForm.jsx         # 🔴 Needs: useExposeStore
│   ├── ExportButtons.jsx      # 🔴 Needs: pdfService, exportService
│   ├── ImageUpload.jsx        # 🔴 Needs: useExposeStore
│   └── CRM/
│       ├── LeadForm.jsx       # 🔴 Needs: useCRMStore
│       └── LeadTable.jsx      # 🔴 Needs: useCRMStore
│
├── pages/               # 🔴 TODO: REFACTOR to use stores
│   ├── ExposeTool.jsx         # 🔴 Needs: useExposeStore + useExpose
│   └── CRM/
│       └── CRMTool.jsx        # 🔴 Needs: useCRMStore
│
└── context/
    └── AuthContext.jsx
```

**REGEL:** Jeder Ordner hat ein `index.js` (Barrel Pattern)
```javascript
// src/api/services/index.js
export { default as authService } from './authService';
export { default as exposeService } from './exposeService';

// Import von außen (clean):
import { authService, exposeService } from '@/api/services';
```

### 3. Error-Boundary Pattern
**STATUS:** ✅ Bereits implementiert (Sprint 1)
```javascript
// src/components/ErrorBoundary.jsx - Production-Ready
// Wraps alle Main-Routes (Home, CRM, Expose)
```

---

## 🔧 REFACTORING-CHECKLIST

### Vor jedem Commit (MANDATORY):

#### ✅ Code Quality
- [ ] Alle Funktionen haben JSDoc-Kommentare
- [ ] Komplexe Logik hat Inline-Kommentare (WARUM, nicht WAS)
- [ ] Keine Magic Numbers (z.B. `42` → `const MAX_RETRIES = 42`)
- [ ] Keine console.log (stattdessen: Logger-Service oder dev-only)
- [ ] Keine TODOs ohne Kontext

#### ✅ Architecture
- [ ] Business-Logik in Services (nicht in Components)
- [ ] Components sind <200 Zeilen (sonst: aufteilen)
- [ ] Keine direkten API-Calls in Components (nur via Hooks/Services)
- [ ] Fehlerbehandlung auf allen Ebenen (Service, Hook, Component)

#### ✅ Testing-Ready
- [ ] Funktionen sind Pure (gleicher Input = gleicher Output)
- [ ] Services mocken API-Calls
- [ ] Components haben klare Props-Interfaces (PropTypes ✅)

#### ✅ Performance
- [ ] useMemo/useCallback bei teuren Berechnungen
- [ ] Lazy-Loading für große Components
- [ ] Debounce bei User-Input (z.B. Autocomplete)

---

## 🚨 CRITICAL RULES

### 1. NIEMALS ohne aussagekräftigen Commit-Message committen
```bash
# ❌ VERBOTEN
git commit -m "fix bug"

# ✅ ERLAUBT
git commit -m "fix: OpenAI API retry-logic - Added exponential backoff for 429 errors

Details:
- Implemented 3-retry strategy (1s, 2s, 4s delays)
- Extracted retry logic to exposeService._callWithRetry()
- Added OpenAIError.retryable flag for UI handling

Why: OpenAI API throws transient 429s during peak hours.
Users were seeing errors for temporary issues.

Tested: Manually triggered 429 via rate-limit simulation
Refs: docs/architecture/REFACTORING-ROADMAP.md"
```

### 2. NIEMALS direkte API-Keys im Code
```javascript
// ❌ VERBOTEN
const OPENAI_KEY = 'sk-proj-abc123...';

// ✅ ERLAUBT
// .env.local (nicht in Git!)
REACT_APP_OPENAI_API_KEY=sk-proj-abc123...

// src/utils/validateEnv.js (✅ bereits implementiert)
export function validateEnvironment() {
  // Checks REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY
}
```

### 3. NIEMALS ungetestete Error-Pfade
```javascript
// ❌ SCHLECHT
try {
  await api.call();
} catch (err) {
  console.error(err); // Was passiert in der UI?
}

// ✅ GUT (wie in errorHandler.js implementiert)
import { safeApiCall, showErrorToast } from '@/api/utils/errorHandler';

const { data, error } = await safeApiCall(
  () => exposeService.generate(formData),
  {
    onError: showErrorToast,
    onSuccess: (text) => toast.success('✅ Exposé generiert!'),
  }
);
```

---

## 📊 REFACTORING-PRIORITÄTEN

### ✅ Phase 1: Quick Wins (COMPLETED)
- ✅ Timeout zu fetchWithAuth
- ✅ CSV-Bug-Fix (Escaping)
- ✅ Duplicate localStorage-Logic entfernt
- ✅ PropTypes für Top-3 Components
- ✅ Error-Boundaries
- ✅ Environment-Validation

### ✅ Phase 2: Strategic Refactoring (COMPLETED)
- ✅ **Phase 2A:** API-Layer (apiClient, services, utils)
- ✅ **Phase 2B:** Zustand Stores (exposeStore, crmStore)
- ✅ **Phase 2C:** Hook-Refactoring (useExpose, leadHelpers, LeadsStorageService)
- ✅ **Phase 2D:** Utils-Consolidation (pdfService, exportService)

### 🔄 Phase 3: Component Migration (IN PROGRESS)
**Nächste Schritte:**
1. 🔴 ExposeTool.jsx → useExposeStore + useExpose
2. 🔴 CRMTool.jsx → useCRMStore
3. 🔴 ImageUpload.jsx → useExposeStore (images/captions)
4. 🔴 ExportButtons.jsx → pdfService, exportService
5. 🔴 LeadTable.jsx → useCRMStore

**Nach Migration:**
6. 🗑️ DELETE: useAIHelper.js, useLocalStorageLeads.js, useSavedExposes.js
7. 🗑️ DELETE: crmExport.js, crmExportLeads.js, pdfExport.js

### Phase 4: Excellence (Future)
- TypeScript-Migration
- Testing-Infrastructure (Vitest)
- Performance-Optimization (Code-Splitting)
- Monitoring (Sentry)

---

## 🎓 LERNERFOLG MESSEN

Nach dem Refactoring sollte ein Junior-Dev:
- ✅ Innerhalb 15 Min verstehen, wo er eine Feature-Änderung machen muss
- ✅ Einen Bug fixen können, ohne die gesamte Codebase verstehen zu müssen
- ✅ Die Architektur-Entscheidungen nachvollziehen können (durch Kommentare)

---

## 🛠️ CLAUDE CODE WORKFLOW

### WICHTIG: Vor JEDER Aufgabe
```bash
# 1. INSTRUCTION LESEN
> "Lies DEVELOPMENT-INSTRUCTION.md und bestätige Verständnis"

# 2. CHECKLIST PRÜFEN
> "Prüfe: Einhält diese Änderung die Refactoring-Checklist?"

# 3. ARCHITEKTUR-PATTERN ANWENDEN
> "Verwende Service-Layer Pattern und Study-Guide Kommentare"
```

### Typischer Session-Ablauf
```bash
# 1. FILE ÖFFNEN
> "Zeig mir src/pages/ExposeTool.jsx"

# 2. ANALYSE ANFORDERN
> "Analysiere dieses File nach DEVELOPMENT-INSTRUCTION.md.
   Wo ist Business-Logik die in einen Service gehört?"

# 3. REFACTORING DURCHFÜHREN
> "Refactore dieses File nach DEVELOPMENT-INSTRUCTION.md:
   1. Migrate zu useExposeStore
   2. Use useExpose statt useAIHelper
   3. Kommentiere alles nach Study-Guide-Standard"

# 4. QUALITÄTSKONTROLLE
> "Check gegen DEVELOPMENT-INSTRUCTION.md Checklist:
   - Ist jede Funktion kommentiert?
   - Gibt es Magic Numbers?
   - Sind Error-Pfade abgedeckt?"

# 5. COMMIT
> "Generiere Commit-Message nach DEVELOPMENT-INSTRUCTION.md Standard"
```

---

## 🎯 SUCCESS METRICS

### Code Quality Indicators (Target)
- ✅ **Avg. File Size**: <200 Zeilen (Current: ~150-300)
- ✅ **Kommentar-Ratio**: >20% (Study-Guide-Level)
- ✅ **Max Function Length**: <50 Zeilen
- ✅ **Dependency Depth**: <4 Ebenen
- 🔴 **Test Coverage**: >70% (Future: Phase 4)

### Architecture Indicators (Current Status)
- ✅ **Service-Layer Pattern**: Implemented (Phase 2A)
- ✅ **State Management**: Zustand Stores (Phase 2B)
- ✅ **Error-Handling**: Centralized (errorHandler.js)
- 🔄 **Component Migration**: In Progress (Phase 3)

---

## 📝 ABSCHLUSS-CHECKLISTE

Vor jedem PR/Commit:
- [ ] Referenziere DEVELOPMENT-INSTRUCTION.md im Commit-Message
- [ ] Alle Functions haben JSDoc
- [ ] Komplexe Logik hat Inline-Comments (WARUM)
- [ ] Keine Magic Numbers/Strings
- [ ] Fehlerbehandlung auf allen Ebenen
- [ ] Services sind testbar (Pure Functions)
- [ ] README.md aktualisiert bei Architektur-Änderungen

---

## 🚀 CURRENT STATUS & NEXT STEPS

### ✅ COMPLETED (Phases 1-2)
```
Sprint 1 (Quick Wins)          ✅ 16h
├── Timeout, CSV-Fix           ✅
├── PropTypes                  ✅
├── Error-Boundaries           ✅
└── Env-Validation             ✅

Phase 2A (API-Layer)           ✅ 10h
├── apiClient.js               ✅ Axios + Auth + Retry
├── errorHandler.js            ✅ ApiError + safeApiCall
├── validation.js              ✅ Input-Validation
├── exposeService.js           ✅ Exposé-Generierung
└── authService.js             ✅ Supabase Wrapper

Phase 2B (State-Management)    ✅ 9h
├── exposeStore.js             ✅ Zustand + Persist
└── crmStore.js                ✅ Zustand + Persist

Phase 2C (Hook-Refactoring)    ✅ 12h
├── useExpose.js               ✅ React Hook
├── leadHelpers.js             ✅ Pure Functions
└── LeadsStorageService.js     ✅ localStorage-Kapselung

Phase 2D (Utils-Consolidation) ✅ 6h
├── pdfService.js              ✅ Consolidated PDF Export
└── exportService.js           ✅ Consolidated CSV/JSON/TXT Export
```

### 🔄 IN PROGRESS (Phase 3)
```
Phase 3 (Component Migration)  🔄 ~16h estimated
├── ExposeTool.jsx             🔴 TODO: useExposeStore + useExpose
├── CRMTool.jsx                🔴 TODO: useCRMStore
├── ImageUpload.jsx            🔴 TODO: useExposeStore (images)
├── ExportButtons.jsx          🔴 TODO: pdfService + exportService
└── LeadTable.jsx              🔴 TODO: useCRMStore
```

### 🔴 OLD CODE TO DELETE (After Phase 3)
```
src/hooks/
├── useAIHelper.js             🗑️ DELETE (replaced by useExpose)
├── useLocalStorageLeads.js    🗑️ DELETE (replaced by crmStore + LeadsStorageService)
└── useSavedExposes.js         🗑️ DELETE (replaced by exposeStore)

src/utils/
├── crmExport.js               🗑️ DELETE (replaced by exportService)
├── crmExportLeads.js          🗑️ DELETE (replaced by exportService)
└── pdfExport.js               🗑️ DELETE (replaced by pdfService)
```

---

**WICHTIG:** Diese Instruction ist ein Living Document. Update sie, wenn du neue Patterns entdeckst!

**NÄCHSTER SCHRITT:** Start Phase 3 - Component Migration nach diesem Standard!
