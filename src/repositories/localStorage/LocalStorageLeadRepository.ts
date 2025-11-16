/**
 * @fileoverview LocalStorage Lead Repository - LocalStorage-basierte Lead-Persistierung
 *
 * ZWECK:
 * - Implementiert ILeadRepository für LocalStorage
 * - Ersetzt Zustand persist middleware
 * - Ermöglicht spätere Migration zu Supabase
 *
 * STORAGE FORMAT:
 * - Key: `maklermate_leads`
 * - Value: JSON Array von Leads
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-16
 * STATUS: 🟢 Production-Ready
 */

import type { Lead } from '@/utils/leadHelpers';
import type { ILeadRepository } from '../ILeadRepository';
import { migrateLead, normalizeLead } from '@/utils/leadHelpers';

/**
 * LocalStorage Lead Repository
 *
 * FEATURES:
 * - Speichert Leads als JSON-Array in LocalStorage
 * - Automatische ID-Generierung
 * - Lead-Migration (v1 → v2)
 * - Import/Export
 *
 * VERWENDUNG:
 * ```typescript
 * const repository = new LocalStorageLeadRepository();
 * const leads = await repository.getAll();
 * ```
 */
export class LocalStorageLeadRepository implements ILeadRepository {
  private readonly storageKey = 'maklermate_leads';

  // ==================== PUBLIC API ====================

  /**
   * Lädt alle Leads aus LocalStorage
   */
  async getAll(userId?: string): Promise<Lead[]> {
    try {
      const json = localStorage.getItem(this.storageKey);
      if (!json) return [];

      const data = JSON.parse(json);
      if (!Array.isArray(data)) {
        console.warn('[LocalStorageLeadRepository] Invalid data format, expected array');
        return [];
      }

      // Migrate leads if needed
      return data.map(migrateLead);
    } catch (error) {
      console.error('[LocalStorageLeadRepository] Load error:', error);
      return [];
    }
  }

  /**
   * Lädt Lead per ID
   */
  async getById(id: string, userId?: string): Promise<Lead | null> {
    const leads = await this.getAll(userId);
    return leads.find((lead) => lead.id === id) || null;
  }

  /**
   * Erstellt neuen Lead
   */
  async create(
    lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | '_v'>,
    userId?: string
  ): Promise<Lead> {
    const leads = await this.getAll(userId);

    const newLead: Lead = {
      ...normalizeLead(lead as any),
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      _v: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    leads.push(newLead);
    await this._saveAll(leads);

    return newLead;
  }

  /**
   * Aktualisiert Lead
   */
  async update(id: string, patch: Partial<Lead>, userId?: string): Promise<Lead> {
    const leads = await this.getAll(userId);
    const index = leads.findIndex((lead) => lead.id === id);

    if (index === -1) {
      throw new Error(`Lead with ID ${id} not found`);
    }

    const updatedLead: Lead = {
      ...leads[index],
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    leads[index] = updatedLead;
    await this._saveAll(leads);

    return updatedLead;
  }

  /**
   * Löscht Lead
   */
  async delete(id: string, userId?: string): Promise<void> {
    const leads = await this.getAll(userId);
    const filtered = leads.filter((lead) => lead.id !== id);

    if (filtered.length === leads.length) {
      throw new Error(`Lead with ID ${id} not found`);
    }

    await this._saveAll(filtered);
  }

  /**
   * Löscht mehrere Leads
   */
  async deleteMany(ids: string[], userId?: string): Promise<void> {
    const leads = await this.getAll(userId);
    const filtered = leads.filter((lead) => !ids.includes(lead.id));
    await this._saveAll(filtered);
  }

  /**
   * Exportiert Leads als JSON
   */
  async exportAsJSON(userId?: string): Promise<string> {
    const leads = await this.getAll(userId);
    return JSON.stringify(leads, null, 2);
  }

  /**
   * Importiert Leads aus JSON
   */
  async importFromJSON(json: string, userId?: string): Promise<number> {
    try {
      const data = JSON.parse(json);

      if (!Array.isArray(data)) {
        throw new Error('Invalid JSON: Expected array');
      }

      // Migrate and normalize all leads
      const leads = data.map(migrateLead);

      // Merge with existing leads (avoid duplicates by ID)
      const existing = await this.getAll(userId);
      const existingIds = new Set(existing.map((l) => l.id));

      const newLeads = leads.filter((l) => !existingIds.has(l.id));
      const merged = [...existing, ...newLeads];

      await this._saveAll(merged);

      return newLeads.length;
    } catch (error) {
      console.error('[LocalStorageLeadRepository] Import error:', error);
      throw error;
    }
  }

  // ==================== PRIVATE HELPERS ====================

  /**
   * Speichert alle Leads in LocalStorage
   */
  private async _saveAll(leads: Lead[]): Promise<void> {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(leads));
    } catch (error) {
      console.error('[LocalStorageLeadRepository] Save error:', error);
      throw error;
    }
  }
}

/**
 * Singleton-Instanz für globale Verwendung
 */
export const localStorageLeadRepository = new LocalStorageLeadRepository();
