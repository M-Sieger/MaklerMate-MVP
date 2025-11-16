/**
 * @fileoverview Migration Utility - Migrates data from Zustand persist to Repositories
 *
 * ZWECK:
 * - Einmalige Migration von bestehenden LocalStorage-Daten
 * - Vermeidet Datenverlust beim Wechsel zu Repositories
 *
 * USAGE:
 * - Wird automatisch beim ersten App-Start ausgeführt
 * - Migriert nur wenn Ziel-Storage leer ist
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-16
 * STATUS: 🟢 Production-Ready
 */

import { leadRepository, exposeRepository } from './factory';
import type { Lead } from '../utils/leadHelpers';
import type { SavedExpose } from '../stores/exposeStore';

/**
 * Migrate Leads from Zustand persist to Repository
 *
 * Reads from: `maklermate-crm-storage` (Zustand persist key)
 * Writes to: `maklermate_leads` (Repository key)
 */
export async function migrateLeadsFromZustand(): Promise<void> {
  try {
    // Check if repository already has data
    const existingLeads = await leadRepository.getAll();
    if (existingLeads.length > 0) {
      console.log('[Migration] Leads already migrated, skipping');
      return;
    }

    // Read from Zustand persist storage
    const zustandData = localStorage.getItem('maklermate-crm-storage');
    if (!zustandData) {
      console.log('[Migration] No Zustand leads data found');
      return;
    }

    const parsed = JSON.parse(zustandData);
    const leads: Lead[] = parsed?.state?.leads || [];

    if (leads.length === 0) {
      console.log('[Migration] No leads to migrate');
      return;
    }

    // Import to repository
    console.log(`[Migration] Migrating ${leads.length} leads...`);

    for (const lead of leads) {
      // Remove id, createdAt, updatedAt to let repository generate them
      const { id, createdAt, updatedAt, _v, ...leadData } = lead;
      await leadRepository.create(leadData);
    }

    console.log('[Migration] Leads migration complete ✅');
  } catch (error) {
    console.error('[Migration] Leads migration error:', error);
  }
}

/**
 * Migrate Exposés from Zustand persist to Repository
 *
 * Reads from: `maklermate-expose-storage` (Zustand persist key)
 * Writes to: `maklermate_exposes` (Repository key)
 */
export async function migrateExposesFromZustand(): Promise<void> {
  try {
    // Check if repository already has data
    const existingExposes = await exposeRepository.getAll();
    if (existingExposes.length > 0) {
      console.log('[Migration] Exposés already migrated, skipping');
      return;
    }

    // Read from Zustand persist storage
    const zustandData = localStorage.getItem('maklermate-expose-storage');
    if (!zustandData) {
      console.log('[Migration] No Zustand exposé data found');
      return;
    }

    const parsed = JSON.parse(zustandData);
    const exposes: SavedExpose[] = parsed?.state?.savedExposes || [];

    if (exposes.length === 0) {
      console.log('[Migration] No exposés to migrate');
      return;
    }

    // Import to repository
    console.log(`[Migration] Migrating ${exposes.length} exposés...`);

    for (const expose of exposes) {
      // Remove id to let repository generate it
      const { id, ...exposeData } = expose;
      await exposeRepository.create(exposeData);
    }

    console.log('[Migration] Exposés migration complete ✅');
  } catch (error) {
    console.error('[Migration] Exposés migration error:', error);
  }
}

/**
 * Run all migrations
 *
 * Call this once at app startup
 */
export async function runMigrations(): Promise<void> {
  console.log('[Migration] Starting data migration...');
  await migrateLeadsFromZustand();
  await migrateExposesFromZustand();
  console.log('[Migration] All migrations complete');
}
