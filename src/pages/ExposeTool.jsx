// src/pages/ExposeTool.jsx

// 🌈 Style: Hauptlayout mit Glassmorphismus
import '../styles/ExposeTool.css';

import React, { useState } from 'react';

// 🔁 Komponenten
import ExportButtons from '../components/ExportButtons';
import ExposeForm from '../components/ExposeForm';
import GPTOutputBox from '../components/GPTOutputBox';
import ImageUpload
  from '../components/ImageUpload'; // 📸 ImageUpload integriert
import SavedExposes from '../components/SavedExposes';
import useSavedExposes from '../hooks/useSavedExposes';
// 🤖 GPT-Funktionen
import {
  fetchGPTResponse,
  generatePrompt,
} from '../lib/openai';

export default function ExposeTool() {
  // 📦 Formular-Daten
  const [formData, setFormData] = useState({
    objektart: '', strasse: '', ort: '', bezirk: '', sicht: '', lagebesonderheiten: '',
    wohnflaeche: '', grundstueck: '', zimmer: '', baujahr: '', zustand: '',
    preis: '', energie: '', besonderheiten: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('emotional');
  // ExposeTool.jsx (Ausschnitt)
const [images, setImages] = useState(() => {
  const saved = localStorage.getItem('maklermate_images');
  try {
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
});


  // 💾 Lokaler Speicher
  const {
    exposes,
    addExpose,
    deleteExpose,
    loadExpose
  } = useSavedExposes();

  // ✏️ Inputfelder ändern
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✨ GPT-Text erzeugen
  const handleGenerate = async () => {
    if (!formData || Object.values(formData).every((val) => val === '')) {
      alert("Bitte zuerst das Formular ausfüllen.");
      return;
    }

    const prompt = generatePrompt(formData, selectedStyle);
    setIsLoading(true);

    try {
      const gptText = await fetchGPTResponse(prompt);
      const extracted =
        typeof gptText === 'object' && gptText.result
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

  // 💾 Speichern inkl. Bilder
  const handleSaveExpose = () => {
    addExpose({ formData, output, selectedStyle, images });
  };

  return (
    <div className="expose-tool-container">

      {/* 🧾 Hauptformular */}
      <ExposeForm
        formData={formData}
        setFormData={setFormData}
        onChange={handleChange}
      />

      {/* 📸 Bilder hochladen & verwalten */}
      <ImageUpload images={images} setImages={setImages} />

      {/* 🔮 Generieren-Button */}
      <button
        onClick={handleGenerate}
        className={`generate-button ${isLoading ? 'loading' : ''}`}
        disabled={isLoading}
      >
        {isLoading && <span className="spinner"></span>}
        {isLoading ? "Generiere..." : "🔮 Exposé generieren"}
      </button>

      {/* 💾 Speichern */}
      <button className="save-button" onClick={handleSaveExpose}>
        💾 Exposé speichern
      </button>

      {/* 📄 Ergebnis-Preview & PDF-Sektion */}
      <div id="pdf-export-section">
        <div id="pdf-logo" className="pdf-logo">
          <img src="/logo192.png" alt="MaklerMate Logo" height={40} />
        </div>

        {/* ✨ GPT-Ausgabe */}
        <GPTOutputBox output={output} />

        {/* 🔻 Bildanzeige im PDF-Bereich */}
        {images.length > 0 && (
          <div className="image-preview-section">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Bild ${index + 1}`}
                className="pdf-preview-image"
              />
            ))}
          </div>
        )}
      </div>

      {/* 🔁 Export-Formate */}
      <ExportButtons
        formData={formData}
        output={output}
        selectedStyle={selectedStyle}
        images={images} // ✅ Übergabe an PDF-Export
      />

      {/* 📦 Gespeicherte Exposés */}
      <SavedExposes
        exposes={exposes}
        onLoad={(expose) => loadExpose(expose, setFormData, setOutput, setSelectedStyle)}
        onDelete={deleteExpose}
      />
    </div>
  );
}
