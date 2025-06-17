export function generateCRMTemplate(data) {
    return `
  [EXPOSÉ: ${data.objektart || '{{OBJEKTART}}'} in ${data.ort || '{{ORT}}'}]
  
  📍 Adresse: ${data.adresse || '{{ADRESSE}}'}
  💰 Preis: ${data.preis || '{{PREIS}}'} €
  📐 Wohnfläche: ${data.wohnflaeche || '{{WOHNFLÄCHE}}'} m²
  🛏️ Zimmer: ${data.zimmer || '{{ZIMMER}}'}
  🔋 Energieklasse: ${data.energieklasse || '{{ENERGIEKLASSE}}'}
  🏗️ Baujahr: ${data.baujahr || '{{BAUJAHR}}'}
  🛠 Zustand: ${data.zustand || '{{ZUSTAND}}'}
  
  ✨ Besonderheiten:
  ${data.besonderheiten || '{{BESONDERHEITEN}}'}
  
  🧠 GPT-Text:
  ${data.gptText || '{{GPT_TEXT}}'}
    `.trim();
  }
  
  export function generateCRMJson(data) {
    return JSON.stringify({
      objektart: data.objektart || '',
      ort: data.ort || '',
      adresse: data.adresse || '',
      preis: data.preis || '',
      wohnflaeche: data.wohnflaeche || '',
      zimmer: data.zimmer || '',
      energieklasse: data.energieklasse || '',
      baujahr: data.baujahr || '',
      zustand: data.zustand || '',
      besonderheiten: data.besonderheiten || '',
      gptText: data.gptText || ''
    }, null, 2);
  }
  