// 🪝 useExpose.js – React Hook für Exposé-Generierung
// ✅ Wraps exposeService für React-Components
// ✅ State-Management für Loading/Error
// ✅ Toast-Integration
// ✅ Error-Handling

import { useState } from 'react';
import toast from 'react-hot-toast';

import exposeService from '../api/services/exposeService';
import { safeApiCall, showErrorToast } from '../api/utils/errorHandler';

/**
 * Hook für Exposé-Generierung
 * @returns {Object} Hook-API
 */
export function useExpose() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState('');
  const [error, setError] = useState(null);

  /**
   * Generiert Exposé-Text via API
   * @param {Object} formData - Formular-Daten
   * @param {string} style - Stil ('emotional'|'sachlich'|'luxus')
   * @returns {Promise<{data: string|null, error: Error|null}>}
   */
  const generateExpose = async (formData, style = 'emotional') => {
    setIsGenerating(true);
    setError(null);
    setGeneratedText('');

    const { data, error: apiError } = await safeApiCall(
      () => exposeService.generateExpose(formData, style),
      {
        onError: (err) => {
          setError(err);
          showErrorToast(err);
        },
        onSuccess: (text) => {
          setGeneratedText(text);
          toast.success('✅ Exposé erfolgreich generiert!', {
            duration: 3000,
          });
        },
        throwError: false,
      }
    );

    setIsGenerating(false);

    return { data, error: apiError };
  };

  /**
   * Setzt generierten Text (z.B. beim Laden eines gespeicherten Exposés)
   * @param {string} text - Exposé-Text
   */
  const setText = (text) => {
    setGeneratedText(text);
    setError(null);
  };

  /**
   * Reset Hook-State
   */
  const reset = () => {
    setGeneratedText('');
    setError(null);
    setIsGenerating(false);
  };

  return {
    // State
    isGenerating,
    generatedText,
    error,

    // Actions
    generateExpose,
    setText,
    reset,
  };
}
