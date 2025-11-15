# 🗺️ Product Roadmap – MaklerMate (nächste 12 Monate)

## Phase 1 – MVP & Stabilisierung (0–3 Monate)

**Ziele:**
- End-to-End-Flow funktioniert robust:
  - Objekt anlegen → Exposé generieren → PDF → Lead anlegen → Lead-Status ändern
- 10–20 aktive Makler, qualitatives Feedback

**ToDos (Auszug):**
- Exposé-Formular vervollständigen (Pflichtfelder, Validierung)
- AI-Generierung robust machen (Loading-Status, Fehlermeldungen, Retry)
- PDF-Template(s) finalisieren (Branding, schöner Umbruch)
- CRM-Light „usable":
  - Leads anlegen/ändern
  - Statuswechsel, Notizen
  - einfache Filter
- Erste Unit-Tests:
  - Services (`exposeService`, `pdfService`, `exportService`)
  - Stores (Zustand-Stores für Exposés & Leads)

---

## Phase 2 – Feature-Parität & UX (3–6 Monate)

**Ziele:**
- Tool fühlt sich für Solo-Makler „vollständig genug" an, um es im Alltag zu nutzen.
- 50–100 zahlende Nutzer (oder ernsthafte Trial-User)

**ToDos (Auszug):**
- ImmoScout24-Export vorbereiten (mindestens als „XML Download")
- Bild-Upload + Bild-Handling verbessern
- Erste „Quality-of-Life"-UX-Verbesserungen:
  - Onboarding-Flow mit Demo-Objekt
  - Klarere Navigation (Exposés / Leads / Einstellungen)
  - Mobile-Breakpoints fixen für Kern-Screens
- Mehr Tests:
  - Happy-Path-E2E-Test (z.B. mit Playwright/Cypress)
  - Fehlerpfade (fehlende ENV, API-Fehler)

---

## Phase 3 – AI-Differenzierung & Integrationen (6–12 Monate)

**Ziele:**
- MaklerMate ist nicht nur „auch KI", sondern merkbar besser als einfache ChatGPT-/bloxl-Setups.
- Verlässliche Go-to-Market-Struktur (SEO, Community, ggf. IVD/Portal-Piloten).

**ToDos (Auszug):**
- GPT-4-Vision: automatische Bildbeschreibungen / Bildauswahl
- Export zu mindestens einem großen Portal (ImmoScout24-Integration produktionsreif)
- Zapier/Make-Integration (Basis-Trigger/Aktionen)
- Erste AI-„Assistenz"-Features:
  - einfache Follow-up-Empfehlungen im CRM
- UI/UX-Feinschliff auf Basis echter Nutzerinterviews

---

## Phase 4 – Agent-Vision (12–24 Monate, Zielbild)

**Ziele:**
- AI-Assistent übernimmt Teile des Workflows (Vorbereitung, Erinnerungen, Vorschläge), Makler bleibt im Lead.

**Mögliche Schritte:**
- Agent, der:
  - neue Objekte aus strukturierten Daten + Bildern komplett vorbefüllt,
  - inaktive Leads erkennt und Follow-ups vorschlägt
- Erweiterte Analytics (Zeitersparnis, Conversion-Funnels der Leads)
- Evaluierung: Welche Features zahlen wirklich auf Retention / ARPU ein?

---

## Roadmap-Pflege

- Diese Datei ist *lebendiges Dokument*:
  - Nach jedem größeren Milestone kurz aktualisieren
  - „Erledigt"-Abschnitte explizit markieren
- ALWAYS: Neue technische Tasks gegen Vision & Strategy spiegeln:
  - Hilft das Feature einem Solo-Makler wirklich?
  - Spart es merkbar Zeit?
  - Macht es den Kernflow besser?
