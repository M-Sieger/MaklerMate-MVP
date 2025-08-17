// 📄 CRMTool.jsx — Card-Layout & Seitenstruktur
// ✅ Alte Struktur wiederhergestellt: Card-Wrapper, Header mit Toolbar, LeadForm oben, LeadTable unten.
// ✅ Fix: window.confirm statt confirm → verhindert ESLint "no-restricted-globals" Fehler.

import React, {
  useMemo,
  useState,
} from 'react';

import styles from '../../components/CRM/CRM.module.css';
// 🧩 CRM-Komponenten
import LeadForm from '../../components/CRM/LeadForm';
import LeadTable from '../../components/CRM/LeadTable';

// 🧠 Status-Sortierung (VIP > Warm > Neu > Cold)
const statusRank = { vip: 3, warm: 2, neu: 1, cold: 0 };

export default function CRMTool({ leads = [], onAddLead, onDeleteLead, onDeleteAllLeads }) {
  const [filter, setFilter] = useState('Alle');
  const [search, setSearch] = useState('');

  // 🔍 Filter + Suche + Sortierung
  const visibleLeads = useMemo(() => {
    const q = search.trim().toLowerCase();
    const f = filter.toLowerCase();

    const byFilter = (lead) => {
      if (f === 'alle') return true;
      if (!lead.status) return f === 'alle';
      return lead.status.toLowerCase() === f;
    };

    const bySearch = (lead) => {
      if (!q) return true;
      const hay = [
        lead.name,
        lead.contact,
        lead.location,
        lead.type,
        lead.note,
        lead.status,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    };

    const byStatus = (a, b) =>
      (statusRank[(b.status || '').toLowerCase()] ?? -1) -
      (statusRank[(a.status || '').toLowerCase()] ?? -1);

    return [...leads].filter(byFilter).filter(bySearch).sort(byStatus);
  }, [leads, filter, search]);

  // 🗑️ Alle Leads löschen
  const handleDeleteAll = () => {
    if (visibleLeads.length === 0) return;
    // ✅ window.confirm statt confirm → ESLint-konform
    if (window.confirm('Alle Leads löschen?')) {
      onDeleteAllLeads && onDeleteAllLeads();
    }
  };

  return (
    <div className={styles.crmCard}>
      {/* 🧭 Header */}
      <div className={styles.crmHeader}>
        <h2 className={styles.title}>CRM</h2>

        <div className={styles.toolbar}>
          {/* Filter links */}
          <div className={styles.toolbarLeft}>
            <label className={styles.filterLabel} htmlFor="crmFilter">Filter</label>
            <select
              id="crmFilter"
              className={styles.filterSelect}
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>Alle</option>
              <option>VIP</option>
              <option>Warm</option>
              <option>Neu</option>
              <option>Cold</option>
            </select>
          </div>

          {/* Suche + Button rechts */}
          <div className={styles.toolbarRight}>
            <input
              className={styles.searchInput}
              type="text"
              placeholder="Suchen…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className={styles.dangerButton}
              type="button"
              onClick={handleDeleteAll}
              disabled={leads.length === 0}
            >
              Alle Leads löschen
            </button>
          </div>
        </div>
      </div>

      {/* 📋 Inhalt: LeadForm + LeadTable */}
      <div className={styles.content}>
        <LeadForm onAddLead={onAddLead} />
        <LeadTable leads={visibleLeads} onDeleteLead={onDeleteLead} />
      </div>
    </div>
  );
}
