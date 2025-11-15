// 📄 pdfService.js – Zentraler PDF-Export Service
// ✅ Konsolidiert alle PDF-Export-Funktionen
// ✅ Exposé-PDF mit Text + Bildern
// ✅ Leads-PDF mit Tabelle
// ✅ Optimiert (kein html2canvas, nur jsPDF + autotable)

import jsPDF from 'jspdf';
import 'jspdf-autotable';

class PDFService {
  /**
   * Exportiert Immobilien-Exposé als PDF
   * @param {Object} formData - Formular-Daten
   * @param {string} output - Generierter Exposé-Text
   * @param {string[]} images - Base64-Image-Strings
   * @param {string[]} captions - Bild-Unterschriften
   */
  exportExposeAsPDF(formData, output, images = [], captions = []) {
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

    const eckdaten = [];
    if (formData.wohnflaeche) eckdaten.push(`Wohnfläche: ${formData.wohnflaeche} m²`);
    if (formData.zimmer) eckdaten.push(`Zimmer: ${formData.zimmer}`);
    if (formData.baujahr) eckdaten.push(`Baujahr: ${formData.baujahr}`);
    if (formData.etage) eckdaten.push(`Etage: ${formData.etage}`);
    if (formData.balkonTerrasse) eckdaten.push(`Balkon/Terrasse: ${formData.balkonTerrasse}`);
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
    if (formData.ausstattung && formData.ausstattung.trim()) {
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
      const ausstattungLines = pdf.splitTextToSize(formData.ausstattung, 180);
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
    if (formData.besonderheiten && formData.besonderheiten.trim()) {
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
      const besonderheitenLines = pdf.splitTextToSize(formData.besonderheiten, 180);
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
        if (!imgData || typeof imgData !== 'string' || !imgData.startsWith('data:image')) {
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
          const caption = captions && captions[idx] ? captions[idx].trim() : '';
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
   * @param {Object[]} leads - Array von Lead-Objekten
   */
  exportLeadsAsPDF(leads) {
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
        [
          'Name',
          'Kontakt',
          'Typ',
          'Status',
          'Ort',
          'Notiz',
          'Erstellt',
        ],
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
   * @private
   */
  _truncate(text, maxLength) {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  }
}

export default new PDFService();
