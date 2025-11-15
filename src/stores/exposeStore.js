// 🏪 exposeStore.js – Zustand Store für Exposé-Tool
// ✅ Zentrales State-Management ohne Prop-Drilling
// ✅ Auto-Persistierung in localStorage
// ✅ Actions für alle State-Updates

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const initialFormData = {
  objektart: '',
  strasse: '',
  ort: '',
  bezirk: '',
  wohnflaeche: '',
  zimmer: '',
  baujahr: '',
  preis: '',
  etage: '',
  balkonTerrasse: '',
  ausstattung: '',
  besonderheiten: '',
};

const useExposeStore = create(
  persist(
    (set, get) => ({
      // ==================== STATE ====================
      formData: initialFormData,
      output: '',
      selectedStyle: 'emotional',
      isLoading: false,
      images: [],
      captions: [],
      savedExposes: [],

      // ==================== FORM ACTIONS ====================

      /**
       * Setzt komplettes FormData-Object
       */
      setFormData: (data) => set({ formData: data }),

      /**
       * Updated einzelnes Formular-Feld
       */
      updateFormField: (field, value) =>
        set((state) => ({
          formData: { ...state.formData, [field]: value },
        })),

      /**
       * Setzt Output-Text
       */
      setOutput: (output) => set({ output }),

      /**
       * Setzt gewählten Stil
       */
      setStyle: (style) => set({ selectedStyle: style }),

      /**
       * Setzt Loading-Status
       */
      setLoading: (loading) => set({ isLoading: loading }),

      // ==================== IMAGE ACTIONS ====================

      /**
       * Fügt neues Bild hinzu
       */
      addImage: (image) =>
        set((state) => ({
          images: [...state.images, image],
          captions: [...state.captions, ''],
        })),

      /**
       * Entfernt Bild an Index
       */
      removeImage: (index) =>
        set((state) => ({
          images: state.images.filter((_, i) => i !== index),
          captions: state.captions.filter((_, i) => i !== index),
        })),

      /**
       * Updated Caption an Index
       */
      updateCaption: (index, caption) =>
        set((state) => {
          const newCaptions = [...state.captions];
          newCaptions[index] = caption;
          return { captions: newCaptions };
        }),

      /**
       * Setzt alle Bilder und Captions
       */
      setImages: (images) => set({ images }),

      /**
       * Setzt alle Captions
       */
      setCaptions: (captions) => set({ captions }),

      // ==================== SAVED EXPOSES ACTIONS ====================

      /**
       * Speichert aktuelles Exposé
       */
      saveExpose: () =>
        set((state) => ({
          savedExposes: [
            ...state.savedExposes,
            {
              id: Date.now(),
              formData: state.formData,
              output: state.output,
              selectedStyle: state.selectedStyle,
              images: state.images,
              captions: state.captions,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      /**
       * Löscht gespeichertes Exposé
       */
      deleteExpose: (id) =>
        set((state) => ({
          savedExposes: state.savedExposes.filter((e) => e.id !== id),
        })),

      /**
       * Lädt gespeichertes Exposé in aktuelles Formular
       */
      loadExpose: (expose) =>
        set({
          formData: expose.formData,
          output: expose.output,
          selectedStyle: expose.selectedStyle,
          images: expose.images || [],
          captions: expose.captions || [],
        }),

      // ==================== RESET ====================

      /**
       * Setzt Formular zurück (behält savedExposes)
       */
      reset: () =>
        set({
          formData: initialFormData,
          output: '',
          selectedStyle: 'emotional',
          isLoading: false,
        }),

      /**
       * Setzt Bilder zurück
       */
      resetImages: () =>
        set({
          images: [],
          captions: [],
        }),

      /**
       * Löscht alle gespeicherten Exposés
       */
      clearSavedExposes: () => set({ savedExposes: [] }),
    }),
    {
      name: 'maklermate-expose-storage',
      storage: createJSONStorage(() => localStorage),
      // Nur bestimmte Teile des States persistieren
      partialize: (state) => ({
        formData: state.formData,
        savedExposes: state.savedExposes,
        images: state.images,
        captions: state.captions,
        selectedStyle: state.selectedStyle,
      }),
    }
  )
);

export default useExposeStore;
