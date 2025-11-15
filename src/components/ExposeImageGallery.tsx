import React from 'react';

// ✅ CSS-Modul aus dem richtigen Ordner (../styles)
import styles from '../styles/ExposeImageGallery.module.css';

// ==================== TYPES ====================

interface ImageItem {
  url: string;
  caption?: string;
}

interface ExposeImageGalleryProps {
  images: (ImageItem | string)[];
}

// ==================== COMPONENT ====================

const ExposeImageGallery = ({ images }: ExposeImageGalleryProps) => {
  if (!images || images.length === 0) return null;

  return (
    <div className={styles.galleryContainer}>
      {images.map((img, index) => {
        const isObject = typeof img === 'object';
        const url = isObject ? (img as ImageItem).url : (img as string);
        const caption = isObject ? (img as ImageItem).caption : undefined;

        return (
          <div key={index} className={styles.galleryItem}>
            <img
              src={url}
              alt={`Objektbild ${index + 1}`}
              className={styles.galleryImage}
            />
            {caption && (
              <div className={styles.galleryCaption}>{caption}</div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ExposeImageGallery;
