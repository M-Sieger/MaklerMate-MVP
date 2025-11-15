# 🚀 MaklerMate Architecture Migration Guide

**Version:** 1.0
**Datum:** 15. November 2025
**Ziel:** Schritt-für-Schritt Migration von MVP zu Production-Ready Architecture

---

## 📖 Inhaltsverzeichnis

1. [Überblick](#überblick)
2. [Voraussetzungen](#voraussetzungen)
3. [Sprint 1: Quick Wins](#sprint-1-quick-wins)
4. [Sprint 2-3: Strategic Refactoring](#sprint-2-3-strategic-refactoring)
5. [Sprint 4+: Excellence](#sprint-4-excellence)
6. [Testing-Strategie](#testing-strategie)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)

---

## Überblick

### Warum migrieren?

**Aktuelle Probleme:**
- ❌ Keine Tests (0% Coverage)
- ❌ Keine Type-Safety (0% TypeScript)
- ❌ Business-Logic in UI-Komponenten
- ❌ Code-Duplikation (3x PDF-Export, 2x CRM-Export)
- ❌ Kein zentrales API-Error-Handling
- ❌ Prop-Drilling

**Nach Migration:**
- ✅ 60% Test-Coverage
- ✅ 90% TypeScript-Coverage
- ✅ Saubere Service-Layer-Architektur
- ✅ Keine Code-Duplikation
- ✅ Zentrales API-Error-Handling mit Retry-Logic
- ✅ Zustand-basiertes State-Management

### Phasen-Überblick

```
Sprint 1 (1-2 Wochen, ~16h)
  → Quick Wins: Cleanup, PropTypes, Error-Boundaries

Sprint 2-3 (4-6 Wochen, ~50h)
  → API-Layer, Services, Zustand, Hook-Refactoring

Sprint 4+ (8-12 Wochen, ~80h)
  → TypeScript, Testing, Performance
```

---

## Voraussetzungen

### Tools

- Node.js >= 18.x
- npm >= 9.x
- Git
- VS Code (empfohlen) mit Extensions:
  - ESLint
  - Prettier
  - ES7+ React/Redux/React-Native snippets

### Kenntnisse

**Erforderlich:**
- React Hooks
- Async/Await
- LocalStorage

**Hilfreich:**
- TypeScript (für Sprint 4+)
- Testing Library
- Zustand

---

## Sprint 1: Quick Wins

**Ziel:** Sofortige Verbesserungen ohne Breaking Changes
**Aufwand:** ~16h
**ROI:** ⭐⭐⭐⭐⭐

---

### Task 1.1: CSV-Escaping-Bug fixen (5min) ✅ ERLEDIGT

**Problem:** CSV-Export in `crmExport.js` hat kein Escaping → Namen mit Kommas brechen CSV-Format

**Evidenz:**
```javascript
// ❌ Vorher (src/utils/crmExport.js:29):
const rows = leads.map((l) => `${l.name},${l.email},${l.status}`);
// Bug: Name "Schmidt, Maria" → CSV hat 4 statt 3 Spalten!

// ✅ Nachher:
const rows = leads.map((l) =>
  `"${l.name || ''}","${l.email || ''}","${l.status || ''}"`
);
```

**Acceptance Criteria:**
- [x] CSV-Felder mit Anführungszeichen escapen
- [x] Null-Safety mit `|| ''` Fallback
- [x] Kommentar zur CSV-Injection-Prevention

**Status:** ✅ Gefixt am 15.11.2025

---

### Task 1.2: Timeout zu fetchWithAuth (30min)

**Datei:** `src/utils/fetchWithAuth.js`

```javascript
import { supabase } from '../lib/supabaseClient';

/**
 * Fetch mit Auto-Authentication und Timeout
 * @param {string} url - API-Endpoint
 * @param {Object} options - Fetch-Options
 * @param {number} options.timeout - Timeout in ms (default: 30000)
 * @returns {Promise<Response>}
 */
export async function fetchWithAuth(url, options = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;

  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', 'application/json');

  // ✅ NEU: Timeout mit AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    options.timeout || 30000 // 30s default
  );

  try {
    return await fetch(url, {
      ...options,
      headers,
      signal: controller.signal
    });
  } catch (error) {
    // Bessere Error-Message bei Timeout
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - bitte erneut versuchen');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
```

**Testen:**
```javascript
// Test-Case (in Browser-Console oder Component)
try {
  await fetchWithAuth('/api/generate-expose', {
    method: 'POST',
    body: JSON.stringify({ prompt: 'Test' }),
    timeout: 5000 // 5s für Test
  });
} catch (error) {
  console.log(error.message); // Sollte "Request timeout" zeigen nach 5s
}
```

---

### Task 1.3: ~~arrayHelpers → npm-Package~~ ❌ ÜBERSPRUNGEN

> **⚠️ KORREKTUR (15.11.2025):**
> Diese Empfehlung wurde als **FALSCH** identifiziert. `arrayHelpers.js` (36 LOC, dependency-free)
> sollte **NICHT** durch ein npm-Package ersetzt werden. Kein echter Mehrwert, zusätzliche Dependency.
> **Empfehlung:** BEHALTEN. Dieser Task wird **NICHT** umgesetzt.

<details>
<summary>Ursprüngliche (falsche) Empfehlung - nur zur Referenz</summary>

```bash
# 1. Package installieren
npm install array-move

# 2. Suche nach arrayHelpers-Imports
grep -r "arrayHelpers" src/

# 3. Ersetze Imports
# Vorher: import { moveItem } from '../utils/arrayHelpers';
# Nachher: import { move } from 'array-move';

# 4. Lösche Utils-File
rm src/utils/arrayHelpers.js

# 5. Teste die App
npm start
```
</details>

**Beispiel-Migration:**

**Vorher:**
```javascript
import { moveItemUp, moveItemDown } from '../utils/arrayHelpers';

const handleMoveUp = (index) => {
  const newImages = moveItemUp(images, index);
  setImages(newImages);
};
```

**Nachher:**
```javascript
import { move } from 'array-move';

const handleMoveUp = (index) => {
  if (index === 0) return;
  const newImages = move(images, index, index - 1);
  setImages(newImages);
};
```

---

### Task 1.4: Doppelte localStorage-Logic entfernen (1h)

**Problem:** ExposeTool + ImageUpload greifen beide direkt auf localStorage zu

#### Schritt 1: ImageUpload.jsx refactoren

**Datei:** `src/components/ImageUpload.jsx`

**Vorher (Zeilen 24-50):**
```jsx
const ImageUpload = ({ images, setImages }) => {
  const [captions, setCaptions] = useState([]);

  // ❌ Doppelte Logic
  useEffect(() => {
    const savedImages = localStorage.getItem('maklermate_images');
    const savedCaptions = localStorage.getItem('maklermate_captions');
    if (savedImages) {
      try {
        setImages(JSON.parse(savedImages));
      } catch (err) {
        console.error('Error loading images:', err);
      }
    }
    // ... ähnlich für captions
  }, []);

  useEffect(() => {
    localStorage.setItem('maklermate_images', JSON.stringify(images));
  }, [images]);

  useEffect(() => {
    localStorage.setItem('maklermate_captions', JSON.stringify(captions));
  }, [captions]);

  // ...
}
```

**Nachher:**
```jsx
import usePersistentImages from '../hooks/usePersistentImages';

const ImageUpload = () => {
  // ✅ Hook übernimmt alles
  const [images, setImages] = usePersistentImages('maklermate_images');
  const [captions, setCaptions] = usePersistentImages('maklermate_captions');

  // Kein useEffect mehr nötig!

  // Rest bleibt gleich
  const handleUpload = (e) => { /* ... */ };

  return (
    <div className="image-upload">
      {/* ... */}
    </div>
  );
}

export default ImageUpload;
```

**Wichtig:** Props entfernen!
```jsx
// ❌ Vorher in ExposeTool.jsx
<ImageUpload images={images} setImages={setImages} />

// ✅ Nachher
<ImageUpload />
```

#### Schritt 2: ExposeTool.jsx anpassen

**Datei:** `src/pages/ExposeTool.jsx`

**Zeile ~34-42 löschen:**
```jsx
// ❌ LÖSCHEN
const [images, setImages] = useState(() => {
  const saved = localStorage.getItem('maklermate_images');
  try {
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
});
```

**Ersetzen durch:**
```jsx
// ✅ Hook nutzen
import usePersistentImages from '../hooks/usePersistentImages';

const [images, setImages] = usePersistentImages('maklermate_images');
const [captions, setCaptions] = usePersistentImages('maklermate_captions');
```

**Zeile ~142 anpassen:**
```jsx
// ❌ Vorher
<ImageUpload images={images} setImages={setImages} />

// ✅ Nachher
<ImageUpload />
```

---

### Task 1.5: PropTypes hinzufügen (4h)

```bash
npm install prop-types
```

**Template:**
```javascript
import PropTypes from 'prop-types';

function ExposeForm({ formData, setFormData, onChange }) {
  // Component code...
}

ExposeForm.propTypes = {
  formData: PropTypes.shape({
    objektart: PropTypes.string.isRequired,
    strasse: PropTypes.string.isRequired,
    ort: PropTypes.string.isRequired,
    wohnflaeche: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    zimmer: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    preis: PropTypes.string,
    bezirk: PropTypes.string,
    baujahr: PropTypes.string,
    etage: PropTypes.string,
    balkonTerrasse: PropTypes.string,
    ausstattung: PropTypes.string,
    besonderheiten: PropTypes.string,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ExposeForm;
```

**Komponenten-Liste (Priorität):**
1. ✅ ExposeForm.jsx
2. ✅ ImageUpload.jsx
3. ✅ ExportButtons.jsx
4. ✅ GPTOutputBox.jsx
5. ✅ LeadForm.jsx
6. ✅ LeadTable.jsx
7. ✅ SavedExposes.jsx
8. ✅ Header.jsx
9. ✅ AuthButtons.jsx
10. ✅ Layout.jsx

**Testing:**
```jsx
// Test: Falsche Props übergeben
<ExposeForm formData="wrong type" />  // ⚠️ Console-Warning erwartet
```

---

### Task 1.6: Error-Boundaries (2h)

#### Schritt 1: ErrorBoundary erstellen

**Datei:** `src/components/ErrorBoundary.jsx` (NEU)

```jsx
import React from 'react';
import styles from './ErrorBoundary.module.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);

    // Optional: Sentry-Integration
    // Sentry.captureException(error, { contexts: { react: { componentStack: errorInfo.componentStack } } });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.errorBoundary}>
          <div className={styles.errorCard}>
            <h2 className={styles.errorTitle}>⚠️ Etwas ist schiefgelaufen</h2>
            <p className={styles.errorMessage}>
              {this.state.error?.message || 'Unbekannter Fehler'}
            </p>
            <div className={styles.errorActions}>
              <button onClick={this.handleReset} className={styles.retryButton}>
                Erneut versuchen
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className={styles.homeButton}
              >
                Zur Startseite
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details className={styles.errorDetails}>
                <summary>Fehler-Details (nur Development)</summary>
                <pre>{this.state.error?.stack}</pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

**Datei:** `src/components/ErrorBoundary.module.css` (NEU)

```css
.errorBoundary {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.errorCard {
  background: white;
  border-radius: 12px;
  padding: 40px;
  max-width: 600px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.errorTitle {
  color: #e74c3c;
  margin-bottom: 16px;
  font-size: 24px;
}

.errorMessage {
  color: #555;
  margin-bottom: 24px;
  line-height: 1.6;
}

.errorActions {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.retryButton,
.homeButton {
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  transition: transform 0.2s;
}

.retryButton {
  background: #3498db;
  color: white;
}

.homeButton {
  background: #95a5a6;
  color: white;
}

.retryButton:hover,
.homeButton:hover {
  transform: translateY(-2px);
}

.errorDetails {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  margin-top: 20px;
}

.errorDetails summary {
  cursor: pointer;
  font-weight: 600;
  color: #666;
}

.errorDetails pre {
  margin-top: 12px;
  font-size: 12px;
  overflow-x: auto;
  color: #c0392b;
}
```

#### Schritt 2: In App.js einbinden

**Datei:** `src/App.js`

```jsx
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <Routes>
            {/* ... */}
          </Routes>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}
```

**Testing:**
```jsx
// Test-Komponente erstellen (temporär)
function BuggyComponent() {
  throw new Error('Test Error Boundary');
}

// In Route einbinden
<Route path="/test-error" element={<BuggyComponent />} />

// Navigiere zu /test-error → Error-Boundary sollte greifen
```

---

### Task 1.7: Environment-Validation (1h)

**Datei:** `src/utils/validateEnv.js` (NEU)

```javascript
/**
 * Validiert erforderliche Environment-Variablen beim App-Start
 * @throws {Error} Falls kritische ENV-Variablen fehlen
 */
export function validateEnvironment() {
  const required = [
    'REACT_APP_SUPABASE_URL',
    'REACT_APP_SUPABASE_ANON_KEY',
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    const errorMessage =
      `❌ Fehlende Environment-Variablen:\n\n` +
      missing.map(key => `  - ${key}`).join('\n') +
      `\n\n` +
      `📝 Bitte .env.local erstellen:\n` +
      `\n` +
      `  1. Kopiere .env.example zu .env.local\n` +
      `  2. Fülle die Werte aus\n` +
      `  3. Starte den Dev-Server neu\n` +
      `\n` +
      `💡 Siehe README.md für Details.`;

    throw new Error(errorMessage);
  }

  console.log('✅ Environment-Variablen validiert');
}
```

**Datei:** `src/index.js`

```javascript
import { validateEnvironment } from './utils/validateEnv';

// ========== VALIDATION VOR REACT-RENDER ==========
try {
  validateEnvironment();
} catch (error) {
  console.error(error.message);

  // User-freundliche Error-Page
  document.body.innerHTML = `
    <div style="
      padding: 40px;
      max-width: 800px;
      margin: 50px auto;
      background: #fee;
      border-left: 4px solid #c00;
      border-radius: 8px;
      font-family: 'Segoe UI', sans-serif;
    ">
      <h2 style="color: #c00; margin-top: 0;">
        ⚙️ Konfigurationsfehler
      </h2>
      <pre style="
        background: white;
        padding: 20px;
        border-radius: 4px;
        overflow-x: auto;
        white-space: pre-wrap;
        font-size: 14px;
      ">${error.message}</pre>
    </div>
  `;

  throw error; // Stop execution
}

// ========== REACT-RENDER ==========
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**Testing:**
```bash
# 1. .env.local umbenennen (temp)
mv .env.local .env.local.bak

# 2. App starten
npm start

# 3. Sollte Error-Page zeigen
# → "Fehlende Environment-Variablen: REACT_APP_SUPABASE_URL, ..."

# 4. Wiederherstellen
mv .env.local.bak .env.local
npm start
```

---

### Sprint 1 Checklist

- [ ] Task 1.1: Cleanup veralteter Code
- [ ] Task 1.2: Timeout zu fetchWithAuth
- [ ] Task 1.3: arrayHelpers → npm
- [ ] Task 1.4: Doppelte localStorage-Logic
- [ ] Task 1.5: PropTypes (10 Komponenten)
- [ ] Task 1.6: Error-Boundaries
- [ ] Task 1.7: Environment-Validation

**Testing:**
```bash
# Alle Tests durchführen
npm start
# → App sollte ohne Fehler starten
# → Navigiere zu /expose → Generiere Exposé
# → Navigiere zu /crm → Erstelle Lead
# → Console sollte keine Fehler zeigen
```

---

## Sprint 2-3: Strategic Refactoring

**Ziel:** Architektur-Grundlagen schaffen
**Aufwand:** ~50h
**ROI:** ⭐⭐⭐⭐⭐

---

### Phase A: API-Layer (10h)

#### Schritt 1: Struktur erstellen (5min)

```bash
mkdir -p src/api/clients src/api/services src/api/utils

# Verschiebe supabaseClient
mv src/lib/supabaseClient.js src/api/clients/supabaseClient.js

# Update .gitignore (falls nötig)
echo "src/api/clients/.env" >> .gitignore
```

#### Schritt 2: Axios installieren

```bash
npm install axios
```

#### Schritt 3: API-Client erstellen

**Siehe:** `docs/architecture/ADR-003-Central-API-Client.md` für vollständigen Code

**Quick-Copy:**

Erstelle `src/api/clients/apiClient.js` mit dem Code aus ADR-003.

#### Schritt 4: Utilities erstellen

1. `src/api/utils/retry.js` - Siehe ADR-003
2. `src/api/utils/errorHandler.js` - Siehe ADR-003
3. `src/api/utils/validation.js` - Siehe REFACTORING-ROADMAP.md

#### Schritt 5: Services erstellen

**exposeService.js:**
```bash
# Erstelle Service
touch src/api/services/exposeService.js
```

Siehe REFACTORING-ROADMAP.md Task 2.5 für vollständigen Code.

**authService.js, exportService.js** analog erstellen.

#### Schritt 6: Imports aktualisieren

**Überall wo `supabaseClient` importiert wird:**
```javascript
// ❌ Vorher
import { supabase } from '../lib/supabaseClient';

// ✅ Nachher
import { supabase } from '../api/clients/supabaseClient';
```

**Dateien updaten:**
- src/context/AuthContext.jsx
- src/pages/Profile.jsx
- src/utils/fetchWithAuth.js

```bash
# Find & Replace helper
grep -r "lib/supabaseClient" src/
# Manuell anpassen
```

---

### Phase B: Zustand (9h)

#### Schritt 1: Installation

```bash
npm install zustand
mkdir src/stores
```

#### Schritt 2: Stores erstellen

**Siehe:** `docs/architecture/ADR-002-Zustand-State-Management.md`

1. Erstelle `src/stores/exposeStore.js` (Code aus ADR-002)
2. Erstelle `src/stores/crmStore.js` (Code aus ADR-002)

#### Schritt 3: ExposeTool migrieren

**Datei:** `src/pages/ExposeTool.jsx`

**Migration Schritt-für-Schritt:**

1. **Import Store:**
```jsx
import useExposeStore from '../stores/exposeStore';
```

2. **State ersetzen:**
```jsx
// ❌ Vorher
const [formData, setFormData] = useState({...});
const [output, setOutput] = useState('');
const [isLoading, setIsLoading] = useState(false);

// ✅ Nachher
const formData = useExposeStore((state) => state.formData);
const output = useExposeStore((state) => state.output);
const isLoading = useExposeStore((state) => state.isLoading);
const { setFormData, setOutput, setLoading } = useExposeStore();
```

3. **Props entfernen:**
```jsx
// ❌ Vorher
<ExposeForm formData={formData} setFormData={setFormData} onChange={handleChange} />

// ✅ Nachher
<ExposeForm />
```

4. **Kinder-Komponenten aktualisieren:**

**ExposeForm.jsx:**
```jsx
import useExposeStore from '../stores/exposeStore';

function ExposeForm() {
  const formData = useExposeStore((state) => state.formData);
  const updateFormField = useExposeStore((state) => state.updateFormField);

  const handleChange = (e) => {
    updateFormField(e.target.name, e.target.value);
  };

  return (
    <div>
      <input
        name="strasse"
        value={formData.strasse}
        onChange={handleChange}
      />
      {/* ... */}
    </div>
  );
}
```

Analog für:
- ImageUpload.jsx
- ExportButtons.jsx
- SavedExposes.jsx

---

### Testing nach Phase B

```bash
npm start

# Test-Checklist:
# 1. ExposeTool öffnen
# 2. Formular ausfüllen
# 3. Exposé generieren
# 4. Speichern
# 5. Page-Reload → Daten sollten persistent sein
# 6. Bild hochladen
# 7. Export als PDF

# Browser-Console öffnen:
# → Redux DevTools Extension → "ExposeStore" sollte sichtbar sein
# → State-Änderungen sollten getrackt werden
```

---

## Sprint 4+: Excellence

**Ziel:** Production-Ready
**Aufwand:** ~80h

**Siehe:** `docs/architecture/REFACTORING-ROADMAP.md` für Details zu:
- TypeScript-Migration
- Testing-Setup
- Performance-Optimization

---

## Testing-Strategie

### Unit-Tests (Services)

**Beispiel: exposeService.test.js**

```javascript
import { describe, it, expect, vi } from 'vitest';
import exposeService from '../services/exposeService';
import apiClient from '../clients/apiClient';

// Mock apiClient
vi.mock('../clients/apiClient');

describe('ExposeService', () => {
  it('sollte Exposé generieren', async () => {
    // Arrange
    const mockResponse = { data: { text: 'Generated expose text' } };
    apiClient.post.mockResolvedValue(mockResponse);

    const formData = {
      objektart: 'Wohnung',
      strasse: 'Hauptstr. 1',
      ort: 'Berlin',
      wohnflaeche: 80,
      zimmer: 3,
      preis: '1500',
    };

    // Act
    const result = await exposeService.generateExpose(formData, 'emotional');

    // Assert
    expect(result).toBe('Generated expose text');
    expect(apiClient.post).toHaveBeenCalledWith(
      '/api/generate-expose',
      expect.objectContaining({ prompt: expect.any(String) })
    );
  });

  it('sollte Fehler bei fehlenden Pflichtfeldern werfen', async () => {
    // Arrange
    const invalidFormData = { objektart: 'Wohnung' }; // Felder fehlen

    // Act & Assert
    await expect(
      exposeService.generateExpose(invalidFormData)
    ).rejects.toThrow('Pflichtfeld fehlt');
  });
});
```

---

## Troubleshooting

### Problem: "Module not found: Can't resolve 'zustand'"

**Lösung:**
```bash
npm install zustand
# Falls immer noch Fehler:
rm -rf node_modules package-lock.json
npm install
```

### Problem: "Infinite Re-Renders mit Zustand"

**Ursache:** Direkter State-Zugriff statt Selector

```jsx
// ❌ Falsch - Re-Render bei JEDER Store-Änderung
const state = useExposeStore();

// ✅ Richtig - Nur bei formData-Änderung
const formData = useExposeStore((state) => state.formData);
```

### Problem: "LocalStorage nicht persistiert"

**Prüfen:**
1. Ist `persist`-Middleware aktiviert?
2. Ist `partialize` korrekt konfiguriert?
3. Browser-DevTools → Application → Local Storage → Eintrag vorhanden?

```javascript
// Debug: Log beim Store-Update
const useExposeStore = create(
  persist(
    (set) => ({
      formData: {},
      setFormData: (data) => {
        console.log('Store-Update:', data);
        set({ formData: data });
      },
    }),
    {
      name: 'maklermate-expose-storage',
      onRehydrateStorage: () => (state) => {
        console.log('Hydrated:', state);
      },
    }
  )
);
```

---

## FAQ

### Q: Muss ich alle Sprints nacheinander machen?

**A:** Nein! Du kannst:
- Sprint 1 alleine machen (Quick Wins)
- Sprint 2-3 aufteilen (erst API-Layer, dann Zustand)
- Sprint 4+ zeitlich verschieben

### Q: Kann ich Redux statt Zustand nutzen?

**A:** Ja, aber:
- Redux Toolkit ist 9x größer (11 KB vs. 1.2 KB)
- Mehr Boilerplate
- Für MaklerMate-Größe ist Zustand besser geeignet

Siehe `docs/architecture/ADR-002` für Details.

### Q: Warum Axios statt Fetch?

**A:**
- Request/Response-Interceptors (für Auto-Auth)
- Einfacherer Timeout
- Bessere Error-Handling
- Siehe `docs/architecture/ADR-003`

### Q: Wann sollte ich zu TypeScript migrieren?

**A:** Nach Sprint 2-3. TypeScript bringt:
- Type-Safety (weniger Bugs)
- Bessere IntelliSense
- Einfachere Refactorings

Aber: Lernkurve + Migrations-Aufwand (~40h)

### Q: Brauche ich wirklich Tests?

**A:** Ja! Tests:
- Verhindern Regressions
- Ermöglichen sicheres Refactoring
- Dokumentieren Verhalten

Ziel: 60% Coverage (Focus auf Services/Utils)

---

## Ressourcen

### Dokumentation

- [CODE-ANALYSIS.md](./architecture/CODE-ANALYSIS.md) - Analyse-Details
- [REFACTORING-ROADMAP.md](./architecture/REFACTORING-ROADMAP.md) - Detaillierte Tasks
- [ADR-001](./architecture/ADR-001-Service-Layer-Pattern.md) - Service-Layer
- [ADR-002](./architecture/ADR-002-Zustand-State-Management.md) - Zustand
- [ADR-003](./architecture/ADR-003-Central-API-Client.md) - API-Client

### Libraries

- [Zustand Docs](https://docs.pmnd.rs/zustand)
- [Axios Docs](https://axios-http.com/)
- [Vitest Docs](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

---

## Support

Bei Fragen oder Problemen:
1. Prüfe Troubleshooting-Section
2. Suche in Dokumentation (ADRs)
3. Erstelle GitHub-Issue mit:
   - Fehlermeldung
   - Code-Snippet
   - Was du bereits versucht hast

---

**Viel Erfolg bei der Migration! 🚀**
