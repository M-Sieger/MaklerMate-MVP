// 🌈 Hauptlayout mit Glassmorphismus-Styling
import '../styles/ExposeTool.css';

import React, {
  useEffect,
  useState,
} from 'react';

// 🔁 Komponentenstruktur
import ExportButtons from '../components/ExportButtons';
import ExposeForm from '../components/ExposeForm';
import GPTOutputBox from '../components/GPTOutputBox';
import ImageUpload from '../components/ImageUpload';
import SavedExposes from '../components/SavedExposes';
import useSavedExposes from '../hooks/useSavedExposes';
// 🤖 GPT-Integration
import {
  fetchGPTResponse,
  generatePrompt,
} from '../lib/openai';

export default function ExposeTool() {
  // 📦 Zustand für das Hauptformular
  const [formData, setFormData] = useState({
    objektart: '', strasse: '', ort: '', bezirk: '', sicht: '', lagebesonderheiten: '',
    wohnflaeche: '', grundstueck: '', zimmer: '', baujahr: '', zustand: '',
    preis: '', energie: '', besonderheiten: ''
  });

  const [isLoading, setIsLoading] = useState(false); // 🔄 Ladezustand
  const [output, setOutput] = useState('');           // 📄 GPT-Ausgabe
  const [selectedStyle, setSelectedStyle] = useState('emotional'); // ✨ Stilwahl

  // 🖼️ Lokale Bilder aus LocalStorage laden
  const [images, setImages] = useState(() => {
    const saved = localStorage.getItem('maklermate_images');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // (optional) Captions anlegbar, aktuell leer
  const [captions, setCaptions] = useState([]);

  // 🧩 Bilder in FormData halten
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      images,
    }));
  }, [images]);

  // 📁 Exposés laden
  const { exposes, addExpose, deleteExpose, loadExpose } = useSavedExposes();

  // 📥 Form-Eingaben behandeln
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✨ GPT-Text generieren
  const handleGenerate = async () => {
    if (!formData || Object.values(formData).every((val) => val === '')) {
      alert("Bitte zuerst das Formular ausfüllen.");
      return;
    }

    const prompt = generatePrompt(formData, selectedStyle);
    setIsLoading(true);

    try {
      const gptResponse = await fetchGPTResponse(prompt);
      const extracted =
        typeof gptResponse === 'object' && gptResponse.content
          ? gptResponse.content.trim?.()
          : typeof gptResponse === 'object' && gptResponse.result
          ? gptResponse.result.trim?.()
          : typeof gptResponse === 'string'
          ? gptResponse.trim?.()
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
      {/* 📋 Formular */}
      <ExposeForm formData={formData} setFormData={setFormData} onChange={handleChange} />

      {/* 🖼️ Upload */}
      <ImageUpload images={images} setImages={setImages} captions={captions} setCaptions={setCaptions} />

      {/* ⚡ Button-Gruppe */}
      <div className="button-group center-buttons">
        <button
          onClick={handleGenerate}
          className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading && <span className="spinner"></span>}
          {isLoading ? "Generiere..." : "🔮 Exposé generieren"}
        </button>

        <button className="btn btn-secondary" onClick={handleSaveExpose}>
          💾 Exposé speichern
        </button>
      </div>

      {/* 📄 Vorschau inkl. Bilder */}
      <div id="pdf-export-section">
        <GPTOutputBox output={output} images={images} captions={captions} />
      </div>

      {/* 📤 Export */}
      <ExportButtons
        formData={formData}
        output={output}
        selectedStyle={selectedStyle}
        images={images}
      />

      {/* 💾 Lokale Exposés */}
      <SavedExposes
        exposes={exposes}
        onLoad={(expose) =>
          loadExpose(expose, setFormData, setOutput, setSelectedStyle)
        }
        onDelete={deleteExpose}
      />
    </div>
  );
}
