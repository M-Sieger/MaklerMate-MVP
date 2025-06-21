// 📦 Styles & Core
import '../styles/ExposeTool.css'; // ✅ Style-Abgleich mit Glassmorphismus & modernem UI

import React, { useState } from 'react';

import ExportButtons from '../components/ExportButtons';
import ExposeForm from '../components/ExposeForm';
import GPTOutputBox
  from '../components/GPTOutputBox'; // 🧠 Ausgelagerte Vorschau-Komponente mit Designbindung
import Loader from '../components/Loader';
// 🧠 GPT-Backend
import { fetchGPTResponse } from '../lib/openai';

export default function ExposeTool() {
  // 🧾 Formular-Zustände
  const [formData, setFormData] = useState({
    objektart: '', strasse: '', ort: '', bezirk: '', sicht: '', lagebesonderheiten: '',
    wohnflaeche: '', grundstueck: '', zimmer: '', baujahr: '', zustand: '',
    preis: '', energie: '', besonderheiten: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('emotional');

  // 🔧 Feldänderungen speichern
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 🚀 GPT-Text generieren
  const handleGenerate = async () => {
    const { objektart, ort, wohnflaeche, zimmer, besonderheiten } = formData;

    let stilHinweis = '';
    if (selectedStyle === 'emotional') stilHinweis = '- Zielgruppe: Familien, emotional, lebendig.';
    if (selectedStyle === 'sachlich') stilHinweis = '- Zielgruppe: Investoren, sachlich, faktenorientiert.';
    if (selectedStyle === 'luxus') stilHinweis = '- Zielgruppe: Luxussegment, stilvoll, edel.';

    const prompt = `Du bist ein professioneller Immobilienmakler...
    ${stilHinweis}
    🔚 Gib nur den reinen Text zurück – ohne Einleitung, Formatierung oder Kommentare.`;

    setIsLoading(true);
    try {
      const gptText = await fetchGPTResponse(prompt);
      setOutput(gptText);
    } catch (err) {
      console.error('Fehler bei GPT:', err);
      setOutput('⚠️ Fehler beim Abruf.');
    } finally {
      setIsLoading(false);
    }
  };

  const countFilled = Object.values(formData).filter((v) => v.trim() !== '').length;
  const totalFields = Object.keys(formData).length;

  return (
    <div className="expose-wrapper">
      {/* 📌 Logo für PDF */}
      <div id="pdf-logo" style={{ width: 300, height: 100 }}></div>

      {/* 🏠 Intro */}
      <div className="hero-intro">
        <h1>🏡 Exposé Generator für Makler</h1>
        <p>Erstelle in Sekunden ein hochwertiges Immobilien-Exposé – GPT hilft dir dabei.</p>
      </div>

      <div className="tool-inner-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* 🔢 Fortschritt */}
        <div className="progress-info">
          🧩 Fortschritt: {countFilled} / {totalFields} Felder ausgefüllt
        </div>

        {/* 📋 Formular */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
          <ExposeForm formData={formData} handleChange={(e) => handleChange(e.target.name, e.target.value)} />
        </div>

        {/* 🎯 Stilwahl */}
        <div className="style-selector" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
          <label htmlFor="stilwahl" style={{ marginBottom: '0.5rem', display: 'block' }}>🎯 Zielgruppe / Stil wählen:</label>
          <select id="stilwahl" value={selectedStyle} onChange={(e) => setSelectedStyle(e.target.value)} style={{ marginBottom: '1rem' }}>
            <option value="emotional">📢 Emotional (Familien)</option>
            <option value="sachlich">📈 Sachlich (Investoren)</option>
            <option value="luxus">✨ Hochwertig (Luxus)</option>
          </select>
        </div>

        {/* 🚀 Generieren */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={handleGenerate} disabled={isLoading}>
            {isLoading ? '⏳ Generiere...' : 'Exposé generieren'}
          </button>
        </div>

        {/* 📄 Vorschau oder Ladeanzeige */}
        {isLoading ? <Loader /> : <GPTOutputBox text={output} />}

        {/* 📋 Copy & 📧 E-Mail */}
        {output && (
          <div className="button-group">
            <button className="btn btn-outline" onClick={() => navigator.clipboard.writeText(output)}>📋 Text kopieren</button>
            <button
              className="btn btn-mail"
              onClick={() => {
                const subject = encodeURIComponent('Ihr Immobilien-Exposé');
                const body = encodeURIComponent(output);
                window.location.href = `mailto:?subject=${subject}&body=${body}`;
              }}
            >📧 Per E-Mail versenden</button>
          </div>
        )}

        {/* 📤 Export */}
        <ExportButtons formData={formData} output={output} selectedStyle={selectedStyle} />
      </div>
    </div>
  );
}
