import React from 'react';

import styles
  from './ExposeImageGallery.module.css'; // 🖼️ Modul-CSS für Galerie

const ExposeImageGallery = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className={styles.galleryContainer}>
      {images.map((img, index) => (
        <div key={index} className={styles.galleryItem}>
          <img
            src={img.url || img} // Fallback falls `img` ein String ist
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
