/**
 * @fileoverview OpenAI API Client für GPT-Exposé-Generierung
 *
 * ZWECK:
 * - GPT-Prompts generieren
 * - API-Calls an lokalen Proxy-Server
 * - Exposé-Texte generieren
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * STATUS: 🟢 Production-Ready (TypeScript Migration)
 */

import type { ExposeFormData } from '@/api/utils/validation';

/**
 * GPT API Response
 */
interface GPTResponse {
  result: string;
}

/**
 * Verfügbare Schreibstile für Exposés
 */
export type ExposeStyle = 'emotional' | 'sachlich' | 'luxus';

/**
 * Fetches GPT Response from local proxy server
 *
 * @param prompt - GPT Prompt
 * @returns Generated text
 * @throws Error wenn API-Call fehlschlägt
 */
export const fetchGPTResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await fetch('http://localhost:5001/api/gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const data: GPTResponse = await response.json();
    console.log('[DEBUG] GPT API-Antwort:', data); // 🧪 DEBUG OUT

    if (!data.result) {
      console.error('❌ Ungültige GPT-Antwort:', data);
      throw new Error('GPT-Antwort leer oder fehlerhaft');
    }

    return data.result.trim();
  } catch (err) {
    console.error('❌ Fehler beim GPT-Fetch:', err);
    throw err;
  }
};

/**
 * Generiert GPT-Prompt für Exposé-Text
 *
 * FEATURES:
 * - Stilwahl (emotional, sachlich, luxus)
 * - Alle Formular-Daten eingebunden
 * - Professioneller Output
 *
 * @param formData - Exposé-Formulardaten
 * @param selectedStyle - Gewünschter Schreibstil
 * @returns Formatierter GPT-Prompt
 */
export function generatePrompt(
  formData: ExposeFormData,
  selectedStyle: ExposeStyle
): string {
  let stilHinweis = '';
  if (selectedStyle === 'emotional')
    stilHinweis = 'Sprich emotional, menschlich, lebendig.';
  if (selectedStyle === 'sachlich')
    stilHinweis = 'Sprich sachlich, strukturiert, objektiv.';
  if (selectedStyle === 'luxus')
    stilHinweis = 'Sprich exklusiv, hochwertig, elegant.';

  return `
Du bist ein erfahrener Immobilienmakler und Textprofi.

${stilHinweis}

Formuliere einen hochwertigen, zusammenhängenden Exposétext (1–2 Absätze), der folgende Daten elegant und realitätsnah beschreibt:

- Objektart: ${formData.objektart}
- Adresse: ${formData.strasse}, ${formData.ort}, ${formData.bezirk}
- Aussicht/Sicht: ${formData.sicht}
- Lagebesonderheiten: ${formData.lagebesonderheiten}
- Wohnfläche: ${formData.wohnflaeche} m²
- Grundstücksgröße: ${formData.grundstueck} m²
- Zimmeranzahl: ${formData.zimmer}
- Baujahr: ${formData.baujahr}
- Zustand: ${formData.zustand}
- Kaufpreis: ${formData.preis}
- Energieeffizienzklasse: ${formData.energie}
- Besondere Merkmale: ${formData.besonderheiten}

Vermeide Bulletpoints. Schreibe stattdessen einen professionellen, ansprechenden Beschreibungstext – wie für ein echtes Immobilienexposé.
`;
}
