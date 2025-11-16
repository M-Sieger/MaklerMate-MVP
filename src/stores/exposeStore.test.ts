/**
 * @fileoverview Tests für Exposé Store
 *
 * TESTED:
 * - Form Data Management (set, update, updateField)
 * - Output & Style Management
 * - Loading State
 * - Image Management (add, remove, update caption, reorder)
 * - Saved Exposés (save, load, delete)
 * - Reset Functions
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * DATUM: 2025-11-15
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

import useExposeStore from './exposeStore';
import type { ExposeFormData } from '../api/utils/validation';
import type { SavedExpose } from './exposeStore';

describe('Exposé Store', () => {
  beforeEach(() => {
    // Clear localStorage FIRST before rendering hook
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up after each test
    const { result } = renderHook(() => useExposeStore());
    act(() => {
      result.current.reset();
      result.current.resetImages();
      result.current.clearSavedExposes();
    });
    localStorage.clear();
  });

  describe('Form Data Management', () => {
    it('should set complete form data', () => {
      const { result } = renderHook(() => useExposeStore());

      const newFormData: ExposeFormData = {
        objektart: 'Wohnung',
        strasse: 'Musterstraße 123',
        ort: 'Berlin',
        bezirk: 'Mitte',
        wohnflaeche: '85',
        zimmer: '3',
        baujahr: '1995',
        preis: '450.000 €',
        etage: '2',
        balkonTerrasse: 'Ja',
        ausstattung: 'Moderne Einbauküche',
        besonderheiten: 'Südbalkon',
      };

      act(() => {
        result.current.setFormData(newFormData);
      });

      expect(result.current.formData).toEqual(newFormData);
    });

    it('should update form data partially', () => {
      const { result } = renderHook(() => useExposeStore());

      act(() => {
        result.current.setFormData({
          objektart: 'Wohnung',
          strasse: 'Alte Straße',
          ort: 'Berlin',
        });
      });

      act(() => {
        result.current.updateFormData({
          strasse: 'Neue Straße',
          wohnflaeche: '100',
        });
      });

      expect(result.current.formData.strasse).toBe('Neue Straße');
      expect(result.current.formData.wohnflaeche).toBe('100');
      expect(result.current.formData.objektart).toBe('Wohnung'); // unchanged
    });

    it('should update single form field', () => {
      const { result } = renderHook(() => useExposeStore());

      act(() => {
        result.current.updateFormField('objektart', 'Einfamilienhaus');
      });

      expect(result.current.formData.objektart).toBe('Einfamilienhaus');
    });
  });

  describe('Output & Style Management', () => {
    it('should set output text', () => {
      const { result } = renderHook(() => useExposeStore());

      const outputText = 'Dies ist ein wunderschönes Exposé.';

      act(() => {
        result.current.setOutput(outputText);
      });

      expect(result.current.output).toBe(outputText);
    });

    it('should set style', () => {
      const { result } = renderHook(() => useExposeStore());

      act(() => {
        result.current.setStyle('luxus');
      });

      expect(result.current.selectedStyle).toBe('luxus');
    });

    it('should set selected style (backward compatibility)', () => {
      const { result } = renderHook(() => useExposeStore());

      act(() => {
        result.current.setSelectedStyle('sachlich');
      });

      expect(result.current.selectedStyle).toBe('sachlich');
    });

    it('should default to emotional style', () => {
      const { result } = renderHook(() => useExposeStore());

      expect(result.current.selectedStyle).toBe('emotional');
    });
  });

  describe('Loading State', () => {
    it('should set loading state', () => {
      const { result } = renderHook(() => useExposeStore());

      expect(result.current.isLoading).toBe(false);

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);

      act(() => {
        result.current.setLoading(false);
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('Image Management', () => {
    it('should add image', () => {
      const { result } = renderHook(() => useExposeStore());

      const imageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRg...';

      act(() => {
        result.current.addImage(imageData);
      });

      expect(result.current.images).toHaveLength(1);
      expect(result.current.images[0]).toBe(imageData);
      expect(result.current.captions).toHaveLength(1);
      expect(result.current.captions[0]).toBe(''); // Empty caption
    });

    it('should add multiple images', () => {
      const { result } = renderHook(() => useExposeStore());

      act(() => {
        result.current.addImage('data:image/jpeg;base64,image1');
        result.current.addImage('data:image/jpeg;base64,image2');
        result.current.addImage('data:image/jpeg;base64,image3');
      });

      expect(result.current.images).toHaveLength(3);
      expect(result.current.captions).toHaveLength(3);
    });

    it('should remove image at index', () => {
      const { result } = renderHook(() => useExposeStore());

      act(() => {
        result.current.addImage('data:image/jpeg;base64,image1');
        result.current.addImage('data:image/jpeg;base64,image2');
        result.current.addImage('data:image/jpeg;base64,image3');
      });

      act(() => {
        result.current.removeImage(1); // Remove middle image
      });

      expect(result.current.images).toHaveLength(2);
      expect(result.current.images[0]).toBe('data:image/jpeg;base64,image1');
      expect(result.current.images[1]).toBe('data:image/jpeg;base64,image3');
    });

    it('should update caption at index', () => {
      const { result } = renderHook(() => useExposeStore());

      act(() => {
        result.current.addImage('data:image/jpeg;base64,image1');
        result.current.addImage('data:image/jpeg;base64,image2');
      });

      act(() => {
        result.current.updateCaption(0, 'Wohnzimmer mit Parkblick');
        result.current.updateCaption(1, 'Moderne Küche');
      });

      expect(result.current.captions[0]).toBe('Wohnzimmer mit Parkblick');
      expect(result.current.captions[1]).toBe('Moderne Küche');
    });

    it('should move image from one index to another', () => {
      const { result } = renderHook(() => useExposeStore());

      act(() => {
        result.current.addImage('image1');
        result.current.addImage('image2');
        result.current.addImage('image3');
        result.current.updateCaption(0, 'Caption 1');
        result.current.updateCaption(1, 'Caption 2');
        result.current.updateCaption(2, 'Caption 3');
      });

      act(() => {
        result.current.moveImage(0, 2); // Move first to last
      });

      expect(result.current.images[0]).toBe('image2');
      expect(result.current.images[1]).toBe('image3');
      expect(result.current.images[2]).toBe('image1');
      expect(result.current.captions[0]).toBe('Caption 2');
      expect(result.current.captions[1]).toBe('Caption 3');
      expect(result.current.captions[2]).toBe('Caption 1');
    });

    it('should not move image with invalid indices', () => {
      const { result } = renderHook(() => useExposeStore());

      act(() => {
        result.current.addImage('image1');
        result.current.addImage('image2');
      });

      const originalImages = [...result.current.images];

      act(() => {
        result.current.moveImage(-1, 1); // Invalid fromIndex
      });

      expect(result.current.images).toEqual(originalImages);

      act(() => {
        result.current.moveImage(0, 10); // Invalid toIndex
      });

      expect(result.current.images).toEqual(originalImages);
    });

    it('should set all images at once', () => {
      const { result } = renderHook(() => useExposeStore());

      const images = ['image1', 'image2', 'image3'];

      act(() => {
        result.current.setImages(images);
      });

      expect(result.current.images).toEqual(images);
    });

    it('should set all captions at once', () => {
      const { result } = renderHook(() => useExposeStore());

      const captions = ['Caption 1', 'Caption 2', 'Caption 3'];

      act(() => {
        result.current.setCaptions(captions);
      });

      expect(result.current.captions).toEqual(captions);
    });

    it('should reset images and captions', () => {
      const { result } = renderHook(() => useExposeStore());

      act(() => {
        result.current.addImage('image1');
        result.current.addImage('image2');
        result.current.updateCaption(0, 'Caption 1');
      });

      expect(result.current.images).toHaveLength(2);

      act(() => {
        result.current.resetImages();
      });

      expect(result.current.images).toHaveLength(0);
      expect(result.current.captions).toHaveLength(0);
    });
  });

  describe('Saved Exposés', () => {
    it('should save current exposé', () => {
      const { result } = renderHook(() => useExposeStore());

      act(() => {
        result.current.updateFormField('objektart', 'Wohnung');
        result.current.updateFormField('ort', 'Berlin');
        result.current.setOutput('Test Output');
        result.current.setStyle('luxus');
        result.current.addImage('image1');
      });

      act(() => {
        result.current.saveExpose();
      });

      expect(result.current.savedExposes).toHaveLength(1);
      expect(result.current.savedExposes[0].formData.objektart).toBe('Wohnung');
      expect(result.current.savedExposes[0].output).toBe('Test Output');
      expect(result.current.savedExposes[0].selectedStyle).toBe('luxus');
      expect(result.current.savedExposes[0].images).toHaveLength(1);
      expect(result.current.savedExposes[0].id).toBeTruthy();
      expect(result.current.savedExposes[0].createdAt).toBeTruthy();
    });

    it('should save multiple exposés', () => {
      const { result } = renderHook(() => useExposeStore());

      act(() => {
        result.current.updateFormField('ort', 'Berlin');
        result.current.saveExpose();

        result.current.updateFormField('ort', 'München');
        result.current.saveExpose();

        result.current.updateFormField('ort', 'Hamburg');
        result.current.saveExpose();
      });

      expect(result.current.savedExposes).toHaveLength(3);
      expect(result.current.savedExposes[0].formData.ort).toBe('Berlin');
      expect(result.current.savedExposes[1].formData.ort).toBe('München');
      expect(result.current.savedExposes[2].formData.ort).toBe('Hamburg');
    });

    it('should load saved exposé', () => {
      const { result } = renderHook(() => useExposeStore());

      const savedExpose: SavedExpose = {
        id: String(Date.now()),
        formData: {
          objektart: 'Einfamilienhaus',
          strasse: 'Teststraße 1',
          ort: 'Test-Stadt',
        },
        output: 'Loaded Output',
        selectedStyle: 'sachlich',
        images: ['loaded-image1', 'loaded-image2'],
        captions: ['Caption 1', 'Caption 2'],
        createdAt: new Date().toISOString(),
      };

      act(() => {
        result.current.loadExpose(savedExpose);
      });

      expect(result.current.formData.objektart).toBe('Einfamilienhaus');
      expect(result.current.formData.ort).toBe('Test-Stadt');
      expect(result.current.output).toBe('Loaded Output');
      expect(result.current.selectedStyle).toBe('sachlich');
      expect(result.current.images).toHaveLength(2);
      expect(result.current.captions).toEqual(['Caption 1', 'Caption 2']);
    });

    it('should delete exposé by index', () => {
      const { result } = renderHook(() => useExposeStore());

      act(() => {
        result.current.updateFormField('ort', 'Berlin');
        result.current.saveExpose();
        result.current.updateFormField('ort', 'München');
        result.current.saveExpose();
        result.current.updateFormField('ort', 'Hamburg');
        result.current.saveExpose();
      });

      expect(result.current.savedExposes).toHaveLength(3);

      act(() => {
        result.current.deleteExpose(1); // Delete München
      });

      expect(result.current.savedExposes).toHaveLength(2);
      expect(result.current.savedExposes[0].formData.ort).toBe('Berlin');
      expect(result.current.savedExposes[1].formData.ort).toBe('Hamburg');
    });

    it('should delete exposé by ID', () => {
      const { result } = renderHook(() => useExposeStore());

      act(() => {
        result.current.updateFormField('ort', 'Berlin');
        result.current.saveExpose();
        result.current.updateFormField('ort', 'München');
        result.current.saveExpose();
      });

      const idToDelete = result.current.savedExposes[0].id;

      act(() => {
        result.current.deleteExpose(idToDelete);
      });

      expect(result.current.savedExposes).toHaveLength(1);
      expect(result.current.savedExposes[0].formData.ort).toBe('München');
    });

    it('should clear all saved exposés', () => {
      const { result } = renderHook(() => useExposeStore());

      act(() => {
        result.current.saveExpose();
        result.current.saveExpose();
        result.current.saveExpose();
      });

      expect(result.current.savedExposes).toHaveLength(3);

      act(() => {
        result.current.clearSavedExposes();
      });

      expect(result.current.savedExposes).toHaveLength(0);
    });
  });

  describe('Reset Functions', () => {
    it('should reset form data but keep saved exposés', () => {
      const { result } = renderHook(() => useExposeStore());

      act(() => {
        result.current.updateFormField('objektart', 'Wohnung');
        result.current.updateFormField('ort', 'Berlin');
        result.current.setOutput('Test Output');
        result.current.setStyle('luxus');
        result.current.setLoading(true);
        result.current.saveExpose();
      });

      expect(result.current.formData.objektart).toBe('Wohnung');
      expect(result.current.output).toBe('Test Output');
      expect(result.current.savedExposes).toHaveLength(1);

      act(() => {
        result.current.reset();
      });

      expect(result.current.formData.objektart).toBe('');
      expect(result.current.output).toBe('');
      expect(result.current.selectedStyle).toBe('emotional');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.savedExposes).toHaveLength(1); // Not cleared
    });

    it('should reset images separately', () => {
      const { result } = renderHook(() => useExposeStore());

      act(() => {
        result.current.addImage('image1');
        result.current.addImage('image2');
        result.current.updateFormField('ort', 'Berlin');
      });

      expect(result.current.images).toHaveLength(2);

      act(() => {
        result.current.resetImages();
      });

      expect(result.current.images).toHaveLength(0);
      expect(result.current.formData.ort).toBe('Berlin'); // Not reset
    });
  });
});
