// 📄 pages/CRM/CRMTool.jsx — Verdrahtung LeadForm ↔ useLocalStorageLeads ↔ LeadTable
// ✅ Fix: Nach "Lead speichern" erscheint der Eintrag sofort in der Tabelle
// ✅ Ursache war fehlendes onAddLead-Prop — jetzt korrekt mit Hook verdrahtet
// ✅ Delete/Update weitergereicht; optionales isPersisting-Flag verfügbar

import React, {
  useMemo,
  useState,
} from 'react';

import CRMCard from '../../components/CRM/CRMCard';
import LeadForm from '../../components/CRM/LeadForm';
import LeadTable from '../../components/CRM/LeadTable';
import useLocalStorageLeads from '../../hooks/useLocalStorageLeads';

export default function CRMTool() {
  // 🔗 Single source of truth für Leads
  const { leads, addLead, updateLead, deleteLead, resetLeads, isPersisting } =
    useLocalStorageLeads('mm_crm_leads_v2');

  // 🔎 Client-Filter/Suche (sehr simpel für Demo)
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('alle'); // alle|neu|warm|cold|vip

  const filteredLeads = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      const statusOk = filter === 'alle' ? true : (l.status || '').toLowerCase() === filter;
      if (!statusOk) return false;
      if (!q) return true;
      const hay = `${l.name} ${l.contact} ${l.location} ${l.type} ${l.note}`.toLowerCase();
      return hay.includes(q);
    });
  }, [leads, query, filter]);

  return (
    <div className="page-wrapper">
      <CRMCard
        title="CRM"
        toolbarLeft={
          <>
            <label className="visually-hidden" htmlFor="crm-filter">Filter</label>
            <select
              id="crm-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
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
            <input
              className="searchInput"
              placeholder="Suchen…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button className="dangerButton" onClick={resetLeads} title="Alle Leads löschen">
              Alle Leads löschen
            </button>
          </>
        }
        footer={
          isPersisting ? (
            <div style={{opacity:0.8}}>Speichern…</div>
          ) : (
            <div style={{opacity:0.6}}>Gespeichert</div>
          )
        }
      >
        {/* 🔌 WICHTIG: addLead als onAddLead an LeadForm übergeben */}
        <LeadForm onAddLead={addLead} />

        {/* Tabelle erhält die gefilterten Leads + Handlers */}
        <LeadTable
          leads={filteredLeads}
          onDeleteLead={deleteLead}
          // optional: onUpdateLead fürs Status-Cycling über LeadRow
          onUpdateLead={updateLead}
        />
      </CRMCard>
    </div>
  );
}
