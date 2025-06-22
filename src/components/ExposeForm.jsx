import React, { useState } from 'react';

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

const ExposeForm = ({ formData, setFormData, onChange }) => {
  const [activeTab, setActiveTab] = useState('objekt');

  const handleLocalChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (onChange) onChange(e);
  };

  const renderInput = (name, placeholder, type = 'input') => (
    <div>
      <label>{placeholder}</label>
      {type === 'textarea' ? (
        <textarea name={name} value={formData[name] || ''} onChange={handleLocalChange} placeholder={placeholder} />
      ) : type === 'select' ? (
        <select name={name} value={formData[name] || ''} onChange={handleLocalChange}>
          <option value=''>{placeholder}</option>
        </select>
      ) : (
        <input name={name} value={formData[name] || ''} placeholder={placeholder} onChange={handleLocalChange} />
      )}
    </div>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'objekt':
        return (
          <>
            <label>🏠 Objektart</label>
            <select name='objektart' value={formData.objektart} onChange={handleLocalChange}>
              <option value=''>Bitte wählen</option>
              <option>Wohnung</option>
              <option>Haus</option>
              <option>Gewerbe</option>
            </select>
            {renderInput('strasse', 'Straße')}
            {renderInput('ort', 'PLZ, Ort')}
            {renderInput('bezirk', '📍 Bezirk / Stadtteil')}
            {renderInput('sicht', '🌅 Sicht auf ...')}
            {renderInput('lagebesonderheiten', '🌳 Besonderheiten der Lage')}
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
            {renderInput('zustand', 'Zustand')}
            {renderInput('modernisierung', 'Sanierungsjahr(e)')}
            {renderInput('bauphase', 'Bauphase')}
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
            {renderInput('boden', 'Bodenbelag')}
            {renderInput('stellplatz', 'Stellplatztyp')}
            {renderInput('aufzug', 'Aufzug vorhanden?')}
            {renderInput('internet', 'Internet')}
            {renderInput('smarthome', 'Smart Home?')}
          </>
        );
      case 'verkehr':
        return (
          <>
            {renderInput('oeffentliche', 'ÖPNV')}
            {renderInput('autobahn', 'Autobahn')}
            {renderInput('bahnhof', 'Bahnhof')}
            {renderInput('flughafen', 'Flughafen')}
          </>
        );
      case 'verfuegbarkeit':
        return (
          <>
            {renderInput('verfuegbar_ab', 'Verfügbar ab')}
            {renderInput('bezug', 'Bezugstermin')}
            {renderInput('kurzfristig', 'Kurzfristig?')}
          </>
        );
      case 'besonderheiten':
        return (
          <>
            {renderInput('highlights', '✨ Highlights', 'textarea')}
            {renderInput('beschreibung', 'Beschreibung', 'textarea')}
            <label>🖋 Stil</label>
            <select name='stil' value={formData.stil || ''} onChange={handleLocalChange}>
              <option value=''>Bitte wählen</option>
              <option value='modern'>Modern</option>
              <option value='klassisch'>Klassisch</option>
              <option value='emotional'>Emotional</option>
            </select>
            <label>🎯 Zielgruppe</label>
            <select name='zielgruppe' value={formData.zielgruppe || ''} onChange={handleLocalChange}>
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
    <div className="form-wrapper">
      <div className="tab-header">
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
      <div className="tab-content">{renderTab()}</div>
    </div>
  );
};

export default ExposeForm;
