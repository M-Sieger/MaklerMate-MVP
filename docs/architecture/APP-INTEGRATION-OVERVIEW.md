# App Integration Overview

**Letzte Aktualisierung:** 16. November 2025
**Zweck:** Technische Dokumentation zur Integration dieser Engine in die SaaS-Hülle
**Status:** MVP (Standalone) → Migration zu SaaS-Integration geplant

---

## 📋 Übersicht

Dieses Dokument beschreibt die **MaklerMate-Engine** als einbettbare Komponente, die später in eine Next.js-basierte SaaS-Hülle integriert werden kann.

### Aktuelle Architektur

```
┌─────────────────────────────────────────────────────┐
│ MaklerMate-MVP (dieses Repo)                        │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ React App (Standalone)                       │   │
│  │                                              │   │
│  │  - Home/Landing                              │   │
│  │  - Exposé-Tool                               │   │
│  │  - CRM-Light                                 │   │
│  │  - LocalStorage Persistenz                   │   │
│  └──────────────────────────────────────────────┘   │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │ Supabase Auth (Optional)                     │   │
│  │  - Login/Logout                              │   │
│  │  - Session Management                        │   │
│  │  - ABER: Daten noch nicht user-spezifisch    │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### Ziel-Architektur (SaaS-Integration)

```
┌─────────────────────────────────────────────────────────────────┐
│ maklermate-landingpage (Next.js SaaS-Hülle)                     │
│                                                                  │
│  ┌────────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │ Landing Pages  │  │ Auth (Next)  │  │ Stripe Checkout  │    │
│  │ /pricing       │  │ NextAuth.js  │  │ /api/subscribe   │    │
│  └────────────────┘  └──────────────┘  └──────────────────┘    │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ /app/* → MaklerMate Engine (embedded)                   │    │
│  │                                                          │    │
│  │   - User Context (userId, plan) from NextAuth           │    │
│  │   - Exposé-Tool                                         │    │
│  │   - CRM-Light                                           │    │
│  │   - Supabase Backend (user-specific data)              │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Einstiegspunkte

### 1. Haupt-Einstiegspunkt: `src/index.tsx`

**Funktion:** React App Bootstrap, Router Setup, Auth Provider

**Wichtige Komponenten:**
- `ReactDOM.createRoot()` - React 18 Concurrent Mode
- `<AuthProvider>` - Globaler Auth-Kontext (Supabase)
- `<BrowserRouter>` - Client-Side Routing
- `validateEnvironment()` - Env-Var Validierung vor App-Start

**Router-Struktur:**
```tsx
<Routes>
  {/* Login ohne Layout */}
  <Route path="/login" element={<Login />} />

  {/* Landing/App */}
  <Route path="/*" element={<App />} />

  {/* Geschützte Routen mit AppShell (Header) */}
  <Route element={<AppShell />}>
    <Route element={<ProtectedRoute />}>
      <Route path="/expose" element={<ExposeTool />} />
      <Route path="/profile" element={<Profile />} />
    </Route>
  </Route>
</Routes>
```

**⚠️ Integration-Hinweis:**
In der SaaS-Version wird dieser Einstiegspunkt durch Next.js ersetzt. Die `App`-Komponente wird dann unter `/app/*` eingebettet.

---

### 2. App-Level Router: `src/App.tsx`

**Funktion:** Zentrale Routing-Konfiguration mit Layout

**Routen:**
```tsx
<Route path="/" element={<Layout />}>
  <Route index element={<Home />} />           {/* Landing */}
  <Route path="crm" element={<CRMTool />} />   {/* CRM-Tool */}
  <Route path="expose" element={<ExposeTool />} /> {/* Exposé-Generator */}
</Route>
```

**Features:**
- `<Layout>` - Navbar + Footer + `<Outlet />` für Child-Routes
- `<ErrorBoundary>` - Graceful Error Handling pro Route
- `<Toaster>` - Globale Toast-Benachrichtigungen (react-hot-toast)

**🔧 Root-Komponente für Einbettung:**
Die `App`-Komponente ist die **Haupt-Engine**, die in ein fremdes Host-System (Next.js) integriert werden kann.

**SaaS-Integration-Ansatz:**
```tsx
// In Next.js: /app/app/page.tsx
import MaklerMateApp from '@/components/maklermate/App';

export default function AppPage() {
  return (
    <UserContextProvider userId={session.user.id} plan={session.user.plan}>
      <MaklerMateApp />
    </UserContextProvider>
  );
}
```

---

## 🗂️ Haupt-Module

### State Management (Zustand Stores)

#### 1. **CRM Store** (`src/stores/crmStore.ts`)

**Zweck:** Lead-Management, Filter, Statistiken

**State:**
- `leads: Lead[]` - Alle Leads
- `filter: LeadFilter` - Aktueller Filter (alle, neu, warm, vip, cold)
- `searchQuery: string` - Suchbegriff

**Actions:**
- `addLead()`, `updateLead()`, `deleteLead()`, `deleteLeads()`
- `setFilter()`, `setSearchQuery()`, `getFilteredLeads()`
- `getStats()` - Statistiken (total, byStatus, byType)
- `exportAsJSON()`, `importFromJSON()` - Import/Export

**LocalStorage Key:** `maklermate-crm-storage` (via Zustand persist)

**🔮 Migration-Plan:**
→ Ersetzen durch Supabase `leads` Tabelle mit `user_id` Filter

---

#### 2. **Exposé Store** (`src/stores/exposeStore.ts`)

**Zweck:** Exposé-Formular, Bilder, Gespeicherte Exposés

**State:**
- `formData: ExposeFormData` - Objektdaten (Adresse, Preis, Beschreibung)
- `output: string` - Generierter AI-Text
- `selectedStyle: ExposeStyle` - emotional | sachlich | luxus
- `images: string[]` - Bild-URLs (Base64 oder Upload-URLs)
- `captions: string[]` - Bildunterschriften
- `savedExposes: SavedExpose[]` - Gespeicherte Exposés

**Actions:**
- `setFormData()`, `updateFormField()`, `setOutput()`, `setStyle()`
- `addImage()`, `removeImage()`, `updateCaption()`, `moveImage()`
- `saveExpose()`, `deleteExpose()`, `loadExpose()`
- `resetAll()` - Komplett zurücksetzen

**LocalStorage Key:** `maklermate-expose-storage` (via Zustand persist)

**🔮 Migration-Plan:**
→ Ersetzen durch Supabase `exposes` Tabelle + `expose_images` Tabelle mit `user_id` Filter

---

### Services

#### 1. **LeadsStorageService** (`src/services/LeadsStorageService.ts`)

**⚠️ Status:** Legacy/Redundant (wird durch crmStore ersetzt)

**Funktion:** LocalStorage-Verwaltung für Leads (separater Service)

**Features:**
- Debounced saves (150ms)
- Cross-tab synchronization
- Import/Export als JSON
- Storage-Statistiken

**LocalStorage Key:** `maklermate_leads`

**🔧 Hinweis:**
Dieser Service ist redundant zu `crmStore` (Zustand persist). In einer zukünftigen Refactoring-Phase sollte er entfernt werden.

---

### Context

#### **AuthContext** (`src/context/AuthContext.tsx`)

**Zweck:** Globaler Auth-State (Supabase)

**State:**
- `user: User | null` - Aktuell angemeldeter User
- `loading: boolean` - Session wird geladen
- `error: AuthError | null` - Auth-Fehler

**Methods:**
- `signInWithPassword()` - Email + Password Login
- `signInWithMagicLink()` - Magic Link Login
- `signUp()` - Registrierung
- `signOut()` - Logout
- `getAccessToken()` - JWT Token für API-Calls

**🔮 SaaS-Integration:**
In der Next.js-Version wird `AuthContext` durch NextAuth ersetzt. User-Daten kommen dann vom Host-System.

---

## 💾 Datenhaltung

### Aktuell: LocalStorage (MVP)

**Keys:**
- `maklermate-crm-storage` - CRM-Daten (Zustand persist)
- `maklermate-expose-storage` - Exposé-Daten (Zustand persist)
- `maklermate_leads` - Leads (LeadsStorageService - redundant)

**Struktur:**
```json
{
  "state": {
    "leads": [...],
    "filter": "alle",
    "searchQuery": ""
  },
  "version": 0
}
```

**⚠️ Limitierungen:**
- ❌ Keine Multi-Device-Synchronisation
- ❌ Keine User-Isolation (alle Daten im Browser)
- ❌ Keine Backups
- ❌ 5-10 MB Speicher-Limit pro Domain

---

### Ziel: Supabase Backend (v0.2.x)

**Migration-Plan:** (siehe auch: `docs/architecture/SUPABASE-SCHEMA.md`)

**Tabellen:**
- `users` - User-Accounts
- `exposes` - Gespeicherte Exposés
- `expose_images` - Bilder pro Exposé
- `leads` - CRM-Leads

**Row-Level Security (RLS):**
- Jeder User sieht nur eigene Daten
- `user_id` Foreign Key in allen Tabellen

**Real-Time Sync:**
- Supabase Realtime für Multi-Device-Sync
- Offline-First mit lokaler Queue

---

## 🔄 Datenflüsse

### Exposé-Erstellung

```
┌─────────────┐
│ ExposeTool  │ (UI)
│ Page        │
└─────┬───────┘
      │
      ├─> formData: ExposeFormData
      │   (Objektdaten erfassen)
      │
      ├─> Images hochladen
      │   └─> exposeStore.addImage()
      │       └─> Base64 in State
      │
      ├─> AI-Text generieren
      │   └─> OpenAI API (/api/generate-expose)
      │       └─> exposeStore.setOutput()
      │
      ├─> PDF exportieren
      │   └─> pdfService.generatePDF()
      │       └─> Download
      │
      └─> Exposé speichern
          └─> exposeStore.saveExpose()
              └─> LocalStorage (persist)
```

**🔮 SaaS-Version:**
```
ExposeTool
  └─> AI-Text generieren
      └─> POST /api/ai/generate-expose
          └─> Supabase: INSERT INTO exposes
              └─> Real-Time Sync zu anderen Devices
```

---

### Lead-Management (CRM)

```
┌─────────────┐
│ CRMTool     │ (UI)
│ Page        │
└─────┬───────┘
      │
      ├─> Lead hinzufügen
      │   └─> crmStore.addLead()
      │       └─> LocalStorage (persist)
      │
      ├─> Lead bearbeiten
      │   └─> crmStore.updateLead()
      │       └─> LocalStorage (persist)
      │
      ├─> Filter/Suche
      │   └─> crmStore.setFilter()
      │   └─> crmStore.setSearchQuery()
      │       └─> getFilteredLeads() (computed)
      │
      ├─> Statistiken
      │   └─> crmStore.getStats()
      │
      └─> Export/Import
          └─> crmStore.exportAsJSON()
          └─> crmStore.importFromJSON()
```

**🔮 SaaS-Version:**
```
CRMTool
  └─> Lead hinzufügen
      └─> POST /api/leads
          └─> Supabase: INSERT INTO leads (user_id, ...)
              └─> Real-Time Sync
```

---

## 🧩 UI-Schicht (Pages)

### Haupt-Pages

| Route | Komponente | Zweck |
|-------|-----------|-------|
| `/` | `Home.tsx` | Landing/Startseite (Feature-Übersicht) |
| `/login` | `Login.tsx` | Login-Formular (Supabase Auth) |
| `/crm` | `CRMTool.tsx` | CRM-Light (Leads, Filter, Statistiken) |
| `/expose` | `ExposeTool.tsx` | Exposé-Generator (Form, AI, PDF) |
| `/profile` | `Profile.tsx` | User-Profil (geschützt) |

**🔧 Einbettbarkeit:**
Alle Pages sind als standalone React-Komponenten konzipiert und können in ein fremdes Host-System integriert werden.

---

## 🔐 Auth-Flow

### Aktuell (MVP)

```
User besucht /login
  └─> AuthContext.signInWithPassword(email, password)
      └─> Supabase Auth
          └─> Session gespeichert
              └─> Redirect zu /profile
                  └─> ProtectedRoute prüft user
                      └─> Zugriff gewährt
```

**⚠️ Problem:**
Daten werden NICHT user-spezifisch gespeichert. Jeder Browser hat eigene LocalStorage-Daten.

---

### Ziel (SaaS)

```
User besucht maklermate.com
  └─> Landing Page (Next.js)
      └─> Click "Login"
          └─> NextAuth Login
              └─> Session Cookie gesetzt
                  └─> Redirect zu /app
                      └─> MaklerMate Engine
                          └─> UserContext (userId, plan)
                              └─> Supabase Queries gefiltert nach user_id
```

**Vorteile:**
- ✅ User-spezifische Daten
- ✅ Multi-Device-Sync
- ✅ Plan-basierte Features (Free vs. Pro)

---

## 📦 Persistenz-Schicht

### Aktuelle Implementierung

**Zustand Persist Middleware:**
```typescript
// src/stores/crmStore.ts
export const useCRMStore = create<CRMState>()(
  persist(
    (set, get) => ({
      leads: [],
      // ... actions
    }),
    {
      name: 'maklermate-crm-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

**🔮 Ziel: Repository Pattern**

Abstrahiere Storage-Layer für einfachen Austausch:

```typescript
// src/repositories/ILeadRepository.ts
export interface ILeadRepository {
  getAll(userId: string): Promise<Lead[]>;
  getById(id: string, userId: string): Promise<Lead | null>;
  create(lead: Omit<Lead, 'id'>, userId: string): Promise<Lead>;
  update(id: string, patch: Partial<Lead>, userId: string): Promise<Lead>;
  delete(id: string, userId: string): Promise<void>;
}

// Aktuelle Implementierung
class LocalStorageLeadRepository implements ILeadRepository {
  // ... LocalStorage-Logik
}

// Zukünftige Implementierung
class SupabaseLeadRepository implements ILeadRepository {
  // ... Supabase-Logik
}
```

**Migration-Strategie:**
1. Interface definieren (`ILeadRepository`, `IExposeRepository`)
2. LocalStorage-Implementierung extrahieren
3. Supabase-Implementierung parallel entwickeln
4. Feature-Flag für Umschaltung
5. LocalStorage-Export/Import für Migration

---

## 🔌 Integration-Checklist

### Phase 1: Vorbereitung (dieses Repo)

- [x] Dokumentation erstellen (dieses Dokument)
- [ ] Storage-Abstraktionen einführen (Repository Pattern)
- [ ] User/Plan-Context vorbereiten (AppContext)
- [ ] Code-Kommentare für Integration-Points
- [ ] Supabase-Schema entwerfen

### Phase 2: Next.js SaaS-Hülle (anderes Repo)

- [ ] Next.js Projekt mit NextAuth
- [ ] Stripe Integration
- [ ] Landing Pages
- [ ] `/app/*` Route für Engine

### Phase 3: Migration

- [ ] Supabase-Repositories implementieren
- [ ] User-Context vom Host übernehmen
- [ ] LocalStorage → Supabase Migration-Script
- [ ] Feature-Flags für schrittweise Migration

### Phase 4: Launch

- [ ] Beta-Testing
- [ ] Performance-Optimierung
- [ ] SEO (Landing Pages)
- [ ] Analytics

---

## 📝 Nächste Schritte

1. **Storage-Abstraktionen einführen** (siehe `SUPABASE-SCHEMA.md`)
2. **User/Plan-Context erstellen** (siehe `USER-CONTEXT-DESIGN.md`)
3. **Code-Kommentare hinzufügen** für alle Integration-Points
4. **MVP-Status dokumentieren** (Use Cases, Limitations)

---

## 🔗 Verwandte Dokumentation

- `docs/architecture/SUPABASE-SCHEMA.md` - Datenbank-Schema
- `docs/architecture/STORAGE-ABSTRACTION.md` - Repository Pattern
- `docs/architecture/USER-CONTEXT-DESIGN.md` - User/Plan-Context
- `docs/PRODUCT-MVP-STATUS.md` - MVP Use Cases
- `PROJECT.md` - Projekt-Übersicht
