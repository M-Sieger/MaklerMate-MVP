# 🧪 Testing Strategy - Phase 3 Component Migration

**Referenz:** `/DEVELOPMENT-INSTRUCTION.md` - Testing-Ready Requirements
**Status:** 📋 Planning
**Phase:** 3 (Component Migration)

---

## 🎯 TESTING PHILOSOPHY (nach DEVELOPMENT-INSTRUCTION.md)

### Core Principles
1. **Manual Testing First**: Jede Migration wird manuell getestet (kein Auto-Test in Phase 3)
2. **No Regressions**: Funktionalität muss identisch bleiben
3. **Error Paths**: Alle Error-Szenarien müssen getestet werden
4. **Edge Cases**: Große Daten, leere Daten, ungültige Inputs

### Testing-Ready Checklist (DEVELOPMENT-INSTRUCTION.md)
- [ ] Funktionen sind Pure (gleicher Input = gleicher Output)
- [ ] Services mocken API-Calls (für zukünftige Auto-Tests)
- [ ] Components haben klare Props-Interfaces (PropTypes ✅)

---

## 📋 MANUAL TESTING MATRIX

### Per Component Migration

Jede Component-Migration durchläuft diese **5-stufige Testing-Pyramide**:

```
┌─────────────────────────────────────┐
│  5. Cross-Browser/Tab Testing       │ ← Optional
├─────────────────────────────────────┤
│  4. Edge Cases & Performance        │ ← Critical
├─────────────────────────────────────┤
│  3. Error Handling & Validation     │ ← Critical
├─────────────────────────────────────┤
│  2. Feature Parity (Happy Path)     │ ← Mandatory
├─────────────────────────────────────┤
│  1. Baseline (Pre-Migration)        │ ← Mandatory
└─────────────────────────────────────┘
```

---

## 🔍 LEVEL 1: BASELINE TESTING (Pre-Migration)

**ZWECK:** Dokumentiere aktuelles Verhalten **BEFORE** Migration

**Procedure:**
```bash
# 1. Öffne Component in Browser
# 2. Dokumentiere alle Features
# 3. Screenshot von jedem State (Idle, Loading, Success, Error)
# 4. Notiere Bugs (werden auch nach Migration erwartet)
```

**Template:**
```markdown
## BASELINE: [ComponentName] (Date: YYYY-MM-DD)

### Features Observed:
- [ ] Feature 1: Description
- [ ] Feature 2: Description
- [ ] ...

### Known Bugs (Pre-Migration):
- Bug 1: Description
- Bug 2: Description

### Screenshots:
- Idle State: [path/to/screenshot]
- Loading State: [path/to/screenshot]
- Error State: [path/to/screenshot]
```

---

## ✅ LEVEL 2: FEATURE PARITY (Happy Path)

**ZWECK:** Stelle sicher, dass **ALLE** Features nach Migration funktionieren

### ExposeTool.jsx Testing
```markdown
**Happy Path:**
- [ ] Formular öffnen
- [ ] Alle Felder ausfüllen (objektart, strasse, ort, zimmer, wohnflaeche, preis)
- [ ] Stil wählen (emotional, sachlich, luxus)
- [ ] "Generieren" klicken
- [ ] Loading-Spinner erscheint
- [ ] Output wird angezeigt
- [ ] Toast-Success-Notification erscheint

**Persistierung:**
- [ ] Page Reload → Formular-Daten bleiben erhalten
- [ ] Page Reload → Generierter Text bleibt erhalten

**Bilder:**
- [ ] Bild hochladen (Drag & Drop)
- [ ] Bild hochladen (File-Input)
- [ ] Caption hinzufügen
- [ ] Bild löschen
- [ ] Page Reload → Bilder bleiben erhalten

**Export:**
- [ ] PDF-Export funktioniert
- [ ] JSON-Export funktioniert
- [ ] Text kopieren funktioniert

**Speichern/Laden:**
- [ ] Exposé speichern
- [ ] Gespeicherte Liste wird angezeigt
- [ ] Gespeichertes Exposé laden
- [ ] Formular wird korrekt befüllt
```

### ImageUpload.jsx Testing
```markdown
**Upload:**
- [ ] Drag & Drop: Datei auf Upload-Zone ziehen
- [ ] Click: File-Input klicken und Datei wählen
- [ ] Preview wird angezeigt
- [ ] Caption-Input erscheint

**Captions:**
- [ ] Caption eingeben
- [ ] Caption ändern
- [ ] Caption wird gespeichert (Reload)

**Löschen:**
- [ ] Delete-Button klicken
- [ ] Richtiges Bild wird entfernt
- [ ] Caption wird mit-entfernt
```

### ExportButtons.jsx Testing
```markdown
**PDF-Export:**
- [ ] Button enabled wenn Text vorhanden
- [ ] Button disabled wenn kein Text
- [ ] Click → PDF wird heruntergeladen
- [ ] PDF enthält Text
- [ ] PDF enthält Bilder
- [ ] PDF enthält Captions
- [ ] Dateiname ist sinnvoll

**JSON-Export:**
- [ ] Click → JSON wird heruntergeladen
- [ ] JSON enthält formData
- [ ] JSON enthält output
- [ ] JSON enthält images
- [ ] JSON ist valid (parse-bar)

**Text-Kopieren:**
- [ ] Click → Text in Clipboard
- [ ] Paste in Notepad funktioniert
- [ ] Toast-Notification erscheint
```

### CRMTool.jsx Testing
```markdown
**Lead Hinzufügen:**
- [ ] Name eingeben (required)
- [ ] Kontakt eingeben
- [ ] Typ wählen
- [ ] Status wählen
- [ ] "Speichern" klicken
- [ ] Lead erscheint in Tabelle

**Lead Bearbeiten:**
- [ ] Status ändern (Dropdown)
- [ ] Notiz hinzufügen
- [ ] Änderungen werden gespeichert

**Lead Löschen:**
- [ ] Delete-Button klicken
- [ ] Lead wird entfernt

**Filter:**
- [ ] Filter "Neu" → nur neue Leads
- [ ] Filter "Warm" → nur warme Leads
- [ ] Filter "VIP" → nur VIP Leads

**Search:**
- [ ] Name suchen → richtige Leads
- [ ] Kontakt suchen → richtige Leads
- [ ] Partial-Match funktioniert

**Export:**
- [ ] CSV-Export funktioniert
- [ ] PDF-Export funktioniert
- [ ] JSON-Export funktioniert
```

---

## ⚠️ LEVEL 3: ERROR HANDLING & VALIDATION

**ZWECK:** Teste **alle** Error-Szenarien

### Network Errors (Simulated)
```markdown
**Setup: Browser DevTools → Network Tab → "Offline" aktivieren**

- [ ] ExposeTool: "Generieren" klicken → Error-Toast erscheint
- [ ] Error-Message ist user-freundlich ("Netzwerkfehler...")
- [ ] Retry-Button erscheint (falls retryable)
- [ ] App crashed NICHT (ErrorBoundary fängt ab)
```

### Validation Errors
```markdown
**ExposeTool:**
- [ ] Leeres Formular → "Generieren" disabled ODER Error-Toast
- [ ] Nur Adresse → Error bei fehlenden Feldern
- [ ] Sehr lange Texte (1000+ Zeichen) → kein Overflow

**ImageUpload:**
- [ ] Falsche File-Type (PDF) → Error-Toast "Nur JPG, PNG, WebP"
- [ ] Zu große Datei (>5MB) → Error-Toast "Max. 5MB"
- [ ] Kein File → kein Upload

**CRMTool:**
- [ ] Lead ohne Name → Error-Toast "Name ist Pflichtfeld"
- [ ] Ungültige E-Mail → Warning (optional)
```

### State Errors
```markdown
**ExposeTool:**
- [ ] PDF-Export ohne Text → Error-Toast "Bitte erst generieren"
- [ ] Speichern ohne Text → Error-Toast

**ExportButtons:**
- [ ] Clipboard-Fehler (HTTP statt HTTPS) → Error-Toast
```

---

## 🔥 LEVEL 4: EDGE CASES & PERFORMANCE

**ZWECK:** Test extremer Szenarien

### Large Data
```markdown
**ExposeTool:**
- [ ] 10+ Bilder hochladen → Performance OK (<2s Render)
- [ ] Sehr langer Exposé-Text (5000+ Zeichen) → Kein Freeze
- [ ] 50+ gespeicherte Exposés → Liste scrollbar

**CRMTool:**
- [ ] 100+ Leads → Tabelle scrollbar
- [ ] 100+ Leads → Filter funktioniert (<1s)
- [ ] 100+ Leads → Search funktioniert (<1s)
```

### Empty Data
```markdown
- [ ] Komplett leeres Formular → Kein Crash
- [ ] Keine Bilder → Export funktioniert (PDF ohne Bilder)
- [ ] Keine Leads → Leere Tabelle (nicht "undefined")
```

### Special Characters
```markdown
- [ ] Adresse mit Umlauten (Müller, Größe) → Korrekt angezeigt
- [ ] Lead-Name mit Emoji → Korrekt gespeichert
- [ ] Exposé-Text mit Sonderzeichen → Korrekt kopiert
```

### Browser localStorage Limits
```markdown
- [ ] 5MB+ Bilder → Quota-Exceeded Error abgefangen
- [ ] Error-Message: "Speicher voll, bitte Bilder löschen"
```

---

## 🌐 LEVEL 5: CROSS-BROWSER/TAB (Optional)

**ZWECK:** Multi-Browser & Multi-Tab Kompatibilität

### Cross-Browser (if time permits)
```markdown
- [ ] Chrome (Primary)
- [ ] Firefox
- [ ] Safari (macOS/iOS)
- [ ] Edge
```

### Cross-Tab Sync (Zustand)
```markdown
**Setup: Zwei Tabs öffnen (localhost:3000)**

- [ ] Tab 1: Formular ausfüllen
- [ ] Tab 2: Auto-Update (Zustand persist)
- [ ] Tab 1: Lead hinzufügen
- [ ] Tab 2: Lead erscheint (Cross-Tab-Sync)
```

---

## 📝 TESTING DOCUMENTATION

### Per Task: Testing-Report Template

```markdown
# Testing Report: Task 3.X - [ComponentName]

**Date:** YYYY-MM-DD
**Tester:** [Name]
**Duration:** Xh Ym
**Status:** ✅ PASS / ❌ FAIL

---

## Level 1: Baseline ✅
- All features documented (see baseline notes)
- Screenshots captured

## Level 2: Feature Parity ✅
- [ ] All happy paths tested
- [ ] No regressions observed
- [ ] Functionality identical to baseline

## Level 3: Error Handling ✅
- [ ] Network errors handled
- [ ] Validation errors handled
- [ ] User-friendly error messages

## Level 4: Edge Cases ✅
- [ ] Large data (100+ items) OK
- [ ] Empty data handled
- [ ] Special characters OK

## Level 5: Cross-Browser (Optional)
- [ ] Chrome ✅
- [ ] Firefox ⏭️ Skipped
- [ ] Safari ⏭️ Skipped

---

## Issues Found:
1. **[MINOR]** Issue description
   - Steps to reproduce
   - Expected vs. Actual
   - Fix: Description

2. **[BLOCKER]** Issue description
   - ... (blocks migration, must fix)

---

## Conclusion:
✅ PASS - Ready for commit
❌ FAIL - Needs fixes before commit

**Next Steps:**
- Fix blockers
- Re-test
- Commit
```

---

## 🚀 TESTING WORKFLOW (Per Task)

```bash
# 1. PRE-MIGRATION BASELINE
npm start  # Start dev server
# → Open localhost:3000
# → Document baseline (Level 1)
# → Take screenshots

# 2. PERFORM MIGRATION
# → Code changes
# → Add comments
# → Refactor

# 3. POST-MIGRATION TESTING
npm start  # Fresh start
# → Level 2: Happy Paths
# → Level 3: Error Handling
# → Level 4: Edge Cases
# → Level 5: Cross-Browser (optional)

# 4. DOCUMENT RESULTS
# → Fill Testing-Report template
# → Note any issues
# → Screenshot regressions

# 5. FIX ISSUES (if any)
# → Fix blockers
# → Re-test
# → Update report

# 6. COMMIT (only if PASS)
git add .
git commit -m "feat: [detailed message]"
git push
```

---

## 🎯 SUCCESS CRITERIA (Per Migration)

Migration ist **PASS** wenn:

1. **Feature Parity**: ✅ Alle Features funktionieren wie vorher
2. **No Regressions**: ✅ Keine neuen Bugs eingeführt
3. **Error Handling**: ✅ Alle Error-Pfade getestet + handled
4. **Edge Cases**: ✅ Mindestens 3 Edge-Cases getestet
5. **Documentation**: ✅ Testing-Report ausgefüllt

Migration ist **FAIL** wenn:

- ❌ Features fehlen oder nicht funktionieren
- ❌ Neue Bugs eingeführt (nicht in Baseline)
- ❌ App crashed (ErrorBoundary failte)
- ❌ Keine Error-Handling Tests durchgeführt

---

## 📊 OVERALL PHASE 3 TESTING SUMMARY

**Nach Abschluss aller Migrations:**

```markdown
# Phase 3 Testing Summary

**Total Tasks:** 6
**Tasks Passed:** X/6
**Tasks Failed:** Y/6

**Total Testing Time:** Xh
**Issues Found:** Z
**Issues Fixed:** Z

**Test Coverage:**
- Happy Paths: 100% (all features tested)
- Error Paths: 100% (network, validation, state)
- Edge Cases: 80% (large data, empty data, special chars)
- Cross-Browser: 25% (Chrome only, others skipped)

**Conclusion:**
✅ Phase 3 complete, all migrations tested and passing
🔄 Phase 4 next: Auto-Testing Infrastructure (Vitest)
```

---

## 🛠️ TESTING TOOLS

### Manual Testing Tools
- **Browser DevTools**: Network tab (offline simulation), Console (errors)
- **React DevTools**: Component tree, props, state inspection
- **Lighthouse**: Performance, Accessibility (optional)

### Future: Auto-Testing (Phase 4)
- **Vitest**: Unit tests for services, utils
- **React Testing Library**: Component tests
- **Playwright/Cypress**: E2E tests (optional)

---

## 📚 REFERENCES

- `/DEVELOPMENT-INSTRUCTION.md` - Testing-Ready Requirements
- `docs/architecture/PHASE-3-PLAN.md` - Migration Tasks
- `docs/architecture/migrations/TASK-*.md` - Per-Task Guides

---

**IMPORTANT:** Testing ist **NICHT** optional! Jede Migration **MUSS** getestet werden **BEFORE** Commit.

**NO PASS → NO COMMIT**
