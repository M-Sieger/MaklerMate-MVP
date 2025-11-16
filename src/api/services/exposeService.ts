/**
 * @fileoverview Expose Service - Business-Logic für Exposé-Generierung
 *
 * ZWECK:
 * - Exposé-Generierung via OpenAI GPT-4o-mini
 * - Input-Validierung (Pflichtfelder, Ranges)
 * - Response-Validierung (Länge, Error-Patterns)
 * - Prompt-Building mit verschiedenen Stilen
 * - Retry-Logic für API-Resilience
 *
 * ARCHITECTURE:
 * - Service-Layer Pattern (Business-Logic aus Components)
 * - Singleton-Instance (export default new ExposeService())
 * - Private Methods für interne Logic (_buildPrompt)
 * - Error-Handling via validation + retry utils
 *
 * FLOW:
 * 1. Validierung der Formulardaten
 * 2. Prompt-Building basierend auf Stil
 * 3. API-Call mit Retry-Logic
 * 4. Response-Validierung
 * 5. Return sanitized Text
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-15
 * STATUS: 🟢 Production-Ready (TypeScript Migration)
 */

import apiClient from '../clients/apiClient';
import { retryWithBackoff } from '../utils/retry';
import {
  validateExposeData,
  validateExposeResponse,
  type ExposeFormData,
} from '../utils/validation';

// ==================== TYPES ====================

/**
 * Exposé-Stilrichtungen
 */
export type ExposeStyle = 'emotional' | 'sachlich' | 'luxus';

/**
 * API-Response-Format
 */
interface ExposeApiResponse {
  text?: string;
  [key: string]: unknown;
}

/**
 * Style-Hints für Prompt-Building
 */
interface StyleHints {
  emotional: string;
  sachlich: string;
  luxus: string;
}

// ==================== SERVICE CLASS ====================

/**
 * Expose Service für Exposé-Generierung
 *
 * SINGLETON:
 * - Eine Instance für gesamte App
 * - Export als `export default new ExposeService()`
 * - Verwendung: `import exposeService from '../services/exposeService'`
 *
 * METHODS:
 * - generateExpose(formData, style): Generiert Exposé-Text
 * - _buildPrompt(formData, style): Erstellt GPT-Prompt (private)
 */
class ExposeService {
  /**
   * Style-Hints für Prompt-Building
   * @private
   */
  private readonly styleHints: StyleHints = {
    emotional:
      'Sprich emotional, menschlich, lebendig. Wecke Gefühle und male Bilder mit Worten.',
    sachlich:
      'Sprich sachlich, strukturiert, objektiv. Präsentiere Fakten klar und professionell.',
    luxus:
      'Sprich exklusiv, hochwertig, elegant. Betone Prestige und gehobene Ausstattung.',
  };

  /**
   * Generiert ein Immobilien-Exposé via GPT-4o-mini
   *
   * VALIDIERUNG:
   * - Pflichtfelder: objektart, strasse, ort, wohnflaeche, zimmer, preis
   * - Ranges: wohnflaeche > 0, zimmer > 0
   * - Response: Min. 50, max. 5000 Zeichen
   *
   * RETRY-LOGIC:
   * - Max. 2 Retries
   * - Initial Delay: 2000ms
   * - Retryable Status: 429, 500, 502, 503
   * - Exponential Backoff mit Jitter
   *
   * API-ENDPOINT:
   * - POST /api/generate-expose
   * - Body: { prompt: string }
   * - Response: { text: string }
   *
   * @param formData - Immobiliendaten
   * @param style - Stilrichtung (default: 'emotional')
   * @returns Generierter Exposé-Text
   * @throws Error bei Validierung oder API-Fehlern
   *
   * @example
   * const text = await exposeService.generateExpose(
   *   {
   *     objektart: 'Wohnung',
   *     strasse: 'Hauptstr. 1',
   *     ort: 'Berlin',
   *     wohnflaeche: '80',
   *     zimmer: '3',
   *     preis: '450.000 €',
   *   },
   *   'emotional'
   * );
   */
  async generateExpose(
    formData: ExposeFormData,
    style: ExposeStyle = 'emotional'
  ): Promise<string> {
    // VALIDATION: Pflichtfelder + Ranges
    const validationError = validateExposeData(formData);
    if (validationError) {
      throw new Error(`Validierungsfehler: ${validationError}`);
    }

    // PROMPT-BUILDING: Basierend auf Stil
    const prompt = this._buildPrompt(formData, style);

    // API-CALL: Mit Retry-Logic
    // WARUM: OpenAI-API kann 429 (Rate-Limit) oder 503 (Overload) returnen
    return retryWithBackoff(
      async () => {
        const response = await apiClient.post<ExposeApiResponse>(
          '/api/generate-expose',
          { prompt }
        );

        const text = response.data?.text?.trim();
        if (!text) {
          throw new Error('Leere Antwort von API erhalten');
        }

        // RESPONSE-VALIDATION: Länge + Error-Patterns
        validateExposeResponse(text);

        return text;
      },
      {
        maxRetries: 2,
        initialDelay: 2000,
        retryableStatuses: [429, 500, 502, 503],
        onRetry: (attempt, delay, error) => {
          console.warn(
            `🔄 Exposé-Generierung Retry ${attempt}/2 nach ${Math.round(delay)}ms`,
            error.message
          );
        },
      }
    );
  }

  /**
   * Baut den Prompt für GPT basierend auf Formular-Daten und Stil
   *
   * PROMPT-STRUKTUR:
   * 1. Rolle: "Du bist ein erfahrener Immobilienmakler"
   * 2. Stil-Hint: Emotional/Sachlich/Luxus
   * 3. Aufgabe: "Formuliere einen hochwertigen Exposétext"
   * 4. Daten: Objektart, Adresse, Fläche, Zimmer, Preis, etc.
   * 5. Optionale Felder: Baujahr, Etage, Balkon, Ausstattung
   * 6. Formatierung: "Vermeide Bulletpoints"
   *
   * @private
   * @param formData - Formular-Daten
   * @param style - Stilrichtung
   * @returns Fertiger GPT-Prompt
   */
  private _buildPrompt(formData: ExposeFormData, style: ExposeStyle): string {
    const styleHint = this.styleHints[style] || this.styleHints.emotional;

    // BASIS-INFORMATIONEN (Pflichtfelder)
    const parts: string[] = [
      `Du bist ein erfahrener Immobilienmakler und Textprofi.`,
      ``,
      `${styleHint}`,
      ``,
      `Formuliere einen hochwertigen, zusammenhängenden Exposétext (1–2 Absätze):`,
      ``,
      `- Objektart: ${formData.objektart}`,
      `- Adresse: ${formData.strasse}, ${formData.ort}${formData.bezirk ? `, ${formData.bezirk}` : ''}`,
      `- Wohnfläche: ${formData.wohnflaeche} m²`,
      `- Zimmer: ${formData.zimmer}`,
      `- Preis: ${formData.preis}`,
    ];

    // OPTIONALE FELDER
    // WARUM: Nur hinzufügen wenn gesetzt (besserer Prompt)
    if (formData.baujahr && String(formData.baujahr).trim()) {
      parts.push(`- Baujahr: ${formData.baujahr}`);
    }

    if (formData.etage && String(formData.etage).trim()) {
      parts.push(`- Etage: ${formData.etage}`);
    }

    if (formData.balkonTerrasse && String(formData.balkonTerrasse).trim()) {
      parts.push(`- Balkon/Terrasse: ${formData.balkonTerrasse}`);
    }

    if (formData.ausstattung && String(formData.ausstattung).trim()) {
      parts.push(`- Ausstattung: ${formData.ausstattung}`);
    }

    if (formData.besonderheiten && String(formData.besonderheiten).trim()) {
      parts.push(`- Besonderheiten: ${formData.besonderheiten}`);
    }

    // FORMATIERUNGS-HINWEIS
    parts.push(``);
    parts.push(
      `Vermeide Bulletpoints. Schreibe professionell und ansprechend.`
    );

    return parts.join('\n').trim();
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Singleton-Instance des ExposeService
 *
 * VERWENDUNG:
 * ```typescript
 * import exposeService from '../services/exposeService';
 *
 * const text = await exposeService.generateExpose(formData, 'emotional');
 * ```
 */
export default new ExposeService();
