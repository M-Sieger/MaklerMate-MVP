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

  const [isLoading, setIsLoading] = useState(false);         // 🔄 Ladezustand für GPT
  const [output, setOutput] = useState('');                  // 📄 GPT-Ergebnis
  const [selectedStyle, setSelectedStyle] = useState('emotional'); // 🎨 Stilwahl für GPT

  // 🖼️ Lokaler Bildspeicher mit persistenter Initialisierung aus LocalStorage
  const [images, setImages] = useState(() => {
    const saved = localStorage.getItem('maklermate_images');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 🔁 Bilddaten mit formData synchronisieren, damit Export & Speicherfunktion sie erhalten
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      images,
    }));
  }, [images]);

  // 💾 Zugriff auf gespeicherte Exposés
  const { exposes, addExpose, deleteExpose, loadExpose } = useSavedExposes();

  // ✏️ Änderungen im Formular live übernehmen
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔮 GPT-Antwort generieren und anzeigen
  const handleGenerate = async () => {
    // 🚫 Validierung: keine leere Anfrage generieren
    if (!formData || Object.values(formData).every((val) => val === '')) {
      alert("Bitte zuerst das Formular ausfüllen.");
      return;
    }

    // 🧠 Prompt zusammenstellen
    const prompt = generatePrompt(formData, selectedStyle);
    setIsLoading(true);

    try {
      // 📤 GPT-Request ausführen
      const gptResponse = await fetchGPTResponse(prompt);

      // 🧠 Response-Handling: akzeptiert entweder direkt String oder Objekt mit .result / .content
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

  // 💾 Exposé in lokaler Liste speichern
  const handleSaveExpose = () => {
    addExpose({ formData, output, selectedStyle, images });
  };

  // ✅ UI-Returnblock – bestehend aus: Formular, Upload, Ausgabe, Export, Speicher
  return (
    <div className="expose-tool-container">
      {/* 📋 Exposé-Eingabemaske */}
      <ExposeForm
        formData={formData}
        setFormData={setFormData}
        onChange={handleChange}
      />

      {/* 📸 Bilder-Upload */}
      <ImageUpload images={images} setImages={setImages} />

      {/* 🧠 GPT-Auslösung */}
      <button
        onClick={handleGenerate}
        className={`generate-button ${isLoading ? 'loading' : ''}`}
        disabled={isLoading}
      >
        {isLoading && <span className="spinner"></span>}
        {isLoading ? "Generiere..." : "🔮 Exposé generieren"}
      </button>

      {/* 💾 Exposé speichern */}
      <button className="save-button" onClick={handleSaveExpose}>
        💾 Exposé speichern
      </button>

      {/* 📄 PDF-Vorschau-Sektion */}
      <div id="pdf-export-section">
        <div id="pdf-logo" className="pdf-logo">
          <img src="/logo192.png" alt="MaklerMate Logo" height={40} />
        </div>

        {/* 💬 GPT-Textanzeige */}
        <GPTOutputBox output={output} />

        {/* 🖼️ Bildvorschau */}
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

      {/* 📤 Export-Funktionen: PDF, JSON, Copy */}
      <ExportButtons
        formData={formData}
        output={output}
        selectedStyle={selectedStyle}
        images={images}
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
