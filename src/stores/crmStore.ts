/**
 * @fileoverview CRM Store - Zustand Store für CRM-Tool
 *
 * ZWECK:
 * - Zentrales Lead-Management
 * - Auto-Persistierung in localStorage
 * - Filter & Search State
 *
 * FEATURES:
 * - CRUD Operations für Leads
 * - Filter nach Status (alle, neu, warm, vip, cold)
 * - Search-Query über alle Lead-Felder
 * - Bulk-Operations (Delete, Status-Update)
 * - Statistics (Total, byStatus, byType)
 * - Import/Export als JSON
 *
 * 🔧 SAAS-INTEGRATION NOTE (v0.2.x):
 * Dieser Store nutzt aktuell Zustand persist middleware mit localStorage.
 * In v0.2.x wird die Persistierungs-Logik ersetzt durch:
 *   - ILeadRepository Interface (src/repositories/ILeadRepository.ts)
 *   - SupabaseLeadRepository Implementation
 *   - User-spezifische Daten (userId Filter)
 *   - Real-Time Sync zwischen Devices
 *
 * Migration-Plan:
 *   1. Extrahiere Persistierungs-Logik in LocalStorageLeadRepository
 *   2. Inject Repository via Dependency Injection
 *   3. Implementiere SupabaseLeadRepository
 *   4. Feature-Flag für schrittweise Migration
 *
 * Siehe: docs/architecture/STORAGE-ABSTRACTION.md
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-16
 * STATUS: 🟢 Production-Ready (TypeScript Migration)
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Lead, LeadStatus } from '../utils/leadHelpers';

// ==================== TYPES ====================

/**
 * Filter-Optionen für Lead-Status
 */
export type LeadFilter = 'alle' | 'neu' | 'warm' | 'vip' | 'cold';

/**
 * Lead-Statistiken
 */
export interface LeadStats {
  total: number;
  byStatus: {
    neu: number;
    warm: number;
    vip: number;
    cold: number;
  };
  byType: Record<string, number>;
}

/**
 * Import-Result
 */
export interface ImportResult {
  success: boolean;
  count?: number;
  error?: string;
}

/**
 * CRM Store State
 */
interface CRMState {
  // ==================== STATE ====================
  leads: Lead[];
  filter: LeadFilter;
  searchQuery: string;

  // ==================== LEAD ACTIONS ====================
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | '_v'>) => void;
  updateLead: (id: string, patch: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  deleteLeads: (ids: string[]) => void;
  setLeads: (leads: Lead[]) => void;
  resetLeads: () => void;

  // ==================== FILTER & SEARCH ====================
  setFilter: (filter: LeadFilter) => void;
  setSearchQuery: (query: string) => void;
  getFilteredLeads: () => Lead[];

  // ==================== STATS ====================
  getStats: () => LeadStats;

  // ==================== BULK OPERATIONS ====================
  bulkUpdateStatus: (ids: string[], newStatus: LeadStatus) => void;
  exportLeadsAsJSON: () => string;
  importLeadsFromJSON: (jsonString: string) => ImportResult;
}

// ==================== STORE ====================

const useCRMStore = create<CRMState>()(
  persist(
    (set, get) => ({
      // ==================== STATE ====================
      leads: [],
      filter: 'alle',
      searchQuery: '',

      // ==================== LEAD ACTIONS ====================

      /**
       * Fügt neuen Lead hinzu
       */
      addLead: (lead) =>
        set((state) => {
          const newLead: Lead = {
            ...lead,
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            _v: 2, // Version für Migrations
          };

          return {
            leads: [...state.leads, newLead],
          };
        }),

      /**
       * Updated existierenden Lead
       */
      updateLead: (id, patch) =>
        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id
              ? { ...l, ...patch, updatedAt: new Date().toISOString() }
              : l
          ),
        })),

      /**
       * Löscht Lead
       */
      deleteLead: (id) =>
        set((state) => ({
          leads: state.leads.filter((l) => l.id !== id),
        })),

      /**
       * Bulk-Delete mehrerer Leads
       */
      deleteLeads: (ids) =>
        set((state) => ({
          leads: state.leads.filter((l) => !ids.includes(l.id)),
        })),

      /**
       * Setzt alle Leads (z.B. bei Import)
       */
      setLeads: (leads) => set({ leads }),

      /**
       * Löscht alle Leads
       */
      resetLeads: () => set({ leads: [] }),

      // ==================== FILTER & SEARCH ====================

      /**
       * Setzt aktiven Filter
       */
      setFilter: (filter) => set({ filter }),

      /**
       * Setzt Search-Query
       */
      setSearchQuery: (query) => set({ searchQuery: query }),

      /**
       * Gibt gefilterte Leads zurück
       */
      getFilteredLeads: () => {
        const state = get();
        let filtered = state.leads;

        // Filter nach Status
        if (state.filter !== 'alle') {
          filtered = filtered.filter(
            (l) => l.status?.toLowerCase() === state.filter.toLowerCase()
          );
        }

        // Search-Filter
        if (state.searchQuery.trim()) {
          const query = state.searchQuery.toLowerCase();
          filtered = filtered.filter(
            (l) =>
              l.name?.toLowerCase().includes(query) ||
              l.contact?.toLowerCase().includes(query) ||
              l.type?.toLowerCase().includes(query) ||
              l.location?.toLowerCase().includes(query) ||
              l.note?.toLowerCase().includes(query)
          );
        }

        return filtered;
      },

      // ==================== STATS ====================

      /**
       * Gibt Lead-Statistiken zurück
       */
      getStats: () => {
        const state = get();
        const total = state.leads.length;

        const byStatus = {
          neu: state.leads.filter((l) => l.status === 'neu').length,
          warm: state.leads.filter((l) => l.status === 'warm').length,
          vip: state.leads.filter((l) => l.status === 'vip').length,
          cold: state.leads.filter((l) => l.status === 'cold').length,
        };

        const byType = state.leads.reduce<Record<string, number>>(
          (acc, lead) => {
            const type = lead.type || 'unbekannt';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
          },
          {}
        );

        return {
          total,
          byStatus,
          byType,
        };
      },

      // ==================== BULK OPERATIONS ====================

      /**
       * Updated Status für mehrere Leads
       */
      bulkUpdateStatus: (ids, newStatus) =>
        set((state) => ({
          leads: state.leads.map((l) =>
            ids.includes(l.id)
              ? { ...l, status: newStatus, updatedAt: new Date().toISOString() }
              : l
          ),
        })),

      /**
       * Exportiert Leads als JSON-String
       */
      exportLeadsAsJSON: () => {
        const state = get();
        return JSON.stringify(state.leads, null, 2);
      },

      /**
       * Importiert Leads aus JSON-String
       */
      importLeadsFromJSON: (jsonString) => {
        try {
          const leads = JSON.parse(jsonString) as unknown;
          if (Array.isArray(leads)) {
            set({ leads: leads as Lead[] });
            return { success: true, count: leads.length };
          }
          return { success: false, error: 'Ungültiges Format' };
        } catch (error) {
          return {
            success: false,
            error: error instanceof Error ? error.message : 'Unbekannter Fehler',
          };
        }
      },
    }),
    {
      name: 'maklermate-crm-storage',
      version: 2, // Increment bei Breaking Changes
    }
  )
);

export default useCRMStore;
