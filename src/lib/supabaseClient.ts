/**
 * @fileoverview Supabase Client Konfiguration
 *
 * ZWECK:
 * - Supabase Client initialisieren
 * - ENV-Validierung
 * - Zentrale Supabase-Instanz exportieren
 *
 * AUTOR: Liberius (MaklerMate MVP)
 * STATUS: 🟢 Production-Ready (TypeScript Migration)
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url = (process.env.REACT_APP_SUPABASE_URL || '').trim();
const key = (process.env.REACT_APP_SUPABASE_ANON_KEY || '').trim();

/**
 * Validates if string is a valid URL
 */
function isValidUrl(v: string): boolean {
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
}

// ENV-Validierung
if (!isValidUrl(url) || !key) {
  console.error(
    '[Supabase] ENV fehlen/ungültig. Setze im Projekt-Root (.env):\n' +
      'REACT_APP_SUPABASE_URL=https://<projekt>.supabase.co\n' +
      'REACT_APP_SUPABASE_ANON_KEY=<anon key>'
  );
  throw new Error('Supabase env missing/invalid');
}

/**
 * Supabase Client Instance
 *
 * VERWENDUNG:
 * ```typescript
 * import { supabase } from '@/lib/supabaseClient';
 *
 * const { data, error } = await supabase.from('table').select('*');
 * ```
 */
export const supabase: SupabaseClient = createClient(url, key);
