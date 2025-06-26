// src/pages/ExposeTool.jsx

// 🌈 Style: Hauptlayout mit Glassmorphismus
import '../styles/ExposeTool.css';

import React, { useState } from 'react';

// 🔁 Externe Komponenten & Hooks
import ExportButtons from '../components/ExportButtons';
import ExposeForm from '../components/ExposeForm';
import GPTOutputBox from '../components/GPTOutputBox';
import ImageUpload from '../components/ImageUpload';
import SavedExposes from '../components/SavedExposes';
import useSavedExposes from '../hooks/useSavedExposes';
// 🤖 GPT-Kommunikation
import {
  fetchGPTResponse,
  generatePrompt,
} from '../lib/openai';

export default function ExposeTool() {
  // 📦 Formular-State
  const [formData, setFormData] = useState({
    objektart: '', strasse: '', ort: '', bezirk: '', sicht: '', lagebesonderheiten: '',
    wohnflaeche: '', grundstueck: '', zimmer: '', baujahr: '', zustand: '',
    preis: '', energie: '', besonderheiten: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('emotional');
  const [images, setImages] = useState([]); // 🖼️ Bilder für Exposé

  // 💾 Exposé-Speicher
  const {
    exposes,
    addExpose,
    deleteExpose,
    loadExpose
  } = useSavedExposes();

  // 🖊️ Formulareingaben
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✨ Exposé generieren via GPT
  const handleGenerate = async () => {
    if (!formData || Object.values(formData).every((val) => val === '')) {
      alert("Bitte zuerst das Formular ausfüllen.");
      return;
    }

    const prompt = generatePrompt(formData, selectedStyle);
    console.log("[DEBUG] Generierter Prompt:", prompt);

    setIsLoading(true);
    try {
      const gptText = await fetchGPTResponse(prompt);
      const extracted = typeof gptText === 'object' && gptText.result
        ? gptText.result.trim?.()
        : typeof gptText === 'string'
          ? gptText.trim?.()
          : '';

      setOutput(extracted || '⚠️ Kein GPT-Ergebnis erhalten.');
    } catch (err) {
      console.error('Fehler bei GPT:', err);
      setOutput('⚠️ Fehler beim Abruf.');
    } finally {
      setIsLoading(false);
    }
  };

  // 💾 Exposé speichern
  const handleSaveExpose = () => {
    addExpose({ formData, output, selectedStyle, images });
  };

  return (
    <div className="expose-tool-container">

      {/* 📝 Hauptformular */}
      <ExposeForm formData={formData} setFormData={setFormData} onChange={handleChange} />

      {/* 📸 Foto-Upload */}
      <ImageUpload images={images} setImages={setImages} />

      {/* 🔮 Exposé generieren */}
      <button
        onClick={handleGenerate}
        className={`generate-button ${isLoading ? 'loading' : ''}`}
        disabled={isLoading}
      >
        {isLoading && <span className="spinner"></span>}
        {isLoading ? "Generiere..." : "🔮 Exposé generieren"}
      </button>

      {/* 💾 Speichern */}
      <button className="save-button" onClick={handleSaveExpose}>💾 Exposé speichern</button>

      {/* 📄 Ergebnis & Export */}
      <div id="pdf-export-section">
        <div id="pdf-logo" className="pdf-logo">
          <img src="/logo192.png" alt="MaklerMate Logo" height={40} />
        </div>

        <GPTOutputBox output={output} />
      </div>

      <ExportButtons formData={formData} output={output} selectedStyle={selectedStyle} />

      <SavedExposes
        exposes={exposes}
        onLoad={(expose) => loadExpose(expose, setFormData, setOutput, setSelectedStyle)}
        onDelete={deleteExpose}
      />
    </div>
  );
}
