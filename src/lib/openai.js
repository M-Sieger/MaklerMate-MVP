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
  if (selectedStyle === 'emotional') stilHinweis = '- Zielgruppe: Familien, emotional, lebendig.';
  if (selectedStyle === 'sachlich') stilHinweis = '- Zielgruppe: Investoren, sachlich, faktenorientiert.';
  if (selectedStyle === 'luxus') stilHinweis = '- Zielgruppe: Luxussegment, stilvoll, edel.';

  return `Du bist ein professioneller Immobilienmakler.
${stilHinweis}

🔎 Objektart: ${formData.objektart}
📍 Adresse: ${formData.strasse}, ${formData.ort}, ${formData.bezirk}
👁️ Sicht: ${formData.sicht}
🌳 Lage: ${formData.lagebesonderheiten}
📐 Fläche: ${formData.wohnflaeche}m² Wohnfläche, ${formData.grundstueck}m² Grundstück
🛏️ Zimmer: ${formData.zimmer} | 🏗️ Baujahr: ${formData.baujahr} | Zustand: ${formData.zustand}
💰 Preis: ${formData.preis} | Energieklasse: ${formData.energie}
✨ Besonderheiten: ${formData.besonderheiten}

🔚 Gib nur den reinen Text zurück – ohne Einleitung, Formatierung oder Kommentare.`;
}
