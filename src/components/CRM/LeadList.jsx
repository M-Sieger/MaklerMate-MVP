import React, { useState } from 'react';

import LeadRow from './LeadRow';
import styles from './LeadTable.module.css';

/**
 * Legacy lead list component.  This component predates the refactor and
 * renders leads in a simple list with a basic filter.  It remains in
 * the codebase for backwards compatibility and to ease migration, but
 * is no longer used by default.  All new features should target
 * LeadTable instead.
 *
 * Accepts the same props as LeadTable.  If the leads prop is missing
 * (undefined) the component will use an empty array to avoid
 * crashes.  A basic status filter is implemented with a select.
 */
export default function LeadList({ leads = [], onUpdateLead, onDelete }) {
  const [filter, setFilter] = useState('all');

  // Filter leads by status if a specific filter is selected.
  const filtered = leads.filter((lead) => {
    return filter === 'all' ? true : lead.status === filter;
  });

  return (
    <div className={styles.legacyList}>
      <div className={styles.filterRow}>
        <label htmlFor="statusFilter">Status:</label>
        <select
          id="statusFilter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.select}
        >
          <option value="all">Alle</option>
          <option value="neu">Neu</option>
          <option value="warm">Warm</option>
          <option value="cold">Cold</option>
          <option value="vip">VIP</option>
        </select>
      </div>
      <table className={styles.leadTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Kontakt</th>
            <th>Ort</th>
            <th>Typ</th>
            <th>Status</th>
            <th>Notiz</th>
            <th>Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((lead) => (
            <LeadRow
              key={lead.id}
              lead={lead}
              onUpdateLead={onUpdateLead}
              onDelete={onDelete}
            />
          ))}
          {filtered.length === 0 && (
            <tr className={styles.emptyRow}>
              <td colSpan={7} className={styles.emptyCell}>
                Keine Leads gefunden.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}