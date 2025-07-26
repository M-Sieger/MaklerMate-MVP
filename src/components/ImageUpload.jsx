import React, {
  useEffect,
  useRef,
  useState,
} from 'react';

import { moveItem } from '../utils/arrayHelpers'; // 🔁 Bilder verschieben
import { enhanceImage } from '../utils/imageEnhancer'; // 🧽 Bildoptimierung
import styles from './ImageUpload.module.css'; // 🎨 Styling

const ImageUpload = ({ images, setImages }) => {
  const fileInputRef = useRef();
  const [autoEnhance, setAutoEnhance] = useState(false);
  const [captions, setCaptions] = useState([]); // 📝 Neue Bildunterschriften

  // 🔁 Bilder & Captions aus localStorage laden
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

  // 💾 Änderungen speichern
  useEffect(() => {
    localStorage.setItem('maklermate_images', JSON.stringify(images));
    localStorage.setItem('maklermate_captions', JSON.stringify(captions));
  }, [images, captions]);

  // 📁 Neue Bilder verarbeiten und optional optimieren
  const handleFiles = async (files) => {
    const fileArray = Array.from(files).slice(0, 5 - images.length);

    const base64Array = await Promise.all(
      fileArray.map((file) => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = async (e) => {
            let base64 = e.target.result;

            if (autoEnhance) {
              try {
                const enhanced = await enhanceImage(base64);
                resolve(enhanced);
              } catch {
                resolve(base64);
              }
            } else {
              resolve(base64);
            }
          };
          reader.readAsDataURL(file);
        });
      })
    );

    setImages([...images, ...base64Array]);
    setCaptions([...captions, ...new Array(base64Array.length).fill('')]);
  };

  // 🗑️ Bild löschen
  const removeImage = (indexToRemove) => {
    const updatedImages = images.filter((_, i) => i !== indexToRemove);
    const updatedCaptions = captions.filter((_, i) => i !== indexToRemove);
    setImages(updatedImages);
    setCaptions(updatedCaptions);
  };

  // 🔀 Bilderreihenfolge ändern
  const moveImage = (from, to) => {
    setImages(moveItem(images, from, to));
    setCaptions(moveItem(captions, from, to));
  };

  // ✏️ Untertitel anpassen
  const updateCaption = (index, newCaption) => {
    const updated = [...captions];
    updated[index] = newCaption;
    setCaptions(updated);
  };

  return (
    <div className={styles.uploadWrapper}>
      <label className={styles.label}>📸 Objektfotos (max. 5):</label>

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

      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className={styles.gridContainer}>
        {images.map((img, index) => (
          <div key={index} className={styles.gridItem}>
            <img
              src={img}
              alt={`Bild ${index + 1}`}
              className={styles.gridImage}
            />

            <input
              type="text"
              value={captions[index] || ''}
              onChange={(e) => updateCaption(index, e.target.value)}
              className={styles.captionInput}
              placeholder="Bildunterschrift (optional)"
            />

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
