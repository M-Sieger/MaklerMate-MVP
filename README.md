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

- **Frontend:** React 19 (Hooks, `useState`) + Vite  
- **Styling:** CSS Modules & klassische CSS-Dateien  
- **PDF-Export:** jsPDF (PDF-fähig, inkl. Logo & Captions)  
- **Persistenz:** LocalStorage (MVP)  
- **Auth (geplant):** Supabase  
- **Deployment:** Vercel → [makler-mate.vercel.app](https://makler-mate.vercel.app/)  

---

## 📥 Installation (lokal)

```bash
# Repo klonen
git clone https://github.com/USERNAME/MaklerMate-MVP.git
cd MaklerMate-MVP

# Abhängigkeiten installieren
pnpm install   # oder npm install

# Dev-Server starten
pnpm run dev
App läuft dann unter: http://localhost:5173

📄 Environment Variablen
Die App benötigt .env-Dateien (nicht im Repo enthalten).
Beispiel (.env.example):

env
Kopieren
Bearbeiten
# Frontend
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Server / Proxy
OPENAI_API_KEY=your_openai_key
PORT=5001
⚠️ Hinweis: Echte Keys dürfen nicht ins Repo committed werden.

🔮 Roadmap
 Supabase Auth (E-Mail-Login, später Social Logins)

 Stripe Integration (Subscription-Modell)

 Erweiterung CRM (Foto-Upload, Notizen, GPT-gestützte Lead-Hilfe)

 API-Backend (Supabase/Postgres) für persistente Speicherung

 Internationalisierung (EN/DE, später KE/UK)

🤝 Contribution
Pull Requests willkommen!
Bitte folgende Guidelines beachten:

Branch-Namen: feature/*, bugfix/*

Code-Stil: funktionale Komponenten, Hooks, CSS Modules

Commit Messages: klar und beschreibend

📄 License
MIT License – siehe LICENSE.

📝 Hinweis
MaklerMate ist aktuell ein MVP – Änderungen am Code & API-Design sind jederzeit möglich.
Für die Exposé-Erstellung werden Zugangsdaten benötigt, die auf Anfrage bereitgestellt werden.
