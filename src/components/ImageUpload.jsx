import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { enhanceImage } from '../utils/imageEnhancer'; // 📦 Bildoptimierung
import styles from './ImageUpload.module.css'; // 🎨 CSS

const ImageUpload = ({ images, setImages }) => {
  const fileInputRef = useRef();
  const [autoEnhance, setAutoEnhance] = useState(false);

  // 🔁 Lokale Speicherung: Bilder aus localStorage laden beim Start
  useEffect(() => {
    const saved = localStorage.getItem('maklermate_images');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setImages(parsed);
        }
      } catch (err) {
        console.error('❌ Fehler beim Laden aus localStorage:', err);
      }
    }
  }, []);

  // 💾 Bilder in localStorage speichern bei jeder Änderung
  useEffect(() => {
    localStorage.setItem('maklermate_images', JSON.stringify(images));
  }, [images]);

  // 📁 Datei-Auswahl verarbeiten
  const handleFiles = async (files) => {
    const fileArray = Array.from(files).slice(0, 5 - images.length);

    const base64Array = await Promise.all(
      fileArray.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            const base64 = e.target.result;
            if (autoEnhance) {
              const enhanced = await enhanceImage(base64);
              resolve(enhanced);
            } else {
              resolve(base64);
            }
          };
          reader.readAsDataURL(file);
        });
      })
    );

    setImages([...images, ...base64Array]);
  };

  // ❌ Einzelnes Bild löschen
  const removeImage = (indexToRemove) => {
    const updated = images.filter((_, index) => index !== indexToRemove);
    setImages(updated);
  };

  return (
    <div className={styles.uploadWrapper}>
      <label className={styles.label}>📸 Objektfotos (max. 5):</label>

      {/* ☑️ Checkbox für automatische Optimierung */}
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

      {/* 🖼️ Vorschau + ❌-Button */}
      <div className={styles.previewContainer}>
        {images.map((img, index) => (
          <div key={index} className={styles.previewImageWrapper}>
            <img src={img} alt={`Bild ${index + 1}`} className={styles.previewImage} />
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
