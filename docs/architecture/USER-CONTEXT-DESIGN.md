# User/Plan Context Design

**Letzte Aktualisierung:** 16. November 2025
**Zweck:** Vorbereitung auf SaaS-Integration mit User-Isolation & Plan-Features
**Status:** 🔧 In Preparation (Context erstellt, Integration pending)

---

## 📋 Übersicht

Der `AppContext` bereitet die MaklerMate-Engine auf die SaaS-Integration vor, indem er:
- **User-Isolation** ermöglicht (userId)
- **Plan-basierte Features** steuert (Free vs. Pro)
- **Ressourcen-Limits** durchsetzt
- **Feature-Flags** bereitstellt

---

## 🏗️ Architektur

### MVP (LocalStorage)

```
┌─────────────────────────────────────────────┐
│ AppProvider                                  │
│                                              │
│  userId: null (LocalStorage)                │
│  plan: 'free' (LocalStorage)                │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │ MaklerMate App                         │ │
│  │                                        │ │
│  │  - Alle Daten im Browser              │ │
│  │  - Keine User-Isolation               │ │
│  │  - Plan-Limits werden angezeigt       │ │
│  │    (aber nicht durchgesetzt)          │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### SaaS (Next.js + Supabase)

```
┌───────────────────────────────────────────────────────┐
│ Next.js Host (maklermate-landingpage)                 │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ NextAuth Session                                 │ │
│  │                                                  │ │
│  │  user: { id, email, plan }                      │ │
│  │  ↓                                               │ │
│  └──┬───────────────────────────────────────────────┘ │
│     │                                                  │
│     ├─> AppProvider                                   │
│     │    userId={session.user.id}                     │
│     │    plan={session.user.plan}                     │
│     │                                                  │
│     │    ┌──────────────────────────────────────┐     │
│     └──> │ MaklerMate Engine                    │     │
│          │                                      │     │
│          │  - User-spezifische Daten           │     │
│          │  - Plan-Limits durchgesetzt         │     │
│          │  - Multi-Device Sync                │     │
│          └──────────────────────────────────────┘     │
└───────────────────────────────────────────────────────┘
```

---

## 🎯 Context API

### AppContextValue

**Location:** `src/context/AppContext.tsx`

```typescript
interface AppContextValue {
  // User Data
  userId: string | null;
  plan: Plan; // 'free' | 'pro'

  // Plan Configuration
  limits: PlanLimits;
  features: PlanFeatures;

  // State Management
  setUserId: (userId: string | null) => void;
  setPlan: (plan: Plan) => void;

  // Helpers
  hasFeature: (feature: keyof PlanFeatures) => boolean;
  isLimitReached: (resource: keyof PlanLimits, currentCount: number) => boolean;
}
```

---

## 📊 Plan-Konfiguration

### Plan Types

```typescript
type Plan = 'free' | 'pro';
```

### Plan Limits

```typescript
interface PlanLimits {
  maxExposes: number;           // Gespeicherte Exposés
  maxLeads: number;             // CRM-Leads
  maxImagesPerExpose: number;   // Bilder pro Exposé
  maxAIGenerations: number;     // AI-Generierungen/Monat
  maxPDFExports: number;        // PDF-Exports/Monat
}
```

**Konfiguration:**
```typescript
const PLAN_LIMITS: Record<Plan, PlanLimits> = {
  free: {
    maxExposes: 5,
    maxLeads: 20,
    maxImagesPerExpose: 3,
    maxAIGenerations: 10,
    maxPDFExports: 5,
  },
  pro: {
    maxExposes: Infinity,
    maxLeads: Infinity,
    maxImagesPerExpose: 10,
    maxAIGenerations: Infinity,
    maxPDFExports: Infinity,
  },
};
```

---

### Plan Features

```typescript
interface PlanFeatures {
  aiTextGeneration: boolean;
  pdfExport: boolean;
  crmLight: boolean;
  advancedStats: boolean;
  exportImport: boolean;
  multiDeviceSync: boolean;
  prioritySupport: boolean;
}
```

**Konfiguration:**
```typescript
const PLAN_FEATURES: Record<Plan, PlanFeatures> = {
  free: {
    aiTextGeneration: true,
    pdfExport: true,
    crmLight: true,
    advancedStats: false,
    exportImport: false,
    multiDeviceSync: false,
    prioritySupport: false,
  },
  pro: {
    aiTextGeneration: true,
    pdfExport: true,
    crmLight: true,
    advancedStats: true,
    exportImport: true,
    multiDeviceSync: true,
    prioritySupport: true,
  },
};
```

---

## 💻 Verwendung

### 1. Provider Setup

**MVP (index.tsx):**
```tsx
import { AppProvider } from './context/AppContext';

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider>
      <AppProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppProvider>
    </AuthProvider>
  </React.StrictMode>
);
```

**SaaS (Next.js /app/app/page.tsx):**
```tsx
import { AppProvider } from '@/components/maklermate/context/AppContext';

export default function AppPage() {
  const session = await getServerSession(authOptions);

  return (
    <AppProvider
      userId={session.user.id}
      plan={session.user.subscriptionPlan}
    >
      <MaklerMateApp />
    </AppProvider>
  );
}
```

---

### 2. Feature-Flags

**Beispiel: Erweiterte Statistiken nur für Pro**
```tsx
import { useAppContext } from '@/context/AppContext';

function CRMStats() {
  const { hasFeature } = useAppContext();

  return (
    <div>
      {/* Basis-Stats (immer verfügbar) */}
      <BasicStats />

      {/* Erweiterte Stats nur für Pro */}
      {hasFeature('advancedStats') ? (
        <AdvancedStats />
      ) : (
        <UpgradePrompt feature="Erweiterte Statistiken" />
      )}
    </div>
  );
}
```

---

### 3. Limit-Checks

**Beispiel: Max Exposés Check**
```tsx
import { useAppContext } from '@/context/AppContext';
import { useExposeStore } from '@/stores/exposeStore';

function ExposeTool() {
  const { isLimitReached, limits, plan } = useAppContext();
  const { savedExposes } = useExposeStore();

  const handleSaveExpose = () => {
    if (isLimitReached('maxExposes', savedExposes.length)) {
      toast.error(
        `Limit erreicht: ${limits.maxExposes} Exposés (${plan.toUpperCase()}-Plan)`
      );
      // Optional: Zeige Upgrade-Dialog
      return;
    }

    // Save expose...
  };

  return (
    <div>
      <p>
        Gespeicherte Exposés: {savedExposes.length} / {limits.maxExposes === Infinity ? '∞' : limits.maxExposes}
      </p>
      <button onClick={handleSaveExpose}>Exposé speichern</button>
    </div>
  );
}
```

---

### 4. User-spezifische Daten

**Beispiel: Leads filtern nach userId**
```tsx
import { useAppContext } from '@/context/AppContext';
import { ILeadRepository } from '@/repositories/ILeadRepository';

function CRMTool() {
  const { userId } = useAppContext();
  const leadRepository: ILeadRepository = useLeadRepository();

  useEffect(() => {
    const loadLeads = async () => {
      const leads = await leadRepository.getAll(userId);
      setLeads(leads);
    };
    loadLeads();
  }, [userId]);

  // ...
}
```

**NOTE:** Im MVP ist `userId` null → alle Daten aus LocalStorage.
In v0.2.x+ ist `userId` gesetzt → gefilterte Daten aus Supabase.

---

## 🔄 Migration-Pfad

### Phase 1: Context vorbereiten ✅

**Status:** Completed
**Dateien:**
- `src/context/AppContext.tsx`
- `docs/architecture/USER-CONTEXT-DESIGN.md`

---

### Phase 2: MVP-Integration

**Status:** ⏳ Pending
**Tasks:**
1. Füge `AppProvider` zu `index.tsx` hinzu
2. Verwende `useAppContext()` in Components
3. Zeige Plan-Limits in UI an (ohne Durchsetzung)
4. Zeige Upgrade-Prompts bei Feature-Requests

**Beispiel-Components:**
- `<PlanBadge />` - Zeigt aktuellen Plan an
- `<UpgradePrompt feature="..." />` - Upgrade-Dialog
- `<LimitReachedMessage limit={...} />` - Limit-Warnung

---

### Phase 3: SaaS-Integration

**Status:** 🔮 Future (v0.2.x)
**Tasks:**
1. Next.js Host übergibt `userId` und `plan` via Props
2. Repositories filtern Daten nach `userId`
3. Plan-Limits werden serverseitig durchgesetzt
4. Stripe Webhooks aktualisieren `plan` in Datenbank

---

### Phase 4: Limit-Durchsetzung

**Status:** 🔮 Future (v0.2.x)
**Konzept:** Serverseitige Validation

```typescript
// api/routes/exposes.ts (Backend)
app.post('/api/exposes', async (req, res) => {
  const { userId } = req.auth;

  // Lade User + Plan aus DB
  const user = await getUserById(userId);
  const limits = PLAN_LIMITS[user.plan];

  // Check Limit
  const currentCount = await getExposeCount(userId);
  if (currentCount >= limits.maxExposes) {
    return res.status(403).json({
      error: 'Limit reached',
      limit: limits.maxExposes,
      plan: user.plan,
    });
  }

  // Create expose...
});
```

---

## 🎨 UI-Komponenten

### PlanBadge

**Zweck:** Zeigt aktuellen Plan an (Header, Profile)

```tsx
import { useAppContext } from '@/context/AppContext';

export function PlanBadge() {
  const { plan } = useAppContext();

  return (
    <span className={`plan-badge plan-${plan}`}>
      {plan === 'pro' ? '⭐ PRO' : '🆓 FREE'}
    </span>
  );
}
```

---

### UpgradePrompt

**Zweck:** Upgrade-Dialog bei Feature-Request

```tsx
interface UpgradePromptProps {
  feature: string;
  onClose?: () => void;
}

export function UpgradePrompt({ feature, onClose }: UpgradePromptProps) {
  return (
    <div className="upgrade-prompt">
      <h3>🚀 Upgrade zu PRO</h3>
      <p>
        <strong>{feature}</strong> ist nur im PRO-Plan verfügbar.
      </p>
      <button onClick={() => window.location.href = '/pricing'}>
        Jetzt upgraden
      </button>
      <button onClick={onClose}>Abbrechen</button>
    </div>
  );
}
```

---

### LimitReachedMessage

**Zweck:** Limit-Warnung bei Ressourcen-Erreichen

```tsx
interface LimitReachedMessageProps {
  resource: string;
  limit: number;
}

export function LimitReachedMessage({ resource, limit }: LimitReachedMessageProps) {
  return (
    <div className="limit-reached">
      <p>
        ⚠️ Du hast dein Limit erreicht: <strong>{limit} {resource}</strong>
      </p>
      <p>
        Upgrade zu PRO für unbegrenzte Nutzung.
      </p>
      <button onClick={() => window.location.href = '/pricing'}>
        Jetzt upgraden
      </button>
    </div>
  );
}
```

---

## 🧪 Testing

### Mock AppContext

```typescript
// src/context/__mocks__/MockAppContext.tsx
export function createMockAppContext(overrides?: Partial<AppContextValue>): AppContextValue {
  return {
    userId: 'mock-user-123',
    plan: 'free',
    limits: PLAN_LIMITS.free,
    features: PLAN_FEATURES.free,
    setUserId: vi.fn(),
    setPlan: vi.fn(),
    hasFeature: (feature) => PLAN_FEATURES.free[feature],
    isLimitReached: (resource, count) => count >= PLAN_LIMITS.free[resource],
    ...overrides,
  };
}

// Test Usage
it('should show upgrade prompt for pro feature', () => {
  const mockContext = createMockAppContext({ plan: 'free' });

  render(
    <AppContext.Provider value={mockContext}>
      <CRMStats />
    </AppContext.Provider>
  );

  expect(screen.getByText(/Upgrade zu PRO/i)).toBeInTheDocument();
});
```

---

## 🔗 Verwandte Dokumentation

- `docs/architecture/APP-INTEGRATION-OVERVIEW.md` - Gesamt-Architektur
- `docs/architecture/STORAGE-ABSTRACTION.md` - Repository Pattern
- `docs/architecture/SUPABASE-SCHEMA.md` - Datenbank-Schema
- `PROJECT.md` - Projekt-Übersicht

---

## ✅ Nächste Schritte

1. ⏳ Integriere `AppProvider` in `index.tsx`
2. ⏳ Erstelle UI-Komponenten (`PlanBadge`, `UpgradePrompt`, `LimitReachedMessage`)
3. ⏳ Verwende `useAppContext()` in bestehenden Components
4. ⏳ Zeige Plan-Limits in UI an
5. 🔮 Implementiere Limit-Durchsetzung (v0.2.x, Backend)
