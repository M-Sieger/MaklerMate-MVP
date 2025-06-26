// utils/imageEnhancer.js

/**
 * imageEnhancer - Verbessert Helligkeit & Kontrast eines Base64-Bildes mithilfe von Canvas.
 *
 * @param {string} base64Image - Das Eingabebild als Base64-String (z. B. von FileReader).
 * @param {object} options - Optional: Konfig für Anpassung.
 * @param {number} options.brightness - Helligkeit (default: 1.1 = +10%)
 * @param {number} options.contrast - Kontrast (default: 1.1 = +10%)
 * @returns {Promise<string>} - Neues Base64-Bild mit Anpassung
 */

export const enhanceImage = (base64Image, { brightness = 1.1, contrast = 1.1 } = {}) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Image;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = img.width;
      canvas.height = img.height;

      // Bild auf Canvas zeichnen
      ctx.drawImage(img, 0, 0);

      // Pixel-Daten holen
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Jedes Pixel bearbeiten
      for (let i = 0; i < data.length; i += 4) {
        // Helligkeit und Kontrast auf R, G, B anwenden
        data[i] = truncate((data[i] - 128) * contrast + 128 * brightness);
        data[i + 1] = truncate((data[i + 1] - 128) * contrast + 128 * brightness);
        data[i + 2] = truncate((data[i + 2] - 128) * contrast + 128 * brightness);
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(canvas.toDataURL()); // Rückgabe als neues Base64
    };

    img.onerror = (err) => reject(err);
  });
};

// Hilfsfunktion um Werte auf 0–255 zu begrenzen
function truncate(value) {
  return Math.min(255, Math.max(0, value));
}
