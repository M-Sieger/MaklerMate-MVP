/**
 * @fileoverview useExpose Hook - React Hook für Exposé-Generierung
 *
 * ZWECK:
 * - Wraps exposeService für React-Components
 * - State-Management für Loading/Error/GeneratedText
 * - Toast-Integration für User-Feedback
 * - Type-Safe Error-Handling
 *
 * FEATURES:
 * - Generiert Exposé-Text via API
 * - Loading-State während API-Call
 * - Error-State bei Fehlern
 * - Success-Toast bei erfolgreichem Generate
 * - Reset-Funktion für Cleanup
 *
 * USE-CASES:
 * - ExposeTool Component
 * - Exposé-Preview Components
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-15
 * STATUS: 🟢 Production-Ready (TypeScript Migration)
 */

import { useState } from 'react';
import toast from 'react-hot-toast';

import exposeService from '../api/services/exposeService';
import { safeApiCall, showErrorToast, ApiError } from '../api/utils/errorHandler';
import type { ExposeFormData } from '../api/utils/validation';
import type { ExposeStyle } from '../api/services/exposeService';

// ==================== TYPES ====================

/**
 * Generate-Expose Result
 */
export interface GenerateExposeResult {
  /** Generierter Text (null bei Error) */
  data: string | null;

  /** Fehler (null bei Success) */
  error: ApiError | null;
}

/**
 * useExpose Hook Return Type
 */
export interface UseExposeReturn {
  // ===== STATE =====

  /** Läuft gerade eine Generierung? */
  isGenerating: boolean;

  /** Generierter Exposé-Text */
  generatedText: string;

  /** Fehler (null wenn kein Fehler) */
  error: ApiError | null;

  // ===== ACTIONS =====

  /**
   * Generiert Exposé-Text via API
   *
   * FEATURES:
   * - Setzt isGenerating während API-Call
   * - Setzt generatedText bei Success
   * - Setzt error bei Fehler
   * - Zeigt Toast-Notifications
   *
   * @param formData - Formular-Daten
   * @param style - Stil ('emotional'|'sachlich'|'luxus')
   * @returns Result-Object { data, error }
   *
   * @example
   * const { data, error } = await generateExpose(formData, 'emotional');
   * if (error) {
   *   console.error('Fehler:', error.message);
   * } else {
   *   console.log('Exposé:', data);
   * }
   */
  generateExpose: (
    formData: ExposeFormData,
    style?: ExposeStyle
  ) => Promise<GenerateExposeResult>;

  /**
   * Setzt generierten Text (z.B. beim Laden eines gespeicherten Exposés)
   *
   * VERWENDUNG:
   * - Laden von gespeichertem Exposé
   * - Manuelles Setzen von Text
   *
   * @param text - Exposé-Text
   */
  setText: (text: string) => void;

  /**
   * Reset Hook-State
   *
   * VERWENDUNG:
   * - Cleanup bei Component-Unmount
   * - "Neues Exposé"-Button
   */
  reset: () => void;
}

// ==================== HOOK ====================

/**
 * Hook für Exposé-Generierung
 *
 * FEATURES:
 * - Type-Safe API-Calls
 * - Loading-State-Management
 * - Error-State-Management
 * - Toast-Integration
 * - Success/Error-Callbacks
 *
 * @returns Hook-API mit State und Actions
 *
 * @example
 * const { isGenerating, generatedText, error, generateExpose, setText, reset } = useExpose();
 *
 * // Generiere Exposé
 * const handleGenerate = async () => {
 *   const { data, error } = await generateExpose(formData, 'emotional');
 *   if (!error) {
 *     console.log('Exposé:', data);
 *   }
 * };
 *
 * // Laden von gespeichertem Exposé
 * useEffect(() => {
 *   const savedText = localStorage.getItem('expose_draft');
 *   if (savedText) setText(savedText);
 * }, []);
 *
 * // Cleanup
 * useEffect(() => {
 *   return () => reset();
 * }, []);
 */
export function useExpose(): UseExposeReturn {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedText, setGeneratedText] = useState<string>('');
  const [error, setError] = useState<ApiError | null>(null);

  /**
   * Generiert Exposé-Text via API
   */
  const generateExpose = async (
    formData: ExposeFormData,
    style: ExposeStyle = 'emotional'
  ): Promise<GenerateExposeResult> => {
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
   */
  const setText = (text: string): void => {
    setGeneratedText(text);
    setError(null);
  };

  /**
   * Reset Hook-State
   */
  const reset = (): void => {
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
