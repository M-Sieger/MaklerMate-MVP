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

  return (
    <div className="expose-tool-container">
      <ExposeForm formData={formData} onChange={handleChange} />
      <button onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? <Loader /> : '🔮 Exposé generieren'}
      </button>

      {/* 🖨️ Export-Zielbereich mit GPT-Vorschau + Logo */}
      <div id="pdf-export-section">
        <div id="pdf-logo" style={{ marginBottom: '1rem' }}>
          <img src="/logo192.png" alt="MaklerMate Logo" height={40} />
        </div>
        <GPTOutputBox output={output} selectedStyle={selectedStyle} />
      </div>

      {/* 📦 Export-Buttons */}
      <ExportButtons formData={formData} output={output} selectedStyle={selectedStyle} />
    </div>
  );
}
