// 📄 src/utils/fetchWithAuth.js
// Zweck: Serverless-Endpoints (Vercel /api) mit Supabase Access-Token aufrufen.
// Damit kann der Server die Session prüfen, bevor er (z. B.) OpenAI nutzt.

import { supabase } from '../lib/supabaseClient';

/**
 * Fetch mit Auto-Authentication und Timeout
 * @param {string} url - API-Endpoint
 * @param {Object} options - Fetch-Options
 * @param {number} options.timeout - Timeout in ms (default: 30000)
 * @returns {Promise<Response>}
 * @throws {Error} Bei Timeout oder Netzwerkfehlern
 */
export async function fetchWithAuth(url, options = {}) {
  const { data } = await supabase.auth.getSession();
  const token = data?.session?.access_token;

  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  headers.set('Content-Type', 'application/json');

  // ✅ Timeout mit AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    options.timeout || 30000 // 30s default
  );

  try {
    return await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } catch (error) {
    // Bessere Error-Message bei Timeout
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - bitte erneut versuchen');
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
