/**
 * @fileoverview Exposé Store - Zustand Store für Exposé-Tool
 *
 * ZWECK:
 * - Zentrales State-Management ohne Prop-Drilling
 * - Auto-Persistierung in localStorage
 * - Actions für alle State-Updates
 *
 * FEATURES:
 * - FormData für Immobilien-Details
 * - Output-Text vom GPT
 * - Bild-Management (Upload, Reorder, Captions)
 * - Saved Exposés (Save, Load, Delete)
 * - Reset-Funktionen
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-15
 * STATUS: 🟢 Production-Ready (TypeScript Migration)
 */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { ExposeFormData } from '@/api/utils/validation';

// ==================== TYPES ====================

/**
 * Stil-Optionen für Exposé-Generierung
 */
export type ExposeStyle = 'emotional' | 'sachlich' | 'luxus';

/**
 * Gespeichertes Exposé
 */
export interface SavedExpose {
  id: number;
  formData: ExposeFormData;
  output: string;
  selectedStyle: ExposeStyle;
  images: string[];
  captions: string[];
  createdAt: string;
}

/**
 * Exposé Store State
 */
interface ExposeState {
  // ==================== STATE ====================
  formData: ExposeFormData;
  output: string;
  selectedStyle: ExposeStyle;
  isLoading: boolean;
  images: string[];
  captions: string[];
  savedExposes: SavedExpose[];

  // ==================== FORM ACTIONS ====================
  setFormData: (data: ExposeFormData) => void;
  updateFormData: (updates: Partial<ExposeFormData>) => void;
  updateFormField: (field: keyof ExposeFormData, value: string) => void;
  setOutput: (output: string) => void;
  setStyle: (style: ExposeStyle) => void;
  setSelectedStyle: (style: ExposeStyle) => void; // Alias for backward compatibility
  setLoading: (loading: boolean) => void;

  // ==================== IMAGE ACTIONS ====================
  addImage: (image: string) => void;
  removeImage: (index: number) => void;
  updateCaption: (index: number, caption: string) => void;
  moveImage: (fromIndex: number, toIndex: number) => void;
  setImages: (images: string[]) => void;
  setCaptions: (captions: string[]) => void;

  // ==================== SAVED EXPOSES ACTIONS ====================
  saveExpose: () => void;
  deleteExpose: (indexOrId: number) => void;
  loadExpose: (expose: SavedExpose) => void;

  // ==================== RESET ====================
  reset: () => void;
  resetImages: () => void;
  clearSavedExposes: () => void;
}

// ==================== INITIAL STATE ====================

const initialFormData: ExposeFormData = {
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

// ==================== STORE ====================

const useExposeStore = create<ExposeState>()(
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
       * Updated FormData (merge mit bestehendem State)
       */
      updateFormData: (updates) =>
        set((state) => ({
          formData: { ...state.formData, ...updates },
        })),

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
       * Alias für setStyle (backward compatibility)
       */
      setSelectedStyle: (style) => set({ selectedStyle: style }),

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
       * Verschiebt Bild von einem Index zu anderem (Reordering)
       */
      moveImage: (fromIndex, toIndex) =>
        set((state) => {
          // Guard: Ungültige Indizes
          if (
            fromIndex < 0 ||
            fromIndex >= state.images.length ||
            toIndex < 0 ||
            toIndex >= state.images.length
          ) {
            return state;
          }

          // Array.splice to reorder
          const newImages = [...state.images];
          const newCaptions = [...state.captions];

          const [movedImage] = newImages.splice(fromIndex, 1);
          newImages.splice(toIndex, 0, movedImage);

          const [movedCaption] = newCaptions.splice(fromIndex, 1);
          newCaptions.splice(toIndex, 0, movedCaption);

          return { images: newImages, captions: newCaptions };
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
      deleteExpose: (indexOrId) =>
        set((state) => {
          // Check if it's an index (number < savedExposes.length) or an ID
          const isIndex =
            typeof indexOrId === 'number' &&
            indexOrId < state.savedExposes.length;

          if (isIndex) {
            // Delete by index
            return {
              savedExposes: state.savedExposes.filter(
                (_, i) => i !== indexOrId
              ),
            };
          } else {
            // Delete by ID
            return {
              savedExposes: state.savedExposes.filter(
                (e) => e.id !== indexOrId
              ),
            };
          }
        }),

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
