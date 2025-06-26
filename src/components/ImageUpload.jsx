import React, { useRef } from 'react';

import styles from './ImageUpload.module.css';

const ImageUpload = ({ images, setImages }) => {
  const fileInputRef = useRef();

  // ✅ Konvertiert FileList zu max. 5 base64-Bildern
  const handleFiles = (files) => {
    const fileArray = Array.from(files).slice(0, 5 - images.length); // begrenzen
    const readers = fileArray.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((base64Array) => {
      setImages([...images, ...base64Array]); // ⬆️ an bestehende Bilder anhängen
    });
  };

  // 🧽 Entfernt ein Bild anhand seines Index
  const removeImage = (indexToRemove) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className={styles.uploadWrapper}>
      <label className={styles.label}>📸 Objektfotos (max. 5):</label>
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        onChange={(e) => handleFiles(e.target.files)}
      />
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
