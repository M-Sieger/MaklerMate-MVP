// src/components/ExposeForm.jsx

import React, { useState } from 'react';

import styles from './ExposeForm.module.css'; // 🔄 Direkt im Component-Ordner

// 🗂️ Tabdefinitionen mit Icons
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

  // 🔁 Eingabelogik (lokal & extern)
  const handleLocalChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (onChange) onChange(e);
  };

  // 🧩 Dynamisches Input-Rendering
  const renderInput = (name, placeholder, type = 'input') => (
    <div className={styles.formGroup}>
      <label>{placeholder}</label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={formData[name] || ''}
          onChange={handleLocalChange}
          placeholder={placeholder}
          className={styles.fancyInput}
        />
      ) : (
        <input
          name={name}
          value={formData[name] || ''}
          placeholder={placeholder}
          onChange={handleLocalChange}
          className={styles.fancyInput}
        />
      )}
    </div>
  );

  // 🧠 Panelstruktur für jede Tab-Sektion
  const renderTab = () => {
    const panel = (children) => (
      <div className={styles.panelSection}>{children}</div>
    );

    switch (activeTab) {
      case 'objekt':
        return panel(
  <>
    <div className={styles.fieldGroup}>
      <div className={styles.formGroup}>
        <label>🏠 Objektart</label>
        <select
          name='objektart'
          value={formData.objektart || ''}
          onChange={handleLocalChange}
          className={styles.fancyInput}
        >
          <option value=''>Bitte wählen</option>
          <option>Wohnung</option>
          <option>Haus</option>
          <option>Gewerbe</option>
        </select>
      </div>
      {renderInput('strasse', 'Straße')}
      {renderInput('ort', 'PLZ, Ort')}
      {renderInput('bezirk', '📍 Bezirk / Stadtteil')}
    </div>

    <div className={styles.fieldGroup}>
      {renderInput('sicht', '🌅 Sicht auf ...')}
      {renderInput('lagebesonderheiten', '🌳 Besonderheiten der Lage')}
    </div>
  </>
);

      case 'flaeche':
        return panel(
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
        return panel(
          <>
            {renderInput('baujahr', 'Baujahr')}
            {renderInput('zustand', 'Zustand')}
            {renderInput('modernisierung', 'Sanierungsjahr(e)')}
            {renderInput('bauphase', 'Bauphase')}
            {renderInput('etagenanzahl', 'Etagenanzahl')}
          </>
        );
      case 'kosten':
        return panel(
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
        return panel(
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
        return panel(
          <>
            {renderInput('oeffentliche', 'ÖPNV')}
            {renderInput('autobahn', 'Autobahn')}
            {renderInput('bahnhof', 'Bahnhof')}
            {renderInput('flughafen', 'Flughafen')}
          </>
        );
      case 'verfuegbarkeit':
        return panel(
          <>
            {renderInput('verfuegbar_ab', 'Verfügbar ab')}
            {renderInput('bezug', 'Bezugstermin')}
            {renderInput('kurzfristig', 'Kurzfristig?')}
          </>
        );
      case 'besonderheiten':
        return panel(
          <>
            {renderInput('highlights', '✨ Highlights', 'textarea')}
            {renderInput('beschreibung', 'Beschreibung', 'textarea')}
            <label>🖋 Stil</label>
            <select name='stil' value={formData.stil || ''} onChange={handleLocalChange} className={styles.fancyInput}>
              <option value=''>Bitte wählen</option>
              <option value='modern'>Modern</option>
              <option value='klassisch'>Klassisch</option>
              <option value='emotional'>Emotional</option>
            </select>
            <label>🎯 Zielgruppe</label>
            <select name='zielgruppe' value={formData.zielgruppe || ''} onChange={handleLocalChange} className={styles.fancyInput}>
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

  // 🧭 Gesamtlayout: Tabs oben, Panels unten
  return (
    <div className={styles.formWrapper}>
      <div className={styles.tabHeader}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.fancyTab} ${activeTab === tab.id ? styles.fancyTabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className={styles.tabContent}>{renderTab()}</div>
    </div>
  );
};

export default ExposeForm;
