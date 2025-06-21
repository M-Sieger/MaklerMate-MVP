import '../styles/ExposeTool.css';

// 🧠 UX-optimiertes ExposeForm.jsx (mit Tabs wie im Screenshot)
import React, { useState } from 'react';

const TABS = [
  { id: "objekt", label: "🏠 Objektdaten" },
  { id: "flaeche", label: "📐 Flächen & Räume" },
  { id: "baujahr", label: "🧱 Baujahr & Zustand" },
  { id: "kosten", label: "💸 Preis & Energie" },
  { id: "ausstattung", label: "🛠 Ausstattung" },
  { id: "verkehr", label: "🚆 Anbindung" },
  { id: "verfuegbarkeit", label: "📆 Verfügbarkeit" },
  { id: "besonderheiten", label: "✨ Besonderheiten" },
];

const ExposeForm = ({ formData, setFormData }) => {
  const [activeTab, setActiveTab] = useState("objekt");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const renderTab = () => {
    switch (activeTab) {
      case "objekt":
        return (
          <>
            <select name="objektart" onChange={handleChange}>
              <option value="">🏠 Objektart wählen</option>
              <option>Wohnung</option>
              <option>Haus</option>
              <option>Gewerbe</option>
            </select>
            <input name="strasse" placeholder="Straße" onChange={handleChange} />
            <input name="plz_ort" placeholder="PLZ, Ort" onChange={handleChange} />
            <input name="bezirk" placeholder="📍 Bezirk / Stadtteil" onChange={handleChange} />
            <input name="sicht" placeholder="🌅 Sicht auf ..." onChange={handleChange} />
            <input name="lage_besonderheiten" placeholder="🌳 Besonderheiten der Lage (Altstadt, Rheinblick...)" onChange={handleChange} />
          </>
        );
      case "flaeche":
        return (
          <>
            <input name="wohnflaeche" placeholder="Wohnfläche (m²)" onChange={handleChange} />
            <input name="grundstueck" placeholder="Grundstücksfläche (m²)" onChange={handleChange} />
            <input name="zimmer" placeholder="Zimmeranzahl" onChange={handleChange} />
            <input name="schlafzimmer" placeholder="Schlafzimmer" onChange={handleChange} />
            <input name="badezimmer" placeholder="Badezimmer" onChange={handleChange} />
            <input name="keller" placeholder="Keller vorhanden?" onChange={handleChange} />
            <input name="balkon" placeholder="Anzahl Balkone" onChange={handleChange} />
          </>
        );
      case "baujahr":
        return (
          <>
            <input name="baujahr" placeholder="Baujahr" onChange={handleChange} />
            <input name="zustand" placeholder="Zustand (z.B. saniert)" onChange={handleChange} />
            <input name="modernisierung" placeholder="Sanierungsjahr(e)" onChange={handleChange} />
            <input name="bauphase" placeholder="Bauphase (z.B. Neubau)" onChange={handleChange} />
            <input name="etagenanzahl" placeholder="Etagenanzahl" onChange={handleChange} />
          </>
        );
      case "kosten":
        return (
          <>
            <input name="kaufpreis" placeholder="Kaufpreis (€)" onChange={handleChange} />
            <input name="kaltmiete" placeholder="Kaltmiete (€)" onChange={handleChange} />
            <input name="warmmiete" placeholder="Warmmiete (€)" onChange={handleChange} />
            <input name="nebenkosten" placeholder="Nebenkosten (€)" onChange={handleChange} />
            <input name="energieklasse" placeholder="Energieklasse" onChange={handleChange} />
            <input name="energieausweis" placeholder="Energieausweis vorhanden?" onChange={handleChange} />
          </>
        );
      case "ausstattung":
        return (
          <>
            <input name="heizung" placeholder="Heizungsart" onChange={handleChange} />
            <input name="boden" placeholder="Bodenbelag (z.B. Parkett)" onChange={handleChange} />
            <input name="stellplatz" placeholder="Stellplatztyp" onChange={handleChange} />
            <input name="aufzug" placeholder="Aufzug vorhanden?" onChange={handleChange} />
            <input name="internet" placeholder="Internet (Glasfaser?)" onChange={handleChange} />
            <input name="smarthome" placeholder="Smart Home integriert?" onChange={handleChange} />
          </>
        );
      case "verkehr":
        return (
          <>
            <input name="oeffentliche" placeholder="ÖPNV (Minuten zu Fuß)" onChange={handleChange} />
            <input name="autobahn" placeholder="Entfernung zur Autobahn (Minuten)" onChange={handleChange} />
            <input name="bahnhof" placeholder="Bahnhof (Minuten)" onChange={handleChange} />
            <input name="flughafen" placeholder="Flughafen (Minuten)" onChange={handleChange} />
          </>
        );
      case "verfuegbarkeit":
        return (
          <>
            <input name="verfuegbar_ab" placeholder="Verfügbar ab (Datum)" onChange={handleChange} />
            <input name="bezug" placeholder="Bezugstermin / Fertigstellung" onChange={handleChange} />
            <input name="kurzfristig" placeholder="Kurzfristig beziehbar?" onChange={handleChange} />
          </>
        );
      case "besonderheiten":
        return (
          <>
            <textarea name="highlights" placeholder="✨ Highlights der Immobilie" onChange={handleChange} />
            <textarea name="beschreibung" placeholder="Beschreibungstext" onChange={handleChange} />
            <select name="stil" onChange={handleChange}>
              <option value="">🖋 Stil wählen ...</option>
              <option value="modern">Modern</option>
              <option value="klassisch">Klassisch</option>
              <option value="emotional">Emotional</option>
            </select>
            <select name="zielgruppe" onChange={handleChange}>
              <option value="">🎯 Zielgruppe wählen ...</option>
              <option value="familien">Familien</option>
              <option value="investoren">Investoren</option>
              <option value="senioren">Senioren</option>
              <option value="studenten">Studenten</option>
            </select>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="form-wrapper">
      {/* Tab-Leiste */}
      <div className="tab-header">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Aktiver Tab-Inhalt */}
      <div className="tab-content">{renderTab()}</div>
    </div>
  );
};

export default ExposeForm;
