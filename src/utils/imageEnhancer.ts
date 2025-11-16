/**
 * @fileoverview Image Enhancement Utilities
 *
 * ZWECK:
 * - Verbessert Helligkeit & Kontrast von Base64-Bildern
 * - Canvas-basierte Bildverarbeitung
 * - Client-side Image Processing
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * STATUS: 🟢 Production-Ready (TypeScript Migration)
 */

/**
 * Image Enhancement Options
 */
export interface EnhanceOptions {
  /** Helligkeit (default: 1.1 = +10%) */
  brightness?: number;
  /** Kontrast (default: 1.1 = +10%) */
  contrast?: number;
}

/**
 * Verbessert Helligkeit & Kontrast eines Base64-Bildes
 *
 * VERWENDUNG:
 * - Für Immobilien-Bilder
 * - Automatische Qualitätsverbesserung
 * - Client-side Processing
 *
 * @param base64Image - Base64-String des Bildes
 * @param options - Enhancement-Optionen
 * @returns Promise mit verbessertem Base64-Bild
 *
 * @example
 * const enhanced = await enhanceImage(imageData, {
 *   brightness: 1.2,
 *   contrast: 1.1,
 * });
 */
export const enhanceImage = (
  base64Image: string,
  { brightness = 1.1, contrast = 1.1 }: EnhanceOptions = {}
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Image;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Get image data
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Apply brightness and contrast
      for (let i = 0; i < data.length; i += 4) {
        // RGB channels (skip alpha at i+3)
        data[i] = Math.min(255, data[i] * brightness * contrast);     // R
        data[i + 1] = Math.min(255, data[i + 1] * brightness * contrast); // G
        data[i + 2] = Math.min(255, data[i + 2] * brightness * contrast); // B
      }

      // Put modified data back
      ctx.putImageData(imageData, 0, 0);

      // Return as Base64
      resolve(canvas.toDataURL('image/jpeg', 0.9));
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
  });
};
