// 📦 Styles & Core
import '../styles/ExposeTool.css'; // ✅ Style-Abgleich mit Glassmorphismus & modernem UI

import React, { useState } from 'react';

import ExportButtons from '../components/ExportButtons';
import ExposeForm from '../components/ExposeForm';
import GPTOutputBox from '../components/GPTOutputBox';
import Loader from '../components/Loader';
import SavedExposes from '../components/SavedExposes';
import useSavedExposes from '../hooks/useSavedExposes';
import { fetchGPTResponse } from '../lib/openai';

export default function ExposeTool() {
  const [formData, setFormData] = useState({
    objektart: '', strasse: '', ort: '', bezirk: '', sicht: '', lagebesonderheiten: '',
    wohnflaeche: '', grundstueck: '', zimmer: '', baujahr: '', zustand: '',
    preis: '', energie: '', besonderheiten: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('emotional');

  const {
    exposes,
    addExpose,
    deleteExpose,
    loadExpose
  } = useSavedExposes();

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    let stilHinweis = '';
    if (selectedStyle === 'emotional') stilHinweis = '- Zielgruppe: Familien, emotional, lebendig.';
    if (selectedStyle === 'sachlich') stilHinweis = '- Zielgruppe: Investoren, sachlich, faktenorientiert.';
    if (selectedStyle === 'luxus') stilHinweis = '- Zielgruppe: Luxussegment, stilvoll, edel.';

    const prompt = `Du bist ein professioneller Immobilienmakler...\n${stilHinweis}\n🔚 Gib nur den reinen Text zurück – ohne Einleitung, Formatierung oder Kommentare.`;

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

  const handleSaveExpose = () => {
    addExpose({ formData, output });
  };

  return (
    <div className="expose-tool-container">
      <ExposeForm formData={formData} onChange={handleChange} />
      <button className="generate-button" onClick={handleGenerate} disabled={isLoading}>
        {isLoading ? <Loader /> : '🔮 Exposé generieren'}
      </button>

      <button className="save-button" onClick={handleSaveExpose}>💾 Exposé speichern</button>

      {/* 🖨️ Export-Zielbereich mit GPT-Vorschau + Logo */}
      <div id="pdf-export-section">
        <div id="pdf-logo" className="pdf-logo">
          <img src="/logo192.png" alt="MaklerMate Logo" height={40} />
        </div>
        <GPTOutputBox output={output} selectedStyle={selectedStyle} />
      </div>

      {/* 📦 Export-Buttons */}
      <ExportButtons formData={formData} output={output} selectedStyle={selectedStyle} />

      {/* 🗂️ Gespeicherte Exposés */}
      <SavedExposes
        exposes={exposes}
        onLoad={(expose) => loadExpose(expose, setFormData, setOutput)}
        onDelete={deleteExpose}
      />
    </div>
  );
}
