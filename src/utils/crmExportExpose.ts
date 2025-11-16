/**
 * @fileoverview CRM Export for Expose (DEPRECATED)
 *
 * @deprecated Use @/services/exportService.ts instead
 *
 * STATUS: ⚠️ Legacy (TypeScript Migration - marked for removal)
 */

/**
 * @deprecated
 */
export function generateCRMJson(data: unknown): string {
  console.warn('Deprecated');
  return JSON.stringify(data, null, 2);
}
