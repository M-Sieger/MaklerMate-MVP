/**
 * @fileoverview PDF Export Leads (DEPRECATED)
 *
 * @deprecated Use @/services/pdfService.ts instead
 *
 * STATUS: ⚠️ Legacy (TypeScript Migration - marked for removal)
 */

import type { Lead } from '@/utils/leadHelpers';

/**
 * @deprecated Use pdfService.exportLeadsAsPDF()
 */
export function exportLeadsAsPDF(leads: Lead[]): void {
  console.warn('Deprecated: Use pdfService.exportLeadsAsPDF()');
}
