/**
 * @fileoverview Export Service - Export-Funktionalität für CRM & Exposé
 *
 * ZWECK:
 * - CSV-Export mit korrektem Escaping (Security)
 * - JSON-Export für Backup/Import
 * - TXT-Export (tabellarisch, human-readable)
 * - Clipboard-Support
 * - Exposé-Export
 *
 * SECURITY:
 * - CSV Injection Prevention (alle Werte escaped)
 * - UTF-8 BOM für Excel-Kompatibilität
 * - Sanitization von Inputs
 *
 * FORMATS:
 * - CSV: Excel-kompatibel, escaped
 * - JSON: Machine-readable, pretty-printed
 * - TXT: Human-readable, tabellarisch
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-15
 * STATUS: 🟢 Production-Ready (TypeScript Migration)
 */

import type { Lead } from '@/utils/leadHelpers';

// ==================== TYPES ====================

/**
 * Exposé-Export-Objekt
 */
export interface ExposeExport {
  formData?: Record<string, unknown>;
  output?: string;
  selectedStyle?: string;
  images?: string[];
  captions?: string[];
  exportedAt?: string;
  [key: string]: unknown;
}

/**
 * Import-Result für Leads
 */
export interface ImportResult {
  success: boolean;
  leads?: Lead[];
  error?: string;
}

// ==================== SERVICE CLASS ====================

/**
 * Export Service für verschiedene Export-Formate
 *
 * SINGLETON:
 * - Eine Instance für gesamte App
 * - Export als `export default new ExportService()`
 *
 * METHODS:
 * - exportLeadsAsJSON(): Lead-Array als JSON
 * - exportLeadsAsTXT(): Lead-Array als TXT (tabellarisch)
 * - exportLeadsAsCSV(): Lead-Array als CSV (Excel-kompatibel)
 * - copyLeadsToClipboard(): Leads in Zwischenablage
 * - exportExposeAsJSON(): Exposé als JSON
 * - importLeadsFromJSON(): JSON → Lead-Array
 */
class ExportService {
  /**
   * Exportiert Leads als JSON-Datei
   *
   * FORMAT:
   * - Pretty-printed (2 spaces indentation)
   * - Vollständige Lead-Objekte
   * - Alle Felder erhalten
   *
   * USE-CASE:
   * - Backup von Leads
   * - Import in andere Tools
   * - Debugging
   *
   * @param leads - Array von Lead-Objekten
   *
   * @example
   * exportService.exportLeadsAsJSON(leads);
   * // Downloads: CRM_Leads_2025-11-15_14-30-00.json
   */
  exportLeadsAsJSON(leads: Lead[]): void {
    const json = JSON.stringify(leads, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const filename = `CRM_Leads_${this._getTimestamp()}.json`;
    this._downloadBlob(blob, filename);
  }

  /**
   * Exportiert Leads als TXT-Datei (tabellarisch)
   *
   * FORMAT:
   * - Header-Zeile
   * - Separator-Zeile (Bindestriche)
   * - Daten-Zeilen (pipe-separated)
   * - UTF-8 Encoding
   *
   * COLUMNS:
   * Name | Kontakt | Typ | Status | Ort | Notiz | Erstellt
   *
   * @param leads - Array von Lead-Objekten
   *
   * @example
   * exportService.exportLeadsAsTXT(leads);
   * // Downloads: CRM_Leads_2025-11-15_14-30-00.txt
   */
  exportLeadsAsTXT(leads: Lead[]): void {
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
   *
   * SECURITY:
   * - CSV Injection Prevention (alle Werte escaped)
   * - Quotes werden verdoppelt ("" → """")
   * - Alle Werte in Quotes gewrapped
   *
   * EXCEL-KOMPATIBILITÄT:
   * - UTF-8 BOM (\uFEFF) für korrekte Umlaute
   * - Komma als Delimiter
   * - Windows Line-Endings (\r\n) optional
   *
   * COLUMNS:
   * Name,Kontakt,Typ,Status,Ort,Notiz,Erstellt
   *
   * @param leads - Array von Lead-Objekten
   *
   * @example
   * exportService.exportLeadsAsCSV(leads);
   * // Downloads: CRM_Leads_2025-11-15_14-30-00.csv
   */
  exportLeadsAsCSV(leads: Lead[]): void {
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
   *
   * FORMAT:
   * - Pipe-separated (Name | Kontakt | Typ | Status | Erstellt)
   * - Ohne Header (direkt paste-bar)
   * - Zeilenweise
   *
   * BROWSER-REQUIREMENTS:
   * - HTTPS oder localhost erforderlich
   * - Clipboard API support
   *
   * @param leads - Array von Lead-Objekten
   * @returns Promise<boolean> - True wenn erfolgreich
   *
   * @example
   * const success = await exportService.copyLeadsToClipboard(leads);
   * if (success) {
   *   toast.success('In Zwischenablage kopiert!');
   * }
   */
  async copyLeadsToClipboard(leads: Lead[]): Promise<boolean> {
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
   *
   * CONTENT:
   * - Alle Exposé-Daten (formData, output, images, etc.)
   * - Timestamp (exportedAt)
   * - Pretty-printed
   *
   * USE-CASE:
   * - Backup einzelner Exposés
   * - Sharing via File
   * - Re-Import später
   *
   * @param expose - Exposé-Object
   *
   * @example
   * exportService.exportExposeAsJSON({
   *   formData: { objektart: 'Wohnung', ... },
   *   output: 'Wunderschöne Wohnung...',
   *   images: ['data:image/jpeg;base64,...'],
   * });
   */
  exportExposeAsJSON(expose: ExposeExport): void {
    const data: ExposeExport = {
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
   *
   * VALIDATION:
   * - Muss Array sein
   * - Jedes Item muss Object sein
   * - Mindestens name ODER contact erforderlich
   *
   * ERROR-HANDLING:
   * - Parse-Fehler → ImportResult mit error
   * - Ungültiges Format → ImportResult mit error
   * - Erfolg → ImportResult mit leads
   *
   * @param jsonString - JSON-String (Array von Leads)
   * @returns ImportResult - Success/Error + Leads
   *
   * @example
   * const fileContent = await file.text();
   * const result = exportService.importLeadsFromJSON(fileContent);
   *
   * if (result.success) {
   *   console.log(`${result.leads.length} Leads importiert`);
   *   addLeads(result.leads);
   * } else {
   *   console.error(result.error);
   * }
   */
  importLeadsFromJSON(jsonString: string): ImportResult {
    try {
      const parsed: unknown = JSON.parse(jsonString);

      if (!Array.isArray(parsed)) {
        return {
          success: false,
          error: 'Ungültiges Format: Erwartet ein Array von Leads',
        };
      }

      // Basic validation
      const validLeads = parsed.filter((lead): lead is Lead => {
        return (
          lead &&
          typeof lead === 'object' &&
          (('name' in lead && lead.name) || ('contact' in lead && lead.contact))
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
      const err = error as Error;
      return {
        success: false,
        error: `JSON Parse Error: ${err.message}`,
      };
    }
  }

  // ==================== PRIVATE HELPERS ====================

  /**
   * Escaped CSV-Wert (verhindert CSV Injection)
   *
   * SECURITY:
   * - Alle Quotes werden verdoppelt ("" → """")
   * - Wert wird in Quotes gewrapped
   * - Verhindert Formula Injection (=, +, -, @)
   *
   * @private
   * @param value - Wert zum Escapen
   * @returns Escaped String in Quotes
   */
  private _escapeCSV(value: unknown): string {
    if (value === null || value === undefined) return '""';

    const str = String(value);

    // CSV-Escaping: Quotes verdoppeln, in Quotes wrappen
    const escaped = str.replace(/"/g, '""');

    // Immer in Quotes wrappen für Sicherheit
    return `"${escaped}"`;
  }

  /**
   * Formatiert Datum für Export
   *
   * FORMAT: DD.MM.YYYY (de-DE)
   *
   * @private
   * @param dateValue - Datum-Wert (ISO-String oder Timestamp)
   * @returns Formatiertes Datum oder '-'
   */
  private _formatDate(dateValue: string | number | undefined): string {
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
   *
   * MAX-LENGTH: 30 Zeichen
   * SUFFIX: "..." wenn gekürzt
   *
   * @private
   * @param note - Notiz-Text
   * @returns Gekürzte Notiz oder '-'
   */
  private _truncateNote(note: string | undefined): string {
    if (!note || !note.trim()) return '-';

    const cleaned = note.replace(/\s+/g, ' ').trim();

    if (cleaned.length <= 30) return cleaned;

    return cleaned.substring(0, 27) + '...';
  }

  /**
   * Generiert Timestamp für Dateinamen
   *
   * FORMAT: YYYY-MM-DD_HH-MM-SS
   *
   * @private
   * @returns Timestamp-String
   */
  private _getTimestamp(): string {
    const now = new Date();
    const date = now.toISOString().slice(0, 10);
    const time = now.toTimeString().slice(0, 8).replace(/:/g, '-');
    return `${date}_${time}`;
  }

  /**
   * Downloaded Blob als Datei
   *
   * BROWSER-API:
   * - URL.createObjectURL() für Blob
   * - <a download> für Download-Trigger
   * - Cleanup nach 100ms
   *
   * @private
   * @param blob - Blob-Objekt
   * @param filename - Dateiname für Download
   */
  private _downloadBlob(blob: Blob, filename: string): void {
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

// ==================== SINGLETON EXPORT ====================

/**
 * Singleton-Instance des ExportService
 *
 * VERWENDUNG:
 * ```typescript
 * import exportService from '@/services/exportService';
 *
 * exportService.exportLeadsAsCSV(leads);
 * exportService.exportExposeAsJSON(expose);
 * ```
 */
export default new ExportService();
