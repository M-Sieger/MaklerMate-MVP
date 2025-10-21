# 🏡 MaklerMate – KI-gestützter Immobilien-Exposé-Generator

MaklerMate ist eine React-basierte Web-App, die Immobilienmaklern in wenigen Minuten ein professionelles, druckfertiges Exposé erstellt – automatisch, stilvoll und als PDF.

👉 **Live-Demo:** [makler-mate.vercel.app](https://makler-mate.vercel.app/)  
🔑 **Zugangsdaten** für die Exposé-Erstellung können auf Anfrage bereitgestellt werden.

---

## 🚀 Features (MVP)

- 📑 **Exposé-Generator** mit GPT-Integration (Stilwahl: sachlich, emotional, Luxus)
- 🖼️ **Bild-Upload** mit Captions
- 📦 **Export** als druckfertiges PDF & CSV
- 💾 **LocalStorage** für gespeicherte Exposés
- 👥 **CRM-Light**: einfache Lead-Verwaltung mit Status (VIP, Warm, Neu)
- 🎨 **Modernes UI** mit CSS Modules & Glassmorphismus
- 🔐 **Login**-Bereich: Benutzername wird gespeichert (localStorage)
- 🚧 **Protected Routes** für Exposé-Erstellung (nur mit Zugangsdaten)

---

## 🛠️ Tech Stack

- **Frontend:** React 19 (Hooks, `useState`) + Create React App 5.0.1
- **Styling:** CSS Modules & klassische CSS-Dateien
- **Backend:** Express 5.1.0 (Dev-Proxy) + Vercel Serverless (Production)
- **Auth:** Supabase 2.55.0 (Magic-Link, Password-Login)
- **AI:** OpenAI GPT-4o-mini (Text-Generierung)
- **PDF-Export:** jsPDF 3.0.1 (PDF-fähig, inkl. Logo & Captions)
- **Persistenz:** LocalStorage (MVP, Migration zu Supabase-DB geplant)
- **Deployment:** Vercel → [makler-mate.vercel.app](https://makler-mate.vercel.app/)

**Vollständige Tech-Stack-Dokumentation:** Siehe `docs/ARCHITECTURE.md`

---

## 📥 Installation & Setup (lokal)

### **Voraussetzungen**

- Node.js 22+ (empfohlen: v22.17.0)
- pnpm 10+ (Installation: `npm install -g pnpm`)
- Supabase-Account (kostenlos: https://supabase.com)
- OpenAI-API-Key (https://platform.openai.com/api-keys)

### **1. Repository klonen**

```bash
git clone https://github.com/M-Sieger/MaklerMate-MVP.git
cd MaklerMate-MVP
```

### **2. Dependencies installieren**

```bash
pnpm install
```

### **3. Environment-Variablen konfigurieren**

```bash
# .env.example kopieren
cp .env.example .env

# .env bearbeiten (fülle deine Keys ein):
# - REACT_APP_SUPABASE_URL (von Supabase Dashboard)
# - REACT_APP_SUPABASE_ANON_KEY (von Supabase Dashboard)
# - OPENAI_API_KEY (von OpenAI Dashboard)
```

**Detaillierte Anleitung:** Siehe `.env.example` für Kommentare zu jedem Key.

### **4. Entwicklungs-Umgebung starten**

**Option A: Nur Frontend (ohne GPT-Integration)**

```bash
pnpm start
# → http://localhost:3000
```

**Option B: Frontend + GPT-Proxy (empfohlen für vollständige Entwicklung)**

```bash
# Terminal 1: Express-Proxy für GPT-Calls
node server/gpt-proxy.js
# → http://localhost:5001

# Terminal 2: React-Frontend
pnpm start
# → http://localhost:3000
```

**Hinweis:** Der GPT-Proxy (`server/gpt-proxy.js`) ist nur für lokale Entwicklung gedacht. Production nutzt Vercel Serverless (`api/generate-expose.js`).

---

## 📄 Environment-Variablen (Übersicht)

Die App benötigt folgende Variablen (siehe `.env.example` für Details):

| Variable                      | Erforderlich | Zweck                                | Wo zu finden                         |
| ----------------------------- | ------------ | ------------------------------------ | ------------------------------------ |
| `REACT_APP_SUPABASE_URL`      | ✅           | Supabase-Projekt-URL                 | Supabase Dashboard → Settings → API  |
| `REACT_APP_SUPABASE_ANON_KEY` | ✅           | Supabase Anonymous-Key (public-safe) | Supabase Dashboard → Settings → API  |
| `OPENAI_API_KEY`              | ✅ (für GPT) | OpenAI API-Key                       | https://platform.openai.com/api-keys |
| `PORT`                        | ❌           | Express-Server-Port (default: 5001)  | Optional                             |

⚠️ **Sicherheits-Hinweis:** `.env` ist gitignored. Echte Keys NIE committen!

## 🔮 Roadmap

**Sprint 1 (Quick Wins) – ✅ Abgeschlossen**

- ✅ Copilot-Instructions (Workflow-Standards)
- ✅ ARCHITECTURE.md (Tech-Stack-Dokumentation)
- ✅ .env.example + README-Update
- ✅ Pre-Commit-Hooks (Husky + Prettier)
- ✅ LICENSE (MIT)
- ✅ README-Korrekturen (Script-Namen, Tech-Stack)

**Sprint 2 (Testing + CI/CD)**

- ⏳ Unit-Tests (Services, Utils, Hooks)
- ⏳ GitHub Actions CI/CD
- ⏳ Docker-Compose (Dev-Environment)
- ⏳ CHANGELOG.md

**Sprint 3 (TypeScript + E2E)**

- ⏳ TypeScript-Migration (Strict-Mode)
- ⏳ E2E-Tests (Playwright)
- ⏳ Vite-Migration (CRA → Vite)

**v0.2.0 (Supabase-Database)**

- ⏳ Migration: LocalStorage → Supabase-Tables
- ⏳ Real-Time-Sync (Multi-Device)
- ⏳ Offline-First mit Supabase-Realtime

**v0.3.0+ (Features)**

- ⏳ Stripe Integration (Subscription-Modell)
- ⏳ Social-Media-Content-Generator (aus Objektdaten)
- ⏳ Internationalisierung (EN/DE, später KE/UK)

**Detaillierte Roadmap:** Siehe `docs/REPO-IMPROVEMENT-PLAN.md`

## 🤝 Contribution

Pull Requests sind willkommen! Bitte folgende Guidelines beachten:

**Workflow:**

1. Fork das Repo
2. Branch erstellen: `feature/dein-feature` oder `bugfix/dein-fix`
3. Änderungen committen (Conventional Commits: `feat:`, `fix:`, `docs:`)
4. Pull Request öffnen

**Code-Standards:**

- Funktionale Komponenten (keine Class-Components)
- Hooks für State-Management
- CSS-Module für Component-Styles
- Header-Kommentare mit Emojis (📄, 🔐, 🧠) für Lesbarkeit

**Vor dem Commit:**

- Pre-Commit-Hooks laufen automatisch (Prettier + ESLint) ✅
- Tests laufen: `pnpm test -- --watchAll=false` (wenn Tests vorhanden)
- Build funktioniert: `pnpm run build`
- Manuell formatieren: `pnpm run format` (optional)

**Dokumentation:**

- Primary Source of Truth: `PROJECT.md`
- Tech-Stack: `docs/ARCHITECTURE.md`
- Copilot-Workflow: `.github/copilot-instructions.md`

---

## 📄 License

MIT License – siehe [LICENSE](./LICENSE)

**Was bedeutet das?**

- ✅ Open-Source (Code darf genutzt, modifiziert, verteilt werden)
- ✅ Kommerzielle Nutzung erlaubt
- ✅ Keine Garantie/Haftung

---

## 📚 Dokumentation

| Dokument                          | Zweck                                                       |
| --------------------------------- | ----------------------------------------------------------- |
| `PROJECT.md`                      | Primary Source of Truth (Projekt-Übersicht, Features, ADRs) |
| `docs/ARCHITECTURE.md`            | Tech-Stack, API-Verträge, Architektur-Entscheidungen        |
| `docs/REPO-IMPROVEMENT-PLAN.md`   | 3-Sprint-Roadmap (Tasks, ETAs, Acceptance Criteria)         |
| `.github/copilot-instructions.md` | Workflow-Standards für Copilot                              |
| `docs/PRE-COMMIT-HOOKS.md`        | Pre-Commit-Hooks-Dokumentation                              |
| `.env.example`                    | Environment-Variablen-Dokumentation                         |

---

## 📝 Hinweis

MaklerMate ist aktuell ein MVP (v0.1.0) – Änderungen am Code & API-Design sind jederzeit möglich.  
Für die Exposé-Erstellung werden Zugangsdaten benötigt, die auf Anfrage bereitgestellt werden.

**Fragen oder Feedback?** Öffne ein [Issue](https://github.com/M-Sieger/MaklerMate-MVP/issues) auf GitHub!
