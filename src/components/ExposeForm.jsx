import React from 'react';

import TabbedForm from './TabbedForm';

export default function ExposeForm({ formData, handleChange }) {
  const tabs = [
    {
      label: 'Objektdaten',
      content: (
        <>
          <select required defaultValue="" onChange={(e) => handleChange('objektart', e.target.value)}>
            <option value="" hidden>🏠 Objektart wählen</option>
            <option value="Haus">🏡 Haus</option>
            <option value="Wohnung">🏢 Wohnung</option>
            <option value="Gewerbe">🏬 Gewerbe</option>
          </select>
          <input type="text" placeholder="Straße" value={formData.strasse} onChange={(e) => handleChange('strasse', e.target.value)} />
          <input type="text" placeholder="PLZ, Ort" value={formData.ort} onChange={(e) => handleChange('ort', e.target.value)} />
        </>
      ),
    },
    {
      label: 'Flächen & Räume',
      content: (
        <>
          <input type="text" placeholder="Wohnfläche (m²)" value={formData.wohnflaeche} onChange={(e) => handleChange('wohnflaeche', e.target.value)} />
          <input type="text" placeholder="Grundstücksfläche (m²)" value={formData.grundstueck} onChange={(e) => handleChange('grundstueck', e.target.value)} />
          <input type="text" placeholder="Anzahl Zimmer" value={formData.zimmer} onChange={(e) => handleChange('zimmer', e.target.value)} />
        </>
      ),
    },
    {
      label: 'Baujahr & Zustand',
      content: (
        <>
          <input type="text" placeholder="Baujahr" value={formData.baujahr} onChange={(e) => handleChange('baujahr', e.target.value)} />
          <input type="text" placeholder="Zustand (z. B. renoviert)" value={formData.zustand} onChange={(e) => handleChange('zustand', e.target.value)} />
        </>
      ),
    },
    {
      label: 'Preis & Energie',
      content: (
        <>
          <input type="text" placeholder="Kaufpreis / Miete" value={formData.preis} onChange={(e) => handleChange('preis', e.target.value)} />
          <input type="text" placeholder="Energieklasse / Verbrauch" value={formData.energie} onChange={(e) => handleChange('energie', e.target.value)} />
        </>
      ),
    },
    {
      label: 'Besonderheiten',
      content: (
        <>
          <textarea
            placeholder="Ausstattung, Highlights, Lagebeschreibung..."
            rows={4}
            value={formData.besonderheiten}
            onChange={(e) => handleChange('besonderheiten', e.target.value)}
          />
          <button
            className="button-inspire"
            type="button"
            onClick={() =>
              handleChange(
                'besonderheiten',
                'ruhige Lage, Süd-Balkon, modernes Bad, Fußbodenheizung'
              )
            }
          >
            ✨ Beispieltext einfügen
          </button>
        </>
      ),
    },
  ];

  return <TabbedForm tabs={tabs} />;
}
