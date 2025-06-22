// 📁 src/hooks/useSavedExposes.js – Custom Hook zur lokalen Verwaltung gespeicherter Exposés

import {
  useEffect,
  useState,
} from 'react';

const STORAGE_KEY = "maklermate_exposes";

export default function useSavedExposes() {
  const [exposes, setExposes] = useState([]);

  // 🔃 Beim Laden initialisieren
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setExposes(JSON.parse(stored));
    }
  }, []);

  // 💾 Speichern nach jeder Änderung
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(exposes));
  }, [exposes]);

const addExpose = ({ formData, output, selectedStyle }) => {
  const newExpose = {
    id: Date.now(),
    formData,
    output,
    selectedStyle, // ✅ hinzugefügt
    createdAt: new Date().toISOString(),
  };
  setExposes((prev) => [...prev, newExpose]);
};

const loadExpose = (expose, setFormData, setOutput, setSelectedStyle) => {
  if (typeof setFormData === 'function') {
    setFormData(expose.formData);
  }
  if (typeof setOutput === 'function') {
    setOutput(expose.output);
  }
  if (typeof setSelectedStyle === 'function') {
    setSelectedStyle(expose.selectedStyle || 'emotional'); // fallback
  }
};


  const deleteExpose = (id) => {
    setExposes((prev) => prev.filter((e) => e.id !== id));
  };

  return {
    exposes,
    addExpose,
    deleteExpose,
    loadExpose,
  };
}
// 📁 src/hooks/useSavedExposes.js – Custom Hook zur lokalen Verwaltung gespeicherter Exposés