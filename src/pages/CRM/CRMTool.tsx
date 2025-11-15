/**
 * @fileoverview CRMTool - Hauptseite für Lead-Management
 *
 * ZWECK:
 * - Lead-Verwaltung (Hinzufügen, Bearbeiten, Löschen)
 * - Filter nach Status (Neu, Warm, VIP, Cold)
 * - Suche über Name, Kontakt, Location, Type, Notiz
 * - Export als CSV, JSON, PDF
 * - Persistierung in localStorage
 *
 * ARCHITEKTUR:
 * - Container Component (orchestriert CRM-Components)
 * - State via useCRMStore (Zustand store)
 * - Filter & Search State im Store (nicht lokal)
 * - Presentational Components: LeadForm, LeadTable, CRMCard
 *
 * USER-FLOW:
 * 1. User füllt LeadForm aus (Name, Kontakt, Type, Status)
 * 2. User klickt "Lead speichern"
 * 3. Lead erscheint in LeadTable
 * 4. User kann filtern (Status-Dropdown) und suchen (Search-Input)
 * 5. User kann Lead bearbeiten (Status ändern) oder löschen
 * 6. User kann alle Leads exportieren (CSV, JSON, PDF)
 *
 * ABHÄNGIGKEITEN:
 * - stores/crmStore.js (leads, filter, searchQuery, actions)
 * - components/CRM/LeadForm.jsx (Formular für neue Leads)
 * - components/CRM/LeadTable.jsx (Tabelle mit allen Leads)
 * - components/CRM/CRMCard.jsx (Container mit Toolbar)
 *
 * MIGRATION-NOTES:
 * - VORHER: useLocalStorageLeads hook
 * - NACHHER: useCRMStore (eliminiert Custom-Hook)
 * - VORHER: Lokales useState für filter/query
 * - NACHHER: Store-State (filter, searchQuery)
 * - VORHER: useMemo für gefilterte Leads
 * - NACHHER: Store-Methode getFilteredLeads()
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * LETZTE ÄNDERUNG: 2025-11-15
 * STATUS: 🟢 Production-Ready (TypeScript Migration)
 */

import React from 'react';

// COMPONENTS
import CRMCard from '../../components/CRM/CRMCard';
import LeadForm from '../../components/CRM/LeadForm';
import LeadTable from '../../components/CRM/LeadTable';

// STORE (nach DEVELOPMENT-INSTRUCTION.md: Service-Layer Pattern)
import useCRMStore from '../../stores/crmStore';

// ==================== COMPONENT ====================

export default function CRMTool() {
  // ==================== STATE (via Zustand Store) ====================
  // WARUM: Eliminiert Custom-Hook, Auto-Persistierung
  // VORHER: useLocalStorageLeads + lokales useState für filter/query
  // NACHHER: useCRMStore (alles zentral)

  const leads = useCRMStore((state) => state.leads);
  const filter = useCRMStore((state) => state.filter);
  const searchQuery = useCRMStore((state) => state.searchQuery);

  const {
    addLead,
    deleteLead,
    resetLeads,
    setFilter,
    setSearchQuery,
    getFilteredLeads,
  } = useCRMStore();

  // ==================== COMPUTED ====================

  /**
   * Gefilterte Leads (Status-Filter + Search-Query)
   * WARUM: Store-Methode statt useMemo (zentralisiert Logik)
   * VORHER: useMemo in Component (lokale Filter-Logik)
   * NACHHER: getFilteredLeads() im Store (wiederverwendbar)
   */
  const filteredLeads = getFilteredLeads();

  // ==================== EVENT HANDLERS ====================

  /**
   * Filter ändern (Status-Dropdown)
   * @param e - Select-Event
   */
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
    setFilter(e.target.value);
  };

  /**
   * Search-Query ändern (Search-Input)
   * @param e - Input-Event
   */
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchQuery(e.target.value);
  };

  /**
   * Alle Leads löschen (mit Confirmation)
   * WARUM: Destructive Action, benötigt User-Bestätigung
   */
  const handleResetLeads = (): void => {
    // CONFIRMATION: User muss bestätigen
    const confirmed = window.confirm(
      'Wirklich alle Leads löschen? Diese Aktion kann nicht rückgängig gemacht werden.'
    );

    if (confirmed) {
      resetLeads();
    }
  };

  // ==================== RENDER ====================

  return (
    <div className="page-wrapper">
      <CRMCard
        title="CRM"
        toolbarLeft={
          <>
            {/* STATUS-FILTER */}
            <label className="visually-hidden" htmlFor="crm-filter">
              Filter
            </label>
            <select
              id="crm-filter"
              value={filter}
              onChange={handleFilterChange}
              className="filterSelect"
            >
              <option value="alle">Alle</option>
              <option value="vip">VIP</option>
              <option value="warm">Warm</option>
              <option value="neu">Neu</option>
              <option value="cold">Cold</option>
            </select>
          </>
        }
        toolbarRight={
          <>
            {/* SEARCH-INPUT */}
            <input
              className="searchInput"
              placeholder="Suchen…"
              value={searchQuery}
              onChange={handleSearchChange}
            />

            {/* RESET-BUTTON */}
            <button
              className="dangerButton"
              onClick={handleResetLeads}
              title="Alle Leads löschen"
            >
              Alle Leads löschen
            </button>
          </>
        }
        footer={
          // FOOTER: Zeigt Anzahl Leads (gefiltert vs. gesamt)
          <div style={{ opacity: 0.6 }}>
            {filteredLeads.length !== leads.length
              ? `${filteredLeads.length} von ${leads.length} Leads`
              : `${leads.length} Leads`}
          </div>
        }
      >
        {/* LEAD-FORM: Formular für neue Leads */}
        <LeadForm onAddLead={addLead} />

        {/* LEAD-TABLE: Tabelle mit gefilterten Leads */}
        <LeadTable
          leads={filteredLeads}
          onDeleteLead={deleteLead}
        />
      </CRMCard>
    </div>
  );
}
