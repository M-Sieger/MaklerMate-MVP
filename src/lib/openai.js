// Datei: lib/openai.js

export const fetchGPTResponse = async (prompt) => {
  try {
    const response = await fetch("http://localhost:5001/api/gpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    console.log("[DEBUG] GPT API-Antwort:", data); // 🧪 DEBUG OUT


    if (!data.result) {
      console.error("❌ Ungültige GPT-Antwort:", data);
      throw new Error("GPT-Antwort leer oder fehlerhaft");
    }

    return data.result.trim();
  } catch (err) {
    console.error("❌ Fehler beim GPT-Fetch:", err);
    throw err;
  }
};

export function generatePrompt(formData, selectedStyle) {
  let stilHinweis = '';
  if (selectedStyle === 'emotional') stilHinweis = 'Sprich emotional, menschlich, lebendig.';
  if (selectedStyle === 'sachlich') stilHinweis = 'Sprich sachlich, strukturiert, objektiv.';
  if (selectedStyle === 'luxus') stilHinweis = 'Sprich exklusiv, hochwertig, elegant.';
return `
Du bist ein erfahrener Immobilienmakler und Textprofi.

${stilHinweis}

Formuliere einen hochwertigen, zusammenhängenden Exposétext (1–2 Absätze), der folgende Daten elegant und realitätsnah beschreibt:

- Objektart: ${formData.objektart}
- Adresse: ${formData.strasse}, ${formData.ort}, ${formData.bezirk}
- Aussicht/Sicht: ${formData.sicht}
- Lagebesonderheiten: ${formData.lagebesonderheiten}
- Wohnfläche: ${formData.wohnflaeche} m²
- Grundstücksgröße: ${formData.grundstueck} m²
- Zimmeranzahl: ${formData.zimmer}
- Baujahr: ${formData.baujahr}
- Zustand: ${formData.zustand}
- Kaufpreis: ${formData.preis}
- Energieeffizienzklasse: ${formData.energie}
- Besondere Merkmale: ${formData.besonderheiten}

Vermeide Bulletpoints. Schreibe stattdessen einen professionellen, ansprechenden Beschreibungstext – wie für ein echtes Immobilienexposé.
`;
}
