# ADR-001: Service-Layer-Pattern einführen

**Status:** Accepted
**Datum:** 15. November 2025
**Entscheider:** Claude Code Analysis Team
**Tags:** #architecture #patterns #services

---

## Kontext

### Problem

Aktuell ist die Business-Logic in MaklerMate über verschiedene Schichten verteilt:

1. **Hooks** (`useAIHelper.js`) enthalten API-Calls und Business-Logic
2. **Komponenten** (`ImageUpload.jsx`, `ExportButtons.jsx`) führen direkte API-Calls aus
3. **Utils** (`pdfExport.js`, `crmExport.js`) enthalten Business-Funktionen

**Probleme:**

- **Nicht testbar ohne React** - Hooks benötigen React-Testumgebung
- **Tight Coupling** - UI-Komponenten sind direkt an API-Implementierung gekoppelt
- **Code-Duplikation** - Gleiche API-Calls in verschiedenen Komponenten
- **Schwierige Wiederverwendung** - Business-Logic ist an React gebunden

### Beispiel (aktuell)

```javascript
// ❌ useAIHelper.js - Business-Logic in Hook
export default function useAIHelper() {
  const [isLoading, setIsLoading] = useState(false);

  const fetchGPT = async (prompt) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-expose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error(`Fehler: ${res.status}`);

      const data = await res.json();
      return data.text;
    } catch (err) {
      console.error('GPT API Fehler:', err);
      toast.error('GPT-Generierung fehlgeschlagen.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchGPT, isLoading };
}
```

**Probleme:**
- Fetch-Logic ist fest im Hook verdrahtet
- Kann nicht ohne React getestet werden
- Toast-Notification vermischt UI-Feedback mit Business-Logic
- Kein Retry-Mechanismus

---

## Entscheidung

Wir führen ein **Service-Layer-Pattern** ein, um Business-Logic von der React-Schicht zu trennen.

### Architektur

```
src/
├── api/
│   ├── clients/
│   │   ├── apiClient.js          # Zentraler HTTP-Client (Axios)
│   │   └── supabaseClient.js     # Supabase-Client
│   ├── services/
│   │   ├── exposeService.js      # Business-Logic für Exposés
│   │   ├── authService.js        # Business-Logic für Auth
│   │   └── exportService.js      # Business-Logic für Exports
│   └── utils/
│       ├── retry.js              # Retry-Logic
│       ├── errorHandler.js       # Error-Handling
│       └── validation.js         # Request/Response-Validation
└── hooks/
    ├── useExpose.js              # React-Integration (nutzt exposeService)
    ├── useAuth.js                # React-Integration (nutzt authService)
    └── useExport.js              # React-Integration (nutzt exportService)
```

### Prinzipien

1. **Services sind Pure JavaScript** - keine React-Dependencies
2. **Services sind Singletons** - `export default new ExposeService()`
3. **Hooks sind dünne Wrapper** - nur React-State-Management
4. **Klare Separation of Concerns**:
   - Services: Business-Logic, API-Calls, Validation
   - Hooks: React-State, Loading-States, UI-Feedback
   - Components: UI-Rendering, Event-Handling

---

## Implementierung

### Beispiel: Exposé-Service

**`src/api/services/exposeService.js`**

```javascript
import apiClient from '../clients/apiClient';
import { retryWithBackoff } from '../utils/retry';
import { validateExposeData, validateExposeResponse } from '../utils/validation';

class ExposeService {
  /**
   * Generiert Exposé-Text via OpenAI
   * @param {Object} formData - Immobiliendaten
   * @param {string} style - Stilrichtung ('emotional'|'sachlich'|'luxus')
   * @returns {Promise<string>} Generierter Text
   */
  async generateExpose(formData, style = 'emotional') {
    // ✅ Input-Validierung
    const validationError = validateExposeData(formData);
    if (validationError) {
      throw new Error(`Validierungsfehler: ${validationError}`);
    }

    const prompt = this._buildPrompt(formData, style);

    // ✅ Mit Retry-Logic
    return retryWithBackoff(
      async () => {
        const response = await apiClient.post('/api/generate-expose', {
          prompt,
        });

        const text = response.data?.text?.trim();
        if (!text) {
          throw new Error('Leere Antwort von API erhalten');
        }

        // ✅ Response-Validierung
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
    // ... Prompt-Generierung
  }
}

export default new ExposeService();
```

**Vorteile:**
- ✅ Testbar ohne React
- ✅ Wiederverwendbar (könnte in Node.js-Script genutzt werden)
- ✅ Klare Verantwortlichkeiten
- ✅ Kein UI-Code (Toast, Loading)

---

### Beispiel: React-Hook (dünner Wrapper)

**`src/hooks/useExpose.js`**

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

**Verantwortlichkeiten:**
- React-State-Management (`isGenerating`, `generatedText`, `error`)
- UI-Feedback (Toast-Notifications)
- Error-Handling auf UI-Ebene

---

### Beispiel: Komponenten-Nutzung

**`src/pages/ExposeTool.jsx`**

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

**Vorteile:**
- ✅ Komponente ist schlank (nur UI-Logik)
- ✅ Keine direkten API-Calls
- ✅ Testbar durch Service-Mocks

---

## Konsequenzen

### Vorteile

1. **Testbarkeit**
   - Services können mit Jest/Vitest ohne React getestet werden
   - Mock-Setup ist einfacher (nur HTTP-Mocks, keine React-Mocks)

2. **Wiederverwendbarkeit**
   - Services können in verschiedenen Kontexten genutzt werden (Web, CLI, Node.js)
   - Business-Logic ist nicht an React gebunden

3. **Wartbarkeit**
   - Klare Separation of Concerns
   - Änderungen an API-Logic betreffen nur Services, nicht Komponenten
   - Einfacher zu debuggen

4. **Performance**
   - Services sind Singletons (nur eine Instanz)
   - Keine React-Re-Renders bei Service-Calls

5. **Entwickler-Experience**
   - Klare Struktur macht Onboarding einfacher
   - Weniger Verwirrung über "wo gehört dieser Code hin?"

### Nachteile

1. **Mehr Boilerplate**
   - Zusätzliche Dateien (Service + Hook statt nur Hook)
   - Mehr Verzeichnisse

2. **Lernkurve**
   - Team muss Service-Layer-Pattern verstehen
   - Entscheidung "Service vs. Hook" muss klar sein

3. **Indirektion**
   - Ein zusätzlicher Layer zwischen Component und API
   - Kann für einfache Fälle "over-engineering" sein

### Risiken & Mitigationen

| Risiko | Mitigation |
|--------|------------|
| Team nutzt Services nicht konsequent | Code-Review + Linter-Rules + Dokumentation |
| Services werden zu groß | Service-Splitting nach Domain (exposeService, leadService) |
| Hook-Duplikation | Generische Wrapper (useService-Helper) erstellen |

---

## Alternativen

### Alternative 1: Alles in Hooks

**Beschreibung:** Business-Logic bleibt in Hooks, keine Services.

**Vorteile:**
- Weniger Code
- Einfachere Struktur

**Nachteile:**
- Nicht testbar ohne React
- Nicht wiederverwendbar
- Tight Coupling

**Entscheidung:** ❌ Abgelehnt - Testbarkeit ist kritisch

---

### Alternative 2: GraphQL mit Apollo Client

**Beschreibung:** GraphQL-Layer mit Apollo-Client für Data-Fetching.

**Vorteile:**
- Auto-Generated Types
- Caching out-of-the-box
- Optimistic Updates

**Nachteile:**
- Benötigt GraphQL-Server (aktuell REST)
- Großer Overhead für MVP
- Steile Lernkurve

**Entscheidung:** ❌ Abgelehnt - Zu komplex für aktuellen Stand

---

### Alternative 3: TanStack Query (React Query)

**Beschreibung:** React Query für Server-State-Management.

**Vorteile:**
- Caching, Auto-Refetch, Background-Updates
- Große Community
- Reduziert Boilerplate

**Nachteile:**
- Aktuell LocalStorage, kein "Server-State" im klassischen Sinne
- Kann später für Supabase-Migration genutzt werden

**Entscheidung:** ⏳ Später evaluieren (wenn auf Supabase DB migriert wird)

---

## Implementierungs-Plan

### Phase 1: Foundation (Sprint 2, Woche 1)

- [ ] Ordnerstruktur erstellen (`src/api/clients`, `src/api/services`, `src/api/utils`)
- [ ] API-Client erstellen (`apiClient.js`)
- [ ] Error-Handler erstellen (`errorHandler.js`)
- [ ] Retry-Logic erstellen (`retry.js`)
- [ ] Validation-Utils erstellen (`validation.js`)

### Phase 2: Services (Sprint 2, Woche 2)

- [ ] `exposeService.js` erstellen
- [ ] `authService.js` erstellen
- [ ] `exportService.js` erstellen
- [ ] `pdfService.js` erstellen

### Phase 3: Hook-Refactoring (Sprint 2, Woche 3)

- [ ] `useExpose.js` erstellen (ersetzt `useAIHelper.js`)
- [ ] `useAuth.js` refactoren (nutzt `authService`)
- [ ] `useExport.js` erstellen

### Phase 4: Component-Migration (Sprint 2, Woche 4)

- [ ] ExposeTool.jsx auf neue Hooks umstellen
- [ ] Profile.jsx auf authService umstellen
- [ ] AuthContext auf authService umstellen
- [ ] Export-Komponenten auf exportService umstellen

### Phase 5: Cleanup (Sprint 2, Woche 4)

- [ ] `useAIHelper.js` löschen
- [ ] Alte Utils löschen (`pdfExport.js`, `crmExport.js`)
- [ ] Tests schreiben

---

## Erfolgs-Metriken

| Metrik | Vorher | Nachher | Ziel |
|--------|--------|---------|------|
| Testbare Business-Logic | 0% | 80% | 100% |
| Lines-per-Hook | ~40 | ~20 | <30 |
| API-Calls in Components | 5 | 0 | 0 |
| Code-Duplikation (API-Calls) | 3x | 0x | 0x |

---

## Referenzen

- [Clean Architecture (Robert C. Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Separation of Concerns](https://en.wikipedia.org/wiki/Separation_of_concerns)
- [Service Layer Pattern](https://martinfowler.com/eaaCatalog/serviceLayer.html)

---

## Änderungshistorie

| Datum | Version | Änderung |
|-------|---------|----------|
| 15.11.2025 | 1.0 | Initial draft |
