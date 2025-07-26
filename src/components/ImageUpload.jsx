import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  moveItem,
} from '../utils/arrayHelpers';       // 🔁 Bilder im Array verschieben
import {
  enhanceImage,
} from '../utils/imageEnhancer';  // 🧽 Bildoptimierung via GPT-Enhancer
import styles
  from './ImageUpload.module.css';          // 🎨 Styling via CSS Modules

const ImageUpload = ({ images, setImages }) => {
  const fileInputRef = useRef();

  // ⚙️ Bild-Optimierung (optional) & Captions
  const [autoEnhance, setAutoEnhance] = useState(false);
  const [captions, setCaptions] = useState([]); // 📝 Bildunterschriften als Parallel-Array zu images

  // 🔁 Initialer Load aus localStorage
  useEffect(() => {
    const savedImages = localStorage.getItem('maklermate_images');
    const savedCaptions = localStorage.getItem('maklermate_captions');

    if (savedImages) {
      try {
        const parsedImages = JSON.parse(savedImages);
        if (Array.isArray(parsedImages)) setImages(parsedImages);
      } catch (err) {
        console.error('❌ Fehler beim Laden von Bildern:', err);
      }
    }

    if (savedCaptions) {
      try {
        const parsedCaptions = JSON.parse(savedCaptions);
        if (Array.isArray(parsedCaptions)) setCaptions(parsedCaptions);
      } catch (err) {
        console.error('❌ Fehler beim Laden der Captions:', err);
      }
    }
  }, []);

  // 💾 Automatisches Speichern bei Änderungen
  useEffect(() => {
    localStorage.setItem('maklermate_images', JSON.stringify(images));
    localStorage.setItem('maklermate_captions', JSON.stringify(captions));
  }, [images, captions]);

  // 📥 Neue Bilder verarbeiten & optional optimieren
  const handleFiles = async (files) => {
    const fileArray = Array.from(files).slice(0, 5 - images.length); // max. 5 Bilder

    const base64Array = await Promise.all(
      fileArray.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            let base64 = e.target.result;

            if (autoEnhance) {
              try {
                const enhanced = await enhanceImage(base64); // 🧠 GPT-Optimierung
                resolve(enhanced);
              } catch {
                resolve(base64); // 🛑 Fallback falls Enhancer fehlschlägt
              }
            } else {
              resolve(base64); // 🚫 Ohne Optimierung
            }
          };
          reader.readAsDataURL(file);
        });
      })
    );

    setImages([...images, ...base64Array]);                                // Bilder anhängen
    setCaptions([...captions, ...new Array(base64Array.length).fill('')]); // Leere Captions anfügen
  };

  // ❌ Einzelnes Bild löschen
  const removeImage = (indexToRemove) => {
    const updatedImages = images.filter((_, i) => i !== indexToRemove);
    const updatedCaptions = captions.filter((_, i) => i !== indexToRemove);
    setImages(updatedImages);
    setCaptions(updatedCaptions);
  };

  // 🔀 Bilder verschieben (↑ ↓)
  const moveImage = (from, to) => {
    if (to < 0 || to >= images.length) return; // 🔒 Schutz gegen ungültige Indizes
    setImages(moveItem(images, from, to));
    setCaptions(moveItem(captions, from, to));
  };

  // ✏️ Bildunterschrift ändern
  const updateCaption = (index, newCaption) => {
    const updated = [...captions];
    updated[index] = newCaption;
    setCaptions(updated);
  };

  return (
    <div className={styles.uploadWrapper}>
      {/* 🧭 Label über dem Upload */}
      <label className={styles.label}>📸 Objektfotos (max. 5):</label>

      {/* ✅ Checkbox für Auto-Optimierung */}
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

      {/* 📁 Datei-Input (ausgeblendet via Ref, falls du später custom UI machst) */}
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* 🖼️ Bild-Grid */}
      <div className={styles.gridContainer}>
        {images.map((img, index) => (
          <div key={index} className={styles.gridItem}>
            <img
              src={img}
              alt={`Bild ${index + 1}`}
              className={styles.gridImage}
            />

            {/* 📝 Caption-Feld */}
            <input
              type="text"
              value={captions[index] || ''}
              onChange={(e) => updateCaption(index, e.target.value)}
              className={styles.captionInput}
              placeholder="Bildunterschrift (optional)"
            />

            {/* 🔘 Steuerbuttons (↑ ↓ ❌) */}
            <div className={styles.buttonRow}>
              <button
                onClick={() => moveImage(index, index - 1)}
                disabled={index === 0}
                className={styles.btnIcon}
              >
                ▲
              </button>
              <button
                onClick={() => moveImage(index, index + 1)}
                disabled={index === images.length - 1}
                className={styles.btnIcon}
              >
                ▼
              </button>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className={styles.btnIcon}
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
