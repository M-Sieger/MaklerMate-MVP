# MaklerMate-MVP – Project Overview (Primary Source of Truth)

**Letzte Aktualisierung:** 15. November 2025
**Version:** 0.1.0 (MVP)
**Status:** Sprint 1-3 Abgeschlossen ✅ | TypeScript Migration 100% ✅ | Test Coverage 90.27% ✅
**Live-Demo:** [makler-mate.vercel.app](https://makler-mate.vercel.app/)

---

## 🎯 Projekt-Mission

**MaklerMate** ist ein KI-gestützter Immobilien-Exposé-Generator, der Maklern in wenigen Minuten professionelle, druckfertige Exposés erstellt – automatisch, stilvoll und als PDF.

**Zielgruppe:** Immobilienmakler, Property-Manager, Vermieter

**Unique Selling Point:**

- GPT-Integration für stilvolle Beschreibungstexte (sachlich, emotional, Luxus)
- PDF-Export mit Bildern und Captions
- CRM-Light für Lead-Verwaltung
- Offline-fähig (LocalStorage für MVP)

---

## 🚀 Features (MVP v0.1.0)

### **Haupt-Features:**

1. **Exposé-Generator** 📑
   - Formular für Immobilien-Daten (Adresse, Zimmer, Preis, etc.)
   - GPT-Integration (OpenAI GPT-4o-mini) für Beschreibungstexte
   - Stilwahl: Sachlich, Emotional, Luxus
   - Bild-Upload mit Captions
   - LocalStorage für gespeicherte Exposés

2. **PDF-Export** 📄
   - Druckfertiges PDF mit jsPDF
   - Bilder + Captions eingebettet
   - CSV-Export für Daten

3. **CRM-Light** 👥
   - Lead-Verwaltung (Name, E-Mail, Telefon)
   - Status-Tracking (VIP, Warm, Neu)
   - LocalStorage-basiert (MVP)

4. **Auth-System** 🔐
   - Supabase Auth (Magic-Link, Password-Login)
   - Protected Routes für Exposé-Erstellung
   - Profile-Page (User-Daten ändern)

### **Geplante Features (Roadmap):**

- Supabase-Backend (persistente Speicherung statt LocalStorage)
- Stripe-Integration (Subscription-Modell)
- Social-Media-Content-Generator (aus Objektdaten)
- Internationalisierung (EN/DE, später KE/UK)

---

## 🏗️ Tech-Stack

### **Frontend:**

- **React 19.1.0** (Funktionale Komponenten + Hooks)
- **TypeScript 5.x** (100% Migration abgeschlossen - alle .js/.jsx → .ts/.tsx)
- **Create React App 5.0.1** (Build-Tool, später Migration zu Vite geplant)
- **React Router DOM 7.6.2** (Navigation)
- **Zustand 5.0.2** (State Management mit Persist Middleware)
- **Framer Motion 12.23.9** (Animationen)
- **CSS-Module** (Component-Styles) + klassisches CSS (Global-Styles)

### **Backend/API:**

- **Express 5.1.0** (Lokaler Dev-Proxy: `server/gpt-proxy.js`)
- **Vercel Serverless** (Production-API: `api/generate-expose.js`)
- **OpenAI 5.12.2** (GPT-Integration)
- **Supabase 2.55.0** (Auth + DB)

### **PDF-Export:**

- **jsPDF 3.0.1** (PDF-Generierung)
- **jspdf-autotable 5.0.2** (Tabellen in PDFs)
- **html2canvas 1.4.1** (Screenshot → PDF)

### **DevTools:**

- **pnpm 10.13.1** (Package-Manager)
- **Node.js 22.17.0** (Runtime)
- **TypeScript 5.x** (Strict Mode)
- **ESLint** (Linting mit TypeScript-Plugin)
- **Prettier** (Code-Formatierung)
- **Husky + lint-staged** (Pre-Commit-Hooks)

### **Testing (90.27% Coverage - 223 Tests):**

- **Vitest** (Unit Testing Framework - schneller als Jest)
- **@testing-library/react 16.3.0** (Component Tests)
- **@testing-library/user-event** (User Interaction Testing)
- **@testing-library/jest-dom 6.6.3** (Custom Matchers)
- **Playwright 1.49.1** (E2E Testing - 36 Tests)
- **@vitest/coverage-v8** (Code Coverage Reports)

**Test-Suites:**
- ✅ Store Tests: crmStore, exposeStore (100% Coverage)
- ✅ Utility Tests: leadHelpers (98.68% Coverage)
- ✅ Service Tests: LeadsStorageService, exportService, pdfService
- ✅ Component Tests: LeadForm, LeadRow, AuthGate, ImageUpload
- ✅ E2E Tests: Authentication, Exposé-Erstellung, CRM, PDF-Export

### **CI/CD:**

- **Vercel** (Deployment, automatisch bei Push zu main)
- **GitHub Actions** (Vollständige CI/CD-Pipeline):
  - ✅ Unit Tests (Vitest)
  - ✅ E2E Tests (Playwright)
  - ✅ Type-Check (TypeScript)
  - ✅ Build-Verification
  - ✅ Code Coverage Reports

---

## 📂 Projekt-Struktur

```
/
├── .github/
│   └── copilot-instructions.md    [Workflow für Copilot]
│
├── api/                            [Vercel Serverless Functions]
│   └── generate-expose.js          (OpenAI GPT, Session-geschützt)
│
├── build/                          [Production-Build (CRA)]
│   └── ...                         (sollte nicht committed sein, TODO)
│
├── docs/                           [Projekt-Dokumentation]
│   ├── REPO-DISCOVERY-REPORT.md    (Phase 1: Tech-Stack-Analyse)
│   ├── REPO-ANALYSIS-REPORT.md     (Phase 2: Scoring vs. 360Volt)
│   ├── REPO-IMPROVEMENT-PLAN.md    (Phase 3: 3-Sprint-Roadmap)
│   └── ARCHITECTURE.md             (wird in Sprint 1 erstellt)
│
├── public/                         [Statische Assets]
│   ├── index.html
│   ├── manifest.json
│   └── screenshots/
│
├── server/                         [Lokaler Express-Proxy]
│   └── gpt-proxy.js                (Dev-Server für OpenAI, localhost:5001)
│
├── src/                            [React-Frontend]
│   ├── components/                 (UI-Komponenten)
│   │   ├── CRM/                    (Lead-Management)
│   │   ├── ExposeForm.jsx
│   │   ├── GPTOutputBox.jsx
│   │   └── ...
│   │
│   ├── context/                    (React-Context)
│   │   └── AuthContext.jsx         (Supabase-Auth-Wrapper)
│   │
│   ├── hooks/                      (Custom-Hooks)
│   │   ├── useAIHelper.js          (GPT-Calls)
│   │   ├── useSavedExposes.js      (LocalStorage-Exposés)
│   │   └── ...
│   │
│   ├── lib/                        (Client-Side-Libraries)
│   │   ├── openai.js               (GPT-Prompt-Generator)
│   │   └── supabaseClient.js       (Supabase-Init)
│   │
│   ├── pages/                      (Page-Komponenten)
│   │   ├── ExposeTool.jsx
│   │   ├── Home.jsx
│   │   ├── CRM/CRMTool.jsx
│   │   └── ...
│   │
│   ├── routes/                     (Routing-Logik)
│   │   ├── AppShell.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── styles/                     (CSS-Module + Global-Styles)
│   │   ├── button.css
│   │   ├── theme.css
│   │   └── ...
│   │
│   ├── utils/                      (Helper-Funktionen)
│   │   ├── pdfExport.js
│   │   ├── fetchWithAuth.js
│   │   └── ...
│   │
│   └── App.js                      (Main-App-Component)
│
├── .env.example                    [wird in Sprint 1 erstellt]
├── .gitignore
├── LICENSE                         [wird in Sprint 1 erstellt]
├── package.json
├── pnpm-lock.yaml
├── PROJECT.md                      [DIESES DOKUMENT - Primary SoT]
└── README.md
```

---

## 🎯 Sprint-Status

### **Sprint 1 (Quick Wins) - ✅ Abgeschlossen**

**Ziel:** Kritische Docs + Code-Quality-Basics etablieren

**Tasks:**
1. ✅ Copilot-Instructions erstellt (`.github/copilot-instructions.md`)
2. ✅ ARCHITECTURE.md erstellt (Tech-Stack, API-Verträge, ADRs)
3. ✅ .env.example erstellt (vollständige Env-Var-Dokumentation)
4. ✅ Pre-Commit-Hooks eingerichtet (Husky + lint-staged + Prettier)
5. ✅ LICENSE hinzugefügt (MIT)
6. ✅ README korrigiert (Script-Namen, Tech-Stack, Setup)

**Ergebnis:** Score 3.8/10 → 5.5/10 (+1.7)

### **Sprint 2 (Testing + CI/CD) - ✅ Abgeschlossen**

**Ziel:** Test-Coverage + Automatisierung

**Tasks:**
1. ✅ Unit-Tests implementiert (145 Tests - Stores, Utils, Services)
2. ✅ Component-Tests implementiert (78 Tests - React Testing Library)
3. ✅ E2E-Tests mit Playwright (36 Tests)
4. ✅ GitHub Actions CI/CD Pipeline (Tests, Build, Type-Check)
5. ✅ Code Coverage auf 90.27% erhöht
6. ✅ Vitest-Migration (von Jest zu Vitest für bessere Performance)

**Ergebnis:** Score 5.5/10 → 7.2/10 (+1.7)

### **Sprint 3 (TypeScript + E2E) - ✅ Abgeschlossen**

**Ziel:** 100% TypeScript Migration + Strikte Type-Safety

**Tasks:**
1. ✅ TypeScript-Migration auf 100% (alle .js/.jsx → .ts/.tsx)
2. ✅ Zustand Stores implementiert (crmStore, exposeStore)
3. ✅ Strikte Type-Safety (tsconfig.json mit strict: true)
4. ✅ TypeScript-Interfaces für alle Datenstrukturen
5. ✅ E2E-Tests mit Playwright erweitert
6. ✅ Services-Layer Pattern implementiert

**Ergebnis:** Score 7.2/10 → 8.3/10 (+1.1)

### **Aktueller Stand:**

- ✅ TypeScript Migration: 100%
- ✅ Test Coverage: 90.27% (223 Tests)
- ✅ CI/CD Pipeline: Vollständig automatisiert
- ✅ Code Quality: Production-Ready

---

## 📊 Scoring-Status (vs. 360Volt-Benchmark 8.5/10)

**Aktuell (vor Sprint 1):** 3.8/10

| Kategorie      | Score | Benchmark | Delta |
| -------------- | ----- | --------- | ----- |
| Dokumentation  | 4/10  | 10/10     | -6    |
| Ordnerstruktur | 7/10  | 9/10      | -2    |
| Type-Safety    | 2/10  | 10/10     | -8    |
| Testing        | 1/10  | 7/10      | -6    |
| Git-Workflow   | 5/10  | 9/10      | -4    |
| CI/CD          | 1/10  | 3/10      | -2    |
| Code-Quality   | 4/10  | 8/10      | -4    |
| Environment    | 3/10  | 5/10      | -2    |

**Roadmap:**

- Sprint 1 (Quick Wins): 3.8 → 5.5 (+1.7)
- Sprint 2 (Testing + CI/CD): 5.5 → 6.8 (+1.3)
- Sprint 3 (TypeScript + E2E): 6.8 → 8.0 (+1.2)

---

## 🔑 Architektur-Entscheidungen (ADRs)

### **ADR-001: Create React App (CRA) statt Vite**

**Status:** Akzeptiert (MVP), Migration geplant  
**Kontext:** Schneller MVP-Start benötigt  
**Entscheidung:** CRA für initiales Setup  
**Konsequenzen:**

- ✅ Schneller Start (keine Config)
- ❌ Langsamer Build (vs. Vite)
- ❌ CRA ist Maintenance-Mode seit React 18+
- **Migration zu Vite geplant:** Sprint 3 (TypeScript-Migration)

### **ADR-002: Zwei Backend-Endpoints (server + api)**

**Status:** Akzeptiert (Hybrid-Setup)  
**Kontext:** Lokale Dev vs. Production-Deployment  
**Entscheidung:**

- `server/gpt-proxy.js`: Express für lokale Dev (localhost:5001)
- `api/generate-expose.js`: Vercel Serverless für Production
  **Konsequenzen:**
- ✅ Lokale Dev ohne Vercel CLI möglich
- ✅ Production nutzt Serverless (skalierbar)
- ❌ Code-Duplikation (beide Endpoints machen GPT-Calls)
- **TODO:** Shared-Logic extrahieren (Sprint 2)

### **ADR-003: LocalStorage statt Supabase-DB (MVP)**

**Status:** Temporär (wird in v0.2.0 ersetzt)  
**Kontext:** MVP-Speed, keine Backend-Komplexität  
**Entscheidung:** Exposés + Leads in LocalStorage  
**Konsequenzen:**

- ✅ Kein Backend-Setup nötig
- ✅ Offline-fähig
- ❌ Daten gehen bei Browser-Clear verloren
- ❌ Keine Multi-Device-Sync
- **Migration zu Supabase-DB:** v0.2.0 (nach MVP-Validierung)

### **ADR-004: OpenAI GPT-4o-mini (statt GPT-4)**

**Status:** Akzeptiert  
**Kontext:** Kosten-Optimierung  
**Entscheidung:** GPT-4o-mini für Exposé-Texte  
**Konsequenzen:**

- ✅ 10× günstiger als GPT-4
- ✅ Schnellere Response-Zeit
- ⚠️ Leicht schlechtere Text-Qualität (akzeptabel für MVP)
- **Upgrade zu GPT-4:** Nur bei User-Feedback "Texte nicht gut genug"

---

## 🔐 Secrets & Environment-Variablen

**Benötigte Env-Vars (siehe `.env.example`):**

### **Frontend (Client-Side, REACT*APP* Präfix):**

- `REACT_APP_SUPABASE_URL`: Supabase-Projekt-URL
- `REACT_APP_SUPABASE_ANON_KEY`: Supabase Anonymous-Key (public, safe)

### **Backend (Server-Side, für server/gpt-proxy.js):**

- `OPENAI_API_KEY`: OpenAI API-Key (geheim!)
- `PORT`: Express-Server-Port (default: 5001)

### **Vercel (Serverless, für api/generate-expose.js):**

- `OPENAI_API_KEY`: (gleicher wie oben)
- `SUPABASE_URL` oder `VITE_SUPABASE_URL`
- `SUPABASE_ANON_KEY` oder `VITE_SUPABASE_ANON_KEY`

**Sicherheit:**

- ✅ `.gitignore` enthält `.env*` (Secrets werden nicht committed)
- ✅ Serverless-API prüft Supabase-Session (Auth-Layer)
- ⚠️ Lokaler Proxy hat kein Auth (nur für Dev gedacht)

---

## 🧪 Testing-Strategie ✅ Abgeschlossen

**Status:** 90.27% Code Coverage | 223 Tests passing | E2E mit Playwright

### **Unit Tests (145 Tests - Vitest):**

**Stores (100% Coverage):**
- ✅ `crmStore.test.ts` - 21 Tests (CRUD, Filter, Search, Statistics, Import/Export)
- ✅ `exposeStore.test.ts` - 25 Tests (Form, Images, Captions, Saved Exposés)

**Utils (98.68% Coverage):**
- ✅ `leadHelpers.test.ts` - 54 Tests (Normalization, Migration, Validation, Sorting, Filtering)

**Services (83.39% Coverage):**
- ✅ `LeadsStorageService.test.ts` - 18 Tests (LocalStorage Operations)
- ✅ `exportService.test.ts` - 12 Tests (JSON/CSV Export, Clipboard)
- ✅ `pdfService.test.ts` - 15 Tests (PDF Generation, Page Layout)

### **Component Tests (78 Tests - React Testing Library):**

- ✅ `LeadForm.test.tsx` - 17 Tests (Form Validation, Submission, Loading States)
- ✅ `LeadRow.test.tsx` - 19 Tests (Status Cycling, Delete, Rendering)
- ✅ `AuthGate.test.tsx` - 15 Tests (Auth States, Navigation)
- ✅ `ImageUpload.test.tsx` - 27 Tests (Upload, Reorder, Captions, Max Limit)

### **E2E Tests (36 Tests - Playwright):**

- ✅ Authentication Flows (Login, Logout, Protected Routes)
- ✅ Exposé-Erstellung (Formular, GPT-Generierung, PDF-Export)
- ✅ CRM-Funktionalität (Lead-Management, Status-Updates)
- ✅ Image-Upload & Gallery-Management

### **Coverage-Breakdown:**

| Kategorie | Coverage | Tests |
|-----------|----------|-------|
| **Stores** | 100% | 46 |
| **Utils** | 98.68% | 54 |
| **Components** | 89.39% | 78 |
| **Services** | 83.39% | 45 |
| **Overall** | **90.27%** | **223** |

---

## 🚀 Deployment

**Production:** Vercel (makler-mate.vercel.app)  
**Deployment:** Automatisch bei Push zu `main`

**Vercel-Config (implizit):**

- Build-Command: `pnpm run build`
- Output-Directory: `build/`
- Serverless-Functions: `api/*.js`

**Staging:** Nicht konfiguriert (TODO: Vercel Preview-Deployments nutzen)

---

## 📝 Git-Workflow

**Branch-Strategie:** Trunk-Based (main als Primary-Branch)

**Commit-Convention:** Conventional Commits

```bash
feat: add new feature
fix: bug fix
docs: documentation changes
test: add tests
refactor: code refactoring
chore: maintenance tasks
```

**Branch-Naming:**

- `feature/feature-name`
- `bugfix/bug-name`
- `docs/doc-name`

**Pull-Request-Prozess (wird in Sprint 1 etabliert):**

1. Branch erstellen
2. Änderungen committen (Conventional Commits)
3. PR öffnen (gegen `main`)
4. CI-Tests laufen (Sprint 2+)
5. Review (optional, bei Team-Arbeit)
6. Merge (Squash-Merge empfohlen)

---

## 📚 Wichtige Links

**Live-Demo:** https://makler-mate.vercel.app/  
**GitHub-Repo:** https://github.com/M-Sieger/MaklerMate-MVP  
**Supabase-Dashboard:** (privat)  
**OpenAI-Dashboard:** (privat)

**Dokumentation:**

- `docs/REPO-IMPROVEMENT-PLAN.md` → 3-Sprint-Roadmap
- `docs/REPO-ANALYSIS-REPORT.md` → Scoring vs. 360Volt
- `docs/ARCHITECTURE.md` → Tech-Stack (wird in Sprint 1 erstellt)
- `.github/copilot-instructions.md` → Workflow für Copilot

---

## ✅ Acceptance Criteria (Sprint 1 Completion)

Sprint 1 ist abgeschlossen, wenn:

- [ ] `.github/copilot-instructions.md` existiert ✅ DONE
- [ ] `PROJECT.md` existiert ✅ DONE
- [ ] `docs/ARCHITECTURE.md` existiert
- [ ] `.env.example` existiert
- [ ] `LICENSE` existiert
- [ ] Pre-Commit-Hooks laufen (Husky + lint-staged)
- [ ] README korrigiert (Script-Namen, Tech-Stack, Setup)
- [ ] Score: 3.8/10 → 5.5/10 (+1.7)

**Dann:** Sprint 2 starten oder Pause für Review

---

## 🔄 Changelog (PROJECT.md Updates)

**v1.0 (21.10.2025):**

- Initial Release nach Phase 3 (Planning)
- Sprint 1 gestartet (Task 1: Copilot-Instructions)
- ADRs dokumentiert (CRA, Hybrid-Backend, LocalStorage, GPT-4o-mini)

**Nächstes Update:** Nach Sprint 1 (Score-Update, neue ADRs wenn nötig)

---

**Ende PROJECT.md** ✅

→ Dieses Dokument ist die **Primary Source of Truth**  
→ Bei Widersprüchen zu anderen Docs: PROJECT.md hat Vorrang  
→ Updates: Nach jedem Sprint oder bei größeren Architektur-Änderungen
