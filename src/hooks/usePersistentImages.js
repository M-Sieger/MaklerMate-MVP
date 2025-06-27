import {
  useEffect,
  useState,
} from 'react';

// 🔁 Speichert & lädt Bilder aus localStorage unter einem festen Key
const usePersistentImages = (storageKey = 'maklermate_images') => {
  const [images, setImages] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 📦 Bei jeder Änderung -> speichern
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(images));
    } catch {
      console.warn('⚠️ Konnte Bilder nicht im localStorage speichern');
    }
  }, [images, storageKey]);

  return [images, setImages];
};

export default usePersistentImages;