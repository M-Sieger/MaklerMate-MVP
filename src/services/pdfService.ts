/**
 * @fileoverview PDF Service - Zentraler PDF-Export Service
 *
 * ZWECK:
 * - Exposé-PDF mit Text + Bildern
 * - Leads-PDF mit Tabelle (autoTable)
 * - Konsolidiert alle PDF-Export-Funktionen
 * - Optimiert (kein html2canvas, nur jsPDF)
 *
 * FEATURES:
 * - Multi-Page Support (automatischer Seitenumbruch)
 * - Bild-Integration (Base64)
 * - Caption-Support für Bilder
 * - Tabellen-Export via jspdf-autotable
 * - Automatische Dateinamen-Generierung
 *
 * DEPENDENCIES:
 * - jsPDF: PDF-Erstellung
 * - jspdf-autotable: Tabellen-Support
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-15
 * STATUS: 🟢 Production-Ready (TypeScript Migration)
 */

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { Lead } from '@/utils/leadHelpers';
import type { ExposeFormData } from '@/api/utils/validation';

// Extend jsPDF with autoTable (TypeScript augmentation)
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: AutoTableOptions) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

// ==================== TYPES ====================

/**
 * jsPDF autoTable Options
 */
interface AutoTableOptions {
  head?: string[][];
  body?: string[][];
  startY?: number;
  styles?: {
    fontSize?: number;
    cellPadding?: number;
  };
  headStyles?: {
    fillColor?: number[];
    textColor?: number[];
    fontStyle?: string;
  };
  alternateRowStyles?: {
    fillColor?: number[];
  };
  margin?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
}

// ==================== SERVICE CLASS ====================

/**
 * PDF Service für PDF-Export-Funktionalität
 *
 * SINGLETON:
 * - Eine Instance für gesamte App
 * - Export als `export default new PDFService()`
 *
 * METHODS:
 * - exportExposeAsPDF(): Exposé mit Text + Bildern
 * - exportLeadsAsPDF(): Lead-Tabelle
 * - _truncate(): Text kürzen (private)
 */
class PDFService {
  /**
   * Exportiert Immobilien-Exposé als PDF
   *
   * CONTENT:
   * - Header: "Immobilien-Exposé"
   * - Adresse (Straße, Ort, Bezirk)
   * - Objektart
   * - Eckdaten (Wohnfläche, Zimmer, Baujahr, etc.)
   * - Exposé-Text (GPT-generiert)
   * - Ausstattung (optional)
   * - Besonderheiten (optional)
   * - Bilder mit Captions (optional)
   *
   * LAYOUT:
   * - A4 Portrait
   * - Auto-Pagination bei Überlauf
   * - Bilder zentriert, 120x80mm
   * - Margins: 15mm
   *
   * @param formData - Formular-Daten
   * @param output - Generierter Exposé-Text
   * @param images - Base64-Image-Strings (data:image/jpeg;base64,...)
   * @param captions - Bild-Unterschriften
   *
   * @example
   * pdfService.exportExposeAsPDF(
   *   formData,
   *   'Wunderschöne 3-Zimmer-Wohnung...',
   *   ['data:image/jpeg;base64,...'],
   *   ['Wohnzimmer mit Blick auf den Park']
   * );
   */
  exportExposeAsPDF(
    formData: ExposeFormData,
    output: string,
    images: string[] = [],
    captions: string[] = []
  ): void {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    let currentY = 20;

    // ==================== HEADER ====================
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Immobilien-Exposé', 15, currentY);

    currentY += 10;

    // ==================== ADRESSE ====================
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    const address = `${formData.strasse || ''}, ${formData.ort || ''}${formData.bezirk ? `, ${formData.bezirk}` : ''}`.trim();
    pdf.text(address, 15, currentY);

    currentY += 10;

    // ==================== OBJEKTART ====================
    if (formData.objektart) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(formData.objektart, 15, currentY);
      currentY += 8;
    }

    // ==================== ECKDATEN ====================
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');

    const eckdaten: string[] = [];
    if (formData.wohnflaeche)
      eckdaten.push(`Wohnfläche: ${formData.wohnflaeche} m²`);
    if (formData.zimmer) eckdaten.push(`Zimmer: ${formData.zimmer}`);
    if (formData.baujahr) eckdaten.push(`Baujahr: ${formData.baujahr}`);
    if (formData.etage) eckdaten.push(`Etage: ${formData.etage}`);
    if (formData.balkonTerrasse)
      eckdaten.push(`Balkon/Terrasse: ${formData.balkonTerrasse}`);
    if (formData.preis) eckdaten.push(`Preis: ${formData.preis}`);

    eckdaten.forEach((item) => {
      pdf.text(`• ${item}`, 15, currentY);
      currentY += 5;
    });

    currentY += 5;

    // ==================== EXPOSÉ-TEXT ====================
    if (output && output.trim()) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const margins = 15;
      const maxWidth = pageWidth - 2 * margins;

      const lines = pdf.splitTextToSize(output, maxWidth);

      lines.forEach((line) => {
        if (currentY > 270) {
          pdf.addPage();
          currentY = 20;
        }
        pdf.text(line, margins, currentY);
        currentY += 5;
      });

      currentY += 10;
    }

    // ==================== AUSSTATTUNG ====================
    if (formData.ausstattung && String(formData.ausstattung).trim()) {
      if (currentY > 250) {
        pdf.addPage();
        currentY = 20;
      }

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Ausstattung:', 15, currentY);
      currentY += 7;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const ausstattungLines = pdf.splitTextToSize(
        String(formData.ausstattung),
        180
      );
      ausstattungLines.forEach((line) => {
        if (currentY > 270) {
          pdf.addPage();
          currentY = 20;
        }
        pdf.text(line, 15, currentY);
        currentY += 5;
      });

      currentY += 10;
    }

    // ==================== BESONDERHEITEN ====================
    if (formData.besonderheiten && String(formData.besonderheiten).trim()) {
      if (currentY > 250) {
        pdf.addPage();
        currentY = 20;
      }

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Besonderheiten:', 15, currentY);
      currentY += 7;

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const besonderheitenLines = pdf.splitTextToSize(
        String(formData.besonderheiten),
        180
      );
      besonderheitenLines.forEach((line) => {
        if (currentY > 270) {
          pdf.addPage();
          currentY = 20;
        }
        pdf.text(line, 15, currentY);
        currentY += 5;
      });

      currentY += 10;
    }

    // ==================== BILDER ====================
    if (images && images.length > 0) {
      images.forEach((imgData, idx) => {
        // Nur data:image URLs verarbeiten
        if (
          !imgData ||
          typeof imgData !== 'string' ||
          !imgData.startsWith('data:image')
        ) {
          return;
        }

        const imgWidth = 120;
        const imgHeight = 80;

        // Neue Seite wenn nicht genug Platz
        if (currentY + imgHeight > 270) {
          pdf.addPage();
          currentY = 20;
        }

        try {
          // Bild zentrieren
          const xOffset = (pdf.internal.pageSize.getWidth() - imgWidth) / 2;

          pdf.addImage(imgData, 'JPEG', xOffset, currentY, imgWidth, imgHeight);
          currentY += imgHeight + 5;

          // Caption wenn vorhanden
          const caption =
            captions && captions[idx] ? captions[idx].trim() : '';
          if (caption) {
            pdf.setFontSize(9);
            pdf.setFont('helvetica', 'italic');
            const captionLines = pdf.splitTextToSize(caption, imgWidth);
            captionLines.forEach((line) => {
              pdf.text(line, xOffset, currentY);
              currentY += 4;
            });
          }

          currentY += 10;
        } catch (error) {
          console.error('❌ Fehler beim Hinzufügen von Bild:', error);
        }
      });
    }

    // ==================== DOWNLOAD ====================
    const filename = `Expose_${(formData.strasse || 'Immobilie').replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    pdf.save(filename);
  }

  /**
   * Exportiert CRM-Leads als PDF-Tabelle
   *
   * CONTENT:
   * - Header: "CRM Leads"
   * - Timestamp
   * - Tabelle mit allen Leads
   * - Footer mit Anzahl
   *
   * LAYOUT:
   * - A4 Landscape (für mehr Spalten)
   * - Auto-Pagination
   * - Alternierende Zeilen-Farben
   * - Header-Zeile farbig (blau)
   *
   * COLUMNS:
   * - Name, Kontakt, Typ, Status, Ort, Notiz (gekürzt), Erstellt
   *
   * @param leads - Array von Lead-Objekten
   *
   * @example
   * pdfService.exportLeadsAsPDF([
   *   { name: 'Max Müller', contact: 'max@example.com', ... },
   *   { name: 'Anna Schmidt', contact: '+49 123 456', ... },
   * ]);
   */
  exportLeadsAsPDF(leads: Lead[]): void {
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Header
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CRM Leads', 15, 15);

    // Timestamp
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const timestamp = new Date().toLocaleString('de-DE');
    pdf.text(`Exportiert am: ${timestamp}`, 15, 22);

    // Tabellen-Daten vorbereiten
    const tableData = leads.map((lead) => [
      lead.name || '-',
      lead.contact || '-',
      lead.type || '-',
      lead.status || '-',
      lead.location || '-',
      lead.note ? this._truncate(lead.note, 30) : '-',
      lead.createdAt
        ? new Date(lead.createdAt).toLocaleDateString('de-DE')
        : '-',
    ]);

    // Tabelle erstellen
    pdf.autoTable({
      head: [
        ['Name', 'Kontakt', 'Typ', 'Status', 'Ort', 'Notiz', 'Erstellt'],
      ],
      body: tableData,
      startY: 30,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 30, right: 15, bottom: 15, left: 15 },
    });

    // Footer mit Anzahl
    const finalY = pdf.lastAutoTable.finalY || 30;
    pdf.setFontSize(10);
    pdf.text(`Gesamt: ${leads.length} Lead(s)`, 15, finalY + 10);

    // Download
    const filename = `CRM_Leads_${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(filename);
  }

  /**
   * Hilfsfunktion: Kürzt Text auf max. Länge
   *
   * VERWENDUNG:
   * - Für Tabellen-Zellen (Notiz-Spalte)
   * - Fügt "..." hinzu wenn gekürzt
   *
   * @private
   * @param text - Zu kürzender Text
   * @param maxLength - Maximale Länge
   * @returns Gekürzter Text mit "..."
   */
  private _truncate(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }
}

// ==================== SINGLETON EXPORT ====================

/**
 * Singleton-Instance des PDFService
 *
 * VERWENDUNG:
 * ```typescript
 * import pdfService from '@/services/pdfService';
 *
 * pdfService.exportExposeAsPDF(formData, text, images, captions);
 * pdfService.exportLeadsAsPDF(leads);
 * ```
 */
export default new PDFService();
