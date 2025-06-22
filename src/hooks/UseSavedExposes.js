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

  const addExpose = ({ formData, output }) => {
    const newExpose = {
      id: Date.now(),
      formData,
      output,
      createdAt: new Date().toISOString(),
    };
    setExposes((prev) => [...prev, newExpose]);
  };

  const deleteExpose = (id) => {
    setExposes((prev) => prev.filter((e) => e.id !== id));
  };

  const loadExpose = (expose, setFormData, setOutput) => {
    if (setFormData && setOutput) {
      setFormData(expose.formData);
      setOutput(expose.output);
    } else {
      console.warn("setFormData oder setOutput fehlen in loadExpose()");
    }
  };

  return {
    exposes,
    addExpose,
    deleteExpose,
    loadExpose,
  };
}
