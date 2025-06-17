// 📦 Styles & Core
import '../styles/ExposeTool.css';

import React, { useState } from 'react';

// 🧠 GPT-Backend / Komponenten
import { fetchGPTResponse } from '../api/openai';
import ExportButtons from '../components/ExportButtons';
import ExposeForm from '../components/ExposeForm';
import Loader from '../components/Loader';

export default function ExposeTool() {
  // 📝 Zustand für alle Formularfelder
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

  // 🔄 Ladeanzeige, GPT-Antwort & Stil
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('emotional');

  // 🔧 Formularänderungen live speichern
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // 🧠 GPT-Request basierend auf Formulardaten + Stil
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

    // 📝 GPT-Prompt vorbereiten
    const prompt = `Du bist ein professioneller Immobilienmakler...
    ${stilHinweis}
    🔚 Gib nur den reinen Text zurück – ohne Einleitung, Formatierung oder Kommentare.`;

    setIsLoading(true);

    try {
      const gptText = await fetchGPTResponse(prompt);
      setOutput(gptText);
    } catch (err) {
      console.error('Fehler bei der GPT-Antwort:', err);
      setOutput('⚠️ Fehler beim Abrufen der GPT-Antwort.');
    } finally {
      setIsLoading(false);
    }
  };

  // 📊 Fortschrittsanzeige (ausgefüllte Felder)
  const countFilledFields = Object.values(formData).filter((v) => v.trim() !== '').length;
  const totalFields = Object.keys(formData).length;

  return (
    <div className="expose-wrapper">

      {/* 📌 Logo für PDF-Export */}
      <div id="pdf-logo" style={{ width: 300, height: 100 }}>
        {/* SVG-Logo hier */}
      </div>

      {/* 🏠 Header / Tool-Beschreibung */}
      <div className="hero-intro">
        <h1>🏡 Exposé Generator für Makler</h1>
        <p>Erstelle in wenigen Sekunden ein überzeugendes Immobilien-Exposé – dank GPT.</p>
      </div>

      <div className="tool-inner-wrapper">

        {/* 📊 Fortschrittsbalken */}
        <div className="progress-info">
          🧩 Fortschritt: {countFilledFields} / {totalFields} Felder ausgefüllt
        </div>

        {/* 🧾 Formular-Sektion (TabbedForm via ExposeForm.jsx) */}
        <ExposeForm formData={formData} handleChange={handleChange} />

        {/* 🎯 Stilwahl Dropdown */}
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

        {/* 🚀 GPT-Generieren-Button */}
        <button className="button-generate" onClick={handleGenerate}>
          Expose generieren
        </button>

        {/* 🔄 Ladeanzeige oder Vorschautext */}
        {isLoading ? (
          <Loader />
        ) : (
          <div className="preview-box">
            <h3>GPT-Textvorschau:</h3>
            <p>{output || 'Noch kein Text generiert.'}</p>
          </div>
        )}

        {/* 📋 Copy & 📧 Mail Buttons bei Output */}
        {output && (
          <>
            <button
              className="button-copy"
              onClick={() => navigator.clipboard.writeText(output)}
            >
              📋 Text kopieren
            </button>

            <button
              className="button-mailto"
              onClick={() => {
                const subject = encodeURIComponent('Ihr Immobilien-Exposé');
                const body = encodeURIComponent(output);
                window.location.href = `mailto:?subject=${subject}&body=${body}`;
              }}
            >
              📧 Per E-Mail versenden
            </button>
          </>
        )}

        {/* 📤 Export-Buttons (PDF, TXT, JSON etc.) */}
        <ExportButtons
          formData={formData}
          output={output}
          selectedStyle={selectedStyle}
        />
      </div>
    </div>
  );
}
