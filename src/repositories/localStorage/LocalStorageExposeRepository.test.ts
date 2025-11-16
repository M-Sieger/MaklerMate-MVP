/**
 * @fileoverview LocalStorageExposeRepository Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LocalStorageExposeRepository } from './LocalStorageExposeRepository';
import type { SavedExpose } from '../../stores/exposeStore';
import type { ExposeFormData } from '../../api/utils/validation';

describe('LocalStorageExposeRepository', () => {
  let repository: LocalStorageExposeRepository;
  let mockStorage: Record<string, string>;

  beforeEach(() => {
    // Mock localStorage
    mockStorage = {};

    global.localStorage = {
      getItem: vi.fn((key: string) => mockStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockStorage[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStorage[key];
      }),
      clear: vi.fn(() => {
        mockStorage = {};
      }),
      length: 0,
      key: vi.fn(() => null),
    };

    repository = new LocalStorageExposeRepository();
  });

  const createTestFormData = (): ExposeFormData => ({
    objektart: 'Wohnung',
    strasse: 'Teststraße 1',
    ort: 'Berlin',
    bezirk: 'Mitte',
    wohnflaeche: '75',
    zimmer: '3',
    baujahr: '2020',
    preis: '1200',
    etage: '2',
    balkonTerrasse: 'Ja',
    ausstattung: 'Modern',
    besonderheiten: 'Parkett',
  });

  describe('getAll', () => {
    it('should return empty array when no data exists', async () => {
      const exposes = await repository.getAll();
      expect(exposes).toEqual([]);
    });

    it('should return all exposes from localStorage', async () => {
      const testExposes: SavedExpose[] = [
        {
          id: '1',
          formData: createTestFormData(),
          output: 'Test output',
          selectedStyle: 'emotional',
          images: [],
          captions: [],
          createdAt: '2025-01-01T00:00:00Z',
        },
      ];

      mockStorage['maklermate_exposes'] = JSON.stringify(testExposes);

      const exposes = await repository.getAll();
      expect(exposes).toEqual(testExposes);
    });

    it('should handle invalid JSON gracefully', async () => {
      mockStorage['maklermate_exposes'] = 'invalid json';

      const exposes = await repository.getAll();
      expect(exposes).toEqual([]);
    });
  });

  describe('getById', () => {
    it('should return null when expose not found', async () => {
      const expose = await repository.getById('nonexistent');
      expect(expose).toBeNull();
    });

    it('should return expose when found', async () => {
      const testExpose: SavedExpose = {
        id: 'test-123',
        formData: createTestFormData(),
        output: 'Test output',
        selectedStyle: 'sachlich',
        images: [],
        captions: [],
        createdAt: '2025-01-01T00:00:00Z',
      };

      mockStorage['maklermate_exposes'] = JSON.stringify([testExpose]);

      const expose = await repository.getById('test-123');
      expect(expose).toEqual(testExpose);
    });
  });

  describe('create', () => {
    it('should create new expose with generated ID', async () => {
      const newExpose = await repository.create({
        formData: createTestFormData(),
        output: 'Generated text',
        selectedStyle: 'emotional',
        images: ['image1.jpg'],
        captions: ['Caption 1'],
      });

      expect(newExpose.id).toBeTruthy();
      expect(newExpose.output).toBe('Generated text');
      expect(newExpose.selectedStyle).toBe('emotional');
      expect(newExpose.createdAt).toBeTruthy();
    });

    it('should persist expose to localStorage', async () => {
      await repository.create({
        formData: createTestFormData(),
        output: 'Generated text',
        selectedStyle: 'luxus',
        images: [],
        captions: [],
      });

      const stored = JSON.parse(mockStorage['maklermate_exposes']);
      expect(stored).toHaveLength(1);
      expect(stored[0].selectedStyle).toBe('luxus');
    });
  });

  describe('update', () => {
    it('should update existing expose', async () => {
      const testExpose: SavedExpose = {
        id: 'test-123',
        formData: createTestFormData(),
        output: 'Original text',
        selectedStyle: 'emotional',
        images: [],
        captions: [],
        createdAt: '2025-01-01T00:00:00Z',
      };

      mockStorage['maklermate_exposes'] = JSON.stringify([testExpose]);

      const updated = await repository.update('test-123', { output: 'Updated text' });

      expect(updated.output).toBe('Updated text');
    });

    it('should throw error when expose not found', async () => {
      await expect(repository.update('nonexistent', { output: 'New' })).rejects.toThrow(
        'Exposé with ID nonexistent not found'
      );
    });
  });

  describe('delete', () => {
    it('should delete existing expose', async () => {
      const testExposes: SavedExpose[] = [
        {
          id: 'test-1',
          formData: createTestFormData(),
          output: 'Text 1',
          selectedStyle: 'emotional',
          images: [],
          captions: [],
          createdAt: '2025-01-01T00:00:00Z',
        },
        {
          id: 'test-2',
          formData: createTestFormData(),
          output: 'Text 2',
          selectedStyle: 'sachlich',
          images: [],
          captions: [],
          createdAt: '2025-01-02T00:00:00Z',
        },
      ];

      mockStorage['maklermate_exposes'] = JSON.stringify(testExposes);

      await repository.delete('test-1');

      const remaining = await repository.getAll();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe('test-2');
    });

    it('should throw error when expose not found', async () => {
      await expect(repository.delete('nonexistent')).rejects.toThrow(
        'Exposé with ID nonexistent not found'
      );
    });
  });

  describe('saveDraft / loadDraft', () => {
    it('should save and load draft', async () => {
      const testFormData = createTestFormData();

      await repository.saveDraft(testFormData);

      const loaded = await repository.loadDraft();
      expect(loaded).toEqual(testFormData);
    });

    it('should return null when no draft exists', async () => {
      const draft = await repository.loadDraft();
      expect(draft).toBeNull();
    });

    it('should handle invalid draft JSON gracefully', async () => {
      mockStorage['maklermate_expose_draft'] = 'invalid json';

      const draft = await repository.loadDraft();
      expect(draft).toBeNull();
    });
  });

  describe('uploadImage', () => {
    it('should convert file to Base64', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      // Mock FileReader
      const mockFileReader = {
        readAsDataURL: vi.fn(function (this: any) {
          setTimeout(() => {
            this.result = 'data:image/jpeg;base64,test';
            this.onload?.({ target: this });
          }, 0);
        }),
      };

      global.FileReader = vi.fn(() => mockFileReader) as any;

      const imageUrl = await repository.uploadImage(mockFile);

      expect(imageUrl).toBe('data:image/jpeg;base64,test');
    });

    it('should handle FileReader error', async () => {
      const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

      // Mock FileReader with error
      const mockFileReader = {
        readAsDataURL: vi.fn(function (this: any) {
          setTimeout(() => {
            this.onerror?.();
          }, 0);
        }),
      };

      global.FileReader = vi.fn(() => mockFileReader) as any;

      await expect(repository.uploadImage(mockFile)).rejects.toThrow('FileReader error');
    });
  });

  describe('deleteImage', () => {
    it('should be a no-op in LocalStorage implementation', async () => {
      // Should not throw
      await repository.deleteImage('fake-url');
    });
  });

  describe('QuotaExceededError', () => {
    it('should throw helpful error when localStorage quota exceeded', async () => {
      // Mock localStorage.setItem to throw QuotaExceededError
      global.localStorage.setItem = vi.fn(() => {
        const error = new DOMException('QuotaExceededError', 'QuotaExceededError');
        throw error;
      });

      await expect(
        repository.create({
          formData: createTestFormData(),
          output: 'Text',
          selectedStyle: 'emotional',
          images: [],
          captions: [],
        })
      ).rejects.toThrow(/LocalStorage quota exceeded/);
    });
  });
});
