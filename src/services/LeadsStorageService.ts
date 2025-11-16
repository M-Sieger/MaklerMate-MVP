/**
 * @fileoverview Leads Storage Service - LocalStorage-Verwaltung für Leads
 *
 * ZWECK:
 * - Leads in Browser-LocalStorage speichern (persistente Speicherung)
 * - Automatisches Laden/Speichern
 * - Debounced Saves (150ms default) → Performance
 * - Cross-Tab Synchronization (storage event)
 *
 * FEATURES:
 * - Type-Safe Storage Operations
 * - Subscription System für Storage-Updates
 * - Import/Export als JSON
 * - Storage-Statistiken (Größe, Anzahl)
 *
 * SYNCHRONIZATION:
 * - localStorage.setItem() → storage event → andere Tabs
 * - subscribe() für Callbacks bei Storage-Changes
 * - Cross-Tab-Sync: Automatisch via Browser-Events
 *
 * ⚠️ DEPRECATION NOTE:
 * Dieser Service ist REDUNDANT zu crmStore (Zustand persist middleware).
 * Beide speichern Leads in LocalStorage, was zu Inkonsistenzen führen kann.
 *
 * MIGRATION-PLAN:
 *   1. Phase 1: Konsolidierung
 *      - Entferne LeadsStorageService
 *      - Nutze nur crmStore (Zustand persist)
 *
 *   2. Phase 2: Repository Pattern (v0.2.x)
 *      - Extrahiere Persistierung aus crmStore
 *      - Implementiere ILeadRepository (siehe src/repositories/ILeadRepository.ts)
 *      - LocalStorageLeadRepository als Übergangs-Implementierung
 *      - SupabaseLeadRepository als finale Implementierung
 *
 * Siehe: docs/architecture/STORAGE-ABSTRACTION.md
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-16
 * STATUS: ⚠️ Legacy/Redundant (zu konsolidieren)
 */

import { Lead, migrateLead } from '@/utils/leadHelpers';

// ==================== TYPES ====================

/**
 * Storage-Statistiken
 */
export interface StorageStats {
  /** Anzahl gespeicherter Leads */
  count: number;

  /** Größe in Bytes */
  sizeInBytes: number;

  /** Größe in KB (gerundet) */
  sizeInKB: number;
}

/**
 * Storage-Update-Callback
 */
export type StorageUpdateCallback = (leads: Lead[]) => void;

// ==================== SERVICE CLASS ====================

/**
 * Leads-Storage-Service (Singleton)
 *
 * FEATURES:
 * - Speichert Leads in localStorage
 * - Debounced Saves (150ms default)
 * - Cross-Tab-Sync via storage events
 * - Subscribe-System für Updates
 * - Import/Export-Funktionalität
 *
 * USE-CASES:
 * - Leads persistent speichern
 * - Leads über Tabs synchronisieren
 * - Storage-Größe überwachen
 * - Backup/Restore via Export/Import
 *
 * @example
 * // Speichern
 * leadsStorageService.save(leads);
 *
 * @example
 * // Laden
 * const leads = leadsStorageService.load();
 *
 * @example
 * // Subscribe
 * leadsStorageService.subscribe((leads) => {
 *   console.log('Storage updated:', leads.length);
 * });
 */
class LeadsStorageService {
  private readonly storageKey: string;
  private debounceTimer: NodeJS.Timeout | null = null;
  private subscribers: Set<StorageUpdateCallback> = new Set();

  /**
   * Erstellt einen neuen Storage-Service
   *
   * @param storageKey - LocalStorage-Key (default: 'maklermate_leads')
   */
  constructor(storageKey: string = 'maklermate_leads') {
    this.storageKey = storageKey;
    this._initStorageListener();
  }

  // ==================== PUBLIC API ====================

  /**
   * Lädt Leads aus localStorage
   *
   * FEATURES:
   * - Parst JSON
   * - Normalisiert Leads (Migration v1 → v2)
   * - Fehlerbehandlung (return [] bei Error)
   *
   * @returns Array von Leads (leer wenn keine gespeichert oder Error)
   */
  load(): Lead[] {
    try {
      const json = localStorage.getItem(this.storageKey);
      if (!json) return [];

      const parsed = JSON.parse(json);

      // Sicherstellen dass Array
      if (!Array.isArray(parsed)) {
        console.warn('[LeadsStorage] Invalid data format, expected array');
        return [];
      }

      // Normalisiere alle Leads (Migration v1 → v2)
      return parsed.map(migrateLead);
    } catch (error) {
      console.error('[LeadsStorage] Load error:', error);
      return [];
    }
  }

  /**
   * Speichert Leads in localStorage (Debounced)
   *
   * FEATURES:
   * - Debounce (default: 150ms) → Performance bei vielen Saves
   * - Normalisiert Leads vor dem Speichern
   * - Notifiziert Subscribers nach erfolgreichem Save
   *
   * DEBOUNCE:
   * - Wartet 150ms nach letztem save() Call
   * - Verhindert zu viele setItem() Calls
   * - Beispiel: 10 saves in 50ms → nur 1 setItem()
   *
   * @param leads - Array von Leads zum Speichern
   * @param debounceMs - Debounce-Zeit in ms (default: 150)
   */
  save(leads: Lead[], debounceMs: number = 150): void {
    // Clear vorheriger Timer
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Setze neuen Timer
    this.debounceTimer = setTimeout(() => {
      try {
        // Normalisiere alle Leads
        const normalized = leads.map(migrateLead);

        // Speichere als JSON
        const json = JSON.stringify(normalized);
        localStorage.setItem(this.storageKey, json);

        // Notifiziere Subscribers (NICHT bei storage event, nur bei direktem save)
        this._notifySubscribers(normalized);
      } catch (error) {
        console.error('[LeadsStorage] Save error:', error);
      }
    }, debounceMs);
  }

  /**
   * Löscht alle Leads aus localStorage
   *
   * VERWENDUNG:
   * - Reset-Funktion
   * - Cleanup bei Logout
   */
  clear(): void {
    try {
      localStorage.removeItem(this.storageKey);
      this._notifySubscribers([]);
    } catch (error) {
      console.error('[LeadsStorage] Clear error:', error);
    }
  }

  /**
   * Gibt Storage-Statistiken zurück
   *
   * METRICS:
   * - Anzahl Leads
   * - Größe in Bytes
   * - Größe in KB
   *
   * @returns Storage-Statistiken
   */
  getStats(): StorageStats {
    const leads = this.load();
    const json = JSON.stringify(leads);
    const sizeInBytes = new Blob([json]).size;

    return {
      count: leads.length,
      sizeInBytes,
      sizeInKB: Math.round(sizeInBytes / 1024),
    };
  }

  // ==================== SUBSCRIPTION SYSTEM ====================

  /**
   * Registriert Callback für Storage-Updates
   *
   * EVENTS:
   * - Storage-Event (andere Tabs)
   * - Direktes save() (gleicher Tab)
   *
   * @param callback - Callback-Funktion
   * @returns Unsubscribe-Funktion
   *
   * @example
   * const unsubscribe = leadsStorageService.subscribe((leads) => {
   *   console.log('Updated:', leads.length);
   * });
   *
   * // Später: Unsubscribe
   * unsubscribe();
   */
  subscribe(callback: StorageUpdateCallback): () => void {
    this.subscribers.add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.delete(callback);
    };
  }

  /**
   * Entfernt alle Subscriber
   */
  clearSubscribers(): void {
    this.subscribers.clear();
  }

  // ==================== IMPORT / EXPORT ====================

  /**
   * Exportiert Leads als JSON-String
   *
   * VERWENDUNG:
   * - Backup erstellen
   * - Leads an andere App senden
   *
   * @param leads - Leads zum Exportieren (optional, lädt aus Storage wenn nicht angegeben)
   * @returns JSON-String
   */
  exportAsJSON(leads?: Lead[]): string {
    const leadsToExport = leads || this.load();
    return JSON.stringify(leadsToExport, null, 2);
  }

  /**
   * Importiert Leads aus JSON-String
   *
   * FEATURES:
   * - Validierung (Array-Check)
   * - Normalisierung (v1 → v2)
   * - Fehlerbehandlung
   *
   * @param jsonString - JSON-String mit Leads
   * @returns Importierte Leads oder null bei Fehler
   */
  importFromJSON(jsonString: string): Lead[] | null {
    try {
      const parsed = JSON.parse(jsonString);

      if (!Array.isArray(parsed)) {
        console.error('[LeadsStorage] Import error: Not an array');
        return null;
      }

      // Normalisiere alle importierten Leads
      return parsed.map(migrateLead);
    } catch (error) {
      console.error('[LeadsStorage] Import error:', error);
      return null;
    }
  }

  // ==================== PRIVATE METHODS ====================

  /**
   * Initialisiert Storage-Event-Listener für Cross-Tab-Sync
   *
   * CROSS-TAB-SYNC:
   * - Tab 1: localStorage.setItem() → storage event
   * - Tab 2: storage event → _handleStorageEvent() → notify subscribers
   *
   * WICHTIG:
   * - storage event wird nur in ANDEREN Tabs gefeuert
   * - Im gleichen Tab: Direkt via _notifySubscribers()
   */
  private _initStorageListener(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('storage', this._handleStorageEvent);
  }

  /**
   * Handler für Storage-Events (Cross-Tab-Sync)
   *
   * @param event - Storage-Event
   */
  private _handleStorageEvent = (event: StorageEvent): void => {
    // Nur auf unseren Key reagieren
    if (event.key !== this.storageKey) return;

    // Lade neue Leads
    const leads = this.load();

    // Notifiziere Subscribers
    this._notifySubscribers(leads);
  };

  /**
   * Notifiziert alle Subscribers über Storage-Update
   *
   * @param leads - Aktualisierte Leads
   */
  private _notifySubscribers(leads: Lead[]): void {
    this.subscribers.forEach((callback) => {
      try {
        callback(leads);
      } catch (error) {
        console.error('[LeadsStorage] Subscriber error:', error);
      }
    });
  }

  /**
   * Cleanup (entfernt Event-Listener)
   *
   * VERWENDUNG:
   * - Bei Component-Unmount
   * - Bei Service-Shutdown
   */
  destroy(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this._handleStorageEvent);
    }

    this.clearSubscribers();
  }
}

// ==================== EXPORTS ====================

/**
 * Singleton-Instanz für globale Verwendung
 */
export default new LeadsStorageService();

/**
 * Export class for testing purposes
 */
export { LeadsStorageService };
