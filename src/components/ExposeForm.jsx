// 📦 Styles & Core
import '../styles/ExposeTool.css';

import React, { useState } from 'react';

// 🔖 Tabs für die Formularstruktur
const TABS = [
  { id: 'objekt', label: '🏠 Objektdaten' },
  { id: 'flaeche', label: '📐 Flächen & Räume' },
  { id: 'baujahr', label: '🧱 Baujahr & Zustand' },
  { id: 'kosten', label: '💸 Preis & Energie' },
  { id: 'ausstattung', label: '🛠 Ausstattung' },
  { id: 'verkehr', label: '🚆 Anbindung' },
  { id: 'verfuegbarkeit', label: '📆 Verfügbarkeit' },
  { id: 'besonderheiten', label: '✨ Besonderheiten' }
];

const ExposeForm = ({ formData, setFormData }) => {
  const [activeTab, setActiveTab] = useState('objekt');

  // 🛠 Aktualisiert das formData bei Eingabe
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // 🧱 Erzeugt einzelne Eingabefelder oder Auswahlfelder
  const renderInput = (name, placeholder, type = 'input') => (
    <div>
      <label>{placeholder}</label>
      {type === 'textarea' ? (
        <textarea name={name} onChange={handleChange} placeholder={placeholder} />
      ) : type === 'select' ? (
        <select name={name} onChange={handleChange}>
          <option value=''>{placeholder}</option>
          {/* Optionen individuell im renderTab setzen */}
        </select>
      ) : (
        <input name={name} placeholder={placeholder} onChange={handleChange} />
      )}
    </div>
  );

  // 🧩 Wechselt die Eingabefelder je nach gewähltem Tab
  const renderTab = () => {
    switch (activeTab) {
      case 'objekt':
        return (
          <>
            <label>🏠 Objektart</label>
            <select name='objektart' onChange={handleChange}>
              <option value=''>Bitte wählen</option>
              <option>Wohnung</option>
              <option>Haus</option>
              <option>Gewerbe</option>
            </select>
            {renderInput('strasse', 'Straße')}
            {renderInput('plz_ort', 'PLZ, Ort')}
            {renderInput('bezirk', '📍 Bezirk / Stadtteil')}
            {renderInput('sicht', '🌅 Sicht auf ...')}
            {renderInput('lage_besonderheiten', '🌳 Besonderheiten der Lage (Altstadt, Rheinblick...)')}
          </>
        );
      case 'flaeche':
        return (
          <>
            {renderInput('wohnflaeche', 'Wohnfläche (m²)')}
            {renderInput('grundstueck', 'Grundstücksfläche (m²)')}
            {renderInput('zimmer', 'Zimmeranzahl')}
            {renderInput('schlafzimmer', 'Schlafzimmer')}
            {renderInput('badezimmer', 'Badezimmer')}
            {renderInput('keller', 'Keller vorhanden?')}
            {renderInput('balkon', 'Anzahl Balkone')}
          </>
        );
      case 'baujahr':
        return (
          <>
            {renderInput('baujahr', 'Baujahr')}
            {renderInput('zustand', 'Zustand (z.B. saniert)')}
            {renderInput('modernisierung', 'Sanierungsjahr(e)')}
            {renderInput('bauphase', 'Bauphase (z.B. Neubau)')}
            {renderInput('etagenanzahl', 'Etagenanzahl')}
          </>
        );
      case 'kosten':
        return (
          <>
            {renderInput('kaufpreis', 'Kaufpreis (€)')}
            {renderInput('kaltmiete', 'Kaltmiete (€)')}
            {renderInput('warmmiete', 'Warmmiete (€)')}
            {renderInput('nebenkosten', 'Nebenkosten (€)')}
            {renderInput('energieklasse', 'Energieklasse')}
            {renderInput('energieausweis', 'Energieausweis vorhanden?')}
          </>
        );
      case 'ausstattung':
        return (
          <>
            {renderInput('heizung', 'Heizungsart')}
            {renderInput('boden', 'Bodenbelag (z.B. Parkett)')}
            {renderInput('stellplatz', 'Stellplatztyp')}
            {renderInput('aufzug', 'Aufzug vorhanden?')}
            {renderInput('internet', 'Internet (Glasfaser?)')}
            {renderInput('smarthome', 'Smart Home integriert?')}
          </>
        );
      case 'verkehr':
        return (
          <>
            {renderInput('oeffentliche', 'ÖPNV (Minuten zu Fuß)')}
            {renderInput('autobahn', 'Entfernung zur Autobahn (Minuten)')}
            {renderInput('bahnhof', 'Bahnhof (Minuten)')}
            {renderInput('flughafen', 'Flughafen (Minuten)')}
          </>
        );
      case 'verfuegbarkeit':
        return (
          <>
            {renderInput('verfuegbar_ab', 'Verfügbar ab (Datum)')}
            {renderInput('bezug', 'Bezugstermin / Fertigstellung')}
            {renderInput('kurzfristig', 'Kurzfristig beziehbar?')}
          </>
        );
      case 'besonderheiten':
        return (
          <>
            {renderInput('highlights', '✨ Highlights der Immobilie', 'textarea')}
            {renderInput('beschreibung', 'Beschreibungstext', 'textarea')}
            <label>🖋 Stil</label>
            <select name='stil' onChange={handleChange}>
              <option value=''>Bitte wählen</option>
              <option value='modern'>Modern</option>
              <option value='klassisch'>Klassisch</option>
              <option value='emotional'>Emotional</option>
            </select>
            <label>🎯 Zielgruppe</label>
            <select name='zielgruppe' onChange={handleChange}>
              <option value=''>Bitte wählen</option>
              <option value='familien'>Familien</option>
              <option value='investoren'>Investoren</option>
              <option value='senioren'>Senioren</option>
              <option value='studenten'>Studenten</option>
            </select>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className='form-wrapper'>
      {/* 🔄 Tab-Wechsler */}
      <div className='tab-header'>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? 'active' : ''}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 📥 Inhalt der Tabs */}
      <div className='tab-content'>{renderTab()}</div>
    </div>
  );
};

export default ExposeForm;
