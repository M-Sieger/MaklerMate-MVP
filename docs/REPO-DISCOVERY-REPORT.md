# Repo-Discovery-Report

**Projekt:** MaklerMate-MVP  
**Analysiert am:** 21. Oktober 2025  
**Methode:** COPILOT-REPO-ANALYZER (Phase 1)  
**Rolle:** 🔍 Repository Archaeologist

---

## Tech-Stack

### **Sprachen**

- **JavaScript/TypeScript:** React 19 (Frontend), Node.js v22.17.0 (Runtime)
- **Build-Tools:** react-scripts 5.0.1 (Create React App)
- **Package-Manager:** pnpm 10.13.1 (lockfile vorhanden)

### **Frameworks & Libraries**

**Frontend:**

- React 19.1.0 + React-DOM 19.1.0
- React Router DOM 7.6.2 (Navigation)
- Framer Motion 12.23.9 (Animationen)
- Swiper 11.2.8 (Slider/Gallery)

**Backend/API:**

- Express 5.1.0 (Server-Proxy unter `server/`)
- OpenAI 5.12.2 (GPT-Integration)
- Axios 1.10.0 (HTTP-Client)
- CORS 2.8.5 (Cross-Origin-Requests)

**Auth & Database:**

- @supabase/supabase-js 2.55.0 (Authentication + DB-Client)

**PDF-Export:**

- jsPDF 3.0.1 (PDF-Generierung)
- jspdf-autotable 5.0.2 (Tabellen in PDFs)
- html2canvas 1.4.1 (Screenshot → PDF)

**UI/Toast:**

- react-hot-toast 2.5.2
- react-toastify 11.0.5

**Testing (Libraries vorhanden, aber nicht aktiv genutzt):**

- @testing-library/react 16.3.0
- @testing-library/jest-dom 6.6.3
- @testing-library/user-event 13.5.0
- @testing-library/dom 10.4.0

**Dev-Tools:**

- dotenv 16.6.1 (Environment-Variablen)
- dotenv-cli 10.0.0 (DevDependency)

### **Datenbank**

- Supabase (PostgreSQL-basiert, remote)
- LocalStorage (für Exposés und Leads im MVP-Stadium)

---

## Ordnerstruktur

```
/
├── api/                      [Vercel Serverless Functions]
│   └── generate-expose.js    (OpenAI-GPT-Integration, Session-geschützt)
│
├── build/                    [Production-Build (CRA)]
│   ├── index.html
│   ├── static/
│   │   ├── css/
│   │   └── js/
│   └── screenshots/
│
├── public/                   [Statische Assets]
│   ├── index.html
│   ├── manifest.json
│   ├── robots.txt
│   └── screenshots/
│
├── server/                   [Lokaler Express-Proxy]
│   └── gpt-proxy.js          (Dev-Server für OpenAI-Calls, localhost:5001)
│
├── src/                      [React-Frontend]
│   ├── components/           (UI-Komponenten)
│   │   ├── CRM/              (Lead-Management-Komponenten)
│   │   ├── AuthButtons.jsx
│   │   ├── AuthGate.jsx
│   │   ├── ExposeForm.jsx
│   │   ├── ExportButtons.jsx
│   │   ├── GPTOutputBox.jsx
│   │   ├── Header.jsx
│   │   ├── Hero.jsx
│   │   ├── ImageUpload.jsx
│   │   ├── SavedExposes.jsx
│   │   ├── TabbedForm.jsx
│   │   └── ...
│   │
│   ├── context/              (React-Context)
│   │   └── AuthContext.jsx   (Supabase-Auth-Wrapper)
│   │
│   ├── hooks/                (Custom-Hooks)
│   │   ├── useAIHelper.js
│   │   ├── useLocalStorageLeads.js
│   │   ├── usePersistentImages.js
│   │   └── useSavedExposes.js
│   │
│   ├── lib/                  (Client-Side-Libraries)
│   │   ├── openai.js         (GPT-Prompt-Generator + Fetch-Wrapper)
│   │   └── supabaseClient.js (Supabase-Init mit ENV-Checks)
│   │
│   ├── pages/                (Page-Komponenten)
│   │   ├── CRM/              (CRMTool.jsx)
│   │   ├── ExposeTool.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   └── ToolHub.jsx
│   │
│   ├── routes/               (Routing-Logik)
│   │   ├── AppShell.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── styles/               (CSS-Module)
│   │   ├── button.css
│   │   ├── ExportActions.module.css
│   │   ├── ExposeTool.css
│   │   ├── Layout.module.css
│   │   ├── TabbedForm.module.css
│   │   ├── theme.css
│   │   └── ...
│   │
│   ├── utils/                (Helper-Funktionen)
│   │   ├── arrayHelpers.js
│   │   ├── crmExport.js
│   │   ├── crmExportExpose.js
│   │   ├── crmExportLeads.js
│   │   ├── fetchWithAuth.js  (Supabase-Token-Injection)
│   │   ├── imageEnhancer.js
│   │   ├── pdfExport.js
│   │   ├── pdfExportExpose.js
│   │   └── pdfExportLeads.js
│   │
│   ├── App.css
│   ├── App.js                (Main-App-Component)
│   ├── fonts.css
│   ├── index.css
│   └── index.js              (React-Entry-Point)
│
├── .gitignore                (✅ enthält .env, .env.local, build/, node_modules/)
├── package.json              (Scripts: start, build, test, proxy)
├── pnpm-lock.yaml            (pnpm-Lockfile)
├── README.md                 (Basic-Setup-Instructions)
├── clean-maklermate.sh       (Cleanup-Script)
├── start.sh                  (Start-Script)
└── mv                        (?)
```

**Besonderheiten:**

- **Hybride Architektur:** Lokaler Express-Proxy (`server/gpt-proxy.js`) + Vercel Serverless (`api/generate-expose.js`)
- **Build-Artefakte committed:** `build/` Ordner ist im Repo (sollte normalerweise in `.gitignore`)
- **Keine TypeScript:** Reines JavaScript-Projekt (trotz React 19)
- **CSS-Module + klassisches CSS gemischt:** Einige Komponenten nutzen `.module.css`, andere plain `.css`

---

## Dependencies (Auszug)

### **Frontend (package.json)**

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.55.0",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.6.2",
    "framer-motion": "^12.23.9",
    "openai": "^5.12.2",
    "axios": "^1.10.0",
    "jspdf": "^3.0.1",
    "jspdf-autotable": "^5.0.2",
    "html2canvas": "^1.4.1",
    "swiper": "^11.2.8",
    "react-hot-toast": "^2.5.2",
    "react-toastify": "^11.0.5"
  },
  "devDependencies": {
    "dotenv-cli": "^10.0.0"
  }
}
```

### **Server (server/gpt-proxy.js Imports)**

- express 5.1.0
- cors 2.8.5
- dotenv 16.6.1
- axios 1.10.0

### **API (api/generate-expose.js Imports)**

- @supabase/supabase-js (dynamic import)
- OpenAI API (native fetch)

### **Sicherheitskritische Dependencies:**

- `openai` 5.12.2 (relativ aktuell, aber Breaking-Changes möglich)
- `react-scripts` 5.0.1 (CRA, wartungsarm seit React 18+)
- `node-fetch` 3.3.2 (wird für native fetch depreciert, aber noch in pnpm-lock)

---

## Vorhandene Dokumentation

### **✅ Vorhanden:**

1. **README.md** (47 Zeilen)
   - Projekt-Übersicht (Features, Tech-Stack, Installation)
   - Live-Demo-Link (Vercel: makler-mate.vercel.app)
   - Environment-Variablen-Hinweis (`.env` nicht im Repo)
   - Roadmap (Supabase Auth, Stripe, CRM-Erweiterung)
   - License-Hinweis (MIT License – siehe LICENSE)

### **❌ Fehlend:**

- **ARCHITECTURE.md** (Tech-Stack-Details, API-Verträge, Architektur-Entscheidungen)
- **CONTRIBUTING.md** (Wie man beiträgt, Code-Style, PR-Prozess)
- **CHANGELOG.md** (Git-History dokumentiert)
- **CODE_OF_CONDUCT.md** (Community-Guidelines)
- **LICENSE** (Datei nicht lesbar/vorhanden, obwohl README darauf verweist)
- **.env.example** (Erwähnt in README, aber Datei fehlt)
- **.github/copilot-instructions.md** (Workflow für Copilot)
- **/docs/** Ordner (keine strukturierte Dokumentation)
- **API-Dokumentation** (Swagger/OpenAPI für `/api/generate-expose`)

### **README-Analyse:**

- **Stärken:** Klar strukturiert, Features gelistet, Live-Demo verlinkt
- **Schwächen:**
  - Installation: "pnpm install" + "pnpm run dev", aber `package.json` hat kein `dev`-Script (nur `start`)
  - Tech-Stack sagt "Vite", aber Projekt nutzt CRA (`react-scripts`)
  - Environment-Variablen-Beispiel ist inline-Text, keine separate `.env.example`-Datei

---

## Tests

### **Test-Infrastruktur:**

- ✅ Testing-Libraries installiert:
  - `@testing-library/react` 16.3.0
  - `@testing-library/jest-dom` 6.6.3
  - `@testing-library/user-event` 13.5.0
  - `@testing-library/dom` 10.4.0
- ✅ Test-Script vorhanden: `"test": "react-scripts test"` (CRA-Standard)
- ✅ ESLint-Config: `"eslintConfig": { "extends": ["react-app", "react-app/jest"] }`

### **Test-Dateien:**

- ❌ Keine `*.test.js` oder `*.spec.js` Dateien gefunden (semantic_search ergab keine Treffer)
- ❌ Kein `/tests/` Ordner
- ❌ Kein `__tests__/` Ordner
- ❌ Keine E2E-Tests (Playwright, Cypress)

### **Coverage:**

- ❌ Keine Coverage-Reports gefunden (`.coverage/`, `coverage/`)
- ❌ Kein Coverage-Badge in README

**Fazit:** Testing-Infrastruktur vorhanden, aber keine Tests geschrieben.

---

## CI/CD & DevOps

### **GitHub Actions:**

- ❌ Keine `.github/workflows/` Dateien gefunden
- ❌ Kein CI für Tests, Lint, Build

### **GitLab CI:**

- ❌ Keine `.gitlab-ci.yml`

### **Docker:**

- ❌ Kein `Dockerfile`
- ❌ Kein `docker-compose.yml`

### **Deployment:**

- ✅ Vercel-Deployment aktiv (Live-Demo: makler-mate.vercel.app)
- ⚠️ Keine dokumentierte Deployment-Pipeline
- ⚠️ Keine Staging-Environment erwähnt

### **Pre-Commit-Hooks:**

- ❌ Kein Husky
- ❌ Kein lint-staged
- ❌ Keine Pre-Commit-Checks

**Fazit:** Deployment läuft (Vercel), aber keine CI/CD-Automation, keine Tests im CI, keine Pre-Commit-Quality-Gates.

---

## Git-Workflow

### **Commit-Style:**

- ⚠️ Konventionelle Commits nicht durchgehend (grep-search ergab keine eindeutigen "feat:", "fix:" Patterns in git log, aber README erwähnt "Conventional Commits" als Guideline)
- ❌ Kein CHANGELOG.md (obwohl Conventional Commits empfohlen)

### **Branch-Protection:**

- ❓ Unbekannt (GitHub-Repo-Settings nicht einsehbar via Copilot)

### **Pull-Request-Workflow:**

- ⚠️ README erwähnt "Pull Requests willkommen", aber keine CONTRIBUTING.md mit Prozess-Details

---

## Environment-Setup

### **.env-Variablen (benötigt):**

**Frontend (Client-Side):**

- `REACT_APP_SUPABASE_URL` (Supabase-Projekt-URL)
- `REACT_APP_SUPABASE_ANON_KEY` (Supabase Anonymous-Key)

**Backend (Server-Side):**

- `OPENAI_API_KEY` (OpenAI API-Key)
- `PORT` (Express-Server-Port, default: 5001)

**Vercel (Serverless):**

- `OPENAI_API_KEY`
- `SUPABASE_URL` oder `VITE_SUPABASE_URL`
- `SUPABASE_ANON_KEY` oder `VITE_SUPABASE_ANON_KEY`

### **Status:**

- ✅ `.gitignore` enthält `.env`, `.env.local`, `.env.*`
- ❌ Keine `.env.example` Datei (README listet Beispiel-Text, aber keine Datei)
- ⚠️ `src/lib/supabaseClient.js` wirft Error, wenn ENV fehlt (gut für Sicherheit, schlecht für Onboarding ohne Docs)

### **Onboarding-Zeit (geschätzt):**

- ❌ Ohne .env.example: ~60-90 Min (Supabase-Projekt erstellen, Keys kopieren, Trial-and-Error)
- ✅ Mit .env.example: ~20-30 Min (README folgen, Keys eintragen)

---

## Sicherheit & Secrets

### **Secrets-Scan:**

- ✅ Keine hardcodierten API-Keys gefunden (grep-search mit Regex für API-Keys ergab nur false-positives in `pnpm-lock.yaml`)
- ✅ `.gitignore` schützt `.env` Dateien
- ✅ Serverless-API (`api/generate-expose.js`) prüft Supabase-Session (Auth-Layer)
- ⚠️ Lokaler Proxy (`server/gpt-proxy.js`) hat kein Auth (nur für lokale Dev gedacht, aber nicht dokumentiert)

### **Best-Practices:**

- ✅ API-Keys in Environment-Variablen (nicht committed)
- ✅ Supabase-Session-Token wird im Frontend geholt und an Backend weitergegeben
- ⚠️ `src/lib/openai.js` loggt GPT-Responses in Console (könnte sensible Daten leaken in Production)

---

## Zusätzliche Beobachtungen

### **Inkonsistenzen:**

1. **README vs. package.json:**
   - README sagt "pnpm run dev" → `package.json` hat kein `dev`-Script
   - README sagt "Vite" → Projekt nutzt CRA (`react-scripts`)

2. **Lockfiles:**
   - `pnpm-lock.yaml` vorhanden (pnpm als primärer Package-Manager)
   - Grep-search erwähnte `package-lock.json` (npm-Lockfile) → sollte entfernt werden, wenn pnpm genutzt wird

3. **Build-Artefakte:**
   - `build/` Ordner ist committed (normalerweise in `.gitignore`)
   - Könnte zu Merge-Konflikten führen, wenn mehrere Devs bauen

4. **GPT-Proxy doppelt:**
   - `server/gpt-proxy.js` (Express, lokal)
   - `api/generate-expose.js` (Vercel Serverless)
   - README erklärt nicht, wann welcher verwendet wird

### **Technische Schuld:**

- CRA (Create React App) ist seit React 18+ "maintenance-mode" (Facebook empfiehlt Vite/Next.js)
- React 19 ist bleeding-edge (stable seit Nov 2024), könnte Breaking Changes mit CRA haben
- `node-fetch` ist deprecated (native fetch in Node 18+)

---

## Zusammenfassung

| Aspekt             | Status            | Details                                                     |
| ------------------ | ----------------- | ----------------------------------------------------------- |
| **Tech-Stack**     | ✅ Klar           | React 19, CRA, Supabase, OpenAI, pnpm                       |
| **Dependencies**   | ✅ Gemanaged      | pnpm-lock vorhanden, moderne Versionen                      |
| **Ordnerstruktur** | ⚠️ OK             | Frontend/Backend getrennt, aber vermischt (server + api)    |
| **Dokumentation**  | ❌ Basic          | Nur README, keine Architektur-Docs                          |
| **Tests**          | ❌ Keine          | Libraries vorhanden, aber keine Tests geschrieben           |
| **CI/CD**          | ❌ Keine          | Vercel-Deployment läuft, aber keine Automation              |
| **Git-Workflow**   | ⚠️ Informal       | Keine Conventional Commits, kein CHANGELOG                  |
| **Environment**    | ❌ Undokumentiert | Keine .env.example, Onboarding schwierig                    |
| **Sicherheit**     | ✅ OK             | Secrets nicht committed, aber Console-Logging in Production |

---

## Nächste Schritte

**Phase 1 abgeschlossen!** 🔍

✅ Repo-Struktur vollständig erfasst  
✅ Tech-Stack identifiziert  
✅ Dependencies analysiert  
✅ Docs-Status klar (viele Lücken)  
✅ Tests-Status klar (keine Tests)  
✅ CI/CD-Status klar (keine Automation)

**Fortschritt:** Phase 1 → Phase 2 (Analysis & Scoring)

---

**Frage an User:** ✅ Soll ich mit **Phase 2 (Analysis)** weitermachen?  
→ Score berechnen (8 Kategorien vs. 360Volt-Benchmark 8.5/10)
