# Repo-Improvement-Plan (3-Sprint-Roadmap)

**Projekt:** MaklerMate-MVP
**Erstellt am:** 21. Oktober 2025
**Aktualisiert am:** 15. November 2025 (TypeScript-Migration abgeschlossen)
**Methode:** COPILOT-REPO-ANALYZER (Phase 3)
**Rolle:** 📊 Technical Product Manager

---

## 🎯 Ziel

Dieses Repository von **4.7/10** (aktuell, nach TS-Migration) auf **8.0/10** bringen (nahe 360Volt-Niveau 8.5/10).

**Roadmap (aktualisiert 15.11.2025):**

- **Sprint 1:** Quick Wins (8.5h) → Score 3.8 → 5.5 (+1.7)
- **Sprint 2:** Strategic (25h) → Score 5.5 → 6.8 (+1.3)
- **Sprint 3 TypeScript:** ✅ **ABGESCHLOSSEN** (40h) → Score 3.8 → 4.7 (+0.9)
- **Sprint 4:** Testing & CI/CD (40h) → Score 4.7 → 6.5 (+1.8) **← AKTUELLER FOKUS**
- **Sprint 5:** Excellence (26-46h) → Score 6.5 → 8.0 (+1.5)

---

## Prioritäts-Matrix

```
High Impact + Low Effort   = DO FIRST (Quick Wins ✅)
High Impact + High Effort  = PLAN CAREFULLY (Strategic 📋)
Low Impact + Low Effort    = DO IF TIME (Nice-to-Have ⏳)
Low Impact + High Effort   = DON'T DO (Waste ❌)
```

**Angewendet auf MaklerMate-MVP:**

| Task                 | Impact    | Effort | Priorität       | Sprint |
| -------------------- | --------- | ------ | --------------- | ------ |
| Copilot-Instructions | Hoch      | 2h     | ✅ Quick Win    | 1      |
| ARCHITECTURE.md      | Hoch      | 3h     | ✅ Quick Win    | 1      |
| .env.example         | Mittel    | 1h     | ✅ Quick Win    | 1      |
| Pre-Commit-Hooks     | Hoch      | 1h     | ✅ Quick Win    | 1      |
| LICENSE              | Niedrig   | 0.5h   | ✅ Quick Win    | 1      |
| README korrigieren   | Mittel    | 1h     | ✅ Quick Win    | 1      |
| Unit-Tests           | **Sehr Hoch** | 12h    | 📋 Strategic    | **4 ← JETZT**      |
| GitHub Actions CI    | **Sehr Hoch** | 4h     | 📋 Strategic    | **4 ← JETZT**      |
| CHANGELOG.md         | Mittel    | 2h     | 📋 Strategic    | 2      |
| API-Docs (Swagger)   | Mittel    | 6h     | 📋 Strategic    | 2      |
| Prettier-Config      | Niedrig   | 1h     | 📋 Strategic    | 2      |
| **TypeScript Migration** | **Sehr Hoch** | **40h** | ✅ **ERLEDIGT 15.11.2025** | **3 ✅**      |
| E2E-Tests            | **Hoch**  | 8h     | 📋 Strategic    | **4 ← JETZT**      |
| Docker-Compose       | Mittel    | 6h     | ⏳ Nice-to-Have | 5      |
| Service-Layer        | Mittel    | 12h    | ⏳ Nice-to-Have | 5      |

---

## Sprint 1: Foundation (Quick Wins) - 8.5h

**Ziel:** Kritische Docs + Code-Quality-Basics etablieren

**ETA:** 1 Woche (1-2h/Tag bei Part-Time) oder 1-2 Tage (Full-Time)

**Score-Progression:** 3.8/10 → 5.5/10 (+1.7)

---

### Task 1: Copilot-Instructions erstellen (2h)

**Priorität:** ✅ Quick Win (High Impact, Low Effort)

**Ziel:** Copilot bekommt klare Vorgaben für konsistente Arbeit im Projekt.

**Was wird gemacht:**

1. Datei `.github/copilot-instructions.md` erstellen
2. Primary Source of Truth definieren (z.B. `PROJECT.md` oder `SPRINT-PLAN.md`)
3. Secondary References auflisten (ARCHITECTURE.md, README.md, API-Docs)
4. Workflow beschreiben:
   - Docs lesen → Kontext verstehen → Implementieren → User-Explanation
5. Pre-Commit-Checklist definieren:
   - Tests laufen (wenn vorhanden)
   - ESLint passed
   - Conventional Commits
   - User-Explanation nach jedem Task

**Acceptance Criteria:**

- [ ] `.github/copilot-instructions.md` existiert
- [ ] Primary SoT definiert (PROJECT.md als Single Source of Truth)
- [ ] Workflow klar dokumentiert
- [ ] Pre-Commit-Checklist vorhanden
- [ ] Copilot weiß, wie bei diesem Projekt zu arbeiten ist

**Files zu erstellen:**

- `.github/copilot-instructions.md`
- `PROJECT.md` (Primary SoT, falls noch nicht vorhanden)

**Score-Impact:**

- Dokumentation: 4/10 → 5/10 (+1)
- Code-Quality: 4/10 → 5/10 (+1)

---

### Task 2: ARCHITECTURE.md erstellen (3h)

**Priorität:** ✅ Quick Win (High Impact, Low Effort)

**Ziel:** Tech-Stack, API-Verträge und Architektur-Entscheidungen dokumentieren.

**Was wird gemacht:**

1. Tech-Stack dokumentieren:
   - Sprachen: JavaScript (React 19, Node.js 22)
   - Frontend: React 19 + CRA + React Router 7
   - Backend: Express (lokal) + Vercel Serverless (Production)
   - Auth: Supabase
   - AI: OpenAI GPT-4o-mini
   - PDF: jsPDF + html2canvas
2. API-Verträge definieren:
   - `/api/generate-expose` (POST):
     ```json
     Request: { "prompt": "string" }
     Response: { "ok": true, "text": "string" }
     ```
3. Architektur-Diagramm (optional, Text-basiert):
   ```
   Frontend (React) → Supabase Auth → /api/generate-expose → OpenAI
                     ↓
                  LocalStorage (Exposés, Leads)
   ```
4. Architektur-Entscheidungen:
   - Warum CRA? (MVP-Speed, später Migration zu Vite geplant)
   - Warum Supabase? (Auth + DB as a Service)
   - Warum zwei Backend-Endpoints? (server/gpt-proxy.js für lokale Dev, api/generate-expose.js für Production)

**Acceptance Criteria:**

- [ ] `docs/ARCHITECTURE.md` existiert
- [ ] Tech-Stack vollständig dokumentiert
- [ ] API-Verträge für alle Endpoints
- [ ] Architektur-Entscheidungen erklärt (ADRs light)
- [ ] Neue Devs verstehen Stack in <15 Min

**Files zu erstellen:**

- `docs/ARCHITECTURE.md`

**Score-Impact:**

- Dokumentation: 5/10 → 7/10 (+2)

---

### Task 3: .env.example erstellen (1h)

**Priorität:** ✅ Quick Win (Medium Impact, Low Effort)

**Ziel:** Onboarding vereinfachen, neue Devs können Setup in <30 Min.

**Was wird gemacht:**

1. Datei `.env.example` im Root erstellen
2. Alle benötigten Env-Vars auflisten:

   ```bash
   # Frontend (Client-Side, REACT_APP_ Präfix)
   REACT_APP_SUPABASE_URL=https://your-project.supabase.co
   REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here

   # Backend (Server-Side, für server/gpt-proxy.js)
   OPENAI_API_KEY=sk-your-openai-key-here
   PORT=5001

   # Vercel (Serverless, für api/generate-expose.js)
   # OPENAI_API_KEY (same as above)
   # SUPABASE_URL (oder VITE_SUPABASE_URL)
   # SUPABASE_ANON_KEY (oder VITE_SUPABASE_ANON_KEY)
   ```

3. Kommentare hinzufügen (Zweck jeder Variable)
4. README aktualisieren:
   - Hinweis: "Kopiere `.env.example` zu `.env` und fülle Werte ein"

**Acceptance Criteria:**

- [ ] `.env.example` existiert im Root
- [ ] Alle Env-Vars dokumentiert mit Kommentaren
- [ ] README verlinkt `.env.example`
- [ ] Neuer Dev kann Setup in <30 Min (statt 60-90 Min)

**Files zu erstellen:**

- `.env.example`

**Files zu bearbeiten:**

- `README.md` (Setup-Section erweitern)

**Score-Impact:**

- Environment: 3/10 → 5/10 (+2)
- Dokumentation: 7/10 → 8/10 (+1)

---

### Task 4: Pre-Commit-Hooks einrichten (1h)

**Priorität:** ✅ Quick Win (High Impact, Low Effort)

**Ziel:** Code-Quality automatisch sichern, unlinted Code kann nicht committed werden.

**Was wird gemacht:**

1. Husky + lint-staged installieren:
   ```bash
   pnpm add -D husky lint-staged
   pnpm exec husky init
   ```
2. Pre-Commit-Hook erstellen (`.husky/pre-commit`):
   ```bash
   #!/usr/bin/env sh
   . "$(dirname -- "$0")/_/husky.sh"
   pnpm lint-staged
   ```
3. `package.json` erweitern:
   ```json
   {
     "lint-staged": {
       "*.{js,jsx}": ["eslint --fix", "prettier --write"]
     }
   }
   ```
4. Prettier-Config minimal erstellen (`.prettierrc`):
   ```json
   {
     "semi": true,
     "singleQuote": true,
     "tabWidth": 2,
     "trailingComma": "es5"
   }
   ```

**Acceptance Criteria:**

- [ ] Husky installiert und initialisiert
- [ ] Pre-Commit-Hook läuft automatisch
- [ ] ESLint + Prettier werden bei Commit ausgeführt
- [ ] Unlinted Code kann nicht committed werden
- [ ] Prettier-Config vorhanden

**Dependencies hinzufügen:**

- `husky` (DevDependency)
- `lint-staged` (DevDependency)
- `prettier` (DevDependency)

**Files zu erstellen:**

- `.husky/pre-commit`
- `.prettierrc`

**Files zu bearbeiten:**

- `package.json` (lint-staged config)

**Score-Impact:**

- Code-Quality: 5/10 → 7/10 (+2)

---

### Task 5: LICENSE hinzufügen (0.5h)

**Priorität:** ✅ Quick Win (Low Impact, Low Effort)

**Ziel:** Legal-Compliance, README verweist auf LICENSE.

**Was wird gemacht:**

1. MIT License Template erstellen (`LICENSE`):

   ```
   MIT License

   Copyright (c) 2025 M-Sieger

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:
   [...]
   ```

2. Verifizieren, dass README auf LICENSE verweist (bereits vorhanden)

**Acceptance Criteria:**

- [ ] `LICENSE` Datei existiert
- [ ] README-Link zu LICENSE funktioniert
- [ ] Legal-Compliance erfüllt

**Files zu erstellen:**

- `LICENSE`

**Score-Impact:**

- Dokumentation: 8/10 → 8/10 (kein Score-Change, aber Compliance)

---

### Task 6: README korrigieren (1h)

**Priorität:** ✅ Quick Win (Medium Impact, Low Effort)

**Ziel:** Inkonsistenzen beheben, First Impression verbessern.

**Was wird gemacht:**

1. **Script-Name korrigieren:**
   - `pnpm run dev` → `pnpm start` (da `dev`-Script nicht existiert)
   - Optional: `"dev": "react-scripts start"` zu `package.json` hinzufügen

2. **Tech-Stack korrigieren:**
   - "React 19 + Vite" → "React 19 + Create React App (CRA)"
   - Hinweis hinzufügen: "Migration zu Vite geplant (siehe Roadmap)"

3. **Environment-Section erweitern:**
   - Link zu `.env.example` hinzufügen
   - Setup-Steps präziser:

     ````markdown
     ## 📥 Installation (lokal)

     1. Repo klonen:
        ```bash
        git clone https://github.com/M-Sieger/MaklerMate-MVP.git
        cd MaklerMate-MVP
        ```
     ````

     2. Dependencies installieren:

        ```bash
        pnpm install
        ```

     3. Environment-Variablen einrichten:

        ```bash
        cp .env.example .env
        # .env bearbeiten und Keys eintragen
        ```

     4. Dev-Server starten:

        ```bash
        pnpm start   # Frontend (localhost:3000)
        ```

     5. (Optional) Lokaler GPT-Proxy:
        ```bash
        pnpm run proxy   # Backend (localhost:5001)
        ```

     ```

     ```

4. **Quickstart-Section hinzufügen:**
   - 3 Commands zum Loslegen (Install, .env, Start)

**Acceptance Criteria:**

- [ ] README enthält keine Inkonsistenzen
- [ ] Script-Namen korrekt (`pnpm start`)
- [ ] Tech-Stack korrekt (CRA, nicht Vite)
- [ ] Setup-Steps klar und testbar
- [ ] Link zu `.env.example`
- [ ] Quickstart-Section vorhanden

**Files zu bearbeiten:**

- `README.md`

**Optional zu bearbeiten:**

- `package.json` (füge `"dev": "react-scripts start"` hinzu)

**Score-Impact:**

- Dokumentation: 8/10 → 8/10 (Qualität verbessert, aber bereits gut)
- Environment: 5/10 → 6/10 (+1, durch bessere Setup-Anleitung)

---

### Sprint 1 Zusammenfassung

**Aufwand gesamt:** 8.5h (mit 1.3× Buffer = 11h real)

**Score-Progression:**

| Kategorie     | Vorher     | Nachher    | Delta       |
| ------------- | ---------- | ---------- | ----------- |
| Dokumentation | 4/10       | 8/10       | +4 ✅       |
| Code-Quality  | 4/10       | 7/10       | +3 ✅       |
| Environment   | 3/10       | 6/10       | +3 ✅       |
| Git-Workflow  | 5/10       | 6/10       | +1 ✅       |
| **Gesamt**    | **3.8/10** | **5.5/10** | **+1.7** ✅ |

**Erfolg:** Foundation etabliert, Onboarding <30 Min, Code-Quality-Gates aktiv.

---

## Sprint 2: Quality (Strategic Tasks) - 25h

**Ziel:** Testing + CI/CD + API-Docs etablieren

**ETA:** 2-3 Wochen (2-3h/Tag bei Part-Time) oder 1 Woche (Full-Time)

**Score-Progression:** 5.5/10 → 6.8/10 (+1.3)

---

### Task 1: Unit-Tests ausbauen (12h)

**Priorität:** 📋 Strategic (High Impact, High Effort)

**Ziel:** Coverage von 0% auf 40-50% bringen (kritische Pfade testen).

**Was wird gemacht:**

1. **Utils-Tests (4h):**
   - `src/utils/arrayHelpers.test.js`
   - `src/utils/pdfExport.test.js` (Mock jsPDF)
   - `src/utils/fetchWithAuth.test.js` (Mock Supabase)
   - Coverage-Ziel: 80% für Utils

2. **Hooks-Tests (6h):**
   - `src/hooks/useAIHelper.test.js` (Mock fetch)
   - `src/hooks/useSavedExposes.test.js` (Mock localStorage)
   - `src/hooks/useLocalStorageLeads.test.js`
   - React Testing Library nutzen

3. **Component-Tests (2h):**
   - `src/components/ExposeForm.test.jsx` (kritische UI)
   - `src/components/GPTOutputBox.test.jsx`
   - Nur kritische Components, kein 100%-Ziel

**Acceptance Criteria:**

- [ ] Min. 10 Test-Dateien erstellt
- [ ] Coverage >40% (Utils + Hooks)
- [ ] Tests laufen mit `pnpm test`
- [ ] CI-ready (keine Flaky-Tests)

**Score-Impact:**

- Testing: 1/10 → 5/10 (+4)

---

### Task 2: GitHub Actions CI (4h)

**Priorität:** 📋 Strategic (High Impact, Medium Effort)

**Ziel:** Tests + Build automatisch bei Push/PR.

**Was wird gemacht:**

1. GitHub Actions Workflow erstellen (`.github/workflows/ci.yml`):

   ```yaml
   name: CI

   on:
     push:
       branches: [main]
     pull_request:
       branches: [main]

   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v3
           with:
             version: 10
         - uses: actions/setup-node@v4
           with:
             node-version: '22'
             cache: 'pnpm'
         - run: pnpm install
         - run: pnpm test -- --watchAll=false
         - run: pnpm run build
   ```

2. Branch-Protection aktivieren (GitHub-Settings):
   - Require status checks to pass (CI)
   - Require branches to be up to date
   - (Optional) Require PR reviews

**Acceptance Criteria:**

- [ ] `.github/workflows/ci.yml` existiert
- [ ] CI läuft bei Push/PR
- [ ] Tests + Build werden ausgeführt
- [ ] Branch-Protection aktiv (Main-Branch)

**Score-Impact:**

- CI/CD: 1/10 → 5/10 (+4)

---

### Task 3: CHANGELOG.md erstellen (2h)

**Priorität:** 📋 Strategic (Medium Impact, Low Effort)

**Ziel:** Git-History transparent machen, Conventional Commits dokumentieren.

**Was wird gemacht:**

1. `CHANGELOG.md` erstellen:

   ```markdown
   # Changelog

   All notable changes to this project will be documented in this file.

   The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
   and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

   ## [Unreleased]

   ### Added

   - Copilot-Instructions für konsistente Arbeit
   - ARCHITECTURE.md mit Tech-Stack-Dokumentation
   - Pre-Commit-Hooks (Husky + lint-staged)
   - .env.example für schnelles Onboarding

   ### Changed

   - README korrigiert (pnpm start statt dev)

   ### Fixed

   - LICENSE hinzugefügt (MIT)

   ## [0.1.0] - 2025-10-21

   ### Added

   - Initial MVP Release
   - Exposé-Generator mit GPT-Integration
   - CRM-Light für Lead-Verwaltung
   - PDF-Export
   ```

2. `package.json` Script hinzufügen (optional):
   ```json
   {
     "scripts": {
       "changelog": "conventional-changelog -p angular -i CHANGELOG.md -s"
     }
   }
   ```

**Acceptance Criteria:**

- [ ] `CHANGELOG.md` existiert
- [ ] Bisherige Änderungen dokumentiert
- [ ] Format: Keep a Changelog
- [ ] README verlinkt CHANGELOG

**Score-Impact:**

- Git-Workflow: 6/10 → 7/10 (+1)
- Dokumentation: 8/10 → 9/10 (+1)

---

### Task 4: API-Docs (Swagger/OpenAPI) (6h)

**Priorität:** 📋 Strategic (Medium Impact, High Effort)

**Ziel:** `/api/generate-expose` dokumentieren, Frontend-Backend-Kontrakt klar.

**Was wird gemacht:**

1. OpenAPI-Spec erstellen (`docs/openapi.yaml`):

   ```yaml
   openapi: 3.0.0
   info:
     title: MaklerMate API
     version: 1.0.0
   paths:
     /api/generate-expose:
       post:
         summary: Generiere Exposé-Text via GPT
         security:
           - BearerAuth: []
         requestBody:
           required: true
           content:
             application/json:
               schema:
                 type: object
                 required: [prompt]
                 properties:
                   prompt:
                     type: string
                     description: GPT-Prompt (generiert von Frontend)
         responses:
           200:
             description: Erfolgreiche Generierung
             content:
               application/json:
                 schema:
                   type: object
                   properties:
                     ok:
                       type: boolean
                     text:
                       type: string
           401:
             description: Unauthorized (Session fehlt)
           500:
             description: Server-Fehler
   components:
     securitySchemes:
       BearerAuth:
         type: http
         scheme: bearer
   ```

2. Swagger-UI lokal testen (optional):
   - `npx swagger-ui-express` oder online Editor: https://editor.swagger.io/

3. README aktualisieren:
   - Link zu `docs/openapi.yaml`

**Acceptance Criteria:**

- [ ] `docs/openapi.yaml` existiert
- [ ] Alle API-Endpoints dokumentiert
- [ ] Request/Response-Schemas definiert
- [ ] README verlinkt API-Docs

**Score-Impact:**

- Dokumentation: 9/10 → 9/10 (keine Score-Änderung, aber Qualität erhöht)

---

### Task 5: Prettier-Config (1h)

**Priorität:** 📋 Strategic (Low Impact, Low Effort)

**Ziel:** Code-Formatierung konsistent, alle Devs nutzen gleiche Regeln.

**Was wird gemacht:**

1. `.prettierrc` erweitern (bereits in Sprint 1 erstellt, aber verfeinern):

   ```json
   {
     "semi": true,
     "singleQuote": true,
     "tabWidth": 2,
     "trailingComma": "es5",
     "printWidth": 100,
     "arrowParens": "always"
   }
   ```

2. `.prettierignore` erstellen:

   ```
   build/
   node_modules/
   pnpm-lock.yaml
   package-lock.json
   ```

3. VSCode-Settings empfehlen (`.vscode/settings.json`):
   ```json
   {
     "editor.formatOnSave": true,
     "editor.defaultFormatter": "esbenp.prettier-vscode"
   }
   ```

**Acceptance Criteria:**

- [ ] `.prettierrc` konfiguriert
- [ ] `.prettierignore` vorhanden
- [ ] `.vscode/settings.json` empfiehlt Prettier
- [ ] Code wird automatisch formatiert (bei Save)

**Score-Impact:**

- Code-Quality: 7/10 → 8/10 (+1)

---

### Sprint 2 Zusammenfassung

**Aufwand gesamt:** 25h (mit 1.3× Buffer = 33h real)

**Score-Progression:**

| Kategorie     | Vorher     | Nachher    | Delta       |
| ------------- | ---------- | ---------- | ----------- |
| Testing       | 1/10       | 5/10       | +4 ✅       |
| CI/CD         | 1/10       | 5/10       | +4 ✅       |
| Dokumentation | 8/10       | 9/10       | +1 ✅       |
| Code-Quality  | 7/10       | 8/10       | +1 ✅       |
| Git-Workflow  | 6/10       | 7/10       | +1 ✅       |
| **Gesamt**    | **5.5/10** | **6.8/10** | **+1.3** ✅ |

**Erfolg:** Testing etabliert, CI/CD automatisiert, API dokumentiert.

---

## Sprint 3: Excellence (Nice-to-Have) - 66-86h

**Ziel:** TypeScript Migration + E2E-Tests + Service-Layer

**ETA:** 4-6 Wochen (Part-Time) oder 2-3 Wochen (Full-Time)

**Score-Progression:** 6.8/10 → 8.0/10 (+1.2)

⚠️ **Hinweis:** Sprint 3 ist optional und sollte nur gestartet werden, wenn:

- Sprint 1 + 2 abgeschlossen sind
- Team-Ressourcen verfügbar sind
- Projekt wird langfristig maintained (kein Quick-MVP)

---

### Task 1: TypeScript Migration (40-60h)

**Priorität:** ⏳ Nice-to-Have (Very High Impact, Very High Effort)

**Ziel:** Type-Safety End-to-End, weniger Runtime-Bugs.

**Was wird gemacht:**

1. **Vorbereitung (4h):**
   - CRA zu Vite migrieren (bessere TS-Performance)
   - `tsconfig.json` erstellen (Strict-Mode)
   - Dependencies aktualisieren (`@types/react`, `@types/node`)

2. **Core-Files migrieren (16h):**
   - `/src/utils/` → TypeScript
   - `/src/hooks/` → TypeScript
   - `/src/lib/` → TypeScript
   - `/src/context/` → TypeScript

3. **Components migrieren (20h):**
   - `/src/components/` → TypeScript
   - `/src/pages/` → TypeScript
   - Props typisieren (keine `any`)

4. **Backend migrieren (10h):**
   - `server/gpt-proxy.js` → `server/gpt-proxy.ts`
   - `api/generate-expose.js` → `api/generate-expose.ts`

5. **Zod-Validation hinzufügen (10h):**
   - API-Input-Validation (`/api/generate-expose`)
   - Formular-Validation (Frontend)

**Acceptance Criteria:**

- [ ] Alle `.js` → `.ts` / `.jsx` → `.tsx`
- [ ] `tsconfig.json` mit Strict-Mode
- [ ] Keine `any` Types (<5% Ausnahmen)
- [ ] Zod-Validation für API-Daten
- [ ] Build funktioniert (`pnpm run build`)

**Score-Impact:**

- Type-Safety: 2/10 → 8/10 (+6)

---

### Task 2: E2E-Tests (Playwright) (8h)

**Priorität:** ⏳ Nice-to-Have (Medium Impact, Medium Effort)

**Ziel:** Kritische User-Flows testen (Happy-Path).

**Was wird gemacht:**

1. Playwright installieren:

   ```bash
   pnpm add -D @playwright/test
   npx playwright install
   ```

2. E2E-Tests erstellen (`tests/e2e/expose.spec.ts`):

   ```typescript
   test('Exposé-Generierung Happy-Path', async ({ page }) => {
     await page.goto('http://localhost:3000');
     await page.click('text=Login');
     await page.fill('input[name="email"]', 'test@example.com');
     await page.fill('input[name="password"]', 'password');
     await page.click('button:has-text("Login")');
     await page.click('text=Exposé erstellen');
     // Formular ausfüllen
     await page.fill('input[name="strasse"]', 'Teststraße 1');
     // ...
     await page.click('button:has-text("Generieren")');
     await page.waitForSelector('text=Exposé erfolgreich');
   });
   ```

3. CI-Integration (GitHub Actions):
   ```yaml
   - name: E2E Tests
     run: pnpm exec playwright test
   ```

**Acceptance Criteria:**

- [ ] Playwright installiert
- [ ] Min. 3 E2E-Tests (Login, Exposé-Generierung, PDF-Export)
- [ ] Tests laufen lokal + CI
- [ ] Keine Flaky-Tests

**Score-Impact:**

- Testing: 5/10 → 7/10 (+2)

---

### Task 3: Service-Layer extrahieren (12h)

**Priorität:** ⏳ Nice-to-Have (Medium Impact, Medium Effort)

**Ziel:** Business-Logic aus Hooks extrahieren, Testability verbessern.

**Was wird gemacht:**

1. Services-Ordner erstellen (`/src/services/`)

2. Services extrahieren:
   - `src/services/aiService.ts` (aus `useAIHelper`)
   - `src/services/exposeService.ts` (aus `useSavedExposes`)
   - `src/services/leadService.ts` (aus `useLocalStorageLeads`)

3. Hooks refactoren (dünn, rufen nur Services auf):

   ```typescript
   // Vorher: Hook macht alles
   export function useAIHelper() {
     const [loading, setLoading] = useState(false);
     const fetchGPT = async (prompt) => {
       /* Fetch-Logic */
     };
     return { fetchGPT, loading };
   }

   // Nachher: Hook ruft Service auf
   export function useAIHelper() {
     const [loading, setLoading] = useState(false);
     const fetchGPT = async (prompt) => {
       setLoading(true);
       const result = await aiService.generateText(prompt);
       setLoading(false);
       return result;
     };
     return { fetchGPT, loading };
   }
   ```

4. Services-Tests erstellen (einfacher ohne React-Kontext):
   ```typescript
   import { aiService } from './aiService';
   test('generateText returns GPT response', async () => {
     const result = await aiService.generateText('Test prompt');
     expect(result).toBeTruthy();
   });
   ```

**Acceptance Criteria:**

- [ ] `/src/services/` Ordner erstellt
- [ ] Min. 3 Services extrahiert
- [ ] Hooks bleiben dünn (State-Management only)
- [ ] Services haben eigene Tests

**Score-Impact:**

- Ordnerstruktur: 7/10 → 9/10 (+2)

---

### Task 4: Docker-Compose (6h)

**Priorität:** ⏳ Nice-to-Have (Medium Impact, Medium Effort)

**Ziel:** Dev-Environment reproduzierbar, Onboarding <10 Min.

**Was wird gemacht:**

1. `docker-compose.yml` erstellen:

   ```yaml
   version: '3.8'
   services:
     frontend:
       build: .
       ports:
         - '3000:3000'
       volumes:
         - .:/app
       environment:
         - REACT_APP_SUPABASE_URL=${REACT_APP_SUPABASE_URL}
         - REACT_APP_SUPABASE_ANON_KEY=${REACT_APP_SUPABASE_ANON_KEY}

     # Optional: Lokale Supabase (für vollständig offline-fähige Dev-Env)
     postgres:
       image: supabase/postgres
       ports:
         - '5432:5432'
       environment:
         POSTGRES_PASSWORD: postgres
   ```

2. `Dockerfile` erstellen:

   ```dockerfile
   FROM node:22-alpine
   WORKDIR /app
   RUN npm install -g pnpm
   COPY package.json pnpm-lock.yaml ./
   RUN pnpm install
   COPY . .
   EXPOSE 3000
   CMD ["pnpm", "start"]
   ```

3. README aktualisieren:

   ````markdown
   ## 🐳 Docker Setup (Alternative)

   ```bash
   docker-compose up
   ```
   ````

   App läuft unter http://localhost:3000

   ```

   ```

**Acceptance Criteria:**

- [ ] `docker-compose.yml` erstellt
- [ ] `Dockerfile` erstellt
- [ ] `docker-compose up` startet App in <2 Min
- [ ] README dokumentiert Docker-Setup

**Score-Impact:**

- CI/CD: 5/10 → 6/10 (+1)
- Environment: 6/10 → 7/10 (+1)

---

### Sprint 3 Zusammenfassung

**Aufwand gesamt:** 66-86h (mit 1.3× Buffer = 86-112h real)

**Score-Progression:**

| Kategorie      | Vorher     | Nachher    | Delta       |
| -------------- | ---------- | ---------- | ----------- |
| Type-Safety    | 2/10       | 8/10       | +6 ✅       |
| Testing        | 5/10       | 7/10       | +2 ✅       |
| Ordnerstruktur | 7/10       | 9/10       | +2 ✅       |
| CI/CD          | 5/10       | 6/10       | +1 ✅       |
| Environment    | 6/10       | 7/10       | +1 ✅       |
| **Gesamt**     | **6.8/10** | **8.0/10** | **+1.2** ✅ |

**Erfolg:** TypeScript etabliert, E2E-Tests laufen, Service-Layer sauber, Docker-Setup ready.

---

## Gesamt-Roadmap (Übersicht)

| Sprint       | Aufwand                     | Score Vorher | Score Nachher | Delta | Tasks          |
| ------------ | --------------------------- | ------------ | ------------- | ----- | -------------- |
| **Sprint 1** | 8.5h (11h real)             | 3.8/10       | 5.5/10        | +1.7  | 6 Quick Wins   |
| **Sprint 2** | 25h (33h real)              | 5.5/10       | 6.8/10        | +1.3  | 5 Strategic    |
| **Sprint 3** | 66-86h (86-112h real)       | 6.8/10       | 8.0/10        | +1.2  | 4 Nice-to-Have |
| **GESAMT**   | 99.5-119.5h (130-156h real) | 3.8/10       | 8.0/10        | +4.2  | 15 Tasks       |

**360Volt-Niveau (8.5/10):** Nach Sprint 3 + Polish (weitere 20-30h)

---

## Nächste Schritte

**Phase 3 abgeschlossen!** 📊

✅ 3-Sprint-Roadmap erstellt  
✅ Alle Tasks priorisiert (Quick Wins → Strategic → Nice-to-Have)  
✅ ETAs berechnet (mit 1.3× Buffer)  
✅ Acceptance Criteria definiert  
✅ Score-Progression klar (3.8 → 5.5 → 6.8 → 8.0)

**Fortschritt:** Phase 3 → Phase 4 (Execution - Sprint 1 starten)

---

**Frage an User:** ✅ Soll ich **Sprint 1 (Quick Wins)** starten?  
→ Beginne mit Task 1 (Copilot-Instructions erstellen, 2h)

**Oder:**

- "Pause" → Analyse-Reports reviewen
- "Sprint 2 direkt" → Overrulen und Strategic Tasks starten
- "Eigene Priorisierung" → User wählt spezifische Tasks aus
