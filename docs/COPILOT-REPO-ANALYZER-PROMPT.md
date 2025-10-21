# 🤖 Copilot Repo Analyzer – Smart Analysis & Alignment Prompt

**Version:** 1.1  
**Erstellt:** 21. Oktober 2025  
**Update:** 21. Oktober 2025 (Benchmark-Klarstellung)  
**Zweck:** Generischer Prompt zur automatischen Repo-Analyse und Struktur-Verbesserung

---

## ⚠️ WICHTIG: Benchmark-Definition

**Methodischer Benchmark:** 360Volt-docu-MVP (Dokumentations-Standards & Workflow)

**✅ Was von 360Volt übernommen wird:**

- **Dokumentations-Prinzipien:** Primary SoT definieren, hierarchische Docs, Copilot-Instructions
- **Type-Safety-Ansatz:** Strict-Mode, End-to-End-Typisierung (sprachabhängig)
- **Testing-Strategie:** Unit + E2E + Coverage-Tracking
- **Git-Workflow:** Conventional Commits, CHANGELOG.md, Branch-Protection
- **Code-Quality-Automation:** Pre-Commit-Hooks, Linting, Formatting

**❌ Was NICHT übernommen wird (projektabhängig):**

- **Tech-Stack:** React/Fastify sind 360Volt-spezifisch → wird projektabhängig ermittelt
- **Mobile-First:** 360/390/412px nur für PWAs relevant → wird projektabhängig ermittelt
- **Offline-First:** IndexedDB nur für Field-Worker-Apps → wird projektabhängig ermittelt
- **Spezifische Tools:** Vite, Zustand, Tailwind → wird projektabhängig ermittelt

**🧠 Proaktive Ermittlung:**
Copilot ermittelt eigenständig, welche Standards für **dieses spezifische Projekt** sinnvoll sind,
basierend auf: Repo-Inhalt, Product Vision, Tech-Stack, Zielgruppe, Marktstandards.

---

## 🎭 ROLLEN FÜR COPILOT (Multi-Perspektiven-Analyse)

Für eine umfassende Repo-Analyse nimmt Copilot **verschiedene Rollen** ein, um alle Aspekte zu bewerten:

### **Phase 1: Discovery (Verstehen)**

**Rolle:** 🔍 **Repository Archaeologist**

- **Perspektive:** Neutrale Bestandsaufnahme ohne Bewertung
- **Fokus:** Struktur erfassen, Tech-Stack identifizieren, Dependencies mappen
- **Stil:** Sachlich, dokumentierend, vollständig
- **Output:** Fakten-basierter Discovery-Report

### **Phase 2: Analysis (Bewerten)**

**Rolle:** 🏛️ **Senior Software Architect**

- **Perspektive:** Bewertung gegen Best-Practices und Industry-Standards
- **Fokus:** Architektur-Qualität, Code-Organisation, Skalierbarkeit
- **Stil:** Analytisch, objektiv, konstruktiv-kritisch
- **Output:** Score-basierter Analysis-Report mit Begründungen

### **Phase 3: Planning (Priorisieren)**

**Rolle:** 📊 **Technical Product Manager**

- **Perspektive:** Impact vs. Effort, ROI-orientiert, pragmatisch
- **Fokus:** Quick Wins identifizieren, Strategic Tasks planen, Roadmap erstellen
- **Stil:** Business-orientiert, priorisierend, umsetzungsfokussiert
- **Output:** 3-Sprint-Roadmap mit klaren Acceptance Criteria

### **Phase 4: Execution (Implementieren)**

**Rolle:** 👨‍💻 **Staff Engineer + Tech Lead**

- **Perspektive:** Hands-on Implementierung mit Best-Practice-Mustern
- **Fokus:** Code-Quality, Standards einhalten, Team-Onboarding-fähig
- **Stil:** Detailliert, kommentiert (study-style), wiederverwendbar
- **Output:** Production-ready Code/Docs mit User-Explanation

### **Phase 5: Validation (Prüfen)**

**Rolle:** 🎯 **Quality Assurance Engineer + Data Analyst**

- **Perspektive:** Messbare Verbesserung, objektive Metriken, Learnings
- **Fokus:** Score-Vergleich, Gap-Analysis, Retrospektive
- **Stil:** Daten-getrieben, transparent, iterativ-verbessernd
- **Output:** Validation-Report mit Vorher/Nachher-Vergleich

---

## 🎓 ZUSÄTZLICHE EXPERTEN-PERSPEKTIVEN (Optional)

### **Für Mobile-First-Projekte:**

**Rolle:** 📱 **Mobile UX Specialist**

- **Prüft:** Responsive-Design (360/390/412px), Touch-Targets (≥48px), Safe-Area-Insets
- **Fokus:** Handschuh-Bedienung, Outdoor-Lesbarkeit, Offline-First

### **Für Backend-APIs:**

**Rolle:** 🔐 **API Security Architect**

- **Prüft:** Authentication, Rate-Limiting, Input-Validation, API-Docs (OpenAPI)
- **Fokus:** Security Best-Practices, Performance, Monitoring

### **Für Data-Science-Projekte:**

**Rolle:** 🧪 **ML Engineer + Data Scientist**

- **Prüft:** Notebook-Organisation, Reproducibility, Data-Versioning (DVC), Model-Docs
- **Fokus:** Experiment-Tracking, Model-Governance, Deployment-Readiness

### **Für Frontend-Projekte:**

**Rolle:** 🎨 **Frontend Performance Engineer**

- **Prüft:** Bundle-Size (<200KB), Core Web Vitals (LCP <2s), Accessibility (WCAG AA)
- **Fokus:** Performance-Budget, Progressive Enhancement, A11y

### **Für DevOps-Integration:**

**Rolle:** 🚀 **DevOps/SRE Engineer**

- **Prüft:** CI/CD-Pipeline, Docker-Compose, Monitoring (Sentry), Deployment-Strategy
- **Fokus:** Automation, Infrastructure-as-Code, Observability

---

## 🎭 ROLLEN-WECHSEL IM WORKFLOW

**Während der Analyse wechselt Copilot automatisch die Perspektive:**

```
Phase 0: 🧠 Context-Discovery (NEU!)
         ↓ (PROJECT-CONTEXT.md erstellt)
Phase 1: 🔍 Repository Archaeologist
         ↓ (Discovery-Report erstellt)
Phase 2: 🏛️ Senior Software Architect
         ↓ (Analysis-Report mit Score)
Phase 3: 📊 Technical Product Manager
         ↓ (Improvement-Plan mit Roadmap)
Phase 4: 👨‍💻 Staff Engineer + Tech Lead
         ↓ (Implementierung Task-by-Task)
Phase 5: 🎯 QA Engineer + Data Analyst
         ↓ (Validation-Report + Learnings)
```

**Bei spezifischen Anforderungen hinzu:**

- 📱 Mobile UX Specialist (wenn Mobile-App)
- 🔐 API Security Architect (wenn Backend-API)
- 🧪 ML Engineer (wenn Data-Science)
- 🎨 Frontend Performance Engineer (wenn SPA/PWA)
- 🚀 DevOps/SRE Engineer (wenn Deployment-Fokus)

---

## 📋 WIE DIESER PROMPT FUNKTIONIERT

### **Ziel**

Dieser Prompt analysiert **jedes beliebige Repository** und:

1. ✅ **Versteht** die Struktur (Ordner, Dateien, Dependencies)
2. ✅ **Bewertet** gegen **projektangemessene** Best-Practices (nicht 360Volt-spezifisch)
3. ✅ **Leitet ab**, was fehlt (Docs, Tests, CI/CD, etc.)
4. ✅ **Erstellt Plan**, wie das Repo verbessert werden kann
5. ✅ **Implementiert** Schritt-für-Schritt (auf User-Anfrage)

### **Adaptive Bewertung**

Der Prompt passt sich automatisch an den Projekt-Typ an:

- **PWA/Web-App:** Responsive-Design, Performance, Accessibility
- **Flutter/React Native:** Native-Performance, Platform-spezifische UX
- **Backend-API:** Security, Rate-Limiting, API-Docs
- **Data-Science:** Reproducibility, Data-Versioning, Model-Docs

### **Einsatz**

```bash
# 1. Kopiere diesen Prompt in ein neues Projekt
cp docs/COPILOT-REPO-ANALYZER-PROMPT.md /path/to/other-project/

# 2. Öffne das Projekt in VSCode/Codespaces

# 3. Sage zu Copilot:
"Analysiere dieses Repo nach dem COPILOT-REPO-ANALYZER-PROMPT.md"

# 4. Copilot führt automatisch Phase 0-5 aus und erstellt Reports
```

---

## 🎯 PROMPT FÜR COPILOT (COPY-PASTE)

````
# === REPO-ANALYSE-AUFTRAG ===

Du bist ein Senior Software Architect und sollst dieses Repository analysieren und verbessern.

**Methodischer Benchmark:** 360Volt-docu-MVP (Dokumentations-Standards, nicht Tech-Stack)
- ✅ Dokumentations-getrieben (Primary SoT definieren, hierarchische Docs)
- ✅ Type-Safety (sprachabhängig: TypeScript Strict, Python Type Hints, etc.)
- ✅ Testing-Strategie (Unit + E2E + Coverage >70%)
- ✅ Git-Workflow (Conventional Commits + CHANGELOG.md)
- ✅ Copilot-optimiert (.github/copilot-instructions.md)
- ✅ Code-Quality-Automation (Pre-Commit-Hooks, Linting, Formatting)

**❌ NICHT übernehmen (projektabhängig ermitteln):**
- Tech-Stack (React, Fastify, etc. sind 360Volt-spezifisch)
- Mobile-First (nur für PWAs/Mobile-Apps relevant)
- Offline-First (nur für Field-Worker-Apps relevant)

**Deine Aufgabe:** Analysiere dieses Repo in 6 Phasen (0-5) und erstelle nach jeder Phase einen Report.

---

## PHASE 0: CONTEXT-DISCOVERY (NEU! - Proaktive Ermittlung)

**Ziel:** Projektkontext verstehen, bevor Bewertung startet.

**Tasks:**
1. **Repo durchsuchen nach Product Vision:**
   - README.md (Projekt-Beschreibung, Zielgruppe?)
   - /docs/VISION.md oder /docs/PROJECT.md (falls vorhanden)
   - package.json / pubspec.yaml / pyproject.toml (description, keywords)

2. **Tech-Stack identifizieren:**
   - Sprachen: package.json, requirements.txt, Gemfile, pubspec.yaml
   - Frameworks: React, Vue, Flutter, Django, Rails, FastAPI
   - Zielplattform: Web (PWA?), Mobile (iOS/Android), Desktop, Backend-API

3. **Zielgruppe ableiten:**
   - B2C (Endkunden) → UX-Fokus, Performance, Accessibility
   - B2B (Business) → Daten-Sicherheit, Compliance, API-Docs
   - Intern (Team-Tool) → Developer-Experience, Onboarding
   - Field-Worker (vor Ort) → Offline-First, Mobile-First

4. **Marktstandards recherchieren (falls unklar):**
   - Flutter-App → Material Design, Native-Performance, State-Management
   - Django-Backend → REST/GraphQL, Migrations, Admin-Panel
   - PWA → Core Web Vitals, Service Worker, Responsive-Design
   - Data-Science → Jupyter, Reproducibility, Model-Versioning

5. **Rückfragen stellen (falls Vision unklar):**
   - "Was ist das Hauptziel dieses Projekts?"
   - "Wer ist die Zielgruppe? (Mobile User, Desktop, APIs?)"
   - "Gibt es spezielle Anforderungen? (Offline, Performance, Security?)"
   - "Welche Deployment-Strategie? (Cloud, On-Premise, App-Stores?)"

**Output:**
Erstelle `/docs/PROJECT-CONTEXT.md` mit:
```markdown
# Project-Context (Ermittelt durch Copilot)

## Product Vision
[Zusammenfassung aus README/Docs oder User-Rückfrage]

## Zielgruppe
- **Primär:** [B2C / B2B / Intern / Field-Worker]
- **Plattform:** [Web / Mobile / Desktop / Backend-API]
- **Use-Case:** [Kurzbeschreibung]

## Tech-Stack (Identifiziert)
- **Sprache:** TypeScript / Python / Dart
- **Framework:** React / Django / Flutter
- **Build-Tool:** Vite / Webpack / Flutter CLI

## Projekt-spezifische Standards (Abgeleitet)
- [ ] **Mobile-First:** Ja (Flutter-App) / Nein (Backend-API)
- [ ] **Offline-First:** Ja (Field-Worker) / Nein (Admin-Panel)
- [ ] **Performance-kritisch:** Ja (B2C) / Nein (Intern)
- [ ] **Security-kritisch:** Ja (B2B) / Nein (Prototyp)

## Bewertungskriterien (Projektangemessen)
[Wird in Phase 2 verwendet - z.B. für Flutter-App: Native-Performance, Material Design, State-Management]
````

**Acceptance Criteria:**

- [ ] Product Vision klar (aus Repo oder User-Rückfrage)
- [ ] Zielgruppe identifiziert (B2C/B2B/Intern/Field-Worker)
- [ ] Tech-Stack vollständig identifiziert
- [ ] Projekt-spezifische Standards abgeleitet (Mobile-First, Offline-First, etc.)

**Fortschritt:** Phase 0 abgeschlossen → Warte auf User-Bestätigung: "✅ weiter mit Phase 1?"

---

## PHASE 1: DISCOVERY (Verstehen)

**Ziel:** Repo-Struktur erfassen, ohne zu bewerten.

**Tasks:**

1. Scanne Root-Verzeichnis (list_dir)
2. Identifiziere Tech-Stack:
   - Sprachen (package.json, requirements.txt, Gemfile, etc.)
   - Frameworks (React, Vue, Django, Rails, etc.)
   - Build-Tools (Vite, Webpack, Rollup, etc.)
3. Finde Dependencies:
   - Frontend: package.json
   - Backend: package.json / requirements.txt / Gemfile
   - Datenbank: docker-compose.yml / .env.example
4. Analysiere Ordnerstruktur:
   - Monorepo? (frontend/ + backend/)
   - Modulare Struktur? (features/, modules/, packages/)
   - Flat Structure? (src/ mit allem)
5. Prüfe vorhandene Docs:
   - README.md? (Inhalt scannen)
   - /docs/ Ordner? (Welche Files?)
   - CONTRIBUTING.md? CODE_OF_CONDUCT.md?
6. Prüfe Tests:
   - Unit-Tests? (_.test.ts, _.spec.js)
   - E2E-Tests? (Playwright, Cypress, Selenium)
   - Coverage-Reports? (.coverage/, coverage/)
7. Prüfe CI/CD:
   - GitHub Actions? (.github/workflows/)
   - GitLab CI? (.gitlab-ci.yml)
   - Docker? (Dockerfile, docker-compose.yml)

**Output:**
Erstelle `/docs/REPO-DISCOVERY-REPORT.md` mit:

```markdown
# Repo-Discovery-Report

## Tech-Stack

- **Sprachen:** TypeScript, Python, Ruby (mit Versionen)
- **Frameworks:** React 18, Django 4.2, Rails 7.1
- **Build-Tools:** Vite, Webpack, esbuild
- **Datenbank:** PostgreSQL, MongoDB, Redis

## Ordnerstruktur
```

/
├── frontend/ [React + Vite]
├── backend/ [Fastify + TypeScript]
├── config/ [Zentrale Config-Files]
├── docs/ [Projekt-Dokumentation]
└── tests/ [E2E + Unit-Tests]

```

## Dependencies (Auszug)
**Frontend:**
- react@18.2.0
- vite@5.0.0
- typescript@5.2.2

**Backend:**
- fastify@5.6.1
- mongoose@8.19.1

## Vorhandene Docs
- ✅ README.md (47 Zeilen, basic)
- ✅ /docs/PLAN.md (obsolet?)
- ❌ Keine CONTRIBUTING.md
- ❌ Keine ARCHITECTURE.md

## Tests
- ✅ Unit-Tests: 8 Files (imageService, queueService)
- ⚠️ E2E-Tests: Playwright config vorhanden, aber nicht ausführbar
- ❌ Keine Coverage-Reports

## CI/CD
- ❌ Keine GitHub Actions
- ❌ Keine Docker-Compose
- ❌ Keine Deployment-Pipeline
```

**Acceptance Criteria:**

- [ ] Tech-Stack vollständig identifiziert
- [ ] Alle Dependencies aufgelistet
- [ ] Ordnerstruktur visualisiert
- [ ] Docs-Status klar (was fehlt)
- [ ] Tests-Status klar (Coverage?)
- [ ] CI/CD-Status klar (vorhanden/fehlend)

**Fortschritt:** Phase 1 abgeschlossen → Warte auf User-Bestätigung: "✅ weiter mit Phase 2?"

---

## PHASE 2: ANALYSIS (Bewerten)

**Ziel:** Repo-Qualität bewerten gegen **projektangemessene** Best-Practices.

**⚠️ WICHTIG:** Bewertungskriterien werden **dynamisch** aus Phase 0 (PROJECT-CONTEXT.md) abgeleitet!

**Bewertungskategorien (Universal):**

### 1. Dokumentation (Gewicht: 20%)

**Kriterien:**

- [ ] README.md vorhanden + aussagekräftig (Setup, Tech-Stack, Quickstart)
- [ ] /docs/ Ordner mit Architektur-Docs (ARCHITECTURE.md, DESIGN.md)
- [ ] Primary Source of Truth definiert (z.B. SPRINT-PLAN.md)
- [ ] API-Dokumentation (OpenAPI, Swagger, Postman Collection)
- [ ] Copilot-Instructions (.github/copilot-instructions.md)

**Scoring:**

- 10/10: Vollständig (projektangemessen), hierarchisch, versioniert
- 7-9/10: Meiste Docs vorhanden, aber nicht vollständig
- 4-6/10: README OK, aber keine Detail-Docs
- 1-3/10: Nur README, kein /docs/ Ordner
- 0/10: Keine Docs

### 2. Ordnerstruktur (Gewicht: 15%)

**Kriterien:**

- [ ] Klare Separation (Frontend/Backend oder Feature-Folders)
- [ ] Keine Vermischung (Business-Logic nicht in UI-Components)
- [ ] Service-Layer vorhanden (kein Fat-Controller-Pattern)
- [ ] Config-Files zentral (/config oder /settings)
- [ ] Tests nah am Code (co-located oder /tests mit Mirror-Struktur)

**Scoring:**

- 10/10: Feature-based oder Clean-Architecture (projektangemessen)
- 7-9/10: MVC-Pattern klar erkennbar
- 4-6/10: Grundstruktur OK, aber vermischt
- 1-3/10: Flat Structure, alles in /src
- 0/10: Chaos, keine Struktur

### 3. TypeScript/Type-Safety (Gewicht: 15%)

**Kriterien (sprachabhängig):**

- [ ] **TypeScript:** Strict-Mode aktiviert (tsconfig.json), keine `any` (<5%)
- [ ] **Python:** Type Hints für Functions, mypy oder Pyright konfiguriert
- [ ] **Dart (Flutter):** Null-Safety aktiviert, keine `dynamic` (<5%)
- [ ] Eigene Type-Definitions (/types oder .d.ts oder models/)
- [ ] Schema-Validation für API-Daten (Zod/Yup/Joi oder Pydantic)
- [ ] Type-Safety End-to-End (Frontend → Backend oder Client → Server)

**Scoring:**

- 10/10: Strict-Mode + Schema-Validation (projektangemessen)
- 7-9/10: Type-Safety vorhanden, aber nicht strict
- 4-6/10: Partial Type-Safety, viele `any` / `dynamic`
- 1-3/10: Nur JSDoc / Kommentare
- 0/10: Plain JavaScript / Python ohne Types

### 4. Testing (Gewicht: 15%)

**Kriterien:**

- [ ] Unit-Tests für Business-Logic (Services, Utils)
- [ ] Integration-Tests für API-Calls
- [ ] E2E-Tests für Happy-Path (Playwright, Cypress)
- [ ] Coverage >70% für kritische Code
- [ ] CI-Integration (Tests laufen bei PR)

**Scoring:**

- 10/10: Unit + E2E + Coverage >80% + CI
- 7-9/10: Unit + E2E vorhanden, Coverage 50-80%
- 4-6/10: Nur Unit-Tests, Coverage <50%
- 1-3/10: Wenige Tests, kein Framework
- 0/10: Keine Tests

### 5. Git-Workflow (Gewicht: 10%)

**Kriterien:**

- [ ] Conventional Commits (feat:, fix:, docs:)
- [ ] CHANGELOG.md gepflegt
- [ ] Branch-Strategie klar (Trunk-Based oder GitFlow)
- [ ] Protected Main-Branch (kein direkter Push)
- [ ] Squash-Merges oder Rebase (saubere History)

**Scoring:**

- 10/10: Conventional Commits + CHANGELOG + Protected-Main (Best-Practice)
- 7-9/10: Saubere Commits, aber kein CHANGELOG
- 4-6/10: Commits OK, aber inkonsistent
- 1-3/10: "wip", "fix", "update"-Commits
- 0/10: Chaotische History

### 6. CI/CD (Gewicht: 10%)

**Kriterien:**

- [ ] GitHub Actions / GitLab CI konfiguriert
- [ ] Tests laufen automatisch bei Push/PR
- [ ] Lint + TypeScript-Check im CI
- [ ] Deployment-Pipeline (Staging + Production)
- [ ] Docker-Compose für Dev-Environment

**Scoring:**

- 10/10: Vollständige CI/CD + Deployment + Docker
- 7-9/10: CI für Tests + Lint, aber kein Deployment
- 4-6/10: Nur Tests im CI
- 1-3/10: Manuelle Tests
- 0/10: Kein CI/CD

### 7. Code-Quality (Gewicht: 10%)

**Kriterien:**

- [ ] ESLint / Prettier konfiguriert
- [ ] Pre-Commit-Hooks (Husky + lint-staged)
- [ ] Kommentare in Code (Header + komplexe Logik)
- [ ] Keine TODO/FIXME ohne Issue-Referenz
- [ ] Code-Reviews vor Merge

**Scoring:**

- 10/10: Lint + Pre-Commit + Kommentare + Reviews (Best-Practice)
- 7-9/10: Lint + Prettier, aber keine Pre-Commit-Hooks
- 4-6/10: Basic Linting
- 1-3/10: Keine Linting-Config
- 0/10: Kein Code-Quality-Check

### 8. Environment-Setup (Gewicht: 5%)

**Kriterien:**

- [ ] .env.example vorhanden (Frontend + Backend)
- [ ] Docker-Compose für Datenbanken
- [ ] DevContainer oder VSCode-Tasks
- [ ] README mit Setup-Instructions
- [ ] Onboarding <30 Min (neuer Dev kann starten)

**Scoring:**

- 10/10: Docker-Compose + DevContainer + .env.example
- 7-9/10: .env.example + gute README
- 4-6/10: Basic .env, aber Setup unklar
- 1-3/10: Keine .env.example
- 0/10: Kein Environment-Setup

**Output:**
Erstelle `/docs/REPO-ANALYSIS-REPORT.md` mit:

```markdown
# Repo-Analysis-Report (Projektangemessene Best-Practices)

## Scoring-Übersicht

| Kategorie          | Score      | Gewicht | Gewichtet | Best-Practice |
| ------------------ | ---------- | ------- | --------- | ------------- |
| **Dokumentation**  | 6/10       | 20%     | 1.2       | 10/10         |
| **Ordnerstruktur** | 8/10       | 15%     | 1.2       | 10/10         |
| **Type-Safety**    | 7/10       | 15%     | 1.05      | 10/10         |
| **Testing**        | 5/10       | 15%     | 0.75      | 10/10         |
| **Git-Workflow**   | 9/10       | 10%     | 0.9       | 10/10         |
| **CI/CD**          | 2/10       | 10%     | 0.2       | 10/10         |
| **Code-Quality**   | 7/10       | 10%     | 0.7       | 10/10         |
| **Environment**    | 4/10       | 5%      | 0.2       | 10/10         |
| **GESAMT**         | **6.2/10** | 100%    | **6.2**   | **10.0/10**   |

## Projekt-Kontext (aus Phase 0)

- **Typ:** [Flutter-App / Django-Backend / React-PWA]
- **Zielgruppe:** [B2C / B2B / Intern / Field-Worker]
- **Spezifische Anforderungen:** [Mobile-First, Offline-First, Performance-kritisch]

## Detailbewertung

### 1. Dokumentation: 6/10

**Stärken:**

- ✅ README.md vorhanden (basic Setup-Instructions)
- ✅ Einige Docs in /docs/ (PLAN.md, DESIGN.md)

**Schwächen:**

- ❌ Keine ARCHITECTURE.md (Tech-Stack unklar)
- ❌ Keine API-Dokumentation
- ❌ Keine Copilot-Instructions
- ❌ Docs nicht hierarchisch (kein Primary SoT)

**Empfehlung:**

- Erstelle /docs/ARCHITECTURE.md (Tech-Stack, API-Verträge, Ports)
- Erstelle .github/copilot-instructions.md (Workflow + Standards)
- Definiere Primary SoT (z.B. SPRINT-PLAN.md oder PROJECT.md)

### 2. Ordnerstruktur: 8/10

**Stärken:**

- ✅ Frontend/Backend getrennt
- ✅ Service-Layer vorhanden (/services)
- ✅ Type-Definitions separiert (/types)

**Schwächen:**

- ⚠️ Tests nicht co-located (sollten nah am Code sein)
- ⚠️ Config-Files verstreut (sollten in /config zentral sein)

**Empfehlung:**

- Tests co-locaten: component.tsx + component.test.tsx
- Config zentralisieren: /config/database.ts, /config/app.ts

### [... weitere Kategorien ...]

## Gap-Analyse (vs. Best-Practice für diesen Projekt-Typ)

**Was fehlt:**

1. **Kritisch (Sprint 1):**
   - ARCHITECTURE.md (Tech-Stack dokumentieren)
   - Copilot-Instructions (Workflow definieren)
   - Pre-Commit-Hooks (projektspezifisches Linting)
   - CI/CD-Pipeline (Tests automatisieren)

2. **Wichtig (Sprint 2):**
   - API-Dokumentation (falls Backend-API)
   - Integration-Tests (API-Calls testen)
   - Dev-Environment-Setup (Docker-Compose oder DevContainer)
   - CHANGELOG.md (Git-History dokumentieren)

3. **Nice-to-Have (Sprint 3+):**
   - Coverage >80% (Unit-Tests ausbauen)
   - E2E-Tests (User-Flows testen)
   - Deployment-Pipeline (Staging + Production)

## Verbesserungspotenzial

**Aktuell:** 6.2/10
**Ziel Sprint 1:** 7.5/10 (+1.3) - Kritische Docs + CI/CD
**Ziel Sprint 2:** 8.2/10 (+0.7) - Tests + Environment
**Ziel Sprint 3:** 9.0/10 (+0.8) - Best-Practice-Niveau! 🏆

**Aufwand:**

- Sprint 1: ~12-16h (Docs + CI/CD + Pre-Commit-Hooks)
- Sprint 2: ~16-20h (Tests + Docker-Compose + CHANGELOG)
- Sprint 3: ~20-24h (Coverage + E2E + Deployment)
```

**Acceptance Criteria:**

- [ ] Alle 8 Kategorien bewertet
- [ ] Score berechnet (gewichtet)
- [ ] Gap-Analyse vs. Best-Practice (projektangemessen)
- [ ] Verbesserungspotenzial quantifiziert
- [ ] Aufwand geschätzt (Stunden)

**Fortschritt:** Phase 2 abgeschlossen → Warte auf User-Bestätigung: "✅ weiter mit Phase 3?"

---

## PHASE 3: PLANNING (Plan ableiten)

**Ziel:** Konkreten Action-Plan erstellen, priorisiert nach Impact.

**Prioritäts-Matrix:**

```
High Impact + Low Effort = DO FIRST (Quick Wins)
High Impact + High Effort = PLAN CAREFULLY (Strategic)
Low Impact + Low Effort = DO IF TIME (Nice-to-Have)
Low Impact + High Effort = DON'T DO (Waste)
```

**Tasks priorisieren:**

### **Quick Wins (Sprint 1) - High Impact, Low Effort**

| Task                     | Impact | Effort | Warum kritisch?                            |
| ------------------------ | ------ | ------ | ------------------------------------------ |
| **Copilot-Instructions** | Hoch   | 2h     | Copilot arbeitet konsistent nach Standards |
| **ARCHITECTURE.md**      | Hoch   | 3h     | Neue Devs verstehen Tech-Stack sofort      |
| **Pre-Commit-Hooks**     | Hoch   | 1h     | Code-Quality automatisch gesichert         |
| **.env.example**         | Mittel | 1h     | Onboarding <30 Min möglich                 |
| **README verbessern**    | Mittel | 2h     | First Impression + Setup klar              |

**Summe: 9h**

### **Strategic Tasks (Sprint 2) - High Impact, High Effort**

| Task                    | Impact | Effort | Warum wichtig?                        |
| ----------------------- | ------ | ------ | ------------------------------------- |
| **GitHub Actions CI**   | Hoch   | 4h     | Tests automatisch + Branch-Protection |
| **Unit-Tests ausbauen** | Hoch   | 8h     | Coverage 40% → 70%                    |
| **Docker-Compose**      | Mittel | 4h     | Dev-Environment reproduzierbar        |
| **CHANGELOG.md**        | Mittel | 2h     | Git-History transparent               |
| **API-Docs (Swagger)**  | Mittel | 6h     | Frontend-Backend-Kontrakt klar        |

**Summe: 24h**

### **Nice-to-Have (Sprint 3) - Lower Priority**

| Task                       | Impact  | Effort | Wann sinnvoll?          |
| -------------------------- | ------- | ------ | ----------------------- |
| **E2E-Tests (Playwright)** | Mittel  | 8h     | Wenn Unit-Tests >70%    |
| **Deployment-Pipeline**    | Mittel  | 12h    | Wenn CI/CD stabil läuft |
| **Coverage >80%**          | Niedrig | 16h    | Wenn Zeit übrig         |

**Summe: 36h**

**Output:**
Erstelle `/docs/REPO-IMPROVEMENT-PLAN.md` mit:

```markdown
# Repo-Improvement-Plan (3-Sprint-Roadmap)

## Ziel

Dieses Repo von **6.2/10** auf **9.0/10** bringen (Best-Practice-Niveau für diesen Projekt-Typ).

## Sprint 1: Foundation (9h) - Quick Wins

**Ziel:** Kritische Docs + Code-Quality-Basics

**ETA:** 1 Woche (2h/Tag)

### Tasks:

1. **Copilot-Instructions erstellen** (2h)
   - Datei: `.github/copilot-instructions.md`
   - Inhalt: Primary SoT, Secondary Refs, Workflow, Pre-Commit-Checks
   - Acceptance: Copilot weiß, wie zu arbeiten

2. **ARCHITECTURE.md erstellen** (3h)
   - Tech-Stack dokumentieren (Sprachen, Frameworks, Tools)
   - API-Verträge definieren (Endpoints, Request/Response)
   - Ordnerstruktur erklären (warum so organisiert)
   - Acceptance: Neue Devs verstehen Stack in <15 Min

3. **Pre-Commit-Hooks einrichten** (1h)
   - Husky + lint-staged installieren
   - ESLint + Prettier bei Commit ausführen
   - Acceptance: Kein unlinted Code committed

4. **.env.example erstellen** (1h)
   - Alle Env-Vars auflisten (mit Beispielwerten)
   - Kommentare: Zweck jeder Variable
   - Acceptance: Neuer Dev kann Setup in <30 Min

5. **README.md verbessern** (2h)
   - Quickstart-Section (3 Commands zum Starten)
   - Tech-Stack-Übersicht
   - Link zu /docs/ für Details
   - Acceptance: README beantwortet 80% der Fragen

**Erfolg:** Score 6.2 → 7.5 (+1.3)

---

## Sprint 2: Quality (24h) - Strategic

**Ziel:** Testing + CI/CD + Environment

**ETA:** 2-3 Wochen (4h/Tag)

### Tasks:

1. **GitHub Actions CI** (4h)
   - Workflow für Tests bei Push/PR
   - Lint + TypeScript-Check
   - Branch-Protection aktivieren
   - Acceptance: CI läuft automatisch, PRs werden blockiert bei Fehlern

2. **Unit-Tests ausbauen** (8h)
   - Services-Layer 100% Coverage
   - Utils/Helpers 100% Coverage
   - Components 50% Coverage (kritische)
   - Acceptance: Gesamt-Coverage 70%

3. **Docker-Compose** (4h)
   - Services definieren (Frontend, Backend, DB)
   - Ports + Env-Vars konfiguriert
   - README mit `docker-compose up` erweitert
   - Acceptance: `docker-compose up` startet alles in <2 Min

4. **CHANGELOG.md** (2h)
   - Bestehende Commits gruppieren (feat/fix/docs)
   - Conventional-Commits-Format erklären
   - Husky-Hook für Auto-Update
   - Acceptance: Changelog reflektiert Git-History

5. **API-Docs (Swagger)** (6h)
   - OpenAPI-Spec für alle Endpoints
   - Swagger-UI integrieren
   - Request/Response-Typen dokumentiert
   - Acceptance: Frontend-Devs können API ohne Code lesen

**Erfolg:** Score 7.5 → 8.2 (+0.7)

---

## Sprint 3: Excellence (36h) - Polish

**Ziel:** Best-Practice-Niveau erreichen

**ETA:** 3-4 Wochen (4h/Tag)

### Tasks:

1. **E2E-Tests** (8h)
   - Playwright für Happy-Path
   - 3 kritische User-Flows testen
   - CI-Integration (parallel zu Unit-Tests)
   - Acceptance: E2E-Tests finden Regressions-Bugs

2. **Deployment-Pipeline** (12h)
   - Staging-Environment (automatisch bei PR)
   - Production-Deploy (manuell via Tag)
   - Rollback-Strategie
   - Acceptance: Deploy in <5 Min, Rollback in <2 Min

3. **Coverage >80%** (16h)
   - Alle kritischen Pfade getestet
   - Edge-Cases abgedeckt
   - Mutation-Testing (optional)
   - Acceptance: Coverage-Badge grün (>80%)

**Erfolg:** Score 8.2 → 9.0 (+0.8) - Best-Practice-Niveau! 🎉

---

## Nächste Schritte

1. **User bestätigt Sprint 1** → Starte mit Task 1 (Copilot-Instructions)
2. **Nach jedem Task:** "✅ weiter?" fragen
3. **Nach Sprint 1:** Score neu berechnen, Gap-Analyse wiederholen
```

**Acceptance Criteria:**

- [ ] Tasks in 3 Sprints gruppiert
- [ ] Jeder Task hat ETA (Stunden)
- [ ] Jeder Task hat Acceptance Criteria
- [ ] Score-Progression klar (6.2 → 7.5 → 8.2 → 9.0)
- [ ] Prioritäts-Matrix angewandt (Quick Wins zuerst)

**Fortschritt:** Phase 3 abgeschlossen → Warte auf User-Bestätigung: "✅ Sprint 1 starten?"

---

## PHASE 4: EXECUTION (Implementierung)

**Ziel:** Tasks aus Sprint 1 umsetzen (User startet mit "✅ starte Sprint 1").

**Workflow pro Task:**

1. **Task ankündigen:** "Nächster Task: [Name] - [ETA]"
2. **Implementieren:** Code/Docs erstellen
3. **Validieren:** Acceptance Criteria prüfen
4. **User-Explanation:** 2-3 Sätze was sich geändert hat
5. **Fragen:** "✅ weiter mit nächstem Task?"

**Beispiel: Task 1 (Copilot-Instructions)**

```
**Nächster Task (Sprint 1, 1/5):**
Copilot-Instructions erstellen - `.github/copilot-instructions.md`

**Was wird gemacht:**
- Datei mit Primary SoT (z.B. SPRINT-PLAN.md oder PROJECT.md) erstellen
- Secondary Refs definieren (ARCHITECTURE, DESIGN, etc.)
- Workflow beschreiben (Docs lesen → Verstehen → Implementieren)
- Pre-Commit-Checks auflisten (Tests, Lint, projektspezifische Anforderungen)

**ETA:** 2h

✅ Soll ich starten?
```

**Nach Implementierung:**

```
✅ **Copilot-Instructions erstellt!**

**Was du jetzt hast:**
- `.github/copilot-instructions.md` definiert, wie Copilot bei diesem Projekt arbeiten soll
- Primary SoT ist jetzt `PROJECT.md` (falls nicht vorhanden, erstellt)
- Workflow: "Docs lesen → Kontext verstehen → Implementieren → User-Explanation"
- Pre-Commit-Checks: Lint, Tests, projektspezifische Checks

**Nächster Task (Sprint 1, 2/5):**
ARCHITECTURE.md erstellen - Tech-Stack, API-Verträge, Ordnerstruktur

✅ Soll ich mit Task 2 weitermachen?
```

**Acceptance Criteria:**

- [ ] Alle Sprint-1-Tasks implementiert
- [ ] Jeder Task validiert (Acceptance Criteria erfüllt)
- [ ] User-Explanation nach jedem Task
- [ ] Score neu berechnet nach Sprint 1

**Fortschritt:** Phase 4 abgeschlossen → Warte auf User: "✅ Score neu berechnen?"

---

## PHASE 5: VALIDATION (Prüfung & Iteration)

**Ziel:** Score neu berechnen, Gap-Analyse wiederholen, nächsten Sprint planen.

**Tasks:**

1. **Re-Score:** Phase 2 (Analysis) wiederholen
2. **Compare:** Alt vs. Neu Score vergleichen
3. **Gap-Check:** Was wurde erreicht? Was fehlt noch?
4. **Next-Sprint:** Sprint 2 Tasks detaillieren (falls User will)

**Output:**
Erstelle `/docs/REPO-VALIDATION-REPORT.md` mit:

```markdown
# Repo-Validation-Report (nach Sprint 1)

## Score-Vergleich

| Kategorie      | Vorher     | Nachher    | Delta       |
| -------------- | ---------- | ---------- | ----------- |
| Dokumentation  | 6/10       | 9/10       | +3 ✅       |
| Ordnerstruktur | 8/10       | 8/10       | 0           |
| Type-Safety    | 7/10       | 7/10       | 0           |
| Testing        | 5/10       | 5/10       | 0           |
| Git-Workflow   | 9/10       | 9/10       | 0           |
| CI/CD          | 2/10       | 2/10       | 0           |
| Code-Quality   | 7/10       | 9/10       | +2 ✅       |
| Environment    | 4/10       | 6/10       | +2 ✅       |
| **GESAMT**     | **6.2/10** | **7.4/10** | **+1.2** ✅ |

## Was wurde erreicht?

✅ **Dokumentation:** 6/10 → 9/10

- Copilot-Instructions erstellt
- ARCHITECTURE.md erstellt
- README verbessert

✅ **Code-Quality:** 7/10 → 9/10

- Pre-Commit-Hooks eingerichtet (Husky + lint-staged)
- ESLint + Prettier bei Commit erzwungen

✅ **Environment:** 4/10 → 6/10

- .env.example erstellt
- Setup-Instructions in README

## Was fehlt noch? (Gap für Sprint 2)

⏳ **Testing:** 5/10 (Ziel: 7/10)

- Unit-Tests ausbauen (Coverage 40% → 70%)
- Integration-Tests hinzufügen

⏳ **CI/CD:** 2/10 (Ziel: 7/10)

- GitHub Actions für Tests
- Branch-Protection aktivieren

⏳ **Nice-to-Have:** E2E-Tests, Deployment, Coverage >80%

## Learnings aus Sprint 1

**Was lief gut:**

- Quick Wins lieferten schnell Impact (+1.2 Score in 9h)
- Copilot-Instructions machen Arbeit konsistenter
- Pre-Commit-Hooks verhindern schlechten Code

**Was könnte besser sein:**

- ETA war zu optimistisch (9h → 12h real, +33%)
- Manche Tasks blockieren andere (README brauchte ARCHITECTURE.md zuerst)

**Anpassungen für Sprint 2:**

- ETA × 1.3 Buffer einplanen
- Task-Dependencies in Plan aufnehmen

## Nächster Sprint

**Sprint 2: Quality (24h → 31h mit Buffer)**

- Task 1: GitHub Actions CI (4h → 5h)
- Task 2: Unit-Tests ausbauen (8h → 10h)
- Task 3: Docker-Compose (4h → 5h)
- Task 4: CHANGELOG.md (2h → 3h)
- Task 5: API-Docs (6h → 8h)

**Geschätztes Ergebnis:** Score 7.4 → 8.2 (+0.8)

✅ Soll ich Sprint 2 starten?
```

**Acceptance Criteria:**

- [ ] Score neu berechnet (transparent)
- [ ] Delta visualisiert (Vorher/Nachher)
- [ ] Gap-Analyse aktualisiert
- [ ] Learnings dokumentiert (was lief gut/schlecht)
- [ ] Sprint 2 angepasst (mit Buffer + Dependencies)

**Fortschritt:** Phase 5 abgeschlossen → User entscheidet: Sprint 2 starten / Pause / Eigene Priorisierung

---

## 📊 ZUSAMMENFASSUNG DES PROMPTS

**Dieser Prompt liefert:**

1. ✅ **Proaktive Context-Discovery** (Phase 0: Projekt-Vision & Anforderungen ermitteln)
2. ✅ **Automatische Repo-Analyse** (Discovery, Analysis, Planning)
3. ✅ **Adaptive Bewertung** (Kriterien passen sich an Projekt-Typ an)
4. ✅ **Priorisierter Plan** (Quick Wins → Strategic → Nice-to-Have)
5. ✅ **Sprint-Roadmap** (3 Sprints mit Tasks, ETAs, Acceptance Criteria)
6. ✅ **Implementierung** (Schritt-für-Schritt, mit User-Bestätigung)
7. ✅ **Validation** (Re-Score, Gap-Check, Learnings)

**Adaptive Best-Practices:**

- **PWA/Web-App:** Responsive, Core Web Vitals, Service Worker, Accessibility
- **Flutter/React Native:** Native-Performance, Material/Cupertino, State-Management
- **Backend-API:** Security, Rate-Limiting, OpenAPI-Docs, Monitoring
- **Data-Science:** Reproducibility, Data-Versioning, Model-Docs, Experiment-Tracking

**Nutzen:**

- 🚀 **Für neue Projekte:** Strukturiere Chaos in 1-2 Tagen
- 🔄 **Für bestehende Projekte:** Identifiziere Verbesserungspotenzial objektiv
- 🤖 **Für Copilot:** Klare Anweisungen, wie Repo zu verbessern ist
- 📈 **Für Teams:** Transparent Fortschritt tracken (Score-Tracking)
- 🎯 **Projektabhängig:** Keine starren 360Volt-Standards, sondern adaptive Bewertung

---

## 🎯 USAGE-BEISPIELE

### **Beispiel 1: Neues Projekt (Chaos)**

```bash
# Repo geklont, aber keine Struktur
git clone https://github.com/company/legacy-app
cd legacy-app

# Copilot-Auftrag
"Analysiere dieses Repo nach COPILOT-REPO-ANALYZER-PROMPT.md"

# Copilot erstellt:
- /docs/PROJECT-CONTEXT.md (Phase 0: Projekt-Typ ermittelt)
- /docs/REPO-DISCOVERY-REPORT.md (Tech-Stack: PHP 7.4, jQuery, MySQL)
- /docs/REPO-ANALYSIS-REPORT.md (Score: 3.2/10 - viele Probleme)
- /docs/REPO-IMPROVEMENT-PLAN.md (Sprint 1: Docs + Tests + CI)

# 2 Wochen später
Score 3.2 → 6.8 (+3.6) - Projekt rettbar! 🎉
```

### **Beispiel 2: Bestehendes Projekt (OK, aber verbesserbar)**

```bash
# Projekt läuft, aber Onboarding dauert 2 Tage
cd ~/projects/internal-tool

# Copilot-Auftrag
"Analysiere dieses Repo nach COPILOT-REPO-ANALYZER-PROMPT.md"

# Copilot findet:
- Score: 6.8/10 (OK, aber Docs fehlen)
- Quick Wins: ARCHITECTURE.md + .env.example (3h Aufwand)
- Impact: Onboarding 2 Tage → 2 Stunden

# Nach Sprint 1 (Quick Wins)
Score 6.8 → 7.9 (+1.1) - Neue Devs produktiv in <4h! ✅
```

### **Beispiel 3: Flutter-App (Adaptive Bewertung)**

```bash
# Projekt ist Flutter-App, Zielgruppe B2C
cd ~/projects/mobile-shopping-app

# Copilot-Auftrag
"Analysiere dieses Repo nach COPILOT-REPO-ANALYZER-PROMPT.md"

# Copilot ermittelt (Phase 0):
- Projekt-Typ: Flutter-App (B2C, E-Commerce)
- Zielgruppe: Mobile User (iOS + Android)
- Anforderungen: Native-Performance, Material Design, State-Management

# Copilot plant (Phase 2-3):
- Score aktuell: 5.8/10
- Gap: Keine State-Management (Provider/Riverpod/Bloc), keine Material Design Guidelines, kein Flutter-Linting
- Sprint 1: Riverpod integrieren, Material Design Theme
- Sprint 2: Performance-Profiling, Golden-Tests
- Sprint 3: App-Store-Ready (Icons, Screenshots, Privacy Policy)

# Nach 3 Sprints
Score 5.8 → 8.9 (+3.1) - App-Store-Ready! 🏆
```

---

## 🔧 ANPASSUNGEN FÜR SPEZIFISCHE PROJEKT-TYPEN

### **Für Mobile-Apps (React Native, Flutter)**

```markdown
**Zusätzliche Bewertungskriterien:**

- [ ] Responsive-Tests (360/390/412px)
- [ ] Touch-Targets ≥48px (WCAG 2.5.8)
- [ ] Safe-Area-Insets (iOS Notch, Android Gesture-Bar)
- [ ] Offline-First (IndexedDB, AsyncStorage, SQLite)
- [ ] Performance (LCP <2s, INP <200ms, CLS <0.1)
```

### **Für Backend-APIs (Node, Python, Ruby)**

```markdown
**Zusätzliche Bewertungskriterien:**

- [ ] API-Dokumentation (OpenAPI/Swagger)
- [ ] Rate-Limiting (Express-Rate-Limit, Flask-Limiter)
- [ ] Authentication (JWT, OAuth2, API-Keys)
- [ ] Logging (Winston, Python-Logging, Rails-Logger)
- [ ] Monitoring (Sentry, New Relic, Datadog)
```

### **Für Data-Science-Projekte (Python, Jupyter)**

```markdown
**Zusätzliche Bewertungskriterien:**

- [ ] Notebooks organisiert (/notebooks mit klarer Struktur)
- [ ] Requirements.txt + environment.yml (Conda)
- [ ] Data-Versioning (DVC, MLflow)
- [ ] Reproducibility (Seeds, Config-Files)
- [ ] Model-Documentation (Model-Cards)
```

---

## 📚 REFERENZEN

**Methodischer Benchmark:**

- 360Volt-docu-MVP (Dokumentations-Standards & Workflow-Prinzipien)
- **Hinweis:** Tech-Stack und spezifische Features (Mobile-First, Offline-First) sind NICHT universell

**Best-Practice-Quellen (projektabhängig):**

- **Universal:** WCAG 2.2, Conventional Commits, 12-Factor-App, Clean Architecture, TDD
- **Web/PWA:** Core Web Vitals, Service Worker API, Responsive Design
- **Flutter:** Material Design Guidelines, Flutter Performance Best Practices
- **Backend:** OWASP Top 10, OpenAPI Specification, REST/GraphQL Best Practices
- **Data-Science:** MLOps Best Practices, DVC Documentation, Model Cards

**Tools:**

- Copilot (GitHub)
- ESLint + Prettier (Linting)
- Husky + lint-staged (Pre-Commit)
- Playwright (E2E-Tests)
- Vitest (Unit-Tests)
- Docker Compose (Environment)

---

## ✅ CHANGELOG

**v1.1 (21.10.2025):**

- **BREAKING:** Benchmark-Klarstellung – 360Volt ist methodischer Benchmark, nicht inhaltlich
- **NEU:** Phase 0 (Context-Discovery) – Proaktive Ermittlung von Projekt-Vision & Anforderungen
- **GEÄNDERT:** Bewertungskriterien sind jetzt projektabhängig (nicht 360Volt-spezifisch)
- **GEÄNDERT:** Type-Safety-Kriterien jetzt sprachabhängig (TypeScript, Python, Dart)
- **GEÄNDERT:** Scoring-Tabelle zeigt "Best-Practice" statt "360Volt-Benchmark"
- **GEÄNDERT:** Beispiel 3 zeigt Flutter-App statt "360Volt-artiges Projekt"

**v1.0 (21.10.2025):**

- Initial Release basierend auf 360Volt-Repo-Analyse
- 5 Phasen: Discovery → Analysis → Planning → Execution → Validation
- 8 Bewertungskategorien (gewichtet)
- 3-Sprint-Roadmap-Template
- Anpassungen für Mobile-Apps, Backend-APIs, Data-Science

**Maintainer:** GitHub Copilot  
**Review:** M. Sieger (360Volt)  
**Next Review:** Nach 5 Projekt-Durchläufen (Feedback-Integration)

---

## 🚀 QUICK START

**Für User:**

```bash
# 1. Kopiere diesen Prompt in dein Projekt
cp /path/to/360Volt/docs/COPILOT-REPO-ANALYZER-PROMPT.md ./docs/

# 2. Öffne VSCode/Codespaces

# 3. Sage zu Copilot:
"Analysiere dieses Repo nach COPILOT-REPO-ANALYZER-PROMPT.md"

# 4. Copilot führt Phase 0-5 aus und fragt nach jedem Schritt: "✅ weiter?"
```

**Für Copilot:**

```
WENN User sagt: "Analysiere dieses Repo nach COPILOT-REPO-ANALYZER-PROMPT.md"
DANN:
1. Lese diese Datei vollständig
2. Starte mit Phase 0 (Context-Discovery) – Projektkontext ermitteln
3. Erstelle /docs/PROJECT-CONTEXT.md
4. Frage User: "✅ weiter mit Phase 1?"
5. Fahre fort mit Phase 1-5 (Discovery, Analysis, Planning, Execution, Validation)
6. Nach jedem Task: User-Explanation (2-3 Sätze)
7. Nach jedem Sprint: Score neu berechnen
8. Bewertung basiert auf projektspezifischen Best-Practices (NICHT 360Volt-Standards)
```

---

**Ende des Prompts** 🎯
