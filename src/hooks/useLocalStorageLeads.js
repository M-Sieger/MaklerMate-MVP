// 📄 hooks/useLocalStorageLeads.js — ESLint-safe Persist mit Debounce
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export const STATUS_ENUM = ['neu', 'warm', 'cold', 'vip'];

export function normalizeStatus(rawStatus) {
  if (typeof rawStatus !== 'string') return 'neu';
  const v = rawStatus.trim().toLowerCase();
  const mapped = v === 'kalt' ? 'cold' : v;
  return STATUS_ENUM.includes(mapped) ? mapped : 'neu';
}

function toISODate(input) {
  if (!input) return new Date().toISOString();
  if (typeof input === 'number' || /^(\d+)$/.test(String(input))) {
    const d = new Date(Number(input));
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  }
  const d = new Date(input);
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function createLead(partial) {
  const nowISO = new Date().toISOString();
  const createdISO = toISODate(partial.createdAt || nowISO);
  return {
    id: partial.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: partial.name || '',
    contact: partial.contact || '',
    location: partial.location || '',
    type: partial.type || '',
    note: partial.note || '',
    status: normalizeStatus(partial.status),
    createdAt: createdISO,
    updatedAt: nowISO,
    _v: 2,
  };
}

function migrateLead(raw) {
  if (!raw || typeof raw !== 'object') return createLead({});
  if (raw._v === 2) {
    return {
      ...raw,
      status: normalizeStatus(raw.status),
      createdAt: toISODate(raw.createdAt),
      updatedAt: toISODate(raw.updatedAt || raw.createdAt || Date.now()),
      _v: 2,
    };
  }
  return createLead({
    ...raw,
    status: normalizeStatus(raw.status),
    createdAt: toISODate(raw.createdAt),
  });
}

export default function useLocalStorageLeads(storageKey = 'mm_crm_leads_v2') {
  const [leads, setLeads] = useState([]);
  const [isPersisting, setIsPersisting] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setLeads(parsed.map(migrateLead));
      }
    } catch (e) {
      console.warn('[useLocalStorageLeads] load error', e);
    }
  }, [storageKey]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === storageKey && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) setLeads(parsed.map(migrateLead));
        } catch (e2) {
          console.warn('[useLocalStorageLeads] storage event error', e2);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [storageKey]);

  // ✅ Debounce ohne verbotene Hook-Aufrufe:
  const timerRef = useRef(null);
  const persist = useCallback((next) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsPersisting(true);
    timerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch (e) {
        console.warn('[useLocalStorageLeads] save error', e);
      } finally {
        setIsPersisting(false);
      }
    }, 150);
  }, [storageKey]);

  useEffect(() => {
    persist(leads);
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, [leads, persist]);

  function addLead(partial) {
    const lead = createLead(partial);
    setLeads((prev) => [...prev, lead]);
  }

  function updateLead(id, patch) {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === id
          ? {
              ...l,
              ...patch,
              status: 'status' in patch ? normalizeStatus(patch.status) : l.status,
              updatedAt: new Date().toISOString(),
            }
          : l
      )
    );
  }

  function deleteLead(id) {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  }

  function resetLeads() {
    setLeads([]);
  }

  return { leads, addLead, updateLead, deleteLead, resetLeads, isPersisting };
}
