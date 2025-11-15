# 🎯 Product Strategy – MaklerMate

> Kurzfassung der MaklerMate-Strategie basierend auf dem „Deep-Dive Validation"-Report (Silicon Valley / YC / a16z Framework).
> Dieses Dokument richtet sich an: Founder, Produkt, Architektur, Marketing.

---

## 1. Markt- und Problemverständnis

### 1.1 Zielmarkt

- **Land:** Deutschland (Startmarkt)
- **Zielkunden:** 1–3 Personen-Maklerbüros, später bis ca. 10 Personen
- **Marktgröße (Broker):**
  - ~34.500 Immobilienmakler in Deutschland
  - davon ~20.000 Solo-Makler / Micro-Teams

**MaklerMate adressiert insbesondere:**

- Makler ohne große IT-/Backoffice-Struktur
- Makler, die klassische Lösungen (onOffice, Propstack) als zu teuer/zu komplex empfinden
- Makler, die schon mit KI experimentieren (ChatGPT, bloxl), aber kein integriertes System haben

### 1.2 Kernprobleme

1. **Zeitfresser Exposé**
   - 2–3 Stunden pro Exposé (Text, Bilder, Layout, Portalaufbereitung)
   - Bei 10 Exposés/Monat = 20–30 Stunden, also 3–4 Arbeitstage / Monat.

2. **Tool-Chaos statt Workflow**
   - Word/Pages + Canva + ChatGPT + Excel + WhatsApp → keine zentrale Sicht auf Leads & Objekte.
   - Hohe kognitive Last, ineffizient, fehleranfällig.

3. **Kein „CRM, das ich wirklich nutze"**
   - Große CRMs wirken wie ERP-Systeme für Konzerne.
   - Solo-Makler bleiben bei Excel, Notizen und Kopf.

4. **Wachsende rechtliche Komplexität**
   - DSGVO, EU AI Act, Haftungsfragen bei KI-generierten Texten.
   - Unsicherheit führt zu konservativen, „blutleeren" Exposés.

---

## 2. Positionierung & Differenzierung

### 2.1 Positionierung im Wettbewerbsfeld

Vereinfacht:

- **onOffice / Propstack / FLOWFACT**
  - Starke CRM/ERP-Systeme für größere Büros
  - Teuer (99 €+), komplex, wenig KI-first
- **bloxl / reine Exposé-KIs**
  - Starke Text-KI, aber kein CRM, keine Prozessintegration
- **MaklerMate**
  - **Mid-Tier:** 49 €/Monat
  - AI-Exposé + leichtgewichtiges CRM + Freemium + Fokus auf Solo-Makler

### 2.2 Differenzierungshebel

1. **Segment-Fokus:** Solo-Makler / kleine Büros
   Kein Versuch, „allen recht zu machen" – UI, Pricing, Features konsequent auf diese Zielgruppe abgestimmt.

2. **AI-first, nicht AI-als-Add-on:**
   - Exposé, Bildbeschreibung, später Lead-Scoring, Social-Content, ggf. Voice/Video – alles rund um KI-gestützte Vermarktung.

3. **Freemium / PLG (Product-Led Growth):**
   - Niedrige Einstiegshürde (10 Exposés/Monat gratis), Produkt erklärt sich selbst.
   - Kein „Sales-Heavy"-Modell wie klassische CRMs.

4. **Konzentration auf Workflow statt nur Funktion:**
   - Exposé → PDF → Portal → CRM → Follow-up – als verbundener Flow gedacht.

---

## 3. 12–24-Monats-Produkt-Roadmap (high level)

### Phase 1: MVP & Product-Market-Fit (0–6 Monate)

**Ziel:** 100 zahlende Kunden, NPS > 40, klare Nutzungsmuster.

**Must-Haves (P0):**

- KI-Exposé-Generator (GPT‑4o-mini), konfigurierbar nach Stil
- PDF-Export mit Branding
- CRM-Light (Kontakte, Notizen, Status, einfache Filter)
- Freemium mit Limit (z. B. 10 Exposés/Monat)
- Basis-DSGVO-Compliance (Daten löschen/exportieren, saubere Terms)

**KPIs:**

- 500+ Free Signups
- 5 % Free → Paid Conversion
- >20 h/Monat Zeitersparnis für aktive Makler (geschätzt)

---

### Phase 2: Feature-Parität plus „1–2 Dinge besser" (6–12 Monate)

**Ziel:** Auf Augenhöhe mit direkten Wettbewerbern + erste echte Differenzierung.

**Should-Haves (P1):**

- Export nach ImmoScout24 (XML oder API)
- Bildbeschreibung + Vorschlag von Captions (GPT‑4 Vision)
- Verbesserte PDF-Templates (Corporate Design, Sections)
- Zentrale Logging-/Fehlerbehandlung und robuster API-Layer (siehe ADR‑003)

**GTM/Vertrieb:**

- Content-SEO („Exposé erstellen", „KI-Exposé")
- Community-Ansatz (Maklergruppen, Webinare)
- Partnerschaftspilot mit IVD-Regionalverband oder kleinerem Portal

**KPIs:**

- 300–500 zahlende Kunden
- MRR 15–25k €
- Organischer Traffic spürbar steigend (SEO/Community)

---

### Phase 3: AI-Differenzierung & Ecosystem (12–24 Monate)

**Ziel:** Nicht nur „auch KI", sondern „best-in-class KI für Makler-Workflows".

**Attractive Features (P2/P3):**

- Virtual Staging (zuerst über Drittanbieter-API, später ggf. eigenes Modell)
- Social-Media-Content (Kurztexte, Caption-Vorschläge, evtl. einfache Postings)
- Simple Lead-Scoring (Regel-basiert, später ML-gestützt)
- Integrationen:
  - Zapier/Make (Anbindung an E-Mail, Kalender, Drittsysteme)
  - Weitere Portale (Immowelt, Immonet, ggf. Kleinanzeigen)

**Langfristig (Agent-Vision, 24–36 Monate):**

- AI-Agent, der wiederkehrende Aufgaben vorbereitet:
  - Exposé aus Daten + Bildern vollautomatisch generieren
  - Followup-Empfehlungen generieren
  - Terminvorschläge aus Kalender + Portal-Anfragen vorbereiten
- Immer mit „Human-in-the-Loop" (Makler bestätigt entscheidende Schritte).

---

## 4. Go-to-Market (GTM) – Kurzfassung

### 4.1 Core-Strategie

1. **Product-Led Growth / Freemium**
   - Starker Onboarding-Fokus (User innerhalb einer Minute zum ersten Exposé).
   - In-App-Momente: „Du hast gerade 2,5 Stunden gespart."

2. **Content & SEO**
   - Ratgeber zu Exposé, KI im Makleralltag, Social-Media für Makler.
   - Vergleichsseiten (MaklerMate vs. X) mit ehrlicher Darstellung.

3. **Community & Verbände**
   - Präsenz in Makler-Facebook-Gruppen, Foren, Stammtischen.
   - Kooperation mit IVD (Rabatt/Tarifmodell für Mitglieder, Webinare).

4. **Partnerschaften**
   - ImmoScout24 / Portale als Hebel für Distribution.
   - Später: Versicherer/Vertriebsverbünde, die MaklerMate als Mehrwerttool anbieten.

### 4.2 Kanäle & Priorität (Jahr 1)

- P0: In-Product-Funnel (Freemium, Referrals, In-App-Sharing)
- P0: SEO/Content
- P1: Community (Facebook-Gruppen, Webinare, Podcasts)
- P1: Partnerschaften (IVD, ImmoScout24-Pilot)
- P2: Paid Ads (Facebook/Instagram, später gezielt Google Ads)
- P3: Cold Outbound (vorsichtig wegen DSGVO, selektiv via LinkedIn)

---

## 5. Metriken & Ziele

### 5.1 Kernmetriken

- **North Star:**
  Anzahl **aktiver Makler mit ≥3 Exposés/Monat** + geschätzte **Zeitersparnis**.

- **Akquisition:**
  - Free Signups/Monat
  - Visitor → Signup Conversion (%)
  - Free → Paid Conversion (%)

- **Retention & Wert:**
  - Monatliche Churn Rate (%)
  - Net Revenue Retention (NRR)
  - Durch­schnittliche Anzahl Exposés/Monat pro aktivem Makler

- **Unit Economics:**
  - CAC nach Kanal
  - LTV (Ziel > 1.000 €)
  - LTV/CAC (Ziel ≥ 3, angestrebt 5–10)

### 5.2 Grobe Zielwerte (beispielhaft)

- Monat 6:
  - 100 zahlende Kunden, 5k €/MRR
- Monat 12:
  - 400–500 zahlende Kunden, 20–25k €/MRR
- Monat 24:
  - 1.000+ zahlende Kunden, 50–70k €/MRR

---

## 6. Produktentscheidungen, die wir konsequent treffen wollen

1. **„Solo-Makler-friendly" vor „Enterprise-ready"**
   - Keine überladene Rechteverwaltung, keine 100 Reports, keine 50 Custom-Felder zum Launch.

2. **Workflow > Feature-Liste**
   - Wir optimieren komplette Abläufe (z. B. „Neues Objekt → Exposé → Portal → Leads tracken"), nicht isolierte Funktionen.

3. **Focus auf Qualität der AI-Ausgaben**
   - Lieber weniger, aber verlässlichere AI-Features mit guter UX (Review, Korrektur, rechtlich sicherer Rahmen), als 100 halbgare Experimente.

4. **Keine Sonderlocken pro Kunde**
   - Keine maßgeschneiderten Einzellösungen für einzelne Makler, die Produkt kompliziert machen.
   - Feature-Wünsche werden gegen Vision/Strategie gespiegelt.

---

## 7. Risiken & bewusste Annahmen (kurz)

**Haupt-Risiken:**

- Incumbents (onOffice, Propstack, Portale) bundlen ähnliche KI-Features.
- AI-Haftung / Regulierung (EU AI Act, DSGVO) schränkt manche Features ein.
- Makler-Community bleibt in Teilen skeptisch gegenüber KI.

**Bewusste Annahmen:**

- Es wird eine signifikante Gruppe von Maklern geben, die **bereit sind, 49 €/Monat** für ein schlankes, KI-zentriertes Tool zu zahlen.
- Zeitersparnis + wahrgenommene Professionalität sind starke Kaufargumente.
- Eine Kombination aus Freemium + Community + Content ist effizienter als ein klassischer Enterprise-Sales-Ansatz.

---

## 8. Verbindung zur Code-/Architektur-Strategie

Die Produktstrategie spiegelt sich im Code/Architektur-Design wider:

- **Service Layer** (ADR‑001):
  Saubere Business-Logik für Exposés, Exporte, CRM – vorbereitend für AI-Features und Backend-Erweiterungen.

- **Zustand (State-Management)** (ADR‑002):
  Zentraler, testbarer Zustand für Exposé-/CRM-Workflows, gut erweiterbar für neue Features.

- **Zentraler API-Client** (ADR‑003):
  Stabiler Access zu OpenAI/Supabase/Portalen, um AI-Features und Portalintegration robust auszurollen.

- **TypeScript & Strict Mode**:
  Bewusst gewählt, um Fehlerkosten und Refactoring-Aufwand niedrig zu halten, während wir schnell iterieren.

Diese Datei dient als Brücke zwischen Produktwelt und Codewelt: **wenn wir neue technische Tasks planen, sollten sie immer gegen diese Strategie gespiegelt werden.**
