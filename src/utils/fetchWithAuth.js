// 📄 src/utils/fetchWithAuth.js
// Zweck: Serverless-Endpoints (Vercel /api) mit Supabase Access-Token aufrufen.
// Damit kann der Server die Session prüfen, bevor er (z. B.) OpenAI nutzt.

import { supabase } from '../lib/supabaseClient';

export async function fetchWithAuth(url, options = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;

  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', 'application/json');

  return fetch(url, { ...options, headers });
}
