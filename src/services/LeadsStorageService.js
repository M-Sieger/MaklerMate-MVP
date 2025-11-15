// 💾 LeadsStorageService.js – localStorage-Handling für Leads
// ✅ Kapselt alle localStorage-Operationen
// ✅ Debounced Saves
// ✅ Cross-Tab-Sync via storage event
// ✅ Error-Handling

class LeadsStorageService {
  constructor(key = 'mm_crm_leads_v2') {
    this.key = key;
    this.timeoutId = null;
  }

  /**
   * Lädt Leads aus localStorage
   * @returns {Object[]} Array von Leads (leer wenn nicht gefunden)
   */
  load() {
    try {
      const saved = localStorage.getItem(this.key);

      if (!saved) {
        return [];
      }

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) {
        console.warn('⚠️ Gespeicherte Leads sind kein Array, returning []');
        return [];
      }

      return parsed;
    } catch (error) {
      console.error('❌ Fehler beim Laden von Leads:', error);
      return [];
    }
  }

  /**
   * Speichert Leads in localStorage (debounced)
   * @param {Object[]} leads - Array von Leads
   * @param {number} debounceMs - Debounce-Zeit in ms (default: 150)
   */
  save(leads, debounceMs = 150) {
    if (!Array.isArray(leads)) {
      console.error('❌ save() erwartet ein Array, erhalten:', typeof leads);
      return;
    }

    // Clear existing timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Debounced save
    this.timeoutId = setTimeout(() => {
      try {
        const json = JSON.stringify(leads);
        localStorage.setItem(this.key, json);

        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ ${leads.length} Leads gespeichert`);
        }
      } catch (error) {
        console.error('❌ Fehler beim Speichern von Leads:', error);

        // Quota exceeded?
        if (error.name === 'QuotaExceededError') {
          console.error('localStorage Quota exceeded!');
          // Optional: Notify user
        }
      }
    }, debounceMs);
  }

  /**
   * Sofortiges Speichern (ohne Debounce)
   * @param {Object[]} leads - Array von Leads
   */
  saveSync(leads) {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    try {
      const json = JSON.stringify(leads);
      localStorage.setItem(this.key, json);
    } catch (error) {
      console.error('❌ Fehler beim Speichern von Leads:', error);
    }
  }

  /**
   * Löscht alle Leads aus localStorage
   */
  clear() {
    try {
      localStorage.removeItem(this.key);

      if (process.env.NODE_ENV === 'development') {
        console.log('🗑️ Alle Leads gelöscht');
      }
    } catch (error) {
      console.error('❌ Fehler beim Löschen von Leads:', error);
    }
  }

  /**
   * Subscribes zu localStorage-Änderungen (Cross-Tab-Sync)
   * @param {Function} callback - Callback mit neuen Leads
   * @returns {Function} Unsubscribe-Funktion
   */
  subscribe(callback) {
    const handler = (event) => {
      // Nur auf unseren Key reagieren
      if (event.key === this.key && event.newValue) {
        try {
          const leads = JSON.parse(event.newValue);

          if (Array.isArray(leads)) {
            callback(leads);
          }
        } catch (error) {
          console.error('❌ Fehler beim Parsen von Storage-Event:', error);
        }
      }

      // Clear-Event
      if (event.key === this.key && event.newValue === null) {
        callback([]);
      }
    };

    window.addEventListener('storage', handler);

    // Return unsubscribe function
    return () => {
      window.removeEventListener('storage', handler);
    };
  }

  /**
   * Exportiert Leads als JSON-String
   * @returns {string} JSON-String
   */
  exportAsJSON() {
    const leads = this.load();
    return JSON.stringify(leads, null, 2);
  }

  /**
   * Importiert Leads aus JSON-String
   * @param {string} jsonString - JSON-String
   * @returns {{success: boolean, count?: number, error?: string}}
   */
  importFromJSON(jsonString) {
    try {
      const leads = JSON.parse(jsonString);

      if (!Array.isArray(leads)) {
        return {
          success: false,
          error: 'Ungültiges Format: Erwartet Array',
        };
      }

      this.saveSync(leads);

      return {
        success: true,
        count: leads.length,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Gibt Statistiken zurück
   * @returns {Object} Storage-Statistiken
   */
  getStats() {
    const leads = this.load();

    try {
      const json = JSON.stringify(leads);
      const sizeInBytes = new Blob([json]).size;
      const sizeInKB = (sizeInBytes / 1024).toFixed(2);

      return {
        count: leads.length,
        sizeInBytes,
        sizeInKB: `${sizeInKB} KB`,
      };
    } catch (error) {
      return {
        count: leads.length,
        sizeInBytes: 0,
        sizeInKB: '0 KB',
      };
    }
  }
}

// Singleton-Export
export default new LeadsStorageService();
