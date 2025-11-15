// 🏠 exposeService.js – Service-Layer für Exposé-Generierung
// ✅ Business-Logic aus Komponenten extrahiert
// ✅ Validierung + Retry-Logic integriert
// ✅ Prompt-Building zentralisiert

import apiClient from '../clients/apiClient';
import { retryWithBackoff } from '../utils/retry';
import {
  validateExposeData,
  validateExposeResponse,
} from '../utils/validation';

class ExposeService {
  /**
   * Generiert ein Immobilien-Exposé via GPT-4o
   * @param {Object} formData - Immobiliendaten
   * @param {string} style - Stilrichtung ('emotional'|'sachlich'|'luxus')
   * @returns {Promise<string>} Generierter Exposé-Text
   * @throws {Error} Bei Validierung oder API-Fehlern
   */
  async generateExpose(formData, style = 'emotional') {
    // Validierung
    const validationError = validateExposeData(formData);
    if (validationError) {
      throw new Error(`Validierungsfehler: ${validationError}`);
    }

    // Prompt erstellen
    const prompt = this._buildPrompt(formData, style);

    // API-Call mit Retry-Logic
    return retryWithBackoff(
      async () => {
        const response = await apiClient.post('/api/generate-expose', {
          prompt,
        });

        const text = response.data?.text?.trim();
        if (!text) {
          throw new Error('Leere Antwort von API erhalten');
        }

        // Response-Validierung
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
   * @private
   * @param {Object} formData - Formular-Daten
   * @param {string} style - Stilrichtung
   * @returns {string} Fertiger Prompt
   */
  _buildPrompt(formData, style) {
    const styleHints = {
      emotional: 'Sprich emotional, menschlich, lebendig. Wecke Gefühle und male Bilder mit Worten.',
      sachlich:
        'Sprich sachlich, strukturiert, objektiv. Präsentiere Fakten klar und professionell.',
      luxus:
        'Sprich exklusiv, hochwertig, elegant. Betone Prestige und gehobene Ausstattung.',
    };

    const styleHint = styleHints[style] || styleHints.emotional;

    // Basis-Informationen
    const parts = [
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

    // Optionale Felder
    if (formData.baujahr && formData.baujahr.trim()) {
      parts.push(`- Baujahr: ${formData.baujahr}`);
    }

    if (formData.etage && formData.etage.trim()) {
      parts.push(`- Etage: ${formData.etage}`);
    }

    if (formData.balkonTerrasse && formData.balkonTerrasse.trim()) {
      parts.push(`- Balkon/Terrasse: ${formData.balkonTerrasse}`);
    }

    if (formData.ausstattung && formData.ausstattung.trim()) {
      parts.push(`- Ausstattung: ${formData.ausstattung}`);
    }

    if (formData.besonderheiten && formData.besonderheiten.trim()) {
      parts.push(`- Besonderheiten: ${formData.besonderheiten}`);
    }

    parts.push(``);
    parts.push(
      `Vermeide Bulletpoints. Schreibe professionell und ansprechend.`
    );

    return parts.join('\n').trim();
  }
}

export default new ExposeService();
