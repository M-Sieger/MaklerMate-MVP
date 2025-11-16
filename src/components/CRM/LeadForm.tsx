// 📄 LeadForm.tsx — Formular für Leads mit Loading-State & UX-Polish
// ✅ Button zeigt Spinner beim Speichern (0.5s künstliche Verzögerung für Feedback)
// ✅ Entfernt HTML5 required-Bubble, stattdessen Button disabled bis Name gesetzt ist.
// ✅ Guard + Reset nach Submit.
// ✅ Soft Limit Checks für Free vs. Pro Plan (SaaS Phase 1)

import React, { useState } from 'react';
import toast from 'react-hot-toast';

import styles from './LeadForm.module.css';

// CONTEXT
import { useAppContext } from '../../context/AppContext';

// STORE
import useCRMStore from '../../stores/crmStore';

// TYPES
import type { Lead, LeadStatus } from '../../utils/leadHelpers';

// ==================== TYPES ====================

interface LeadFormData {
  name: string;
  contact: string;
  location: string;
  type: string;
  note: string;
  status: LeadStatus;
}

interface LeadFormProps {
  onAddLead: (lead: Lead) => void;
}

// ==================== CONSTANTS ====================

const initialLead: LeadFormData = {
  name: '',
  contact: '',
  location: '',
  type: '',
  note: '',
  status: 'neu', // 🟢 Default-Status
};

// ==================== COMPONENT ====================

function LeadForm({ onAddLead }: LeadFormProps) {
  // ==================== CONTEXT & STORE ====================
  const { plan, isLimitReached } = useAppContext();
  const leads = useCRMStore((state) => state.leads);

  // ==================== LOCAL STATE ====================
  const [lead, setLead] = useState<LeadFormData>(initialLead);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setLead((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    const cleaned: LeadFormData = {
      ...lead,
      name: lead.name.trim(),
      contact: lead.contact.trim(),
      location: lead.location.trim(),
      type: lead.type.trim(),
      note: lead.note.trim(),
      status: (lead.status || 'neu') as LeadStatus,
    };

    if (!cleaned.name) return;

    // ==================== SOFT LIMIT CHECK ====================
    // SaaS Phase 1: Warn users about plan limits (non-blocking)
    const currentCount = leads.length;

    if (plan === 'free' && currentCount >= 18) {
      if (isLimitReached('maxLeads', currentCount)) {
        // Already at limit (20)
        toast.error(
          `⚠️ Free Plan Limit erreicht (${currentCount}/20 Leads). Upgrade zu Pro für unbegrenzte Leads!`,
          { duration: 5000 }
        );
      } else {
        // Approaching limit (18-19)
        toast(
          `⚠️ Fast am Limit: ${currentCount}/20 Leads. Noch ${20 - currentCount} verfügbar.`,
          { icon: '⚠️', duration: 4000 }
        );
      }
    }

    setIsLoading(true);

    const now = Date.now();
    const payload = {
      _v: 2,
      ...cleaned,
      id: `${now}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date(now).toISOString(),
      updatedAt: new Date(now).toISOString(),
    } as Lead;

    // kleine künstliche Verzögerung für UX-Feedback
    await new Promise((res) => setTimeout(res, 500));

    onAddLead && onAddLead(payload);
    setLead(initialLead);
    setIsLoading(false);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Zeile 1: Name, Kontakt */}
      <div className={styles.formRow}>
        <input
          className={styles.input}
          type="text"
          name="name"
          placeholder="Name"
          value={lead.name}
          onChange={handleChange}
          autoComplete="name"
        />
        <input
          className={styles.input}
          type="text"
          name="contact"
          placeholder="Kontakt (E-Mail / Telefon)"
          value={lead.contact}
          onChange={handleChange}
          autoComplete="tel"
        />
      </div>

      {/* Zeile 2: Ort, Typ */}
      <div className={styles.formRow}>
        <input
          className={styles.input}
          type="text"
          name="location"
          placeholder="Ort"
          value={lead.location}
          onChange={handleChange}
          autoComplete="address-level2"
        />
        <input
          className={styles.input}
          type="text"
          name="type"
          placeholder="Lead-Typ (z. B. Verkäufer/Käufer)"
          value={lead.type}
          onChange={handleChange}
        />
      </div>

      {/* Zeile 3: Notiz (volle Zeile) */}
      <div className={styles.formRow}>
        <textarea
          className={styles.input}
          name="note"
          placeholder="Notiz"
          value={lead.note}
          onChange={handleChange}
          rows={3}
        />
      </div>

      {/* Zeile 4: Status + Aktion */}
      <div className={styles.formRow}>
        <select
          className={styles.select}
          name="status"
          value={lead.status}
          onChange={handleChange}
        >
          <option value="neu">Neu</option>
          <option value="warm">Warm</option>
          <option value="vip">VIP</option>
          <option value="cold">Cold</option>
        </select>

        <div className={styles.actions}>
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={!lead.name.trim() || isLoading}
            title={!lead.name.trim() ? 'Bitte mindestens den Namen eintragen' : 'Lead speichern'}
          >
            {isLoading ? <span className={styles.spinner}></span> : 'Lead speichern'}
          </button>
        </div>
      </div>
    </form>
  );
}

export default LeadForm;
