/**
 * @fileoverview Lead Repository Interface - Abstraction for Lead Persistence
 *
 * ZWECK:
 * - Abstrahiere Persistierungs-Logik (LocalStorage, Supabase, API)
 * - Ermögliche einfachen Austausch der Implementierung
 * - Vereinfache Testing (Mock-Repository)
 *
 * IMPLEMENTIERUNGEN:
 * - LocalStorageLeadRepository (aktuell, MVP)
 * - SupabaseLeadRepository (geplant, v0.2.x)
 * - APILeadRepository (geplant, v0.3.x)
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-16
 * STATUS: 🔧 In Preparation (SaaS Integration)
 */

import type { Lead } from '@/utils/leadHelpers';

/**
 * Lead Repository Interface
 *
 * FEATURES:
 * - CRUD Operations für Leads
 * - User-Isolation (userId Parameter)
 * - Async API (für spätere Backend-Integration)
 *
 * VERWENDUNG:
 * ```typescript
 * const repository: ILeadRepository = new LocalStorageLeadRepository();
 * const leads = await repository.getAll(userId);
 * ```
 *
 * NOTE: This interface is designed for future SaaS integration.
 *       In the MVP, userId is optional (all data in LocalStorage).
 *       In v0.2.x+, userId will be required (Supabase RLS).
 */
export interface ILeadRepository {
  /**
   * Alle Leads für einen User laden
   *
   * @param userId - User ID (optional im MVP, required in v0.2.x+)
   * @returns Promise<Lead[]>
   */
  getAll(userId?: string): Promise<Lead[]>;

  /**
   * Lead per ID laden
   *
   * @param id - Lead ID
   * @param userId - User ID (optional im MVP, required in v0.2.x+)
   * @returns Promise<Lead | null> - null wenn nicht gefunden
   */
  getById(id: string, userId?: string): Promise<Lead | null>;

  /**
   * Neuen Lead erstellen
   *
   * @param lead - Lead-Daten (ohne id, createdAt, updatedAt)
   * @param userId - User ID (optional im MVP, required in v0.2.x+)
   * @returns Promise<Lead> - Erstellter Lead mit ID
   */
  create(lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | '_v'>, userId?: string): Promise<Lead>;

  /**
   * Lead aktualisieren
   *
   * @param id - Lead ID
   * @param patch - Zu aktualisierende Felder
   * @param userId - User ID (optional im MVP, required in v0.2.x+)
   * @returns Promise<Lead> - Aktualisierter Lead
   * @throws Error wenn Lead nicht gefunden oder keine Berechtigung
   */
  update(id: string, patch: Partial<Lead>, userId?: string): Promise<Lead>;

  /**
   * Lead löschen
   *
   * @param id - Lead ID
   * @param userId - User ID (optional im MVP, required in v0.2.x+)
   * @returns Promise<void>
   * @throws Error wenn Lead nicht gefunden oder keine Berechtigung
   */
  delete(id: string, userId?: string): Promise<void>;

  /**
   * Mehrere Leads löschen
   *
   * @param ids - Lead IDs
   * @param userId - User ID (optional im MVP, required in v0.2.x+)
   * @returns Promise<void>
   */
  deleteMany(ids: string[], userId?: string): Promise<void>;

  /**
   * Alle Leads als JSON exportieren
   *
   * @param userId - User ID (optional im MVP, required in v0.2.x+)
   * @returns Promise<string> - JSON-String
   */
  exportAsJSON(userId?: string): Promise<string>;

  /**
   * Leads aus JSON importieren
   *
   * @param json - JSON-String mit Leads
   * @param userId - User ID (optional im MVP, required in v0.2.x+)
   * @returns Promise<number> - Anzahl importierter Leads
   * @throws Error bei ungültigem JSON
   */
  importFromJSON(json: string, userId?: string): Promise<number>;
}

/**
 * Factory-Funktion für Repository-Erstellung
 *
 * NOTE: In v0.2.x+ wird diese Funktion basierend auf Feature-Flags
 *       entscheiden, welche Implementierung verwendet wird:
 *       - LocalStorageLeadRepository (Offline-First, Fallback)
 *       - SupabaseLeadRepository (Cloud-Sync, Multi-Device)
 *
 * @example
 * ```typescript
 * const repository = createLeadRepository();
 * const leads = await repository.getAll(userId);
 * ```
 */
export function createLeadRepository(): ILeadRepository {
  // TODO (v0.2.x): Implement feature flag logic
  // if (featureFlags.useSupabase) {
  //   return new SupabaseLeadRepository();
  // }
  // return new LocalStorageLeadRepository();

  throw new Error('createLeadRepository() not yet implemented. Use LocalStorageLeadRepository directly.');
}
