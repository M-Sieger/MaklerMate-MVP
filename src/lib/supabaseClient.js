// 📄 src/lib/supabaseClient.js (CRA-Variante mit Checks)
import { createClient } from '@supabase/supabase-js';

const url = (process.env.REACT_APP_SUPABASE_URL || '').trim();
const key = (process.env.REACT_APP_SUPABASE_ANON_KEY || '').trim();

function isValidUrl(v) { try { new URL(v); return true; } catch { return false; } }

if (!isValidUrl(url) || !key) {
  console.error('[Supabase] ENV fehlen/ungültig. Setze im Projekt-Root (.env):\n' +
    'REACT_APP_SUPABASE_URL=https://<projekt>.supabase.co\n' +
    'REACT_APP_SUPABASE_ANON_KEY=<anon key>');
  throw new Error('Supabase env missing/invalid');
}

export const supabase = createClient(url, key);
