import React from 'react';

import styles from './ExposeImageGallery.module.css';

const ExposeImageGallery = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className={styles.gallery}>
      {images.map((img, index) => (
        <img
          key={index}
          src={img}
          alt={`Objektbild ${index + 1}`}
          className={styles.image}
        />
      ))}
    </div>
  );
};

export default ExposeImageGallery;
