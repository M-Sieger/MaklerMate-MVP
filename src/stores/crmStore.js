// 🏪 crmStore.js – Zustand Store für CRM-Tool
// ✅ Zentrales Lead-Management
// ✅ Auto-Persistierung in localStorage
// ✅ Filter & Search State

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCRMStore = create(
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
          const newLead = {
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

        const byType = state.leads.reduce((acc, lead) => {
          const type = lead.type || 'unbekannt';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {});

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
          const leads = JSON.parse(jsonString);
          if (Array.isArray(leads)) {
            set({ leads });
            return { success: true, count: leads.length };
          }
          return { success: false, error: 'Ungültiges Format' };
        } catch (error) {
          return { success: false, error: error.message };
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
