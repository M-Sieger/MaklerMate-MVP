# 🎣 Pre-Commit-Hooks – MaklerMate-MVP

**Automatische Code-Quality-Checks bei jedem Commit**

---

## 📚 Was passiert bei einem Commit?

Wenn du Änderungen commitest (`git commit`), laufen automatisch folgende Checks:

1. **Prettier** formatiert geänderte Dateien (`*.js`, `*.jsx`, `*.json`, `*.css`, `*.md`)
2. **ESLint** prüft JavaScript/React-Code auf Linting-Fehler
3. **Git-Commit** wird nur ausgeführt, wenn alle Checks erfolgreich sind

**Ziel:** Kein unlinted/unformatted Code landet im Repo.

---

## 🛠️ Setup (bereits erledigt)

Die Pre-Commit-Hooks sind bereits konfiguriert (Sprint 1, Task 4). Keine weitere Aktion nötig!

**Was wurde installiert:**

- **Husky** (Git-Hooks-Manager)
- **lint-staged** (läuft Checks nur auf geänderten Dateien)
- **Prettier** (Code-Formatter)

**Config-Files:**

- `.husky/pre-commit` → Husky-Hook (ruft `lint-staged` auf)
- `.lintstagedrc.json` → Definiert, welche Tools auf welchen Files laufen
- `.prettierrc.json` → Prettier-Config (Formatting-Regeln)
- `.prettierignore` → Files, die Prettier ignoriert

---

## 🚀 Manuelle Formatierung (optional)

Falls du Code manuell formatieren willst (ohne Commit):

### **Alle Dateien formatieren:**

```bash
pnpm run format
```

### **Formatierung prüfen (ohne zu ändern):**

```bash
pnpm run format:check
```

### **ESLint-Fehler fixen:**

```bash
pnpm run lint:fix
```

### **ESLint-Check (ohne zu fixen):**

```bash
pnpm run lint
```

---

## 🔧 Prettier-Regeln (`.prettierrc.json`)

```json
{
  "semi": true, // Semikolons am Zeilenende
  "trailingComma": "es5", // Trailing-Commas (ES5-Style)
  "singleQuote": true, // Single-Quotes statt Double-Quotes
  "printWidth": 100, // Max. Zeilenlänge 100 Zeichen
  "tabWidth": 2, // 2 Spaces für Indentation
  "useTabs": false, // Spaces statt Tabs
  "arrowParens": "always", // Arrow-Functions: (x) => x statt x => x
  "endOfLine": "lf" // Unix-Line-Endings (LF statt CRLF)
}
```

**Anpassungen:** Bearbeite `.prettierrc.json` und committe die Änderungen.

---

## 🎯 ESLint-Regeln

ESLint nutzt die CRA-Standard-Config (`react-app`, `react-app/jest`).

**Config:** Siehe `package.json` → `eslintConfig`

**Wichtig:** Pre-Commit-Hooks erlauben **keine Warnings** (`--max-warnings=0`).
→ Alle Warnings müssen gefixxt werden, bevor committet werden kann.

---

## ⚠️ Was tun bei Commit-Fehlern?

### **Problem: Prettier-Fehler**

```
[warn] src/App.js
[warn] Code style issues found. Run Prettier with --write to fix.
```

**Lösung:**

```bash
pnpm run format
git add .
git commit -m "fix: prettier formatting"
```

### **Problem: ESLint-Fehler**

```
[error] src/components/Layout.jsx: jsx-a11y/anchor-is-valid
```

**Lösung:**

```bash
# 1. Fehler manuell fixen (z.B. <a href="#"> → <button>)
# 2. Oder Auto-Fix versuchen:
pnpm run lint:fix

# 3. Committen
git add .
git commit -m "fix: eslint anchor-is-valid"
```

### **Problem: Hook überspringen (Notfall)**

```bash
# ⚠️ NUR in Notfällen verwenden!
git commit --no-verify -m "fix: emergency commit"
```

**Hinweis:** `--no-verify` umgeht alle Checks. Nutze das nur, wenn absolut nötig (z.B. Hotfix in Production).

---

## 📋 Lint-Staged-Config (`.lintstagedrc.json`)

```json
{
  "*.{js,jsx,ts,tsx,json,css,md}": ["prettier --write"],
  "*.{js,jsx,ts,tsx}": ["eslint --fix --max-warnings=0"]
}
```

**Was passiert:**

1. Alle geänderten `.js`, `.jsx`, `.json`, `.css`, `.md` Files → Prettier formatiert
2. Alle geänderten `.js`, `.jsx` Files → ESLint fixt + prüft (keine Warnings erlaubt)

**Anpassungen:** Bearbeite `.lintstagedrc.json` und committe die Änderungen.

---

## 🧪 Testing (optional)

Falls Tests vorhanden sind (aktuell 0% Coverage), kannst du sie vor dem Commit laufen lassen:

**Manuell:**

```bash
pnpm test -- --watchAll=false
```

**Pre-Commit-Hook anpassen (`.husky/pre-commit`):**

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
pnpm test -- --watchAll=false --passWithNoTests
```

**Hinweis:** `--passWithNoTests` verhindert, dass Hook fehlschlägt, wenn keine Tests vorhanden sind.

---

## 🚫 Files ignorieren

### **Prettier ignorieren:**

Füge Pfade zu `.prettierignore` hinzu:

```
# Build-Output (sollte nicht formatiert werden)
build/
dist/

# Dependencies
node_modules/
```

### **ESLint ignorieren:**

Füge Kommentar in Code ein:

```javascript
// eslint-disable-next-line jsx-a11y/anchor-is-valid
<a href="#">Link</a>
```

**Für ganze Datei:**

```javascript
/* eslint-disable jsx-a11y/anchor-is-valid */
```

---

## 📝 Troubleshooting

### **Problem: Husky-Hooks funktionieren nicht**

```bash
# Re-Install Husky
pnpm run prepare
```

### **Problem: `npx lint-staged` nicht gefunden**

```bash
# Dependencies neu installieren
pnpm install
```

### **Problem: Prettier ändert Files, die nicht staged sind**

→ `lint-staged` läuft nur auf **geänderten + staged** Files.
→ Prüfe `git status` → nur staged Files werden gecheckt.

### **Problem: ESLint-Warnings blockieren Commit**

→ Pre-Commit-Hook erlaubt `--max-warnings=0` (keine Warnings).
→ Fixe alle Warnings oder deaktiviere Regel (nicht empfohlen):

```javascript
// eslint-disable-next-line rule-name
```

---

## ✅ Acceptance Criteria (Sprint 1, Task 4)

- [x] Husky installiert + initialisiert
- [x] lint-staged konfiguriert
- [x] Prettier konfiguriert (`.prettierrc.json`)
- [x] Pre-Commit-Hook ruft `lint-staged` auf
- [x] npm-Scripts für manuelle Formatierung (`format`, `lint:fix`)
- [x] Dokumentation erstellt (diese Datei)

**Test:**

```bash
# 1. Datei ändern
echo "const x = 1" >> src/test.js

# 2. Stage + Commit
git add src/test.js
git commit -m "test: pre-commit-hook"

# Erwartung: Prettier formatiert, ESLint prüft, Commit erfolgt nur bei Success
```

---

## 📚 Weiterführende Ressourcen

- **Husky-Docs:** https://typicode.github.io/husky/
- **lint-staged-Docs:** https://github.com/lint-staged/lint-staged
- **Prettier-Docs:** https://prettier.io/docs/en/
- **ESLint-Docs:** https://eslint.org/docs/latest/

---

**Ende PRE-COMMIT-HOOKS.md** ✅

→ Pre-Commit-Hooks sind aktiv! Kein unlinted Code kann mehr committed werden.
