# 🗺️ MaklerMate Refactoring-Roadmap

**Version:** 1.0
**Datum:** 15. November 2025
**Ziel:** Schrittweise Migration von MVP zu Production-Ready Architecture

---

## 📊 Roadmap-Übersicht

```
Sprint 1: Quick Wins (1-2 Wochen, ~20h)
├── Cleanup veralteter Code
├── Sofortige Bug-Fixes
└── Low-Hanging Fruits

Sprint 2-3: Strategic Refactoring (4-6 Wochen, ~60h)
├── API-Layer Neuaufbau
├── Service-Layer einführen
├── State-Management mit Zustand
└── Hook-Refactoring

Sprint 4+: Excellence (8-12 Wochen, ~80h)
├── TypeScript-Migration
├── Testing-Infrastructure
├── Performance-Optimization
└── Monitoring & Observability
```

**Gesamt-Aufwand:** ~160h (ca. 4 Monate bei 10h/Woche)

---

## 🚀 Sprint 1: Quick Wins (1-2 Wochen)

**Ziel:** Sofortige Verbesserungen ohne Breaking Changes
**Aufwand:** ~20h
**ROI:** ⭐⭐⭐⭐⭐

### Task 1.1: CSV-Escaping-Bug fixen (5min) ✅ ERLEDIGT

**Problem:** CSV-Export in `crmExport.js` hat kein Escaping → Namen mit Kommas brechen CSV-Format

**Evidenz:**
```javascript
// ❌ Vorher (src/utils/crmExport.js:29):
const rows = leads.map((l) => `${l.name},${l.email},${l.status}`);
// Bug: Name "Schmidt, Maria" → 4 Spalten statt 3!

// ✅ Nachher:
const rows = leads.map((l) =>
  `"${l.name || ''}","${l.email || ''}","${l.status || ''}"`
);
```

**Begründung:**
- CSV-Injection-Schutz
- Korrekte Darstellung von Sonderzeichen
- Null-Safety

**Acceptance Criteria:**
- [x] CSV-Felder mit Anführungszeichen escapen
- [x] Null-Safety mit `|| ''` Fallback
- [x] Kommentar zur Security

**Aufwand:** 5min
**Status:** ✅ Gefixt am 15.11.2025

---

### Task 1.2: Timeout zu fetchWithAuth hinzufügen (30min)

**Problem:** Fetch-Calls können ewig hängen

**Datei:** `src/utils/fetchWithAuth.js`

**Vorher:**
```javascript
export async function fetchWithAuth(url, options = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;

  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);

  return fetch(url, { ...options, headers });
}
```

**Nachher:**
```javascript
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
  } finally {
    clearTimeout(timeoutId);
  }
}
```

**Acceptance Criteria:**
- [ ] Timeout funktioniert (Test mit langsamem Endpoint)
- [ ] Default-Timeout ist 30s
- [ ] Custom-Timeout kann übergeben werden
- [ ] AbortController wird korrekt bereinigt

**Aufwand:** 30min

---

### Task 1.3: ~~arrayHelpers durch npm-Package ersetzen~~ ❌ ÜBERSPRUNGEN

> **⚠️ KORREKTUR (15.11.2025):**
> Diese Empfehlung wurde als **FALSCH** identifiziert und wird **NICHT** umgesetzt.
>
> **Begründung:**
> - `arrayHelpers.js`: Nur 36 LOC, dependency-free, Pure Logic
> - `array-move` Package: 4.1 KB, zusätzliche Dependency, muss gewartet werden
> - **Kein echter Mehrwert** durch externes Package
> - **Empfehlung:** BEHALTEN

**Acceptance Criteria:**
- [x] Task übersprungen
- [x] arrayHelpers.js bleibt im Projekt

**Aufwand:** 0min (übersprungen)
**Status:** ❌ NICHT umgesetzt

---

### Task 1.4: Doppelte localStorage-Logic entfernen (1h)

**Problem:** ExposeTool + ImageUpload greifen beide direkt auf localStorage zu

**Datei:** `src/components/ImageUpload.jsx`

**Vorher:**
```jsx
const ImageUpload = ({ images, setImages }) => {
  const [captions, setCaptions] = useState([]);

  useEffect(() => {
    const savedImages = localStorage.getItem('maklermate_images');
    const savedCaptions = localStorage.getItem('maklermate_captions');
    // ... manuelles Parsing
  }, []);

  useEffect(() => {
    localStorage.setItem('maklermate_images', JSON.stringify(images));
    localStorage.setItem('maklermate_captions', JSON.stringify(captions));
  }, [images, captions]);
}
```

**Nachher:**
```jsx
import usePersistentImages from '../hooks/usePersistentImages';

const ImageUpload = () => {
  const [images, setImages] = usePersistentImages('maklermate_images');
  const [captions, setCaptions] = usePersistentImages('maklermate_captions');

  // Kein useEffect mehr nötig!
}
```

**Datei:** `src/pages/ExposeTool.jsx`
```jsx
// ❌ Vorher: Direkte localStorage-Nutzung
const [images, setImages] = useState(() => {
  const saved = localStorage.getItem('maklermate_images');
  try {
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
});

// ✅ Nachher: Hook nutzen
import usePersistentImages from '../hooks/usePersistentImages';

const [images, setImages] = usePersistentImages('maklermate_images');
const [captions, setCaptions] = usePersistentImages('maklermate_captions');
```

**Acceptance Criteria:**
- [ ] ExposeTool nutzt usePersistentImages
- [ ] ImageUpload nutzt usePersistentImages
- [ ] Keine direkten localStorage-Calls mehr in Komponenten
- [ ] Persistierung funktioniert

**Aufwand:** 1h

---

### Task 1.5: JSDoc zu kritischen Funktionen (4h)

**Problem:** Keine Dokumentation in Utils/Services

**Beispiel:**
```javascript
/**
 * Generiert ein Immobilien-Exposé via GPT-4o
 *
 * @param {Object} formData - Immobiliendaten
 * @param {string} formData.objektart - Art der Immobilie (Wohnung, Haus, etc.)
 * @param {string} formData.strasse - Straße
 * @param {string} formData.ort - Ort
 * @param {number} formData.wohnflaeche - Wohnfläche in m²
 * @param {number} formData.zimmer - Anzahl Zimmer
 * @param {string} formData.preis - Preis
 * @param {string} style - Stilrichtung ('emotional'|'sachlich'|'luxus')
 * @returns {Promise<string>} Generierter Exposé-Text
 * @throws {Error} Bei API-Fehlern oder Validierung
 */
export async function generateExpose(formData, style = 'emotional') {
  // ...
}
```

**Dateien:**
- Alle Utils (`src/utils/*.js`)
- Alle Hooks (`src/hooks/*.js`)

**Acceptance Criteria:**
- [ ] Alle exportierten Funktionen haben JSDoc
- [ ] Parameter sind dokumentiert
- [ ] Return-Types sind dokumentiert
- [ ] Exceptions sind dokumentiert

**Aufwand:** 4h

---

### Task 1.6: PropTypes zu kritischen Komponenten (4h)

**Problem:** Keine Type-Checks zur Laufzeit

```bash
npm install prop-types
```

**Beispiel:**
```javascript
import PropTypes from 'prop-types';

function ExposeForm({ formData, setFormData, onChange }) {
  // ...
}

ExposeForm.propTypes = {
  formData: PropTypes.shape({
    objektart: PropTypes.string.isRequired,
    strasse: PropTypes.string.isRequired,
    ort: PropTypes.string.isRequired,
    wohnflaeche: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    zimmer: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    preis: PropTypes.string,
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default ExposeForm;
```

**Komponenten (Priorität):**
1. ExposeForm.jsx
2. ImageUpload.jsx
3. ExportButtons.jsx
4. GPTOutputBox.jsx
5. LeadForm.jsx
6. LeadTable.jsx
7. SavedExposes.jsx

**Acceptance Criteria:**
- [ ] PropTypes installiert
- [ ] 10 kritische Komponenten haben PropTypes
- [ ] Warnings in Console bei falschen Props

**Aufwand:** 4h

---

### Task 1.7: Error-Boundaries hinzufügen (2h)

**Problem:** Fehler crashen die ganze App

**Datei:** `src/components/ErrorBoundary.jsx` (NEU)

```jsx
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Optional: Sentry.captureException(error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>⚠️ Etwas ist schiefgelaufen</h2>
          <p>{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })}>
            Erneut versuchen
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

**Datei:** `src/App.js`

```jsx
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        {/* ... */}
      </Router>
    </ErrorBoundary>
  );
}
```

**Acceptance Criteria:**
- [ ] ErrorBoundary-Komponente erstellt
- [ ] In App.js eingebunden
- [ ] Test: Simulierter Fehler wird abgefangen
- [ ] User-freundliche Fehlermeldung

**Aufwand:** 2h

---

### Task 1.8: Environment-Validation (1h)

**Problem:** Fehlende ENV-Variablen führen zu Laufzeitfehlern

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
    throw new Error(
      `Fehlende Environment-Variablen:\n${missing.join('\n')}\n\n` +
      `Bitte .env.local erstellen und Variablen setzen.\n` +
      `Siehe .env.example für Details.`
    );
  }

  console.log('✅ Environment-Variablen validiert');
}
```

**Datei:** `src/index.js`

```javascript
import { validateEnvironment } from './utils/validateEnv';

// Validierung VOR React-Render
try {
  validateEnvironment();
} catch (error) {
  console.error(error.message);
  document.body.innerHTML = `
    <div style="padding: 20px; background: #fee; color: #c00;">
      <h2>⚠️ Konfigurationsfehler</h2>
      <pre>${error.message}</pre>
    </div>
  `;
  throw error;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

**Acceptance Criteria:**
- [ ] Validierung beim App-Start
- [ ] Klare Fehlermeldung bei fehlenden Variablen
- [ ] Kein Silent Failure mehr

**Aufwand:** 1h

---

### Sprint 1 Summary

| Task | Aufwand | Impact |
|------|---------|--------|
| 1.1 Cleanup veralteter Code | 5min | Hoch |
| 1.2 Timeout zu fetchWithAuth | 30min | Hoch |
| 1.3 arrayHelpers → npm | 15min | Niedrig |
| 1.4 Doppelte localStorage-Logic | 1h | Mittel |
| 1.5 JSDoc | 4h | Mittel |
| 1.6 PropTypes | 4h | Hoch |
| 1.7 Error-Boundaries | 2h | Hoch |
| 1.8 Environment-Validation | 1h | Hoch |

**Gesamt:** ~13h (inkl. Testing/Review: ~16h)

**Outcome:** Stabilere App, bessere DX, keine Breaking Changes

---

## 🏗️ Sprint 2-3: Strategic Refactoring (4-6 Wochen)

**Ziel:** Architektur-Grundlagen schaffen
**Aufwand:** ~60h
**ROI:** ⭐⭐⭐⭐⭐

### Phase A: API-Layer (10h)

#### Task 2.1: Zentraler API-Client (2h)

**Ordner erstellen:**
```bash
mkdir -p src/api/clients src/api/services src/api/utils
```

**Datei:** `src/api/clients/apiClient.js`

```javascript
import axios from 'axios';
import { supabase } from '../../lib/supabaseClient';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request-Interceptor: Auto-Auth
apiClient.interceptors.request.use(
  async (config) => {
    const { data } = await supabase.auth.getSession();
    const token = data?.session?.access_token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response-Interceptor: Error-Handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // 401: Session refresh
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;

      const { data } = await supabase.auth.refreshSession();
      if (data?.session?.access_token) {
        error.config.headers.Authorization = `Bearer ${data.session.access_token}`;
        return apiClient(error.config);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
```

**Acceptance Criteria:**
- [ ] Axios installiert
- [ ] API-Client funktioniert
- [ ] Auto-Auth mit Supabase
- [ ] Session-Refresh bei 401

**Aufwand:** 2h

---

#### Task 2.2: Retry-Logic (1h)

**Datei:** `src/api/utils/retry.js`

```javascript
export async function retryWithBackoff(fn, options = {}) {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffFactor = 2,
    retryableStatuses = [408, 429, 500, 502, 503, 504],
    onRetry = null,
  } = options;

  let lastError;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      const status = error.response?.status;
      const isRetryable =
        !status || retryableStatuses.includes(status);

      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }

      const delay = Math.min(
        initialDelay * Math.pow(backoffFactor, attempt),
        maxDelay
      );
      const jitter = Math.random() * 0.3 * delay;
      const actualDelay = delay + jitter;

      if (onRetry) onRetry(attempt + 1, actualDelay, error);

      await new Promise((resolve) => setTimeout(resolve, actualDelay));
    }
  }

  throw lastError;
}

export function withRetry(fn, retryOptions = {}) {
  return (...args) => retryWithBackoff(() => fn(...args), retryOptions);
}
```

**Acceptance Criteria:**
- [ ] Exponential Backoff funktioniert
- [ ] Jitter verhindert Thundering Herd
- [ ] Retryable vs. Non-Retryable Errors

**Aufwand:** 1h

---

#### Task 2.3: Error-Handler (1h)

**Datei:** `src/api/utils/errorHandler.js`

```javascript
import toast from 'react-hot-toast';

export class ApiError extends Error {
  constructor(message, statusCode, originalError = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }
}

export function handleApiError(error) {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    const message =
      data?.error ||
      data?.message ||
      getDefaultErrorMessage(status);

    return new ApiError(message, status, error);
  }

  if (error.request) {
    return new ApiError(
      'Netzwerkfehler. Bitte Internetverbindung prüfen.',
      0,
      error
    );
  }

  return new ApiError(error.message || 'Unbekannter Fehler', 500, error);
}

function getDefaultErrorMessage(statusCode) {
  const messages = {
    400: 'Ungültige Anfrage. Bitte Eingaben prüfen.',
    401: 'Nicht angemeldet. Bitte einloggen.',
    403: 'Zugriff verweigert.',
    404: 'Ressource nicht gefunden.',
    408: 'Anfrage hat zu lange gedauert.',
    429: 'Zu viele Anfragen. Bitte kurz warten.',
    500: 'Serverfehler. Bitte später erneut versuchen.',
    502: 'Server nicht erreichbar.',
    503: 'Service vorübergehend nicht verfügbar.',
  };

  return messages[statusCode] || `Fehler ${statusCode}`;
}

export function showErrorToast(error) {
  const apiError =
    error instanceof ApiError ? error : handleApiError(error);

  toast.error(apiError.message, {
    duration: 5000,
    position: 'top-right',
  });

  if (process.env.NODE_ENV === 'development') {
    console.error('[API Error]', apiError);
  }
}

export async function safeApiCall(apiFunction, options = {}) {
  const {
    onError = showErrorToast,
    onSuccess = null,
    throwError = false,
  } = options;

  try {
    const result = await apiFunction();

    if (onSuccess) onSuccess(result);

    return { data: result, error: null };
  } catch (error) {
    const apiError = handleApiError(error);

    if (onError) onError(apiError);

    if (throwError) throw apiError;

    return { data: null, error: apiError };
  }
}
```

**Acceptance Criteria:**
- [ ] Einheitliche Error-Klasse
- [ ] User-freundliche Error-Messages
- [ ] Toast-Integration
- [ ] safeApiCall-Wrapper funktioniert

**Aufwand:** 1h

---

#### Task 2.4: Validation-Utilities (2h)

**Datei:** `src/api/utils/validation.js`

```javascript
export function validateExposeData(data) {
  const required = ['objektart', 'strasse', 'ort', 'wohnflaeche', 'zimmer', 'preis'];

  for (const field of required) {
    if (!data[field] || String(data[field]).trim() === '') {
      return `Pflichtfeld fehlt: ${field}`;
    }
  }

  if (data.wohnflaeche && (isNaN(data.wohnflaeche) || data.wohnflaeche <= 0)) {
    return 'Wohnfläche muss eine positive Zahl sein';
  }

  if (data.zimmer && (isNaN(data.zimmer) || data.zimmer <= 0)) {
    return 'Zimmeranzahl muss eine positive Zahl sein';
  }

  return null;
}

export function validateExposeResponse(text) {
  if (!text || typeof text !== 'string') {
    throw new Error('Ungültige Response: Text muss ein String sein');
  }

  if (text.length < 50) {
    throw new Error('Exposé-Text zu kurz (min. 50 Zeichen)');
  }

  if (text.length > 5000) {
    throw new Error('Exposé-Text zu lang (max. 5000 Zeichen)');
  }
}

export function validateLeadData(data) {
  if (!data.name || !data.contact) {
    return 'Name und Kontakt sind Pflichtfelder';
  }

  if (data.contact && !isValidEmail(data.contact) && !isValidPhone(data.contact)) {
    return 'Kontakt muss eine gültige E-Mail oder Telefonnummer sein';
  }

  return null;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[\d\s+()-]{7,20}$/.test(phone);
}
```

**Acceptance Criteria:**
- [ ] Validierung für Exposé-Daten
- [ ] Validierung für API-Responses
- [ ] Validierung für Lead-Daten
- [ ] Tests geschrieben

**Aufwand:** 2h

---

#### Task 2.5: Services erstellen (4h)

**Datei:** `src/api/services/exposeService.js`

```javascript
import apiClient from '../clients/apiClient';
import { retryWithBackoff } from '../utils/retry';
import { validateExposeData, validateExposeResponse } from '../utils/validation';

class ExposeService {
  async generateExpose(formData, style = 'emotional') {
    const validationError = validateExposeData(formData);
    if (validationError) {
      throw new Error(`Validierungsfehler: ${validationError}`);
    }

    const prompt = this._buildPrompt(formData, style);

    return retryWithBackoff(
      async () => {
        const response = await apiClient.post('/api/generate-expose', {
          prompt,
        });

        const text = response.data?.text?.trim();
        if (!text) {
          throw new Error('Leere Antwort von API erhalten');
        }

        validateExposeResponse(text);

        return text;
      },
      {
        maxRetries: 2,
        initialDelay: 2000,
        retryableStatuses: [429, 500, 502, 503],
      }
    );
  }

  _buildPrompt(formData, style) {
    const styleHints = {
      emotional: 'Sprich emotional, menschlich, lebendig.',
      sachlich: 'Sprich sachlich, strukturiert, objektiv.',
      luxus: 'Sprich exklusiv, hochwertig, elegant.',
    };

    const styleHint = styleHints[style] || styleHints.emotional;

    return `
Du bist ein erfahrener Immobilienmakler und Textprofi.

${styleHint}

Formuliere einen hochwertigen, zusammenhängenden Exposétext (1–2 Absätze):

- Objektart: ${formData.objektart}
- Adresse: ${formData.strasse}, ${formData.ort}, ${formData.bezirk}
- Wohnfläche: ${formData.wohnflaeche} m²
- Zimmer: ${formData.zimmer}
- Preis: ${formData.preis}
${formData.besonderheiten ? `- Besonderheiten: ${formData.besonderheiten}` : ''}

Vermeide Bulletpoints. Schreibe professionell und ansprechend.
    `.trim();
  }
}

export default new ExposeService();
```

**Datei:** `src/api/services/authService.js`

```javascript
import { supabase } from '../../lib/supabaseClient';
import { handleApiError } from '../utils/errorHandler';

class AuthService {
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return { user: data.user, session: data.session };
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async signUp(email, password) {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) throw error;

      return { user: data.user, session: data.session };
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) throw error;

      return data.session;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateUserMetadata(metadata) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: metadata,
      });

      if (error) throw error;

      return data.user;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export default new AuthService();
```

**Acceptance Criteria:**
- [ ] exposeService erstellt
- [ ] authService erstellt
- [ ] Services nutzen API-Client
- [ ] Error-Handling integriert
- [ ] Validation integriert

**Aufwand:** 4h

---

### Phase B: State-Management mit Zustand (9h)

#### Task 2.6: Zustand installieren & Setup (1h)

```bash
npm install zustand
```

**Ordner erstellen:**
```bash
mkdir src/stores
```

**Acceptance Criteria:**
- [ ] Zustand installiert
- [ ] stores-Ordner erstellt

**Aufwand:** 10min

---

#### Task 2.7: exposeStore erstellen (2h)

**Datei:** `src/stores/exposeStore.js`

```javascript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useExposeStore = create(
  persist(
    (set, get) => ({
      // State
      formData: {
        objektart: '',
        strasse: '',
        ort: '',
        bezirk: '',
        wohnflaeche: '',
        zimmer: '',
        baujahr: '',
        preis: '',
        etage: '',
        balkonTerrasse: '',
        ausstattung: '',
        besonderheiten: '',
      },
      output: '',
      selectedStyle: 'emotional',
      isLoading: false,
      images: [],
      captions: [],
      savedExposes: [],

      // Actions
      setFormData: (data) => set({ formData: data }),

      updateFormField: (field, value) =>
        set((state) => ({
          formData: { ...state.formData, [field]: value },
        })),

      setOutput: (output) => set({ output }),
      setStyle: (style) => set({ selectedStyle: style }),
      setLoading: (loading) => set({ isLoading: loading }),

      // Bilder
      addImage: (image) =>
        set((state) => ({
          images: [...state.images, image],
          captions: [...state.captions, ''],
        })),

      removeImage: (index) =>
        set((state) => ({
          images: state.images.filter((_, i) => i !== index),
          captions: state.captions.filter((_, i) => i !== index),
        })),

      updateCaption: (index, caption) =>
        set((state) => {
          const newCaptions = [...state.captions];
          newCaptions[index] = caption;
          return { captions: newCaptions };
        }),

      // Exposés speichern
      saveExpose: () =>
        set((state) => ({
          savedExposes: [
            ...state.savedExposes,
            {
              id: Date.now(),
              formData: state.formData,
              output: state.output,
              selectedStyle: state.selectedStyle,
              images: state.images,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      deleteExpose: (id) =>
        set((state) => ({
          savedExposes: state.savedExposes.filter((e) => e.id !== id),
        })),

      loadExpose: (expose) =>
        set({
          formData: expose.formData,
          output: expose.output,
          selectedStyle: expose.selectedStyle,
          images: expose.images || [],
        }),

      // Reset
      reset: () =>
        set({
          formData: {
            objektart: '',
            strasse: '',
            ort: '',
            bezirk: '',
            wohnflaeche: '',
            zimmer: '',
            baujahr: '',
            preis: '',
            etage: '',
            balkonTerrasse: '',
            ausstattung: '',
            besonderheiten: '',
          },
          output: '',
          isLoading: false,
        }),
    }),
    {
      name: 'maklermate-expose-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        formData: state.formData,
        savedExposes: state.savedExposes,
        images: state.images,
        captions: state.captions,
      }),
    }
  )
);

export default useExposeStore;
```

**Acceptance Criteria:**
- [ ] Store erstellt
- [ ] Persistierung funktioniert
- [ ] Actions funktionieren
- [ ] DevTools funktionieren

**Aufwand:** 2h

---

#### Task 2.8: crmStore erstellen (2h)

**Datei:** `src/stores/crmStore.js`

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCRMStore = create(
  persist(
    (set) => ({
      leads: [],
      filter: 'alle',
      searchQuery: '',

      addLead: (lead) =>
        set((state) => ({
          leads: [
            ...state.leads,
            {
              ...lead,
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              _v: 2,
            },
          ],
        })),

      updateLead: (id, patch) =>
        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id
              ? { ...l, ...patch, updatedAt: new Date().toISOString() }
              : l
          ),
        })),

      deleteLead: (id) =>
        set((state) => ({
          leads: state.leads.filter((l) => l.id !== id),
        })),

      setFilter: (filter) => set({ filter }),
      setSearchQuery: (query) => set({ searchQuery: query }),

      resetLeads: () => set({ leads: [] }),
    }),
    {
      name: 'maklermate-crm-storage',
    }
  )
);

export default useCRMStore;
```

**Acceptance Criteria:**
- [ ] Store erstellt
- [ ] CRUD-Operationen funktionieren
- [ ] Filtering funktioniert
- [ ] Persistierung funktioniert

**Aufwand:** 2h

---

#### Task 2.9: Komponenten auf Stores migrieren (4h)

**Dateien:**
- `src/pages/ExposeTool.jsx`
- `src/components/ExposeForm.jsx`
- `src/components/ImageUpload.jsx`
- `src/components/ExportButtons.jsx`
- `src/components/SavedExposes.jsx`
- `src/pages/CRM/CRMTool.jsx`
- `src/components/CRM/LeadForm.jsx`
- `src/components/CRM/LeadTable.jsx`

**Beispiel (ExposeTool.jsx):**

**Vorher:**
```jsx
function ExposeTool() {
  const [formData, setFormData] = useState({...});
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // ... 6 State-Variablen

  return (
    <ExposeForm
      formData={formData}
      setFormData={setFormData}
      onChange={handleChange}
    />
  );
}
```

**Nachher:**
```jsx
import useExposeStore from '../stores/exposeStore';

function ExposeTool() {
  const formData = useExposeStore((state) => state.formData);
  const output = useExposeStore((state) => state.output);
  const isLoading = useExposeStore((state) => state.isLoading);

  const { setFormData, setOutput, setLoading } = useExposeStore();

  // Kein Prop-Drilling mehr!
  return <ExposeForm />;
}
```

**Acceptance Criteria:**
- [ ] Alle Exposé-Komponenten nutzen exposeStore
- [ ] Alle CRM-Komponenten nutzen crmStore
- [ ] Kein Prop-Drilling mehr
- [ ] Funktionalität unverändert

**Aufwand:** 4h

---

### Phase C: Hook-Refactoring (12h)

#### Task 2.10: useLocalStorageLeads splitten (6h)

**Problem:** 145 Zeilen, zu viele Verantwortlichkeiten

**Neue Struktur:**
```
src/
├── services/
│   └── LeadsStorageService.js   # Storage-Logic
├── utils/
│   └── leadHelpers.js            # Migration, Normalisierung
└── hooks/
    └── useLeads.js               # React-Integration (vereinfacht)
```

**Datei:** `src/utils/leadHelpers.js`

```javascript
export const STATUS_ENUM = ['neu', 'warm', 'cold', 'vip'];

export function normalizeStatus(status) {
  if (!status || typeof status !== 'string') return 'neu';
  const s = status.toLowerCase();
  return STATUS_ENUM.includes(s) ? s : 'neu';
}

export function toISODate(value) {
  if (!value) return new Date().toISOString();
  if (typeof value === 'string' && value.includes('T')) return value;
  const num = typeof value === 'number' ? value : Date.parse(value);
  return isNaN(num) ? new Date().toISOString() : new Date(num).toISOString();
}

export function createLead(partial = {}) {
  return {
    _v: 2,
    id: partial.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: partial.name || '',
    contact: partial.contact || '',
    type: partial.type || 'mieten',
    status: normalizeStatus(partial.status),
    notes: partial.notes || '',
    createdAt: toISODate(partial.createdAt),
    updatedAt: toISODate(partial.updatedAt || partial.createdAt),
  };
}

export function migrateLead(raw) {
  if (!raw || typeof raw !== 'object') return createLead({});

  if (raw._v === 2) {
    return {
      ...raw,
      status: normalizeStatus(raw.status),
      createdAt: toISODate(raw.createdAt),
      updatedAt: toISODate(raw.updatedAt || raw.createdAt),
      _v: 2,
    };
  }

  return createLead({
    ...raw,
    status: normalizeStatus(raw.status),
    createdAt: toISODate(raw.createdAt),
  });
}
```

**Datei:** `src/services/LeadsStorageService.js`

```javascript
class LeadsStorageService {
  constructor(key = 'mm_crm_leads_v2') {
    this.key = key;
  }

  load() {
    try {
      const saved = localStorage.getItem(this.key);
      if (!saved) return [];

      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  save(leads, debounceMs = 150) {
    if (this.timeoutId) clearTimeout(this.timeoutId);

    this.timeoutId = setTimeout(() => {
      try {
        localStorage.setItem(this.key, JSON.stringify(leads));
      } catch (error) {
        console.error('Failed to save leads:', error);
      }
    }, debounceMs);
  }

  subscribe(callback) {
    const handler = (e) => {
      if (e.key === this.key && e.newValue) {
        try {
          const leads = JSON.parse(e.newValue);
          callback(leads);
        } catch {}
      }
    };

    window.addEventListener('storage', handler);

    return () => window.removeEventListener('storage', handler);
  }
}

export default new LeadsStorageService();
```

**Datei:** `src/hooks/useLeads.js`

```javascript
import { useState, useEffect, useMemo } from 'react';
import leadsStorageService from '../services/LeadsStorageService';
import { migrateLead, createLead } from '../utils/leadHelpers';

export default function useLeads() {
  const [leads, setLeads] = useState(() => {
    const raw = leadsStorageService.load();
    return raw.map(migrateLead);
  });

  // Save on change
  useEffect(() => {
    leadsStorageService.save(leads);
  }, [leads]);

  // Cross-tab sync
  useEffect(() => {
    return leadsStorageService.subscribe((newLeads) => {
      setLeads(newLeads.map(migrateLead));
    });
  }, []);

  const addLead = (partial) => {
    setLeads((prev) => [...prev, createLead(partial)]);
  };

  const updateLead = (id, patch) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id
          ? { ...l, ...patch, updatedAt: new Date().toISOString() }
          : l
      )
    );
  };

  const deleteLead = (id) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const resetLeads = () => {
    setLeads([]);
  };

  return {
    leads,
    addLead,
    updateLead,
    deleteLead,
    resetLeads,
  };
}
```

**Acceptance Criteria:**
- [ ] useLocalStorageLeads gelöscht
- [ ] Neue Struktur funktioniert
- [ ] Alle Tests bestehen
- [ ] Migration korrekt

**Aufwand:** 6h

---

#### Task 2.11: useSavedExposes Anti-Pattern fixen (3h)

**Problem:** `loadExpose` nimmt externe Setter als Parameter

**Datei:** `src/hooks/useSavedExposes.js`

**Vorher:**
```javascript
const loadExpose = (expose, setFormData, setOutput, setSelectedStyle) => {
  if (typeof setFormData === 'function') setFormData(expose.formData);
  if (typeof setOutput === 'function') setOutput(expose.output);
  if (typeof setSelectedStyle === 'function') setSelectedStyle(expose.selectedStyle);
};
```

**Nachher (mit Zustand nicht mehr nötig!):**

Da exposeStore jetzt `loadExpose` selbst hat, kann dieser Hook entfernt werden!

```javascript
// ❌ Hook löschen - Logik ist jetzt in exposeStore

// ✅ Nutzung direkt im Store
const loadExpose = useExposeStore((state) => state.loadExpose);

// Usage
loadExpose(expose);  // Kein externes State-Passing mehr!
```

**Acceptance Criteria:**
- [ ] useSavedExposes.js gelöscht
- [ ] loadExpose-Logic in exposeStore
- [ ] Komponenten aktualisiert

**Aufwand:** 3h

---

#### Task 2.12: useAIHelper zu Service refactoren (3h)

**Datei:** `src/hooks/useExpose.js` (NEU)

```javascript
import { useState } from 'react';
import exposeService from '../api/services/exposeService';
import { safeApiCall, showErrorToast } from '../api/utils/errorHandler';
import toast from 'react-hot-toast';

export function useExpose() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [error, setError] = useState(null);

  const generateExpose = async (formData, style = 'emotional') => {
    setIsGenerating(true);
    setError(null);
    setGeneratedText('');

    const { data, error: apiError } = await safeApiCall(
      () => exposeService.generateExpose(formData, style),
      {
        onError: (err) => {
          setError(err);
          showErrorToast(err);
        },
        onSuccess: (text) => {
          setGeneratedText(text);
          toast.success('Exposé erfolgreich generiert!');
        },
        throwError: false,
      }
    );

    setIsGenerating(false);

    return { data, error: apiError };
  };

  const reset = () => {
    setGeneratedText('');
    setError(null);
  };

  return {
    isGenerating,
    generatedText,
    error,
    generateExpose,
    reset,
  };
}
```

**Datei:** `src/pages/ExposeTool.jsx`

```javascript
import { useExpose } from '../hooks/useExpose';
import useExposeStore from '../stores/exposeStore';

export default function ExposeTool() {
  const formData = useExposeStore((state) => state.formData);
  const selectedStyle = useExposeStore((state) => state.selectedStyle);
  const setOutput = useExposeStore((state) => state.setOutput);

  const { isGenerating, generateExpose } = useExpose();

  const handleGenerate = async () => {
    const { data } = await generateExpose(formData, selectedStyle);
    if (data) {
      setOutput(data);
    }
  };

  return (
    <button onClick={handleGenerate} disabled={isGenerating}>
      {isGenerating ? 'Generiere…' : '🔮 Exposé generieren'}
    </button>
  );
}
```

**Acceptance Criteria:**
- [ ] useAIHelper gelöscht
- [ ] useExpose erstellt
- [ ] exposeService genutzt
- [ ] Error-Handling integriert

**Aufwand:** 3h

---

### Phase D: Utils-Konsolidierung (6h)

#### Task 2.13: PDF-Export konsolidieren (4h)

**Problem:** 3 verschiedene PDF-Export-Implementierungen

**Entscheidung:** Direkter PDF-Aufbau (pdfExportExpose.js-Ansatz) ohne html2canvas

**Begründung:**
- html2canvas ist 300kb schwer
- Direkter Aufbau hat bessere Kontrolle
- jsPDF + jspdf-autotable reichen aus

**Dateien löschen:**
- `src/utils/pdfExport.js`

**Datei:** `src/services/pdfService.js`

```javascript
import jsPDF from 'jspdf';
import 'jspdf-autotable';

class PDFService {
  /**
   * Exportiert Exposé als PDF
   */
  exportExposeAsPDF(formData, output, images = []) {
    const pdf = new jsPDF();

    // Header
    pdf.setFontSize(18);
    pdf.text('Immobilien-Exposé', 15, 15);

    // Adresse
    pdf.setFontSize(12);
    pdf.text(`${formData.strasse}, ${formData.ort}`, 15, 25);

    // Output-Text
    pdf.setFontSize(10);
    const lines = pdf.splitTextToSize(output, 180);
    pdf.text(lines, 15, 35);

    let currentY = 35 + lines.length * 5 + 10;

    // Bilder
    images.forEach((imgData, idx) => {
      if (currentY > 250) {
        pdf.addPage();
        currentY = 20;
      }

      const imgWidth = 120;
      const imgHeight = 80;

      pdf.addImage(imgData, 'JPEG', 45, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 10;
    });

    // Download
    const filename = `Expose_${formData.strasse.replace(/\s/g, '_')}.pdf`;
    pdf.save(filename);
  }

  /**
   * Exportiert Leads als PDF-Tabelle
   */
  exportLeadsAsPDF(leads) {
    const pdf = new jsPDF();

    pdf.setFontSize(16);
    pdf.text('CRM Leads', 15, 15);

    const tableData = leads.map((lead) => [
      lead.name || '-',
      lead.contact || '-',
      lead.type || '-',
      lead.status || '-',
      new Date(lead.createdAt).toLocaleDateString('de-DE'),
    ]);

    pdf.autoTable({
      head: [['Name', 'Kontakt', 'Typ', 'Status', 'Erstellt']],
      body: tableData,
      startY: 25,
      styles: { fontSize: 9 },
      headStyles: { fillColor: [41, 128, 185] },
    });

    const filename = `CRM_Leads_${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(filename);
  }
}

export default new PDFService();
```

**Migrationen:**
- `ExportButtons.jsx` nutzt `pdfService.exportExposeAsPDF`
- `CRMExportLeads.jsx` nutzt `pdfService.exportLeadsAsPDF`

**Acceptance Criteria:**
- [ ] Alte PDF-Utils gelöscht
- [ ] pdfService erstellt
- [ ] Komponenten migriert
- [ ] Bundle-Size reduziert

**Aufwand:** 4h

---

#### Task 2.14: CRM-Export konsolidieren (2h)

**Problem:** 2 verschiedene CRM-Export-Utils

**Dateien löschen:**
- `src/utils/crmExport.js`

**Datei:** `src/services/exportService.js`

```javascript
class ExportService {
  exportLeadsAsJSON(leads) {
    const json = JSON.stringify(leads, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    this._downloadBlob(blob, `CRM_Leads_${Date.now()}.json`);
  }

  exportLeadsAsTXT(leads) {
    const txt = leads
      .map(
        (l) =>
          `${l.name} | ${l.contact} | ${l.type} | ${l.status} | ${new Date(
            l.createdAt
          ).toLocaleDateString()}`
      )
      .join('\n');

    const blob = new Blob([txt], { type: 'text/plain' });
    this._downloadBlob(blob, `CRM_Leads_${Date.now()}.txt`);
  }

  exportLeadsAsCSV(leads) {
    const header = 'Name,Kontakt,Typ,Status,Notizen,Erstellt\n';
    const rows = leads
      .map((l) => {
        const escape = (val) => `"${String(val || '').replace(/"/g, '""')}"`;
        return [
          escape(l.name),
          escape(l.contact),
          escape(l.type),
          escape(l.status),
          escape(l.notes),
          escape(new Date(l.createdAt).toLocaleDateString()),
        ].join(',');
      })
      .join('\n');

    const csv = header + rows;
    const blob = new Blob([csv], { type: 'text/csv' });
    this._downloadBlob(blob, `CRM_Leads_${Date.now()}.csv`);
  }

  async copyLeadsToClipboard(leads) {
    const txt = leads
      .map(
        (l) =>
          `${l.name} | ${l.contact} | ${l.type} | ${l.status} | ${new Date(
            l.createdAt
          ).toLocaleDateString()}`
      )
      .join('\n');

    try {
      await navigator.clipboard.writeText(txt);
      return true;
    } catch (error) {
      console.error('Clipboard copy failed:', error);
      return false;
    }
  }

  _downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export default new ExportService();
```

**Migrationen:**
- `CRMExportLeads.jsx` nutzt `exportService`
- `crmExportLeads.js` löschen

**Acceptance Criteria:**
- [ ] Alte Utils gelöscht
- [ ] exportService erstellt
- [ ] CSV-Escaping korrekt
- [ ] Komponenten migriert

**Aufwand:** 2h

---

### Sprint 2-3 Summary

| Phase | Tasks | Aufwand |
|-------|-------|---------|
| A: API-Layer | 2.1 - 2.5 | 10h |
| B: State-Management | 2.6 - 2.9 | 9h |
| C: Hook-Refactoring | 2.10 - 2.12 | 12h |
| D: Utils-Konsolidierung | 2.13 - 2.14 | 6h |

**Gesamt:** ~37h (inkl. Testing/Review: ~50h)

**Outcome:**
- Saubere API-Layer-Architektur
- Zustand-basiertes State-Management
- Keine Code-Duplikation mehr
- Testbare Services

---

## 🏆 Sprint 4+: Excellence (8-12 Wochen)

**Ziel:** Production-Ready Architecture
**Aufwand:** ~80h
**ROI:** ⭐⭐⭐⭐

### Phase E: TypeScript-Migration (40h)

#### Task 3.1: TypeScript-Setup (1h)
#### Task 3.2: Utils zu TypeScript (8h)
#### Task 3.3: Services zu TypeScript (8h)
#### Task 3.4: Hooks zu TypeScript (4h)
#### Task 3.5: Komponenten zu TypeScript (15h)
#### Task 3.6: Strict Mode aktivieren (4h)

### Phase F: Testing-Infrastructure (24h)

#### Task 3.7: Vitest-Setup (2h)
#### Task 3.8: Utils-Tests (4h)
#### Task 3.9: Service-Tests (6h)
#### Task 3.10: Hook-Tests (4h)
#### Task 3.11: Component-Tests (8h)

### Phase G: Performance (12h)

#### Task 3.12: Code-Splitting (4h)
#### Task 3.13: Lazy-Loading (2h)
#### Task 3.14: Memoization (2h)
#### Task 3.15: Bundle-Size-Optimization (4h)

### Phase H: Monitoring (4h)

#### Task 3.16: Sentry-Setup (2h)
#### Task 3.17: Analytics-Setup (2h)

---

## 📈 Fortschritts-Tracking

### Metriken

| Metrik | Start | Nach Sprint 1 | Nach Sprint 3 | Ziel |
|--------|-------|---------------|---------------|------|
| Code-Quality-Score | 4.3/10 | 6/10 | 8/10 | 9/10 |
| Test-Coverage | 0% | 0% | 40% | 60% |
| Type-Coverage | 0% | 10% | 70% | 90% |
| Bundle-Size | ~800kb | ~750kb | ~500kb | <500kb |
| Lines per Component | ~150 | ~120 | ~80 | <100 |
| API-Response-Time | ~2s | ~1.5s | ~1s | <1s |

---

## 🚦 Decision-Log

Alle Architektur-Entscheidungen sind dokumentiert in:
- `docs/architecture/ADR-001-Service-Layer.md`
- `docs/architecture/ADR-002-Zustand-State-Management.md`
- `docs/architecture/ADR-003-API-Client.md`

---

## 👥 Team & Review

**Code-Review-Prozess:**
1. Feature-Branch erstellen
2. PR erstellen mit Referenz zu Task
3. Mindestens 1 Approval
4. Automatische Tests bestehen
5. Merge to main

**Kontakt:**
Claude Code Analysis Team
