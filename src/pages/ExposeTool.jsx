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
// 🤖 Prompt-Erzeugung (Client-seitig ok, enthält keine Secrets)
import { generatePrompt } from '../lib/openai';
// 🔐 Sichere API-Calls mit Supabase-Token (wird in fetchWithAuth gesetzt)
import { fetchWithAuth } from '../utils/fetchWithAuth';

export default function ExposeTool() {
  // 📦 Zustand für das Hauptformular
  const [formData, setFormData] = useState({
    objektart: '', strasse: '', ort: '', bezirk: '', sicht: '', lagebesonderheiten: '',
    wohnflaeche: '', grundstueck: '', zimmer: '', baujahr: '', zustand: '',
    preis: '', energie: '', besonderheiten: ''
  });

  const [isLoading, setIsLoading] = useState(false);            // 🔄 Ladezustand
  const [output, setOutput] = useState('');                     // 📄 GPT-Ausgabe
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

  const [captions, setCaptions] = useState([]); // 📝 Bildunterschriften separat

  // 🧩 Bilder direkt im formData halten
  useEffect(() => {
    setFormData((prev) => ({ ...prev, images }));
  }, [images]);

  // 📁 Exposés laden & speichern
  const { exposes, addExpose, deleteExpose, loadExpose } = useSavedExposes();

  // 📝 Eingaben im Formular
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✨ Exposé-Text generieren – sicher via Serverless (schützt OPENAI_API_KEY)
  const handleGenerate = async () => {
    // Mini-Guard: leeres Formular verhindern
    if (!formData || Object.values({ ...formData, images: undefined }).every((val) => val === '')) {
      alert('Bitte zuerst das Formular ausfüllen.');
      return;
    }

    // ⚠️ Hinweis: Die Vercel-Function /api/generate-expose ist im lokalen CRA-Dev-Server NICHT verfügbar.
    //             (Sie läuft im Vercel-Deploy oder mit "vercel dev".)
    const isLocalCra = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    setIsLoading(true);
    setOutput('');

    try {
      const prompt = generatePrompt(formData, selectedStyle);

      if (isLocalCra) {
        // 🚧 Lokaler Hinweis statt 404: verhindert, dass User lange rätseln.
        setOutput('ℹ️ Die Exposé-Generierung läuft über die Vercel-Function und ist lokal (CRA) nicht aktiv. Bitte nach dem Deploy testen.');
        return;
      }

      // 🔐 Sicheren Endpoint aufrufen – Supabase-Session wird im Header mitgeschickt
      const res = await fetchWithAuth('/api/generate-expose', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.error || 'Fehler bei der Exposé-Generierung.';
        throw new Error(msg);
      }

      const text = data?.text?.trim?.() || '';
      setOutput(text || '⚠️ Kein Text erhalten.');
    } catch (err) {
      console.error('Exposé-Generierung fehlgeschlagen:', err);
      setOutput(`⚠️ Fehler: ${err?.message || 'Unbekannter Fehler'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 💾 Exposé lokal speichern
  const handleSaveExpose = () => {
    addExpose({ formData, output, selectedStyle, images });
  };

  return (
    <div className="expose-tool-container">
      {/* 📋 Eingabeformular */}
      <ExposeForm
        formData={formData}
        setFormData={setFormData}
        onChange={handleChange}
      />

      {/* 🖼️ Bilderupload */}
      <ImageUpload
        images={images}
        setImages={setImages}
        captions={captions}
        setCaptions={setCaptions}
      />

      {/* ⚡ Button-Gruppe: Exposé generieren */}
      <div className="button-group center-buttons">
        <button
          onClick={handleGenerate}
          className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
          title="Exposé wird serverseitig (Vercel) generiert"
        >
          {isLoading && <span className="spinner"></span>}
          {isLoading ? 'Generiere…' : '🔮 Exposé generieren'}
        </button>
      </div>

      {/* 📄 Vorschau (inkl. Bilder & GPT-Ausgabe) */}
      <div id="pdf-export-section">
        <GPTOutputBox output={output} images={images} captions={captions} />
      </div>

      {/* 📤 Exportmöglichkeiten */}
      <ExportButtons
        formData={formData}
        output={output}
        selectedStyle={selectedStyle}
        images={images}
        onSaveExpose={handleSaveExpose}
      />

      {/* 💾 Gespeicherte Exposés */}
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
