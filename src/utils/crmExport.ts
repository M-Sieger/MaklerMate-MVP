/**
 * @fileoverview CRM Export Functions (DEPRECATED)
 *
 * @deprecated Diese Datei ist veraltet. Verwende stattdessen:
 * - @/services/exportService.ts für JSON/CSV/TXT Export
 *
 * STATUS: ⚠️ Legacy (TypeScript Migration - marked for removal)
 */

import type { Lead } from '@/utils/leadHelpers';

/**
 * @deprecated Use exportService.exportLeadsAsJSON() instead
 */
export function exportLeadsAsJSON(leads: Lead[]): void {
  console.warn('Deprecated: Use exportService.exportLeadsAsJSON()');
}
