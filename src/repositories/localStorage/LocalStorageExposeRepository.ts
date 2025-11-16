/**
 * @fileoverview LocalStorage Exposé Repository - LocalStorage-basierte Exposé-Persistierung
 *
 * ZWECK:
 * - Implementiert IExposeRepository für LocalStorage
 * - Ersetzt Zustand persist middleware
 * - Ermöglicht spätere Migration zu Supabase Storage
 *
 * STORAGE FORMAT:
 * - Saved Exposés Key: `maklermate_exposes`
 * - Draft Key: `maklermate_expose_draft`
 *
 * LIMITIERUNGEN:
 * - Bilder als Base64 (große Datenmenge)
 * - LocalStorage-Limit: 5-10 MB
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-16
 * STATUS: 🟢 Production-Ready
 */

import type { ExposeFormData } from '@/api/utils/validation';
import type { ExposeStyle, SavedExpose } from '@/stores/exposeStore';
import type { IExposeRepository } from '../IExposeRepository';

/**
 * LocalStorage Exposé Repository
 *
 * FEATURES:
 * - Speichert Exposés als JSON-Array in LocalStorage
 * - Draft-Management (Auto-Save)
 * - Bild-Upload (Base64)
 * - Import/Export
 *
 * VERWENDUNG:
 * ```typescript
 * const repository = new LocalStorageExposeRepository();
 * const exposes = await repository.getAll();
 * ```
 */
export class LocalStorageExposeRepository implements IExposeRepository {
  private readonly exposesKey = 'maklermate_exposes';
  private readonly draftKey = 'maklermate_expose_draft';

  // ==================== PUBLIC API ====================

  /**
   * Lädt alle gespeicherten Exposés aus LocalStorage
   */
  async getAll(userId?: string): Promise<SavedExpose[]> {
    try {
      const json = localStorage.getItem(this.exposesKey);
      if (!json) return [];

      const data = JSON.parse(json);
      if (!Array.isArray(data)) {
        console.warn('[LocalStorageExposeRepository] Invalid data format, expected array');
        return [];
      }

      return data;
    } catch (error) {
      console.error('[LocalStorageExposeRepository] Load error:', error);
      return [];
    }
  }

  /**
   * Lädt Exposé per ID
   */
  async getById(id: string, userId?: string): Promise<SavedExpose | null> {
    const exposes = await this.getAll(userId);
    return exposes.find((expose) => expose.id === id) || null;
  }

  /**
   * Erstellt neues Exposé
   */
  async create(
    expose: {
      formData: ExposeFormData;
      output: string;
      selectedStyle: ExposeStyle;
      images: string[];
      captions: string[];
    },
    userId?: string
  ): Promise<SavedExpose> {
    const exposes = await this.getAll(userId);

    const newExpose: SavedExpose = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      formData: expose.formData,
      output: expose.output,
      selectedStyle: expose.selectedStyle,
      images: expose.images,
      captions: expose.captions,
      createdAt: new Date().toISOString(),
    };

    exposes.push(newExpose);
    await this._saveAll(exposes);

    return newExpose;
  }

  /**
   * Aktualisiert Exposé
   */
  async update(id: string, patch: Partial<SavedExpose>, userId?: string): Promise<SavedExpose> {
    const exposes = await this.getAll(userId);
    const index = exposes.findIndex((expose) => expose.id === id);

    if (index === -1) {
      throw new Error(`Exposé with ID ${id} not found`);
    }

    const updatedExpose: SavedExpose = {
      ...exposes[index],
      ...patch,
    };

    exposes[index] = updatedExpose;
    await this._saveAll(exposes);

    return updatedExpose;
  }

  /**
   * Löscht Exposé
   */
  async delete(id: string, userId?: string): Promise<void> {
    const exposes = await this.getAll(userId);
    const filtered = exposes.filter((expose) => expose.id !== id);

    if (filtered.length === exposes.length) {
      throw new Error(`Exposé with ID ${id} not found`);
    }

    await this._saveAll(filtered);
  }

  /**
   * Speichert Draft (aktuelles Formular-State)
   */
  async saveDraft(formData: ExposeFormData, userId?: string): Promise<void> {
    try {
      localStorage.setItem(this.draftKey, JSON.stringify(formData));
    } catch (error) {
      console.error('[LocalStorageExposeRepository] Save draft error:', error);
      throw error;
    }
  }

  /**
   * Lädt Draft (aktuelles Formular-State)
   */
  async loadDraft(userId?: string): Promise<ExposeFormData | null> {
    try {
      const json = localStorage.getItem(this.draftKey);
      if (!json) return null;

      return JSON.parse(json);
    } catch (error) {
      console.error('[LocalStorageExposeRepository] Load draft error:', error);
      return null;
    }
  }

  /**
   * Lädt Bild hoch (Base64-Konvertierung)
   *
   * NOTE: Im MVP werden Bilder als Base64 gespeichert (LocalStorage-Limit).
   *       In v0.2.x+ werden Bilder zu Supabase Storage hochgeladen.
   */
  async uploadImage(file: File, userId?: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result); // Base64 String
        } else {
          reject(new Error('FileReader result is not a string'));
        }
      };

      reader.onerror = () => {
        reject(new Error('FileReader error'));
      };

      reader.readAsDataURL(file);
    });
  }

  /**
   * Löscht Bild
   *
   * NOTE: Im MVP ist dies ein No-Op (Base64 in JSON gespeichert).
   *       In v0.2.x+ wird das Bild aus Supabase Storage gelöscht.
   */
  async deleteImage(imageUrl: string, userId?: string): Promise<void> {
    // No-op in LocalStorage implementation
    // Bilder sind Teil des Exposé-JSON-Objects
    return Promise.resolve();
  }

  // ==================== PRIVATE HELPERS ====================

  /**
   * Speichert alle Exposés in LocalStorage
   */
  private async _saveAll(exposes: SavedExpose[]): Promise<void> {
    try {
      localStorage.setItem(this.exposesKey, JSON.stringify(exposes));
    } catch (error) {
      console.error('[LocalStorageExposeRepository] Save error:', error);

      // Check if QuotaExceededError
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        throw new Error(
          'LocalStorage quota exceeded. Try removing old exposés or use fewer images.'
        );
      }

      throw error;
    }
  }
}

/**
 * Singleton-Instanz für globale Verwendung
 */
export const localStorageExposeRepository = new LocalStorageExposeRepository();
