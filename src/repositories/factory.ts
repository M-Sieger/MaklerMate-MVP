/**
 * @fileoverview Repository Factory - Creates repository instances
 *
 * ZWECK:
 * - Zentraler Ort für Repository-Erstellung
 * - Ermöglicht spätere Feature-Flags (LocalStorage vs. Supabase)
 * - Dependency Injection für Tests
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-16
 * STATUS: 🟢 Production-Ready
 */

import type { ILeadRepository } from './ILeadRepository';
import type { IExposeRepository } from './IExposeRepository';
import { LocalStorageLeadRepository } from './localStorage/LocalStorageLeadRepository';
import { LocalStorageExposeRepository } from './localStorage/LocalStorageExposeRepository';

/**
 * Creates Lead Repository
 *
 * MVP: Returns LocalStorageLeadRepository
 * v0.2.x+: Returns SupabaseLeadRepository (based on feature flag)
 *
 * @example
 * ```typescript
 * const leadRepo = createLeadRepository();
 * const leads = await leadRepo.getAll();
 * ```
 */
export function createLeadRepository(): ILeadRepository {
  // TODO (v0.2.x): Implement feature flag logic
  // if (import.meta.env.VITE_USE_SUPABASE === 'true') {
  //   return new SupabaseLeadRepository();
  // }

  return new LocalStorageLeadRepository();
}

/**
 * Creates Exposé Repository
 *
 * MVP: Returns LocalStorageExposeRepository
 * v0.2.x+: Returns SupabaseExposeRepository (based on feature flag)
 *
 * @example
 * ```typescript
 * const exposeRepo = createExposeRepository();
 * const exposes = await exposeRepo.getAll();
 * ```
 */
export function createExposeRepository(): IExposeRepository {
  // TODO (v0.2.x): Implement feature flag logic
  // if (import.meta.env.VITE_USE_SUPABASE === 'true') {
  //   return new SupabaseExposeRepository();
  // }

  return new LocalStorageExposeRepository();
}

/**
 * Singleton instances (for global access)
 */
export const leadRepository = createLeadRepository();
export const exposeRepository = createExposeRepository();
