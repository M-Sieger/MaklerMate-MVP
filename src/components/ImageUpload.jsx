// src/components/ImageUpload.jsx

import React, {
  useRef,
  useState,
} from 'react';

import {
  enhanceImage,
} from '../utils/imageEnhancer'; // 📦 Importiert Bild-Optimierungsfunktion
import styles from './ImageUpload.module.css'; // 🎨 CSS-Styles

const ImageUpload = ({ images, setImages }) => {
  const fileInputRef = useRef();
  const [autoEnhance, setAutoEnhance] = useState(false); // 🟡 Lokaler State für Checkbox „automatisch optimieren“

  // 📁 Wird beim Auswählen von Dateien ausgelöst
  const handleFiles = async (files) => {
    const fileArray = Array.from(files).slice(0, 5 - images.length); // ⛔ Begrenzung auf max. 5 Bilder

    const base64Array = await Promise.all(
      fileArray.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const base64 = e.target.result;

            // 🔧 Wenn aktiviert: Bild mit KI-Funktion optimieren
            if (autoEnhance) {
              const enhanced = await enhanceImage(base64);
              resolve(enhanced);
            } else {
              resolve(base64); // 🔹 Original verwenden
            }
          };
          reader.readAsDataURL(file);
        });
      })
    );

    // 🔗 Neue Bilder an bestehenden State anhängen
    setImages([...images, ...base64Array]);
  };

  // ❌ Entfernt ein Bild anhand des Index
  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className={styles.uploadWrapper}>
      {/* 📌 Label */}
      <label className={styles.label}>📸 Objektfotos (max. 5):</label>

      {/* 🔘 Checkbox für automatische Optimierung */}
      <div className={styles.checkboxRow}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={autoEnhance}
            onChange={() => setAutoEnhance(!autoEnhance)}
          />
          Bild automatisch optimieren
        </label>
      </div>

      {/* 📂 Datei-Upload */}
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* 🖼️ Vorschau + Löschfunktion */}
      <div className={styles.previewContainer}>
        {images.map((img, index) => (
          <div key={index} className={styles.previewImageWrapper}>
            <img
              src={img}
              alt={`Bild ${index + 1}`}
              className={styles.previewImage}
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className={styles.deleteButton}
              title="Bild entfernen"
            >
              ❌
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
