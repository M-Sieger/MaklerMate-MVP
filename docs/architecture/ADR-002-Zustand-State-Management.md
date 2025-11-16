# ADR-002: Zustand für globales State-Management

**Status:** Accepted
**Datum:** 15. November 2025
**Entscheider:** Claude Code Analysis Team
**Tags:** #state-management #zustand #architecture

---

## Kontext

### Problem

Aktuelles State-Management in MaklerMate:

1. **Lokaler State überall**
   - ExposeTool.jsx: 6 useState-Variablen
   - Unübersichtlich, schwer zu maintainen

2. **Prop-Drilling**
   ```jsx
   // ExposeTool → ExposeForm → Unterkomponenten
   <ExposeForm formData={formData} setFormData={setFormData} onChange={handleChange} />
   ```
   - Props durch 2-3 Ebenen
   - Anfällig für Wachstum

3. **Doppelte localStorage-Logic**
   ```jsx
   // ExposeTool.jsx
   const [images, setImages] = useState(() => {
     const saved = localStorage.getItem('maklermate_images');
     return saved ? JSON.parse(saved) : [];
   });

   // ImageUpload.jsx - DIESELBE LOGIC!
   useEffect(() => {
     const savedImages = localStorage.getItem('maklermate_images');
     // ...
   }, []);
   ```

4. **Fehlende globale State-Strukturen**
   - Exposé-Daten sollten global sein (werden in mehreren Komponenten genutzt)
   - CRM-Leads sollten global sein
   - Aktuell: Nur AuthContext (gut), Rest lokal

### Anforderungen

1. **Kein Prop-Drilling** - Komponenten sollen direkt auf State zugreifen
2. **Persistierung** - LocalStorage-Integration out-of-the-box
3. **DevTools** - Debugging-Support
4. **Performance** - Keine unnötigen Re-Renders
5. **TypeScript-Ready** - Für zukünftige Migration
6. **Kleine Bundle-Size** - App soll schnell laden
7. **Einfache API** - Geringe Lernkurve

---

## Entscheidung

Wir nutzen **Zustand** als globales State-Management-System.

### Warum Zustand?

| Feature | Zustand | Redux Toolkit | Jotai | MobX | Context API |
|---------|---------|---------------|-------|------|-------------|
| **Bundle-Size** | 1.2 KB | 11 KB | 2.9 KB | 16 KB | 0 KB (built-in) |
| **Boilerplate** | Minimal | Mittel | Minimal | Gering | Hoch |
| **DevTools** | ✅ | ✅ | ✅ | ✅ | ❌ |
| **TypeScript** | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Middleware** | ✅ (persist) | ✅ | ⚠️ | ⚠️ | ❌ |
| **Lernkurve** | Gering | Hoch | Mittel | Mittel | Gering |
| **Performance** | Sehr gut | Gut | Sehr gut | Sehr gut | Mittel |
| **Prop-Drilling** | Vermieden | Vermieden | Vermieden | Vermieden | Vermieden |

**Entscheidungskriterien:**

1. **Bundle-Size** - Zustand ist mit 1.2 KB am kleinsten (außer Context API)
2. **Einfache API** - Weniger Boilerplate als Redux
3. **Persist-Middleware** - LocalStorage-Integration out-of-the-box
4. **Performance** - Selektive Subscriptions verhindern unnötige Re-Renders
5. **DevTools** - Debugging-Support vorhanden

---

## Implementierung

### Installation

```bash
npm install zustand
```

### Store-Struktur

```
src/
└── stores/
    ├── exposeStore.js    # Exposé-bezogener State
    ├── crmStore.js       # CRM/Leads-bezogener State
    └── uiStore.js        # UI-State (optional)
```

---

### Beispiel 1: exposeStore

**`src/stores/exposeStore.js`**

```javascript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useExposeStore = create(
  persist(
    (set, get) => ({
      // ========== STATE ==========
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

      // ========== ACTIONS ==========
      setFormData: (data) => set({ formData: data }),

      updateFormField: (field, value) =>
        set((state) => ({
          formData: { ...state.formData, [field]: value },
        })),

      setOutput: (output) => set({ output }),
      setStyle: (style) => set({ selectedStyle: style }),
      setLoading: (loading) => set({ isLoading: loading }),

      // Bilder-Management
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
      // ========== PERSISTIERUNG ==========
      name: 'maklermate-expose-storage',
      storage: createJSONStorage(() => localStorage),
      // Nur diese Felder persistieren
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

**Features:**
- ✅ Alle Exposé-bezogenen States zentral
- ✅ Automatische LocalStorage-Persistierung
- ✅ Selektive Persistierung (nur relevante Felder)
- ✅ Actions für State-Updates

---

### Beispiel 2: Komponenten-Nutzung

**Vorher (Prop-Drilling):**

```jsx
// ❌ ExposeTool.jsx
function ExposeTool() {
  const [formData, setFormData] = useState({...});
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <ExposeForm
        formData={formData}
        setFormData={setFormData}
        onChange={handleChange}
      />
      <ImageUpload
        images={images}
        setImages={setImages}
      />
      <ExportButtons
        formData={formData}
        output={output}
        selectedStyle={selectedStyle}
      />
    </>
  );
}

// ❌ ExposeForm.jsx - Empfängt Props von Parent
function ExposeForm({ formData, setFormData, onChange }) {
  return (
    <input
      name="strasse"
      value={formData.strasse}
      onChange={onChange}
    />
  );
}
```

**Nachher (Zustand):**

```jsx
// ✅ ExposeTool.jsx - Keine Props mehr
import useExposeStore from '../stores/exposeStore';

function ExposeTool() {
  // Selektive Subscriptions - nur Re-Render bei Änderung
  const isLoading = useExposeStore((state) => state.isLoading);

  return (
    <>
      <ExposeForm />
      <ImageUpload />
      <ExportButtons />
    </>
  );
}

// ✅ ExposeForm.jsx - Direkter Store-Zugriff
import useExposeStore from '../stores/exposeStore';

function ExposeForm() {
  const formData = useExposeStore((state) => state.formData);
  const updateFormField = useExposeStore((state) => state.updateFormField);

  const handleChange = (e) => {
    updateFormField(e.target.name, e.target.value);
  };

  return (
    <input
      name="strasse"
      value={formData.strasse}
      onChange={handleChange}
    />
  );
}
```

**Vorteile:**
- ✅ Kein Prop-Drilling
- ✅ Komponenten sind entkoppelt
- ✅ Weniger Code
- ✅ Einfacher zu refactoren

---

### Beispiel 3: Selektive Subscriptions (Performance)

```jsx
// ❌ Schlecht - Re-Render bei JEDER Store-Änderung
function Component() {
  const state = useExposeStore();  // Kompletter State
  return <div>{state.formData.strasse}</div>;
}

// ✅ Gut - Re-Render nur wenn formData.strasse ändert
function Component() {
  const strasse = useExposeStore((state) => state.formData.strasse);
  return <div>{strasse}</div>;
}

// ✅ Sehr gut - Mehrere selektive Subscriptions
function Component() {
  const { strasse, ort } = useExposeStore((state) => ({
    strasse: state.formData.strasse,
    ort: state.formData.ort,
  }));
  return <div>{strasse}, {ort}</div>;
}
```

---

### Beispiel 4: DevTools

```javascript
// Zustand DevTools aktivieren
import { devtools } from 'zustand/middleware';

const useExposeStore = create(
  devtools(
    persist(
      (set) => ({
        // ... store definition
      }),
      { name: 'maklermate-expose-storage' }
    ),
    { name: 'ExposeStore' }  // Name in DevTools
  )
);
```

**Chrome Extension:** [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/)

**Features:**
- Time-Travel Debugging
- State-Inspektion
- Action-History

---

## Konsequenzen

### Vorteile

1. **Kein Prop-Drilling**
   - Komponenten können direkt auf State zugreifen
   - Weniger Boilerplate-Code

2. **Automatische Persistierung**
   - LocalStorage-Integration via Middleware
   - Kein manuelles useEffect mehr nötig

3. **Performance**
   - Selektive Subscriptions verhindern unnötige Re-Renders
   - Besser als Context API (alle Consumer re-rendern bei Änderung)

4. **Developer-Experience**
   - DevTools-Support
   - Einfache API (weniger Konzepte als Redux)
   - TypeScript-Ready

5. **Wartbarkeit**
   - Zentraler State ist einfacher zu überblicken
   - Weniger State-Duplikation

6. **Bundle-Size**
   - Nur 1.2 KB zusätzlich

### Nachteile

1. **Zusätzliche Dependency**
   - Eine weitere Library im Projekt

2. **Globaler State kann missbraucht werden**
   - Nicht ALLES sollte global sein
   - Lokaler State ist manchmal besser (z.B. Modal open/closed)

3. **Migration-Aufwand**
   - Bestehende Komponenten müssen angepasst werden
   - ~10-15h für vollständige Migration

### Best Practices

1. **Store-Splitting**
   ```javascript
   // ✅ Gut - Stores nach Domain aufteilen
   - exposeStore.js  (Exposé-bezogen)
   - crmStore.js     (CRM-bezogen)
   - uiStore.js      (UI-State wie Sidebar open/closed)

   // ❌ Schlecht - Ein Mega-Store für alles
   - appStore.js     (ALLES drin)
   ```

2. **Lokaler vs. Globaler State**
   ```javascript
   // ✅ Global - State der von mehreren Komponenten genutzt wird
   - formData (ExposeTool, ExposeForm, ExportButtons)
   - savedExposes (SavedExposes, ExposeTool)
   - leads (CRMTool, LeadTable, LeadForm)

   // ✅ Lokal - State nur in einer Komponente relevant
   - isModalOpen (nur Modal-Komponente)
   - inputFocus (nur Input-Komponente)
   ```

3. **Actions vs. Direct Set**
   ```javascript
   // ✅ Gut - Actions für komplexe Logic
   addLead: (partial) => set((state) => ({
     leads: [...state.leads, createLead(partial)]
   })),

   // ✅ Auch gut - Direct set für einfache Updates
   setLoading: (loading) => set({ isLoading: loading }),
   ```

4. **Persistierung**
   ```javascript
   // ✅ Gut - Nur relevante Daten persistieren
   partialize: (state) => ({
     formData: state.formData,
     savedExposes: state.savedExposes,
   }),

   // ❌ Schlecht - Transiente States persistieren
   partialize: (state) => ({
     ...state,  // isLoading auch persistiert!
   }),
   ```

---

## Alternativen

### Alternative 1: Context API (aktuell für Auth)

**Vorteile:**
- Built-in, keine Dependency
- Einfach für kleine Use-Cases

**Nachteile:**
- Alle Consumer re-rendern bei Änderung (Performance)
- Kein DevTools-Support
- Viel Boilerplate für komplexe Stores
- Keine Persistierung out-of-the-box

**Entscheidung:** ✅ Context API für Auth behalten, Zustand für Rest

---

### Alternative 2: Redux Toolkit

**Vorteile:**
- Große Community
- Viele Middlewares
- DevTools-Support

**Nachteile:**
- 11 KB Bundle-Size (9x größer als Zustand)
- Mehr Boilerplate (Actions, Reducers, Slices)
- Steile Lernkurve

**Entscheidung:** ❌ Zu komplex für MaklerMate-Größe

---

### Alternative 3: Jotai (Atomic State)

**Vorteile:**
- Atomic State (sehr granular)
- TypeScript-first
- 2.9 KB Bundle-Size

**Nachteile:**
- Anderes Konzept (Atoms statt Stores)
- Weniger etabliert als Zustand
- Kein Persist-Middleware out-of-the-box

**Entscheidung:** ❌ Zustand ist etablierter und hat Persist-Middleware

---

### Alternative 4: MobX

**Vorteile:**
- Reactive (automatische Updates)
- Object-oriented

**Nachteile:**
- 16 KB Bundle-Size
- Decorators-Syntax (komplexer)
- Magical (schwer zu debuggen)

**Entscheidung:** ❌ Zu komplex, zu groß

---

## Migrations-Plan

### Phase 1: Setup (1h)

- [ ] `npm install zustand`
- [ ] `src/stores/` Ordner erstellen

### Phase 2: Stores erstellen (4h)

- [ ] `exposeStore.js` erstellen
- [ ] `crmStore.js` erstellen

### Phase 3: Komponenten migrieren (4h)

**Exposé-Feature:**
- [ ] ExposeTool.jsx
- [ ] ExposeForm.jsx
- [ ] ImageUpload.jsx
- [ ] ExportButtons.jsx
- [ ] SavedExposes.jsx

**CRM-Feature:**
- [ ] CRMTool.jsx
- [ ] LeadForm.jsx
- [ ] LeadTable.jsx

### Phase 4: Cleanup (1h)

- [ ] Doppelte localStorage-Logic entfernen
- [ ] useSavedExposes.js löschen (nicht mehr nötig)
- [ ] Tests aktualisieren

---

## Erfolgs-Metriken

| Metrik | Vorher | Nachher | Ziel |
|--------|--------|---------|------|
| ExposeTool State-Variablen | 6 | 1 (Store) | <2 |
| Prop-Drilling Ebenen | 2-3 | 0 | 0 |
| localStorage-Duplikation | 2x | 0 | 0 |
| Bundle-Size Increase | - | +1.2 KB | <5 KB |
| Code-Zeilen ExposeTool | ~165 | ~80 | <100 |

---

## Referenzen

- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Zustand vs Redux](https://blog.logrocket.com/zustand-vs-redux/)
- [React State Management in 2024](https://kentcdodds.com/blog/application-state-management-with-react)

---

## Änderungshistorie

| Datum | Version | Änderung |
|-------|---------|----------|
| 15.11.2025 | 1.0 | Initial draft |
| 15.11.2025 | 1.1 | Implementierung abgeschlossen: Stores in TypeScript (`crmStore.ts`, `exposeStore.ts`) mit vollständiger Typisierung |
