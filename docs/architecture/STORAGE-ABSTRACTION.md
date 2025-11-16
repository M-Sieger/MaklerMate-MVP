# Storage Abstraction Layer

**Letzte Aktualisierung:** 16. November 2025
**Zweck:** Repository Pattern für flexible Persistierungs-Layer
**Status:** 🔧 In Preparation (Interfaces definiert, Implementierung pending)

---

## 📋 Übersicht

Das Repository Pattern abstrahiert die Datenpersistierung und ermöglicht einfachen Austausch der Storage-Implementierung (LocalStorage → Supabase → API).

### Vorteile

✅ **Testbarkeit:** Mock-Repositories für Unit-Tests
✅ **Austauschbarkeit:** Einfacher Wechsel zwischen LocalStorage, Supabase, API
✅ **Feature-Flags:** Schrittweise Migration ohne Breaking Changes
✅ **Offline-First:** Fallback zu LocalStorage bei Netzwerkproblemen
✅ **User-Isolation:** Vorbereitung für Multi-User-SaaS

---

## 🏗️ Architektur

```
┌─────────────────────────────────────────────────────┐
│ UI Layer (Components, Pages)                        │
└───────────────────┬─────────────────────────────────┘
                    │
                    ├─> useCRMStore (Zustand)
                    │   └─> ILeadRepository
                    │       ├─> LocalStorageLeadRepository (MVP)
                    │       └─> SupabaseLeadRepository (v0.2.x)
                    │
                    └─> useExposeStore (Zustand)
                        └─> IExposeRepository
                            ├─> LocalStorageExposeRepository (MVP)
                            └─> SupabaseExposeRepository (v0.2.x)
```

---

## 📦 Interfaces

### 1. ILeadRepository

**Location:** `src/repositories/ILeadRepository.ts`

**Methods:**
```typescript
interface ILeadRepository {
  // CRUD Operations
  getAll(userId?: string): Promise<Lead[]>;
  getById(id: string, userId?: string): Promise<Lead | null>;
  create(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | '_v'>, userId?: string): Promise<Lead>;
  update(id: string, patch: Partial<Lead>, userId?: string): Promise<Lead>;
  delete(id: string, userId?: string): Promise<void>;
  deleteMany(ids: string[], userId?: string): Promise<void>;

  // Import/Export
  exportAsJSON(userId?: string): Promise<string>;
  importFromJSON(json: string, userId?: string): Promise<number>;
}
```

**Use Cases:**
- Lead hinzufügen/bearbeiten/löschen
- Bulk-Operations (Multi-Select-Delete)
- Backup/Restore via JSON Export

---

### 2. IExposeRepository

**Location:** `src/repositories/IExposeRepository.ts`

**Methods:**
```typescript
interface IExposeRepository {
  // CRUD Operations
  getAll(userId?: string): Promise<SavedExpose[]>;
  getById(id: string, userId?: string): Promise<SavedExpose | null>;
  create(expose: {...}, userId?: string): Promise<SavedExpose>;
  update(id: string, patch: Partial<SavedExpose>, userId?: string): Promise<SavedExpose>;
  delete(id: string, userId?: string): Promise<void>;

  // Draft Management
  saveDraft(formData: ExposeFormData, userId?: string): Promise<void>;
  loadDraft(userId?: string): Promise<ExposeFormData | null>;

  // Image Management
  uploadImage(file: File, userId?: string): Promise<string>;
  deleteImage(imageUrl: string, userId?: string): Promise<void>;
}
```

**Use Cases:**
- Exposé speichern/laden/löschen
- Auto-Save (Draft)
- Bild-Upload zu Storage

---

## 🔧 Implementierungen

### MVP: LocalStorage-Repositories

**Status:** ⏳ Planned (aktuell noch direkt in Zustand Stores)

**Nächste Schritte:**
1. Extrahiere Persistierungs-Logik aus Stores
2. Implementiere `LocalStorageLeadRepository`
3. Implementiere `LocalStorageExposeRepository`
4. Update Stores: Inject Repository via Dependency Injection

**Beispiel:**
```typescript
// src/repositories/LocalStorageLeadRepository.ts
export class LocalStorageLeadRepository implements ILeadRepository {
  private readonly storageKey = 'maklermate-crm-storage';

  async getAll(userId?: string): Promise<Lead[]> {
    const json = localStorage.getItem(this.storageKey);
    if (!json) return [];
    const data = JSON.parse(json);
    return data.state?.leads || [];
  }

  async create(lead: Omit<Lead, 'id' | ...>, userId?: string): Promise<Lead> {
    const newLead: Lead = {
      ...lead,
      id: crypto.randomUUID(),
      _v: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const leads = await this.getAll(userId);
    leads.push(newLead);
    await this._saveAll(leads);
    return newLead;
  }

  // ... weitere Methoden
}
```

---

### v0.2.x: Supabase-Repositories

**Status:** 📝 Designed (siehe SUPABASE-SCHEMA.md)

**Features:**
- Row-Level Security (RLS) - User-Isolation
- Real-Time Sync - Multi-Device
- Offline-First - Lokale Queue bei Netzwerkproblemen

**Beispiel:**
```typescript
// src/repositories/SupabaseLeadRepository.ts
export class SupabaseLeadRepository implements ILeadRepository {
  async getAll(userId: string): Promise<Lead[]> {
    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data as Lead[];
  }

  async create(lead: Omit<Lead, 'id' | ...>, userId: string): Promise<Lead> {
    const { data, error } = await supabase
      .from('leads')
      .insert([{ ...lead, user_id: userId }])
      .select()
      .single();

    if (error) throw error;
    return data as Lead;
  }

  // ... weitere Methoden
}
```

---

## 🔄 Migration-Strategie

### Phase 1: Interface-Definition ✅

**Status:** Completed
**Dateien:**
- `src/repositories/ILeadRepository.ts`
- `src/repositories/IExposeRepository.ts`

---

### Phase 2: LocalStorage-Extraktion

**Status:** ⏳ Pending
**Tasks:**
1. Implementiere `LocalStorageLeadRepository`
2. Implementiere `LocalStorageExposeRepository`
3. Update `crmStore.ts`:
   ```typescript
   // Vor
   export const useCRMStore = create<CRMState>()(
     persist(
       (set, get) => ({
         leads: [],
         addLead: (lead) => set((state) => ({
           leads: [...state.leads, {...lead, id: crypto.randomUUID() }]
         })),
       }),
       { name: 'maklermate-crm-storage' }
     )
   );

   // Nach
   const leadRepository: ILeadRepository = new LocalStorageLeadRepository();

   export const useCRMStore = create<CRMState>()((set, get) => ({
     leads: [],
     addLead: async (lead) => {
       const newLead = await leadRepository.create(lead, userId);
       set((state) => ({ leads: [...state.leads, newLead] }));
     },
   }));
   ```

---

### Phase 3: Supabase-Implementierung

**Status:** 📝 Planned (v0.2.x)
**Tasks:**
1. Implementiere Supabase-Schema (siehe SUPABASE-SCHEMA.md)
2. Implementiere `SupabaseLeadRepository`
3. Implementiere `SupabaseExposeRepository`
4. Feature-Flag: `REACT_APP_USE_SUPABASE=true`

---

### Phase 4: Hybrid-Mode (Offline-First)

**Status:** 🔮 Future (v0.3.x)
**Konzept:** Kombiniere LocalStorage + Supabase

```typescript
export class HybridLeadRepository implements ILeadRepository {
  constructor(
    private local: LocalStorageLeadRepository,
    private remote: SupabaseLeadRepository
  ) {}

  async getAll(userId: string): Promise<Lead[]> {
    try {
      // Try remote first
      const remoteLeads = await this.remote.getAll(userId);
      // Sync to local cache
      await this.local.saveAll(remoteLeads, userId);
      return remoteLeads;
    } catch (error) {
      // Fallback to local cache
      console.warn('Using offline cache:', error);
      return await this.local.getAll(userId);
    }
  }

  async create(lead: ..., userId: string): Promise<Lead> {
    // Optimistic update to local
    const newLead = await this.local.create(lead, userId);

    // Queue for remote sync
    await syncQueue.add({
      type: 'create',
      entity: 'lead',
      data: newLead,
    });

    return newLead;
  }
}
```

**Vorteile:**
- ✅ Offline-First (funktioniert ohne Internet)
- ✅ Auto-Sync bei Netzwerk-Verfügbarkeit
- ✅ Konflikt-Auflösung (Last-Write-Wins)

---

## 📊 Vergleich: Implementierungen

| Feature | LocalStorage | Supabase | Hybrid |
|---------|-------------|----------|--------|
| **Multi-Device Sync** | ❌ | ✅ | ✅ |
| **Offline-First** | ✅ | ❌ | ✅ |
| **User-Isolation** | ❌ | ✅ | ✅ |
| **Real-Time Updates** | ❌ | ✅ | ✅ |
| **Speicher-Limit** | 5-10 MB | Unbegrenzt | Unbegrenzt |
| **Performance** | ⚡ Instant | 🌐 Network | ⚡ Instant (Cache) |
| **Backups** | ❌ Manual | ✅ Auto | ✅ Auto |

---

## 🧪 Testing

### Mock-Repository für Unit-Tests

```typescript
// src/repositories/__mocks__/MockLeadRepository.ts
export class MockLeadRepository implements ILeadRepository {
  private leads: Lead[] = [];

  async getAll(userId?: string): Promise<Lead[]> {
    return [...this.leads];
  }

  async create(lead: Omit<Lead, 'id' | ...>, userId?: string): Promise<Lead> {
    const newLead: Lead = {
      ...lead,
      id: 'mock-' + Date.now(),
      _v: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.leads.push(newLead);
    return newLead;
  }

  // ... weitere Methoden

  // Test-Helper
  reset() {
    this.leads = [];
  }

  seedData(leads: Lead[]) {
    this.leads = [...leads];
  }
}
```

**Usage:**
```typescript
// crmStore.test.ts
const mockRepo = new MockLeadRepository();
const store = createCRMStore(mockRepo);

test('should add lead', async () => {
  await store.addLead({ name: 'Test', contact: 'test@example.com', ... });
  const leads = await mockRepo.getAll();
  expect(leads).toHaveLength(1);
});
```

---

## 🔗 Verwandte Dokumentation

- `docs/architecture/SUPABASE-SCHEMA.md` - Datenbank-Schema
- `docs/architecture/APP-INTEGRATION-OVERVIEW.md` - Gesamt-Architektur
- `docs/architecture/USER-CONTEXT-DESIGN.md` - User/Plan-Context
- `PROJECT.md` - Projekt-Übersicht

---

## ✅ Nächste Schritte

1. ⏳ Implementiere `LocalStorageLeadRepository`
2. ⏳ Implementiere `LocalStorageExposeRepository`
3. ⏳ Update Stores (Dependency Injection)
4. ⏳ Schreibe Tests für Repositories
5. 🔮 Plane Supabase-Migration (v0.2.x)
