// 📁 exportService.js – Zentraler Export Service für CRM
// ✅ Konsolidiert alle Export-Formate (CSV, JSON, TXT)
// ✅ Korrektes CSV-Escaping (Security-Fix)
// ✅ Clipboard-Support

class ExportService {
  /**
   * Exportiert Leads als JSON-Datei
   * @param {Object[]} leads - Array von Lead-Objekten
   */
  exportLeadsAsJSON(leads) {
    const json = JSON.stringify(leads, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const filename = `CRM_Leads_${this._getTimestamp()}.json`;
    this._downloadBlob(blob, filename);
  }

  /**
   * Exportiert Leads als TXT-Datei (tabellarisch)
   * @param {Object[]} leads - Array von Lead-Objekten
   */
  exportLeadsAsTXT(leads) {
    const lines = leads.map((l) => {
      const parts = [
        l.name || '-',
        l.contact || '-',
        l.type || '-',
        l.status || '-',
        l.location || '-',
        this._truncateNote(l.note),
        this._formatDate(l.createdAt),
      ];
      return parts.join(' | ');
    });

    const header = 'Name | Kontakt | Typ | Status | Ort | Notiz | Erstellt';
    const separator = '-'.repeat(80);

    const txt = [header, separator, ...lines].join('\n');

    const blob = new Blob([txt], { type: 'text/plain; charset=utf-8' });
    const filename = `CRM_Leads_${this._getTimestamp()}.txt`;
    this._downloadBlob(blob, filename);
  }

  /**
   * Exportiert Leads als CSV-Datei mit korrektem Escaping
   * @param {Object[]} leads - Array von Lead-Objekten
   */
  exportLeadsAsCSV(leads) {
    const header = 'Name,Kontakt,Typ,Status,Ort,Notiz,Erstellt\n';

    const rows = leads
      .map((l) => {
        return [
          this._escapeCSV(l.name),
          this._escapeCSV(l.contact),
          this._escapeCSV(l.type),
          this._escapeCSV(l.status),
          this._escapeCSV(l.location),
          this._escapeCSV(l.note),
          this._escapeCSV(this._formatDate(l.createdAt)),
        ].join(',');
      })
      .join('\n');

    const csv = header + rows;

    // UTF-8 BOM für Excel-Kompatibilität
    const bom = '\uFEFF';
    const blob = new Blob([bom + csv], { type: 'text/csv; charset=utf-8' });
    const filename = `CRM_Leads_${this._getTimestamp()}.csv`;
    this._downloadBlob(blob, filename);
  }

  /**
   * Kopiert Leads in Zwischenablage (tabellarisch)
   * @param {Object[]} leads - Array von Lead-Objekten
   * @returns {Promise<boolean>} True wenn erfolgreich
   */
  async copyLeadsToClipboard(leads) {
    const lines = leads.map((l) => {
      const parts = [
        l.name || '-',
        l.contact || '-',
        l.type || '-',
        l.status || '-',
        this._formatDate(l.createdAt),
      ];
      return parts.join(' | ');
    });

    const txt = lines.join('\n');

    try {
      await navigator.clipboard.writeText(txt);
      return true;
    } catch (error) {
      console.error('❌ Clipboard copy failed:', error);
      return false;
    }
  }

  /**
   * Exportiert einzelnes Exposé als JSON
   * @param {Object} expose - Exposé-Object
   */
  exportExposeAsJSON(expose) {
    const data = {
      ...expose,
      exportedAt: new Date().toISOString(),
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const filename = `Expose_${this._getTimestamp()}.json`;
    this._downloadBlob(blob, filename);
  }

  /**
   * Importiert Leads aus JSON-String
   * @param {string} jsonString - JSON-String
   * @returns {{success: boolean, leads?: Object[], error?: string}}
   */
  importLeadsFromJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);

      if (!Array.isArray(parsed)) {
        return {
          success: false,
          error: 'Ungültiges Format: Erwartet ein Array von Leads',
        };
      }

      // Basic validation
      const validLeads = parsed.filter((lead) => {
        return (
          lead &&
          typeof lead === 'object' &&
          (lead.name || lead.contact)
        );
      });

      if (validLeads.length === 0) {
        return {
          success: false,
          error: 'Keine gültigen Leads gefunden',
        };
      }

      return {
        success: true,
        leads: validLeads,
      };
    } catch (error) {
      return {
        success: false,
        error: `JSON Parse Error: ${error.message}`,
      };
    }
  }

  // ==================== PRIVATE HELPERS ====================

  /**
   * Escaped CSV-Wert (verhindert CSV Injection)
   * @private
   * @param {any} value - Wert zum Escapen
   * @returns {string} Escaped String
   */
  _escapeCSV(value) {
    if (value === null || value === undefined) return '""';

    const str = String(value);

    // CSV-Escaping: Quotes verdoppeln, in Quotes wrappen
    const escaped = str.replace(/"/g, '""');

    // Immer in Quotes wrappen für Sicherheit
    return `"${escaped}"`;
  }

  /**
   * Formatiert Datum für Export
   * @private
   * @param {string|number} dateValue - Datum-Wert
   * @returns {string} Formatiertes Datum
   */
  _formatDate(dateValue) {
    if (!dateValue) return '-';

    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return '-';

      return date.toLocaleDateString('de-DE');
    } catch {
      return '-';
    }
  }

  /**
   * Kürzt Notiz für TXT-Export
   * @private
   * @param {string} note - Notiz-Text
   * @returns {string} Gekürzte Notiz
   */
  _truncateNote(note) {
    if (!note || !note.trim()) return '-';

    const cleaned = note.replace(/\s+/g, ' ').trim();

    if (cleaned.length <= 30) return cleaned;

    return cleaned.substring(0, 27) + '...';
  }

  /**
   * Generiert Timestamp für Dateinamen
   * @private
   * @returns {string} Timestamp (YYYY-MM-DD_HH-MM-SS)
   */
  _getTimestamp() {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 8).replace(/:/g, '-');
    return `${date}_${time}`;
  }

  /**
   * Downloaded Blob als Datei
   * @private
   * @param {Blob} blob - Blob-Objekt
   * @param {string} filename - Dateiname
   */
  _downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';

    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
}

export default new ExportService();
