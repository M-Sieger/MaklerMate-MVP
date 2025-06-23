// Datei: ExposeTool.jsx

// 📦 Styles & Core
import '../styles/ExposeTool.css'; // ✅ Style-Abgleich mit Glassmorphismus & modernem UI

import React, { useState } from 'react';

import ExportButtons from '../components/ExportButtons';
import ExposeForm from '../components/ExposeForm';
import GPTOutputBox from '../components/GPTOutputBox';
import Loader from '../components/Loader';
import SavedExposes from '../components/SavedExposes';
import useSavedExposes from '../hooks/useSavedExposes';
import {
  fetchGPTResponse,
  generatePrompt,
} from '../lib/openai';

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

  // 💡 WICHTIG: handleChange ist für einzelne Felder, setFormData für vollständigen Restore
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🧠 GPT-Exposé generieren mit validiertem Prompt
  const handleGenerate = async () => {
    // Check ob Formular ausgefüllt ist (mind. 1 relevantes Feld)
    if (!formData || Object.values(formData).every((val) => val === '')) {
      alert("Bitte zuerst das Formular ausfüllen.");
      return;
    }

    const prompt = generatePrompt(formData, selectedStyle);
    console.log("[DEBUG] Generierter Prompt:", prompt);

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
    addExpose({ formData, output, selectedStyle });
  };

  return (
    <div className="expose-tool-container">
      <ExposeForm formData={formData} setFormData={setFormData} onChange={handleChange} />
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
        onLoad={(expose) => loadExpose(expose, setFormData, setOutput, setSelectedStyle)}
        onDelete={deleteExpose}
      />
    </div>
  );
}
