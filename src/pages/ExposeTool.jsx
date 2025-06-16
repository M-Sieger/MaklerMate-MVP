import React, { useState } from 'react';
import TabbedForm from '../components/TabbedForm';
import '../styles/ExposeTool.css';
import { fetchGPTResponse } from '../api/openai';
import Loader from '../components/Loader';



export default function ExposeTool() {
  const [formData, setFormData] = useState({
    objektart: '',
    strasse: '',
    ort: '',
    wohnflaeche: '',
    grundstueck: '',
    zimmer: '',
    baujahr: '',
    zustand: '',
    preis: '',
    energie: '',
    besonderheiten: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const [output, setOutput] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('emotional');



  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  

  const handleGenerate = async () => {
    const {
      objektart, ort, wohnflaeche, zimmer, besonderheiten
    } = formData;
  
   
   
    let stilHinweis = '';
    if (selectedStyle === 'emotional') {
      stilHinweis = '- Zielgruppe: Familien, emotionale Sprache, lebendig.';
    } else if (selectedStyle === 'sachlich') {
      stilHinweis = '- Zielgruppe: Investoren, sachlich, faktenorientiert.';
    } else if (selectedStyle === 'luxus') {
      stilHinweis = '- Zielgruppe: Luxussegment, stilvoll, edel, exklusiv.';
    }
    
   
   
    const prompt = `Du bist ein professioneller Immobilienmakler. Deine Aufgabe ist es, ein hochwertiges, verkaufsstarkes Immobilien-Exposé zu erstellen – auf Basis der folgenden Eingaben des Maklers:
  
  🏠 Objektart: ${objektart}
  📍 Lage: ${ort}
  📏 Wohnfläche: ${wohnflaeche} m²
  🛏 Zimmer: ${zimmer}
  ✨ Besonderheiten: ${besonderheiten}
  
 🧠 Ziel:
- Erzeuge ein flüssiges, lesbares Exposé (1–2 Absätze).
- Kein technischer Ton, keine Listen, kein „Das Objekt bietet...“.
- Stattdessen: visuelle Sprache, emotionale Aktivierung, Fokus auf das Lebensgefühl.
- Baue die Besonderheiten und emotionalen Vorteile der Lage sinnvoll in den Textfluss ein.
- Zielgruppe sind Kaufinteressenten (Familien oder Selbstnutzer), die ein Zuhause und kein reines Objekt suchen.

📋 Stil:
- Deutsch
- Leicht verkäuflich, vertrauensvoll, nicht aufdringlich, einladend.
- Keywords: „Licht“, „Wohlfühlatmosphäre“, „Raumgefühl“, „Besonderheit“, „Lebensgefühl“, „Ankommen“, „Entfaltung“.
${stilHinweis}
📝 Einstieg:
- Beginne mit einem Satz, der sofort eine einladende oder neugierige Atmosphäre schafft (z.B. "Stellen Sie sich vor..." oder "Entdecken Sie ein Zuhause...").

🔚 Gib nur den reinen Text zurück – ohne Einleitung, Formatierung oder Kommentare.`;
  
    setIsLoading(true); // 🔄 Ladeanimation starten
  
    try {
      const gptText = await fetchGPTResponse(prompt);
      setOutput(gptText);
    } catch (err) {
      console.error('Fehler bei der GPT-Antwort:', err);
      setOutput('⚠️ Fehler beim Abrufen der GPT-Antwort.');
    } finally {
      setIsLoading(false); // ✅ Ladeanimation beenden
    }
  };
  
  const countFilledFields = Object.values(formData).filter((v) => v.trim() !== '').length;
  const totalFields = Object.keys(formData).length;

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

  return (
    <div className="expose-wrapper">
      <div className="hero-intro">
        <h1>🏡 Exposé Generator für Makler</h1>
        <p>Erstelle in wenigen Sekunden ein überzeugendes Immobilien-Exposé – dank GPT.</p>
      </div>
      <div className="tool-inner-wrapper">

<div className="progress-info">
  🧩 Fortschritt: {countFilledFields} / {totalFields} Felder ausgefüllt
</div>

<TabbedForm tabs={tabs} />


<div className="style-selector">
  <label htmlFor="stilwahl">🎯 Zielgruppe / Stil wählen:</label>
  <select
    id="stilwahl"
    value={selectedStyle}
    onChange={(e) => setSelectedStyle(e.target.value)}
  >
    <option value="emotional">📢 Emotional (Familien)</option>
    <option value="sachlich">📈 Sachlich (Investoren)</option>
    <option value="luxus">✨ Hochwertig (Luxusimmobilien)</option>
  </select>
</div>





<button className="button-generate" onClick={handleGenerate}>
  GPT-Text generieren
</button>

{isLoading ? (
  <Loader />
) : (
  <div className="preview-box">
    <h3>GPT-Textvorschau:</h3>
    <p>{output || 'Noch kein Text generiert.'}</p>
  </div>
)}

{output && (
  <button
    className="button-copy"
    onClick={() => navigator.clipboard.writeText(output)}
  >
    📋 Text kopieren
  </button>
)}

</div>

    </div>
  );
}
