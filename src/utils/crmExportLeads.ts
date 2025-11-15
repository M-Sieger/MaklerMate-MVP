/**
 * @fileoverview CRM Export Leads (DEPRECATED)
 *
 * @deprecated Use @/services/exportService.ts instead
 *
 * STATUS: ⚠️ Legacy (TypeScript Migration - marked for removal)
 */

import type { Lead } from '@/utils/leadHelpers';

/**
 * @deprecated Use exportService.exportLeadsAsTXT()
 */
export function exportLeadsAsTXT(leads: Lead[]): void {
  console.warn('Deprecated: Use exportService.exportLeadsAsTXT()');
}
