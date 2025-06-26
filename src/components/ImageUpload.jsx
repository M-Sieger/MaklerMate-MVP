// src/components/ImageUpload.jsx

import React, { useRef } from 'react';

import styles from './ImageUpload.module.css'; // 🎨 Modul-CSS für Styling

/**
 * Komponente zum Upload und Vorschau von bis zu 5 Bildern.
 * Props:
 * - images: Array der aktuellen Base64-Bilder
 * - setImages: Funktion zum Aktualisieren des Bild-Arrays
 */
const ImageUpload = ({ images, setImages }) => {
  const fileInputRef = useRef(); // 📎 Referenz auf das Datei-Input-Element

  /**
   * Wandelt FileList in Base64-Daten um und limitiert auf max. 5 Bilder.
   */
  const handleFiles = (files) => {
    const fileArray = Array.from(files).slice(0, 5); // max. 5 Bilder
    const readers = fileArray.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result); // Base64 extrahieren
        reader.readAsDataURL(file);
      });
    });

    // ⏳ Sobald alle Files geladen → als Array setzen
    Promise.all(readers).then((base64Array) => {
      setImages(base64Array);
    });
  };

  return (
    <div className={styles.uploadWrapper}>
      <label className={styles.label}>📸 Objektfotos (max. 5):</label>

      {/* 🔼 Dateiupload */}
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* 🖼️ Bildvorschau */}
      <div className={styles.previewContainer}>
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Bild ${index + 1}`}
            className={styles.previewImage}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageUpload;
