# App Integration Overview

**Letzte Aktualisierung:** 16. November 2025 (SaaS Phase 1 Complete)
**Zweck:** Technische Dokumentation zur Integration dieser Engine in die SaaS-Hülle
**Status:** ✅ SaaS Phase 1 Complete → Ready for Next.js Integration

---

## 📋 Übersicht

Dieses Dokument beschreibt die **MaklerMate-Engine** als einbettbare Komponente, die später in eine Next.js-basierte SaaS-Hülle integriert werden kann.

### ✅ SaaS Phase 1 - Completed (November 2025)

**Implementierte Features:**
- ✅ **AppContext Integration** - User/Plan Management mit Boot Config Pattern
- ✅ **Repository Pattern** - LocalStorage Repositories für Leads & Exposés
- ✅ **Soft Limit Checks** - Free vs Pro Plan Warnings (non-blocking)
- ✅ **One-Time Migration** - Automatic data migration from Zustand persist
- ✅ **Type-Safe Architecture** - Full TypeScript migration complete
- ✅ **PlanBadge UI Component** - Visual plan indicator in header

**Ready for Next.js Integration:**
The engine can now be embedded into a Next.js SaaS shell with user/plan injection via `window.__MAKLER_MATE_BOOT_CONFIG__`.

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

**SaaS-Integration-Ansatz (Phase 1 - Aktuell):**

The engine now supports injection of user/plan data via a global boot config:

```tsx
// In Next.js: /app/app/page.tsx
import Script from 'next/script';

export default function AppPage({ session }) {
  return (
    <>
      {/* Inject boot config BEFORE loading the engine */}
      <Script id="maklermate-boot" strategy="beforeInteractive">
        {`
          window.__MAKLER_MATE_BOOT_CONFIG__ = {
            userId: '${session.user.id}',
            plan: '${session.user.plan}' // 'free' | 'pro'
          };
        `}
      </Script>

      {/* Load MaklerMate Engine (iframe or direct embed) */}
      <iframe src="/engine" style={{ width: '100%', height: '100vh', border: 'none' }} />
    </>
  );
}
```

**How It Works:**
1. Next.js sets `window.__MAKLER_MATE_BOOT_CONFIG__` with userId and plan
2. MaklerMate engine reads this on startup in `src/index.tsx`
3. `AppContext` uses these values for plan limits and features
4. Repositories use userId for data scoping (future: Supabase filtering)

**Benefits:**
- ✅ No tight coupling between Next.js and React engine
- ✅ Works in iframe or direct embed scenarios
- ✅ Easy to test standalone (boot config is optional)
- ✅ Type-safe with TypeScript global declarations

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

#### **AppContext** (`src/context/AppContext.tsx`) - **✅ NEU in Phase 1**

**Zweck:** User/Plan Management für SaaS-Integration

**State:**
- `userId: string | null` - Current user ID (from boot config or localStorage)
- `plan: 'free' | 'pro'` - Current subscription plan
- `limits: PlanLimits` - Plan-specific limits (maxExposes, maxLeads, etc.)
- `features: PlanFeatures` - Plan-specific feature flags

**Methods:**
- `isLimitReached(resource, count)` - Check if plan limit is reached
- `hasFeature(feature)` - Check if plan includes a feature

**Plan Limits:**
```typescript
{
  free: {
    maxExposes: 5,
    maxLeads: 20,
    maxStorage: 10 * 1024 * 1024, // 10 MB
  },
  pro: {
    maxExposes: Infinity,
    maxLeads: Infinity,
    maxStorage: Infinity,
  }
}
```

**Boot Config Pattern:**
```typescript
// Global type declaration
declare global {
  interface Window {
    __MAKLER_MATE_BOOT_CONFIG__?: {
      userId?: string;
      plan?: 'free' | 'pro';
    };
  }
}

// Usage in index.tsx
const bootConfig = window.__MAKLER_MATE_BOOT_CONFIG__;
<AppProvider userId={bootConfig?.userId} plan={bootConfig?.plan}>
  {/* App */}
</AppProvider>
```

**Soft Limit Checks:**
- ExposeTool: Warns when approaching 5 exposés (Free plan)
- CRMTool: Warns when approaching 20 leads (Free plan)
- Non-blocking warnings with toast notifications
- Upgrade prompts at exact limit

**Benefits:**
- ✅ Standalone mode (reads from localStorage as fallback)
- ✅ SaaS mode (reads from boot config)
- ✅ Type-safe plan management
- ✅ Easy to extend with new features/limits

---

## 💾 Datenhaltung

### Aktuell: LocalStorage (MVP + Phase 1 Repositories)

**Keys:**
- `maklermate-crm-storage` - CRM-Daten (Zustand persist - legacy)
- `maklermate-expose-storage` - Exposé-Daten (Zustand persist - legacy)
- `maklermate_leads` - **✅ NEW:** Leads Repository (user-scoped)
- `maklermate_exposes` - **✅ NEW:** Exposés Repository (user-scoped)
- `maklermate_expose_draft` - **✅ NEW:** Draft Exposé storage

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

**✅ Repository Pattern (Implemented in Phase 1)**

Storage-Layer ist jetzt abstrahiert für einfachen Austausch:

```typescript
// src/repositories/ILeadRepository.ts
export interface ILeadRepository {
  getAll(userId?: string): Promise<Lead[]>;
  getById(id: string, userId?: string): Promise<Lead | null>;
  create(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | '_v'>, userId?: string): Promise<Lead>;
  update(id: string, patch: Partial<Lead>, userId?: string): Promise<Lead>;
  delete(id: string, userId?: string): Promise<void>;
  deleteMany(ids: string[], userId?: string): Promise<void>;
  exportAsJSON(userId?: string): Promise<string>;
  importFromJSON(json: string, userId?: string): Promise<number>;
}

// ✅ Implementiert: LocalStorage
class LocalStorageLeadRepository implements ILeadRepository {
  private readonly storageKey = 'maklermate_leads';

  async getAll(userId?: string): Promise<Lead[]> {
    const json = localStorage.getItem(this.storageKey);
    if (!json) return [];
    const data = JSON.parse(json);
    return data.map(migrateLead); // Auto-migration v1→v2
  }
  // ... CRUD methods with userId scoping (prepared for Supabase)
}

// 🔮 Zukünftig: Supabase
class SupabaseLeadRepository implements ILeadRepository {
  async getAll(userId?: string): Promise<Lead[]> {
    const { data } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', userId);
    return data || [];
  }
  // ... Supabase implementation
}
```

**Migration-Status:**
- ✅ Interfaces defined (`ILeadRepository`, `IExposeRepository`)
- ✅ LocalStorage implementations complete
- ✅ Factory pattern for easy switching (`createLeadRepository()`)
- ✅ One-time data migration from Zustand persist
- ✅ Unit tests (30 tests for repositories)
- ⏳ Supabase implementation (Phase 2)
- ⏳ Feature flag system (Phase 2)

**Files:**
- `src/repositories/ILeadRepository.ts` - Interface
- `src/repositories/IExposeRepository.ts` - Interface
- `src/repositories/localStorage/LocalStorageLeadRepository.ts` - Implementation
- `src/repositories/localStorage/LocalStorageExposeRepository.ts` - Implementation
- `src/repositories/factory.ts` - Factory for dependency injection
- `src/repositories/migrate.ts` - One-time migration from Zustand

**Benefits:**
- ✅ Clean separation of concerns
- ✅ Easy to test (mockable repositories)
- ✅ Future-proof for Supabase migration
- ✅ userId scoping prepared (optional parameter)

---

## 🔌 Integration-Checklist

### Phase 1: Vorbereitung (dieses Repo) - ✅ COMPLETE

- [x] Dokumentation erstellen (dieses Dokument)
- [x] **Storage-Abstraktionen einführen (Repository Pattern)**
  - ✅ `ILeadRepository` & `IExposeRepository` interfaces
  - ✅ LocalStorage implementations with full CRUD
  - ✅ Factory pattern for dependency injection
  - ✅ One-time migration from Zustand persist
  - ✅ 30 unit tests for repositories
- [x] **User/Plan-Context vorbereiten (AppContext)**
  - ✅ `AppContext` with userId & plan management
  - ✅ Boot config pattern for Next.js injection
  - ✅ Plan limits (Free: 5 exposés, 20 leads)
  - ✅ Soft limit checks (non-blocking warnings)
  - ✅ `PlanBadge` UI component
- [x] **Code-Kommentare für Integration-Points**
  - ✅ SaaS integration comments in all core modules
  - ✅ TypeScript migration complete (strict mode)
- [x] **Supabase-Schema entwerfen**
  - ✅ See `docs/architecture/SUPABASE-SCHEMA.md`

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
