import React from 'react';

// ✅ CSS-Modul aus dem richtigen Ordner (../styles)
import styles from '../styles/ExposeImageGallery.module.css';

const ExposeImageGallery = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className={styles.galleryContainer}>
      {images.map((img, index) => (
        <div key={index} className={styles.galleryItem}>
          <img
            src={img.url || img}
            alt={`Objektbild ${index + 1}`}
            className={styles.galleryImage}
          />
          {img.caption && (
            <div className={styles.galleryCaption}>{img.caption}</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExposeImageGallery;
