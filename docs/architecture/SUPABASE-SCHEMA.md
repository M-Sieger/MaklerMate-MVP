# Supabase Database Schema

**Letzte Aktualisierung:** 16. November 2025
**Zweck:** Datenbank-Schema für v0.2.x Migration (LocalStorage → Supabase)
**Status:** 📝 Design Phase (nicht implementiert)

---

## 📋 Übersicht

Dieses Dokument definiert das Supabase-Schema für die zukünftige Migration von LocalStorage zu einer echten Datenbank mit:
- **User-Isolation** (Row-Level Security)
- **Multi-Device Sync** (Supabase Realtime)
- **Unbegrenzte Speicherkapazität**
- **Backup & Recovery**

---

## 🏗️ Schema-Übersicht

```
┌─────────────────────────────────────────────────────┐
│ users (Supabase Auth)                               │
│                                                      │
│  id         uuid PRIMARY KEY                        │
│  email      text UNIQUE NOT NULL                    │
│  created_at timestamp                               │
├─────────────────────────────────────────────────────┤
│                                                      │
│  ├─> profiles (1:1)                                 │
│  ├─> subscriptions (1:1)                            │
│  ├─> leads (1:N)                                    │
│  └─> exposes (1:N)                                  │
│       └─> expose_images (1:N)                       │
└─────────────────────────────────────────────────────┘
```

---

## 📊 Tabellen

### 1. `profiles`

**Zweck:** Erweiterte User-Informationen (zusätzlich zu Supabase Auth)

```sql
CREATE TABLE public.profiles (
  -- Primary Key
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

  -- User Info
  full_name TEXT,
  company_name TEXT,
  phone TEXT,

  -- Settings
  language TEXT DEFAULT 'de',
  timezone TEXT DEFAULT 'Europe/Berlin',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Trigger: Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

### 2. `subscriptions`

**Zweck:** Stripe Subscription Management

```sql
CREATE TABLE public.subscriptions (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- User Reference
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Stripe Data
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_price_id TEXT,

  -- Plan Info
  plan TEXT NOT NULL CHECK (plan IN ('free', 'pro')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),

  -- Billing
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Constraints
  UNIQUE(user_id)
);

-- RLS Policies
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- NOTE: Updates nur via Backend (Stripe Webhooks)

-- Indexes
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON public.subscriptions(stripe_customer_id);
```

---

### 3. `leads`

**Zweck:** CRM-Leads (aus crmStore)

```sql
CREATE TABLE public.leads (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- User Reference
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Lead Data (v2 Schema)
  name TEXT NOT NULL,
  contact TEXT NOT NULL, -- Email oder Telefon
  type TEXT NOT NULL CHECK (type IN ('mieten', 'kaufen', 'verkaufen')),
  status TEXT NOT NULL CHECK (status IN ('neu', 'warm', 'cold', 'vip')),

  -- Optional Fields
  location TEXT,
  budget TEXT,
  notes TEXT,

  -- Metadata
  _v INTEGER DEFAULT 2, -- Version (für Migration-Tracking)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own leads"
  ON public.leads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own leads"
  ON public.leads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads"
  ON public.leads FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own leads"
  ON public.leads FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_leads_user_id ON public.leads(user_id);
CREATE INDEX idx_leads_status ON public.leads(user_id, status);
CREATE INDEX idx_leads_created_at ON public.leads(user_id, created_at DESC);

-- Trigger: Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
```

---

### 4. `exposes`

**Zweck:** Gespeicherte Exposés (aus exposeStore)

```sql
CREATE TABLE public.exposes (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- User Reference
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Expose Data
  title TEXT NOT NULL,        -- Aus formData.address
  address TEXT,
  price TEXT,
  area TEXT,
  rooms TEXT,
  description TEXT,

  -- AI Output
  output TEXT NOT NULL,       -- Generierter AI-Text
  selected_style TEXT NOT NULL CHECK (selected_style IN ('emotional', 'sachlich', 'luxus')),

  -- Form Data (JSON)
  form_data JSONB NOT NULL,   -- Komplettes formData-Objekt

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.exposes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own exposes"
  ON public.exposes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exposes"
  ON public.exposes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exposes"
  ON public.exposes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own exposes"
  ON public.exposes FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_exposes_user_id ON public.exposes(user_id);
CREATE INDEX idx_exposes_created_at ON public.exposes(user_id, created_at DESC);
CREATE INDEX idx_exposes_title ON public.exposes(user_id, title);

-- Trigger: Auto-update updated_at
CREATE TRIGGER exposes_updated_at
  BEFORE UPDATE ON public.exposes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
```

---

### 5. `expose_images`

**Zweck:** Bilder pro Exposé (N:1 Relation)

```sql
CREATE TABLE public.expose_images (
  -- Primary Key
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Foreign Keys
  expose_id UUID NOT NULL REFERENCES public.exposes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Image Data
  storage_path TEXT NOT NULL,  -- Pfad in Supabase Storage
  url TEXT NOT NULL,           -- Public URL
  caption TEXT,                -- Bildunterschrift
  position INTEGER NOT NULL,   -- Reihenfolge (0-based)

  -- Metadata
  file_size INTEGER,           -- Bytes
  mime_type TEXT,              -- image/jpeg, image/png
  width INTEGER,
  height INTEGER,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.expose_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own expose images"
  ON public.expose_images FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own expose images"
  ON public.expose_images FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own expose images"
  ON public.expose_images FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own expose images"
  ON public.expose_images FOR DELETE
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_expose_images_expose_id ON public.expose_images(expose_id);
CREATE INDEX idx_expose_images_user_id ON public.expose_images(user_id);
CREATE INDEX idx_expose_images_position ON public.expose_images(expose_id, position);

-- Constraint: Max 10 Bilder pro Exposé
CREATE OR REPLACE FUNCTION check_max_images_per_expose()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.expose_images WHERE expose_id = NEW.expose_id) >= 10 THEN
    RAISE EXCEPTION 'Max 10 images per expose allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_max_images
  BEFORE INSERT ON public.expose_images
  FOR EACH ROW EXECUTE FUNCTION check_max_images_per_expose();
```

---

## 💾 Supabase Storage

### Bucket: `expose-images`

**Konfiguration:**
```javascript
// Supabase Dashboard → Storage → Create Bucket
{
  name: 'expose-images',
  public: true,
  fileSizeLimit: 5242880, // 5 MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp']
}
```

**RLS Policies:**
```sql
-- Users can upload images
CREATE POLICY "Users can upload own images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'expose-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can view own images
CREATE POLICY "Users can view own images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'expose-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Users can delete own images
CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'expose-images' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

**Folder-Struktur:**
```
expose-images/
  ├─ {user_id}/
  │   ├─ {expose_id}/
  │   │   ├─ image-1.jpg
  │   │   ├─ image-2.jpg
  │   │   └─ ...
```

---

## 🔐 Row-Level Security (RLS)

### Prinzipien

1. **User-Isolation:** Jeder User sieht nur eigene Daten (`auth.uid() = user_id`)
2. **Explizite Policies:** Jede Tabelle hat separate Policies für SELECT, INSERT, UPDATE, DELETE
3. **No Public Access:** Alle Tabellen sind RLS-geschützt (außer `profiles` read-only)

### Beispiel: Lead-Insert-Policy

```sql
-- User kann nur Leads mit eigener user_id erstellen
CREATE POLICY "Users can insert own leads"
  ON public.leads FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

**Funktionsweise:**
- Frontend ruft `supabase.from('leads').insert({ name: '...' })` auf
- Supabase setzt automatisch `user_id = auth.uid()` (via SQL-Funktion)
- Policy prüft `auth.uid() = user_id`
- Insert wird erlaubt ✅

---

## 🔄 Real-Time Sync

### Aktivierung

```sql
-- Enable Realtime für Tabellen
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.exposes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.expose_images;
```

### Frontend-Integration

```typescript
// src/repositories/SupabaseLeadRepository.ts
class SupabaseLeadRepository implements ILeadRepository {
  constructor(private userId: string) {
    // Subscribe to realtime changes
    supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leads',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Lead changed:', payload);
          // Update Zustand Store
          useCRMStore.getState().syncFromSupabase(payload.new);
        }
      )
      .subscribe();
  }

  // ... CRUD methods
}
```

---

## 📦 Migration-Strategie

### Phase 1: Schema Setup

**Tasks:**
1. Erstelle Supabase-Projekt
2. Führe SQL-Skripte aus (Tabellen, RLS, Trigger)
3. Erstelle Storage-Bucket (`expose-images`)
4. Teste RLS-Policies (via Supabase Studio)

---

### Phase 2: Repository-Implementierung

**Tasks:**
1. Implementiere `SupabaseLeadRepository`
2. Implementiere `SupabaseExposeRepository`
3. Schreibe Integration-Tests
4. Teste Real-Time Sync (Multi-Tab)

---

### Phase 3: Daten-Migration

**Konzept:** Export LocalStorage → Import Supabase

```typescript
// Migration-Script (Frontend)
async function migrateLocalStorageToSupabase(userId: string) {
  const localRepo = new LocalStorageLeadRepository();
  const supabaseRepo = new SupabaseLeadRepository();

  // 1. Export aus LocalStorage
  const leads = await localRepo.getAll();
  console.log(`Migrating ${leads.length} leads...`);

  // 2. Import zu Supabase
  for (const lead of leads) {
    await supabaseRepo.create(
      {
        name: lead.name,
        contact: lead.contact,
        type: lead.type,
        status: lead.status,
        location: lead.location,
        budget: lead.budget,
        notes: lead.notes,
      },
      userId
    );
  }

  console.log('Migration complete ✅');

  // 3. Backup erstellen (vor Löschen)
  const backup = await localRepo.exportAsJSON();
  localStorage.setItem('maklermate_migration_backup', backup);

  // 4. LocalStorage leeren (optional)
  // await localRepo.deleteAll();
}
```

---

### Phase 4: Feature-Flag Rollout

**Konzept:** Schrittweise Umstellung

```typescript
// src/repositories/factory.ts
export function createLeadRepository(userId: string): ILeadRepository {
  const useSupabase = featureFlags.useSupabase; // Env-Var oder Remote-Config

  if (useSupabase) {
    return new SupabaseLeadRepository(userId);
  } else {
    return new LocalStorageLeadRepository();
  }
}
```

**Rollout-Plan:**
1. **10% Beta-User** → Feature-Flag aktivieren, Fehler monitoren
2. **50% User** → nach 1 Woche ohne Fehler
3. **100% User** → nach 2 Wochen ohne Fehler
4. **LocalStorage deprecaten** → nach 1 Monat

---

## 🔗 Verwandte Dokumentation

- `docs/architecture/STORAGE-ABSTRACTION.md` - Repository Pattern
- `docs/architecture/APP-INTEGRATION-OVERVIEW.md` - Gesamt-Architektur
- `docs/architecture/USER-CONTEXT-DESIGN.md` - User/Plan-Context
- `PROJECT.md` - Projekt-Übersicht

---

## ✅ Nächste Schritte

1. 🔮 Erstelle Supabase-Projekt (v0.2.x)
2. 🔮 Führe SQL-Migrations-Skripte aus
3. 🔮 Implementiere Supabase-Repositories
4. 🔮 Teste Real-Time Sync
5. 🔮 Implementiere Migration-Script
