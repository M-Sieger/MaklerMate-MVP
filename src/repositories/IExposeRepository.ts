/**
 * @fileoverview Exposé Repository Interface - Abstraction for Exposé Persistence
 *
 * ZWECK:
 * - Abstrahiere Persistierungs-Logik (LocalStorage, Supabase, API)
 * - Ermögliche einfachen Austausch der Implementierung
 * - Vereinfache Testing (Mock-Repository)
 *
 * IMPLEMENTIERUNGEN:
 * - LocalStorageExposeRepository (aktuell, MVP)
 * - SupabaseExposeRepository (geplant, v0.2.x)
 * - APIExposeRepository (geplant, v0.3.x)
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-16
 * STATUS: 🔧 In Preparation (SaaS Integration)
 */

import type { ExposeFormData } from '@/api/utils/validation';
import type { ExposeStyle, SavedExpose } from '@/stores/exposeStore';

/**
 * Exposé Repository Interface
 *
 * FEATURES:
 * - CRUD Operations für Exposés
 * - User-Isolation (userId Parameter)
 * - Bild-Management (Upload, Speichern, Löschen)
 * - Async API (für spätere Backend-Integration)
 *
 * VERWENDUNG:
 * ```typescript
 * const repository: IExposeRepository = new LocalStorageExposeRepository();
 * const exposes = await repository.getAll(userId);
 * ```
 *
 * NOTE: This interface is designed for future SaaS integration.
 *       In the MVP, userId is optional (all data in LocalStorage).
 *       In v0.2.x+, userId will be required (Supabase RLS).
 */
export interface IExposeRepository {
  /**
   * Alle gespeicherten Exposés für einen User laden
   *
   * @param userId - User ID (optional im MVP, required in v0.2.x+)
   * @returns Promise<SavedExpose[]>
   */
  getAll(userId?: string): Promise<SavedExpose[]>;

  /**
   * Exposé per ID laden
   *
   * @param id - Exposé ID
   * @param userId - User ID (optional im MVP, required in v0.2.x+)
   * @returns Promise<SavedExpose | null> - null wenn nicht gefunden
   */
  getById(id: string, userId?: string): Promise<SavedExpose | null>;

  /**
   * Neues Exposé speichern
   *
   * @param expose - Exposé-Daten
   * @param userId - User ID (optional im MVP, required in v0.2.x+)
   * @returns Promise<SavedExpose> - Gespeichertes Exposé mit ID
   */
  create(
    expose: {
      formData: ExposeFormData;
      output: string;
      selectedStyle: ExposeStyle;
      images: string[];
      captions: string[];
    },
    userId?: string
  ): Promise<SavedExpose>;

  /**
   * Exposé aktualisieren
   *
   * @param id - Exposé ID
   * @param patch - Zu aktualisierende Felder
   * @param userId - User ID (optional im MVP, required in v0.2.x+)
   * @returns Promise<SavedExpose> - Aktualisiertes Exposé
   * @throws Error wenn Exposé nicht gefunden oder keine Berechtigung
   */
  update(id: string, patch: Partial<SavedExpose>, userId?: string): Promise<SavedExpose>;

  /**
   * Exposé löschen
   *
   * @param id - Exposé ID
   * @param userId - User ID (optional im MVP, required in v0.2.x+)
   * @returns Promise<void>
   * @throws Error wenn Exposé nicht gefunden oder keine Berechtigung
   */
  delete(id: string, userId?: string): Promise<void>;

  /**
   * Aktuelles Formular-State speichern (Draft)
   *
   * NOTE: Im MVP wird dies nicht verwendet (Zustand persist direkt).
   *       In v0.2.x+ kann dies für Auto-Save genutzt werden.
   *
   * @param formData - Formular-Daten
   * @param userId - User ID (optional im MVP, required in v0.2.x+)
   * @returns Promise<void>
   */
  saveDraft(formData: ExposeFormData, userId?: string): Promise<void>;

  /**
   * Gespeichertes Formular-State laden (Draft)
   *
   * @param userId - User ID (optional im MVP, required in v0.2.x+)
   * @returns Promise<ExposeFormData | null> - null wenn kein Draft existiert
   */
  loadDraft(userId?: string): Promise<ExposeFormData | null>;

  /**
   * Bild hochladen und URL zurückgeben
   *
   * NOTE: Im MVP werden Bilder als Base64 gespeichert (LocalStorage).
   *       In v0.2.x+ werden Bilder zu Supabase Storage hochgeladen.
   *
   * @param file - Bild-Datei
   * @param userId - User ID (optional im MVP, required in v0.2.x+)
   * @returns Promise<string> - Bild-URL (Base64 oder Storage-URL)
   */
  uploadImage(file: File, userId?: string): Promise<string>;

  /**
   * Bild löschen
   *
   * NOTE: Im MVP ist dies ein No-Op (Base64 in JSON gespeichert).
   *       In v0.2.x+ wird das Bild aus Supabase Storage gelöscht.
   *
   * @param imageUrl - Bild-URL
   * @param userId - User ID (optional im MVP, required in v0.2.x+)
   * @returns Promise<void>
   */
  deleteImage(imageUrl: string, userId?: string): Promise<void>;
}

/**
 * Factory-Funktion für Repository-Erstellung
 *
 * NOTE: In v0.2.x+ wird diese Funktion basierend auf Feature-Flags
 *       entscheiden, welche Implementierung verwendet wird:
 *       - LocalStorageExposeRepository (Offline-First, Fallback)
 *       - SupabaseExposeRepository (Cloud-Sync, Multi-Device)
 *
 * @example
 * ```typescript
 * const repository = createExposeRepository();
 * const exposes = await repository.getAll(userId);
 * ```
 */
export function createExposeRepository(): IExposeRepository {
  // TODO (v0.2.x): Implement feature flag logic
  // if (featureFlags.useSupabase) {
  //   return new SupabaseExposeRepository();
  // }
  // return new LocalStorageExposeRepository();

  throw new Error('createExposeRepository() not yet implemented. Use LocalStorageExposeRepository directly.');
}
