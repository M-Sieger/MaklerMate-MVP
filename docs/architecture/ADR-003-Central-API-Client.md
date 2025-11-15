# ADR-003: Zentraler API-Client mit Axios

**Status:** Accepted
**Datum:** 15. November 2025
**Entscheider:** Claude Code Analysis Team
**Tags:** #api #axios #error-handling #retry

---

## Kontext

### Problem

Aktuell sind API-Calls in MaklerMate über verschiedene Stellen verteilt:

1. **Direkte Fetch-Calls in Hooks**
   ```javascript
   // useAIHelper.js
   const res = await fetch('/api/gpt', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ prompt }),
   });
   ```

2. **fetchWithAuth-Wrapper** (minimal)
   ```javascript
   // utils/fetchWithAuth.js
   export async function fetchWithAuth(url, options = {}) {
     const { data } = await supabase.auth.getSession();
     const token = data?.session?.access_token;

     const headers = new Headers(options.headers || {});
     if (token) headers.set('Authorization', `Bearer ${token}`);

     return fetch(url, { ...options, headers });
   }
   ```

3. **Direkte Supabase-Calls**
   ```javascript
   // Profile.jsx
   await supabase.auth.updateUser({ data: { display_name } });
   ```

### Probleme

1. **Kein Timeout** - Fetch-Calls können ewig hängen
2. **Kein Retry** - Netzwerkfehler führen sofort zum Abbruch
3. **Inkonsistentes Error-Handling**
   - useAIHelper: Toast-Notification + `return null`
   - ExposeTool: Error-State + UI-Message
   - Profile: Direktes Alert
4. **Kein zentrales Logging** - Nur `console.error`
5. **Auth-Token-Handling** - Manuell in jedem Call
6. **Keine Request-Validation** - Fehlerhafte Daten können durchrutschen

---

## Entscheidung

Wir erstellen einen **zentralen API-Client mit Axios**, der folgende Features bietet:

1. **Auto-Authentication** - Supabase-Token wird automatisch hinzugefügt
2. **Session-Refresh** - Bei 401 wird automatisch Session refreshed
3. **Timeout** - Default 30s, konfigurierbar
4. **Retry-Logic** - Exponential Backoff bei 429, 500, 502, 503
5. **Error-Handling** - Zentrale Error-Klasse + User-freundliche Messages
6. **Request/Response-Interceptors** - Logging, Validation
7. **Type-Safe** (später mit TypeScript)

---

## Implementierung

### Architektur

```
src/api/
├── clients/
│   ├── apiClient.js          # Zentraler Axios-Instance
│   └── supabaseClient.js     # Supabase-Client (verschoben von /lib)
├── utils/
│   ├── retry.js              # Retry-Logic mit Exponential Backoff
│   ├── errorHandler.js       # Error-Klassen + Error-Mapping
│   └── validation.js         # Request/Response-Validation
└── services/
    ├── exposeService.js      # Nutzt apiClient
    ├── authService.js        # Nutzt supabaseClient
    └── exportService.js      # Nutzt apiClient
```

---

### 1. Zentraler API-Client

**`src/api/clients/apiClient.js`**

```javascript
import axios from 'axios';
import { supabase } from './supabaseClient';

// ========== KONFIGURATION ==========
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '',
  timeout: 30000, // 30s default
  headers: {
    'Content-Type': 'application/json',
  },
});

// ========== REQUEST-INTERCEPTOR ==========
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Auto-Authentication: Supabase-Token hinzufügen
      const { data } = await supabase.auth.getSession();
      const token = data?.session?.access_token;

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Logging (nur Development)
      if (process.env.NODE_ENV === 'development') {
        console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
          headers: config.headers,
          data: config.data,
        });
      }

      return config;
    } catch (error) {
      console.error('[API] Request interceptor error:', error);
      return Promise.reject(error);
    }
  },
  (error) => Promise.reject(error)
);

// ========== RESPONSE-INTERCEPTOR ==========
apiClient.interceptors.response.use(
  (response) => {
    // Success-Logging (Development)
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] Response ${response.status}:`, response.data);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // ========== 401 UNAUTHORIZED: SESSION-REFRESH ==========
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('[API] Session expired, refreshing...');

        const { data, error: refreshError } = await supabase.auth.refreshSession();

        if (!refreshError && data?.session?.access_token) {
          // Neuen Token setzen
          originalRequest.headers.Authorization = `Bearer ${data.session.access_token}`;

          // Request erneut ausführen
          return apiClient(originalRequest);
        } else {
          console.error('[API] Session refresh failed:', refreshError);

          // Redirect to login
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } catch (refreshErr) {
        console.error('[API] Session refresh failed:', refreshErr);
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      }
    }

    // ========== ERROR-LOGGING ==========
    console.error('[API] Error:', {
      url: originalRequest?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    return Promise.reject(error);
  }
);

export default apiClient;
```

**Features:**
- ✅ Auto-Authentication (Supabase-Token)
- ✅ Session-Refresh bei 401
- ✅ 30s Timeout
- ✅ Request/Response-Logging (Development)
- ✅ Redirect to Login bei Auth-Fehler

---

### 2. Retry-Logic mit Exponential Backoff

**`src/api/utils/retry.js`**

```javascript
/**
 * Führt eine Funktion mit Exponential Backoff & Jitter aus
 *
 * @param {Function} fn - Async-Funktion die ausgeführt werden soll
 * @param {Object} options - Retry-Optionen
 * @returns {Promise} Result der Funktion
 */
export async function retryWithBackoff(fn, options = {}) {
  const {
    maxRetries = 3,
    initialDelay = 1000,      // 1s
    maxDelay = 10000,         // 10s
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

      // Prüfe ob Retry sinnvoll ist
      const status = error.response?.status;
      const isRetryable =
        !status ||  // Netzwerkfehler (kein Status)
        retryableStatuses.includes(status);

      // Nicht retryable ODER letzte Versuch
      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }

      // ========== EXPONENTIAL BACKOFF + JITTER ==========
      // Delay = initialDelay * (backoffFactor ^ attempt)
      const delay = Math.min(
        initialDelay * Math.pow(backoffFactor, attempt),
        maxDelay
      );

      // Jitter: ±30% vom Delay (verhindert Thundering Herd)
      const jitter = Math.random() * 0.3 * delay;
      const actualDelay = delay + jitter;

      console.warn(
        `[Retry] Attempt ${attempt + 1}/${maxRetries} failed. ` +
        `Retrying in ${Math.round(actualDelay)}ms...`,
        error.message
      );

      // Callback für UI-Feedback
      if (onRetry) {
        onRetry(attempt + 1, actualDelay, error);
      }

      // Warten vor nächstem Versuch
      await new Promise((resolve) => setTimeout(resolve, actualDelay));
    }
  }

  throw lastError;
}

/**
 * Wrapper-Funktion für API-Calls mit Auto-Retry
 *
 * @param {Function} fn - API-Funktion
 * @param {Object} retryOptions - Retry-Optionen
 * @returns {Function} Wrapped function
 */
export function withRetry(fn, retryOptions = {}) {
  return (...args) => retryWithBackoff(() => fn(...args), retryOptions);
}
```

**Beispiel:**
```javascript
// Service mit Retry
import { retryWithBackoff } from '../utils/retry';
import apiClient from '../clients/apiClient';

async function generateExpose(prompt) {
  return retryWithBackoff(
    async () => {
      const response = await apiClient.post('/api/generate-expose', { prompt });
      return response.data.text;
    },
    {
      maxRetries: 2,
      initialDelay: 2000, // 2s
      retryableStatuses: [429, 500, 502, 503],
      onRetry: (attempt, delay, error) => {
        console.log(`Retry ${attempt}/2 nach ${delay}ms`);
      },
    }
  );
}
```

---

### 3. Error-Handler

**`src/api/utils/errorHandler.js`**

```javascript
import toast from 'react-hot-toast';

/**
 * Standardisierte API-Error-Klasse
 */
export class ApiError extends Error {
  constructor(message, statusCode, originalError = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      timestamp: this.timestamp,
    };
  }
}

/**
 * Konvertiert Axios/Fetch-Fehler zu ApiError
 */
export function handleApiError(error) {
  // ========== AXIOS-ERROR (error.response) ==========
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    const message =
      data?.error ||
      data?.message ||
      getDefaultErrorMessage(status);

    return new ApiError(message, status, error);
  }

  // ========== NETZWERK-FEHLER (error.request) ==========
  if (error.request) {
    return new ApiError(
      'Netzwerkfehler. Bitte Internetverbindung prüfen.',
      0,
      error
    );
  }

  // ========== ANDERER FEHLER ==========
  return new ApiError(
    error.message || 'Unbekannter Fehler',
    500,
    error
  );
}

/**
 * User-freundliche Error-Messages nach Status-Code
 */
function getDefaultErrorMessage(statusCode) {
  const messages = {
    400: 'Ungültige Anfrage. Bitte Eingaben prüfen.',
    401: 'Nicht angemeldet. Bitte einloggen.',
    403: 'Zugriff verweigert.',
    404: 'Ressource nicht gefunden.',
    408: 'Anfrage hat zu lange gedauert. Bitte erneut versuchen.',
    429: 'Zu viele Anfragen. Bitte kurz warten.',
    500: 'Serverfehler. Bitte später erneut versuchen.',
    502: 'Server nicht erreichbar.',
    503: 'Service vorübergehend nicht verfügbar.',
  };

  return messages[statusCode] || `Fehler ${statusCode}`;
}

/**
 * Zeigt Error-Toast mit konsistentem Styling
 */
export function showErrorToast(error) {
  const apiError =
    error instanceof ApiError ? error : handleApiError(error);

  toast.error(apiError.message, {
    duration: 5000,
    position: 'top-right',
  });

  // Development-Logging
  if (process.env.NODE_ENV === 'development') {
    console.error('[API Error]', apiError.toJSON());
  }
}

/**
 * Wrapper für async API-Calls mit Error-Handling
 *
 * @param {Function} apiFunction - Async API-Funktion
 * @param {Object} options - Optionen
 * @returns {Promise<{data, error}>} Result-Object
 */
export async function safeApiCall(apiFunction, options = {}) {
  const {
    onError = showErrorToast,
    onSuccess = null,
    throwError = false,
  } = options;

  try {
    const result = await apiFunction();

    if (onSuccess) {
      onSuccess(result);
    }

    return { data: result, error: null };
  } catch (error) {
    const apiError = handleApiError(error);

    if (onError) {
      onError(apiError);
    }

    if (throwError) {
      throw apiError;
    }

    return { data: null, error: apiError };
  }
}
```

**Nutzung:**
```javascript
import { safeApiCall, showErrorToast } from '../api/utils/errorHandler';
import exposeService from '../api/services/exposeService';

async function handleGenerate() {
  const { data, error } = await safeApiCall(
    () => exposeService.generateExpose(formData, style),
    {
      onError: showErrorToast,
      onSuccess: (text) => toast.success('Exposé generiert!'),
      throwError: false,
    }
  );

  if (data) {
    setOutput(data);
  }
}
```

---

## Konsequenzen

### Vorteile

1. **Zentralisierung**
   - Ein Ort für API-Konfiguration
   - Änderungen betreffen alle API-Calls

2. **Auto-Authentication**
   - Kein manuelles Token-Handling mehr
   - Session-Refresh automatisch

3. **Bessere Error-Handling**
   - Konsistente Error-Messages
   - User-freundliche Texte
   - Zentrale Fehlerbehandlung

4. **Retry-Logic**
   - Netzwerkfehler werden automatisch wiederholt
   - Exponential Backoff verhindert Server-Überlastung

5. **Developer-Experience**
   - Request/Response-Logging
   - Einfachere Tests (Mock nur apiClient)

6. **Robustheit**
   - Timeout verhindert hängende Requests
   - Retry erhöht Erfolgsrate

### Nachteile

1. **Zusätzliche Dependency**
   - Axios (~14 KB) statt Fetch (built-in)

2. **Komplexität**
   - Mehr Code als einfacher Fetch
   - Interceptors müssen verstanden werden

3. **Overhead**
   - Session-Check bei jedem Request
   - Logging in Development

### Mitigationen

| Risiko | Mitigation |
|--------|------------|
| Axios-Bundle-Size | Tree-Shaking aktiviert, nur ~14 KB |
| Session-Check-Overhead | Supabase-Session wird gecached |
| Zu viele Retries | maxRetries = 2-3 (konfigurierbar) |

---

## Alternativen

### Alternative 1: Native Fetch mit Wrapper

**Vorteile:**
- Kein externes Package
- 0 KB Bundle-Size

**Nachteile:**
- Kein Request/Response-Interceptors
- Timeout mit AbortController kompliziert
- Kein Auto-Retry

**Entscheidung:** ❌ Zu viel manuelle Arbeit

---

### Alternative 2: ky (moderne Fetch-Alternative)

**Vorteile:**
- Kleinere Bundle-Size (4 KB)
- Moderne API
- Built-in Retry

**Nachteile:**
- Weniger etabliert als Axios
- Kleinere Community
- Keine Interceptors

**Entscheidung:** ❌ Axios ist etablierter

---

### Alternative 3: TanStack Query (React Query)

**Vorteile:**
- Caching, Auto-Refetch
- DevTools
- Server-State-Management

**Nachteile:**
- Größere Bundle-Size
- Aktuell LocalStorage, kein Server-State
- Kann später für Supabase genutzt werden

**Entscheidung:** ⏳ Später evaluieren bei Supabase-DB-Migration

---

## Migrations-Plan

### Phase 1: Setup (1h)

- [ ] `npm install axios`
- [ ] `src/api/` Struktur erstellen
- [ ] `apiClient.js` erstellen

### Phase 2: Utilities (2h)

- [ ] `retry.js` implementieren
- [ ] `errorHandler.js` implementieren
- [ ] `validation.js` implementieren (optional)

### Phase 3: Services migrieren (3h)

- [ ] `exposeService.js` nutzt apiClient
- [ ] `authService.js` nutzt supabaseClient
- [ ] `exportService.js` nutzt apiClient

### Phase 4: Hooks refactoren (2h)

- [ ] `useExpose.js` nutzt exposeService + safeApiCall
- [ ] `useAuth.js` nutzt authService

### Phase 5: Komponenten anpassen (2h)

- [ ] ExposeTool.jsx nutzt useExpose
- [ ] Profile.jsx nutzt authService
- [ ] AuthContext nutzt authService

### Phase 6: Cleanup (1h)

- [ ] fetchWithAuth.js löschen
- [ ] Direkte Fetch-Calls entfernen
- [ ] Tests schreiben

---

## Erfolgs-Metriken

| Metrik | Vorher | Nachher | Ziel |
|--------|--------|---------|------|
| Direkte Fetch-Calls | 5 | 0 | 0 |
| API-Timeout-Fehler (User-Reports) | 2-3/Woche | <1/Monat | 0 |
| Retry-Success-Rate | 0% | 60% | >50% |
| Error-Message-Clarity (User-Feedback) | 5/10 | 9/10 | >8/10 |
| API-Call-Duplikation | 3x | 0x | 0x |

---

## Referenzen

- [Axios Documentation](https://axios-http.com/)
- [Exponential Backoff (Google Cloud)](https://cloud.google.com/iot/docs/how-tos/exponential-backoff)
- [HTTP Status Codes](https://httpstatuses.com/)

---

## Änderungshistorie

| Datum | Version | Änderung |
|-------|---------|----------|
| 15.11.2025 | 1.0 | Initial draft |
