// 📄 LeadRow.jsx – Tabellenzeile mit GPT-Funktion, IvyBadge & zentralem Modal

import React, { useState } from 'react';

// 🧠 GPT-Hook (Proxy zu GPT-4o)
import useAIHelper from '../../hooks/useAIHelper';
// 🎨 Styles für Tabelle, Badges, Buttons etc.
import styles from './CRM.module.css';
// 🏷️ Visuelle Badge-Komponente für Statusanzeige
import IvyBadge from './IvyBadge';
// 🧾 Formular zur Lead-Bearbeitung
import LeadForm from './LeadForm';
// 🪟 Wiederverwendbares Modal für GPT & Formulare
import Modal from './Modal';

export default function LeadRow({ lead, onDelete, onUpdate }) {
  // 🛠️ Lead bearbeiten – Modal sichtbar?
  const [showDetailModal, setShowDetailModal] = useState(false);

  // 🧠 GPT-Modal sichtbar?
  const [showGptModal, setShowGptModal] = useState(false);

  // 🧠 GPT-Antworttext
  const [gptResult, setGptResult] = useState('');

  // 🌀 GPT Hook mit Ladezustand + Call
  const { isLoading, fetchGPT } = useAIHelper();

  // 📅 Formatierter Zeitstempel für Anzeige
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 🎨 Farbige Tabellenzeile je nach Status (VIP/Warm)
  const rowHighlightClass =
    lead.status?.toLowerCase() === 'vip' ? styles.rowVip :
    lead.status?.toLowerCase() === 'warm' ? styles.rowWarm : '';

  // ✅ Nach Lead-Formular: Änderungen übernehmen
  const handleDetailUpdate = (id, updates) => {
    // Beispiel: updates = { status: 'Warm', note: 'Neuer Kontakt' }
    onUpdate(id, updates); // 🔧 updateLead erwartet vollständiges Objekt
    setShowDetailModal(false);
  };

  // 🧠 GPT-Funktion triggern → Prompt senden → Antwort anzeigen
  const handleGPT = async () => {
    const prompt = `Erstelle ein kurzes Follow-Up für folgenden Immobilien-Lead:\n\nName: ${lead.name}\nNotiz: ${lead.note}`;
    const response = await fetchGPT(prompt);
    if (response) {
      setGptResult(response);
      setShowGptModal(true);
    }
  };

  return (
    <>
      {/* 📊 Tabellenzeile mit Lead-Daten */}
      <tr className={`${styles.tableRow} ${rowHighlightClass}`}>
        <td><strong>{lead.name}</strong></td>
        <td>{lead.contact}</td>
        <td>{lead.location || '–'}</td>
        <td>{lead.type}</td>

        {/* 📝 Notiz + kompakter Timestamp */}
        <td>
          {lead.note}
          <div className={styles.timestamp}>
            {formatDate(lead.createdAt || lead.timestamp)}
          </div>
        </td>

        {/* 🏷️ Status-Badge (z. B. VIP, Warm) */}
        <td>
          <IvyBadge status={lead.status} />
        </td>

        {/* 🔘 Aktionen: GPT, Edit, Delete */}
        <td className={styles.actionsCell}>
          {/* 🧠 Follow-Up generieren */}
          <button
            className={styles.gptButton}
            onClick={handleGPT}
            title="Follow-Up generieren"
            disabled={isLoading}
          >
            {isLoading ? '⏳' : '🧠'}
          </button>

          {/* ✏️ Lead bearbeiten */}
          <button
            className={styles.actionButton}
            onClick={() => setShowDetailModal(true)}
            title="Lead bearbeiten"
          >
            ✏️
          </button>

          {/* 🗑️ Lead löschen */}
          <button
            className={styles.deleteButton}
            onClick={() => onDelete(lead.id)}
            title="Lead löschen"
          >
            🗑️
          </button>
        </td>
      </tr>

      {/* 🧠 GPT-Vorschlag anzeigen */}
      {showGptModal && (
        <Modal title="🧠 GPT Vorschlag" onClose={() => setShowGptModal(false)}>
          <p>{gptResult}</p>
        </Modal>
      )}

      {/* 🛠️ Lead bearbeiten */}
      {showDetailModal && (
        <Modal title="🛠️ Lead bearbeiten" onClose={() => setShowDetailModal(false)}>
          <LeadForm
            lead={lead}
            onUpdate={handleDetailUpdate}
          />
        </Modal>
      )}
    </>
  );
}
