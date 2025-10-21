# Copilot Instructions für MaklerMate-MVP

**Letzte Aktualisierung:** 21. Oktober 2025  
**Projekt:** MaklerMate-MVP (Immobilien-Exposé-Generator)  
**Zweck:** Definiert, wie GitHub Copilot bei diesem Projekt arbeiten soll

---

## 📚 Primary Source of Truth

**Hauptdokument:** `PROJECT.md`  
→ Enthält Projekt-Übersicht, Features, Tech-Stack, aktuelle Sprints

**Bei Unsicherheiten:**

1. Lese `PROJECT.md` (aktueller Status, Ziele, Entscheidungen)
2. Prüfe `docs/ARCHITECTURE.md` (Tech-Stack, API-Verträge)
3. Prüfe `docs/REPO-IMPROVEMENT-PLAN.md` (Roadmap, nächste Tasks)
4. Lese relevante Code-Kommentare (Header mit 📄, 🔐, 🧠, etc.)

---

## 🎯 Secondary References (nach Priorität)

1. **docs/ARCHITECTURE.md** → Tech-Stack, API-Verträge, Architektur-Entscheidungen
2. **docs/REPO-IMPROVEMENT-PLAN.md** → 3-Sprint-Roadmap, Tasks, Acceptance Criteria
3. **docs/REPO-ANALYSIS-REPORT.md** → Scoring, Gap-Analyse vs. 360Volt-Benchmark
4. **docs/REPO-DISCOVERY-REPORT.md** → Repo-Struktur, Dependencies, Status
5. **README.md** → Setup-Instructions, Features, Live-Demo
6. **docs/openapi.yaml** (später) → API-Dokumentation
7. **CHANGELOG.md** (später) → Git-History

---

## 🔄 Workflow (IMMER befolgen)

### **Schritt 1: Docs lesen**

- Bevor du Code schreibst, lies relevante Docs
- Verstehe Kontext: Was ist der aktuelle Sprint? Welche Entscheidungen wurden getroffen?
- Bei Widersprüchen: `PROJECT.md` hat Vorrang

### **Schritt 2: Kontext verstehen**

- Prüfe bestehenden Code (Header-Kommentare, Struktur)
- Identifiziere betroffene Dateien
- Plane Änderungen (welche Files müssen erstellt/bearbeitet werden?)

### **Schritt 3: Implementieren**

- Folge Projekt-Standards (siehe unten)
- Schreibe klare Header-Kommentare (mit Emojis 📄, 🔐, 🧠)
- Teste lokal (bei Tests: `pnpm test`, bei Build: `pnpm run build`)

### **Schritt 4: User-Explanation**

- Nach jedem Task: Erkläre in 2-3 Sätzen, was sich geändert hat
- Keine technischen Details (außer User fragt explizit)
- Fokus: **Was kann User jetzt machen, was vorher nicht ging?**

### **Schritt 5: Nächster Task?**

- Frage User: "✅ Soll ich mit Task X weitermachen?"
- Warte auf Bestätigung (außer User sagt "alle Tasks durchführen")

---

## 📏 Code-Standards (PFLICHT)

### **JavaScript/React:**

- **Funktionale Komponenten** (keine Class-Components)
- **Hooks** für State-Management (`useState`, `useEffect`, custom hooks)
- **CSS-Module** für Component-Styles (`.module.css`)
- **Emojis in Kommentaren** für Lesbarkeit:
  - 📄 = File-Header
  - 🔐 = Security-relevant (Auth, API-Keys)
  - 🧠 = Business-Logic
  - ✅ = Success-Case
  - ❌ = Error-Handling
  - 🔁 = Loop/Iteration
  - 📦 = Import/Export
  - ⚠️ = Warning/Wichtig

### **File-Header (Beispiel):**

```javascript
// 📄 src/components/ExposeForm.jsx
// Zweck: Formular für Immobilien-Daten (Exposé-Generierung)
// Verwendet: TabbedForm, ImageUpload, GPTOutputBox
// Autor: GitHub Copilot (21.10.2025)

import React, { useState } from 'react';
// ...
```

### **Naming Conventions:**

- **Components:** PascalCase (`ExposeForm.jsx`)
- **Hooks:** camelCase mit `use` Präfix (`useAIHelper.js`)
- **Utils:** camelCase (`pdfExport.js`)
- **CSS-Modules:** PascalCase.module.css (`ExposeForm.module.css`)
- **Konstanten:** UPPER_SNAKE_CASE (`API_ENDPOINT`)

### **Error-Handling:**

- Immer `try/catch` bei async-Funktionen
- User-freundliche Fehlermeldungen (react-hot-toast)
- Console-Logs nur in Development (`if (process.env.NODE_ENV === 'development')`)

---

## ✅ Pre-Commit-Checklist (vor jedem Commit)

**Automatisch (Husky + lint-staged):**

- [ ] ESLint passed (keine Linting-Fehler)
- [ ] Prettier formatiert (Code-Formatierung konsistent)

**Manuell (Copilot-Check):**

- [ ] Tests laufen (falls vorhanden): `pnpm test -- --watchAll=false`
- [ ] Build funktioniert: `pnpm run build`
- [ ] Keine `console.log()` in Production-Code (außer gegateter Debug-Output)
- [ ] Header-Kommentare vorhanden (📄 File-Zweck)
- [ ] User-Explanation geschrieben (2-3 Sätze)

**Commit-Message (Conventional Commits):**

```bash
feat: add Copilot-Instructions and PROJECT.md
fix: correct README script name (dev → start)
docs: add ARCHITECTURE.md with Tech-Stack details
test: add unit tests for arrayHelpers
```

---

## 🚫 Don'ts (NIEMALS machen)

❌ **Code ohne Docs lesen**  
→ Immer erst `PROJECT.md` + `ARCHITECTURE.md` checken

❌ **Breaking Changes ohne Absprache**  
→ Bei großen Änderungen (z.B. CRA → Vite): User fragen

❌ **Secrets committen**  
→ Keine API-Keys, keine `.env` Files (nur `.env.example`)

❌ **Tests überspringen**  
→ Wenn Tests vorhanden sind, IMMER `pnpm test` vor Commit

❌ **Console-Logs in Production**  
→ Logs entfernen oder mit `process.env.NODE_ENV === 'development'` gaten

❌ **Inkonsistente Formatierung**  
→ Prettier + ESLint werden automatisch ausgeführt (Pre-Commit-Hook)

❌ **"any" Types (sobald TypeScript kommt)**  
→ Strict-Mode, keine `any` (außer absolut nötig, dann `// @ts-expect-error`)

---

## 📊 Sprint-Status (Live-Updates)

**Aktueller Sprint:** Sprint 1 (Quick Wins)  
**Fortschritt:** Task 1/6 (Copilot-Instructions) ✅ IN ARBEIT

**Nächste Tasks:**

- Task 2: ARCHITECTURE.md erstellen (3h)
- Task 3: .env.example + README (1h)
- Task 4: Pre-Commit-Hooks (1h)
- Task 5: LICENSE (0.5h)
- Task 6: README korrigieren (1h)

**Nach Sprint 1:**

- Score: 3.8/10 → 5.5/10 (+1.7)
- Dann Sprint 2 (Testing + CI/CD) oder Pause

---

## 🎓 Lern-Ressourcen (für Copilot)

**Projekt-spezifisch:**

- Supabase Auth-Docs: https://supabase.com/docs/guides/auth
- OpenAI API: https://platform.openai.com/docs
- jsPDF: https://github.com/parallax/jsPDF

**Best-Practices:**

- React Hooks: https://react.dev/reference/react
- Conventional Commits: https://www.conventionalcommits.org/
- Keep a Changelog: https://keepachangelog.com/

---

## 🔧 Troubleshooting (Häufige Probleme)

**Problem:** `pnpm start` funktioniert nicht  
**Lösung:** `.env` fehlt → Kopiere `.env.example` zu `.env` und fülle Keys ein

**Problem:** ESLint-Fehler bei Commit  
**Lösung:** `pnpm run lint --fix` manuell ausführen, dann nochmal committen

**Problem:** Tests schlagen fehl  
**Lösung:** Prüfe, ob Mocks korrekt sind (Supabase, OpenAI, localStorage)

**Problem:** Build schlägt fehl  
**Lösung:** `pnpm install` (Dependencies aktualisieren), dann `pnpm run build`

---

## 📝 Changelog (Copilot-Instructions Updates)

**v1.0 (21.10.2025):**

- Initial Release nach Phase 3 (Planning)
- Primary SoT: PROJECT.md
- Workflow: Docs lesen → Verstehen → Implementieren → User-Explanation
- Pre-Commit-Checklist definiert

**Nächstes Update:** Nach Sprint 1 (TypeScript-Regeln hinzufügen, wenn Migration startet)

---

**Ende der Copilot-Instructions** ✅

→ Bei Unsicherheiten: Lese `PROJECT.md` oder frage User
