# 🏗️ Architecture Documentation – MaklerMate-MVP

**Version:** 1.0  
**Letzte Aktualisierung:** 21. Oktober 2025  
**Projekt:** MaklerMate-MVP (Immobilien-Exposé-Generator)  
**Zweck:** Tech-Stack, API-Verträge, Architektur-Entscheidungen dokumentieren

---

## 📚 Dokumenten-Hierarchie

```
PROJECT.md                      [Primary Source of Truth - Projekt-Übersicht]
  ↓
ARCHITECTURE.md (DIESES DOC)    [Tech-Stack, API-Verträge, Entscheidungen]
  ↓
REPO-IMPROVEMENT-PLAN.md        [3-Sprint-Roadmap, Tasks]
  ↓
README.md                       [Setup-Instructions, Features]
```

**Bei Widersprüchen:** PROJECT.md > ARCHITECTURE.md > README.md

---

## 🎯 System-Übersicht

**MaklerMate** ist eine React-basierte Single-Page-Application (SPA), die KI-gestützte Immobilien-Exposés generiert. Das System besteht aus drei Hauptkomponenten:

```
┌──────────────────────────────────────────────────────────────┐
│                     PRODUCTION (Vercel)                       │
│                                                                │
│  ┌─────────────────┐      ┌──────────────────────────────┐  │
│  │   React Frontend │ ───→ │ Vercel Serverless Function  │  │
│  │   (Static Site)  │      │  /api/generate-expose.js    │  │
│  └─────────────────┘      └──────────────────────────────┘  │
│          │                           │                        │
│          │                           │                        │
│          ↓                           ↓                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Supabase (Auth + Database)                 │   │
│  │  - Authentication (Magic Link, Password)             │   │
│  │  - User Management                                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                                │
│                           ↓                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           OpenAI GPT-4o-mini                         │   │
│  │  - Text-Generierung (Exposé-Beschreibungen)         │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│                 DEVELOPMENT (localhost)                       │
│                                                                │
│  ┌─────────────────┐      ┌──────────────────────────────┐  │
│  │   React Frontend │ ───→ │ Express Dev-Proxy           │  │
│  │   (port 3000)    │      │  server/gpt-proxy.js        │  │
│  └─────────────────┘      │  (port 5001)                 │  │
│          │                 └──────────────────────────────┘  │
│          │                           │                        │
│          │                           ↓                        │
│          │                  ┌─────────────────────────────┐  │
│          │                  │ OpenAI GPT-3.5-turbo        │  │
│          │                  │ (Dev: günstiger als 4o-mini)│  │
│          │                  └─────────────────────────────┘  │
│          ↓                                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Supabase (Auth)                             │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech-Stack

### **Frontend**

| Technologie          | Version | Zweck         | Warum gewählt                                   |
| -------------------- | ------- | ------------- | ----------------------------------------------- |
| **React**            | 19.1.0  | UI-Framework  | Moderne Hooks-API, große Community              |
| **React Router DOM** | 7.6.2   | Navigation    | Standard für React-SPAs, v7 mit Data-APIs       |
| **Create React App** | 5.0.1   | Build-Tool    | Schneller MVP-Start (Migration zu Vite geplant) |
| **Framer Motion**    | 12.23.9 | Animationen   | Deklarative Animationen für UX-Polish           |
| **React Hot Toast**  | 2.4.1   | Notifications | Lightweight User-Feedback                       |

**CSS-Strategie:**

- **CSS-Module** für Component-Styles (scoped, collision-free)
- **Klassisches CSS** für Global-Styles (`theme.css`, `button.css`)
- **Keine UI-Library** (Custom-Components für volle Kontrolle)

### **Backend/API**

#### **Production (Vercel Serverless)**

| Technologie                     | Version | Zweck                                  |
| ------------------------------- | ------- | -------------------------------------- |
| **Vercel Serverless Functions** | -       | API-Endpoint `/api/generate-expose.js` |
| **OpenAI SDK**                  | 5.12.2  | GPT-Integration (GPT-4o-mini)          |
| **Supabase JS**                 | 2.55.0  | Auth-Validation (Session-Check)        |

#### **Development (Express Proxy)**

| Technologie | Version | Zweck                                   |
| ----------- | ------- | --------------------------------------- |
| **Express** | 5.1.0   | Lokaler Dev-Proxy `server/gpt-proxy.js` |
| **Axios**   | 1.7.9   | HTTP-Client für OpenAI-Calls            |
| **dotenv**  | 16.4.7  | Environment-Variablen laden             |
| **CORS**    | 2.8.5   | Cross-Origin Requests erlauben          |

### **Authentication & Database**

| Technologie       | Version     | Zweck                                          |
| ----------------- | ----------- | ---------------------------------------------- |
| **Supabase Auth** | 2.55.0      | Magic-Link, Password-Login, Session-Management |
| **LocalStorage**  | Browser-API | MVP-Daten (Exposés, Leads) – **temporär**      |

**⚠️ Hinweis:** Aktuell werden Exposés und Leads in LocalStorage gespeichert (MVP). Migration zu Supabase-Database geplant (v0.2.0).

### **PDF-Export**

| Technologie         | Version | Zweck                          |
| ------------------- | ------- | ------------------------------ |
| **jsPDF**           | 3.0.1   | PDF-Generierung (Client-Side)  |
| **jspdf-autotable** | 5.0.2   | Tabellen in PDFs               |
| **html2canvas**     | 1.4.1   | Screenshot → PDF (für Preview) |

### **DevTools**

| Technologie  | Version | Zweck                                             |
| ------------ | ------- | ------------------------------------------------- |
| **pnpm**     | 10.13.1 | Package-Manager (schneller als npm)               |
| **Node.js**  | 22.17.0 | Runtime                                           |
| **ESLint**   | 9.20.0  | Linting (CRA-Standard)                            |
| **Prettier** | 3.4.2   | Code-Formatierung (wird in Sprint 1 konfiguriert) |

### **Testing (Libraries vorhanden, aber noch keine Tests)**

| Technologie                   | Version             | Zweck                     |
| ----------------------------- | ------------------- | ------------------------- |
| **@testing-library/react**    | 16.3.0              | Unit-Tests für Components |
| **@testing-library/jest-dom** | 6.6.3               | Custom-Matchers für DOM   |
| **Jest**                      | (via react-scripts) | Test-Runner               |

**Status:** Keine Tests vorhanden (Coverage: 0%). Tests werden in Sprint 2 hinzugefügt (Ziel: 40-50% Coverage).

---

## 📂 Projekt-Struktur (Detailliert)

```
/
├── .github/                       [GitHub-spezifische Config]
│   └── copilot-instructions.md    [Workflow für Copilot]
│
├── api/                           [Vercel Serverless Functions]
│   └── generate-expose.js         [GPT-API (Session-geschützt)]
│
├── build/                         [Production-Build (CRA)]
│   └── ...                        [⚠️ sollte nicht committed sein]
│
├── docs/                          [Projekt-Dokumentation]
│   ├── ARCHITECTURE.md            [DIESES DOKUMENT - Tech-Stack]
│   ├── COPILOT-REPO-ANALYZER-PROMPT.md [Analyzer v1.1]
│   ├── REPO-DISCOVERY-REPORT.md   [Phase 1: Tech-Stack-Analyse]
│   ├── REPO-ANALYSIS-REPORT.md    [Phase 2: Scoring vs. Best-Practice]
│   └── REPO-IMPROVEMENT-PLAN.md   [Phase 3: 3-Sprint-Roadmap]
│
├── public/                        [Statische Assets]
│   ├── index.html                 [SPA-Entry-Point]
│   ├── manifest.json              [PWA-Manifest]
│   └── screenshots/               [App-Screenshots für README]
│
├── server/                        [Lokaler Dev-Proxy]
│   └── gpt-proxy.js               [Express-Server (localhost:5001)]
│
├── src/                           [React-Frontend]
│   ├── components/                [UI-Komponenten]
│   │   ├── CRM/                   [Lead-Management]
│   │   │   ├── CRMCard.jsx
│   │   │   ├── LeadForm.jsx
│   │   │   ├── LeadTable.jsx
│   │   │   └── ...
│   │   │
│   │   ├── AuthButtons.jsx        [Login/Signup-Buttons]
│   │   ├── AuthGate.jsx           [Auth-Wrapper (Protected-Route-Helper)]
│   │   ├── ExposeForm.jsx         [Formular für Immobilien-Daten]
│   │   ├── GPTOutputBox.jsx       [GPT-Text-Anzeige + Actions]
│   │   ├── ImageUpload.jsx        [Bild-Upload + Preview]
│   │   └── ...
│   │
│   ├── context/                   [React-Context]
│   │   └── AuthContext.jsx        [Supabase-Auth-Wrapper]
│   │
│   ├── hooks/                     [Custom-Hooks]
│   │   ├── useAIHelper.js         [GPT-Calls]
│   │   ├── useSavedExposes.js     [LocalStorage-Exposés]
│   │   ├── usePersistentImages.js [LocalStorage-Bilder]
│   │   └── useLocalStorageLeads.js [LocalStorage-Leads]
│   │
│   ├── lib/                       [Client-Side-Libraries]
│   │   ├── openai.js              [GPT-Prompt-Generator]
│   │   └── supabaseClient.js      [Supabase-Init + Validation]
│   │
│   ├── pages/                     [Page-Komponenten]
│   │   ├── Home.jsx               [Landing-Page]
│   │   ├── ExposeTool.jsx         [Haupttool (Exposé-Generator)]
│   │   ├── Login.jsx              [Login/Signup-Page]
│   │   ├── Profile.jsx            [User-Profil]
│   │   ├── ToolHub.jsx            [Tool-Übersicht]
│   │   └── CRM/CRMTool.jsx        [Lead-Management-Page]
│   │
│   ├── routes/                    [Routing-Logik]
│   │   ├── AppShell.jsx           [Layout mit Header/Footer]
│   │   └── ProtectedRoute.jsx     [Auth-Guard für geschützte Routen]
│   │
│   ├── styles/                    [CSS-Module + Global-Styles]
│   │   ├── button.css             [Button-Styles (global)]
│   │   ├── theme.css              [CSS-Variablen (Farben, Fonts)]
│   │   ├── *.module.css           [Component-spezifische Styles]
│   │   └── ...
│   │
│   ├── utils/                     [Helper-Funktionen]
│   │   ├── pdfExport.js           [PDF-Export (Exposé)]
│   │   ├── pdfExportLeads.js      [PDF-Export (Leads)]
│   │   ├── fetchWithAuth.js       [Auth-Token-Injection für Fetch]
│   │   ├── arrayHelpers.js        [Array-Utils (filter, map)]
│   │   └── ...
│   │
│   ├── App.js                     [Main-App-Component (Router)]
│   ├── index.js                   [React-Entry-Point]
│   └── index.css                  [Global-CSS-Reset]
│
├── .env                           [Env-Vars (local, gitignored)]
├── .env.example                   [⚠️ wird in Sprint 1 erstellt]
├── .gitignore                     [Git-Ignore-Rules]
├── LICENSE                        [⚠️ wird in Sprint 1 erstellt]
├── package.json                   [Dependencies + Scripts]
├── pnpm-lock.yaml                 [pnpm-Lock-File]
├── PROJECT.md                     [Primary Source of Truth]
└── README.md                      [Setup-Instructions, Features]
```

---

## 🔗 API-Verträge

### **1. GPT-Text-Generierung (Development)**

**Endpoint:** `POST http://localhost:5001/api/gpt`  
**Datei:** `server/gpt-proxy.js`  
**Zweck:** Lokaler Dev-Proxy für OpenAI-Calls (ohne Supabase-Auth)

**Request:**

```json
{
  "prompt": "Schreibe eine sachliche Beschreibung für eine 3-Zimmer-Wohnung..."
}
```

**Response (Success):**

```json
{
  "result": "Diese moderne 3-Zimmer-Wohnung befindet sich..."
}
```

**Response (Error):**

```json
{
  "error": "GPT-Proxy-Fehler"
}
```

**Environment-Variablen:**

- `OPENAI_API_KEY` (erforderlich)
- `PORT` (optional, default: 5001)

**Auth:** ❌ Keine (nur für Dev!)

**Model:** `gpt-3.5-turbo` (günstiger für Dev)

---

### **2. GPT-Text-Generierung (Production)**

**Endpoint:** `POST https://makler-mate.vercel.app/api/generate-expose`  
**Datei:** `api/generate-expose.js`  
**Zweck:** Session-geschützter GPT-Endpoint für Production

**Request:**

```json
{
  "prompt": "Schreibe eine emotionale Beschreibung für ein Einfamilienhaus..."
}
```

**Headers (Required):**

```
Authorization: Bearer <supabase-access-token>
```

**Response (Success):**

```json
{
  "result": "Willkommen in Ihrem Traumhaus! Dieses charmante Einfamilienhaus..."
}
```

**Response (Error - No Auth):**

```json
{
  "error": "Missing access token"
}
```

**Response (Error - Invalid Session):**

```json
{
  "error": "Invalid session"
}
```

**Response (Error - No Prompt):**

```json
{
  "error": "Missing prompt"
}
```

**Environment-Variablen (Vercel):**

- `OPENAI_API_KEY` (erforderlich)
- `SUPABASE_URL` oder `VITE_SUPABASE_URL` (erforderlich)
- `SUPABASE_ANON_KEY` oder `VITE_SUPABASE_ANON_KEY` (erforderlich)

**Auth:** ✅ Supabase-Session (via Bearer-Token)

**Model:** `gpt-4o-mini` (günstig + schnell, 10× günstiger als GPT-4)

**Sicherheit:**

- Serverless-Funktion läuft auf Vercel (OPENAI_API_KEY bleibt geheim)
- Jeder Request wird gegen Supabase-Session validiert
- User-ID aus Session verfügbar (für zukünftige DB-Speicherung)

---

### **3. Supabase Auth**

**Endpoint:** `https://<projekt>.supabase.co/auth/v1/*`  
**SDK:** `@supabase/supabase-js` (Client: `src/lib/supabaseClient.js`)  
**Zweck:** User-Authentication (Magic-Link, Password-Login)

**Init (Client-Side):**

```javascript
import { createClient } from '@supabase/supabase-js';

const url = process.env.REACT_APP_SUPABASE_URL;
const key = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(url, key);
```

**Auth-Methoden (via AuthContext):**

#### **Sign Up (Password):**

```javascript
const { user, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password',
});
```

#### **Sign In (Password):**

```javascript
const { user, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure-password',
});
```

#### **Sign In (Magic Link):**

```javascript
const { error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: { emailRedirectTo: window.location.origin },
});
```

#### **Sign Out:**

```javascript
await supabase.auth.signOut();
```

#### **Get Session:**

```javascript
const {
  data: { session },
} = await supabase.auth.getSession();
const accessToken = session?.access_token;
```

**Auth-Flow:**

1. User meldet sich an (Login-Page)
2. Supabase generiert Access-Token
3. Token wird in AuthContext gespeichert (State)
4. Frontend sendet Token bei GPT-Calls als `Authorization: Bearer <token>`
5. Serverless-Funktion validiert Token gegen Supabase
6. Wenn valid: GPT-Call erlaubt, sonst 401 Unauthorized

**Environment-Variablen (Frontend):**

- `REACT_APP_SUPABASE_URL` (erforderlich)
- `REACT_APP_SUPABASE_ANON_KEY` (erforderlich, public-safe)

**Sicherheit:**

- ANON_KEY ist public-safe (Row-Level-Security in Supabase)
- Access-Token ist kurzlebig (automatische Refresh via SDK)
- Session wird in LocalStorage gespeichert (via Supabase SDK)

---

## 🏛️ Architektur-Entscheidungen (ADRs)

### **ADR-001: Create React App statt Vite**

**Status:** ✅ Akzeptiert (temporär), Migration geplant

**Kontext:**

- Projekt wurde 2024 gestartet, schneller MVP benötigt
- CRA bietet Zero-Config-Setup (keine Webpack/Vite-Konfiguration)

**Entscheidung:**

- CRA für MVP verwenden (react-scripts 5.0.1)

**Konsequenzen:**

- ✅ Schneller Start (keine Build-Config)
- ✅ Bewährte Toolchain (ESLint, Jest, Webpack vorkonfiguriert)
- ❌ CRA ist Maintenance-Mode seit React 18+ (Team empfiehlt Vite/Next.js)
- ❌ Langsamer Build (Webpack vs. Vite: ~3-5× langsamer)
- ❌ Keine native ESM-Unterstützung

**Alternative:**

- Vite 5.x (schneller Build, moderne ESM-Support)

**Migration-Plan:**

- Sprint 3 (TypeScript-Migration) → parallel zu Vite migrieren
- Aufwand: ~8h (vite.config.js, index.html anpassen, env-vars umbenennen)

**Learnings:**

- README fälschlicherweise behauptet "Vite" → wird in Sprint 1 korrigiert

---

### **ADR-002: Hybrid-Backend (Express + Vercel Serverless)**

**Status:** ✅ Akzeptiert (MVP), Consolidation geplant

**Kontext:**

- Dev-Environment soll ohne Vercel CLI laufen
- Production benötigt Serverless für Skalierbarkeit

**Entscheidung:**

- **Development:** Express-Proxy (`server/gpt-proxy.js`, localhost:5001)
- **Production:** Vercel Serverless (`api/generate-expose.js`)

**Konsequenzen:**

- ✅ Lokale Dev ohne Vercel CLI möglich (einfaches `node server/gpt-proxy.js`)
- ✅ Production nutzt Serverless (skalierbar, kein Server-Management)
- ❌ Code-Duplikation (beide Endpoints machen GPT-Calls)
- ❌ Dev-Proxy hat kein Auth (Sicherheitsrisiko bei versehentlichem Deploy)

**Alternative:**

- Nur Vercel Serverless + `vercel dev` lokal

**Consolidation-Plan:**

- Sprint 2: Shared-Logic extrahieren (`/lib/gptClient.js`)
- Sprint 3: Dev-Proxy entfernen, nur Vercel Serverless nutzen (mit `vercel dev`)

**Workaround (aktuell):**

- Frontend prüft Environment: `process.env.NODE_ENV === 'development'` → localhost:5001, sonst Vercel

---

### **ADR-003: LocalStorage statt Supabase-Database (MVP)**

**Status:** ✅ Akzeptiert (temporär), Migration geplant

**Kontext:**

- MVP-Speed: Keine Backend-Komplexität während Prototyping
- Exposés und Leads müssen gespeichert werden

**Entscheidung:**

- Exposés: LocalStorage (`useSavedExposes.js`)
- Leads: LocalStorage (`useLocalStorageLeads.js`)
- Bilder: LocalStorage Base64 (`usePersistentImages.js`)

**Konsequenzen:**

- ✅ Kein Backend-Setup nötig (schneller MVP-Launch)
- ✅ Offline-fähig (funktioniert ohne Internet nach erstem Load)
- ❌ Daten gehen bei Browser-Clear verloren (kein Backup)
- ❌ Keine Multi-Device-Sync (Desktop-Exposé nicht auf Mobile sichtbar)
- ❌ LocalStorage-Limit: ~5-10MB (bei vielen Bildern problematisch)

**Alternative:**

- Supabase-Database (PostgreSQL via Supabase SDK)

**Migration-Plan:**

- v0.2.0 (nach MVP-Validierung):
  - Supabase-Tabellen: `exposes`, `leads`, `images`
  - Migration-Script: LocalStorage → Supabase (einmaliger Import)
  - UI-Toggle: "Cloud-Sync aktivieren" (opt-in für User)

**Workaround (aktuell):**

- PDF-Export als Backup-Option (User kann Exposés lokal speichern)

---

### **ADR-004: GPT-4o-mini statt GPT-4**

**Status:** ✅ Akzeptiert (MVP), Upgrade bei Bedarf

**Kontext:**

- Text-Qualität muss "gut genug" sein für Exposés
- Kosten-Optimierung wichtig (OpenAI-API teuer bei Volumen)

**Entscheidung:**

- Production: `gpt-4o-mini` (0.15$ / 1M Tokens Input, 0.60$ / 1M Output)
- Development: `gpt-3.5-turbo` (noch günstiger, 0.50$ / 1M Tokens Input)

**Konsequenzen:**

- ✅ 10× günstiger als GPT-4 (wichtig bei Skalierung)
- ✅ Schnellere Response-Zeit (~2-3s vs. GPT-4 ~5-8s)
- ⚠️ Leicht schlechtere Text-Qualität (weniger "kreativ", mehr generisch)
- ⚠️ Weniger Kontext-Verständnis (bei sehr langen Prompts)

**Alternative:**

- GPT-4 (bessere Qualität, aber 10× teurer)
- Claude-3 (vergleichbare Qualität, andere API)

**Upgrade-Kriterien:**

- User-Feedback: "Texte nicht gut genug" (>5 Support-Tickets)
- A/B-Test: GPT-4 vs. GPT-4o-mini (50/50 Split, Qualität messen)

**Optimierung (geplant, Sprint 3):**

- Prompt-Engineering: Bessere Prompts → bessere Texte auch mit 4o-mini
- Temperature-Tuning: 0.7 → 0.5 für sachlichere Texte, 0.9 für emotionale

---

### **ADR-005: CSS-Module statt Tailwind/Styled-Components**

**Status:** ✅ Akzeptiert

**Kontext:**

- MVP benötigt Custom-Design (kein generisches UI-Library-Look)
- Tailwind/Styled-Components → Lernkurve + Overhead

**Entscheidung:**

- CSS-Module für Component-Styles (`.module.css`)
- Klassisches CSS für Global-Styles (`theme.css`, `button.css`)

**Konsequenzen:**

- ✅ Collision-free Styles (automatisches Class-Hashing)
- ✅ Keine Build-Config (CRA unterstützt CSS-Module out-of-the-box)
- ✅ Volle CSS-Kontrolle (keine Framework-Limitierungen)
- ❌ Kein Utility-First-Ansatz (wie Tailwind)
- ❌ Mehr Boilerplate (jede Component braucht eigene CSS-File)

**Alternative:**

- Tailwind CSS (Utility-Classes)
- Styled-Components (CSS-in-JS)

**Review-Kriterium:**

- Wenn Projekt wächst (>50 Components) → Tailwind evaluieren (Sprint 3+)

---

### **ADR-006: pnpm statt npm/yarn**

**Status:** ✅ Akzeptiert

**Kontext:**

- npm: Langsam, viele Duplikate
- yarn: Besser, aber pnpm ist schneller + spart Disk-Space

**Entscheidung:**

- pnpm 10.x als Package-Manager

**Konsequenzen:**

- ✅ 2-3× schneller als npm (bei `pnpm install`)
- ✅ Disk-Space-Optimierung (Symlinks zu Global-Store)
- ✅ Strikte Dependencies (kein Phantom-Dependency-Problem)
- ❌ Nicht jeder Dev kennt pnpm (Onboarding +5 Min)

**Alternative:**

- npm (universell bekannt, aber langsam)
- yarn (schnell, aber weniger Disk-Optimierung)

**Onboarding:**

- README mit pnpm-Install-Link: `npm install -g pnpm`

---

## 🔐 Security & Best-Practices

### **1. Secrets-Management**

**Environment-Variablen (Frontend):**

```bash
# .env (local, gitignored)
REACT_APP_SUPABASE_URL=https://<projekt>.supabase.co
REACT_APP_SUPABASE_ANON_KEY=<anon-key>
```

**Environment-Variablen (Backend/Vercel):**

```bash
# Vercel Dashboard (Environment Variables)
OPENAI_API_KEY=sk-...
SUPABASE_URL=https://<projekt>.supabase.co
SUPABASE_ANON_KEY=<anon-key>
```

**Sicherheits-Checks:**

- ✅ `.gitignore` enthält `.env*` (kein Commit von Secrets)
- ✅ `OPENAI_API_KEY` ist Server-Side-Only (nicht im Frontend)
- ✅ `SUPABASE_ANON_KEY` ist public-safe (Row-Level-Security in Supabase)
- ⚠️ Dev-Proxy (`server/gpt-proxy.js`) hat kein Auth → nur für lokale Dev!

**Geplante Verbesserungen (Sprint 2):**

- Rate-Limiting für GPT-Endpoint (max. 10 Requests/Min pro User)
- Input-Validation (Prompt-Length <5000 Zeichen)
- Logging (Sentry-Integration für Error-Tracking)

---

### **2. Authentication-Flow**

**Aktueller Flow:**

```
1. User besucht /login
2. User gibt E-Mail + Password ein
3. Frontend: supabase.auth.signInWithPassword()
4. Supabase: Session erstellt → Access-Token zurück
5. AuthContext: Token + User in State speichern
6. Protected-Routes werden entsperrt
7. User navigiert zu /expose-tool
8. User generiert Exposé → GPT-Call
9. Frontend: fetch('/api/generate-expose', { headers: { Authorization: 'Bearer <token>' } })
10. Serverless: Token validieren via supabase.auth.getUser()
11. Wenn valid: GPT-Call, sonst 401
```

**Session-Handling:**

- Token wird in LocalStorage gespeichert (via Supabase SDK)
- Token ist kurzlebig (1h), automatische Refresh via SDK
- Logout: `supabase.auth.signOut()` → Token gelöscht

**Sicherheits-Best-Practices:**

- ✅ Row-Level-Security (RLS) in Supabase aktiviert (nur eigene Daten sichtbar)
- ✅ HTTPS enforced (Vercel + Supabase)
- ⚠️ Keine 2FA (geplant für v0.3.0)

---

### **3. Data-Validation**

**Frontend-Validation:**

- Formular-Inputs: `required`, `type="email"`, `pattern` (HTML5)
- Custom-Validation: `zod` (geplant für Sprint 2)

**Backend-Validation:**

- Prompt-Length: <5000 Zeichen (verhindert DoS via lange Prompts)
- Auth-Token: Format-Check (Bearer + JWT-Structure)

**Geplante Verbesserungen:**

- Schema-Validation mit `zod` (Frontend + Backend)
- Sanitization (XSS-Prävention via DOMPurify)

---

## 🚀 Deployment-Strategie

### **Production (Vercel)**

**Deployment-Config:**

- **Trigger:** Push zu `main`-Branch
- **Build-Command:** `pnpm run build`
- **Output-Directory:** `build/`
- **Serverless-Functions:** `api/*.js`

**Environment-Variablen (Vercel Dashboard):**

- `OPENAI_API_KEY`
- `SUPABASE_URL` oder `VITE_SUPABASE_URL`
- `SUPABASE_ANON_KEY` oder `VITE_SUPABASE_ANON_KEY`

**Vercel-Features:**

- ✅ Automatisches HTTPS
- ✅ CDN (Global-Edge-Network)
- ✅ Serverless-Functions (Auto-Scaling)
- ⚠️ Keine Staging-Environment (geplant für Sprint 2)

---

### **Development (localhost)**

**Setup:**

```bash
# 1. Install Dependencies
pnpm install

# 2. Create .env
cp .env.example .env  # (wird in Sprint 1 erstellt)

# 3. Start Dev-Proxy (Terminal 1)
node server/gpt-proxy.js  # → http://localhost:5001

# 4. Start React-Dev-Server (Terminal 2)
pnpm start  # → http://localhost:3000
```

**Hot-Reload:**

- React: ✅ via Webpack-Dev-Server (CRA)
- Express: ❌ manueller Restart (geplant: `nodemon` in Sprint 2)

---

## 📊 Performance-Metriken

**Ziel-Metriken (Web Vitals):**

- **LCP (Largest Contentful Paint):** <2s ✅ (aktuell: ~1.5s)
- **FID (First Input Delay):** <100ms ✅ (aktuell: ~50ms)
- **CLS (Cumulative Layout Shift):** <0.1 ✅ (aktuell: ~0.05)

**Bundle-Size (Production):**

- **main.js:** ~180KB (gzipped) ✅ (<200KB-Target)
- **css:** ~15KB (gzipped) ✅

**Optimierungen:**

- ✅ Code-Splitting via React.lazy (für CRM-Modul)
- ✅ Image-Optimization (WebP + Lazy-Loading geplant)
- ⚠️ Tree-Shaking (via CRA, aber nicht optimal → Vite-Migration hilft)

---

## 🔄 CI/CD-Pipeline (Geplant - Sprint 2)

**GitHub Actions Workflow:**

```yaml
name: CI/CD

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm test -- --watchAll=false
      - run: pnpm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - run: echo "Vercel auto-deploys on push to main"
```

**Branch-Protection (geplant):**

- ✅ Tests müssen passen (wenn Tests vorhanden)
- ✅ Mindestens 1 Approval (bei Team-Arbeit)
- ✅ Kein direkter Push zu `main` (nur via PR)

---

## 📝 Nächste Schritte (Post-Sprint-1)

**Sprint 2 (Testing + CI/CD):**

- Unit-Tests für `arrayHelpers`, `pdfExport`, `fetchWithAuth`
- Integration-Tests für GPT-API (Mock OpenAI)
- GitHub Actions CI/CD
- Docker-Compose für Dev-Environment

**Sprint 3 (TypeScript + E2E):**

- TypeScript-Migration (Strict-Mode)
- E2E-Tests mit Playwright (Login → Exposé → PDF)
- Vite-Migration (CRA → Vite)

**v0.2.0 (Supabase-Database):**

- Migration: LocalStorage → Supabase-Tables
- Real-Time-Sync (Exposés über Devices hinweg)
- Offline-First mit Supabase-Realtime

---

## 📚 Weiterführende Ressourcen

**Projekt-Docs:**

- `PROJECT.md` → Projekt-Übersicht, Features, Roadmap
- `REPO-IMPROVEMENT-PLAN.md` → 3-Sprint-Roadmap
- `.github/copilot-instructions.md` → Workflow für Copilot

**Externe Docs:**

- React 19: https://react.dev/
- Supabase Auth: https://supabase.com/docs/guides/auth
- OpenAI API: https://platform.openai.com/docs
- Vercel Deployment: https://vercel.com/docs

**Team-Kontakt:**

- GitHub: https://github.com/M-Sieger/MaklerMate-MVP
- Issues: https://github.com/M-Sieger/MaklerMate-MVP/issues

---

**Ende ARCHITECTURE.md** ✅

→ Neue Devs sollten dieses Dokument in <15 Min lesen können  
→ Bei Fragen zu Tech-Stack/APIs: Dieses Dokument ist die Referenz  
→ Bei Architektur-Änderungen: Dieses Dokument updaten (ADR hinzufügen)
